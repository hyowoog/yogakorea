import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getBoardListPath } from "~/lib/route-paths";

interface BoardPaginationProps {
  boardId: string;
  page: number;
  totalPages: number;
  searchQuery?: string;
  searchField?: string;
  jobCategory?: string;
}

function buildPagePath(
  boardId: string,
  pageNum: number,
  searchQuery?: string,
  searchField?: string,
  jobCategory?: string,
) {
  return getBoardListPath(boardId, {
    page: pageNum,
    searchQuery,
    searchField,
    jobCategory,
  });
}

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis")[] = [1];

  if (current > 3) items.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) items.push(i);

  if (current < total - 2) items.push("ellipsis");

  items.push(total);
  return items;
}

export function BoardPagination({
  boardId,
  page,
  totalPages,
  searchQuery,
  searchField,
  jobCategory,
}: BoardPaginationProps) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(page, totalPages);
  const prevPath = buildPagePath(boardId, page - 1, searchQuery, searchField, jobCategory);
  const nextPath = buildPagePath(boardId, page + 1, searchQuery, searchField, jobCategory);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <Button asChild variant="ghost" size="default" className="pl-1.5!">
              <Link to={prevPath} aria-label="이전 페이지">
                <ChevronLeftIcon data-icon="inline-start" />
                <span className="hidden sm:inline">이전</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="default"
              className="pl-1.5!"
              disabled
              aria-label="이전 페이지"
            >
              <ChevronLeftIcon data-icon="inline-start" />
              <span className="hidden sm:inline">이전</span>
            </Button>
          )}
        </PaginationItem>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <Button
                asChild
                variant={item === page ? "outline" : "ghost"}
                size="icon"
              >
                <Link
                  to={buildPagePath(boardId, item, searchQuery, searchField, jobCategory)}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </Link>
              </Button>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {page < totalPages ? (
            <Button asChild variant="ghost" size="default" className="pr-1.5!">
              <Link to={nextPath} aria-label="다음 페이지">
                <span className="hidden sm:inline">다음</span>
                <ChevronRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="default"
              className="pr-1.5!"
              disabled
              aria-label="다음 페이지"
            >
              <span className="hidden sm:inline">다음</span>
              <ChevronRightIcon data-icon="inline-end" />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
