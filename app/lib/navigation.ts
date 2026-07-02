export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

/** public_html Eyoom(basic2) 메뉴 구조 */
export const mainNavigation: NavItem[] = [
  {
    label: "연합회소개",
    children: [
      { label: "인사말", href: "/about/greetings" },
      { label: "스와미말씀", href: "/about/swami" },
      { label: "연혁", href: "/about/history" },
      { label: "조직도", href: "/about/organization" },
      { label: "오시는 길", href: "/about/contactus" },
    ],
  },
  {
    label: "소속기관",
    children: [
      { label: "전국요가원", href: "/branch" },
      { label: "가입안내", href: "/branch/guide" },
    ],
  },
  {
    label: "주요사업",
    children: [
      { label: "민간자격안내", href: "/work/info" },
      { label: "지도자양성 및 자격시험", href: "/work/biz01" },
      { label: "특수자격증 발급", href: "/work/biz02" },
      { label: "교육사업", href: "/work/biz03" },
    ],
  },
  {
    label: "자료마당",
    children: [
      { label: "본부자료실", href: "/data/headroom" },
      { label: "사진자료실", href: "/data/photoroom" },
      { label: "회보자료실", href: "/data/webzine" },
      { label: "교육동영상", href: "/data/videoroom" },
    ],
  },
  {
    label: "커뮤니티",
    children: [
      { label: "공지사항", href: "/comm/notice" },
      { label: "권역별소식", href: "/comm/fieldnews" },
      { label: "구인구직", href: "/comm/job" },
      { label: "회원게시판", href: "/comm/member" },
      { label: "포토앨범", href: "/comm/gallery" },
      { label: "묻고 답하기", href: "/comm/qna" },
      { label: "자유게시판", href: "/comm/free2" },
    ],
  },
  {
    label: "관련단체",
    children: [
      { label: "참여대학 및 단체", href: "/site/relative01" },
      { label: "후원 및 협찬사", href: "/site/relative02" },
      { label: "관련 사이트", href: "/site/relative03" },
    ],
  },
  { label: "빠람빠라", href: "/comm/brbr" },
];

/** public_html/renew 메뉴 (보조 사이트) */
export const renewNavigation: NavItem[] = [
  { label: "Home", href: "/renew" },
  {
    label: "한국요가연합회소개",
    children: [
      { label: "인사말", href: "/renew/pages/greetings" },
      { label: "스와미말씀", href: "/renew/pages/words" },
      { label: "연혁", href: "/renew/pages/history" },
      { label: "조직도", href: "/renew/pages/organization" },
      { label: "오시는길", href: "/renew/pages/way" },
    ],
  },
  {
    label: "커뮤니티",
    children: [
      { label: "공지사항", href: "/renew/board/notice" },
      { label: "권역별 소식", href: "/renew/board/news" },
      { label: "구인구직", href: "/renew/board/job" },
    ],
  },
  { label: "메인 사이트", href: "/" },
];

export const pageMeta: Record<
  string,
  { title: string; section: string; sectionTitle: string }
> = {
  greetings: { title: "인사말", section: "about", sectionTitle: "연합회소개" },
  swami: { title: "스와미말씀", section: "about", sectionTitle: "연합회소개" },
  history: { title: "연혁", section: "about", sectionTitle: "연합회소개" },
  organization: { title: "조직도", section: "about", sectionTitle: "연합회소개" },
  contactus: { title: "오시는 길", section: "about", sectionTitle: "연합회소개" },
  guide: { title: "가입안내", section: "org", sectionTitle: "소속기관" },
  info: { title: "민간자격안내", section: "work", sectionTitle: "주요사업" },
  biz01: { title: "지도자양성 및 자격시험", section: "work", sectionTitle: "주요사업" },
  biz02: { title: "특수자격증 발급", section: "work", sectionTitle: "주요사업" },
  biz03: { title: "교육사업", section: "work", sectionTitle: "주요사업" },
  relative01: { title: "참여대학 및 단체", section: "link", sectionTitle: "관련단체" },
  relative02: { title: "후원 및 협찬사", section: "link", sectionTitle: "관련단체" },
  relative03: { title: "관련 사이트", section: "link", sectionTitle: "관련단체" },
  aboutus: { title: "연합회 소개", section: "about", sectionTitle: "연합회소개" },
  provision: { title: "이용약관", section: "etc", sectionTitle: "기타" },
  privacy: { title: "개인정보처리방침", section: "etc", sectionTitle: "기타" },
  noemail: { title: "이메일무단수집거부", section: "etc", sectionTitle: "기타" },
  info_detail: { title: "민간자격정보 상세", section: "work", sectionTitle: "주요사업" },
};

export const gnuboardIds = [
  "notice",
  "fieldnews",
  "job",
  "member",
  "gallery",
  "qna",
  "free2",
  "headroom",
  "photoroom",
  "videoroom",
  "webzine",
  "branch",
  "brbr",
] as const;

export type GnuboardId = (typeof gnuboardIds)[number];

export interface SectionSidebarItem {
  label: string;
  href: string;
}

export interface SectionSidebar {
  sectionTitle: string;
  items: SectionSidebarItem[];
}

/** 기타(푸터) 정적 페이지 — 상단 메뉴에 없는 카테고리 */
const etcSectionSidebar: SectionSidebar = {
  sectionTitle: "기타",
  items: [
    { label: "개인정보처리방침", href: "/pages/privacy" },
    { label: "이용약관", href: "/pages/provision" },
    { label: "이메일무단수집거부", href: "/pages/noemail" },
  ],
};

function navItemsToSidebar(group: NavItem): SectionSidebar | null {
  if (!group.children?.length) return null;

  const items = group.children
    .filter((item): item is NavItem & { href: string } => Boolean(item.href))
    .map((item) => ({ label: item.label, href: item.href }));

  if (items.length === 0) return null;

  return { sectionTitle: group.label, items };
}

function getPageMetaSidebar(pathname: string): SectionSidebar | null {
  const match = pathname.match(/^\/(?:pages|about|work|site|branch)\/([^/]+)/);
  if (!match) return null;

  const current = pageMeta[match[1]];
  if (!current) return null;

  const items = Object.entries(pageMeta)
    .filter(([, meta]) => meta.section === current.section)
    .map(([slug, meta]) => {
      const prefix =
        meta.section === "about"
          ? "about"
          : meta.section === "work"
            ? "work"
            : meta.section === "link"
              ? "site"
              : meta.section === "org"
                ? "branch"
                : "pages";

      return { label: meta.title, href: `/${prefix}/${slug}` };
    });

  if (items.length <= 1) return null;

  return { sectionTitle: current.sectionTitle, items };
}

/** 현재 경로가 속한 카테고리의 사이드 메뉴 항목 */
export function getSectionSidebar(pathname: string): SectionSidebar | null {
  for (const group of mainNavigation) {
    if (!group.children) continue;

    const isInSection = group.children.some(
      (item) =>
        item.href &&
        (pathname === item.href || pathname.startsWith(`${item.href}/`)),
    );

    if (isInSection) return navItemsToSidebar(group);
  }

  if (
    pathname.startsWith("/pages/") ||
    pathname.startsWith("/about/") ||
    pathname.startsWith("/work/") ||
    pathname.startsWith("/site/") ||
    pathname.startsWith("/branch/")
  ) {
    const etcMatch = etcSectionSidebar.items.some(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
    if (etcMatch) return etcSectionSidebar;

    return getPageMetaSidebar(pathname);
  }

  return null;
}
