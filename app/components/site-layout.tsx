import { PageBreadcrumb } from "~/components/page-breadcrumb";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import type { NavItem } from "~/lib/navigation";

interface SiteLayoutProps {
  children: React.ReactNode;
  navigation: NavItem[];
  variant?: "main" | "renew";
  pageTitle?: string;
  sectionTitle?: string;
  hidePageHero?: boolean;
}

export function SiteLayout({
  children,
  navigation,
  variant = "main",
  pageTitle,
  sectionTitle,
  hidePageHero = false,
}: SiteLayoutProps) {
  return (
    <div className="yk-site">
      <SiteHeader navigation={navigation} variant={variant} />
      {!hidePageHero && (pageTitle || sectionTitle) && (
        <div className="yk-page-hero">
          <div className="yk-container">
            {/* {sectionTitle && <p className="yk-section-label">{sectionTitle}</p>} */}
            <div className="flex items-center justify-between gap-4">
              {pageTitle && <h1 className="yk-page-title">{pageTitle}</h1>}
              <PageBreadcrumb
                pageTitle={pageTitle}
                sectionTitle={sectionTitle}
                homeHref={variant === "renew" ? "/renew" : "/"}
              />
            </div>
          </div>
        </div>
      )}
      <main className="yk-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
