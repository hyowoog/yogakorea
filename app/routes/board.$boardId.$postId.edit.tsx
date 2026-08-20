import type { Route } from "./+types/board.$boardId.$postId.edit";
import { data, redirect } from "react-router";
import { BoardWriteForm } from "~/components/board/board-write-form";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { getAuthUser } from "~/lib/auth.server";
import { getBoard, getPost, requireBoardMutationAccess, updatePost } from "~/lib/board.server";
import { ADMIN_LEVEL } from "~/lib/event-constants";
import { isJobBoard, parseJobTitle, resolvePostTitle } from "~/lib/job-board";
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
  const user = await getAuthUser(request, db);

  return { board, post, isAdmin: Boolean(user && user.level >= ADMIN_LEVEL) };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;
  await requireBoardMutationAccess(request, db, params.boardId);

  const formData = await request.formData();
  const user = await getAuthUser(request, db);
  const isAdmin = Boolean(user && user.level >= ADMIN_LEVEL);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const resolvedTitle = resolvePostTitle(
    params.boardId,
    title,
    String(formData.get("jobCategory") ?? ""),
  );

  if (!title || !content) {
    return data({ error: "필수 항목을 입력해 주세요." }, { status: 400 });
  }

  if (!resolvedTitle.ok) {
    return data({ error: resolvedTitle.error }, { status: 400 });
  }

  await updatePost(db, Number(params.postId), {
    title: resolvedTitle.title,
    content,
    authorName: authorName || undefined,
    isNotice: isAdmin ? formData.get("isNotice") === "1" : undefined,
  });

  return redirect(getBoardPostPath(params.boardId, Number(params.postId)));
}

export default function BoardEdit({ loaderData }: Route.ComponentProps) {
  const { board, post } = loaderData;
  const section = getSectionSidebar(getBoardBasePath(board.id));
  const jobTitle = isJobBoard(board.id) ? parseJobTitle(post.title) : null;

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
          isAdmin={loaderData.isAdmin}
          submitLabel="수정"
          defaultValues={{
            title: jobTitle?.body ?? post.title,
            content: post.content ?? "",
            authorName: post.author_name ?? "",
            isNotice: post.is_notice === 1,
            jobCategory: jobTitle?.category || undefined,
          }}
        />
      </PageWithSidebar>
    </SiteLayout>
  );
}
