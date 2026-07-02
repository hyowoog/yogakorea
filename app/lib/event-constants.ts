export const ADMIN_LEVEL = 9;

export const EVENT_REGIONS: Record<number, string> = {
  1: "서울인천권",
  2: "경기강원권",
  3: "전북권",
  4: "광주전남권",
  5: "경북권",
  6: "경남권",
  7: "울산권",
  8: "제주권",
  9: "대구권",
  10: "부산권",
  11: "충청권",
};

export const MEMBER_ROLES = ["이사", "원장", "1~2급", "3급", "교육생"] as const;

export const TSHIRT_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;

export interface EventExtraData {
  sch1?: number;
  sch2?: number;
  birth?: string;
}

export type EventFormVariant = "default" | "schedule" | "tshirt";

export function getEventFormVariant(eventId: number): EventFormVariant {
  if (eventId === 39) return "schedule";
  if (eventId === 40) return "tshirt";
  return "default";
}

export function regionLabel(code: number | string) {
  const parsed = typeof code === "string" ? parseInt(code, 10) : code;
  return EVENT_REGIONS[parsed] ?? String(code);
}

export function genderLabel(gender: string) {
  return gender === "f" ? "여성" : "남성";
}

export function formatSchedule1(sch1: number | undefined) {
  if (sch1 === 1) return "1박2일";
  if (sch1 === 2) return "2박3일";
  return "";
}

export function formatSchedule2(sch2: number | undefined) {
  if (sch2 === 2) return "영실코스";
  if (sch2 === 3) return "관광";
  return "";
}

export function parseExtraData(raw: string | null): EventExtraData {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as EventExtraData;
  } catch {
    return {};
  }
}

export function todayYmd() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isEventOpen(startsOn: string, endsOn: string, today = todayYmd()) {
  return startsOn <= today && today <= endsOn;
}
