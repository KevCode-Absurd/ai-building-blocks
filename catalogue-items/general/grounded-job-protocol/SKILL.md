---
name: grounded-job-protocol
description: "Use for any substantial job (a page, ad batch, email, copy, audit, analysis, strategy, plan, code or ops document) before you produce anything. Seven steps that work in any chat: FRAME the job and its mode (patch by default when an asset exists), GROUND in the real site, data or account, write a TASTE brief, DIVERGE on substance, BUILD inside the client's system, CHECK with a separate critic against gates and a craft rubric, then RECORD decisions and typed rules learned."
---

# Grounded job protocol (GJP)

A model left alone produces the average answer for the category, so every client gets the same page, ad or plan. Better wording does not fix that. Context and process do: capture the real business first, decide what taste means for this client, explore real alternatives, build inside their system, and have someone else check the result against the client.

Run all seven steps for anything bigger than a quick answer. Each step names the file it leaves behind, in the project's `context/` folder or beside the deliverable. In a plain chat, write the same sections in the chat instead.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Your website** (yours): the link to your site or the page.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, your website. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **An AI that can run code and use a browser:** Captures your site and runs the brand checks itself.
- **A second chat or AI seat:** Does the independent check without having made the work.
<!-- /needs -->

## 0. FRAME: the job card

Write five lines before anything else.

```
Client: <who, with their site or account>
Outcome: <what they want to change, in their words>
Deliverable kind: web_page | ad_creative | copy | email | audit | analysis | strategy | plan | code | ops_doc | other
Success measure: <how we will know it worked>
Mode: patch | extend | new
```

- **patch** improves the existing asset. It is the default whenever an asset exists (a live page, running ads, a current plan).
- **extend** adds a new page or asset inside the existing system, such as a campaign page on a live site.
- **new** is for a new brand or no asset at all. Use it only when the user says so or nothing exists.

"Redesign from scratch" in a brief is a request to confirm, not a mode to assume. Ask once: "Your site exists. Shall I improve it (patch) or replace it (new)?" If they say new, list what may change.

## 1. GROUND: capture the real thing first

