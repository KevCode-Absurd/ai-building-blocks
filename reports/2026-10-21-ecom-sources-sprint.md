# E-commerce sources sprint: 341 skills and 61 workflows

Done 2026-10-21. Plan and bar: `docs/ECOM-SOURCES-PRD.md`. The sources (256 videos, talks, articles and books) stay on the local machine and are not in the repo. Pages credit each one by title and speaker; no private library, collector or paid course is named.

## How it ran

1. **Map.** 53 Sonnet readers went through the 256 sources in groups and proposed 726 skills and 244 workflows, each with the passages it came from.
2. **Curate.** One curator per job merged the proposals, dropped thin ones and checked the library for overlap. 726 proposals became 365 specs; 116 were dropped outright and the rest merged.
3. **Cross-list overlaps.** Specs that did the same job on two lists were merged into one owner (for example break-even ROAS, CAC payback, incrementality tests, welcome flows, tech packs).
4. **Write.** 41 writers (and one fix-up pass) built the skills in the house format (item.yaml, page.yaml, SKILL.md), about 10 each, rereading the source passages.
5. **Workflows.** 7 agents turned the workflow proposals into 62 intake skeletons wired to real skills; one near-duplicate was cut, leaving 61. `tools/intake.mjs workflow` built them and 7 agents rewrote the pages.
6. **Check.** lint-pages and reading-level on every page, the intake check on every skeleton, the site build (14,108 files, under the 19,000 guard), e2e and two sample judges.

## What came from where

| Job list | Proposed | Specs | Written | Store versions of a library skill | Dropped |
|---|---|---|---|---|---|
| Brand file | 46 | 19 | 18 | 5 | 16 |
| Find products | 20 | 13 | 13 | 2 | 2 |
| Get found in search | 52 | 30 | 30 | 7 | 3 |
| Grow social | 20 | 12 | 12 | 2 | 4 |
| Growth strategy | 8 | 4 | 4 | 0 | 4 |
| Keep customers | 34 | 18 | 16 | 3 | 5 |
| Launch and scale ads | 43 | 23 | 17 | 6 | 4 |
| Make offer | 39 | 17 | 17 | 5 | 6 |
| Paid social creative | 61 | 27 | 27 | 5 | 4 |
| Plan supply chain | 17 | 10 | 10 | 3 | 7 |
| Protect your store | 14 | 9 | 7 | 1 | 2 |
| Run Google ads | 51 | 29 | 29 | 4 | 2 |
| Sell on Amazon | 13 | 10 | 10 | 4 | 2 |
| Set up store | 39 | 17 | 16 | 2 | 8 |
| Speed up store | 12 | 11 | 11 | 2 | 0 |
| Team and ops | 20 | 12 | 10 | 5 | 8 |
| Test store changes | 14 | 10 | 10 | 4 | 3 |
| Track numbers | 52 | 26 | 24 | 4 | 6 |
| Understand customers | 21 | 13 | 13 | 5 | 4 |
| Write ad copy | 34 | 9 | 9 | 0 | 22 |
| Write emails | 71 | 26 | 26 | 8 | 2 |
| Write landing page | 45 | 20 | 18 | 6 | 2 |

"Written" is lower than "Specs" where a spec was folded into its owner on another list. A few specs land on another list's job (a Google Ads list item is a `track-numbers` skill, and so on). Write ad copy kept only 9 because the library already had about 50 copy skills.

## Rules the writers held to

- **Method first.** Every step, threshold and decision rule from the source, with its condition. Where sources disagree, both views with when each applies.
- **No invented numbers.** Score weights, cut-offs and worked examples that no source gives are labelled on the page as the skill's own starting point. Single-speaker figures are labelled as one source's claim; dated figures (Amazon fees, Shopify rules, AI search claims) say to re-check.
- **Left out on purpose:** fake urgency and reset timers, bought or rewarded reviews, paid link insertions, hidden-text email tricks, fake news-site advertorials, hidden cancel buttons, reused creator clips, and astroturfed Reddit answers. Cancel flows, SMS, popups, returns, tax, equity deals and 3PL contracts carry a short "check the law or a qualified person" line.
- **Honest limits.** Each skill says when it doesn't apply (too little traffic, cash or team, the wrong store type).

## Workflows

61 workflows, 2 to 7 steps each, across Google Ads, tests and speed, pages and offers, store setup, Amazon, products and supply, Meta and TikTok creative, social, email and retention, numbers and planning, search and AI answers, customers and brand. All use the AI Blocks library as their source, since each combines several sources.

Many ad and store skills take inputs no other skill makes (an export, a question), so chains often include a `pause:` step where the person acts: switch a flow on, export results, run the test for two weeks. Those pauses are real actions, not filler.

## Thin or unused sources

About 37 of the 256 sources gave no skill. Most were rated low or none by the readers: generic explainers (web vitals, GEO definitions, CX trends), vendor pitches, a byte-for-byte duplicate talk, a parasite-SEO tactic left out as spam, and general leadership books with no store method. A few strong books (jobs to be done, ad psychology, copy research) fed skills that already existed in the library or were folded into others.

## What's left

- Worked examples: every new skill and workflow is `example_pending: true`. They get a test round on the sprout data, as earlier rebuilt skills did.
- The "Before you start" and "After this" sections are on the new skills only. Re-running `tools/add-needs.mjs` across the library also changes about 390 existing skills' next steps, so that is a separate review.
- `works_best_with` tool names and fees came from the sources, not a fresh web check.
- Workflow `how_it_works` lists don't always show the pause steps the explain text describes.

## Round 2: workflows and agents from the whole library

- **116 more workflows.** 18 Sonnet builders, one per group of jobs, read a digest of every block in their jobs (inputs, outputs, summary, existing workflows) and built only real chains: each step reads what an earlier one made, or follows a pause where the person acts. A 19th went back for chains that need imported skills, once `tools/intake.mjs` could see them. Jobs that had none now do: build and test software, security, hosting, tools, contracts, docs, meetings, research, hiring, teaching, audio and design. All pass `intake.mjs check` and lint.
- **44 agents, a new kind.** An agent runs skills and workflows on its own, reads each result, decides what to run next, keeps a memory folder, and asks before anything that spends, sends, publishes or changes a live account. Each one repeats on a schedule, chooses between paths, or loops until a check passes; fixed chains stayed workflows. Areas: paid ads (Google and Meta weekly keepers, fatigue watcher, pre-launch fix loop, test sprint runner), creative batches, the store (test program, speed, pre-launch, page fix loop, offers), email, churn, social, inbox triage, profit close, stock and cash, Amazon, prices, customer voice, SEO, AI answers, competitors, brand voice, code review, test repair, security sweep, releases, hiring, onboarding, meetings, process docs, product feedback, website quality, prompt tuning, design review, research, idea tests, sales calls, contracts and strategy. Thresholds no skill gives are labelled as the agent's own starting point. All are `example_pending: true`.
- **Site.** Agents have their own tab and `/agents/<slug>` pages (what it runs, how to add it, the agent file). The library loads cards a few at a time as you scroll, and cards off screen are not laid out until they come near.

Still to check: several imported skills' frontmatter `name` differs from their folder slug, so an agent that says "run `applicant-shortlist-builder`" may find it installed under its original name. The agents say to fetch any step they can't find from its page.
