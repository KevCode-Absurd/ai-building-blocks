import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Comments from "./Comments";
import FactCheckNotes from "./FactCheckNotes";
import SkillNeighbours from "./SkillNeighbours";
import { StarButton } from "./CommunityStars";
import { Look, MakeIt, MakeNote, makeTitle } from "./MakeIt";
import { ArrowIcon, KitMenu, Drawer } from "./ui";
import { type Block, type Catalogue, type Page, formatOf, kindInfo, rendersOf, kindOf, loadPage, loadSkillText, useCatalogueState, paidService, pathOf, wireSteps } from "./lib/data";
import { markViewed } from "./lib/store";
import { finalOutputs, needsOf, orderFlow, zipName } from "./lib/handoff-core";
import { download } from "./lib/download";
import { getBusiness, hasBusiness, meFor, useBusiness, withBusiness } from "./lib/business";
import type { TaskLike } from "./lib/me-file";
import { openTailor } from "./Tailor";
import { BusinessNote, openBusiness } from "./Business";
import { DownloadDialog, TransferGuide } from "./DownloadDialog";
import ExecutionPrompt from "./ExecutionPrompt";
import type { Flow } from "./lib/store";
import { Link } from "./lib/router";
import Install from "./Install";
import { Before, Next } from "./Needs";
import RunInAi, { PullFromAi } from "./RunInAi";
import { Gauge } from "./Gauge";
import PixelFace from "./PixelFace";
import { HelpedBy, MindSkills, WorkflowList, flowsUsing } from "./MindPack";
import { LabelBadges } from "./MindLabel";
import { useSeen, useTyped } from "./lib/typing";
import "./task-simplicity.css";
import "./block-flow.css";
import { trackUxEvent } from "./lib/ux-events";
import { usePersistence } from "./AccountPersistence";
import { normalizeSkillHtml } from "./lib/skill-html.mjs";
import { TASK_STARTERS } from "./lib/task-discovery";
import CopyableTask from "./CopyableTask";
import BlockHeader from "./BlockHeader";

// A list item that YAML read as a small map ("Check: this") still shows as text.
const txt = (x: unknown): string => (typeof x === "string" ? x : x && typeof x === "object" ? Object.entries(x as Record<string, unknown>).map(([k, v]) => (v == null ? k : `${k}: ${txt(v)}`)).join(" ") : String(x ?? ""));

/** "Apache-2.0" reads as "Apache 2.0" in a sentence. */
const licenceName = (l: string) => l.replace(/-/g, " ");

/** GitHub's mark, drawn in the text colour. */
const GitHubMark = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" className="gh-mark">
    <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

