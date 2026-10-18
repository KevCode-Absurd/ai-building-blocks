import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowIcon, BlockCard, Drawer, Logo, SearchIcon, ThemeToggle, Toast } from "./ui";
import BlockDrawer from "./BlockDrawer";
import { type Block, type Catalogue, JOBS, ROLES, cap, useCatalogue } from "./lib/data";
import { kits, queueForCanvas, useStore } from "./lib/store";

const Builder = lazy(() => import("./Builder")); // the canvas library loads after the page is up

const NAV = [["how", "How it works"], ["library", "Library"], ["workflows", "Workflows"], ["build", "Builder"], ["testing", "Testing"]] as const;
// Blocks most people can use this week; shown first in the library.
const START_HERE = ["brand-knowledge-folder-from-website", "customer-language-to-angle-library", "ad-copy-brand-voice-check", "landing-page-copy-from-ad-and-facts", "video-ad-script-from-customer-research", "meta-ad-policy-check"];
const PAGE = 12;

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: "-25% 0px -65% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return active;
}

function Header({ onKits }: { onKits: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const kitCount = useStore((s) => s.kits.length);
  const active = useActiveSection();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-in">
        <a href="#top" className="brand" aria-label="AI Building Blocks, back to top"><Logo />AI Building Blocks</a>
        <nav className="nav" aria-label="Sections">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>{label}</a>)}
        </nav>
        <div className="header-end">
          <button className="btn btn-ghost btn-sm" onClick={onKits} data-testid="open-kits">Kits{kitCount > 0 && <span className="badge">{kitCount}</span>}</button>
          <ThemeToggle />
          <a href="#build" className="btn btn-primary btn-sm">Start building</a>
        </div>
      </div>
    </header>
  );
}

// The hero demo: a request on the left, the handoff running step by step on the right.
const DEMO = [
  ["brand-knowledge-folder-from-website", "brand brain"],
  ["customer-language-to-angle-library", "12 angles"],
  ["video-ad-script-from-customer-research", "script"],
  ["read-aloud-script-polish", "script"],
  ["video-ad-shot-list-director", "18 shots"],
  ["meta-ad-policy-check", "0 issues"],
] as const;
function Demo() {
  const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [done, setDone] = useState(still ? DEMO.length : 2);
  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setDone((d) => (d >= DEMO.length + 2 ? 0 : d + 1)), 1300);
    return () => clearInterval(t);
  }, [still]);
  const shown = Math.min(done, DEMO.length);
  return (
    <div className="demo" aria-label="Example: a request turned into a six-step workflow that runs on its own">
      <div className="panel">
        <div className="panel-bar"><span className="dots"><i /><i /><i /></span>your AI</div>
        <div className="chat">
          <div className="msg me">Turn our customer reviews into a video ad we can shoot this week.</div>
          <div className="msg ai">I'll use your handoff: <code>6 steps</code>. I need your website and an export of your reviews. Everything else comes from the steps.</div>
          <div className="msg me">Here they are. Go.</div>
          {shown >= DEMO.length && <div className="msg ai">Done. The script, 18 shots and a policy check are in <code>outputs/</code>. Two lines are marked MISSING for you to fill.</div>}
        </div>
      </div>
      <div className="panel">
        <div className="panel-bar">
          <span className="dots"><i /><i /><i /></span>handoff / reviews-to-video-ad
          <span className="right"><span className="progress"><i style={{ width: `${(shown / DEMO.length) * 100}%` }} /></span>{Math.round((shown / DEMO.length) * 100)}%</span>
        </div>
        <div className="term">
          <div className="head">› reading HANDOFF.md · 6 steps · 2 inputs</div>
          {DEMO.map(([slug, out], i) => {
            const state = i < shown ? "ok" : i === shown ? "run" : "wait";
            return (
              <div key={slug} className={`ln ${state}`}>
                <span className={`${state}${state === "run" ? " pulse" : ""}`}>{state === "ok" ? "✓" : state === "run" ? "●" : "○"}</span>
                <span>{slug}</span>
                <span className={`st ${state}`}>{state === "ok" ? out : state === "run" ? "running" : "waiting"}</span>
              </div>
            );
          })}
          <div className="head" style={{ marginTop: 10 }}>{shown >= DEMO.length ? "› all checks passed · summary written" : "› each step runs its checks before the next"}</div>
        </div>
      </div>
    </div>
  );
}

