import { Link, useRouteLoaderData } from "react-router";
import { MainNav } from "~/components/main-nav";
import { ADMIN_LEVEL } from "~/lib/event-constants";
import type { NavItem } from "~/lib/navigation";
import type { loader as rootLoader } from "~/root";

interface SiteHeaderProps {
  navigation: NavItem[];
  variant?: "main" | "renew";
}

export function SiteHeader({ navigation, variant = "main" }: SiteHeaderProps) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const user = rootData?.user;
  const logoSrc =
    variant === "renew"
      ? "/renew-assets/images/logo.png"
      : "/site-assets/eyoom/theme/basic2/image/site_logo.png";

  return (
    <header className="yk-header">
      <div className="yk-topbar">
        <div className="yk-container yk-topbar-inner">
          <span>사단법인 한국요가연합회</span>
          <div className="yk-topbar-links">
            {/* <Link to="/board/notice">공지사항</Link>
            <Link to="/pages/contactus">오시는길</Link> */}
            {user ? (
              <>
                <span className="text-lime-400 font-thin">{user.name}님 로그인중</span>
                {user.level >= ADMIN_LEVEL ? (
                  <Link to="/admin">관리자모드</Link>
                ) : null}
                <Link to="/logout">로그아웃</Link>
              </>
            ) : (
              <Link to="/login">로그인</Link>
            )}
            {/* {variant === "main" ? (
              <Link to="/renew">리뉴얼 사이트</Link>
            ) : (
              <Link to="/">메인 사이트</Link>
            )} */}
          </div>
        </div>
      </div>
      <div className="yk-header-top relative">
        <div className="yk-container yk-header-inner">
          <Link
            to={variant === "renew" ? "/renew" : "/"}
            className="yk-logo shrink-0"
          >
            <img src={logoSrc} alt="한국요가연합회" />
          </Link>
          <MainNav navigation={navigation} />
        </div>
      </div>
    </header>
  );
}
