/** Fixed vocabulary only. The analytics boundary independently enforces consent and public URLs. */
export const UX_EVENTS = [
  "task_started", "route_accepted", "request_previewed", "request_copied",
  "pack_download_requested", "help_opened", "task_retried", "result_useful", "result_needs_work",
] as const;
export type UxEvent = typeof UX_EVENTS[number];
export function trackUxEvent(name: UxEvent): void {
  if (typeof document === "undefined" || !UX_EVENTS.includes(name)) return;
  document.dispatchEvent(new CustomEvent("abb:ux-event", { detail: name }));
}
