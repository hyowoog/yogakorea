#!/usr/bin/env node
/**
 * 원본 사이트(yogakorea.or.kr)의 공지사항·포토앨범 최신 글을
 * D1용 INSERT SQL로 변환합니다.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "output");
mkdirSync(outputDir, { recursive: true });

const UA = { "User-Agent": "yogakorea-sync/1.0" };

function sqlLiteral(value) {
  if (value == null) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractDiv(html, openTag) {
  const start = html.indexOf(openTag);
  if (start < 0) return null;
  const innerStart = start + openTag.length;
  let depth = 1;
  for (let i = innerStart; i < html.length; i++) {
    if (html.startsWith("<div", i)) depth++;
    else if (html.startsWith("</div>", i)) {
      depth--;
      if (depth === 0) return html.slice(innerStart, i).trim();
    }
  }
  return null;
}

function parseDate(raw) {
  if (!raw) return null;
  const m = raw.trim().match(/^(\d{4})[.](\d{2})[.](\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return raw.replace(/\./g, "-");
  return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6] ?? "00"}`;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: UA });
  return { status: res.status, url: res.url, text: await res.text() };
}

async function imageExists(url) {
  try {
    const res = await fetch(url, { method: "GET", headers: UA });
    const type = res.headers.get("content-type") || "";
    return res.ok && type.startsWith("image/");
  } catch {
    return false;
  }
}

function parseNoticeView(html, wrId) {
  if (html.includes("다음 항목에 오류가 있습니다")) return null;
  const viewStart = html.indexOf('class="board-view"');
  if (viewStart < 0) return null;
  const viewHtml = html.slice(viewStart, viewStart + 80000);

  const titleM = viewHtml.match(/<h4>\s*<strong>([\s\S]*?)<\/strong>\s*<\/h4>/);
  const title = titleM ? decodeHtml(titleM[1].replace(/<[^>]+>/g, "")).trim() : "";
  if (!title) return null;

  const dateM = viewHtml.match(/fa-clock-o color-grey"><\/i>\s*([0-9.]+ [0-9:]+)/);
  const hitM = viewHtml.match(/fa-eye color-grey"><\/i>\s*(\d+)/);
  const authorM = viewHtml.match(/class="sv_member"[^>]*>\s*<b>\s*([^<]+)<\/b>/);
  const content =
    extractDiv(viewHtml, '<div class="board-view-con view-content">') ?? "";

  return {
    boardId: "notice",
    wrId,
    title,
    author: authorM ? authorM[1].trim() : "연합회",
    createdAt: parseDate(dateM?.[1]),
    viewCount: Number(hitM?.[1] ?? 0),
    content,
  };
}

async function scrapeNotice(existingMaxLegacy) {
  const posts = [];
  for (let wrId = existingMaxLegacy + 1; wrId <= existingMaxLegacy + 20; wrId++) {
    const { text } = await fetchText(
      `https://www.yogakorea.or.kr/bbs/board.php?bo_table=notice&wr_id=${wrId}`,
    );
    const post = parseNoticeView(text, wrId);
    if (!post) {
      console.log(`notice wr_id=${wrId} 없음/파싱 실패`);
      continue;
    }
    console.log(`notice wr_id=${wrId} ${post.createdAt} ${post.title}`);
    posts.push(post);
  }
  return posts;
}

async function discoverGalleryImages(hashPrefix) {
  const urls = [];
  const base = `https://yogakorea.or.kr/data/editor/2609/${hashPrefix}`;
  for (let n = 1; n <= 80; n++) {
    const url = `${base}_${n}.jpg`;
    if (await imageExists(url)) urls.push(url);
  }
  return urls;
}

async function scrapeGallery() {
  const wrId = 1317;
  const { text } = await fetchText(
    `https://www.yogakorea.or.kr/bbs/board.php?bo_table=gallery&wr_id=${wrId}`,
  );
  const ogt = text.match(/og:title" content="([^"]+)"/)?.[1] ?? "";
  const title = decodeHtml(ogt).replace(/\s*>\s*포토앨범.*$/, "").trim();
  const ogi = text.match(/og:image" content="([^"]+)"/)?.[1];
  if (!title) return [];

  const file = ogi?.split("/").pop() ?? "";
  const m = file.match(/^(?:thumb-)?(.+)_(\d+)_\d+(?:_\d+x\d+)?\.(jpe?g|png)$/i);
  let images = [];
  if (m) {
    const hash = `${m[1]}_${m[2]}`;
    images = await discoverGalleryImages(hash);
  }
  if (images.length === 0 && ogi) {
    const original = ogi
      .replace("http://", "https://")
      .replace(/thumb-/, "")
      .replace(/_\d+x\d+\.(jpe?g|png)$/i, ".$1");
    images = [original];
  }

  const imgHtml = images
    .map((url) => {
      const name = url.split("/").pop();
      return `<div style="text-align: center;" align="center"><img src="${url}" title="${name}"></div>`;
    })
    .join("");

  console.log(`gallery wr_id=${wrId} 이미지 ${images.length}장 ${title}`);
  return [
    {
      boardId: "gallery",
      wrId,
      title,
      author: "연합회",
      createdAt: "2026-09-18 00:00:00",
      viewCount: 0,
      content: imgHtml || `<p>${title}</p>`,
    },
  ];
}

function toInsert(post, sortOrder) {
  return `INSERT INTO posts (board_id, legacy_id, legacy_table, parent_id, title, content, author_name, view_count, sort_order, created_at, is_notice)
SELECT ${sqlLiteral(post.boardId)}, ${post.wrId}, ${sqlLiteral(`g5_write_${post.boardId}`)}, ${post.wrId}, ${sqlLiteral(post.title)}, ${sqlLiteral(post.content)}, ${sqlLiteral(post.author)}, ${post.viewCount}, ${sortOrder}, ${sqlLiteral(post.createdAt)}, 0
WHERE NOT EXISTS (
  SELECT 1 FROM posts WHERE board_id = ${sqlLiteral(post.boardId)} AND legacy_id = ${post.wrId}
);`;
}

const noticePosts = await scrapeNotice(373);
const galleryPosts = await scrapeGallery();

const sql = ["-- 원본 사이트 최신 공지/포토앨범 동기화", "PRAGMA foreign_keys=OFF;", ""];
noticePosts.forEach((post, i) => {
  sql.push(toInsert(post, -337 - i));
  sql.push("");
});
galleryPosts.forEach((post, i) => {
  sql.push(toInsert(post, -71 - i));
  sql.push("");
});
sql.push("PRAGMA foreign_keys=ON;");

const sqlPath = join(outputDir, "sync-latest-boards.sql");
writeFileSync(sqlPath, sql.join("\n"));
writeFileSync(
  join(outputDir, "sync-latest-boards.json"),
  JSON.stringify({ noticePosts, galleryPosts }, null, 2),
);
console.log(`SQL 작성: ${sqlPath}`);
console.log(`공지 ${noticePosts.length}건, 포토앨범 ${galleryPosts.length}건`);
