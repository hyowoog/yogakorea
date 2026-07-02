import { fromAdminSelectValue } from "~/lib/admin-form";
import { ADMIN_PAGE_SIZE } from "~/lib/admin-pagination";
import { buildCsv } from "~/lib/csv.server";

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

export interface BranchInput {
  yPart?: string;
  yType?: string;
  yName: string;
  yCeo?: string;
  yZipcode?: string;
  yAddr?: string;
  yHp?: string;
  yPhone?: string;
  yRegDate?: string;
  yEmail?: string;
  yHomepage?: string;
  yYn?: string;
  yAreaDscd?: string;
  yRetireDate?: string;
  yPay?: string;
  yEtc?: string;
  yEtc2?: string;
}

export interface BranchFilters {
  areaDscd?: string;
  yType?: string;
  yName?: string;
  yCeo?: string;
  yYn?: string;
}

function buildBranchWhere(filters: BranchFilters) {
  const clauses = ["y_name IS NOT NULL"];
  const binds: string[] = [];

  if (filters.areaDscd) {
    clauses.push("y_area_dscd = ?");
    binds.push(filters.areaDscd);
  }
  if (filters.yType) {
    clauses.push("y_type = ?");
    binds.push(filters.yType);
  }
  if (filters.yName) {
    clauses.push("y_name LIKE ?");
    binds.push(`%${filters.yName}%`);
  }
  if (filters.yCeo) {
    clauses.push("y_ceo LIKE ?");
    binds.push(`%${filters.yCeo}%`);
  }
  if (filters.yYn) {
    clauses.push("y_yn = ?");
    binds.push(filters.yYn);
  }

  return { whereSql: `WHERE ${clauses.join(" AND ")}`, binds };
}

export function parseBranchFilters(searchParams: URLSearchParams): BranchFilters {
  return {
    areaDscd: fromAdminSelectValue(searchParams.get("areaDscd")),
    yType: fromAdminSelectValue(searchParams.get("yType")),
    yName: searchParams.get("yName") ?? undefined,
    yCeo: searchParams.get("yCeo") ?? undefined,
    yYn: fromAdminSelectValue(searchParams.get("yYn")),
  };
}

