import type { Route } from "./+types/admin.payments._index";
import { useEffect, useState } from "react";
import { Form, Link, useNavigate, useSearchParams } from "react-router";
import { AdminSelect } from "~/components/admin/admin-select";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPagination } from "~/components/admin/admin-pagination";
import { MemberDetailDialog } from "~/components/admin/member-detail-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ADMIN_PAGE_SIZE,
  parsePagination,
  withPaginationTotal,
} from "~/lib/admin-pagination";
import { requireAdmin } from "~/lib/auth.server";
import { mainNavigation } from "~/lib/navigation";
import {
  listPaymentYearOptions,
  listPayments,
  parsePaymentFilters,
  summarizePayments,
} from "~/lib/yoga-payment.server";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const value = String(i + 1).padStart(2, "0");
  return { value, label: `${i + 1}월` };
});

export function meta() {
  return [{ title: "회비입금관리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const filters = parsePaymentFilters(url.searchParams);
  const pagination = parsePagination(url.searchParams);
  const [summary, payments, yearOptions] = await Promise.all([
    summarizePayments(db, filters),
    listPayments(db, filters, pagination.offset, ADMIN_PAGE_SIZE),
    listPaymentYearOptions(db),
  ]);

  return {
    payments,
    filters,
    yearOptions,
    totalAmount: summary.amount,
    pagination: withPaginationTotal(pagination, summary.total),
    searchQuery: url.search,
  };
}

export default function AdminPaymentsIndex({ loaderData }: Route.ComponentProps) {
  const { payments, filters, yearOptions, totalAmount, pagination, searchQuery } =
    loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailParam = searchParams.get("detail");
  const detailFromUrl = detailParam ? parseInt(detailParam, 10) : null;
  const [selectedLicId, setSelectedLicId] = useState<number | null>(
    detailFromUrl && !Number.isNaN(detailFromUrl) ? detailFromUrl : null,
  );
  const [dialogOpen, setDialogOpen] = useState(
    Boolean(detailFromUrl && !Number.isNaN(detailFromUrl)),
  );

  useEffect(() => {
    if (detailFromUrl && !Number.isNaN(detailFromUrl)) {
      setSelectedLicId(detailFromUrl);
      setDialogOpen(true);
    }
  }, [detailFromUrl]);

  function openMemberDetail(licId: number) {
    setSelectedLicId(licId);
    setDialogOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("detail", String(licId));
    setSearchParams(nextParams, { replace: true });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setSelectedLicId(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("detail");
      const query = nextParams.toString();
      navigate(query ? `/admin/payments?${query}` : "/admin/payments", { replace: true });
    }
  }

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="회비입금관리"
      title="회비입금관리"
      description="회비 입금 내역 조회"
      actions={
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-green-500 hover:bg-green-600"
        >
          <a href={`/admin/payments/export${searchQuery}`}>엑셀저장</a>
        </Button>
      }
    >
      <Form method="get" className="rounded border bg-slate-50 p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">납부년도</label>
            <AdminSelect
              name="payYy"
              includeAll
              defaultValue={filters.payYy}
              options={yearOptions.map((v) => ({ value: v, label: `${v}년` }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">납부월</label>
            <AdminSelect
              name="payMonth"
              includeAll
              defaultValue={filters.payMonth}
              options={MONTH_OPTIONS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">검색구분</label>
            <AdminSelect
              name="searchField"
              defaultValue={filters.searchField ?? "lic_id"}
              options={[
                { value: "lic_id", label: "자격번호" },
                { value: "name", label: "이름" },
                { value: "pay_etc", label: "비고" },
              ]}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-sky-700">검색키워드</label>
            <Input name="searchKey" defaultValue={filters.searchKey ?? ""} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="submit" size="sm" className="bg-blue-500 hover:bg-blue-600">
            검색
          </Button>
          <Button
            asChild
            type="button"
            variant="outline"
            size="sm"
            className="bg-gray-300 hover:bg-gray-400"
          >
            <Link to="/admin/payments">전체보기</Link>
          </Button>
        </div>
      </Form>

      <p className="text-sm text-slate-600">
        검색결과 입금합계{" "}
        <span className="font-semibold text-slate-900">
          {totalAmount.toLocaleString("ko-KR")}원
        </span>
      </p>

      <AdminPagination
        pathname="/admin/payments"
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />

      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">순번</th>
              <th className="px-3 py-2 text-left">납부일자</th>
              <th className="px-3 py-2 text-left">납부년도</th>
              <th className="px-3 py-2 text-left">자격번호</th>
              <th className="px-3 py-2 text-left">이름</th>
              <th className="px-3 py-2 text-right">금액</th>
              <th className="px-3 py-2 text-left">비고</th>
            </tr>
          </thead>
          <tbody>
            {payments.length ? (
              payments.map((payment, index) => (
                <tr key={payment.id} className="border-t hover:bg-slate-50">
                  <td className="px-3 py-2">
                    {(pagination.total - pagination.offset - index).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-3 py-2">{payment.pay_date || "-"}</td>
                  <td className="px-3 py-2">{payment.pay_yy || "-"}</td>
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-blue-700"
                      onClick={() => openMemberDetail(payment.lic_id)}
                    >
                      {payment.lic_id}
                    </Button>
                  </td>
                  <td className="px-3 py-2">{payment.member_name || "-"}</td>
                  <td className="px-3 py-2 text-right">
                    {payment.pay_amount != null
                      ? payment.pay_amount.toLocaleString("ko-KR")
                      : "-"}
                  </td>
                  <td className="px-3 py-2">{payment.pay_etc || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  입금 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MemberDetailDialog
        licId={selectedLicId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </AdminLayout>
  );
}
