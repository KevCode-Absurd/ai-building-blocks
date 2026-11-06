// Agent pack pieces for the profile, the file viewer and the guides: the download block, the grouped file list and
// a markdown renderer for pack files and guides. Data and pure helpers are in packs.ts.
import { useMemo } from "preact/hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Link, navigate } from "../../lib/router.tsx";
import { formatBytes, groupPackFiles, isAppPath, knowledgeLine, viewerHref, type PackFile, type PackInfo } from "./packs.ts";

/** Tags a pack file never needs. Media would load from other sites; forms and styles could dress up as the page. */
const FORBID_TAGS = ["img", "picture", "source", "video", "audio", "track", "iframe", "frame", "object", "embed", "style", "link", "meta", "base", "form", "input", "button", "textarea", "select", "svg", "math"];
const FORBID_ATTR = ["style", "srcset", "ping", "background", "poster", "formaction"];

/**
 * Markdown to safe HTML, the app's way (marked, then DOMPurify; see Markdown in components.tsx), stricter for files
 * anyone can write: no images or other media, so a file never makes the browser fetch from another site. Links to
 * other sites open in a new tab without a referrer.
 */
export function renderSafeMarkdown(md: string): string {
  const html = DOMPurify.sanitize(marked.parse(md, { async: false }) as string, { FORBID_TAGS, FORBID_ATTR });
  const box = document.createElement("template");
  box.innerHTML = html;
  for (const a of Array.from(box.content.querySelectorAll("a[href]"))) {
    let url: URL;
    try { url = new URL(a.getAttribute("href") ?? "", location.href); } catch { a.removeAttribute("href"); continue; }
    if (url.origin !== location.origin) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
  }
  return box.innerHTML;
}

/** A link to one of the app's own pages stays in the app, like <Link>. Files, downloads and other sites load as usual. */
function stayInApp(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || a.target || a.hasAttribute("download")) return;
  const url = new URL(a.href);
  if (url.origin !== location.origin || !isAppPath(url.pathname)) return;
  if (url.pathname === location.pathname && url.hash) return;
  e.preventDefault();
  navigate(url.pathname + url.search);
}

export function SafeMarkdown(props: { text: string; class?: string }) {
  const html = useMemo(() => renderSafeMarkdown(props.text), [props.text]);
  return <div class={`prose ${props.class ?? ""}`} onClick={stayInApp} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** "Use this agent in your own AI": the two free downloads, the licence line and how fresh the role knowledge is. */
export function PackDownloads(props: { agentId: string; name: string; pack: PackInfo }) {
  const { pack, name } = props;
  const agentSize = formatBytes(pack.agentZip.bytes), trainSize = formatBytes(pack.trainZip.bytes);
  const knowledge = knowledgeLine(pack.knowledge);
  const every = pack.knowledge?.status === "ready" && pack.knowledge.review_every_days ? ` We check it again every ${pack.knowledge.review_every_days} days.` : "";
  const licence = pack.files.find(f => f.path === "LICENSE.md");
  const licenceHref = licence ? viewerHref(props.agentId, licence.path) : `/packs/${encodeURIComponent(props.agentId)}/LICENSE.md`;
  return (
    <section class="dir-section dir-pack" id="dir-pack" aria-labelledby="dir-pack-title">
      <h2 id="dir-pack-title">Use this agent in your own AI</h2>
      <p class="dir-pack-lede">Download {name} as a folder of files your AI can read. It holds {name}'s method, role knowledge, skills and prompts. Or train your own version, with a coach that learns how you work.</p>
      <div class="dir-pack-actions">
        <a class="btn btn-primary" href={pack.agentZip.path} download>
          Download this agent{agentSize && <>{" "}<span class="dir-pack-size">{agentSize}</span></>}
        </a>
        <a class="btn btn-line" href={pack.trainZip.path} download>
          Train your own{trainSize && <>{" "}<span class="dir-pack-size">{trainSize}</span></>}
        </a>
        <Link href="/guides/train-your-own-agent" class="dir-pack-more">Learn more</Link>
      </div>
      <p class="dir-pack-terms">Or <Link href="/connect">connect your AI</Link> once, then ask it to load {name}. Either way, {name} runs on your own AI plan.</p>
      <p class="dir-pack-terms">Free to use and change in Claude, ChatGPT, Gemini, Codex or Cursor. Not for resale. <Link href={licenceHref}>Read the licence</Link>.</p>
      {knowledge && <p class={`dir-pack-knowledge dir-pack-knowledge-${pack.knowledge!.status}`}>{knowledge}.{every}</p>}
    </section>
  );
}

/** The pack's files, grouped by kind with plain labels, each linked to its viewer page. */
export function PackContents(props: { agentId: string; files: PackFile[]; current?: string; compact?: boolean }) {
  const groups = groupPackFiles(props.files);
  return (
    <div class={`dir-files${props.compact ? " dir-files-compact" : ""}`}>
      {groups.map(g => (
        <section class="dir-files-group" aria-label={g.label}>
          <h3>{g.label} <span class="dir-files-n">{g.files.length}</span></h3>
          <ul>
            {g.files.map(f => (
              <li>
                <Link href={viewerHref(props.agentId, f.path)} class="dir-file-link" aria-current={props.current === f.path ? "page" : undefined}>
                  <span class="dir-file-name">{f.path}</span>
                  {!props.compact && f.purpose && <span class="dir-file-purpose">{f.purpose}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
