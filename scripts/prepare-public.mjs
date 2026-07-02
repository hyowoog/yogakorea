import { execSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = process.cwd();
const publicHtml = join(root, "public_html");
const siteAssets = join(root, "public/site-assets");
const renewAssets = join(root, "public/renew-assets");

function isBrokenSymlink(path) {
  try {
    if (lstatSync(path).isSymbolicLink()) {
      const target = resolve(dirname(path), readlinkSync(path));
      return !existsSync(target);
    }
  } catch {
    return false;
  }
  return false;
}

function removePath(path) {
  if (!existsSync(path) && !isBrokenSymlink(path)) return;
  rmSync(path, { recursive: true, force: true });
}

function ensureSymlink(linkPath, targetPath) {
  removePath(linkPath);
  symlinkSync(targetPath, linkPath);
}

if (existsSync(publicHtml)) {
  ensureSymlink(siteAssets, "../public_html");
  ensureSymlink(renewAssets, "../public_html/renew");
  console.log("prepare-public: linked public_html assets for local development");
} else {
  if (isBrokenSymlink(siteAssets)) unlinkSync(siteAssets);
  if (isBrokenSymlink(renewAssets)) unlinkSync(renewAssets);

  const hasSiteAssets =
    existsSync(siteAssets) && existsSync(join(siteAssets, "eyoom"));
  const hasRenewAssets =
    existsSync(renewAssets) && existsSync(join(renewAssets, "images"));

  if (!hasSiteAssets || !hasRenewAssets) {
    execSync("node scripts/sync-static-assets.mjs", {
      stdio: "inherit",
      cwd: root,
    });
  } else {
    console.log("prepare-public: static assets already present");
  }
}
