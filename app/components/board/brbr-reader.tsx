import { Form, Link } from "react-router";
import type { Attachment, Board, Post } from "~/lib/board.server";
import { partitionAttachments } from "~/lib/attachments";
import { getPublicUploadUrl } from "~/lib/files";
import { formatPostContent } from "~/lib/post-content";
import { cn } from "@/lib/utils";
import { AttachmentFileIcon } from "./attachment-file-icon";
import { Button } from "../ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { getBoardBasePath, getBoardDeletePath, getBoardEditPath, getBoardWritePath } from "~/lib/route-paths";

interface BrbrReaderProps {
  board: Board;
  posts: Post[];
  activePost: Post | null;
  attachments: Attachment[];
  isAdmin: boolean;
}

export function BrbrReader({
  board,
  posts,
  activePost,
  attachments,
  isAdmin,
}: BrbrReaderProps) {
  const basePath = getBoardBasePath(board.id);
  const { imageAttachments, fileAttachments } = partitionAttachments(attachments);
  const relatedLinks = activePost
    ? [activePost.link1, activePost.link2].filter((link): link is string => Boolean(link?.trim()))
    : [];

  return (
    <div className="yk-brbr-reader flex flex-col gap-6 lg:flex-row lg:items-start">
      <aside className="yk-brbr-nav w-full shrink-0 lg:w-60">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-neutral-800">빠람빠라</h2>
          {isAdmin ? (
            <Link to={getBoardWritePath(board.id)}>
              <Button variant="outline" size="sm">
                글쓰기
              </Button>
            </Link>
          ) : null}
        </div>
        <nav aria-label="빠람빠라 글 목록">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">등록된 글이 없습니다.</p>
          ) : (
            <ul className="yk-brbr-nav-list">
              {posts.map((post) => {
                const isActive = activePost?.id === post.id;
                return (
                  <li key={post.id}>
                    <Link
                      to={`${basePath}?post=${post.id}`}
                      className={cn(isActive && "active")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="line-clamp-2">{post.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>

      <article className="yk-brbr-content min-w-0 flex-1">
        {!activePost ? (
          <p className="rounded border bg-slate-50 px-4 py-10 text-center text-sm text-muted-foreground">
            표시할 글이 없습니다.
          </p>
        ) : (
          <>
            <header className="mb-6 border-b pb-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="min-w-0 flex-1 text-2xl font-bold text-neutral-900">
                  {activePost.title}
                </h1>
                {isAdmin ? (
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={getBoardEditPath(board.id, activePost.id)}>수정</Link>
                    </Button>
                    <Form
                      method="post"
                      action={getBoardDeletePath(board.id, activePost.id)}
                      onSubmit={(event) => {
                        if (!confirm("정말 삭제하시겠습니까?")) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <Button variant="destructive" size="sm" type="submit">
                        삭제
                      </Button>
                    </Form>
                  </div>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{activePost.author_name ?? "익명"}</span>
                <span>{activePost.created_at.slice(0, 10)}</span>
                <span>조회 {activePost.view_count.toLocaleString("ko-KR")}</span>
              </div>
            </header>

            {relatedLinks.length > 0 ? (
              <div className="yk-post-links mb-6">
                <h3 className="mb-2 text-sm font-semibold">관련링크</h3>
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
            ) : null}

            <div className="yk-post-content">
              {imageAttachments.length > 0 ? (
                <div className="yk-post-images mb-6">
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
                        />
                      </a>
                    </figure>
                  ))}
                </div>
              ) : null}

              {activePost.content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatPostContent(activePost.content),
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">본문 내용이 없습니다.</p>
              )}
            </div>

            {fileAttachments.length > 0 ? (
              <div className="yk-attachments mt-8">
                <h3 className="mb-2 text-sm font-semibold">첨부파일</h3>
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
            ) : null}
          </>
        )}
      </article>
    </div>
  );
}
