export const TSHIRT_COLORS = ["흰색", "코발트색"] as const;

const TSHIRT_COLOR_ALIASES: Record<string, (typeof TSHIRT_COLORS)[number]> = {
  코박트색: "코발트색",
};

/** 레거시 DB/폼 오타(코박트색)를 정규 색상명으로 변환 */
export function normalizeTshirtColor(color: string) {
  return TSHIRT_COLOR_ALIASES[color] ?? color;
}

export function formatTshirtColor(color: string) {
  return normalizeTshirtColor(color);
}

export const TSHIRT_SIZE_OPTIONS = [
  { code: "85", label: "S" },
  { code: "90", label: "M" },
  { code: "95", label: "L" },
  { code: "100", label: "XL" },
  { code: "105", label: "XXL" },
  { code: "110", label: "XXXL" },
] as const;

/** 레거시 idx 113 이하 신청은 구 사이즈 체계 */
export const LEGACY_TSHIRT_SIZE_CUTOFF_ID = 113;

const LEGACY_SIZE_LABELS: Record<number, string> = {
  90: "S",
  95: "M",
  100: "L",
  105: "XL",
  110: "XXL",
  115: "XXXL",
};

const CURRENT_SIZE_LABELS: Record<number, string> = {
  85: "S",
  90: "M",
  95: "L",
  100: "XL",
  105: "XXL",
  110: "XXXL",
};

export function formatTshirtSize(id: number, sizeCode: string) {
  const code = parseInt(sizeCode, 10);
  const labels = id <= LEGACY_TSHIRT_SIZE_CUTOFF_ID ? LEGACY_SIZE_LABELS : CURRENT_SIZE_LABELS;
  const label = labels[code] ?? sizeCode;
  return `${label}(${sizeCode})`;
}
