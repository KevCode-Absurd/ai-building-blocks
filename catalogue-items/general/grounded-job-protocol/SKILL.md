---
name: grounded-job-protocol
description: "Use for any substantial job (a page, ad batch, email, copy, audit, analysis, strategy, plan, code or ops document) before you produce anything. Seven steps that work in any chat: FRAME the job as a one-screen spec sheet with acceptance tests, GROUND only what the job needs in the real site, data or account, brief the TASTE, DIVERGE with real candidates that a fresh reviewer chooses between, BUILD with no new facts, CHECK through a client's-eye review that removes every unsourced claim, then HAND OVER the work first."
---

# Grounded job protocol (GJP)

The client judges one thing: does the work do its job for their buyer or their decision, and can they use it today? A model left alone gives the average answer for the category. Grounding and brand fit stop that, but they are the floor, not the win.

Run all seven steps for anything bigger than a quick answer. Working files go in the project's `context/` folder. In a plain chat, write the same sections in the chat instead.

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

## 0. FRAME: the spec sheet

Write one screen (`context/spec.md`) before anything else:

- **The job:** who must do what after seeing this (buy, sign up, reply, approve a budget). One sentence.
- **Deliverables:** the exact count and format, in the client's words, and the kind: web_page, ad_creative, copy, email, audit, analysis, strategy, plan, code, ops_doc or other.
- **Acceptance tests:** 5 to 7 questions the client would ask of the finished work. At least two on the commercial job ("Does email 1 show a product and give a reason to click?"), one on readiness ("Can a designer make each ad without asking me anything?"), one on truth, one on clarity.
- **Decisions you must take** and **assumptions**, one line each. Never hand back open options.
- **Mode:** `patch` what exists (the default), `extend` it, or `new` only when nothing exists. "Redesign from scratch" is a request to confirm, not a mode to assume.
- **Brand context:** none, facts, voice, look or all three. Take only that slice. Strategy, plans, code and operations work need facts at most.

Ask once, in one short message, only what capture cannot tell you. Say what you will assume if they skip a question.

## 1. GROUND: only what the job needs

Capture what the acceptance tests depend on, and no more:

