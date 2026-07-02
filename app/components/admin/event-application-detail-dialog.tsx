import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { loader as applicationDetailLoader } from "~/routes/admin.events.$eventId.api.$applicationId";
import { EventApplicationForm } from "~/components/event/event-application-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type ApplicationDetailData = Awaited<ReturnType<typeof applicationDetailLoader>>;
type ApplicationDetailFetcherData =
  | ApplicationDetailData
  | { error?: string; deleted?: boolean };

function isApplicationDetail(
  data: ApplicationDetailFetcherData | undefined,
): data is ApplicationDetailData {
  return Boolean(data && "application" in data);
}

interface EventApplicationDetailDialogProps {
  eventId: number;
  applicationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventApplicationDetailDialog({
  eventId,
  applicationId,
  open,
  onOpenChange,
}: EventApplicationDetailDialogProps) {
  const fetcher = useFetcher<ApplicationDetailFetcherData>({
    key: applicationId ? `application-detail-${applicationId}` : "application-detail",
  });
  const revalidator = useRevalidator();
  const detail = isApplicationDetail(fetcher.data) ? fetcher.data : undefined;
  const application = detail?.application;
  const error =
    fetcher.data && "error" in fetcher.data ? fetcher.data.error : undefined;
  const isLoading =
    open && applicationId !== null && fetcher.state !== "idle" && !application;
  const isSubmitting = fetcher.state === "submitting";
  const detailUrl =
    applicationId !== null ? `/admin/events/${eventId}/api/${applicationId}` : null;
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

    if (isApplicationDetail(fetcher.data) && !error) {
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {application ? `${application.name} · 신청 상세` : "신청 상세"}
          </DialogTitle>
          <DialogDescription>참가신청 정보 수정 및 삭제</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : null}

        {open && applicationId && fetcher.state === "idle" && !application && !error ? (
          <p className="text-sm text-muted-foreground">신청 정보를 불러올 수 없습니다.</p>
        ) : null}

        {application ? (
          <div className="space-y-4">
            {error ? (
              <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <EventApplicationForm
              eventId={eventId}
              intent="update"
              application={application}
              submitLabel={isSubmitting ? "저장 중..." : "저장"}
              action={detailUrl ?? undefined}
              FormComponent={fetcher.Form}
              disabled={isSubmitting}
              onFormSubmit={() => {
                closeAfterSaveRef.current = true;
              }}
            />

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
