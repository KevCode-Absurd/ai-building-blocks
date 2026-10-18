# Catalogue planning pack: start here

> **Read the final plan first** (`docs/FINAL_PLAN.md`). This pack was written ecommerce-first, on 17 Oct 2026. The platform now serves digital businesses in general, and ecommerce is its first industry pack. `01_ECOMMERCE_BUSINESS_MAP.md` is now the map for that pack, not the whole catalogue's navigation. Where this pack and the final plan differ, the final plan wins.

**Date:** 2026-10-17
**Status:** planning only. Nothing has been built, renamed or changed in any source folder. Every source was read-only.

**What this is:** everything Kevin already has (Creative Engine, Ecommerce OS, the Skool courses, the purchased Ecom Agent OS) has been inventoried and consolidated here. It is mapped against the full ecommerce business, so we can start bringing skills in, renaming, optimising and testing them, section by section.

## Read in this order

| File | What it gives you |
|---|---|
| `01_ECOMMERCE_BUSINESS_MAP.md` | The ecommerce business broken into 7 groups and 28 modules (M01–M28), plus brand brain and AI setup. Includes the stage ladder S0–S5, customer journey and P&L. This is the catalogue's main navigation. |
| `02_MASTER_INVENTORY.csv` | **Every item from every source in one sheet.** Each row has level, tier, module, inputs/outputs, dependencies, status, duplicates, rights, proposed new name, and first-guess **complexity (C1–C4), model class, budget model and publish status**. Opens in Excel. |
| `03_COVERAGE_AND_GAPS.md` | Module by module: what we have that's tested, what's built, what we can only learn from, and what's missing. Also duplicates, naming fixes, and what we won't adopt. |
| `04_SITE_ARCHITECTURE.md` | Site navigation, page types, the item page template, how items are stored (`item.yaml`), shared types for dependencies, model testing, downloads, example policy, revenue placement, marketplace readiness, and build order. |
| `05_PRODUCTION_PRINCIPLES.md` | Engineering rules every item follows: workflow vs agent, memory, context order, tool calling, connectors, skills, multi-agent roles, gateway/routing, retrieval, living brand brain, caching and cost, evals, traces, red-teaming. Ends with a checklist per level. |
| `06_BUILD_PLAN.md` | **How it gets built:** phases, the item factory tools, public test brands, Section 1 (brand brain) and Section 2 (M17) in full detail, the per-item pipeline, model testing, the site, risks and the decisions needed. |
| `07_SOURCES_TO_SKILLS.md` | **How learning sources and playbooks become skills:** what we have (Creative Engine's 403 Learning guides, playbooks, Kevin's own docs, our own lessons), what rights allow, how sources are broken into pieces, and which gap modules they fill. |
| `08_INTAKE_ENGINE.md` | **The intake engine (18 Oct):** paste any YouTube video, reel, article, post or GitHub skill library; it becomes idea cards, matched to our jobs, ladders and workflows, then prompts, skills, routines, workflows, mini tools and agents. Rights, safety, models, and the path from v0 to production. |
| `09_MAKE_IT_YOURS.md` | **Make it yours (18 Oct):** teaching people to test and evaluate outputs, tighten prompts and skills, give the right context, prepare big data sets (reviews, call transcripts), teach an agent from a book, build an interface, make inference cheaper, and train models. |
| `10_AI_ENGINEERING_FRAMEWORK.md` | **The master engineering standard (18 Oct, proposed):** built on Chip Huyen's *AI Engineering*. How every prompt, skill, routine, workflow, agent and app is built, tested, fixed, shipped and watched, plus the course "from a prompt to a platform". Chapter mappings in `10-book-notes/`. Wins over 04–09 where they differ. |
| `sources/` | One report (`.md`) and item list (`.csv`) per source, plus `_SCHEMA.md`. Go here for detail and citations. |

## Sources covered

| Source | Rows | Rights |
|---|---:|---|
| Creative Engine skills, prompts and `.claude` skills (= GitHub `KevCode-Absurd/creative-engine` main) | 260 | mostly own |
| Creative Engine app, pipelines and docs | 104 | own |
| Creative Engine archived retention module (git tag `archive/retention-r1-r6`, not on main) | 3 | own |
| Ecommerce OS folder: AI CMO copy, 18 business docs, Gehna brand brain, tmp | 89 | own / private client data |
| Skool: AI CMO | 76 | course (reference only) |
| Skool: AI Operator + Knowledge Base (every module) | 257 | course (reference only), plus Kevin's own plan PDF |
| Skool: AI Video Bootcamp, AI Video School, Nuova Era | 443 | course (reference only) |
| Ecom Agent OS (purchased, Downloads) | 106 | purchased (benchmark only; licence forbids similar products) |
| **Total** | **1,338** | |

## How the first-guess columns were made (please correct as we go)

- **module:** from each row's tagged business area, refined by keywords. Expect some misfiles; fix them when the item is worked on.
- **complexity / model_class / budget_model:** a rule of thumb.
  - C1 for simple transforms (image prompts, tagging, formatting).
  - C2 for short rules-based writing.
  - C3 for long reasoning (scripts, strategy, audits).
  - C4 for workflows, agents and systems (model chosen per step).
  - The real answer comes from the model test (`04` §6).
- **publish_as:**
  - `own: candidate (tested / needs test)`: Kevin's work.
  - `reference only: rebuild in own words`: course and purchased material.
  - `internal`: app plumbing.
  - `archive`: superseded.

## Decisions this pack follows (Kevin, 2026-10-17)

- **Platform of parts, not pilots.** Six levels, nested: prompt → skill → routine → workflow → agent → system.
- **Build on Creative Engine. Brand brain first.**
- **Every item gets the same core content:**
  - a plain explanation and an example output
  - how to run it in Claude Code, ChatGPT and Codex, or without them
  - the items above and below it (dependencies)
  - depth tiers (Starter → Production)
  - the recommended model by complexity, plus efficient-use guidance (caching, reuse, avoiding degraded output, the four labs we test on)
- **Examples use public data** from well-known brands (Grüns, AG1, IM8). They are labelled as examples, carry no invented claims, and are shown with and without the brand brain. No private client data.
- **Revenue:** affiliates, subscription, implementation/consulting, advertising last. Creator marketplace later at 70/30.
- **Not selling access to other brands' ads.** References come through the user's own connectors.

## Suggested next step

Start the **section-by-section** work with the **brand brain**, then **M17 Creative & static ads**, following `04` §11. `06_BUILD_PLAN.md` has the full detail. For each item, the pipeline is:

1. Rename it.
2. Tighten it for ecommerce.
3. Write `item.yaml`.
4. Make the Grüns examples, with and without the brand brain.
5. Run the model test.
6. Pass the `05` §21 checklist.
7. Mark it tested.

## Open questions for Kevin

1. **Retention module:** revive the archived `archive/retention-r1-r6` module, or rebuild M21 from its two skills?
2. **The ~80 cloud sessions** building a separate "ecommerce OS" app (28 screens, URL-to-brain onboarding, Bombas extractors, API field checks). Where is that repo? It overlaps heavily with this plan and isn't inventoried yet.
3. ~~**"Jev"**~~ Dropped 2026-10-18: no router.
4. **Where should the catalogue items live?** A new repo, or a folder inside Creative Engine? This planning pack sits in the handoff folder for now.
