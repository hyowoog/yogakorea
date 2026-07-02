import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import {
  BookOpenIcon,
  Building2Icon,
  CameraIcon,
  FileTextIcon,
  ImageIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Link } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { getMainSlides, listLatestPosts } from "~/lib/board.server";
import { mainNavigation } from "~/lib/navigation";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "사단법인 한국요가연합회" },
    { name: "description", content: "한국요가연합회 공식 홈페이지" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  try {
    const [slides, notice, job, qna, fieldnews, videoroom] = await Promise.all([
      getMainSlides(db),
      listLatestPosts(db, "notice", 7),
      listLatestPosts(db, "job", 7),
      listLatestPosts(db, "qna", 7),
      listLatestPosts(db, "fieldnews", 7),
      listLatestPosts(db, "videoroom", 7),
    ]);

    return { slides, notice, job, qna, fieldnews, videoroom };
  } catch {
    return {
      slides: [],
      notice: [],
      job: [],
      qna: [],
      fieldnews: [],
      videoroom: [],
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
    href: "/board/headroom",
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
    href: "/board/gallery",
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
    href: "/board/photoroom",
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
    href: "/board/webzine",
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
    href: "/board/branch",
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
    href: "/pages/info",
    cta: "더보기",
    background: (
      <img alt="" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "col-span-1",
  },
];

function LatestList({
  title,
  boardId,
  posts,
}: {
  title: string;
  boardId: string;
  posts: { id: number; title: string; created_at: string }[];
}) {
  return (
    <div className="yk-home-latest">
      <div className="yk-home-latest-header">
        <h3 className="text-xl font-semibold text-neutral-700">{title}</h3>
        <Link to={`/board/${boardId}`}>더보기</Link>
      </div>
      <ul>
        {posts.length === 0 ? (
          <li className="text-sm text-neutral-500">등록된 글이 없습니다.</li>
        ) : (
          posts.map((post) => (
            <li key={post.id}>
              <Link to={`/board/${boardId}/${post.id}`}>{post.title}</Link>
              <time className="text-sm text-neutral-500">
                {post.created_at.slice(0, 10)}
              </time>
            </li>
          ))
        )}
      </ul>
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
        <div className="yk-home-grid yk-home-grid-3">
          <LatestList
            title="공지사항"
            boardId="notice"
            posts={loaderData.notice}
          />
          <LatestList title="구인구직" boardId="job" posts={loaderData.job} />
          <div className="yk-home-brbr">
            <div className="yk-home-latest-header">
              <h3 className="text-xl font-semibold text-neutral-700">빠람빠라</h3>
              <Link to="/board/brbr">더보기</Link>
            </div>
            <Link to="/board/brbr">
              <img
                src="/site-assets/data/brbr/brbr1.png"
                alt="빠람빠라"
                className="yk-brbr-image"
              />
            </Link>
          </div>
        </div>
        <BentoGrid className="lg:grid-rows-2 mt-6">
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
        </BentoGrid>
        <div className="yk-home-grid yk-home-grid-3 mt-6">
          <LatestList
            title="권역별소식"
            boardId="fieldnews"
            posts={loaderData.fieldnews}
          />
          <LatestList
            title="묻고 답하기"
            boardId="qna"
            posts={loaderData.qna}
          />
          <LatestList
            title="교육동영상"
            boardId="videoroom"
            posts={loaderData.videoroom}
          />
        </div>
      </section>
    </SiteLayout>
  );
}
