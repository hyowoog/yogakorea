import type { Route } from "./+types/admin.educations._index";
import { useEffect, useState } from "react";
import { data, Form, Link, useNavigate, useSearchParams } from "react-router";
import { AdminSelect } from "~/components/admin/admin-select";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPagination } from "~/components/admin/admin-pagination";
import { EducationCreateDialog } from "~/components/admin/education-create-dialog";
import { EducationGuestCreateDialog } from "~/components/admin/education-guest-create-dialog";
import { EducationDetailDialog } from "~/components/admin/education-detail-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ADMIN_PAGE_SIZE,
  parsePagination,
  withPaginationTotal,
} from "~/lib/admin-pagination";
import { requireAdmin } from "~/lib/auth.server";
import { mainNavigation } from "~/lib/navigation";
import { formatEducationGubun } from "~/lib/yoga-constants";
import {
  countEducations,
  createEducation,
  createEducations,
  listEducationEduLocOptions,
  listEducations,
  parseEducationFilters,
  parseBulkEducationFormData,
  parseGuestEducationFormData,
} from "~/lib/yoga-education.server";

export function meta() {
  return [{ title: "교육이수 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const filters = parseEducationFilters(url.searchParams);
  const pagination = parsePagination(url.searchParams);
  const [total, educations, eduLocOptions] = await Promise.all([
    countEducations(db, filters),
    listEducations(db, filters, pagination.offset, ADMIN_PAGE_SIZE),
    listEducationEduLocOptions(db),
  ]);

  return {
    educations,
    filters,
    eduLocOptions,
    pagination: withPaginationTotal(pagination, total),
    searchQuery: url.search,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create") {
    const parsed = parseBulkEducationFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    const result = await createEducations(context.cloudflare.env.DB, parsed.input, parsed.licIds);
    return data({ detailId: result.firstId, createdCount: result.count });
  }

  if (intent === "createGuest") {
    const parsed = parseGuestEducationFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    const id = await createEducation(context.cloudflare.env.DB, parsed.input);
    return data({ detailId: id });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminEducationsIndex({ loaderData }: Route.ComponentProps) {
  const { educations, filters, eduLocOptions, pagination, searchQuery } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailParam = searchParams.get("detail");
  const detailFromUrl = detailParam ? parseInt(detailParam, 10) : null;
  const [selectedEducationId, setSelectedEducationId] = useState<number | null>(
    detailFromUrl && !Number.isNaN(detailFromUrl) ? detailFromUrl : null,
  );
  const [dialogOpen, setDialogOpen] = useState(
    Boolean(detailFromUrl && !Number.isNaN(detailFromUrl)),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [guestCreateDialogOpen, setGuestCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (detailFromUrl && !Number.isNaN(detailFromUrl)) {
      setSelectedEducationId(detailFromUrl);
      setDialogOpen(true);
    }
  }, [detailFromUrl]);

  function openEducationDetail(educationId: number) {
    setSelectedEducationId(educationId);
    setDialogOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("detail", String(educationId));
    setSearchParams(nextParams, { replace: true });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setSelectedEducationId(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("detail");
      const query = nextParams.toString();
      navigate(query ? `/admin/educations?${query}` : "/admin/educations", { replace: true });
    }
  }

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="교육이수"
      title="교육이수"
      actions={
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-green-500 hover:bg-green-600"
        >
          <a href={`/admin/educations/export${searchQuery}`}>엑셀저장</a>
        </Button>
      }
    >
      <Form method="get" className="rounded border bg-slate-50 p-4">
        {filters.guest ? <input type="hidden" name="guest" value="1" /> : null}
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
                { value: "grade_txt", label: "교육내용" },
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
            <Link to="/admin/educations">전체보기</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            회원교육 등록
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => setGuestCreateDialogOpen(true)}
          >
            비회원교육 등록
          </Button>
          <Button
            asChild
            type="button"
            size="sm"
            className={
              filters.guest
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-slate-400 hover:bg-slate-500"
            }
          >
            <Link to="/admin/educations?guest=1">비회원교육 리스트</Link>
          </Button>
        </div>
      </Form>

      <AdminPagination
        pathname="/admin/educations"
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />

      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">순번</th>
              <th className="px-3 py-2 text-left">기준일자</th>
              <th className="px-3 py-2 text-left">자격번호</th>
              <th className="px-3 py-2 text-left">이름</th>
              <th className="px-3 py-2 text-left">구분</th>
              <th className="px-3 py-2 text-left">교육내용</th>
              <th className="px-3 py-2 text-left">시간</th>
              <th className="px-3 py-2 text-left">교육기관</th>
            </tr>
          </thead>
          <tbody>
            {educations.map((education, index) => (
              <tr key={education.id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-2">
                  {pagination.total - pagination.offset - index}
                </td>
                <td className="px-3 py-2">{education.bas_date}</td>
                <td className="px-3 py-2">{education.lic_id}</td>
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-blue-700"
                    onClick={() => openEducationDetail(education.id)}
                  >
                    {education.member_name ?? education.name}
                  </Button>
                </td>
                <td className="px-3 py-2">
                  {formatEducationGubun(education.gubun)}
                </td>
                <td className="px-3 py-2">{education.grade_txt}</td>
                <td className="px-3 py-2">{education.hour || "-"}</td>
                <td className="px-3 py-2">{education.grade_edu_loc || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EducationCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={openEducationDetail}
      />

      <EducationGuestCreateDialog
        open={guestCreateDialogOpen}
        onOpenChange={setGuestCreateDialogOpen}
      />

      <EducationDetailDialog
        educationId={selectedEducationId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </AdminLayout>
  );
}
