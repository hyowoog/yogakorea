import { fromAdminSelectValue } from "~/lib/admin-form";
import { ADMIN_PAGE_SIZE } from "~/lib/admin-pagination";
import { buildCsv } from "~/lib/csv.server";

export interface YogaMember {
  id: number;
  lic_id: number | null;
  name: string | null;
  ename: string | null;
  birth: string | null;
  sex: string | null;
  member_dscd: string | null;
  lic_date: string | null;
  reg_date: string | null;
  retire_date: string | null;
  area_dscd: string | null;
  edu_loc: string | null;
  email: string | null;
  phone: string | null;
  hp: string | null;
  zipcode: string | null;
  addr: string | null;
  area_auth: string | null;
  login_id: string | null;
  login_pwd: string | null;
  edu_dscd: string | null;
  edu_auth: string | null;
  mem_auth: string | null;
  grade: string | null;
  jumin: string | null;
  etc: string | null;
  y_name: string | null;
  y_area: string | null;
  last_pay_date?: string | null;
}

export interface YogaMemberInput {
  name: string;
  ename?: string;
  birth?: string;
  sex?: string;
  memberDscd?: string;
  licDate?: string;
  regDate?: string;
  retireDate?: string;
  areaDscd?: string;
  eduLoc?: string;
  email?: string;
  phone?: string;
  hp?: string;
  zipcode?: string;
  addr?: string;
  areaAuth?: string;
  loginId?: string;
  loginPwd?: string;
  eduAuth?: string;
  grade?: string;
  etc?: string;
  yName?: string;
  yArea?: string;
}

export interface YogaMemberFilters {
  eduLoc?: string;
  area?: string;
  yArea?: string;
  yName?: string;
  name?: string;
  hp?: string;
  licId?: string;
  payMonth?: string;
  memberDscd?: string;
  grade?: string;
  search?: string;
  order?: "asc" | "desc";
}

export interface YogaPayment {
  id: number;
  lic_id: number;
  pay_date: string | null;
  pay_amount: number | null;
  pay_yy: string | null;
  pay_etc: string | null;
}

export interface YogaPaymentInput {
  licId: number;
  payDate: string;
  payAmount: number;
  payYy: string;
  payEtc?: string;
}

