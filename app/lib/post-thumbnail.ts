import type { Attachment, Post } from "~/lib/board.server";
import { isImageAttachment } from "~/lib/attachments";
import { getPublicUploadUrl } from "~/lib/files";
import {
  extractLegacyMediaUrls,
  legacyPathToR2Key,
  legacyUrlToR2Key,
  normalizeLegacyPostHtml,
  rewriteLegacyMediaUrls,
} from "~/lib/legacy-media";

function resolveContentImageUrl(content: string): string | null {
  const normalized = rewriteLegacyMediaUrls(normalizeLegacyPostHtml(content));
  const imgMatch = normalized.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) {
    return resolveImageSrc(imgMatch[1]);
  }

  const legacyUrls = extractLegacyMediaUrls(normalized);
  if (legacyUrls[0]) {
    return resolveImageSrc(legacyUrls[0]);
  }

  return null;
}

function resolveImageSrc(src: string): string | null {
  const trimmed = src.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/api/files/")) {
    return trimmed;
  }

  const legacyKey = legacyUrlToR2Key(trimmed);
  if (legacyKey) {
    return getPublicUploadUrl(legacyKey);
  }

  if (trimmed.startsWith("/data/")) {
    return getPublicUploadUrl(legacyPathToR2Key(trimmed));
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function resolvePostThumbnailUrl(
  post: Post,
  attachment?: Attachment | null,
): string | null {
  if (attachment && isImageAttachment(attachment)) {
    return getPublicUploadUrl(attachment.r2_key);
  }

  if (post.content) {
    return resolveContentImageUrl(post.content);
  }

  return null;
}

export async function getFirstImageAttachmentsByPostIds(
  db: Env["DB"],
  postIds: number[],
) {
  const map = new Map<number, Attachment>();
  if (postIds.length === 0) return map;

  const placeholders = postIds.map(() => "?").join(",");
  const result = await db
    .prepare(
      `SELECT * FROM attachments WHERE post_id IN (${placeholders}) ORDER BY post_id ASC, id ASC`,
    )
    .bind(...postIds)
    .all<Attachment>();

  for (const attachment of result.results ?? []) {
    if (!isImageAttachment(attachment) || map.has(attachment.post_id)) continue;
    map.set(attachment.post_id, attachment);
  }

  return map;
}

export async function buildPostThumbnailMap(db: Env["DB"], posts: Post[]) {
  const postIds = posts.map((post) => post.id);
  const attachments = await getFirstImageAttachmentsByPostIds(db, postIds);
  const thumbnails = new Map<number, string | null>();

  for (const post of posts) {
    thumbnails.set(
      post.id,
      resolvePostThumbnailUrl(post, attachments.get(post.id)),
    );
  }

  return thumbnails;
}
