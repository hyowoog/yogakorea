import type { Route } from "./+types/pages.$slug";
import { data } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { pageMeta, renewNavigation } from "~/lib/navigation";

const pageContent: Record<string, { html: string }> = {
  greetings: {
    html: `
      <div class="yk-content-grid">
        <div>
          <h3>" sat, cit, ananda "</h3>
          <p><em>생명이 존재하는 것은 의식이 있고, 의식이 있는 존재는 행복을 추구한다.</em></p>
          <p>(사)한국요가연합회는 1990년대 요가인들이 요가발전을 위하여 모임을 시작한 것이 현재 연합회의 모태이며, 끊임없는 수행과 교육중심으로 열정과 노력이 깃들어있는 단체입니다.</p>
          <p>요가는 끊임없이 욕망을 향하여 움직이는 마음을 영혼의 자리에 다다르게 하여 본래의 모습으로 회복하는 것이며, 요가로 하여금 내 몸과 마음의 변화를 바라보면서 일상에서 늘 깨어있는 삶으로 살아가실 수 있도록 행복을 전하는 안내자가 되겠습니다.</p>
          <p>협회장 이인승</p>
        </div>
        <img src="/renew-assets/images/greetings.jpg" alt="인사말" class="yk-content-image" />
      </div>
    `,
  },
  way: {
    html: `
      <p>한국요가연합회 오시는 길 안내입니다.</p>
      <p>자세한 위치는 기존 사이트의 지도 정보를 참고해 주세요.</p>
    `,
  },
  branch: {
    html: `<p>전국 요가원 목록은 데이터 마이그레이션 후 제공됩니다.</p>`,
  },
};

export function meta({ params }: Route.MetaArgs) {
  const info = pageMeta[params.slug];
  return [{ title: info ? `${info.title} | 한국요가연합회` : "페이지" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const info = pageMeta[params.slug];
  if (!info) {
    throw data("페이지를 찾을 수 없습니다.", { status: 404 });
  }

  const content = pageContent[params.slug] ?? {
    html: `<p>${info.title} 페이지입니다. 상세 콘텐츠는 마이그레이션 중입니다.</p>`,
  };

  return { info, content };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { info, content } = loaderData;

  return (
    <SiteLayout
      navigation={renewNavigation}
      pageTitle={info.title}
      sectionTitle={info.sectionTitle}
    >
      <div className="yk-container yk-page-content">
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </div>
    </SiteLayout>
  );
}
