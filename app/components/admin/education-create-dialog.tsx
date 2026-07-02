import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { EducationFormFields } from "~/components/admin/education-form-fields";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type EducationCreateActionData = {
  detailId?: number;
  error?: string;
};

interface EducationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (educationId: number) => void;
}

export function EducationCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: EducationCreateDialogProps) {
  const fetcher = useFetcher<EducationCreateActionData>({ key: "education-create" });
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>교육이수 등록</DialogTitle>
          <DialogDescription>새 교육이수 정보를 입력해 주세요.</DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <fetcher.Form
          ref={formRef}
          method="post"
          action="/admin/educations"
          className="grid gap-3 md:grid-cols-2"
          onSubmit={() => {
            submittedRef.current = true;
          }}
        >
          <input type="hidden" name="intent" value="create" />
          <EducationFormFields disabled={isSubmitting} idPrefix="education-create" />
          <Button
            type="submit"
            className="md:col-span-2 md:justify-self-end"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "교육이수 등록"}
          </Button>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
