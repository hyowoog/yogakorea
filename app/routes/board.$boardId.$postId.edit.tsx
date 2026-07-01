import type { Route } from "./+types/board.$boardId.$postId.edit";
import { data, redirect } from "react-router";
import { BoardWriteForm } from "~/components/board/board-write-form";
import { SiteLayout } from "~/components/site-layout";
import { getBoard, getPost, updatePost } from "~/lib/board.server";
import { renewNavigation } from "~/lib/navigation";

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);
  const post = await getPost(db, Number(params.postId));

  if (!board || !post || post.board_id !== params.boardId) {
    throw data("게시글을 찾을 수 없습니다.", { status: 404 });
  }

  return { board, post };
}

export async function action({ request, params, context }: Route.ActionArgs) {
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

  return redirect(`/board/${params.boardId}/${params.postId}`);
}

export default function BoardEdit({ loaderData }: Route.ComponentProps) {
  const { board, post } = loaderData;

  return (
    <SiteLayout
      navigation={renewNavigation}
      pageTitle="글 수정"
      sectionTitle={board.title}
    >
      <div className="yk-container">
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
      </div>
    </SiteLayout>
  );
}
