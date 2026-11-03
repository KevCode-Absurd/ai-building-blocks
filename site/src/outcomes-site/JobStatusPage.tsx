// Where a job stands: the owner picks or drops their outcomes/<id>/ folder and sees it in plain words. Files are read in
// this browser with the orchestrator's own checks (checkEngagement); nothing is uploaded, stored or sent anywhere.
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Link } from "../lib/router";
import { download } from "../lib/download";
import { OUTCOME_PATHS, humanize, readEngagement, sampleEngagement, sampleFolder, type Item, type JobStatus } from "./owner-view";
import { OutcomeTabs } from "./OutcomeTabs";
import { STATUS } from "./outcome-copy";

const MAX_BYTES = 512_000; // an engagement is capped at 200 KB; anything far larger is not one
const MAX_ENTRIES = 5000;
const SKIP = new Set(["node_modules", ".git"]);
type Found = { path: string; text: string };
type Loaded = { path: string; result: ReturnType<typeof readEngagement> };

async function fromFiles(files: File[], anyName = false): Promise<Found[]> {
  const picked = files.filter(f => (anyName || f.name === "engagement.json") && f.size <= MAX_BYTES);
  return Promise.all(picked.map(async f => ({ path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name, text: await f.text() })));
}
async function fromDrop(data: DataTransfer): Promise<Found[]> {
  const entries = [...data.items].map(i => i.webkitGetAsEntry?.()).filter((e): e is FileSystemEntry => !!e);
  if (!entries.length) return fromFiles([...data.files], data.files.length === 1);
  if (entries.length === 1 && entries[0].isFile) return fromFiles([...data.files], true);
  const out: Found[] = [];
  let seen = 0;
  async function walk(entry: FileSystemEntry, depth: number): Promise<void> {
    if (++seen > MAX_ENTRIES || depth > 8 || SKIP.has(entry.name)) return;
    if (entry.isFile) {
      if (entry.name !== "engagement.json") return;
      const file = await new Promise<File>((resolve, reject) => (entry as FileSystemFileEntry).file(resolve, reject));
      if (file.size <= MAX_BYTES) out.push({ path: entry.fullPath.replace(/^\//, ""), text: await file.text() });
      return;
    }
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    for (;;) {
      const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
      if (!batch.length) break;
      for (const child of batch) await walk(child, depth + 1);
    }
  }
  for (const entry of entries) await walk(entry, 0);
  return out;
}

function Items({ items, empty }: { items: Item[]; empty?: string }) {
  if (!items.length) return empty ? <p className="small">{empty}</p> : null;
  return <ul className="gd-items">{items.map(i => <li key={i.title + i.detail}><b>{i.title}</b><span>{i.detail}</span></li>)}</ul>;
}

function Status({ s, sample }: { s: JobStatus; sample: boolean }) {
  const DATA: Record<string, string> = { MISSING: "missing", UNKNOWN: "not confirmed yet" };
  return (
    <article className="gd-result" aria-labelledby="job-h" data-testid="job-status">
      {sample && <p className="gd-note">This is the sample job, built from the worked example. Its finished stages are made up to show the page.</p>}
      <p className="small">{s.phaseLabel}{s.planName ? ` · ${s.planName}` : ""} · round {s.round}</p>
      <h2 className="bp-h2" id="job-h" tabIndex={-1} data-testid="job-headline">{s.headline}</h2>
      <blockquote className="gd-quote">{s.request}</blockquote>
      <p className="small">Job <code>{s.id}</code>, started {s.started}.</p>
      {s.total > 0 && <div className="gd-progress"><p data-testid="job-progress">{s.done} of {s.total} stages done</p><span className="gd-bar" aria-hidden="true"><span style={{ width: `${Math.round((s.done / s.total) * 100)}%` }} /></span></div>}

      <h3 className="gd-h3">Waiting on you</h3>
      <div data-testid="job-waiting"><Items items={s.waiting} empty="Nothing waits on you right now." /></div>
      {s.next.length > 0 && <><h3 className="gd-h3">Next up</h3><div data-testid="job-next"><Items items={s.next} /></div></>}
      {s.blocked.length > 0 && <><h3 className="gd-h3">Blocked</h3><Items items={s.blocked} /></>}
      {s.data.length > 0 && <><h3 className="gd-h3">Data your AI still needs</h3><ul className="gd-items">{s.data.map(d => <li key={d.name}><b>{d.name} ({DATA[d.status] ?? d.status.toLowerCase()})</b><span>{d.why}</span></li>)}</ul></>}

      {s.stages.length > 0 && <>
        <h3 className="gd-h3">Every stage</h3>
        <ol className="gd-status-list">{s.stages.map(st => (
          <li key={st.id} data-state={st.state}>
            <span className="gd-n" aria-hidden="true">{st.n}</span>
            <span className="gd-status-name"><b>{st.name}</b><span className="small">{st.kindLabel}{st.owner ? ` · ${humanize(st.owner)}` : ""}</span>{st.note && <span className="small">{st.note}</span>}</span>
            <span className={`gd-badge ${st.state.toLowerCase()}`}>{st.stateLabel}</span>
          </li>
        ))}</ol>
      </>}
      {s.worthKnowing.length > 0 && <><h3 className="gd-h3">Worth knowing</h3><ul className="gd-list">{s.worthKnowing.map(w => <li key={w}>{w}</li>)}</ul></>}
      {s.phase === "RUN" && <p className="small">Choices written down: {s.decisions}. Tests: {s.experiments.total}, {s.experiments.closed} closed.</p>}
    </article>
  );
}

export default function JobStatusPage({ path }: { path: string }) {
  const id = useId();
  const folder = useRef<HTMLInputElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState<Loaded[] | null>(null);
  const [pick, setPick] = useState(0);
  const [sample, setSample] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  // React leaves non-standard attributes alone only when set on the element itself.
  useEffect(() => { folder.current?.setAttribute("webkitdirectory", ""); folder.current?.setAttribute("directory", ""); }, []);
  useEffect(() => { if (loaded) document.getElementById("job-h")?.focus(); }, [loaded, pick]);

  function show(found: Found[], fromSample = false) {
    setSample(fromSample); setPick(0);
    if (!found.length) { setLoaded(null); setError("We couldn't find an engagement.json there. Pick the job's own folder: outcomes, then the folder named after the job."); return; }
    setError("");
    setLoaded(found.map(f => ({ path: f.path, result: readEngagement(f.text) })).sort((a, b) => a.path.localeCompare(b.path)));
  }
  async function read(work: Promise<Found[]>) {
    setBusy(true);
    try { show(await work); } catch { setLoaded(null); setError("That folder couldn't be read. Try choosing it with the button instead."); } finally { setBusy(false); }
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault(); setOver(false);
    if (event.dataTransfer) void read(fromDrop(event.dataTransfer));
  }
  async function downloadSample() {
    const { id: jobId, files } = await sampleFolder();
    const { strToU8, zipSync } = await import("fflate");
    const when = new Date(2026, 10, 5, 9, 0, 0);
    const zip = zipSync(Object.fromEntries(Object.entries(files).map(([name, text]) => [`outcomes/${jobId}/${name}`, [strToU8(text), { mtime: when }]])), { level: 6 });
    download(new Blob([zip], { type: "application/zip" }), "sample-outcome-folder.zip");
  }

  const current = loaded?.[pick];
  return (
    <>
      <header className="wrap bp-hero">
        <OutcomeTabs path={path} />
        <p className="bp-kicker"><span className="kind">Get it done</span>{STATUS.kicker}</p>
        <h1 className="bp-h1">{STATUS.h1}</h1>
        <p className="bp-sub">{STATUS.sub}</p>
      </header>
      <div className="wrap gd-body">
        <div className={`gd-drop${over ? " over" : ""}`} onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={drop} data-testid="job-drop">
          <p>{STATUS.folder}</p>
          <div className="bp-actions">
            <button type="button" className="btn btn-primary" onClick={() => folder.current?.click()} disabled={busy}>Choose the job folder</button>
            <button type="button" className="btn btn-dark" onClick={() => file.current?.click()} disabled={busy}>Choose engagement.json</button>
          </div>
          <input ref={folder} id={`${id}-folder`} type="file" multiple hidden tabIndex={-1} aria-hidden="true" data-testid="job-folder-input" onChange={e => { const f = [...(e.target.files ?? [])]; e.target.value = ""; void read(fromFiles(f)); }} />
          <input ref={file} id={`${id}-file`} type="file" accept=".json,application/json" hidden tabIndex={-1} aria-hidden="true" data-testid="job-file-input" onChange={e => { const f = [...(e.target.files ?? [])]; e.target.value = ""; void read(fromFiles(f, true)); }} />
          <p className="small"><b>{STATUS.privacy}</b></p>
          <p className="small">No job yet? <button type="button" className="gd-link" onClick={() => show([{ path: "sample/engagement.json", text: JSON.stringify(sampleEngagement()) }], true)} data-testid="job-sample">Try the sample job</button> or <button type="button" className="gd-link" onClick={() => void downloadSample()} data-testid="job-sample-download">download the sample folder</button> to try dropping it in. <Link to={OUTCOME_PATHS.start}>Start a job</Link> when you're ready.</p>
        </div>
        <div>
          {busy && <p className="small" role="status">Reading the folder…</p>}
          {error && <p className="gd-warn" role="alert" data-testid="job-error">{error}</p>}
          {loaded && loaded.length > 1 && <div className="gd-picker" role="group" aria-label="Jobs in this folder"><p className="small">This folder has {loaded.length} jobs. Pick one:</p>{loaded.map((l, n) => <button key={l.path} type="button" className="gd-chip" aria-pressed={n === pick} onClick={() => setPick(n)}>{l.result.ok ? l.result.status.request.slice(0, 80) : l.path}</button>)}</div>}
          {current && (current.result.ok ? <Status s={current.result.status} sample={sample} /> : <p className="gd-warn" role="alert" data-testid="job-error">{current.path}: {current.result.error}</p>)}
        </div>
      </div>
    </>
  );
}
