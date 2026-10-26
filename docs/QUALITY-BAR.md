# Quality bar for every catalogue item

Every skill, prompt, agent, workflow, mind and AI tool page on useaiblocks.com must be the most useful version of itself. A visitor should understand the item from start to finish: what they get, whether it fits their situation, what to gather, how to run it, what good output looks like, and what to do after. No two pages should read alike.

Written 2026-10-26 after the catalogue screen (`reports/2026-10-26-catalogue-screen.json`). The most common problems were: no "when not to use" (82% of items), no example (71%), boilerplate shared with other pages (46%), vague steps (34%), no next step (32%), broken or missing instructions (31%).

Write in the voice of `.claude/skills/plain-writing/SKILL.md`, on top of `brand/COPYWRITING.md`. Grade 10 reading level at most. No hype, no AI tells, no em dashes in page copy.

## Priorities, in order (Kevin, 2026-10-26)

1. **The visitor understands it, without feeling overwhelmed.** On one read they know what this is, whether it fits their own work or life, what to put in, and what they get. Fewer, clearer words beat more words. If a list runs past 5 items, keep the 5 that matter most.
2. **Search engines find it.** Plain search phrases in the name and summary, unique text per page, real content in the HTML. SEO never wins over clarity: no keyword stuffing, no extra sections written for Google.

## Easy for anyone

Kevin, 2026-10-26: every page must be easy to understand for any visitor, and SEO-focused. The top of the page (summary, subhead, when, not_for, you_give, you_get, how_to_use, output_sample) reads at grade 8 or lower: short sentences, everyday words, one idea per line, lists of 3 to 6 items, no unexplained jargon. Technical detail belongs in SKILL.md, `how_it_works` and `terms`, which sit under Details.

## The test a finished page must pass

Read only the page. Can a busy owner who has never used this item answer these?

1. **What do I get?** A concrete result, named: "a 30-row frame map and a new script", not "insights".
2. **Is it for me?** When to reach for it, and when to skip it and what to use instead.
3. **What do I bring?** Each input named concretely, with where to find it. Optional inputs marked optional.
4. **How do I run it?** Steps a person can follow, in order, in their AI tool. No step says only "follow the skill".
5. **What does good look like?** What goes in, and each file or section you get with what it contains.
6. **What next?** What to do with the result, and which item pairs with it.

## Fields in page.yaml (skills, prompts, agents)

Improve what's there. Add what's missing. Keep the field names exactly.

| Field | Bar |
|---|---|
| `name`, `headline` | The item's job title, e.g. "Ad angle planner". The headline is the name. Change only if it misleads. |
| `summary` | One or two sentences: what you give, what you get. Under 160 characters. |
| `subhead` | Two or three sentences: input, what it does, the result. Specific nouns. |
| `explain` | Two or three short paragraphs: the problem it solves, how it thinks, what makes it different from the obvious approach. Specific to this item; no paragraph that could sit on another page. |
| `when` | 3 to 4 concrete situations, each a real moment ("A teammate says 'make one like this'"). |
| `not_for` | **New.** 2 to 3 situations where this is the wrong tool, each naming what to use instead when a better item exists ("You only want the idea behind an ad: use the ad idea extractor"). |
| `you_give` | Each input concrete, with where to get it. Mark optional ones "(optional)". |
| `you_get` | Each result concrete and checkable. |
| `how_to_use` | 3 to 6 steps for a person in Claude, ChatGPT or Gemini: open or paste the skill, what to paste and in what order, what to check first in the result, what to fix before using it. Say when the item needs code running, files, web access or a paid tool. |
| `how_it_works` | 4 to 7 titled steps describing what the AI does, true to SKILL.md. |
| `output_shape` | The real layout of the result, with placeholders in `<angle brackets>`. |
| `output_sample` | **New. Replaces the old `worked_example`.** What goes in and what comes out, taken from SKILL.md. No test data, no made-up brand, no fake figures. `input`: list of what you put in ("Your website link", "Your last 3 months of reviews (optional)"). `prerequisites`: list of anything needed first ("An AI that can read files", "Your brand brain from the Brand brain builder"); omit if none. `output`: list of `{ name, contains }`, one per file, section or deliverable the skill produces, in order: `name` is the real file or section name from SKILL.md ("customers.md", "Frame map"), `contains` is one plain sentence (under 20 words) on what's inside it. Keep `input` to 2 to 5 items and `output` to the real deliverables (usually 3 to 8). |
| `works_best_with` | Which AI tools suit it and why, and extra inputs that help. |
| `terms` | Any word a newcomer wouldn't know, explained in a few words. |

Leave these alone: `new_slug`, `job`, `example` (the test input used by `tools/test-blocks.mjs`), `judge`, `test`, `thinking`, and every file the tests own (`item.yaml` `tested:` block, `tests/`, `runs/`).

## SKILL.md

The skill file is the product. Fix it when the screen or judge found a real problem:

