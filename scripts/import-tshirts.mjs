#!/usr/bin/env node
/**
 * dump.sql _tshirts → D1 tshirt_orders import SQL 생성
 */

import { createReadStream, createWriteStream, mkdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dumpPath = join(root, "dump.sql");
const outputDir = join(__dirname, "output");
const outputPath = join(outputDir, "tshirts.sql");

mkdirSync(outputDir, { recursive: true });

function sqlLiteral(token) {
  const trimmed = token.trim();
  if (trimmed === "NULL") return "NULL";
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed;
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    const inner = trimmed
      .slice(1, -1)
      .replace(/\\'/g, "'")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r");
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

function parseSqlString(token) {
  const trimmed = token.trim();
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/\\'/g, "'");
  }
  return trimmed;
}

function mapTshirtRow(rowSql) {
  const values = splitSqlValues(rowSql);
  if (values.length < 7) return null;

  const id = values[0];
  const name = sqlLiteral(parseSqlString(values[1]) || "미입력");
  const mobile = sqlLiteral(parseSqlString(values[2]) || "");
  const studioName = sqlLiteral(parseSqlString(values[3]) || "");
  const sizeCode = sqlLiteral(parseSqlString(values[4]) || "");
  const colorRaw = parseSqlString(values[5]) || "";
  const color = sqlLiteral(colorRaw === "코박트색" ? "코발트색" : colorRaw);
  const createdAt = sqlLiteral(parseSqlString(values[6]));

  return `INSERT OR REPLACE INTO tshirt_orders (id, name, mobile, studio_name, color, size_code, created_at) VALUES (${id}, ${name}, ${mobile}, ${studioName}, ${color}, ${sizeCode}, ${createdAt});`;
}

function processInsertStatement(statement) {
  const match = statement.match(/^INSERT INTO `_tshirts` VALUES\s*(.+);$/is);
  if (!match) return 0;

  let count = 0;
  const rows = splitRowTuples(match[1]);
  for (const row of rows) {
    const mapped = mapTshirtRow(row);
    if (mapped) {
      out.write(`${mapped}\n`);
      count++;
    }
  }
  return count;
}

const out = createWriteStream(outputPath);
out.write("-- Generated from dump.sql (_tshirts)\n");
out.write("DELETE FROM tshirt_orders;\n\n");

let tshirtCount = 0;
let inInsert = false;
let buffer = "";

const rl = createInterface({
  input: createReadStream(dumpPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  if (line.startsWith("INSERT INTO `_tshirts`")) {
    if (line.trim().endsWith(";")) {
      tshirtCount += processInsertStatement(line);
    } else {
      inInsert = true;
      buffer = line;
    }
    continue;
  }

  if (inInsert) {
    buffer += line;
    if (line.trim().endsWith(";")) {
      tshirtCount += processInsertStatement(buffer);
      inInsert = false;
      buffer = "";
    }
  }
}

out.end();

await new Promise((resolve, reject) => {
  out.on("finish", resolve);
  out.on("error", reject);
});

console.log(`변환 완료: ${outputPath}`);
console.log(`티셔츠 신청: ${tshirtCount}건`);
