import type { Route } from "./+types/admin._index";
import { AdminLayout } from "~/components/admin/admin-layout";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { requireAdmin } from "~/lib/auth.server";
import { mainNavigation } from "~/lib/navigation";
import {
  Building2Icon,
  CalendarDaysIcon,
  GraduationCapIcon,
  IdCardIcon,
  ShirtIcon,
  UsersIcon,
} from "lucide-react";

const ADMIN_SECTIONS = [
  {
    href: "/admin/members",
    name: "회원관리",
    description: "연합회 회원 정보 및 회비 관리",
    Icon: UsersIcon,
    cta: "관리하기",
    className: "col-span-1",
    background: (
      <div className="absolute -top-16 -right-16 size-40 rounded-full bg-sky-100/80" />
    ),
  },
  {
    href: "/admin/licenses",
    name: "자격증현황",
    description: "자격증 발급 현황 관리",
    Icon: IdCardIcon,
    cta: "관리하기",
    className: "col-span-1",
    background: (
      <div className="absolute -top-16 -right-16 size-40 rounded-full bg-emerald-100/80" />
    ),
  },
  {
    href: "/admin/educations",
    name: "교육이수",
    description: "회원 교육 이수 내역 관리",
    Icon: GraduationCapIcon,
    cta: "관리하기",
    className: "col-span-1",
    background: (
      <div className="absolute -top-16 -right-16 size-40 rounded-full bg-violet-100/80" />
    ),
  },
  {
    href: "/admin/branches",
    name: "요가원관리",
    description: "전국 요가원 정보 관리",
    Icon: Building2Icon,
    cta: "관리하기",
    className: "col-span-1",
    background: (
      <div className="absolute -top-16 -right-16 size-40 rounded-full bg-amber-100/80" />
    ),
  },
  {
    href: "/admin/events",
    name: "참가신청관리",
    description: "행사 참가 신청 관리",
    Icon: CalendarDaysIcon,
    cta: "관리하기",
    className: "col-span-1",
    background: (
      <div className="absolute -top-16 -right-16 size-40 rounded-full bg-rose-100/80" />
    ),
  },
  {
    href: "/admin/tshirts",
    name: "티셔츠신청관리",
    description: "티셔츠 신청 현황 관리",
    Icon: ShirtIcon,
    cta: "관리하기",
    className: "col-span-1",
    background: (
      <div className="absolute -top-16 -right-16 size-40 rounded-full bg-cyan-100/80" />
    ),
  },
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
      <BentoGrid className="auto-rows-[18rem] lg:grid-rows-2">
        {ADMIN_SECTIONS.map((section) => (
          <BentoCard
            key={section.href}
            name={section.name}
            description={section.description}
            href={section.href}
            cta={section.cta}
            Icon={section.Icon}
            background={section.background}
            className={section.className}
          />
        ))}
      </BentoGrid>
    </AdminLayout>
  );
}
