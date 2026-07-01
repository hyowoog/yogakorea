import { Link, NavLink } from "react-router";
import type { NavItem } from "~/lib/navigation";

interface SiteHeaderProps {
  navigation: NavItem[];
  variant?: "renew" | "legacy";
}

export function SiteHeader({ navigation, variant = "renew" }: SiteHeaderProps) {
  return (
    <header className="yk-header">
      <div className="yk-header-top">
        <div className="yk-container yk-header-inner">
          <Link to={variant === "legacy" ? "/legacy" : "/"} className="yk-logo">
            <img src="/renew-assets/images/logo.png" alt="한국요가연합회" />
          </Link>
          <nav className="yk-nav">
            <ul className="yk-nav-list">
              {navigation.map((item) => (
                <li key={item.label} className="yk-nav-item">
                  {item.href ? (
                    <NavLink to={item.href} className="yk-nav-link">
                      {item.label}
                    </NavLink>
                  ) : (
                    <span className="yk-nav-link">{item.label}</span>
                  )}
                  {item.children && (
                    <div className="yk-submenu">
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link to={child.href!}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          {variant === "renew" && (
            <Link to="/legacy" className="yk-legacy-link">
              구 사이트
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
