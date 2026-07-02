export const ADMIN_PAGE_SIZE = 15;

export interface PaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  offset: number;
}

export function parsePagination(
  searchParams: URLSearchParams,
  pageSize = ADMIN_PAGE_SIZE,
): PaginationResult {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const total = 0;
  const totalPages = 1;
  return {
    page,
    pageSize,
    total,
    totalPages,
    offset: (page - 1) * pageSize,
  };
}

export function withPaginationTotal(
  pagination: Omit<PaginationResult, "total" | "totalPages">,
  total: number,
): PaginationResult {
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
  const page = Math.min(pagination.page, totalPages);
  return {
    ...pagination,
    page,
    total,
    totalPages,
    offset: (page - 1) * pagination.pageSize,
  };
}

export function buildPageHref(pathname: string, searchParams: URLSearchParams, page: number) {
  const params = new URLSearchParams(searchParams);
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible = 5,
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let start = currentPage - Math.floor(maxVisible / 2);
  let end = start + maxVisible - 1;

  if (start < 1) {
    start = 1;
    end = maxVisible;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
