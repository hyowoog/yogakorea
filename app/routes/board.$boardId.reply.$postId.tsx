import type { Route } from "./+types/board.$boardId.reply.$postId";
import { data, redirect } from "react-router";
import { BoardWriteForm } from "~/components/board/board-write-form";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { getAuthUser } from "~/lib/auth.server";
import {
  createAttachment,
  createPost,
  getBoard,
  getPost,
  requireBoardMutationAccess,
} from "~/lib/board.server";
import { resolvePostTitle } from "~/lib/job-board";
import { uploadToR2 } from "~/lib/r2.server";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";
import { getBoardBasePath, getBoardPostPath } from "~/lib/route-paths";

function replyTitle(parentTitle: string) {
  const body = parentTitle.replace(/^(Re:\s*)+/i, "").trim();
  return `Re: ${body}`;
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `답글 - ${loaderData?.board.title ?? "게시판"}` }];
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);
  const parent = await getPost(db, Number(params.postId));

  if (!board || !parent || parent.board_id !== params.boardId) {
    throw data("게시글을 찾을 수 없습니다.", { status: 404 });
  }

  if (!board.allow_reply) {
    throw data("이 게시판은 답글을 작성할 수 없습니다.", { status: 403 });
  }

  await requireBoardMutationAccess(request, db, params.boardId);
  const user = await getAuthUser(request, db);

  return { board, parent, userName: user?.name ?? "" };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  await requireBoardMutationAccess(request, context.cloudflare.env.DB, params.boardId);

  const db = context.cloudflare.env.DB;
  const bucket = context.cloudflare.env.UPLOADS;
  const board = await getBoard(db, params.boardId);
  const parent = await getPost(db, Number(params.postId));

  if (!board || !parent || parent.board_id !== params.boardId) {
    throw data("게시글을 찾을 수 없습니다.", { status: 404 });
  }

  if (!board.allow_reply) {
    return data({ error: "이 게시판은 답글을 작성할 수 없습니다." }, { status: 403 });
  }

  const formData = await request.formData();
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
    parentId: parent.id,
    depth: parent.depth + 1,
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

export default function BoardReply({ loaderData }: Route.ComponentProps) {
  const { board, parent } = loaderData;
  const section = getSectionSidebar(getBoardBasePath(board.id));

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle="답글 쓰기"
      sectionTitle={section?.sectionTitle ?? board.title}
    >
      <PageWithSidebar>
        <BoardWriteForm
          boardId={board.id}
          boardTitle={board.title}
          heading="답글 쓰기"
          submitLabel="등록"
          defaultValues={{
            title: replyTitle(parent.title),
            authorName: loaderData.userName,
          }}
        />
      </PageWithSidebar>
    </SiteLayout>
  );
}
