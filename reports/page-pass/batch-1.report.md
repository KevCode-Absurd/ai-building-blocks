# Page pass, batch 1

19 blocks done. Each has a new page.yaml (with `output_shape` placed just before `example`), a rewritten SKILL.md, and, for the 6 blocks that have one, a rewritten boards/ecommerce.md. Every example uses `sprout`, run by following the SKILL.md steps on facts from `knowledge/example-businesses/sprout/` only. No item.yaml, folder names or knowledge files were touched.

Checks run on every page: it parses with site/node_modules/yaml; it has no banned word, em dash, emoji or leftover Morrow/Ledgerly/Hale mention; its field lengths match PAGE-FORMAT.md; new_slug matches the name; SKILL.md `name` matches new_slug; example input is 25 lines or fewer, output 70 or fewer; monospace lines are 72 characters or fewer. Every character and word count stated in an example was checked with a script.

## Renames

| Old slug | new_slug | Job |
|---|---|---|
| ad-copy-brand-voice-check | check-ad-copy-sounds-like-your-brand | check-ads |
| ad-copy-sell-pass | fix-ad-lines-that-dont-sell | write-ad-copy |
| ad-hook-opener-shape-bank | write-ten-different-openings-for-one-ad | write-ad-copy |
| ad-writing-principles-plain-spoken | write-ads-that-sound-like-a-person-talking | write-ad-copy |
| advertorial-static-ad-script-format-rules | write-an-article-style-image-ad | write-ad-copy |
| buyer-read-before-writing-copy | describe-your-buyer-before-you-write | understand-customers |
| buyer-readiness-stage-ad-briefs | match-an-ad-to-what-the-buyer-knows | write-ad-copy |
| copy-draft-edit-and-repair-pass | edit-a-draft-without-losing-what-works | write-ad-copy |
| copy-final-sweep-fifteen-questions | check-finished-copy-with-15-questions | check-ads |
| headline-and-image-words-writer | write-plain-headlines-and-image-words | write-ad-copy |
| long-copy-ad-script-format-rules | write-a-long-story-ad-under-a-photo | write-ad-copy |
| long-story-copy-for-cold-buyers | tell-the-buyers-problem-as-a-story | write-ad-copy |
| machine-sounding-copy-tells-check | find-lines-that-sound-written-by-ai | check-ads |
| persuasive-body-copy-with-proof-and-close | write-the-body-and-close-of-sales-copy | write-landing-page |
| plain-copy-priority-order | put-plain-words-before-clever-ones | write-ad-copy |
| sales-opening-picker-six-leads | choose-how-your-sales-copy-opens | write-ad-copy |
| scroll-stopping-hook-writer-and-grader | write-and-grade-hooks-that-stop-scrolling | write-ad-copy |
| selling-points-list-writer | turn-features-into-selling-points | write-ad-copy |
| static-ad-copy-from-visual-and-awareness | write-all-the-text-for-an-image-ad | write-ad-copy |

"Check ad copy sounds like your brand" matches the name the model page already links to.

## Near-duplicates and merge candidates

1. **Long problem stories.** `write-a-long-story-ad-under-a-photo` and `tell-the-buyers-problem-as-a-story` both tell the problem at length and bring the product in late. The first is tied to one format (a plain photo plus main text). The second works in any channel. Step 3 of `write-ads-that-sound-like-a-person-talking` and the "long story" option in `write-all-the-text-for-an-image-ad` cover the same ground again. Merge candidate: one story skill, with the photo brief as a board or an option.
2. **Openings.** `write-ten-different-openings-for-one-ad` (a bank of 33 fill-in shapes), `write-and-grade-hooks-that-stop-scrolling` (start from the stuck belief, plus grading) and `choose-how-your-sales-copy-opens` (six ways in, two openings). They're distinct enough to keep, but a visitor will struggle to choose. Worth a "which one?" line on each page, or a small workflow.
3. **Line editors.** `fix-ad-lines-that-dont-sell` and `edit-a-draft-without-losing-what-works` both hand back 0 to 5 changes, each with the failing phrase, the reason and the corrected text. The second has a wider scope (any copy, keepers, a "costs" test). Strong merge candidate.
4. **Plain-speech rules.** The five-rule order in `put-plain-words-before-clever-ones` is repeated inside `check-ad-copy-sounds-like-your-brand` (step 5) and `write-ads-that-sound-like-a-person-talking`. `find-lines-that-sound-written-by-ai` overlaps with its check mode. Keep the card, but think about having the others point to it instead of repeating it.
5. **Headlines.** `write-plain-headlines-and-image-words` overlaps with the headline part of `write-all-the-text-for-an-image-ad`.
6. **Where the buyer stands.** `describe-your-buyer-before-you-write` (step 1) and `match-an-ad-to-what-the-buyer-knows` both place the buyer on the same five-step scale. Fine as a pair, but the stage names differ slightly between them.

## Things I was unsure about

