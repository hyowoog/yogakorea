import type { Route } from "./+types/events.$eventId.apply";
import { data, redirect, useSearchParams } from "react-router";
import { EventApplicationForm } from "~/components/event/event-application-form";
import { SiteLayout } from "~/components/site-layout";
import { getAuthUser, getClientIp } from "~/lib/auth.server";
import { ADMIN_LEVEL, isEventOpen } from "~/lib/event-constants";
import {
  createEventApplication,
  getEvent,
  parseApplicationFormData,
} from "~/lib/event.server";

export function meta({ data: loaderData }: Route.MetaArgs) {
  const title = loaderData?.event.title ?? "행사 참가신청";
  return [{ title: `${title} - 한국요가연합회` }];
}

async function isAdminRequest(request: Request, db: Env["DB"]) {
  const user = await getAuthUser(request, db);
  return Boolean(user && user.level >= ADMIN_LEVEL);
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const eventId = parseInt(params.eventId ?? "", 10);
  if (!eventId) throw data("행사를 찾을 수 없습니다.", { status: 404 });

  const db = context.cloudflare.env.DB;
  const event = await getEvent(db, eventId);
  if (!event) throw data("행사를 찾을 수 없습니다.", { status: 404 });

  if (!isEventOpen(event.starts_on, event.ends_on) && !(await isAdminRequest(request, db))) {
    return data(
      {
        event,
        closed: true as const,
        message: "신청기간이 지났습니다. 사무국으로 전화로 신청하세요.",
      },
      { status: 403 },
    );
  }

  return { event, closed: false as const };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const eventId = parseInt(params.eventId ?? "", 10);
  if (!eventId) return data({ error: "행사를 찾을 수 없습니다." }, { status: 404 });

  const db = context.cloudflare.env.DB;
  const event = await getEvent(db, eventId);
  if (!event) return data({ error: "행사를 찾을 수 없습니다." }, { status: 404 });

  if (!isEventOpen(event.starts_on, event.ends_on) && !(await isAdminRequest(request, db))) {
    return data({ error: "신청기간이 지났습니다." }, { status: 403 });
  }

  const formData = await request.formData();
  if (formData.get("intent") !== "create") {
    return data({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!formData.get("privacyAgree") || !formData.get("photoAgree")) {
    return data({ error: "동의 항목을 확인해 주세요." }, { status: 400 });
  }

  const parsed = parseApplicationFormData(formData, eventId);
  if (parsed.errors.length) {
    return data({ error: parsed.errors.join(" ") }, { status: 400 });
  }

  await createEventApplication(db, eventId, {
    ...parsed.input,
    ipAddress: getClientIp(request),
  });

  return redirect(`/events/${eventId}/apply?success=1`);
}

export default function EventApplyPage({ loaderData, actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "1";

  if ("closed" in loaderData && loaderData.closed) {
    return (
      <SiteLayout navigation={[]} hideHeader hideFooter hidePageHero>
        <div className="yk-container py-16 text-center">
          <h1 className="text-xl font-semibold">{loaderData.event.title}</h1>
          <p className="mt-4 text-red-600">{loaderData.message}</p>
        </div>
      </SiteLayout>
    );
  }

  const { event } = loaderData;

  return (
    <SiteLayout navigation={[]} hideHeader hideFooter hidePageHero>
      <div className="yk-container py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{event.title} 참가신청</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              접수기간 {event.starts_on} ~ {event.ends_on}
            </p>
          </div>

          {isSuccess ? (
            <p className="rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
              신청이 완료되었습니다.
            </p>
          ) : null}

          {actionData && "error" in actionData ? (
            <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {actionData.error}
            </p>
          ) : null}

          <div className="rounded border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <EventApplicationForm
              eventId={event.id}
              intent="create"
              showAgreements
              submitLabel="작성완료"
            />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
