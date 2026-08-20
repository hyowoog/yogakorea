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
import {
  EDUCATION_BULK_LICENSE_SLOTS,
  EDUCATION_DSCD_OPTIONS,
  EDUCATION_GUBUN_FORM_OPTIONS,
} from "~/lib/yoga-constants";

type EducationCreateActionData = {
  detailId?: number;
  createdCount?: number;
  error?: string;
};

interface EducationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (educationId: number) => void;
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

    if (fetcher.data?.createdCount) {
      submittedRef.current = false;
      formRef.current?.reset();
      revalidator.revalidate();
      onOpenChange(false);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>교육이수 등록</DialogTitle>
          <DialogDescription>
            공통 교육 정보를 입력한 뒤 자격번호를 대량으로 등록할 수 있습니다.
          </DialogDescription>
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
          className="space-y-4"
          onSubmit={() => {
            submittedRef.current = true;
          }}
        >
          <input type="hidden" name="intent" value="create" />

          <div className="space-y-3 rounded-md bg-slate-700 p-4 text-white">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-white/80">자격구분</p>
                <EducationRadioRow
                  name="dscd"
                  options={EDUCATION_DSCD_OPTIONS}
                  defaultValue="1"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-white/80">구분</p>
                <EducationRadioRow
                  name="gubun"
                  options={EDUCATION_GUBUN_FORM_OPTIONS}
                  defaultValue="1"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <label className="space-y-1 text-xs font-medium text-white/80">
                취득일자
                <Input
                  name="basDate"
                  placeholder="연도. 월. 일."
                  disabled={isSubmitting}
                  className="h-8 bg-white text-foreground"
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-white/80 md:col-span-2">
                교육내용
                <Input
                  name="gradeTxt"
                  disabled={isSubmitting}
                  className="h-8 bg-white text-foreground"
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-white/80">
                교육시간
                <Input
                  name="hour"
                  disabled={isSubmitting}
                  className="h-8 bg-white text-foreground"
                />
              </label>
            </div>
            <label className="block space-y-1 text-xs font-medium text-white/80">
              교육기관
              <Input
                name="gradeEduLoc"
                disabled={isSubmitting}
                className="h-8 bg-white text-foreground"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-3 sm:grid-cols-5 xl:grid-cols-10">
            {Array.from({ length: EDUCATION_BULK_LICENSE_SLOTS }, (_, index) => (
              <label key={index} className="space-y-1 text-[11px] font-medium text-slate-600">
                자격번호
                <Input
                  name="licId"
                  inputMode="numeric"
                  disabled={isSubmitting}
                  className="h-8 bg-white"
                />
              </label>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
            <Button
              type="button"
              className="bg-teal-500 hover:bg-teal-600"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              목록으로 돌아가기
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
