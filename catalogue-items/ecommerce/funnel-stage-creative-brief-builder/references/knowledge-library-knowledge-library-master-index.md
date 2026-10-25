# Knowledge Library — Master Index

**Every file in Course 3, what it does, and when to use it.**

This is the map. If you are looking for a framework, prompt, template, or example, start here.

---

## How the library is organized

Course 3 has 12 lessons grouped into 5 content areas. Each lesson folder contains the downloadables for that lesson. Files are named for what they are: prompts end in `-prompt.md`, templates in `-template.md`, worksheets in `-worksheet.md`, architectures in `-architecture.md`.

Every prompt (`.md` file that starts with a slash command name) can be copy-pasted into a chat with any capable LLM. Every template is ready to fill in for a real client.

---

## Content Area 1 — Auditing and Diagnostics (Lessons 41-42)

**Folder:** `01-Auditing-and-Diagnostics/`

| Lesson | File | Use when |
|---|---|---|
| 41 | `facebook-30-point-framework.md` | Running a Meta account audit |
| 41 | `meta-audit-prompt.md` | You want an agent to run the 30-point audit for you |
| 41 | `audit-score-rubric.md` | Turning a raw audit into a 1-100 score |
| 42 | `google-audit-framework.md` | Running a Google Ads audit |
| 42 | `google-audit-prompt.md` | You want an agent to run the Google audit for you |
| 42 | `google-audit-score-rubric.md` | Scoring a Google account |

---

## Content Area 2 — Creative Intelligence (Lessons 42-43)

**Folder:** `02-Creative-Intelligence/`

| Lesson | File | Use when |
|---|---|---|
| 42 | `creative-brief-template.md` | Writing a brief for a designer or editor |
| 43 | `riley-review-prompt.md` | Reviewing a creative submission against a brief |
| 43 | `creative-framework-library.md` | Looking up a named framework (PAS, AIDA, etc.) |

---

## Content Area 3 — Copy and Hooks (Lessons 41-44)

**Folder:** `03-Copy-and-Hooks/`

| Lesson | File | Use when |
|---|---|---|
| 41 | `jordan-copy-prompt.md` | Writing ad copy with the Jordan agent |
| 41 | `50-copy-examples.md` | Looking for reference copy by framework |
| 42 | `hook-library-60.md` | Need a hook by tactic (Confession, Bold Claim, etc.) |
| 43 | `3-layer-hook-system.md` | Building a hook that integrates visual + caption + voiceover |
| 44 | `ugc-script-templates.md` | Writing a UGC script from scratch |
| 44 | `awareness-stage-copy-matrix.md` | Matching copy framework to Schwartz awareness stage |
| 44 | `ugc-script-prompt.md` | Using the agent to draft UGC from a product + persona |
| 44 | `awareness-stage-quiz.md` | Diagnosing which stage a prospect is in |

---

## Content Area 4 — Psychology and Strategy (Lessons 45-48)

**Folder:** `04-Psychology-and-Strategy/`

| Lesson | File | Use when |
|---|---|---|
| 45 | `competitor-research-checklist.md` | Starting competitor research from scratch |
| 45 | `competitor-ads-research-prompt.md` | Running competitor analysis with an agent |
| 45 | `competitor-tracker-template.md` | Building the ongoing competitor tracker |
| 46 | `competitor-research-architecture.md` | Building the competitor pipeline in-house |
| 46 | `competitor-scraper-starter.ts` | Starter code for Meta Ad Library scraping |
| 46 | `theme-classification-prompt.md` | Classifying competitor ads into themes |
| 47 | `teep-framework-card.md` | Applying TEEP to a buyer journey |
| 47 | `buyer-psychology-interview-guide.md` | Preparing customer interviews |
| 47 | `psychology-brief-template.md` | Writing the psychology brief for a client |
| 47 | `buyer-psychology-prompt.md` | Running the psychology synthesis with an agent |
| 48 | `theme-library-catalog.md` | Choosing a theme for a new concept |
| 48 | `persona-stage-theme-matrix.md` | Mapping persona + stage to the right theme |
| 48 | `prompt-pipeline-diagram.md` | Understanding how Sage builds prompts |
| 48 | `prompt-pipeline-starter.ts` | Implementing the pipeline in code |