- **Pages, ads, copy and email:** The live site with [Brand DNA capture](https://useaiblocks.com/skills/brand-dna-capture), into `context/brand-dna.json`, `context/brand-dna.md` and `context/screenshots/`. Run `capture-brand-dna.mjs`; else run `brand-dna-snippet.js` in any browser tool or console; else ask for the URL, screenshots and CSS.
- **Audits and analysis:** a pull of the real account or data through the client's connector, at access level 1 (read), into `context/data-snapshot.*` with its date range and source.
- **Any job:** the buyer's real setting (city, season, any promotion live today).

Every fact goes in `context/facts.md` with its source and date. No fact is used without both. If one cannot be captured, ask for it. Never fall back to a template without saying so.

**Can the buyer act today?** Confirm the thing being sold is live, in stock in the sizes or variants that matter, at the stated price, at the link you will use. If the brief's target is compromised (nearly sold out, wrong city, dead link), make the call yourself, build for the option that works, and say so in your first line.

## 2. TASTE: the taste brief

For work a buyer sees, write `context/taste-brief.md` in a few lines: the brand codes to keep (type, colour proportions, imagery, pacing, voice), each citing the capture; 2 references the client admires and 1 to avoid looking like; what must never change; and the defaults from [AI default patterns](https://useaiblocks.com/skills/ai-default-patterns) this job could slip into. Drop any default the brand already uses.

## 3. DIVERGE: real candidates, and someone else chooses

First mark the proven levers for this kind of work present or missing on the live asset, and add the missing ones from real data. The marks stay in your notes.

- Pages: reviews and ratings near the decision; price, saving and payment options; delivery date and shipping cost; returns and guarantee; stock, size or fit help; real proof and trust marks; one clear primary action on the first mobile screen.
- Ads: a hook in the first line and first second; real proof; the offer or price when it helps; the product in use; one clear call to action.
- Copy: a specific promise first; proof next to each claim; the main objection answered; one next step.
- Email: a subject line with a reason to open; one main action with a direct link; real proof; a true reason to buy now; footer, unsubscribe and an exit rule for buyers.

Then make about 3 candidates of the part that decides the outcome, as real work, not descriptions: three first screens of a page; at least 9 one-line ad concepts across different promises, proofs and formats, then the strongest written up; three openings for copy; three email series arcs, each with email 1 written in full; two differently shaped one-page plans; three competing explanations for an audit or analysis, each with its evidence and what would rule it out.

Candidates differ on at least two of: **promise**, **proof**, **structure**, **buyer moment**, **offer**, **visual world**. A new colour, crop or wording is not a candidate. In **patch** mode each candidate is the live asset as you would change it, with its ranked edits and their evidence.

Give the brief, the spec sheet and the unlabelled candidates to a fresh reviewer who has not seen your reasoning: a new sub-agent or a second chat if you can start one, else a separate pass you label SAME-CONTEXT in your notes. The reviewer answers each acceptance test for each candidate, picks one, and names what to take from the others. If none passes the commercial tests, make one more round, and no more.

## 4. BUILD: the craft floor

- **New framing of true facts, never new facts.** Page lines are facts to use, not copy to paste. Write the persuasion yourself.
- **Every piece earns its place:** each email, ad or section gives the buyer a reason to act and shows the product where they expect it.
- **Decide.** One recommendation, with the runner-up in a line. Never hand the client a menu.
- **Be specific where the client will act:** real product names, prices, dates and set-up steps. A working figure is allowed only for planning numbers the client will tune (budgets, targets, test sizes), with the sum shown. Never for anything a buyer reads, and never as a revenue forecast.
- **Match the voice by ear:** put 5 real lines from the brand beside 5 of yours.
- **Build inside their system.** Web: start from the captured shell and keep the nav, footer, fonts, colour proportions and components unless the plan changes them on purpose. Code: a runnable file in their stack.
- **Finish the format.** Ads: every field the platform needs including the description, character counts, placement safe areas, the brand and the price named for a cold audience, the landing URL. Emails: subject, preview, one product and one ask in every email, links, exit rule, merge tags. Plans: totals that add up, dated steps, owners, cut, keep and scale rules, break-even shown. Pages: one action, proof, mobile, load.

## 5. CHECK: the client's-eye review

Give a fresh reviewer, chosen as in step 3, only the client's brief, the finished deliverable and the captured facts. They answer:

1. Each acceptance test: pass or fail, with the line that proves it.
2. Every claim a buyer or the client will read (prices, counts, ratings, policies, names, delivery times, quotes, product properties): sourced or not.
3. Which piece is weakest, and why a buyer would skip it.
4. What the client would have to ask before using this.
5. What can be cut without loss.

Remove every unsourced claim, or rewrite it to what the source says. Never leave one in with a flag or a footnote. Fix 1, 3 and 4, cut 5, then stop.

**Gates (pass or fail; a failed gate cannot be averaged away):**

- Every acceptance test passes.
- Every fact traces to a dated source, and no number is invented.
- Where something is sold, the buyer can act today.
- Access was respected, the format is finished, and no placeholder blocks use.
- The deliverable stays inside its word budget. Page: a hand-over note of up to 150 words, and page copy no longer than the live page plus 20%. Ads: up to 150 words per concept. Email: up to 200 words of body per email. Audit or analysis: the top 3 fixes or the answer on the first screen, and up to 10,000 words. Strategy or plan: a summary of up to 250 words, and up to 10,000 words that keep the specifics someone needs to act. Code: a note of up to 150 words.
- A web page also passes [Brand fidelity check](https://useaiblocks.com/skills/brand-fidelity-check) (`check-brand-fidelity.mjs`, or its manual checklist): nav and footer kept, brand fonts loaded, works at 390 px and 1440 px, primary action works.

**Craft rubric (score 0 to 10 per criterion, weight as shown).** In every family "Does the job" (for the buyer or the decision) weighs 30, the most. "Own material" weighs 10: at least one idea, proof or angle that came from this business's real material and would not appear in a generic answer. The other rows:

| Family | Weights |
|---|---|
| web_page | Brand fidelity 20, Launchability 15, Specificity 10, Clarity 10, Distinctiveness vs defaults 5 |
| ad_creative | Range across named axes 15, Brand fidelity 15, Strategic idea 10, Hook and thumb-stop 10, Platform fit 10 |
| copy, email | Voice fidelity 20, Specificity 15, Clarity 15, Distinctiveness vs defaults 10 |
| audit, analysis | Evidence quality 20, Prioritised actions with expected impact 15, Correctness 15, Clarity 10 |
| strategy, plan | Actionability 25, Grounded in this business 20, Clarity 15 |
| code, ops_doc, other | Correctness 25, Fits the existing system 20, Clarity 15 |

## 6. HAND OVER and LEARN

- The work comes first, in the format the client asked for. Open with 3 to 5 lines: what this is, the main decision you made and why, and what to check before use.
- Nothing internal reaches the client: no process sections, lever checklists, rejected candidates, agent names, file names such as knowledge.md or DECISIONS.md, access levels or method words. Supporting detail goes in an appendix inside the deliverable.
- Headings state the point. Sentences are short. Tables are for comparisons only.
- End with one line, `CHECKS MISSED`: each gate or check that could not run, or "none".

Keep working notes in `DECISIONS.md` for the next job. Write a lesson that would help every client into the agent's local `Rules I learned`, one line each, typed `decision_rule`, `taste_reference`, `never_do`, `exemplar` or `check`. A lesson about one client stays in that client's `context/`.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Go or no-go launch checker](https://useaiblocks.com/skills/go-or-no-go-launch-checker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
