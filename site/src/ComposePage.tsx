import { useEffect, useMemo, useRef, useState } from "react";
import { type Catalogue, pathOf, portLabel } from "./lib/data";
import { type Choices, type Composition, finalize, freeSelection, LIMITS, QUESTIONS, questionsFor, requestError, retrieve, validateChoices } from "./lib/composer-core";
import SkillReplace, { ReplaceMenu } from "./SkillReplace";
import { withCustomSkills, validateCustomSkills, type CustomSkill } from "./lib/custom-skills";
import VoiceRequest from "./VoiceRequest";
import { compositionFlow } from "./lib/composer-flow";
import { buildHandoffZip, download } from "./lib/handoff";
import { businessText, getBusiness } from "./lib/business";
import { flows } from "./lib/store";
import { Link, navigate } from "./lib/router";
import "./compose.css";
import { protectedHeaders } from "./lib/turnstile";
import { useComposerAccount } from "./lib/composer-account";

type Result = { plan: Composition; model: string; cost: number; latencyMs: number; context?: string };

const EXAMPLES = ["Build a landing page from scratch and give me source code", "Turn customer reviews into checked video ad scripts", "Create a weekly KPI report and dashboard", "Design an n8n automation with safe retries"];
export default function ComposePage({ c: baseCatalogue, toast }: { c: Catalogue; toast: (message: string) => void }) {
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const c = useMemo(() => withCustomSkills(baseCatalogue, customSkills), [baseCatalogue, customSkills]);
  const [replacing, setReplacing] = useState<number | null>(null);
  const [menu, setMenu] = useState<{ index: number; x: number; y: number } | null>(null);
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [useContext, setUseContext] = useState(false);
  const [mode, setMode] = useState<"free" | "ai">("free");
  const account = useComposerAccount(mode === "ai");
  const [available, setAvailable] = useState(false);
  const [dictating, setDictating] = useState(false);

  const [connecting, setConnecting] = useState(true);
  const [choices, setChoices] = useState<Choices>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [packBusy, setPackBusy] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [restored, setRestored] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const requestRef = useRef(0);
  useEffect(() => {
    document.title = "Get a workflow for your request | AI Blocks";
    let live = true;
    fetch("/api/compose").then(r => { if (!r.ok) throw Error(); return r.json(); }).then(d => { if (live) setAvailable(d.enabled === true); }).catch(() => {}).finally(() => { if (live) setConnecting(false); });
    try { const saved = JSON.parse(localStorage.getItem("abb:composer") ?? "null"); if (saved?.format === "ai-blocks-composition/1") { const custom = validateCustomSkills(saved.customSkills); const plan = finalize(withCustomSkills(baseCatalogue, custom), saved.plan, saved.plan.source); setCustomSkills(custom); setGoal(saved.goal.slice(0, LIMITS.request)); setChoices(validateChoices(saved.choices ?? {})); setContext(saved.context ?? ""); setResult({ plan, model: saved.model || "free", cost: saved.cost || 0, latencyMs: saved.latencyMs || 0 }); setRestored(true); } } catch { /* old or damaged drafts do not block composing */ }
    try {
      const pending = JSON.parse(sessionStorage.getItem("abb:composer-signin") ?? "null");
      sessionStorage.removeItem("abb:composer-signin");
      if (pending && typeof pending.goal === "string" && typeof pending.context === "string") {
        setGoal(pending.goal.slice(0, LIMITS.request)); setContext(pending.context.slice(0, LIMITS.context));
        setChoices(validateChoices(pending.choices ?? {})); setUseContext(pending.useContext === true);
        setCustomSkills(validateCustomSkills(pending.customSkills)); setResult(null); setMode("ai");
      }
    } catch { /* Invalid local drafts never block sign-in. */ }
    return () => { live = false; requestRef.current++; };
  }, [baseCatalogue]);
  const envelope = () => ({ format: "ai-blocks-composition/1", goal, context: result?.context ?? context, choices, customSkills, plan: result?.plan, model: result?.model, cost: result?.cost, latencyMs: result?.latencyMs });
  useEffect(() => { if (result) try { localStorage.setItem("abb:composer", JSON.stringify(envelope())); } catch { /* storage can be unavailable */ } }, [result, goal, context, choices, customSkills]);
  const reset = () => { setResult(null); setError(""); setRestored(false); requestRef.current++; try { localStorage.removeItem("abb:composer"); } catch {} };
  const changeGoal = (value: string) => { reset(); setGoal(value); setChoices({}); };
  const signIn = async (signUp = false) => {
    try {
      sessionStorage.setItem("abb:composer-signin", JSON.stringify({ goal, context, choices, useContext, customSkills }));
      await account.signIn(signUp);
    } catch { setError("Sign-in could not open. Please try again."); }
  };
  const compose = async () => {
    setError(""); const invalid = requestError(goal); if (invalid) { setError(invalid); return; }
    if (mode === "ai" && !available) { setError("AI composition is not connected yet. Free assembly is ready to use."); return; }
    if (mode === "ai" && account.state !== "signed-in") { setError("Sign in to generate a free AI workflow."); return; }
    const id = ++requestRef.current;
    setBusy(true); setRestored(false);
    try {
      const combined = [context, useContext && businessText(getBusiness())].filter(Boolean).join("\n\n");
      if (combined.length > LIMITS.context) throw Error("Keep added context, including saved context, under 4,000 characters.");
      if (mode === "free") setResult({ plan: finalize(c, freeSelection(c, goal, choices, combined), "free"), model: "free", cost: 0, latencyMs: 0, context: combined });
      else {
        const token = await account.token();
        const verification = await protectedHeaders("compose");
        const response = await fetch("/api/compose", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID(), authorization: `Bearer ${token}`, ...verification }, body: JSON.stringify({ goal, context: combined, choices }) });
        if (response.status === 401) account.expired();
        const out = await response.json(); if (!response.ok) throw Error(out.error || "The model could not finish. Try free assembly.");
        if (requestRef.current === id) setResult({ ...out, context: combined, plan: finalize(c, out.plan, "ai") });
        void account.refreshUsage();
      }
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
    } catch (e) { if (requestRef.current === id) setError(e instanceof Error ? e.message : "The workflow could not be created."); }
    finally { setBusy(false); }
  };
  const edit = (steps: Composition["steps"]) => { if (!result) return; try { setResult({ ...result, plan: finalize(c, { ...result.plan, steps }, result.plan.source) }); } catch (e) { setError((e as Error).message); } };
  const move = (index: number, delta: number) => { if (!result) return; const next = [...result.plan.steps]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; edit(next); };
  const asFlow = () => ({ ...compositionFlow(c, result!.plan, goal, result?.context ?? context), customSkills });
  const exportJson = () => download(new Blob([JSON.stringify(envelope(), null, 2)], { type: "application/json" }), "workflow.edit.json");
  const exportPack = async () => {
    if (!result) return; setPackBusy(true); setError("");
    try {
      const flow = asFlow();
      const built = await buildHandoffZip(c, flow, useContext ? getBusiness() : {}, { "workflow.edit.json": JSON.stringify(envelope(), null, 2), "README.md": `# ${result.plan.title}\n\n${result.plan.summary}\n\n## Run\nRead HANDOFF.md. Supply the required inputs, then run the steps in order in an AI runner with the tools each skill needs. Code needs a coding environment; browser checks need a rendered preview. Mark checks not run if tools are unavailable.\n\n## Edit\nOpen /compose on AI Blocks and choose Import workflow. Select workflow.edit.json. Edit notes, add or reorder steps, then download again.\n\n## Boundaries\nThis pack is a plan. No skills have run, no page has been published and no agent has been scheduled. Authorize concrete external actions during execution.\n\n## Planning cost\n${result.model === "free" ? "Free assembly used no model calls." : `Model: ${result.model}. Calculated API usage cost: $${result.cost.toFixed(6)} USD. Execution, hosting and taxes are separate.`}\n`, "inputs.json": JSON.stringify({ required: result.plan.missing, choices, status: "awaiting-user-inputs" }, null, 2) });
      if ("error" in built) throw Error(built.error); download(built.blob, built.filename); toast("Your workflow pack is downloaded");
    } catch (e) { setError((e as Error).message); } finally { setPackBusy(false); }
  };
  const importPack = async (file?: File) => {
    if (!file) return; setError("");
    try { if (file.size > 1000000) throw Error("Keep the workflow file under 1 MB."); const data = JSON.parse(await file.text()); if (data.format !== "ai-blocks-composition/1" || typeof data.goal !== "string" || data.goal.length > LIMITS.request || typeof data.context !== "string" || data.context.length > LIMITS.context) throw Error("Choose a workflow.edit.json exported from this composer."); const custom = validateCustomSkills(data.customSkills); const plan = finalize(withCustomSkills(baseCatalogue, custom), data.plan, data.plan.source === "ai" ? "ai" : "free"); setCustomSkills(custom); setGoal(data.goal); setContext(data.context); setChoices(validateChoices(data.choices ?? {})); setResult({ plan, model: typeof data.model === "string" ? data.model : "free", cost: Number.isFinite(data.cost) && data.cost >= 0 ? data.cost : 0, latencyMs: 0 }); setRestored(true); toast("Your workflow is ready to edit"); } catch (e) { setError((e as Error).message); } finally { if (importRef.current) importRef.current.value = ""; }
  };

  const questions = questionsFor(goal, choices);
  const possibleQuestions = [...new Set([...questions, ...Object.keys(choices)])].filter(id => Object.hasOwn(QUESTIONS, id));
  return <main className="wrap compose-page" data-testid="compose-page">
    <div className="compose-intro"><span className="mono small">YOUR REQUEST → YOUR WORKFLOW</span><h1 className="h2">Get a workflow for the job you have in mind</h1><p className="lede">Describe the result. Get connected skills, checks and a folder you can edit and run in your own AI.</p></div>
    <div className="compose-layout">
      <section className="compose-form" aria-label="Your request">
        <div className="compose-tabs" role="tablist" aria-label="How to create your workflow"><button role="tab" disabled={busy} aria-selected={mode === "free"} onClick={() => setMode("free")}>Free assembly</button><button role="tab" disabled={busy} aria-selected={mode === "ai"} onClick={() => setMode("ai")}>AI composition</button></div>
        <p className="small">{mode === "free" ? "Planning runs in your browser. Library rules connect the steps." : "Create a tailored workflow for free. Sign in to use your daily allowance. No payment details needed."}</p>
        {mode === "ai" && <div className="compose-account" data-testid="compose-account" aria-label="Workflow account">
          {account.state === "loading" && <p className="small" role="status">Checking sign-in…</p>}
          {account.state === "unconfigured" && <p className="small">Sign-in is being connected. You can use free assembly now.</p>}
          {account.state === "error" && <><p className="small">Sign-in could not load. Free assembly is available.</p><button className="link-btn" onClick={account.retry}>Try sign-in again</button></>}
          {account.state === "signed-out" && <><p className="small">Sign in to create your free AI workflow.</p><div className="compose-actions"><button className="btn btn-dark btn-sm" onClick={() => void signIn()}>Sign in</button><button className="link-btn" onClick={() => void signIn(true)}>Create a free account</button></div></>}
          {account.state === "signed-in" && <><p className="small">Signed in · Free access{account.usage ? ` · ${account.usage.completed} workflows created · ${Math.max(0, account.usage.dailyAttemptLimit - account.usage.attemptsToday)} attempts left today` : ""}</p><button className="link-btn" disabled={busy} onClick={() => void account.signOut()?.catch(() => setError("Sign-out could not finish. Please try again."))}>Sign out</button></>}
        </div>}
        <form onSubmit={e => { e.preventDefault(); void compose(); }}>
          <label htmlFor="compose-goal">What would you like to get done?</label><textarea id="compose-goal" data-testid="compose-goal" value={goal} onChange={e => changeGoal(e.currentTarget.value)} maxLength={LIMITS.request} rows={5} placeholder="Build a landing page, check it and give me the source code" required disabled={busy || dictating} />
          <div className="compose-voice-count small">{goal.length.toLocaleString()} / 10,000 characters</div><VoiceRequest value={goal} onChange={changeGoal} disabled={busy} onListeningChange={setDictating} />
          <div className="compose-examples">{EXAMPLES.map(s => <button type="button" key={s} disabled={busy || dictating} onClick={() => changeGoal(s)}>{s}</button>)}</div>
          {possibleQuestions.length > 0 && <fieldset><legend>Choices that shape the workflow</legend>{possibleQuestions.map(id => { const q = QUESTIONS[id as keyof typeof QUESTIONS]; return <label key={id} className="compose-choice">{q.text}<select aria-label={q.text} value={choices[id as keyof Choices] ?? ""} disabled={busy} onChange={e => { const value = e.currentTarget.value; reset(); setChoices(v => { const next = { ...v }; if (value) next[id as keyof Choices] = value; else delete next[id as keyof Choices]; return next; }); }}><option value="">Use a sensible starting point</option>{q.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>; })}</fieldset>}
          <details className="compose-context"><summary>Add context and constraints</summary><label htmlFor="compose-context">Audience, offer, available inputs and limits</label><textarea id="compose-context" rows={4} value={context} maxLength={LIMITS.context} onChange={e => { reset(); setContext(e.currentTarget.value); }} disabled={busy} /><label className="compose-check"><input type="checkbox" checked={useContext} onChange={e => { reset(); setUseContext(e.currentTarget.checked); }} disabled={busy} /> Include my saved context</label></details>
          {mode === "ai" && <p className="small">{connecting ? "Checking service availability…" : "Your request, added context and relevant skill descriptions go to our AI provider. The service selects the model and enforces usage limits."}</p>}
          <button className="btn btn-primary" type="submit" data-testid="compose-submit" disabled={busy || dictating || !goal.trim() || mode === "ai" && (!available || connecting || account.state !== "signed-in")}>{busy ? "Connecting your workflow…" : mode === "free" ? "Assemble my workflow" : "Create my workflow"}</button>
          {busy && <p role="status" className="small">This can take up to two minutes. You can keep this page open.</p>}
        </form>
        <div className="compose-import"><button className="link-btn" onClick={() => importRef.current?.click()} disabled={busy || dictating}>Import workflow</button><input ref={importRef} type="file" accept=".json,application/json" className="visually-hidden" aria-label="Import workflow JSON" onChange={e => void importPack(e.currentTarget.files?.[0])} /></div>
        {error && <p className="compose-error" role="alert">{error}</p>}
      </section>
      <section className="compose-result" ref={resultRef} aria-label="Your workflow" aria-live="polite">
        {result ? <>
          <div className="compose-result-meta"><span className="mono small">{result.model === "free" ? "FREE ASSEMBLY" : "AI COMPOSITION"}</span><span className="small">{result.model === "free" ? "$0 model cost" : `$${result.cost.toFixed(5)} model cost · ${(result.latencyMs / 1000).toFixed(1)}s`}</span></div>
          {restored && <p className="small">Restored from a saved workflow. Model cost shown is from its original generation.</p>}
          <h2 className="h3">{result.plan.title}</h2><p className="small">{result.plan.summary}</p>
          <ol className="compose-steps" data-testid="compose-steps">{result.plan.steps.map((step, i) => <li key={`${i}-${step.slug}`} onContextMenu={e => { e.preventDefault(); setMenu({ index: i, x: e.clientX, y: e.clientY }); }}><div className="compose-step-head"><span className="compose-step-num">{String(i + 1).padStart(2, "0")}</span><div>{step.slug.startsWith("custom-") ? <b>{c.bySlug[step.slug].name} · Your skill</b> : <Link to={pathOf(c.bySlug[step.slug])}>{c.bySlug[step.slug].name}</Link>}<span className="small">{c.bySlug[step.slug].type} · {c.bySlug[step.slug].role}</span></div><div className="compose-step-buttons"><button aria-label={`Replace step ${i + 1}`} onClick={() => setReplacing(i)}>Replace</button><button aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>↑</button><button aria-label={`Move step ${i + 1} down`} disabled={i === result.plan.steps.length - 1} onClick={() => move(i, 1)}>↓</button><button aria-label={`Remove step ${i + 1}`} disabled={result.plan.steps.length === 1} onClick={() => edit(result.plan.steps.filter((_, n) => n !== i))}>×</button></div></div><p>{step.reason}</p><details><summary>Edit step instructions</summary><button className="btn btn-ghost btn-sm" onClick={() => setReplacing(i)}>Replace skill</button><textarea aria-label={`Instructions for step ${i + 1}`} rows={4} maxLength={1200} value={step.notes} onChange={e => edit(result.plan.steps.map((s, n) => n === i ? { ...s, notes: e.currentTarget.value } : s))} /></details></li>)}</ol>
          {result.plan.steps.length < LIMITS.steps && <details className="compose-add"><summary>Add a block</summary><label htmlFor="compose-add">Search the library</label><input id="compose-add" value={addSearch} onChange={e => setAddSearch(e.currentTarget.value)} placeholder="Claim checker, SEO, automation…" />{addSearch.trim() && retrieve(c, addSearch, 6).map(b => <button key={b.slug} onClick={() => { edit([...result.plan.steps, { slug: b.slug, reason: "Added by you.", notes: "" }]); setAddSearch(""); }}>{b.name} <span className="small">{b.type}</span> +</button>)}</details>}
          <details open className="compose-inputs"><summary>Inputs to bring when you run it ({result.plan.missing.length})</summary>{result.plan.missing.length ? <ul>{result.plan.missing.map(n => <li key={n.type}><b>{portLabel(n.type)}</b><span className="small">Steps {n.steps.join(", ")}</span></li>)}</ul> : <p className="small">All required inputs are supplied by earlier steps.</p>}</details>
          {result.plan.bindings.length > 0 && <details><summary>How outputs become inputs</summary><ul className="small">{result.plan.bindings.map((b, i) => <li key={i}>Step {b.from} → {b.step}: {b.instruction}</li>)}</ul></details>}
          <details><summary>Assumptions and tools</summary><ul className="small">{[...result.plan.assumptions, ...result.plan.warnings].map((s, i) => <li key={i}>{s}</li>)}</ul></details>
          <div className="compose-actions"><button className="btn btn-primary" data-testid="compose-download" disabled={packBusy} onClick={() => void exportPack()}>{packBusy ? "Preparing the files…" : "Download the workflow"}</button><button className="btn btn-dark" onClick={() => { const flow = asFlow(); flows.save(flow); flows.open(flow.id); navigate("/#build"); }}>Open in the builder</button><button className="link-btn" data-testid="compose-export" onClick={exportJson}>Export editable JSON</button></div><p className="small">Your draft is saved in this browser. The pack includes a README, skill files, required inputs and an editable workflow. Its steps have not run yet.</p>
        </> : <div className="compose-empty"><span className="mono">01 → 02 → 03 → ✓</span><h2 className="h3">A complete plan, ready to make your own</h2><p className="small">Your workflow will show what each step does, what it needs and what comes next. Edit the order and instructions before you download.</p><div><b>Free assembly</b><p className="small">Library search, typed connections and built-in checks.</p><b>AI composition</b><p className="small">Request interpretation and instructions tailored to your goal.</p></div></div>}
      </section>
    </div>
    {menu && <ReplaceMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} onReplace={() => { setReplacing(menu.index); setMenu(null); }} />}
    {replacing !== null && result && <SkillReplace c={c} slug={result.plan.steps[replacing].slug} goal={goal} before={result.plan.steps.slice(0, replacing).map(s => s.slug)} after={result.plan.steps.slice(replacing + 1).map(s => s.slug)} customSkills={customSkills} onClose={() => setReplacing(null)} onChoose={(slug, custom) => {
      const library = withCustomSkills(baseCatalogue, custom);
      const steps = result.plan.steps.map((s, i) => i === replacing ? { ...s, slug, reason: "Replacement selected by you. Review retained instructions for the new skill." } : s);
      const plan = finalize(library, { ...result.plan, steps }, result.plan.source);
      setCustomSkills(custom); setResult({ ...result, plan }); toast("Skill replaced. Inputs and connections have been recalculated; review retained notes.");
    }} />}
  </main>;
}
