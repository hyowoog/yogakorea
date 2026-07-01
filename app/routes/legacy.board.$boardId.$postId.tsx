import type { Route } from "./+types/legacy.board.$boardId.$postId";
import { data, redirect } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  return redirect(`/board/${params.boardId}/${params.postId}`);
}

export function action() {
  throw data("Not implemented", { status: 405 });
}
