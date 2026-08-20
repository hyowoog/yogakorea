import type { Route } from "./+types/board.$boardId.write";
import { data, redirect } from "react-router";
import { BoardWriteForm } from "~/components/board/board-write-form";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { getAuthUser } from "~/lib/auth.server";
import {
  createAttachment,
  createPost,
  getBoard,
  requireBoardMutationAccess,
} from "~/lib/board.server";
import { ADMIN_LEVEL } from "~/lib/event-constants";
import { resolvePostTitle } from "~/lib/job-board";
import { uploadToR2 } from "~/lib/r2.server";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";
import { getBoardBasePath, getBoardPostPath } from "~/lib/route-paths";

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `글쓰기 - ${loaderData?.board.title ?? "게시판"}` }];
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);
  if (!board) throw data("게시판을 찾을 수 없습니다.", { status: 404 });
  await requireBoardMutationAccess(request, db, params.boardId);
  const user = await getAuthUser(request, db);
  return { board, isAdmin: Boolean(user && user.level >= ADMIN_LEVEL) };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  await requireBoardMutationAccess(request, context.cloudflare.env.DB, params.boardId);

  const db = context.cloudflare.env.DB;
  const bucket = context.cloudflare.env.UPLOADS;
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

  if (!title || !content || !authorName) {
    return data({ error: "필수 항목을 입력해 주세요." }, { status: 400 });
  }

  if (!resolvedTitle.ok) {
    return data({ error: resolvedTitle.error }, { status: 400 });
  }

  const postId = await createPost(db, {
    boardId: params.boardId,
    title: resolvedTitle.title,
    content,
    authorName,
    isNotice: isAdmin && formData.get("isNotice") === "1",
  });

  const files = formData.getAll("attachments").filter((f) => f instanceof File) as File[];
  for (const file of files) {
    if (!file.size) continue;
    const uploaded = await uploadToR2(bucket, file, "attachments");
    await createAttachment(db, {
      postId,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      r2Key: uploaded.key,
      mimeType: uploaded.mimeType,
    });
  }

  return redirect(getBoardPostPath(params.boardId, postId));
}

export default function BoardWrite({ loaderData }: Route.ComponentProps) {
  const { board } = loaderData;
  const section = getSectionSidebar(getBoardBasePath(board.id));

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle="글쓰기"
      sectionTitle={section?.sectionTitle ?? board.title}
    >
      <PageWithSidebar>
        <BoardWriteForm boardId={board.id} boardTitle={board.title} isAdmin={loaderData.isAdmin} />
      </PageWithSidebar>
    </SiteLayout>
  );
}
