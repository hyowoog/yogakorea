import { redirect } from "react-router";
import { isPublicBoard } from "~/lib/board-access";
import { getAuthUser, type Member } from "~/lib/auth.server";
import { canEditComment, type Comment } from "~/lib/comments";

export type { Comment };
export { canEditComment };

export interface Board {
  id: string;
  title: string;
  board_type: string;
  list_count: number;
  allow_reply: number;
  min_level: number;
  source: string;
}

export interface Post {
  id: number;
  board_id: string;
  parent_id: number | null;
  depth: number;
  sort_order: number;
  title: string;
  content: string | null;
  author_name: string | null;
  author_email: string | null;
  view_count: number;
  is_notice: number;
  link1: string | null;
  link2: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Attachment {
  id: number;
  post_id: number;
  file_name: string;
  file_size: number | null;
  r2_key: string;
  mime_type: string | null;
  download_count: number;
  created_at: string;
}

export function getDb(env: Env) {
  return env.DB;
}

/** 그누보드 마이그레이션 글: 최상위 글은 parent_id가 NULL이거나 legacy_id와 동일 */
const ROOT_POST_SQL = "(parent_id IS NULL OR parent_id = legacy_id)";

export async function getBoard(db: Env["DB"], boardId: string) {
  return db
    .prepare("SELECT * FROM boards WHERE id = ?")
    .bind(boardId)
    .first<Board>();
}

export function isGalleryBoard(board: Board) {
  return board.board_type === "gallery";
}

export function getBoardPageSize(board: Board) {
  if (board.id === "gallery") return 12;
  return board.list_count;
}

export async function listPosts(
  db: Env["DB"],
  boardId: string,
  page = 1,
  perPage = 15,
  search?: { field: string; query: string },
) {
  const offset = (page - 1) * perPage;
  let where = `board_id = ? AND ${ROOT_POST_SQL}`;
  const params: (string | number)[] = [boardId];

  if (search?.query) {
    const field =
      search.field === "author" ? "author_name" : search.field === "content" ? "content" : "title";
    where += ` AND ${field} LIKE ?`;
    params.push(`%${search.query}%`);
  }

  const countRow = await db
    .prepare(`SELECT COUNT(*) as total FROM posts WHERE ${where}`)
    .bind(...params)
    .first<{ total: number }>();

  const posts = await db
    .prepare(
      `SELECT * FROM posts WHERE ${where} ORDER BY is_notice DESC, created_at DESC, id DESC LIMIT ? OFFSET ?`,
    )
    .bind(...params, perPage, offset)
    .all<Post>();

  return {
    posts: posts.results,
    total: countRow?.total ?? 0,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil((countRow?.total ?? 0) / perPage)),
  };
}

export async function getPost(db: Env["DB"], postId: number) {
  return db.prepare("SELECT * FROM posts WHERE id = ?").bind(postId).first<Post>();
}

export async function getPostAttachments(db: Env["DB"], postId: number) {
  const result = await db
    .prepare("SELECT * FROM attachments WHERE post_id = ? ORDER BY id ASC")
    .bind(postId)
    .all<Attachment>();
  return result.results;
}

export async function getPostComments(db: Env["DB"], postId: number) {
  const result = await db
    .prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC")
    .bind(postId)
    .all<Comment>();
  return result.results;
}

export async function getComment(db: Env["DB"], commentId: number) {
  return db
    .prepare("SELECT * FROM comments WHERE id = ?")
    .bind(commentId)
    .first<Comment>();
}

export async function incrementViewCount(db: Env["DB"], postId: number) {
  await db
    .prepare("UPDATE posts SET view_count = view_count + 1 WHERE id = ?")
    .bind(postId)
    .run();
}

export async function createPost(
  db: Env["DB"],
  data: {
    boardId: string;
    title: string;
    content: string;
    authorName: string;
    authorEmail?: string;
    password?: string;
    parentId?: number;
    depth?: number;
  },
) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const maxSort = await db
    .prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 as next_sort FROM posts WHERE board_id = ?")
    .bind(data.boardId)
    .first<{ next_sort: number }>();

  const result = await db
    .prepare(
      `INSERT INTO posts (board_id, parent_id, depth, sort_order, title, content, author_name, author_email, password, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      data.boardId,
      data.parentId ?? null,
      data.depth ?? 0,
      maxSort?.next_sort ?? 1,
      data.title,
      data.content,
      data.authorName,
      data.authorEmail ?? null,
      data.password ?? null,
      now,
    )
    .run();

  return Number(result.meta.last_row_id);
}

export async function updatePost(
  db: Env["DB"],
  postId: number,
  data: { title: string; content: string; authorName?: string },
) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  await db
    .prepare(
      `UPDATE posts SET title = ?, content = ?, author_name = COALESCE(?, author_name), updated_at = ? WHERE id = ?`,
    )
    .bind(data.title, data.content, data.authorName ?? null, now, postId)
    .run();
}

export async function deletePost(db: Env["DB"], postId: number) {
  await db.prepare("DELETE FROM comments WHERE post_id = ?").bind(postId).run();
  await db.prepare("DELETE FROM attachments WHERE post_id = ?").bind(postId).run();
  await db.prepare("DELETE FROM posts WHERE id = ?").bind(postId).run();
}

export async function createComment(
  db: Env["DB"],
  data: {
    postId: number;
    authorName: string;
    content: string;
    parentId?: number;
    memberId?: number;
  },
) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const result = await db
    .prepare(
      `INSERT INTO comments (post_id, parent_id, author_name, member_id, content, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      data.postId,
      data.parentId ?? null,
      data.authorName,
      data.memberId ?? null,
      data.content,
      now,
    )
    .run();
  return Number(result.meta.last_row_id);
}

export async function updateComment(db: Env["DB"], commentId: number, content: string) {
  await db
    .prepare("UPDATE comments SET content = ? WHERE id = ?")
    .bind(content, commentId)
    .run();
}

export async function deleteComment(db: Env["DB"], commentId: number) {
  await db.prepare("DELETE FROM comments WHERE id = ?").bind(commentId).run();
}

export async function createAttachment(
  db: Env["DB"],
  data: {
    postId: number;
    fileName: string;
    fileSize: number;
    r2Key: string;
    mimeType: string;
  },
) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const result = await db
    .prepare(
      `INSERT INTO attachments (post_id, file_name, file_size, r2_key, mime_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(data.postId, data.fileName, data.fileSize, data.r2Key, data.mimeType, now)
    .run();
  return Number(result.meta.last_row_id);
}

export async function listLatestPosts(db: Env["DB"], boardId: string, limit = 10) {
  const result = await db
    .prepare(
      `SELECT * FROM posts WHERE board_id = ? AND ${ROOT_POST_SQL} ORDER BY is_notice DESC, created_at DESC, id DESC LIMIT ?`,
    )
    .bind(boardId, limit)
    .all<Post>();
  return result.results;
}

export async function getMainSlides(db: Env["DB"]) {
  const result = await db
    .prepare(
      "SELECT * FROM main_slides WHERE is_active = 1 ORDER BY sort_order ASC, id ASC",
    )
    .all<{ id: number; image_path: string; caption: string | null }>();
  return result.results;
}

export { isPublicBoard, PUBLIC_BOARD_IDS } from "~/lib/board-access";

export async function requireBoardAccess(
  request: Request,
  db: Env["DB"],
  boardId: string,
): Promise<Member | null> {
  if (isPublicBoard(boardId)) return null;

  const user = await getAuthUser(request, db);
  if (!user) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return user;
}
