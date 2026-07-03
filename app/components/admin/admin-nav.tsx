import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const ADMIN_LINKS = [
  { to: "/admin/members", label: "회원관리" },
  { to: "/admin/licenses", label: "자격증현황" },
  { to: "/admin/educations", label: "교육이수" },
  { to: "/admin/branches", label: "요가원관리" },
  // { to: "/admin/slides", label: "메인사진관리" },
  { to: "/admin/events", label: "참가신청관리" },
  { to: "/admin/tshirts", label: "티셔츠신청관리" },
] as const;

export function AdminNav() {
  const { pathname } = useLocation();

  return (
    <nav className="overflow-x-auto rounded border bg-sky-700 text-white shadow-sm">
      <ul className="flex min-w-max gap-1 p-1 text-sm">
        <li>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              "text-white hover:bg-sky-600 hover:text-white",
              pathname === "/admin" && "bg-sky-900 font-semibold",
            )}
          >
            <Link to="/admin">관리자모드홈</Link>
          </Button>
        </li>
        {ADMIN_LINKS.map((link) => (
          <li key={link.to}>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "whitespace-nowrap text-white hover:bg-sky-600 hover:text-white",
                pathname.startsWith(link.to) && "bg-sky-900 font-semibold",
              )}
            >
              <Link to={link.to}>{link.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
