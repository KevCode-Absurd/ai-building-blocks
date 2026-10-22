// General domain methods, selected by intent rather than benchmark case IDs.
// Each method retains evidence, review and delivery requirements in its instructions.
type Step = [string, string];
export function extendedMethod(goal: string): Step[] | null {
  if (/\bcash[ -]?flow|cash forecast/i.test(goal)) return [
    ["account-reconciler", "Require bank exports, unpaid-invoice schedule, bills/fixed costs and opening cash with an as-of date. Normalize dates/currencies, identify duplicates and reconcile opening cash to the bank. Save checked-input.xlsx and reconciliation.md. Unpaid invoices are receivables, never cash already received."],
    ["libreoffice-spreadsheet-builder", "Use checked-input.xlsx, reconciliation.md and the original cash-model brief to build cash-forecast.xlsx for the requested horizon and weekly cadence (13 weeks when requested). Schedule expected receipts and payments; each week must show opening + receipts - payments = closing. Add base and delayed-payment scenario tabs, assumption cells, editable formulas and source mapping. Require a compatible spreadsheet runner and report unavailable conversion tools."],
    ["spreadsheet-formula-auditor", "Audit cash-forecast.xlsx against original bank/invoice/bill files. Recompute weekly roll-forwards, opening reconciliation, cash-basis treatment, receivable delays and scenario formulas independently. Apply corrections back to cash-forecast.xlsx and recheck at most twice. Return that existing corrected workbook with reconciliation.md, assumptions and update README plus formula-audit.md; do not pretend the audit report itself is the workbook."],
  ];
  if (/\b(lesson|quiz|worked examples|answer key)\b/i.test(goal)) return [
    ["direct-teaching-lesson-builder", "Build the lesson for the requested age, time and reading levels using supplied curriculum. Save teacher-guide.md with explanation and timings; flag missing curriculum assumptions."],
    ["online-worked-example-builder", "Use the lesson to create worked examples with all reasoning and exact calculations. Save worked-examples.md; check arithmetic and age appropriateness."],
    ["practice-problem-set-writer", "Use the lesson and examples for scaffolded student practice. Produce student-practice.md plus a separate worked answer-key.md. Independently solve every question and reconcile the key; never expose answers in the student sheet."],
    ["retrieval-quiz-writer", "Create the requested short quiz aligned to the taught objectives. Save student-quiz.md and teacher-quiz-key.md; solve questions independently and check answers against examples."],
    ["accessible-lesson-auditor", "Read teacher guide, examples, practice, quiz and both answer keys as separate documents. Check mathematical correctness, reading barriers, accessible layout and requested timing. Revise and recheck at most twice; deliver editable teacher/student files and check-report.md."],
  ];
  if (/\b(papers|literature.review|research synthesis)\b/i.test(goal)) return [
    ["research-literature-comparison", "Require the supplied papers and bibliographic metadata. Extract study design, sample, measures, findings, limitations and page/section references into evidence-table.csv. Preserve paper IDs, conflicting findings and missing data. Distinguish association from causation. Draft literature-review-outline.md with traceable citations."],
    ["research-paper-evidence-review", "Review each original paper alongside evidence-table.csv and the outline. Verify every quotation, claim and citation against the originals; explain disagreements and evidence strength. Repair and recheck at most twice. Deliver table, outline, references and unresolved-evidence.md; invent no studies."],
  ];
  if (/\b(resume|cover letter|job application)\b/i.test(goal)) return [
    ["resume-job-application-builder", "Request current resume and target job description separately. Map requirements to supplied experience, tailor a truthful resume and cover letter, and record a claim-to-source ledger. Check ATS readability using plain headings, reading order and selectable text. No invented skills, dates or metrics. Independently verify claims and repair at most twice. Deliver editable resume.docx, cover-letter.docx and checks.md; never submit an application."],
  ];
  if (/\b(suppliers?|vendors?)\b/i.test(goal) && /\b(quote|quotes|compare|score)\b/i.test(goal)) return [
    ["supplier-quote-table-builder", "Normalize supplied quotes into quotes.xlsx: currency, taxes, units, minimum order, landed price, payment terms, lead time and documented quality. Preserve source IDs and unknowns. Include original quote files and buyer requirements; do not invent quality scores."],
    ["supplier-scorer", "Read quotes.xlsx and buyer constraints. Apply the user's price/quality/lead-time weights explicitly (require weights if absent). Document scale direction, normalization, weighted arithmetic, budget feasibility and sensitivity. Save supplier-scorecard.xlsx and recommendation.md; recompute every weighted total independently."],
    ["negotiation-prep-coach", "Use the original buyer brief plus recommendation.md and scorecard as negotiation evidence. Prepare negotiation-brief.md with target, opening, concessions, reservation points and fallback. Check recommendations against quote evidence and constraints, repair/recheck at most twice. Deliver all files and assumptions; do not contact suppliers."],
  ];
  if (/\b(pricing experiment|experiment|a\/b test)\b/i.test(goal)) return [
    ["experiment-designer", "Define hypothesis, control/treatment, randomization unit, eligibility, one primary metric, guardrails and success/stop rules. State baseline, minimum detectable effect, alpha/power and sample-size assumptions; ask for missing baseline data. Save experiment-plan.md."],
    ["ab-test-traffic-checker", "Use actual supplied traffic/conversion counts (not invented performance) to check sample-size arithmetic, allocation and duration feasibility. Explain what can be concluded with the stated traffic and when to wait or use a different method. Never claim significance before observations."],
    ["experiment-readout-desk", "Review experiment-plan.md and traffic-readiness findings before launch. Produce launch-checklist.md, metric QA, fixed stopping/guardrail rules, result-input-template.csv and readout.md template. Correct and recheck at most twice. Preserve no-result-yet status; obtain approval before activation. No recurring schedule is implied by this coordinator."],
  ];
  if (/\bchurn|retention\b/i.test(goal)) return [
    ["spreadsheet-checker", "Require the customer CSV and data dictionary. Check account IDs, date/time consistency, duplicates, missing values and observation window. Define cancelled vs active-at-risk cohorts explicitly; save checked-customers.csv and definitions.md. No invented trained model."],
    ["churn-risk-finder", "Analyze checked-customers.csv using transparent stated rules and available features. Separate observed cancellations from predicted/heuristic risk, preserve account IDs and explain missing usage evidence. Save risk-segments.csv and findings.md; validate definitions and sample records independently."],
    ["email-sequence-writer", "Use the highest-risk active segment and original brand/offer facts to draft the requested retention plan and emails, not a generic welcome flow. Map messages to supported risk reasons. Save retention-emails.md; exclude cancelled/unconsented users unless an approved separate policy allows contact."],
    ["claim-and-proof-matcher", "Verify every retention claim/offer against source evidence. Check cohort membership, suppression and personalization fallbacks. Repair/recheck at most twice. Deliver data checks, segment logic, email drafts and import checklist. Human approval before loading/live sends; no sending from this pack."],
  ];
  if (/\bseo\b/i.test(goal) && /\b(agent|monthly|weekly|recurring|monitor)\b/i.test(goal)) return [
    ["monthly-store-seo-keeper", "Preserve this SEO coordinator. Configure the requested cadence only in a compatible runner after authorization. Require site URLs/crawl exports, prior snapshots, Search Console if applicable, state storage and report destination. Store run ID, evidence hashes and checkpoint status; compare prior evidence before audits. Save dated audit-report.md and diff.md. Retry transient reads at most twice; retain partial failures without marking the run complete."],
    ["plain-english-editor", "Turn audit-report.md and diff.md into one approval-request email draft; this is not a marketing sequence. Atomically reserve a notification key from site+period+evidence hash before drafting; track pending/approved/sent states to avoid duplicate pending drafts. Deliver setup README, history schema, state template, report and draft. No activation or email send is authorized by downloading."],
  ];
  if (/\b(onboarding|onboard)\b/i.test(goal) && /\b(privacy|personal data)\b/i.test(goal)) return [
    ["customer-onboarding-planner", "Require product goals, user roles and the data map. Define onboarding stages, owners, first-value milestones and support handoffs. Save onboarding.md plus stage-data-map.csv identifying each personal-data field, purpose, access, retention and necessity; mark unknowns."],
    ["gdpr-privacy-checker", "Review onboarding.md and stage-data-map.csv against the user's jurisdiction and actual processing, including EU/GDPR where applicable. Minimize fields, identify lawful-basis/retention/access questions and owner actions. Revise/recheck at most twice. Deliver privacy-review.md and approval checklist for qualified human review; no legal certification or live configuration."],
  ];
  if (/\b(onboarding|onboard|30.60.90)\b/i.test(goal) && !/\bhir(e|ing)\b/i.test(goal)) return [
    ["30-60-90-day-onboarding-planner", "Use the generated role brief and original team constraints. Define distinct 30/60/90-day milestones, owners, evidence of completion, weekly-hour capacity, learning and check-ins. Protect financial/production access with least privilege and separate human approval. Review feasibility, repair/recheck twice at most and deliver onboarding.md and milestone-checklist.csv."],
  ];
  if (/\b(podcast|transcript)\b/i.test(goal) && /\b(blog|linkedin|repurpose)\b/i.test(goal)) return [
    ["blog-post-producer", "Require the original transcript with speaker IDs/timestamps. Extract a source ledger, then write blog-draft.md using only supported material. Keep quotations exact and claims linked to timestamps; flag missing timestamps rather than inventing them."],
    ["linkedin-post-writer", "Use the transcript source ledger and checked blog to draft the requested number of distinct LinkedIn posts. Preserve speaker meaning and exact quoted words. Save linkedin-posts.md with source timestamps for each factual claim."],
    ["claim-and-proof-matcher", "Review the blog and social posts separately as copy drafts against the original transcript. Verify quotes, timestamps and all statistics; remove unsupported claims. Repair/recheck at most twice. Deliver editable drafts, source-ledger.csv and publication-checklist.md. No posting is authorized."],
  ];
  if (/\b(investor|pitch)\b/i.test(goal) && /\b(deck|slides|slide)\b/i.test(goal)) return [
    ["spreadsheet-checker", "Require business facts and source financial workbook. Reconcile figures, dates, units and formulas; separate actuals, forecasts and assumptions. Save checked-financials.xlsx and evidence-ledger.md; never invent traction."],
    ["editable-slide-deck-builder", "Use original business facts and checked-financials.xlsx to create the requested slide count and story. Build editable pitch.pptx with real text/charts, speaker notes per slide and source references. Identify missing evidence and clearly label projections; no invented investor claims."],
    ["finance-deck-quality-checker", "Check every deck number against original sources and checked workbook, adapting fiscal years/currency to this user rather than assuming Indian conventions. Review story, readability, sources and notes. Repair and rerender/recheck at most twice; deliver editable deck, notes, source ledger and check report. No investor outreach."],
  ];
  if (/\b(competitor|rival)s?\b/i.test(goal) && /\b(comparison|compare|battlecard)\b/i.test(goal.replace(/battle card/g, "battlecard"))) return [
    ["competitor-product-analyst", "Require your product facts and supplied competitor URLs. Collect dated source evidence using browsing when available; otherwise request page exports and mark live checks not run. Save comparison.csv with feature/price, your product, each rival, date, source links and unknowns. Verify facts, avoid copying their wording."],
    ["competitor-battlecard-builder", "Use comparison.csv, its dated evidence and original positioning brief to make an original sales-battlecard.md. Separate verified facts, interpretation and unanswered questions. Recheck claims against sources, revise at most twice and deliver comparison, sources and battlecard; claim no unseen browsing."],
  ];
  if (/\b(survey|feedback)\b/i.test(goal) && /\b(roadmap|feature|prioriti)\b/i.test(goal)) return [
    ["feedback-theme-finder", "Require survey responses with stable response IDs. Check duplicates/missing data, group themes and preserve IDs, contradictory feedback and sample limitations. Save themes.csv and evidence.md. Vote counts are not revenue or representative demand."],
    ["outcome-based-roadmap", "Convert evidence-backed themes into a prioritized feature roadmap. Record impact/effort criteria, scoring, assumptions, conflicts and outcome measures; request missing effort facts. Save roadmap.md and prioritization.csv with response IDs."],
    ["email-sequence-writer", "Use the top roadmap feature and original product/brand facts to draft the requested release announcement, not a welcome series. If unshipped mark clearly as draft, state unconfirmed timing and avoid promising availability. Save announcement.md."],
    ["claim-and-proof-matcher", "Verify prioritization arithmetic, evidence IDs and announcement claims against the survey and product facts. Flag unsupported promises; repair/recheck at most twice. Deliver roadmap, evidence, scores and draft email; no sends."],
  ];
  return null;
}
