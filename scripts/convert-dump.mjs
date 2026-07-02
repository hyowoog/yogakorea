#!/usr/bin/env node
/**
 * MySQL dump.sql → D1 SQLite 변환 스크립트
 * public_html (그누보드/Eyoom) g5_write_* 테이블 변환
 */

import { createReadStream, createWriteStream, mkdirSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dumpPath = join(root, "dump.sql");
const outputDir = join(__dirname, "output");
const outputPath = join(outputDir, "import.sql");

const GNU_PREFIX = "g5_write_";
const BO_NOTICE_INDEX = 65;

mkdirSync(outputDir, { recursive: true });

function parseSqlString(token) {
  const trimmed = token.trim();
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadBoardNoticeIds() {
  const content = readFileSync(dumpPath, "utf8");
  const line = content
    .split("\n")
    .find((row) => row.startsWith("INSERT INTO `g5_board` VALUES"));
  if (!line) return new Map();

  const match = line.match(/^INSERT INTO `g5_board` VALUES\s*(.+);$/is);
  if (!match) return new Map();

  const noticesByBoard = new Map();
  for (const row of splitRowTuples(match[1])) {
    const values = splitSqlValues(row);
    if (values.length <= BO_NOTICE_INDEX) continue;

    const boardId = parseSqlString(values[0]);
    const noticeRaw = parseSqlString(values[BO_NOTICE_INDEX]);
    if (!noticeRaw) continue;

    const ids = noticeRaw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (ids.length > 0) {
      noticesByBoard.set(boardId, new Set(ids));
    }
  }

  return noticesByBoard;
}

const boardNoticeIds = loadBoardNoticeIds();

const out = createWriteStream(outputPath);
out.write("-- Generated from dump.sql (gnuboard main)\n");
out.write("PRAGMA foreign_keys=OFF;\n\n");
out.write("DELETE FROM attachments;\n");
out.write("DELETE FROM comments;\n");
out.write("DELETE FROM posts;\n\n");

let gnuCount = 0;
let skipped = 0;
let attachmentCount = 0;
const attachmentSql = [];
const linkUpdateSql = [];

function getBoardId(table) {
  if (!table.startsWith(GNU_PREFIX)) return null;
  return table.slice(GNU_PREFIX.length);
}

/** MySQL 문자열 리터럴을 SQLite용으로 변환 */
function sqlLiteral(token) {
  const trimmed = token.trim();
  if (trimmed === "NULL") return "NULL";
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed;
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    const inner = trimmed.slice(1, -1).replace(/\\'/g, "'").replace(/\\n/g, "\n").replace(/\\r/g, "\r");
    return `'${inner.replace(/'/g, "''")}'`;
  }
  return `'${trimmed.replace(/'/g, "''")}'`;
}

function splitSqlValues(valuesSql) {
  const values = [];
  let current = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < valuesSql.length; i++) {
    const char = valuesSql[i];
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }
    if (char === "'") {
      inString = !inString;
      current += char;
      continue;
    }
    if (char === "," && !inString) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) values.push(current.trim());
  return values;
}

