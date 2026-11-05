import { useEffect, useState } from "react";
import { trackUxEvent } from "./lib/ux-events";
import "./item-votes.css";

type Answer = { yes: number; no: number; mine: boolean | null };

/** "Did it work for you?": one tap, no account. The totals show everyone how it went for other people.
 *  Answers are kept per item by src/server/votes.ts. If the service is off, the whole box stays hidden. */
export default function ItemVotes({ slug, noun }: { slug: string; noun: string }) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    setAnswer(null); setError("");
    fetch(`/api/votes?slug=${encodeURIComponent(slug)}`)
      .then(async r => { if (!r.ok) throw Error(); const data = await r.json() as Answer; if (live) setAnswer(data); })
      .catch(() => { if (live) setAnswer(null); });
    return () => { live = false; };
  }, [slug]);
  if (!answer) return null;

  const send = async (worked: boolean) => {
    if (busy) return;
    const next = answer.mine === worked ? null : worked; // Tapping your answer again takes it back.
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/votes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, worked: next }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw Error(data.error || "Your answer didn't save. Try again.");
      setAnswer(data as Answer);
      if (next === true) trackUxEvent("result_useful");
      if (next === false) trackUxEvent("result_needs_work");
    } catch (e) { setError(e instanceof Error && e.message ? e.message : "Your answer didn't save. Try again."); }
    finally { setBusy(false); }
  };

  const total = answer.yes + answer.no;
  return (
    <section className="item-votes" id="item-votes" data-testid="item-votes" aria-labelledby="item-votes-h" aria-busy={busy}>
      <div className="item-votes-row">
        <h2 className="item-votes-h" id="item-votes-h">Used it? Did it work?</h2>
        <div className="item-votes-buttons">
          <button type="button" className="btn btn-line btn-sm" aria-pressed={answer.mine === true} disabled={busy} onClick={() => void send(true)} data-testid="vote-yes">Yes</button>
          <button type="button" className="btn btn-line btn-sm" aria-pressed={answer.mine === false} disabled={busy} onClick={() => void send(false)} data-testid="vote-no">No</button>
        </div>
        <p className="small item-votes-count" data-testid="vote-count" aria-live="polite">
          {total ? `${answer.yes} of ${total} ${total === 1 ? "person says" : "people say"} it worked.` : `No answers yet. Tell others how this ${noun} went.`}
        </p>
      </div>
      {answer.mine === true && <p className="small" data-testid="vote-thanks">Thanks. Your answer helps others choose.</p>}
      {answer.mine === false && <p className="small" data-testid="vote-thanks">Thanks for saying. <a href="#comments">Tell others what went wrong</a>, so they can avoid it.</p>}
      {error && <p className="small" role="alert">{error}</p>}
    </section>
  );
}
