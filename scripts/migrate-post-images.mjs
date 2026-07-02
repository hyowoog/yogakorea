#!/usr/bin/env node
/**
 * 게시글 본문 이미지를 레거시 사이트에서 R2로 이전합니다.
 *
 * 사용법:
 *   npm run media:migrate              # 로컬 R2
 *   npm run media:migrate -- --remote  # 원격 R2
 *   npm run media:migrate -- --limit 20
 *   npm run media:migrate -- --dry-run
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outputDir = join(__dirname, "output");
const cacheDir = join(outputDir, "image-cache");
const manifestPath = join(outputDir, "migrated-images.json");
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

function legacyPathToR2Key(path) {
  const normalized = path.replace(/^\/+/, "");
  if (normalized.startsWith("data/")) {
    return `legacy/${normalized.slice("data/".length)}`;
  }
  return `legacy/${normalized}`;
}

function legacyUrlToR2Key(url) {
  const match = url.match(
    /(?:yogakorea\.or\.kr|yoga\.erunweb\.com)(\/data\/[^?\s"']+)/i,
  );
  return match ? legacyPathToR2Key(match[1]) : null;
}

function normalizeLegacyPostHtml(html) {
  return html
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/http:\/\/(?:www\.)?yogakorea\.or\.kr\//gi, "https://yogakorea.or.kr/")
    .replace(/http:\/\/yoga\.erunweb\.com\//gi, "https://yogakorea.or.kr/");
}

function extractLegacyMediaUrls(html) {
  const normalized = normalizeLegacyPostHtml(html);
  const urls = new Set();
  const pattern =
    /(?:https?:)?\/\/(?:www\.)?(?:yogakorea\.or\.kr|yoga\.erunweb\.com)(\/data\/[^"'\\s>)]+?\.(?:jpe?g|png|gif|webp|bmp|svg))/gi;

  for (const match of normalized.matchAll(pattern)) {
    urls.add(`https://yogakorea.or.kr${match[1]}`);
  }

  return [...urls];
}

function getCachePath(key) {
  return join(cacheDir, key.replace(/\//g, "__"));
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

async function downloadImage(url, cachePath) {
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
  [dbPath, "SELECT content FROM posts WHERE content LIKE '%data/%';"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter(Boolean);

const allUrls = new Set();
for (const row of rows) {
  for (const url of extractLegacyMediaUrls(row)) {
    allUrls.add(url);
  }
}

const targets = [...allUrls].slice(0, Number.isFinite(limit) ? limit : allUrls.size);
const manifest = loadManifest();

console.log(`대상 이미지: ${targets.length}/${allUrls.size} (${r2Flag})`);

let uploaded = 0;
let skipped = 0;
let failed = 0;

await mapWithConcurrency(targets, async (url) => {
  const key = legacyUrlToR2Key(url);
  if (!key) return;

  if (manifest[url]?.key === key && (dryRun || r2ObjectExists(key))) {
    skipped++;
    return;
  }

  const cachePath = getCachePath(key);
  const contentType = guessContentType(key.split("/").pop());

  if (dryRun) {
    console.log(`[dry-run] ${url} -> ${key}`);
    return;
  }

  try {
    const size = await downloadImage(url, cachePath);
    uploadToR2(key, cachePath, contentType);
    manifest[url] = { key, size, migratedAt: new Date().toISOString() };
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
