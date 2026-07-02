export const PUBLIC_BOARD_IDS = new Set(["headroom", "notice", "brbr"]);

export function isPublicBoard(boardId: string) {
  return PUBLIC_BOARD_IDS.has(boardId);
}

export function isGalleryBoard(board: { board_type: string }) {
  return board.board_type === "gallery";
}
