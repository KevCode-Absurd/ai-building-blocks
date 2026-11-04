import { useState } from "react";

/** Share this page: the phone's share sheet where there is one, otherwise the link is copied. */
export default function ShareButton({ title }: { title: string }) {
  const [state, setState] = useState<"" | "copied" | "failed">("");
  const share = async () => {
    const url = location.origin + location.pathname;
    const touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try { await navigator.share({ title, url }); return; } catch (error) { if ((error as Error)?.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); setState("copied"); }
    catch { setState("failed"); }
    setTimeout(() => setState(""), 2500);
  };
  return <span className="share-item">
    <button type="button" className="link-btn share-btn" onClick={() => void share()} data-testid="share-item">{state === "copied" ? "Link copied" : "Share"}</button>
    {state === "failed" && <span className="small" role="alert">Copy did not work. Copy the address from your browser.</span>}
    <span className="visually-hidden" role="status">{state === "copied" ? "Link copied" : ""}</span>
  </span>;
}
