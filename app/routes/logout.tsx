import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import {
  appendClearSessionCookie,
  destroySession,
  getSessionId,
} from "~/lib/auth.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const sessionId = getSessionId(request);

  if (sessionId) {
    await destroySession(db, sessionId);
  }

  const headers = new Headers();
  appendClearSessionCookie(headers, request);

  throw redirect("/", { headers });
}
