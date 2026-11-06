// Expert applications and status. Owner: experts module.
import type { Env } from "../../env.ts";
import type { ExpertRow } from "../../core/access.ts";

/** The founding-expert agreement version experts accept. The text is a draft until counsel replaces it. */
export const AGREEMENT_VERSION = "founding-draft-1";

export interface ExpertApplication {
  display_name: string;
  headline: string;
  areas: string[];            // from AREAS
  job_types: string[];        // catalogue job type ids they want to build agents for
  experience: string;         // years and kind of work, in their words
  claims: { text: string; evidence_url: string }[]; // self-reported, with links
  sample_links: string[];
  country: string;
  agree: boolean;             // accepted AGREEMENT_VERSION
}

export async function applyAsExpert(env: Env, input: { userId: string; application: ExpertApplication }): Promise<ExpertRow> {
  void env; void input; throw new Error("experts.applyAsExpert is not built yet");
}

/** Ops decision. Approving the first 100 sets founding = 1 (75% founding rate when payments go live). Emails the expert. */
export async function reviewApplication(env: Env, input: { expertId: string; decision: "approve" | "reject" | "pause"; note: string; actor: string }): Promise<ExpertRow> {
  void env; void input; throw new Error("experts.reviewApplication is not built yet");
}
