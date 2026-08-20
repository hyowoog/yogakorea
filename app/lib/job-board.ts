export const JOB_BOARD_ID = "job";
export const JOB_CATEGORIES = ["구인", "구직"] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

const JOB_TITLE_PREFIX = /^\[(구인|구직)\]\s*/;

export function isJobBoard(boardId: string) {
  return boardId === JOB_BOARD_ID;
}

export function isJobCategory(value: string): value is JobCategory {
  return value === "구인" || value === "구직";
}

export function parseJobCategoryFilter(value: string | null | undefined): JobCategory | undefined {
  if (!value) return undefined;
  return isJobCategory(value) ? value : undefined;
}

export function parseJobTitle(title: string) {
  const match = title.match(JOB_TITLE_PREFIX);
  if (!match) {
    return { category: "" as const, body: title };
  }

  return {
    category: match[1] as JobCategory,
    body: title.slice(match[0].length),
  };
}

export function withJobTitlePrefix(title: string, category: JobCategory) {
  return `[${category}] ${parseJobTitle(title).body.trim()}`;
}

export function resolvePostTitle(boardId: string, title: string, jobCategory: string) {
  if (!isJobBoard(boardId)) {
    return { ok: true as const, title };
  }

  if (!isJobCategory(jobCategory)) {
    return { ok: false as const, error: "구인/구직 구분을 선택해 주세요." };
  }

  return { ok: true as const, title: withJobTitlePrefix(title, jobCategory) };
}
