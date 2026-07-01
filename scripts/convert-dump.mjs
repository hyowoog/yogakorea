#!/usr/bin/env node
/**
 * MySQL dump.sql → D1 SQLite 변환 스크립트
 * public_html (그누보드/Eyoom) g5_write_* 테이블 변환
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

const GNU_PREFIX = "g5_write_";

mkdirSync(outputDir, { recursive: true });

const out = createWriteStream(outputPath);
out.write("-- Generated from dump.sql (gnuboard main)\n");
out.write("PRAGMA foreign_keys=OFF;\n\n");

let gnuCount = 0;
let skipped = 0;

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
  const hit = values[16];
  const authorName = sqlLiteral(values[20]);
  const createdAt = sqlLiteral(values[24]);

  return `INSERT INTO posts (board_id, legacy_id, legacy_table, parent_id, title, content, author_name, view_count, sort_order, created_at) VALUES (${sqlLiteral(boardId)}, ${legacyId}, ${sqlLiteral(table)}, ${parentId}, ${title}, ${content}, ${authorName}, ${hit}, ${sortOrder}, ${createdAt});`;
}

function processInsertStatement(statement) {
  const match = statement.match(/^INSERT INTO `([^`]+)` VALUES\s*(.+);$/is);
  if (!match) return;

  const table = match[1];
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

out.write("\nPRAGMA foreign_keys=ON;\n");
out.end();

await new Promise((resolve, reject) => {
  out.on("finish", resolve);
  out.on("error", reject);
});

console.log(`변환 완료: ${outputPath}`);
console.log(`그누보드 게시글: ${gnuCount}건 (스킵: ${skipped}건)`);
