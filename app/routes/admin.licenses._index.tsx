import type { Route } from "./+types/admin.licenses._index";
import { useEffect, useState } from "react";
import { data, Form, Link, useNavigate, useSearchParams } from "react-router";
import { AdminSelect } from "~/components/admin/admin-select";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPagination } from "~/components/admin/admin-pagination";
import { LicenseCreateDialog } from "~/components/admin/license-create-dialog";
import { LicenseDetailDialog } from "~/components/admin/license-detail-dialog";
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
  countLicenses,
  createLicense,
  listLicenseEduLocOptions,
  listLicenses,
  parseLicenseFilters,
  parseLicenseFormData,
} from "~/lib/yoga-license.server";

export function meta() {
  return [{ title: "자격증현황 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const filters = parseLicenseFilters(url.searchParams);
  const pagination = parsePagination(url.searchParams);
  const [total, licenses, eduLocOptions] = await Promise.all([
    countLicenses(db, filters),
    listLicenses(db, filters, pagination.offset, ADMIN_PAGE_SIZE),
    listLicenseEduLocOptions(db),
  ]);

  return {
    licenses,
    filters,
    eduLocOptions,
    pagination: withPaginationTotal(pagination, total),
    searchQuery: url.search,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create") {
    const parsed = parseLicenseFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    const id = await createLicense(db, parsed.input);
    return data({ detailId: id });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminLicensesIndex({ loaderData }: Route.ComponentProps) {
  const { licenses, filters, eduLocOptions, pagination, searchQuery } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailParam = searchParams.get("detail");
  const detailFromUrl = detailParam ? parseInt(detailParam, 10) : null;
  const [selectedLicenseId, setSelectedLicenseId] = useState<number | null>(
    detailFromUrl && !Number.isNaN(detailFromUrl) ? detailFromUrl : null,
  );
  const [dialogOpen, setDialogOpen] = useState(
    Boolean(detailFromUrl && !Number.isNaN(detailFromUrl)),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (detailFromUrl && !Number.isNaN(detailFromUrl)) {
      setSelectedLicenseId(detailFromUrl);
      setDialogOpen(true);
    }
  }, [detailFromUrl]);

  function openLicenseDetail(licenseId: number) {
    setSelectedLicenseId(licenseId);
    setDialogOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("detail", String(licenseId));
    setSearchParams(nextParams, { replace: true });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setSelectedLicenseId(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("detail");
      const query = nextParams.toString();
      navigate(query ? `/admin/licenses?${query}` : "/admin/licenses", { replace: true });
    }
  }

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="자격증현황"
      title="자격증현황관리"
      actions={
        <Button asChild variant="outline" size="sm">
          <a href={`/admin/licenses/export${searchQuery}`}>엑셀저장</a>
        </Button>
      }
    >
      <Form method="get" className="rounded border bg-slate-50 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">교육기관</label>
            <AdminSelect
              name="eduLoc"
              includeAll
              defaultValue={filters.eduLoc}
              options={eduLocOptions.map((v) => ({ value: v, label: v }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">검색구분</label>
            <AdminSelect
              name="searchField"
              defaultValue={filters.searchField ?? "lic_id"}
              options={[
                { value: "lic_id", label: "자격증번호" },
                { value: "name", label: "성명" },
                { value: "grade_txt", label: "종목 및 급수" },
              ]}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-sky-700">
              검색키워드
            </label>
            <Input name="searchKey" defaultValue={filters.searchKey ?? ""} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="submit"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            검색
          </Button>
          <Button
            asChild
            type="button"
            variant="outline"
            size="sm"
            className="bg-gray-300 hover:bg-gray-400"
          >
            <Link to="/admin/licenses">전체보기</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            자격증 등록
          </Button>
        </div>
      </Form>
      <AdminPagination
        pathname="/admin/licenses"
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />
      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">순번</th>
              <th className="px-3 py-2 text-left">자격번호</th>
              <th className="px-3 py-2 text-left">이름</th>
              <th className="px-3 py-2 text-left">종목 및 급수</th>
              <th className="px-3 py-2 text-left">교육기관</th>
              <th className="px-3 py-2 text-left">등록일</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license, index) => (
              <tr key={license.id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-2">
                  {filters.order === "asc"
                    ? pagination.offset + index + 1
                    : pagination.total - pagination.offset - index}
                </td>
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-blue-700"
                    onClick={() => openLicenseDetail(license.id)}
                  >
                    {license.lic_id ?? "-"}
                  </Button>
                </td>
                <td className="px-3 py-2">
                  {license.member_name ?? license.name}
                </td>
                <td className="px-3 py-2">{license.grade_txt}</td>
                <td className="px-3 py-2">{license.grade_edu_loc}</td>
                <td className="px-3 py-2">{license.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LicenseCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={openLicenseDetail}
      />

      <LicenseDetailDialog
        licenseId={selectedLicenseId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </AdminLayout>
  );
}
