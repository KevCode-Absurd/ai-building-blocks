// The light part of the owner pages: the addresses and the message that starts a job. The start page loads only this,
// so it stays small; the walkthrough and the status page load the rest (owner-view.ts) when opened.
import { BRIEF_FRAME } from "../outcomes/method.mjs";

export const MCP_URL = "https://useaiblocks.com/mcp";
export const OUTCOME_PATHS = { start: "/get-it-done", example: "/get-it-done/example", status: "/get-it-done/status" } as const;
export const JOB_MAX = 2000;

/** The questions the orchestrator's brief covers, in the owner's words, straight from the method. */
export const BRIEF_QUESTIONS: string[] = BRIEF_FRAME.map(f => f.ask).filter(Boolean);

/** The message an owner pastes into their own AI. It starts the job through MCP and repeats the owner's rules. */
export function outcomeMessage(job: string): string {
  const words = job.trim().replace(/\n{3,}/g, "\n\n") || "(say the job in your own words)";
  return [
    "Use the AI Blocks start_outcome tool to get this job done for me:",
    "",
    `"${words}"`,
    "",
    "Ask me your questions in one batch. Then research how experts do this job, build the plan from AI Blocks specialists and tools, and show me the plan before any work starts. I make the decisions, and nothing goes live without my yes. Keep the job's files in an outcomes folder so we can pick it up later.",
    "",
    `If you can't see the AI Blocks tools, help me connect ${MCP_URL} first.`,
  ].join("\n");
}

/** True when the text looks like an API key or token, by the same rule the orchestrator uses to refuse one.
 * The rule loads on first use, so the start page stays small until someone types. */
export async function looksLikeSecret(text: string): Promise<boolean> {
  if (!text.trim()) return false;
  const { refuseSecrets } = await import("../outcomes/engagement.mjs");
  try { refuseSecrets(text); return false; } catch { return true; }
}
