import { useMemo, useState } from "react";
import { splitLegacyTabHtml, type LegacySegment } from "~/lib/legacy-tabs";

interface LegacyPageContentProps {
  html: string;
}

function LegacyHtmlTabs({
  tabs,
  defaultId,
  listClassName,
  contentClassName,
}: Extract<LegacySegment, { type: "tabs" }>) {
  const [activeId, setActiveId] = useState(defaultId);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <>
      <ul className={listClassName} role="tablist">
        {tabs.map((tab) => {
          const selected = tab.id === active.id;
          return (
            <li key={tab.id} className={selected ? "active" : undefined}>
              <button
                type="button"
                role="tab"
                className={tab.buttonClassName}
                aria-selected={selected}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={contentClassName}>
        <div className="tab-pane fade in active" role="tabpanel">
          <div dangerouslySetInnerHTML={{ __html: active.html }} />
        </div>
      </div>
    </>
  );
}

export function LegacyPageContent({ html }: LegacyPageContentProps) {
  const segments = useMemo(() => splitLegacyTabHtml(html), [html]);

  return (
    <div className="yk-legacy-content">
      {segments.map((segment, index) =>
        segment.type === "html" ? (
          <div key={index} dangerouslySetInnerHTML={{ __html: segment.html }} />
        ) : (
          <LegacyHtmlTabs key={index} {...segment} />
        ),
      )}
    </div>
  );
}
