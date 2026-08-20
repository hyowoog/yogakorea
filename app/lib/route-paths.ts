import type { GnuboardId } from "~/lib/navigation";

const DATA_BOARD_IDS = new Set<GnuboardId>([
  "headroom",
  "photoroom",
  "webzine",
  "videoroom",
]);

const COMM_BOARD_IDS = new Set<GnuboardId>([
  "notice",
  "fieldnews",
  "job",
  "member",
  "gallery",
  "qna",
  "free2",
  "brbr",
]);

export function getBoardBasePath(boardId: string) {
  if (boardId === "branch") return "/branch";
  if (DATA_BOARD_IDS.has(boardId as GnuboardId)) return `/data/${boardId}`;
  if (COMM_BOARD_IDS.has(boardId as GnuboardId)) return `/comm/${boardId}`;
  return `/board/${boardId}`;
}

export function getBoardListPath(
  boardId: string,
  options?: {
    page?: number;
    searchQuery?: string;
    searchField?: string;
    jobCategory?: string;
  },
) {
  const params = new URLSearchParams();
  if (options?.page && options.page > 1) params.set("page", String(options.page));
  if (options?.searchQuery) {
    params.set("q", options.searchQuery);
    params.set("field", options.searchField ?? "title");
  }
  if (options?.jobCategory) params.set("cat", options.jobCategory);

  const query = params.toString();
  const base = getBoardBasePath(boardId);
  return query ? `${base}?${query}` : base;
}

export function getBoardPostPath(boardId: string, postId: number) {
  const base = getBoardBasePath(boardId);
  if (base === "/branch") return "/branch";
  return `${base}/${postId}`;
}

export function getBoardWritePath(boardId: string) {
  const base = getBoardBasePath(boardId);
  if (base === "/branch") return "/branch";
  return `${base}/write`;
}

export function getBoardEditPath(boardId: string, postId: number) {
  const base = getBoardBasePath(boardId);
  if (base === "/branch") return "/branch";
  return `${base}/${postId}/edit`;
}

export function getBoardDeletePath(boardId: string, postId: number) {
  const base = getBoardBasePath(boardId);
  if (base === "/branch") return "/branch";
  return `${base}/${postId}/delete`;
}

