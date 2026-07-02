export const PUBLIC_BOARD_IDS = new Set(["headroom", "notice", "brbr"]);

export function isPublicBoard(boardId: string) {
  return PUBLIC_BOARD_IDS.has(boardId);
}
