export const PUBLIC_BOARD_IDS = new Set(["headroom", "notice", "brbr", "branch"]);

export function isPublicBoard(boardId: string) {
  return PUBLIC_BOARD_IDS.has(boardId);
}

export function isGalleryBoard(board: { board_type: string; id?: string }) {
  if (board.id === "brbr") return false;
  return board.board_type === "gallery";
}

export function isBrbrBoard(board: { id: string }) {
  return board.id === "brbr";
}

/** 댓글이 아닌 게시판 답글(별도 게시글) */
export function isBoardReply(post: { depth: number; parent_id: number | null }) {
  return post.depth > 0 && post.parent_id != null;
}
