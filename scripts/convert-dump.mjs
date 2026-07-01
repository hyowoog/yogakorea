#!/usr/bin/env node
/**
 * MySQL dump.sql → D1 SQLite 변환 스크립트
 *
 * 사용법:
 *   node scripts/convert-dump.mjs
 *   npx wrangler d1 execute yogakorea --local --file=./scripts/output/import.sql
 */

import { createReadStream, createWriteStream, mkdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dumpPath = join(root, "dump.sql");
const outputDir = join(__dirname, "output");
const outputPath = join(outputDir, "import.sql");

const RENEW_TABLES = ["notice", "news", "job", "bbs", "photo", "qna", "free"];
const GNU_TABLE_MAP = {
  g5_write_notice: "g5_notice",
  g5_write_webzine: "g5_webzine",
  g5_write_gallery: "g5_gallery",
  g5_write_fieldnews: "g5_fieldnews",
  g5_write_qna: "g5_qna",
};

mkdirSync(outputDir, { recursive: true });

const out = createWriteStream(outputPath);
out.write("-- Generated from dump.sql\n");
out.write("PRAGMA foreign_keys=OFF;\n\n");

let currentTable = null;
let inInsert = false;
let buffer = "";
let renewCount = 0;
let gnuCount = 0;

function escapeSql(value) {
  if (value === null || value === "NULL") return "NULL";
  const unquoted = value.replace(/^'/, "").replace(/'$/, "");
  return `'${unquoted.replace(/'/g, "''")}'`;
}

function mapRenewInsert(table, valuesSql) {
  const values = splitSqlValues(valuesSql);
  if (values.length < 12) return null;

  const legacyId = values[0];
  const authorName = values[2];
  const title = values[3];
  const content = values[5];
  const hit = values[6];
  const createdAt = values[7];
  const sortOrder = values[12] ?? values[0];

  return `INSERT INTO posts (board_id, legacy_id, legacy_table, title, content, author_name, view_count, sort_order, created_at) VALUES (${escapeSql(table)}, ${legacyId}, ${escapeSql(table)}, ${title}, ${content}, ${authorName}, ${hit}, ${sortOrder}, ${createdAt});`;
}

function mapGnuInsert(table, valuesSql) {
  const boardId = GNU_TABLE_MAP[table];
  if (!boardId) return null;

  const values = splitSqlValues(valuesSql);
  if (values.length < 10) return null;

  const legacyId = values[0];
  const title = values[6] ?? values[5];
  const content = values[9] ?? values[8];
  const authorName = values[4] ?? values[3];
  const hit = values[12] ?? "0";
  const createdAt = values[2] ?? `'${new Date().toISOString().slice(0, 19).replace("T", " ")}'`;

  return `INSERT INTO posts (board_id, legacy_id, legacy_table, title, content, author_name, view_count, sort_order, created_at) VALUES (${escapeSql(boardId)}, ${legacyId}, ${escapeSql(table)}, ${title}, ${content}, ${authorName}, ${hit}, ${legacyId}, ${createdAt});`;
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

const rl = createInterface({
  input: createReadStream(dumpPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  const createMatch = line.match(/^CREATE TABLE `([^`]+)`/);
  if (createMatch) {
    currentTable = createMatch[1];
    continue;
  }

  if (line.startsWith("INSERT INTO `")) {
    const insertMatch = line.match(/^INSERT INTO `([^`]+)` VALUES (.+);$/);
    if (!insertMatch) {
      inInsert = true;
      buffer = line;
      continue;
    }

    const table = insertMatch[1];
    const valuesSql = insertMatch[2];

    if (RENEW_TABLES.includes(table)) {
      const mapped = mapRenewInsert(table, valuesSql);
      if (mapped) {
        out.write(`${mapped}\n`);
        renewCount++;
      }
    } else if (GNU_TABLE_MAP[table]) {
      const mapped = mapGnuInsert(table, valuesSql);
      if (mapped) {
        out.write(`${mapped}\n`);
        gnuCount++;
      }
    }
    continue;
  }

  if (inInsert) {
    buffer += line;
    if (line.trim().endsWith(";")) {
      const insertMatch = buffer.match(/^INSERT INTO `([^`]+)` VALUES (.+);$/s);
      if (insertMatch) {
        const table = insertMatch[1];
        const valuesSql = insertMatch[2];
        if (RENEW_TABLES.includes(table)) {
          const mapped = mapRenewInsert(table, valuesSql);
          if (mapped) {
            out.write(`${mapped}\n`);
            renewCount++;
          }
        } else if (GNU_TABLE_MAP[table]) {
          const mapped = mapGnuInsert(table, valuesSql);
          if (mapped) {
            out.write(`${mapped}\n`);
            gnuCount++;
          }
        }
      }
      inInsert = false;
      buffer = "";
    }
  }
}

out.write("\nPRAGMA foreign_keys=ON;\n");
out.end();

console.log(`변환 완료: ${outputPath}`);
console.log(`리뉴얼 게시글: ${renewCount}건, 그누보드 게시글: ${gnuCount}건`);
