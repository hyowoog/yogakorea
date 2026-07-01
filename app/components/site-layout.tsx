import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import type { NavItem } from "~/lib/navigation";

interface SiteLayoutProps {
  children: React.ReactNode;
  navigation: NavItem[];
  variant?: "main" | "renew";
  pageTitle?: string;
  sectionTitle?: string;
}

export function SiteLayout({
  children,
  navigation,
  variant = "main",
  pageTitle,
  sectionTitle,
}: SiteLayoutProps) {
  return (
    <div className="yk-site">
      <SiteHeader navigation={navigation} variant={variant} />
      {(pageTitle || sectionTitle) && (
        <div className="yk-page-hero">
          <div className="yk-container">
            {sectionTitle && <p className="yk-section-label">{sectionTitle}</p>}
            {pageTitle && <h1 className="yk-page-title">{pageTitle}</h1>}
          </div>
        </div>
      )}
      <main className="yk-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
