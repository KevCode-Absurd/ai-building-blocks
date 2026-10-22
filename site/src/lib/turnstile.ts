// Each protected action gets a fresh, single-use token; keys and configuration come from the server.
import "../security.css";
export type SecurityAction = "compose" | "comment" | "create_space";
type Turnstile = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
};
declare global { interface Window { turnstile?: Turnstile } }
let script: Promise<Turnstile> | undefined;
function load(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (script) return script;
  script = new Promise<Turnstile>((resolve, reject) => {
    const el = document.createElement("script");
    const timer = window.setTimeout(() => fail(), 15000);
    const fail = () => { clearTimeout(timer); el.remove(); script = undefined; reject(Error("The security check could not load. Check your connection and try again.")); };
    el.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    el.async = true;
    el.onload = () => { clearTimeout(timer); if (window.turnstile) resolve(window.turnstile); else fail(); };
    el.onerror = fail;
    document.head.append(el);
  });
  return script;
}
async function challenge(sitekey: string, action: SecurityAction): Promise<string> {
  const api = await load();
  return new Promise((resolve, reject) => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.createElement("dialog");
    dialog.className = "security-dialog";
    dialog.setAttribute("aria-labelledby", "security-check-title");
    const title = document.createElement("h2"); title.id = "security-check-title"; title.textContent = "Quick security check";
    const message = document.createElement("p"); message.textContent = "Please complete this check to continue.";
    const widget = document.createElement("div"); widget.dataset.testid = "turnstile-widget";
    const cancel = document.createElement("button"); cancel.type = "button"; cancel.className = "btn btn-ghost"; cancel.textContent = "Cancel";
    dialog.append(title, message, widget, cancel); document.body.append(dialog);
    let id: string | undefined, settled = false;
    const removeWidget = () => {
      if (id === undefined) return;
      const widgetId = id; id = undefined;
      try { api.remove(widgetId); } catch { /* SDK cleanup must never strand the action. */ }
    };
    const finish = (token?: string, error = "Security check cancelled.") => {
      if (settled) return; settled = true; clearTimeout(timer);
      try {
        removeWidget(); dialog.close();
      } catch { /* Closing an already detached dialog is best effort. */ }
      finally {
        try { dialog.remove(); previous?.focus(); } catch { /* Focus restoration must not block settlement. */ }
        token ? resolve(token) : reject(Error(error));
      }
    };
    const timer = window.setTimeout(() => finish(undefined, "The security check timed out. Please try again."), 120000);
    cancel.onclick = () => finish();
    dialog.oncancel = e => { e.preventDefault(); finish(); };
    try {
      dialog.showModal();
      id = api.render(widget, { sitekey, action, theme: "auto", size: "flexible", "response-field": false,
        callback: (token: string) => finish(token),
        "error-callback": () => { finish(undefined, "The security check could not finish. Please try again."); return true; },
        "expired-callback": () => finish(undefined, "The security check expired. Please try again."),
        "timeout-callback": () => finish(undefined, "The security check timed out. Please try again."),
      });
      // Also handle a synchronous callback in local browser tests.
      if (settled) removeWidget();
    } catch { finish(undefined, "The security check could not open. Please try again."); }
  });
}
export async function protectedHeaders(action: SecurityAction): Promise<Record<string, string>> {
  const response = await fetch("/api/security", { cache: "no-store" });
  const config = await response.json().catch(() => ({}));
  if (!response.ok) throw Error(config.error || "Security verification is unavailable. Please try later.");
  if (config.required === false && ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) return {};
  if (config.required !== true || typeof config.sitekey !== "string" || !config.sitekey) throw Error("Security verification is unavailable. Please try later.");
  return { "x-turnstile-token": await challenge(config.sitekey, action) };
}
