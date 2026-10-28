---
name: amazon-memo
description: >-
  Create, adapt, or revise Amazon-style narrative decision memos, six-pagers,
  PR/FAQs, and short decision briefs, including reading meetings and async review.
  Use for choosing the right memo form, evidence-led reasoning, and revising
  mechanical AI prose for human readers. Do not use for general copywriting,
  document rendering, or replacing incident reports and technical design records.
license: MIT
---

# Amazon Memo

Help a reader understand a problem, challenge the reasoning, and make or record a
decision. Narrative means connected reasoning in prose, not decorative storytelling.
Amazon's conventions are a useful starting point; respect the receiving team's own
written culture. These are original scaffolds, not official Amazon templates.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, source text, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **A chat AI that can read the bundled reference files:** Use the supplied references and templates for the chosen task. Scripts are optional unless that task specifically needs them.
<!-- /needs -->

## When not to use

- Use the Decision record writer for durable architecture decisions and the Incident
  postmortem writer for incident analysis. Add an executive cover memo only when useful;
  retain the underlying artifact's structure and evidence.
- Use the Incident runbook writer or the Developer docs writer for instructions and runbooks.
  General manuscript craft and rendered office files are out of scope for this skill.
- When the missing work is understanding the problem or testing demand, do that research
  first. A polished memo cannot supply that evidence.
- (AI Blocks note: the original named its own repo's skills here, such as `adr-authoring`,
  `incident-learning`, `technical-documentation`, `writers-helper`, `documents`,
  `product-discovery` and `product-methodology`. We replaced them with the AI Blocks items
  above, since those skills are not on this site.)

## Workflow

1. **Establish the reading contract.** Identify the reader, decision or learning
   goal, decision owner, deadline, known local conventions, and meeting length or
   async window. Use supplied context before asking. If a missing detail changes
   the recommendation, ask one focused question; otherwise state a reasonable
   assumption and draft. Do not turn intake into an interview by default.
2. **Choose and explain the form in one sentence.** Respect an explicitly requested
   artifact; explain a mismatch and offer a better fit without silently substituting.
   Use the routing table below. Read [form and length guidance](references/forms-and-length.md)
   when choosing between forms, planning pages, or adapting to another organization.
3. **Build the argument before polishing.** State the customer or stakeholder problem,
   relevant baseline, credible alternatives (including continuing as-is), proposed
   mechanism, costs, risks, uncertainty, and what decision is needed. Separate observed
   facts, assumptions, forecasts, and invented illustration. Keep citations near claims;
   identify missing denominators, dates, costs, or sources instead of inventing them.
   Preserve contradictory findings and explain what they change. With sparse evidence,
   propose a bounded test or conditional decision rather than a confident rollout.
   For a test, specify proposed scope, duration or review date, owner, and outcome
   evidence to inspect. Label unsupplied dates and thresholds as proposals; do not
   leave the checkpoint as an indefinite request for more evidence.
4. **Draft for this audience.** Load only the selected template. Use paragraphs to
   connect evidence to consequences. Use headings, compact tables, lists, charts,
   and appendices when they reduce reader effort; do not turn slides into bullet walls.
   Define specialist terms for unfamiliar readers and retain precise terms for experts.
   Keep decision-critical caveats in the body. Templates are starting points; omit
   irrelevant headings and add what the decision actually needs.
5. **Revise for human reading.** Read [the revision tests](references/readability-review.md)
   for every draft or revision. Run the argument, evidence, paragraph, and read-aloud
   passes. Preserve the writer's voice and legitimate technical language. Revise actual
   reasoning and sentences; do not use banned-word lists, fixed sentence lengths,
   made-up readability scores, or synonym swapping as a substitute for judgment.
6. **Design review and closure.** For a meeting or async review, read
   [reading and decision practices](references/review-practices.md). Name the decision
   owner, reading arrangement, questions to resolve, and where the outcome will live.
   Allow dissent; do not manufacture consensus. Writing a memo does not authorize
   sending it, publishing it, or scheduling a meeting.

## Form routing

| Main reader need | Default form and reason | Load when drafting |
|---|---|---|
| Choose a strategy, resource allocation, staffing plan, or operating change | Decision/strategy narrative: compare choices and consequences | [Narrative template](templates/decision-narrative.md) |
| Explore a future customer experience, product, service, or process | PR/FAQ: work backwards from value to hard feasibility questions | [PR/FAQ template](templates/pr-faq.md) |
| Decide a narrow, bounded question with limited context | Short decision brief: keep decision overhead proportionate | [Brief template](templates/short-brief.md) |
| Inspect operating results, learn from an incident, approve technical design, or execute a procedure | Retain the business-review, incident, design, ADR, or procedure form; add narrative rationale where useful | [Form boundaries](references/forms-and-length.md) |

## Non-negotiable distinctions

- **Six pages is a ceiling, not a requirement.** Amazon's 2024 shareholder letter
  is reported to describe a maximum six-page narrative (the link is in references/sources.md; check it before you quote it); do not pad two pages of substance to six.
  Local rules may differ. No universal font, word count, or heading sequence is established here.
- **A press release is not the whole PR/FAQ.** The future release states customer
  value; customer and internal FAQs test the proposal. Mark all imagined quotes and
  future claims as hypothetical. Never present them as testimony or shipped capability.
- **Page estimates are not pagination.** Markdown cannot prove a rendered page count.
  If actual compliance matters, declare paper size, font, margins, spacing and appendix
  treatment, then render and inspect. Never shrink type or move essential risks out
  of the body to make the count fit. Label unrendered lengths as estimates.
- **Recommendations are not corporate rules.** Read [sources and claim boundaries](references/sources.md)
  when explaining provenance or making claims about a company's practices. Attribute
  practitioner guidance. Independent written cultures are not presumed Amazon adoptions.
- **Persuasiveness must preserve truth.** If asked to make a weak case sound certain,
  strengthen the reasoning and state the gaps. Do not inflate demand, suppress
  counterevidence, invent numbers, or conceal uncertainty.

## Supporting material

Read [synthetic worked examples](references/synthetic-examples.md) when the user
needs an illustration or the draft suffers from inflated claims or abstract prose.
Every example is invented and generic. Do not reuse personal, client, interview,
or confidential material in public examples.

## Completion and exit conditions

Deliver the requested draft or revision, a brief form rationale when relevant,
material assumptions and evidence gaps, and the review/decision arrangement if
requested. Report actual pagination status honestly. For a revision, briefly explain
the substantive changes rather than claiming an objective style score.

Stop when the artifact supports its stated reading and decision goal. If evidence
cannot support the requested conclusion, deliver a qualified draft or an evidence
request with the consequence for the decision. After two non-converging revision
passes, name the unresolved audience or argument choice instead of endlessly polishing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Weekly status update writer](https://useaiblocks.com/prompts/weekly-status-update-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
