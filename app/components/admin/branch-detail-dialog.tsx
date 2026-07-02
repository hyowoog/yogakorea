import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { loader as branchDetailLoader } from "~/routes/admin.branches.api.$id";
import { BranchFormFields } from "~/components/admin/branch-form-fields";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type BranchDetailData = Awaited<ReturnType<typeof branchDetailLoader>>;
type BranchDetailFetcherData = BranchDetailData | { error?: string; deleted?: boolean };

function isBranchDetail(data: BranchDetailFetcherData | undefined): data is BranchDetailData {
  return Boolean(data && "branch" in data);
}

interface BranchDetailDialogProps {
  branchId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BranchDetailDialog({
  branchId,
  open,
  onOpenChange,
}: BranchDetailDialogProps) {
  const fetcher = useFetcher<BranchDetailFetcherData>({
    key: branchId ? `branch-detail-${branchId}` : "branch-detail",
  });
  const revalidator = useRevalidator();
  const detail = isBranchDetail(fetcher.data) ? fetcher.data : undefined;
  const branch = detail?.branch;
  const error =
    fetcher.data && "error" in fetcher.data ? fetcher.data.error : undefined;
  const isLoading = open && branchId !== null && fetcher.state !== "idle" && !branch;
  const isSubmitting = fetcher.state === "submitting";
  const detailUrl = branchId ? `/admin/branches/api/${branchId}` : null;
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

    if (isBranchDetail(fetcher.data) && !error) {
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {branch ? `${branch.y_name ?? ""} · ${branch.y_ceo ?? ""}` : "요가원 상세"}
          </DialogTitle>
          <DialogDescription>요가원 정보 수정 및 삭제</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : null}

        {open && branchId && fetcher.state === "idle" && !branch && !error ? (
          <p className="text-sm text-muted-foreground">요가원 정보를 불러올 수 없습니다.</p>
        ) : null}

        {branch ? (
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
              <BranchFormFields
                branch={branch}
                disabled={isSubmitting}
                idPrefix={`branch-detail-${branch.id}`}
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
