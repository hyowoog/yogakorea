import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { buildPageHref, getVisiblePageNumbers } from "~/lib/admin-pagination";

interface AdminPaginationProps {
  pathname: string;
  page: number;
  totalPages: number;
  total: number;
}

export function AdminPagination({ pathname, page, totalPages, total }: AdminPaginationProps) {
  const [searchParams] = useSearchParams();

  if (totalPages <= 1) {
    return (
      <p className="text-sm text-muted-foreground">총 {total.toLocaleString("ko-KR")}건</p>
    );
  }

  const firstHref = buildPageHref(pathname, searchParams, 1);
  const prevHref = buildPageHref(pathname, searchParams, page - 1);
  const nextHref = buildPageHref(pathname, searchParams, page + 1);
  const lastHref = buildPageHref(pathname, searchParams, totalPages);
  const visiblePages = getVisiblePageNumbers(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        총 {total.toLocaleString("ko-KR")}건 · {page}/{totalPages} 페이지
      </p>
      <div className="flex flex-wrap gap-2">
        {page > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link to={firstHref}>처음</Link>
          </Button>
        ) : null}
        {page > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link to={prevHref}>이전</Link>
          </Button>
        ) : null}
        {visiblePages.map((pageNumber) =>
          pageNumber === page ? (
            <Button key={pageNumber} size="sm" disabled aria-current="page">
              {pageNumber}
            </Button>
          ) : (
            <Button key={pageNumber} asChild variant="outline" size="sm">
              <Link to={buildPageHref(pathname, searchParams, pageNumber)}>
                {pageNumber}
              </Link>
            </Button>
          ),
        )}
        {page < totalPages ? (
          <Button asChild variant="outline" size="sm">
            <Link to={nextHref}>다음</Link>
          </Button>
        ) : null}
        {page < totalPages ? (
          <Button asChild variant="outline" size="sm">
            <Link to={lastHref}>마지막</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
