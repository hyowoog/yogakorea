export interface YogaBranch {
  id: number;
  y_part: string | null;
  y_type: string | null;
  y_name: string | null;
  y_ceo: string | null;
  y_zipcode: string | null;
  y_addr: string | null;
  y_hp: string | null;
  y_phone: string | null;
  y_reg_date: string | null;
  y_email: string | null;
  y_homepage: string | null;
  y_yn: string | null;
  y_area_dscd: string | null;
  y_retire_date: string | null;
  y_pay: string | null;
  y_etc: string | null;
  y_etc2: string | null;
}

/** 덤프/임포트 시 이스케이프된 \\r\\n 을 실제 줄바꿈으로 변환 */
export function normalizeBranchNewlines(value: string | null | undefined) {
  if (!value) return value ?? "";
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}
