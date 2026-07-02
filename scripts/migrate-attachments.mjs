#!/usr/bin/env node
/**
 * 레거시 게시판 첨부파일을 R2로 이전합니다.
 *
 * 사용법:
 *   npm run attachments:migrate              # 로컬 R2
 *   npm run attachments:migrate -- --remote  # 원격 R2
 *   npm run attachments:migrate -- --limit 20
 *   npm run attachments:migrate -- --dry-run
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outputDir = join(__dirname, "output");
const cacheDir = join(outputDir, "attachment-cache");
const manifestPath = join(outputDir, "migrated-attachments.json");
const wranglerBin = join(root, "node_modules/.bin/wrangler");
const bucketName = "yogakorea-uploads";
const d1Dir = join(root, ".wrangler/state/v3/d1/miniflare-D1DatabaseObject");
const r2Flag = process.argv.includes("--remote") ? "--remote" : "--local";
const dryRun = process.argv.includes("--dry-run");
const limitIndex = process.argv.indexOf("--limit");
const limit =
  limitIndex >= 0 ? Number(process.argv[limitIndex + 1] ?? Infinity) : Infinity;
const concurrency = 8;

mkdirSync(cacheDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

function legacyR2KeyToUrl(r2Key) {
  if (!r2Key.startsWith("legacy/")) return null;
  return `https://yogakorea.or.kr/data/${r2Key.slice("legacy/".length)}`;
}

function findLegacyLocalFile(r2Key) {
  const dataPath = r2Key.slice("legacy/".length);
  for (const base of ["public_html/data", "public/site-assets/data"]) {
    const filePath = join(root, base, dataPath);
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

function guessContentType(fileName) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const map = {
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
  return map[ext] ?? "application/octet-stream";
}

function findLocalD1Database() {
  if (!existsSync(d1Dir)) return null;

  const databases = readdirSync(d1Dir)
    .filter((name) => name.endsWith(".sqlite") && name !== "metadata.sqlite")
    .map((name) => join(d1Dir, name));

  if (databases.length === 0) return null;

  return databases
    .map((path) => {
      try {
        const posts = Number(
          execFileSync("sqlite3", [path, "SELECT COUNT(*) FROM posts;"], {
            encoding: "utf8",
          }).trim(),
        );
        return { path, posts };
      } catch {
        return { path, posts: -1 };
      }
    })
    .filter((db) => db.posts > 0)
    .sort((a, b) => b.posts - a.posts)[0]?.path;
}

function loadManifest() {
  if (!existsSync(manifestPath)) return {};
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function saveManifest(manifest) {
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function r2ObjectExists(key) {
  try {
    execFileSync(
      wranglerBin,
      ["r2", "object", "get", `${bucketName}/${key}`, r2Flag, "--pipe"],
      { stdio: "pipe" },
    );
    return true;
  } catch {
    return false;
  }
}

function getCachePath(key) {
  return join(cacheDir, key.replace(/\//g, "__"));
}

async function downloadFile(url, cachePath) {
  const response = await fetch(url, {
    headers: { "User-Agent": "yogakorea-migration/1.0" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`다운로드 실패 (${response.status}): ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(cachePath, buffer);
  return buffer.length;
}

async function loadLegacyFile(r2Key, url, cachePath) {
  const localPath = findLegacyLocalFile(r2Key);
  if (localPath) {
    const buffer = readFileSync(localPath);
    writeFileSync(cachePath, buffer);
    return buffer.length;
  }

  return downloadFile(url, cachePath);
}

function uploadToR2(key, cachePath, contentType) {
  execFileSync(
    wranglerBin,
    [
      "r2",
      "object",
      "put",
      `${bucketName}/${key}`,
      "--file",
      cachePath,
      "--content-type",
      contentType,
      r2Flag,
    ],
    { stdio: "pipe" },
  );
}

async function mapWithConcurrency(items, worker) {
  const results = [];
  let index = 0;

  async function runWorker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker()),
  );

  return results;
}

const dbPath = findLocalD1Database();
if (!dbPath) {
  console.error("로컬 D1 데이터베이스를 찾을 수 없습니다. npm run db:import 를 먼저 실행하세요.");
  process.exit(1);
}

const rows = execFileSync(
  "sqlite3",
  [
    dbPath,
    "SELECT r2_key, file_name FROM attachments WHERE r2_key LIKE 'legacy/file/%' ORDER BY id;",
  ],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const separator = line.indexOf("|");
    return {
      r2Key: line.slice(0, separator),
      fileName: line.slice(separator + 1),
    };
  });

const targets = rows.slice(0, Number.isFinite(limit) ? limit : rows.length);
const manifest = loadManifest();

console.log(`대상 첨부파일: ${targets.length}/${rows.length} (${r2Flag})`);

let uploaded = 0;
let skipped = 0;
let failed = 0;

await mapWithConcurrency(targets, async ({ r2Key, fileName }) => {
  const url = legacyR2KeyToUrl(r2Key);
  if (!url) return;

  if (manifest[r2Key]?.key === r2Key && (dryRun || r2ObjectExists(r2Key))) {
    skipped++;
    return;
  }

  const cachePath = getCachePath(r2Key);
  const contentType = guessContentType(fileName || r2Key.split("/").pop());

  if (dryRun) {
    console.log(`[dry-run] ${url} -> ${r2Key}`);
    return;
  }

  try {
    const size = await loadLegacyFile(r2Key, url, cachePath);
    uploadToR2(r2Key, cachePath, contentType);
    manifest[r2Key] = { key: r2Key, size, migratedAt: new Date().toISOString() };
    uploaded++;
    if (uploaded % 25 === 0) {
      saveManifest(manifest);
      console.log(`진행: ${uploaded}건 업로드, ${skipped}건 스킵, ${failed}건 실패`);
    }
  } catch (error) {
    failed++;
    console.error(`실패: ${url}`);
    console.error(error instanceof Error ? error.message : error);
  }
});

saveManifest(manifest);

console.log("완료");
console.log(`업로드: ${uploaded}건`);
console.log(`스킵: ${skipped}건`);
console.log(`실패: ${failed}건`);
console.log(`매니페스트: ${manifestPath}`);
