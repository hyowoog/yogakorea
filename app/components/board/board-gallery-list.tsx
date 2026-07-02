import { Form, Link } from "react-router";
import { BoardPagination } from "~/components/board/board-pagination";
import type { Post } from "~/lib/board.server";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { ImageIcon } from "lucide-react";

interface BoardGalleryListProps {
  boardId: string;
  posts: Post[];
  thumbnails: Record<number, string | null>;
  page: number;
  totalPages: number;
  total: number;
  searchQuery?: string;
  searchField?: string;
}

export function BoardGalleryList({
  boardId,
  posts,
  thumbnails,
  page,
  totalPages,
  total,
  searchQuery,
  searchField,
}: BoardGalleryListProps) {
  return (
    <div className="yk-board yk-board-gallery">
      {posts.length === 0 ? (
        <p className="rounded border bg-slate-50 px-4 py-10 text-center text-sm text-muted-foreground">
          등록된 게시글이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => {
            const thumbnail = thumbnails[post.id];
            return (
              <Link
                key={post.id}
                to={`/board/${boardId}/${post.id}`}
                className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:border-sky-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageIcon className="size-8 opacity-40" />
                      <span className="text-xs">이미지 없음</span>
                    </div>
                  )}
                  {post.is_notice ? (
                    <Badge className="absolute left-2 top-2 bg-red-500 text-white hover:bg-red-500">
                      공지
                    </Badge>
                  ) : null}
                </div>
                <div className="space-y-1 p-3">
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-sky-700">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {post.author_name ?? "익명"} · {post.created_at.slice(0, 10)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-4 flex justify-end text-sm text-muted-foreground">
        전체 {total} 건 &middot; {totalPages} 페이지
      </p>

      <BoardPagination
        boardId={boardId}
        page={page}
        totalPages={totalPages}
        searchQuery={searchQuery}
        searchField={searchField}
      />

      <Form method="get" className="yk-board-search mt-6">
        <Select name="field" defaultValue={searchField ?? "title"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="검색조건" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="title">제목</SelectItem>
              <SelectItem value="content">내용</SelectItem>
              <SelectItem value="author">작성자</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="search"
          name="q"
          placeholder="검색어"
          defaultValue={searchQuery ?? ""}
        />
        <Button type="submit" variant="outline">
          검색
        </Button>
        <Link to={`/board/${boardId}/write`}>
          <Button variant="outline">글쓰기</Button>
        </Link>
      </Form>
    </div>
  );
}
