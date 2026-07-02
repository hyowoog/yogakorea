import type { Route } from "./+types/admin.events.api.$id";
import { data } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import {
  deleteEvent,
  getEvent,
  parseEventFormData,
  updateEvent,
} from "~/lib/event.server";

async function loadEventDetail(db: D1Database, id: number) {
  const event = await getEvent(db, id);
  if (!event) {
    throw data("행사를 찾을 수 없습니다.", { status: 404 });
  }
  return { event };
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) throw data("행사를 찾을 수 없습니다.", { status: 404 });

  return loadEventDetail(context.cloudflare.env.DB, id);
}

export async function action({ params, request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) return data({ error: "행사를 찾을 수 없습니다." }, { status: 400 });

  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "update") {
    const parsed = parseEventFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    await updateEvent(db, id, parsed.input);
    return loadEventDetail(db, id);
  }

  if (intent === "delete") {
    await deleteEvent(db, id);
    return data({ deleted: true });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

