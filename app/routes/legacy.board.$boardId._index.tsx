import type { Route } from "./+types/legacy.board.$boardId._index";
import { data } from "react-router";
import { BoardList } from "~/components/board/board-list";
import { SiteLayout } from "~/components/site-layout";
import { getBoard, listPosts } from "~/lib/board.server";
import { legacyNavigation } from "~/lib/navigation";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);

  if (!board || board.source !== "gnuboard") {
    throw data("게시판을 찾을 수 없습니다.", { status: 404 });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const result = await listPosts(db, params.boardId, page, board.list_count);

  return { board, ...result };
}

export default function LegacyBoardIndex({ loaderData }: Route.ComponentProps) {
  const { board, posts, page, totalPages, total } = loaderData;

  return (
    <SiteLayout
      navigation={legacyNavigation}
      variant="legacy"
      pageTitle={board.title}
      sectionTitle="커뮤니티 (구)"
    >
      <div className="yk-container">
        <BoardList
          boardId={board.id}
          boardTitle={board.title}
          posts={posts}
          page={page}
          totalPages={totalPages}
          total={total}
        />
      </div>
    </SiteLayout>
  );
}
