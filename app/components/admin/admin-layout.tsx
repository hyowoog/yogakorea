import type { ReactNode } from "react";
import { AdminNav } from "~/components/admin/admin-nav";
import { SiteLayout } from "~/components/site-layout";
import type { NavItem } from "~/lib/navigation";

interface AdminLayoutProps {
  navigation: NavItem[];
  pageTitle: string;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function AdminLayout({
  navigation,
  pageTitle,
  title,
  description,
  children,
  actions,
}: AdminLayoutProps) {
  return (
    <SiteLayout navigation={navigation} pageTitle={pageTitle} hidePageHero>
      <div className="yk-container space-y-4 py-8">
        <AdminNav />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        {children}
      </div>
    </SiteLayout>
  );
}