function Library({ c, onOpen }: { c: Catalogue; onOpen: (s: string) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | "general" | "ecommerce">("all");
  const [role, setRole] = useState("");
  const [job, setJob] = useState("");
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => setLimit(PAGE), [q, cat, role, job]);
  const blocks = useMemo(() => c.blocks.filter((b) => b.category !== "orchestrator"), [c]);
  const inCat = (b: Block) => cat === "all" || (cat === "ecommerce" ? b.category === "ecommerce" || b.addon : b.category === "general");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (b: Block) => words.every((w) => `${b.name} ${b.slug} ${b.summary} ${b.job} ${b.inputs.map((p) => p.type).join(" ")} ${b.outputs.map((p) => p.type).join(" ")}`.toLowerCase().replace(/_/g, " ").includes(w));
  const base = blocks.filter((b) => inCat(b) && hit(b) && (!job || b.job === job));
  const results = base.filter((b) => !role || b.role === role)
    .sort((a, b) => (START_HERE.indexOf(b.slug) + 1 ? 1 : 0) - (START_HERE.indexOf(a.slug) + 1 ? 1 : 0) || a.name.localeCompare(b.name));
  const jobs = [...new Set(blocks.map((b) => b.job))].sort();
  const clear = () => { setQ(""); setCat("all"); setRole(""); setJob(""); };
  return (
    <section className="section wrap" id="library" aria-labelledby="library-h">
      <div className="sec-head">
        <p className="eyebrow">Library</p>
        <h2 className="h2" id="library-h">Every block does one job, and says exactly how.</h2>
        <p className="lede">Search by what you want to make. Open any block to read it, copy it into your AI, or save it to a kit.</p>
      </div>
      <div className="filters">
        <label className="search"><SearchIcon /><span className="visually-hidden">Search blocks</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try: landing page, reviews, video script" data-testid="library-search" /></label>
        <div className="seg" role="group" aria-label="Works for">
          {([["all", "All"], ["general", "Any business"], ["ecommerce", "Ecommerce"]] as const).map(([id, label]) => <button key={id} aria-pressed={cat === id} onClick={() => setCat(id)}>{label}</button>)}
        </div>
        <select className="select" style={{ height: 44 }} value={job} onChange={(e) => setJob(e.target.value)} aria-label="Job">
          <option value="">Any job</option>
          {jobs.map((j) => <option key={j} value={j}>{JOBS[j] ?? cap(j)}</option>)}
        </select>
      </div>
      <div className="chips" role="group" aria-label="What the block does">
        {ROLES.filter((r) => r.id !== "orchestrate").map((r) => {
          const n = base.filter((b) => b.role === r.id).length;
          return (
            <button key={r.id} className="chip-btn" aria-pressed={role === r.id} title={r.does} onClick={() => setRole(role === r.id ? "" : r.id)}>
              <span className={`dot role-${r.id}`} />{r.name}<span className="count">{n}</span>
            </button>
          );
        })}
      </div>
      <div className="result-line">
        <span data-testid="result-count">{results.length} block{results.length === 1 ? "" : "s"}</span>
        {(q || role || job || cat !== "all") && <button className="link-btn" onClick={clear}>Clear filters</button>}
      </div>
      {results.length ? (
        <>
          <div className="grid">{results.slice(0, limit).map((b) => <BlockCard key={b.slug} b={b} onOpen={onOpen} />)}</div>
          {results.length > limit && <div className="more"><button className="btn btn-dark" onClick={() => setLimit(limit + 24)}>Show {Math.min(24, results.length - limit)} more</button></div>}
        </>
      ) : (
        <div className="empty"><h3 className="h3">No blocks match that yet</h3><p>Try fewer words, or <button className="link-btn" onClick={clear}>clear the filters</button>.</p></div>
      )}
    </section>
  );
}

