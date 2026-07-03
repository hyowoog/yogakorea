import type { Route } from "./+types/admin.events.$eventId";
import { useEffect, useState } from "react";
import { data, Link, useNavigate, useSearchParams } from "react-router";
import { EventApplicationCreateDialog } from "~/components/admin/event-application-create-dialog";
import { EventApplicationDetailDialog } from "~/components/admin/event-application-detail-dialog";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPagination } from "~/components/admin/admin-pagination";
import { Button } from "~/components/ui/button";
import { getClientIp, requireAdmin } from "~/lib/auth.server";
import {
  ADMIN_PAGE_SIZE,
  parsePagination,
  withPaginationTotal,
} from "~/lib/admin-pagination";
import { genderLabel, parseExtraData, regionLabel } from "~/lib/event-constants";
import {
  countEventApplications,
  createEventApplication,
  getEvent,
  listEventApplications,
  parseApplicationFormData,
} from "~/lib/event.server";
import { mainNavigation } from "~/lib/navigation";

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.event.title ?? "행사"} 신청 관리` }];
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const eventId = parseInt(params.eventId ?? "", 10);
  if (!eventId) throw data("행사를 찾을 수 없습니다.", { status: 404 });

  const db = context.cloudflare.env.DB;
  const event = await getEvent(db, eventId);
  if (!event) throw data("행사를 찾을 수 없습니다.", { status: 404 });

  const pagination = parsePagination(new URL(request.url).searchParams);
  const [total, applications] = await Promise.all([
    countEventApplications(db, eventId),
    listEventApplications(db, eventId, pagination.offset, ADMIN_PAGE_SIZE),
  ]);

  return {
    event,
    applications,
    pagination: withPaginationTotal(pagination, total),
  };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const eventId = parseInt(params.eventId ?? "", 10);
  if (!eventId) return data({ error: "행사를 찾을 수 없습니다." }, { status: 404 });

  const event = await getEvent(db, eventId);
  if (!event) return data({ error: "행사를 찾을 수 없습니다." }, { status: 404 });

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create") {
    const parsed = parseApplicationFormData(formData, eventId);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    const id = await createEventApplication(db, eventId, {
      ...parsed.input,
      ipAddress: getClientIp(request),
    });
    return data({ detailId: id });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminEventApplications({ loaderData }: Route.ComponentProps) {
  const { event, applications, pagination } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailParam = searchParams.get("detail");
  const detailFromUrl = detailParam ? parseInt(detailParam, 10) : null;
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(
    detailFromUrl && !Number.isNaN(detailFromUrl) ? detailFromUrl : null,
  );
  const [dialogOpen, setDialogOpen] = useState(
    Boolean(detailFromUrl && !Number.isNaN(detailFromUrl)),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (detailFromUrl && !Number.isNaN(detailFromUrl)) {
      setSelectedApplicationId(detailFromUrl);
      setDialogOpen(true);
    }
  }, [detailFromUrl]);

  function openApplicationDetail(applicationId: number) {
    setSelectedApplicationId(applicationId);
    setDialogOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("detail", String(applicationId));
    setSearchParams(nextParams, { replace: true });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setSelectedApplicationId(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("detail");
      const query = nextParams.toString();
      navigate(
        query ? `/admin/events/${event.id}?${query}` : `/admin/events/${event.id}`,
        { replace: true },
      );
    }
  }

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="참가신청 관리"
      title="참가신청관리"
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/events">행사목록</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={`/admin/events/${event.id}/export`}>엑셀저장</a>
          </Button>
          <Button type="button" size="sm" onClick={() => setCreateDialogOpen(true)}>
            신청 추가
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-sm text-muted-foreground">
            접수기간 {event.starts_on} ~ {event.ends_on}
          </p>
        </div>

        <AdminPagination
          pathname={`/admin/events/${event.id}`}
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
        />

        <div className="overflow-x-auto rounded border bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">순번</th>
                <th className="px-3 py-2 text-left font-semibold">이름</th>
                <th className="px-3 py-2 text-left font-semibold">성별</th>
                <th className="px-3 py-2 text-left font-semibold">권역</th>
                <th className="px-3 py-2 text-left font-semibold">요가원</th>
                <th className="px-3 py-2 text-left font-semibold">연락처</th>
                <th className="px-3 py-2 text-left font-semibold">기타사항</th>
                <th className="px-3 py-2 text-left font-semibold">등록일시</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => {
                const extra = parseExtraData(application.extra_data);
                return (
                  <tr key={application.id} className="border-t hover:bg-slate-50">
                    <td className="px-3 py-3">{pagination.offset + index + 1}</td>
                    <td className="px-3 py-3">
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-blue-700"
                        onClick={() => openApplicationDetail(application.id)}
                      >
                        {application.name}
                      </Button>
                    </td>
                    <td className="px-3 py-3">{genderLabel(application.gender)}</td>
                    <td className="px-3 py-3">{regionLabel(application.region_code)}</td>
                    <td className="px-3 py-3">{application.studio_name}</td>
                    <td className="px-3 py-3">{application.mobile}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <span>{application.member_role}</span>
                        {application.tshirt_size ? (
                          <span className="text-muted-foreground">{application.tshirt_size}</span>
                        ) : null}
                        {extra.birth ? (
                          <span className="text-muted-foreground">{extra.birth}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {application.created_at.slice(0, 16)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <AdminPagination
          pathname={`/admin/events/${event.id}`}
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
        />

        <EventApplicationCreateDialog
          eventId={event.id}
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreated={openApplicationDetail}
        />

        <EventApplicationDetailDialog
          eventId={event.id}
          applicationId={selectedApplicationId}
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
        />
      </div>
    </AdminLayout>
  );
}
