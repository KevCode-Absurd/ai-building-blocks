// Cloudflare Worker entry. Keep this file thin: logic lives in app.ts and the modules.
import type { Env } from "./env.ts";
import { handleFetch, handleScheduled } from "./app.ts";

export { JobRunWorkflow } from "./modules/runner/workflow.ts";

export default {
  fetch(req: Request, env: Env, exec: ExecutionContext) {
    return handleFetch(req, env, exec);
  },
  scheduled(_event: ScheduledController, env: Env, exec: ExecutionContext) {
    exec.waitUntil(handleScheduled(env));
  },
} satisfies ExportedHandler<Env>;
