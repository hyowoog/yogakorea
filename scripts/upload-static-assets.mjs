import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const archivePath = join(root, "static-assets.tgz");
const bucket = "yogakorea-uploads";
const objectKey = "ci/static-assets.tgz";

if (!existsSync(archivePath)) {
  execSync("node scripts/pack-static-assets.mjs", {
    stdio: "inherit",
    cwd: root,
  });
}

execSync(
  `npx wrangler r2 object put ${bucket}/${objectKey} --file="${archivePath}" --remote`,
  { stdio: "inherit", cwd: root },
);

console.log(`upload-static-assets: uploaded ${objectKey}`);
