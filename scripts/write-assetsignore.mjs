import { writeFileSync } from "node:fs";

writeFileSync(
  "build/client/.assetsignore",
  [
    "# Cloudflare Workers static assets are limited to 25 MiB per file.",
    "site-assets/data/yogakorea1.pdf",
    "**/*.pdf",
  ].join("\n"),
);
