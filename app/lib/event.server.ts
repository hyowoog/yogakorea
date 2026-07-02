import {
  formatSchedule1,
  formatSchedule2,
  genderLabel,
  parseExtraData,
  regionLabel,
  type EventExtraData,
} from "~/lib/event-constants";

export interface Event {
  id: number;
  title: string;
  starts_on: string;
  ends_on: string;
  created_at: string;
}

export interface EventApplication {
  id: number;
  event_id: number;
  name: string;
  gender: "m" | "f";
  studio_name: string;
  region_code: number;
  mobile: string;
  member_role: string;
  bank_name: string | null;
  bank_num: string | null;
  bank_owner: string | null;
  tshirt_size: string | null;
  extra_data: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface EventApplicationInput {
  name: string;
  gender: "m" | "f";
  studioName: string;
  regionCode: number;
  mobile: string;
  memberRole: string;
  bankName?: string;
  bankNum?: string;
  bankOwner?: string;
  tshirtSize?: string;
  extraData?: EventExtraData;
  ipAddress?: string | null;
}

function formatTimestamp(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function listEvents(db: Env["DB"]) {
  const result = await db
    .prepare(`SELECT * FROM events ORDER BY id DESC`)
    .all<Event>();
  return result.results ?? [];
}

export async function getEvent(db: Env["DB"], eventId: number) {
  return db.prepare(`SELECT * FROM events WHERE id = ?`).bind(eventId).first<Event>();
}

export async function createEvent(
  db: Env["DB"],
  input: { title: string; startsOn: string; endsOn: string },
) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM events`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;
  const now = formatTimestamp();

  await db
    .prepare(
      `INSERT INTO events (id, title, starts_on, ends_on, created_at) VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(id, input.title, input.startsOn, input.endsOn, now)
    .run();

  return id;
}

export async function updateEvent(
  db: Env["DB"],
  eventId: number,
  input: { title: string; startsOn: string; endsOn: string },
) {
  await db
    .prepare(`UPDATE events SET title = ?, starts_on = ?, ends_on = ? WHERE id = ?`)
    .bind(input.title, input.startsOn, input.endsOn, eventId)
    .run();
}

export async function deleteEvent(db: Env["DB"], eventId: number) {
  await db.prepare(`DELETE FROM events WHERE id = ?`).bind(eventId).run();
}

export function parseEventFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const startsOn = String(formData.get("startsOn") ?? "").trim();
  const endsOn = String(formData.get("endsOn") ?? "").trim();
  const errors: string[] = [];
  if (!title || !startsOn || !endsOn) {
    errors.push("행사명과 접수기간을 입력해 주세요.");
  }
  return { errors, input: { title, startsOn, endsOn } };
}

export async function listEventApplications(
  db: Env["DB"],
  eventId: number,
  offset = 0,
  limit?: number,
) {
  if (limit === undefined) {
    const result = await db
      .prepare(`SELECT * FROM event_applications WHERE event_id = ? ORDER BY id ASC`)
      .bind(eventId)
      .all<EventApplication>();
    return result.results ?? [];
  }

  const result = await db
    .prepare(
      `SELECT * FROM event_applications WHERE event_id = ? ORDER BY id ASC LIMIT ? OFFSET ?`,
    )
    .bind(eventId, limit, offset)
    .all<EventApplication>();
  return result.results ?? [];
}

export async function countEventApplications(db: Env["DB"], eventId: number) {
  const row = await db
    .prepare(`SELECT COUNT(*) AS total FROM event_applications WHERE event_id = ?`)
    .bind(eventId)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function listAllEventApplications(db: Env["DB"], eventId: number) {
  return listEventApplications(db, eventId);
}

export async function getEventApplication(db: Env["DB"], applicationId: number) {
  return db
    .prepare(`SELECT * FROM event_applications WHERE id = ?`)
    .bind(applicationId)
    .first<EventApplication>();
}

export async function createEventApplication(
  db: Env["DB"],
  eventId: number,
  input: EventApplicationInput,
) {
  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(id), 0) AS max_id FROM event_applications`)
    .first<{ max_id: number }>();
  const id = (maxRow?.max_id ?? 0) + 1;
  const now = formatTimestamp();
  const extraData = input.extraData ? JSON.stringify(input.extraData) : null;

  await db
    .prepare(
      `INSERT INTO event_applications (
        id, event_id, name, gender, studio_name, region_code, mobile, member_role,
        bank_name, bank_num, bank_owner, tshirt_size, extra_data, ip_address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      eventId,
      input.name,
      input.gender,
      input.studioName,
      input.regionCode,
      input.mobile,
      input.memberRole,
      input.bankName ?? null,
      input.bankNum ?? null,
      input.bankOwner ?? null,
      input.tshirtSize ?? null,
      extraData,
      input.ipAddress ?? null,
      now,
    )
    .run();

  return id;
}

