import { REMOTE_LIBRARY_UPDATE, libraryStorage } from "./lib/library-storage";
import {takeRolePlannerSeed} from "./roles/role-transfer";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Block, type Catalogue, portLabel, workflowEntries } from "./lib/data";
import { type Choices, LEGACY_REQUEST_LIMIT, LIMITS, QUESTIONS, questionsFor, requestError, validateChoices } from "./lib/composer-request";
import type {Composition,StartPick} from "./lib/composer-core";
const Builder = lazy(() => import("./Builder"));
import { withCustomSkills, validateCustomSkills, type CustomSkill } from "./lib/custom-skill-data";
import VoiceRequest from "./VoiceRequest";
const MyMinds = lazy(() => import("./MyMinds"));
import { download } from "./lib/download";
import { businessText, getBusiness } from "./lib/business";
import { captureCompositionContext, planningMeContext, restoreCompositionContext, workflowPlanningContext } from "./lib/composer-context";
import { flows, useStore, type Flow } from "./lib/store";
import { Link, navigate } from "./lib/router";
import "./compose.css";
import "./workflow-simplicity.css";
import { protectedHeaders } from "./lib/turnstile";
import { useComposerAccount } from "./lib/composer-account";
import AimHigher, { type AimAnswers } from "./AimHigher";
import { aimHigherText } from "./lib/aim-higher.mjs";
const ExecutionPrompt = lazy(() => import("./ExecutionPrompt"));
const TransferGuide = lazy(() => import("./DownloadDialog").then(m => ({default: m.TransferGuide})));

type WorkflowRuntime = typeof import("./lib/composer-runtime");
let runtimePromise: Promise<WorkflowRuntime> | null = null;
const loadRuntime = () => runtimePromise ??= import("./lib/composer-runtime").catch(error => { runtimePromise = null; throw error; });

/** What the plan was made from. Editing the request afterwards never deletes the plan; it only shows it is for the earlier request. */
type PlanRequest = { goal: string; context: string; useContext: boolean; choices: Choices; assignMinds: boolean };
type Result = { plan: Composition; model: string; cost: number; latencyMs: number; context?: string; request?: PlanRequest; workflowId?: string; createdAt?: number };
const sameRequest = (a: PlanRequest, b: PlanRequest) => a.goal === b.goal && a.context === b.context && a.useContext === b.useContext && a.assignMinds === b.assignMinds && JSON.stringify(a.choices) === JSON.stringify(b.choices);
const newWorkflowId = () => `plan-${crypto.randomUUID().slice(0, 13)}`;

