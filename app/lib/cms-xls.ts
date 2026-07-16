export interface CmsWithdrawalRow {
  withdrawDate: string;
  payerNo: string;
  licNo: string;
  area: string;
  payerName: string;
  billMonth: string;
  agreementDate: string;
  amount: string;
}

export const CMS_XLS_ROWS_STORAGE_KEY = "yogakorea:xls-to-money-rows";

export const CMS_XLS_COLUMNS: {
  key: keyof CmsWithdrawalRow;
  label: string;
}[] = [
  { key: "withdrawDate", label: "출금신청일" },
  { key: "payerNo", label: "납부자번호" },
  { key: "licNo", label: "자격번호" },
  { key: "area", label: "권역" },
  { key: "payerName", label: "납부자명" },
  { key: "billMonth", label: "청구월차" },
  { key: "agreementDate", label: "약정일" },
  { key: "amount", label: "출금액" },
];

export function createEmptyCmsWithdrawalRow(): CmsWithdrawalRow {
  return {
    withdrawDate: "",
    payerNo: "",
    licNo: "",
    area: "",
    payerName: "",
    billMonth: "",
    agreementDate: "",
    amount: "",
  };
}

export interface CmsPaymentInput {
  licId: number;
  payDate: string;
  payAmount: number;
  payYy: string;
  payEtc: "CMS";
}

export function parseCmsAmount(value: string) {
  const n = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

/** 출금신청일 → pay_date (YYYY.MM.DD) */
export function formatCmsPayDate(value: string): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}`;
  }

  const match = raw.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) return null;

  const year = match[1];
  const month = match[2].padStart(2, "0");
  const day = match[3].padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/** 청구월차 → pay_yy (YYYY) */
export function formatCmsPayYy(value: string): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const yearMatch = raw.match(/(19|20)\d{2}/);
  if (yearMatch) return yearMatch[0];

  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 4) return digits.slice(0, 4);

  return null;
}

export function cmsRowToPaymentInput(
  row: CmsWithdrawalRow,
  rowIndex: number,
): { ok: true; input: CmsPaymentInput } | { ok: false; error: string } {
  const no = rowIndex + 1;
  const licId = parseInt(String(row.licNo).replace(/\D/g, ""), 10);
  if (!licId) {
    return { ok: false, error: `${no}행: 자격번호가 올바르지 않습니다.` };
  }

  const payDate = formatCmsPayDate(row.withdrawDate);
  if (!payDate) {
    return { ok: false, error: `${no}행: 출금신청일 형식(예: 2026.07.06)을 확인해 주세요.` };
  }

  const payYy = formatCmsPayYy(row.billMonth);
  if (!payYy) {
    return { ok: false, error: `${no}행: 청구월차에서 연도(예: 2026)를 읽을 수 없습니다.` };
  }

  const payAmount = parseCmsAmount(row.amount);
  if (!Number.isFinite(payAmount) || payAmount <= 0) {
    return { ok: false, error: `${no}행: 출금액이 올바르지 않습니다.` };
  }

  return {
    ok: true,
    input: {
      licId,
      payDate,
      payAmount,
      payYy,
      payEtc: "CMS",
    },
  };
}

export function cmsRowsToPaymentInputs(rows: CmsWithdrawalRow[]) {
  const inputs: CmsPaymentInput[] = [];
  for (let i = 0; i < rows.length; i++) {
    const result = cmsRowToPaymentInput(rows[i]!, i);
    if (!result.ok) return result;
    inputs.push(result.input);
  }
  return { ok: true as const, inputs };
}
