import { useEffect, useMemo, useRef, useState } from "react";
import { type Catalogue } from "./lib/data";
import { type Choices, type Composition, finalize, freeSelection, LIMITS, QUESTIONS, questionsFor, requestError, validateChoices } from "./lib/composer-core";
import Builder from "./Builder";
import { packFlow, unpackFlow } from "./lib/plan";
import { withCustomSkills, validateCustomSkills, type CustomSkill } from "./lib/custom-skills";
import VoiceRequest from "./VoiceRequest";
import MyMinds from "./MyMinds";
import { compositionFlow } from "./lib/composer-flow";
import { buildHandoffZip, download } from "./lib/handoff";
import { businessText, getBusiness } from "./lib/business";
import { flows, type Flow } from "./lib/store";
import { Link, navigate } from "./lib/router";
import "./compose.css";
import { protectedHeaders } from "./lib/turnstile";
import { useComposerAccount } from "./lib/composer-account";
import ExecutionPrompt from "./ExecutionPrompt";

type Result = { plan: Composition; model: string; cost: number; latencyMs: number; context?: string };

const EXAMPLES = ["Build a landing page from scratch and give me source code", "Turn customer reviews into checked video ad scripts", "Create a weekly KPI report and dashboard", "Design an n8n automation with safe retries"];
export default function ComposePage({ c: baseCatalogue, toast }: { c: Catalogue; toast: (message: string) => void }) {
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const c = useMemo(() => withCustomSkills(baseCatalogue, customSkills), [baseCatalogue, customSkills]);
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [useContext, setUseContext] = useState(false);
  const [mode, setMode] = useState<"free" | "ai">("ai");
  const account = useComposerAccount(mode === "ai");
  const [available, setAvailable] = useState(false);
  const [dictating, setDictating] = useState(false);

  const [connecting, setConnecting] = useState(true);
  const [choices, setChoices] = useState<Choices>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [packBusy, setPackBusy] = useState(false);
  const [graphFlow, setGraphFlow] = useState<Flow | null>(null);
  const [restored, setRestored] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const requestRef = useRef(0);
  useEffect(() => {
    document.title = "Build a custom workflow | AI Blocks";
    let live = true;
    fetch("/api/compose").then(r => { if (!r.ok) throw Error(); return r.json(); }).then(d => { if (live) setAvailable(d.enabled === true); }).catch(() => {}).finally(() => { if (live) setConnecting(false); });
    try { const saved = JSON.parse(localStorage.getItem("abb:composer") ?? "null"); if (saved?.format === "ai-blocks-composition/1") { const custom = validateCustomSkills(saved.customSkills); const plan = finalize(withCustomSkills(baseCatalogue, custom), saved.plan, saved.plan.source); const restoredFlow = typeof saved.flowCode === "string" ? unpackFlow(baseCatalogue, saved.flowCode) : null; if (saved.flowCode !== undefined && !restoredFlow) throw Error("Saved workflow is incomplete."); setCustomSkills(custom); setGoal(saved.goal.slice(0, LIMITS.request)); setChoices(validateChoices(saved.choices ?? {})); setContext(saved.context ?? ""); setResult({ plan, model: saved.model || "free", cost: saved.cost || 0, latencyMs: saved.latencyMs || 0 }); setGraphFlow(restoredFlow); setRestored(true); } } catch { setError("The saved workflow could not be restored without changing its steps. Import a complete copy or create a new workflow."); }
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
  const envelope = () => ({ format: "ai-blocks-composition/1", goal, context: result?.context ?? context, choices, customSkills: graphFlow?.customSkills ?? customSkills, flowCode: graphFlow ? packFlow(graphFlow) : undefined, plan: result?.plan, model: result?.model, cost: result?.cost, latencyMs: result?.latencyMs });
  useEffect(() => { if (result) try { localStorage.setItem("abb:composer", JSON.stringify(envelope())); } catch { /* storage can be unavailable */ } }, [result, goal, context, choices, customSkills, graphFlow]);
  const reset = () => { setGraphFlow(null); setResult(null); setError(""); setRestored(false); requestRef.current++; try { localStorage.removeItem("abb:composer"); } catch {} };
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
    setBusy(true); setGraphFlow(null); setRestored(false);
    try {
      const combined = [context, useContext && businessText(getBusiness())].filter(Boolean).join("\n\n");
      if (combined.length > LIMITS.context) throw Error("Keep added context, including saved context, under 4,000 characters.");
      if (mode === "free") setResult({ plan: finalize(c, freeSelection(c, goal, choices, combined), "free"), model: "free", cost: 0, latencyMs: 0, context: combined });
      else {
        const verification = await protectedHeaders("compose");
        // Human verification can outlast a session JWT; acquire it immediately before sending.
        const token = await account.token();
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
  const initialGraph = useMemo(() => result ? graphFlow ?? { ...compositionFlow(c, result.plan, goal, result.context ?? context), customSkills } : null, [result?.plan]);
  const asFlow = () => graphFlow ?? initialGraph!;
  const exportJson = () => download(new Blob([JSON.stringify(envelope(), null, 2)], { type: "application/json" }), "workflow.edit.json");
  const exportPack = async () => {
    if (!result) return; setPackBusy(true); setError("");
    try {
      const flow = asFlow();
      const built = await buildHandoffZip(withCustomSkills(baseCatalogue, flow.customSkills ?? customSkills), flow, useContext ? getBusiness() : {}, { "workflow.edit.json": JSON.stringify(envelope(), null, 2), "README.md": `# ${result.plan.title}\n\n${result.plan.summary}\n\n## Run\nRead HANDOFF.md. Check the current AI session, supplied context and existing brand brain first. Validate existing artifacts and ask for missing required inputs. Apply every declared step and its checks in order; reusing an artifact does not waive a step. Run the workflow in an AI runner with the tools each skill needs. Code needs a coding environment; browser checks need a rendered preview. Mark checks not run if tools are unavailable.\n\n## Edit\nOpen /compose on AI Blocks and choose Import workflow. Select workflow.edit.json. Edit notes, add or reorder steps, then download again.\n\n## Boundaries\nThis pack is a plan. No skills have run, no page has been published and no agent has been scheduled. Authorize concrete external actions during execution.\n`, "inputs.json": JSON.stringify({ required: result.plan.missing, choices, status: "awaiting-user-inputs" }, null, 2) });
      if ("error" in built) throw Error(built.error); download(built.blob, built.filename); toast("Your workflow pack is downloaded");
    } catch (e) { setError((e as Error).message); } finally { setPackBusy(false); }
  };
  const importPack = async (file?: File) => {
    if (!file) return; setError("");
    try { if (file.size > 1000000) throw Error("Keep the workflow file under 1 MB."); const data = JSON.parse(await file.text()); if (data.format !== "ai-blocks-composition/1" || typeof data.goal !== "string" || data.goal.length > LIMITS.request || typeof data.context !== "string" || data.context.length > LIMITS.context) throw Error("Choose a workflow.edit.json exported from this composer."); const importedFlow = typeof data.flowCode === "string" ? unpackFlow(baseCatalogue, data.flowCode) : null; if (data.flowCode !== undefined && !importedFlow) throw Error("This workflow is incomplete or invalid. No steps were imported. Supply a complete workflow."); const custom = validateCustomSkills(data.customSkills); const plan = finalize(withCustomSkills(baseCatalogue, custom), data.plan, data.plan.source === "ai" ? "ai" : "free"); setCustomSkills(custom); setGoal(data.goal); setContext(data.context); setChoices(validateChoices(data.choices ?? {})); setResult({ plan, model: typeof data.model === "string" ? data.model : "free", cost: Number.isFinite(data.cost) && data.cost >= 0 ? data.cost : 0, latencyMs: 0 }); setGraphFlow(importedFlow); setRestored(true); toast("Your workflow is ready to edit"); } catch (e) { setError((e as Error).message); } finally { if (importRef.current) importRef.current.value = ""; }
  };

  const questions = questionsFor([goal, context, useContext && businessText(getBusiness())].filter(Boolean).join("\n"), choices);
  const hasGeneralTemplate = result?.plan.source === "free" && result.plan.steps.some(s => s.slug === "request-deliverable-drafter");
  const hasSpecialist = result?.plan.steps.some(s => !["request-acceptance-brief", "request-deliverable-drafter", "request-acceptance-checker"].includes(s.slug));
  const usableResult = !(hasGeneralTemplate && !hasSpecialist);
  const possibleQuestions = [...new Set([...questions, ...Object.keys(choices)])].filter(id => Object.hasOwn(QUESTIONS, id));
  return <main className="wrap compose-page" data-testid="compose-page">
    <div className="compose-intro"><span className="mono small">YOUR GOAL → YOUR WORKFLOW</span><h1 className="h2">Build a custom workflow</h1><p className="lede">Describe what you want to achieve. Get a step-by-step workflow with connected skills and checks, ready to edit, download and run in your own AI.</p></div>
    <nav className="compose-navigation" aria-label="Composer sections"><a href="#compose-request">1. Your request</a><a href="#compose-workflow">2. Your workflow</a></nav>
    <div className="compose-layout">
      <section id="compose-request" className="compose-form" aria-label="Your request">
        <div className="compose-tabs" role="tablist" aria-label="How to create your workflow"><button role="tab" disabled={busy} aria-selected={mode === "free"} onClick={() => setMode("free")}>Free assembly</button><button role="tab" disabled={busy} aria-selected={mode === "ai"} onClick={() => setMode("ai")}>AI composition</button></div>
        <p className="small">{mode === "free" ? "Match your request to library skills using browser rules. Requests without a match get a general template. Choose AI composition for a tailored plan." : "Create a tailored workflow for free. Sign in to use your daily allowance. No payment details needed."}</p>
        {mode === "ai" && <div className="compose-account" data-testid="compose-account" aria-label="Workflow account">
          {account.state === "loading" && <p className="small" role="status">Checking sign-in…</p>}
          {account.state === "unconfigured" && <p className="small">Sign-in is being connected. You can use free assembly now.</p>}
          {account.state === "error" && <><p className="small">Sign-in could not load. Free assembly is available.</p><button className="link-btn" onClick={account.retry}>Try sign-in again</button></>}
          {account.state === "signed-out" && <><p className="small">Sign in to create your free AI workflow.</p><div className="compose-actions"><button className="btn btn-dark btn-sm" onClick={() => void signIn()}>Sign in</button><button className="link-btn" onClick={() => void signIn(true)}>Create a free account</button></div></>}
          {account.state === "signed-in" && <><p className="small">Signed in · Free access{account.usage ? ` · ${account.usage.completed} workflows created · ${Math.max(0, account.usage.dailyAttemptLimit - account.usage.attemptsToday)} attempts left today` : ""}</p><button className="link-btn" disabled={busy} onClick={() => void account.signOut()?.catch(() => setError("Sign-out could not finish. Please try again."))}>Sign out</button></>}
        </div>}
        {mode === "ai" && <p className="small compose-policy-note">Account creation and AI submissions are for adults aged 18 or older. Read our <Link to="/terms">Terms of service</Link> and <Link to="/privacy">Privacy policy</Link> before continuing.</p>}
        <MyMinds onSignIn={() => signIn()} />
        <form className="compose-editor-grid" onSubmit={e => { e.preventDefault(); void compose(); }}>
          <div className="compose-request-pane"><label htmlFor="compose-goal">What would you like to get done?</label>
          <div className="compose-request-box">
            <textarea id="compose-goal" data-testid="compose-goal" value={goal} onChange={e => changeGoal(e.currentTarget.value)} maxLength={LIMITS.request} rows={5} placeholder="Build a landing page, check it and give me the source code" required disabled={busy || dictating} />
            <div className="compose-request-footer"><VoiceRequest value={goal} onChange={changeGoal} disabled={busy} onListeningChange={setDictating} /><span className="compose-voice-count small">{goal.length.toLocaleString()} / 10,000 characters</span></div>
          </div>
          </div><div className="compose-settings-pane"><h2 className="compose-settings-title">Make it yours</h2>
          {possibleQuestions.length > 0 && <fieldset><legend>Choices that shape the workflow</legend>{possibleQuestions.map(id => { const q = QUESTIONS[id as keyof typeof QUESTIONS]; return <label key={id} className="compose-choice">{q.text}<select aria-label={q.text} value={choices[id as keyof Choices] ?? ""} disabled={busy} onChange={e => { const value = e.currentTarget.value; reset(); setChoices(v => { const next = { ...v }; if (value) next[id as keyof Choices] = value; else delete next[id as keyof Choices]; return next; }); }}><option value="">Use a sensible starting point</option>{q.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>; })}</fieldset>}
          <details className="compose-context"><summary>Add context and constraints</summary><label htmlFor="compose-context">Audience, offer, available inputs and limits</label><textarea id="compose-context" rows={4} value={context} maxLength={LIMITS.context} onChange={e => { reset(); setContext(e.currentTarget.value); }} disabled={busy} /><label className="compose-check"><input type="checkbox" checked={useContext} onChange={e => { reset(); setUseContext(e.currentTarget.checked); }} disabled={busy} /> Include my saved context</label></details>
          {mode === "ai" && <p className="small">{connecting ? "Checking service availability…" : "Your request, added context and relevant skill descriptions go to our AI provider. The service selects the model and enforces usage limits."}</p>}
          {mode === "ai" && <p className="small compose-policy-note">Generated results and usage records are stored by the service. Share only information you are authorised to provide. <Link to="/privacy#server">How your data is handled</Link>.</p>}
          </div><div className="compose-submit-pane">
          <button className="btn btn-primary" type="submit" data-testid="compose-submit" disabled={busy || dictating || !goal.trim() || mode === "ai" && (!available || connecting || account.state !== "signed-in")}>{busy ? "Connecting your workflow…" : mode === "free" ? "Assemble my workflow" : "Create my workflow"}</button>
          {busy && <p role="status" className="small">This can take up to two minutes. You can keep this page open.</p>}
          <div className="compose-examples" aria-label="Example requests">{EXAMPLES.map(s => <button type="button" key={s} disabled={busy || dictating} onClick={() => changeGoal(s)}>{s}</button>)}</div>
          </div>
        </form>
        <div className="compose-import"><button className="link-btn" onClick={() => importRef.current?.click()} disabled={busy || dictating}>Import workflow</button><input ref={importRef} type="file" accept=".json,application/json" className="visually-hidden" aria-label="Import workflow JSON" onChange={e => void importPack(e.currentTarget.files?.[0])} /></div>
        {error && <p className="compose-error" role="alert">{error}</p>}
      </section>
      <section id="compose-workflow" className="compose-result" ref={resultRef} aria-label="Your workflow" aria-live="polite">
        {busy ? <div className="compose-loading" role="status"><div className="compose-loading-blocks" aria-hidden="true"><span>▧</span><i>→</i><span>▧</span><i>→</i><span>✓</span></div><h2 className="h3">Connecting the dots…</h2><p className="small">Finding the right skills and putting your workflow together.</p></div> : result ? <>
          <div className="compose-result-toolbar"><div><span className="mono small">{usableResult ? "YOUR WORKFLOW" : "YOUR REQUEST"}</span><h2 className="h3">{result.plan.title}</h2></div>{usableResult && <div className="compose-actions"><button className="btn btn-primary" data-testid="compose-download" disabled={packBusy} onClick={() => void exportPack()}>{packBusy ? "Preparing the files…" : "Download the workflow"}</button><button className="btn btn-dark" data-testid="compose-export" onClick={exportJson}>Export editable JSON</button></div>}</div>
          {usableResult && <ExecutionPrompt name={asFlow().name} goal={asFlow().goal} />}
          {restored && <p className="small">Restored from your saved workflow.</p>}
          {usableResult && <p className="small">{result.plan.summary}</p>}
          {hasGeneralTemplate && <div className="compose-match-notice" role="status" data-testid="compose-unmatched"><b>{hasSpecialist ? "Part of your request needs a specialist match" : "Your request did not match a specialist workflow"}</b><p className="small">{hasSpecialist ? "Unmatched parts use" : "The steps below are"} a general brief, draft and check template. Different unmatched requests produce the same steps. Choose AI composition for a tailored workflow.</p>{available ? <button className="btn btn-dark btn-sm" onClick={() => { setMode("ai"); setError(""); }}>Use AI composition for this request</button> : <p className="small">AI composition is currently unavailable. You can replace the template steps with skills from the library.</p>}</div>}
          {usableResult && <><p className="small">Click a step to edit its instructions or assign a mind. Drag blocks to arrange them, or connect their inputs and outputs.</p>
          <div className="compose-workflow-canvas" data-testid="compose-steps">{initialGraph && <Builder key={initialGraph.id} c={baseCatalogue} toast={toast} initialFlow={initialGraph} onFlowChange={setGraphFlow} />}</div>
          <div className="compose-actions"><button className="link-btn" onClick={() => { const flow = asFlow(); flows.save(flow); flows.open(flow.id); navigate("/#build"); }}>Open in the full builder</button></div><p className="small">Your edits are saved in this browser. Download the pack to run it in your AI.</p></>}
        </> : <div className="compose-empty"><span className="mono">01 → 02 → 03 → ✓</span><h2 className="h3">A complete plan, ready to make your own</h2><p className="small">Your workflow will show what each step does, what it needs and what comes next. Edit the order and instructions before you download.</p><div><b>Free assembly</b><p className="small">Library search, typed connections and built-in checks.</p><b>AI composition</b><p className="small">Request interpretation and instructions tailored to your goal.</p></div></div>}
      </section>
    </div>
  </main>;
}