const EXAMPLES = ["Build a landing page from scratch and give me source code", "Turn customer reviews into checked video ad scripts", "Create a weekly KPI report and dashboard", "Design an n8n automation with safe retries"];
// Until the task library arrives the page is already usable: the request form shows at once and only planning waits.
const EMPTY: Catalogue = { built: "", portTypes: {}, renamed: {}, blocks: [], bySlug: {} };
export default function ComposePage({ c: loaded, toast, requestCatalogue }: { c: Catalogue | null; toast: (message: string) => void; requestCatalogue: () => Promise<Catalogue> }) {
  const baseCatalogue = loaded ?? EMPTY;
  const [runtime, setRuntime] = useState<WorkflowRuntime | null>(null);
  const prepareRuntime = useCallback(() => loadRuntime().then(value => { setRuntime(value); return value; }).catch(error => { setError("The workflow tools could not load. Check your connection and try again."); throw error; }), []);
  const prepareCatalogue = useCallback(() => Promise.all([requestCatalogue(), prepareRuntime()]).then(([catalogue]) => catalogue), [requestCatalogue, prepareRuntime]);
  useEffect(() => { if (loaded) void prepareRuntime().catch(() => {}); }, [loaded, prepareRuntime]);
  useEffect(() => {
    // Existing local or account workflows still restore without a click.
    const restore = () => { if (libraryStorage.getItem("abb:composer")) void prepareCatalogue().catch(() => {}); };
    restore(); window.addEventListener(REMOTE_LIBRARY_UPDATE, restore);
    return () => window.removeEventListener(REMOTE_LIBRARY_UPDATE, restore);
  }, [prepareCatalogue]);
  const [customizeOpened, setCustomizeOpened] = useState(() => {
    try { return !!sessionStorage.getItem("abb:mind-editor-signin"); } catch { return false; }
  });
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const c = useMemo(() => withCustomSkills(baseCatalogue, customSkills), [baseCatalogue, customSkills]);
  const [goal, setGoal] = useState("");
  const defaultChoice = (id: string) => id === "mode" ? "Create from scratch" : id === "reference" ? "Original direction" : id === "delivery" ? "Source code" : "Follow your request";
  const abortRef = useRef<AbortController | null>(null);
  const [context, setContext] = useState("");
  const [aim, setAim] = useState<AimAnswers>({});
  const [contextChoice, setUseContext] = useState<boolean | null>(null);
  // null: choose for the visitor. A free quick plan before sign-in; an AI plan once signed in and available.
  const [mode, setMode] = useState<"free" | "ai" | null>(null);
  const [assignMinds, setAssignMinds] = useState(true);
  const account = useComposerAccount(true);
  const networkLimit = account.usage && "dailyIpAttemptLimit" in account.usage ? account.usage.dailyIpAttemptLimit : undefined;
  const networkNote = typeof networkLimit === "number" ? ` A separate network limit of ${networkLimit} attempts per day applies.` : networkLimit === null ? "" : " A separate daily network limit may apply.";
  const [available, setAvailable] = useState(false);
  const planner: "free" | "ai" = mode ?? (account.state === "signed-in" && available ? "ai" : "free");
  const useContext = contextChoice ?? (planner === "ai");
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
  const savedFlows = useStore(s => s.flows);
  // True once the person edits the plan on this page. A restored plan never overwrites a newer copy in Workflows.
  const editedHere = useRef(false);
  const onPlanEdit = useCallback((flow: Flow) => { editedHere.current = true; setGraphFlow(flow); }, []);
  const importRef = useRef<HTMLInputElement>(null);
  const explicitImport = useRef(false);
  const resultRef = useRef<HTMLElement>(null);
  const requestRef = useRef(0);
  const remoteApplying = useRef(false), lastPersisted = useRef<string | null>(null);
  const editing = useRef({ busy, result, goal }); editing.current = { busy, result, goal };
  useEffect(() => {
    const seed = takeRolePlannerSeed();
    if (seed) { explicitImport.current = true; setGoal(seed.goal); setContext(seed.context); setUseContext(seed.useContext); setResult(null); void prepareCatalogue().catch(() => {}); }
  }, []);
  useEffect(() => {
    document.title = "Build a workflow | AI Blocks";
    let live = true;
    fetch("/api/compose").then(r => { if (!r.ok) throw Error(); return r.json(); }).then(d => { if (live) setAvailable(d.enabled === true); }).catch(() => {}).finally(() => { if (live) setConnecting(false); });
    if (!explicitImport.current) try {
      const pending = JSON.parse(sessionStorage.getItem("abb:composer-signin") ?? "null");
      sessionStorage.removeItem("abb:composer-signin");
      if (pending && typeof pending.goal === "string" && typeof pending.context === "string") {
        explicitImport.current = true;
        setGoal(pending.goal); setContext(pending.context.slice(0, LIMITS.context));
        setChoices(validateChoices(pending.choices ?? {})); setUseContext(pending.useContext === true);
        setAssignMinds(pending.assignMinds !== false);
        setCustomSkills(validateCustomSkills(pending.customSkills)); setResult(null); setMode("ai"); void prepareCatalogue().catch(() => {});
      }
    } catch { /* Invalid local drafts never block sign-in. */ }
    return () => { live = false; };
  }, [baseCatalogue]);
  // Stop a plan in progress only when the page closes: the library arriving mid-plan must not cancel a click made before it loaded.
  useEffect(() => () => { requestRef.current++; abortRef.current?.abort(); }, []);
  // One reader for a saved plan (this browser, the account, or another device's update).
  const readSaved = (saved: any, tools: WorkflowRuntime) => {
    const savedContext = restoreCompositionContext(saved); const custom = validateCustomSkills(saved.customSkills);
    const plan = tools.finalize(withCustomSkills(baseCatalogue, custom), saved.plan, saved.plan.source);
    const unpacked = typeof saved.flowCode === "string" ? tools.unpackFlow(baseCatalogue, saved.flowCode) : null;
    if (saved.flowCode !== undefined && !unpacked) throw Error("Saved workflow is incomplete.");
    const workflowId = typeof saved.workflowId === "string" && /^[\w-]{1,40}$/.test(saved.workflowId) ? saved.workflowId : undefined;
    const request: PlanRequest = { goal: saved.goal, context: savedContext.context, useContext: savedContext.useContext, choices: validateChoices(saved.choices ?? {}), assignMinds: saved.assignMinds !== false };
    setCustomSkills(custom); setGoal(request.goal); setAssignMinds(request.assignMinds); setChoices(request.choices); setContext(request.context); setUseContext(request.useContext);
    setResult({ plan, context: savedContext.planningContext, model: saved.model || "free", cost: saved.cost || 0, latencyMs: saved.latencyMs || 0, request, workflowId, createdAt: Number.isFinite(saved.createdAt) ? saved.createdAt : undefined });
    editedHere.current = false; setGraphFlow(unpacked && workflowId ? { ...unpacked, id: workflowId } : unpacked); setRestored(true);
  };
  useEffect(() => {
    if (loaded && runtime && !explicitImport.current) try { const saved = JSON.parse(libraryStorage.getItem("abb:composer") ?? "null"); if (saved?.format === "ai-blocks-composition/1") { remoteApplying.current = true; readSaved(saved, runtime); } } catch { setError("The saved workflow could not be restored without changing its steps. Import a complete copy or create a new workflow."); }
  }, [baseCatalogue, runtime]);
  const initialGraph = useMemo(() => result ? graphFlow ?? { ...runtime!.compositionFlow(c, result.plan, result.request?.goal ?? goal, result.request?.context ?? context), customSkills, ...(result.workflowId ? { id: result.workflowId } : {}) } : null, [result?.plan]);
  const envelope = () => {
    const flow = graphFlow ?? initialGraph;
    // The saved plan keeps the request it was made from, not a later unsent edit.
    const r = result?.request ?? { goal, context, useContext, choices, assignMinds };
    return { format: "ai-blocks-composition/1", goal: r.goal, ...captureCompositionContext(r.context, result?.context ?? r.context, r.useContext), choices: r.choices, assignMinds: r.assignMinds, customSkills: flow?.customSkills ?? customSkills, flowCode: flow ? runtime!.packFlow(flow) : undefined, plan: result?.plan, model: result?.model, cost: result?.cost, latencyMs: result?.latencyMs, workflowId: result?.workflowId, createdAt: result?.createdAt };
  };
  useEffect(() => { if (result) try {
    const raw = JSON.stringify(envelope());
    if (remoteApplying.current) { remoteApplying.current = false; lastPersisted.current = raw; return; }
    if (raw !== lastPersisted.current) { libraryStorage.setItem("abb:composer", raw); lastPersisted.current = raw; }
  } catch { /* storage can be unavailable */ } }, [result, customSkills, graphFlow]);
  // Every plan is also a saved workflow (My work, Workflows). Edits here update that same workflow.
  useEffect(() => {
    if (!editedHere.current || !graphFlow || graphFlow.id !== result?.workflowId) return;
    const saved = flows.get(graphFlow.id);
    if (saved && JSON.stringify({ ...saved, updated: 0 }) !== JSON.stringify({ ...graphFlow, updated: 0 })) flows.save(graphFlow);
  }, [graphFlow]);
  useEffect(() => {
    const received = (event: Event) => {
      if (!loaded || !runtime || !(event as CustomEvent<string[]>).detail.includes("abb:composer")) return;
      if (editing.current.busy || !editing.current.result && editing.current.goal.trim()) return;
      try {
        const saved = JSON.parse(libraryStorage.getItem("abb:composer") ?? "null");
        if (saved?.format === "ai-blocks-composition/1") { remoteApplying.current = true; setPreparedZip(null); readSaved(saved, runtime); }
        else if (!saved) { remoteApplying.current = false; lastPersisted.current = null; setResult(null); setGraphFlow(null); setPreparedZip(null); }
      } catch { setError("The updated workflow could not be opened. Your saved account copy is intact."); }
    };
    window.addEventListener(REMOTE_LIBRARY_UPDATE, received); return () => window.removeEventListener(REMOTE_LIBRARY_UPDATE, received);
  }, [baseCatalogue, runtime]);
  /** Only for deleting the plan on purpose (the builder's Delete). Editing the request never calls this. */
  const reset = () => { setPreparedZip(null); setGraphFlow(null); setResult(null); setPicks(null); setError(""); setRestored(false); requestRef.current++; try { libraryStorage.removeItem("abb:composer"); } catch {} };
  const changeGoal = (value: string) => { setPicks(null); setError(""); setGoal(value); setChoices({}); };
  const current: PlanRequest = { goal, context, useContext, choices, assignMinds };
  const stale = !!result?.request && !sameRequest(result.request, current);
  const signIn = async (signUp = false) => {
    try {
      sessionStorage.setItem("abb:composer-signin", JSON.stringify({ goal, context, choices, useContext, customSkills, assignMinds }));
      await account.signIn(signUp);
    } catch { setError("Sign-in could not open. Please try again."); }
  };
  // Saving needs an account only to reach other devices; the plan is already saved in this browser.
  const signInToSave = async () => { try { await account.signIn(false); } catch { setError("Sign-in could not open. Your plan is still saved in this browser."); } };
  const adopt = (tools: WorkflowRuntime, next: Result, request: PlanRequest, cat: Catalogue = c) => {
    const workflowId = newWorkflowId();
    const flow = { ...tools.compositionFlow(cat, next.plan, request.goal, request.context), id: workflowId, customSkills };
    try { flows.save(flow); } catch { /* the plan still shows; saving can be retried by editing */ }
    setPreparedZip(null); setPicks(null); setRestored(false); setGraphFlow(flow);
    setResult({ ...next, request, workflowId, createdAt: Date.now() });
  };
  const compose = async () => {
    setError(""); const invalid = requestError(goal); if (invalid) { setError(invalid); document.getElementById("compose-goal")?.focus(); return; }
    // A click before the library arrives waits for it, then plans with the library it just received (not the empty placeholder).
    let lib = c;
    if (!loaded) { setBusy(true); try { lib = withCustomSkills(await prepareCatalogue(), customSkills); } catch { setBusy(false); setError("The task library did not load. Check your connection and try again."); return; } setBusy(false); }
    if (planner === "ai" && connecting) { setError("Still checking that AI plans are available. Try again in a moment."); return; }
    if (planner === "ai" && (account.state === "loading" || account.state === "unconfigured")) { setError(account.state === "loading" ? "Still checking your sign-in. Try again in a moment." : "Sign-in is unavailable right now. Open More options and choose Quick plan to plan in your browser."); return; }
    if (planner === "ai" && !available) { setError("AI plans are not available right now. Open More options and choose Quick plan to plan in your browser."); return; }
    // An AI plan uses a free account (it has a daily limit). The quick plan never asks for one.
    if (planner === "ai" && account.state !== "signed-in") { void signIn(); return; }
    const request: PlanRequest = { goal, context, useContext, choices, assignMinds };
    const id = ++requestRef.current;
    const controller = new AbortController(); abortRef.current = controller;
    const timeout = window.setTimeout(() => { controller.abort(); if (requestRef.current === id) { requestRef.current++; setBusy(false); setError("Planning timed out. Your request and earlier plan are still here. Try again when you are ready."); } }, 120000);
    setBusy(true); setRestored(false);
    try {
      const tools = await prepareRuntime();
      if (requestRef.current !== id) return;
      const combined = workflowPlanningContext(context, useContext ? businessText(getBusiness()) : "", goal, useContext);
      if (planner === "free") {
        // Made in this browser from the library: free, instant and no sign-in.
        const plan = tools.finalize(lib, tools.freeSelection(lib, goal, choices, context), "free");
        adopt(tools, { plan, model: "free", cost: 0, latencyMs: 0, context: combined }, request, lib);
      } else {
        const verification = await protectedHeaders("compose");
        // Human verification can outlast a session JWT; acquire it immediately before sending.
        const token = await account.token();
        const response = await fetch("/api/compose", { method: "POST", signal: controller.signal, headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID(), authorization: `Bearer ${token}`, ...verification }, body: JSON.stringify({ goal, context: combined, choices, assignMinds }) });
        if (response.status === 401) account.expired();
        const out = await response.json(); if (!response.ok) throw Error(out.error || "The AI plan could not finish. Try the quick plan instead.");
        if (requestRef.current === id) { const nextPlan = tools.finalize(lib, out.plan, "ai", undefined, assignMinds); adopt(tools, { ...out, context: combined, plan: nextPlan }, request, lib); }
        void account.refreshUsage();
      }
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
    } catch (e) { if (requestRef.current === id) setError(controller.signal.aborted ? "Planning stopped. Your request is still here. Try again when you are ready." : e instanceof Error ? e.message : "The workflow could not be created."); }
    finally { window.clearTimeout(timeout); if (requestRef.current === id) setBusy(false); }
  };
  // Pick one starting step yourself; the builder then suggests what goes before and after it.
  const pickStart = async () => {
    if (!loaded) return; const invalid = requestError(goal); if (invalid) { setError(invalid); return; }
    try { const tools = await prepareRuntime(); setError(""); setPicks(tools.startPicks(baseCatalogue, goal, 6)); requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" })); } catch { /* prepareRuntime shows the error */ }
  };
  const asFlow = () => graphFlow ?? initialGraph!;
  // Opens the chosen start (one step, or a ready workflow's steps) in the builder, with the request as its goal.
  const startWith = (b: Block) => {
    const slugs = b.steps.length ? workflowEntries(b).filter(s => baseCatalogue.bySlug[s]) : [b.slug];
    const flow = { ...runtime!.flowFrom(baseCatalogue, b.steps.length ? b.name : goal.trim().replace(/^./, m => m.toUpperCase()).slice(0, 80), slugs), goal: goal.trim() };
    flows.save(flow); flows.open(flow.id); navigate("/#build");
  };
  const exportJson = () => download(new Blob([JSON.stringify(envelope(), null, 2)], { type: "application/json" }), "workflow.edit.json");
  const exportPack = async () => {
    if (!result) return; setPackBusy(true); setError("");
    try {
      const flow = asFlow();
      const packBusiness = useContext ? getBusiness() : {};
      const {buildHandoffZip} = await import("./lib/handoff");
      const built = await buildHandoffZip(withCustomSkills(baseCatalogue, flow.customSkills ?? customSkills), flow, packBusiness, { "workflow.edit.json": JSON.stringify(envelope(), null, 2), "README.md": `# ${result.plan.title}\n\n${result.plan.summary}\n\n## Run\nRead HANDOFF.md. Check the current AI session, supplied context and existing org context first. Validate existing artifacts and ask for missing required inputs. Apply every declared step and its checks in order; reusing an artifact does not waive a step. Run the workflow in an AI runner with the tools each skill needs. Code needs a coding environment; browser checks need a rendered preview. Mark checks not run if tools are unavailable.\n\n## Edit\nOpen /compose on AI Blocks and choose Import workflow. Select workflow.edit.json. Edit notes, add or reorder steps, then download again.\n\n## Boundaries\nThis pack is a plan. No skills have run, no page has been published and no agent has been scheduled. Authorize concrete external actions during execution.\n`, "inputs.json": JSON.stringify({ required: result.plan.missing, choices, context: result.context ?? context, status: "verify-supplied-context-first", notice: "Planning context is supplied but unvalidated. Check it and earlier artifacts before asking for any missing input. It does not establish accepted execution inputs or permission." }, null, 2) });
      if ("error" in built) throw Error(built.error); download(built.blob, built.filename); setPreparedZip(built.filename); toast("Your workflow pack is downloaded");
    } catch (e) { setError((e as Error).message); } finally { setPackBusy(false); }
  };
  const importPack = async (file?: File) => {
    if (!file) return; explicitImport.current = true; setError("");
    try { const [importCatalogue, tools] = await Promise.all([loaded ? Promise.resolve(loaded) : prepareCatalogue(), prepareRuntime()]); if (file.size > 1000000) throw Error("Keep the workflow file under 1 MB."); const data = JSON.parse(await file.text()); if (data.format !== "ai-blocks-composition/1" || typeof data.goal !== "string" || data.goal.length > LEGACY_REQUEST_LIMIT) throw Error("Choose a workflow.edit.json exported from this composer."); const savedContext = restoreCompositionContext(data); const importedFlow = typeof data.flowCode === "string" ? tools.unpackFlow(importCatalogue, data.flowCode) : null; if (data.flowCode !== undefined && !importedFlow) throw Error("This workflow is incomplete or invalid. No steps were imported. Supply a complete workflow."); const custom = validateCustomSkills(data.customSkills); const plan = tools.finalize(withCustomSkills(importCatalogue, custom), data.plan, data.plan.source === "ai" ? "ai" : "free");
      const request: PlanRequest = { goal: data.goal, context: savedContext.context, useContext: savedContext.useContext, choices: validateChoices(data.choices ?? {}), assignMinds: data.assignMinds !== false };
      // An imported plan is saved to Workflows too; importing the same file again updates that workflow.
      const workflowId = typeof data.workflowId === "string" && /^[\w-]{1,40}$/.test(data.workflowId) ? data.workflowId : newWorkflowId();
      const flow = importedFlow ? { ...importedFlow, id: workflowId } : { ...tools.compositionFlow(withCustomSkills(importCatalogue, custom), plan, request.goal, request.context), id: workflowId, customSkills: custom };
      try { flows.save(flow); } catch { /* the plan still opens */ }
      setCustomSkills(custom); setGoal(request.goal); setAssignMinds(request.assignMinds); setContext(request.context); setUseContext(request.useContext); setChoices(request.choices); setResult({ plan, context: savedContext.planningContext, model: typeof data.model === "string" ? data.model : "free", cost: Number.isFinite(data.cost) && data.cost >= 0 ? data.cost : 0, latencyMs: 0, request, workflowId, createdAt: Date.now() }); setGraphFlow(flow); setPicks(null); setPreparedZip(null); setRestored(true); toast("Your workflow is ready to edit"); } catch (e) { setError(e instanceof SyntaxError ? "This file could not be read. Choose workflow.edit.json from a previous download. Your current workflow is kept." : (e as Error).message); } finally { if (importRef.current) importRef.current.value = ""; }
  };

  const questions = questionsFor([goal, context, useContext && planningMeContext(businessText(getBusiness()), goal)].filter(Boolean).join("\n"), choices);
  const hasGeneralTemplate = result?.plan.source === "free" && result.plan.steps.some(s => s.slug === "request-deliverable-drafter");
  const hasSpecialist = result?.plan.steps.some(s => !["request-acceptance-brief", "request-deliverable-drafter", "request-acceptance-checker"].includes(s.slug));
  const usableResult = !(hasGeneralTemplate && !hasSpecialist);
  const possibleQuestions = [...new Set([...questions, ...Object.keys(choices)])].filter(id => Object.hasOwn(QUESTIONS, id));
  const needsSignIn = planner === "ai" && account.state !== "signed-in";
  const earlier = savedFlows.filter(f => f.goal && f.id !== result?.workflowId).slice(0, 3);
  const useAiPlan = () => { setMode("ai"); setError(""); document.getElementById("compose-request")?.scrollIntoView({ block: "start", behavior: "smooth" }); };
  return <>
    <div className="compose-layout" onFocusCapture={() => { void prepareCatalogue().catch(() => {}); }} onPointerDownCapture={() => { void prepareCatalogue().catch(() => {}); }}>
      <section id="compose-request" className="compose-form" aria-label="Your request">
        <form className="compose-editor-grid" onSubmit={e => { e.preventDefault(); void compose(); }}>
          <div className="compose-request-pane"><label htmlFor="compose-goal">What job do you want done?</label>
          <div className="compose-request-box">
            <textarea id="compose-goal" data-testid="compose-goal" value={goal} onChange={e => changeGoal(e.currentTarget.value)} maxLength={LIMITS.request} rows={5} placeholder="Build a landing page, check it and give me the source code" aria-describedby="compose-goal-help" required disabled={busy || dictating} />
            <div className="compose-request-footer"><VoiceRequest value={goal} onChange={changeGoal} disabled={busy} onListeningChange={setDictating} /><span className="compose-voice-count small">{goal.length.toLocaleString()} / {LIMITS.request.toLocaleString()} characters{goal.length > LIMITS.request ? " · Shorten this draft before creating a new workflow." : ""}</span></div>
          </div>
          <p className="small compose-goal-help" id="compose-goal-help">Say what you need, who it is for and what you want back.</p>
          <div className="compose-examples" aria-label="Example requests"><span className="small">Try:</span>{EXAMPLES.map(s => <button type="button" key={s} disabled={busy || dictating} onClick={() => changeGoal(s)}>{s}</button>)}</div>
          {goal.trim() && <AimHigher request={goal} answers={aim} onChange={setAim} toast={toast} addLabel="Add to the plan's context"
            onAdd={() => { const added = aimHigherText(aim); setContext(current => (current.trim() ? `${current.trim()}\n\n${added}` : added).slice(0, LIMITS.context)); setAim({}); toast("Added to the plan's context"); }} />}
          {planner === "ai" && <div><label className="compose-check"><input type="checkbox" data-testid="compose-assign-minds" checked={assignMinds} disabled={busy || dictating} onChange={event => setAssignMinds(event.currentTarget.checked)} aria-describedby="compose-minds-help" /> Assign minds to tasks</label><p className="small" id="compose-minds-help">Uses a suggested perspective for each step. Complex decisions may use a small group. You can change or remove them.</p></div>}
          </div>{goal.trim() && <details className="compose-settings-pane workflow-options"><summary>Customize the plan (optional)</summary>
          {possibleQuestions.length > 0 && <fieldset><legend>Choices that shape the workflow</legend>{possibleQuestions.map(id => { const q = QUESTIONS[id as keyof typeof QUESTIONS]; return <label key={id} className="compose-choice">{q.text}<select aria-label={q.text} value={choices[id as keyof Choices] ?? ""} disabled={busy} onChange={e => { const value = e.currentTarget.value; setChoices(v => { const next = { ...v }; if (value) next[id as keyof Choices] = value; else delete next[id as keyof Choices]; return next; }); }}><option value="">Starting point: {defaultChoice(id)}</option>{q.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>; })}</fieldset>}
          <details className="compose-context"><summary>Add context and constraints</summary><label htmlFor="compose-context">Audience, offer, available inputs and limits</label><textarea id="compose-context" rows={4} value={context} maxLength={LIMITS.context} onChange={e => setContext(e.currentTarget.value)} disabled={busy} /><label className="compose-check"><input type="checkbox" checked={useContext} onChange={e => setUseContext(e.currentTarget.checked)} disabled={busy} /> Use my saved org context</label><p className="small">AI planning uses your work, projects and limits when saved. Turn this off to use only your notes.</p></details>
          {planner === "ai" && <p className="small">{connecting ? "Checking service availability…" : "Your request, added context and relevant skill descriptions go to our AI provider. When Assign minds is on, public mind profiles go too. The service selects the model and enforces usage limits."}</p>}
          {planner === "ai" && <p className="small compose-policy-note">Generated results and usage records are stored by the service. Share only information you are authorised to provide. <Link to="/privacy#server">How your data is handled</Link>.</p>}
          </details>}<div className="compose-submit-pane">
          <button className="btn btn-primary" type="submit" data-testid="compose-submit" disabled={busy || dictating}>{busy ? "Preparing your plan…" : needsSignIn ? "Sign in for an AI plan" : result ? "Create a new plan" : "Create my plan"}</button>
          <p className="small compose-plan-note" data-testid="compose-plan-note">{planner === "free" ? "Free. Made in your browser from our library. No sign-up needed." : !connecting && !available ? "AI plans are not available right now. Choose Quick plan in More options to plan in your browser." : needsSignIn ? "AI plans need a free account. Or choose Quick plan in More options to plan without one." : "An AI plan, written for your request. Free with your account."}</p>
          {busy && <button type="button" className="link-btn" onClick={() => { abortRef.current?.abort(); requestRef.current++; setBusy(false); setError("Planning stopped. Your request is still here."); }}>Stop planning</button>}
          </div>
        </form>
        {planner === "ai" && <div className="compose-account" data-testid="compose-account" aria-label="Workflow account">
          {account.state === "loading" && <p className="small" role="status">Checking sign-in…</p>}
          {account.state === "unconfigured" && <p className="small">Sign-in is unavailable. Open More options and choose Quick plan to plan in your browser.</p>}
          {account.state === "error" && <><p className="small">Sign-in could not load. Retry, or choose Quick plan in More options.</p><button className="link-btn" onClick={account.retry}>Try sign-in again</button></>}
          {account.state === "signed-out" && <><p className="small">Create up to five free AI plans a day with a free account.</p><div className="compose-actions"><button className="btn btn-dark btn-sm" onClick={() => void signIn()}>Sign in</button><button className="link-btn" onClick={() => void signIn(true)}>Create a free account</button></div></>}
          {account.state === "signed-in" && <><p className="small">Signed in · Free access{account.usage ? ` · ${account.usage.completed} workflows created${account.usage.unlimited === true ? " · No daily account count limit" : typeof account.usage.dailyAttemptLimit === "number" ? ` · ${Math.max(0, account.usage.dailyAttemptLimit - account.usage.attemptsToday)} attempts left today` : ""}` : ""}</p><button className="link-btn" disabled={busy} onClick={() => void account.signOut()?.catch(() => setError("Sign-out could not finish. Please try again."))}>Sign out</button></>}
        </div>}
        {planner === "ai" && <p className="small compose-policy-note">Account creation and AI submissions are for adults aged 18 or older. Read our <Link to="/terms">Terms of service</Link> and <Link to="/privacy">Privacy policy</Link> before continuing.</p>}
        <details className="compose-customize workflow-options" onToggle={e => { if (e.currentTarget.open) setCustomizeOpened(true); }}><summary>More options: plan type, minds and imports</summary>        <div className="compose-tabs" role="tablist" aria-label="How to create your plan"><button role="tab" disabled={busy} aria-selected={planner === "free"} onClick={() => setMode("free")}>Quick plan</button><button role="tab" disabled={busy} aria-selected={planner === "ai"} onClick={() => setMode("ai")}>AI plan</button></div>
        <p className="small">{planner === "free" ? "Quick plan: made in your browser from our library. Free, with no account. AI plan: written for your request by AI. It needs a free account and you get five a day." : account.usage?.unlimited === true ? `Your account has no daily workflow count limit.${networkNote} Service spending and safety limits still apply.` : "Create up to five free AI plans per day. Failed attempts count toward your allowance. Resets at 00:00 UTC. No payment details needed."}</p>
        <p className="small"><button className="link-btn" data-testid="compose-pick-start" disabled={!loaded || busy || !goal.trim()} onClick={() => void pickStart()}>Pick the first step yourself</button> The builder then suggests steps to add before and after it.</p>
{customizeOpened && <Suspense fallback={<p className="small" role="status">Opening your minds…</p>}><MyMinds onSignIn={() => signIn()} /></Suspense>}
        <div className="compose-import"><button className="link-btn" onClick={() => importRef.current?.click()} disabled={busy || dictating}>Import workflow</button><input ref={importRef} type="file" accept=".json,application/json" className="visually-hidden" aria-label="Import workflow JSON" onChange={e => void importPack(e.currentTarget.files?.[0])} /></div></details>
        {error && <p className="compose-error" role="alert">{error}</p>}
        {earlier.length > 0 && <div className="compose-earlier" data-testid="compose-earlier"><h2 className="h4">Your earlier plans</h2><ul>{earlier.map(f => <li key={f.id}><button type="button" className="link-btn" onClick={() => { flows.open(f.id); navigate("/#build"); }}>{f.name}</button></li>)}</ul><Link to="/account" className="small">See all in My work</Link></div>}
      </section>
      <section hidden={!busy && !result && !picks} id="compose-workflow" className="compose-result" ref={resultRef} aria-label="Your plan">
        {busy ? <div className="compose-loading" role="status"><div className="compose-loading-blocks" aria-hidden="true"><span>▧</span><i>→</i><span>▧</span><i>→</i><span>✓</span></div><h2 className="h3">Preparing your plan…</h2><p className="small">Finding the right skills and putting your workflow together.</p></div> : picks ? <div className="compose-start" data-testid="compose-start">
          <span className="mono small">START WITH</span><h2 className="h3">Pick your first step</h2>
          {picks.tasks.length ? <><p className="small">Choose the step that makes what you want. The builder then shows what to add before and after it.</p>
            <ol className="compose-start-list">{picks.tasks.map(({ b, why }) => <li key={b.slug} data-slug={b.slug}><div><b>{b.name}</b><p className="small">{b.summary}</p><small>{why}</small></div><button type="button" className="btn btn-dark btn-sm" onClick={() => startWith(b)} aria-label={`Start with: ${b.name}`}>Start with this</button></li>)}</ol></>
            : <p className="small" role="status">No step in the library fits this yet. Try other words, or create a plan instead.</p>}
          {picks.workflows.length > 0 && <><h3 className="h4">Or open a ready workflow</h3><ul className="compose-start-list">{picks.workflows.map(({ b, why }) => <li key={b.slug} data-slug={b.slug}><div><b>{b.name}</b><p className="small">{b.summary}</p><small>{why}</small></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => startWith(b)} aria-label={`Open workflow: ${b.name}`}>Open workflow</button></li>)}</ul></>}
          {result && <button type="button" className="link-btn" onClick={() => setPicks(null)}>Back to my plan</button>}
        </div> : result ? <>
          <div className="compose-result-toolbar"><div><span className="mono small">{usableResult ? "YOUR PLAN" : "YOUR REQUEST"}</span><h2 className="h3">{result.plan.title}</h2></div>{usableResult && <div className="compose-actions"><button className="btn btn-primary" data-testid="compose-download" disabled={packBusy} onClick={() => void exportPack()}>{packBusy ? "Preparing the files…" : "Download the workflow"}</button><details className="workflow-options"><summary>Other formats</summary><p className="small">Editable JSON reopens this plan in AI Blocks. To run the plan in your AI, download the workflow.</p><button className="btn btn-dark" data-testid="compose-export" onClick={exportJson}>Export editable JSON</button></details></div>}</div>
          {stale && <p className="compose-stale" data-testid="compose-stale" role="status">This plan is for your earlier request. Press Create a new plan to match your changes. This plan stays saved in <Link to="/account">My work</Link>.</p>}
          {usableResult && <p className="workflow-plan-status" data-testid="plan-ready" role="status">Plan ready. No steps have run yet.</p>}
          <div className="compose-saved" data-testid="compose-saved">{account.state === "signed-in" ? <p className="small">Saved to your account. Find it any time in <Link to="/account">My work</Link>.</p> : <><p className="small">Saved in this browser. Find it in <Link to="/account">My work</Link>. Sign in to keep it in your account and open it on your other devices.</p>{account.state === "signed-out" && <button className="btn btn-dark btn-sm" data-testid="compose-save-signin" onClick={() => void signInToSave()}>Sign in to save</button>}</>}</div>
          {usableResult && <details className="workflow-options workflow-run-help" data-testid="compose-run-help"><summary>How do I get my result?</summary><ol><li>Review the steps, then download the workflow.</li><li>Unzip it and give the complete files to your AI.</li><li>Ask your AI to read START_HERE.txt and follow HANDOFF.md. Add the material it asks for.</li></ol><p className="small">Copy AI instructions gives you a first message to send with the files. Your AI makes the result in your chat or workspace.</p><a href="/how-it-works#use-in-ai" target="_blank" rel="noopener noreferrer">Read the steps in a new tab</a></details>}
          {usableResult && <Suspense fallback={null}><ExecutionPrompt name={asFlow().name} goal={asFlow().goal} flow={asFlow()} catalogue={c} business={useContext ? undefined : {}} /></Suspense>}
          {restored && <p className="small">Restored from your saved workflow.</p>}
          {usableResult && <p className="small">{result.plan.summary}</p>}
          {usableResult && result.plan.source === "free" && !hasGeneralTemplate && available && planner === "free" && <p className="small compose-upgrade" data-testid="compose-upgrade">This is a quick plan from our library. Want steps written for your exact request? <button type="button" className="link-btn" onClick={useAiPlan}>Use an AI plan instead</button> (free account, five a day).</p>}
          {usableResult && result.plan.missing.length > 0 && <details className="workflow-options" data-testid="workflow-inputs"><summary>Inputs your AI will check ({result.plan.missing.length})</summary><p className="small">You can download now. Your request, saved context or earlier files may already supply these. Your AI checks those first and asks only for missing inputs. You do not need to upload private files here.</p><ul>{result.plan.missing.map(item => <li key={item.type}>{portLabel(item.type)} · needed by step {item.steps.join(", ")}</li>)}</ul></details>}
          {hasGeneralTemplate && <div className="compose-match-notice" role="status" data-testid="compose-unmatched"><b>{hasSpecialist ? "Part of your request needs a specialist match" : "Your request did not match a specialist workflow"}</b><p className="small">{hasSpecialist ? "Unmatched parts use" : "The steps below are"} a general brief, draft and check template. Different unmatched requests produce the same steps. An AI plan can write steps made for your request.</p>{available ? <button className="btn btn-dark btn-sm" onClick={useAiPlan}>Use an AI plan for this request</button> : <p className="small">AI plans are not available right now. You can swap the template steps for skills from the library.</p>}</div>}
          {usableResult && <><p className="small">Read the steps in order. Open a step to see what to add and what it makes. Use Diagram view to edit connections.</p>
          <div className="compose-workflow-canvas" data-testid="compose-steps">{initialGraph && <Suspense fallback={<p className="small" role="status">Opening the steps…</p>}><Builder key={initialGraph.id} c={baseCatalogue} toast={toast} initialFlow={initialGraph} onFlowChange={onPlanEdit} onDelete={reset} /></Suspense>}</div>
          <div className="compose-actions"><button className="link-btn" onClick={() => { const flow = asFlow(); flows.save(flow); flows.open(flow.id); navigate("/#build"); }}>Open in the full builder</button></div>{preparedZip && <Suspense fallback={null}><TransferGuide name={asFlow().name} goal={asFlow().goal} zip={preparedZip} /></Suspense>}</>}
        </> : <div className="compose-empty"><span className="mono">01 → 02 → 03 → ✓</span><h2 className="h3">A complete plan, ready to make your own</h2><p className="small">Your plan shows what each step does, what it needs and what comes next. Edit the order and instructions before you download.</p></div>}
      </section>
    </div>
  </>;
}
