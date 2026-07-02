import type { Route } from "./+types/admin.events.$eventId.export";
import { data } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import {
  buildApplicationsCsv,
  getEvent,
  listAllEventApplications,
} from "~/lib/event.server";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const eventId = parseInt(params.eventId ?? "", 10);
  if (!eventId) throw data("행사를 찾을 수 없습니다.", { status: 404 });

  const db = context.cloudflare.env.DB;
  const event = await getEvent(db, eventId);
  if (!event) throw data("행사를 찾을 수 없습니다.", { status: 404 });

  const applications = await listAllEventApplications(db, eventId);
  const { csv, filename } = buildApplicationsCsv(event.title, applications);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  });
}
