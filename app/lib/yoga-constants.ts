const EDUCATION_GUBUN_LABELS = ["", "수련회", "심화교육", "특강", "워크숍"];

export function formatEducationGubun(gubun: string | null) {
  const index = parseInt(gubun ?? "", 10);
  if (!Number.isNaN(index) && index >= 0 && index < EDUCATION_GUBUN_LABELS.length) {
    return EDUCATION_GUBUN_LABELS[index];
  }
  return gubun ?? "";
}
