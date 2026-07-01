import { Form, Link } from "react-router";
import type { Attachment, Comment, Post } from "~/lib/board.server";
import { getPublicUploadUrl } from "~/lib/files";

interface BoardViewProps {
  boardId: string;
  boardTitle: string;
  post: Post;
  comments: Comment[];
  attachments: Attachment[];
}

export function BoardView({
  boardId,
  boardTitle,
  post,
  comments,
  attachments,
}: BoardViewProps) {
  return (
    <article className="yk-board-view">
      <div className="yk-board-view-header">
        <p className="yk-breadcrumb">
          <Link to={`/board/${boardId}`}>{boardTitle}</Link>
        </p>
        <h1>{post.title}</h1>
        <div className="yk-post-meta">
          <span>{post.author_name ?? "익명"}</span>
          <span>{post.created_at}</span>
          <span>조회 {post.view_count}</span>
        </div>
      </div>

      <div
        className="yk-post-content"
        dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
      />

      {attachments.length > 0 && (
        <div className="yk-attachments">
          <h3>첨부파일</h3>
          <ul>
            {attachments.map((file) => (
              <li key={file.id}>
                <a href={getPublicUploadUrl(file.r2_key)} download={file.file_name}>
                  {file.file_name}
                  {file.file_size ? ` (${Math.round(file.file_size / 1024)}KB)` : ""}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="yk-board-actions">
        <Link to={`/board/${boardId}`} className="yk-btn">
          목록
        </Link>
        <Link to={`/board/${boardId}/${post.id}/edit`} className="yk-btn">
          수정
        </Link>
        <Form method="post" action={`/board/${boardId}/${post.id}/delete`}>
          <button type="submit" className="yk-btn yk-btn-danger">
            삭제
          </button>
        </Form>
      </div>

      <section className="yk-comments">
        <h3>댓글 {comments.length}</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.author_name ?? "익명"}</strong>
              <time>{comment.created_at}</time>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>

        <Form method="post" className="yk-comment-form">
          <input type="hidden" name="intent" value="comment" />
          <input name="authorName" placeholder="이름" required />
          <textarea name="content" placeholder="댓글을 입력하세요" required rows={3} />
          <button type="submit" className="yk-btn yk-btn-primary">
            댓글 등록
          </button>
        </Form>
      </section>
    </article>
  );
}
