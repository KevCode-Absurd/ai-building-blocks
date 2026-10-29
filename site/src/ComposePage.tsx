import { REMOTE_LIBRARY_UPDATE, libraryStorage } from "./lib/library-storage";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { type Block, type Catalogue, portLabel, workflowEntries } from "./lib/data";
import { type Choices, type Composition, finalize, LEGACY_REQUEST_LIMIT, LIMITS, QUESTIONS, questionsFor, requestError, startPicks, type StartPick, validateChoices } from "./lib/composer-core";
const Builder = lazy(() => import("./Builder"));
import { flowFrom, packFlow, unpackFlow } from "./lib/plan";
import { withCustomSkills, validateCustomSkills, type CustomSkill } from "./lib/custom-skills";
import VoiceRequest from "./VoiceRequest";
import MyMinds from "./MyMinds";
import { compositionFlow } from "./lib/composer-flow";
import { download } from "./lib/download";
import { businessText, getBusiness } from "./lib/business";
import { captureCompositionContext, planningMeContext, restoreCompositionContext, workflowPlanningContext } from "./lib/composer-context";
import { flows, type Flow } from "./lib/store";
import { Link, navigate } from "./lib/router";
import "./compose.css";
import "./workflow-simplicity.css";
import { protectedHeaders } from "./lib/turnstile";
import { useComposerAccount } from "./lib/composer-account";
import ExecutionPrompt from "./ExecutionPrompt";
import { TransferGuide } from "./DownloadDialog";

type Result = { plan: Composition; model: string; cost: number; latencyMs: number; context?: string };

