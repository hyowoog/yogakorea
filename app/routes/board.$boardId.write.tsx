import type { Route } from "./+types/board.$boardId.write";
import { data, redirect } from "react-router";
import { BoardWriteForm } from "~/components/board/board-write-form";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import {
  createAttachment,
  createPost,
  getBoard,
  requireBoardAccess,
} from "~/lib/board.server";
import { uploadToR2 } from "~/lib/r2.server";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `글쓰기 - ${loaderData?.board.title ?? "게시판"}` }];
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const board = await getBoard(context.cloudflare.env.DB, params.boardId);
  if (!board) throw data("게시판을 찾을 수 없습니다.", { status: 404 });
  await requireBoardAccess(request, context.cloudflare.env.DB, params.boardId);
  return { board };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  await requireBoardAccess(request, context.cloudflare.env.DB, params.boardId);

  const db = context.cloudflare.env.DB;
  const bucket = context.cloudflare.env.UPLOADS;
  const formData = await request.formData();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();

  if (!title || !content || !authorName) {
    return data({ error: "필수 항목을 입력해 주세요." }, { status: 400 });
  }

  const postId = await createPost(db, {
    boardId: params.boardId,
    title,
    content,
    authorName,
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

  return redirect(`/board/${params.boardId}/${postId}`);
}

export default function BoardWrite({ loaderData }: Route.ComponentProps) {
  const { board } = loaderData;
  const section = getSectionSidebar(`/board/${board.id}`);

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle="글쓰기"
      sectionTitle={section?.sectionTitle ?? board.title}
    >
      <PageWithSidebar>
        <BoardWriteForm boardId={board.id} boardTitle={board.title} />
      </PageWithSidebar>
    </SiteLayout>
  );
}
