import { useId, useRef, useState } from "react";
import { Link } from "../lib/router";
import { ArrowIcon } from "../ui";
import { BRIEF_QUESTIONS, JOB_MAX, OUTCOME_PATHS, looksLikeSecret, outcomeMessage } from "./owner-view";
import { OutcomeTabs } from "./OutcomeTabs";
import { START } from "./outcome-copy";

export default function StartJob({ path, toast }: { path: string; toast: (message: string) => void }) {
  const [job, setJob] = useState("");
  const [status, setStatus] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);
  const preview = useRef<HTMLPreElement>(null);
  const id = useId();
  const message = outcomeMessage(job);
  const secret = looksLikeSecret(job);
  const empty = !job.trim();

  async function copy() {
    if (empty) { setStatus("Type the job first."); box.current?.focus(); return; }
    if (secret) { setStatus("Take the key out first."); box.current?.focus(); return; }
    try {
      await navigator.clipboard.writeText(message);
      setStatus("Copied. Paste it into your AI.");
      toast("Message copied");
    } catch {
      const range = document.createRange();
      if (preview.current) range.selectNodeContents(preview.current);
      const selection = window.getSelection();
      selection?.removeAllRanges(); selection?.addRange(range);
      setStatus("Text selected. Use your device's Copy command.");
    }
  }

  return (
    <>
      <header className="wrap bp-hero">
        <OutcomeTabs path={path} />
        <p className="bp-kicker"><span className="kind">Get it done</span>{START.kicker}</p>
        <h1 className="bp-h1">{START.h1}</h1>
        <p className="bp-sub">{START.sub}</p>
      </header>

      <div className="wrap gd-body">
        <section className="gd-goal" aria-labelledby={`${id}-goal`} data-testid="outcome-goal">
          <h2 className="gd-goal-h" id={`${id}-goal`}>What job do you need done?</h2>
          <label className="visually-hidden" htmlFor={`${id}-job`}>The job, in your own words</label>
          <textarea ref={box} id={`${id}-job`} className="gd-job" rows={3} maxLength={JOB_MAX} value={job} onChange={e => { setJob(e.target.value); setStatus(""); }}
            placeholder="Say it the way you'd tell a colleague" aria-describedby={`${id}-hint${secret ? ` ${id}-secret` : ""}`} data-testid="outcome-job" />
          <p className="small" id={`${id}-hint`}>Numbers can wait. Your AI asks for them.</p>
          {secret && <p className="gd-warn" id={`${id}-secret`} role="alert">That looks like a password or API key. Take it out. Your AI asks for a key only when a step needs one, and keeps it out of the job's files.</p>}
          <div className="gd-starters" role="group" aria-label="Or start from one of these">
            {START.starters.map(s => <button key={s} type="button" className="gd-chip" onClick={() => { setJob(s); setStatus(""); box.current?.focus(); }}>{s}</button>)}
          </div>

          <h3 className="gd-sub-h">Your message for your AI</h3>
          <pre ref={preview} className="gd-message" data-testid="outcome-message">{message}</pre>
          <div className="bp-actions gd-actions">
            <button type="button" className="btn btn-primary" onClick={copy} data-testid="outcome-copy">Copy the message</button>
            <Link to="/api-and-mcp" className="btn btn-dark" data-testid="outcome-connect">Connect your AI <ArrowIcon /></Link>
          </div>
          <p className="small gd-status" role="status" aria-live="polite">{status}</p>
          <p className="small">{START.pasteHint}</p>
        </section>

        <section className="bp-sec" id="what-happens" aria-labelledby="what-happens-h">
          <h2 className="bp-h2" id="what-happens-h">What happens after you paste it</h2>
          <ol className="num-list">{START.steps.map(([title, text], n) => (
            <li key={title}><span className="n">{n + 1}</span><span><b>{title}</b> {text}
              {n === 0 && <details className="went-in"><summary>The questions it covers</summary><ul className="gd-list">{BRIEF_QUESTIONS.map(q => <li key={q}>{q}</li>)}</ul></details>}
            </span></li>
          ))}</ol>
        </section>

        <section className="bp-sec" id="stops" aria-labelledby="stops-h">
          <h2 className="bp-h2" id="stops-h">Where it stops for you</h2>
          <p className="bp-note">{START.stopsLead}</p>
          <ul className="gd-stops">{START.stops.map(([title, text]) => <li key={title}><b>{title}</b><span>{text}</span></li>)}</ul>
        </section>

        <section className="bp-sec" id="who-does-what" aria-labelledby="who-h">
          <h2 className="bp-h2" id="who-h">Who does what</h2>
          <ul className="gd-facts">{START.facts.map(([title, text]) => <li key={title}><b>{title}</b> {text}</li>)}</ul>
        </section>

        <section className="bp-sec wide" id="more" aria-labelledby="more-h">
          <h2 className="bp-h2" id="more-h">See it first, or check a job you started</h2>
          <div className="gd-cards">
            <Link to={OUTCOME_PATHS.example} className="gd-card" data-testid="outcome-example-link"><b>See a whole job, screen by screen</b><span>Rising ad costs, from the owner's first line to the plan, the stops and how results are read.</span></Link>
            <Link to={OUTCOME_PATHS.status} className="gd-card" data-testid="outcome-status-link"><b>See where your job stands</b><span>Pick your job's folder. See what's done, what waits on you and what comes next.</span></Link>
          </div>
        </section>
      </div>
    </>
  );
}
