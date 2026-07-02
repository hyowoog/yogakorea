import { getPublicUploadUrl } from "~/lib/files";

const LEGACY_MEDIA_PATH =
  /(\/data\/[^"'\\s>)]+?\.(?:jpe?g|png|gif|webp|bmp|svg))/gi;
const LEGACY_MEDIA_HOST =
  /(?:https?:)?\/\/(?:www\.)?(?:yogakorea\.or\.kr|yoga\.erunweb\.com)(\/data\/[^"'\\s>)]+?\.(?:jpe?g|png|gif|webp|bmp|svg))/gi;

export function legacyPathToR2Key(path: string): string {
  const normalized = path.replace(/^\/+/, "");
  if (normalized.startsWith("data/")) {
    return `legacy/${normalized.slice("data/".length)}`;
  }
  return `legacy/${normalized}`;
}

export function legacyR2KeyToDataUrl(r2Key: string): string | null {
  if (!r2Key.startsWith("legacy/")) return null;
  return `https://yogakorea.or.kr/data/${r2Key.slice("legacy/".length)}`;
}

export function legacyUrlToR2Key(url: string): string | null {
  const match = url.match(
    /(?:yogakorea\.or\.kr|yoga\.erunweb\.com)(\/data\/[^?\s"']+)/i,
  );
  return match ? legacyPathToR2Key(match[1]) : null;
}

export function legacyUrlToDownloadUrl(url: string): string {
  const key = legacyUrlToR2Key(url);
  if (!key) return url;
  return `https://yogakorea.or.kr/data/${key.slice("legacy/".length)}`;
}

export function rewriteLegacyMediaUrls(html: string): string {
  return html.replace(LEGACY_MEDIA_HOST, (_match, path: string) =>
    getPublicUploadUrl(legacyPathToR2Key(path)),
  );
}

export function normalizeLegacyPostHtml(html: string): string {
  return html
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(
      /http:\/\/(?:www\.)?yogakorea\.or\.kr\//gi,
      "https://yogakorea.or.kr/",
    )
    .replace(/http:\/\/yoga\.erunweb\.com\//gi, "https://yogakorea.or.kr/");
}

export function extractLegacyMediaUrls(html: string): string[] {
  const normalized = normalizeLegacyPostHtml(html);
  const urls = new Set<string>();

  for (const match of normalized.matchAll(LEGACY_MEDIA_HOST)) {
    urls.add(`https://yogakorea.or.kr${match[1]}`);
  }

  for (const match of normalized.matchAll(LEGACY_MEDIA_PATH)) {
    if (!match[1].startsWith("//")) {
      urls.add(`https://yogakorea.or.kr${match[1]}`);
    }
  }

  return [...urls];
}
