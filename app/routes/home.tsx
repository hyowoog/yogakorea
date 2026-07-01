import type { Route } from "./+types/home";
import { Link } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { getMainSlides, listLatestPosts } from "~/lib/board.server";
import { mainNavigation } from "~/lib/navigation";

export function meta() {
  return [
    { title: "사단법인 한국요가연합회" },
    { name: "description", content: "한국요가연합회 공식 홈페이지" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  try {
    const [slides, notice, job, qna, fieldnews] = await Promise.all([
      getMainSlides(db),
      listLatestPosts(db, "notice", 7),
      listLatestPosts(db, "job", 7),
      listLatestPosts(db, "qna", 7),
      listLatestPosts(db, "fieldnews", 7),
    ]);

    return { slides, notice, job, qna, fieldnews };
  } catch {
    return {
      slides: [],
      notice: [],
      job: [],
      qna: [],
      fieldnews: [],
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
        <h3>{title}</h3>
        <Link to={`/board/${boardId}`}>더보기</Link>
      </div>
      <ul>
        {posts.length === 0 ? (
          <li className="yk-empty-item">등록된 글이 없습니다.</li>
        ) : (
          posts.map((post) => (
            <li key={post.id}>
              <Link to={`/board/${boardId}/${post.id}`}>{post.title}</Link>
              <time>{post.created_at.slice(0, 10)}</time>
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
              <h3>빠람빠라</h3>
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
          <div className="yk-home-quick">
            <h3>바로가기</h3>
            <div className="yk-quick-links">
              <Link to="/board/gallery">포토앨범</Link>
              <Link to="/board/headroom">본부자료실</Link>
              <Link to="/board/photoroom">사진자료실</Link>
              <Link to="/board/webzine">회보자료실</Link>
              <Link to="/board/branch">전국요가원</Link>
              <Link to="/pages/info">민간자격안내</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
