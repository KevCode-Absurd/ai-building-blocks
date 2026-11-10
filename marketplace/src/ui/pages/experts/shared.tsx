// Shared bits for the experts pages: API shapes, labels and the "what happens next" steps.
import { useState } from "preact/hooks";
import type { Area } from "../../../core/types.ts";
import type { ExpertView } from "../../../modules/experts/service.ts";

export type { ExpertDashboard, ExpertView } from "../../../modules/experts/service.ts";
export type { Agreement } from "../../../modules/experts/agreement.ts";

export interface ExpertMe {
  expert: ExpertView | null;
  agreement: { version: string };
  review_time: string;
  founding: { limit: number; taken: number; left: number };
}

export interface CatalogueList {
  version: string;
  job_types: { id: string; title: string; summary: string; area: Area }[];
}

export const AREA_LABELS: Record<Area, string> = {
  marketing: "Marketing",
  content: "Content",
  sales: "Sales",
  ecommerce: "Online stores",
  "customer-support": "Customer support",
  research: "Research",
  finance: "Finance",
  people: "People and hiring",
  operations: "Operations",
  product: "Product",
  engineering: "Code and engineering",
  data: "Data and AI",
  design: "Design and media",
  learning: "Training and teaching",
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  draft: "Not started", quoted: "Plan ready", confirmed: "Starting", running: "Being written", checking: "Being checked",
  in_review: "With our team", delivered: "With the buyer", revising: "Being revised", accepted: "Accepted",
  rejected: "Rejected", disputed: "Disputed", failed: "Failed", cancelled: "Cancelled",
};

export const AGENT_STATUS: Record<string, { label: string; tone: "neutral" | "good" | "warn" | "info" }> = {
  draft: { label: "Draft", tone: "neutral" },
  testing: { label: "Testing", tone: "info" },
  live: { label: "Live", tone: "good" },
  retired: { label: "Retired", tone: "warn" },
};

export const pct = (n: number | null | undefined) => (n === null || n === undefined ? "–" : `${Math.round(n * 100)}%`);

export const longDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

export const canApplyAgain = (e: ExpertView) => e.status === "rejected" && (!e.can_reapply_at || Date.parse(e.can_reapply_at) <= Date.now());

export function WhatNext(props: { reviewTime: string }) {
  return (
    <ol class="exp-steps">
      <li>
        <b>We read your application.</b>
        <span>We check the links you sent for each claim.</span>
      </li>
      <li>
        <b>We email you within {props.reviewTime}.</b>
        <span>You can also check your status on your expert page at any time.</span>
      </li>
      <li>
        <b>If we approve you, you build your agent.</b>
        <span>You turn your method into an agent in the studio. We check it before buyers can hire it.</span>
      </li>
    </ol>
  );
}

export type { PublicProfile, MyProfile, ChecklistView } from "../../../modules/experts/profiles.ts";
export type { PublicInviteView, OpsInviteView, InviteStatus } from "../../../modules/experts/invites.ts";
export type { PostView, ReplyView, NeededBy } from "../../../modules/experts/posts.ts";

/** "When do you need it?" choices, in order (the server's NEEDED_BY). */
export const NEEDED_BY_OPTIONS: { value: string; label: string }[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "two_weeks", label: "Within 2 weeks" },
  { value: "month", label: "Within a month" },
  { value: "flexible", label: "No fixed date" },
];

/** A button that copies text and says so. */
export function CopyButton(props: { text: string; label?: string; small?: boolean }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const copy = async () => {
    try { await navigator.clipboard.writeText(props.text); setState("done"); } catch { setState("failed"); }
    setTimeout(() => setState("idle"), 2500);
  };
  return (
    <button type="button" class={`btn btn-line${props.small === false ? "" : " btn-sm"}`} onClick={copy} aria-live="polite">
      {state === "done" ? "Copied" : state === "failed" ? "Copy failed: select the link" : props.label ?? "Copy link"}
    </button>
  );
}
