import { Form, Link, useFetcher, useRouteLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Attachment, Post } from "~/lib/board.server";
import type { Comment } from "~/lib/comments";
import { canDeleteComment, canEditComment } from "~/lib/comments";
import { partitionAttachments } from "~/lib/attachments";
import { getPublicUploadUrl } from "~/lib/files";
import { formatPostContent } from "~/lib/post-content";
import type { loader as rootLoader } from "~/root";
import { AttachmentFileIcon } from "./attachment-file-icon";
import { AnimatedList } from "../ui/animated-list";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ExternalLinkIcon } from "lucide-react";
import {
  getBoardBasePath,
  getBoardDeletePath,
  getBoardEditPath,
  getBoardPostPath,
} from "~/lib/route-paths";

interface BoardViewProps {
  boardId: string;
  boardTitle: string;
  post: Post;
  comments: Comment[];
  attachments: Attachment[];
}

type CommentActionData = {
  ok?: boolean;
  error?: string;
  intent?: string;
  commentId?: number;
};

function BoardCommentForm({ boardId, postId }: { boardId: string; postId: number }) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const user = rootData?.user;
  const fetcher = useFetcher<CommentActionData>();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok && fetcher.data.intent === "comment") {
      formRef.current?.reset();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form
      ref={formRef}
      method="post"
      action={getBoardPostPath(boardId, postId)}
      className="yk-comment-form"
    >
      <input type="hidden" name="intent" value="comment" />
      {fetcher.data?.error && fetcher.data.intent !== "updateComment" ? (
        <p className="text-sm text-red-600">{fetcher.data.error}</p>
      ) : null}
      <Input
        name="authorName"
        placeholder="이름"
        required
        disabled={isSubmitting}
        defaultValue={user?.name ?? ""}
        readOnly={Boolean(user)}
      />
      <Textarea
        name="content"
        placeholder="댓글을 입력하세요"
        required
        rows={3}
        disabled={isSubmitting}
      />
      <Button type="submit" variant="outline" disabled={isSubmitting}>
        {isSubmitting ? "등록 중..." : "댓글 등록"}
      </Button>
    </fetcher.Form>
  );
}

function BoardCommentItem({
  comment,
  boardId,
  postId,
}: {
  comment: Comment;
  boardId: string;
  postId: number;
}) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const user = rootData?.user;
  const canEdit = canEditComment(user ?? null, comment);
  const canDelete = canDeleteComment(user ?? null, comment);
  const [isEditing, setIsEditing] = useState(false);
  const fetcher = useFetcher<CommentActionData>();
  const deleteFetcher = useFetcher<CommentActionData>({
    key: `comment-delete-${comment.id}`,
  });
  const isSubmitting = fetcher.state !== "idle";
  const isDeleting = deleteFetcher.state !== "idle";

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data?.ok &&
      fetcher.data.intent === "updateComment" &&
      fetcher.data.commentId === comment.id
    ) {
      setIsEditing(false);
    }
  }, [fetcher.state, fetcher.data, comment.id]);

  if (isEditing) {
    return (
      <article className="yk-comment-item yk-comment-item-editing">
        <fetcher.Form
          method="post"
          action={getBoardPostPath(boardId, postId)}
          className="yk-comment-edit-form"
        >
          <input type="hidden" name="intent" value="updateComment" />
          <input type="hidden" name="commentId" value={comment.id} />
          {fetcher.data?.error && fetcher.data.intent === "updateComment" ? (
            <p className="text-sm text-red-600">{fetcher.data.error}</p>
          ) : null}
          <Textarea
            name="content"
            defaultValue={comment.content}
            required
            rows={3}
            disabled={isSubmitting}
          />
          <div className="yk-comment-edit-actions">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setIsEditing(false)}
            >
              취소
            </Button>
          </div>
        </fetcher.Form>
      </article>
    );
  }

  return (
    <article className="yk-comment-item">
      <header className="yk-comment-item-header">
        <strong>{comment.author_name ?? "익명"}</strong>
        <time dateTime={comment.created_at}>{comment.created_at}</time>
        {canEdit || canDelete ? (
          <div className="yk-comment-item-actions">
            {canEdit ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="yk-comment-action-btn"
                onClick={() => setIsEditing(true)}
              >
                수정
              </Button>
            ) : null}
            {canDelete ? (
              <deleteFetcher.Form
                method="post"
                action={getBoardPostPath(boardId, postId)}
                onSubmit={(event) => {
                  if (!confirm("댓글을 삭제하시겠습니까?")) event.preventDefault();
                }}
              >
                <input type="hidden" name="intent" value="deleteComment" />
                <input type="hidden" name="commentId" value={comment.id} />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="yk-comment-action-btn text-destructive hover:text-destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </Button>
              </deleteFetcher.Form>
            ) : null}
          </div>
        ) : null}
        {deleteFetcher.data?.error && deleteFetcher.data.intent === "deleteComment" ? (
          <p className="w-full text-sm text-red-600">{deleteFetcher.data.error}</p>
        ) : null}
      </header>
      <p>{comment.content}</p>
    </article>
  );
}

