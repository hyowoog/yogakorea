import type { Route } from "./+types/admin.branches._index";
import { useEffect, useState } from "react";
import { data, Form, Link, useNavigate, useSearchParams } from "react-router";
import { AdminSelect } from "~/components/admin/admin-select";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPagination } from "~/components/admin/admin-pagination";
import { BranchCreateDialog } from "~/components/admin/branch-create-dialog";
import { BranchDetailDialog } from "~/components/admin/branch-detail-dialog";
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
  countBranches,
  createBranch,
  listBranchFilterOptions,
  listBranches,
  parseBranchFilters,
  parseBranchFormData,
} from "~/lib/yoga-branch.server";

export function meta() {
  return [{ title: "요가원관리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const filters = parseBranchFilters(url.searchParams);
  const pagination = parsePagination(url.searchParams);
  const [total, branches, options] = await Promise.all([
    countBranches(db, filters),
    listBranches(db, filters, pagination.offset, ADMIN_PAGE_SIZE),
    listBranchFilterOptions(db),
  ]);

  return {
    branches,
    filters,
    options,
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
    const parsed = parseBranchFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    const id = await createBranch(db, parsed.input);
    return data({ detailId: id });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminBranchesIndex({ loaderData }: Route.ComponentProps) {
  const { branches, filters, options, pagination, searchQuery } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailParam = searchParams.get("detail");
  const detailFromUrl = detailParam ? parseInt(detailParam, 10) : null;
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(
    detailFromUrl && !Number.isNaN(detailFromUrl) ? detailFromUrl : null,
  );
  const [dialogOpen, setDialogOpen] = useState(
    Boolean(detailFromUrl && !Number.isNaN(detailFromUrl)),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (detailFromUrl && !Number.isNaN(detailFromUrl)) {
      setSelectedBranchId(detailFromUrl);
      setDialogOpen(true);
    }
  }, [detailFromUrl]);

  function openBranchDetail(branchId: number) {
    setSelectedBranchId(branchId);
    setDialogOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("detail", String(branchId));
    setSearchParams(nextParams, { replace: true });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setSelectedBranchId(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("detail");
      const query = nextParams.toString();
      navigate(query ? `/admin/branches?${query}` : "/admin/branches", { replace: true });
    }
  }

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="요가원관리"
      title="요가원관리"
      actions={
        <Button asChild variant="outline" size="sm">
          <a href={`/admin/branches/export${searchQuery}`}>엑셀저장</a>
        </Button>
      }
    >
      <Form method="get" className="rounded border bg-slate-50 p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">권역구분</label>
            <AdminSelect
              name="areaDscd"
              includeAll
              defaultValue={filters.areaDscd}
              options={options.areas.map((v) => ({ value: v, label: v }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">요가원구분</label>
            <AdminSelect
              name="yType"
              includeAll
              defaultValue={filters.yType}
              options={options.types.map((v) => ({ value: v, label: v }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">요가원명</label>
            <Input name="yName" defaultValue={filters.yName ?? ""} placeholder="요가원명" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">원장명</label>
            <Input name="yCeo" defaultValue={filters.yCeo ?? ""} placeholder="원장명" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">사용여부</label>
            <AdminSelect
              name="yYn"
              includeAll
              defaultValue={filters.yYn}
              options={[
                { value: "Y", label: "사용함" },
                { value: "N", label: "사용안함" },
              ]}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="submit" size="sm" className="bg-blue-500 hover:bg-blue-600">검색</Button>
          <Button asChild type="button" variant="outline" size="sm" className="bg-gray-300 hover:bg-gray-400">
            <Link to="/admin/branches">전체보기</Link>
          </Button>
          <Button type="button" size="sm" onClick={() => setCreateDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600">
            요가원 등록
          </Button>
        </div>
      </Form>

      <AdminPagination
        pathname="/admin/branches"
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />

      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">순번</th>
              <th className="px-3 py-2 text-left">권역</th>
              <th className="px-3 py-2 text-left">구분</th>
              <th className="px-3 py-2 text-left">요가원명</th>
              <th className="px-3 py-2 text-left">원장</th>
              <th className="px-3 py-2 text-left">연락처</th>
              <th className="px-3 py-2 text-left">사용</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch, index) => (
              <tr key={branch.id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-2">{pagination.total - pagination.offset - index}</td>
                <td className="px-3 py-2">{branch.y_area_dscd}</td>
                <td className="px-3 py-2">{branch.y_type}</td>
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 font-medium text-blue-700"
                    onClick={() => openBranchDetail(branch.id)}
                  >
                    {branch.y_name}
                  </Button>
                </td>
                <td className="px-3 py-2">{branch.y_ceo}</td>
                <td className="px-3 py-2">{branch.y_hp ?? branch.y_phone}</td>
                <td className="px-3 py-2">{branch.y_yn === "Y" ? "O" : "X"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BranchCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={openBranchDetail}
      />

      <BranchDetailDialog
        branchId={selectedBranchId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </AdminLayout>
  );
}
