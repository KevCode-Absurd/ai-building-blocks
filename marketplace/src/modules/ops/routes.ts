// API routes for the ops module. Paths and owners are listed in ARCHITECTURE.md.
import type { Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";

export const routes: Route[] = [];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [];
