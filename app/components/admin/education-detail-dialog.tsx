import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { loader as educationDetailLoader } from "~/routes/admin.educations.api.$id";
import { EducationFormFields } from "~/components/admin/education-form-fields";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { formatEducationGubun } from "~/lib/yoga-constants";

type EducationDetailData = Awaited<ReturnType<typeof educationDetailLoader>>;
type EducationDetailFetcherData = EducationDetailData | { error?: string; deleted?: boolean };

function isEducationDetail(
  data: EducationDetailFetcherData | undefined,
): data is EducationDetailData {
  return Boolean(data && "education" in data);
}

interface EducationDetailDialogProps {
  educationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EducationDetailDialog({
  educationId,
  open,
  onOpenChange,
}: EducationDetailDialogProps) {
  const fetcher = useFetcher<EducationDetailFetcherData>({
    key: educationId ? `education-detail-${educationId}` : "education-detail",
  });
  const revalidator = useRevalidator();
  const detail = isEducationDetail(fetcher.data) ? fetcher.data : undefined;
  const education = detail?.education;
  const error =
    fetcher.data && "error" in fetcher.data ? fetcher.data.error : undefined;
  const isLoading = open && educationId !== null && fetcher.state !== "idle" && !education;
  const isSubmitting = fetcher.state === "submitting";
  const detailUrl = educationId ? `/admin/educations/api/${educationId}` : null;
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

    if (isEducationDetail(fetcher.data) && !error) {
      closeAfterSaveRef.current = false;
      revalidator.revalidate();
      onOpenChange(false);
      return;
    }

    if (error) {
      closeAfterSaveRef.current = false;
    }
  }, [fetcher.state, fetcher.data, error, onOpenChange, revalidator]);

  const displayName = education?.member_name ?? education?.name ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {education
              ? `${displayName} · ${formatEducationGubun(education.gubun)}`
              : "교육이수 상세"}
          </DialogTitle>
          <DialogDescription>교육이수 정보 수정 및 삭제</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : null}

        {open && educationId && fetcher.state === "idle" && !education && !error ? (
          <p className="text-sm text-muted-foreground">교육이수 정보를 불러올 수 없습니다.</p>
        ) : null}

        {education ? (
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
              <EducationFormFields
                education={education}
                disabled={isSubmitting}
                idPrefix={`education-detail-${education.id}`}
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
                onSubmit={(event) => {
                  if (!confirm("정말 삭제하시겠습니까?")) {
                    event.preventDefault();
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
