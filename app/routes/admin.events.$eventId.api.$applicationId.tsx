import type { Route } from "./+types/admin.events.$eventId.api.$applicationId";
import { useEffect } from "react";
import { data, useNavigate } from "react-router";
import { getClientIp, requireAdmin } from "~/lib/auth.server";
import {
  deleteEventApplication,
  getEvent,
  getEventApplication,
  parseApplicationFormData,
  updateEventApplication,
} from "~/lib/event.server";

async function loadApplicationDetail(db: D1Database, eventId: number, applicationId: number) {
  const [event, application] = await Promise.all([
    getEvent(db, eventId),
    getEventApplication(db, applicationId),
  ]);

  if (!event) {
    throw data("행사를 찾을 수 없습니다.", { status: 404 });
  }
  if (!application || application.event_id !== eventId) {
    throw data("신청 정보를 찾을 수 없습니다.", { status: 404 });
  }

  return { event, application };
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const eventId = parseInt(params.eventId ?? "", 10);
  const applicationId = parseInt(params.applicationId ?? "", 10);
  if (!eventId || !applicationId) {
    throw data("신청 정보를 찾을 수 없습니다.", { status: 404 });
  }

  return loadApplicationDetail(context.cloudflare.env.DB, eventId, applicationId);
}

export async function action({ params, request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const eventId = parseInt(params.eventId ?? "", 10);
  const applicationId = parseInt(params.applicationId ?? "", 10);
  if (!eventId || !applicationId) {
    return data({ error: "신청 정보를 찾을 수 없습니다." }, { status: 400 });
  }

  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "update") {
    const existing = await getEventApplication(db, applicationId);
    if (!existing || existing.event_id !== eventId) {
      return data({ error: "신청 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    const parsed = parseApplicationFormData(formData, eventId);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }

    await updateEventApplication(db, applicationId, {
      ...parsed.input,
      ipAddress: existing.ip_address,
    });
    return loadApplicationDetail(db, eventId, applicationId);
  }

  if (intent === "delete") {
    const existing = await getEventApplication(db, applicationId);
    if (!existing || existing.event_id !== eventId) {
      return data({ error: "신청 정보를 찾을 수 없습니다." }, { status: 404 });
    }
    await deleteEventApplication(db, applicationId);
    return data({ deleted: true });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminEventApplicationApiRedirect({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { eventId, applicationId } = params;

  useEffect(() => {
    if (eventId && applicationId) {
      navigate(`/admin/events/${eventId}?detail=${applicationId}`, { replace: true });
    } else if (eventId) {
      navigate(`/admin/events/${eventId}`, { replace: true });
    } else {
      navigate("/admin/events", { replace: true });
    }
  }, [eventId, applicationId, navigate]);

  return null;
}
