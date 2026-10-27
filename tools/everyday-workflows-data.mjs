// Original recipes. Component source files and licences remain unchanged.
const step = (uses, note) => ({ uses, note });
const flow = (name, job, need, deliverable, acceptance, steps) => ({ name, job, need, deliverable, acceptance, steps: steps.map(([s, n]) => step(s, n)) });
const candidateWorkflows = [
  flow('Make a long form easier to finish', 'design-work', 'The current form, required fields, user goal and known abandonment points.', 'A shorter field list, a revised form flow and a test script.', 'Every retained field has a purpose; required, optional, error and success states are covered.', [
    ['web-form-designer', 'Map required information, remove needless fields and define labels and validation rules.'],
    ['multi-step-form-designer', 'Decide whether the retained form warrants multiple steps; keep a short simple form on one page, otherwise plan step order, saved progress and final review.'],
    ['small-usability-test-planner', 'Test whether a person can finish the revised flow, recover from an error and understand what happens next.'],
  ]),
  flow('Write helpful error and empty states', 'design-work', 'Screens or text for empty, loading, permission-denied and failed actions; actual recovery options.', 'A state inventory, revised messages and a handoff for implementation.', 'Every error explains what happened and one available action; messages never promise a recovery the product lacks.', [
    ['screen-states-designer', 'List the states and user actions for each supplied screen, including retry and interrupted work.'],
    ['error-message-rewriter', 'Write a plain message for every failure state using only recovery actions the product supports.'],
    ['small-interface-details-designer', 'Specify focus, buttons and transitions so each message can be implemented and checked.'],
  ]),
  flow('Turn a design review into fixes', 'design-work', 'A screen or prototype, its intended users, task and implementation limits.', 'An evidence-based issue list, a revised design brief and a usability test.', 'Each fix names an observed problem, the user task it affects and a check for improvement.', [
    ['everyday-usability-reviewer', 'Review the supplied screen for discoverability, mapping, errors and feedback; label the findings as a heuristic review rather than real user test results.'],
    ['design-feedback-giver', 'Turn the agreed issues into specific changes, keeping observations separate from preferences.'],
    ['small-usability-test-planner', 'Write task-based checks for the changes, with neutral prompts and observable success criteria.'],
  ]),
  flow('Make a readable event poster', 'design-work', 'Confirmed event details, audience, format, brand references and required accessibility information.', 'A poster layout, checked text and final export checklist.', 'The date, location, price and action are legible at the intended size and agree with the source.', [
    ['type-led-poster-planner', 'Set a clear reading order for the event name, essential details and next action.'],
    ['poster-designer', 'Build the poster from that hierarchy and the confirmed event facts.'],
    ['colour-contrast-checker', 'Extract actual text and background colors into temporary CSS tokens and explicit pair data for the supplied checker. Check those pairs, then visually inspect image, gradient and opacity areas; mark any color or rendering evidence that is unavailable.'],
  ]),
  flow('Give developers a complete component brief', 'design-work', 'A component design, current system rules and the user tasks it supports.', 'A component brief with variants, states, accessible behavior and design tokens.', 'Keyboard behavior, focus, loading, errors and disabled states are specified; unsupported states are marked missing.', [
    ['design-system-auditor', 'Identify existing patterns and gaps so the component reuses the current system.'],
    ['screen-states-designer', 'Define each needed state and transition, including interruption and recovery.'],
    ['design-token-builder', 'Use component mapping and developer handoff modes with the existing approved values. Preserve those values instead of generating a replacement palette.'],
  ]),
  flow('Check a prototype before user testing', 'design-work', 'The prototype, research question, target users and tasks to test.', 'A review of test blockers, neutral tasks and a session plan.', 'The prototype supports each test task; the plan separates product failures from prototype limitations.', [
    ['everyday-usability-reviewer', 'Walk through the key tasks and record confusing controls, wording and missing states.'],
    ['accessibility-checker', 'Check available accessibility evidence and identify barriers that could invalidate the test.'],
    ['usability-test-runner', 'Prepare and, when participants and consent are available, run neutral sessions around the research question.'],
  ]),
  flow('Make onboarding instructions match the product', 'design-work', 'The current onboarding screens, help text, supported setup path and common questions.', 'A corrected first-use flow, revised labels and a walkthrough checklist.', 'Each instruction refers to a real control and the user can reach a meaningful first result.', [
    ['first-use-onboarding-designer', 'Use supplied user tasks, the first useful result and ethical constraints to choose the smallest onboarding path. Mark missing audience evidence before proposing behavioral changes.'],
    ['plain-words-interface-rewriter', 'Rewrite the selected screens and prompts using the product vocabulary people already understand.'],
    ['in-app-tour-designer', 'Plan optional guidance for the revised flow, with skip, resume and completion behavior.'],
  ]),
  flow('Prepare a design system migration', 'design-work', 'Current component usage, proposed system changes, supported platforms and release constraints.', 'A change inventory, replacement rules and a staged migration brief.', 'Breaking changes list affected components, migration owners and visual checks; old usage remains traceable.', [
    ['design-system-auditor', 'Inventory inconsistent components and distinguish deliberate exceptions from accidental drift.'],
    ['design-rules-file-writer', 'Document the agreed target patterns and replacement rules from actual components without silently removing variants.'],
    ['change-rollout-planner', 'Plan adoption of the approved patterns, with training, owners and acceptance checks. Keep implementation dependencies from the audit visible.'],
  ]),
  flow('Check a translated interface still makes sense', 'design-work', 'Original and translated interface copy, screenshots, locale and supported product behavior.', 'A meaning check, revised wording and a layout review list.', 'Meaning, variables and product promises match; expansion, truncation and direction changes are checked where visible.', [
    ['plain-words-interface-rewriter', 'Clarify the original labels and preserve the meaning and variables in each string.'],
    ['translator', 'Compare the source and target UI strings for meaning, glossary consistency, placeholders and plural rules; flag languages you cannot assess.'],
    ['screen-states-designer', 'Check that translated strings cover all states and identify layouts requiring visual review.'],
  ]),
  flow('Turn user complaints into design questions', 'design-work', 'Consented support excerpts, feedback and relevant screens with dates and product versions.', 'A theme map, ranked design questions and a small research plan.', 'Each question traces to evidence; complaint frequency is bounded by the supplied sample.', [
    ['feedback-theme-finder', 'Group the complaints by user task and preserve sources and conflicting accounts.'],
    ['hypothesis-first-design-planner', 'Turn the strongest themes into testable explanations and small design options.'],
    ['interview-and-research-planner', 'Choose research tasks that distinguish those explanations before a redesign is approved.'],
  ]),
  flow('Prepare a fair promotion discussion', 'lead-people', 'Role expectations, work evidence, promotion criteria and the employee goals shared with consent.', 'An evidence map, development gaps and a promotion discussion brief.', 'Claims use job-related evidence; a recommendation is separate from an approved promotion or pay change.', [
    ['role-skills-framework-builder', 'Translate the supplied promotion criteria into observable work and evidence requirements.'],
    ['career-ladder-plan', 'Map the actual evidence to the target role and identify practical development work.'],
    ['feedback-conversation-planner', 'Prepare a discussion that states the evidence, unresolved questions and next review point.'],
  ]),
  flow('Turn employee feedback into owned actions', 'lead-people', 'Anonymized employee feedback, survey purpose, team scope and privacy limits.', 'A theme summary, prioritized actions and a draft response to staff.', 'Small groups and identifying comments are protected; actions have owners and a way to check progress.', [
    ['employee-survey-designer', 'Read the supplied responses within their sample limits and separate recurring themes from isolated reports.'],
    ['people-risk-register-builder', 'Turn supported themes into concrete risks, evidence gaps and proposed actions.'],
    ['stakeholder-update-writer', 'Draft a staff update covering what was heard, what will be investigated and who owns the next steps.'],
  ]),
  flow('Prepare a team absence handover', 'organise-work', 'Confirmed absence dates, active work, deadlines, approved cover and access limits.', 'A coverage map, handover notes and an escalation list.', 'Every critical commitment has an accepted cover owner or an explicit gap; credentials never appear in the notes.', [
    ['team-capacity-planner', 'Compare the commitments with the actual capacity and cover available during the absence.'],
    ['handover-note-writer', 'Write task-level handovers with source links, current state and the next action.'],
    ['executive-action-register', 'Create a coverage action list with owners, dates, dependencies and unresolved acceptance.'],
  ]),
  flow('Build a practical manager training session', 'teach-and-train', 'A real management skill gap, audience experience, available session time and relevant policy.', 'A session plan, practice activity and evidence of learning to collect.', 'Practice reflects a real task and the check measures the target skill rather than attendance.', [
    ['leadership-program-designer', 'Set an observable outcome and choose the management situations the session should address.'],
    ['training-program-builder', 'Build the session around short explanation, realistic practice and discussion.'],
    ['role-skills-framework-builder', 'Define observable behavior and work evidence for checking the trained management skill.'],
  ]),
  flow('Prepare a workplace accommodation conversation', 'hire-people', 'The stated work barrier, employee preferences shared voluntarily, job tasks and local review requirements.', 'A confidential discussion guide, possible adjustments and a review plan.', 'Medical details are minimized; options stay provisional until the employee and appropriate HR reviewer agree.', [
    ['accommodation-process', 'Identify the work barriers and a respectful process for considering adjustments.'],
    ['people-risk-register-builder', 'Record practical delivery and privacy risks without inferring health conditions.'],
    ['executive-action-register', 'Prepare a restricted action plan with agreed owners, review dates and unanswered questions.'],
  ]),
  flow('Compare HR software before buying', 'hire-people', 'Required HR tasks, user count, integration needs, data categories, quotes and decision criteria.', 'A vendor comparison, privacy questions and a recommendation to review.', 'Quoted costs use the same term and scope; security and privacy gaps remain unresolved until evidence is supplied.', [
    ['hr-vendor-selection-planner', 'Define the must-have tasks and evaluate the supplied vendors against the same criteria.'],
    ['hr-ai-tool-vendor-checker', 'Review AI features, employee data handling and evidence of controls for the shortlisted vendors.'],
    ['vendor-comparison-writer', 'Combine price, fit, implementation effort and open questions into a decision brief.'],
  ]),
  flow('Prepare a confidential conflict discussion', 'lead-people', 'Accounts the parties have agreed to share, relevant work agreements and the desired resolution.', 'A neutral issue map, discussion guide and draft agreements.', 'Allegations remain attributed; neither guilt nor agreement is inferred from silence.', [
    ['conflict-mediation-guide', 'Separate observed events, disputed accounts and needs; identify issues requiring a formal process.'],
    ['feedback-conversation-planner', 'Prepare neutral questions and a discussion structure focused on work and future behavior.'],
    ['meeting-minutes-writer', 'Draft a record that distinguishes proposed agreements from decisions actually accepted.'],
  ]),
  flow('Make a new policy understandable to staff', 'document-work', 'The approved policy, the policy owner confirmed change list, affected roles and effective date.', 'A plain explanation, staff FAQ and rollout action list.', 'The explanation preserves obligations and exceptions; uncertain legal meaning goes back to the policy owner.', [
    ['company-policy-explainer', 'Explain the approved changes with practical examples drawn only from the policy.'],
    ['stakeholder-update-writer', 'Draft a clear announcement and list acknowledgments or training still requiring an owner.'],
  ]),
  flow('Plan coverage for a critical role', 'lead-people', 'Critical tasks, current owner, available deputies, dependencies and the planning horizon.', 'A role coverage map, development actions and a handover checklist.', 'Each critical task has a trained backup or a named gap; readiness is supported by work evidence.', [
    ['succession-plan-builder', 'Identify continuity needs and possible cover using supplied skills and role evidence.'],
    ['role-skills-framework-builder', 'Define the observable skills each proposed backup needs for the critical tasks.'],
    ['training-program-builder', 'Create practice and review actions to close the specific gaps before cover is needed.'],
  ]),
  flow('Check payroll inputs before the cut off', 'track-numbers', 'Timesheets, approved leave, confirmed roster and pay rates, prior-period totals, pay period and payroll rules supplied by HR.', 'An exception list, source reconciliation and payroll questions for review.', 'Hours reconcile to the source period; no pay rule, employee status or tax treatment is invented.', [
    ['payroll-timesheet-checker', 'Use the supplied export path and read-only review steps to find missing approvals, duplicated time and inconsistencies. Use only HR supplied pay rules; stop before resolving flags, staging payroll or posting journals.'],
    ['spreadsheet-checker', 'Recheck period totals, identifiers and formulas in the exception working file.'],
    ['executive-action-register', 'Assign the unresolved payroll questions to approved reviewers before the stated cutoff.'],
  ]),
  flow('Check supplier invoices before approval', 'track-numbers', 'Invoices, purchase orders, receipt records, currency and the approval rules you use.', 'A matched invoice register and a list of amounts needing investigation.', 'Each match names the records used; duplicates, mismatched units and unreceived items remain flagged.', [
    ['invoice-checker', 'Compare each invoice with the supplied order and receipt evidence and mark gaps.'],
    ['invoice-totals-checker', 'Independently recompute line totals, discounts and stated tax arithmetic without choosing tax treatment.'],
    ['spreadsheet-checker', 'Check the combined register for duplicate IDs, currency mix-ups and unreconciled totals.'],
  ]),
  flow('Prepare expenses for your bookkeeper', 'track-numbers', 'Receipts, transaction export, dates, currencies and the category rules your bookkeeper has approved.', 'A categorized expense file, receipt gaps and a reconciliation summary.', 'Source transactions stay intact; unknown categories and potential personal costs are flagged for the bookkeeper.', [
    ['spreadsheet-checker', 'Normalize a separate working copy and apply only the bookkeeper approved category mapping. Retain receipt and transaction IDs; leave unknown categories and tax treatment for the bookkeeper.'],
    ['account-reconciler', 'Match the categorized entries to the transaction export and list unmatched amounts.'],
  ]),
  flow('Explain a department budget overrun', 'track-numbers', 'Approved budget, actual spending, reporting period, currency and known business changes.', 'A reconciled variance report and options for the budget owner.', 'The variance bridges budget to actual; recurring drivers and one-off timing differences stay separate.', [
    ['budget-variance-explainer', 'Calculate the change by line and trace the largest movements to supplied evidence.'],
    ['department-budget-planner', 'Prepare revised scenarios using explicit assumptions and the owner constraints.'],
    ['stakeholder-update-writer', 'Draft a decision update with the variance, choices, consequences and facts still missing.'],
  ]),
  flow('Prepare a seasonal cash buffer', 'track-numbers', 'Cash balance, dated inflows and bills, seasonal patterns and a minimum buffer chosen by the owner.', 'A dated cash forecast, downside case and actions for review.', 'Opening cash plus flows reconciles to closing cash; uncertain receipts remain assumptions.', [
    ['budget-and-forecast-builder', 'Use its cash timing and scenario methods to map dated receipts and payments. Label base and downside assumptions and show opening cash plus flows without claiming a statistical confidence band.'],
    ['spreadsheet-checker', 'Reconcile forecast cash to opening cash and dated flows, check scenario formulas and state which future receipts remain assumptions.'],
    ['department-budget-planner', 'Draft budget responses aligned to the cash forecast and owner limits, distinguishing payment timing from true cost reductions.'],
  ]),
  flow('Find duplicate and unused business subscriptions', 'track-numbers', 'A software bill export, owners, usage evidence, renewal dates and current contracts.', 'A subscription register, savings scenarios and a renewal action list.', 'Cancellation savings respect notice periods and overlap; missing usage is not proof a tool is unused.', [
    ['spend-savings-finder', 'Identify duplicate spend and possible unused services using the supplied usage evidence.'],
    ['vendor-agreement-status-checker', 'Check contract terms and create dated renewal decisions for the supported candidates.'],
    ['vendor-comparison-writer', 'Compare keep, consolidate and replace options with migration effort and recurring cost.'],
  ]),
  flow('Compare supplier prices on the same basis', 'plan-supply-chain', 'Physical-product supplier quotes, planned retail price, stock cash limit, quantities, currency, delivery terms, quality evidence and payment schedules.', 'A normalized quote table and a decision brief with cost and delivery risks.', 'Quantities, units, currency and delivery scope agree; missing charges remain visible.', [
    ['supplier-quote-comparer', 'Compare the normalized quotes and flag exclusions, lead time and payment differences.'],
    ['supplier-risk-scorecard-builder', 'Use only supplied financial, quality, capacity and delivery evidence to assess risk. Do not turn sample risk weights, stock buffers or example cost-reduction rates into the buyer facts.'],
  ]),
  flow('Prepare your first freelance project quote', 'set-prices', 'Website project scope, deliverables, revision limits, estimated effort, costs and your payment terms.', 'A scoped proposal draft, price assumptions and a contract review list.', 'Deliverables and exclusions are explicit; taxes and legal terms remain for qualified review.', [
    ['web-project-scoper', 'Turn the request into bounded deliverables, dependencies, exclusions and acceptance criteria.'],
    ['contract-and-proposal-drafter', 'Draft a proposal from the agreed scope and supplied price assumptions without inventing commitments.'],
    ['contract-risk-reviewer', 'Flag unclear acceptance, payment, ownership and revision terms for the appropriate reviewer.'],
  ]),
  flow('Trace why work keeps missing deadlines', 'organise-work', 'Repeated workflow records with stage owners, active and queue time, rework, observed timing ranges, original estimates and team capacity.', 'A delay map, evidence-backed cause hypotheses and a small improvement test.', 'The analysis uses comparable repeated work and separates waiting time from active work; missing stage timing leads to an instrumentation plan.', [
    ['process-bottleneck-finder', 'Map where the supplied work waited and which dependencies repeatedly delayed completion.'],
    ['outside-view-timeline-estimator', 'Compare estimates with similar completed work and show the range and sample limits.'],
    ['change-rollout-planner', 'Plan adoption of one bounded process change with an owner, measured baseline, review date and success check.'],
  ]),
  flow('Build a backup recovery rehearsal', 'organise-work', 'Critical files and systems, current backup evidence, recovery targets and an approved test environment.', 'A recovery plan, rehearsal checklist and evidence log template.', 'A backup is called recoverable only after a restore check; tests avoid production data changes.', [
    ['backup-and-recovery-planner', 'Map what must be restored, dependencies, responsible people and the stated recovery targets.'],
    ['incident-runbook-writer', 'Write a safe restore rehearsal with prerequisites, stop points and rollback steps.'],
    ['executive-action-register', 'Track the rehearsal tasks, evidence to collect, owners and unresolved recovery gaps.'],
  ]),
  flow('Make a recurring process easier to hand over', 'document-work', 'A recent real process run, current instructions, exceptions, tools and intended replacement owner.', 'An evidence-based procedure, exception guide and handover checklist.', 'A newcomer can locate inputs, do each step and know when to stop or escalate.', [
    ['process-and-sop-writer', 'Write the procedure with inputs, checks, exceptions and the final definition of done.'],
    ['handover-note-writer', 'Prepare the current-state handover and list the practice tasks the replacement should complete.'],
  ]),
  flow('Check capacity before promising a delivery date', 'organise-work', 'Committed work, effort ranges, available hours, dependencies and the proposed new request.', 'A capacity view, delivery options and a draft commitment to review.', 'Existing commitments remain counted; effort uncertainty and dependency dates are explicit.', [
    ['team-capacity-planner', 'Calculate available capacity from actual staffing and commitments in the requested window.'],
    ['project-risk-portfolio', 'Compare the new work with existing priorities and flag shared dependencies and schedule risks.'],
    ['stakeholder-update-writer', 'Draft feasible timing options and explain the trade-offs before anyone promises a date.'],
  ]),
  flow('Prepare a clear client project kickoff', 'organise-work', 'Approved website or creative design scope, participants, decision owner, meeting duration, cost assumptions, milestones and open questions.', 'A kickoff brief, meeting agenda and action register.', 'Success criteria, responsibilities and change handling are stated; open decisions have owners.', [
    ['project-kickoff-brief-writer', 'Summarize scope, outcomes, responsibilities, milestones and unresolved assumptions.'],
    ['meeting-agenda-and-cost-planner', 'Run its ASYNC, NOT-READY or MEET gate. Use supplied attendee, duration and cost assumptions; only a MEET result gets an agenda with the required action recap.'],
    ['executive-action-register', 'Convert confirmed commitments into a sourced action list; keep proposed owners unconfirmed.'],
  ]),
  flow('Turn an incident into a safer procedure', 'organise-work', 'An incident timeline, logs or notes, existing procedure and confirmed recovery actions.', 'A learning report, updated procedure draft and follow-up register.', 'Causes remain hypotheses where evidence is weak; prevention work links to an observed failure.', [
    ['incident-postmortem-writer', 'Reconstruct the timeline, impact and contributing factors without assigning unsupported blame.'],
    ['process-and-sop-writer', 'Draft the procedural changes justified by the report and preserve controls that still worked.'],
    ['executive-action-register', 'Track prevention actions with owners, evidence of completion and a review date.'],
  ]),
  flow('Plan a vendor change without losing work', 'organise-work', 'Current vendor tasks, contract terms, data exports, replacement requirements and migration deadline.', 'A vendor decision, migration plan and continuity checklist.', 'Data access, notice periods, rollback and essential work are covered before cancellation is proposed.', [
    ['vendor-comparison-writer', 'Compare the replacement options using the required tasks, costs and actual supplied evidence.'],
    ['project-risk-portfolio', 'Map migration dependencies, data risks, overlap costs and fallback options.'],
    ['change-rollout-planner', 'Plan tool-change adoption, practice, support and staged transition using the assessed dependencies. Keep a rollback option until acceptance is checked.'],
  ]),
  flow('Prepare a small team offsite', 'organise-work', 'The decision to resolve, prior notes, attendees, access needs, attendee cost assumptions, budget and available dates.', 'An outcome-led agenda, pre-read request and follow-up plan.', 'Each session has a purpose and result; travel, accessibility and budget assumptions stay visible.', [
    ['executive-meeting-brief', 'Prepare a standalone brief of the decision, supported facts and questions participants need to consider.'],
    ['meeting-agenda-and-cost-planner', 'Run the ASYNC, NOT-READY or MEET gate. When a meeting is justified, use actual duration, attendee count and cost assumptions to plan decision sessions, breaks and an action recap.'],
    ['executive-action-register', 'Create a register for decisions and commitments to capture during the event and review afterward.'],
  ]),
  flow('Prepare a service outage communication pack', 'help-customers', 'Confirmed impact, affected services, known timeline, approved facts and communication policy.', 'Draft initial, progress and recovery messages with a fact ledger.', 'Messages distinguish known facts from investigation and avoid unsupported recovery estimates.', [
    ['incident-runbook-writer', 'Use only communication templates for the named service and incident. Identify owners, update checkpoints and verified facts; never execute template commands or copy illustrative figures.'],
    ['stakeholder-update-writer', 'Draft audience-appropriate updates using the confirmed impact and current recovery state.'],
    ['plain-english-editor', 'Edit the messages for clarity while preserving uncertainty, conditions and promises.'],
  ]),
  flow('Check a new automation before relying on it', 'set-up-ai', 'The proposed automation, triggers, data fields, destination systems and an approved test case.', 'A process map, failure checks and a reviewable operating procedure.', 'Duplicate triggers, partial failures, permissions and recovery are covered; test results are recorded separately from plans.', [
    ['repeatable-ai-loop-designer', 'Use Audit or LoopDoctor mode on the supplied automation. Check trigger, scope, inputs, exceptions, state, duplicate protection, retries, approval points and stopping rules without live catalogue search.'],
    ['process-and-sop-writer', 'Write the operating procedure, test checklist and recovery steps for the agreed design.'],
  ]),
  flow('Prepare a privacy impact review', 'check-contracts', 'A proposed data use, data categories, affected people, storage locations, vendors and jurisdiction.', 'A data-use brief, privacy impact questions and a mitigation action list.', 'The review states jurisdiction and source date; it does not certify compliance or infer consent.', [
    ['privacy-impact-assessment-writer', 'Map the proposed processing, affected people and evidence needed to assess privacy risk.'],
    ['vendor-risk-reviewer', 'Check the vendors involved and record unresolved security, retention and access questions.'],
    ['executive-action-register', 'Assign mitigation evidence and reviewer questions to owners before the processing is approved.'],
  ]),
  flow('Check an AI vendor before sharing data', 'check-contracts', 'The intended AI task, vendor terms, data categories, retention settings and organizational policy.', 'A terms review, data-sharing risks and approval questions.', 'Terms are dated; training use, deletion, subprocessors and permitted data are supported by evidence or left unknown.', [
    ['ai-vendor-terms-checker', 'Review the supplied terms for the exact service and account tier proposed.'],
    ['privacy-impact-assessment-writer', 'Assess the planned data flow using those terms and minimize the data needed for the task.'],
    ['team-ai-use-policy-drafter', 'Draft task-specific guardrails and a reviewer checklist without claiming they are an adopted policy.'],
  ]),
  flow('Prepare evidence for a compliance review', 'check-contracts', 'The review scope, applicable framework supplied by your reviewer, controls and existing evidence.', 'An evidence index, gap list and owner-based preparation plan.', 'Every claim links to dated evidence; missing evidence is a gap, and readiness is never called certification.', [
    ['compliance-checklist', 'Turn the supplied review scope into control questions and required evidence.'],
    ['spreadsheet-checker', 'Build a reviewable evidence register from the checklist and source records; verify IDs, scope, evidence dates and gaps without treating a populated cell as proof of compliance.'],
    ['executive-action-register', 'Create an evidence-gathering plan with owners, due dates and dependencies.'],
  ]),
  flow('Check policy wording against real data use', 'check-contracts', 'Current privacy notice, actual data flows, vendor list, retention rules and applicable jurisdictions.', 'A clause-to-practice map, unsupported statements and proposed correction questions.', 'Each drift finding cites both the notice and observed practice; legal wording remains a proposal for review.', [
    ['privacy-policy-drift-checker', 'Compare policy claims with supplied implementation and data-use evidence.'],
    ['privacy-policy-drafter', 'Prepare proposed corrections to the affected clauses, preserving unresolved legal questions.'],
    ['plain-words-contract-summary', 'Explain the proposed changes and their practical implications for the policy owner.'],
  ]),
  flow('Prepare a contract amendment for review', 'check-contracts', 'The signed agreement, proposed amendments, business goal, jurisdiction and version history.', 'A change trace, issue list and plain summary for your legal reviewer.', 'Original and proposed language stay distinguishable; commercial intent is not mistaken for accepted terms.', [
    ['contract-risk-reviewer', 'Review the base and proposed wording separately, pair changed clauses by source and version, and assess their obligations, dates, payment, liability and dependencies. Proposed wording never becomes the controlling agreement.'],
    ['plain-words-contract-summary', 'Summarize each version with its party duties and source sections, then explain the proposed differences and unresolved approval questions.'],
  ]),
  flow('Prepare a vendor security questionnaire response', 'check-contracts', 'The customer questionnaire, approved controls, current policies and permitted supporting evidence.', 'A sourced response draft, evidence index and unanswered questions.', 'Every yes has evidence; planned controls are labeled planned and private security details stay restricted.', [
    ['compliance-checklist', 'Map the questionnaire to the evidence needed for each claim and define the response scope.'],
    ['spreadsheet-checker', 'Build a question-to-evidence table and check that each proposed yes has a dated source, correct scope and a visible gap when evidence is absent.'],
    ['plain-english-editor', 'Draft clear responses from verified facts, preserving gaps and review restrictions.'],
  ]),
  flow('Review employee data access before a change', 'check-contracts', 'Proposed HR system or process changes, data categories, role access, retention and local policy.', 'An access and privacy issue list with a restricted action plan.', 'Access needs follow job tasks; sensitive data and retention claims are supported by policy and evidence.', [
    ['employee-data-privacy-checker', 'Review the changed data flow and access scope without copying unnecessary employee records.'],
    ['people-risk-register-builder', 'Map supported privacy and operational risks to practical mitigations and responsible roles.'],
    ['executive-action-register', 'Prepare restricted reviewer actions and evidence requirements before access changes are made.'],
  ]),
  flow('Prepare a contract renewal negotiation', 'check-contracts', 'The current agreement, notice deadline, actual usage, performance issues and renewal quote.', 'A renewal deadline plan, risk summary and negotiation brief.', 'Notice terms are quoted accurately; price comparisons use the same scope and term.', [
    ['vendor-agreement-status-checker', 'Confirm renewal and notice dates and list what must be decided before each deadline.'],
    ['contract-risk-reviewer', 'Review the commercial and operational effect of renewal, termination and proposed changes.'],
    ['vendor-comparison-writer', 'Prepare keep, renegotiate and replace options with explicit costs and open questions.'],
  ]),
  flow('Tailor a job application to real evidence', 'find-a-job', 'The job description, your resume, real work examples and application requirements.', 'An evidence-based resume draft, application answers and a final check.', 'Every achievement is supported by your record; no experience, credential or metric is invented.', [
    ['resume-job-application-builder', 'Match the role requirements to actual experience and draft the requested application materials.'],
    ['plain-english-editor', 'Make the writing specific and easy to scan while preserving the evidence and your voice.'],
    ['proofreader', 'Check names, dates, consistency, requested format and any remaining unsupported claims.'],
  ]),
  flow('Prepare work examples for a job interview', 'find-a-job', 'The role description, interview format and your own documented work examples.', 'A role evidence map, concise example answers and practice questions.', 'Examples describe your actual contribution and outcomes; practice questions are not claims about the employer.', [
    ['role-skills-framework-builder', 'Translate the role requirements into observable skills the interview may examine.'],
    ['resume-job-application-builder', 'Select genuine work examples for those skills and identify gaps honestly.'],
    ['interview-question-set-maker', 'Create role-related practice questions and strong-answer indicators; label them sample questions rather than predictions of the employer interview.'],
  ]),
  flow('Make a realistic plan for a busy week', 'organise-work', 'Last week actual calendar or activity log, upcoming commitments, fixed events, effort estimates and top priorities.', 'A capacity-aware week plan with trade-offs and a review point.', 'Scheduled work fits available hours and contains room for uncertainty; proposed cuts stay explicit.', [
    ['weekly-time-audit-planner', 'Audit last week actual time as evidence for realistic capacity, then compare it with the upcoming fixed commitments.'],
    ['week-priority-picker', 'Choose the work that best serves the stated goals and identify what must wait.'],
    ['executive-daily-digest', 'Turn the chosen commitments into a dated brief and a manageable first day.'],
  ]),
  flow('Turn saved reading into notes you can use', 'study-and-practice', 'Articles or book excerpts you can share, existing notes and a question you want to answer.', 'Linked notes, a sourced answer and a small recall exercise.', 'Sources and your interpretations stay separate; quotations remain brief and attributable.', [
    ['source-note-summariser', 'Extract claims, evidence, gaps and source locations relevant to the supplied question, separating the source from your interpretation.'],
    ['notes-wiki-builder', 'Prepare linked note files or use an explicitly approved local notes folder. Connect genuine overlaps without erasing disagreements and do not silently persist private memory.'],
    ['recall-first-study-tutor', 'Prepare recall prompts and require actual learner attempts and confidence before assessing understanding. Leave the check unrun when the learner has not answered.'],
  ]),
  flow('Build a habit around a real constraint', 'organise-work', 'The behavior you want, your routine, obstacles and an example of when the plan failed.', 'A small habit plan, fallback action and review questions.', 'The cue and action are observable; the fallback fits a difficult day and claims no guaranteed outcome.', [
    ['habit-plan-builder', 'Define a small behavior and the real cue and constraints around it.'],
    ['week-priority-picker', 'Place the small action and fallback into the real available week without displacing protected commitments. Keep actual completion for a later review rather than inventing results.'],
  ]),
  flow('Plan a purchase around your real budget', 'money-and-investing', 'Your budget, purchase purpose, comparable quotes, ongoing costs, timing constraints and an existing ordered decision checklist with stop rules.', 'A total-cost comparison and a decision brief that respects your cash limit.', 'Recurring charges, replacement needs and uncertainty are shown; affordability follows your supplied cash limits.', [
    ['personal-budget-builder', 'Find the amount available for the purchase without changing protected commitments.'],
    ['vendor-comparison-writer', 'Compare the options on required use, full quoted cost and practical trade-offs.'],
    ['decision-checklist-runner', 'Check the proposed purchase against the user supplied budget, must-have requirements and decision rules, marking unknown answers.'],
  ]),
  flow('Choose a study plan you can keep', 'study-and-practice', 'Your learning goal, exam or deadline, current level, available hours and practice material.', 'A study roadmap, weekly sessions and a recall check.', 'Sessions fit available time and check understanding through retrieval rather than rereading alone.', [
    ['topic-learning-roadmap', 'Map the topic boundaries, prerequisites, deadline, current gaps and available hours without assuming a score improvement.'],
    ['study-strategy-picker', 'Choose suitable practice methods for the topics and available materials.'],
    ['study-session-planner-and-review', 'Prepare opening, middle and closing review prompts for the planned sessions. Run them only with learner responses and mark unrun phases not yet observed.'],
  ]),
  flow('Plan a difficult feedback conversation', 'think-and-decide', 'One observed behavior, its effects, supporting facts, relationship, desired change and boundaries.', 'A feedback conversation plan, opening lines and listening prompts.', 'The plan separates facts from interpretations and leaves room for the other person to disagree.', [
    ['feedback-conversation-planner', 'Clarify the specific behavior or issue and the outcome you want from the conversation.'],
    ['hard-feedback-message-writer', 'Draft a direct opening grounded in evidence and a clear, fair request.'],
    ['plain-english-editor', 'Edit the opening and listening prompts for clarity, preserving supported observations and room for the other person to disagree.'],
  ]),
  flow('Help learners spot weak online evidence', 'teach-and-train', 'A topic, learner level, candidate sources and the learning objective.', 'A source-checking activity, discussion prompts and an assessment task.', 'Students must explain source quality and corroboration rather than repeat an answer key.', [
    ['online-source-check-lesson', 'Build an activity that checks authorship, evidence and corroboration using the supplied sources.'],
    ['media-literacy-lesson-builder', 'Add examples of framing and missing context without assuming bad intent.'],
    ['marking-rubric-writer', 'Define clear criteria for the reasoning students should demonstrate.'],
  ]),
  flow('Adapt a lesson for different access needs', 'teach-and-train', 'The lesson objective, activities, materials and access needs shared by the teacher.', 'A barrier review, adapted activities and a check of the unchanged learning goal.', 'Adaptations preserve the target learning and do not infer diagnoses or lower expectations without evidence.', [
    ['accessible-lesson-auditor', 'Identify barriers in the supplied materials and tasks using the stated access needs.'],
    ['learning-options-designer', 'Offer different ways to access, practice and demonstrate the same learning.'],
    ['lesson-understanding-check', 'Create checks that measure the learning goal without the identified access barrier.'],
  ]),
  flow('Turn a worked example into independent practice', 'teach-and-train', 'A correct worked example, learner prerequisites, target skill and common mistakes.', 'A staged practice sequence and a short understanding check.', 'Support decreases deliberately and the final task requires independent use of the target skill.', [
    ['worked-example-practice', 'Break the example into explanation, partially completed practice and independent work.'],
    ['practice-problem-set-writer', 'Create comparable problems and validate their answers and difficulty against the target skill.'],
    ['study-understanding-check', 'Check the reasoning behind answers and use errors to choose the next practice.'],
  ]),
  flow('Prepare feedback students can act on', 'teach-and-train', 'The task, rubric, anonymized student work, existing teacher feedback drafts and the feedback rules you use.', 'Criterion-linked feedback, a revision task and a teacher review list.', 'Feedback cites the work and rubric; grades stay provisional until a teacher checks them.', [
    ['single-point-rubric-builder', 'Clarify the target standard and observable evidence for the supplied task.'],
    ['written-feedback-checker', 'Check whether the draft feedback is specific, accurate and useful for the next revision.'],
    ['practice-problem-set-writer', 'Create a short, checked revision task targeting the specific gap identified in the feedback.'],
  ]),
  flow('Build a community project with clear learning', 'teach-and-train', 'A local problem, learner age, community constraints, permissions and the curriculum goal.', 'A project brief, learning sequence and evidence collection plan.', 'Community contact and field work remain subject to teacher approval; learning and public impact are assessed separately.', [
    ['community-project-unit-planner', 'Frame an appropriate local problem and the learning students should demonstrate.'],
    ['project-based-unit-brief-writer', 'Define deliverables, roles, milestones and realistic assessment criteria.'],
    ['learning-documentation-planner', 'Plan observations of learner decisions for teacher planning. Keep this documentation distinct from the separate curriculum assessment.'],
  ]),
  flow('Check a lesson before teaching it', 'teach-and-train', 'The lesson plan, learner prerequisites, available time and intended learning outcome.', 'A lesson review, revised sequence and short checks of understanding.', 'The lesson fits the time and avoids adding activities that do not support the learning goal.', [
    ['overloaded-lesson-checker', 'Find avoidable load, missing prerequisites and activities that compete with the central goal.'],
    ['lesson-barrier-spotter', 'Identify task and language barriers using the actual learner context.'],
    ['lesson-understanding-check', 'Insert brief checks where their answers would change what the teacher does next.'],
  ]),
  flow('Plan a peer feedback session that helps', 'teach-and-train', 'Creative writing drafts, task criteria, reviewers, group size, session time and feedback experience; actual comments when available.', 'A session guide, feedback prompts and a revision record.', 'Peers comment on the work against criteria and each learner chooses a justified next revision; unheld sessions have no invented feedback.', [
    ['peer-feedback-session-planner', 'Plan a structured exchange with clear roles, time limits and boundaries.'],
    ['honest-draft-feedback-giver', 'Model specific, evidence-based feedback on a permitted example.'],
    ['reader-feedback-sorter', 'Only after real comments arrive, sort them into corrections, choices and questions. Before that, prepare the collection template and mark the sorting step not run.'],
  ]),
  flow('Build a practice plan from common mistakes', 'study-and-practice', 'Recent anonymized answers, correct solutions, target concepts and available practice time.', 'An error map, focused practice and a later recall check.', 'Mistakes are tied to evidence rather than learner labels; new problems have checked solutions.', [
    ['study-understanding-check', 'Separate slips, missing prerequisites and misunderstood concepts using the actual answers.'],
    ['flawed-example-writer', 'Start from a verified correct example, introduce exactly one realistic target error and keep the teacher key separate from the learner task.'],
    ['mixed-practice-unit-planner', 'Use the prior taught topic and prerequisite order to mix corrected practice with earlier topics, then define a later retention check.'],
  ]),
  flow('Prepare a webinar people can follow', 'speak-and-persuade', 'The audience problem, supported claims, speaker notes, duration and intended next action.', 'A webinar outline, slide brief and promotion draft.', 'The session teaches the promised outcome; dates, claims and next steps match across materials.', [
    ['presentation-builder', 'Build a clear teaching sequence with examples and an audience-appropriate level of detail.'],
    ['editable-slide-deck-builder', 'Use the user-approved outline as the custom narrative framework, or ask when it is not approved. Build editable slides and notes in an approved environment and inspect every rendered slide; mark visual checks pending without a renderer.'],
    ['webinar-promotion-planner', 'Draft promotion that describes the real session and confirmed participation details.'],
  ]),
  flow('Turn a customer interview into a case outline', 'write-and-tell-stories', 'Consented interview material, approved customer facts, results evidence and publication permissions.', 'A sourced case outline, evidence gaps and a customer approval checklist.', 'Results state period and basis; quotations and identifying details need the customer approval before publication.', [
    ['customer-interview-synthesizer', 'Separate the problem, actions and observed outcomes while preserving source references. One interview is one case, not evidence of a repeated customer pattern.'],
    ['case-first-story-builder', 'Build the case around the actual decision and change, marking unsupported outcomes.'],
    ['draft-proofreader', 'Edit the outline wording without inventing a finished case study. Preserve source locators and the separate factual and consent checks in the hand-back acceptance rules.'],
  ]),
  flow('Plan an event follow up that earns a reply', 'write-emails', 'Consented attendee notes, promises made, recipient preferences and the actual event context.', 'Segmented follow-up drafts with sources and pending commitments.', 'Contact permissions and promises are explicit; attendance is not treated as permission for unrelated marketing.', [
    ['event-marketing-planner', 'Group follow-up needs around the actual event goal and what attendees requested.'],
    ['executive-action-register', 'Extract promised resources, introductions and follow-up actions with source evidence.'],
    ['executive-due-task-drafts', 'Prepare relevant drafts for each supported commitment without sending them.'],
  ]),
  flow('Make a research report easier to share', 'work-with-files', 'A completed report, its source material, target audience and allowed publication scope.', 'An executive summary, slide brief and fact-check list.', 'The short formats preserve qualifications, periods and source attribution from the report.', [
    ['plain-english-editor', 'Edit the report for the intended reader while retaining uncertainty and material caveats.'],
    ['presentation-builder', 'Turn the supported findings into a decision-focused slide outline.'],
    ['proofreader', 'Check that figures, source references and conclusions agree across the report and slides.'],
  ]),
  flow('Prepare a useful customer newsletter issue', 'write-emails', 'Your online store customer question, approved product news, source links, mailing rules, buyer brief and actual brand voice examples.', 'A sourced newsletter draft, subject options and a review checklist.', 'Each item helps the intended reader; offers, dates and claims match the supplied source.', [
    ['feedback-theme-finder', 'Find a useful customer question in the provided feedback and preserve the sample limits. A small or single-customer sample does not establish a wider trend.'],
    ['campaign-email-writer', 'Use value-email mode to draft one core message around the customer question and approved store news, with subject, preview and plain-text versions. Do not invent an offer or send a test.'],
    ['brand-voice-editor', 'Edit the draft to the supplied voice without adding facts, offers or promises.'],
  ]),
  flow('Prepare a partner launch announcement pack', 'write-emails', 'Agreed partnership facts, each party approved messaging and voice examples, dates, audiences and distribution permissions.', 'A shared message brief, announcement drafts and an approval tracker.', 'Both parties claims and brand use are sourced; a draft remains unpublished until the named owners approve.', [
    ['stakeholder-map-builder', 'Map the audiences and the people who must check the announcement.'],
    ['stakeholder-update-writer', 'Draft the core announcement and audience variants using the agreed facts.'],
    ['brand-voice-editor', 'Check each version against the appropriate voice while keeping joint claims consistent.'],
  ]),
  flow('Check a marketing survey before sending it', 'understand-customers', 'The decision to inform, draft questions, intended respondents and recruitment plan.', 'A revised survey, bias review and analysis plan.', 'Questions avoid leading wording; sampling limits and consent are explicit before distribution.', [
    ['market-size-and-survey-planner', 'Check whether the questions and sample can answer the actual business decision.'],
    ['interview-and-research-planner', 'Plan qualitative wording and cognitive pretests with appropriate respondents. Keep statistical sample design and quantitative analysis with the earlier survey method.'],
  ]),
  flow('Build a clear sponsorship decision brief', 'plan-strategy', 'A sponsorship proposal, audience evidence, quoted costs, deliverables, goal and an existing ordered decision checklist with stop rules.', 'An audience fit review, cost comparison and a bounded pilot recommendation.', 'Reach is not treated as sales; the pilot states tracking, caps and a decision date.', [
    ['vendor-comparison-writer', 'Normalize the proposal deliverables and costs against available alternatives.'],
    ['event-marketing-planner', 'Use sponsorship evaluation mode to plan a bounded pilot with tracking, caps and a decision date. Label observed responses as observational; do not imply randomized or causal proof.'],
    ['decision-checklist-runner', 'Check the pilot recommendation against the user supplied audience, cost and measurement requirements, marking unknown answers.'],
  ]),
  flow('Turn rough notes into a checked Word handout', 'work-with-files', 'Source notes, the reader, intended action, required format and any approved reference document.', 'An edited handout and a document quality review.', 'Claims trace to the notes; rendered pages have readable tables and no clipped text.', [
    ['plain-english-editor', 'Organize the notes around what the reader needs to understand or do.'],
    ['document-file-generator', 'Create a new Word handout using the approved content and reference style; preserve the source notes.'],
    ['libreoffice-document-builder', 'Use the installed converter to export the actual Word handout to a new PDF review copy. Check the conversion result without overwriting the Word source.'],
    ['pdf-maker-and-reader', 'Render and inspect every page of the converted review PDF, checking for missing text, tables, fonts and clipping; keep the actual Word and PDF linked by source version.'],
  ]),
  flow('Extract a scanned document and verify key facts', 'work-with-files', 'The scanned file, permission to process it and the exact facts or fields you need.', 'Extracted text, a page-linked fact table and uncertain readings.', 'Names, dates and numbers are checked against visible pages; unreadable text stays uncertain.', [
    ['scanned-pdf-text-reader', 'Extract the relevant text while keeping page references and uncertain readings.'],
    ['pdf-maker-and-reader', 'Inspect the original pages around each important fact rather than trusting extraction alone.'],
    ['spreadsheet-checker', 'Check the field table for missing records, inconsistent formats and arithmetic issues.'],
  ]),
  flow('Check a spreadsheet before sharing the results', 'work-with-files', 'The workbook, raw sources, intended audience and the decisions the results will support.', 'A formula issue list, corrected presentation plan and sharing checklist.', 'Totals reconcile to sources and charts agree with cells; unverified formulas remain flagged.', [
    ['spreadsheet-checker', 'Trace key outputs to inputs and check formulas, ranges, error handling, totals, dates, currencies, duplicates and displayed results.'],
    ['figures-to-plain-pictures-writer', 'Explain the verified findings in plain words with the units, periods and limitations intact.'],
  ]),
  flow('Turn a report into an editable briefing deck', 'work-with-files', 'The source report, verified charts or data, audience, presentation time and reference style.', 'An editable briefing deck and a content and layout check.', 'Slides preserve source meaning and numbers; every rendered slide is inspected before delivery.', [
    ['presentation-builder', 'Choose the decision and supporting evidence the audience needs from the supplied report.'],
    ['proofreader', 'Check the agreed slide text against the report, including numbers, periods, caveats and source references.'],
    ['editable-slide-deck-builder', 'Use the user-approved outline as the custom narrative framework, or ask when it is not approved. Build editable slides and notes in an approved environment and inspect every rendered slide; mark visual checks pending without a renderer.'],
  ]),
];

