import type { Route } from "./+types/board.$boardId.$postId.delete";
import { redirect } from "react-router";
import { deletePost } from "~/lib/board.server";

export async function action({ params, context }: Route.ActionArgs) {
  await deletePost(context.cloudflare.env.DB, Number(params.postId));
  return redirect(`/board/${params.boardId}`);
}
