// Shared bits for the ops pages: the section links, number formats, status words and a progress bar.
import type { ComponentChildren } from "preact";
import { Badge, Notice } from "../../components.tsx";
import { Link, useLocation } from "../../lib/router.tsx";
import { ApiError } from "../../lib/api.ts";
import type { JobStatus } from "../../../core/types.ts";
import type { JobFlag } from "../../../modules/ops/types.ts";

const SECTIONS = [
  { href: "/ops", label: "Work" },
  { href: "/ops/problems", label: "Problem reports" },
  { href: "/ops/agents", label: "Agents" },
  { href: "/ops/review", label: "Quality" },
  { href: "/ops/experts", label: "Experts" },
  { href: "/ops/invites", label: "Expert invites" },
  { href: "/ops/job-posts", label: "Job posts" },
  { href: "/ops/beta", label: "Invites and staff" },
  { href: "/ops/costs", label: "Costs" },
];

export function OpsNav() {
  const { path } = useLocation();
  const current = (href: string) => (href === "/ops" ? path === "/ops" || path.startsWith("/ops/jobs") : path.startsWith(href));
  return (
    <nav class="ops-nav" aria-label="Ops sections">
      {SECTIONS.map(s => <Link href={s.href} aria-current={current(s.href) ? "page" : undefined}>{s.label}</Link>)}
    </nav>
  );
}

export const STATUS_WORDS: Record<JobStatus, string> = {
  draft: "Draft", quoted: "Plan ready", confirmed: "Started", running: "Running", checking: "Checking",
  in_review: "Waiting for your OK", delivered: "With the buyer", revising: "Revising", accepted: "Accepted",
  rejected: "Rejected", disputed: "Disputed", failed: "Failed", cancelled: "Cancelled",
};

const STATUS_TONE: Partial<Record<JobStatus, "good" | "warn" | "bad" | "info">> = {
  in_review: "warn", rejected: "bad", disputed: "bad", failed: "bad", accepted: "good", delivered: "info",
};

export function StatusBadge(props: { status: JobStatus }) {
  return <Badge tone={STATUS_TONE[props.status] ?? "neutral"}>{STATUS_WORDS[props.status] ?? props.status}</Badge>;
}

const FLAGS: Record<JobFlag, { label: string; tone: "bad" | "warn" | "info" }> = {
  checks_failed: { label: "Checks failed", tone: "bad" },
  overdue: { label: "Late", tone: "warn" },
  over_cost: { label: "Over cost limit", tone: "warn" },
  revised: { label: "Revised", tone: "info" },
};

export function FlagBadges(props: { flags: JobFlag[] }) {
  return <>{props.flags.map(f => <Badge tone={FLAGS[f]?.tone ?? "neutral"}>{FLAGS[f]?.label ?? f}</Badge>)}</>;
}

export const pct = (v: number | null | undefined) => (v === null || v === undefined ? "No data yet" : `${Math.round(v * 100)}%`);

export function usd(n: number | null | undefined): string {
  if (n === null || n === undefined) return "No data yet";
  if (n === 0) return "$0";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function hoursText(h: number | null | undefined): string {
  if (h === null || h === undefined) return "No data yet";
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} days`;
}

export const words = (id: string) => id.replace(/[_-]+/g, " ");

/** A plain bar for value against a target (0 to 1 of the way there). */
export function Bar(props: { value: number; met?: boolean; label?: string }) {
  const width = Math.max(0, Math.min(1, props.value)) * 100;
  return (
    <div class={`ops-bar${props.met ? " ops-bar-met" : ""}`} role="img" aria-label={props.label ?? `${Math.round(width)}% of the target`}>
      <span style={{ width: `${width}%` }} />
    </div>
  );
}

/** True when a neighbour module's endpoint is missing or broken, so the page can say "not ready yet". */
export function notReady(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 404 || err.status === 405 || err.status >= 500);
}

export function NotReady(props: { what: string; children?: ComponentChildren }) {
  return (
    <Notice tone="warn" title={`${props.what} is not ready yet`}>
      {props.children ?? "That part of the app has not shipped yet, or it failed just now. Try again after the next update."}
    </Notice>
  );
}

export const errorText = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong. Try again.");

export function ExternalLink(props: { href: string; children?: ComponentChildren }) {
  if (!/^https?:\/\//i.test(props.href)) return <span>{props.children ?? props.href}</span>;
  return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children ?? props.href}</a>;
}
