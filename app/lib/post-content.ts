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
