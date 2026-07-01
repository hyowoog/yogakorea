#!/usr/bin/env node
/**
 * wrangler CLI용 로컬 D1과 Vite dev 서버용 로컬 D1을 동기화합니다.
 * (같은 .wrangler/state 아래에 해시가 다른 sqlite 파일이 2개 생길 수 있음)
 */

import { copyFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const d1Dir = join(root, ".wrangler/state/v3/d1/miniflare-D1DatabaseObject");

function countPosts(dbPath) {
  try {
    const out = execFileSync("sqlite3", [dbPath, "SELECT COUNT(*) FROM posts;"], {
      encoding: "utf8",
    }).trim();
    return Number(out);
  } catch {
    return -1;
  }
}

function listDatabases() {
  if (!existsSync(d1Dir)) return [];

  return readdirSync(d1Dir)
    .filter((name) => name.endsWith(".sqlite") && name !== "metadata.sqlite")
    .map((name) => join(d1Dir, name));
}

const databases = listDatabases();
if (databases.length === 0) {
  console.log("로컬 D1 데이터베이스가 없습니다. 먼저 npm run db:migrate:local 을 실행하세요.");
  process.exit(1);
}

const ranked = databases
  .map((path) => ({ path, posts: countPosts(path) }))
  .filter((db) => db.posts >= 0)
  .sort((a, b) => b.posts - a.posts);

const source = ranked[0];
if (!source || source.posts === 0) {
  console.log("동기화할 게시글 데이터가 없습니다. npm run db:import 를 먼저 실행하세요.");
  process.exit(1);
}

const targets = ranked.filter((db) => db.path !== source.path && db.posts < source.posts);

if (targets.length === 0) {
  console.log(`이미 동기화되어 있습니다. (게시글 ${source.posts}건)`);
  process.exit(0);
}

for (const target of targets) {
  for (const suffix of ["", "-wal", "-shm"]) {
    const file = `${target.path}${suffix}`;
    if (existsSync(file)) rmSync(file);
  }

  copyFileSync(source.path, target.path);
  console.log(`동기화: ${source.posts}건 → ${target.path.split("/").pop()}`);
}

console.log("완료. 실행 중인 dev 서버가 있다면 재시작하세요.");