function Workflows({ c, onOpen }: { c: Catalogue; onOpen: (s: string) => void }) {
  const list = c.blocks.filter((b) => b.category === "orchestrator");
  return (
    <section className="section wrap" id="workflows" aria-labelledby="workflows-h">
      <div className="sec-head">
        <p className="eyebrow">Workflows</p>
        <h2 className="h2" id="workflows-h">Start from a workflow that already works.</h2>
        <p className="lede">Each one chains library blocks so the output of one step becomes the input of the next. Open it, change it, download the handoff.</p>
      </div>
      <div className="flows">
        {list.map((b) => (
          <button key={b.slug} className="flow-card" onClick={() => onOpen(b.slug)} data-testid="workflow-card">
            <span className="top"><span>{b.steps.length} steps</span><span>{cap(b.level)}</span></span>
            <span className="nm">{b.name}</span>
            <span className="sm">{b.summary}</span>
            <span className="chainline">
              {b.steps.map((s, i) => {
                const sb = c.bySlug[s.uses];
                return sb ? (
                  <span key={i} style={{ display: "contents" }}>
                    {i > 0 && <span className="arrow">→</span>}
                    <span className="node-pill"><span className={`dot role-${sb.role}`} /><span>{sb.name}</span></span>
                  </span>
                ) : null;
              })}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function KitsDrawer({ c, onClose, onOpen, toBuilder }: { c: Catalogue; onClose: () => void; onOpen: (s: string) => void; toBuilder: (s: string[], n?: string) => void }) {
  const all = useStore((s) => s.kits);
  const [name, setName] = useState("");
  return (
    <Drawer label="Your kits" top={<span className="mono">kits · saved in this browser</span>} onClose={onClose}>
      <h2 className="title" style={{ marginTop: 0 }}>Your kits</h2>
      <p className="small" style={{ marginBottom: 24 }}>A kit is a set of blocks you use together. Open one in the builder to turn it into a workflow.</p>
      <form className="kit-new" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { kits.create(name); setName(""); } }}>
        <label className="search"><span className="visually-hidden">Kit name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name a new kit" /></label>
        <button className="btn btn-primary btn-sm" style={{ height: 40 }} type="submit">Create</button>
      </form>
      {all.length === 0 && <div className="empty"><h3 className="h3">No kits yet</h3><p>Open any block and press Save to kit.</p></div>}
      {all.map((k) => (
        <div className="kit" key={k.id} data-testid="kit">
          <div className="kit-head">
            <input value={k.name} onChange={(e) => kits.rename(k.id, e.target.value)} aria-label="Kit name" />
            <button className="btn btn-primary btn-sm" disabled={!k.slugs.length} onClick={() => toBuilder(k.slugs, k.name)}>Open in builder</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm(`Delete the kit "${k.name}"? The blocks stay in the library.`)) kits.remove(k.id); }}>Delete</button>
          </div>
          <div className="kit-items">
            {k.slugs.length === 0 && <span className="small">Empty</span>}
            {k.slugs.map((s) => <button key={s} onClick={() => onOpen(s)}>{c.bySlug[s]?.name ?? s}</button>)}
          </div>
        </div>
      ))}
    </Drawer>
  );
}

