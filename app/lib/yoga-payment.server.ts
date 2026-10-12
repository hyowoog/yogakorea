import { fromAdminSelectValue } from "~/lib/admin-form";
import { ADMIN_PAGE_SIZE } from "~/lib/admin-pagination";
import { buildCsv } from "~/lib/csv.server";
import type { YogaPayment } from "~/lib/yoga-member.server";

export interface YogaPaymentRow extends YogaPayment {
  member_name: string | null;
}

export interface PaymentFilters {
  payYy?: string;
  payMonth?: string;
  searchField?: "lic_id" | "name" | "pay_etc";
  searchKey?: string;
}

const PAY_DATE_TRIMMED = "rtrim(trim(p.pay_date), '.')";

/**
 * pay_date 는 "2026.09.10", "2022.02.07.", "권역 2021.12.10", "26.02.05" 등 형식이 섞여 있어
 * 정렬·월 검색용으로 YYYY.MM.DD 형태로 맞춘 값 (해석 불가한 값은 원문 그대로)
 */
const PAY_DATE_SORT = `CASE
  WHEN ${PAY_DATE_TRIMMED} GLOB '[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]*' THEN substr(${PAY_DATE_TRIMMED}, 1, 10)
  WHEN ${PAY_DATE_TRIMMED} GLOB '*[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]' THEN substr(${PAY_DATE_TRIMMED}, -10)
  WHEN ${PAY_DATE_TRIMMED} GLOB '[0-9][0-9].[0-9][0-9].[0-9][0-9]' THEN '20' || ${PAY_DATE_TRIMMED}
  WHEN ${PAY_DATE_TRIMMED} GLOB '*[^0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]' THEN '20' || substr(${PAY_DATE_TRIMMED}, -8)
  ELSE ${PAY_DATE_TRIMMED}
END`;

function buildPaymentWhere(filters: PaymentFilters) {
  const clauses = ["1 = 1"];
  const binds: (string | number)[] = [];

  if (filters.payYy) {
    clauses.push("p.pay_yy = ?");
    binds.push(filters.payYy);
  }
  if (filters.payMonth) {
    clauses.push(`substr(${PAY_DATE_SORT}, 6, 2) = ?`);
    binds.push(filters.payMonth);
  }
  if (filters.searchField && filters.searchKey) {
    if (filters.searchField === "name") {
      clauses.push("ym.name LIKE ?");
      binds.push(`%${filters.searchKey}%`);
    } else if (filters.searchField === "pay_etc") {
      clauses.push("p.pay_etc LIKE ?");
      binds.push(`%${filters.searchKey}%`);
    } else {
      clauses.push("CAST(p.lic_id AS TEXT) = ?");
      binds.push(filters.searchKey.trim());
    }
  }

  return { whereSql: `WHERE ${clauses.join(" AND ")}`, binds };
}

const PAYMENT_FROM = `FROM yoga_payments p LEFT JOIN yoga_members ym ON p.lic_id = ym.lic_id`;
const PAYMENT_ORDER = `ORDER BY p.pay_yy DESC, ${PAY_DATE_SORT} DESC, p.id DESC`;

export function parsePaymentFilters(searchParams: URLSearchParams): PaymentFilters {
  const searchField = searchParams.get("searchField");
  const payMonth = fromAdminSelectValue(searchParams.get("payMonth"));
  return {
    payYy: fromAdminSelectValue(searchParams.get("payYy")),
    payMonth: payMonth && /^(0[1-9]|1[0-2])$/.test(payMonth) ? payMonth : undefined,
    searchField:
      searchField === "name" || searchField === "pay_etc" ? searchField : "lic_id",
    searchKey: searchParams.get("searchKey")?.trim() || undefined,
  };
}

/** 검색 조건에 맞는 건수와 금액 합계 */
export async function summarizePayments(db: Env["DB"], filters: PaymentFilters) {
  const { whereSql, binds } = buildPaymentWhere(filters);
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS total, COALESCE(SUM(p.pay_amount), 0) AS amount
       ${PAYMENT_FROM}
       ${whereSql}`,
    )
    .bind(...binds)
    .first<{ total: number; amount: number }>();
  return { total: row?.total ?? 0, amount: row?.amount ?? 0 };
}

export async function listPayments(
  db: Env["DB"],
  filters: PaymentFilters,
  offset = 0,
  limit = ADMIN_PAGE_SIZE,
) {
  const { whereSql, binds } = buildPaymentWhere(filters);
  const result = await db
    .prepare(
      `SELECT p.*, ym.name AS member_name
       ${PAYMENT_FROM}
       ${whereSql}
       ${PAYMENT_ORDER}
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<YogaPaymentRow>();
  return result.results ?? [];
}

export async function listPaymentsForExport(db: Env["DB"], filters: PaymentFilters) {
  const { whereSql, binds } = buildPaymentWhere(filters);
  const result = await db
    .prepare(
      `SELECT p.*, ym.name AS member_name
       ${PAYMENT_FROM}
       ${whereSql}
       ${PAYMENT_ORDER}`,
    )
    .bind(...binds)
    .all<YogaPaymentRow>();
  return result.results ?? [];
}

/** 납부년도 선택 옵션 (4자리 연도만, 최신순) */
export async function listPaymentYearOptions(db: Env["DB"]) {
  const result = await db
    .prepare(
      `SELECT DISTINCT pay_yy AS value FROM yoga_payments
       WHERE pay_yy GLOB '[0-9][0-9][0-9][0-9]'
       ORDER BY pay_yy DESC`,
    )
    .all<{ value: string }>();
  return result.results?.map((r) => r.value) ?? [];
}

export function buildPaymentsCsv(payments: YogaPaymentRow[]) {
  const headers = ["납부일자", "납부년도", "자격번호", "이름", "금액", "비고"];
  const rows = payments.map((p) => [
    p.pay_date ?? "",
    p.pay_yy ?? "",
    String(p.lic_id ?? ""),
    p.member_name ?? "",
    String(p.pay_amount ?? ""),
    p.pay_etc ?? "",
  ]);
  return { csv: buildCsv(headers, rows), filename: "회비입금내역.csv" };
}