---

## Content Area 5 — Operations and Growth (Lessons 49-52)

**Folder:** `05-Operations-and-Growth/`

### Lesson 49 — Brand DNA and Image Pipeline

| File | Use when |
|---|---|
| `brand-dna-extraction-template.md` | Capturing a client's brand for image generation |
| `brand-dna-prompt.md` | Running brand extraction with an agent |
| `image-generation-architecture.md` | Understanding the Gemini + REVE + Riley pipeline |
| `5-photography-styles-reference.md` | Choosing a photography style for a concept |
| `generate-ad-prompt.md` | Generating an ad image with the agent |

### Lesson 50 — Budget, Scaling, Cross-Platform

| File | Use when |
|---|---|
| `budget-allocation-scorecard.md` | Deciding SCALE / MAINTAIN / REDUCE / KILL |
| `scaling-readiness-5-point-checklist.md` | Deciding whether a campaign is ready to scale |
| `cross-platform-attribution-guide.md` | Reconciling Meta + Google + Shopify + Klaviyo |
| `budget-prompt.md` | Running a budget review with an agent |
| `scaling-plan-prompt.md` | Building a 4-week scaling plan |
| `cross-platform-prompt.md` | Running a multi-platform fatigue + allocation review |

### Lesson 51 — A/B Test and Monthly Report

| File | Use when |
|---|---|
| `ab-test-design-worksheet.md` | Designing an A/B test before launch |
| `ab-test-prompt.md` | Designing a test with an agent |
| `monthly-report-template.md` | Building a client report |
| `monthly-report-prompt.md` | Drafting the report with an agent |
| `client-report-example.md` | Seeing what a finished report looks like |

### Lesson 52 — Audit to Sales Doc

| File | Use when |
|---|---|
| `audit-to-sales-doc-prompt.md` | Converting an audit into a pitch |
| `sales-doc-template-lean.md` | Building a 4-page pitch |
| `sales-doc-template-pitch-deck.md` | Building a 14-slide deck |
| `closer-playbook.md` | Preparing for the readout / close call |

---

## Course-Wide Resources

**Folder:** `06-Course-Wide-Resources/`

| File | Use when |
|---|---|
| `knowledge-library-master-index.md` | This file — the map |
| `framework-glossary.md` | Looking up what a named framework means |
| `agent-knowledge-loading-guide.md` | Loading the knowledge library into your own agent |

---

## How to read this library as an operator

**Day 1:** Skim the framework glossary. Get the vocabulary.

**Week 1:** Run one audit (Meta or Google) end to end using the frameworks in Area 1.

**Week 2:** Use one copy prompt and one creative prompt from Areas 3 and 2 on a real client.

**Week 3:** Build one brand DNA doc and one psychology brief from Area 5 and Area 4.

**Month 2:** Wire the prompts into your own agent stack using the loading guide in Area 6.

**Month 3:** Run a full monthly report using the template in Lesson 51. Pitch a new prospect using the closer playbook in Lesson 52.

This is the sequence that takes an operator from "I have the files" to "I run the system."

---

## How to read this library if you are building agents

Every prompt file is a standalone skill. The pattern is:

1. Read the prompt file.
2. Copy the prompt body (the block inside triple backticks).
3. Paste into your agent definition, filling in any environment-specific variables.
4. Test against a synthetic input.
5. Deploy.

The prompts are model-agnostic. They work with Claude, GPT, Gemini, or any open model capable of following instructions at that length.

---

## What this library is not

- It is not a theory textbook. It is a toolkit.
- It is not a guarantee. You still have to execute.
- It is not locked. You should adapt every template to your voice, your clients, and your process.

---

## Maintenance

This library is versioned. Every lesson folder contains the version this file was built against. If something feels out of date, check the lesson folder — a newer version may exist there.

If you build something better than what's here, add it to your own fork. Share it back with the community when it is battle-tested.
