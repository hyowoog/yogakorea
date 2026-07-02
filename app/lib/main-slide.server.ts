export interface MainSlide {
  id: number;
  image_path: string;
  caption: string | null;
  sort_order: number;
  is_active: number;
  created_at: string | null;
}

export interface MainSlideInput {
  imagePath: string;
  caption?: string;
  sortOrder: number;
  isActive: boolean;
}

function formatTimestamp(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function listAllMainSlides(db: Env["DB"]) {
  const result = await db
    .prepare(`SELECT * FROM main_slides ORDER BY sort_order ASC, id ASC`)
    .all<MainSlide>();
  return result.results ?? [];
}

export async function getMainSlide(db: Env["DB"], id: number) {
  return db.prepare(`SELECT * FROM main_slides WHERE id = ?`).bind(id).first<MainSlide>();
}

export async function createMainSlide(db: Env["DB"], input: MainSlideInput) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM main_slides`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;
  const now = formatTimestamp();

  await db
    .prepare(
      `INSERT INTO main_slides (id, image_path, caption, sort_order, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.imagePath,
      input.caption ?? null,
      input.sortOrder,
      input.isActive ? 1 : 0,
      now,
    )
    .run();

  return id;
}

export async function updateMainSlide(db: Env["DB"], id: number, input: MainSlideInput) {
  await db
    .prepare(
      `UPDATE main_slides SET image_path = ?, caption = ?, sort_order = ?, is_active = ? WHERE id = ?`,
    )
    .bind(input.imagePath, input.caption ?? null, input.sortOrder, input.isActive ? 1 : 0, id)
    .run();
}

export async function deleteMainSlide(db: Env["DB"], id: number) {
  await db.prepare(`DELETE FROM main_slides WHERE id = ?`).bind(id).run();
}

export function parseMainSlideFormData(formData: FormData): {
  input: MainSlideInput;
  errors: string[];
} {
  const imagePath = String(formData.get("imagePath") ?? "").trim();
  const sortOrder = parseInt(String(formData.get("sortOrder") ?? "0"), 10);
  const errors: string[] = [];
  if (!imagePath) errors.push("이미지 경로를 입력해 주세요.");

  return {
    errors,
    input: {
      imagePath,
      caption: String(formData.get("caption") ?? "").trim() || undefined,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive: formData.get("isActive") === "1",
    },
  };
}
