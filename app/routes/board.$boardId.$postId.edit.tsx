import type { Route } from "./+types/board.$boardId.$postId.edit";
import { data, redirect } from "react-router";
import { BoardWriteForm } from "~/components/board/board-write-form";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { getAuthUser } from "~/lib/auth.server";
import {
  createAttachment,
  deleteAttachments,
  deleteUnusedR2Objects,
  getBoard,
  getPost,
  getPostAttachments,
  replaceAttachment,
  requireBoardMutationAccess,
  updatePost,
} from "~/lib/board.server";
import { ADMIN_LEVEL } from "~/lib/event-constants";
import { isJobBoard, parseJobTitle, resolvePostTitle } from "~/lib/job-board";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";
import { uploadToR2 } from "~/lib/r2.server";
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
  const attachments = await getPostAttachments(db, post.id);

  return { board, post, attachments, isAdmin: Boolean(user && user.level >= ADMIN_LEVEL) };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;
  const bucket = context.cloudflare.env.UPLOADS;
  await requireBoardMutationAccess(request, db, params.boardId);

  const postId = Number(params.postId);
  const post = await getPost(db, postId);
  if (!post || post.board_id !== params.boardId) {
    throw data("게시글을 찾을 수 없습니다.", { status: 404 });
  }

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

  await updatePost(db, postId, {
    title: resolvedTitle.title,
    content,
    authorName: authorName || undefined,
    isNotice: isAdmin ? formData.get("isNotice") === "1" : undefined,
  });

  // 이 게시글의 첨부만 수정·삭제 대상으로 인정
  const existing = await getPostAttachments(db, postId);
  const deleteIds = new Set(
    formData.getAll("deleteAttachmentIds").map((value) => Number(value)),
  );
  const removedKeys: string[] = [];

  const toDelete = existing.filter((file) => deleteIds.has(file.id));
  await deleteAttachments(
    db,
    toDelete.map((file) => file.id),
  );
  removedKeys.push(...toDelete.map((file) => file.r2_key));

  for (const file of existing) {
    if (deleteIds.has(file.id)) continue;
    const replacement = formData.get(`replaceAttachment_${file.id}`);
    if (!(replacement instanceof File) || !replacement.size) continue;
    const uploaded = await uploadToR2(bucket, replacement, "attachments");
    await replaceAttachment(db, file.id, {
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      r2Key: uploaded.key,
      mimeType: uploaded.mimeType,
    });
    removedKeys.push(file.r2_key);
  }

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

  await deleteUnusedR2Objects(db, bucket, removedKeys);

  return redirect(getBoardPostPath(params.boardId, postId));
}

export default function BoardEdit({ loaderData }: Route.ComponentProps) {
  const { board, post, attachments } = loaderData;
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
          existingAttachments={attachments}
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
