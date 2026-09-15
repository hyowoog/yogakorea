export type LegacyTab = {
  id: string;
  label: string;
  html: string;
  buttonClassName?: string;
};

export type LegacySegment =
  | { type: "html"; html: string }
  | {
      type: "tabs";
      tabs: LegacyTab[];
      defaultId: string;
      listClassName: string;
      contentClassName: string;
    };

function extractDivAt(html: string, start: number) {
  const openEnd = html.indexOf(">", start);
  if (openEnd === -1 || !html.slice(start, openEnd + 1).startsWith("<div")) {
    return null;
  }

  const attrs = html.slice(start + 4, openEnd);
  const tagRe = /<div\b[^>]*>|<\/div>/g;
  tagRe.lastIndex = start;
  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(html))) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        return {
          attrs,
          inner: html.slice(openEnd + 1, match.index),
          end: match.index + match[0].length,
        };
      }
      continue;
    }
    depth += 1;
  }

  return null;
}

function classNameFromAttrs(attrs: string, fallback: string) {
  return attrs.match(/\bclass="([^"]*)"/)?.[1] ?? fallback;
}

function parseTabTriggers(ulHtml: string) {
  const triggers: Array<{
    id: string;
    label: string;
    defaultActive: boolean;
    buttonClassName?: string;
  }> = [];
  const liRe = /<li\b([^>]*)>([\s\S]*?)<\/li>/g;
  let match: RegExpExecArray | null;

  while ((match = liRe.exec(ulHtml))) {
    const itemHtml = match[2];
    const id =
      itemHtml.match(/data-target="#([^"]+)"/)?.[1] ??
      itemHtml.match(/href="#([^"]+)"/)?.[1];
    if (!id) continue;

    const buttonClassName = itemHtml.match(/<button\b[^>]*\bclass="([^"]*)"/)?.[1];
    triggers.push({
      id,
      label: itemHtml.replace(/<[^>]+>/g, "").trim(),
      defaultActive: /\bactive\b/.test(match[1]),
      buttonClassName,
    });
  }

  return triggers;
}

function parseTabPanes(inner: string) {
  const panes = new Map<string, string>();
  const openRe = /<div\b([^>]*)>/g;
  let match: RegExpExecArray | null;

  while ((match = openRe.exec(inner))) {
    if (!/\btab-pane\b/.test(match[1])) continue;

    const extracted = extractDivAt(inner, match.index);
    if (!extracted) break;

    const id = extracted.attrs.match(/\bid="([^"]+)"/)?.[1];
    if (id) panes.set(id, extracted.inner);
    openRe.lastIndex = extracted.end;
  }

  return panes;
}

function extractTabContentAfter(html: string, from: number) {
  const openRe = /<div\b([^>]*)>/g;
  openRe.lastIndex = from;
  const match = openRe.exec(html);
  if (!match || !/\btab-content\b/.test(match[1])) return null;
  if (!/^\s*$/.test(html.slice(from, match.index))) return null;

  const extracted = extractDivAt(html, match.index);
  if (!extracted) return null;

  return {
    className: classNameFromAttrs(extracted.attrs, "tab-content"),
    inner: extracted.inner,
    end: extracted.end,
  };
}

/** 레거시 Bootstrap 탭 HTML을 React에서 그릴 수 있게 나눈다. */
export function splitLegacyTabHtml(html: string): LegacySegment[] {
  const segments: LegacySegment[] = [];
  const ulRe = /<ul\b([^>]*)>([\s\S]*?)<\/ul>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ulRe.exec(html))) {
    if (!/\bnav-tabs\b/.test(match[1])) continue;

    const content = extractTabContentAfter(html, match.index + match[0].length);
    if (!content) continue;

    const triggers = parseTabTriggers(match[0]);
    const panes = parseTabPanes(content.inner);
    const tabs = triggers.flatMap((trigger) => {
      const paneHtml = panes.get(trigger.id);
      if (paneHtml == null) return [];
      return [
        {
          id: trigger.id,
          label: trigger.label,
          html: paneHtml,
          buttonClassName: trigger.buttonClassName,
        },
      ];
    });

    if (tabs.length === 0) continue;

    if (match.index > lastIndex) {
      segments.push({ type: "html", html: html.slice(lastIndex, match.index) });
    }

    const defaultTrigger = triggers.find((item) => item.defaultActive);
    segments.push({
      type: "tabs",
      tabs,
      defaultId: defaultTrigger?.id ?? tabs[0].id,
      listClassName: classNameFromAttrs(match[1], "nav nav-tabs"),
      contentClassName: content.className,
    });

    lastIndex = content.end;
    ulRe.lastIndex = lastIndex;
  }

  if (lastIndex === 0) {
    return [{ type: "html", html }];
  }

  if (lastIndex < html.length) {
    segments.push({ type: "html", html: html.slice(lastIndex) });
  }

  return segments;
}
