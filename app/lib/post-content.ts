import {
  normalizeLegacyPostHtml,
  rewriteLegacyMediaUrls,
} from "~/lib/legacy-media";

/** 게시글 본문 HTML/텍스트 표시용 */
export function formatPostContent(content: string | null): string {
  if (!content?.trim()) return "";

  const trimmed = rewriteLegacyMediaUrls(normalizeLegacyPostHtml(content.trim()));
  const hasBlockHtml = /<(p|div|table|ul|ol|h[1-6]|br|img)\b/i.test(trimmed);

  if (hasBlockHtml) return trimmed;

  return trimmed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\r\n/g, "\n")
    .replace(/\n/g, "<br>");
}

export function getPostPlainTextExcerpt(content: string | null, maxLength = 120) {
  if (!content?.trim()) return "";

  const text = rewriteLegacyMediaUrls(normalizeLegacyPostHtml(content))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
