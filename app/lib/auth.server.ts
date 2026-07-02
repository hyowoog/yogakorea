import { redirect } from "react-router";
import { ADMIN_LEVEL } from "~/lib/event-constants";

export interface Member {
  id: number;
  login_id: string;
  name: string;
  email: string | null;
  level: number;
}

export interface AuthMember extends Member {
  intercept_date: string | null;
  leave_date: string | null;
  email_certified: number;
  password_hash: string;
}

const SESSION_COOKIE = "yk_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

function formatTimestamp(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function todayYmd() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function parseCookies(header: string | null) {
  const cookies = new Map<string, string>();
  if (!header) return cookies;

  for (const part of header.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (!rawName || rest.length === 0) continue;
    cookies.set(rawName, decodeURIComponent(rest.join("=")));
  }

  return cookies;
}

function buildSessionCookie(sessionId: string, request: Request) {
  const secure = new URL(request.url).protocol === "https:";
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}`,
    `Max-Age=${SESSION_MAX_AGE}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function buildClearSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === "https:";
  const parts = [`${SESSION_COOKIE}=`, "Max-Age=0", "Path=/", "HttpOnly", "SameSite=Lax"];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function getSessionId(request: Request) {
  return parseCookies(request.headers.get("Cookie")).get(SESSION_COOKIE) ?? null;
}

export function isMemberBlocked(member: Pick<AuthMember, "intercept_date" | "leave_date">) {
  const today = todayYmd();
  if (member.intercept_date && member.intercept_date <= today) return true;
  if (member.leave_date && member.leave_date <= today) return true;
  return false;
}

export async function getMemberByLoginId(db: Env["DB"], loginId: string) {
  return db
    .prepare(
      `SELECT id, login_id, password_hash, name, email, level, intercept_date, leave_date, email_certified
       FROM members WHERE login_id = ?`,
    )
    .bind(loginId)
    .first<AuthMember>();
}

export async function getAuthUser(request: Request, db: Env["DB"]) {
  const sessionId = getSessionId(request);
  if (!sessionId) return null;

  const now = formatTimestamp();
  const row = await db
    .prepare(
      `SELECT m.id, m.login_id, m.name, m.email, m.level
       FROM sessions s
       JOIN members m ON m.id = s.member_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .bind(sessionId, now)
    .first<Member>();

  if (!row) return null;
  return row;
}

export async function createSession(db: Env["DB"], memberId: number) {
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE * 1000);

  await db
    .prepare(
      `INSERT INTO sessions (id, member_id, expires_at, created_at) VALUES (?, ?, ?, ?)`,
    )
    .bind(sessionId, memberId, formatTimestamp(expiresAt), formatTimestamp(now))
    .run();

  return sessionId;
}

export async function destroySession(db: Env["DB"], sessionId: string) {
  await db.prepare(`DELETE FROM sessions WHERE id = ?`).bind(sessionId).run();
}

export async function recordMemberLogin(
  db: Env["DB"],
  memberId: number,
  ip: string | null,
) {
  await db
    .prepare(`UPDATE members SET last_login_at = ?, last_login_ip = ? WHERE id = ?`)
    .bind(formatTimestamp(), ip, memberId)
    .run();
}

export function appendSessionCookie(headers: Headers, sessionId: string, request: Request) {
  headers.append("Set-Cookie", buildSessionCookie(sessionId, request));
}

export function appendClearSessionCookie(headers: Headers, request: Request) {
  headers.append("Set-Cookie", buildClearSessionCookie(request));
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    null
  );
}

export async function requireAdmin(request: Request, db: Env["DB"]) {
  const user = await getAuthUser(request, db);
  if (!user || user.level < ADMIN_LEVEL) {
    const url = new URL(request.url);
    const redirectTo = encodeURIComponent(url.pathname + url.search);
    throw redirect(`/login?redirectTo=${redirectTo}`);
  }
  return user;
}
