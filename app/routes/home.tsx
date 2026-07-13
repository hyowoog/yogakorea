import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpenIcon,
  Building2Icon,
  CameraIcon,
  FileTextIcon,
  ImageIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { HomeLoginPanel } from "~/components/home-login-panel";
import { SiteLayout } from "~/components/site-layout";
import {
  getMainSlides,
  listLatestPosts,
  listRecentComments,
  listRecentPosts,
  type RecentComment,
  type RecentPost,
} from "~/lib/board.server";
import { getBoardPostPath } from "~/lib/route-paths";
import { mainNavigation } from "~/lib/navigation";
import type { Route } from "./+types/home";
import { cn } from "@/lib/utils";
import { AnimatedList } from "~/components/ui/animated-list";

export function meta() {
  return [
    { title: "사단법인 한국요가연합회" },
    { name: "description", content: "한국요가연합회 공식 홈페이지" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  try {
    const [slides, notice, job, qna, fieldnews, headroom, recentPosts, recentComments] =
      await Promise.all([
      getMainSlides(db),
      listLatestPosts(db, "notice", 7),
      listLatestPosts(db, "job", 7),
      listLatestPosts(db, "qna", 7),
      listLatestPosts(db, "fieldnews", 7),
      listLatestPosts(db, "headroom", 7),
      listRecentPosts(db, 5),
      listRecentComments(db, 5),
    ]);

    return { slides, notice, job, qna, fieldnews, headroom, recentPosts, recentComments };
  } catch {
    return {
      slides: [],
      notice: [],
      job: [],
      qna: [],
      fieldnews: [],
      headroom: [],
      recentPosts: [],
      recentComments: [],
    };
  }
}

const defaultSlides = [
  {
    image_path:
      "/site-assets/eyoom/theme/basic2/image/banner_slider/banner_slider_1.jpg",
    caption: "한국요가연합회",
  },
  {
    image_path:
      "/site-assets/eyoom/theme/basic2/image/banner_slider/banner_slider_3.jpg",
    caption: "NOTICE",
  },
];

const features = [
  {
    Icon: FileTextIcon,
    name: "본부자료실",
    description: "연합회 본부에서 제공하는 자료입니다.",
    href: "/data/headroom",
    cta: "더보기",
    background: (
      <img alt="" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "col-span-1",
  },
  {
    Icon: CameraIcon,
    name: "포토앨범",
    description: "연합회 활동을 담은 포토앨범입니다.",
    href: "/comm/gallery",
    cta: "더보기",
    background: (
      <img alt="" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "col-span-1",
  },
  {
    Icon: ImageIcon,
    name: "사진자료실",
    description: "본부에서 제공하는 사진자료입니다.",
    href: "/data/photoroom",
    cta: "더보기",
    background: (
      <img alt="" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "col-span-1",
  },
  {
    Icon: BookOpenIcon,
    name: "회보자료실",
    description: "연합회 회보를 보실 수 있습니다.",
    href: "/data/webzine",
    cta: "더보기",
    background: (
      <img alt="" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "col-span-1",
  },
  {
    Icon: Building2Icon,
    name: "전국요가원",
    description: "전국요가원 정보입니다.",
    href: "/branch",
    cta: "더보기",
    background: (
      <img alt="" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "col-span-1",
  },
  {
    Icon: ShieldCheckIcon,
    name: "민간자격안내",
    description: "민간자격 안내 및 신청 정보입니다.",
    href: "/work/info",
    cta: "더보기",
    background: (
      <img alt="" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "col-span-1",
  },
];

function getBoardBasePath(boardId: string) {
  if (boardId === "videoroom") return "/data/videoroom";
  if (boardId === "headroom") return "/data/headroom";
  return `/comm/${boardId}`;
}

type LatestPost = { id: number; title: string; created_at: string };

function LatestPostList({
  boardId,
  posts,
}: {
  boardId: string;
  posts: LatestPost[];
}) {
  const basePath = getBoardBasePath(boardId);

  return (
    <ul>
      {posts.length === 0 ? (
        <li className="text-sm text-neutral-500">등록된 글이 없습니다.</li>
      ) : (
        posts.map((post) => (
          <li key={post.id}>
            <Link to={`${basePath}/${post.id}`}>{post.title}</Link>
            <time className="text-sm text-neutral-500">
              {post.created_at.slice(0, 10)}
            </time>
          </li>
        ))
      )}
    </ul>
  );
}

function LatestList({
  title,
  boardId,
  posts,
}: {
  title: string;
  boardId: string;
  posts: LatestPost[];
}) {
  const basePath = getBoardBasePath(boardId);

  return (
    <div className="yk-home-latest">
      <div className="yk-home-latest-header">
        <h3 className="text-xl font-semibold text-neutral-700">{title}</h3>
        <Link to={basePath}>더보기</Link>
      </div>
      <LatestPostList boardId={boardId} posts={posts} />
    </div>
  );
}

const homeBoardTabs = [
  { id: "job", title: "구인구직" },
  { id: "qna", title: "묻고 답하기" },
  { id: "fieldnews", title: "권역별소식" },
  { id: "headroom", title: "본부자료실" },
] as const;

function RecentPostList({ posts }: { posts: RecentPost[] }) {
  return (
    <ul>
      {posts.length === 0 ? (
        <li className="text-sm text-neutral-500">등록된 글이 없습니다.</li>
      ) : (
        posts.map((post) => (
          <li key={`${post.board_id}-${post.id}`}>
            <div className="yk-home-latest-item">
              <span className="yk-home-latest-board">{post.board_title}</span>
              <Link to={getBoardPostPath(post.board_id, post.id)}>
                {post.title}
              </Link>
            </div>
            <time className="text-sm text-neutral-500">
              {post.created_at.slice(0, 10)}
            </time>
          </li>
        ))
      )}
    </ul>
  );
}

function RecentCommentList({ comments }: { comments: RecentComment[] }) {
  return (
    <ul>
      {comments.length === 0 ? (
        <li className="text-sm text-neutral-500">등록된 댓글이 없습니다.</li>
      ) : (
        comments.map((comment) => (
          <li key={comment.id}>
            <div className="yk-home-latest-item">
              <span className="yk-home-latest-board">{comment.board_title}</span>
              <Link to={getBoardPostPath(comment.board_id, comment.post_id)}>
                {comment.post_title}
              </Link>
            </div>
            <time className="text-sm text-neutral-500">
              {comment.created_at.slice(0, 10)}
            </time>
          </li>
        ))
      )}
    </ul>
  );
}

const recentFeedTabs = [
  { id: "posts", title: "새글" },
  { id: "comments", title: "새댓글" },
] as const;

function RecentFeedTabs({
  posts,
  comments,
}: {
  posts: RecentPost[];
  comments: RecentComment[];
}) {
  const [activeTab, setActiveTab] =
    useState<(typeof recentFeedTabs)[number]["id"]>("posts");

  return (
    <div className="yk-home-latest yk-home-latest-tabs">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as (typeof recentFeedTabs)[number]["id"])
        }
      >
        <div className="yk-home-latest-header">
          <TabsList
            variant="line"
            className="h-auto flex-1 justify-start gap-0 rounded-none bg-transparent p-0"
          >
            {recentFeedTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-none px-3 py-1 text-base font-semibold text-neutral-700"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="posts" className="mt-0">
          <RecentPostList posts={posts} />
        </TabsContent>
        <TabsContent value="comments" className="mt-0">
          <RecentCommentList comments={comments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LatestListTabs({
  boards,
}: {
  boards: Record<(typeof homeBoardTabs)[number]["id"], LatestPost[]>;
}) {
  const [activeTab, setActiveTab] =
    useState<(typeof homeBoardTabs)[number]["id"]>("job");

  return (
    <div className="yk-home-latest yk-home-latest-tabs">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as (typeof homeBoardTabs)[number]["id"])
        }
      >
        <div className="yk-home-latest-header">
          <TabsList
            variant="line"
            className="h-auto flex-1 justify-start gap-0 rounded-none bg-transparent p-0"
          >
            {homeBoardTabs.map((board) => (
              <TabsTrigger
                key={board.id}
                value={board.id}
                className="rounded-none px-3 py-1 text-base font-semibold text-neutral-700"
              >
                {board.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <Link to={getBoardBasePath(activeTab)}>더보기</Link>
        </div>
        {homeBoardTabs.map((board) => (
          <TabsContent key={board.id} value={board.id} className="mt-0">
            <LatestPostList boardId={board.id} posts={boards[board.id]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}


interface NoticeNotificationItemProps {
  id: number;
  title: string;
  created_at: string;
}

function NoticeNotificationItem({ id, title, created_at }: NoticeNotificationItemProps) {
  return (
    <Link to={getBoardPostPath("notice", id)}>
      <figure
        className={cn(
          "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
          "transition-all duration-100 ease-in-out hover:scale-[103%]",
          "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
          "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]",
        )}
      >
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-col items-start font-medium whitespace-pre dark:text-white">
              <span className="truncate text-sm sm:text-md">{title}</span>
              <span className="shrink-0 text-xs text-gray-500">
                {created_at.slice(0, 10)}
              </span>
            </figcaption>
          </div>
        </div>
      </figure>
    </Link>
  );
}

function NoticeAnimatedList({
  posts,
  className,
  delay = 500,
}: {
  posts: LatestPost[];
  className?: string;
  delay?: number;
}) {
  const noticePosts = posts.slice(0, 5);

  if (noticePosts.length === 0) {
    return (
      <p className="text-sm text-neutral-500">등록된 공지사항이 없습니다.</p>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-[100px] w-full flex-col overflow-hidden p-2",
        className,
      )}
    >
      <AnimatedList delay={delay}>
        {noticePosts.map((post) => (
          <NoticeNotificationItem key={post.id} {...post} />
        ))}
      </AnimatedList>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
    </div>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const slides =
    loaderData.slides.length > 0 ? loaderData.slides : defaultSlides;

  return (
    <SiteLayout navigation={mainNavigation}>
      {/* <section className="yk-hero">
        {slides.map((slide) => (
          <div key={slide.image_path} className="yk-hero-slide">
            <img src={slide.image_path} alt={slide.caption ?? ""} />
            {slide.caption && <h2>{slide.caption}</h2>}
          </div>
        ))}
      </section> */}

      <section className="yk-home-section yk-container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LatestList
            title="공지사항"
            boardId="notice"
            posts={loaderData.notice}
          />

          <div className="yk-home-brbr">
            <div className="yk-home-latest-header">
              <h3 className="text-xl font-semibold text-neutral-700">
                빠람빠라
              </h3>
              <Link to="/comm/brbr">더보기</Link>
            </div>
            <Link to="/comm/brbr">
              <img
                src="/site-assets/data/brbr/brbr1.png"
                alt="빠람빠라"
                className="yk-brbr-image"
              />
            </Link>
          </div>
          <div className="col-span-1 row-span-2">
            <NoticeAnimatedList posts={loaderData.notice} delay={2000} />
            <HomeLoginPanel />
            <RecentFeedTabs
              posts={loaderData.recentPosts}
              comments={loaderData.recentComments}
            />
          </div>
          <div className="col-span-2 row-span-1">
            <LatestListTabs
              boards={{
                job: loaderData.job,
                qna: loaderData.qna,
                fieldnews: loaderData.fieldnews,
                headroom: loaderData.headroom,
              }}
            />
          </div>
        </div>
        {/* <BentoGrid className="lg:grid-rows-2 mt-6">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              name={feature.name}
              description={feature.description}
              href={feature.href}
              cta={feature.cta}
              Icon={feature.Icon}
              background={feature.background}
              className={feature.className}
            />
          ))}
        </BentoGrid> */}
        <div className="yk-home-grid yk-home-grid-3 mt-6"></div>
      </section>
    </SiteLayout>
  );
}
