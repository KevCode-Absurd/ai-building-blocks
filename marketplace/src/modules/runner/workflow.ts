// Durable job runs on Cloudflare Workflows. Owner: runner module.
// Only this file and src/worker.ts may import "cloudflare:workers" (tests load everything else in Node).
import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import type { Env } from "../../env.ts";
import { executeRun } from "./service.ts";

export interface JobRunParams { runId: string }

export class JobRunWorkflow extends WorkflowEntrypoint<Env, JobRunParams> {
  async run(event: WorkflowEvent<JobRunParams>, step: WorkflowStep) {
    await step.do("execute run", { retries: { limit: 2, delay: "30 seconds", backoff: "exponential" }, timeout: "15 minutes" }, async () => {
      const out = await executeRun(this.env, event.payload.runId);
      return { draftId: out.draftId };
    });
  }
}
