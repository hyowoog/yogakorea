import type { Route } from "./+types/board.$boardId.$postId";
import { data } from "react-router";
import { BoardView } from "~/components/board/board-view";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import {
  createComment,
  getBoard,
  getPost,
  getPostAttachments,
  getPostComments,
  incrementViewCount,
} from "~/lib/board.server";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.post.title ?? "게시글"} | 한국요가연합회` }];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);
  const post = await getPost(db, Number(params.postId));

  if (!board || !post || post.board_id !== params.boardId) {
    throw data("게시글을 찾을 수 없습니다.", { status: 404 });
  }

  await incrementViewCount(db, post.id);

  const [comments, attachments] = await Promise.all([
    getPostComments(db, post.id),
    getPostAttachments(db, post.id),
  ]);

  return { board, post, comments, attachments };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "comment") {
    const authorName = String(formData.get("authorName") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    if (!authorName || !content) {
      return data({ error: "댓글 내용을 입력해 주세요." }, { status: 400 });
    }

    await createComment(context.cloudflare.env.DB, {
      postId: Number(params.postId),
      authorName,
      content,
    });
  }

  return null;
}

export default function BoardPost({ loaderData }: Route.ComponentProps) {
  const { board, post, comments, attachments } = loaderData;
  const section = getSectionSidebar(`/board/${board.id}`);

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle={post.title}
      sectionTitle={section?.sectionTitle ?? board.title}
    >
      <PageWithSidebar>
        <BoardView
          boardId={board.id}
          boardTitle={board.title}
          post={post}
          comments={comments}
          attachments={attachments}
        />
      </PageWithSidebar>
    </SiteLayout>
  );
}
