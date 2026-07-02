import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useFetcher, useRevalidator, useSearchParams } from "react-router";
import { BranchCreateDialog } from "~/components/admin/branch-create-dialog";
import { BranchDetailDialog } from "~/components/admin/branch-detail-dialog";
import type { YogaBranch } from "~/lib/yoga-branch.server";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BranchPublicListProps {
  branches: YogaBranch[];
  areas: string[];
  isAdmin: boolean;
}

const ALL_TAB_VALUE = "all";

export function BranchPublicList({ branches, areas, isAdmin }: BranchPublicListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();
  const deleteFetcher = useFetcher<{ deleted?: boolean; error?: string }>({
    key: "branch-public-delete",
  });
  const pendingDeleteIdRef = useRef<number | null>(null);

  const selectedArea = searchParams.get("area") ?? ALL_TAB_VALUE;
  const detailParam = searchParams.get("detail");
  const detailFromUrl = detailParam ? parseInt(detailParam, 10) : null;

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(
    detailFromUrl && !Number.isNaN(detailFromUrl) ? detailFromUrl : null,
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(
    Boolean(isAdmin && detailFromUrl && !Number.isNaN(detailFromUrl)),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const activeTab =
    selectedArea === ALL_TAB_VALUE || areas.includes(selectedArea)
      ? selectedArea
      : ALL_TAB_VALUE;

  const filteredBranches = useMemo(() => {
    if (activeTab === ALL_TAB_VALUE) return branches;
    return branches.filter((branch) => branch.y_area_dscd === activeTab);
  }, [activeTab, branches]);

  const areaCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const branch of branches) {
      const area = branch.y_area_dscd;
      if (!area) continue;
      counts.set(area, (counts.get(area) ?? 0) + 1);
    }
    return counts;
  }, [branches]);

  const columnCount = isAdmin ? 7 : 6;
  const isDeleting = deleteFetcher.state !== "idle";

  useEffect(() => {
    if (!isAdmin) return;
    if (detailFromUrl && !Number.isNaN(detailFromUrl)) {
      setSelectedBranchId(detailFromUrl);
      setDetailDialogOpen(true);
    }
  }, [detailFromUrl, isAdmin]);

  useEffect(() => {
    if (deleteFetcher.state !== "idle") return;
    if (!deleteFetcher.data?.deleted) return;

    pendingDeleteIdRef.current = null;
    revalidator.revalidate();
  }, [deleteFetcher.state, deleteFetcher.data, revalidator]);

  function handleTabChange(value: string) {
    const nextParams = new URLSearchParams(searchParams);
    if (value === ALL_TAB_VALUE) {
      nextParams.delete("area");
    } else {
      nextParams.set("area", value);
    }
    setSearchParams(nextParams, { replace: true });
  }

  function openBranchDetail(branchId: number) {
    if (!isAdmin) return;

    setSelectedBranchId(branchId);
    setDetailDialogOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("detail", String(branchId));
    setSearchParams(nextParams, { replace: true });
  }

  function handleDetailDialogOpenChange(open: boolean) {
    setDetailDialogOpen(open);
    if (!open) {
      setSelectedBranchId(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("detail");
      setSearchParams(nextParams, { replace: true });
    }
  }

  function handleDelete(branch: YogaBranch) {
    if (!isAdmin || isDeleting) return;
    if (!confirm(`"${branch.y_name ?? ""}" 요가원을 삭제하시겠습니까?`)) return;

    pendingDeleteIdRef.current = branch.id;
    deleteFetcher.submit(
      { intent: "delete" },
      { method: "post", action: `/admin/branches/api/${branch.id}` },
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1024px] space-y-4">
      {isAdmin ? (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setCreateDialogOpen(true)}>
            요가원 추가
          </Button>
        </div>
      ) : null}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value={ALL_TAB_VALUE}>전체 ({branches.length})</TabsTrigger>
          {areas.map((area) => (
            <TabsTrigger key={area} value={area}>
              {area} ({areaCounts.get(area) ?? 0})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">순번</TableHead>
              <TableHead className="w-28">권역</TableHead>
              <TableHead>요가원명</TableHead>
              <TableHead className="w-28">원장</TableHead>
              <TableHead className="w-36">연락처</TableHead>
              <TableHead>주소</TableHead>
              {isAdmin ? <TableHead className="w-12" /> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBranches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
                  등록된 요가원이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredBranches.map((branch, index) => (
                <TableRow key={branch.id}>
                  <TableCell className="text-center tabular-nums text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>{branch.y_area_dscd ?? "-"}</TableCell>
                  <TableCell className="whitespace-normal">
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => openBranchDetail(branch.id)}
                        className="font-medium text-left text-primary hover:underline"
                      >
                        {branch.y_name}
                      </button>
                    ) : (
                      <span className="font-medium">{branch.y_name}</span>
                    )}
                  </TableCell>
                  <TableCell>{branch.y_ceo ?? "-"}</TableCell>
                  <TableCell className="tabular-nums">
                    {branch.y_hp ?? branch.y_phone ?? "-"}
                  </TableCell>
                  <TableCell className="whitespace-normal">{branch.y_addr ?? "-"}</TableCell>
                  {isAdmin ? (
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`${branch.y_name ?? "요가원"} 삭제`}
                        disabled={
                          isDeleting && pendingDeleteIdRef.current === branch.id
                        }
                        onClick={() => handleDelete(branch)}
                      >
                        <Trash2Icon className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground text-right">
        {activeTab === ALL_TAB_VALUE ? "전체" : activeTab} {filteredBranches.length}개
      </p>

      {isAdmin ? (
        <>
          <BranchDetailDialog
            branchId={selectedBranchId}
            open={detailDialogOpen}
            onOpenChange={handleDetailDialogOpenChange}
            showDelete={false}
          />
          <BranchCreateDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
          />
        </>
      ) : null}
      </div>
    </div>
  );
}
