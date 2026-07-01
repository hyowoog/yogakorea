import type { Route } from "./+types/legacy.pages.$slug";
import { data } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { legacyNavigation } from "~/lib/navigation";

const legacyPages: Record<string, { title: string; html: string }> = {
  greetings: {
    title: "인사말",
    html: "<p>기존 Eyoom 테마의 인사말 페이지입니다.</p>",
  },
  aboutus: {
    title: "연합회 소개",
    html: "<p>기존 Eyoom 테마의 소개 페이지입니다.</p>",
  },
  history: {
    title: "연혁",
    html: "<p>기존 Eyoom 테마의 연혁 페이지입니다.</p>",
  },
  organization: {
    title: "조직도",
    html: "<p>기존 Eyoom 테마의 조직도 페이지입니다.</p>",
  },
  contactus: {
    title: "오시는길",
    html: "<p>기존 Eyoom 테마의 오시는길 페이지입니다.</p>",
  },
};

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.page.title ?? "페이지"} | 구 사이트` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const page = legacyPages[params.slug];
  if (!page) throw data("페이지를 찾을 수 없습니다.", { status: 404 });
  return { page };
}

export default function LegacyPage({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;

  return (
    <SiteLayout
      navigation={legacyNavigation}
      variant="legacy"
      pageTitle={page.title}
      sectionTitle="기존 홈페이지"
    >
      <div className="yk-container yk-page-content">
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </SiteLayout>
  );
}
