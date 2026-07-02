import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { EventApplicationForm } from "~/components/event/event-application-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type ApplicationCreateActionData = {
  detailId?: number;
  error?: string;
};

interface EventApplicationCreateDialogProps {
  eventId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (applicationId: number) => void;
}

export function EventApplicationCreateDialog({
  eventId,
  open,
  onOpenChange,
  onCreated,
}: EventApplicationCreateDialogProps) {
  const fetcher = useFetcher<ApplicationCreateActionData>({
    key: `application-create-${eventId}`,
  });
  const revalidator = useRevalidator();
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);
  const isSubmitting = fetcher.state !== "idle";
  const error = fetcher.data?.error;

  useEffect(() => {
    if (!submittedRef.current || fetcher.state !== "idle") return;

    if (fetcher.data?.detailId) {
      submittedRef.current = false;
      formRef.current?.reset();
      revalidator.revalidate();
      onOpenChange(false);
      onCreated(fetcher.data.detailId);
      return;
    }

    if (error) {
      submittedRef.current = false;
    }
  }, [fetcher.state, fetcher.data, error, onOpenChange, onCreated, revalidator]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      submittedRef.current = false;
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>신청 추가</DialogTitle>
          <DialogDescription>새 참가신청 정보를 입력해 주세요.</DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <EventApplicationForm
          eventId={eventId}
          intent="create"
          submitLabel={isSubmitting ? "등록 중..." : "신청 추가"}
          action={`/admin/events/${eventId}`}
          formRef={formRef}
          FormComponent={fetcher.Form}
          disabled={isSubmitting}
          onFormSubmit={() => {
            submittedRef.current = true;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
