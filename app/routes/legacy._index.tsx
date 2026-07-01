import type { Route } from "./+types/legacy._index";
import { Link } from "react-router";
import { SiteLayout } from "~/components/site-layout";
import { legacyNavigation } from "~/lib/navigation";

export function meta() {
  return [{ title: "한국요가연합회 (구 사이트)" }];
}

export default function LegacyHome() {
  return (
    <SiteLayout navigation={legacyNavigation} variant="legacy" pageTitle="기존 홈페이지">
      <div className="yk-container yk-legacy-home">
        <p>이 영역은 기존 Eyoom/그누보드 기반 사이트입니다.</p>
        <div className="yk-home-grid">
          <div className="yk-home-card">
            <h3>연합회 소개</h3>
            <Link to="/legacy/pages/greetings">인사말</Link>
          </div>
          <div className="yk-home-card">
            <h3>커뮤니티</h3>
            <Link to="/legacy/board/g5_notice">공지사항</Link>
          </div>
          <div className="yk-home-card">
            <h3>리뉴얼 사이트</h3>
            <Link to="/">새 홈페이지로 이동</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
