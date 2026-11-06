// The six studio steps. Each gets the whole studio record, a reload, and the agent's API base path.
import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { Badge, Button, Card, Field, Input, Markdown, Notice, Select, Table, TextArea } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import type { AgentPackage } from "../../../core/types.ts";
import type { BenchScore, BenchVerdict, InterviewQuestionView, StepId, StudioDetail, SuggestionView, TestView } from "../../../modules/studio/service.ts";

export interface StepProps { d: StudioDetail; reload: () => void; base: string; goTo: (s: StepId) => void; setBenchVersion: (v: string) => void }

function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setError(null);
    try { await fn(); } catch (e: any) { setError(e?.message ?? "Something went wrong. Try again."); } finally { setBusy(false); }
  };
  return { busy, error, run };
}

const Err = (p: { error: string | null }) => (p.error ? <Notice tone="bad">{p.error}</Notice> : null);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function NextStep(props: { show: boolean; to: StepId; label: string; goTo: (s: StepId) => void; children?: ComponentChildren }) {
  if (!props.show) return null;
  return <Notice tone="good" title="This step is done">{props.children}<div class="studio-next"><Button small onClick={() => props.goTo(props.to)}>{props.label}</Button></div></Notice>;
}

// ---------- 1 Interview ----------

function AnsweredQuestion(props: { q: InterviewQuestionView; base: string; reload: () => void }) {
  const q = props.q;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(q.answer ?? "");
  const act = useAction();
  return (
    <details class="studio-answered">
      <summary><span>{q.text}</span>{q.skipped ? <Badge>Skipped</Badge> : <Badge tone="good">Answered</Badge>}</summary>
      {editing ? (
        <div>
          <TextArea value={text} onValue={setText} rows={6} maxLength={6000} aria-label="Your answer" />
          <Err error={act.error} />
          <div class="row">
            <Button small busy={act.busy} onClick={() => act.run(async () => {
              await api(`${props.base}/interview`, { body: { questionId: q.id, answer: text } });
              setEditing(false); props.reload();
            })}>Save answer</Button>
            <Button small kind="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div>
          {q.answer && <p class="studio-pre">{q.answer}</p>}
          {q.followUp && (
            <div class="studio-followup">
              <p class="small"><strong>Follow-up:</strong> {q.followUp.text}</p>
              {q.followUp.answer ? <p class="studio-pre">{q.followUp.answer}</p> : <p class="muted small">{q.followUp.skipped ? "Skipped." : "Not answered yet."}</p>}
            </div>
          )}
          <Button small kind="secondary" onClick={() => { setText(q.answer ?? ""); setEditing(true); }}>{q.answer ? "Edit answer" : "Answer it now"}</Button>
        </div>
      )}
    </details>
  );
}

