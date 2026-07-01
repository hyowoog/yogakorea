import { Link, useLocation } from "react-router";
import { getSectionSidebar } from "~/lib/navigation";

interface PageSidebarProps {
  pathname: string;
}

function isSidebarItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PageSidebar({ pathname }: PageSidebarProps) {
  const sidebar = getSectionSidebar(pathname);
  if (!sidebar) return null;

  return (
    <aside className="yk-page-sidebar">
      <h2 className="yk-page-sidebar-title">{sidebar.sectionTitle}</h2>
      <nav aria-label={`${sidebar.sectionTitle} 메뉴`}>
        <ul className="yk-page-sidebar-list">
          {sidebar.items.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={
                  isSidebarItemActive(pathname, item.href) ? "active" : undefined
                }
                aria-current={
                  isSidebarItemActive(pathname, item.href) ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

interface PageWithSidebarProps {
  children: React.ReactNode;
}

export function PageWithSidebar({ children }: PageWithSidebarProps) {
  const { pathname } = useLocation();
  const sidebar = getSectionSidebar(pathname);

  if (!sidebar) {
    return <div className="yk-container yk-page-content">{children}</div>;
  }

  return (
    <div className="yk-container yk-page-with-sidebar">
      <PageSidebar pathname={pathname} />
      <div className="yk-page-main yk-page-content">{children}</div>
    </div>
  );
}
