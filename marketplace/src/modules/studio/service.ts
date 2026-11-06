// Expert studio: turns an expert's method into a versioned agent package. Owner: studio module.
import type { Env } from "../../env.ts";

/** Ops (or later, automated certification) puts a published version live; the previous live version stays traceable. */
export async function setAgentLive(env: Env, input: { agentId: string; version: number; actor: string }): Promise<void> {
  void env; void input; throw new Error("studio.setAgentLive is not built yet");
}

/** Take an agent out of matching (status retired or back to testing). */
export async function setAgentStatus(env: Env, input: { agentId: string; status: "testing" | "retired"; actor: string; reason: string }): Promise<void> {
  void env; void input; throw new Error("studio.setAgentStatus is not built yet");
}
