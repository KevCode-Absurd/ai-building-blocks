import { useEffect, useState } from "react";
import { Drawer } from "./ui";
import { FIELDS, type Business, businessText, getBusiness, hasBusiness, setBusiness, useBusiness } from "./lib/business";

const OPEN = "abb:business-open";
/** Opens the about-me file from anywhere on the site. */
export const openBusiness = () => window.dispatchEvent(new Event(OPEN));
export function useBusinessOpener(open: () => void) {
  useEffect(() => { window.addEventListener(OPEN, open); return () => window.removeEventListener(OPEN, open); }, [open]);
}

/** Type a short file about you and your work once. Every skill you copy and every workflow you download carries them. */
export function BusinessDrawer({ onClose, toast }: { onClose: () => void; toast: (m: string) => void }) {
  const [form, setForm] = useState<Business>(() => getBusiness());
  // Saved as you type, a moment after you stop.
  useEffect(() => { const t = setTimeout(() => setBusiness(form), 250); return () => clearTimeout(t); }, [form]);
  const close = () => { setBusiness(form); onClose(); };
  const text = businessText(form);
  const filled = FIELDS.filter((f) => form[f.id]?.trim()).length;
  return (
    <Drawer label="About you" top={<span className="mono">saved in this browser only</span>} onClose={close}>
      <form className="biz" onSubmit={(e) => { e.preventDefault(); close(); toast(filled ? "Saved. Every copy and download now includes your about-me file." : "Nothing saved yet."); }} data-testid="business-form">
        <h2 className="title" style={{ marginTop: 0 }}>About you and your work</h2>
        <p className="small biz-lead">A short file your AI reads before every job. It works whether you have a job, run a business, or both. Fill in what fits and skip the rest. Every skill you copy and every workflow you download comes with it, so your AI doesn't have to ask.</p>
        {FIELDS.map((f) => (
          <label key={f.id} className="biz-field">
            <span>{f.label}</span>
            {f.id === "name" || f.id === "site"
              ? <input value={form[f.id] ?? ""} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} placeholder={f.hint} data-testid={`biz-${f.id}`} />
              : <textarea rows={2} value={form[f.id] ?? ""} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} placeholder={f.hint} data-testid={`biz-${f.id}`} />}
          </label>
        ))}
        <div className="biz-bar">
          <span className="small">{filled ? `${filled} of ${FIELDS.length} filled in` : "The grey text is an example. Write your own."}</span>
          {filled > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Clear everything in your about-me file?")) setForm({}); }}>Clear</button>}
          <button className="btn btn-primary btn-sm" data-testid="biz-save">Done</button>
        </div>
        {text && (
          <details className="biz-preview">
            <summary>See what gets added to your copies</summary>
            <pre>{text}</pre>
          </details>
        )}
      </form>
    </Drawer>
  );
}

/** One line near the copy buttons: what gets added, and a way to change it. */
export function BusinessNote() {
  const b = useBusiness();
  return (
    <p className="biz-note" data-testid="business-note">
      {hasBusiness(b)
        ? <>Copies and downloads include your about-me file{b.name ? ` for ${b.name}` : ""}. <button className="link-btn" onClick={openBusiness}>Change them</button></>
        : <>Add a short file about you and your work once, and every copy includes it. <button className="link-btn" onClick={openBusiness} data-testid="business-add">Add it</button></>}
    </p>
  );
}
