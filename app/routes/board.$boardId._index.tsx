import type { Route } from "./+types/board.$boardId._index";
import { data } from "react-router";
import { BranchPublicList } from "~/components/branch/branch-public-list";
import { BrbrReader } from "~/components/board/brbr-reader";
import { BoardGalleryList } from "~/components/board/board-gallery-list";
import { BoardList } from "~/components/board/board-list";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import {
  getBoard,
  getBoardPageSize,
  getPost,
  getPostAttachments,
  incrementViewCount,
  listPosts,
  requireBoardAccess,
} from "~/lib/board.server";
import { isBrbrBoard, isGalleryBoard } from "~/lib/board-access";
import { buildPostThumbnailMap } from "~/lib/post-thumbnail";
import { getSectionSidebar, mainNavigation } from "~/lib/navigation";
import { listPublicBranchAreas, listPublicBranches } from "~/lib/yoga-branch.server";
import { getAuthUser } from "~/lib/auth.server";
import { ADMIN_LEVEL } from "~/lib/event-constants";
import { getBoardBasePath } from "~/lib/route-paths";

const BRANCH_BOARD_ID = "branch";

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (loaderData?.isBrbr && loaderData.activePost) {
    return [{ title: `${loaderData.activePost.title} | 빠람빠라` }];
  }
  return [{ title: `${loaderData?.board.title ?? "게시판"} | 한국요가연합회` }];
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const board = await getBoard(db, params.boardId);

  if (!board) {
    throw data("게시판을 찾을 수 없습니다.", { status: 404 });
  }

  await requireBoardAccess(request, db, params.boardId);

  if (params.boardId === BRANCH_BOARD_ID) {
    const user = await getAuthUser(request, db);
    const [branches, areas] = await Promise.all([
      listPublicBranches(db),
      listPublicBranchAreas(db),
    ]);

    return {
      board,
      isBranchBoard: true as const,
      branches,
      areas,
      isAdmin: Boolean(user && user.level >= ADMIN_LEVEL),
    };
  }

  if (isBrbrBoard(board)) {
    const url = new URL(request.url);
    const postParam = url.searchParams.get("post");
    const user = await getAuthUser(request, db);
    const { posts } = await listPosts(db, params.boardId, 1, 200);
    const postList = posts ?? [];

    let activePost = null;
    if (postParam) {
      const postId = parseInt(postParam, 10);
      if (!Number.isNaN(postId)) {
        activePost = postList.find((post) => post.id === postId) ?? null;
        if (!activePost) {
          const fetched = await getPost(db, postId);
          if (fetched?.board_id === board.id) activePost = fetched;
        }
      }
    }

    if (!activePost && postList.length > 0) {
      activePost = postList[0];
    }

    if (activePost) {
      await incrementViewCount(db, activePost.id);
    }

    const attachments = activePost ? await getPostAttachments(db, activePost.id) : [];

    return {
      board,
      isBranchBoard: false as const,
      isBrbr: true as const,
      posts: postList,
      activePost,
      attachments,
      isAdmin: Boolean(user && user.level >= ADMIN_LEVEL),
    };
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const searchQuery = url.searchParams.get("q") ?? undefined;
  const searchField = url.searchParams.get("field") ?? "title";

  const result = await listPosts(
    db,
    params.boardId,
    page,
    getBoardPageSize(board),
    searchQuery ? { field: searchField, query: searchQuery } : undefined,
  );

  const thumbnails = isGalleryBoard(board)
    ? Object.fromEntries((await buildPostThumbnailMap(db, result.posts)).entries())
    : null;

  return {
    board,
    isBranchBoard: false as const,
    ...result,
    searchQuery,
    searchField,
    thumbnails,
    isGallery: isGalleryBoard(board),
    isBrbr: false as const,
  };
}

export default function BoardIndex({ loaderData }: Route.ComponentProps) {
  const { board, isBranchBoard } = loaderData;
  const section = getSectionSidebar(getBoardBasePath(board.id));

  if (isBranchBoard) {
    return (
      <SiteLayout
        navigation={mainNavigation}
        pageTitle={board.title}
        sectionTitle={section?.sectionTitle ?? "게시판"}
      >
        <PageWithSidebar>
          <BranchPublicList
            branches={loaderData.branches}
            areas={loaderData.areas}
            isAdmin={loaderData.isAdmin}
          />
        </PageWithSidebar>
      </SiteLayout>
    );
  }

  if (loaderData.isBrbr) {
    return (
      <SiteLayout
        navigation={mainNavigation}
        pageTitle={board.title}
        sectionTitle={section?.sectionTitle ?? "빠람빠라"}
      >
        <PageWithSidebar>
          <BrbrReader
            board={board}
            posts={loaderData.posts}
            activePost={loaderData.activePost}
            attachments={loaderData.attachments}
            isAdmin={loaderData.isAdmin}
          />
        </PageWithSidebar>
      </SiteLayout>
    );
  }

  const {
    posts,
    page,
    totalPages,
    total,
    searchQuery,
    searchField,
    thumbnails,
    isGallery,
  } = loaderData;

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle={board.title}
      sectionTitle={section?.sectionTitle ?? "게시판"}
    >
      <PageWithSidebar>
        {isGallery && thumbnails ? (
          <BoardGalleryList
            boardId={board.id}
            posts={posts}
            thumbnails={thumbnails}
            page={page}
            totalPages={totalPages}
            total={total}
            searchQuery={searchQuery}
            searchField={searchField}
          />
        ) : (
          <BoardList
            boardId={board.id}
            boardTitle={board.title}
            posts={posts}
            page={page}
            totalPages={totalPages}
            total={total}
            searchQuery={searchQuery}
            searchField={searchField}
          />
        )}
      </PageWithSidebar>
    </SiteLayout>
  );
}
