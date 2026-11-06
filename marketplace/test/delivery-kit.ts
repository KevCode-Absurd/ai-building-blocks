// Shared set-up for the delivery feature tests (consent, messages, problem reports). Not a test file itself.
//   const calls = mockDeliveryNeighbours();      // first, before anything imports the app
//   const { testEnv } = await import("./helpers.ts");
//   const ids = await deliveredJob(t);           // a job the buyer can accept, revise, reject or report
// The runner and ops services are mocked (mock.module), as in delivery.test.ts, so these tests check delivery alone.
import { mock } from "node:test";
import { readFileSync } from "node:fs";
import type { TestEnv } from "./helpers.ts";

/** A stand-in for any export: calling it rejects, reading a property gives the stand-in again, iterating gives nothing. */
function inert(name: string): any {
  const proxy: any = new Proxy(function () {}, {
    get: (_t, p) => (p === Symbol.iterator ? function* () {} : p === "then" || typeof p === "symbol" ? undefined : proxy),
    apply: () => Promise.reject(new Error(`${name} is mocked out in delivery tests`)),
  });
  return proxy;
}

function mockModule(rel: string, overrides: Record<string, unknown>) {
  const url = new URL(rel, import.meta.url);
  const source = readFileSync(url, "utf8");
  const exports: Record<string, unknown> = {};
  for (const m of source.matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm)) exports[m[1]] = inert(m[1]);
  mock.module(url.href, { exports: { ...exports, ...overrides } });
}

export interface NeighbourCalls { runs: any[]; ops: any[]; runFails: { value: boolean } }

/** Mocks runner.startJobRun (records calls) and ops.notifyOps (records notices). Call before importing the app. */
export function mockDeliveryNeighbours(): NeighbourCalls {
  const calls: NeighbourCalls = { runs: [], ops: [], runFails: { value: false } };
  mockModule("../src/modules/runner/service.ts", {
    startJobRun: async (env: any, input: any) => {
      calls.runs.push(input);
      if (calls.runFails.value) throw new Error("runner is down");
      // Like the real runner: a rerun from disputed moves the job to running.
      const now = new Date().toISOString();
      await env.DB.prepare("UPDATE jobs SET status = 'running', updated_at = ? WHERE id = ?").bind(now, input.jobId).run();
      return { runId: `run_mocked_${calls.runs.length}` };
    },
  });
  mockModule("../src/modules/ops/service.ts", { notifyOps: async (_env: unknown, notice: unknown) => { calls.ops.push(notice); } });
  return calls;
}

export const DRAFT = [
  "# Book grooming in two taps",
  "",
  "A scheduling app for one-person dog grooming shops.",
  "",
  "## Why groomers switch",
  "No more booking by text message.",
  "",
  "[Start your free trial](#)",
].join("\n");

export const EDITED = DRAFT.replace("No more booking by text message.", "Stop booking by text message.\nGet paid at booking.");

let seq = 0;

/** A job with a frozen rubric, one run and one draft (not released). Optionally run by agentId. */
export async function seedJob(t: TestEnv, opts: { user?: string; status?: string; agentId?: string; priceCents?: number | null; title?: string } = {}) {
  const { LANDING_PAGE, NOVA } = await import("./fixtures.ts");
  const user = opts.user ?? "user_buyer";
  await t.grantBeta(user);
  const now = new Date().toISOString();
  await t.sql("INSERT OR IGNORE INTO personas (id, kind, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES (?, 'house', ?, ?, ?, ?, ?, 'live', 10, ?, ?)",
    NOVA.id, NOVA.name, NOVA.title, NOVA.tagline, NOVA.area, JSON.stringify(NOVA.profile), now, now);
  const n = ++seq;
  const jobId = `job_k${n.toString().padStart(4, "0")}`, runId = `run_k${n}`, draftId = `drf_k${n}`;
  const price = opts.priceCents === undefined ? 14900 : opts.priceCents;
  await t.sql(`INSERT INTO jobs (id, org_id, created_by, status, job_type_id, persona_id, title, price_cents, quote, agent_id, agent_version, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'landing-page-copy', ?, ?, ?, '{}', ?, ?, ?, ?)`,
    jobId, `org_${user}`, user, opts.status ?? "in_review", NOVA.id, opts.title ?? "Landing page copy", price, opts.agentId ?? null, opts.agentId ? 1 : null, now, now);
  await t.sql("INSERT INTO briefs (job_id, request_text, created_at, updated_at) VALUES (?, ?, ?, ?)", jobId, "Landing page for my grooming app.", now, now);
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", jobId, JSON.stringify(LANDING_PAGE.rubric), now, now, now);
  await t.sql("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES (?, ?, 'job', 'succeeded', ?)", runId, jobId, now);
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, ?, ?, 1, ?, 'markdown', 'fp', ?)", draftId, jobId, runId, DRAFT, now);
  return { jobId, draftId, runId, user };
}

/** A seeded job, released to the buyer. */
export async function deliveredJob(t: TestEnv, opts: Parameters<typeof seedJob>[1] = {}) {
  const ids = await seedJob(t, opts);
  const { releaseDraft } = await import("../src/modules/delivery/service.ts");
  await releaseDraft(t.env, { jobId: ids.jobId, draftId: ids.draftId, actor: "user_ops", actorKind: "ops" });
  return ids;
}

/** A delivered job the buyer reported a problem on (status disputed, one open report). */
export async function disputedJob(t: TestEnv, opts: Parameters<typeof seedJob>[1] = {}) {
  const ids = await deliveredJob(t, opts);
  const res = await t.api("POST", `/api/jobs/${ids.jobId}/report`, { user: ids.user, body: { reasons: "It quotes reviews we never had." } });
  if (res.status !== 200) throw new Error(`report failed: ${JSON.stringify(res.body)}`);
  const [report] = await t.sql("SELECT id FROM problem_reports WHERE job_id = ?", ids.jobId);
  return { ...ids, reportId: report.id as string };
}

export const jobRow = async (t: TestEnv, id: string) => (await t.sql("SELECT * FROM jobs WHERE id = ?", id))[0];
