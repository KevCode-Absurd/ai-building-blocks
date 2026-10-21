import { useEffect, useState } from "react";
import { TRACTION_CHANNELS, tractionSlug } from "../../tools/lib/traction-channels.mjs";
import { ArrowIcon, Select } from "./ui";
import { Link } from "./lib/router";
import { loadCatalogue } from "./lib/data";
import { buildHandoffZip, download } from "./lib/handoff";
import { productUrl, tractionBrief } from "./lib/traction";
import "./traction.css";

type Channel = { id: string; channel: string; name: string; decision: string };
const channels = TRACTION_CHANNELS as Channel[];

export default function TractionPage() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("saas");
  const [channel, setChannel] = useState("all");
  const [goal, setGoal] = useState("");
  const [limits, setLimits] = useState("");
  const [stage, setStage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const values = { url, mode, channel, goal, limits, stage };
  useEffect(() => {
    const previous = document.title;
    document.title = "Find your growth channel · AI Blocks";
    return () => { document.title = previous; };
  }, []);
  const copy = async () => {
    setError(""); setMessage("");
    try { await navigator.clipboard.writeText(tractionBrief(values)); setMessage("Brief copied. Download the skills, attach the folder to your AI, then paste the brief."); }
    catch (e) { setError(e instanceof Error ? e.message : "The brief could not be copied."); }
  };
  const pack = async () => {
    setError(""); setMessage("");
    try {
      const link = productUrl(url);
      setBusy(true);
      const c = await loadCatalogue();
      const slug = channel === "all" ? (mode === "general" ? "find-your-business-growth-channel" : "find-your-saas-growth-channel") : tractionSlug(channel);
      const result = await buildHandoffZip(c, {
        id: "traction", name: channel === "all" ? "Traction growth plan" : `Traction ${channel} plan`, updated: 0,
        goal: `Advise the business at ${link}.`, notes: tractionBrief(values),
        nodes: [{ id: "run", slug, x: 0, y: 0 }], edges: [],
      });
      if ("error" in result) throw new Error(result.error);
      download(result.blob, result.filename);
      setMessage("Pack ready. Unzip it, attach the folder to your AI, and say: Follow HANDOFF.md. The advice is produced in your AI.");
    } catch (e) { setError(e instanceof Error ? e.message : "The pack could not be built. Please try again."); }
    finally { setBusy(false); }
  };
  return <main className="wrap traction-page" data-testid="traction-page">
    <header className="bp-hero">
      <Link to="/" className="back">← Home</Link>
      <p className="bp-kicker">19 growth channels · one business at a time</p>
      <h1 className="bp-h1">Find your next source of customers</h1>
      <p className="bp-sub">Paste your product link. Take a ready-to-run brief and skill pack into your AI to get advice for your business, compare all 19 channels, and plan a few small tests.</p>
      <p className="bp-note">Built from Traction by Gabriel Weinberg and Justin Mares. SaaS first, with a general-business mode. The site prepares the pack; your AI reads the product and writes the advice.</p>
    </header>
    <section className="traction-form" aria-labelledby="traction-start">
      <h2 id="traction-start">Start with your product</h2>
      <label htmlFor="traction-url">Public product URL</label>
      <input id="traction-url" type="url" placeholder="https://yourproduct.com" value={url} onChange={(e) => setUrl(e.target.value)} data-testid="traction-url" />
      <div className="traction-options">
        <Select label="Business" value={mode} options={[{ value: "saas", label: "SaaS / software" }, { value: "general", label: "General business" }]} onChange={setMode} testId="traction-mode" />
        <Select label="Scope" value={channel} options={[{ value: "all", label: "Compare all 19 channels" }, ...channels.map((c) => ({ value: c.id, label: c.channel }))]} onChange={setChannel} testId="traction-scope" />
      </div>
      <details><summary>Add your goal and limits (optional)</summary>
        <label htmlFor="traction-stage">Stage and sales process</label><input id="traction-stage" value={stage} onChange={(e) => setStage(e.target.value)} placeholder="For example, early product with a self-serve trial" />
        <label htmlFor="traction-goal">Growth goal and deadline</label><textarea id="traction-goal" rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="For example, find a repeatable source of activated trials this quarter" />
        <label htmlFor="traction-limits">Cash cap, hours and constraints</label><textarea id="traction-limits" rows={2} value={limits} onChange={(e) => setLimits(e.target.value)} placeholder="What can you spend, how much time can you give, and what must it avoid?" />
      </details>
      <div className="bp-actions"><button className="btn btn-primary" onClick={pack} disabled={busy} data-testid="traction-download">{busy ? "Building your pack…" : channel === "all" ? "Download the 19-channel pack" : "Download this channel pack"}<ArrowIcon /></button><button className="btn btn-dark" onClick={copy} disabled={busy} data-testid="traction-copy">Copy the AI brief</button></div>
      {error && <p role="alert" data-testid="traction-error">{error}</p>}
      {message && <p role="status" data-testid="traction-status">{message}</p>}
      <p className="bp-note">Your URL and answers stay in this page until you copy or download them. The site fetches library files to build your pack and does not visit your product URL.</p>
    </section>
    <section className="traction-method" aria-labelledby="traction-method"><h2 id="traction-method">Explore, test, then focus</h2><ol><li>Read your product, buyer, offer and current goal.</li><li>Give each of the 19 channels a fair idea, then rank the fit.</li><li>Prepare up to three affordable pilots, each with clear limits.</li><li>Review actual results and focus on a channel only when the evidence supports it.</li></ol><p>Plans include sources, assumptions and missing facts. Sending, spending and publishing need your authorization. A plan stays a plan until tests return measured results.</p><p><Link to="/workflows/find-your-saas-growth-channel">SaaS workflow</Link> · <Link to="/workflows/find-your-business-growth-channel">General-business workflow</Link> · <Link to="/agents/traction-research-agent">Research agent</Link> · <Link to="/agents/traction-experiment-keeper">Experiment review agent</Link></p></section>
    <section aria-labelledby="traction-channels"><h2 id="traction-channels">Use any channel on its own</h2><div className="traction-grid">{channels.map((c, i) => <Link key={c.id} to={`/skills/${tractionSlug(c.id)}`} className="card" data-testid="traction-channel"><span className="meta">{String(i + 1).padStart(2, "0")} · {c.channel}</span><span className="nm">{c.name}</span><span className="peek">{c.decision}</span><span className="view">Open the skill <ArrowIcon size={12} /></span></Link>)}</div></section>
  </main>;
}
