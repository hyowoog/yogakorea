import { ADMIN_LEVEL } from "~/lib/event-constants";

export interface Comment {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string | null;
  member_id: number | null;
  content: string;
  created_at: string;
}

export interface CommentEditor {
  id: number;
  name: string;
  level: number;
}

export function canEditComment(user: CommentEditor | null, comment: Comment) {
  if (!user) return false;
  if (user.level >= ADMIN_LEVEL) return true;
  if (comment.member_id != null && comment.member_id === user.id) return true;
  if (comment.author_name && comment.author_name === user.name) return true;
  return false;
}

export const canDeleteComment = canEditComment;
