export const FREE_WORKFLOWS_PER_DAY = 5;
export const DAILY_AI_BUDGET_USD = 10;
export type ComposerPolicyEnv = { WORKFLOW_DAILY_ATTEMPT_LIMIT?: string; WORKFLOW_DAILY_CAP_USD?: string; WORKFLOW_UNLIMITED_USER_ID?: string };

export function dailyAttemptLimit(env: ComposerPolicyEnv): number {
  const limit = Number(env.WORKFLOW_DAILY_ATTEMPT_LIMIT ?? FREE_WORKFLOWS_PER_DAY);
  return Number.isSafeInteger(limit) && limit > 0 ? limit : 0;
}

/** Only an already authenticated subject can match the single server-side exemption. */
export function accountAttemptLimit(env: ComposerPolicyEnv, verifiedUserId: string): number | null {
  const limit = dailyAttemptLimit(env);
  if (!limit) return 0;
  const owner = env.WORKFLOW_UNLIMITED_USER_ID ?? "";
  return /^user_[A-Za-z0-9]+$/.test(owner) && owner === verifiedUserId ? null : limit;
}

export function dailyBudget(env: ComposerPolicyEnv): number {
  const cap = Number(env.WORKFLOW_DAILY_CAP_USD ?? DAILY_AI_BUDGET_USD);
  return Number.isFinite(cap) && cap > 0 ? cap : 0;
}
