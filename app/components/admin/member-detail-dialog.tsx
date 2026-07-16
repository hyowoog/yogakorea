import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { loader as memberDetailLoader } from "~/routes/admin.members.api.$licId";
import { AdminSelect } from "~/components/admin/admin-select";
import { MemberFormFields } from "~/components/admin/member-form-fields";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

type MemberDetailData = Awaited<ReturnType<typeof memberDetailLoader>>;
type MemberDetailFetcherData = MemberDetailData | { error?: string };

function isMemberDetail(data: MemberDetailFetcherData | undefined): data is MemberDetailData {
  return Boolean(data && "member" in data);
}

interface MemberDetailDialogProps {
  licId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDetailDialog({
  licId,
  open,
  onOpenChange,
}: MemberDetailDialogProps) {
  const fetcher = useFetcher<MemberDetailFetcherData>({
    key: licId ? `member-detail-${licId}` : "member-detail",
  });
  const revalidator = useRevalidator();
  const detail = isMemberDetail(fetcher.data) ? fetcher.data : undefined;
  const member = detail?.member;
  const payments = detail?.payments ?? [];
  const formKey = member
    ? `${member.id}-${payments.map((p) => `${p.id}:${p.pay_date}:${p.pay_yy}:${p.pay_amount}`).join("|")}`
    : "empty";
  const error =
    fetcher.data && "error" in fetcher.data ? fetcher.data.error : undefined;
  const isLoading = open && licId !== null && fetcher.state !== "idle" && !member;
  const isSubmitting = fetcher.state === "submitting";
  const currentYear = new Date().getFullYear();
  const detailUrl = licId ? `/admin/members/api/${licId}` : null;
  const closeAfterMemberSaveRef = useRef(false);

  useEffect(() => {
    if (open && detailUrl) {
      fetcher.load(detailUrl);
    }
  }, [open, detailUrl]);

  useEffect(() => {
    if (!closeAfterMemberSaveRef.current || fetcher.state !== "idle") return;

    if (isMemberDetail(fetcher.data) && !error) {
      closeAfterMemberSaveRef.current = false;
      revalidator.revalidate();
      onOpenChange(false);
      return;
    }

    if (error) {
      closeAfterMemberSaveRef.current = false;
    }
  }, [fetcher.state, fetcher.data, error, onOpenChange, revalidator]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {member ? `${member.name} (${member.lic_id})` : "회원 상세"}
          </DialogTitle>
          <DialogDescription>회원 정보 및 회비 관리</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : null}

        {open && licId && fetcher.state === "idle" && !member && !error ? (
          <p className="text-sm text-muted-foreground">회원 정보를 불러올 수 없습니다.</p>
        ) : null}

        {member ? (
          <div key={formKey} className="space-y-6">
            {error ? (
              <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <section>
              <h3 className="mb-3 text-base font-semibold">회원 정보</h3>
              <fetcher.Form
                method="post"
                action={detailUrl ?? undefined}
                className="grid gap-3 md:grid-cols-3"
                onSubmit={() => {
                  closeAfterMemberSaveRef.current = true;
                }}
              >
                <input type="hidden" name="intent" value="update" />
                <MemberFormFields
                  member={member}
                  disabled={isSubmitting}
                  idPrefix={`member-detail-${member.lic_id ?? member.id}`}
                />
                <Button
                  type="submit"
                  className="md:col-span-3 md:justify-self-end"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </fetcher.Form>
            </section>

            <section>
              <h3 className="mb-3 text-base font-semibold">회비 내역</h3>
              <div className="overflow-x-auto rounded border">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left">납부일</th>
                      <th className="px-3 py-2 text-left">연도</th>
                      <th className="px-3 py-2 text-left">금액</th>
                      <th className="px-3 py-2 text-left">비고</th>
                      <th className="px-3 py-2 text-left">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-t">
                        <td className="px-3 py-2 align-middle">{payment.pay_date}</td>
                        <td className="px-3 py-2 align-middle">{payment.pay_yy}</td>
                        <td className="px-3 py-2 align-middle">
                          {(payment.pay_amount ?? 0).toLocaleString("ko-KR")}
                        </td>
                        <td className="px-3 py-2 align-middle">{payment.pay_etc}</td>
                        <td className="px-3 py-2 align-middle">
                          <fetcher.Form
                            method="post"
                            action={detailUrl ?? undefined}
                            className="flex items-center gap-2"
                            onSubmit={(event) => {
                              if (
                                (event.nativeEvent as SubmitEvent).submitter?.getAttribute(
                                  "value",
                                ) === "pay_delete" &&
                                !confirm("정말 삭제하시겠습니까?")
                              ) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="paymentId" value={payment.id} />
                            <Input
                              name="payDate"
                              defaultValue={payment.pay_date ?? ""}
                              className="h-8"
                              disabled={isSubmitting}
                            />
                            <Input
                              name="payYy"
                              defaultValue={payment.pay_yy ?? ""}
                              className="h-8"
                              disabled={isSubmitting}
                            />
                            <Input
                              name="payAmount"
                              defaultValue={String(payment.pay_amount ?? "")}
                              className="h-8"
                              disabled={isSubmitting}
                            />
                            <Input
                              name="payEtc"
                              defaultValue={payment.pay_etc ?? ""}
                              className="h-8"
                              disabled={isSubmitting}
                            />
                            <div className="flex gap-2">
                              <Button
                                type="submit"
                                name="intent"
                                value="pay_update"
                                size="sm"
                                disabled={isSubmitting}
                              >
                                수정
                              </Button>
                              <Button
                                type="submit"
                                name="intent"
                                value="pay_delete"
                                size="sm"
                                variant="destructive"
                                disabled={isSubmitting}
                              >
                                삭제
                              </Button>
                            </div>
                          </fetcher.Form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <fetcher.Form
                method="post"
                action={detailUrl ?? undefined}
                className="mt-4 grid gap-2 md:grid-cols-5 md:items-end"
              >
                <input type="hidden" name="intent" value="pay_create" />
                <Input name="payDate" type="date" required disabled={isSubmitting} />
                <AdminSelect
                  name="payYy"
                  className="w-full"
                  defaultValue={String(currentYear)}
                  options={Array.from({ length: 12 }, (_, i) => currentYear - 10 + i).map(
                    (year) => ({
                      value: String(year),
                      label: `${year}년`,
                    }),
                  )}
                />
                <Input name="payAmount" placeholder="금액" required disabled={isSubmitting} />
                <Input name="payEtc" placeholder="비고" disabled={isSubmitting} />
                <Button type="submit" disabled={isSubmitting}>
                  회비 추가
                </Button>
              </fetcher.Form>
            </section>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
