import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { loader as licenseDetailLoader } from "~/routes/admin.licenses.api.$id";
import { LicenseFormFields } from "~/components/admin/license-form-fields";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type LicenseDetailData = Awaited<ReturnType<typeof licenseDetailLoader>>;
type LicenseDetailFetcherData = LicenseDetailData | { error?: string; deleted?: boolean };

function isLicenseDetail(data: LicenseDetailFetcherData | undefined): data is LicenseDetailData {
  return Boolean(data && "license" in data);
}

interface LicenseDetailDialogProps {
  licenseId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicenseDetailDialog({
  licenseId,
  open,
  onOpenChange,
}: LicenseDetailDialogProps) {
  const fetcher = useFetcher<LicenseDetailFetcherData>({
    key: licenseId ? `license-detail-${licenseId}` : "license-detail",
  });
  const revalidator = useRevalidator();
  const detail = isLicenseDetail(fetcher.data) ? fetcher.data : undefined;
  const license = detail?.license;
  const error =
    fetcher.data && "error" in fetcher.data ? fetcher.data.error : undefined;
  const isLoading = open && licenseId !== null && fetcher.state !== "idle" && !license;
  const isSubmitting = fetcher.state === "submitting";
  const detailUrl = licenseId ? `/admin/licenses/api/${licenseId}` : null;
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

    if (isLicenseDetail(fetcher.data) && !error) {
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
          <DialogTitle>
            {license
              ? `자격증 ${license.lic_id ?? ""} · ${license.member_name ?? license.name ?? ""}`
              : "자격증 상세"}
          </DialogTitle>
          <DialogDescription>자격증 정보 수정 및 삭제</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : null}

        {open && licenseId && fetcher.state === "idle" && !license && !error ? (
          <p className="text-sm text-muted-foreground">자격증 정보를 불러올 수 없습니다.</p>
        ) : null}

        {license ? (
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
              <LicenseFormFields
                license={license}
                disabled={isSubmitting}
                idPrefix={`license-detail-${license.id}`}
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
