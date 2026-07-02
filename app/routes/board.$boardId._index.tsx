import type { Route } from "./+types/board.$boardId._index";
import { data } from "react-router";
import { BoardGalleryList } from "~/components/board/board-gallery-list";
import { BoardList } from "~/components/board/board-list";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { getBoard, getBoardPageSize, isGalleryBoard, listPosts, requireBoardAccess } from "~/lib/board.server";
import { buildPostThumbnailMap } from "~/lib/post-thumbnail";
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

  await requireBoardAccess(request, db, params.boardId);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const searchQuery = url.searchParams.get("q") ?? undefined;
  const searchField = url.searchParams.get("field") ?? "title";

  const result = await listPosts(
    db,
    params.boardId,
    page,
    getBoardPageSize(board),
    searchQuery ? { field: searchField, query: searchQuery } : undefined,
  );

  const thumbnails = isGalleryBoard(board)
    ? Object.fromEntries((await buildPostThumbnailMap(db, result.posts)).entries())
    : null;

  return {
    board,
    ...result,
    searchQuery,
    searchField,
    thumbnails,
  };
}

export default function BoardIndex({ loaderData }: Route.ComponentProps) {
  const {
    board,
    posts,
    page,
    totalPages,
    total,
    searchQuery,
    searchField,
    thumbnails,
  } = loaderData;
  const section = getSectionSidebar(`/board/${board.id}`);
  const isGallery = isGalleryBoard(board);

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle={board.title}
      sectionTitle={section?.sectionTitle ?? "게시판"}
    >
      <PageWithSidebar>
        {isGallery && thumbnails ? (
          <BoardGalleryList
            boardId={board.id}
            posts={posts}
            thumbnails={thumbnails}
            page={page}
            totalPages={totalPages}
            total={total}
            searchQuery={searchQuery}
            searchField={searchField}
          />
        ) : (
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
        )}
      </PageWithSidebar>
    </SiteLayout>
  );
}
