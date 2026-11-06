// Pieces shared by the intake pages: the agent card, job pickers, spec field inputs and small formatters.
import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import type { RequestQuestion, RequestView } from "../../../modules/intake/views.ts";

export type { RequestQuestion, RequestView };

/** One job type as GET /api/catalogue lists it. */
export interface JobSummary { id: string; title: string; summary: string; area: string; deliverable: string; turnaround_hours: number; price_from_usd: number; price_base_usd: number }

/** The parts of GET /api/agents/:id this page uses (the directory module owns the full shape). */
export interface AgentInfo {
  id: string; name: string; title: string; tagline?: string; portrait?: string; accent?: string;
  outcomes?: { id: string; title: string; deliverable?: string; job_type_id: string | null; job?: { price_from_usd?: number; turnaround_hours?: number } | null }[];
}

export const AREA_LABELS: Record<string, string> = {
  marketing: "Marketing", content: "Content", sales: "Sales", ecommerce: "Ecommerce", "customer-support": "Customer support",
  research: "Research", finance: "Finance", people: "People and HR", operations: "Operations", product: "Product",
};
export const areaLabel = (area: string) => AREA_LABELS[area] ?? area;

/** "12 hours", "1 day", "3 days". */
export function turnaround(hours: number): string {
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

export const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const HEX = /^#[0-9a-f]{6}$/i;

/** The agent's portrait on its accent colour, or its first letter when the picture is missing. */
export function AgentFace(props: { name: string; portrait?: string; accent?: string }) {
  const [failed, setFailed] = useState(false);
  const accent = props.accent && HEX.test(props.accent) ? props.accent : "var(--text)";
  return (
    <span class="intake-face" style={`--intake-accent:${accent}`} aria-hidden="true">
      {props.portrait && !failed
        ? <img src={props.portrait} alt="" width={56} height={56} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        : <span class="intake-face-letter">{props.name.slice(0, 1).toUpperCase()}</span>}
    </span>
  );
}

/** Small card: who you are hiring. */
export function AgentCard(props: { agent: AgentInfo; children?: ComponentChildren }) {
  const a = props.agent;
  return (
    <div class="intake-agent">
      <AgentFace name={a.name} portrait={a.portrait} accent={a.accent} />
      <div class="intake-agent-text">
        <strong>{a.name}</strong>
        <span class="muted small">{a.title}</span>
        {a.tagline && <span class="small">{a.tagline}</span>}
        {props.children}
      </div>
    </div>
  );
}

/** Job types grouped by area, as buttons. The chosen one is marked. */
export function JobTypeList(props: { jobs: JobSummary[]; value: string | null; onPick: (id: string) => void; busy?: boolean }) {
  const groups = new Map<string, JobSummary[]>();
  for (const j of props.jobs) groups.set(j.area, [...(groups.get(j.area) ?? []), j]);
  return (
    <div class="intake-jobs">
      {[...groups.entries()].map(([area, jobs]) => (
        <section class="intake-job-group" aria-label={areaLabel(area)}>
          <h3>{areaLabel(area)}</h3>
          <div class="intake-job-grid">
            {jobs.map(j => (
              <button type="button" class={`intake-job${props.value === j.id ? " intake-job-on" : ""}`} aria-pressed={props.value === j.id}
                disabled={props.busy} onClick={() => props.onPick(j.id)}>
                <span class="intake-job-title">{j.title}</span>
                <span class="intake-job-meta">From {usd(j.price_from_usd)} · {turnaround(j.turnaround_hours)}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export type AnswerValue = string | string[];

/** The right input for a spec field: text, long text, number, link, one choice, several choices or a list. */
export function QuestionInput(props: { q: RequestQuestion; value: AnswerValue | undefined; onValue: (v: AnswerValue) => void; error?: string }) {
  const { q } = props;
  const id = `intake-q-${q.field_id}`;
  const text = typeof props.value === "string" ? props.value : "";
  const picked = Array.isArray(props.value) ? props.value : [];
  const help = [q.help, q.type === "list" ? "One per line." : ""].filter(Boolean).join(" ");
  const label = (
    <>
      <span class="field-label">{q.question}</span>
      {q.question.replace(/\?$/, "").toLowerCase() !== q.label.replace(/\?$/, "").toLowerCase() && <span class="intake-q-label">{q.label}</span>}
    </>
  );
  const foot = (
    <>
      {help && <span class="field-help">{help}</span>}
      {props.error && <span class="field-error" role="alert">{props.error}</span>}
    </>
  );

  if (q.type === "choice" || q.type === "multichoice") {
    const multi = q.type === "multichoice";
    return (
      <fieldset class="field intake-choices">
        <legend>{label}</legend>
        <div class="intake-options">
          {(q.options ?? []).map(o => {
            const on = multi ? picked.includes(o) : text === o;
            return (
              <label class={`intake-option${on ? " intake-option-on" : ""}`}>
                <input type={multi ? "checkbox" : "radio"} name={id} value={o} checked={on}
                  onChange={() => props.onValue(multi ? (on ? picked.filter(p => p !== o) : [...picked, o]) : o)} />
                <span>{o}</span>
              </label>
            );
          })}
        </div>
        {foot}
      </fieldset>
    );
  }

  const common = { id, class: "input", value: text, "aria-invalid": props.error ? true : undefined } as const;
  let input;
  if (q.type === "longtext" || q.type === "list") {
    input = <textarea {...common} class="input textarea" rows={q.type === "list" ? 4 : 5} maxLength={q.type === "longtext" ? q.max : undefined}
      onInput={e => props.onValue((e.target as HTMLTextAreaElement).value)} />;
  } else if (q.type === "number") {
    input = <input {...common} type="number" inputMode="decimal" min={0} max={q.max} step="any" onInput={e => props.onValue((e.target as HTMLInputElement).value)} />;
  } else if (q.type === "url") {
    input = <input {...common} type="url" inputMode="url" placeholder="https://" autoComplete="url" onInput={e => props.onValue((e.target as HTMLInputElement).value)} />;
  } else {
    input = <input {...common} type="text" maxLength={q.max} onInput={e => props.onValue((e.target as HTMLInputElement).value)} />;
  }
  return (
    <label class="field" for={id}>
      {label}
      {input}
      {foot}
    </label>
  );
}

/** A spec value for the "what we took from your message" list. */
export function showValue(value: unknown, inRequest: boolean): string {
  if (inRequest) return "In your message";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") return value.toLocaleString("en-US");
  const s = String(value ?? "");
  return s.length > 160 ? `${s.slice(0, 157).replace(/\s+\S*$/, "")}...` : s;
}