const EXAMPLES = ["Build a landing page from scratch and give me source code", "Turn customer reviews into checked video ad scripts", "Create a weekly KPI report and dashboard", "Design an n8n automation with safe retries"];
// Until the task library arrives the page is already usable: the request form shows at once and only planning waits.
const EMPTY: Catalogue = { built: "", portTypes: {}, renamed: {}, blocks: [], bySlug: {} };
export default function ComposePage({ c: loaded, toast, requestCatalogue }: { c: Catalogue | null; toast: (message: string) => void; requestCatalogue: () => Promise<Catalogue> }) {
  const baseCatalogue = loaded ?? EMPTY;
  useEffect(() => {
    // Existing local or account workflows still restore without a click.
    const restore = () => { if (libraryStorage.getItem("abb:composer")) void requestCatalogue().catch(() => {}); };
    restore(); window.addEventListener(REMOTE_LIBRARY_UPDATE, restore);
    return () => window.removeEventListener(REMOTE_LIBRARY_UPDATE, restore);
  }, [requestCatalogue]);
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const c = useMemo(() => withCustomSkills(baseCatalogue, customSkills), [baseCatalogue, customSkills]);
  const [goal, setGoal] = useState("");
  const defaultChoice = (id: string) => id === "mode" ? "Create from scratch" : id === "reference" ? "Original direction" : id === "delivery" ? "Source code" : "Follow your request";
  const [review, setReview] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [context, setContext] = useState("");
  const [contextChoice, setUseContext] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"free" | "ai">("ai");
  const useContext = contextChoice ?? (mode === "ai");
  const [assignMinds, setAssignMinds] = useState(true);
  const account = useComposerAccount(mode === "ai");
  const networkLimit = account.usage && "dailyIpAttemptLimit" in account.usage ? account.usage.dailyIpAttemptLimit : undefined;
  const networkNote = typeof networkLimit === "number" ? ` A separate network limit of ${networkLimit} attempts per day applies.` : networkLimit === null ? "" : " A separate daily network limit may apply.";
  const [available, setAvailable] = useState(false);
  const [dictating, setDictating] = useState(false);

  const [connecting, setConnecting] = useState(true);
  const [choices, setChoices] = useState<Choices>({});
  const [result, setResult] = useState<Result | null>(null);
  // Free mode: where to start, not a whole plan. The chosen step opens in the builder, which suggests what goes before and after it.
  const [picks, setPicks] = useState<{ tasks: StartPick<Block>[]; workflows: StartPick<Block>[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [packBusy, setPackBusy] = useState(false);
  const [preparedZip, setPreparedZip] = useState<string | null>(null);
  const [graphFlow, setGraphFlow] = useState<Flow | null>(null);
  const [restored, setRestored] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const explicitImport = useRef(false);
  const resultRef = useRef<HTMLElement>(null);
  const requestRef = useRef(0);
  const remoteApplying = useRef(false), lastPersisted = useRef<string | null>(null);
  const editing = useRef({ busy, result, goal }); editing.current = { busy, result, goal };
  useEffect(() => {
    document.title = "Build a custom workflow | AI Blocks";
    let live = true;
    fetch("/api/compose").then(r => { if (!r.ok) throw Error(); return r.json(); }).then(d => { if (live) setAvailable(d.enabled === true); }).catch(() => {}).finally(() => { if (live) setConnecting(false); });
    if (loaded && !explicitImport.current) try { const saved = JSON.parse(libraryStorage.getItem("abb:composer") ?? "null"); if (saved?.format === "ai-blocks-composition/1") { remoteApplying.current = true; const savedContext = restoreCompositionContext(saved); const custom = validateCustomSkills(saved.customSkills); const plan = finalize(withCustomSkills(baseCatalogue, custom), saved.plan, saved.plan.source); const restoredFlow = typeof saved.flowCode === "string" ? unpackFlow(baseCatalogue, saved.flowCode) : null; if (saved.flowCode !== undefined && !restoredFlow) throw Error("Saved workflow is incomplete."); setCustomSkills(custom); setGoal(saved.goal); setAssignMinds(saved.assignMinds !== false); setChoices(validateChoices(saved.choices ?? {})); setContext(savedContext.context); setUseContext(savedContext.useContext); setResult({ plan, context: savedContext.planningContext, model: saved.model || "free", cost: saved.cost || 0, latencyMs: saved.latencyMs || 0 }); setGraphFlow(restoredFlow); setRestored(true); setReview(true); } } catch { setError("The saved workflow could not be restored without changing its steps. Import a complete copy or create a new workflow."); }
    try {
      const pending = JSON.parse(sessionStorage.getItem("abb:composer-signin") ?? "null");
      sessionStorage.removeItem("abb:composer-signin");
      if (pending && typeof pending.goal === "string" && typeof pending.context === "string") {
        setGoal(pending.goal); setContext(pending.context.slice(0, LIMITS.context));
        setChoices(validateChoices(pending.choices ?? {})); setUseContext(pending.useContext === true);
        setAssignMinds(pending.assignMinds !== false);
        setCustomSkills(validateCustomSkills(pending.customSkills)); setResult(null); setMode("ai");
      }
    } catch { /* Invalid local drafts never block sign-in. */ }
    return () => { live = false; requestRef.current++; abortRef.current?.abort(); };
  }, [baseCatalogue]);
  const initialGraph = useMemo(() => result ? graphFlow ?? { ...compositionFlow(c, result.plan, goal, context), customSkills } : null, [result?.plan]);
  const envelope = () => {
    const flow = graphFlow ?? initialGraph;
    return { format: "ai-blocks-composition/1", goal, ...captureCompositionContext(context, result?.context ?? context, useContext), choices, assignMinds, customSkills: flow?.customSkills ?? customSkills, flowCode: flow ? packFlow(flow) : undefined, plan: result?.plan, model: result?.model, cost: result?.cost, latencyMs: result?.latencyMs };
  };
  useEffect(() => { if (result) try {
    const raw = JSON.stringify(envelope());
    if (remoteApplying.current) { remoteApplying.current = false; lastPersisted.current = raw; return; }
    if (raw !== lastPersisted.current) { libraryStorage.setItem("abb:composer", raw); lastPersisted.current = raw; }
  } catch { /* storage can be unavailable */ } }, [result, goal, context, useContext, choices, assignMinds, customSkills, graphFlow]);
  useEffect(() => {
    const received = (event: Event) => {
      if (!loaded || !(event as CustomEvent<string[]>).detail.includes("abb:composer")) return;
      if (editing.current.busy || !editing.current.result && editing.current.goal.trim()) return;
      try {
        const saved = JSON.parse(libraryStorage.getItem("abb:composer") ?? "null");
        if (saved?.format === "ai-blocks-composition/1") {
          const savedContext = restoreCompositionContext(saved); const custom = validateCustomSkills(saved.customSkills), plan = finalize(withCustomSkills(baseCatalogue, custom), saved.plan, saved.plan.source);
          const restoredFlow = typeof saved.flowCode === "string" ? unpackFlow(baseCatalogue, saved.flowCode) : null;
          if (saved.flowCode !== undefined && !restoredFlow) throw Error();
          remoteApplying.current = true; setPreparedZip(null); setCustomSkills(custom); setGoal(saved.goal); setAssignMinds(saved.assignMinds !== false); setChoices(validateChoices(saved.choices ?? {})); setContext(savedContext.context); setUseContext(savedContext.useContext); setResult({ plan, context: savedContext.planningContext, model: saved.model || "free", cost: saved.cost || 0, latencyMs: saved.latencyMs || 0 }); setGraphFlow(restoredFlow); setRestored(true); setReview(true);
        } else if (!saved) { remoteApplying.current = false; lastPersisted.current = null; setResult(null); setGraphFlow(null); setPreparedZip(null); }
      } catch { setError("The updated workflow could not be opened. Your saved account copy is intact."); }
    };
    window.addEventListener(REMOTE_LIBRARY_UPDATE, received); return () => window.removeEventListener(REMOTE_LIBRARY_UPDATE, received);
  }, [baseCatalogue]);
  const reset = () => { setPreparedZip(null); setGraphFlow(null); setResult(null); setPicks(null); setError(""); setRestored(false); requestRef.current++; try { libraryStorage.removeItem("abb:composer"); } catch {} };
  const changeGoal = (value: string) => { reset(); setReview(false); setGoal(value); setChoices({}); };
  const signIn = async (signUp = false) => {
    try {
      sessionStorage.setItem("abb:composer-signin", JSON.stringify({ goal, context, choices, useContext, customSkills, assignMinds }));
      await account.signIn(signUp);
    } catch { setError("Sign-in could not open. Please try again."); }
  };
  const compose = async () => {
    if (!loaded) { setError("The task library is still loading. Try again in a moment."); return; }
    setError(""); const invalid = requestError(goal); if (invalid) { setError(invalid); return; }
    if (mode === "ai" && !available) { setError("AI planning is unavailable. Open Customize and choose Find steps from the library if you want browser matching instead."); return; }
    if (mode === "ai" && account.state !== "signed-in") { setError("Sign in to generate a free AI workflow."); return; }
    const id = ++requestRef.current;
    const controller = new AbortController(); abortRef.current = controller;
    const timeout = window.setTimeout(() => { controller.abort(); if (requestRef.current === id) { requestRef.current++; setBusy(false); setError("Planning timed out. Your request and earlier plan are still here. Try again when you are ready."); } }, 120000);
    setBusy(true); setRestored(false);
    try {
      if (mode === "free") { setPreparedZip(null); setGraphFlow(null); setResult(null); setPicks(startPicks(baseCatalogue, goal, 6)); }
      else {
        const combined = workflowPlanningContext(context, useContext ? businessText(getBusiness()) : "", goal, useContext);
        const verification = await protectedHeaders("compose");
        // Human verification can outlast a session JWT; acquire it immediately before sending.
        const token = await account.token();
        const response = await fetch("/api/compose", { method: "POST", signal: controller.signal, headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID(), authorization: `Bearer ${token}`, ...verification }, body: JSON.stringify({ goal, context: combined, choices, assignMinds }) });
        if (response.status === 401) account.expired();
        const out = await response.json(); if (!response.ok) throw Error(out.error || "The model could not finish. Try free assembly.");
        if (requestRef.current === id) { const nextPlan = finalize(c, out.plan, "ai", undefined, assignMinds); setPreparedZip(null); setGraphFlow(null); setResult({ ...out, context: combined, plan: nextPlan }); }
        void account.refreshUsage();
      }
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
    } catch (e) { if (requestRef.current === id) setError(controller.signal.aborted ? "Planning stopped. Your request is still here. Try again when you are ready." : e instanceof Error ? e.message : "The workflow could not be created."); }
    finally { window.clearTimeout(timeout); if (requestRef.current === id) setBusy(false); }
  };
  const asFlow = () => graphFlow ?? initialGraph!;
  // Opens the chosen start (one step, or a ready workflow's steps) in the builder, with the request as its goal.
  const startWith = (b: Block) => {
    const slugs = b.steps.length ? workflowEntries(b).filter(s => baseCatalogue.bySlug[s]) : [b.slug];
    const flow = { ...flowFrom(baseCatalogue, b.steps.length ? b.name : goal.trim().replace(/^./, m => m.toUpperCase()).slice(0, 80), slugs), goal: goal.trim() };
    flows.save(flow); flows.open(flow.id); navigate("/#build");
  };
  const exportJson = () => download(new Blob([JSON.stringify(envelope(), null, 2)], { type: "application/json" }), "workflow.edit.json");
  const exportPack = async () => {
    if (!result) return; setPackBusy(true); setError("");
    try {
      const flow = asFlow();
      const packBusiness = useContext ? getBusiness() : {};
      const {buildHandoffZip} = await import("./lib/handoff");
      const built = await buildHandoffZip(withCustomSkills(baseCatalogue, flow.customSkills ?? customSkills), flow, packBusiness, { "workflow.edit.json": JSON.stringify(envelope(), null, 2), "README.md": `# ${result.plan.title}\n\n${result.plan.summary}\n\n## Run\nRead HANDOFF.md. Check the current AI session, supplied context and existing brand brain first. Validate existing artifacts and ask for missing required inputs. Apply every declared step and its checks in order; reusing an artifact does not waive a step. Run the workflow in an AI runner with the tools each skill needs. Code needs a coding environment; browser checks need a rendered preview. Mark checks not run if tools are unavailable.\n\n## Edit\nOpen /compose on AI Blocks and choose Import workflow. Select workflow.edit.json. Edit notes, add or reorder steps, then download again.\n\n## Boundaries\nThis pack is a plan. No skills have run, no page has been published and no agent has been scheduled. Authorize concrete external actions during execution.\n`, "inputs.json": JSON.stringify({ required: result.plan.missing, choices, context: result.context ?? context, status: "verify-supplied-context-first", notice: "Planning context is supplied but unvalidated. Check it and earlier artifacts before asking for any missing input. It does not establish accepted execution inputs or permission." }, null, 2) });
      if ("error" in built) throw Error(built.error); download(built.blob, built.filename); setPreparedZip(built.filename); toast("Your workflow pack is downloaded");
    } catch (e) { setError((e as Error).message); } finally { setPackBusy(false); }
  };
  const importPack = async (file?: File) => {
    if (!file) return; explicitImport.current = true; setError("");
    try { const importCatalogue = loaded ?? await requestCatalogue(); if (file.size > 1000000) throw Error("Keep the workflow file under 1 MB."); const data = JSON.parse(await file.text()); if (data.format !== "ai-blocks-composition/1" || typeof data.goal !== "string" || data.goal.length > LEGACY_REQUEST_LIMIT) throw Error("Choose a workflow.edit.json exported from this composer."); const savedContext = restoreCompositionContext(data); const importedFlow = typeof data.flowCode === "string" ? unpackFlow(importCatalogue, data.flowCode) : null; if (data.flowCode !== undefined && !importedFlow) throw Error("This workflow is incomplete or invalid. No steps were imported. Supply a complete workflow."); const custom = validateCustomSkills(data.customSkills); const plan = finalize(withCustomSkills(importCatalogue, custom), data.plan, data.plan.source === "ai" ? "ai" : "free"); setCustomSkills(custom); setGoal(data.goal); setAssignMinds(data.assignMinds !== false); setContext(savedContext.context); setUseContext(savedContext.useContext); setChoices(validateChoices(data.choices ?? {})); setResult({ plan, context: savedContext.planningContext, model: typeof data.model === "string" ? data.model : "free", cost: Number.isFinite(data.cost) && data.cost >= 0 ? data.cost : 0, latencyMs: 0 }); setGraphFlow(importedFlow); setPreparedZip(null); setRestored(true); setReview(true); toast("Your workflow is ready to edit"); } catch (e) { setError(e instanceof SyntaxError ? "This file could not be read. Choose workflow.edit.json from a previous download. Your current workflow is kept." : (e as Error).message); } finally { if (importRef.current) importRef.current.value = ""; }
  };

  const questions = questionsFor([goal, context, useContext && planningMeContext(businessText(getBusiness()), goal)].filter(Boolean).join("\n"), choices);
  const hasGeneralTemplate = result?.plan.source === "free" && result.plan.steps.some(s => s.slug === "request-deliverable-drafter");
  const hasSpecialist = result?.plan.steps.some(s => !["request-acceptance-brief", "request-deliverable-drafter", "request-acceptance-checker"].includes(s.slug));
  const usableResult = !(hasGeneralTemplate && !hasSpecialist);
  const possibleQuestions = [...new Set([...questions, ...Object.keys(choices)])].filter(id => Object.hasOwn(QUESTIONS, id));
  return <main className="wrap compose-page" data-testid="compose-page" onFocusCapture={() => { void requestCatalogue().catch(() => {}); }} onPointerDownCapture={() => { void requestCatalogue().catch(() => {}); }}>
    <div className="compose-intro"><span className="mono small">YOUR GOAL → YOUR WORKFLOW</span><h1 className="h2">Build a custom workflow</h1><p className="lede">Describe what you want to achieve. Get a step-by-step workflow with connected skills and checks, ready to edit, download and run in your own AI.</p><p className="small compose-source-entry">Already have an article, transcript or document? <Link to="/from-a-source" data-testid="compose-from-source">Start from a link or document</Link>.</p></div>
    <nav className="compose-navigation" aria-label="Composer sections"><a href="#compose-request">1. Your request</a>{busy || result || picks ? <a href="#compose-workflow">2. Your workflow</a> : <span aria-disabled="true">2. Your workflow</span>}</nav>
    <div className="compose-layout">
      <section id="compose-request" className="compose-form" aria-label="Your request">
        <form className="compose-editor-grid" onSubmit={e => { e.preventDefault(); if (!review) { const invalid = requestError(goal); if (invalid) setError(invalid); else { setError(""); setReview(true); } } else void compose(); }}>
          <div className="compose-request-pane"><label htmlFor="compose-goal">What would you like to get done?</label>
          <div className="compose-request-box">
            <textarea id="compose-goal" data-testid="compose-goal" value={goal} onChange={e => changeGoal(e.currentTarget.value)} maxLength={LIMITS.request} rows={5} placeholder="Build a landing page, check it and give me the source code" aria-describedby="compose-goal-help" required disabled={busy || dictating} />
            <div className="compose-request-footer"><VoiceRequest value={goal} onChange={changeGoal} disabled={busy} onListeningChange={setDictating} /><span className="compose-voice-count small">{goal.length.toLocaleString()} / {LIMITS.request.toLocaleString()} characters{goal.length > LIMITS.request ? " · Shorten this draft before creating a new workflow." : ""}</span></div>
          </div>
          <p className="small compose-goal-help" id="compose-goal-help">Say what you need, who it is for and the format you want. Try an example below if you are unsure.</p>
          {mode === "ai" && <div><label className="compose-check"><input type="checkbox" data-testid="compose-assign-minds" checked={assignMinds} disabled={busy || dictating} onChange={event => setAssignMinds(event.currentTarget.checked)} aria-describedby="compose-minds-help" /> Assign minds to tasks</label><p className="small" id="compose-minds-help">Uses a suggested perspective for each step. Complex decisions may use a small group. You can change or remove them.</p></div>}
          </div>{review && <details className="compose-settings-pane workflow-options"><summary>Customize the plan (optional)</summary>
          {possibleQuestions.length > 0 && <fieldset><legend>Choices that shape the workflow</legend>{possibleQuestions.map(id => { const q = QUESTIONS[id as keyof typeof QUESTIONS]; return <label key={id} className="compose-choice">{q.text}<select aria-label={q.text} value={choices[id as keyof Choices] ?? ""} disabled={busy} onChange={e => { const value = e.currentTarget.value; reset(); setChoices(v => { const next = { ...v }; if (value) next[id as keyof Choices] = value; else delete next[id as keyof Choices]; return next; }); }}><option value="">Starting point: {defaultChoice(id)}</option>{q.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>; })}</fieldset>}
          <details className="compose-context"><summary>Add context and constraints</summary><label htmlFor="compose-context">Audience, offer, available inputs and limits</label><textarea id="compose-context" rows={4} value={context} maxLength={LIMITS.context} onChange={e => { reset(); setContext(e.currentTarget.value); }} disabled={busy} /><label className="compose-check"><input type="checkbox" checked={useContext} onChange={e => { reset(); setUseContext(e.currentTarget.checked); }} disabled={busy} /> Use relevant parts of my saved me.md</label><p className="small">AI planning uses your work, projects and limits when saved. Turn this off to use only your notes.</p></details>
          {mode === "ai" && <p className="small">{connecting ? "Checking service availability…" : "Your request, added context and relevant skill descriptions go to our AI provider. When Assign minds is on, public mind profiles go too. The service selects the model and enforces usage limits."}</p>}
          {mode === "ai" && <p className="small compose-policy-note">Generated results and usage records are stored by the service. Share only information you are authorised to provide. <Link to="/privacy#server">How your data is handled</Link>.</p>}
          </details>}<div className="compose-submit-pane">
          <button className="btn btn-primary" type="submit" data-testid="compose-submit" disabled={!loaded || busy || dictating || !goal.trim() || goal.length > LIMITS.request || review && mode === "ai" && (!available || connecting || account.state !== "signed-in")}>{busy ? "Preparing your plan…" : !review ? "Continue" : mode === "free" ? "Find where to start" : "Create my plan"}</button>
          {!loaded && <span className="small compose-loading" role="status">Loading the task library…</span>}
          {busy && <button type="button" className="link-btn" onClick={() => { abortRef.current?.abort(); requestRef.current++; setBusy(false); setError("Planning stopped. Your request is still here."); }}>Stop planning</button>}
          <div className="compose-examples" aria-label="Example requests">{EXAMPLES.map(s => <button type="button" key={s} disabled={busy || dictating} onClick={() => changeGoal(s)}>{s}</button>)}</div>
          </div>
        </form>
        {review && <div className="compose-next-step"><h2 className="h3">Create your step-by-step plan</h2><p className="small">{!connecting && !available && mode === "ai" ? "AI planning is unavailable. Choose library matching in Customize if you want to continue without AI planning. " : ""}Your AI will do the work after you download the plan. Review the optional choices, then create your plan.</p>        {mode === "ai" && <div className="compose-account" data-testid="compose-account" aria-label="Workflow account">
          {account.state === "loading" && <p className="small" role="status">Checking sign-in…</p>}
          {account.state === "unconfigured" && <p className="small">Sign-in is unavailable. Open Customize and choose Find steps from the library to use browser matching.</p>}
          {account.state === "error" && <><p className="small">Sign-in could not load. Retry, or choose library matching in Customize.</p><button className="link-btn" onClick={account.retry}>Try sign-in again</button></>}
          {account.state === "signed-out" && <><p className="small">Create up to five free AI workflows per day. Sign in to begin.</p><div className="compose-actions"><button className="btn btn-dark btn-sm" onClick={() => void signIn()}>Sign in</button><button className="link-btn" onClick={() => void signIn(true)}>Create a free account</button></div></>}
          {account.state === "signed-in" && <><p className="small">Signed in · Free access{account.usage ? ` · ${account.usage.completed} workflows created${account.usage.unlimited === true ? " · No daily account count limit" : typeof account.usage.dailyAttemptLimit === "number" ? ` · ${Math.max(0, account.usage.dailyAttemptLimit - account.usage.attemptsToday)} attempts left today` : ""}` : ""}</p><button className="link-btn" disabled={busy} onClick={() => void account.signOut()?.catch(() => setError("Sign-out could not finish. Please try again."))}>Sign out</button></>}
        </div>}
        {mode === "ai" && <p className="small compose-policy-note">Account creation and AI submissions are for adults aged 18 or older. Read our <Link to="/terms">Terms of service</Link> and <Link to="/privacy">Privacy policy</Link> before continuing.</p>}
</div>}
        <details className="compose-customize workflow-options"><summary>Customize: planner, minds and imports</summary>        <div className="compose-tabs" role="tablist" aria-label="How to create your workflow"><button role="tab" disabled={busy} aria-selected={mode === "free"} onClick={() => setMode("free")}>Find steps from the library</button><button role="tab" disabled={busy} aria-selected={mode === "ai"} onClick={() => setMode("ai")}>AI planning</button></div>
        <p className="small">{mode === "free" ? "Find one step to start with from the library. The builder then suggests steps to add before and after it. Choose AI planning for a full plan." : account.usage?.unlimited === true ? `Your account has no daily workflow count limit.${networkNote} Service spending and safety limits still apply.` : "Create up to five free AI workflows per day. Failed attempts count toward your allowance. Resets at 00:00 UTC (5:30 a.m. India time). No payment details needed."}</p>
<MyMinds onSignIn={() => signIn()} />
        <div className="compose-import"><button className="link-btn" onClick={() => importRef.current?.click()} disabled={busy || dictating}>Import workflow</button><input ref={importRef} type="file" accept=".json,application/json" className="visually-hidden" aria-label="Import workflow JSON" onChange={e => void importPack(e.currentTarget.files?.[0])} /></div></details>
        {error && <p className="compose-error" role="alert">{error}</p>}
      </section>
      <section hidden={!busy && !result && !picks} id="compose-workflow" className="compose-result" ref={resultRef} aria-label="Your workflow">
        {busy ? <div className="compose-loading" role="status"><div className="compose-loading-blocks" aria-hidden="true"><span>▧</span><i>→</i><span>▧</span><i>→</i><span>✓</span></div><h2 className="h3">Preparing your plan…</h2><p className="small">Finding the right skills and putting your workflow together.</p></div> : result ? <>
          <div className="compose-result-toolbar"><div><span className="mono small">{usableResult ? "YOUR WORKFLOW" : "YOUR REQUEST"}</span><h2 className="h3">{result.plan.title}</h2></div>{usableResult && <div className="compose-actions"><button className="btn btn-primary" data-testid="compose-download" disabled={packBusy} onClick={() => void exportPack()}>{packBusy ? "Preparing the files…" : "Download the workflow"}</button><details className="workflow-options"><summary>Other formats</summary><p className="small">Editable JSON reopens this plan in AI Blocks. To run the plan in your AI, download the workflow.</p><button className="btn btn-dark" data-testid="compose-export" onClick={exportJson}>Export editable JSON</button></details></div>}</div>
          {usableResult && <p className="workflow-plan-status" data-testid="plan-ready" role="status">Plan ready. No steps have run yet.</p>}
          {usableResult && <details className="workflow-options workflow-run-help" data-testid="compose-run-help"><summary>How do I get my result?</summary><ol><li>Review the steps, then download the workflow.</li><li>Unzip it and give the complete files to your AI.</li><li>Ask your AI to read START_HERE.txt and follow HANDOFF.md. Add the material it asks for.</li></ol><p className="small">Copy AI instructions gives you a first message to send with the files. Your AI makes the result in your chat or workspace.</p><a href="/how-it-works#use-in-ai" target="_blank" rel="noopener noreferrer">Read the steps in a new tab</a></details>}
          {usableResult && <ExecutionPrompt name={asFlow().name} goal={asFlow().goal} />}
          {restored && <p className="small">Restored from your saved workflow.</p>}
          {usableResult && <p className="small">{result.plan.summary}</p>}
          {usableResult && result.plan.missing.length > 0 && <details className="workflow-options" data-testid="workflow-inputs"><summary>Inputs your AI will check ({result.plan.missing.length})</summary><p className="small">You can download now. Your request, saved context or earlier files may already supply these. Your AI checks those first and asks only for missing inputs. You do not need to upload private files here.</p><ul>{result.plan.missing.map(item => <li key={item.type}>{portLabel(item.type)} · needed by step {item.steps.join(", ")}</li>)}</ul></details>}
          {hasGeneralTemplate && <div className="compose-match-notice" role="status" data-testid="compose-unmatched"><b>{hasSpecialist ? "Part of your request needs a specialist match" : "Your request did not match a specialist workflow"}</b><p className="small">{hasSpecialist ? "Unmatched parts use" : "The steps below are"} a general brief, draft and check template. Different unmatched requests produce the same steps. Choose AI composition for a tailored workflow.</p>{available ? <button className="btn btn-dark btn-sm" onClick={() => { setMode("ai"); setError(""); }}>Use AI composition for this request</button> : <p className="small">AI composition is currently unavailable. You can replace the template steps with skills from the library.</p>}</div>}
          {usableResult && <><p className="small">Read the steps in order. Open a step to see what to add and what it makes. Use Diagram view to edit connections.</p>
          <div className="compose-workflow-canvas" data-testid="compose-steps">{initialGraph && <Suspense fallback={<p className="small" role="status">Opening the steps…</p>}><Builder key={initialGraph.id} c={baseCatalogue} toast={toast} initialFlow={initialGraph} onFlowChange={setGraphFlow} onDelete={reset} /></Suspense>}</div>
          <div className="compose-actions"><button className="link-btn" onClick={() => { const flow = asFlow(); flows.save(flow); flows.open(flow.id); navigate("/#build"); }}>Open in the full builder</button></div>{preparedZip && <TransferGuide name={asFlow().name} goal={asFlow().goal} zip={preparedZip} />}</>}
        </> : picks ? <div className="compose-start" data-testid="compose-start">
          <span className="mono small">START WITH</span><h2 className="h3">Pick your first step</h2>
          {picks.tasks.length ? <><p className="small">Choose the step that makes what you want. The builder then shows what to add before and after it.</p>
            <ol className="compose-start-list">{picks.tasks.map(({ b, why }) => <li key={b.slug} data-slug={b.slug}><div><b>{b.name}</b><p className="small">{b.summary}</p><small>{why}</small></div><button type="button" className="btn btn-dark btn-sm" onClick={() => startWith(b)} aria-label={`Start with: ${b.name}`}>Start with this</button></li>)}</ol></>
            : <p className="small" role="status">No step in the library fits this yet. Try other words, or use AI planning for a full plan.</p>}
          {picks.workflows.length > 0 && <><h3 className="h4">Or open a ready workflow</h3><ul className="compose-start-list">{picks.workflows.map(({ b, why }) => <li key={b.slug} data-slug={b.slug}><div><b>{b.name}</b><p className="small">{b.summary}</p><small>{why}</small></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => startWith(b)} aria-label={`Open workflow: ${b.name}`}>Open workflow</button></li>)}</ul></>}
        </div> : <div className="compose-empty"><span className="mono">01 → 02 → 03 → ✓</span><h2 className="h3">A complete plan, ready to make your own</h2><p className="small">Your workflow will show what each step does, what it needs and what comes next. Edit the order and instructions before you download.</p></div>}
      </section>
    </div>
  </main>;
}
