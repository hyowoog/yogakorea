import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import type { Post } from "~/lib/board.server";
import { Badge } from "@/components/ui/badge";

export interface BoardTableRow extends Post {
  rowNumber: number;
}

interface BoardColumnsOptions {
  boardId: string;
}

export function getBoardColumns({
  boardId,
}: BoardColumnsOptions): ColumnDef<BoardTableRow>[] {
  return [
    {
      accessorKey: "rowNumber",
      header: "번호",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.is_notice ? "공지" : row.original.rowNumber}
        </span>
      ),
      meta: { className: "w-16 text-center" },
    },
    {
      accessorKey: "title",
      header: "제목",
      cell: ({ row }) => (
        <Link
          to={`/board/${boardId}/${row.original.id}`}
          className="inline-flex items-center gap-2 font-medium hover:text-primary hover:underline"
        >
          {row.original.is_notice ? (
            <Badge variant="secondary" className="bg-red-300 text-white">
              공지
            </Badge>
          ) : null}
          {row.original.depth > 0 && (
            <span className="text-muted-foreground">↳</span>
          )}
          <span className="whitespace-normal">{row.original.title}</span>
        </Link>
      ),
    },
    {
      accessorKey: "author_name",
      header: "작성자",
      cell: ({ row }) => row.original.author_name ?? "-",
      meta: { className: "w-28" },
    },
    {
      accessorKey: "created_at",
      header: "날짜",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.created_at.slice(0, 10)}
        </span>
      ),
      meta: { className: "w-28" },
    },
    {
      accessorKey: "view_count",
      header: "조회",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.view_count.toLocaleString("ko-KR")}
        </span>
      ),
      meta: { className: "w-16 text-right" },
    },
  ];
}
