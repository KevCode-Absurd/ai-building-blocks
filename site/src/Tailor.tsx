import { useEffect, useState } from "react";
import { Drawer } from "./ui";
import { SUPPORT_EMAIL } from "./lib/site-info-nav.mjs";

// Every skill on the site is a base skill that works for anyone. People who want one shaped to their
// industry ask here, and the request comes to us by email (the site has no server).
export const TAILOR_EMAIL = SUPPORT_EMAIL;
export const INDUSTRIES = ["Online store", "Lead generation", "Software (SaaS)", "Agency or services", "Shop or local business", "Something else"];

const OPEN = "abb:tailor-open";
/** Opens the tailored-skill form from anywhere, with the skill filled in when there is one. */
export const openTailor = (skill = "") => window.dispatchEvent(new CustomEvent(OPEN, { detail: skill }));
export function useTailorOpener(open: (skill: string) => void) {
  useEffect(() => {
    const on = (e: Event) => open(String((e as CustomEvent).detail ?? ""));
    window.addEventListener(OPEN, on);
    return () => window.removeEventListener(OPEN, on);
  }, [open]);
}

type Ask = { skill: string; industry: string; want: string; name: string; email: string };
export const requestText = (a: Ask) => [
  `Skill: ${a.skill.trim() || "Not sure yet"}`,
  `My work: ${a.industry || "Not said"}`,
  "",
  "What I want it to do for me:",
  a.want.trim(),
  "",
  `Name: ${a.name.trim()}`,
  `Email: ${a.email.trim()}`,
].join("\n");

/** Ask for a skill shaped to your industry. It opens an email to us with the details filled in. */
export function TailorDrawer({ skill, onClose, toast }: { skill: string; onClose: () => void; toast: (m: string) => void }) {
  const [a, setA] = useState<Ask>({ skill, industry: "", want: "", name: "", email: "" });
  const [copyFailed, setCopyFailed] = useState(false);
  const set = (k: keyof Ask) => (e: { target: { value: string } }) => setA({ ...a, [k]: e.target.value });
  const ready = !!a.want.trim() && /\S+@\S+\.\S+/.test(a.email);
  const subject = `Tailored skill: ${a.skill.trim() || "a skill"}${a.industry ? ` for ${a.industry.toLowerCase()}` : ""}`;
  const mail = `mailto:${TAILOR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestText(a))}`;
  const copyText = `To: ${TAILOR_EMAIL}\nSubject: ${subject}\n\n${requestText(a)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(copyText); setCopyFailed(false); toast(`Copied. Paste it into an email to ${TAILOR_EMAIL}.`); }
    catch { setCopyFailed(true); }
  };
  return (
    <Drawer label="Get a skill tailored for you" top={<span className="mono">goes to {TAILOR_EMAIL}</span>} onClose={onClose}>
      <form className="biz" onSubmit={(e) => { e.preventDefault(); if (!ready) return; window.location.href = mail; toast("Your email app is opening with the request filled in."); onClose(); }} data-testid="tailor-form">
        <h2 className="title" style={{ marginTop: 0 }}>Get a skill tailored for you</h2>
        <p className="small biz-lead">Every skill here works for anyone. Tell us about your work and we'll shape one to your industry, your numbers and your tools, then help you set it up.</p>
        <label className="biz-field"><span>Which skill</span>
          <input value={a.skill} onChange={set("skill")} placeholder="A skill on this site, or the job you want done" data-testid="tailor-skill" />
        </label>
        <fieldset className="biz-field tailor-kinds">
          <legend>What kind of work you do</legend>
          <div className="chips">
            {INDUSTRIES.map((x) => (
              <button type="button" key={x} className="chip" aria-pressed={a.industry === x} onClick={() => setA({ ...a, industry: a.industry === x ? "" : x })}>{x}</button>
            ))}
          </div>
        </fieldset>
        <label className="biz-field"><span>What should it do for you?</span>
          <textarea rows={4} value={a.want} onChange={set("want")} placeholder="We get leads from a form, not sales. I want the page check to look at form drop-off and cost per lead." data-testid="tailor-want" />
        </label>
        <label className="biz-field"><span>Your name</span>
          <input value={a.name} onChange={set("name")} autoComplete="name" data-testid="tailor-name" />
        </label>
        <label className="biz-field"><span>Your email, so we can reply</span>
          <input type="email" value={a.email} onChange={set("email")} autoComplete="email" data-testid="tailor-email" />
        </label>
        <div className="biz-bar">
          <span className="small">{ready ? "Opens your email app. Nothing is sent until you press send." : "Say what it should do, and add your email."}</span>
          <button type="button" className="btn btn-ghost btn-sm" disabled={!ready} onClick={copy} data-testid="tailor-copy">Copy it</button>
          <button className="btn btn-primary btn-sm" disabled={!ready} data-testid="tailor-send">Write the email</button>
        </div>
        {copyFailed && <div className="task-copy-fallback"><p role="alert">Copy did not work. Select and copy the request below.</p><textarea aria-label="Copy the email request manually" readOnly rows={7} value={copyText} onFocus={e => e.currentTarget.select()} /></div>}
      </form>
    </Drawer>
  );
}
