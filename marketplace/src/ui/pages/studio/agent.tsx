// /studio/agents/:id: one agent as a guided set of six steps with clear progress.
import { useState } from "preact/hooks";
import type { JSX } from "preact";
import { Badge, Button, Loaded, Notice, Page, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import type { StepId, StudioDetail } from "../../../modules/studio/service.ts";
import { GUIDE, STATUS, STEP_ORDER } from "./guide.ts";
import { BuildStep, ExamplesStep, InterviewStep, MarkupStep, PublishStep, TestStep, type StepProps } from "./steps.tsx";

const STEP_VIEWS: Record<StepId, (p: StepProps) => JSX.Element> = {
  interview: InterviewStep, examples: ExamplesStep, markup: MarkupStep, build: BuildStep, test: TestStep, publish: PublishStep,
};

function Stepper(props: { d: StudioDetail; step: StepId; onPick: (s: StepId) => void }) {
  return (
    <nav class="studio-stepper" aria-label="Steps">
      <ol>
        {STEP_ORDER.map(id => {
          const g = GUIDE[id], done = props.d.steps.find(s => s.id === id)?.done ?? false, on = id === props.step;
          return (
            <li>
              <button type="button" class={`studio-step${on ? " studio-step-on" : ""}${done ? " studio-step-done" : ""}`} aria-current={on ? "step" : undefined} onClick={() => props.onPick(id)}>
                <span class="studio-step-n" aria-hidden="true">{done ? "✓" : g.n}</span>
                <span class="studio-step-text">
                  <span class="studio-step-title">{g.title}</span>
                  <span class="studio-step-state">{done ? "Done" : props.d.current === id ? "Up next" : "To do"}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function StudioAgent(props: { params: Record<string, string>; query: URLSearchParams }) {
  const id = props.params.id;
  const [benchVersion, setBenchVersion] = useState<string | null>(props.query.get("version"));
  const state = useLoad(() => api<StudioDetail>(`/api/studio/agents/${encodeURIComponent(id)}${benchVersion ? `?version=${encodeURIComponent(benchVersion)}` : ""}`), [id, benchVersion]);
  const asked = props.query.get("step") as StepId | null;
  const [picked, setPicked] = useState<StepId | null>(asked && STEP_ORDER.includes(asked) ? asked : null);
  const base = `/api/studio/agents/${encodeURIComponent(id)}`;

  return (
    <Loaded state={state}>
      {d => {
        const step: StepId = picked ?? d.current ?? "publish";
        const g = GUIDE[step], s = STATUS[d.agent.status];
        const View = STEP_VIEWS[step];
        const doneCount = d.steps.filter(x => x.done).length;
        const goTo = (next: StepId) => {
          setPicked(next);
          history.replaceState(null, "", `${location.pathname}?step=${next}`);
          window.scrollTo(0, 0);
        };
        return (
          <Page wide title={d.agent.name} intro={<>{d.jobType?.title ?? d.agent.jobTypeTitle}. {s.text}</>} actions={<div class="studio-head-actions"><Badge tone={s.tone}>{s.label}</Badge><Button small kind="ghost" href="/studio">All my agents</Button></div>}>
            {!d.jobType && <Notice tone="warn">This job is no longer on the menu, so this agent cannot change. Contact us if you need help.</Notice>}
            <p class="small muted studio-overall">{doneCount} of 6 steps done. Most experts spend 10 to 15 hours in all.</p>
            <div class="studio-progress" aria-hidden="true"><span style={{ width: `${(doneCount / 6) * 100}%` }} /></div>
            <Stepper d={d} step={step} onPick={goTo} />
            <section class="studio-panel" aria-labelledby="studio-step-title">
              <header class="studio-guide">
                <p class="eyebrow">Step {g.n} of 6</p>
                <h2 id="studio-step-title">{g.title}</h2>
                <dl class="studio-guide-facts">
                  <div><dt>What to do</dt><dd>{g.todo}</dd></div>
                  <div><dt>Time</dt><dd>{g.time}</dd></div>
                  <div><dt>What happens next</dt><dd>{g.next}</dd></div>
                </dl>
              </header>
              <View d={d} reload={state.reload} base={base} goTo={goTo} setBenchVersion={v => setBenchVersion(v)} />
            </section>
          </Page>
        );
      }}
    </Loaded>
  );
}
