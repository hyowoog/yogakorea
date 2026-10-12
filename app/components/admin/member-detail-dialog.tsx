import { useEffect, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { loader as memberDetailLoader } from "~/routes/admin.members.api.$licId";
import { AdminSelect } from "~/components/admin/admin-select";
import { MemberFormFields } from "~/components/admin/member-form-fields";
import { formatEducationGubun } from "~/lib/yoga-constants";
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

const RECENT_PAYMENT_COUNT = 3;

/** 레거시 화면의 구분별 이수시간 표시 순서 */
const EDUCATION_HOUR_SUMMARY = [
  { gubun: "4", label: "워크숍" },
  { gubun: "1", label: "수련회" },
  { gubun: "3", label: "특강" },
  { gubun: "2", label: "심화교육" },
] as const;

function EducationHistorySection({
  educations,
}: {
  educations: MemberDetailData["educations"];
}) {
  const [expanded, setExpanded] = useState(false);
  const hourTotals = new Map<string, number>();
  for (const education of educations) {
    const hour = parseFloat(education.hour ?? "");
    if (!education.gubun || Number.isNaN(hour)) continue;
    hourTotals.set(education.gubun, (hourTotals.get(education.gubun) ?? 0) + hour);
  }

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold">교육이수내역</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {EDUCATION_HOUR_SUMMARY.map(({ gubun, label }) => (
            <span key={gubun} className="rounded border bg-slate-50 px-2 py-1">
              {label} <strong>{Math.round((hourTotals.get(gubun) ?? 0) * 10) / 10}H</strong>
            </span>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "감추기" : `더보기(${educations.length})`}
          </Button>
        </div>
      </div>
      {expanded ? (
        <div className="overflow-x-auto rounded border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-14 px-3 py-2 text-center">순서</th>
                <th className="px-3 py-2 text-left">기준일자</th>
                <th className="px-3 py-2 text-left">구분</th>
                <th className="px-3 py-2 text-left">교육내용</th>
                <th className="px-3 py-2 text-left">시간</th>
                <th className="px-3 py-2 text-left">교육기관</th>
              </tr>
            </thead>
            <tbody>
              {educations.length ? (
                educations.map((education, index) => (
                  <tr key={education.id} className="border-t">
                    <td className="px-3 py-2 text-center">{index + 1}</td>
                    <td className="px-3 py-2">{education.bas_date}</td>
                    <td className="px-3 py-2">{formatEducationGubun(education.gubun)}</td>
                    <td className="px-3 py-2">{education.grade_txt}</td>
                    <td className="px-3 py-2">{education.hour}</td>
                    <td className="px-3 py-2">{education.grade_edu_loc}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                    교육이수내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function LicenseStatusSection({ licenses }: { licenses: MemberDetailData["licenses"] }) {
  return (
    <section>
      <h3 className="mb-3 text-base font-semibold">자격현황</h3>
      <div className="overflow-x-auto rounded border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-14 px-3 py-2 text-center">순서</th>
              <th className="px-3 py-2 text-left">취득일자</th>
              <th className="px-3 py-2 text-left">종목 및 급수</th>
              <th className="px-3 py-2 text-left">교육기관</th>
            </tr>
          </thead>
          <tbody>
            {licenses.length ? (
              licenses.map((license, index) => (
                <tr key={license.id} className="border-t">
                  <td className="px-3 py-2 text-center">{index + 1}</td>
                  <td className="px-3 py-2">{license.created}</td>
                  <td className="px-3 py-2">{license.grade_txt}</td>
                  <td className="px-3 py-2">{license.grade_edu_loc}</td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                  자격현황이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
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
  const [showPayments, setShowPayments] = useState(false);
  // 기본은 최근 회비 내역만 보여주고, 더보기 시 전체 표시
  const visiblePayments = showPayments ? payments : payments.slice(0, RECENT_PAYMENT_COUNT);

  useEffect(() => {
    if (open && detailUrl) {
      setShowPayments(false);
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
          <DialogDescription>회원 정보, 회비, 교육이수내역 및 자격현황</DialogDescription>
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
                <div className="flex justify-end gap-2 md:col-span-3">
                  {detail?.loginAccountExists ? (
                    <Button type="button" variant="secondary" disabled>
                      (구)회원로그인중
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (!detailUrl) return;
                        if (!confirm("저장된 회원아이디·비밀번호로 로그인 계정을 추가하시겠습니까?")) {
                          return;
                        }
                        fetcher.submit(
                          { intent: "login_create" },
                          { method: "post", action: detailUrl },
                        );
                      }}
                    >
                      (구)회원로그인추가
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </fetcher.Form>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">회비 내역</h3>
                {payments.length > RECENT_PAYMENT_COUNT ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPayments((value) => !value)}
                  >
                    {showPayments ? "감추기" : `더보기(${payments.length})`}
                  </Button>
                ) : null}
              </div>
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
                    {visiblePayments.map((payment) => (
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
                              className="h-8 min-w-32"
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
                              className="h-8 text-right"
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

            <EducationHistorySection educations={detail?.educations ?? []} />
            <LicenseStatusSection licenses={detail?.licenses ?? []} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
