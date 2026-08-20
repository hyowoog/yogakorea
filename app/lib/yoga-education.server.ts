import { fromAdminSelectValue } from "~/lib/admin-form";
import { ADMIN_PAGE_SIZE } from "~/lib/admin-pagination";
import { buildCsv } from "~/lib/csv.server";
import { formatEducationGubun } from "~/lib/yoga-constants";

export interface YogaMemGrade {
  id: number;
  lic_id: number | null;
  dscd: string | null;
  grade_type: string | null;
  grade_no: string | null;
  grade_txt: string | null;
  grade_edu_loc: string | null;
  name: string | null;
  jumin: string | null;
  hp: string | null;
  bas_date: string | null;
  chg_date: string | null;
  hour: string | null;
  gubun: string | null;
  member_name?: string | null;
}

export interface EducationInput {
  licId?: number | null;
  dscd?: string;
  gradeType?: string;
  gradeNo?: string;
  gradeTxt?: string;
  gradeEduLoc?: string;
  name?: string;
  jumin?: string;
  hp?: string;
  basDate?: string;
  chgDate?: string;
  hour?: string;
  gubun?: string;
}

export interface EducationFilters {
  eduLoc?: string;
  searchField?: "lic_id" | "name" | "grade_txt";
  searchKey?: string;
  guest?: boolean;
}

function buildEducationWhere(filters: EducationFilters) {
  const clauses = ["g.id > 0"];
  const binds: (string | number)[] = [];

  if (filters.guest) {
    clauses.push("(g.lic_id IS NULL OR g.lic_id = 0)");
  }
  if (filters.eduLoc) {
    clauses.push("g.grade_edu_loc = ?");
    binds.push(filters.eduLoc);
  }
  if (filters.searchField && filters.searchKey) {
    if (filters.searchField === "name") {
      clauses.push("(ym.name LIKE ? OR g.name LIKE ?)");
      binds.push(`%${filters.searchKey}%`, `%${filters.searchKey}%`);
    } else if (filters.searchField === "lic_id") {
      clauses.push("CAST(g.lic_id AS TEXT) LIKE ?");
      binds.push(`%${filters.searchKey}%`);
    } else {
      clauses.push("g.grade_txt LIKE ?");
      binds.push(`%${filters.searchKey}%`);
    }
  }

  return { whereSql: `WHERE ${clauses.join(" AND ")}`, binds };
}

export function parseEducationFilters(searchParams: URLSearchParams): EducationFilters {
  const searchField = searchParams.get("searchField");
  return {
    eduLoc: fromAdminSelectValue(searchParams.get("eduLoc")),
    searchField:
      searchField === "name" || searchField === "grade_txt" ? searchField : "lic_id",
    searchKey: searchParams.get("searchKey") ?? undefined,
    guest: searchParams.get("guest") === "1",
  };
}

export async function countEducations(db: Env["DB"], filters: EducationFilters) {
  const { whereSql, binds } = buildEducationWhere(filters);
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS total FROM yoga_mem_grades g
       LEFT JOIN yoga_members ym ON g.lic_id = ym.lic_id
       ${whereSql}`,
    )
    .bind(...binds)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function listEducations(
  db: Env["DB"],
  filters: EducationFilters,
  offset = 0,
  limit = ADMIN_PAGE_SIZE,
) {
  const { whereSql, binds } = buildEducationWhere(filters);
  const result = await db
    .prepare(
      `SELECT g.*, ym.name AS member_name
       FROM yoga_mem_grades g
       LEFT JOIN yoga_members ym ON g.lic_id = ym.lic_id
       ${whereSql}
       ORDER BY g.id DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<YogaMemGrade>();
  return result.results ?? [];
}

export async function getEducation(db: Env["DB"], id: number) {
  return db
    .prepare(
      `SELECT g.*, ym.name AS member_name
       FROM yoga_mem_grades g
       LEFT JOIN yoga_members ym ON g.lic_id = ym.lic_id
       WHERE g.id = ?`,
    )
    .bind(id)
    .first<YogaMemGrade>();
}

export async function createEducation(db: Env["DB"], input: EducationInput) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM yoga_mem_grades`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;

  await db
    .prepare(
      `INSERT INTO yoga_mem_grades (
        id, lic_id, dscd, grade_type, grade_no, grade_txt, grade_edu_loc, name, jumin, hp,
        bas_date, chg_date, hour, gubun
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.licId ?? null,
      input.dscd ?? "",
      input.gradeType ?? null,
      input.gradeNo ?? null,
      input.gradeTxt ?? null,
      input.gradeEduLoc ?? null,
      input.name ?? null,
      input.jumin ?? null,
      input.hp ?? null,
      input.basDate ?? null,
      input.chgDate ?? null,
      input.hour ?? "",
      input.gubun ?? "",
    )
    .run();

  return id;
}

