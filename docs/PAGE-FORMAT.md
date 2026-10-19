# Block page format

Every block (prompt, skill or workflow) has its own page on the site. The page is built from `page.yaml` in the block's folder, plus the block's `SKILL.md`. Read `brand/COPYWRITING.md` (headline and name rules, these win) and `docs/WRITING.md` (plain words, our jargon) first. The model to copy is `catalogue-items/general/meta-ads-compliance-checker/page.yaml`.

## Jobs

Each block is filed under the one job a visitor hires it for. Use the id.

| id | Shown as | Covers |
|---|---|---|
| `write-ad-copy` | Write ad copy | Ad text, headlines, hooks, editing and checking copy |
| `make-image-ads` | Make image ads | Image ad ideas, layouts, image prompts, native-looking ad images |
| `make-video-ads` | Make video ads | Video scripts, styles, shot lists, captions, editing plans |
| `plan-ad-tests` | Plan what ads to test | Concept grids, test sprints, finding gaps in what you run |
| `check-ads` | Check ads before they go live | Policy, brand voice, quality and mistake checks |
| `read-ad-results` | Read your ad results | Meta and Google results, why ads dropped, what to make next |
| `audit-landing-page` | Audit a landing page | Finding why visitors don't buy, page reviews, checklists |
| `write-landing-page` | Write and build a landing page | Page copy, layout, design direction, building it in Shopify |
| `product-photos` | Make product photos | Photo sets, product page galleries, photo checks |
| `understand-customers` | Understand your customers | Reviews into buying reasons, objections, buyer research |
| `brand-file` | Set up your brand file | Collecting your facts, voice, claims and guide in one place |
| `study-competitors` | Study competitor ads | Swipe boards, teardowns, remaking a style in your own way |
| `make-offer` | Make an offer people want | Offers, bundles, guarantees from real buyer doubts |
| `grow-social` | Grow on social | Organic videos, founder series, creator seeding |
| `set-up-ai` | Set up AI to work for you | How to pass work between AI steps, context files |

## Page order

1. Headline (the outcome), subhead, actions
2. **See it work**: the real output first, then what went in
3. **Add it to your AI** (skills and prompts): tabs for Claude, Claude Code, ChatGPT, Gemini and any other AI. Installing is the default, because an installed skill is reused by name every time; copy and paste is the fallback. Built by the site, nothing to write in page.yaml.
4. **What it does** (explain, when, step by step)
5. **What you give it, what you get** (with the output shape)
6. **How to use it**
7. **What changes the result most** (tweaks)
8. **Test it** (judge, test)
9. **Works best with** (works_best_with)
10. **Improve it for your business** (improve)
11. Words on this page, **Built with ideas from** (item.yaml `credits`), the full skill file, run before and after

## page.yaml fields

