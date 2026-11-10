// The Tools pages: a list of the free mini tools (/tools), and one page per tool (/tools/<slug>).
// Every answer comes from the tool's formula file through the shared engine, as you type. The numbers you change are
// kept in this browser, or in the signed-in account library (lib/saved-work.ts). Loaded on demand, so the home page never waits for it.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./tools.css";
import { readToolInputs, saveToolInputs } from "../lib/saved-work";
import { changedFields } from "../lib/saved-work-data";
import BrowserTool from "./BrowserTool";
import { BROWSER_TOOLS } from "./browser-tools.mjs";
import { ArrowIcon, SearchIcon } from "../ui";
import { Link, setSearch, useLocation } from "../lib/router";
import { monthOf } from "../lib/data";
// Names and addresses of the suggested next items, resolved when the site is built (scripts/vite-site-data.mjs),
// so a calculator never downloads the full catalogue.
import NEXT_STEPS from "virtual:tool-next-steps";
import { E, EXAMPLES, SITE, TOOLS, filesOf, saveSteps, type Input, type Line, type Tool } from "./registry";
import { STARTER_TOOLS, searchTools } from "./tool-search";

const TITLE = "Free AI Skills & Custom Workflow Builder | AI Blocks";
const store = {
  get<T>(key: string, fallback: T): T { try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; } },
  set(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode: still works for this visit */ } },
};
/** How many tool cards the /tools list draws at first, and how many more each "Show more" adds. */
const TOOLS_PAGE = 24;
const asText =(d: Record<string, number>) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v)]));
const unitMark = (u: string, sym: string) => (u === "money" || u === "smallmoney" ? sym : u === "percent" ? "%" : u === "x" ? "x" : "");

async function copy(text: string, toast: (m: string) => void, what: string) {
  try { await navigator.clipboard.writeText(text); toast(`Copied the ${what}`); }
  catch { toast(`The ${what} could not be copied. Select it and copy manually, or use the download.`); }
}
function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CopyBox({ name, text, toast, testId }: { name: string; text: string; toast: (m: string) => void; testId?: string }) {
  return (
    <figure className="code mt-code">
      <figcaption><span className="code-name">{name}</span><button className="code-copy" onClick={() => copy(text, toast, name)} data-testid={testId}>Copy</button></figcaption>
      <pre>{text}</pre>
    </figure>
  );
}

function Field({ i, raw, error, sym, onChange }: { i: Input; raw: string; error?: string; sym: string; onChange: (v: string) => void }) {
  const mark = unitMark(i.unit, sym);
  const before = i.unit === "money" || i.unit === "smallmoney";
  // Where to find the number: a small (?) button by the label shows it, so the hint doesn't repeat under every field.
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-field">
      <div className="mt-label-row">
        <label className="mt-label" htmlFor={`in-${i.id}`}>{i.label}</label>
        <button type="button" className="mt-q" aria-expanded={open} aria-controls={`where-${i.id}`} aria-label={`Where to find: ${i.label}`} title="Where to find this number" onClick={() => setOpen((o) => !o)} onKeyDown={(e) => { if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); } }} data-testid={`where-btn-${i.id}`}><span aria-hidden="true">?</span></button>
      </div>
      <div className="mt-where" id={`where-${i.id}`} hidden={!open} data-testid={`where-${i.id}`}>
        <p>{i.where}</p>
        {i.tools.length > 0 && <p className="mt-held">Held in: {i.tools.join(", ")}</p>}
      </div>
      <div className={`mt-box${error ? " bad" : ""}`}>
        {before && <span className="mt-unit">{mark}</span>}
        <input id={`in-${i.id}`} inputMode="decimal" autoComplete="off" value={raw} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={`help-${i.id}`} data-testid={`input-${i.id}`} />
        {!before && mark && <span className="mt-unit">{mark}</span>}
      </div>
      <p className="mt-help" id={`help-${i.id}`}>{i.help}</p>
      {error && <p className="mt-err" role="alert">{error}</p>}
    </div>
  );
}

