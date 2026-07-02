import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { loader as eventDetailLoader } from "~/routes/admin.events.api.$id";
import { EventFormFields } from "~/components/admin/event-form-fields";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type EventDetailData = Awaited<ReturnType<typeof eventDetailLoader>>;
type EventDetailFetcherData = EventDetailData | { error?: string; deleted?: boolean };

function isEventDetail(data: EventDetailFetcherData | undefined): data is EventDetailData {
  return Boolean(data && "event" in data);
}

interface EventDetailDialogProps {
  eventId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({ eventId, open, onOpenChange }: EventDetailDialogProps) {
  const fetcher = useFetcher<EventDetailFetcherData>({
    key: eventId ? `event-detail-${eventId}` : "event-detail",
  });
  const revalidator = useRevalidator();
  const detail = isEventDetail(fetcher.data) ? fetcher.data : undefined;
  const event = detail?.event;
  const error =
    fetcher.data && "error" in fetcher.data ? fetcher.data.error : undefined;
  const isLoading = open && eventId !== null && fetcher.state !== "idle" && !event;
  const isSubmitting = fetcher.state === "submitting";
  const detailUrl = eventId ? `/admin/events/api/${eventId}` : null;
  const closeAfterSaveRef = useRef(false);
  const closeAfterDeleteRef = useRef(false);

  useEffect(() => {
    if (open && detailUrl) {
      fetcher.load(detailUrl);
    }
  }, [open, detailUrl]);

  useEffect(() => {
    if (fetcher.state !== "idle") return;

    if (closeAfterDeleteRef.current && fetcher.data && "deleted" in fetcher.data) {
      closeAfterDeleteRef.current = false;
      revalidator.revalidate();
      onOpenChange(false);
      return;
    }

    if (!closeAfterSaveRef.current) return;

    if (isEventDetail(fetcher.data) && !error) {
      closeAfterSaveRef.current = false;
      revalidator.revalidate();
      onOpenChange(false);
      return;
    }

    if (error) {
      closeAfterSaveRef.current = false;
    }
  }, [fetcher.state, fetcher.data, error, onOpenChange, revalidator]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? event.title : "행사 상세"}</DialogTitle>
          <DialogDescription>행사 정보 수정 및 삭제</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : null}

        {open && eventId && fetcher.state === "idle" && !event && !error ? (
          <p className="text-sm text-muted-foreground">행사 정보를 불러올 수 없습니다.</p>
        ) : null}

        {event ? (
          <div className="space-y-4">
            {error ? (
              <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <fetcher.Form
              method="post"
              action={detailUrl ?? undefined}
              className="grid gap-3 md:grid-cols-2"
              onSubmit={() => {
                closeAfterSaveRef.current = true;
              }}
            >
              <input type="hidden" name="intent" value="update" />
              <EventFormFields
                event={event}
                disabled={isSubmitting}
                idPrefix={`event-detail-${event.id}`}
              />
              <div className="flex justify-end gap-2 md:col-span-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </div>
            </fetcher.Form>

            <DialogFooter className="sm:justify-start">
              <fetcher.Form
                method="post"
                action={detailUrl ?? undefined}
                onSubmit={(submitEvent) => {
                  if (!confirm("정말 삭제하시겠습니까?")) {
                    submitEvent.preventDefault();
                    return;
                  }
                  closeAfterDeleteRef.current = true;
                }}
              >
                <input type="hidden" name="intent" value="delete" />
                <Button type="submit" variant="destructive" size="sm" disabled={isSubmitting}>
                  삭제
                </Button>
              </fetcher.Form>
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
