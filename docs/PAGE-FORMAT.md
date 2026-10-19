# Block page format

Every block (prompt, skill or workflow) has its own page on the site. The page is built from `page.yaml` in the block's folder, plus the block's `SKILL.md`. Read `brand/COPYWRITING.md` (headline and name rules, these win) and `docs/WRITING.md` (plain words, our jargon) first. The model to copy is `catalogue-items/general/write-ads-people-believe/page.yaml`.

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
| `name` | The job it does, verb first, sentence case. See WRITING.md, "Names". | 6 words or fewer if you can, 8 max |
| `summary` | The card line: what you get, plainly. | 18 words max |
| `job` | One job id from the table above. | |
| `headline` | Short and to the point: the problem it solves or the result you get, in words a stranger understands on one read. No "because" clauses; the subhead explains. | 4 to 10 words |
| `subhead` | Explains the headline: what you give it, what it does, what you get. | 25 to 50 words |
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

## boards/ecommerce.md

If the block has one, rewrite it in plain language too. It's the "For online stores" add-on: extra steps for selling physical products online.

## item.yaml

Don't edit its names or ports by hand. One field is written here on purpose: `credits`, a list of `{title, by, url, used}` for the public sources the block was built from (videos, articles, books, docs). It shows on the page as **Built with ideas from**. A second field, `twin`, names the block that makes the same look in the other format (a video script block names its image block). It is written on one side only; the build fills in the other, and the page shows "Image ad" or "Video ad" with a link to the twin. Never credit or name Ecommerce OS or a paid course; Blue Sense Digital's public masterclass is the one course-type source credited. The build reads `name`, `summary` and `job` from page.yaml, and the folder rename is done afterwards by `tools/apply-renames.mjs`.

## Writing it

Use the `plain-writing` skill (`.claude/skills/plain-writing/SKILL.md`): grade 10 reading level at most, the brand voice, and only claims the skill really makes. Then check the page:

```
node tools/lint-pages.mjs
node tools/reading-level.mjs <slug>
```