function Working({ lines }: { lines: Line[] }) {
  return (
    <ol className="mt-working" data-testid="working">
      {lines.map((l) => (
        <li key={l.id} data-line={l.id}>
          <div className="mt-row"><span>{l.label}</span><b data-testid={`value-${l.id}`}>{l.shown}</b></div>
          {l.sum && <code>{l.sum}</code>}
          {l.means && <p>{l.means}</p>}
        </li>
      ))}
    </ol>
  );
}

/** Answers that come as a table, like cost per run and per month on each model. */
function Grid({ tool, lines }: { tool: Tool; lines: Line[] }) {
  const rows: Record<string, Record<string, string>> = {};
  const cols: string[] = [];
  for (const l of lines) {
    const o = tool.outputs.find((x) => x.id === l.id)!;
    (rows[o.row!] ??= {})[o.col!] = l.shown;
    if (!cols.includes(o.col!)) cols.push(o.col!);
  }
  return (
    <div className="mt-table-wrap">
      <table className="mt-table" data-testid="model-table">
        <thead><tr><th>{lines[0].group}</th>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{Object.entries(rows).map(([r, cells]) => <tr key={r}><td>{r}</td>{cols.map((c) => <td key={c}>{cells[c]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Way({ n, title, children, testId }: { n: number; title: string; children: ReactNode; testId: string }) {
  return (
    <section className="mt-way" data-testid={testId}>
      <h3><span className="n">{n}</span>{title}</h3>
      {children}
    </section>
  );
}

function ToolPage({ tool, toast }: { tool: Tool; toast: (m: string) => void }) {
  // Your numbers come back next time: from your account when signed in, otherwise from this browser.
  const saved = readToolInputs(tool.slug);
  const [preset, setPreset] = useState(() => (tool.presets.some((p) => p.id === saved.preset) ? saved.preset! : tool.presets[0].id));
  const [raw, setRaw] = useState<Record<string, string>>(() => saved.raw && saved.preset === preset ? { ...asText(E.defaults(tool, preset)), ...saved.raw } : asText(E.defaults(tool, preset)));
  const [symSaved, setSym] = useState(() => store.get("abb:currency", "$"));
  const sym = tool.fixedCurrency ?? symSaved;
  const [prompt, setPrompt] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  // On a phone the answer sits below the fields, so a bar at the bottom shows it while you type.
  const answerRef = useRef<HTMLDivElement>(null);
  const [answerSeen, setAnswerSeen] = useState(true);
  useEffect(() => {
    const el = answerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAnswerSeen(e.isIntersecting || e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => { document.title = `${tool.name} · AI Blocks`; return () => { document.title = TITLE; }; }, [tool]);
  useEffect(() => { const fields = changedFields(raw, asText(E.defaults(tool, preset))); saveToolInputs(tool.slug, { preset, raw: fields, name: tool.name }, preset !== tool.presets[0].id || Object.keys(fields).length > 0); }, [tool, preset, raw]);
  useEffect(() => { fetch(`${filesOf(tool.slug)}/prompt.txt`).then((r) => (r.ok ? r.text() : null)).then((t) => setPrompt(t && !t.trimStart().startsWith("<!doctype") ? t : null)).catch(() => setPrompt(null)); }, [tool]);

  const pick = (id: string) => { setPreset(id); setRaw(asText(E.defaults(tool, id))); };
  const reset = () => setRaw(asText(E.defaults(tool, preset)));
  const { values, errors } = E.readInputs(tool, raw, preset);
  const ok = Object.keys(errors).length === 0;
  const env = useMemo(() => (ok ? E.compute(tool, values) : null), [ok, tool, JSON.stringify(values)]); // eslint-disable-line react-hooks/exhaustive-deps
  const lines = env ? E.workingLines(tool, env, preset, sym) : [];
  const answer = env ? E.answerLines(tool, env, preset, sym) : ["Fix the numbers marked in red to see the answer."];
  const gridLines = lines.filter((l) => tool.outputs.find((o) => o.id === l.id)?.row);
  const plain = lines.filter((l) => !gridLines.includes(l));
  const compare = ok ? E.compareRows(tool, values, preset, sym) : null;
  const next = env ? E.nextSteps(tool, env) : [];
  const isExample = JSON.stringify(raw) === JSON.stringify(asText(E.defaults(tool, preset)));
  const visible = E.visibleInputs(tool, preset);
  const sections = tool.sections ?? [{ id: "numbers", label: "Your numbers" }];
  const examples = EXAMPLES[tool.slug] ?? [];
  const files = filesOf(tool.slug);
  const best = E.worksBestWith(tool);

  const xlsx = async () => {
    const [{ buildXlsx }, fflate] = await Promise.all([import("../../../mini-tools/xlsx.mjs"), import("fflate")]);
    const bytes = (buildXlsx as (t: Tool, o: object, z: object) => Uint8Array)(tool, { values: ok ? values : E.defaults(tool, preset), preset, sym, site: SITE }, fflate);
    save(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${tool.slug}.xlsx`);
    toast("Spreadsheet downloaded");
  };
  const embed = `<iframe src="${SITE}${files}/embed.html" title="${tool.name}" width="100%" height="760" style="border:0;max-width:100%" loading="lazy"></iframe>\n<p style="font-size:13px"><a href="${SITE}/tools/${tool.slug}">${tool.name}</a>, a free mini tool from AI Blocks</p>`;

  return (
    <main className="bp mt" data-testid="tool-page">
      <header className="wrap bp-hero">
        <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">›</span><Link to="/tools">Tools</Link><span aria-hidden="true">›</span><span aria-current="page">{tool.short}</span></nav><p className="bp-kicker">Free. No sign-up. Your numbers stay in this browser, or in your account when you sign in.</p>
        <h1 className="bp-h1">{tool.headline}</h1>
        <p className="bp-sub">{tool.summary}</p>
      </header>

      <div className="wrap mt-calc">
        <div className="mt-form" data-testid="tool-form">
          {tool.presets.length > 1 && (
            <div className="seg mt-seg" role="group" aria-label="Your business">
              {tool.presets.map((p) => <button key={p.id} aria-pressed={p.id === preset} onClick={() => pick(p.id)} data-testid={`preset-${p.id}`}>{p.label}</button>)}
            </div>
          )}
          <p className="mt-example" data-testid="example-note">
            {isExample ? "These are example numbers, not from any real business. Type your own." : <>Your numbers. <button className="link-btn" onClick={reset}>Put the examples back</button></>}
          </p>
          {!tool.fixedCurrency && (
            <label className="mt-cur"><span>Currency sign</span><input value={symSaved} maxLength={4} onChange={(e) => { setSym(e.target.value); store.set("abb:currency", e.target.value); }} data-testid="currency" /></label>
          )}
          {sections.map((s) => {
            const list = visible.filter((i) => (i.section ?? "numbers") === s.id);
            if (!list.length) return null;
            const body = list.map((i) => <Field key={i.id} i={i} raw={raw[i.id] ?? ""} error={errors[i.id]} sym={sym} onChange={(v) => setRaw((r) => ({ ...r, [i.id]: v }))} />);
            return s.closed ? (
              <details className="mt-sec" key={s.id}><summary>{s.label}</summary>{body}</details>
            ) : (
              <fieldset className="mt-sec" key={s.id}><legend>{s.label}</legend>{body}</fieldset>
            );
          })}
        </div>

        <div className="mt-result" aria-live="polite">
          <div className="mt-answer" data-testid="answer" ref={answerRef}>{answer.map((t) => <p key={t}>{t}</p>)}</div>
          {env && (
            <>
              {compare && (
                <div className="mt-table-wrap">
                  <table className="mt-table" data-testid="compare">
                    <thead><tr><th>{compare.label}</th>{compare.heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{compare.rows.map((r) => <tr key={r.id}><td>{r.label}</td>{r.cells.map((x, k) => <td key={k}>{x}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
              {gridLines.length > 0 && <Grid tool={tool} lines={gridLines} />}
              <h2 className="mt-h">The working, line by line</h2>
              <Working lines={plain} />
              {next.length > 0 && (
                <div className="mt-next" data-testid="next-step">
                  <h2 className="mt-h">Next step</h2>
                  {next.map((n) => {
                    const b = NEXT_STEPS[n.slug];
                    return <p key={n.slug}>{n.why} {b ? <Link to={b.path}>{b.name} <ArrowIcon size={12} /></Link> : null}</p>;
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {!answerSeen && <div className="mt-peek" aria-hidden="true" data-testid="answer-peek">{answer[0]}</div>}

      <div className="wrap mt-more">
        <section className="bp-sec" aria-labelledby="best-h">
          <h2 className="bp-h2" id="best-h">Works best with your real numbers</h2>
          <p className="bp-note">The answer is only as good as what you type. Each number lives somewhere you already have.</p>
          <div className="mt-best" data-testid="works-best-with">
            {best.map((b) => <div key={b.name}><b>{b.name}</b><span>{b.for.slice(0, 3).join(", ")}{b.for.length > 3 ? ` and ${b.for.length - 3} more` : ""}</span></div>)}
          </div>
        </section>

        <section className="bp-sec wide" aria-labelledby="ways-h" id="ways">
          <h2 className="bp-h2" id="ways-h">Use it five ways</h2>
          <p className="bp-note">The same formulas every way, checked against the same worked examples. If one gave a different answer, it wouldn't be here.</p>
          <div className="mt-ways">
            <Way n={1} title="On this page" testId="way-site"><p>Type your numbers above. The answer and each line of the working change as you type.</p></Way>
            <Way n={2} title="Download it" testId="way-download">
              <p>One file that opens in any browser and works offline. Your numbers stay on your computer.</p>
              <a className="btn btn-primary btn-sm" href={`${files}/${tool.slug}.html`} download={`${tool.slug}.html`} data-testid="download-html">Download the calculator</a>
            </Way>
            <Way n={3} title="In a spreadsheet" testId="way-sheet">
              <p>An Excel file with your numbers in it. Every answer is a formula you can read and change.</p>
              <button className="btn btn-primary btn-sm" onClick={xlsx} data-testid="download-xlsx">Download the spreadsheet</button>
              <p className="mt-small">Google Sheets: File &gt; Import &gt; Upload, then pick the file.</p>
            </Way>
            <Way n={4} title="In your AI" testId="way-ai">
              <p>A skill and a prompt for an AI tool that can run code. It asks for your numbers, runs the sums and shows each line.</p>
              <div className="mt-btns">
                <a className="btn btn-primary btn-sm" href={`${files}/${tool.slug}-skill.zip`} download data-testid="download-skill">Download the skill</a>
                <button className="btn btn-dark btn-sm" disabled={!prompt} onClick={() => prompt && copy(prompt, toast, "prompt")} data-testid="copy-prompt">Copy the prompt</button>
              </div>
              <details className="mt-save" data-testid="save-steps">
                <summary>Keep it in your AI as a skill, Project, custom GPT or Gem</summary>
                {saveSteps(tool).map((s) => (
                  <div key={s.ai}><h4>{s.ai}</h4><ol>{s.steps.map((x) => <li key={x}>{x}</li>)}</ol></div>
                ))}
              </details>
            </Way>
            <Way n={5} title="On your own site" testId="way-embed">
              <p>Paste this into your website or Notion page. It shows the calculator, with a credit link back here.</p>
              <CopyBox name="embed code" text={embed} toast={toast} testId="copy-embed" />
              <details className="mt-save" onToggle={(e) => setPreview((e.target as HTMLDetailsElement).open)}>
                <summary>See how it looks</summary>
                {preview && <iframe className="mt-preview" src={`${files}/embed.html`} title={`${tool.name}, embedded`} loading="lazy" />}
              </details>
            </Way>
          </div>
        </section>

        <section className="bp-sec" aria-labelledby="how-h">
          <h2 className="bp-h2" id="how-h">How it works it out</h2>
          <dl className="mt-sources">{tool.sources.map((s) => <div key={s.what}><dt>{s.what}</dt><dd>{s.how}</dd></div>)}</dl>
          {tool.notes && tool.notes.length > 0 && (<><h3 className="sub-h">What it assumes</h3><ul className="mt-notes">{tool.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
          <h3 className="sub-h">Checked by hand</h3>
          <p className="bp-note" data-testid="examples">{examples.length} worked examples, including the edge cases: {examples.map((x) => x.name.charAt(0).toLowerCase() + x.name.slice(1)).join("; ")}.</p>
          <p className="mt-small">Version {tool.version}.{tool.checked ? ` Prices checked ${monthOf(tool.checked)}.` : ""} Nothing here promises a result: these are sums on the numbers you type.</p>
        </section>
      </div>
    </main>
  );
}

function ToolsIndex() {
  const { search } = useLocation();
  const [q, setQ] = useState(() => search.get("q") ?? "");
  const categories = [
    { id: "", name: "All tools" }, { id: "personal", name: "Everyday life" },
    { id: "growth", name: "Growth" },
    { id: "design", name: "Design" }, { id: "hr", name: "HR and hiring" },
    { id: "work", name: "Productivity and AI" }, { id: "finance", name: "Finance" }, { id: "pricing", name: "Business pricing" },
    { id: "operations", name: "Operations" }, { id: "compliance", name: "Compliance planning" },
    { id: "ads", name: "Marketing" }, { id: "customers", name: "Customers" },
  ];
  const [category, setCategory] = useState(() => categories.some(c => c.id === search.get("topic")) ? search.get("topic")! : "");
  useEffect(() => { setSearch({ q, topic: category }); }, [q, category]);
  const topics: Record<string, string[]> = {
    ads: ["creative-volume-planner", "page-test-calculator", "ad-budget-planner", "creator-deal-calculator", "ad-test-size", "launch-revenue-planner", "content-cost-per-piece", "agency-or-in-house"],
    customers: ["repeat-customer-profit", "customer-payback", "email-list-value", "subscription-revenue-forecast", "subscriber-lifetime-value", "email-frequency-planner"],
    work: ["ai-run-cost", "hourly-rate", "meeting-cost", "ai-time-saved"],
    hr: ["hire-or-freelance", "new-hire-break-even", "hire-runway-cost"],
    operations: ["reorder-point", "stock-weeks-of-cover"],
  };
  const growth = { slug: "growth-channel-planner", short: "Growth channel planner", name: "Growth channel planner", headline: "Plan growth for any business", category: "growth", kind: "planner", summary: "Prepare a business brief, compare 19 channels and download a complete planning skill pack. No website required.", question: "Growth marketing customer acquisition planning for any business, local shop, nonprofit or ecommerce." };
  const all = [growth, ...BROWSER_TOOLS, ...TOOLS];
  const group = (t: typeof all[number]) => t.category || Object.keys(topics).find(key => topics[key].includes(t.slug)) || "pricing";
  const matches = searchTools(all, q, t => categories.find(c => c.id === group(t))?.name ?? "");
  const shown = matches.filter(t => !category || group(t) === category);
  // The search and topics cover every tool; only the cards drawn are limited, PAGE at a time, so a phone isn't miles long.
  const [limit, setLimit] = useState(TOOLS_PAGE);
  useEffect(() => { setLimit(TOOLS_PAGE); }, [q, category]);
  const gridRef = useRef<HTMLDivElement>(null);
  const focusAt = useRef<number | null>(null);
  useEffect(() => {
    if (focusAt.current === null) return;
    (gridRef.current?.children[focusAt.current] as HTMLElement | undefined)?.focus();
    focusAt.current = null;
  }, [limit]);
  const more = () => { focusAt.current = limit; setLimit(n => n + TOOLS_PAGE); };
  useEffect(() => { document.title = "Free everyday tools · AI Blocks"; return () => { document.title = TITLE; }; }, []);
  return <main className="bp mt" data-testid="tools-index">
    <header className="wrap bp-hero"><Link to="/" className="back"><span aria-hidden="true">←</span> Home</Link>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Tools</span></nav>
      <h1 className="bp-h1">Work out the numbers. Get the small jobs done.</h1>
      <p className="bp-sub">Tools for design, money, hiring, everyday work and life. Clean text, compare options, convert data or plan your budget. Your input stays in your browser.</p>
      <p className="bp-note tools-more" data-testid="tools-more">Choosing an AI product instead? <Link to="/ai-tools" data-testid="tools-ai-guides">Read the AI tool guides</Link>. Planning growth? <Link to="/tools/growth-channel-planner">Compare 19 growth channels</Link>. Need written work instead? <a href="/which-one" data-testid="tools-which-one">See skills, prompts and workflows</a>.</p>
    </header>
    <div className="wrap mt-index">
      <label className="search tools-search"><SearchIcon /><span className="visually-hidden">Find a tool</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search for a tool or a job to get done" data-testid="tools-search" /></label>
      <div className="tools-categories" role="group" aria-label="Tool topic">{categories.map(x => <button type="button" className="chip" key={x.id} aria-pressed={category === x.id} onClick={() => setCategory(x.id)}>{x.name} <span className="small">{matches.filter(t => !x.id || group(t) === x.id).length}</span></button>)}</div>
      <p className="result-line" role="status">{shown.length} tool{shown.length === 1 ? "" : "s"}{(q || category) && <button className="link-btn" onClick={() => { setQ(""); setCategory(""); }}>Clear filters</button>}</p>
      {!shown.length && <div className="empty"><p>No tools match this search. Try fewer words or clear the filters.</p><p>Or start with one of these: {STARTER_TOOLS.map(slug => all.find(t => t.slug === slug)).filter(t => t !== undefined).map((t, i) => <span key={t.slug}>{i ? ", " : ""}<Link to={`/tools/${t.slug}`} data-testid="tool-suggestion">{t.short}</Link></span>)}.</p></div>}
      <div className="grid" id="tool-results" ref={gridRef}>{shown.slice(0, limit).map(t => <Link className="card mt-card" key={t.slug} to={`/tools/${t.slug}`} data-testid="tool-card" data-slug={t.slug}>
        <span className="meta"><span className="type">{categories.find(c => c.id === group(t))?.name}</span></span>
        <span className="nm">{t.short}</span><span className="peek">{t.summary}</span><span className="view">Open {t.slug === growth.slug ? "planner" : "kind" in t ? "tool" : "calculator"} <ArrowIcon size={12} /></span>
      </Link>)}</div>
      {shown.length > limit && <div className="more mt-index-more"><p className="small">Showing {limit} of {shown.length} tools</p><button type="button" className="btn btn-dark" aria-controls="tool-results" onClick={more} data-testid="tools-show-more">Show {Math.min(TOOLS_PAGE, shown.length - limit)} more</button></div>}
      <p className="bp-note mt-index-note">Calculators include offline, spreadsheet, AI and embed versions. Browser tools export their result. The growth planner prepares a brief and skill pack.</p>
    </div>
  </main>;
}

export default function ToolsPage({ path, toast }: { path: string; toast: (m: string) => void }) {
  const slug = path.split("/").filter(Boolean)[1];
  if (!slug) return <ToolsIndex />;
  const browserTool = BROWSER_TOOLS.find(t => t.slug === slug);
  if (browserTool) return <BrowserTool key={slug} tool={browserTool} toast={toast} />;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) {
    return (
      <main className="wrap bp-missing" data-testid="tool-missing">
        <h1 className="bp-h1">That mini tool isn't here</h1>
        <p className="bp-sub">It may have a new name. All of them are on the Tools page.</p>
        <Link to="/tools" className="btn btn-primary">See all mini tools <ArrowIcon /></Link>
      </main>
    );
  }
  return <ToolPage key={tool.slug} tool={tool} toast={toast} />;
}
