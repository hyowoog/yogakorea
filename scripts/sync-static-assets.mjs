import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const bucket = "yogakorea-uploads";
const objectKey = "ci/static-assets.tgz";
const siteAssets = join(root, "public/site-assets");
const renewAssets = join(root, "public/renew-assets");

const tempDir = mkdtempSync(join(tmpdir(), "yk-static-"));
const archivePath = join(tempDir, "static-assets.tgz");
const extractDir = join(tempDir, "extract");

mkdirSync(extractDir, { recursive: true });

console.log(`sync-static-assets: downloading ${objectKey} from R2...`);

execSync(
  `npx wrangler r2 object get ${bucket}/${objectKey} --file="${archivePath}" --remote`,
  { stdio: "inherit", cwd: root },
);

execSync(`tar -xzf "${archivePath}" -C "${extractDir}"`, {
  stdio: "inherit",
});

const extractedRoot = join(extractDir, "public_html");
if (!existsSync(extractedRoot)) {
  throw new Error("static assets archive is missing public_html directory");
}

mkdirSync(join(root, "public"), { recursive: true });
rmSync(siteAssets, { recursive: true, force: true });
rmSync(renewAssets, { recursive: true, force: true });

cpSync(extractedRoot, siteAssets, { recursive: true });
cpSync(join(extractedRoot, "renew"), renewAssets, { recursive: true });

rmSync(tempDir, { recursive: true, force: true });
console.log("sync-static-assets: restored public/site-assets and public/renew-assets");
