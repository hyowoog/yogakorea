import type { Route } from "./+types/admin.events._index";
import { useEffect, useState } from "react";
import { data, Link, useNavigate, useSearchParams } from "react-router";
import { AdminLayout } from "~/components/admin/admin-layout";
import { EventCreateDialog } from "~/components/admin/event-create-dialog";
import { EventDetailDialog } from "~/components/admin/event-detail-dialog";
import { Button } from "~/components/ui/button";
import { requireAdmin } from "~/lib/auth.server";
import { createEvent, listEvents, parseEventFormData } from "~/lib/event.server";
import { mainNavigation } from "~/lib/navigation";

export function meta() {
  return [{ title: "참가신청 관리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const events = await listEvents(context.cloudflare.env.DB);
  return { events };
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create") {
    const parsed = parseEventFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    const id = await createEvent(db, parsed.input);
    return data({ detailId: id });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminEventsIndex({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailParam = searchParams.get("detail");
  const detailFromUrl = detailParam ? parseInt(detailParam, 10) : null;
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    detailFromUrl && !Number.isNaN(detailFromUrl) ? detailFromUrl : null,
  );
  const [dialogOpen, setDialogOpen] = useState(
    Boolean(detailFromUrl && !Number.isNaN(detailFromUrl)),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (detailFromUrl && !Number.isNaN(detailFromUrl)) {
      setSelectedEventId(detailFromUrl);
      setDialogOpen(true);
    }
  }, [detailFromUrl]);

  function openEventDetail(eventId: number) {
    setSelectedEventId(eventId);
    setDialogOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("detail", String(eventId));
    setSearchParams(nextParams, { replace: true });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setSelectedEventId(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("detail");
      const query = nextParams.toString();
      navigate(query ? `/admin/events?${query}` : "/admin/events", { replace: true });
    }
  }

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="참가신청 관리"
      title="참가신청관리"
      description="행사 등록 및 신청 목록 관리"
    >
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setCreateDialogOpen(true)}>
          행사 추가
        </Button>
      </div>

      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">순번</th>
              <th className="px-3 py-2 text-left font-semibold">행사명</th>
              <th className="px-3 py-2 text-left font-semibold">신청기간</th>
              <th className="px-3 py-2 text-left font-semibold">바로가기</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-3">{index + 1}</td>
                <td className="px-3 py-3">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 font-medium text-blue-700"
                    onClick={() => openEventDetail(event.id)}
                  >
                    {event.title}
                  </Button>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {event.starts_on} ~ {event.ends_on}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/admin/events/${event.id}`}>참가신청리스트</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={`/events/${event.id}/apply`} target="_blank" rel="noreferrer">
                        신청양식보기
                      </a>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EventCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={openEventDetail}
      />

      <EventDetailDialog
        eventId={selectedEventId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </AdminLayout>
  );
}
