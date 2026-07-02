import type { Route } from "./+types/admin._index";
import { Link } from "react-router";
import { AdminLayout } from "~/components/admin/admin-layout";
import { Button } from "~/components/ui/button";
import { requireAdmin } from "~/lib/auth.server";
import { mainNavigation } from "~/lib/navigation";

const ADMIN_SECTIONS = [
  { to: "/admin/members", title: "회원관리", description: "연합회 회원 정보 및 회비 관리" },
  { to: "/admin/licenses", title: "자격증현황", description: "자격증 발급 현황 관리" },
  { to: "/admin/educations", title: "교육이수", description: "회원 교육 이수 내역 관리" },
  { to: "/admin/branches", title: "요가원관리", description: "전국 요가원 정보 관리" },
  { to: "/admin/slides", title: "메인사진관리", description: "메인 페이지 슬라이드 이미지 관리" },
  { to: "/admin/events", title: "참가신청관리", description: "행사 참가 신청 관리" },
  { to: "/admin/tshirts", title: "티셔츠신청관리", description: "티셔츠 신청 현황 관리" },
] as const;

export function meta() {
  return [{ title: "관리자 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  return {};
}

export default function AdminIndex() {
  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="관리자"
      title="관리자 홈"
      description="레거시 renew/manage 기능을 통합한 관리 메뉴입니다."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ADMIN_SECTIONS.map((section) => (
          <Button
            key={section.to}
            asChild
            variant="outline"
            className="h-auto flex-col items-start gap-2 whitespace-normal p-5 text-left shadow-sm hover:shadow-md"
          >
            <Link to={section.to}>
              <span className="text-lg font-semibold text-sky-800">{section.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {section.description}
              </span>
            </Link>
          </Button>
        ))}
      </div>
    </AdminLayout>
  );
}
