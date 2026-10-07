import { CornerDownRight } from "lucide-react";
import { isBoardReply } from "~/lib/board-access";

interface BoardReplyIconProps {
  depth: number;
  parentId: number | null;
  className?: string;
}

export function BoardReplyIcon({ depth, parentId, className }: BoardReplyIconProps) {
  if (!isBoardReply({ depth, parent_id: parentId })) return null;

  const indent = Math.max(0, depth - 1) * 12;

  return (
    <span
      className={`inline-flex shrink-0 items-center text-muted-foreground ${className ?? ""}`}
      style={{ marginLeft: indent }}
      title="답글"
    >
      <CornerDownRight className="size-4" aria-hidden />
      <span className="sr-only">답글</span>
    </span>
  );
}
