import type { Route } from "./+types/renew.pages.$slug";
import { data } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { renewNavigation } from "~/lib/navigation";

const renewPages: Record<string, { title: string; html: string }> = {
  greetings: { title: "인사말", html: "<p>리뉴얼 사이트 인사말 페이지입니다.</p>" },
  history: { title: "연혁", html: "<p>리뉴얼 사이트 연혁 페이지입니다.</p>" },
};

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.page.title ?? "페이지"} | 리뉴얼` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const page = renewPages[params.slug];
  if (!page) throw data("페이지를 찾을 수 없습니다.", { status: 404 });
  return { page };
}

export default function RenewPage({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;

  return (
    <SiteLayout
      navigation={renewNavigation}
      variant="renew"
      pageTitle={page.title}
      sectionTitle="리뉴얼 사이트"
    >
      <div className="yk-container yk-page-content">
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </SiteLayout>
  );
}
