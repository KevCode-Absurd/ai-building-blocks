// Rate limits for tool calls on /mcp: per connection (one grant per connected app) and per buyer across all of
// their connected apps. Fixed windows, counted in D1 (mcp_rate_counts, migrations/0015_mcp_rate_limits.sql).
// Every tool call counts toward the "any" buckets. Costly tools (anything that calls a model or starts a run) also
// count toward tighter "costly" buckets, so browsing and checking jobs keep working when new work is paused.
// If the counter cannot be written (a D1 hiccup, or the migration not applied yet) the call goes through: a broken
// counter must not take the connector down. Model spend has its own daily cap in core/models.ts.
import type { Env } from "../../env.ts";
import type { AuthUser } from "../../core/auth.ts";

export interface Limit {
  /** "connection" is one connected app (the OAuth grant); "user" is the buyer across every app they connected. */
  per: "connection" | "user";
  /** "any" counts every tool call; "costly" only the tools that call a model or start a run. */
  tools: "any" | "costly";
  windowSeconds: number;
  max: number;
}

// One job from request to start is about 5 to 8 costly calls (request, answers, a plan or two, the start), more when
// the AI fixes its own argument mistakes. These leave room for that and still bound model spend per buyer.
export const LIMITS: Limit[] = [
  { per: "connection", tools: "any", windowSeconds: 60, max: 60 },
  { per: "user", tools: "any", windowSeconds: 60, max: 120 },
  { per: "connection", tools: "costly", windowSeconds: 60, max: 20 },
  { per: "user", tools: "costly", windowSeconds: 3600, max: 100 },
];

export interface RateLimited {
  limit: Limit;
  retryAfterSeconds: number;
  message: string;
}

export const bucketKey = (l: Limit, user: AuthUser) =>
  `${l.per === "connection" ? `grant:${user.sessionId ?? "none"}` : `user:${user.id}`}:${l.tools}:${l.windowSeconds}`;
export const windowStart = (l: Limit, nowSeconds: number) => nowSeconds - (nowSeconds % l.windowSeconds);

/** "about 40 seconds", "about 12 minutes". */
function wait(seconds: number): string {
  if (seconds < 90) return `about ${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `about ${minutes} minutes`;
}

function messageFor(l: Limit, retryAfterSeconds: number): string {
  const w = wait(retryAfterSeconds);
  if (l.tools === "costly") {
    return `This AI app has asked for a lot of new work in a short time, so new requests, plans and job starts are paused. Wait ${w}, then try again. Browsing agents and checking jobs still work.`;
  }
  return l.per === "user"
    ? `Too many requests from your connected AI apps. Wait ${w}, then try again.`
    : `Too many requests from this AI app. Wait ${w}, then try again.`;
}

/**
 * Counts one tool call and says whether it is over a limit. Returns null when the call may go ahead.
 * Calls that are refused still count, so an app that keeps retrying stays paused until the window ends.
 */
export async function takeToolCall(env: Env, user: AuthUser, costly: boolean, nowMs = Date.now()): Promise<RateLimited | null> {
  const nowSeconds = Math.floor(nowMs / 1000);
  const limits = LIMITS.filter(l => l.tools === "any" || costly);
  const db = env.DB;
  let results: D1Result<{ count: number }>[];
  try {
    results = await db.batch<{ count: number }>(limits.map(l => {
      const start = windowStart(l, nowSeconds);
      return db.prepare("INSERT INTO mcp_rate_counts (bucket, window_start, count, expires_at) VALUES (?, ?, 1, ?) ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1 RETURNING count")
        .bind(bucketKey(l, user), start, new Date((start + l.windowSeconds) * 1000).toISOString());
    }));
  } catch (err) {
    console.error("mcp_rate_limit_unavailable", err instanceof Error ? err.message : String(err));
    return null;
  }
  // A limit on every tool is reported before a costly-only one (it blocks more); among equals, the longest wait.
  let worst: RateLimited | null = null;
  for (const [i, l] of limits.entries()) {
    const count = Number(results[i]?.results?.[0]?.count ?? 0);
    if (count <= l.max) continue;
    const retryAfterSeconds = Math.max(1, windowStart(l, nowSeconds) + l.windowSeconds - nowSeconds);
    const better = !worst
      || (l.tools === "any" && worst.limit.tools === "costly")
      || (l.tools === worst.limit.tools && retryAfterSeconds > worst.retryAfterSeconds);
    if (better) worst = { limit: l, retryAfterSeconds, message: messageFor(l, retryAfterSeconds) };
  }
  return worst;
}

/** Cron: drop counters whose window is over. */
export async function cleanupRateCounts(env: Env): Promise<void> {
  await env.DB.prepare("DELETE FROM mcp_rate_counts WHERE expires_at <= ?").bind(new Date().toISOString()).run();
}