export async function updateEventApplication(
  db: Env["DB"],
  applicationId: number,
  input: EventApplicationInput,
) {
  const extraData = input.extraData ? JSON.stringify(input.extraData) : null;

  await db
    .prepare(
      `UPDATE event_applications SET
        name = ?, gender = ?, studio_name = ?, region_code = ?, mobile = ?,
        member_role = ?, bank_name = ?, bank_num = ?, bank_owner = ?,
        tshirt_size = ?, extra_data = ?, ip_address = ?
      WHERE id = ?`,
    )
    .bind(
      input.name,
      input.gender,
      input.studioName,
      input.regionCode,
      input.mobile,
      input.memberRole,
      input.bankName ?? null,
      input.bankNum ?? null,
      input.bankOwner ?? null,
      input.tshirtSize ?? null,
      extraData,
      input.ipAddress ?? null,
      applicationId,
    )
    .run();
}

export async function deleteEventApplication(db: Env["DB"], applicationId: number) {
  await db
    .prepare(`DELETE FROM event_applications WHERE id = ?`)
    .bind(applicationId)
    .run();
}

export function parseApplicationFormData(formData: FormData, eventId: number) {
  const name = String(formData.get("name") ?? "").trim();
  const gender = String(formData.get("gender") ?? "f") as "m" | "f";
  const studioName = String(formData.get("studioName") ?? "").trim();
  const regionCode = parseInt(String(formData.get("regionCode") ?? ""), 10);
  const mobile = String(formData.get("mobile") ?? "").trim();
  const memberRole = String(formData.get("memberRole") ?? "").trim();
  const bankName = String(formData.get("bankName") ?? "").trim();
  const bankNum = String(formData.get("bankNum") ?? "").trim();
  const bankOwner = String(formData.get("bankOwner") ?? "").trim();
  const tshirtSize = String(formData.get("tshirtSize") ?? "").trim();

  const extraData: EventExtraData = {};
  const sch1 = formData.get("sch1");
  const sch2 = formData.get("sch2");
  const birth = String(formData.get("birth") ?? "").trim();
  if (sch1) extraData.sch1 = parseInt(String(sch1), 10);
  if (sch2) extraData.sch2 = parseInt(String(sch2), 10);
  if (birth) extraData.birth = birth;

  const errors: string[] = [];
  if (!name) errors.push("이름을 입력해 주세요.");
  if (!studioName) errors.push("요가원명을 입력해 주세요.");
  if (!regionCode) errors.push("권역을 선택해 주세요.");
  if (!mobile) errors.push("연락처를 입력해 주세요.");
  if (!memberRole) errors.push("회원자격을 선택해 주세요.");

  if (eventId === 40 && !tshirtSize) {
    errors.push("티셔츠 사이즈를 선택해 주세요.");
  }

  if (eventId === 39) {
    if (!extraData.sch1) errors.push("전체일정을 선택해 주세요.");
    if (!extraData.sch2) errors.push("일정을 선택해 주세요.");
    if (!birth) errors.push("생년월일을 입력해 주세요.");
  }

  if (!bankName || !bankNum || !bankOwner) {
    errors.push("환불계좌 정보를 입력해 주세요.");
  }

  return {
    errors,
    input: {
      name,
      gender: gender === "m" ? "m" : "f",
      studioName,
      regionCode,
      mobile,
      memberRole,
      bankName,
      bankNum,
      bankOwner,
      tshirtSize: tshirtSize || undefined,
      extraData: Object.keys(extraData).length ? extraData : undefined,
    } satisfies EventApplicationInput,
  };
}

function csvEscape(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildApplicationsCsv(eventTitle: string, applications: EventApplication[]) {
  const headers = [
    "이름",
    "성별",
    "권역",
    "요가원",
    "연락처",
    "기타사항",
    "환불은행",
    "환불계좌",
    "환불예금주",
    "등록일시",
    "티사이즈",
    "생년월일",
    "전체일정",
    "18일 일정",
  ];

  const lines = [`\uFEFF${headers.map(csvEscape).join(",")}`];

  for (const app of applications) {
    const extra = parseExtraData(app.extra_data);
    lines.push(
      [
        app.name,
        genderLabel(app.gender),
        regionLabel(app.region_code),
        app.studio_name,
        app.mobile,
        app.member_role,
        app.bank_name ?? "",
        app.bank_num ?? "",
        app.bank_owner ?? "",
        app.created_at.slice(0, 16),
        app.tshirt_size ?? "",
        extra.birth ?? "",
        formatSchedule1(extra.sch1),
        formatSchedule2(extra.sch2),
      ]
        .map(csvEscape)
        .join(","),
    );
  }

  return { csv: lines.join("\n"), filename: `${eventTitle.replace(/[/\\?%*:|"<>]/g, "_")}.csv` };
}
