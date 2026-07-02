import { fromAdminSelectValue } from "~/lib/admin-form";
import { ADMIN_PAGE_SIZE } from "~/lib/admin-pagination";
import { buildCsv } from "~/lib/csv.server";

export interface MemberLicense {
  id: number;
  lic_id: number | null;
  dscd: number | null;
  grade_type: string | null;
  grade_no: string | null;
  grade_txt: string | null;
  grade_edu_loc: string | null;
  name: string | null;
  jumin: string | null;
  hp: string | null;
  created: string | null;
  modified: string | null;
  hour: string | null;
  gubun: string | null;
  member_name?: string | null;
}

export interface LicenseInput {
  licId?: number | null;
  gradeType?: string;
  gradeNo?: string;
  gradeTxt?: string;
  gradeEduLoc?: string;
  name?: string;
  jumin?: string;
  hp?: string;
  created?: string;
  modified?: string;
  hour?: string;
  gubun?: string;
}

export interface LicenseFilters {
  eduLoc?: string;
  searchField?: "lic_id" | "name" | "grade_txt";
  searchKey?: string;
  order?: string;
}

function buildLicenseWhere(filters: LicenseFilters) {
  const clauses = ["e.dscd = 1"];
  const binds: (string | number)[] = [];

  if (filters.eduLoc) {
    clauses.push("e.grade_edu_loc = ?");
    binds.push(filters.eduLoc);
  }
  if (filters.searchField && filters.searchKey) {
    if (filters.searchField === "name") {
      clauses.push("ym.name LIKE ?");
      binds.push(`%${filters.searchKey}%`);
    } else if (filters.searchField === "lic_id") {
      clauses.push("CAST(e.lic_id AS TEXT) = ?");
      binds.push(filters.searchKey);
    } else {
      clauses.push("e.grade_txt = ?");
      binds.push(filters.searchKey);
    }
  }

  const orderField = ["lic_id", "name", "grade_txt", "created"].includes(filters.order ?? "")
    ? filters.order!
    : "lic_id";

  return { whereSql: `WHERE ${clauses.join(" AND ")}`, binds, orderField };
}

export function parseLicenseFilters(searchParams: URLSearchParams): LicenseFilters {
  const searchField = searchParams.get("searchField");
  return {
    eduLoc: fromAdminSelectValue(searchParams.get("eduLoc")),
    searchField:
      searchField === "name" || searchField === "grade_txt" ? searchField : "lic_id",
    searchKey: searchParams.get("searchKey") ?? undefined,
    order: searchParams.get("order") ?? "lic_id",
  };
}

export async function countLicenses(db: Env["DB"], filters: LicenseFilters) {
  const { whereSql, binds } = buildLicenseWhere(filters);
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS total FROM member_educations e
       LEFT JOIN yoga_members ym ON e.lic_id = ym.lic_id
       ${whereSql}`,
    )
    .bind(...binds)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function listLicenses(
  db: Env["DB"],
  filters: LicenseFilters,
  offset = 0,
  limit = ADMIN_PAGE_SIZE,
) {
  const { whereSql, binds, orderField } = buildLicenseWhere(filters);
  const result = await db
    .prepare(
      `SELECT e.*, ym.name AS member_name
       FROM member_educations e
       LEFT JOIN yoga_members ym ON e.lic_id = ym.lic_id
       ${whereSql}
       ORDER BY e.${orderField} DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<MemberLicense>();
  return result.results ?? [];
}

export async function getLicense(db: Env["DB"], id: number) {
  return db
    .prepare(
      `SELECT e.*, ym.name AS member_name
       FROM member_educations e
       LEFT JOIN yoga_members ym ON e.lic_id = ym.lic_id
       WHERE e.id = ?`,
    )
    .bind(id)
    .first<MemberLicense>();
}

export async function listLicenseEduLocOptions(db: Env["DB"]) {
  const result = await db
    .prepare(
      `SELECT DISTINCT y_name AS value FROM yoga_members
       WHERE y_name IS NOT NULL AND y_name != ''
       ORDER BY y_name`,
    )
    .all<{ value: string }>();
  return result.results?.map((r) => r.value) ?? [];
}

