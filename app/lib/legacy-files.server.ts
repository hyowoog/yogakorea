import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT_CANDIDATES = [process.cwd(), join(process.cwd(), "..")];

const LOCAL_DATA_DIRS = ["public_html/data", "public/site-assets/data"] as const;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  hwp: "application/x-hwp",
  hwpx: "application/hwp+zip",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
};

export function guessLegacyContentType(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

export function legacyR2KeyToDataPath(r2Key: string) {
  if (!r2Key.startsWith("legacy/")) return null;
  return r2Key.slice("legacy/".length);
}

export function getLegacyRemoteUrls(r2Key: string) {
  const dataPath = legacyR2KeyToDataPath(r2Key);
  if (!dataPath) return [];

  return [
    `https://yogakorea.or.kr/data/${dataPath}`,
    `https://www.yogakorea.or.kr/data/${dataPath}`,
    `https://yoga.erunweb.com/data/${dataPath}`,
  ];
}

export function findLegacyLocalFilePath(r2Key: string) {
  const dataPath = legacyR2KeyToDataPath(r2Key);
  if (!dataPath) return null;

  for (const root of ROOT_CANDIDATES) {
    for (const base of LOCAL_DATA_DIRS) {
      const filePath = join(root, base, dataPath);
      if (existsSync(filePath)) return filePath;
    }
  }

  return null;
}

export function readLegacyLocalFile(r2Key: string) {
  const filePath = findLegacyLocalFilePath(r2Key);
  if (!filePath) return null;

  const fileName = filePath.split("/").pop() ?? "";
  return {
    body: readFileSync(filePath),
    contentType: guessLegacyContentType(fileName),
  };
}

export async function fetchLegacyRemoteFile(r2Key: string) {
  for (const url of getLegacyRemoteUrls(r2Key)) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "yogakorea/1.0" },
      });

      if (!response.ok || !response.body) continue;

      const contentType =
        response.headers.get("content-type") ??
        guessLegacyContentType(url.split("/").pop() ?? "");

      if (contentType.startsWith("text/html")) continue;

      return { body: response.body, contentType };
    } catch {
      continue;
    }
  }

  return null;
}
