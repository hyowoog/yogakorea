import type { Route } from "./+types/board.$boardId.$postId.edit";
import { data, redirect } from "react-router";
import { BoardWriteForm } from "~/components/board/board-write-form";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { getBoard, getPost, requireBoardMutationAccess, updatePost } from "~/lib/board.server";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";
import { getBoardBasePath, getBoardPostPath } from "~/lib/route-paths";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);
  const post = await getPost(db, Number(params.postId));

  if (!board || !post || post.board_id !== params.boardId) {
    throw data("게시글을 찾을 수 없습니다.", { status: 404 });
  }

  await requireBoardMutationAccess(request, db, params.boardId);

  return { board, post };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  await requireBoardMutationAccess(request, context.cloudflare.env.DB, params.boardId);

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();

  if (!title || !content) {
    return data({ error: "필수 항목을 입력해 주세요." }, { status: 400 });
  }

  await updatePost(context.cloudflare.env.DB, Number(params.postId), {
    title,
    content,
    authorName: authorName || undefined,
  });

  return redirect(getBoardPostPath(params.boardId, Number(params.postId)));
}

export default function BoardEdit({ loaderData }: Route.ComponentProps) {
  const { board, post } = loaderData;
  const section = getSectionSidebar(getBoardBasePath(board.id));

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle="글 수정"
      sectionTitle={section?.sectionTitle ?? board.title}
    >
      <PageWithSidebar>
        <BoardWriteForm
          boardId={board.id}
          boardTitle={board.title}
          submitLabel="수정"
          defaultValues={{
            title: post.title,
            content: post.content ?? "",
            authorName: post.author_name ?? "",
          }}
        />
      </PageWithSidebar>
    </SiteLayout>
  );
}
