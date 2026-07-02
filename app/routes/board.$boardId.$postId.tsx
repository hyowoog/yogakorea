import type { Route } from "./+types/board.$boardId.$postId";
import { data, redirect } from "react-router";
import { BoardView } from "~/components/board/board-view";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import {
  canEditComment,
  createComment,
  deleteComment,
  getBoard,
  getComment,
  getPost,
  getPostAttachments,
  getPostComments,
  incrementViewCount,
  requireBoardAccess,
  updateComment,
} from "~/lib/board.server";
import { getAuthUser } from "~/lib/auth.server";
import { isBrbrBoard } from "~/lib/board-access";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";
import { getBoardBasePath } from "~/lib/route-paths";

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.post.title ?? "게시글"} | 한국요가연합회` }];
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);
  const post = await getPost(db, Number(params.postId));

  if (!board || !post || post.board_id !== params.boardId) {
    throw data("게시글을 찾을 수 없습니다.", { status: 404 });
  }

  if (isBrbrBoard(board)) {
    throw redirect(`${getBoardBasePath(params.boardId)}?post=${params.postId}`);
  }

  await requireBoardAccess(request, db, params.boardId);

  await incrementViewCount(db, post.id);

  const [comments, attachments] = await Promise.all([
    getPostComments(db, post.id),
    getPostAttachments(db, post.id),
  ]);

  return { board, post, comments, attachments };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  await requireBoardAccess(request, context.cloudflare.env.DB, params.boardId);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "comment") {
    const authorName = String(formData.get("authorName") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    if (!authorName || !content) {
      return data({ error: "댓글 내용을 입력해 주세요." }, { status: 400 });
    }

    const user = await getAuthUser(request, context.cloudflare.env.DB);

    await createComment(context.cloudflare.env.DB, {
      postId: Number(params.postId),
      authorName,
      content,
      memberId: user?.id,
    });

    return { ok: true, intent: "comment" };
  }

  if (intent === "updateComment") {
    const commentId = Number(formData.get("commentId"));
    const content = String(formData.get("content") ?? "").trim();

    if (!commentId || !content) {
      return data({ error: "댓글 내용을 입력해 주세요." }, { status: 400 });
    }

    const db = context.cloudflare.env.DB;
    const user = await getAuthUser(request, db);
    if (!user) {
      return data({ error: "로그인이 필요합니다." }, { status: 403 });
    }

    const comment = await getComment(db, commentId);
    if (!comment || comment.post_id !== Number(params.postId)) {
      return data({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (!canEditComment(user, comment)) {
      return data({ error: "댓글 수정 권한이 없습니다." }, { status: 403 });
    }

    await updateComment(db, commentId, content);
    return { ok: true, intent: "updateComment", commentId };
  }

  if (intent === "deleteComment") {
    const commentId = Number(formData.get("commentId"));
    if (!commentId) {
      return data({ error: "삭제할 댓글을 찾을 수 없습니다." }, { status: 400 });
    }

    const db = context.cloudflare.env.DB;
    const user = await getAuthUser(request, db);
    if (!user) {
      return data({ error: "로그인이 필요합니다." }, { status: 403 });
    }

    const comment = await getComment(db, commentId);
    if (!comment || comment.post_id !== Number(params.postId)) {
      return data({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (!canEditComment(user, comment)) {
      return data({ error: "댓글 삭제 권한이 없습니다." }, { status: 403 });
    }

    await deleteComment(db, commentId);
    return { ok: true, intent: "deleteComment", commentId };
  }

  return null;
}

export default function BoardPost({ loaderData }: Route.ComponentProps) {
  const { board, post, comments, attachments } = loaderData;
  const section = getSectionSidebar(getBoardBasePath(board.id));

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle={post.title}
      breadcrumbTitle={board.title}
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
