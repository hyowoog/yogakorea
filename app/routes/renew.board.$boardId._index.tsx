import type { Route } from "./+types/renew.board.$boardId._index";
import { data, redirect } from "react-router";

/** 리뉴얼 게시판은 메인 그누보드 게시판으로 연결 (데이터 통합 후) */
export async function loader({ params }: Route.LoaderArgs) {
  const renewToMain: Record<string, string> = {
    notice: "notice",
    news: "fieldnews",
    job: "job",
    bbs: "member",
    photo: "gallery",
    qna: "qna",
    free: "free2",
  };

  const boardId = renewToMain[params.boardId];
  if (!boardId) throw data("게시판을 찾을 수 없습니다.", { status: 404 });
  return redirect(`/board/${boardId}`);
}
