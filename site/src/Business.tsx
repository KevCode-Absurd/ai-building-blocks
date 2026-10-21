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
    <Drawer label="Your context" top={<span className="mono">saved in this browser only</span>} onClose={close}>
      <form className="biz" onSubmit={(e) => { e.preventDefault(); close(); toast(filled ? "Saved. Your copies and downloads now include your context." : "Nothing saved yet."); }} data-testid="business-form">
        <h2 className="title" style={{ marginTop: 0 }}>Tell your AI once</h2>
        <p className="small biz-lead">Save the facts you want your AI to use. They are added to your copied prompts and downloaded packs. Fill in what matters for your work and leave the rest blank.</p>
        {FIELDS.map((f) => (
          <label key={f.id} className="biz-field">
            <span>{f.label}</span>
            {f.id === "name" || f.id === "site"
              ? <input value={form[f.id] ?? ""} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} placeholder={f.hint} data-testid={`biz-${f.id}`} />
              : <textarea rows={f.id === "more" ? 4 : 2} value={form[f.id] ?? ""} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} placeholder={f.hint} data-testid={`biz-${f.id}`} />}
          </label>
        ))}
        <div className="biz-bar">
          <span className="small">{filled ? `${filled} of ${FIELDS.length} filled in` : "Every field is optional."}</span>
          {filled > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Clear your saved context?")) setForm({}); }}>Clear</button>}
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
        ? <>Your saved context is included. <button className="link-btn" onClick={openBusiness}>Edit context</button></>
        : <>Use the same facts across your work. <button className="link-btn" onClick={openBusiness} data-testid="business-add">Save your context</button></>}
    </p>
  );
}
