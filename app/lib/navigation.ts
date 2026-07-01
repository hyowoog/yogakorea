export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export const renewNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "한국요가연합회소개",
    children: [
      { label: "인사말", href: "/pages/greetings" },
      { label: "스와미말씀", href: "/pages/words" },
      { label: "한국요가연합회연혁", href: "/pages/history" },
      { label: "조직도", href: "/pages/organization" },
      { label: "오시는길", href: "/pages/way" },
    ],
  },
  {
    label: "소속기관 및 가입안내",
    children: [
      { label: "전국요가원", href: "/pages/branch" },
      { label: "가입안내", href: "/pages/about-join" },
    ],
  },
  {
    label: "주요사업안내",
    children: [
      { label: "민간자격안내", href: "/pages/business-lic" },
      { label: "지도자 양성 및 자격시험", href: "/pages/business-exm" },
      { label: "특수자격증 발급", href: "/pages/business-spc" },
      { label: "교육사업", href: "/pages/business-edu" },
      { label: "기타지원", href: "/pages/business-etc" },
    ],
  },
  {
    label: "커뮤니티",
    children: [
      { label: "공지사항", href: "/board/notice" },
      { label: "권역별 소식", href: "/board/news" },
      { label: "구인구직", href: "/board/job" },
      { label: "회원게시판", href: "/board/bbs" },
      { label: "포토앨범", href: "/board/photo" },
      { label: "묻고답하기", href: "/board/qna" },
      { label: "자유게시판", href: "/board/free" },
    ],
  },
  {
    label: "관련링크",
    children: [
      { label: "참여대학 및 단체", href: "/pages/link-party" },
      { label: "후원 및 협찬사", href: "/pages/link-support" },
      { label: "관련사이트", href: "/pages/link-site" },
    ],
  },
];

export const legacyNavigation: NavItem[] = [
  { label: "홈", href: "/legacy" },
  { label: "연합회 소개", href: "/legacy/about" },
  { label: "사업 안내", href: "/legacy/business" },
  { label: "커뮤니티", href: "/legacy/community" },
  { label: "리뉴얼 사이트", href: "/" },
];

export const pageMeta: Record<
  string,
  { title: string; section: string; sectionTitle: string }
> = {
  greetings: {
    title: "인사말",
    section: "info",
    sectionTitle: "한국요가연합회 소개",
  },
  words: {
    title: "스와미말씀",
    section: "info",
    sectionTitle: "한국요가연합회 소개",
  },
  history: {
    title: "한국요가연합회연혁",
    section: "info",
    sectionTitle: "한국요가연합회 소개",
  },
  organization: {
    title: "조직도",
    section: "info",
    sectionTitle: "한국요가연합회 소개",
  },
  way: {
    title: "오시는길",
    section: "info",
    sectionTitle: "한국요가연합회 소개",
  },
  branch: {
    title: "전국요가원",
    section: "org",
    sectionTitle: "소속기관 및 가입안내",
  },
  "about-join": {
    title: "가입안내",
    section: "org",
    sectionTitle: "소속기관 및 가입안내",
  },
  "business-lic": {
    title: "민간자격안내",
    section: "work",
    sectionTitle: "주요사업안내",
  },
  "business-exm": {
    title: "지도자 양성 및 자격시험",
    section: "work",
    sectionTitle: "주요사업안내",
  },
  "business-spc": {
    title: "특수자격증 발급",
    section: "work",
    sectionTitle: "주요사업안내",
  },
  "business-edu": {
    title: "교육사업",
    section: "work",
    sectionTitle: "주요사업안내",
  },
  "business-etc": {
    title: "기타지원",
    section: "work",
    sectionTitle: "주요사업안내",
  },
  "link-party": {
    title: "참여대학 및 단체",
    section: "etc",
    sectionTitle: "관련링크",
  },
  "link-support": {
    title: "후원 및 협찬사",
    section: "etc",
    sectionTitle: "관련링크",
  },
  "link-site": {
    title: "관련사이트",
    section: "etc",
    sectionTitle: "관련링크",
  },
  money: {
    title: "회비납부내역",
    section: "mypage",
    sectionTitle: "마이페이지",
  },
};

export const boardIds = [
  "notice",
  "news",
  "job",
  "bbs",
  "photo",
  "qna",
  "free",
] as const;

export type BoardId = (typeof boardIds)[number];
