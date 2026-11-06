// Durable job runs on Cloudflare Workflows. Owner: runner module.
// Only this file and src/worker.ts may import "cloudflare:workers" (tests load everything else in Node).
import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import type { Env } from "../../env.ts";
import { executeRun } from "./service.ts";

export interface JobRunParams { runId: string }

export class JobRunWorkflow extends WorkflowEntrypoint<Env, JobRunParams> {
  async run(event: WorkflowEvent<JobRunParams>, step: WorkflowStep) {
    // executeRun records its own failures (run failed, job failed, ops alerted) and only throws on infrastructure
    // errors such as a database outage. A retry is safe: finished runs return at once and finished steps are reused.
    // The timeout covers one run plus the automatic rerun after a failed check.
    await step.do("execute run", { retries: { limit: 2, delay: "30 seconds", backoff: "exponential" }, timeout: "30 minutes" }, async () => {
      const out = await executeRun(this.env, event.payload.runId);
      return { draftId: out.draftId };
    });
  }
}
