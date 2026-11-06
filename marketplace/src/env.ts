// Bindings and settings the Worker receives. Matches wrangler.jsonc; secrets are optional so local dev runs without them.
export interface WorkflowLike {
  create(options: { id?: string; params?: unknown }): Promise<{ id: string }>;
  get?(id: string): Promise<unknown>;
}

export interface EmailSender {
  send(message: unknown): Promise<unknown>;
}

export interface Env {
  DB: D1Database;
  ASSETS?: { fetch(request: Request): Promise<Response> };
  JOB_RUN?: WorkflowLike;
  EMAIL?: EmailSender;

  APP_ENV: "local" | "staging" | "production" | "test";
  APP_ORIGIN: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_JWT_KEY?: string;
  CLERK_SECRET_KEY?: string;
  /** Comma-separated Clerk user ids with full ops access. */
  OPS_USER_IDS?: string;
  /** "true": buyers need a redeemed invite code to hire. "false" (the default, and every environment today): anyone
   *  signed in can hire, with no code. */
  INVITE_ONLY?: "true" | "false";
  /** "on": anyone signed in can hire an agent here, and the job runs on our model keys. "off" or unset (every
   *  environment today): agents run in people's own AI (download, API, MCP), and only ops can start jobs here. */
  HOSTED_JOBS?: "on" | "off";
  /** Optional: jobs one person can start in any 24 hours. "0" or unset = no limit (the default everywhere). */
  DAILY_JOBS_PER_USER?: string;
  /** "fake": deterministic stand-in model replies (tests, local demo); "live": real providers. */
  MODEL_MODE?: "fake" | "live";
  /** "required": ops approves every draft before the buyer sees it (the beta default). */
  RELEASE_REVIEW?: "required" | "off";
  DAILY_MODEL_CAP_USD?: string;
  JOB_COST_CAP_USD?: string;
  /** Most web searches one job step may run (runner/service.ts webSearchUses). "0" or unset = no web search. */
  WEB_SEARCH_MAX_USES?: string;
  /** Total spend allowed per provider in this environment, e.g. "anthropic:20,gemini:48,deepseek:11" (core/models.ts). */
  PROVIDER_BUDGETS_USD?: string;
  /** Share of jobs (0 to 1) that also get a plain-AI baseline comparison. */
  BASELINE_SAMPLE_RATE?: string;
  EMAIL_FROM?: string;
  /** Where replies go. The sender address has no inbox; replies should reach the team's Google Workspace inbox. */
  EMAIL_REPLY_TO?: string;

  /** Comma-separated providers allowed for text work, e.g. "anthropic,gemini,deepseek". Unset = any provider with a key. */
  MODEL_PROVIDERS?: string;

  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;

  /** Tests and local dev only: accept the x-test-user header as the signed-in user. Ignored unless APP_ENV is "test" or "local". */
  AUTH_TEST_MODE?: string;
}
