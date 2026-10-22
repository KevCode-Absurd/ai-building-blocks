// Versioned domain rules. Every stage names an existing block; free users get the
// same reviewed process every time, with their request carried in the instructions.
export type RecipeStep = [slug: string, instruction: string];
import { extendedMethod } from "./composer-methods.ts";
import { isReviewRequest, taskFocus } from "./composer-intent.ts";
export function recipeFor(goal: string): RecipeStep[] | null {
  // Review an existing ad before considering the video-script creation method.
  if (isReviewRequest(goal) && /\b(ads?|adverts?|advertisements?|advertising)\b/i.test(taskFocus(goal))) {
    const account = /\b(accounts?|campaigns?|performance|spend|roas|ctr|cpc|cpa|results|exports?)\b/i.test(goal);
    if (account) {
      const auditor = /\bgoogle\b/i.test(goal) ? "google-ads-account-auditor" : /\btiktok\b/i.test(goal) ? "tiktok-ads-account-auditor" : /\blinkedin\b/i.test(goal) ? "linkedin-ads-account-auditor" : /\b(microsoft|bing)\b/i.test(goal) ? "microsoft-ads-account-auditor" : "ad-account-audit";
      return [
        ["ad-data-quality-checker", "Require the original ad-performance export, reporting dates, attribution settings and business goal. Check missing spend, duplicates and inconsistent columns before interpreting results. Save ad-data-quality.md; list missing fields instead of inventing figures."],
        [auditor, "Read the original performance export alongside ad-data-quality.md. Audit the requested platform and account scope, separating verified findings from hypotheses. Save ad-account-audit.md and ranked-fixes.md with source rows, reporting dates and unresolved checks. Verify calculations against the export and recheck corrections at most twice. Deliver reports and a README; recommend changes for approval before changing campaigns or budgets."],
      ];
    }
    return [
      ["pre-launch-ad-checker", "Require the existing ad as an image, video, script or copy, plus the product, audience, offer and intended platform. Review that supplied creative for clarity, hook, offer, proof, CTA and applicable policy risks. Save ad-audit.md with evidence locations and ranked fixes. Mark unavailable visual or video checks not run; do not create a new campaign or infer account performance."],
      ...( /\b(video|ugc)\b/i.test(goal) ? [["video-ad-bridge-checker", "Require the supplied ad's script or a verified transcript with scene timings. Review hook-to-body transitions and the move to the offer against the existing ad and ad-audit.md. Save video-ad-review.md and suggested script edits; do not replace the review with new script generation."] as RecipeStep] : []),
      ["claim-and-proof-matcher", "Require the existing ad's written copy or verified transcript as the copy draft, plus approved product facts and offer evidence. Check every claim in the original ad and suggested fixes against those sources. Save claim-evidence.md and final-ad-fixes.md; remove unsupported proposed claims, recheck at most twice and deliver the audit reports plus a README. List unresolved evidence and do not publish or change live ads."],
    ];
  }
  const extended = extendedMethod(goal); if (extended) return extended;
  if (/\b(hir(e|ing)|recruit|interview|work sample)\b/i.test(goal)) return [
    ["problem-first-job-description-writer", "Write the role brief and job description for the requested role: business problem, outcomes, responsibilities, essential criteria and constraints. Save role-brief.md and ask for missing role facts."],
    ["structured-interview-guide", "Use role-brief.md to design consistent interview questions and anchored scoring criteria. Keep the final hiring decision with a human."],
    ["interview-scorecard-builder", "Turn the interview plan into a scorecard with evidence fields and the same scoring anchors for every candidate. Save scorecard.md."],
    ["work-sample-test-designer", "Use the role brief to design a job-relevant work sample, time limit, candidate instructions and scoring rubric. Save work-sample.md."],
    ["assessment-fairness-check", "Review the role brief, interview, scorecard and work sample for fairness and accessibility. Revise failures and recheck at most twice. Hand back the whole assessment pack and unresolved issues. Do not contact candidates or make hiring decisions."],
  ];
  if (/\bn8n\b/i.test(goal)) return [
    ["n8n-workflow-designer", "Define trigger, supplied input schema, CRM mapping and validation. For payment webhooks verify signatures on raw bytes, stable event IDs and timestamp/replay checks. Use atomic insert/upsert for dedupe, reconcile unknown writes, and handle out-of-order events using a per-record version/state rule, including ties. Save workflow.json and field-mapping.md; secrets stay in runner storage."],
    ["n8n-failure-handler", "Add timeouts, at most three retries with backoff, and a failed-item path. Report run ID, failed stage and redacted error. Never retry a write with unknown outcome until it is reconciled by its idempotency key."],
    ["n8n-sub-workflow-builder", "Extract reusable validation and CRM mapping. Export importable workflow JSON, setup README and environment-variable names with placeholders. Test valid, invalid, duplicate, timeout and unknown-outcome cases in a sandbox; save tests.md. Fix failures and retest at most twice, then stop. Obtain approval before live activation or scheduling."],
  ];
  if (/\b(support|tickets?|inbox)\b/i.test(goal) && /\b(backlog|repl(y|ies)|help|tickets?)\b/i.test(goal)) return [
    ["support-ticket-sorter", "Group supplied tickets by issue, urgency and verified resolution status. Save triage.csv and a repeated-issues summary. Preserve ticket IDs and redact credentials and personal data."],
    ["customer-reply-drafter", "Draft selected replies using triage.csv and the exact approved policy. For refunds verify order date, receipt and eligibility window; missing proof or exceptions go to escalation.csv with ticket ID, reason and human owner. Never promise an unapproved refund. Save replies.md; redact payment details and retain ticket IDs."],
    ["angry-customer-reply-checker", "Review all reply drafts against the ticket evidence and policies. Correct unsupported promises, tone and missing next actions. Recheck at most twice; leave unresolved replies blocked."],
    ["solved-ticket-help-page-writer", "Use repeated issues and verified solved tickets to draft exactly the requested article count (one if requested). Do not turn unresolved exceptions into instructions. Verify policy rules, including receipt/order-date requirements, and link source ticket IDs. Save help-articles.md and unresolved questions."],
    ["plain-english-editor", "Edit the replies and help articles separately, preserving facts and ticket links. Hand back triage.csv, replies.md, help-articles.md and a review report. A human must approve every outgoing reply and article publication. No sending from this pack."],
  ];
  if (/\b(kpi|dashboard|forecast|weekly report)\b/i.test(goal)) return [
    ["metric-definition-writer", "Inspect the supplied sales spreadsheet schema and agree metric definitions, units, dates, timezone and weekly aggregation. Save metric-definitions.md; request missing columns and never invent sales data."],
    ["spreadsheet-checker", "Validate the source spreadsheet for missing values, duplicates, inconsistent units and broken formulas. Reconcile totals to the source. Save checked-input.xlsx and data-quality.md."],
    ["recurring-kpi-report-maker", "Use the checked spreadsheet and metric definitions for the requested weekly report. Show source ranges, formulas, units and reporting dates. Save weekly-report.xlsx and summary.md."],
    ["trend-and-forecast-analyst", "Use the checked weekly report to produce a forecast with stated method, assumptions and uncertainty. Backtest where enough history exists; otherwise mark the forecast provisional."],
    ["dashboard-builder", "Build a reusable dashboard from the checked metrics and forecast. Include filters, update instructions and source lineage; do not hard-code invented example results."],
    ["data-quality-scorecard-maker", "Independently recalculate sample metrics, totals and forecast inputs from the original spreadsheet. Check dashboard filters and labels. Fix and rerun failed checks at most twice. Deliver reusable report, forecast and dashboard files, metric definitions, README and check evidence."],
  ];
  if (/\b(emails?|welcome sequence)\b/i.test(goal)) return [
    ["email-sequence-writer", "Write exactly the requested email count and purpose (launch, welcome, retention or release) from the brand brief, audience, offer and approved proof. Each needs its purpose, subject, preview, body and CTA. Preserve all requested language versions and original offer facts; mark an unspecified count as an editable assumption. Save emails.md."],
    ["plain-english-editor", "Read each email from emails.md as a separate copy draft. Edit for clarity and brand voice while preserving the sequence and factual meaning. Save edited-emails.md."],
    ["claim-and-proof-matcher", "Check every claim across edited-emails.md against supplied product facts, offer terms and evidence. Remove or label unsupported claims. Save claim-evidence.md; never invent testimonials."],
    ["email-send-readiness-scorer", "Review the final sequence, links, personalization fallbacks, audience and suppression rules. Fix and recheck failures at most twice. Deliver final emails, claim evidence and an import checklist covering field mapping, draft loading and test sends. Obtain concrete human approval before any send or live automation."],
  ];
  if (/\b(seo|search engine|google ranking)\b/i.test(goal)) return [
    ["technical-seo-auditor", "Inspect the supplied site or crawl export. Record evidence for crawl, indexing, speed and rendering issues. Mark unavailable checks not run and never invent crawl results."],
    ["on-page-seo-tuner", "Merge technical findings with on-page review into one ranked fix list by page URL, severity and effort. Keep one canonical finding per issue. Save fixes.csv."],
    ["title-and-meta-tag-writer", "Use the ranked findings and actual page content to draft unique titles and descriptions per URL. Save metadata.csv with current and proposed values; preserve truthful offers."],
    ["schema-markup-writer", "Use verified page facts for appropriate structured markup. Save JSON-LD files, exact insertion locations and validation evidence; never add unsupported review ratings."],
    ["coding-agent-handoff-writer", "Consolidate fixes.csv, metadata.csv and JSON-LD into an implementation brief with affected URLs/files, order, rollback and acceptance checks. Validate syntax and page-to-metadata mappings; correct failures at most twice. Deliver the files and README. Code access and authorization are required before modifying a live site."],
  ];
  if (/\b(video|ugc)\b/i.test(goal) && /\b(ad|ads|script)\b/i.test(goal)) return [
    ["customer-buying-reasons-finder", "Read supplied reviews and product facts. Extract buyer reasons with exact review IDs and approved facts. Save buyer-evidence.md; do not invent customers or quotes."],
    ["quote-video-ad-script", "Use buyer-evidence.md and product facts to write the requested number and length of video scripts. Keep each hook, spoken script and CTA separate. Preserve evidence references and mark missing proof."],
    ["ad-script-read-aloud-editor", "Read each script aloud, check timing against the requested duration and edit for natural speech. Save final-scripts.md without altering factual claims."],
    ["claim-and-proof-matcher", "Treat each final script as a copy draft and verify its claims against product facts and review evidence. Remove unsupported claims. Revise and recheck at most twice; save claim-check.md."],
    ["video-ad-shot-list-maker", "Wait for claim review and its corrections. Use only the checked final scripts to create editor-ready scene timings, shots, assets, captions and production directions. Deliver final scripts, shot lists and claim evidence. List missing assets and get approval before creating a live ad campaign."],
  ];
  return null;
}
