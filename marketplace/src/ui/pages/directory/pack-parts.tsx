// Agent pack pieces for the profile, the file viewer and the guides: "Start in your AI" (the download block), the grouped file list and
// a markdown renderer for pack files and guides. Data and pure helpers are in packs.ts.
import { useMemo, useState } from "preact/hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Link, navigate } from "../../lib/router.tsx";
import { formatBytes, groupPackFiles, isAppPath, isStartApp, knowledgeLine, startGuides, viewerHref, type PackFile, type PackInfo, type StartApp } from "./packs.ts";

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

const START_KEY = "aib-start-app";

function savedApp(): StartApp {
  try { const v = localStorage.getItem(START_KEY); return isStartApp(v) ? v : "chatgpt"; } catch { return "chatgpt"; }
}

/** The first message, shown in full and copied with one press. */
function FirstMessage(props: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(props.text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* No clipboard here: the message stays on the page to select by hand. */ }
  };
  return (
    <div class="dir-start-message">
      <p>{props.text}</p>
      <button type="button" class="btn btn-line" onClick={copy}>{copied ? "Copied" : "Copy the message"}</button>
    </div>
  );
}

/**
 * "Start in your AI": one tab per app, each with three steps that take about a minute. Chat apps get the one-file
 * version (one attachment), coding apps the folder, and the connector needs no download. The chosen tab is
 * remembered on this device.
 */
export function PackDownloads(props: { agentId: string; name: string; title: string; area?: string; pack: PackInfo }) {
  const { pack, name } = props;
  const [app, setApp] = useState<StartApp>(savedApp);
  const oneFile = pack.oneFile ?? { path: `/packs/${encodeURIComponent(props.agentId)}.txt`, bytes: null };
  const guides = startGuides({ id: props.agentId, name, title: props.title, area: props.area }, oneFile.bytes);
  const g = guides.find(x => x.id === app) ?? guides[0];
  const choose = (id: StartApp, focus = false) => {
    setApp(id);
    try { localStorage.setItem(START_KEY, id); } catch { /* Not remembered on this device, which is fine. */ }
    if (focus) document.getElementById(`dir-start-tab-${id}`)?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const i = guides.findIndex(x => x.id === g.id), last = guides.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(guides[next].id, true);
  };
  const agentSize = formatBytes(pack.agentZip.bytes), trainSize = formatBytes(pack.trainZip.bytes), fileSize = formatBytes(oneFile.bytes);
  const knowledge = knowledgeLine(pack.knowledge);
  const every = pack.knowledge?.status === "ready" && pack.knowledge.review_every_days ? ` We check it again every ${pack.knowledge.review_every_days} days.` : "";
  const licence = pack.files.find(f => f.path === "LICENSE.md");
  const licenceHref = licence ? viewerHref(props.agentId, licence.path) : `/packs/${encodeURIComponent(props.agentId)}/LICENSE.md`;
  return (
    <section class="dir-section dir-pack" id="dir-pack" aria-labelledby="dir-pack-title">
      <h2 id="dir-pack-title">Start {name} in your AI</h2>
      <p class="dir-pack-lede">Pick the AI you use. It takes about a minute, it is free, and {name} works on your own AI plan.</p>
      <div class="tabs dir-start-tabs" role="tablist" aria-label="Your AI app" onKeyDown={onKey}>
        {guides.map(t => (
          <button type="button" role="tab" id={`dir-start-tab-${t.id}`} aria-selected={t.id === g.id} aria-controls="dir-start-panel"
            tabIndex={t.id === g.id ? 0 : -1} class={`tab${t.id === g.id ? " tab-on" : ""}`} onClick={() => choose(t.id)}>{t.label}</button>
        ))}
      </div>
      <div class="dir-start-panel" id="dir-start-panel" role="tabpanel" aria-labelledby={`dir-start-tab-${g.id}`}>
        <ol class="dir-start-steps">
          <li>
            {g.get === "file" && <>
              <p>Download {name}'s file. It is one text file with everything {name} needs.</p>
              <a class="btn btn-primary" href={oneFile.path} download>Download {name}{fileSize && <>{" "}<span class="dir-pack-size">{fileSize}</span></>}</a>
            </>}
            {g.get === "folder" && <>
              <p>Download {name}'s folder.</p>
              <a class="btn btn-primary" href={pack.agentZip.path} download>Download the folder{agentSize && <>{" "}<span class="dir-pack-size">{agentSize}</span></>}</a>
            </>}
            {g.get === "connect" && <>
              <p>Connect your AI to AI Blocks once. It works in Claude, ChatGPT, Cursor and other apps that take a connector.</p>
              <Link href="/connect" class="btn btn-primary">Connect your AI</Link>
            </>}
          </li>
          <li><p>{g.open}</p></li>
          <li>
            <p>Paste this first message and send it.</p>
            <FirstMessage text={g.message} />
          </li>
        </ol>
        {g.tip && <p class="dir-start-tip">{g.tip}</p>}
      </div>
      <div class="dir-pack-other">
        {g.get !== "folder" && (
          <a class="dir-pack-more" href={pack.agentZip.path} download>Download the full folder{agentSize && <>{" "}<span class="dir-pack-size">{agentSize}</span></>}</a>
        )}
        <a class="dir-pack-more" href={pack.trainZip.path} download>Train your own{trainSize && <>{" "}<span class="dir-pack-size">{trainSize}</span></>}</a>
        <Link href="/guides/train-your-own-agent" class="dir-pack-more">How training works</Link>
      </div>
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
