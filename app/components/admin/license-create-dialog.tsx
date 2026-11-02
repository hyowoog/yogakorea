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
import { LICENSE_BULK_SLOTS, LICENSE_GRADE_TYPE_OPTIONS } from "~/lib/yoga-constants";

type LicenseCreateActionData = {
  detailId?: number | null;
  createdCount?: number;
  error?: string;
};

interface LicenseCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (licenseId: number) => void;
}

export function LicenseCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: LicenseCreateDialogProps) {
  const fetcher = useFetcher<LicenseCreateActionData>({ key: "license-create" });
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
      // 한 명만 등록했으면 기존처럼 상세 다이얼로그를 열어 줌
      if (fetcher.data.createdCount === 1 && fetcher.data.detailId) {
        onCreated(fetcher.data.detailId);
      }
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>자격증 등록</DialogTitle>
          <DialogDescription>
            공통 자격 정보를 입력한 뒤 여러 명의 자격번호를 한 번에 등록할 수 있습니다.
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
          action="/admin/licenses"
          className="space-y-4"
          onSubmit={() => {
            submittedRef.current = true;
          }}
        >
          <input type="hidden" name="intent" value="create" />

          <div className="grid gap-3 rounded-md bg-slate-700 p-4 text-white md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/80">자격구분</p>
              <EducationRadioRow
                name="gradeType"
                options={LICENSE_GRADE_TYPE_OPTIONS}
                defaultValue="일반"
                disabled={isSubmitting}
              />
            </div>
            <label className="space-y-1 text-xs font-medium text-white/80">
              취득일자
              <Input
                name="created"
                type="date"
                required
                disabled={isSubmitting}
                className="h-8 bg-white text-foreground"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-white/80">
              종목 및 급수
              <Input
                name="gradeTxt"
                required
                disabled={isSubmitting}
                className="h-8 bg-white text-foreground"
              />
            </label>
          </div>

          <div className="space-y-2 rounded-md bg-slate-100 p-3">
            <div className="grid grid-cols-[3rem_1fr_1fr_1fr_1fr] gap-2 text-xs font-medium text-slate-600">
              <span className="text-center">순서</span>
              <span>자격번호</span>
              <span>이름 (비우면 회원관리 이름)</span>
              <span>자격증번호</span>
              <span>교육기관</span>
            </div>
            {Array.from({ length: LICENSE_BULK_SLOTS }, (_, index) => (
              <div key={index} className="grid grid-cols-[3rem_1fr_1fr_1fr_1fr] items-center gap-2">
                <span className="text-center text-xs text-slate-500">{index + 1}</span>
                <Input
                  name="licId"
                  inputMode="numeric"
                  aria-label={`${index + 1}번 자격번호`}
                  disabled={isSubmitting}
                  className="h-8 bg-white"
                />
                <Input
                  name="name"
                  aria-label={`${index + 1}번 이름`}
                  disabled={isSubmitting}
                  className="h-8 bg-white"
                />
                <Input
                  name="gradeNo"
                  aria-label={`${index + 1}번 자격증번호`}
                  disabled={isSubmitting}
                  className="h-8 bg-white"
                />
                <Input
                  name="gradeEduLoc"
                  aria-label={`${index + 1}번 교육기관`}
                  disabled={isSubmitting}
                  className="h-8 bg-white"
                />
              </div>
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
