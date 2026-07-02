import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageBreadcrumbProps {
  pageTitle?: string;
  breadcrumbTitle?: string;
  sectionTitle?: string;
  homeHref?: string;
}

export function PageBreadcrumb({
  pageTitle,
  breadcrumbTitle,
  sectionTitle,
  homeHref = "/",
}: PageBreadcrumbProps) {
  const lastCrumbTitle = breadcrumbTitle ?? pageTitle;
  const showSection = sectionTitle && sectionTitle !== lastCrumbTitle;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={homeHref}>홈</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {showSection && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {lastCrumbTitle ? (
                <span className="text-muted-foreground">{sectionTitle}</span>
              ) : (
                <BreadcrumbPage>{sectionTitle}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {lastCrumbTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{lastCrumbTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