export async function createLicense(db: Env["DB"], input: LicenseInput) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM member_educations`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;
  const today = new Date().toISOString().slice(0, 10);

  await db
    .prepare(
      `INSERT INTO member_educations (
        id, lic_id, dscd, grade_type, grade_no, grade_txt, grade_edu_loc, name, jumin, hp,
        created, modified, hour, gubun
      ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.licId ?? null,
      input.gradeType ?? null,
      input.gradeNo ?? null,
      input.gradeTxt ?? null,
      input.gradeEduLoc ?? null,
      input.name ?? null,
      input.jumin ?? null,
      input.hp ?? null,
      input.created ?? today,
      input.modified ?? today,
      input.hour ?? "",
      input.gubun ?? "",
    )
    .run();

  return id;
}

export async function updateLicense(db: Env["DB"], id: number, input: LicenseInput) {
  const today = new Date().toISOString().slice(0, 10);
  await db
    .prepare(
      `UPDATE member_educations SET
        lic_id = ?, grade_type = ?, grade_no = ?, grade_txt = ?, grade_edu_loc = ?,
        name = ?, jumin = ?, hp = ?, modified = ?, hour = ?, gubun = ?
       WHERE id = ?`,
    )
    .bind(
      input.licId ?? null,
      input.gradeType ?? null,
      input.gradeNo ?? null,
      input.gradeTxt ?? null,
      input.gradeEduLoc ?? null,
      input.name ?? null,
      input.jumin ?? null,
      input.hp ?? null,
      input.modified ?? today,
      input.hour ?? "",
      input.gubun ?? "",
      id,
    )
    .run();
}

export async function deleteLicense(db: Env["DB"], id: number) {
  await db.prepare(`DELETE FROM member_educations WHERE id = ?`).bind(id).run();
}

export function parseLicenseFormData(formData: FormData): { input: LicenseInput; errors: string[] } {
  const errors: string[] = [];
  const licIdRaw = String(formData.get("licId") ?? "").trim();
  const licId = licIdRaw ? parseInt(licIdRaw, 10) : null;

  return {
    errors,
    input: {
      licId: licId && !Number.isNaN(licId) ? licId : null,
      gradeType: String(formData.get("gradeType") ?? "").trim() || undefined,
      gradeNo: String(formData.get("gradeNo") ?? "").trim() || undefined,
      gradeTxt: String(formData.get("gradeTxt") ?? "").trim() || undefined,
      gradeEduLoc: String(formData.get("gradeEduLoc") ?? "").trim() || undefined,
      name: String(formData.get("name") ?? "").trim() || undefined,
      jumin: String(formData.get("jumin") ?? "").trim() || undefined,
      hp: String(formData.get("hp") ?? "").trim() || undefined,
      created: String(formData.get("created") ?? "").trim() || undefined,
      hour: String(formData.get("hour") ?? "").trim() || undefined,
      gubun: String(formData.get("gubun") ?? "").trim() || undefined,
    },
  };
}

export async function listLicensesForExport(db: Env["DB"], filters: LicenseFilters) {
  const { whereSql, binds, orderField } = buildLicenseWhere(filters);
  const result = await db
    .prepare(
      `SELECT e.*, ym.name AS member_name
       FROM member_educations e
       LEFT JOIN yoga_members ym ON e.lic_id = ym.lic_id
       ${whereSql}
       ORDER BY e.${orderField} DESC`,
    )
    .bind(...binds)
    .all<MemberLicense>();
  return result.results ?? [];
}

export function buildLicensesCsv(licenses: MemberLicense[]) {
  const headers = ["자격번호", "이름", "종목 및 급수", "교육기관", "등록일"];
  const rows = licenses.map((l) => [
    String(l.lic_id ?? ""),
    l.member_name ?? l.name ?? "",
    l.grade_txt ?? "",
    l.grade_edu_loc ?? "",
    l.created ?? "",
  ]);
  return { csv: buildCsv(headers, rows), filename: "자격증현황.csv" };
}
