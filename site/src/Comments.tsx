import { useCallback, useEffect, useState } from "react";
import { Drawer } from "./ui";
import type { Comment } from "./server/comments";

// Questions and comments for one skill, in a panel on the side of its page. They're kept per skill
// (src/server/comments.ts) and stay on that skill's page, including comments left under an old name.
const TEAM_KEY = "abb:team-token";
const NAME_KEY = "abb:comment-name";
const store = {
  get: (k: string) => { try { return localStorage.getItem(k) ?? ""; } catch { return ""; } },
  set: (k: string, v: string) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch { /* private mode */ } },
};
type State = { status: "loading" | "ready" | "off" | "error"; comments: Comment[] };
const when = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

function useComments(slug: string, also: string[]) {
  const [s, setS] = useState<State>({ status: "loading", comments: [] });
  const key = [slug, ...also].join(",");
  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}${also.length ? `&also=${encodeURIComponent(also.join(","))}` : ""}`);
      if (r.status === 503 || r.status === 404) return setS({ status: "off", comments: [] });
      if (!r.ok) return setS({ status: "error", comments: [] });
      setS({ status: "ready", comments: (await r.json()).comments ?? [] });
    } catch { setS({ status: "off", comments: [] }); }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setS({ status: "loading", comments: [] }); load(); }, [load]);
  return { ...s, load };
}

function Form({ slug, parent, team, onPosted, onCancel }: { slug: string; parent?: string; team: string; onPosted: () => void; onCancel?: () => void }) {
  const [name, setName] = useState(() => store.get(NAME_KEY));
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const send = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (body.trim().length < 2 || busy) return;
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json", ...(team ? { authorization: `Bearer ${team}` } : {}) },
        body: JSON.stringify({ slug, parent, name, body, website }),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) { setError(out.error ?? "That didn't post. Try again."); return; }
      store.set(NAME_KEY, name.trim());
      setBody(""); onPosted();
    } catch { setError("That didn't post. Check your connection and try again."); }
    finally { setBusy(false); }
  };
  return (
    <form className={`cm-form${parent ? " reply" : ""}`} onSubmit={send} data-testid={parent ? "reply-form" : "comment-form"}>
      <label className="sr-only" htmlFor={`cm-body-${parent ?? "new"}`}>{parent ? "Your reply" : "Your question or comment"}</label>
      <textarea id={`cm-body-${parent ?? "new"}`} rows={parent ? 2 : 3} value={body} onInput={(e) => setBody(e.currentTarget.value)} maxLength={2000}
        placeholder={parent ? "Write a reply" : "Ask a question, or say how it went for you"} data-testid="comment-body" />
      {/* Hidden from people; bots fill it in, and those posts are dropped. */}
      <input className="cm-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onInput={(e) => setWebsite(e.currentTarget.value)} name="website" />
      <div className="cm-row">
        {team ? <span className="small">Posting as the AI Blocks team</span> : (
          <input className="cm-name" value={name} onInput={(e) => setName(e.currentTarget.value)} maxLength={40} placeholder="Your name (optional)" aria-label="Your name (optional)" autoComplete="name" data-testid="comment-name" />
        )}
        {onCancel && <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>}
        <button className="btn btn-primary btn-sm" disabled={busy || body.trim().length < 2} data-testid="comment-post">{busy ? "Posting…" : parent ? "Reply" : "Post"}</button>
      </div>
      {error && <p className="cm-error" role="alert">{error}</p>}
    </form>
  );
}

function One({ c, team, onReply, onHide }: { c: Comment; team: string; onReply?: () => void; onHide: () => void }) {
  return (
    <div className={`cm-one${c.team ? " team" : ""}`} data-testid="comment">
      <p className="cm-meta"><b>{c.name}</b>{c.team && <span className="cm-badge">Answer from us</span>}<span>{when(c.at)}</span></p>
      <p className="cm-body">{c.body}</p>
      <p className="cm-acts">
        {onReply && <button className="link-btn" onClick={onReply} data-testid="comment-reply">Reply</button>}
        {team && <button className="link-btn" onClick={onHide}>Remove</button>}
      </p>
    </div>
  );
}

export default function Comments({ slug, name, also, toast }: { slug: string; name: string; also: string[]; toast: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [replying, setReplying] = useState<string | null>(null);
  const [team, setTeam] = useState(() => store.get(TEAM_KEY));
  const { status, comments, load } = useComments(slug, also);
  useEffect(() => {
    const go = () => { if (location.hash === "#comments") setOpen(true); };
    go(); window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);
  const close = useCallback(() => { setOpen(false); if (location.hash === "#comments") history.replaceState(null, "", location.pathname + location.search); }, []);
  const tops = comments.filter((c) => !c.parent);
  const repliesTo = (id: string) => comments.filter((c) => c.parent === id);
  const hide = async (id: string) => {
    const r = await fetch(`/api/comments?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: { authorization: `Bearer ${team}` } });
    toast(r.ok ? "Comment removed" : "Couldn't remove it. Check the team key.");
    load();
  };
  const teamKey = () => {
    const t = window.prompt("Team key (leave empty to stop posting as the team)", team) ?? team;
    store.set(TEAM_KEY, t.trim()); setTeam(t.trim());
  };
  const n = comments.length;

  return (
    <>
      <button className="cm-tab" onClick={() => setOpen(true)} data-testid="comments-open" aria-label={`Questions and comments${n ? `, ${n}` : ""}`}>
        <span>Questions</span>{n > 0 && <b data-testid="comments-count">{n}</b>}
      </button>
      {open && (
        <Drawer label="Questions and comments" top={<span className="mono">{name}</span>} onClose={close}>
          <div className="cm" data-testid="comments">
            <h2 className="title" style={{ marginTop: 0 }}>Questions and comments</h2>
            <p className="small">Ask about this skill, or tell others how it went. Everything here stays on this skill's page and anyone can read it, so leave out private details.</p>
            {status === "off" && <p className="cm-note" data-testid="comments-off">Comments aren't switched on for this copy of the site yet.</p>}
            {status === "error" && <p className="cm-note">Comments didn't load. <button className="link-btn" onClick={load}>Try again</button></p>}
            {status === "ready" && <Form slug={slug} team={team} onPosted={() => { toast("Posted"); load(); }} />}
            {status === "loading" && <p className="small">Loading…</p>}
            {status === "ready" && !n && <p className="cm-note">No questions yet. Ask the first one.</p>}
            <div className="cm-list">
              {[...tops].reverse().map((c) => (
                <div key={c.id} className="cm-thread">
                  <One c={c} team={team} onReply={() => setReplying(replying === c.id ? null : c.id)} onHide={() => hide(c.id)} />
                  {repliesTo(c.id).map((r) => <One key={r.id} c={r} team={team} onHide={() => hide(r.id)} />)}
                  {replying === c.id && <Form slug={slug} parent={c.id} team={team} onPosted={() => { setReplying(null); toast("Reply posted"); load(); }} onCancel={() => setReplying(null)} />}
                </div>
              ))}
            </div>
            <p className="cm-foot"><button className="link-btn small" onClick={teamKey}>{team ? "Posting as the team" : "Team sign-in"}</button></p>
          </div>
        </Drawer>
      )}
    </>
  );
}
