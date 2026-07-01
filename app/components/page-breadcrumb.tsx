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
  sectionTitle?: string;
  homeHref?: string;
}

export function PageBreadcrumb({
  pageTitle,
  sectionTitle,
  homeHref = "/",
}: PageBreadcrumbProps) {
  const showSection = sectionTitle && sectionTitle !== pageTitle;

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
              {pageTitle ? (
                <span className="text-muted-foreground">{sectionTitle}</span>
              ) : (
                <BreadcrumbPage>{sectionTitle}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {pageTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
