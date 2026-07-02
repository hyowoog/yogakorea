#!/usr/bin/env node
/**
 * dump.sql g5_member → D1 members import SQL 생성
 */

import { createReadStream, createWriteStream, mkdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dumpPath = join(root, "dump.sql");
const outputDir = join(__dirname, "output");
const outputPath = join(outputDir, "members.sql");

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

function mapMemberRow(rowSql) {
  const values = splitSqlValues(rowSql);
  if (values.length < 32) return null;

  const id = values[0];
  const loginId = parseSqlString(values[1]);
  const passwordHash = parseSqlString(values[2]);
  const name = sqlLiteral(parseSqlString(values[3]) || loginId);
  const email = sqlLiteral(parseSqlString(values[6]));
  const level = values[8];
  const interceptDate = sqlLiteral(parseSqlString(values[30]));
  const leaveDate = sqlLiteral(parseSqlString(values[29]));
  const emailCertify = parseSqlString(values[31]);
  const createdAt = sqlLiteral(parseSqlString(values[27]));
  const emailCertified =
    emailCertify && emailCertify !== "0000-00-00 00:00:00" ? 1 : 0;

  if (!loginId || !passwordHash) return null;

  return `INSERT OR REPLACE INTO members (id, login_id, password_hash, name, email, level, intercept_date, leave_date, email_certified, created_at) VALUES (${id}, ${sqlLiteral(loginId)}, ${sqlLiteral(passwordHash)}, ${name}, ${email}, ${level}, ${interceptDate}, ${leaveDate}, ${emailCertified}, ${createdAt});`;
}

function processInsertStatement(statement) {
  const match = statement.match(/^INSERT INTO `g5_member` VALUES\s*(.+);$/is);
  if (!match) return 0;

  let count = 0;
  const rows = splitRowTuples(match[1]);
  for (const row of rows) {
    const mapped = mapMemberRow(row);
    if (mapped) {
      out.write(`${mapped}\n`);
      count++;
    }
  }
  return count;
}

const out = createWriteStream(outputPath);
out.write("-- Generated from dump.sql (g5_member)\n");
out.write("DELETE FROM sessions;\n");
out.write("DELETE FROM members;\n\n");

let memberCount = 0;
let inInsert = false;
let buffer = "";

const rl = createInterface({
  input: createReadStream(dumpPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  if (line.startsWith("INSERT INTO `g5_member`")) {
    if (line.trim().endsWith(";")) {
      memberCount += processInsertStatement(line);
    } else {
      inInsert = true;
      buffer = line;
    }
    continue;
  }

  if (inInsert) {
    buffer += line;
    if (line.trim().endsWith(";")) {
      memberCount += processInsertStatement(buffer);
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
console.log(`회원: ${memberCount}건`);
