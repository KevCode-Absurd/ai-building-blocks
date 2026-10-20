# Sprint PRD: skills from the sources, attached to the minds

Started 2026-10-20. Builds on `docs/MINDS-PRD.md` (the 303 minds) and the source collection in `mind-sources/` (local only, git-ignored).

## Why

The minds play a person. People also want the method on its own: "write a sales letter", "test my idea", "run a one-on-one". A person's books and talks hold several of those methods. So each source becomes one or more **skills named by the job**, and the people whose work taught the skill are attached to it. You can use the skill alone, or have the skill done the way one of the 300 would do it.

## Goals

1. **Every mind read against its sources.** Each mind's `knowledge.md`, `personality.md` and `playbook.md` is rebuilt from the books, talks, letters, notes and articles in `mind-sources/<slug>/`, with each new source listed in `mind.yaml`.
2. **Skills from the sources.** One source can give several skills. Each skill is named for the job ("Sales letter writer", "Customer interview planner"), never for the person. Its page says who it comes from: "Claude Hopkins can help with this."
3. **Skills attached to people.** A mind's page lists the skills from their work. You can pick some or all and download them as one pack: README, the mind's skill, personality, playbook, knowledge and sources, and each chosen skill.
4. **Rob Fitzpatrick and The Mom Test.** A new mind, a set of customer research skills from the book, and a workflow that walks you through checking an idea step by step.
5. **Tested and judged.** Routine checks pass, and a few hires are judged for whether they're useful.
6. **Thin sources named,** so the owner knows where to look next.

## Not in this sprint

- Paid API runs. All judging is done by subscription helpers (see memory: no API credits).
- Hosting or committing any source file. `mind-sources/` stays local. Books in copyright are paraphrased, with at most 5 short phrases (under 15 words) per mind.
- A worked example on the Sprout test business for the new skills. Their `example` field is optional until a test round fills it.

## Design

### Skill files

Source skills are ordinary skills in `catalogue-items/general/<slug>/` (item.yaml, page.yaml, SKILL.md), so the library, the builder and downloads all work as they do now. Two extra fields in `item.yaml`:

- `minds: [slug, ...]`: the people whose work the skill comes from, first one strongest.
- `credits:` names the exact book or talk and what it taught, as other rebuilt skills do.

`origin: rebuilt`. The page has every field in `docs/PAGE-FORMAT.md` except `example`.

Existing skills whose credits name a mind (for example "Ad headline writer" credits Hopkins, Caples, Ogilvy and Schwartz) get the same `minds:` field, so those people list them too.

### New jobs

The jobs list was built for ecommerce ads. These are added so skills from all fields have a home:

| id | Name | Areas |
|---|---|---|
| test-an-idea | Test an idea before you build it | business, sales |
| plan-strategy | Plan your strategy | business, leadership |
| build-product | Build a product people want | business, design, coding |
| build-software | Build and ship software | coding |
| sell-and-negotiate | Sell and negotiate | sales |
| lead-people | Lead and manage people | leadership |
| speak-and-persuade | Speak and persuade | leadership, sales, writing |
| write-and-tell-stories | Write and tell stories | writing, arts |
| design-work | Design things people love | design, arts |
| think-and-decide | Think it through and decide | thinking, science |
| money-and-investing | Handle money and investing | business |

### Mind page

- **Skills from their work**: each skill with a tick box, all ticked to start. "Download pack" makes a zip.
- The pack: `README.md` (what's inside and how to add it), `<mind>/SKILL.md`, `knowledge.md`, `personality.md`, `playbook.md`, `sources.md`, and `skills/<skill>/SKILL.md` for each ticked skill. The README tells the AI to do each skill the way this person would.

### Skill page

"Who can help with this": the minds attached to it, with their faces, linking to their pages. In the builder, a step already takes a mind ("Done the way of"), and the attached minds are suggested first.

### The Mom Test

- Mind: `rob-fitzpatrick` (business; also sales).
- Skills, from the book's methods: who to talk to first, the questions to ask, running and noting the talk, reading the notes for real signals, asking for a commitment, and setting up talks in the first place.
- Workflow: **Find out if your idea is worth building**, which runs those skills in order and ends with a go, change or stop call grounded in what people did, not what they said.

## Subtasks

1. **Test first.** Before and after the changes: `tools/check-minds.mjs`, `tools/lint-pages.mjs`, the site build and the e2e suite.
2. **Enrich all minds.** Helpers (Sonnet, subscription) take 8 minds each, read the sources, and rewrite knowledge, personality and playbook. They also propose skills and links to existing skills, written to the scratchpad, not the repo.
3. **Merge the proposals.** Drop duplicates, merge any that match an existing skill (link instead), and settle the final list.
4. **Write the skills.** Helpers write each agreed skill in the house format, grouped by job so the voice stays even.
5. **Rob Fitzpatrick, the Mom Test skills and the workflow.**
6. **Site:** `minds:` field, the reverse list on mind pages, the pack download, "Who can help with this", the new jobs and groups.
7. **Judge a few hires.** Helpers play a user with a real job, run a mind and one of its skills, and a separate helper judges the answer: did it do the job, does it sound like the person, did it invent anything.
8. **Report** thin sources and what the judges found. Commit and push.

## Done when

- `node tools/check-minds.mjs`, `node tools/lint-pages.mjs`, `npm --prefix site run build` and the e2e suite pass.
- Every new skill has at least one mind, and every mind page lists its skills.
- The pack downloads with the files above.
- `rob-fitzpatrick`, the Mom Test skills and the validation workflow are live in the library.
- A judging report and a thin-sources list are in `reports/`.

## Added during the sprint: sources become workflows

Kevin asked for long sources to become workflows, not loose skills. The process is in `docs/INTAKE.md`.
- **Pass 1, the skeleton:** the steps a source teaches, in its order, saved as `intake/<id>/skeleton.yaml` and checked with `node tools/intake.mjs check`.
- **Pass 2, the skills:** one skill per step, reusing library skills where they fit.
- **Pass 3, the workflow:** `node tools/intake.mjs workflow <id>` writes the workflow. Its page is then polished by hand, and removing `draft_from` stops the tool overwriting it.

Workflow pages list their skills, and each skill page lists the workflows that use it. Mind pages list the workflows from that person's work.

**On the site** (`/from-a-source`), nothing is generated. You paste a source and download a pack: your text, the framework, the library list and a HANDOFF.md. Your own AI then runs the three passes.

**Library workflows:** existing skills, chained into workflows from library-only skeletons (`intake/lib-*`).

## Outcome (2026-10-20)

- **Proposals:** helpers proposed 440 skills from the minds' sources. The plan merged 72 and dropped 52, and 316 went to writers. With merges, 321 new skills are in the library.
- **Workflows:** 62 new. 39 come from sources (38 generated, plus The Mom Test by hand), and 23 are library chains.
- **Links:** 355 skills carry `minds:`, and 246 of 304 minds list skills on their page.
- **Checks:** all 304 minds pass `check-minds --all --playbook`. lint-pages passes all 553 pages.
- **Judging:** 4 hires averaged 4.2 out of 5, all "hire with fixes". The fixes are made. See `reports/2026-10-20-source-skills-judging.md`.
- **Thin sources:** 211 minds, listed in `reports/2026-10-21-thin-sources.md`.