export function BoardView({
  boardId,
  boardTitle,
  post,
  comments,
  attachments,
}: BoardViewProps) {
  const { imageAttachments, fileAttachments } = partitionAttachments(attachments);
  const relatedLinks = [post.link1, post.link2].filter(
    (link): link is string => Boolean(link?.trim()),
  );

  return (
    <article className="yk-board-view">
      <div className="yk-board-view-header">
        <p className="yk-breadcrumb">
          <Link to={getBoardBasePath(boardId)}>{boardTitle}</Link>
        </p>
        <h1>{post.title}</h1>
        <div className="yk-post-meta">
          <span>{post.author_name ?? "익명"}</span>
          <span>{post.created_at}</span>
          <span>조회 {post.view_count}</span>
        </div>
      </div>

      {relatedLinks.length > 0 && (
        <div className="yk-post-links">
          <h3>관련링크</h3>
          <ul className="grid gap-2">
            {relatedLinks.map((link) => (
              <li key={link}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <ExternalLinkIcon className="size-4 shrink-0 text-muted-foreground" />
                  <span>{link}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="yk-post-content">
        {imageAttachments.length > 0 && (
          <div className="yk-post-images">
            {imageAttachments.map((file) => (
              <figure key={file.id}>
                <a
                  href={getPublicUploadUrl(file.r2_key)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={getPublicUploadUrl(file.r2_key)}
                    alt={file.file_name}
                    loading="lazy"
                    onError={(event) => {
                      const figure = event.currentTarget.closest("figure");
                      if (!figure || figure.dataset.fallbackApplied) return;
                      figure.dataset.fallbackApplied = "true";
                      figure.innerHTML = `<p class="text-sm text-muted-foreground">이미지를 불러올 수 없습니다. (${file.file_name})</p>`;
                    }}
                  />
                </a>
              </figure>
            ))}
          </div>
        )}

        {post.content && (
          <div
            dangerouslySetInnerHTML={{ __html: formatPostContent(post.content) }}
          />
        )}
      </div>

      {fileAttachments.length > 0 && (
        <div className="yk-attachments">
          <h3>첨부파일</h3>
          <ul className="grid gap-2">
            {fileAttachments.map((file) => (
              <li key={file.id}>
                <a
                  href={getPublicUploadUrl(file.r2_key)}
                  download={file.file_name}
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <AttachmentFileIcon
                    fileName={file.file_name}
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span>
                    {file.file_name}
                    {file.file_size
                      ? ` (${Math.round(file.file_size / 1024)}KB)`
                      : ""}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="yk-board-actions">
        <Link to={getBoardBasePath(boardId)}>
          <Button>목록</Button>
        </Link>
        <Link to={getBoardEditPath(boardId, post.id)}>
          <Button variant="outline">수정</Button>
        </Link>
        <Form method="post" action={getBoardDeletePath(boardId, post.id)}>
          <Button variant="destructive" type="submit">
            삭제
          </Button>
        </Form>
      </div>

      <section className="yk-comments">
        <h3>댓글 {comments.length}</h3>

        {comments.length > 0 ? (
          <AnimatedList className="yk-comment-list w-full items-stretch gap-3" delay={150}>
            {[...comments].reverse().map((comment) => (
              <BoardCommentItem
                key={comment.id}
                comment={comment}
                boardId={boardId}
                postId={post.id}
              />
            ))}
          </AnimatedList>
        ) : (
          <p className="yk-comment-empty">등록된 댓글이 없습니다.</p>
        )}

        <BoardCommentForm boardId={boardId} postId={post.id} />
      </section>
    </article>
  );
}