| Field | What goes in it | Length |
|---|---|---|
| `new_slug` | The new name in lowercase-with-dashes. Must match `name`. | |
| `name` | The job title, as if you were hiring it: "Meta ads compliance checker". See `brand/COPYWRITING.md`, "Names and headlines of blocks". Workflows keep verb-first names. | 2 to 5 words |
| `summary` | The card line: what you give, then what you get, including the score when the skill has one. "Paste your ad and its image. Get a compliance score out of 100, every problem, and a fixed ad." | 18 words max |
| `job` | One job id from the table above. | |
| `headline` | Skills and prompts: the same as `name`. Workflows: the result you get, in words a stranger understands on one read. | 2 to 10 words |
| `subhead` | The job description, in two or three short sentences: what you give it, what it does, what you get (name the real outputs, and the score if it has one). | 25 to 50 words |
| `explain` | Two short paragraphs. The problem it solves, then how it works. Explain any term in the old name. | 80 to 150 words |
| `when` | Three situations where you'd reach for it. | 3 bullets |
| `you_give` | What you give it, in plain words. Mark optional ones "(optional)". | 2 to 5 bullets |
| `you_get` | What you get back. | 2 to 4 bullets |
| `how_to_use` | Numbered steps a beginner follows, starting with "Start a chat with the skill. Open it if you added it to your AI, or copy it and paste it in." Specific to this skill. | 3 to 6 steps |
| `how_it_works` | What the AI does, step by step, mirroring the SKILL.md steps. Each step: `title` (2 to 5 words) and `text` (one or two sentences). | 3 to 8 steps |
| `output_shape` | The general layout of what it hands back, with `<placeholders>` for each part, so readers see what they'll get for any business. | 25 lines max |
| `example` | A real run. `business` is `sprout`. `input` is what you'd paste after the skill (start with `[the skill]`). `output` is what the skill produced. | input 25 lines max, output 70 lines max |
| `tweaks` | Shown as **What changes the result most**: the inputs and settings that change the result most. Each: `what` and `how`. | 3 to 5 |
| `judge` | Shown under **Test it** as "Is the output good?": things a beginner can check in a minute. | 4 to 6 bullets |
| `test` | Shown under **Test it** as "Test it on your business": steps to try the skill on your own work before you rely on it (a case where you know the right answer, two runs to see if it's consistent, a side-by-side with your current best). Specific to this skill. | 3 to 5 steps |
| `improve` | Shown as **Improve it for your business**: how to change the skill file itself for your use case (which lines or rules to edit, what examples or brand rules to add, what to save back to your brand file), and what to pair it with. | 3 to 5 bullets |
| `works_best_with` | Shown as **Works best with**. `tools`: 1 to 4 `{name, why}` naming the real products that do this block's job best today, checked on the web (say "Any good chat AI" when any will do). `inputs`: 2 to 5 optional extras that clearly raise the result, not repeating `you_give`. | 1 to 4 tools, 2 to 5 inputs |
| `terms` | Words on the page a beginner might not know. Each: `term` and `meaning`. Leave out if none. | 0 to 5 |

For workflows, `how_it_works` lists the workflow's steps in order, each naming the skill it uses. The example shows the input to step 1 and the final output.

## The example must be real

Run the skill. Follow its SKILL.md yourself, step by step, on the example input, and paste what you produced. Do not write what an output "might" look like. Use only facts from `knowledge/example-businesses/sprout/` (a real brand, name and details changed). If the output is long, keep the most useful part and end with `(cut for length: the full run also had ...)`.

For skills that produce an image or video, the output is the text the skill produces (the plan, prompt, script or shot list). Don't describe a finished image as if it exists.

## SKILL.md

Rewrite it in plain language with the same substance. Keep the sections: a one-line description in the frontmatter, what you need, numbered steps, what you hand back, checks, "If something is missing" with `MISSING: <what>`, and avoid. Set the frontmatter `name` to the new slug. Keep every rule that protects the user (no invented facts, claims or results).

Only skills whose job is to judge something give a score out of 100: checkers, audits, scorers, comparisons and analysis of results or data (Kevin, 19 Oct 2026). A checker or audit scores what it was given (and again after its fixes). The score always says what it measures and how it was worked out. Never an unexplained number. Every other skill (writers, makers, planners, builders, editors) has no score: it runs its Checks, fixes anything that fails before handing it back, and lists any check it still missed as `CHECKS MISSED:` (or "none").

When a skill needs a picture or video, ask the person to attach it: the AI can see images. A written description is only the fallback for an AI that can't take files, and then say what couldn't be checked.

Claude writes image and video prompts but can't draw them. Every skill that hands back an image prompt, a video prompt or finished pictures gets a "Making the picture" (or "Making the video") section after "What you need": it says so in one line before the work starts, then names what finishes the job (ChatGPT, Gemini, Higgsfield, or an OpenAI or Google key in Claude Code). Don't write it by hand. Run `node tools/add-making-it.mjs` after `npm --prefix site run index`; it decides from the block's outputs, and the page shows the matching "Turn the prompt into a picture" section by the same rule.

Every skill, prompt and workflow says what comes before it and after it, so nobody starts without what makes the result good. `node tools/add-needs.mjs` (run after the index) writes two marked sections into each SKILL.md from the blocks' inputs and outputs (`tools/lib/needs.mjs`): **Before you start** (what's needed and what helps, each linked to the block that makes it on useaiblocks.com; the steps before this one, in order; which brand brain files to read; how to check in Claude Code and in a chat; what to do if one is missing; the tools that do it best) and **After this** (the AI asks what to do next and offers the paths from here, a check first after anything people will see). The page shows the same as "Before you start" and "What to do next". Don't write these by hand: to change a label, a maker or a path, edit `tools/lib/needs.mjs`.

A visual skill can show one finished picture under "What you get". Add the image to `site/public/examples/` (webp, about 720 px wide, no brand names showing) and map it in `catalogue-items/example-images.yaml`, with alt text that says what's in it. Only use a picture that really matches what the skill makes.

## boards/ecommerce.md

Not shipped or shown any more (2026-10-19). Every skill is a base skill for anyone. These notes are raw material for the online-store versions we build later, so leave them as they are. Put nothing in SKILL.md or page.yaml that only works for one industry: give examples from more than one field.

## item.yaml

Don't edit its names or ports by hand. One field is written here on purpose: `credits`, a list of `{title, by, url, used}` for the public sources the block was built from (videos, articles, books, docs). It shows on the page as **Built with ideas from**. A second field, `twin`, names the block that makes the same look in the other format (a video script block names its image block). It is written on one side only; the build fills in the other, and the page shows "Image ad" or "Video ad" with a link to the twin. Never credit or name Ecommerce OS or a paid course; Blue Sense Digital's public masterclass is the one course-type source credited. The build reads `name`, `summary` and `job` from page.yaml, and the folder rename is done afterwards by `tools/apply-renames.mjs`.

## Writing it

Use the `plain-writing` skill (`.claude/skills/plain-writing/SKILL.md`): grade 10 reading level at most, the brand voice, and only claims the skill really makes. Then check the page:

```
node tools/lint-pages.mjs
node tools/reading-level.mjs <slug>
```
