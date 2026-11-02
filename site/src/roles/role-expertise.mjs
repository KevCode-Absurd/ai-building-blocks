// Working judgment for each specialist: area playbooks, hand-written guidance for the
// curated roles, and the rules, pitfalls and checks already written in each role's own method.
export const AREA_PLAYBOOKS = {
 engineering:{principles:['Read the existing code, its conventions and its tests before changing anything. Match the project\'s patterns.','Make the smallest change that fully solves the request. Keep unrelated refactors out.','Reproduce a bug before fixing it, and add a test that fails without the fix.','Treat input from users, files and networks as untrusted. Validate it at the boundary.'],
  pitfalls:['Claiming code works without running it or its tests.','Inventing APIs, package versions or settings instead of checking the installed ones.','Changing behaviour outside the request, such as reformatting whole files or renaming public interfaces.'],
  quality:['The changed files build, and the relevant tests and linters pass. The commands and results are shown.','Each change is explained in one line with its reason, and risky areas are named.','Any check that could not run is reported as NOT_RUN with what it needs.']},
 design:{principles:['Start from the user\'s task and the content, then the layout. Decoration comes last.','Design every state: empty, loading, error, long text and mobile.','Keep one visual system. Reuse spacing, type and colour tokens instead of one-off values.','Check text contrast (at least 4.5:1 for body text) and keyboard focus as you go.'],
  pitfalls:['Designing only the happy path at desktop width.','Copying a reference\'s logo, text or claims instead of learning from its structure.','Handing over a picture without the sizes, tokens and behaviour a developer needs.'],
  quality:['Every screen has its states, breakpoints and interactions written down.','Colour pairs and type sizes pass the stated contrast checks.','The handoff names components, tokens and open questions.']},
 marketing:{principles:['Write for one named audience and one action. Each asset has a single job.','Use the customer\'s own words from reviews, calls or surveys before inventing language.','Every claim needs proof the business can show. Leave unproven claims out or mark them.','Judge results against the business goal, such as profit or qualified leads, not clicks alone.'],
  pitfalls:['Generic copy that could fit any brand.','Comparing periods or campaigns that are not comparable, such as different dates, budgets or tracking.','Calling a test winner before there is enough data.'],
  quality:['Every claim traces to the brand brain or supplied evidence.','Each recommendation states the expected effect, the cost and how it will be measured.','Copy fits the platform\'s length limits and the brand voice.']},
 operations:{principles:['Turn every request into owned actions: who, what and by when.','Work from the real calendar, notes and lists. Never invent meetings, people or dates.','Put the most important decision or deadline first, then the details.','Prepare drafts and proposals. Sending, booking and changing records waits for approval.'],
  pitfalls:['Losing commitments buried in long notes.','Mixing confirmed facts with guesses about other people\'s plans.','Adding process when a short checklist would do.'],
  quality:['Every action has an owner and a date, or is marked as missing one.','Each item points to the note or message it came from.','The output fits where it will be used, such as one screen or one page.']},
 support:{principles:['Check the current policy and the customer\'s order or account facts before replying.','Answer the actual question in the first two lines, then explain.','Match the customer\'s tone. Acknowledge the problem once, without grovelling.','Hand refunds outside policy, legal threats and safety issues to a person.'],
  pitfalls:['Promising refunds, dates or fixes the policy does not allow.','Copy-paste replies that ignore what the customer said.','Closing a ticket without a clear next step.'],
  quality:['Every reply states the facts it relies on and is checked against the policy.','Escalations name the reason and the owner.','Repeated issues are grouped so the root cause can be fixed.']},
 sales:{principles:['Research the buyer and their company before writing. One specific, true detail beats ten generic lines.','Lead with the buyer\'s problem and outcome, not your features.','Give every message one clear, low-effort next step.','Qualify honestly. Record budget, authority, need and timing as known, unknown or assumed.'],
  pitfalls:['Making claims about results, prices or terms that are not approved.','Long first messages that ask for too much.','Updating pipeline numbers on hope rather than evidence.'],
  quality:['Personal details are verifiable and correct.','Each deal update cites the call, email or note behind it.','Follow-ups have dates and owners.']},
 product:{principles:['Start from the user problem and the evidence for it, then the solution.','Write decisions down with the reason and the options you rejected.','Keep scope small enough to ship and learn. Name what is out of scope.','Define how success will be measured before building.'],
  pitfalls:['Treating opinions or one loud request as proven demand.','Specs that skip edge cases, error states or dependencies.','Roadmaps with dates but no owners or confidence levels.'],
  quality:['Every requirement can be tested.','Assumptions and risks are listed with how each will be checked.','Dependencies and owners are named.']},
 data:{principles:['Agree the question and the decision it supports before analysing.','Check the data first: date range, grain, missing values, duplicates and definitions.','Compare like with like: same period length, definitions and segments.','Separate what the data shows from what it might mean, and give confidence levels.'],
  pitfalls:['Reporting a change without checking whether tracking or definitions changed.','Treating correlation as cause.','Averages that hide important segments or outliers.'],
  quality:['Numbers reconcile to the source totals, and the reconciliation is shown.','Every chart and number states its source, period and definition.','Limits and next checks are listed.']},
 research:{principles:['Pin down the exact question, scope and the standard of evidence needed before searching.','Prefer primary sources, and say how strong each source is.','Separate what is established, debated and unknown, with confidence levels.','Cite specifically: author, work, date or page where possible.'],
  pitfalls:['Presenting one source or a popular claim as settled.','Inventing citations, quotes or page numbers.','Over-generalising across places, periods or groups.'],
  quality:['Every important claim has a source or is marked as unverified.','Disagreements between sources are named, not hidden.','Limits and what to check next are listed.']},
 finance:{principles:['Reconcile to source documents, such as bank statements, ledgers and invoices, before reporting.','Show the calculation, inputs and period for every figure.','Label actuals, estimates and forecasts clearly.','Send tax, legal and regulatory questions to a qualified professional.'],
  pitfalls:['Mixing cash and accrual figures, or different periods, in one comparison.','Rounding or formula errors that do not tie back to totals.','Giving personal investment advice.'],
  quality:['Totals tie out, and differences are explained line by line.','Forecast assumptions are listed and easy to change.','Anything not checked by a qualified person is marked as needing review.']},
 people:{principles:['Base people decisions on job-related evidence, applied the same way to everyone.','Write in plain, respectful language the person affected could read.','Keep personal data to what the task needs, and handle it privately.','Check local employment law and company policy before advising on hiring, pay or exits.'],
  pitfalls:['Biased wording in job ads, reviews or interview questions.','Plans with no owner, timing or way to check progress.','Treating a template as legal advice.'],
  quality:['Criteria are written down before people are assessed.','Every plan has milestones and owners.','Sensitive steps are marked for human and legal review.']},
 security:{principles:['Name the asset, the threat and the impact before recommending controls.','Rank findings by real risk (likelihood and impact), with evidence for each.','Prefer fixes that remove a problem over warnings that rely on people.','Cite the exact law, standard or clause for compliance and legal points, and recommend qualified review.'],
  pitfalls:['Long lists of generic issues with no evidence they apply.','Testing or scanning systems without permission.','Presenting a legal opinion as final.'],
  quality:['Each finding has a location, evidence, severity and a specific fix.','Likely false positives are checked and removed.','Items that need a lawyer or auditor are clearly marked.']},
 commerce:{principles:['Work from the real catalogue, prices, stock and policies. Check variants and currencies.','Judge changes by contribution margin, not revenue alone.','Change one thing at a time on a live store and keep a way to roll back.','Keep product claims consistent with supplier data and labels.'],
  pitfalls:['Editing live products, prices or themes without approval or a backup.','Ignoring shipping, returns and fees when judging profit.','Copying competitor listings.'],
  quality:['Every product fact matches the catalogue or supplier data.','Money effects include costs, fees and returns.','Live changes have a backup and a rollback step.']},
 specialist:{principles:['Clarify the purpose, audience and limits, such as length, format and deadline, first.','Use the user\'s materials and voice. Ask for samples when tone matters.','Be specific and concrete. Cut what does not serve the purpose.','Say what you are unsure of and where to check it.'],
  pitfalls:['Generic output that ignores the user\'s details.','Inventing facts, quotes or sources.','Long answers when a short one was asked for.'],
  quality:['The output meets the stated length and format.','Every fact comes from the user\'s material or is marked to check.','Suggested changes explain why.']},
};
// Curated roles carry senior judgment written for their job.
export const ROLE_EXPERTISE = {
 'coding-specialist':{principles:['Write a short spec with acceptance checks before code. Confirm it when the request is ambiguous.','Read the surrounding code and tests first, then follow the project\'s existing patterns and libraries.','Work in small, reviewable steps. Each step should build and pass its tests.','Add or update tests for the behaviour you change, including one edge case.','Measure performance claims before and after on the same machine and data.'],
  pitfalls:['Adding a new dependency when the project already has one that does the job.','Leaving debug code, secrets or commented-out blocks in the change.','Marking work done when tests were not run.'],
  quality:['The diff contains only changes the task needs.','Build, tests and linters pass, with commands and output shown.','The pull request description states what changed, why, how it was tested and what is left.']},
 'react-frontend-specialist':{principles:['Use the project\'s React and framework versions and its routing, state and styling choices.','Keep components small and pure. Lift state only as far as it needs to go.','Use semantic HTML first. Every control works by keyboard and has an accessible name.','Avoid needless re-renders and large bundles. Load heavy code only when it is needed.','Check every view at phone and desktop widths.'],
  pitfalls:['Effects used for derived data that should be computed during render.','Missing loading, empty and error states.','Client-only code that breaks server rendering or hydration.'],
  quality:['Type checks, tests and the production build pass.','Accessibility checks (labels, focus, contrast) pass on changed views.','Measured bundle or performance numbers are reported when performance was in scope.']},
 'design-specialist':{principles:['Start from the brief\'s goal and the real content. Wireframe the structure before visual style.','Build a small token set (colour, type scale, spacing) and use only those values.','Design all states and breakpoints, not just the ideal screen.','Check every text and background pair for contrast as you choose colours.','Write the handoff so a developer can build it without guessing.'],
  pitfalls:['Low-contrast grey text and tiny tap targets.','Inconsistent spacing and too many type sizes.','Visual changes that hide the main action.'],
  quality:['Each colour pair has its contrast ratio and a pass or fix.','Every component lists its states, sizes and behaviour.','Open questions and decisions are listed for the developer.']},
 'executive-assistant':{principles:['Lead each brief with the decision or preparation the executive must do today.','Pull every action from the source notes with an owner and a due date.','Prepare each meeting with the purpose, attendees, open items and the one outcome wanted.','Draft follow-ups in the executive\'s voice and keep them short.','Flag clashes, double bookings and missing information instead of guessing.'],
  pitfalls:['Inventing attendee details or commitments not in the notes.','Burying the urgent item under routine updates.','Sending, accepting or declining anything without approval.'],
  quality:['Every action links to its source note or message.','The day plan fits the real calendar with travel and breaks.','Drafts are ready to send after a quick read.']},
 'customer-support-specialist':{principles:['Sort tickets by urgency and impact first: safety, money and access issues go to the top.','Check the order, account and current policy before writing a reply.','Give the answer, the next step and when the customer will hear back.','Group repeated issues and turn confirmed fixes into help-page drafts.','Escalate when policy does not cover the case, and say so to the customer.'],
  pitfalls:['Promising refunds or delivery dates the facts do not support.','Blaming the customer or another team.','Changing account or order records without approval.'],
  quality:['Each reply is checked for promises, facts and tone.','Escalations name the reason, the owner and the evidence.','Help-page drafts match the current policy wording.']},
 'seo-specialist':{principles:['Fix crawling and indexing blockers first. A page that is not indexed cannot rank.','Give each page one main search intent. Do not target the same query with two pages.','Write titles of about 60 characters with the main term early, and descriptions that earn the click.','Use structured data only for content visible on the page, and validate it.','Judge changes on Search Console clicks and impressions over comparable periods.'],
  pitfalls:['Keyword stuffing, doorway pages or other tactics against search engine guidelines.','Promising rankings or dates.','Changing URLs without 301 redirects.'],
  quality:['Each issue has the URL, the evidence and the exact fix.','Fixes are ranked by impact and effort.','Changed titles, descriptions and markup are listed before and after.']},
 'cro-specialist':{principles:['Find where visitors drop off, with numbers, before proposing fixes.','Read real customer words (reviews, surveys, support tickets) to learn the doubts the page must answer.','Rank ideas by expected impact, confidence and effort.','Fix clear bugs and broken flows directly. Test changes whose effect is uncertain.','Set the sample size and run time before a test starts, and run whole weeks.'],
  pitfalls:['Stopping a test as soon as it looks significant.','Copying generic best practice without evidence from this page.','Testing many changes at once so the cause is unclear.'],
  quality:['Each issue cites its evidence: analytics, recordings or customer words.','Each test has a hypothesis, a primary metric, a sample size and a stop rule.','The updated page is checked again against the same checklist.']},
 'media-buyer':{principles:['Diagnose with the funnel: cost to reach people, click rate, landing conversion and order value. Find which step changed.','Give ad sets enough budget and time to leave the learning phase before judging them. Check current platform guidance.','Change budgets in small steps so delivery is not reset.','Refresh creative when frequency rises and click rate falls together.','Judge spend on profit, using store or backend numbers, not platform-reported return alone.'],
  pitfalls:['Several changes at once, so the cause of a result is unknown.','Trusting platform-attributed sales without checking them against the store.','Changing live budgets, bids or audiences without approval.'],
  quality:['Each finding compares like-for-like periods and names its data source.','Each recommendation states the expected effect, risk and how it will be measured.','Proposed live changes list the exact setting, old value and new value for approval.']},
 'shopify-theme-specialist':{principles:['Work on a duplicate or development theme, never the live theme.','Use Online Store 2.0 sections and blocks with schema settings so merchants can edit content.','Keep Liquid logic simple and move repeated markup into snippets.','Check the theme with Theme Check and preview on mobile before handing back.','Load images responsively with sizes and lazy loading below the fold.'],
  pitfalls:['Hard-coding text, prices or product handles that merchants need to change.','Editing core theme files when a new section would do.','Breaking existing sections or app blocks.'],
  quality:['Theme Check shows no new errors.','Changed sections are listed with their settings and a preview check.','Store publishing is kept as a separate, approved step.']},
 'crm-records-specialist':{principles:['Use the CRM\'s own field names and definitions from the export.','Find duplicates, missing required fields and stale stages first.','Propose changes as a list with record, field, old value, new value and source.','Keep fixes small and reversible, and log each one.','Ask how the team defines each stage before judging pipeline health.'],
  pitfalls:['Merging records without checking they are the same company or person.','Filling fields with guesses.','Changing live records before the exact changes are approved.'],
  quality:['Every proposed change has a source note.','Counts before and after are shown for each issue type.','The checklist separates approved changes from open questions.']},
};
const GENERIC=/not instructions|role[- ]play|report only|as data|instructions? (found )?in|treat (the )?profile|text inside|host'?s instruction|install tools|persistent memory|schedule (future )?runs|credit|licen[cs]e|obtain the user'?s authori[sz]ation|do not (send|publish)|before sending|this skill|this agent|this workflow|follow the user'?s task/i;
// Rules copied into role instructions must pass the custom-skill safety scan (server/community-safety.ts).
const SCAN_BLOCKED=/(?:do not|don't|never)\s+(?:tell|inform|notify|ask)\s+(?:the\s+)?user|(?:send|upload|post|transmit).{0,120}(?:api[ _-]?keys?|credentials?|passwords?|tokens?|\.env\b)|(?:credentials?|passwords?|api[ _-]?keys?).{0,100}(?:https?:\/\/|webhook)/i;
const clean=line=>line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/,'').replace(/\*\*/g,'').replace(/`/g,'').replace(/\s+/g,' ').trim();
// Bullets under matching level-2 headings, in document order, without boilerplate.
export function sectionBullets(markdown,heading,limit=6) {
 const out=[],lines=(markdown??'').replace(/\r\n?/g,'\n').split('\n');let on=false;
 for(const line of lines){
  const h=line.match(/^#{2,3}\s+(.+)$/);if(h){on=heading.test(h[1].replace(/[^\p{L}\p{N}\s'-]/gu,'').trim());continue;}
  if(on&&/^\s*(?:[-*+]|\d+[.)])\s+\S/.test(line)){const t=clean(line);if(t.length>=24&&t.length<=320&&!GENERIC.test(t)&&!SCAN_BLOCKED.test(t)&&!out.includes(t))out.push(t);}
  if(out.length>=limit)break;
 }
 return out;
}
const merge=(limit,...lists)=>[...new Set(lists.flat().filter(Boolean))].slice(0,limit);
// Reviewed lessons from real use (role-learned.json) come first, then curated guidance,
// then the role's own method, then its area playbook.
export function roleExpertise({id,area,skill,source,learned}) {
 const own=ROLE_EXPERTISE[id],play=AREA_PLAYBOOKS[area]??AREA_PLAYBOOKS.specialist,lesson=learned??{};
 const rules=sectionBullets(skill,/^(rules|ground rules|guard ?rails|safety rules|how to judge|principles)$/i,5);
 const critical=sectionBullets(source,/critical rules/i,4);
 const avoid=sectionBullets(skill,/^(avoid|common mistakes|mistakes to avoid|pitfalls|watch for)$/i,5);
 const checks=sectionBullets(skill,/^(checks? before you hand (it )?back|acceptance|quality checks|workbook checks|check before handing back)$/i,6);
 return {
  principles:merge(7,lesson.principles,own?.principles,rules,critical,play.principles),
  pitfalls:merge(6,lesson.pitfalls,own?.pitfalls,avoid,play.pitfalls),
  quality:merge(7,lesson.quality,own?.quality,checks,play.quality),
  sources:{learned:(lesson.principles?.length??0)+(lesson.pitfalls?.length??0)+(lesson.quality?.length??0),curated:!!own,method:rules.length+avoid.length+checks.length,source:critical.length,area}
 };
}