/** VALUES (...),(...),(...) 를 개별 row SQL로 분리 */
function splitRowTuples(valuesPart) {
  const rows = [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  let start = -1;

  for (let i = 0; i < valuesPart.length; i++) {
    const char = valuesPart[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "'") {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (char === "(") {
      if (depth === 0) start = i + 1;
      depth++;
      continue;
    }
    if (char === ")") {
      depth--;
      if (depth === 0 && start >= 0) {
        rows.push(valuesPart.slice(start, i));
        start = -1;
      }
    }
  }

  return rows;
}

function mapGnuRow(table, rowSql) {
  const boardId = getBoardId(table);
  if (!boardId) return null;

  const values = splitSqlValues(rowSql);
  if (values.length < 25) return null;

  if (values[4] !== "0") return null;

  const legacyId = values[0];
  const sortOrder = values[1];
  const parentRaw = values[3];
  const parentId = parentRaw === "0" ? "NULL" : parentRaw;
  const title = sqlLiteral(values[9]);
  const content = sqlLiteral(values[10]);
  const link1 = sqlLiteral(parseSqlString(values[11]));
  const link2 = sqlLiteral(parseSqlString(values[12]));
  const hit = values[15];
  const authorName = sqlLiteral(values[20]);
  const createdAt = sqlLiteral(values[23]);
  const noticeIds = boardNoticeIds.get(boardId);
  const isNotice = noticeIds?.has(String(legacyId)) ? 1 : 0;

  linkUpdateSql.push(
    `UPDATE posts SET link1 = ${link1}, link2 = ${link2} WHERE board_id = ${sqlLiteral(boardId)} AND legacy_id = ${legacyId};`,
  );

  return `INSERT INTO posts (board_id, legacy_id, legacy_table, parent_id, title, content, link1, link2, author_name, view_count, sort_order, created_at, is_notice) VALUES (${sqlLiteral(boardId)}, ${legacyId}, ${sqlLiteral(table)}, ${parentId}, ${title}, ${content}, ${link1}, ${link2}, ${authorName}, ${hit}, ${sortOrder}, ${createdAt}, ${isNotice});`;
}

function guessMimeType(fileName) {
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

function mapBoardFileRow(rowSql) {
  const values = splitSqlValues(rowSql);
  if (values.length < 12) return null;

  const boardId = parseSqlString(values[0]);
  const wrId = values[1];
  const fileName = parseSqlString(values[3]);
  const storedFile = parseSqlString(values[4]);
  const downloadCount = values[5];
  const fileSize = values[7];
  const createdAt = sqlLiteral(values[11]);

  if (!storedFile) return null;

  const displayName = fileName || storedFile;
  const r2Key = `legacy/file/${boardId}/${storedFile}`;
  const mimeType = guessMimeType(storedFile);

  return `INSERT INTO attachments (post_id, file_name, file_size, r2_key, mime_type, download_count, created_at) SELECT p.id, ${sqlLiteral(displayName)}, ${fileSize}, ${sqlLiteral(r2Key)}, ${sqlLiteral(mimeType)}, ${downloadCount}, ${createdAt} FROM posts p WHERE p.board_id = ${sqlLiteral(boardId)} AND p.legacy_id = ${wrId} LIMIT 1;`;
}

function processInsertStatement(statement) {
  const match = statement.match(/^INSERT INTO `([^`]+)` VALUES\s*(.+);$/is);
  if (!match) return;

  const table = match[1];

  if (table === "g5_board_file") {
    const rows = splitRowTuples(match[2]);
    for (const row of rows) {
      const mapped = mapBoardFileRow(row);
      if (mapped) {
        attachmentSql.push(mapped);
        attachmentCount++;
      }
    }
    return;
  }

  if (!getBoardId(table)) return;

  const rows = splitRowTuples(match[2]);
  for (const row of rows) {
    const mapped = mapGnuRow(table, row);
    if (mapped) {
      out.write(`${mapped}\n`);
      gnuCount++;
    } else {
      skipped++;
    }
  }
}

let inInsert = false;
let buffer = "";

const rl = createInterface({
  input: createReadStream(dumpPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  if (line.startsWith("INSERT INTO `")) {
    if (line.trim().endsWith(";")) {
      processInsertStatement(line);
    } else {
      inInsert = true;
      buffer = line;
    }
    continue;
  }

  if (inInsert) {
    buffer += line;
    if (line.trim().endsWith(";")) {
      processInsertStatement(buffer);
      inInsert = false;
      buffer = "";
    }
  }
}

if (linkUpdateSql.length > 0) {
  out.write("\n-- 관련링크 (wr_link1, wr_link2)\n");
  for (const sql of linkUpdateSql) {
    out.write(`${sql}\n`);
  }
}

if (attachmentSql.length > 0) {
  out.write("\n-- 첨부파일 (g5_board_file)\n");
  for (const sql of attachmentSql) {
    out.write(`${sql}\n`);
  }
}

out.write("\nPRAGMA foreign_keys=ON;\n");
out.end();

await new Promise((resolve, reject) => {
  out.on("finish", resolve);
  out.on("error", reject);
});

console.log(`변환 완료: ${outputPath}`);
console.log(`그누보드 게시글: ${gnuCount}건 (스킵: ${skipped}건)`);
console.log(`첨부파일: ${attachmentCount}건`);
