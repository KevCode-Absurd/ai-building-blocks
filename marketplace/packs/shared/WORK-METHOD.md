# Work method

The client judges one thing: does this do its job for their buyer or their decision, and can they use it today? Grounding and brand fit are the floor, not the win.

## 0. Frame: the spec sheet

Write `context/spec.md`, one screen:

- **The job:** who must do what after seeing this (buy, sign up, reply, approve a budget). One sentence.
- **Deliverables:** the exact count and format, in the client's words.
- **Acceptance tests:** 5 to 7 questions the client would ask. Two or more on the commercial job ("Does email 1 show a product and give a reason to click?"). One each on readiness ("Can a designer make each ad without asking me anything?"), truth and clarity.
- **Decisions you must take** and **assumptions**, one line each.
- **Mode:** `patch` what exists (the default), `extend` it, or `new`.
- **Brand context:** none, facts, voice, look or all three. Take only that slice.

## 1. Ground: only what the job needs

Capture what the acceptance tests depend on, and no more (`context/README.md`). Include the buyer's real setting: city, season, any promotion live today. To capture a site:

1. Run `node tools/capture-brand-dna.mjs <url>`.
2. Or run `tools/brand-dna-snippet.js` in a browser console on the live site and save its output as `context/brand-dna.json`.
3. Or ask for the URL, screenshots and brand guide.

Every fact goes in `context/facts.md` with its source and date. None is used without both.

**Can the buyer act today?** Confirm the thing sold is live, in stock in the sizes or variants that matter, at the stated price, at the link you use. If not (nearly sold out, wrong city, dead link), decide yourself, build for the option that works, and say so in your first line.

## 2. Taste and tools

For work a buyer sees, note in `context/taste-brief.md` the brand codes to keep, 2 admired references and 1 to avoid. Add the defaults in `tools/ai-default-patterns.md` to stay out of.

Your `toolbox.md` lists what to use when; pick at your own discretion and open only what you pick.

## 3. Diverge: real candidates, and someone else chooses

First check the proven levers in the job skill against the live asset.

Then make about 3 candidates of the part that decides the outcome, as real work, not descriptions. That means three first screens of a page; at least 9 one-line ad concepts, then the strongest written up; three email series arcs, each with email 1 written; two differently shaped one-page plans; or three competing explanations with their evidence. They differ on at least two of: promise, proof, structure, buyer moment, offer, visual world.

Give the brief, the spec sheet and the unlabelled candidates to a fresh reviewer who has not seen your reasoning. Use a new sub-agent, or else a separate pass labelled SAME-CONTEXT in your notes. They answer each acceptance test per candidate, pick one, and name what to take from the others. If none passes the commercial tests, make one more round only.

## 4. Build: the craft floor

- **New framing of true facts, never new facts.** Page lines are facts to use, not copy to paste. Write the persuasion yourself.
- **Every piece earns its place:** each email, ad or section gives the buyer a reason to act and shows the product where they expect it.
- **Decide.** One recommendation, the runner-up in a line. Never a menu.
- **Be specific where the client will act:** real product names, prices, dates and set-up steps. Working figures only for planning numbers the client will tune (budgets, targets, test sizes), sum shown. Never in what a buyer reads, never as a revenue forecast.
- **Match the voice by ear:** 5 real brand lines beside 5 of yours.
- **Finish the format.** Ads: every platform field including the description, character counts, safe areas, brand and price for a cold audience, landing URL. Emails: subject, preview, one product and one ask each, links, exit rule, merge tags. Plans: totals that add up, dated steps, owners, cut, keep and scale rules, break-even. Pages: one action, proof, mobile, load.

## 5. Check: the client's-eye review

A fresh reviewer (as in step 3) gets only the client's brief, the finished deliverable and `context/facts.md`, and answers:

1. Each acceptance test: pass or fail, with the line that proves it.
2. Each claim a buyer or the client will read (prices, counts, ratings, policies, names, delivery times, quotes, product properties): sourced or not.
3. The weakest piece, and why a buyer would skip it.
4. What the client would have to ask before using it.
5. What can be cut.

Remove each unsourced claim, or rewrite it to what the source says. Never flag or footnote it. Fix 1, 3 and 4, cut 5, then stop.

**Gates.** Answers 1 and 2, the buyer-can-act check, access, the finished format and the job skill's own gates are pass or fail. No craft score makes up for a failure.

**Craft.** "Does the job" (for the buyer or the decision) weighs most, 30 of 100; no other row outranks it. "Own material" weighs 10: at least one idea, proof or angle from this business's real material that a generic answer would not have.

## 6. Hand over, and learn

- The work comes first, opened by 3 to 5 lines: what this is, the main decision and why, what to check before use. Stay inside the job skill's word budget.
- Nothing internal reaches the client: no process sections, lever checklists, rejected candidates, agent names, file names (knowledge.md, DECISIONS.md), access levels or method words. Supporting detail goes in an appendix inside the deliverable.
- Headings state the point. Sentences are short. Tables are for comparisons only.

Keep working notes in `DECISIONS.md`. Add a lesson that would help every client to "Rules I learned" in playbook.md, in the form shown there. A lesson about one client stays in that client's `context/`.
