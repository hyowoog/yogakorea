import type { Route } from "./+types/admin.members._index";
import { useEffect, useState } from "react";
import { data, Form, Link, useNavigate, useSearchParams } from "react-router";
import { AdminSelect } from "~/components/admin/admin-select";
import { AdminLayout } from "~/components/admin/admin-layout";
import { MemberCreateDialog } from "~/components/admin/member-create-dialog";
import { MemberDetailDialog } from "~/components/admin/member-detail-dialog";
import { AdminPagination } from "~/components/admin/admin-pagination";
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
  countYogaMembers,
  createYogaMember,
  listMemberFilterOptions,
  listYogaMembers,
  parseMemberFilters,
  parseYogaMemberFormData,
} from "~/lib/yoga-member.server";

export function meta() {
  return [{ title: "회원관리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const filters = parseMemberFilters(url.searchParams);
  const pagination = parsePagination(url.searchParams);
  const [total, members, options] = await Promise.all([
    countYogaMembers(db, filters),
    listYogaMembers(db, filters, pagination.offset, ADMIN_PAGE_SIZE),
    listMemberFilterOptions(db),
  ]);

  return {
    members,
    filters,
    options,
    pagination: withPaginationTotal(pagination, total),
    searchQuery: url.search,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create") {
    const parsed = parseYogaMemberFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    const licId = await createYogaMember(context.cloudflare.env.DB, parsed.input);
    return data({ detailLicId: licId });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminMembersIndex({
  loaderData,
}: Route.ComponentProps) {
  const { members, filters, options, pagination, searchQuery } = loaderData;
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
      navigate(query ? `/admin/members?${query}` : "/admin/members", { replace: true });
    }
  }

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="회원관리"
      title="회원관리"
      description="연합회 회원 목록 및 검색"
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <a href={`/admin/members/export${searchQuery}`}>엑셀저장</a>
          </Button>
        </>
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
              options={options.eduLoc.map((v) => ({ value: v, label: v }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">권역구분</label>
            <AdminSelect
              name="area"
              includeAll
              defaultValue={filters.area}
              options={options.area.map((v) => ({ value: v, label: v }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">회원구분</label>
            <AdminSelect
              name="memberDscd"
              includeAll
              defaultValue={filters.memberDscd}
              options={[
                ...options.memberDscd.map((v) => ({ value: v, label: v })),
                { value: "준회원", label: "준회원" },
              ]}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">급수</label>
            <AdminSelect
              name="grade"
              includeAll
              defaultValue={filters.grade}
              options={[
                { value: "특", label: "특급" },
                { value: "1", label: "1급" },
                { value: "2", label: "2급" },
                { value: "3", label: "3급" },
              ]}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">회원명</label>
            <Input name="name" defaultValue={filters.name ?? ""} className="h-9" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">휴대전화</label>
            <Input name="hp" defaultValue={filters.hp ?? ""} className="h-9" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">자격번호</label>
            <Input name="licId" defaultValue={filters.licId ?? ""} className="h-9" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-sky-700">요가원</label>
            <Input name="yName" defaultValue={filters.yName ?? ""} className="h-9" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="submit" size="sm">검색</Button>
          <Button asChild type="button" variant="outline" size="sm">
            <Link to="/admin/members">전체보기</Link>
          </Button>
          <Button type="button" size="sm" onClick={() => setCreateDialogOpen(true)}>
            회원등록
          </Button>
        </div>
      </Form>

      <AdminPagination
        pathname="/admin/members"
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />

      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">순번</th>
              <th className="px-3 py-2 text-left">자격번호</th>
              <th className="px-3 py-2 text-left">이름</th>
              <th className="px-3 py-2 text-left">회원구분</th>
              <th className="px-3 py-2 text-left">입회일</th>
              <th className="px-3 py-2 text-left">최종납부일</th>
              <th className="px-3 py-2 text-left">권역구분</th>
              <th className="px-3 py-2 text-left">교육기관</th>
              <th className="px-3 py-2 text-left">요가원</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => {
              const rowNo = pagination.total - pagination.offset - index;
              return (
                <tr key={member.id} className="border-t hover:bg-slate-50">
                  <td className="px-3 py-2">{rowNo.toLocaleString("ko-KR")}</td>
                  <td className="px-3 py-2">
                    {member.lic_id ? (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-blue-700"
                        onClick={() => openMemberDetail(member.lic_id!)}
                      >
                        {member.lic_id}
                      </Button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2">{member.name}</td>
                  <td className="px-3 py-2">{member.member_dscd}</td>
                  <td className="px-3 py-2">{member.reg_date}</td>
                  <td className="px-3 py-2">{member.last_pay_date ?? "-"}</td>
                  <td className="px-3 py-2">{member.area_dscd}</td>
                  <td className="px-3 py-2">{member.edu_loc}</td>
                  <td className="px-3 py-2">{member.y_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <MemberCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={openMemberDetail}
      />

      <MemberDetailDialog
        licId={selectedLicId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </AdminLayout>
  );
}
