import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { EducationRadioRow } from "~/components/admin/education-radio-row";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { EDUCATION_DSCD_OPTIONS, EDUCATION_GUBUN_GUEST_OPTIONS } from "~/lib/yoga-constants";

type EducationGuestCreateActionData = {
  detailId?: number;
  error?: string;
};

interface EducationGuestCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EducationGuestCreateDialog({
  open,
  onOpenChange,
}: EducationGuestCreateDialogProps) {
  const fetcher = useFetcher<EducationGuestCreateActionData>({
    key: "education-guest-create",
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
      return;
    }

    if (error) {
      submittedRef.current = false;
    }
  }, [fetcher.state, fetcher.data, error, onOpenChange, revalidator]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) submittedRef.current = false;
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>비회원교육 등록</DialogTitle>
          <DialogDescription>비회원 교육이수 정보를 입력해 주세요.</DialogDescription>
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
          className="rounded-md border bg-white p-4"
          onSubmit={() => {
            submittedRef.current = true;
          }}
        >
          <input type="hidden" name="intent" value="createGuest" />
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-1 text-xs font-medium text-sky-700">
              성명
              <Input name="name" disabled={isSubmitting} className="h-8" />
            </label>
            <label className="space-y-1 text-xs font-medium text-sky-700">
              연락처
              <Input name="hp" disabled={isSubmitting} className="h-8" />
            </label>
            <label className="space-y-1 text-xs font-medium text-sky-700">
              교육기관
              <Input name="gradeEduLoc" disabled={isSubmitting} className="h-8" />
            </label>
            <label className="space-y-1 text-xs font-medium text-sky-700">
              교육시간
              <Input name="hour" disabled={isSubmitting} className="h-8" />
            </label>
            <div className="space-y-1">
              <p className="text-xs font-medium text-sky-700">자격구분</p>
              <EducationRadioRow
                name="dscd"
                options={EDUCATION_DSCD_OPTIONS}
                defaultValue="1"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-sky-700">구분</p>
              <EducationRadioRow
                name="gubun"
                options={EDUCATION_GUBUN_GUEST_OPTIONS}
                defaultValue="1"
                disabled={isSubmitting}
              />
            </div>
            <label className="space-y-1 text-xs font-medium text-sky-700">
              취득일자
              <Input
                name="basDate"
                placeholder="연도. 월. 일."
                disabled={isSubmitting}
                className="h-8"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-sky-700">
              종목 및 급수
              <Input name="gradeTxt" disabled={isSubmitting} className="h-8" />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "등록"}
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
