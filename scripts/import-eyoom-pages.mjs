#!/usr/bin/env node
/**
 * Eyoom basic2/page HTML → app/lib/page-content.ts 변환
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pageDir = join(root, "public/site-assets/eyoom/theme/basic2/page");
const outputPath = join(root, "app/lib/page-content.ts");

const PAGE_SLUGS = [
  "greetings",
  "swami",
  "history",
  "organization",
  "contactus",
  "guide",
  "info",
  "info_detail",
  "biz01",
  "biz02",
  "biz03",
  "biz04",
  "relative01",
  "relative02",
  "relative03",
  "privacy",
  "provision",
  "noemail",
];

function stripPhp(source) {
  return source
    .replace(/<\?php[\s\S]*?\?>/gi, "")
    .replace(/<\?[\s\S]*?\?>/gi, "")
    .trim();
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (match) return match[1].trim();
  return html;
}

function fixAssetPaths(html) {
  return html
    .replace(/src="\/img\//g, 'src="/site-assets/img/')
    .replace(/src="img\//g, 'src="/site-assets/img/')
    .replace(/src="\.\/img\//g, 'src="/site-assets/img/')
    .replace(
      /window\.open\('\/eyoom\/theme\/basic2\/page\/info_detail\.html'/g,
      "window.open('/pages/info_detail'",
    )
    .replace(/href="\/eyoom\/theme\/basic2\/page\/([^"]+)"/g, 'href="/pages/$1"');
}

function buildOrganizationHtml() {
  const tit = [
    "강원",
    "경남",
    "경북",
    "광주·전남",
    "대구",
    "대전·충남",
    "부산",
    "서울·인천",
    "수도권",
    "울산",
    "전북",
    "제주",
    "충북",
  ];
  const data = [
    [["회장"], ["이장희"]],
    [
      ["회장", "부회장", "총무이사", "이사", "이사", "이사", "이사", "이사", "이사", "이사", "이사", "이사", "이사", "이사", "회계감사", "사업감사"],
      ["이미애", "한외순", "하은숙", "성원남", "조외숙", "한광희", "김현주", "김나경", "최경옥", "신지윤", "최경화", "이은경", "장정이", "권효선", "안세진", "반순옥"],
    ],
    [["회장", "부회장", "부회장", "총무", "감사"], ["장숙희", "심옥선", "전연자", "송정선", "권명옥"]],
    [["회장", "부회장", "부회장", "총무", "감사", "명예회장", "고문", "고문", "고문"], ["윤경숙", "윤영희", "정수정", "정금숙", "김명자", "유명아", "박정애", "류민수", "박효정"]],
    [["회장", "부회장", "총무"], ["강령아", "이진우", "이기연"]],
    [["회장", "총무", "감사", "이사", "이사"], ["지혜정", "전인숙", "김혜정", "최혜진", "윤지애"]],
    [["회장", "이사", "이사", "이사", "이사", "이사"], ["손주혜", "정영자", "최도향", "박제민", "조선제", "김경전"]],
    [["회장", "총무", "이사", "이사"], ["이미숙", "이인숙", "정평둘", "황나현"]],
    [["회장", "부회장", "총무", "이사", "이사", "이사", "이사", "이사"], ["현명복", "임덕", "송명희", "김영옥", "이광진", "김도하", "이영순", "조서현"]],
    [["회장", "총무"], ["이선근", "박소연"]],
    [["회장", "부회장", "총무", "이사", "감사"], ["장지영", "신주연", "이은옥", "김유진", "유명선"]],
    [["회장", "총무이사", "이사"], ["윤수정", "이미숙", "신지윤"]],
    [["회장", "총무", "이사", "이사"], ["이재연", "반현희", "이지선", "최윤경"]],
  ];

  const tabItems = tit
    .map(
      (label, key) =>
        `<li${key === 0 ? ' class="active"' : ""}><a href="#tab-${key}" data-toggle="tab">${label}</a></li>`,
    )
    .join("\n");

  const tabPanes = data
    .map(([roles, names], key) => {
      const headers = roles.map((v) => `<th style="text-align: center">${v}</th>`).join("\n");
      const cells = names.map((v) => `<th style="text-align: center">${v}</th>`).join("\n");
      return `<div class="tab-pane fade in${key === 0 ? " active" : ""}" id="tab-${key}">
<table class="table table-hover">
<thead><tr>${headers}</tr></thead>
<tbody><tr style="text-align: center;">${cells}</tr></tbody>
</table>
</div>`;
    })
    .join("\n");

  return `<div class="greetings hte-pages">
<div class="tab-e2 margin-top-30">
<div class="tag-box tag-box-e3">
<div align="center">
<div class="sub-img">
<img src="/site-assets/img/org-2025.png" alt="조직도" class="img-responsive" usemap="#Map">
<map name="Map" id="Map">
<area shape="rect" coords="361,90,500,120" href="#localtable" alt="지역 조직도" />
</map>
<div id="localtable"><br></div>
</div>
</div>
</div>
</div>
<div class="tab-e2">
<ul class="nav nav-tabs">
${tabItems}
</ul>
<div class="tab-content padding-all-15">
${tabPanes}
</div>
</div><br><br>
<blockquote class="hero hero-dark text-center">
<p><em>"언제나 함께 나누고 수행의 향기가 피어나는 아름다운 전통을 만들어 가겠습니다."</em></p>
<small><em>사단법인 한국요가연합회</em></small>
</blockquote>
</div>`;
}

function loadPage(slug) {
  if (slug === "organization") return buildOrganizationHtml();

  const filePath = join(pageDir, `${slug}.html`);
  let raw = readFileSync(filePath, "utf8");
  raw = stripPhp(raw);
  raw = extractBody(raw);
  raw = fixAssetPaths(raw);
  return raw;
}

function escapeTemplate(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\$&").replace(/\$\{/g, "\\${");
}

const entries = PAGE_SLUGS.map((slug) => {
  const html = loadPage(slug);
  return `  ${slug}: \`\n${escapeTemplate(html)}\n\`,`;
});

const output = `/** Eyoom 페이지 HTML (public_html/eyoom/theme/basic2/page 기반) — scripts/import-eyoom-pages.mjs 로 생성 */
export const pageContent: Record<string, string> = {
${entries.join("\n\n")}
};
`;

writeFileSync(outputPath, output, "utf8");
console.log(`생성 완료: ${outputPath} (${PAGE_SLUGS.length}개 페이지)`);