/** Who made an imported skill: a pill to its GitHub folder, and its original name turning into ours, block by block. */
function Credit({ b, source }: { b: Block; source: NonNullable<Block["source"]> }) {
  const { original, commit } = source;
  return (
    <div className="bp-credit" data-testid="credit-line">
      {source.url && <a className="gh-pill" href={source.url} target="_blank" rel="noopener noreferrer" data-testid="gh-pill" aria-label={`See the original on GitHub: ${source.repo}`}>
        <GitHubMark /><span className="gh-repo">{source.repo}</span><span className="gh-lic">{licenceName(source.licence ?? "")}</span>
      </a>}
      {original && original !== b.name && (
        <p className="gh-rename" aria-label={`First called ${original}, now ${b.name}`}>
          <code>{original}</code>
          <span className="gh-blocks" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * 0.14}s` }} />)}</span>
          <b>{b.name}</b>
        </p>
      )}
      <p className="gh-note">From {source.by}. Shared under its licence, with a plain name for this library.{commit && <> Source version: <code>{commit}</code>.</>}</p>
    </div>
  );
}

function FullAddToFlow(props: {slug: string; onClose: () => void; toast: (m: string) => void}) {
  const {catalogue, error, retry} = useCatalogueState(true);
  const [Editor, setEditor] = useState<typeof import("./AddToFlow").default | null>(null);
  const [editorError, setEditorError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setEditorError(false);
    import("./AddToFlow").then(module => { if (active) setEditor(() => module.default); }).catch(() => { if (active) setEditorError(true); });
    return () => { active = false; };
  }, [attempt]);
  if (catalogue && Editor) return <Editor {...props} c={catalogue} />;
  return <Drawer label="Add to a workflow" top={<h2>Add to a workflow</h2>} onClose={props.onClose}><p role={error || editorError ? "alert" : "status"}>{error || (editorError ? "Your workflow choices could not open. Check your connection and try again." : "Opening your workflow choices…")}</p>{(error || editorError) && <button className="btn btn-line" onClick={() => { if (error) retry(); if (editorError) setAttempt(value => value + 1); }}>Try again</button>}</Drawer>;
}

type Props = { c: Catalogue; slug: string; toast: (m: string) => void; toBuilder: (slugs: string[], asNew?: string) => void; embedded?: boolean; initialPage?: Page | null; onPageLoaded?: (page: Page | null) => void };

/** A code window with a file name, line numbers and a copy button.
 *  With `typed`, the text writes itself out when it scrolls into view, like your AI answering, and can be replayed. */
export function Code({ name, text, toast, tall, typed }: { name: string; text: string; toast: (m: string) => void; tall?: boolean; typed?: boolean }) {
  const body = text.replace(/\n+$/, "");
  const lines = body.split("\n");
  const [ref, seen] = useSeen<HTMLElement>(0.25);
  const pre = useRef<HTMLPreElement>(null);
  const userScrolled = useRef(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const { n, done, replay, skip } = useTyped(body, !!typed && seen, Math.min(4800, Math.max(1400, body.length * 2.5)));
  const showing = typed ? n : body.length;
  let off = 0, at = lines.length - 1;
  const rows = lines.map((l, i) => {
    const s0 = off;
    off += l.length + 1;
    const k = showing - s0;
    if (k >= l.length + (i < lines.length - 1 ? 1 : 0)) return <span className="ln" key={i}>{l || " "}{"\n"}</span>;
    if (k < 0) return <span className="ln ghost" key={i}>{l || " "}{"\n"}</span>;
    at = i;
    return <span className="ln" key={i}>{l.slice(0, k)}<span className="cursor" /><span className="ghost">{l.slice(k) || " "}</span>{"\n"}</span>;
  });
  // Keep the cursor in view while it writes, unless you scroll the window yourself.
  useEffect(() => {
    const p = pre.current;
    if (!typed || done || !p || userScrolled.current) return;
    const cur = p.querySelector(".cursor");
    if (!cur) return;
    const gap = cur.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom;
    if (gap > -32) p.scrollTop += gap + 64;
  }, [typed, done, n]);
  const again = () => { userScrolled.current = false; if (pre.current) pre.current.scrollTop = 0; replay(); };
  return (
    <figure className={`code${tall ? " tall" : ""}`} ref={ref}>
      <figcaption>
        <span className="code-name">{name}</span>
        <span className="code-meta">{typed && !done ? `writing ${Math.min(at + 1, lines.length)} of ${lines.length} lines` : `${lines.length} lines`}</span>
        {typed && <button className="code-copy code-replay" onClick={done ? again : skip} data-testid="code-replay">{done ? "Replay" : "Skip"}</button>}
        <button className={`code-copy${typed ? " next" : ""}`} onClick={async () => { try { await navigator.clipboard.writeText(text); setCopyFailed(false); trackUxEvent("request_copied"); toast(`Copied ${name}`); } catch { setCopyFailed(true); } }}>Copy</button>
      </figcaption>
      <pre ref={pre} className={typed ? "typed" : undefined} data-done={String(done)} onWheel={() => { userScrolled.current = true; }} onTouchStart={() => { userScrolled.current = true; }}>{rows}</pre>
      {copyFailed && <div className="task-copy-fallback"><p role="alert">Copy did not work. Select the text below and copy it.</p><textarea aria-label={`Copy ${name} manually`} value={text} readOnly rows={6} onFocus={e => e.currentTarget.select()} /></div>}
    </figure>
  );
}

export function Section({ id, title, lead, children, wide }: { id: string; title: string; lead?: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className={`bp-sec${wide ? " wide" : ""}`} id={id} aria-labelledby={`${id}-h`}>
      <h2 className="bp-h2" id={`${id}-h`}>{title}</h2>
      {lead && <p className="bp-note">{lead}</p>}
      {children}
    </section>
  );
}

/** One reference topic inside Details. A plain section: Details is the only disclosure. */
function DetailSection({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="bp-sec bp-detail" id={id} aria-labelledby={`${id}-h`}>
      <h3 className="bp-h3" id={`${id}-h`}>{title}</h3>
      {lead && <p className="bp-note">{lead}</p>}
      {children}
    </section>
  );
}

/** Everything that is not what you get, what to fill in or how to run it, behind one native disclosure.
 *  It starts closed, its content stays in the page for search engines, and a link to anything inside it opens it. */
function DetailsPanel({ children, watch }: { children: ReactNode; watch?: unknown }) {
  const box = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const reveal = () => {
      let id = "";
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      if (!id) return;
      const target = document.getElementById(id);
      if (id === "details" || (target && box.current?.contains(target))) {
        setOpen(true);
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
      }
    };
    addEventListener("hashchange", reveal); reveal();
    return () => removeEventListener("hashchange", reveal);
  }, [watch]);
  return (
    <details className="bp-details" id="details" data-testid="bp-details" ref={box} open={open} onToggle={e => setOpen(e.currentTarget.open)}>
      <summary><h2 className="bp-h2">Details</h2><span className="bp-details-hint">The steps, what to have ready, checks and sources</span></summary>
      {children}
    </details>
  );
}

type ComposerProps = { slug: string; task?: TaskLike; skill: string | null; give: string[]; toast: (m: string) => void; example?: string; exampleLabel?: string; onTransfer: () => void };

/** Public task pages can stay mounted while account state changes. Never render an old owner's draft. */
function Composer(props: ComposerProps) {
  const { account, snapshot, ready } = usePersistence();
  const user = account.state === "signed-in" ? account.userId : null;
  if (!ready || snapshot.user !== user) return <p role="status">Opening your task draft…</p>;
  const owner = snapshot.user ? `user:${encodeURIComponent(snapshot.user)}` : "guest";
  const key = `abb:task-draft:${owner}:${props.slug}`;
  // The old abb:draft:<slug> key had no owner. Do not copy potentially signed-in text to a guest or another account.
  return <ScopedComposer key={key} {...props} storageKey={key} />;
}

/** One account-scoped local draft, one complete request, then the transfer step. */
function ScopedComposer({ slug, task, skill, give, toast, example, exampleLabel, onTransfer, storageKey: key }: ComposerProps & { storageKey: string }) {
  const [text, setText] = useState(() => { try { return localStorage.getItem(key) ?? ""; } catch { return ""; } });
  const backupKey = `${key}:before-example`;
  const [savedText, setSavedText] = useState<string | null>(() => { try { return localStorage.getItem(backupKey); } catch { return null; } });
  const [exampleError, setExampleError] = useState("");
  const [includeBusiness, setIncludeBusiness] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const biz = useBusiness();
  const about = includeBusiness ? meFor(biz, task ? [task] : []) : "";
  const ready = !!skill && (give.length === 0 || !!text.trim());
  const request = skill ? `${skill.trim()}\n\n---\n\n${[about, text.trim()].filter(Boolean).join("\n")}\n` : "";
  useEffect(() => { try { if (text) localStorage.setItem(key, text); else localStorage.removeItem(key); } catch { /* storage unavailable; keep this draft in memory */ } }, [key, text]);
  const change = (value: string) => { setText(value); setCopied(false); setFailed(false); };
  const useExample = () => {
    if (!example) return;
    const original = savedText ?? text;
    try { localStorage.setItem(backupKey, original); }
    catch { setExampleError("The example could not be saved. Your text is kept. Copy it before trying again."); return; }
    setSavedText(original); setExampleError(""); change(example);
  };
  const restoreText = () => {
    if (savedText === null) return;
    change(savedText);
    try {
      if (savedText) localStorage.setItem(key, savedText); else localStorage.removeItem(key);
      localStorage.removeItem(backupKey); setSavedText(null); setExampleError("");
    } catch { setExampleError("Your text is restored here. This browser could not save it. Copy it before leaving."); }
  };
  const copy = async () => {
    if (!ready) return;
    try { await navigator.clipboard.writeText(request); setFailed(false); setCopied(true); trackUxEvent("request_copied"); onTransfer(); toast("Request copied. Paste it into your AI chat."); }
    catch { setFailed(true); setCopied(false); }
  };
  const label = slug === "rough-notes-to-minutes-writer" ? "Paste your meeting notes" : give.length === 1 ? `Add ${txt(give[0]).replace(/[.。]$/, "")}` : "Add the details for this task";
  return <div className="composer task-composer" data-testid="composer">
    <label htmlFor="composer-text">{label}{give.length === 0 && " (optional)"}</label>
    {give.length > 1 && <ul className="task-materials">{give.map((g, i) => <li key={i}>{txt(g)}</li>)}</ul>}
    <textarea id="composer-text" value={text} onChange={e => change(e.currentTarget.value)} rows={5} spellCheck placeholder={give.map(txt).join("\n")} aria-describedby={`task-local-note${!ready ? " task-input-help" : ""}`} />
    {!ready && <p id="task-input-help" className="small task-input-help" role="status" data-testid="task-input-help">{skill ? "Add the requested details above to enable Copy the request." : "Waiting for the instructions to load. If loading fails, choose Try again above."}</p>}
    {example && <div className="task-example-actions"><button className="link-btn" onClick={useExample} data-testid="use-task-example">{exampleLabel ? `Use ${exampleLabel.toLowerCase()}` : "Use example material"}</button>{savedText !== null && exampleLabel && <span className="small">{exampleLabel}: made-up material to show what to add.</span>}{savedText !== null && <button className="link-btn" onClick={restoreText}>Restore my text</button>}</div>}
    {exampleError && <p role="alert">{exampleError}</p>}
    <details className="task-extras"><summary>Add your me.md (optional)</summary><p className="small">Only the parts this task needs are added.</p>{hasBusiness(biz) ? <label className="task-check"><input type="checkbox" checked={includeBusiness} onChange={e => { setIncludeBusiness(e.currentTarget.checked); setCopied(false); }} />Include my me.md in this request</label> : <button className="link-btn" onClick={openBusiness}>Add your me.md</button>}</details>
    <div className="composer-bar"><span id="task-local-note" className="small">Your draft stays on this device. Copying does not send it to an AI.</span><button className="btn btn-primary btn-sm" disabled={!ready} onClick={() => void copy()} data-testid="composer-copy">{copied ? "Request copied" : "Copy the request"}</button></div>
    {failed && <div className="task-copy-fallback"><p role="alert">Copy did not work. Select the complete request below and copy it.</p><textarea aria-label="Copy the complete request manually" readOnly value={request} rows={7} onFocus={e => e.currentTarget.select()} /></div>}
    {(copied || failed) && <div className="task-transfer" data-testid="task-text-transfer"><h3>Use it in your AI</h3><ol><li>Open a new chat in your AI.</li><li>Paste the complete request and send it.</li><li>Check the result against the checks below before you use it.</li></ol><p className="small">This site prepares the request. Your AI does the work.</p></div>}
  </div>;
}

export default function BlockPage({ c, slug, toast, toBuilder, embedded = false, initialPage, onPageLoaded }: Props) {
  const b = c.bySlug[slug];
  const [page, setPage] = useState<Page | null | undefined>(initialPage);
  const [skill, setSkill] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [dl, setDl] = useState<Flow | null>(null);
  const [transferred, setTransferred] = useState(false);
  const [useful, setUseful] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [showAllSample, setShowAllSample] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const { account } = usePersistence();
  const transferScope = `${slug}:${account.state === "signed-in" ? account.userId : account.state}`;
  const currentTransfer = useRef(transferScope);
  currentTransfer.current = transferScope;
  useEffect(() => { setDownloading(false); setDownloadError(""); setCopyFailed(false); }, [transferScope]);
  useEffect(() => () => { currentTransfer.current = ""; }, []);
  const biz = hasBusiness(useBusiness());
  useEffect(() => {
    let active = true;
    if (!embedded) setPage(undefined);
    setSkill(null); setShowAllSample(false); setLoadError(false); setTransferred(false); setUseful(false); setCopyFailed(false);
    loadPage(slug).then(value => { if (active) { setPage(value); onPageLoaded?.(value); if (!value && b?.headline) setLoadError(true); } }).catch(() => { if (active) { setPage(null); onPageLoaded?.(null); setLoadError(true); } });
    loadSkillText(slug).then(value => { if (active) { setSkill(value); if (!value) setLoadError(true); } }).catch(() => { if (active) setLoadError(true); });
    markViewed(slug); trackUxEvent("task_started");
    return () => { active = false; };
  }, [slug, reload, onPageLoaded, embedded]);
  // Lift the startup cover once the page text is in (or failed), not before: the header grows when it arrives.
  useLayoutEffect(() => { if (!embedded && page !== undefined) document.dispatchEvent(new Event("abb:ready")); }, [page, embedded]);
  useEffect(() => { document.title = `${b?.name ?? "Not found"} · AI Blocks`; return () => { document.title = "Free AI Skills & Custom Workflow Builder | AI Blocks"; }; }, [b]);

  if (!b) {
    return (
      <main className="wrap bp-missing">
        <h1 className="bp-h1">That page has moved</h1>
        <p className="bp-sub">There's nothing called “{slug}” any more. It may have a new name.</p>
        <Link to="/#library" className="btn btn-primary">Go to the library</Link>
      </main>
    );
  }

  const kind = kindInfo(b);
  const format = formatOf(b);
  const renders = rendersOf(b);
  const oldNames = Object.entries(c.renamed ?? {}).filter(([, to]) => to === b.slug).map(([from]) => from);
  const twin = b.twin ? c.bySlug[b.twin] : null;
  // An agent runs workflows and skills in order like a workflow, and is added to your AI like a skill.
  const isAgent = kindOf(b) === "agent";
  const isFlow = kindOf(b) === "workflow" || isAgent;
  // These coordinators choose branches and resume from saved state. Preserve
  // their governing skill when exporting or opening them in the canvas.
  const keepCoordinator = b.type === "agent" || b.execution === "coordinator" || !b.steps.length;
  const p = page ?? null;
  const give = p?.you_give?.length ? p.you_give : b.inputs.map((x) => x.type.replace(/_/g, " "));
  const get = p?.you_get?.length ? p.you_get : b.outputs.map((x) => x.type.replace(/_/g, " "));
  const fileTask = !!b.hasFiles || !!renders || !!paidService(b);
  const textTask = !isFlow && !fileTask;
  const required = [...new Set([...b.inputs.filter(x => x.required).map(x => c.portTypes[x.type] || x.type.replace(/_/g, " ")), ...(p?.plan?.needed.filter(x => x.required).map(x => x.label) ?? [])])];
  const bring = p?.you_give?.length ? p.you_give : required;
  const usefulChecks = p?.judge?.slice(0, 3) ?? [];
  const starter = TASK_STARTERS.find(task => task.slug === b.slug);
  const workflowFlow = (): Flow => {
    const slugs = keepCoordinator ? [b.slug] : b.steps.map((s) => s.uses);
    const nodes = slugs.map((slug, i) => ({ id: `s${i + 1}`, slug, x: i * 300, y: 0 }));
    const edges = wireSteps(c, slugs).map(([a, z], i) => ({ id: `e${i}`, from: nodes[a].id, to: nodes[z].id }));
    return { id: b.slug, name: b.name, updated: 0, nodes, edges, governingSkills: keepCoordinator ? [] : [b.slug] };
  };
  const handoff = () => { trackUxEvent("route_accepted"); setDl(workflowFlow()); };
  const downloadTask = async () => {
    if (!skill || downloading) return;
    const scope = currentTransfer.current;
    setDownloading(true); setDownloadError(""); trackUxEvent("pack_download_requested");
    try {
      const packBusiness = getBusiness();
      const {buildHandoffZip,buildSkillZip} = await import("./lib/handoff");
      const result = isFlow ? await buildHandoffZip(c, workflowFlow(), packBusiness) : { blob: await buildSkillZip(b.slug, skill, b.hasFiles, packBusiness, b), filename: `${b.slug}.zip` };
      if (currentTransfer.current !== scope) return;
      if ("error" in result) throw Error(result.error);
      download(result.blob, result.filename); setTransferred(true);
      toast("Download ready. Add the files to your AI to start.");
    } catch (error) { if (currentTransfer.current === scope) setDownloadError(error instanceof Error ? error.message : "The download could not be prepared. Please try again."); }
    finally { if (currentTransfer.current === scope) setDownloading(false); }
  };
  const dlOrder = dl ? orderFlow(dl) : null;
  const getPack = async () => {
    if (!dl) return false;
    const packBusiness = getBusiness();
    const {buildHandoffZip} = await import("./lib/handoff");
    const r = await buildHandoffZip(c, dl, packBusiness);
    if ("error" in r) { toast(r.error); return false; }
    download(r.blob, r.filename);
    setTransferred(true);
    return true;
  };
  const copySkill = async () => {
    if (!skill) return;
    try { await navigator.clipboard.writeText(withBusiness(skill, getBusiness(), [b])); setCopyFailed(false); trackUxEvent("request_copied"); toast(biz ? "Instructions copied with your me.md. Paste them into your AI." : "Instructions copied. Paste them into your AI."); }
    catch { setCopyFailed(true); }
  };

  const has = (x?: unknown[]) => !!x && x.length > 0;
  const showExplanation = !!p?.explain && p.explain.trim() !== (p.subhead || b.summary).trim();
  // The workflows this skill is a step in, or for a mind, the workflows from their work.
  const inFlows = b.type === "mind" ? (b.flows ?? []).map((f) => c.bySlug[f]).filter(Boolean) : isFlow ? [] : flowsUsing(c, b.slug);
  const mindName = b.name.split(" (")[0];
  const isMind = b.type === "mind";
  const shape = p?.output_shape;
  const exampleOut = !shape ? p?.example?.output : undefined;
  const hireJobs = isMind ? (p?.hire?.jobs ?? []).slice(0, 5) : [];
  const getList = !shape && !exampleOut && !hireJobs.length && !p?.output_sample ? get : [];
  // "Is it for you?": the first 3 situations to use it, and the situations to skip it. The full list stays in Details only when it is longer than 3.
  const clean = (x?: unknown) => (Array.isArray(x) ? x : []).filter((v): v is string => typeof v === "string" && !!v.trim());
  const useWhen = clean(p?.when).slice(0, 3);
  const skipWhen = clean(p?.not_for);
  const hasFit = useWhen.length > 0 || skipWhen.length > 0;
  const showWhenDetail = clean(p?.when).length > 3;
  // output_sample: what goes in and what comes out. When it exists it stands in for the plain you_get list and the open skeleton.
  const os = p?.output_sample;
  const sampleOut = (Array.isArray(os?.output) ? os!.output : []).filter(o => o && typeof o.name === "string" && o.name.trim() && typeof o.contains === "string" && o.contains.trim());
  const sample = os && clean(os.input).length > 0 && sampleOut.length > 0 ? { input: clean(os.input), prerequisites: clean(os.prerequisites), output: sampleOut } : null;
  const hasGet = hasFit || !!sample || !!shape || !!exampleOut || getList.length > 0 || hireJobs.length > 0 || !!(renders && b.look) || !!format || !!renders;
  // What makes it better, kept short: extra material with a maker, and the tools it works best with.
  const betterWith = [...(p?.plan?.needed.filter(x => !x.required) ?? []), ...(p?.plan?.helps ?? [])];
  const betterTools = p?.works_best_with?.tools ?? [];
  const hasCopyable = b.type === "skill" && !!p?.copyable;
  const hasFill = textTask || bring.length > 0 || betterWith.length > 0 || betterTools.length > 0 || hasCopyable;
  const noun = kind.name.toLowerCase();
  let part = 0;
  const num = () => <span className="bp-n" aria-hidden="true">{++part}</span>;
  const local = (url: string) => url.replace(/^https:\/\/useaiblocks\.com/, "");
  const jump: [string, string][] = ([
    ["what", isMind ? "Who they are" : "What it does", showExplanation || showWhenDetail || (!isFlow && has(p?.how_it_works))],
    ["hire", `Hire ${mindName}`, has(p?.hire?.jobs)],
    ["skills", "Their skills", isMind],
    ["flows", isMind ? "Their workflows" : "Part of these workflows", inFlows.length > 0],
    ["ideas", "Big ideas", has(p?.ideas)],
    ["seats", "On a council", has(p?.seats)],
    ["io", "What goes in and out", give.length > 0 || get.length > 0],
    ["before", "Before you start", !!p?.plan && (has(p.plan.needed) || has(p.plan.helps))],
    ["steps", isAgent ? "What it runs" : "The steps", isFlow],
    ["install", "Other ways to add it", !isFlow || isAgent],
    ["helped", "Who can help", has(b.minds)],
    ["make", renders ? makeTitle(renders) : "", !!renders],
    ["use", "How to use it", has(p?.how_to_use)],
    ["most", "What matters most", has(p?.tweaks)],
    ["test", "Check the result", has(p?.judge) || has(p?.test)],
    ["best", "Works best with", has(p?.works_best_with?.tools) || has(p?.works_best_with?.inputs)],
    ["improve", "Make it fit your work", has(p?.improve)],
    ["source", "Where it came from", b.origin === "imported" && !!b.source],
    ["thinking", "Thinking it needs", !!b.thinking],
    ["file", isAgent ? "The agent file" : isFlow ? "The workflow file" : "The skill file", true],
  ] as [string, string, boolean][]).filter(([, , show]) => show).map(([id, label]) => [id, label]);

  const Root = embedded ? "div" : "main";
  return (
    <Root className={embedded ? undefined : "bp"} data-testid={embedded ? "block-body" : "block-page"} data-slug={b.slug}>
      <Comments key={b.slug} slug={b.slug} name={b.name} also={oldNames} toast={toast} />
      {adding && <FullAddToFlow slug={b.slug} onClose={() => setAdding(false)} toast={toast} />}
      {dl && dlOrder && <DownloadDialog name={dl.name} goal={dl.goal} zip={zipName(dl.name)} needs={needsOf(c, dlOrder)} finals={finalOutputs(c, dl, dlOrder)} onDownload={getPack} onClose={() => setDl(null)} kind={isAgent ? "agent" : "workflow"} />}
      {!embedded && <BlockHeader b={b} p={p ?? null}
        portrait={isMind ? <PixelFace face={b.face} area={b.area} slug={b.slug} size={112} className="bp-face" /> : undefined}
        labels={isMind ? <LabelBadges c={c} labels={b.labels} /> : undefined} />}

      <div className="wrap bp-flow">
        {page === undefined && <p className="small" role="status">Loading…</p>}
        {loadError && <p role="alert">The instructions could not load. Your draft is kept. <button className="link-btn" onClick={() => { trackUxEvent("task_retried"); setReload(n => n + 1); }}>Try again</button></p>}

        {hasGet && (
          <section className="bp-part bp-get" id="get" aria-labelledby="get-h">
            <h2 className="bp-h2" id="get-h">{num()}What you get</h2>
            {format && (
              <p className="bp-format" data-testid="format-note">
                <span className={`fmt fmt-${format}`}>{format === "image" ? "Image ad" : "Video ad"}</span>
                {twin && formatOf(twin) && formatOf(twin) !== format
                  ? <>Want {format === "image" ? "a video" : "an image ad"} in the same look? <Link to={pathOf(twin)} data-testid="twin-link">{twin.name}</Link></>
                  : <>{format === "image" ? "Makes one still image ad, not a video." : "Makes a video ad, not a still."}</>}
              </p>
            )}
            {renders && <MakeNote kind={renders} />}
            {sample && (
              <div className="bp-sample" data-testid="output-sample">
                <h3 className="bp-h3">What goes in</h3>
                <ul className="bp-getlist">{sample.input.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul>
                {sample.prerequisites.length > 0 && <><h4 className="bp-sample-h">Before you start</h4><ul className="bp-getlist">{sample.prerequisites.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul></>}
                <h3 className="bp-h3">What comes out</h3>
                <ul className="bp-sample-out" data-testid="you-get">
                  {(showAllSample ? sample.output : sample.output.slice(0, 6)).map((o, i) => <li key={i}><b className={/^[\w\-./]+\.\w{2,5}$/.test(o.name.trim()) ? "mono" : undefined}>{o.name}</b><span>{txt(o.contains)}</span></li>)}
                </ul>
                {sample.output.length > 6 && <button className="link-btn" onClick={() => setShowAllSample(v => !v)} aria-expanded={showAllSample} data-testid="sample-toggle">{showAllSample ? "Show fewer" : `Show all ${sample.output.length}`}</button>}
              </div>
            )}
            {shape && (sample ? (
              <details className="bp-layout">
                <summary>See the full layout</summary>
                <p className="bp-note">Every run hands it back in this order. Your details fill each &lt;gap&gt;.</p>
                <div data-testid="what-you-get"><Code name="what-you-get.txt" text={shape} toast={toast} /></div>
              </details>
            ) : (
              <>
                <p className="bp-note">Every run hands it back in this order. Your details fill each &lt;gap&gt;.</p>
                <div data-testid="what-you-get"><Code name="what-you-get.txt" text={shape} toast={toast} /></div>
              </>
            ))}
            {exampleOut && (
              <details className="task-output-example" data-testid="task-example" open onToggle={e => { if (e.currentTarget.open) trackUxEvent("request_previewed"); }}>
                <summary>Example result</summary><pre>{exampleOut}</pre><p className="small">This is an example, not work made from your details.</p>
              </details>
            )}
            {getList.length > 0 && <ul className="bp-getlist" data-testid="you-get">{getList.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul>}
            {!sample && hireJobs.length > 0 && <><p className="bp-note">What you can hire {mindName} for.</p><ul className="bp-getlist" data-testid="mind-gets">{hireJobs.map((x, i) => <li key={i}>{x.title}</li>)}</ul></>}
            <Look b={b} kind={renders} />
            {hasFit && (
              <div className="bp-fit" data-testid="is-it-for-you">
                <h3 className="bp-h3">Is it for you?</h3>
                <div className="bp-fit-cols">
                  {useWhen.length > 0 && <div><h4>Use it when</h4><ul>{useWhen.map((w, i) => <li key={i}>{txt(w)}</li>)}</ul></div>}
                  {skipWhen.length > 0 && <div><h4>Skip it when</h4><ul>{skipWhen.map((w, i) => <li key={i}>{txt(w)}</li>)}</ul></div>}
                </div>
              </div>
            )}
          </section>
        )}

        {hasFill && (
          <section className="bp-part task-start" id="task-start" data-testid="task-start" aria-labelledby="fill-h">
            <h2 className="bp-h2" id="fill-h">{num()}Fill it in</h2>
            <p className="bp-note">{textTask ? "Add what this task works from, then copy the request. Your details are optional but make the result yours." : bring.length > 0 ? "Gather these first. You add them in your AI after you download." : "Add these for a better result."}</p>
            {bring.length > 0 && !textTask && <div><b>What to bring</b><ul className="task-materials">{bring.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul></div>}
            {textTask && <Composer key={`composer-${b.slug}`} slug={b.slug} task={b} skill={skill} give={required.length ? give.filter(x => !/\boptional\b/i.test(txt(x))) : []} toast={toast} example={p?.example?.input || starter?.example} exampleLabel={!p?.example?.input ? starter?.exampleLabel : undefined} onTransfer={() => setTransferred(true)} />}
            {hasCopyable && <CopyableTask key={`copyable-${b.slug}`} c={c} b={b} recipe={p!.copyable!} skill={skill} toast={toast} />}
            {(betterWith.length > 0 || betterTools.length > 0) && (
              <p className="small task-better" data-testid="better-with"><b>Better with: </b>
                {[...betterWith.map(i => i.maker ? <Link key={i.key} to={local(i.maker.url)}>{i.label}</Link> : <span key={i.key}>{i.label}</span>), ...betterTools.map(t => <span key={t.name} title={t.why}>{t.name}</span>)]
                  .flatMap((el, i) => i ? [", ", el] : [el])}.
              </p>
            )}
            {!textTask && <BusinessNote />}
          </section>
        )}

        <section className="bp-part task-primary" id="run" data-testid="task-primary" aria-labelledby="run-h">
          <h2 className="bp-h2" id="run-h">{num()}Run it</h2>
          <p className="bp-note">{isFlow ? "Download the complete files and open them in your AI. Copy gives you the main instructions." : `Add the ${noun} to your AI to reuse it. Pasting it into a chat works too.`}{b.hasFiles && !isFlow && " Use the download to include supporting files."} <Link to="/how-it-works#use-in-ai">How to use</Link></p>
          <div className="task-primary-actions">
            {(kind.id === "skill" || kind.id === "workflow") && <StarButton target={`catalogue:${b.slug}`} title={b.name} />}
            <button className="btn btn-primary" disabled={!skill} onClick={() => void copySkill()} data-testid="copy-skill">Copy {noun}</button>
            <button className="btn btn-line" disabled={!skill || downloading} onClick={() => void downloadTask()} data-testid="download-task">{downloading ? "Preparing download…" : `Download ${noun}`}</button>
            {isFlow && <button className="btn btn-line" onClick={() => toBuilder(keepCoordinator ? [b.slug] : b.steps.map(s => s.uses), b.name)} data-testid="view-in-builder">View in builder</button>}
          </div>
          {downloadError && <p role="alert">{downloadError} <button className="link-btn" onClick={() => void downloadTask()}>Try again</button></p>}
          {copyFailed && <div className="task-copy-fallback"><p role="alert">Copy did not work. Select and copy the instructions below.</p><textarea aria-label="Copy instructions manually" readOnly value={skill ? withBusiness(skill, getBusiness(), [b]) : ""} rows={6} onFocus={e => e.currentTarget.select()} /></div>}
          {isFlow ? <PullFromAi slug={b.slug} plan={!isAgent} toast={toast} /> : <RunInAi noun={noun} hasFiles={!!b.hasFiles} slug={b.slug} toast={toast} />}
          <div className="task-start-extras">
            <details className="task-action-help" data-testid="task-action-help"><summary>Where will I get the result?</summary><p>{textTask ? "Copy the request puts the instructions and your details on your clipboard. Paste the complete request into a new AI chat and send it." : "Download the complete files, unzip them and give them to your AI. Keep the instructions and supporting files together. Copying instructions alone leaves out the files."}</p><p>Your AI makes the result in your chat or workspace. Add any material it asks for, then check the result before using it.</p><a href="/how-it-works#use-in-ai" target="_blank" rel="noopener noreferrer">Read the steps in a new tab</a></details>
            {isMind && has(p?.seats) && <div className="bp-actions"><button className="btn btn-line" data-testid="start-council" onClick={() => {
              const with_ = [b.slug, ...(p!.pairs ?? []).filter((s) => c.bySlug[s]).slice(0, 2)];
              toBuilder([...with_, ...(c.bySlug["advisory-council"] ? ["advisory-council"] : [])], `Council: ${with_.map((s) => c.bySlug[s].name.split(" (")[0]).join(", ")}`);
            }}>Start a council with {mindName}</button><Link to="/minds" className="btn btn-ghost">Pick other minds</Link></div>}
            <details className="task-more" data-testid="task-more"><summary>More ways to use this</summary><div className="bp-actions">
              {isFlow ? <button className="btn btn-ghost" onClick={() => toBuilder(keepCoordinator ? [b.slug] : b.steps.map(s => s.uses), b.name)}>Edit the steps</button> : <>
                <button className="btn btn-ghost" onClick={() => setAdding(true)} data-testid="add-to-workflow">Use in a multi-step task</button>
              </>}
              <KitMenu slug={b.slug} onChange={toast} />
              <button className="link-btn" onClick={() => openTailor(b.name)}>Get help adapting this task</button>
            </div>{!hasFill && <BusinessNote />}{isFlow && <ExecutionPrompt name={b.name} />}</details>
          </div>
          {transferred && isFlow && <TransferGuide zip={zipName(b.name)} name={b.name} />}
          {transferred && <div className="task-result-check" data-testid="task-result-check"><h3>Check the result in your AI</h3>{usefulChecks.length ? <ul>{usefulChecks.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul> : <p>Check that it uses your facts and gives you the result you asked for. Ask your AI to fix anything missing.</p>}<button className="btn btn-ghost btn-sm" onClick={() => { if (!useful) trackUxEvent("result_useful"); setUseful(true); }} data-testid="task-useful">{useful ? "Thanks for letting us know" : "I got a useful result"}</button><p className="small">Optional feedback. This site cannot check work done in another AI.</p>{useful && <div className="task-next-win"><p>Want to do this again?</p><KitMenu slug={b.slug} onChange={toast} /></div>}</div>}
        </section>

        {!isFlow && !isMind && p?.plan ? <SkillNeighbours block={b} plan={p.plan} c={c} onAdd={slugs => toBuilder(slugs)} /> : has(p?.plan?.next) && (
          <section className="bp-next" id="next" aria-labelledby="next-h">
            <h2 className="bp-h2" id="next-h">What to do next</h2>
            <p className="bp-note">When it's done, the skill asks what you want to do next and offers these. You can also ask for something else.</p>
            <Next plan={p!.plan!} />
          </section>
        )}

        <FactCheckNotes checks={p?.fact_checks} />

        <DetailsPanel watch={p}>
          <nav className="bp-jump" aria-label="In the details">
            {jump.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
            <a href="#comments" data-testid="toc-comments">Questions and comments</a>
          </nav>

          {(showExplanation || showWhenDetail || (!isFlow && has(p?.how_it_works))) && (
            <DetailSection id="what" title={isMind ? "Who they are" : "What it does"}>
              {showExplanation && <div className="prose big" dangerouslySetInnerHTML={{ __html: p!.html.explain }} />}
              {showWhenDetail && (
                <div className="when-box">
                  <h4>Reach for it when</h4>
                  <ul>{p!.when.map((w, i) => <li key={i}>{txt(w)}</li>)}</ul>
                </div>
              )}
              {!isFlow && has(p?.how_it_works) && (
                <>
                  <h4 className="sub-h">Step by step, here's what your AI does</h4>
                  <ol className="how-list">{p!.how_it_works.map((s, i) => <li key={i}><span className="n">{String(i + 1).padStart(2, "0")}</span><div><b>{s.title}</b><p>{s.text}</p></div></li>)}</ol>
                </>
              )}
            </DetailSection>
          )}

          {has(p?.hire?.jobs) && (
            <DetailSection id="hire" title={`Hire ${mindName}`} lead={`Bring a real problem from your business, your work or your life. This is how ${mindName} would take it on.`}>
              <ul className="ideas" data-testid="mind-hire">{p!.hire!.jobs.map((x, i) => <li key={i}><b>{x.title}</b>{x.text && <p>{x.text}</p>}</li>)}</ul>
              {has(p!.hire!.steps) && (
                <>
                  <h4 className="sub-h">How they'd take on your problem</h4>
                  <ol className="how-list">{p!.hire!.steps.map((s, i) => <li key={i}><span className="n">{String(i + 1).padStart(2, "0")}</span><div><b>{s.title}</b><p>{s.text}</p></div></li>)}</ol>
                </>
              )}
              {has(p!.hire!.questions) && (
                <>
                  <h4 className="sub-h">First questions they'd ask you</h4>
                  <ul className="ideas">{p!.hire!.questions.map((q, i) => <li key={i}><p>{q}</p></li>)}</ul>
                </>
              )}
            </DetailSection>
          )}

          {isMind && (
            <DetailSection id="skills" title={`Skills from ${mindName}'s work`} lead={`Each skill does one job, and you can use it alone. Pick the ones you want and download them with ${mindName} as one pack, so each job is done the way ${mindName} would do it.`}>
              <MindSkills c={c} mind={b} toast={toast} />
            </DetailSection>
          )}

          {isMind && inFlows.length > 0 && (
            <DetailSection id="flows" title="Workflows from their work" lead="Whole jobs built from their method. Each runs several skills in order, and each skill's result feeds the next.">
              <WorkflowList c={c} flows={inFlows} testid="in-workflows" />
            </DetailSection>
          )}

          {has(p?.ideas) && (
            <DetailSection id="ideas" title="Their big ideas" lead={`What it draws on when it answers. Each comes from ${mindName}'s own work, with sources at the end of the skill file.`}>
              <ul className="ideas" data-testid="mind-ideas">{p!.ideas!.map((x, i) => <li key={i}><b>{x.title}</b>{x.text && <p>{x.text}</p>}</li>)}</ul>
            </DetailSection>
          )}

          {has(p?.seats) && (
            <DetailSection id="seats" title="On a council" lead="Put them on an advisory council with other minds, and they argue your decision. These are the seats we suggest. You can give them any role.">
              <ul className="seats">{p!.seats!.map((s, i) => <li key={i}><b>{s.seat}</b><span>Always asks: “{s.asks}”</span></li>)}</ul>
            </DetailSection>
          )}

          {(give.length > 0 || get.length > 0) && (
            <DetailSection id="io" title="What you give it, what you get">
              <div className="give-get">
                {give.length > 0 && <div><h4>You give it</h4><ul>{give.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul></div>}
                {get.length > 0 && <div><h4>You get</h4><ul>{get.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul></div>}
              </div>
            </DetailSection>
          )}

          {p?.plan && (has(p.plan.needed) || has(p.plan.helps)) && (
            <DetailSection id="before" title="Before you start" lead="Check what is required for this task. Extra material can help when it is relevant.">
              <Before plan={p.plan} />
            </DetailSection>
          )}

          {isFlow && (
            <DetailSection id="steps" title={isAgent ? "What it runs" : "The steps"} lead={isAgent ? "It chooses the skills needed for your goal and current state. The agent file sets the conditions, checks and action limits." : "Each step is a skill. It saves its result, and the next step picks it up."}>
              <ol className="flow-steps">
                {b.steps.map((s, i) => {
                  const sb = c.bySlug[s.uses];
                  const how = p?.how_it_works?.[i];
                  return (
                    <li key={i}>
                      <span className="n">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <b>{how?.title ?? sb?.name ?? s.uses}</b>
                        <p>{how?.text ?? (p?.stepNotes?.[i] || s.note)}</p>
                        {sb && <Link to={pathOf(sb)} className="step-link">{sb.name} <ArrowIcon size={12} /></Link>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </DetailSection>
          )}

          {(!isFlow || isAgent) && (
            <DetailSection id="install" title={isFlow ? "Get the complete pack" : "Other ways to add it to your AI"} lead={isFlow ? undefined : "Download the files and follow the steps for a chat, a coding assistant or a saved AI project."}>
              {isFlow ? <><p>The pack includes the complete selected skills, their supporting files and the execution rules. Give the whole folder to your AI and start with START_HERE.txt.</p><button className="btn btn-primary" onClick={handoff}>{isAgent ? "Get the complete agent pack" : "Download the workflow"}</button></> : <Install b={b} skill={skill} toast={toast} onPrepared={() => setTransferred(true)} />}
            </DetailSection>
          )}

          {has(b.minds) && (
            <DetailSection id="helped" title="Who can help with this" lead="This skill comes from these people's work. In the builder, put one on the step to have it done their way, or download them together from their page.">
              <HelpedBy c={c} b={b} />
            </DetailSection>
          )}

          {!isMind && inFlows.length > 0 && (
            <DetailSection id="flows" title="Part of these workflows" lead="This skill is a step in these workflows. Each one runs several skills in order, so the whole job gets done in one run.">
              <WorkflowList c={c} flows={inFlows} testid="in-workflows" />
            </DetailSection>
          )}

          {renders && (
            <DetailSection id="make" title={makeTitle(renders)} lead={renders === "image"
              ? "Claude writes the prompt but can't draw it. Finish it in a tool you already have."
              : "Claude writes the prompts but can't make video. Finish it in a tool you already have."}>
              <MakeIt kind={renders} />
            </DetailSection>
          )}

          {has(p?.how_to_use) && (
            <DetailSection id="use" title="How to use it">
              <ol className="num-list">{p!.how_to_use.map((s, i) => <li key={i}><span className="n">{i + 1}</span><span>{txt(s)}</span></li>)}</ol>
              {textTask && <a href="#task-start">Add your details above</a>}
            </DetailSection>
          )}

          {has(p?.tweaks) && (
            <DetailSection id="most" title="What changes the result most" lead="Get these parts of your input right and every run gets better.">
              <dl className="tweaks">{p!.tweaks.map((t, i) => <div key={i}><dt>{t.what}</dt><dd>{t.how}</dd></div>)}</dl>
            </DetailSection>
          )}

          {(has(p?.judge) || has(p?.test)) && (
            <DetailSection id="test" title="Test it">
              {has(p?.judge) && (
                <>
                  <h4 className="sub-h">Is the output good? Check these first</h4>
                  <ul className="checks">{p!.judge.map((j, i) => <li key={i}>{txt(j)}</li>)}</ul>
                </>
              )}
              {has(p?.test) && (
                <>
                  <h4 className="sub-h">Try it on your own work before you rely on it</h4>
                  <ol className="num-list">{p!.test!.map((s, i) => <li key={i}><span className="n">{i + 1}</span><span>{txt(s)}</span></li>)}</ol>
                </>
              )}
            </DetailSection>
          )}

          {(has(p?.works_best_with?.tools) || has(p?.works_best_with?.inputs)) && (
            <DetailSection id="best" title="Works best with" lead="Check which tools and extra files suit this task.">
              {has(p!.works_best_with!.tools) && (
                <dl className="best-tools">{p!.works_best_with!.tools!.map((t, i) => <div key={i}><dt>{t.name}</dt><dd>{txt(t.why)}</dd></div>)}</dl>
              )}
              {has(p!.works_best_with!.inputs) && (
                <>
                  <h4 className="best-h3">Add these for a better result</h4>
                  <ul className="plain-list">{p!.works_best_with!.inputs!.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul>
                </>
              )}
            </DetailSection>
          )}

          {has(p?.improve) && (
            <DetailSection id="improve" title="Make it fit your work" lead="The skill is a plain text file. Change it once and every run after that fits you better.">
              <ul className="plain-list">{p!.improve.map((j, i) => <li key={i}>{txt(j)}</li>)}</ul>
            </DetailSection>
          )}

          {has(p?.terms) && (
            <section className="bp-sec bp-detail terms" aria-label="Words on this page">
              <h3 className="bp-h3">Words on this page</h3>
              <dl>{p!.terms.map((t, i) => <div key={i}><dt>{t.term}</dt><dd>{t.meaning}</dd></div>)}</dl>
            </section>
          )}

          {b.origin === "imported" && b.source && (
            <DetailSection id="source" title="Where it came from">
              <Credit b={b} source={{ ...b.source, ...p?.source }} />
            </DetailSection>
          )}

          {has(p?.credits) && (
            <section className="bp-sec bp-detail terms credits" aria-label="Built with ideas from">
              <h3 className="bp-h3">Built with ideas from</h3>
              <ul className="plain-list">{p!.credits!.map((c, i) => <li key={i}>{c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.title}</a> : c.title}{c.by && <>, {c.by}</>}{c.used && <><br /><span className="small">{c.used}</span></>}</li>)}</ul>
            </section>
          )}

          {b.thinking && (
            <DetailSection id="thinking" title="How much thinking it needs">
              <Gauge level={b.thinking} why={p?.thinkingWhy ?? b.thinkingWhy ?? ""} />
            </DetailSection>
          )}

          <DetailSection id="file" title={isAgent ? "The agent file" : isFlow ? "The workflow file" : "The skill file"} lead={`This is what your AI follows. It's saved as ${b.slug}/SKILL.md, the name Claude, Claude Code and our workflows call it by.`}>
            <details className="skill-file" open={!p}>
              <summary>Read the full {isAgent ? "agent" : isFlow ? "workflow" : "skill"}</summary>
              {p ? <div className="prose" dangerouslySetInnerHTML={{ __html: normalizeSkillHtml(p.html.skill, b.slug, p.files ?? []) }} /> : skill ? <pre className="prose">{skill}</pre> : <p className="small">Loading…</p>}
            </details>
          </DetailSection>
        </DetailsPanel>
      </div>
    </Root>
  );
}