export function InterviewStep({ d, reload, base, goTo }: StepProps) {
  const iv = d.interview;
  const [answer, setAnswer] = useState("");
  const [playbook, setPlaybook] = useState(iv.playbook);
  const [preview, setPreview] = useState(false);
  const act = useAction(), pb = useAction();
  useEffect(() => { setPlaybook(iv.playbook); }, [iv.playbook, iv.playbookUpdatedAt]);
  useEffect(() => { setAnswer(""); }, [iv.next?.id]);
  const done = d.steps.find(s => s.id === "interview")?.done ?? false;
  const answered = iv.questions.filter(q => q.answer !== null || q.skipped);
  const required = iv.questions.filter(q => q.required).length;

  return (
    <div class="stack">
      <p class="small muted">
        {iv.answered} of {iv.total} questions answered. {iv.requiredLeft ? `${plural(iv.requiredLeft, "required question")} left.` : "All required questions are answered."}
        {" "}The first {required} are required. The rest make your agent better.
      </p>
      {iv.next && (
        <Card title={iv.next.kind === "follow_up" ? "A follow-up question" : iv.next.required ? "Next question" : "Next question (optional)"} class="studio-question">
          {iv.next.parentText && <p class="small muted">About your answer to: {iv.next.parentText}</p>}
          <p class="studio-question-text">{iv.next.text}</p>
          <Field label="Your answer" help={iv.next.help} id="studio-answer">
            <TextArea id="studio-answer" value={answer} onValue={setAnswer} rows={8} maxLength={6000} placeholder="Write it the way you would explain it to a new colleague." />
          </Field>
          <p class="small muted">{answer.length} of 6,000 characters</p>
          <Err error={act.error} />
          <div class="row">
            <Button busy={act.busy} disabled={answer.trim().length < 20} onClick={() => act.run(async () => {
              await api(`${base}/interview`, { body: { questionId: iv.next!.id, answer } });
              reload();
            })}>Save answer</Button>
            {!iv.next.required && (
              <Button kind="ghost" disabled={act.busy} onClick={() => act.run(async () => {
                await api(`${base}/interview`, { body: { questionId: iv.next!.id, skip: true } });
                reload();
              })}>Skip this one</Button>
            )}
          </div>
        </Card>
      )}

      <Card title="Your playbook" class="studio-playbook">
        {!iv.canDraftPlaybook && !iv.playbook && <p class="muted">Answer the required questions first. Then we draft your playbook from your answers, and you edit it.</p>}
        {iv.canDraftPlaybook && !iv.playbook && (
          <div>
            <p>We will turn your answers into a playbook: your method, your quality bar, your red lines and what you do when facts are missing. It takes up to a minute.</p>
            <Err error={pb.error} />
            <Button busy={pb.busy} onClick={() => pb.run(async () => { await api(`${base}/playbook/draft`, { body: {} }); reload(); })}>Draft my playbook</Button>
          </div>
        )}
        {!!iv.playbook && (
          <div>
            <p class="small muted">
              {iv.playbookSource === "ai" ? "Drafted from your answers. Edit anything that does not sound like you." : "Edited by you."}
              {iv.playbookUpdatedAt && ` Saved ${when(iv.playbookUpdatedAt)}.`}
            </p>
            <div class="row studio-toggle">
              <Button small kind={preview ? "ghost" : "secondary"} onClick={() => setPreview(false)}>Edit</Button>
              <Button small kind={preview ? "secondary" : "ghost"} onClick={() => setPreview(true)}>Preview</Button>
            </div>
            {preview ? <Markdown text={playbook} class="studio-preview" /> : <TextArea value={playbook} onValue={setPlaybook} rows={20} maxLength={20000} aria-label="Your playbook" />}
            <p class="small muted">{playbook.length} of 20,000 characters</p>
            <Err error={pb.error} />
            <div class="row">
              <Button busy={pb.busy} disabled={playbook === iv.playbook || playbook.trim().length < 100} onClick={() => pb.run(async () => { await api(`${base}/playbook`, { body: { playbook } }); reload(); })}>Save playbook</Button>
              {iv.canDraftPlaybook && (
                <Button kind="ghost" disabled={pb.busy} onClick={() => {
                  if (!confirm("Draft it again from your answers? This replaces the playbook you see now.")) return;
                  void pb.run(async () => { await api(`${base}/playbook/draft`, { body: {} }); reload(); });
                }}>Draft again from my answers</Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {answered.length > 0 && (
        <Card title="Your answers">
          <p class="small muted">Change any answer here. Redraft the playbook, or edit it by hand, to use the change.</p>
          {answered.map(q => <AnsweredQuestion q={q} base={base} reload={reload} />)}
        </Card>
      )}
      <NextStep show={done} to="examples" label="Go to step 2: Examples" goTo={goTo}>Your playbook is saved. Next, add examples of your past work.</NextStep>
    </div>
  );
}

// ---------- 2 Examples ----------

const RIGHTS_LABEL = { own_work: "My own work", client_permission: "Client gave permission" } as const;

export function ExamplesStep({ d, reload, base, goTo }: StepProps) {
  const empty = { title: "", brief: "", audience: "", result: "", notes: "", rights: "own_work" as "own_work" | "client_permission" };
  const [f, setF] = useState(empty);
  const [confirmed, setConfirmed] = useState(false);
  const act = useAction(), rm = useAction();
  const set = (k: keyof typeof empty) => (v: string) => setF({ ...f, [k]: v });
  const full = d.exampleChars.count >= d.exampleChars.maxCount;
  return (
    <div class="stack">
      <Notice tone="info" title="Private to you">Buyers never see your examples. Your agent learns from them but never copies their text or names your clients.</Notice>
      <p class="small muted">{plural(d.exampleChars.count, "example")} of {d.exampleChars.maxCount}. {d.exampleChars.used.toLocaleString("en-US")} of {d.exampleChars.max.toLocaleString("en-US")} characters used.</p>
      {d.examples.map(e => (
        <Card class="studio-example" title={e.title} actions={
          <Button small kind="danger" busy={rm.busy} onClick={() => {
            if (!confirm(`Remove "${e.title}"? Your next build will not learn from it.`)) return;
            void rm.run(async () => { await api(`${base}/examples/${e.id}`, { method: "DELETE" }); reload(); });
          }}>Remove</Button>
        }>
          <p class="small"><Badge tone="good">{RIGHTS_LABEL[e.rights]}</Badge> <span class="muted">For {e.audience}. Rights confirmed {when(e.rightsConfirmedAt)}.</span></p>
          <details><summary>Show the brief and the work</summary>
            <h3 class="studio-sub">Brief</h3><p class="studio-pre">{e.brief}</p>
            <h3 class="studio-sub">Finished work</h3><p class="studio-pre">{e.result}</p>
            {e.notes && <><h3 class="studio-sub">Why it worked</h3><p class="studio-pre">{e.notes}</p></>}
          </details>
        </Card>
      ))}
      <Err error={rm.error} />
      {full ? <Notice tone="warn">You have added the most examples we can take. Remove one to add another.</Notice> : (
        <Card title="Add an example">
          <Field label="A short title" help="For you only, such as 'Pricing page for a yoga studio'." id="ex-title"><Input id="ex-title" value={f.title} onValue={set("title")} maxLength={120} /></Field>
          <Field label="The brief" help="What the client asked for, in their words if you have them. Remove names and private details." id="ex-brief"><TextArea id="ex-brief" value={f.brief} onValue={set("brief")} rows={5} maxLength={4000} /></Field>
          <Field label="Who it was for" help="The reader or customer, such as 'owners of small dog-grooming shops'." id="ex-aud"><Input id="ex-aud" value={f.audience} onValue={set("audience")} maxLength={300} /></Field>
          <Field label="The finished work" help="Paste the work you delivered. Up to 20,000 characters." id="ex-result"><TextArea id="ex-result" value={f.result} onValue={set("result")} rows={10} maxLength={20000} /></Field>
          <Field label="Why it worked (optional)" help="What you did that made it good. Your agent learns most from this." id="ex-notes"><TextArea id="ex-notes" value={f.notes} onValue={set("notes")} rows={3} maxLength={1000} /></Field>
          <Field label="Who owns this work?" id="ex-rights">
            <Select id="ex-rights" value={f.rights} onValue={v => setF({ ...f, rights: v as typeof f.rights })} options={[{ value: "own_work", label: RIGHTS_LABEL.own_work }, { value: "client_permission", label: RIGHTS_LABEL.client_permission }]} />
          </Field>
          <label class="studio-check">
            <input type="checkbox" checked={confirmed} onChange={e => setConfirmed((e.target as HTMLInputElement).checked)} />
            <span>{d.rightsStatements[f.rights]}</span>
          </label>
          <Err error={act.error} />
          <Button busy={act.busy} disabled={!confirmed || !f.title.trim() || !f.brief.trim() || !f.audience.trim() || !f.result.trim()} onClick={() => act.run(async () => {
            await api(`${base}/examples`, { body: { ...f, rightsConfirmed: confirmed } });
            setF(empty); setConfirmed(false); reload();
          })}>Add example</Button>
        </Card>
      )}
      <NextStep show={d.examples.length > 0} to="markup" label="Go to step 3: Mark up plain AI" goTo={goTo}>
        {d.examples.length < 3 ? "One example is enough to build. Three to five teach your agent more." : "Next, show us what plain AI gets wrong."}
      </NextStep>
    </div>
  );
}

// ---------- 3 Mark up plain AI ----------

function highlight(text: string, passages: string[]): ComponentChildren[] {
  const ranges: [number, number][] = [];
  for (const p of passages) { const i = text.indexOf(p); if (i >= 0) ranges.push([i, i + p.length]); }
  ranges.sort((a, b) => a[0] - b[0]);
  const out: ComponentChildren[] = [];
  let pos = 0;
  for (const [s, e] of ranges) {
    if (s < pos) continue;
    if (s > pos) out.push(text.slice(pos, s));
    out.push(<mark class="studio-mark">{text.slice(s, e)}</mark>);
    pos = e;
  }
  out.push(text.slice(pos));
  return out;
}

export function MarkupStep({ d, reload, base, goTo }: StepProps) {
  const m = d.markup;
  const briefs = d.jobType?.sampleBriefs ?? [];
  const [briefId, setBriefId] = useState(m.briefId ?? briefs[0]?.id ?? "");
  const [passage, setPassage] = useState("");
  const [reason, setReason] = useState("");
  const draftRef = useRef<HTMLDivElement>(null);
  const make = useAction(), add = useAction(), rm = useAction();
  const capture = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && sel?.anchorNode && draftRef.current?.contains(sel.anchorNode)) setPassage(text);
  };
  const makeDraft = () => make.run(async () => { await api(`${base}/markup`, { body: { briefId } }); reload(); });

  return (
    <div class="stack">
      {!m.draft ? (
        <Card title="Make the plain AI draft">
          <p>We give plain AI one of this job's sample briefs, with a good general prompt. This is the work your agent has to beat.</p>
          {briefs.length > 1 && <Field label="Sample brief" id="mk-brief"><Select id="mk-brief" value={briefId} onValue={setBriefId} options={briefs.map((b, i) => ({ value: b.id, label: `Brief ${i + 1}: ${b.text.slice(0, 70)}...` }))} /></Field>}
          {briefs.find(b => b.id === briefId) && <p class="studio-pre small">{briefs.find(b => b.id === briefId)!.text}</p>}
          <Err error={make.error} />
          <Button busy={make.busy} disabled={!briefs.length} onClick={makeDraft}>Make the plain AI draft</Button>
          <p class="small muted">This takes up to a minute.</p>
        </Card>
      ) : (
        <>
          <Card title="The brief">
            <p class="studio-pre">{m.brief}</p>
            <p class="small muted">Made {when(m.madeAt)}.</p>
          </Card>
          <Card title="Plain AI's draft">
            <p class="small muted">Select a passage you would never send to a client. It appears in the box below. Marked passages are highlighted.</p>
            <div class="studio-draft" ref={draftRef} onMouseUp={capture} onTouchEnd={capture}>{highlight(m.draft, m.marks.map(x => x.passage))}</div>
          </Card>
          <Card title="Mark a passage">
            <Field label="The passage" help="Select it in the draft, or copy and paste it exactly." id="mk-passage">
              <TextArea id="mk-passage" value={passage} onValue={setPassage} rows={3} maxLength={2000} />
            </Field>
            <Field label="Why would you never ship it?" help="Say what is wrong, such as 'generic claim with no proof' or 'talks about us, not the reader'." id="mk-reason">
              <Input id="mk-reason" value={reason} onValue={setReason} maxLength={500} />
            </Field>
            <Err error={add.error} />
            <div class="row">
              <Button busy={add.busy} disabled={passage.trim().length < 3 || reason.trim().length < 5} onClick={() => add.run(async () => {
                await api(`${base}/marks`, { body: { passage, reason } });
                setPassage(""); setReason(""); reload();
              })}>Mark it</Button>
              <Button kind="ghost" onClick={capture}>Use selected text</Button>
            </div>
          </Card>
          {m.marks.length > 0 && (
            <Card title={`Your marks (${m.marks.length})`}>
              <ul class="studio-marks">
                {m.marks.map(x => (
                  <li>
                    <blockquote>{x.passage}</blockquote>
                    <p class="small">{x.reason}</p>
                    <Button small kind="ghost" busy={rm.busy} onClick={() => rm.run(async () => { await api(`${base}/marks/${x.id}`, { method: "DELETE" }); reload(); })}>Remove</Button>
                  </li>
                ))}
              </ul>
              <Err error={rm.error} />
            </Card>
          )}
          <details class="studio-redo">
            <summary>Try a different sample brief</summary>
            <p class="small muted">Your marks so far stay. They still teach your agent.</p>
            {briefs.length > 1 && <Field label="Sample brief" id="mk-brief2"><Select id="mk-brief2" value={briefId} onValue={setBriefId} options={briefs.map((b, i) => ({ value: b.id, label: `Brief ${i + 1}: ${b.text.slice(0, 70)}...` }))} /></Field>}
            <Err error={make.error} />
            <Button small kind="secondary" busy={make.busy} onClick={makeDraft}>Make a new plain AI draft</Button>
          </details>
        </>
      )}
      <NextStep show={m.marks.length > 0} to="build" label="Go to step 4: Build" goTo={goTo}>
        {m.marks.length < 5 ? "One mark is enough to build. Most experts mark 5 to 10 passages." : "You are ready to build your agent."}
      </NextStep>
    </div>
  );
}

// ---------- 4 Build ----------

function PackageSummary(props: { pkg: AgentPackage }) {
  const p = props.pkg;
  const list = (items: string[], empty: string) => (items.length ? <ul class="studio-list">{items.map(i => <li>{i}</li>)}</ul> : <p class="muted small">{empty}</p>);
  return (
    <div class="studio-package">
      <p>{p.skill.description}</p>
      <h3 class="studio-sub">How it works ({plural(p.steps.length, "step")})</h3>
      <ol class="studio-list">{p.steps.map(s => <li>{s.title}</li>)}</ol>
      <h3 class="studio-sub">Style rules</h3>{list(p.style_rules, "None yet.")}
      <h3 class="studio-sub">Never writes</h3>{list(p.banned_patterns, "None yet.")}
      <h3 class="studio-sub">Checks before it finishes</h3>{list(p.checklist, "None yet.")}
      <h3 class="studio-sub">Reference files</h3>{list(p.files.map(f => f.path), "None.")}
      <details><summary>See the full package</summary><pre class="studio-json">{JSON.stringify(p, null, 2)}</pre></details>
    </div>
  );
}

export function BuildStep({ d, reload, base, goTo }: StepProps) {
  const [changelog, setChangelog] = useState("");
  const act = useAction();
  const waiting = d.suggestions.filter(s => s.status === "approved" && s.appliedVersion === null).length;
  const nextVersion = (d.versions[0]?.version ?? 0) + 1;
  const ready = [
    { ok: !!d.interview.playbook.trim(), text: "Your playbook (step 1)" },
    { ok: d.examples.length > 0, text: `${plural(d.examples.length, "example")} of your work (step 2)` },
    { ok: d.markup.marks.length > 0, text: `${plural(d.markup.marks.length, "marked passage")} (step 3)` },
  ];
  return (
    <div class="stack">
      <Card title={`Build version ${nextVersion}`}>
        <ul class="studio-ready">
          {ready.map(r => <li class={r.ok ? "studio-ok" : "studio-missing"}><span aria-hidden="true">{r.ok ? "✓" : "○"}</span> {r.text}{r.ok ? "" : ": needed"}</li>)}
          {d.versions.length > 0 && <li class="studio-ok"><span aria-hidden="true">✓</span> {waiting ? `${plural(waiting, "new rule")} from your test bench edits` : "No new rules from the test bench yet"}</li>}
        </ul>
        <Field label="What changed (optional)" help="A note for yourself and the AI Blocks team." id="b-log"><Input id="b-log" value={changelog} onValue={setChangelog} maxLength={500} /></Field>
        <Err error={act.error} />
        <Button busy={act.busy} disabled={!ready.every(r => r.ok)} onClick={() => act.run(async () => {
          await api(`${base}/build`, { body: { changelog: changelog.trim() || undefined } });
          setChangelog(""); reload();
        })}>Build version {nextVersion}</Button>
        <p class="small muted">Building takes a minute or two. Each build is a new draft version. Older versions stay as they were.</p>
      </Card>
      {d.versions.length > 0 && (
        <Card title="Versions">
          <Table head={["Version", "Status", "Built", "Test drafts", "Notes"]} rows={d.versions.map(v => [
            String(v.version),
            <Badge tone={v.status === "published" ? "good" : "neutral"}>{v.status === "published" ? "Published" : "Draft"}</Badge>,
            when(v.createdAt),
            v.tests.done ? String(v.tests.done) : "None",
            v.changelog,
          ])} />
        </Card>
      )}
      {d.latest?.package && <Card title={`What's in version ${d.latest.version}`}><PackageSummary pkg={d.latest.package} /></Card>}
      <NextStep show={d.versions.length > 0} to="test" label="Go to step 5: Test bench" goTo={goTo}>Try version {d.versions[0]?.version} on the sample briefs, next to plain AI.</NextStep>
    </div>
  );
}

// ---------- 5 Test bench ----------

const NOT_COMPARED: Record<"daily_limit" | "judge_failed" | "old", string> = {
  daily_limit: "We hit today's limit for AI work, so this pair was not compared. Run the test bench again tomorrow to compare it.",
  judge_failed: "The judge did not give a clear answer this time. Run the test bench again to compare this pair.",
  old: "This run is from before we compared drafts. Run the test bench again to see how your agent does against plain AI.",
};

/** One pair's result against plain AI: a badge, a line about what it means, and the judge's reasons. */
function Verdict(props: { verdict: BenchVerdict | null }) {
  const v = props.verdict;
  if (!v || v.status === "skipped") {
    return (
      <div class="studio-verdict">
        <Badge>Not compared</Badge>
        <span class="small muted studio-verdict-text">{NOT_COMPARED[v ? v.code : "old"]}</span>
      </div>
    );
  }
  const badge = v.winner === "agent" ? <Badge tone="good">Beat plain AI</Badge>
    : v.winner === "baseline" ? <Badge tone="warn">Plain AI did better</Badge>
    : <Badge>About the same</Badge>;
  return (
    <div class="studio-verdict">
      {badge}
      <span class="small muted studio-verdict-text">
        Another AI judged the two drafts twice, once in each order. If its two answers differ, the pair counts as about the same.
        {v.avoidedProvider ? " The judge comes from a different AI company than the one that wrote your draft." : ""}
      </span>
      {v.reasons && <details class="studio-verdict-why"><summary>Why</summary><p class="small studio-pre">{v.reasons}</p></details>}
    </div>
  );
}

function BenchSummary(props: { score: BenchScore; total: number }) {
  const s = props.score;
  if (!s.judged) {
    if (!s.skipped) return null;
    return <Notice tone="info" title="Not compared with plain AI">{plural(s.skipped, "pair was", "pairs were")} not compared this time. Each one below says why.</Notice>;
  }
  const tone = s.agentWins > s.baselineWins ? "good" : s.baselineWins > s.agentWins ? "warn" : "info";
  const parts = [
    s.baselineWins ? `Plain AI did better on ${s.baselineWins}.` : "",
    s.ties ? `${plural(s.ties, "pair was", "pairs were")} about the same.` : "",
    s.skipped ? `${plural(s.skipped, "pair was", "pairs were")} not compared.` : "",
  ].filter(Boolean).join(" ");
  return (
    <Notice tone={tone} title={`Your agent beat plain AI on ${s.agentWins} of ${props.total} sample ${props.total === 1 ? "brief" : "briefs"}`}>
      {parts || "Your agent's draft was better every time."} {s.baselineWins ? "Read why below, then edit those drafts so your agent learns." : ""}
    </Notice>
  );
}

function EditDraft(props: { t: TestView; base: string; reload: () => void; onSuggested: (s: SuggestionView[], notice: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(props.t.agentDraft ?? "");
  const [reason, setReason] = useState("");
  const act = useAction();
  if (!open) return <Button small kind="secondary" onClick={() => { setText(props.t.agentDraft ?? ""); setOpen(true); }}>Edit this draft</Button>;
  return (
    <div class="studio-edit">
      <Field label="Your edited version" help="Change it the way you would before sending it to a client." id={`ed-${props.t.id}`}>
        <TextArea id={`ed-${props.t.id}`} value={text} onValue={setText} rows={14} maxLength={40000} />
      </Field>
      <Field label="Why did you change it?" help="One or two sentences. We suggest rules from this." id={`er-${props.t.id}`}>
        <Input id={`er-${props.t.id}`} value={reason} onValue={setReason} maxLength={1000} />
      </Field>
      <Err error={act.error} />
      <div class="row">
        <Button small busy={act.busy} disabled={reason.trim().length < 5 || text === props.t.agentDraft} onClick={() => act.run(async () => {
          const res = await api<{ suggestions: SuggestionView[]; notice: string | null }>(`${props.base}/tests/${props.t.id}/edit`, { body: { edited: text, reason } });
          setOpen(false); setReason(""); props.onSuggested(res.suggestions, res.notice); props.reload();
        })}>Save edit</Button>
        <Button small kind="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

function SuggestionCard(props: { s: SuggestionView; base: string; reload: () => void }) {
  const s = props.s;
  const [text, setText] = useState(s.text);
  const act = useAction();
  const decide = (decision: "approve" | "decline") => act.run(async () => {
    await api(`${props.base}/suggestions/${s.id}`, { body: { decision, text: text !== s.text ? text : undefined } });
    props.reload();
  });
  return (
    <li class="studio-suggestion">
      <Badge tone="info">{s.target === "checklist" ? "Checklist item" : "Style rule"}</Badge>
      {s.status === "proposed"
        ? <Input value={text} onValue={setText} maxLength={400} aria-label="The rule" />
        : <p>{s.text}</p>}
      {s.why && <p class="small muted">{s.why}</p>}
      {s.status === "approved" && <p class="small">{s.appliedVersion ? `In version ${s.appliedVersion} and every build after it.` : "Goes into your next build."}</p>}
      <Err error={act.error} />
      <div class="row">
        {s.status !== "approved" && <Button small busy={act.busy} disabled={text.trim().length < 5} onClick={() => decide("approve")}>Approve</Button>}
        {s.status !== "declined" && <Button small kind="ghost" busy={act.busy} onClick={() => decide("decline")}>{s.status === "approved" ? "Remove from next build" : "Decline"}</Button>}
      </div>
    </li>
  );
}

export function TestStep({ d, reload, base, goTo, setBenchVersion }: StepProps) {
  const [version, setVersion] = useState(String(d.bench?.version ?? d.versions[0]?.version ?? ""));
  const [fresh, setFresh] = useState<{ suggestions: SuggestionView[]; notice: string | null } | null>(null);
  const act = useAction();
  useEffect(() => { setVersion(String(d.bench?.version ?? d.versions[0]?.version ?? "")); }, [d.bench?.version, d.versions[0]?.version]);
  if (!d.versions.length) return <Notice tone="info">Build your agent first, in step 4. Then you can test it here.</Notice>;
  const bench = d.bench;
  const briefCount = d.jobType?.sampleBriefs.length ?? 0;
  const proposed = d.suggestions.filter(s => s.status === "proposed");
  const approved = d.suggestions.filter(s => s.status === "approved");
  const declined = d.suggestions.filter(s => s.status === "declined");
  const waiting = approved.filter(s => s.appliedVersion === null).length;
  const switchVersion = (v: string) => { setVersion(v); setFresh(null); setBenchVersion(v); };
  return (
    <div class="stack">
      <Card title="Run the test bench">
        {d.versions.length > 1 && (
          <Field label="Version to test" id="tb-version">
            <Select id="tb-version" value={version} onValue={switchVersion} options={d.versions.map(v => ({ value: String(v.version), label: `Version ${v.version} (${v.status === "published" ? "published" : "draft"})` }))} />
          </Field>
        )}
        <p>Your agent and plain AI each write a draft for {plural(Math.min(briefCount, 3), "sample brief")}. You see them side by side. Then another AI compares each pair and says which draft is better.</p>
        <Err error={act.error} />
        <Button busy={act.busy} onClick={() => act.run(async () => {
          await api(`${base}/test`, { body: { version: Number(version) } });
          setFresh(null); setBenchVersion(version); reload();
        })}>Run version {version}</Button>
        <p class="small muted">This takes 2 to 4 minutes. You can run it 6 times a day.</p>
      </Card>

      {fresh?.notice && <Notice tone="warn">{fresh.notice}</Notice>}
      {fresh && fresh.suggestions.length > 0 && <Notice tone="good" title={`${plural(fresh.suggestions.length, "new rule")} to review`}>We suggested rules from your edit. Approve or decline them below.</Notice>}

      {bench && bench.tests.length > 0 && (
        <>
          <p class="small muted">Version {bench.version}, run {when(bench.tests[0].createdAt)}.{bench.earlierRuns ? ` ${plural(bench.earlierRuns, "earlier run")} not shown.` : ""}</p>
          <BenchSummary score={bench.vsPlainAi} total={bench.tests.filter(t => t.status === "done").length} />
          {bench.tests.map((t, i) => (
            <Card title={`Sample brief ${i + 1}`} class="studio-test">
              <p class="studio-pre small">{t.brief}</p>
              {t.status === "failed" ? <Notice tone="bad">{t.error ?? "This run did not finish."}</Notice> : (
                <>
                <Verdict verdict={t.verdict} />
                <div class="studio-side">
                  <section>
                    <h3 class="studio-sub">Your agent</h3>
                    <div class="studio-draft-box">{t.agentDraft ? <Markdown text={t.agentDraft} /> : <p class="muted">No draft.</p>}</div>
                    {t.edits.map(e => <p class="small studio-edited"><strong>You edited it:</strong> {e.reason}</p>)}
                    {t.agentDraft && <EditDraft t={t} base={base} reload={reload} onSuggested={(s, n) => setFresh({ suggestions: s, notice: n })} />}
                  </section>
                  <section>
                    <h3 class="studio-sub">Plain AI</h3>
                    <div class="studio-draft-box">{t.baselineDraft ? <Markdown text={t.baselineDraft} /> : <p class="muted">No draft.</p>}</div>
                  </section>
                </div>
                </>
              )}
            </Card>
          ))}
        </>
      )}
      {bench && !bench.tests.length && <p class="muted">Version {bench.version} has not been tested yet.</p>}

      <Card title="Rules from your edits">
        {!d.suggestions.length && <p class="muted">Edit one of your agent's drafts and say why. We suggest rules from your edits. Nothing changes until you approve a rule.</p>}
        {proposed.length > 0 && <><h3 class="studio-sub">To review ({proposed.length})</h3><ul class="studio-suggestions">{proposed.map(s => <SuggestionCard s={s} base={base} reload={reload} />)}</ul></>}
        {approved.length > 0 && <><h3 class="studio-sub">Approved ({approved.length})</h3><ul class="studio-suggestions">{approved.map(s => <SuggestionCard s={s} base={base} reload={reload} />)}</ul></>}
        {declined.length > 0 && (
          <details><summary>Declined ({declined.length})</summary><ul class="studio-suggestions">{declined.map(s => <SuggestionCard s={s} base={base} reload={reload} />)}</ul></details>
        )}
      </Card>
      {waiting > 0 && <Notice tone="info" title={`${plural(waiting, "approved rule")} waiting`}>Build a new version to use them, then test it again.<div class="studio-next"><Button small onClick={() => goTo("build")}>Go to step 4: Build</Button></div></Notice>}
      <NextStep show={!waiting && !proposed.length && (d.versions[0]?.tests.done ?? 0) > 0} to="publish" label="Go to step 6: Publish" goTo={goTo}>
        When you would send your agent's drafts to a client as they are, publish that version.
      </NextStep>
    </div>
  );
}

// ---------- 6 Publish ----------

export function PublishStep({ d, reload, base }: StepProps) {
  const ready = d.versions.filter(v => v.status === "draft" && v.tests.done > 0);
  const published = d.versions.filter(v => v.status === "published");
  const [version, setVersion] = useState(String(ready[0]?.version ?? ""));
  const [understood, setUnderstood] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const act = useAction();
  useEffect(() => { if (!ready.some(v => String(v.version) === version)) setVersion(String(ready[0]?.version ?? "")); }, [ready.map(v => v.version).join(",")]);
  const retired = d.agent.status === "retired";
  return (
    <div class="stack">
      {done && <Notice tone="good" title={`Version ${done} is published`}>The AI Blocks team will check it with test jobs, then put it live. We will email you when it is live.</Notice>}
      {retired ? <Notice tone="warn">This agent is retired. Contact us if you want to bring it back.</Notice> : ready.length ? (
        <Card title="Publish a version">
          <Field label="Version" id="pub-version">
            <Select id="pub-version" value={version} onValue={setVersion} options={ready.map(v => ({ value: String(v.version), label: `Version ${v.version}, ${plural(v.tests.done, "test draft")}` }))} />
          </Field>
          <label class="studio-check">
            <input type="checkbox" checked={understood} onChange={e => setUnderstood((e.target as HTMLInputElement).checked)} />
            <span>I understand a published version can never change. To change my agent later, I build and publish a new version.</span>
          </label>
          <Err error={act.error} />
          <Button busy={act.busy} disabled={!understood || !version} onClick={() => act.run(async () => {
            await api(`${base}/publish`, { body: { version: Number(version) } });
            setDone(Number(version)); setUnderstood(false); reload();
          })}>Publish version {version}</Button>
        </Card>
      ) : (
        <Notice tone="info">{d.versions.some(v => v.status === "draft") ? "Run the test bench on a draft version first, in step 5. Then you can publish it here." : "Build a new version in step 4 to publish it."}</Notice>
      )}
      {published.length > 0 && (
        <Card title="Published versions">
          <Table head={["Version", "Published", "Status"]} rows={published.map(v => [
            String(v.version), when(v.publishedAt),
            d.agent.liveVersion === v.version && d.agent.status === "live" ? <Badge tone="good">Live</Badge> : <Badge>Published</Badge>,
          ])} />
        </Card>
      )}
    </div>
  );
}
