import { useEffect, useRef, useState } from "react";
import { TRACTION_CHANNELS, tractionSlug } from "../../tools/lib/traction-channels.mjs";
import { ArrowIcon, Select } from "./ui";
import { Link } from "./lib/router";
import { loadCatalogue } from "./lib/data";
import { buildHandoffZip, download } from "./lib/handoff";
import { BUSINESS_TYPES, growthPlan, tractionBrief, type TractionBrief } from "./lib/traction";
import "./traction.css";
import ExecutionPrompt from "./ExecutionPrompt";

type Channel = { id: string; channel: string; name: string; decision: string };
type Prepared = ReturnType<typeof growthPlan> & { brief: string; channel: string };
const channels = TRACTION_CHANNELS as Channel[];

export default function TractionPage() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("general");
  const [channel, setChannel] = useState("all");
  const [business, setBusiness] = useState("");
  const [buyer, setBuyer] = useState("");
  const [market, setMarket] = useState("");
  const [goal, setGoal] = useState("");
  const [limits, setLimits] = useState("");
  const [stage, setStage] = useState("");
  const [success, setSuccess] = useState("");
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const resultRef = useRef<HTMLElement>(null);
  const values: TractionBrief = { url, mode, channel, business, buyer, market, goal, limits, stage, success };
  useEffect(() => {
    const previous = document.title;
    document.title = "Growth channel planner · AI Blocks";
    return () => { document.title = previous; };
  }, []);
  const change = (set: (value: string) => void, value: string) => {
    set(value); setPrepared(null); setError(""); setMessage("");
  };
  const prepare = () => {
    setError(""); setMessage("");
    try {
      setPrepared({ ...growthPlan(values), brief: tractionBrief(values), channel });
      requestAnimationFrame(() => {
        resultRef.current?.focus({ preventScroll: true });
        resultRef.current?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      });
    } catch (e) { setError(e instanceof Error ? e.message : "Check the business details and try again."); }
  };
  const copy = async () => {
    if (!prepared) return;
    setError(""); setMessage("");
    try { await navigator.clipboard.writeText(prepared.brief); setMessage("Brief copied."); }
    catch { setError("The browser could not copy the brief. Open the brief below and copy its text."); }
  };
  const pack = async () => {
    if (!prepared || busy) return;
    setError(""); setMessage(""); setBusy(true);
    try {
      const c = await loadCatalogue();
      const slug = prepared.channel === "all" ? "find-your-business-growth-channel" : tractionSlug(prepared.channel);
      const result = await buildHandoffZip(c, {
        id: "growth-channel-planner", name: "Business growth planning pack", updated: 0,
        goal: `Plan growth for this business: ${prepared.business}`, notes: prepared.brief,
        nodes: [{ id: "run", slug, x: 0, y: 0 }], edges: [],
      });
      if ("error" in result) throw new Error(result.error);
      download(result.blob, result.filename);
      setMessage("Pack downloaded.");
    } catch (e) { setError(e instanceof Error ? e.message : "The pack could not be built. Please try again."); }
    finally { setBusy(false); }
  };
  return <main className="wrap traction-page" data-testid="traction-page">
    <header className="bp-hero">
      <Link to="/tools" className="back">← All tools</Link>
      <p className="bp-kicker">Free planning tool</p>
      <h1 className="bp-h1">Growth channel planner</h1>
      <p className="bp-sub">Turn your business, customers and limits into a clear brief for comparing 19 growth channels and planning small tests.</p>
    </header>
    <section className="traction-form" aria-labelledby="traction-start">
      <h2 id="traction-start">Tell us about the business</h2>
      <p className="traction-form-intro">Works for products, services, local businesses, software, marketplaces, creators and nonprofits. A website is optional.</p>
      <form onSubmit={e => { e.preventDefault(); prepare(); }}>
        <fieldset disabled={busy} className="traction-fields">
          <div className="traction-options">
            <Select label="Business" value={mode} options={[...BUSINESS_TYPES]} onChange={value => change(setMode, value)} testId="traction-mode" />
            <Select label="Scope" value={channel} options={[{ value: "all", label: "Compare all 19 channels" }, ...channels.map(c => ({ value: c.id, label: c.channel }))]} onChange={value => change(setChannel, value)} testId="traction-scope" />
          </div>
          <div className="traction-field"><label htmlFor="traction-business">What do you offer, and who is it for?</label><textarea id="traction-business" data-testid="traction-business" rows={3} maxLength={2000} value={business} onChange={e => change(setBusiness, e.target.value)} placeholder="For example, a neighbourhood bakery taking custom cake orders, or an agency helping small retailers" /></div>
          <div className="traction-field"><label htmlFor="traction-url">Website or product link <span>(optional)</span></label><input id="traction-url" type="text" inputMode="url" autoCapitalize="none" maxLength={2048} placeholder="https://example.com" value={url} onChange={e => change(setUrl, e.target.value)} data-testid="traction-url" /></div>
          <div className="traction-field-grid">
            <div className="traction-field"><label htmlFor="traction-buyer">Customers <span>(optional)</span></label><input id="traction-buyer" maxLength={600} value={buyer} onChange={e => change(setBuyer, e.target.value)} placeholder="Who decides, buys or uses it?" /></div>
            <div className="traction-field"><label htmlFor="traction-market">Market <span>(optional)</span></label><input id="traction-market" maxLength={300} value={market} onChange={e => change(setMarket, e.target.value)} placeholder="Local area, country, online or offline" /></div>
          </div>
          <details className="traction-constraints"><summary>Add goals, budget and success measures</summary>
            <div className="traction-field"><label htmlFor="traction-goal">Growth goal and deadline</label><textarea id="traction-goal" rows={2} maxLength={600} value={goal} onChange={e => change(setGoal, e.target.value)} placeholder="For example, 20 qualified enquiries over the next eight weeks" /></div>
            <div className="traction-field"><label htmlFor="traction-limits">Cash, time and constraints</label><textarea id="traction-limits" rows={2} maxLength={600} value={limits} onChange={e => change(setLimits, e.target.value)} placeholder="Your total budget, available hours, capacity and things to avoid" /></div>
            <div className="traction-field"><label htmlFor="traction-stage">Current stage</label><input id="traction-stage" maxLength={300} value={stage} onChange={e => change(setStage, e.target.value)} placeholder="Idea, first customers, established or expanding" /></div>
            <div className="traction-field"><label htmlFor="traction-success">What counts as success?</label><input id="traction-success" maxLength={300} value={success} onChange={e => change(setSuccess, e.target.value)} placeholder="An order, booking, enquiry, renewal or another useful result" /></div>
          </details>
          <button className="btn btn-primary" type="submit" data-testid="traction-prepare">Prepare my growth brief <ArrowIcon /></button>
        </fieldset>
      </form>
      <p className="traction-privacy">Your answers stay in this page until you copy or download them. This tool does not visit your website or make an AI request.</p>
      {!prepared && error && <p className="traction-feedback" role="alert" data-testid="traction-error">{error}</p>}
    </section>
    {prepared && <section className="traction-result" aria-labelledby="traction-result-title" ref={resultRef} tabIndex={-1} data-testid="traction-result">
      <div className="traction-result-heading"><span className="mono small">READY TO USE</span><h2 id="traction-result-title">Your growth planning brief</h2><p>Review your details, then copy the brief or download the complete skill pack.</p></div>
      <div className="bp-actions"><button className="btn btn-primary" onClick={pack} disabled={busy} data-testid="traction-download">{busy ? "Building your pack…" : "Download the workflow"}<ArrowIcon /></button><button className="btn btn-dark" onClick={copy} disabled={busy} data-testid="traction-copy">Copy the AI brief</button></div>
      <ExecutionPrompt name="Business growth planning pack" goal={`Plan growth for this business: ${prepared.business}`} />
      <dl className="traction-summary">{[["Business", prepared.business], ["Type", prepared.type], ["Customers", prepared.buyer], ["Market", prepared.market], ["Goal", prepared.goal], ["Success measures", prepared.success], ["Cash and time", prepared.limits], ["Scope", prepared.scope]].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
      <p>Open START_HERE.txt in an AI tool that can read the whole folder to compare channels and plan tests.</p>
      {error && <p className="traction-feedback" role="alert" data-testid="traction-error">{error}</p>}
      {message && <p className="traction-feedback" role="status" data-testid="traction-status">{message}</p>}
      <details className="traction-brief"><summary>Read or copy the full brief</summary><pre>{prepared.brief}</pre></details>
    </section>}
    <section className="traction-method" aria-labelledby="traction-method"><h2 id="traction-method">Compare, test, then focus</h2><ol><li><b>Explore.</b> Compare the channels against your buyers, goals and capacity.</li><li><b>Test.</b> Plan up to three small pilots within a shared cash and time limit.</li><li><b>Review.</b> Use measured results to decide what to continue, change or stop.</li></ol><p className="traction-attribution">Based on the Bullseye framework in <cite>Traction</cite> by Gabriel Weinberg and Justin Mares. No tests are run or money spent by this tool.</p></section>
    <section aria-labelledby="traction-channels"><div className="traction-channel-heading"><h2 id="traction-channels">Explore the channels</h2><p>Open a specialist skill for a single channel.</p></div><div className="traction-grid">{channels.map((c, i) => <Link key={c.id} to={`/skills/${tractionSlug(c.id)}`} className="card" data-testid="traction-channel"><span className="meta">{String(i + 1).padStart(2, "0")} · {c.channel}</span><span className="nm">{c.name}</span><span className="view">Open the skill <ArrowIcon size={12} /></span></Link>)}</div></section>
  </main>;
}