function buildMemberWhere(filters: YogaMemberFilters) {
  const clauses = ["name IS NOT NULL AND name != ''"];
  const binds: (string | number)[] = [];

  if (filters.eduLoc) {
    clauses.push("edu_loc = ?");
    binds.push(filters.eduLoc);
  }
  if (filters.area) {
    clauses.push("area_dscd = ?");
    binds.push(filters.area);
  }
  if (filters.yArea) {
    clauses.push("y_area = ?");
    binds.push(filters.yArea);
  }
  if (filters.yName) {
    clauses.push("y_name LIKE ?");
    binds.push(`%${filters.yName}%`);
  }
  if (filters.name) {
    clauses.push("name LIKE ?");
    binds.push(`%${filters.name}%`);
  }
  if (filters.hp) {
    clauses.push("hp LIKE ?");
    binds.push(`%${filters.hp}%`);
  }
  if (filters.licId) {
    clauses.push("CAST(lic_id AS TEXT) LIKE ?");
    binds.push(`${filters.licId}%`);
  }
  if (filters.payMonth) {
    clauses.push("reg_date LIKE ?");
    binds.push(`%-${filters.payMonth}-%`);
  }
  if (filters.memberDscd) {
    clauses.push("member_dscd = ?");
    binds.push(filters.memberDscd);
  }
  if (filters.grade) {
    clauses.push("grade = ?");
    binds.push(filters.grade);
  }
  if (filters.search) {
    clauses.push("(name LIKE ? OR hp LIKE ?)");
    binds.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  const order = filters.order === "asc" ? "ASC" : "DESC";
  return { whereSql: `WHERE ${clauses.join(" AND ")}`, binds, order };
}

export function parseMemberFilters(searchParams: URLSearchParams): YogaMemberFilters {
  const order = searchParams.get("order");
  return {
    eduLoc: fromAdminSelectValue(searchParams.get("eduLoc")),
    area: fromAdminSelectValue(searchParams.get("area")),
    yArea: searchParams.get("yArea") ?? undefined,
    yName: searchParams.get("yName") ?? undefined,
    name: searchParams.get("name") ?? undefined,
    hp: searchParams.get("hp") ?? undefined,
    licId: searchParams.get("licId") ?? undefined,
    payMonth: searchParams.get("payMonth") ?? undefined,
    memberDscd: fromAdminSelectValue(searchParams.get("memberDscd")),
    grade: fromAdminSelectValue(searchParams.get("grade")),
    search: searchParams.get("search") ?? undefined,
    order: order === "asc" ? "asc" : "desc",
  };
}

export async function countYogaMembers(db: Env["DB"], filters: YogaMemberFilters) {
  const { whereSql, binds } = buildMemberWhere(filters);
  const row = await db
    .prepare(`SELECT COUNT(*) AS total FROM yoga_members ${whereSql}`)
    .bind(...binds)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function listYogaMembers(
  db: Env["DB"],
  filters: YogaMemberFilters,
  offset = 0,
  limit = ADMIN_PAGE_SIZE,
) {
  const { whereSql, binds, order } = buildMemberWhere(filters);
  const result = await db
    .prepare(
      `SELECT m.*,
        (SELECT pay_date FROM yoga_payments p
         WHERE p.lic_id = m.lic_id
         ORDER BY pay_yy DESC, pay_date DESC LIMIT 1) AS last_pay_date
       FROM yoga_members m
       ${whereSql}
       ORDER BY lic_id ${order}
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<YogaMember>();
  return result.results ?? [];
}

export async function getYogaMemberByLicId(db: Env["DB"], licId: number) {
  return db
    .prepare(`SELECT * FROM yoga_members WHERE lic_id = ?`)
    .bind(licId)
    .first<YogaMember>();
}

export async function listMemberFilterOptions(db: Env["DB"]) {
  const [memberDscd, eduLoc, area, yArea] = await Promise.all([
    db
      .prepare(
        `SELECT DISTINCT member_dscd AS value FROM yoga_members
         WHERE member_dscd IS NOT NULL AND member_dscd != ''
         ORDER BY member_dscd`,
      )
      .all<{ value: string }>(),
    db
      .prepare(
        `SELECT DISTINCT y_name AS value FROM yoga_members
         WHERE y_name IS NOT NULL AND y_name != ''
         ORDER BY y_name`,
      )
      .all<{ value: string }>(),
    db
      .prepare(
        `SELECT DISTINCT area_dscd AS value FROM yoga_members
         WHERE area_dscd IS NOT NULL AND area_dscd != ''
         ORDER BY area_dscd`,
      )
      .all<{ value: string }>(),
    db
      .prepare(
        `SELECT DISTINCT y_area AS value FROM yoga_members
         WHERE y_area IS NOT NULL AND y_area != ''
         ORDER BY y_area`,
      )
      .all<{ value: string }>(),
  ]);

  return {
    memberDscd: memberDscd.results?.map((r) => r.value) ?? [],
    eduLoc: eduLoc.results?.map((r) => r.value) ?? [],
    area: area.results?.map((r) => r.value) ?? [],
    yArea: yArea.results?.map((r) => r.value) ?? [],
  };
}

export async function createYogaMember(db: Env["DB"], input: YogaMemberInput) {
  const maxLic = await db
    .prepare(`SELECT COALESCE(MAX(lic_id), 0) AS max_lic FROM yoga_members`)
    .first<{ max_lic: number }>();
  const licId = (maxLic?.max_lic ?? 0) + 1;

  await db
    .prepare(
      `INSERT INTO yoga_members (
        lic_id, grade, name, ename, birth, sex, login_id, login_pwd, edu_loc, edu_auth,
        member_dscd, lic_date, reg_date, retire_date, area_dscd, area_auth, y_name, y_area,
        phone, hp, email, zipcode, addr, etc
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      licId,
      input.grade ?? null,
      input.name,
      input.ename ?? null,
      input.birth ?? null,
      input.sex ?? null,
      input.loginId ?? null,
      input.loginPwd ?? null,
      input.eduLoc ?? null,
      input.eduAuth ?? null,
      input.memberDscd ?? null,
      input.licDate ?? null,
      input.regDate ?? null,
      input.retireDate ?? null,
      input.areaDscd ?? null,
      input.areaAuth ?? null,
      input.yName ?? null,
      input.yArea ?? null,
      input.phone ?? null,
      input.hp ?? null,
      input.email ?? null,
      input.zipcode ?? null,
      input.addr ?? null,
      input.etc ?? null,
    )
    .run();

  return licId;
}

export async function updateYogaMember(db: Env["DB"], licId: number, input: YogaMemberInput) {
  await db
    .prepare(
      `UPDATE yoga_members SET
        grade = ?, name = ?, ename = ?, birth = ?, sex = ?, login_id = ?, login_pwd = ?,
        edu_loc = ?, edu_auth = ?, member_dscd = ?, lic_date = ?, reg_date = ?, retire_date = ?,
        area_dscd = ?, area_auth = ?, y_name = ?, y_area = ?, phone = ?, hp = ?, email = ?,
        zipcode = ?, addr = ?, etc = ?
       WHERE lic_id = ?`,
    )
    .bind(
      input.grade ?? null,
      input.name,
      input.ename ?? null,
      input.birth ?? null,
      input.sex ?? null,
      input.loginId ?? null,
      input.loginPwd ?? null,
      input.eduLoc ?? null,
      input.eduAuth ?? null,
      input.memberDscd ?? null,
      input.licDate ?? null,
      input.regDate ?? null,
      input.retireDate ?? null,
      input.areaDscd ?? null,
      input.areaAuth ?? null,
      input.yName ?? null,
      input.yArea ?? null,
      input.phone ?? null,
      input.hp ?? null,
      input.email ?? null,
      input.zipcode ?? null,
      input.addr ?? null,
      input.etc ?? null,
      licId,
    )
    .run();
}

export function parseYogaMemberFormData(formData: FormData): {
  input: YogaMemberInput;
  errors: string[];
} {
  const name = String(formData.get("name") ?? "").trim();
  const errors: string[] = [];
  if (!name) errors.push("이름을 입력해 주세요.");

  return {
    errors,
    input: {
      name,
      ename: String(formData.get("ename") ?? "").trim() || undefined,
      birth: String(formData.get("birth") ?? "").trim() || undefined,
      sex: String(formData.get("sex") ?? "").trim() || undefined,
      memberDscd: String(formData.get("memberDscd") ?? "").trim() || undefined,
      licDate: String(formData.get("licDate") ?? "").trim() || undefined,
      regDate: String(formData.get("regDate") ?? "").trim() || undefined,
      retireDate: String(formData.get("retireDate") ?? "").trim() || undefined,
      areaDscd: String(formData.get("areaDscd") ?? "").trim() || undefined,
      eduLoc: String(formData.get("eduLoc") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      hp: String(formData.get("hp") ?? "").trim() || undefined,
      zipcode: String(formData.get("zipcode") ?? "").trim() || undefined,
      addr: String(formData.get("addr") ?? "").trim() || undefined,
      areaAuth: String(formData.get("areaAuth") ?? "").trim() || undefined,
      loginId: String(formData.get("loginId") ?? "").trim() || undefined,
      loginPwd: String(formData.get("loginPwd") ?? "").trim() || undefined,
      eduAuth: String(formData.get("eduAuth") ?? "").trim() || undefined,
      grade: String(formData.get("grade") ?? "").trim() || undefined,
      etc: String(formData.get("etc") ?? "").trim() || undefined,
      yName: String(formData.get("yName") ?? "").trim() || undefined,
      yArea: String(formData.get("yArea") ?? "").trim() || undefined,
    },
  };
}

export async function listYogaPayments(db: Env["DB"], licId: number) {
  const result = await db
    .prepare(
      `SELECT * FROM yoga_payments WHERE lic_id = ? ORDER BY pay_yy DESC, pay_date DESC`,
    )
    .bind(licId)
    .all<YogaPayment>();
  return result.results ?? [];
}

export async function createYogaPayment(db: Env["DB"], input: YogaPaymentInput) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM yoga_payments`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;

  await db
    .prepare(
      `INSERT INTO yoga_payments (id, lic_id, pay_date, pay_amount, pay_yy, pay_etc)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, input.licId, input.payDate, input.payAmount, input.payYy, input.payEtc ?? null)
    .run();

  return id;
}

export async function updateYogaPayment(db: Env["DB"], id: number, input: Omit<YogaPaymentInput, "licId">) {
  await db
    .prepare(
      `UPDATE yoga_payments SET pay_date = ?, pay_amount = ?, pay_yy = ?, pay_etc = ? WHERE id = ?`,
    )
    .bind(input.payDate, input.payAmount, input.payYy, input.payEtc ?? null, id)
    .run();
}

export async function deleteYogaPayment(db: Env["DB"], id: number) {
  await db.prepare(`DELETE FROM yoga_payments WHERE id = ?`).bind(id).run();
}

export async function listYogaMembersForExport(db: Env["DB"], filters: YogaMemberFilters) {
  const { whereSql, binds, order } = buildMemberWhere(filters);
  const result = await db
    .prepare(`SELECT * FROM yoga_members ${whereSql} ORDER BY lic_id ${order}`)
    .bind(...binds)
    .all<YogaMember>();
  return result.results ?? [];
}

export function buildMembersCsv(members: YogaMember[]) {
  const headers = [
    "자격번호",
    "이름",
    "회원구분",
    "입회일",
    "권역구분",
    "교육기관",
    "요가원",
    "휴대전화",
    "이메일",
    "급수",
  ];
  const rows = members.map((m) => [
    String(m.lic_id ?? ""),
    m.name ?? "",
    m.member_dscd ?? "",
    m.reg_date ?? "",
    m.area_dscd ?? "",
    m.edu_loc ?? "",
    m.y_name ?? "",
    m.hp ?? "",
    m.email ?? "",
    m.grade ?? "",
  ]);
  return { csv: buildCsv(headers, rows), filename: "회원목록.csv" };
}
