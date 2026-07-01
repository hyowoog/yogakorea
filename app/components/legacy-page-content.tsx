import { useEffect, useRef } from "react";

interface LegacyPageContentProps {
  html: string;
}

export function LegacyPageContent({ html }: LegacyPageContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function activateTab(tabLink: HTMLAnchorElement) {
      const targetId = tabLink.getAttribute("href")?.replace(/^#/, "");
      if (!targetId) return;

      const tabList = tabLink.closest(".nav-tabs");
      const tabContent = tabList?.nextElementSibling;
      if (!tabList || !tabContent) return;

      tabList.querySelectorAll("li").forEach((item) => item.classList.remove("active"));
      tabLink.closest("li")?.classList.add("active");

      tabContent.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active", "in");
      });
      tabContent.querySelector(`#${CSS.escape(targetId)}`)?.classList.add("active", "in");
    }

    function onTabClick(event: Event) {
      const target = event.currentTarget;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (target.getAttribute("data-toggle") !== "tab") return;
      event.preventDefault();
      activateTab(target);
    }

    const tabLinks = container.querySelectorAll<HTMLAnchorElement>(
      'a[data-toggle="tab"]',
    );
    tabLinks.forEach((link) => link.addEventListener("click", onTabClick));

    return () => {
      tabLinks.forEach((link) => link.removeEventListener("click", onTabClick));
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="yk-legacy-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
