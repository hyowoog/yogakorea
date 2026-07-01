import type { Route } from "./+types/renew._index";
import { Link } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { renewNavigation } from "~/lib/navigation";

export function meta() {
  return [{ title: "한국요가연합회 (리뉴얼 사이트)" }];
}

export default function RenewHome() {
  return (
    <SiteLayout navigation={renewNavigation} variant="renew" pageTitle="리뉴얼 사이트">
      <div className="yk-container yk-page-content">
        <p>이 영역은 <code>public_html/renew</code> 기반 리뉴얼 사이트입니다.</p>
        <p>
          <Link to="/">메인 사이트(public_html)</Link>로 이동할 수 있습니다.
        </p>
      </div>
    </SiteLayout>
  );
}
