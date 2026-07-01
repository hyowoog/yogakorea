import type { Route } from "./+types/board.$boardId._index";
import { data } from "react-router";
import { BoardList } from "~/components/board/board-list";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { getBoard, listPosts } from "~/lib/board.server";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.board.title ?? "게시판"} | 한국요가연합회` }];
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);

  if (!board) {
    throw data("게시판을 찾을 수 없습니다.", { status: 404 });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const searchQuery = url.searchParams.get("q") ?? undefined;
  const searchField = url.searchParams.get("field") ?? "title";

  const result = await listPosts(
    db,
    params.boardId,
    page,
    board.list_count,
    searchQuery ? { field: searchField, query: searchQuery } : undefined,
  );

  return {
    board,
    ...result,
    searchQuery,
    searchField,
  };
}

export default function BoardIndex({ loaderData }: Route.ComponentProps) {
  const { board, posts, page, totalPages, total, searchQuery, searchField } =
    loaderData;
  const section = getSectionSidebar(`/board/${board.id}`);

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle={board.title}
      sectionTitle={section?.sectionTitle ?? "게시판"}
    >
      <PageWithSidebar>
        <BoardList
          boardId={board.id}
          boardTitle={board.title}
          posts={posts}
          page={page}
          totalPages={totalPages}
          total={total}
          searchQuery={searchQuery}
          searchField={searchField}
        />
      </PageWithSidebar>
    </SiteLayout>
  );
}
