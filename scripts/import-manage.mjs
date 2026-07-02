#!/usr/bin/env node
/**
 * dump.sql yoga_member, yoga_payment, yoga_branch, yoga_mem_grade, _edu, mainpic
 * → D1 manage tables import SQL 생성
 */

import { createReadStream, createWriteStream, mkdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dumpPath = join(root, "dump.sql");
const outputDir = join(__dirname, "output");
const outputPath = join(outputDir, "manage.sql");

mkdirSync(outputDir, { recursive: true });

const counts = {
  members: 0,
  payments: 0,
  branches: 0,
  grades: 0,
  educations: 0,
  slides: 0,
};

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

function lit(values, index) {
  if (index >= values.length) return "NULL";
  return sqlLiteral(parseSqlString(values[index]));
}

function mapYogaMemberRow(rowSql) {
  const v = splitSqlValues(rowSql);
  if (v.length < 27) return null;

  return `INSERT OR REPLACE INTO yoga_members (
    id, lic_id, name, ename, birth, sex, member_dscd, lic_date, reg_date, retire_date,
    area_dscd, edu_loc, email, phone, hp, zipcode, addr, area_auth, login_id, login_pwd,
    edu_dscd, edu_auth, mem_auth, grade, jumin, etc, y_name, y_area
  ) VALUES (
    ${v[0]}, ${lit(v, 1)}, ${lit(v, 2)}, ${lit(v, 3)}, ${lit(v, 4)}, ${lit(v, 5)},
    ${lit(v, 6)}, ${lit(v, 7)}, ${lit(v, 8)}, ${lit(v, 9)}, ${lit(v, 10)}, ${lit(v, 11)},
    ${lit(v, 12)}, ${lit(v, 13)}, ${lit(v, 14)}, ${lit(v, 15)}, ${lit(v, 16)}, ${lit(v, 17)},
    ${lit(v, 18)}, ${lit(v, 19)}, ${lit(v, 20)}, ${lit(v, 21)}, ${lit(v, 22)}, ${lit(v, 23)},
    ${lit(v, 24)}, ${lit(v, 25)}, ${lit(v, 26)}, ${lit(v, 27)}
  );`;
}

function mapYogaPaymentRow(rowSql) {
  const v = splitSqlValues(rowSql);
  if (v.length < 6) return null;

  return `INSERT OR REPLACE INTO yoga_payments (id, lic_id, pay_date, pay_amount, pay_yy, pay_etc)
    VALUES (${v[0]}, ${lit(v, 1)}, ${lit(v, 2)}, ${lit(v, 3)}, ${lit(v, 4)}, ${lit(v, 5)});`;
}

function mapYogaBranchRow(rowSql) {
  const v = splitSqlValues(rowSql);
  if (v.length < 18) return null;

  return `INSERT OR REPLACE INTO yoga_branches (
    id, y_part, y_type, y_name, y_ceo, y_zipcode, y_addr, y_hp, y_phone, y_reg_date,
    y_email, y_homepage, y_yn, y_area_dscd, y_retire_date, y_pay, y_etc, y_etc2
  ) VALUES (
    ${v[0]}, ${lit(v, 1)}, ${lit(v, 2)}, ${lit(v, 3)}, ${lit(v, 4)}, ${lit(v, 5)},
    ${lit(v, 6)}, ${lit(v, 7)}, ${lit(v, 8)}, ${lit(v, 9)}, ${lit(v, 10)}, ${lit(v, 11)},
    ${lit(v, 12)}, ${lit(v, 13)}, ${lit(v, 14)}, ${lit(v, 15)}, ${lit(v, 16)}, ${lit(v, 17)}
  );`;
}

function mapYogaMemGradeRow(rowSql) {
  const v = splitSqlValues(rowSql);
  if (v.length < 14) return null;

  return `INSERT OR REPLACE INTO yoga_mem_grades (
    id, lic_id, dscd, grade_type, grade_no, grade_txt, grade_edu_loc, name, jumin, hp,
    bas_date, chg_date, hour, gubun
  ) VALUES (
    ${v[0]}, ${lit(v, 1)}, ${lit(v, 2)}, ${lit(v, 3)}, ${lit(v, 4)}, ${lit(v, 5)},
    ${lit(v, 6)}, ${lit(v, 7)}, ${lit(v, 8)}, ${lit(v, 9)}, ${lit(v, 10)}, ${lit(v, 11)},
    ${lit(v, 12)}, ${lit(v, 13)}
  );`;
}

function mapEduRow(rowSql) {
  const v = splitSqlValues(rowSql);
  if (v.length < 14) return null;

  return `INSERT OR REPLACE INTO member_educations (
    id, lic_id, dscd, grade_type, grade_no, grade_txt, grade_edu_loc, name, jumin, hp,
    created, modified, hour, gubun
  ) VALUES (
    ${v[0]}, ${lit(v, 1)}, ${lit(v, 2)}, ${lit(v, 3)}, ${lit(v, 4)}, ${lit(v, 5)},
    ${lit(v, 6)}, ${lit(v, 7)}, ${lit(v, 8)}, ${lit(v, 9)}, ${lit(v, 10)}, ${lit(v, 11)},
    ${lit(v, 12)}, ${lit(v, 13)}
  );`;
}

function mapMainpicRow(rowSql) {
  const v = splitSqlValues(rowSql);
  if (v.length < 6) return null;

  const photo = parseSqlString(v[1]);
  const imagePath = photo ? `/mainpic/${photo}` : "";
  const isActive = parseSqlString(v[4]) === "1" ? 1 : 0;

  return `INSERT OR REPLACE INTO main_slides (id, image_path, caption, sort_order, is_active, created_at)
    VALUES (${v[0]}, ${sqlLiteral(imagePath)}, ${lit(v, 2)}, ${lit(v, 3)}, ${isActive}, ${lit(v, 5)});`;
}

const TABLE_MAPPERS = {
  "`yoga_member`": { map: mapYogaMemberRow, key: "members" },
  "`yoga_payment`": { map: mapYogaPaymentRow, key: "payments" },
  "`yoga_branch`": { map: mapYogaBranchRow, key: "branches" },
  "`yoga_mem_grade`": { map: mapYogaMemGradeRow, key: "grades" },
  "`_edu`": { map: mapEduRow, key: "educations" },
  "`mainpic`": { map: mapMainpicRow, key: "slides" },
};

function processInsertStatement(statement) {
  const match = statement.match(/^INSERT INTO (`[^`]+`) VALUES\s*(.+);$/is);
  if (!match) return 0;

  const mapper = TABLE_MAPPERS[match[1]];
  if (!mapper) return 0;

  let count = 0;
  for (const row of splitRowTuples(match[2])) {
    const mapped = mapper.map(row);
    if (mapped) {
      out.write(`${mapped}\n`);
      count++;
    }
  }
  counts[mapper.key] += count;
  return count;
}

const out = createWriteStream(outputPath);
out.write("-- Generated from dump.sql (manage tables)\n");
out.write("DELETE FROM yoga_payments;\n");
out.write("DELETE FROM yoga_members;\n");
out.write("DELETE FROM yoga_branches;\n");
out.write("DELETE FROM yoga_mem_grades;\n");
out.write("DELETE FROM member_educations;\n");
out.write("DELETE FROM main_slides;\n\n");

let inInsert = false;
let buffer = "";

const rl = createInterface({
  input: createReadStream(dumpPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  const tablePrefix = Object.keys(TABLE_MAPPERS).find((t) =>
    line.startsWith(`INSERT INTO ${t}`),
  );

  if (tablePrefix) {
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

out.end();

await new Promise((resolve, reject) => {
  out.on("finish", resolve);
  out.on("error", reject);
});

console.log(`변환 완료: ${outputPath}`);
console.log(`회원: ${counts.members}건`);
console.log(`회비: ${counts.payments}건`);
console.log(`요가원: ${counts.branches}건`);
console.log(`교육이수: ${counts.grades}건`);
console.log(`자격증(_edu): ${counts.educations}건`);
console.log(`메인사진: ${counts.slides}건`);
