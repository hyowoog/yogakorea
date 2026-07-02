#!/usr/bin/env node
/**
 * dump.sql _event, _application, _app_etc → D1 events import SQL 생성
 */

import { createReadStream, createWriteStream, mkdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dumpPath = join(root, "dump.sql");
const outputDir = join(__dirname, "output");
const outputPath = join(outputDir, "events.sql");

mkdirSync(outputDir, { recursive: true });

const appEtcByAppId = new Map();
const eventLines = [];
const applicationLines = [];

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

function extraDataLiteral(appId) {
  const etc = appEtcByAppId.get(String(appId));
  if (!etc) return "NULL";
  return sqlLiteral(JSON.stringify(etc));
}

function mapEventRow(rowSql) {
  const values = splitSqlValues(rowSql);
  if (values.length < 4) return null;

  const id = values[0];
  const title = sqlLiteral(parseSqlString(values[1]));
  const startsOn = sqlLiteral(parseSqlString(values[2]));
  const endsOn = sqlLiteral(parseSqlString(values[3]));
  const createdAt = sqlLiteral(parseSqlString(values[2]) + " 00:00:00");

  return `INSERT OR REPLACE INTO events (id, title, starts_on, ends_on, created_at) VALUES (${id}, ${title}, ${startsOn}, ${endsOn}, ${createdAt});`;
}

function mapAppEtcRow(rowSql) {
  const values = splitSqlValues(rowSql);
  if (values.length < 4) return null;

  const appId = parseSqlString(values[0]);
  const sch1 = parseInt(parseSqlString(values[1]), 10) || 0;
  const sch2 = parseInt(parseSqlString(values[2]), 10) || 0;
  const birth = parseSqlString(values[3]);

  appEtcByAppId.set(appId, { sch1, sch2, birth });
  return null;
}

function mapApplicationRow(rowSql) {
  const values = splitSqlValues(rowSql);
  if (values.length < 14) return null;

  const id = values[0];
  const name = sqlLiteral(parseSqlString(values[1]));
  const genderRaw = parseSqlString(values[2]);
  const gender = sqlLiteral(genderRaw === "m" ? "m" : "f");
  const studioName = sqlLiteral(parseSqlString(values[3]));
  const regionCode = parseInt(parseSqlString(values[4]), 10) || 0;
  const mobile = sqlLiteral(parseSqlString(values[5]));
  const createdAt = sqlLiteral(parseSqlString(values[6]));
  const ipAddress = sqlLiteral(parseSqlString(values[7]));
  const eventId = values[8];
  const bankNameRaw = parseSqlString(values[9]);
  const bankNumRaw = parseSqlString(values[10]);
  const bankOwnerRaw = parseSqlString(values[11]);
  const bankName = bankNameRaw && bankNameRaw !== "0" ? sqlLiteral(bankNameRaw) : "NULL";
  const bankNum = bankNumRaw && bankNumRaw !== "0" ? sqlLiteral(bankNumRaw) : "NULL";
  const bankOwner = bankOwnerRaw && bankOwnerRaw !== "0" ? sqlLiteral(bankOwnerRaw) : "NULL";
  const memberRole = sqlLiteral(parseSqlString(values[12]));
  const tshirtRaw = parseSqlString(values[13]);
  const tshirtSize = tshirtRaw ? sqlLiteral(tshirtRaw) : "NULL";
  const extraData = extraDataLiteral(parseSqlString(values[0]));

  return `INSERT OR REPLACE INTO event_applications (id, event_id, name, gender, studio_name, region_code, mobile, member_role, bank_name, bank_num, bank_owner, tshirt_size, extra_data, ip_address, created_at) VALUES (${id}, ${eventId}, ${name}, ${gender}, ${studioName}, ${regionCode}, ${mobile}, ${memberRole}, ${bankName}, ${bankNum}, ${bankOwner}, ${tshirtSize}, ${extraData}, ${ipAddress}, ${createdAt});`;
}

function processInsertStatement(statement, tableName, mapper) {
  const match = statement.match(
    new RegExp(`^INSERT INTO \`${tableName}\` VALUES\\s*(.+);$`, "is"),
  );
  if (!match) return 0;

  let count = 0;
  const rows = splitRowTuples(match[1]);
  for (const row of rows) {
    const mapped = mapper(row);
    if (mapped) {
      if (tableName === "_event") eventLines.push(mapped);
      else if (tableName === "_application") applicationLines.push(mapped);
      count++;
    }
  }
  return count;
}

const out = createWriteStream(outputPath);
out.write("-- Generated from dump.sql (_event, _application, _app_etc)\n");
out.write("DELETE FROM event_applications;\n");
out.write("DELETE FROM events;\n\n");

let eventCount = 0;
let applicationCount = 0;
let inInsert = false;
let insertTable = "";
let buffer = "";

const rl = createInterface({
  input: createReadStream(dumpPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

function handleInsertLine(line) {
  if (line.startsWith("INSERT INTO `_event`")) {
    if (line.trim().endsWith(";")) {
      eventCount += processInsertStatement(line, "_event", mapEventRow);
    } else {
      inInsert = true;
      insertTable = "_event";
      buffer = line;
    }
    return true;
  }

  if (line.startsWith("INSERT INTO `_app_etc`")) {
    if (line.trim().endsWith(";")) {
      processInsertStatement(line, "_app_etc", mapAppEtcRow);
    } else {
      inInsert = true;
      insertTable = "_app_etc";
      buffer = line;
    }
    return true;
  }

  if (line.startsWith("INSERT INTO `_application`")) {
    if (line.trim().endsWith(";")) {
      applicationCount += processInsertStatement(line, "_application", mapApplicationRow);
    } else {
      inInsert = true;
      insertTable = "_application";
      buffer = line;
    }
    return true;
  }

  return false;
}

for await (const line of rl) {
  if (handleInsertLine(line)) continue;

  if (inInsert) {
    buffer += line;
    if (line.trim().endsWith(";")) {
      if (insertTable === "_event") {
        eventCount += processInsertStatement(buffer, "_event", mapEventRow);
      } else if (insertTable === "_app_etc") {
        processInsertStatement(buffer, "_app_etc", mapAppEtcRow);
      } else if (insertTable === "_application") {
        applicationCount += processInsertStatement(buffer, "_application", mapApplicationRow);
      }
      inInsert = false;
      insertTable = "";
      buffer = "";
    }
  }
}

for (const line of eventLines) {
  out.write(`${line}\n`);
}
out.write("\n");

const eventIdSet = new Set();
for (const line of eventLines) {
  const match = line.match(/VALUES \((\d+),/);
  if (match) eventIdSet.add(parseInt(match[1], 10));
}

let skippedApplications = 0;
for (const line of applicationLines) {
  const match = line.match(/VALUES \(\d+, (\d+),/);
  const eventId = match ? parseInt(match[1], 10) : 0;
  if (!eventIdSet.has(eventId)) {
    skippedApplications++;
    continue;
  }
  out.write(`${line}\n`);
}

if (skippedApplications) {
  console.log(`존재하지 않는 행사 참조 신청 ${skippedApplications}건 제외`);
}

out.end();

await new Promise((resolve, reject) => {
  out.on("finish", resolve);
  out.on("error", reject);
});

console.log(`변환 완료: ${outputPath}`);
console.log(`행사: ${eventCount}건, 신청: ${applicationCount}건, 추가필드: ${appEtcByAppId.size}건`);
