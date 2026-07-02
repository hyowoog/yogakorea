import { Form, Link } from "react-router";
import { BoardPagination } from "~/components/board/board-pagination";
import type { Post } from "~/lib/board.server";
import { getPostPlainTextExcerpt } from "~/lib/post-content";
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

interface BoardCardListProps {
  boardId: string;
  posts: Post[];
  page: number;
  totalPages: number;
  total: number;
  searchQuery?: string;
  searchField?: string;
}

export function BoardCardList({
  boardId,
  posts,
  page,
  totalPages,
  total,
  searchQuery,
  searchField,
}: BoardCardListProps) {
  return (
    <div className="yk-board yk-board-card">
      {posts.length === 0 ? (
        <p className="rounded border bg-slate-50 px-4 py-10 text-center text-sm text-muted-foreground">
          등록된 게시글이 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const excerpt = getPostPlainTextExcerpt(post.content, 100);
            return (
              <Link
                key={post.id}
                to={`/board/${boardId}/${post.id}`}
                className="group flex h-full flex-col rounded-lg border bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md"
              >
                <div className="mb-2 flex items-start gap-2">
                  {post.is_notice ? (
                    <Badge className="shrink-0 bg-red-500 text-white hover:bg-red-500">
                      공지
                    </Badge>
                  ) : null}
                  <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-sky-700">
                    {post.title}
                  </h3>
                </div>
                {excerpt ? (
                  <p className="mb-3 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {excerpt}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                <p className="mt-auto text-xs text-muted-foreground">
                  {post.author_name ?? "익명"} · {post.created_at.slice(0, 10)}
                </p>
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
