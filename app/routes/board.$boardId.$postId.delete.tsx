import type { Route } from "./+types/board.$boardId.$postId.delete";
import { redirect } from "react-router";
import { deletePost, requireBoardAccess } from "~/lib/board.server";

export async function action({ request, params, context }: Route.ActionArgs) {
  await requireBoardAccess(request, context.cloudflare.env.DB, params.boardId);
  await deletePost(context.cloudflare.env.DB, Number(params.postId));
  return redirect(`/board/${params.boardId}`);
}
