# Sprint PRD: e-commerce skills and workflows from the source library

Started 2026-10-21. Builds on `docs/SOURCE-SKILLS-PRD.md` (sources become skills and workflows) and `docs/INTAKE.md`.

## Why

Kevin collected 256 e-commerce sources (videos, free courses, guides and a few books) in 24 folders, one per business function: product research, avatars, offers, brand, store setup, measurement, landing pages, speed, CRO testing, paid social creative, ad copy, Google Ads, organic, email and SMS, SEO, AEO, post-purchase, sourcing, wild bets, finance, team, Amazon, security, ad deployment, and mixed playbooks. They hold the methods real brands use, with the numbers and conditions that make them work. Today the library has only 14 e-commerce skills. This sprint turns the sources into e-commerce skills and workflows that do real work for a store owner or marketer.

## The bar

Every skill and workflow must be worth using every week or at a key moment. That means:

- **It does a real job** a store owner, marketer or media buyer does: pick a product, write the offer, build the page, set up tracking, launch and scale ads, fix the email flows. Not "think about your brand".
- **It carries the method,** not a summary of a video: the steps, thresholds, decision rules and numbers the sources teach, with the conditions they hold under (spend level, traffic, margin, team size).
- **It is honest about limits.** Two kinds of limit go into every play: cash (can the brand fund it for 90 days?) and capacity (can this team make 40 ads a month?). A plan nobody can carry out is worse than none.
- **No fake skills.** A skill must trace back to at least one source that teaches it. If a source is mostly a sales pitch, it gives nothing.
- **No duplicates.** If the library already has the skill, we improve that one or link to it. The new skill is e-commerce specific only where the job really differs.

## What we make

1. **E-commerce skills** in `catalogue-items/ecommerce/<slug>/` (item.yaml, page.yaml, SKILL.md), in the house format (`docs/PAGE-FORMAT.md`), `category: ecommerce`, `origin: rebuilt`, credits naming each source.
2. **Workflows** in `catalogue-items/orchestrators/<slug>/` that chain them (and existing library skills) into finished outcomes, from one source or across sources. Examples of the kind we want: "Find a product worth selling and check its margin", "Launch a new product page that converts", "Set up tracking you can trust before you spend", "Turn a winning ad into 20 variations and test them", "Fix the email flows that lose the most money".
3. **New jobs** where a function has no home yet (for example Google Ads, page speed, tracking setup, retention, Amazon, store security), agreed after mapping.

## Rules

- **Copyright.** Sources are paraphrased, never copied. At most one short quote (under 15 words) per source. Books (for example $100M Offers, Positioning, Influence, Cashvertising) give methods only, credited by title and author.
- **Credits.** Public videos and books only, by title, speaker and link where known. Never name the private source library, its owners, or any paid course (as in `docs/PAGE-FORMAT.md`).
- **Privacy.** No private client data. A source with a private brand's internal numbers is used for its method only, with the brand unnamed.
- **Writing.** `brand/COPYWRITING.md` and `docs/WRITING.md`: names are job titles, outcome first, grade 10 or below, no AI tells, no em dashes, no version numbers in tool names. Scores only for checkers, audits and analysis.
- **No API credits.** All reading, writing and judging is done by subscription subagents (Sonnet for reading and writing, Haiku for mechanical checks).
- **The sources stay local.** Nothing from the source folder is committed. Only the finished skills and workflows are.

## Plan

1. **Map** (53 Sonnet readers, about 430 KB of text each, grouped by business function). Each reads its sources in full and writes a proposal: the skills each source really teaches (with the method, numbers, conditions and where in the source), how it overlaps the library, and workflows. Output: `scratchpad/ecom/proposals/<group>.yaml`.
2. **Merge** (here). Drop weak and duplicate ideas, merge the same skill proposed from several sources into one stronger skill, decide new jobs, and settle the final list of skills and workflows. The final list is added to this file.
3. **Write** (Sonnet writers, about 10 skills each, grouped by function so the voice stays even). Each rereads the cited passages and writes the three files.
4. **Workflows** (Sonnet writers), from the agreed chains.
5. **Check.** `npm --prefix site run index`, `node tools/add-needs.mjs`, `node tools/add-making-it.mjs`, `node tools/lint-pages.mjs`, `node tools/reading-level.mjs`, the build, the e2e suite and the crawl. A few skills are judged by a subagent playing a store owner with a real job.
6. **Ship.** Commit and push. Not deployed.

Alongside, two file-count changes from the free-plan work run at the same time:

- **The example app moves to its own Cloudflare Pages project** (about 2,230 files out of the main site).
- **Each mind's files go in one zip,** as the skills' do now (about 915 files fewer).

## Done when

- Every new skill traces to a source, passes lint and the reading level, and has a real method with numbers or decision rules.
- Every function folder with real methods has skills, and the main e-commerce outcomes have a workflow.
- Index, build, e2e and crawl pass, and the site stays under 19,000 files.
- A short report in `reports/` lists what came from where, what was dropped and why, and which sources were thin.

## Outcome (2026-10-21)

- 341 new e-commerce skills and 61 workflows from the sources (`reports/2026-10-21-ecom-sources-sprint.md`). Two sample judges scored them; the 12 problems they found were fixed (unsourced figures cut or labelled, safety rules moved into the steps, two workflows given re-check pauses).
- Then a second round across the whole library: 19 Sonnet builders made 116 more workflows for jobs that had few or none (software, contracts, hiring, teaching, research, audio, design and more), and 10 made the first 44 **agents** (`catalogue-items/agents/`, format in `docs/PAGE-FORMAT.md`). `tools/intake.mjs` now also reads imported skills.
- Correction after the local handoff: the build does not establish the account's billing plan. Pages Free allows 20,000 files; the guard defaults to 19,000 with headroom. A $5 Workers subscription alone does not upgrade Pages file capacity. See `docs/CLOUDFLARE-CAPACITY.md`.
