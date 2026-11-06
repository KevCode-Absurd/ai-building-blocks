// In-app messages (delivery module): the /notifications page and the bell in the header with the unread count.
// notify() records every message we send; this page lists the signed-in person's own, newest first.
import { useEffect, useState } from "preact/hooks";
import type { NotificationView } from "../../../modules/delivery/notifications.ts";
import { Badge, Button, Empty, Loaded, Notice, Page, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";
import { navigate, useLocation } from "../../lib/router.tsx";
import "./notifications.css";

/** The page tells the bell about a new unread count with this window event, so both agree without a reload. */
const UNREAD_EVENT = "dlv-unread";
const POLL_MS = 60_000;

const tellBell = (unread: number) => window.dispatchEvent(new CustomEvent(UNREAD_EVENT, { detail: unread }));

/** In-app navigation for a plain link; new-tab clicks keep the browser's normal behaviour. */
function go(e: MouseEvent, path: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  navigate(path);
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.6L5 15.2v1.3h14v-1.3l-1.5-2.6V9A5.5 5.5 0 0 0 12 3.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M9.8 19a2.2 2.2 0 0 0 4.4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </svg>
  );
}

/** The header entry point: a bell that links to /notifications, with the number of unread messages. */
export function NotificationBell() {
  const auth = useAuth();
  const { path } = useLocation();
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    if (!auth.signedIn) { setUnread(0); return; }
    let live = true;
    const load = () => api<{ unread: number }>("/api/notifications/unread")
      .then(r => { if (live) setUnread(r.unread); })
      .catch(() => { /* keep the last count; the bell is not worth an error */ });
    void load();
    const timer = setInterval(() => { if (!document.hidden) void load(); }, POLL_MS);
    const onCount = (e: Event) => { const n = (e as CustomEvent<unknown>).detail; if (typeof n === "number") setUnread(n); };
    window.addEventListener(UNREAD_EVENT, onCount);
    return () => { live = false; clearInterval(timer); window.removeEventListener(UNREAD_EVENT, onCount); };
  }, [auth.signedIn, path]);
  if (!auth.signedIn) return null;
  const label = unread ? `Messages, ${unread} unread` : "Messages";
  return (
    <a href="/notifications" class={`dlv-bell${unread ? " dlv-bell-on" : ""}`} aria-label={label} title={label}
      aria-current={path === "/notifications" ? "page" : undefined} onClick={e => go(e, "/notifications")}>
      <BellIcon />
      {unread > 0 && <span class="dlv-bell-count" aria-hidden="true">{unread > 9 ? "9+" : unread}</span>}
    </a>
  );
}

function NotificationsPage() {
  const state = useLoad(() => api<{ notifications: NotificationView[]; unread: number }>("/api/notifications"), []);
  const [items, setItems] = useState<NotificationView[]>([]);
  const [unread, setUnread] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!state.data) return;
    setItems(state.data.notifications);
    setUnread(state.data.unread);
    tellBell(state.data.unread);
  }, [state.data]);

  const markRead = async (n: NotificationView) => {
    if (n.read) return;
    setItems(list => list.map(x => (x.id === n.id ? { ...x, read: true } : x)));
    try {
      const r = await api<{ unread: number }>(`/api/notifications/${encodeURIComponent(n.id)}/read`, { body: {} });
      setUnread(r.unread); tellBell(r.unread);
    } catch (err) {
      setItems(list => list.map(x => (x.id === n.id ? { ...x, read: false } : x)));
      setError(err instanceof Error ? err.message : "We could not mark that message as read. Try again.");
    }
  };

  const markAll = async () => {
    setBusy(true); setError(null);
    try {
      const r = await api<{ unread: number }>("/api/notifications/read-all", { body: {} });
      setItems(list => list.map(x => ({ ...x, read: true })));
      setUnread(r.unread); tellBell(r.unread);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not mark your messages as read. Try again.");
    } finally { setBusy(false); }
  };

  return (
    <Page title="Messages" intro="News about your work, newest first. We send most of these by email too."
      actions={unread > 0 ? <Button small kind="secondary" busy={busy} onClick={() => void markAll()}>Mark all as read</Button> : undefined}>
      {error && <Notice tone="bad">{error}</Notice>}
      <Loaded state={state}>
        {() => items.length === 0 ? (
          <Empty title="No messages yet">When there is news about your work, such as a draft that is ready, it shows up here.</Empty>
        ) : (
          <>
            <p class="muted small" role="status">{unread === 0 ? "You have read everything." : unread === 1 ? "1 message is new." : `${unread} messages are new.`}</p>
            <ul class="dlv-msgs">
              {items.map(n => (
                <li class={`dlv-msg${n.read ? "" : " dlv-msg-new"}`}>
                  <div class="dlv-msg-top">
                    <strong class="dlv-msg-subject">{n.subject}</strong>
                    {!n.read && <Badge tone="info">New</Badge>}
                  </div>
                  <p class="dlv-msg-text">{n.text}</p>
                  <div class="dlv-msg-meta">
                    <time dateTime={n.createdAt}>{when(n.createdAt)}</time>
                    {n.emailed && <span>Also sent by email</span>}
                    {n.path && (
                      <a href={n.path} class="dlv-msg-open" onClick={e => { void markRead(n); go(e, n.path!); }}>
                        {n.jobId ? "Open the job" : "Open"}
                      </a>
                    )}
                    {!n.read && <button type="button" class="dlv-link" onClick={() => void markRead(n)}>Mark as read</button>}
                  </div>
                </li>
              ))}
            </ul>
            {items.length >= 50 && <p class="muted small">We show your latest 50 messages.</p>}
          </>
        )}
      </Loaded>
    </Page>
  );
}

export { NotificationsPage };