export default function App() {
  const c = useCatalogue();
  const [open, setOpen] = useState<string | null>(() => new URLSearchParams(location.search).get("block"));
  const [kitsOpen, setKitsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  // The open block lives in the URL (?block=slug) so it can be shared and survives a reload.
  useEffect(() => {
    const u = new URL(location.href);
    if (open) u.searchParams.set("block", open); else u.searchParams.delete("block");
    history.replaceState(null, "", u);
  }, [open]);
  const openBlock = useCallback((slug: string) => { setKitsOpen(false); setOpen(slug); }, []);
  const close = useCallback(() => setOpen(null), []);
  const closeKits = useCallback(() => setKitsOpen(false), []);
  const toBuilder = useCallback((slugs: string[], asNew?: string) => {
    queueForCanvas(slugs, asNew);
    setOpen(null); setKitsOpen(false);
    setTimeout(() => document.getElementById("build")?.scrollIntoView({ behavior: "smooth" }), 50);
    setToast(asNew ? `${asNew} is open in the builder` : "Added to the builder");
  }, []);

  const counts = c ? { blocks: c.blocks.filter((b) => b.category !== "orchestrator").length, flows: c.blocks.filter((b) => b.category === "orchestrator").length } : null;

  return (
    <>
      <Header onKits={() => setKitsOpen(true)} />
      <main id="top">
        <section className="hero wrap">
          <span className="pill-note"><b>Free</b>{counts ? `${counts.blocks} building blocks and ${counts.flows} workflows` : "Building blocks and workflows"}</span>
          <h1 className="h1">Making humanity AI native</h1>
          <p className="lede">Ready-made AI skills and workflows that take the busywork off your plate. Save hours every week, do ten times what you can today, and become the 10x human.</p>
          <div className="hero-actions">
            <a href="#library" className="btn btn-primary">Browse the blocks <ArrowIcon /></a>
            <a href="#build" className="btn btn-dark">Build a workflow</a>
          </div>
          <div className="stats" aria-label="At a glance">
            <div><b>{counts?.blocks ?? "·"}</b><span>building blocks</span></div>
            <div><b>{counts?.flows ?? "·"}</b><span>ready workflows</span></div>
            <div><b>0</b><span>sign-ups needed</span></div>
            <div><b>Any AI</b><span>Claude, ChatGPT, Gemini</span></div>
          </div>
          <Demo />
        </section>

        <section className="section wrap" id="how" aria-labelledby="how-h">
          <div className="sec-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2" id="how-h">Pick the blocks. Connect them. Hand it off.</h2>
            <p className="lede">No code and no new tool to learn. Everything ends as files your AI can read.</p>
          </div>
          <div className="steps">
            <div className="step"><span className="n">1</span><h3 className="h3">Pick a block</h3><p>Each block is one skill with a plain name, what it needs, what it gives you, and the checks that stop weak work.</p></div>
            <div className="step"><span className="n">2</span><h3 className="h3">Connect blocks</h3><p>Drop blocks in the builder in the order you want. One block's output becomes the next one's input.</p></div>
            <div className="step"><span className="n">3</span><h3 className="h3">Hand it to your AI</h3><p>Download one folder with the steps and every skill. Give it to Claude or another AI and say "follow HANDOFF.md".</p></div>
          </div>
        </section>

        {c ? <Library c={c} onOpen={openBlock} /> : <section className="section wrap" id="library"><p className="small">Loading the library…</p></section>}
        {c && <Workflows c={c} onOpen={openBlock} />}

        <section className="section wrap" id="build" aria-labelledby="build-h">
          <div className="sec-head">
            <p className="eyebrow">Builder</p>
            <h2 className="h2" id="build-h">Build your own workflow.</h2>
            <p className="lede">Drag blocks onto the canvas and connect them. The download is made by plain code from your layout, so the same workflow always gives the same handoff.</p>
          </div>
          {c && <Suspense fallback={<div className="builder" />}><Builder c={c} toast={setToast} /></Suspense>}
        </section>

        <section className="section wrap" id="testing" aria-labelledby="testing-h">
          <div className="sec-head">
            <p className="eyebrow">Testing</p>
            <h2 className="h2" id="testing-h">A block earns its place by beating the simple way.</h2>
            <p className="lede">Built on the ideas in Chip Huyen's <i>AI Engineering</i>. Every block is marked "not yet tested" until it passes.</p>
          </div>
          <div className="principles">
            <div><h3 className="h3">Code checks first</h3><p>Prices, claims, lengths and required parts are checked by code on every run.</p></div>
            <div><h3 className="h3">An independent judge</h3><p>Quality is graded by a model from a different lab than the one that did the work.</p></div>
            <div><h3 className="h3">Beats a plain request</h3><p>If a block doesn't clearly beat the same task asked in one sentence, it isn't listed.</p></div>
            <div><h3 className="h3">Honest test sizes</h3><p>Each block says how many cases it was tested on, including hard and tricky ones.</p></div>
          </div>
        </section>

        <section className="section wrap" aria-labelledby="start-h">
          <div className="sec-head"><h2 className="h2" id="start-h">Choose how to get started.</h2></div>
          <div className="choices">
            <div className="choice">
              <h3 className="h3">Use one block</h3>
              <p className="small" style={{ marginTop: 6 }}>For a single job, done well, today.</p>
              <ul><li>Copy a skill into Claude, ChatGPT or Gemini</li><li>See what it needs before you start</li><li>Save the ones you like to a kit</li></ul>
              <a href="#library" className="btn btn-primary">Browse the blocks</a>
            </div>
            <div className="choice">
              <h3 className="h3">Build a workflow</h3>
              <p className="small" style={{ marginTop: 6 }}>For work you repeat every week.</p>
              <ul><li>Start from a ready workflow or your own kit</li><li>Connect blocks on the canvas</li><li>Download one handoff your AI runs step by step</li></ul>
              <a href="#build" className="btn btn-dark">Open the builder</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap footer-in">
          <span>AI Building Blocks · free, and what you save stays in your browser.</span>
          <nav aria-label="Footer">{NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}<a href="https://github.com/KevCode-Absurd/ai-building-blocks">GitHub</a></nav>
        </div>
      </footer>
      {c && open && <BlockDrawer c={c} slug={open} onOpen={openBlock} onClose={close} toast={setToast} toBuilder={toBuilder} />}
      {c && kitsOpen && <KitsDrawer c={c} onClose={closeKits} onOpen={openBlock} toBuilder={toBuilder} />}
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}

