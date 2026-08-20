const EDUCATION_GUBUN_LABELS = ["", "수련회", "심화교육", "특강", "워크숍"];

export const EDUCATION_DSCD_OPTIONS = [
  { value: "1", label: "일반" },
  { value: "2", label: "특수" },
  { value: "3", label: "특수자격" },
] as const;

export const EDUCATION_GUBUN_FORM_OPTIONS = [
  { value: "1", label: "수련회" },
  { value: "2", label: "심화교육" },
  { value: "3", label: "특강" },
  { value: "4", label: "워크샵" },
  { value: "0", label: "없음" },
] as const;

export const EDUCATION_GUBUN_GUEST_OPTIONS = EDUCATION_GUBUN_FORM_OPTIONS.filter(
  (option) => option.value === "1" || option.value === "2" || option.value === "3",
);

/** 회원교육 대량 등록 시 자격번호 입력칸 개수 (10×10) */
export const EDUCATION_BULK_LICENSE_SLOTS = 100;

export function formatEducationGubun(gubun: string | null) {
  const index = parseInt(gubun ?? "", 10);
  if (!Number.isNaN(index) && index >= 0 && index < EDUCATION_GUBUN_LABELS.length) {
    return EDUCATION_GUBUN_LABELS[index];
  }
  return gubun ?? "";
}
