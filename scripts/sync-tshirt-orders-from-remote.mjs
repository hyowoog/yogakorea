#!/usr/bin/env node
/**
 * 원격 D1 tshirt_orders → 로컬 D1 동기화 (로컬 데이터 전체 대체)
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function normalizeTshirtColor(color) {
  return color === "코박트색" ? "코발트색" : color;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outputDir = join(__dirname, "output");
const outputPath = join(outputDir, "tshirt_orders_remote.sql");

mkdirSync(outputDir, { recursive: true });

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function fetchRemoteRows() {
  const raw = execFileSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "yogakorea",
      "--remote",
      "--command",
      "SELECT id, name, mobile, studio_name, color, size_code, created_at FROM tshirt_orders ORDER BY id;",
      "--json",
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );

  const parsed = JSON.parse(raw);
  const results = parsed[0]?.results ?? parsed.results ?? [];
  return results;
}

const rows = fetchRemoteRows();
const lines = [
  "-- Synced from remote D1 tshirt_orders",
  "DELETE FROM tshirt_orders;",
  "",
];

for (const row of rows) {
  lines.push(
    `INSERT OR REPLACE INTO tshirt_orders (id, name, mobile, studio_name, color, size_code, created_at) VALUES (${row.id}, ${sqlLiteral(row.name)}, ${sqlLiteral(row.mobile)}, ${sqlLiteral(row.studio_name)}, ${sqlLiteral(normalizeTshirtColor(row.color))}, ${sqlLiteral(row.size_code)}, ${sqlLiteral(row.created_at)});`,
  );
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`원격 tshirt_orders ${rows.length}건 → ${outputPath}`);

execFileSync(
  "npx",
  ["wrangler", "d1", "execute", "yogakorea", "--local", "--file", outputPath],
  { cwd: root, stdio: "inherit" },
);

execFileSync("node", ["scripts/sync-local-d1.mjs"], { cwd: root, stdio: "inherit" });

console.log(`완료: 로컬 tshirt_orders ${rows.length}건으로 대체됨`);
