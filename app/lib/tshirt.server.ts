import { TSHIRT_COLORS, TSHIRT_SIZE_OPTIONS, formatTshirtColor } from "~/lib/tshirt-constants";

export interface TshirtOrder {
  id: number;
  name: string;
  mobile: string;
  studio_name: string;
  color: string;
  size_code: string;
  created_at: string;
}

export interface TshirtOrderInput {
  name: string;
  mobile: string;
  studioName: string;
  color: string;
  sizeCode: string;
}

function formatTimestamp(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function listTshirtOrders(db: Env["DB"]) {
  const result = await db
    .prepare(`SELECT * FROM tshirt_orders ORDER BY name ASC, id ASC`)
    .all<TshirtOrder>();
  return result.results ?? [];
}

export async function getTshirtOrder(db: Env["DB"], id: number) {
  return db.prepare(`SELECT * FROM tshirt_orders WHERE id = ?`).bind(id).first<TshirtOrder>();
}

export async function createTshirtOrder(db: Env["DB"], input: TshirtOrderInput) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM tshirt_orders`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;
  const now = formatTimestamp();

  await db
    .prepare(
      `INSERT INTO tshirt_orders (id, name, mobile, studio_name, color, size_code, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, input.name, input.mobile, input.studioName, input.color, input.sizeCode, now)
    .run();

  return id;
}

export async function updateTshirtOrder(db: Env["DB"], id: number, input: TshirtOrderInput) {
  await db
    .prepare(
      `UPDATE tshirt_orders
       SET name = ?, mobile = ?, studio_name = ?, color = ?, size_code = ?
       WHERE id = ?`,
    )
    .bind(input.name, input.mobile, input.studioName, input.color, input.sizeCode, id)
    .run();
}

export async function deleteTshirtOrder(db: Env["DB"], id: number) {
  await db.prepare(`DELETE FROM tshirt_orders WHERE id = ?`).bind(id).run();
}

export function parseTshirtFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const studioName = String(formData.get("studioName") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const sizeCode = String(formData.get("sizeCode") ?? "").trim();

  const errors: string[] = [];
  if (!name) errors.push("이름을 입력해 주세요.");
  if (!mobile) errors.push("휴대전화를 입력해 주세요.");
  if (!studioName) errors.push("요가원명을 입력해 주세요.");
  if (!color || !TSHIRT_COLORS.includes(color as (typeof TSHIRT_COLORS)[number])) {
    errors.push("색상을 선택해 주세요.");
  }
  if (!sizeCode || !TSHIRT_SIZE_OPTIONS.some((option) => option.code === sizeCode)) {
    errors.push("사이즈를 선택해 주세요.");
  }

  return {
    errors,
    input: { name, mobile, studioName, color, sizeCode } satisfies TshirtOrderInput,
  };
}

function csvEscape(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildTshirtOrdersCsv(orders: TshirtOrder[]) {
  const headers = ["이름", "휴대전화", "색상", "사이즈", "요가원명", "신청일시"];
  const lines = [`\uFEFF${headers.map(csvEscape).join(",")}`];

  for (const order of orders) {
    lines.push(
      [
        order.name,
        order.mobile,
        formatTshirtColor(order.color),
        order.size_code,
        order.studio_name,
        order.created_at,
      ]
        .map(csvEscape)
        .join(","),
    );
  }

  return { csv: lines.join("\n"), filename: "티셔츠신청리스트.csv" };
}
