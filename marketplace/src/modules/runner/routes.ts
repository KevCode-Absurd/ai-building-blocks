// API routes for the runner module. Paths and owners are listed in ARCHITECTURE.md.
// The runner has no API of its own: intake, delivery, ops and studio call its service functions.
import type { Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { sweepStaleRuns } from "./service.ts";

export const routes: Route[] = [];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [
  async env => { await sweepStaleRuns(env); },
];
