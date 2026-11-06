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
  /** "invite": buyers need a redeemed beta code; "open": anyone signed in. */
  BETA_MODE?: "invite" | "open";
  /** "fake": deterministic stand-in model replies (tests, local demo); "live": real providers. */
  MODEL_MODE?: "fake" | "live";
  /** "required": ops approves every draft before the buyer sees it (the beta default). */
  RELEASE_REVIEW?: "required" | "off";
  DAILY_MODEL_CAP_USD?: string;
  JOB_COST_CAP_USD?: string;
  /** Share of jobs (0 to 1) that also get a plain-AI baseline comparison. */
  BASELINE_SAMPLE_RATE?: string;
  EMAIL_FROM?: string;

  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;

  /** Tests and local dev only: accept the x-test-user header as the signed-in user. Ignored unless APP_ENV is "test" or "local". */
  AUTH_TEST_MODE?: string;
}