export const deferred = [
  { slug: 'build-a-habit-around-a-real-constraint', reason: 'The existing habit-plan-builder already supplies cue, friction, fallback, tracking and restart. Adding unrelated student or weekly planning components reduced usefulness.' },
  { slug: 'prepare-a-privacy-impact-review', reason: 'The source method requires private legal-practice configuration and a house PIA seed that this portable pack cannot supply.' },
  { slug: 'check-an-ai-vendor-before-sharing-data', reason: 'The source AI policy and impact methods require private governance and legal-practice configuration; retain for a future properly scoped expert pack.' },
  { slug: 'check-policy-wording-against-real-data-use', reason: 'The source drift method relies on a saved private PIA and policy-monitoring workspace; not a portable everyday workflow yet.' },
];
export const workflows = candidateWorkflows.filter(x => !deferred.some(d => d.slug === x.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')));

export const agents = [
  { name: 'Monthly subscription renewal decision assistant', job: 'track-numbers', need: 'Subscription bills, usage evidence, contract dates and the prior renewal register.', deliverable: 'A changed-only renewal brief with notice deadlines, options and proposed owner actions.', acceptance: 'Dates and savings respect contract terms; missing usage never means unused.', schedule: 'Monthly, or when a dated renewal notice arrives; configure a schedule separately if requested.', workflow: 'find-duplicate-and-unused-business-subscriptions', trigger: 'A renewal enters the owner chosen decision window, a quote changes or usage materially changes.', branch: 'Run the renewal workflow for affected subscriptions. If notice terms or usage are missing, run vendor-agreement-status-checker and produce evidence requests before recommending cancellation.', extra: 'vendor-agreement-status-checker', memory: 'subscription ID, term, notice date, owner, usage evidence date, decision and source references' },
  { name: 'Weekly team coverage review assistant', job: 'organise-work', need: 'Upcoming absences, critical commitments, approved cover and the last coverage review.', deliverable: 'A coverage change brief, uncovered commitments and draft handovers.', acceptance: 'Owners and available hours use current evidence; proposed cover is never described as accepted.', schedule: 'Weekly when the team provides updated commitments and absence information.', workflow: 'prepare-a-team-absence-handover', trigger: 'An absence, delivery date or available cover changes for a critical commitment.', branch: 'Run the coverage workflow for the changed window. If capacity is short, run team-capacity-planner and present defer, reduce or add-cover options for the manager.', extra: 'team-capacity-planner', memory: 'commitment ID, absence window, cover owner, acceptance state, next review and source date' },
  { name: 'Employee feedback action review assistant', job: 'lead-people', need: 'Anonymized feedback, the agreed action register and evidence of progress since the last review.', deliverable: 'A progress brief, new themes and proposed updates to the employee response.', acceptance: 'Small-group anonymity is preserved and status changes require evidence.', schedule: 'At the agreed review dates after an employee listening exercise.', workflow: 'turn-employee-feedback-into-owned-actions', trigger: 'New anonymized feedback arrives or an agreed action is overdue or blocked.', branch: 'Run the listening workflow for new themes. For existing actions, use executive-action-register to compare evidence with the agreed commitments and draft only the changed update.', extra: 'executive-action-register', memory: 'theme ID without identifying quotations, action ID, owner, deadline, evidence status and last review date' },
  { name: 'Design handoff completeness assistant', job: 'design-work', need: 'A changed component brief, system rules, implementation questions and the last approved handoff.', deliverable: 'A handoff change list, missing states and an implementation review request.', acceptance: 'Only the changed component is reviewed; states and tokens map to the current system.', schedule: 'When a component is proposed for implementation or its design changes.', workflow: 'give-developers-a-complete-component-brief', trigger: 'The component adds a variant, changes behavior or receives an implementation question.', branch: 'Run the component handoff workflow. If required states or accessibility behavior are missing, run screen-states-designer again; allow at most two correction passes, then list unresolved blockers.', extra: 'screen-states-designer', memory: 'component ID, design version, approved variants, state coverage, token version and unresolved questions' },
  { name: 'Recovery rehearsal evidence assistant', job: 'organise-work', need: 'Approved recovery targets, rehearsal records, system changes and the last recovery plan.', deliverable: 'A recovery evidence review, changed rehearsal plan and open remediation actions.', acceptance: 'Recovery is supported by restore evidence; unknown results stay unknown.', schedule: 'At the owner agreed rehearsal interval and after significant system changes.', workflow: 'build-a-backup-recovery-rehearsal', trigger: 'A restore test is due, its evidence is missing or the protected system changed.', branch: 'Run the rehearsal planning workflow when due or changed. If test evidence exists, run incident-postmortem-writer on failed or missed targets and prepare remediation owners; never execute a restore without the approved test scope.', extra: 'incident-postmortem-writer', memory: 'system ID, plan version, last restore date, actual result, evidence reference and next review date' },
  { name: 'Weekly project delay evidence assistant', job: 'organise-work', need: 'Dated task updates, original estimates, actual completions and the current improvement experiment.', deliverable: 'A delay trend brief and a recommendation to keep, revise or stop the current experiment.', acceptance: 'Comparable work uses the same definitions; a small sample does not prove a cause.', schedule: 'Weekly while a deadline improvement experiment is active.', workflow: 'trace-why-work-keeps-missing-deadlines', trigger: 'New completions arrive or the experiment reaches its agreed review date.', branch: 'Compare new waiting and active time with the saved baseline. Run the delay workflow only for new patterns; use project-risk-portfolio if shared dependencies moved. Keep the current test unchanged while evidence is too thin.', extra: 'project-risk-portfolio', memory: 'task cohort, baseline definition, sample size, change tested, review date and evidence links' },
  { name: 'Job application evidence review assistant', job: 'find-a-job', need: 'The target role, current application draft, your verified work record and prior corrections.', deliverable: 'A tailored application draft, unsupported claim list and submission checklist.', acceptance: 'Every claim maps to your real record and employer-specific details come from supplied sources.', schedule: 'For each new role or material application revision.', workflow: 'tailor-a-job-application-to-real-evidence', trigger: 'A new role is supplied or the resume draft changes.', branch: 'Run the application workflow. If an assertion lacks support, ask for the actual evidence or remove it; use proofreader for at most two revision passes, then list any remaining issues. Never submit the application from this review alone.', extra: 'proofreader', memory: 'role ID, job source date, draft version, evidence references and unresolved claims; exclude unnecessary personal data' },
  { name: 'Study plan progress review assistant', job: 'study-and-practice', need: 'Learning goals, available time, completed sessions, practice results and the prior study plan.', deliverable: 'A progress review, adjusted practice plan and the next understanding check.', acceptance: 'Plan changes follow observed errors and available time; confidence is not treated as mastery.', schedule: 'Weekly or at the learner agreed checkpoint.', workflow: 'choose-a-study-plan-you-can-keep', trigger: 'A checkpoint arrives, practice reveals a new gap or available time changes.', branch: 'Use study-understanding-check on the learner actual recent answers. When the learner is absent, review only supplied answers and prepare an unrun next check; never invent responses or mastery. Keep successful parts of the plan; rerun the study planning workflow only for missed prerequisites, persistent errors or changed time. Mark the review incomplete if no practice evidence is available.', extra: 'study-understanding-check', memory: 'learning goal, topic, practice date, observed errors, planned next check and source material references' },
  { name: 'Compliance evidence request assistant', job: 'check-contracts', need: 'An owner-approved review scope, control evidence index, due dates and the prior gap register.', deliverable: 'A changed evidence gap list and proposed requests for the responsible owners.', acceptance: 'Evidence is current, scoped and attributable; a closed task alone does not prove a control works.', schedule: 'At agreed preparation checkpoints before a compliance review.', workflow: 'prepare-evidence-for-a-compliance-review', trigger: 'Evidence expires, a review requirement changes or a preparation action becomes due.', branch: 'Check the evidence index against the saved requirements. Run the preparation workflow for changed requirements; use spreadsheet-checker for refreshed evidence. Keep gaps open until supporting evidence is reviewed, and prepare requests without sending them.', extra: 'spreadsheet-checker', memory: 'control ID, evidence reference, scope, checked date, owner, due date and verification state' },
  { name: 'Recurring invoice exception review assistant', job: 'track-numbers', need: 'New invoices, purchase and receipt records, approved vendor data and the prior exception ledger.', deliverable: 'New invoice exceptions, resolved items with evidence and an approval review list.', acceptance: 'Invoice IDs prevent duplicate processing; arithmetic and receipt checks remain separate from payment approval.', schedule: 'When a new invoice batch is supplied or at the owner agreed review interval.', workflow: 'check-supplier-invoices-before-approval', trigger: 'A new invoice ID appears, supporting evidence changes or an unresolved exception reaches its review date.', branch: 'Run the invoice workflow for new or changed records. Use invoice-totals-checker to revisit arithmetic exceptions only. If source records conflict, leave the invoice blocked for the responsible reviewer; never release payment.', extra: 'invoice-totals-checker', memory: 'vendor ID, invoice ID, source hash, amount and currency, exception state, evidence references and review date' },
];
