// Quality checks and blind tests. Owner: evaluation module.
import type { Env } from "../../env.ts";
import type { BaselineResult, PolicyResult, RubricCriterion, RubricResult } from "../../core/types.ts";
import type { Provider } from "../../core/models.ts";

/**
 * Score one draft: rubric judge (a model from a different provider than the writer, quoting evidence per criterion)
 * plus policy checks. Writes rows to scores. feedback = plain instructions for a rerun when it fails.
 */
export async function checkDraft(env: Env, input: { draftId: string; rubric: RubricCriterion[]; jobTypeId: string; brief: string; writerProvider?: Provider }): Promise<{ passed: boolean; rubric: RubricResult; policy: PolicyResult; feedback: string }> {
  void env; void input; throw new Error("evaluation.checkDraft is not built yet");
}

/** Pairwise judge: agent draft vs plain-AI draft on the same brief, judged twice with the order swapped. Writes a 'baseline' score. */
export async function compareWithBaseline(env: Env, input: { agentDraftId: string; baselineDraftId: string; rubric: RubricCriterion[]; brief: string }): Promise<BaselineResult> {
  void env; void input; throw new Error("evaluation.compareWithBaseline is not built yet");
}

/** After a job draft is written: with probability BASELINE_SAMPLE_RATE, run the baseline, compare, and open a blind test. */
export async function afterJobDraft(env: Env, input: { jobId: string; draftId: string }): Promise<{ blindTestId: string | null }> {
  void env; void input; throw new Error("evaluation.afterJobDraft is not built yet");
}

/** Open a blind test: the two drafts shown unlabelled, in random order, to reviewers. */
export async function createBlindTest(env: Env, input: { jobTypeId: string; jobId?: string; agentId: string; agentVersion: number; brief: string; agentDraftId: string; baselineDraftId: string }): Promise<{ testId: string }> {
  void env; void input; throw new Error("evaluation.createBlindTest is not built yet");
}

export interface WinRate { key: string; tests: number; judgments: number; agentWins: number; baselineWins: number; ties: number; winRate: number | null }

/** Blind-test results. winRate = agent wins / (agent wins + baseline wins) over closed tests' majority picks. */
export async function winRates(env: Env, groupBy: "all" | "agent" | "job_type"): Promise<WinRate[]> {
  void env; void groupBy; throw new Error("evaluation.winRates is not built yet");
}