- **Coordinator change mid-batch.** On the coordinator's instruction, I dropped Morrow, Ledgerly and Hale, used sprout for all examples and added `output_shape`. My block 1 example had been written with Morrow; I replaced it. Tweaks and terms were made business-neutral.
- **Job choices.** The three format skills (article-style, long story under a photo, all the text for an image ad) are filed under write-ad-copy, not make-image-ads, because what they mostly produce is words. The body-and-close skill went to write-landing-page. Easy to flip if you'd rather spread them out.
- **Banned words inside the skills' own example lists.** I swapped them for safe equivalents. The AI-tells table now lists "level up / take it to new heights / boost" instead of "unlock / elevate / supercharge". Its stock-opener and warm-up examples are now "Now more than ever" and "Let's be real:". The kettle example in the rule card no longer says "Elevate". The meaning is unchanged.
- **`references/shapes.md`** (in the openings bank) was not rewritten, since the brief covered page.yaml, SKILL.md and boards only. It still uses shorthand like "RP" and "RPF". It may need a plain-language pass.
- **One brand line, two verdicts.** "Rip. Tip. Enjoy." is kept by the AI-tells check (the brand really uses it, and it reads as instructions) but rewritten into a sentence by the plain-words card (a stranger wouldn't know what to rip). Each follows its own SKILL.md, but a reader comparing the two pages may notice.
- **The ten-openings example produces 8, not 10.** The speaker is an AI-made narrator and there's no founder on file, so the real-speaker shapes were skipped and marked MISSING. That's the skill working as written, but the name promises ten.
- **Sprout data gaps.** The examples state these as MISSING instead of guessing: Kids nutrient amounts (not captured), grams of sugar, why methylfolate matters, and what pre-purchase buyers use now.
- **Emoji removed.** The real ad text used in the 15-questions example had emoji. I removed them and said so in the input.
- **Cross-references.** Skills outside this batch are described in plain words (for example "a read-aloud polish for scripts"), because I don't know their new names yet.

## Sweep

Outcome names, summaries, headlines and subheads rewritten per brand/COPYWRITING.md; `test` added after `judge`; `improve` rewritten as "Improve it for your business" (what to edit in the skill file, what to save to the brand file, what to pair it with). SKILL.md `name` and H1 updated, and the H1 of the 6 boards/ecommerce.md files. All examples were already Sprout with `output_shape`, so they were kept as run. Cross-references inside SKILL.md ("write it first with ...") now use the new buyer-note name. `node tools/lint-pages.mjs`: all 19 pages clean.

| Old slug | Final new_slug | New name |
|---|---|---|
| ad-copy-brand-voice-check | make-every-ad-sound-like-your-brand | Make sure every ad sounds like your brand |
| ad-copy-sell-pass | get-an-ad-where-every-line-sells | Get an ad where every line sells |
| ad-hook-opener-shape-bank | get-openings-that-each-try-something-different | Get openings to test that each try something different |
| ad-writing-principles-plain-spoken | write-ads-that-sound-like-a-friend | Write ads that sound like a friend talking |
| advertorial-static-ad-script-format-rules | turn-your-idea-into-an-article-style-ad | Turn your idea into an article-style image ad |
| buyer-read-before-writing-copy | know-who-youre-writing-for | Know who you're writing for before you start |
| buyer-readiness-stage-ad-briefs | know-how-your-ad-should-open | Know how your ad should open and ask |
| copy-draft-edit-and-repair-pass | edit-a-draft-so-it-sells | Edit a draft so it reads clean and sells |
| copy-final-sweep-fifteen-questions | know-if-your-copy-is-ready | Know if your copy is ready, in 15 questions |
| headline-and-image-words-writer | get-headlines-strangers-understand-at-a-glance | Get headlines a stranger understands at a glance |
| long-copy-ad-script-format-rules | write-story-ads-that-read-like-real-posts | Write story ads that read like real posts |
| long-story-copy-for-cold-buyers | tell-the-problem-so-buyers-see-themselves | Tell your buyer's problem so well they see themselves |
| machine-sounding-copy-tells-check | stop-your-copy-sounding-like-ai | Stop your copy from sounding like AI |
| persuasive-body-copy-with-proof-and-close | finish-your-sales-page-with-proof | Finish your sales page with proof and one ask |
| plain-copy-priority-order | keep-clever-lines-from-beating-clear-ones | Keep clever lines from beating clear ones |
| sales-opening-picker-six-leads | open-sales-copy-the-way-buyers-need | Open your sales copy the way your buyer needs |
| scroll-stopping-hook-writer-and-grader | stop-the-right-people-scrolling | Stop the right people scrolling past your ad |
| selling-points-list-writer | turn-features-into-reasons-to-buy | Turn features into reasons to buy |
| static-ad-copy-from-visual-and-awareness | get-every-word-your-image-ad-needs | Get every word your image ad needs |

Notes:
- "Make sure every ad sounds like your brand" matches the name the model page and the COPYWRITING table already use. "Edit a draft so it reads clean and sells" matches the copy editing skill named in brand/COPYWRITING.md.
- The openings skill no longer promises ten in its name or headline (its Sprout run writes 8; the skill says "about ten").
- Slugs were shortened where the name ran past 7 words, so a few slugs differ from the name (for example know-how-your-ad-should-open).
- Small fixes outside the four copy fields, to pass CHECKLIST.md: removed "really", "very" and "almost" from page prose (explain, when, you_give, how_it_works, tweaks, judge). Words inside example outputs and customer quotes were left as run.
