import { useEffect, useRef, useState } from "react";
import type { Catalogue } from "./lib/data";
import type { Flow } from "./lib/store";
import { finalize, LIMITS, requestError } from "./lib/composer-core";
import { compositionFlow } from "./lib/composer-flow";
import { useComposerAccount } from "./lib/composer-account";
import { protectedHeaders } from "./lib/turnstile";
import { Link } from "./lib/router";
import "./builder-ai-assist.css";

const DRAFT_KEY = "abb:builder-ai-signin";
const GOAL_LIMIT = 3000;
const MODELS = [{ id: "gpt-6-luna", label: "GPT-6 Luna" }, { id: "gpt-6.1-sol", label: "GPT-6.1 Sol" }, { id: "claude-haiku-5-5", label: "Claude Haiku 5.5" }];
type PlannerModel = { id: string; label: string; available: boolean };

export default function BuilderAiAssist({ c, onPlan, toast, initialGoal = "" }: { initialGoal?: string; c: Catalogue; onPlan: (flow: Flow) => void; toast: (message: string) => void }) {
  const account = useComposerAccount(true);
  const [goal, setGoal] = useState(initialGoal);
  const [context, setContext] = useState("");
  const [model, setModel] = useState("gpt-6-luna");
  const [assignMinds, setAssignMinds] = useState(true);
  const [models, setModels] = useState<PlannerModel[]>(MODELS.map(value => ({ ...value, available: false })));
  const [service, setService] = useState<"loading" | "ready" | "unavailable">("loading");
  const [serviceRevision, setServiceRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const mounted = useRef(false), request = useRef(0), locked = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const timer = useRef<number | undefined>();
  const previousUser = useRef<string | null>(null), restored = useRef(false);
  const identity = useRef({ state: account.state, userId: account.userId });
  identity.current = { state: account.state, userId: account.userId };

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; request.current++; abort.current?.abort(); window.clearTimeout(timer.current); };
  }, []);

  useEffect(() => {
    let live = true;
    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), 15000);
    setService("loading");
    fetch("/api/compose", { signal: controller.signal, cache: "no-store" })
      .then(async response => { if (!response.ok) throw Error(); return response.json(); })
      .then(data => {
        if (!live) return;
        const offered = Array.isArray(data.models) ? data.models : [];
        const availableModels = MODELS.map(value => ({ ...value, available: offered.some((item: unknown) => !!item && typeof item === "object" && "id" in item && item.id === value.id && "available" in item && item.available === true) }));
        setModels(availableModels);
        setModel(previous => availableModels.some(value => value.id === previous && value.available) ? previous : availableModels.find(value => value.id === data.defaultModel && value.available)?.id ?? availableModels.find(value => value.available)?.id ?? "gpt-6-luna");
        setService(data.enabled === true && availableModels.some(value => value.available) ? "ready" : "unavailable");
      })
      .catch(() => { if (live) setService("unavailable"); })
      .finally(() => window.clearTimeout(deadline));
    return () => { live = false; window.clearTimeout(deadline); controller.abort(); };
  }, [serviceRevision]);

  useEffect(() => {
    if (account.state === "loading") return;
    if (previousUser.current && previousUser.current !== account.userId) {
      request.current++; abort.current?.abort(); window.clearTimeout(timer.current); locked.current = false;
      setBusy(false); setGoal(""); setContext(""); setAssignMinds(true); setStatus(""); setError("Your account changed. Add a new request to continue.");
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* Storage is optional. */ }
    }
    previousUser.current = account.userId;
    if (restored.current) return;
    restored.current = true;
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null");
      sessionStorage.removeItem(DRAFT_KEY);
      if (saved && typeof saved.goal === "string" && typeof saved.context === "string" && typeof saved.savedAt === "number" && Date.now() - saved.savedAt < 86400000 && Date.now() >= saved.savedAt && (!saved.userId || saved.userId === account.userId)) {
        setGoal(saved.goal); setContext(saved.context);
        setAssignMinds(saved.assignMinds !== false);
        if (MODELS.some(value => value.id === saved.model)) setModel(saved.model);
        setStatus("Your request is ready. Review it, then choose Create workflow.");
      }
    } catch { /* An invalid local draft never starts a request. */ }
  }, [account.state, account.userId]);

  const signIn = async (signUp: boolean) => {
    if (signingIn || locked.current) return;
    setError(""); setSigningIn(true);
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ goal, context, model, assignMinds, userId: account.userId, savedAt: Date.now() }));
      await account.signIn(signUp, "/#build");
    } catch { if (mounted.current) setError("Sign-in could not open. Your request is still here. Please try again."); }
    finally { if (mounted.current) setSigningIn(false); }
  };
  const stop = () => {
    request.current++; abort.current?.abort(); window.clearTimeout(timer.current); locked.current = false;
    setBusy(false); setStatus(""); setError("Planning stopped. Your request is still here.");
  };
  const unlimited = !!account.usage && "unlimited" in account.usage && account.usage.unlimited === true;
  const networkLimit = account.usage && "dailyIpAttemptLimit" in account.usage ? account.usage.dailyIpAttemptLimit : undefined;
  const networkNote = typeof networkLimit === "number" ? ` A separate network limit of ${networkLimit} attempts per day applies.` : networkLimit === null ? "" : " A separate daily network limit may apply.";
  const dailyLimit = account.usage?.dailyAttemptLimit;
  const left = !unlimited && typeof dailyLimit === "number" && account.usage ? Math.max(0, dailyLimit - account.usage.attemptsToday) : null;
  const selectedAvailable = models.some(value => value.id === model && value.available);
  const create = async () => {
    if (locked.current) return;
    setError(""); setStatus("");
    if (goal.length > GOAL_LIMIT) { setError("Keep your request under 3,000 characters. Your full draft is still here so you can shorten it."); return; }
    const invalid = requestError(goal);
    if (invalid) { setError(invalid); return; }
    if (context.length > LIMITS.context) { setError("Keep added context under 4,000 characters."); return; }
    if (service !== "ready") { setError("AI assist is unavailable right now. Please try again shortly. Your request is kept here."); return; }
    if (!selectedAvailable) { setError("Choose an available AI model to continue."); return; }
    const expectedUser = account.userId;
    if (account.state !== "signed-in" || !expectedUser) { setError("Sign in or create a free account to make your workflow."); return; }
    if (left === 0) { setError("You have used today's allowance. It resets at 00:00 UTC (5:30 a.m. India time)."); return; }
    const id = ++request.current, controller = new AbortController();
    const current = () => mounted.current && request.current === id && identity.current.state === "signed-in" && identity.current.userId === expectedUser;
    locked.current = true; abort.current = controller; setBusy(true);
    timer.current = window.setTimeout(() => {
      if (!current()) return;
      request.current++; controller.abort(); locked.current = false; setBusy(false);
      setError("Planning timed out. Your request and current workflow are still here. Try again when you are ready.");
    }, 120000);
    try {
      const verification = await protectedHeaders("compose");
      if (!current() || controller.signal.aborted) return;
      const token = await account.token(expectedUser);
      if (!current() || controller.signal.aborted) return;
      const response = await fetch("/api/compose", { method: "POST", signal: controller.signal, headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID(), authorization: `Bearer ${token}`, ...verification }, body: JSON.stringify({ goal, context, choices: {}, model, assignMinds }) });
      if (!current()) return;
      if (response.status === 401) {
        setError("Your sign-in expired. Sign in again to continue. Your request is still here.");
        account.expired(); return;
      }
      const out = await response.json().catch(() => { throw Error("AI assist could not read the response. Your request is still here. Please try again."); });
      if (!current()) return;
      if (!response.ok) throw Error(typeof out.error === "string" ? out.error : "Your workflow could not be created. Please try again.");
      const plan = finalize(c, out.plan, "ai", undefined, assignMinds);
      const flow = compositionFlow(c, plan, goal, context);
      if (!current()) return;
      onPlan(flow); setStatus("Workflow ready. Review the steps, then download it for your AI."); toast("Your workflow is ready to review");
    } catch (cause) {
      if (current()) setError(controller.signal.aborted ? "Planning stopped. Your request is still here." : cause instanceof Error ? cause.message : "Your workflow could not be created. Please try again.");
    } finally {
      if (request.current === id) {
        window.clearTimeout(timer.current); locked.current = false;
        if (mounted.current) setBusy(false);
        if (identity.current.state === "signed-in" && identity.current.userId === expectedUser) void account.refreshUsage();
      }
    }
  };

  return <section className="builder-ai-assist" aria-labelledby="builder-ai-title" data-testid="builder-ai-assist">
    <div><h3 id="builder-ai-title">Build with AI</h3><p className="small">Describe your goal. Get a workflow you can edit and download.</p></div>
    <form onSubmit={event => { event.preventDefault(); void create(); }}>
      <label htmlFor="builder-ai-goal">What do you want to get done?</label>
      <textarea id="builder-ai-goal" data-testid="builder-ai-goal" rows={3} maxLength={GOAL_LIMIT} value={goal} disabled={busy || signingIn} onChange={event => { setGoal(event.currentTarget.value); setError(""); setStatus(""); }} placeholder="Create a landing page for my coffee shop and check it before publishing" aria-describedby="builder-ai-count" required />
      <p className="small builder-ai-count" id="builder-ai-count">{goal.length.toLocaleString()} / 3,000 characters{goal.length > GOAL_LIMIT ? " · Shorten this draft before creating a workflow." : ""}</p>
      <label htmlFor="builder-ai-model">AI model<select id="builder-ai-model" data-testid="builder-ai-model" value={model} disabled={busy || signingIn || service === "loading"} onChange={event => setModel(event.currentTarget.value)}>{models.map(value => <option key={value.id} value={value.id} disabled={!value.available}>{value.label}{!value.available ? service === "loading" ? " — checking…" : " — unavailable" : ""}</option>)}</select></label>
      <div><label><input type="checkbox" data-testid="builder-ai-assign-minds" checked={assignMinds} disabled={busy || signingIn} onChange={event => setAssignMinds(event.currentTarget.checked)} aria-describedby="builder-ai-minds-help" /> Assign minds to tasks</label><p className="small" id="builder-ai-minds-help">Uses a suggested perspective for each step. Complex decisions may use a small group. You can change or remove them.</p></div>
      <details className="builder-ai-context"><summary>Add context (optional)</summary><label htmlFor="builder-ai-context">Audience, available material or limits</label><textarea id="builder-ai-context" rows={3} maxLength={LIMITS.context} value={context} disabled={busy || signingIn} onChange={event => { setContext(event.currentTarget.value); setError(""); }} /><p className="small">Up to 4,000 characters. Leave out private information you do not need to share.</p></details>
      <div className="builder-ai-account" data-testid="builder-ai-account">
        {account.state === "loading" && <p className="small" role="status">Checking sign-in…</p>}
        {account.state === "signed-out" && <><p className="small">Get up to 5 free AI workflows each day.</p><div className="builder-ai-actions"><button className="btn btn-primary" type="button" disabled={signingIn} onClick={() => void signIn(true)}>Sign up free</button><button className="btn btn-dark" type="button" disabled={signingIn} onClick={() => void signIn(false)}>Sign in</button></div></>}
        {account.state === "unconfigured" && <p className="small">Sign-in is unavailable right now. Your request is kept here. Please try again later.</p>}
        {account.state === "error" && <><p className="small">Sign-in could not load. Your request is kept here.</p><button type="button" className="link-btn" onClick={account.retry}>Try sign-in again</button></>}
        {account.state === "signed-in" && <><p className="small">{unlimited ? `No daily workflow count limit on your account.${networkNote}` : left === null ? "Up to 5 free AI workflows each day." : `${left} of ${dailyLimit} attempts left today.`}</p><div className="builder-ai-actions"><button className="btn btn-primary" data-testid="builder-ai-create" type="submit" disabled={busy || service !== "ready" || !selectedAvailable || !goal.trim() || goal.length > GOAL_LIMIT || left === 0}>{busy ? "Creating your workflow…" : "Create workflow"}</button>{busy && <button type="button" className="btn btn-dark" onClick={stop}>Cancel</button>}</div></>}
      </div>
    </form>
    {service === "loading" && <p className="small" role="status">Checking AI availability…</p>}
    {service === "unavailable" && <div className="builder-ai-service"><p className="small">AI assist is unavailable right now. You can still edit your workflow below.</p><button type="button" className="link-btn" onClick={() => setServiceRevision(value => value + 1)}>Try AI assist again</button></div>}
    {error && <p className="builder-ai-error" role="alert">{error}</p>}
    {status && <p className="small" role="status">{status}</p>}
    <details className="builder-ai-help"><summary>Usage and privacy</summary><p className="small">{unlimited ? `Service spending and safety limits still apply.${networkNote}` : "Failed attempts count toward the daily allowance. It resets at 00:00 UTC (5:30 a.m. India time). No payment details needed."}</p><p className="small">Your request, context and relevant skill descriptions go to our AI provider. When Assign minds is on, public mind profiles go too. The service stores generated results and usage records. For adults aged 18 or older. Read our <Link to="/terms">Terms</Link> and <Link to="/privacy#server">Privacy policy</Link>.</p></details>
    <Link to="/compose" className="builder-ai-advanced" onClick={event => {
      if (busy || signingIn) { event.preventDefault(); return; }
      try { sessionStorage.setItem("abb:composer-signin", JSON.stringify({ goal, context, choices: {}, useContext: false, customSkills: [], assignMinds })); }
      catch { event.preventDefault(); setError("Your request could not be carried over. Copy it before opening advanced options."); }
    }}>More planning options</Link>
  </section>;
}
