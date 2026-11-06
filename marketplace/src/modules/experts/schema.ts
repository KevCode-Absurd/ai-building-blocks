// Validation for expert applications. Messages are shown to the applicant as written, so they say what to fix.
import { z } from "zod";
import { AREAS } from "../../core/types.ts";
import { fail } from "../../core/http.ts";
import { getJobType } from "../catalogue/index.ts";

export const LIMITS = {
  name: { min: 2, max: 80 },
  headline: { min: 5, max: 140 },
  areas: { min: 1, max: 3 },
  jobTypes: { min: 1, max: 10 },
  experience: { min: 40, max: 3000 },
  claims: { min: 1, max: 5 },
  claimText: { min: 5, max: 300 },
  samples: { max: 5 },
  country: { min: 2, max: 60 },
  url: { max: 500 },
} as const;

/** True for a full https:// link to a real host name (not localhost or a bare IP-less word). */
export function isHttpsLink(value: string): boolean {
  if (value.length > LIMITS.url.max) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname.includes(".") && !u.username && !u.password;
  } catch {
    return false;
  }
}

const httpsLink = (message: string) => z.string({ error: message }).trim().refine(isHttpsLink, message);

const unique = <T>(list: T[]) => [...new Set(list)];

export const applicationSchema = z.object({
  display_name: z.string({ error: "Fill in your name." }).trim()
    .min(LIMITS.name.min, "Fill in your name.")
    .max(LIMITS.name.max, `Keep your name under ${LIMITS.name.max} characters.`),
  headline: z.string({ error: "Add a headline: one line on what you do and who for." }).trim()
    .min(LIMITS.headline.min, "Add a headline: one line on what you do and who for.")
    .max(LIMITS.headline.max, `Keep your headline under ${LIMITS.headline.max} characters.`),
  areas: z.array(z.enum(AREAS, { error: "Pick your areas from the list." }), { error: "Pick at least one area." })
    .transform(unique)
    .pipe(z.array(z.enum(AREAS))
      .min(LIMITS.areas.min, "Pick at least one area.")
      .max(LIMITS.areas.max, `Pick up to ${LIMITS.areas.max} areas.`)),
  job_types: z.array(z.string({ error: "Pick the jobs you want to build agents for." }).trim(), { error: "Pick at least one job you want to build an agent for." })
    .transform(unique)
    .pipe(z.array(z.string())
      .min(LIMITS.jobTypes.min, "Pick at least one job you want to build an agent for.")
      .max(LIMITS.jobTypes.max, `Pick up to ${LIMITS.jobTypes.max} jobs.`)
      .refine(ids => ids.every(id => !!getJobType(id)), "One of the jobs you picked is not on our menu. Reload the page and pick again.")),
  experience: z.string({ error: "Tell us about your experience." }).trim()
    .min(LIMITS.experience.min, "Tell us a bit more about your experience: a few sentences is enough.")
    .max(LIMITS.experience.max, `Keep your experience under ${LIMITS.experience.max} characters.`),
  claims: z.array(z.object({
    text: z.string({ error: "Fill in each claim, or remove it." }).trim()
      .min(LIMITS.claimText.min, "Fill in each claim, or remove it.")
      .max(LIMITS.claimText.max, `Keep each claim under ${LIMITS.claimText.max} characters.`),
    evidence_url: httpsLink("Each claim needs a link that starts with https:// and shows the proof."),
  }, { error: "Each claim needs a short line and a link." }), { error: "Add at least one claim with a link that shows it." })
    .min(LIMITS.claims.min, "Add at least one claim with a link that shows it.")
    .max(LIMITS.claims.max, `Add up to ${LIMITS.claims.max} claims.`),
  sample_links: z.array(httpsLink("Sample links must start with https://."), { error: "Sample links must be a list of links." })
    .max(LIMITS.samples.max, `Add up to ${LIMITS.samples.max} sample links.`)
    .optional()
    .transform(list => unique(list ?? [])),
  country: z.string({ error: "Tell us which country you work from." }).trim()
    .min(LIMITS.country.min, "Tell us which country you work from.")
    .max(LIMITS.country.max, `Keep the country under ${LIMITS.country.max} characters.`),
  agree: z.literal(true, { error: "Tick the box to agree to the founding expert agreement." }),
});

export type ValidApplication = z.output<typeof applicationSchema>;

/** Parses an application or throws a 400 with the first problem, in plain words. */
export function parseApplication(input: unknown): ValidApplication {
  if (!input || typeof input !== "object" || Array.isArray(input)) return fail(400, "invalid_application", "Send your application as a form.");
  const result = applicationSchema.safeParse(input);
  if (!result.success) return fail(400, "invalid_application", result.error.issues[0]?.message ?? "Check your application and try again.");
  return result.data;
}