export async function createEducations(
  db: Env["DB"],
  input: EducationInput,
  licIds: number[],
) {
  const uniqueLicIds = [...new Set(licIds)];
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM yoga_mem_grades`)
    .first<{ max_id: number }>();
  let nextId = maxRow?.max_id ?? 0;

  const nameByLicId = new Map<number, string | null>();
  if (uniqueLicIds.length > 0) {
    const members = await db
      .prepare(
        `SELECT lic_id, name FROM yoga_members WHERE lic_id IN (${uniqueLicIds.map(() => "?").join(",")})`,
      )
      .bind(...uniqueLicIds)
      .all<{ lic_id: number; name: string | null }>();
    for (const member of members.results ?? []) {
      nameByLicId.set(member.lic_id, member.name);
    }
  }

  const statements = uniqueLicIds.map((licId) => {
    nextId += 1;
    return db
      .prepare(
        `INSERT INTO yoga_mem_grades (
          id, lic_id, dscd, grade_type, grade_no, grade_txt, grade_edu_loc, name, jumin, hp,
          bas_date, chg_date, hour, gubun
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        nextId,
        licId,
        input.dscd ?? "",
        input.gradeType ?? null,
        input.gradeNo ?? null,
        input.gradeTxt ?? null,
        input.gradeEduLoc ?? null,
        nameByLicId.get(licId) ?? input.name ?? null,
        input.jumin ?? null,
        input.hp ?? null,
        input.basDate ?? null,
        input.chgDate ?? null,
        input.hour ?? "",
        input.gubun ?? "",
      );
  });

  const chunkSize = 50;
  for (let index = 0; index < statements.length; index += chunkSize) {
    await db.batch(statements.slice(index, index + chunkSize));
  }

  return {
    firstId: uniqueLicIds.length ? (maxRow?.max_id ?? 0) + 1 : null,
    count: uniqueLicIds.length,
  };
}

export async function updateEducation(db: Env["DB"], id: number, input: EducationInput) {
  await db
    .prepare(
      `UPDATE yoga_mem_grades SET
        lic_id = ?, grade_type = ?, grade_no = ?, grade_txt = ?, grade_edu_loc = ?,
        name = ?, jumin = ?, hp = ?, bas_date = ?, chg_date = ?, hour = ?, gubun = ?
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
      input.basDate ?? null,
      input.chgDate ?? null,
      input.hour ?? "",
      input.gubun ?? "",
      id,
    )
    .run();
}

export async function deleteEducation(db: Env["DB"], id: number) {
  await db.prepare(`DELETE FROM yoga_mem_grades WHERE id = ?`).bind(id).run();
}

export function parseEducationFormData(formData: FormData): {
  input: EducationInput;
  errors: string[];
} {
  const licIdRaw = String(formData.get("licId") ?? "").trim();
  const licId = licIdRaw ? parseInt(licIdRaw, 10) : null;

  return {
    errors: [],
    input: {
      licId: licId && !Number.isNaN(licId) ? licId : null,
      dscd: String(formData.get("dscd") ?? "").trim() || undefined,
      gradeType: String(formData.get("gradeType") ?? "").trim() || undefined,
      gradeNo: String(formData.get("gradeNo") ?? "").trim() || undefined,
      gradeTxt: String(formData.get("gradeTxt") ?? "").trim() || undefined,
      gradeEduLoc: String(formData.get("gradeEduLoc") ?? "").trim() || undefined,
      name: String(formData.get("name") ?? "").trim() || undefined,
      jumin: String(formData.get("jumin") ?? "").trim() || undefined,
      hp: String(formData.get("hp") ?? "").trim() || undefined,
      basDate: String(formData.get("basDate") ?? "").trim() || undefined,
      chgDate: String(formData.get("chgDate") ?? "").trim() || undefined,
      hour: String(formData.get("hour") ?? "").trim() || undefined,
      gubun: (() => {
        const value = String(formData.get("gubun") ?? "").trim();
        if (value === "0") return "";
        return value || undefined;
      })(),
    },
  };
}

export function parseBulkEducationFormData(formData: FormData): {
  input: EducationInput;
  licIds: number[];
  errors: string[];
} {
  const parsed = parseEducationFormData(formData);
  const licIds = [
    ...new Set(
      formData
        .getAll("licId")
        .map((value) => String(value).trim())
        .filter(Boolean)
        .map((value) => parseInt(value, 10))
        .filter((value) => !Number.isNaN(value) && value > 0),
    ),
  ];

  const errors = [...parsed.errors];
  if (!parsed.input.basDate) errors.push("취득일자를 입력해 주세요.");
  if (licIds.length === 0) errors.push("자격번호를 하나 이상 입력해 주세요.");

  return { input: parsed.input, licIds, errors };
}

export function parseGuestEducationFormData(formData: FormData): {
  input: EducationInput;
  errors: string[];
} {
  const parsed = parseEducationFormData(formData);
  const errors = [...parsed.errors];
  if (!parsed.input.name) errors.push("성명을 입력해 주세요.");
  if (!parsed.input.basDate) errors.push("취득일자를 입력해 주세요.");
  return {
    input: { ...parsed.input, licId: null },
    errors,
  };
}

export async function listEducationsForExport(db: Env["DB"], filters: EducationFilters) {
  const { whereSql, binds } = buildEducationWhere(filters);
  const result = await db
    .prepare(
      `SELECT g.*, ym.name AS member_name
       FROM yoga_mem_grades g
       LEFT JOIN yoga_members ym ON g.lic_id = ym.lic_id
       ${whereSql}
       ORDER BY g.id DESC`,
    )
    .bind(...binds)
    .all<YogaMemGrade>();
  return result.results ?? [];
}

export function buildEducationsCsv(educations: YogaMemGrade[]) {
  const headers = ["기준일자", "자격번호", "이름", "구분", "교육내용", "교육기관"];
  const rows = educations.map((e) => [
    e.bas_date ?? "",
    String(e.lic_id ?? ""),
    e.member_name ?? e.name ?? "",
    formatEducationGubun(e.gubun),
    e.grade_txt ?? "",
    e.grade_edu_loc ?? "",
  ]);
  return { csv: buildCsv(headers, rows), filename: "교육이수.csv" };
}

export async function listEducationEduLocOptions(db: Env["DB"]) {
  const result = await db
    .prepare(
      `SELECT DISTINCT grade_edu_loc AS value FROM yoga_mem_grades
       WHERE grade_edu_loc IS NOT NULL AND grade_edu_loc != ''
       ORDER BY grade_edu_loc`,
    )
    .all<{ value: string }>();
  return result.results?.map((r) => r.value) ?? [];
}