- Steps that are vague, contradictory or impossible in a chat AI.
- No defined output format, or a format that doesn't match `output_shape`.
- Missing guard rails: what to do when an input is missing (ask once, or mark it MISSING; never invent), when to stop.
- Invented facts, fake stats, made-up sources.
- Instructions that need tools the page doesn't mention (code running, web search, installs, paid APIs). Either say so on the page or add a no-tools fallback.

Keep the skill's method and credits. Don't pad it; shorter and sharper beats longer. Keep YAML front matter valid.

## Workflows, minds and AI tool pages

- **Workflows** (`tools/orchestrator-pages/<slug>.yaml`, `catalogue-items/orchestrators/<slug>/`): the same page bar, plus each step's note says what that step hands to the next, and the page says where a person should check work before it moves on.
- **Minds** (`catalogue-items/minds/<slug>/`): the jobs you'd hire them for are concrete; the questions they'd ask are their own, not generic; the page is honest that it's an AI interpretation built from public work.
- **AI tool pages** (`catalogue-items/ai-tools/<slug>.yaml`): what it's best at, who it's for, what it costs as of the date checked, and which AI Blocks items use it. Never invent prices or features; mark anything unverified.

## Search engines (SEO)

The page must answer what someone typed into Google, in their words.

- `name`/`headline`: the plain job title people search for ("Meta ad rejection checker", "invoice reconciliation workflow"), not a clever name.
- `summary` becomes the meta description: 120 to 155 characters, starts with the outcome, includes the main search phrase once, no keyword stuffing.
- `subhead` and the first paragraph of `explain` use the main phrase and one or two natural variants ("ad copy checker", "check ad copy before you publish").
- `when` and `not_for` name real situations and tools people search for (Shopify, Meta Ads, QuickBooks, Google Sheets) where they're true for this item.
- `output_sample` and `not_for` give the page unique, useful text; together with a specific `when` they separate near-identical pages.
- `not_for` and `how_to_use` should name sibling items by their exact names so internal links can be built from them.

## Workflow steps

A workflow is only as good as its steps. For each workflow, check every step is the best item in the catalogue for that job (search the library for alternatives), that each step's output is what the next step needs, and that no step is missing or redundant. Swap in a better item when one exists, and say what each step hands to the next.

## Distinct pages

Before writing, read two sibling items in the same job. If your text could be pasted onto them, rewrite it. Use the item's own method, inputs and failure modes. Vary sentence openings across fields.

## Facts

Never invent statistics, studies, quotes, customer results, prices or features. If a claim needs a source the item doesn't have, cut it or mark it as something to check.

## Check before you hand back

Run `node tools/check-pages.mjs <slug> [<slug> ...]` (YAML parses, required fields present, `not_for` and `output_sample` shaped right, no em dashes in page copy, no banned words). Fix anything it flags.

## Lessons from the pilot (2026-10-26)

- **Output sample, not a test (Kevin, 2026-10-26).** Kevin doesn't want made-up test inputs or sample brands. The page shows what goes in and what you get: e.g. a brand brain skill takes your website link and gives you 8 files (customers.md, voice.md, ...), each with a line on what it holds. Read the names and contents from SKILL.md's output section. Don't create or edit test inputs (`example` field); testing is paused. If a page already has `output_sample`, replace it with `output_sample`.
- **`you_give` holds inputs only.** Put caveats ("without an earlier period it can't call a drop") in `not_for` or `how_to_use`, not as a list item.
- **Ports drive "Before you start" and "After this".** Those links come from `item.yaml` `inputs`/`outputs`, not from SKILL.md. When a page shows unrelated before/after links (a finance workflow suggesting a "buyer brief"), fix the item's `inputs`/`outputs` to what it really takes and makes. Don't touch the `tested:` block.
- **Duplicates.** If two items have the same summary or do the same job, make each page say how it differs and point to the other in `not_for`. Note true duplicates in your report rather than deleting anything.
- **Minds.** Page text comes from `mind.yaml`, `playbook.md`, `knowledge.md` and `personality.md`; regenerate SKILL.md with `node tools/build-minds.mjs <slug>` and check with `node tools/check-minds.mjs --playbook`. Jobs and ideas come from the person's public work; label anything we extended as ours.
- **AI tool pages.** The schema is fixed (bullet counts, required fields). Verify prices and features on the vendor's own pages, write "checked 26 Oct 2026" next to verified facts, and list anything unconfirmed under `not_verified`.

## Patch or rewrite

The queue (`reports/rewrite-queue/`) gives each item a tier.

- **patch** (screen score 45 to 74): keep the name, method and wording that work. Add `not_for` and `output_sample`, apply the screen's fix notes, tighten the summary for search, and fix any field that breaks the bar. Don't research or restructure. Aim for about 10 minutes.
- **rewrite** (score under 45, or the item failed its test): rework the page and SKILL.md to the full bar, using the screen notes and the test grade (`runs/block-tests/2026-10-26/grades/<slug>.json`) as evidence.