export async function countBranches(db: Env["DB"], filters: BranchFilters) {
  const { whereSql, binds } = buildBranchWhere(filters);
  const row = await db
    .prepare(`SELECT COUNT(*) AS total FROM yoga_branches ${whereSql}`)
    .bind(...binds)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function listBranches(
  db: Env["DB"],
  filters: BranchFilters,
  offset = 0,
  limit = ADMIN_PAGE_SIZE,
) {
  const { whereSql, binds } = buildBranchWhere(filters);
  const result = await db
    .prepare(
      `SELECT * FROM yoga_branches ${whereSql} ORDER BY y_reg_date DESC LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<YogaBranch>();
  return result.results ?? [];
}

export async function getBranch(db: Env["DB"], id: number) {
  return db.prepare(`SELECT * FROM yoga_branches WHERE id = ?`).bind(id).first<YogaBranch>();
}

export async function listBranchFilterOptions(db: Env["DB"]) {
  const [areas, types] = await Promise.all([
    db
      .prepare(
        `SELECT DISTINCT y_area_dscd AS value FROM yoga_branches
         WHERE y_area_dscd IS NOT NULL AND y_area_dscd != ''
         ORDER BY y_area_dscd`,
      )
      .all<{ value: string }>(),
    db
      .prepare(
        `SELECT DISTINCT y_type AS value FROM yoga_branches
         WHERE y_type IS NOT NULL AND y_type != ''
         ORDER BY y_type`,
      )
      .all<{ value: string }>(),
  ]);

  return {
    areas: areas.results?.map((r) => r.value) ?? [],
    types: types.results?.map((r) => r.value) ?? [],
  };
}

export async function createBranch(db: Env["DB"], input: BranchInput) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM yoga_branches`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;

  await db
    .prepare(
      `INSERT INTO yoga_branches (
        id, y_part, y_type, y_name, y_ceo, y_zipcode, y_addr, y_hp, y_phone, y_reg_date,
        y_email, y_homepage, y_yn, y_area_dscd, y_retire_date, y_pay, y_etc, y_etc2
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.yPart ?? null,
      input.yType ?? null,
      input.yName,
      input.yCeo ?? null,
      input.yZipcode ?? null,
      input.yAddr ?? null,
      input.yHp ?? null,
      input.yPhone ?? null,
      input.yRegDate ?? null,
      input.yEmail ?? null,
      input.yHomepage ?? null,
      input.yYn ?? "Y",
      input.yAreaDscd ?? null,
      input.yRetireDate ?? null,
      input.yPay ?? null,
      input.yEtc ?? null,
      input.yEtc2 ?? "",
    )
    .run();

  return id;
}

export async function updateBranch(db: Env["DB"], id: number, input: BranchInput) {
  await db
    .prepare(
      `UPDATE yoga_branches SET
        y_part = ?, y_type = ?, y_name = ?, y_ceo = ?, y_zipcode = ?, y_addr = ?,
        y_hp = ?, y_phone = ?, y_reg_date = ?, y_email = ?, y_homepage = ?, y_yn = ?,
        y_area_dscd = ?, y_retire_date = ?, y_pay = ?, y_etc = ?, y_etc2 = ?
       WHERE id = ?`,
    )
    .bind(
      input.yPart ?? null,
      input.yType ?? null,
      input.yName,
      input.yCeo ?? null,
      input.yZipcode ?? null,
      input.yAddr ?? null,
      input.yHp ?? null,
      input.yPhone ?? null,
      input.yRegDate ?? null,
      input.yEmail ?? null,
      input.yHomepage ?? null,
      input.yYn ?? "Y",
      input.yAreaDscd ?? null,
      input.yRetireDate ?? null,
      input.yPay ?? null,
      input.yEtc ?? null,
      input.yEtc2 ?? "",
      id,
    )
    .run();
}

export async function deleteBranch(db: Env["DB"], id: number) {
  await db.prepare(`DELETE FROM yoga_branches WHERE id = ?`).bind(id).run();
}

export function parseBranchFormData(formData: FormData): { input: BranchInput; errors: string[] } {
  const yName = String(formData.get("yName") ?? "").trim();
  const errors: string[] = [];
  if (!yName) errors.push("요가원명을 입력해 주세요.");

  return {
    errors,
    input: {
      yPart: String(formData.get("yPart") ?? "").trim() || undefined,
      yType: String(formData.get("yType") ?? "").trim() || undefined,
      yName,
      yCeo: String(formData.get("yCeo") ?? "").trim() || undefined,
      yZipcode: String(formData.get("yZipcode") ?? "").trim() || undefined,
      yAddr: String(formData.get("yAddr") ?? "").trim() || undefined,
      yHp: String(formData.get("yHp") ?? "").trim() || undefined,
      yPhone: String(formData.get("yPhone") ?? "").trim() || undefined,
      yRegDate: String(formData.get("yRegDate") ?? "").trim() || undefined,
      yEmail: String(formData.get("yEmail") ?? "").trim() || undefined,
      yHomepage: String(formData.get("yHomepage") ?? "").trim() || undefined,
      yYn: String(formData.get("yYn") ?? "").trim() || "Y",
      yAreaDscd: String(formData.get("yAreaDscd") ?? "").trim() || undefined,
      yRetireDate: String(formData.get("yRetireDate") ?? "").trim() || undefined,
      yPay: String(formData.get("yPay") ?? "").trim() || undefined,
      yEtc: String(formData.get("yEtc") ?? "").trim() || undefined,
      yEtc2: String(formData.get("yEtc2") ?? "").trim() || undefined,
    },
  };
}

export async function listBranchesForExport(db: Env["DB"], filters: BranchFilters) {
  const { whereSql, binds } = buildBranchWhere(filters);
  const result = await db
    .prepare(`SELECT * FROM yoga_branches ${whereSql} ORDER BY id`)
    .bind(...binds)
    .all<YogaBranch>();
  return result.results ?? [];
}

export function buildBranchesCsv(branches: YogaBranch[]) {
  const headers = ["권역", "구분", "요가원명", "원장", "연락처", "주소", "사용여부", "등록일"];
  const rows = branches.map((b) => [
    b.y_area_dscd ?? "",
    b.y_type ?? "",
    b.y_name ?? "",
    b.y_ceo ?? "",
    b.y_hp ?? b.y_phone ?? "",
    b.y_addr ?? "",
    b.y_yn ?? "",
    b.y_reg_date ?? "",
  ]);
  return { csv: buildCsv(headers, rows), filename: "요가원목록.csv" };
}
