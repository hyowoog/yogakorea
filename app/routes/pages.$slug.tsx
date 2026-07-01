import type { Route } from "./+types/pages.$slug";
import { data } from "react-router";
import { LegacyPageContent } from "~/components/legacy-page-content";
import { PageWithSidebar } from "~/components/page-sidebar";
import { SiteLayout } from "~/components/site-layout";
import { pageContent } from "~/lib/page-content";
import { mainNavigation, pageMeta } from "~/lib/navigation";

export function meta({ params }: Route.MetaArgs) {
  const info = pageMeta[params.slug];
  return [{ title: info ? `${info.title} | 한국요가연합회` : "페이지" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const info = pageMeta[params.slug];
  if (!info) {
    throw data("페이지를 찾을 수 없습니다.", { status: 404 });
  }

  const html =
    pageContent[params.slug] ??
    `<p>${info.title} 페이지입니다. 상세 콘텐츠는 마이그레이션 중입니다.</p>`;

  return { info, html };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { info, html } = loaderData;

  return (
    <SiteLayout
      navigation={mainNavigation}
      pageTitle={info.title}
      sectionTitle={info.sectionTitle}
    >
      <PageWithSidebar>
        <LegacyPageContent html={html} />
      </PageWithSidebar>
    </SiteLayout>
  );
}