| Kind | Capture | Where it goes |
|---|---|---|
| web_page, ad_creative, copy, email | The live site with [Brand DNA capture](https://useaiblocks.com/skills/brand-dna-capture): colours with area share, fonts per role, radius, buttons, links, nav, footer, section order, image density, 5 to 10 verbatim voice lines, live facts with capture date | `context/brand-dna.json`, `context/brand-dna.md`, `context/screenshots/` |
| ads, analytics, finance | A pull of the real account or data through the client's connector, at access level 1 (read) | `context/data-snapshot.*` with date range and source |
| any | 2 or 3 competitors or references the client names, or that you find | `context/references.md` |

Capture in this order: run `capture-brand-dna.mjs`; else run `brand-dna-snippet.js` in any browser tool or console; else ask the user for the URL, screenshots and CSS.

Record each capture in the job record with its **path, hash, source, date and method** (`script`, `snippet` or `manual`). The capture script writes these to `context/brand-dna.receipt.json`.

**Gate.** Production does not start until the context file exists and is recorded. Every design or copy choice cites a captured fact or a named reference. If a fact cannot be captured, ask for it. Never fall back to a template without saying so.

For audits and analysis, GROUND means pulling the real numbers before forming any view.

## 2. TASTE: the taste brief

Spend your questions here, not on format. Ask the user about: position, price point and occasion; what must never change; brands they admire and brands they do not want to look like. State format choices (length, number of options) as silent defaults in one line.

Write `context/taste-brief.md`:

```
# Taste brief: <client> / <deliverable>
Mode: <patch | extend | new>   Captured: <date>, see brand-dna.md

## Brand codes to keep (each cites the capture)
- Type: <families per role, case>
- Colour and proportion: <hex and share; which accent stays small>
- Imagery: <house style, density>
- Pacing and structure: <section order, density, rhythm>
- Voice: <2 verbatim lines; words they use and never use>

## Category conventions
- Keep: <convention, and why buyers rely on it>
- Break: <convention, and the reason this client can>

## References
- Admired 1: <name, URL, what to learn from it>
- Admired 2: <...>
- Avoid looking like: <name, URL, why>

## Defaults to avoid (ids from ai-default-patterns)
- <id>: <the brand-specific thing to do instead>

## Must never change
- <facts, terms, legal lines, components>
```

Pick the defaults from [AI default patterns](https://useaiblocks.com/skills/ai-default-patterns). Drop any the brand already uses.

**Gate.** The brief is complete only with at least 1 brand code that cites the capture, at least 2 admired references, at least 1 reference to avoid, and the named defaults by id. For a new brand with no site, the brand codes come from the brand guide or the user's answers.

## 3. DIVERGE: real alternatives

- Make 2 or 3 directions (for audits and analysis: competing hypotheses). Plan them first in one pass, then draft each separately.
- Each direction differs on at least one named axis: **mechanism or promise**, **proof**, **structure**, **visual world or art direction**, **offer**.
- Each cites the reference it learns from and says how it departs from the category default.
- Reject directions that differ only in colour, crop, wording or a style label.
- In **patch** mode, each direction is a change-set to the live asset: a ranked list of specific edits, each with its evidence (the finding, the screenshot, the number) and the test it implies.
- Choose one, or let the user choose. Write down why.

## 4. BUILD: inside the client's system

- Web: start from the captured shell. Keep the nav, footer, fonts, colour proportions and component styles unless the plan changes them on purpose.
- Use the client's real copy and facts. No lorem ipsum, and no placeholder that the capture could have filled. Gaps go in `handoff-checklist.md`, not on the page.
- Keep dated facts (sale prices, deadlines) in one data block with the capture date.
- If a constraint blocks a brand asset (a "no external requests" rule blocks the brand font), embed the asset or stop and say so.
- Code: deliver a runnable file or source the client can drop in, in their stack.

## 5. CHECK: independent, against the client

Use a separate critic: a fresh chat, or another seat. Give it the deliverable, `brand-dna.md`, the taste brief and the rubric. Do not give it the build notes, and do not grade your own work in the same breath.

**Gates (pass or fail; a failed gate cannot be averaged away):**

- Facts trace to a source.
- No invented numbers.
- Access respected: read, draft or publish-within-limits, as granted.
- No fillable placeholders.
- web_page also: the existing nav and footer are kept unless the change is on purpose; brand fonts are loaded; the page works at 390 px and 1440 px; the primary action works. Run [Brand fidelity check](https://useaiblocks.com/skills/brand-fidelity-check) (`check-brand-fidelity.mjs`, or its manual checklist) and its fresh-context side-by-side review.

**Craft rubric (score 0 to 10 per criterion, weight as shown):**

| Family | Weights |
|---|---|
| web_page | Job and conversion logic 20, Brand fidelity 25, Launchability 20, Specificity 15, Distinctiveness vs defaults 10, Clarity 10 |
| ad_creative | Strategic idea 20, Range across named axes 20, Brand fidelity 15, Hook and thumb-stop 15, Specificity 15, Platform fit 15 |
| copy, email | Voice fidelity 25, Specificity 20, Job done 20, Proof and claims grounded 15, Distinctiveness 10, Clarity 10 |
| audit, analysis | Diagnosis specific to this account or data 25, Evidence quality 20, Prioritised actions with expected impact 20, Correctness 20, Clarity 15 |
| strategy, plan | Grounded in this business 25, Options considered with trade-offs 20, Decision quality 20, Actionability 20, Clarity 15 |
| code, ops_doc, other | Job done 30, Correctness 25, Fits existing system 20, Clarity 15, Specificity 10 |

Every family is read through four questions:

- **Specificity:** could a competitor publish this unchanged?
- **Fidelity:** is it recognisably this brand?
- **Distinctiveness:** does it avoid the named defaults?
- **Job done:** does it do what the client asked?

Then compare pairwise with the best reference: what does the reference do that ours does not? Refine once. Deliver with the decision record.

## 6. RECORD and LEARN

Write `DECISIONS.md` beside the deliverable:

```
# Decisions: <client> / <deliverable> / <date>
Mode: <...>   Grounded in: <files and capture date>
## Considered
- Direction A: <axis it changed, reference> ...
## Chosen and why
- <direction>, because <evidence>
## Strongest dissent
- <the best case against the choice, and who made it>
## Gates and score
- Gates: <pass/fail each>   Craft: <score by criterion>   Defaults found: <ids>
## Test next
- <one change, the metric, the decision rule>
```

Then write lessons that generalise into the agent's local `Rules I learned`, one per line, typed:

```
- [decision_rule] When <situation>, <do this>, because <evidence>. (source: <job, date>)
- [taste_reference] <name, URL>: good for <what>, not for <what>.
- [never_do] Never <action> when <condition>. (seen in: <job>)
- [exemplar] <file or URL>: the standard for <deliverable kind>.
- [check] Before hand-off, <test that would have caught a past mistake>.
```

Client-specific lessons (this brand's colours, this buyer's words) stay in the client's `context/`. They never go into the agent's general rules, so one client's taste does not flatten the next.

## How the three helper skills fit

| Step | Skill | What it gives |
|---|---|---|
| GROUND | [Brand DNA capture](https://useaiblocks.com/skills/brand-dna-capture) | `brand-dna.json`, screenshots and the `brand-dna.md` every later step cites |
| TASTE and CHECK | [AI default patterns](https://useaiblocks.com/skills/ai-default-patterns) | The ids for "Defaults to avoid" and the critic's checks |
| CHECK (web) | [Brand fidelity check](https://useaiblocks.com/skills/brand-fidelity-check) | Pass or fail on fonts, palette shares, buttons, chrome, placeholders, facts, 390 px and the main action, plus the side-by-side review |

## What you hand back

The deliverable, plus: the job card, the context files, the taste brief, the directions considered, the check results (gates, rubric scores, default hits, fidelity report), `DECISIONS.md`, and any new `Rules I learned`. End with `CHECKS MISSED`: each gate or check that could not run, or "none".

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Plan failure reviewer](https://useaiblocks.com/skills/failure-first-plan-check). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
