import type { Route } from "./+types/home";
import { Link } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { getMainSlides } from "~/lib/board.server";
import { renewNavigation } from "~/lib/navigation";

export function meta() {
  return [
    { title: "사단법인 한국요가연합회" },
    { name: "description", content: "한국요가연합회 공식 홈페이지" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const db = context.cloudflare.env.DB;
    const slides = await getMainSlides(db);
    return { slides };
  } catch {
    return { slides: [] };
  }
}

const defaultSlides = [
  { image_path: "/renew-assets/images/sld1.jpg", caption: "인간의 삶을 풍요롭게" },
  { image_path: "/renew-assets/images/sld2.jpg", caption: "사회, 육체, 정신, 영혼으로서 삶" },
];

export default function Home({ loaderData }: Route.ComponentProps) {
  const slides = loaderData.slides.length > 0 ? loaderData.slides : defaultSlides;

  return (
    <SiteLayout navigation={renewNavigation}>
      <section className="yk-hero">
        {slides.map((slide) => (
          <div key={slide.image_path} className="yk-hero-slide">
            <img src={slide.image_path} alt={slide.caption ?? ""} />
            {slide.caption && <h2>{slide.caption}</h2>}
          </div>
        ))}
      </section>

      <section className="yk-home-section yk-container">
        <div className="yk-home-grid">
          <div className="yk-home-card">
            <h3>공지사항</h3>
            <p>연합회의 최신 소식을 확인하세요.</p>
            <Link to="/board/notice" className="yk-btn yk-btn-primary">
              바로가기
            </Link>
          </div>
          <div className="yk-home-card">
            <h3>주요사업안내</h3>
            <p>민간자격, 교육사업, 지도자 양성 프로그램을 안내합니다.</p>
            <Link to="/pages/business-lic" className="yk-btn yk-btn-primary">
              사업안내
            </Link>
          </div>
          <div className="yk-home-card">
            <h3>전국요가원</h3>
            <p>전국 소속 요가원 정보를 확인하세요.</p>
            <Link to="/pages/branch" className="yk-btn yk-btn-primary">
              요가원 찾기
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
