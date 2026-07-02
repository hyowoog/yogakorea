import { useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface AdminRowEditProps {
  label?: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}

export function AdminRowEdit({
  label = "수정",
  children,
  className,
  panelClassName,
}: AdminRowEditProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto p-0 text-blue-700"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "닫기" : label}
      </Button>
      {open ? (
        <div className={cn("mt-2 rounded border bg-slate-50 p-3", panelClassName)}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
