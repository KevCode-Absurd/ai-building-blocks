import { useEffect, useState } from "react";
import { Drawer } from "./ui";
import { FIELDS, type Business, businessText, getBusiness, hasBusiness, setBusiness, useBusiness } from "./lib/business";

const OPEN = "abb:business-open";
/** Opens the business details from anywhere on the site. */
export const openBusiness = () => window.dispatchEvent(new Event(OPEN));
export function useBusinessOpener(open: () => void) {
  useEffect(() => { window.addEventListener(OPEN, open); return () => window.removeEventListener(OPEN, open); }, [open]);
}

/** Type your business details once. Every skill you copy and every workflow you download carries them. */
export function BusinessDrawer({ onClose, toast }: { onClose: () => void; toast: (m: string) => void }) {
  const [form, setForm] = useState<Business>(() => getBusiness());
  // Saved as you type, a moment after you stop.
  useEffect(() => { const t = setTimeout(() => setBusiness(form), 250); return () => clearTimeout(t); }, [form]);
  const close = () => { setBusiness(form); onClose(); };
  const text = businessText(form);
  const filled = FIELDS.filter((f) => form[f.id]?.trim()).length;
  return (
    <Drawer label="Your business" top={<span className="mono">saved in this browser only</span>} onClose={close}>
      <form className="biz" onSubmit={(e) => { e.preventDefault(); close(); toast(filled ? "Saved. Every copy and download now includes your details." : "Nothing saved yet."); }} data-testid="business-form">
        <h2 className="title" style={{ marginTop: 0 }}>Your business</h2>
        <p className="small biz-lead">Fill this in once. Every skill you copy and every workflow you download comes with these details, so your AI doesn't have to ask. Skip anything you don't know yet.</p>
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
          {filled > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Clear all your business details?")) setForm({}); }}>Clear</button>}
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
        ? <>Copies and downloads include your details{b.name ? ` for ${b.name}` : ""}. <button className="link-btn" onClick={openBusiness}>Change them</button></>
        : <>Add your business details once, and every copy includes them. <button className="link-btn" onClick={openBusiness} data-testid="business-add">Add them</button></>}
    </p>
  );
}
