import { Form, Link } from "react-router";
import { BoardPagination } from "~/components/board/board-pagination";
import {
  getBoardColumns,
  type BoardTableRow,
} from "~/components/board/board-columns";
import type { Post } from "~/lib/board.server";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "../ui/button";
import { getBoardListPath, getBoardWritePath } from "~/lib/route-paths";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { isJobBoard, JOB_CATEGORIES } from "~/lib/job-board";

interface BoardListProps {
  boardId: string;
  boardTitle: string;
  posts: Post[];
  page: number;
  totalPages: number;
  total: number;
  searchQuery?: string;
  searchField?: string;
  jobCategory?: string;
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
  jobCategory,
}: BoardListProps) {
  const columns = getBoardColumns({ boardId });
  const tableData: BoardTableRow[] = posts.map((post, index) => ({
    ...post,
    rowNumber: total - (page - 1) * 15 - index,
  }));
  const showJobTabs = isJobBoard(boardId);
  const activeJobTab = jobCategory ?? "all";

  return (
    <div className="yk-board">
      {showJobTabs ? (
        <Tabs value={activeJobTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="all" asChild>
              <Link
                to={getBoardListPath(boardId, { searchQuery, searchField })}
              >
                전체
              </Link>
            </TabsTrigger>
            {JOB_CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category} asChild>
                <Link
                  to={getBoardListPath(boardId, {
                    searchQuery,
                    searchField,
                    jobCategory: category,
                  })}
                >
                  {category}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : null}
      <DataTable
        columns={columns}
        data={tableData}
        emptyMessage="등록된 게시글이 없습니다."
      />
      <p className="text-sm text-muted-foreground mt-2 flex justify-end">
        전체 {total} 건 &middot; {page} 페이지
      </p>

      <BoardPagination
        boardId={boardId}
        page={page}
        totalPages={totalPages}
        searchQuery={searchQuery}
        searchField={searchField}
        jobCategory={jobCategory}
      />

      <Form method="get" className="yk-board-search mt-6">
        {jobCategory ? <input type="hidden" name="cat" value={jobCategory} /> : null}
        <Select name="field" defaultValue={searchField ?? "title"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="검색조건" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="title">제목</SelectItem>
              <SelectItem value="content">내용</SelectItem>
              <SelectItem value="author">작성자</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="search"
          name="q"
          placeholder="검색어"
          defaultValue={searchQuery ?? ""}
        />
        <Button type="submit" variant="outline">
          검색
        </Button>
        <Link to={getBoardWritePath(boardId)}>
          <Button variant="outline">글쓰기</Button>
        </Link>
      </Form>
    </div>
  );
}
