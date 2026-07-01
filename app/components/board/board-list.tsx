import { Form, Link } from "react-router";
import { BoardPagination } from "~/components/board/board-pagination";
import type { Post } from "~/lib/board.server";

interface BoardListProps {
  boardId: string;
  boardTitle: string;
  posts: Post[];
  page: number;
  totalPages: number;
  total: number;
  searchQuery?: string;
  searchField?: string;
}

export function BoardList({
  boardId,
  boardTitle,
  posts,
  page,
  totalPages,
  total,
  searchQuery,
  searchField,
}: BoardListProps) {
  return (
    <div className="yk-board">
      <div className="yk-board-header">
        <h2>{boardTitle}</h2>
        <Link to={`/board/${boardId}/write`} className="yk-btn yk-btn-primary">
          글쓰기
        </Link>
      </div>

      <Form method="get" className="yk-board-search">
        <select name="field" defaultValue={searchField ?? "title"}>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="author">작성자</option>
        </select>
        <input
          type="search"
          name="q"
          placeholder="검색어"
          defaultValue={searchQuery ?? ""}
        />
        <button type="submit" className="yk-btn">
          검색
        </button>
      </Form>

      <p className="yk-board-meta">
        Total {total} articles / {page} page
      </p>

      <div className="yk-board-table-wrap">
        <table className="yk-board-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
              <th>조회</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="yk-empty">
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id}>
                  <td>{total - (page - 1) * 15 - index}</td>
                  <td className="yk-board-title">
                    <Link to={`/board/${boardId}/${post.id}`}>
                      {post.depth > 0 && <span className="yk-reply">↳</span>}
                      {post.title}
                    </Link>
                  </td>
                  <td>{post.author_name ?? "-"}</td>
                  <td>{post.created_at.slice(0, 10)}</td>
                  <td>{post.view_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BoardPagination
        boardId={boardId}
        page={page}
        totalPages={totalPages}
        searchQuery={searchQuery}
        searchField={searchField}
      />
    </div>
  );
}
