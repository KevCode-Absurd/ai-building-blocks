import { useId, useState } from "react";
import { Link } from "./lib/router";
import { AIM_MAX, AIM_QUESTIONS, AIM_SKILL, aimHigherPrompt, hasAim } from "./lib/aim-higher.mjs";
import { copyText } from "./lib/copy-text";
import "./aim-higher.css";

export type AimAnswers = Partial<Record<string, string>>;

/** Three optional questions after a request. The answers go into the caller's request; "Copy a better prompt" works in any chat AI. */
export default function AimHigher({ request, answers, onChange, onAdd, addLabel, toast }: {
  request: string; answers: AimAnswers; onChange: (next: AimAnswers) => void;
  /** When set, a button adds the answers to the caller's own field (Build a workflow's context). */
  onAdd?: () => void; addLabel?: string; toast: (message: string) => void;
}) {
  const id = useId();
  const [status, setStatus] = useState("");
  const answered = hasAim(answers);
  async function copyPrompt() {
    if (!request.trim()) { setStatus("Type what you need first."); return; }
    try {
      await copyText(aimHigherPrompt(request, answers));
      setStatus("Copied. Paste it into ChatGPT, Claude or Gemini.");
      toast("Better prompt copied");
    } catch { setStatus("Copy did not work here. Try again, or use a different browser."); }
  }
  return (
    <details className="aim-higher" data-testid="aim-higher">
      <summary>Aim higher <span className="small">(optional)</span></summary>
      <p className="small">Answer any of these. Your AI uses them to do the job the way a top expert would, and to end with a check that shows it worked.</p>
      {AIM_QUESTIONS.map(q => (
        <label key={q.id} className="aim-field" htmlFor={`${id}-${q.id}`}>{q.ask}
          <input id={`${id}-${q.id}`} type="text" maxLength={AIM_MAX} value={answers[q.id] ?? ""} placeholder={`For example: ${q.example}`}
            onChange={e => { onChange({ ...answers, [q.id]: e.currentTarget.value }); setStatus(""); }} data-testid={`aim-${q.id}`} />
        </label>
      ))}
      <div className="aim-actions">
        {onAdd && <button type="button" className="btn btn-line btn-sm" disabled={!answered} onClick={onAdd} data-testid="aim-add">{addLabel ?? "Add to my request"}</button>}
        <button type="button" className="btn btn-line btn-sm" onClick={() => void copyPrompt()} data-testid="aim-copy">Copy a better prompt</button>
      </div>
      <p className="small" role="status" aria-live="polite">{status}</p>
      <p className="small">Based on the <Link to={AIM_SKILL.path}>{AIM_SKILL.name}</Link> skill.</p>
    </details>
  );
}
