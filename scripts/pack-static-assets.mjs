import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicHtml = join(root, "public_html");
const outputPath = join(root, "static-assets.tgz");

if (!existsSync(publicHtml)) {
  console.error("pack-static-assets: public_html directory not found");
  process.exit(1);
}

const paths = [
  "public_html/eyoom",
  "public_html/img",
  "public_html/renew",
  "public_html/data/brbr",
];

for (const path of paths) {
  if (!existsSync(join(root, path))) {
    console.error(`pack-static-assets: missing ${path}`);
    process.exit(1);
  }
}

execSync(
  `tar -czf "${outputPath}" ${paths.map((path) => `"${path}"`).join(" ")}`,
  { stdio: "inherit", cwd: root, shell: true },
);

console.log(`pack-static-assets: wrote ${outputPath}`);
