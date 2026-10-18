# Batch 7 report

22 blocks. Each has a new page.yaml (with `output_shape` placed before `example`), a rewritten SKILL.md and, where one existed, a rewritten boards/ecommerce.md (17 boards). All examples use `sprout` only. Every page.yaml parses with the site's yaml package.

## Renames

| Old slug | new_slug | job |
|---|---|---|
| claymation-mechanism-video-ad-director | turn-claymation-script-into-video-shots | make-video-ads |
| claymation-story-ad-script-format-rules | write-claymation-video-ad-script | make-video-ads |
| code-rendered-product-offer-reel | build-product-offer-reel-in-code | make-video-ads |
| collage-explainer-video-ad-director | turn-cutout-explainer-script-into-video-shots | make-video-ads |
| comic-page-ad-script-format-rules | write-comic-page-video-ad-script | make-video-ads |
| comic-page-desk-video-ad-director | turn-comic-page-script-into-video-shots | make-video-ads |
| cutout-argument-ad-script-format-rules | write-cutout-explainer-video-ad-script | make-video-ads |
| founder-decision-ad-script-format-rules | write-founder-video-ad-script | make-video-ads |
| knitted-wool-ad-script-format-rules | write-knitted-wool-video-ad-script | make-video-ads |
| knitted-wool-video-ad-director | turn-knitted-wool-script-into-video-shots | make-video-ads |
| long-narrated-video-ad-script-format-rules | write-long-narrated-video-ad-script | make-video-ads |
| motion-graphics-video-ad-director | turn-motion-graphics-script-into-video-shots | make-video-ads |
| paper-world-ad-script-format-rules | write-paper-world-video-ad-script | make-video-ads |
| paper-world-video-ad-director | turn-paper-world-script-into-video-shots | make-video-ads |
| podcast-clip-ad-script-format-rules | write-podcast-clip-video-ad-script | make-video-ads |
| podcast-clip-video-ad-director | turn-podcast-clip-script-into-video-shots | make-video-ads |
| product-graphic-ad-script-format-rules | write-motion-graphics-video-ad-script | make-video-ads |
| read-aloud-script-polish | make-script-easy-to-say-aloud | make-video-ads |
| reference-ad-structure-script-rewrite | remake-reference-ad-with-your-own-facts | study-competitors |
| satisfying-motion-ad-script-format-rules (ecommerce) | write-satisfying-motion-video-ad-script | make-video-ads |
| script-format-fit-advisor | pick-right-format-for-your-script | make-video-ads |
| script-from-reference-idea | write-new-script-inspired-by-ad | study-competitors |

Slugs drop "a", "the" and "an" from the name (for example "Turn a claymation script..." becomes `turn-claymation-script-...`).

## Pairs and naming

- Script and shots pairs, named to the batch pattern: claymation, comic page, knitted wool, paper world, podcast clip, motion graphics, cutout explainer.
- `product-graphic-ad-script-format-rules` is the script half of the motion graphics pair, so it's named "Write a motion graphics video ad script" to match "Turn a motion graphics script into video shots".
- `cutout-argument-ad-script-format-rules` and `collage-explainer-video-ad-director` are a pair. I named both "cutout explainer" so they don't get mixed up with the paper world pair (paper world also has a "collage" look).
- The examples for each pair run in a chain: the shots page's input is the script page's output.

## Possible merges or near-duplicates

- **Paper world script vs cutout explainer script.** Paper world's `collage` look overlaps with the cutout explainer. They do different jobs (a story vs one argument), but the collage look could be dropped from paper world and readers sent to the cutout explainer pair.
- **Remake a reference ad vs Write a new script inspired by an ad.** These are deliberately opposite (keep the structure vs keep only the idea). Keep both, but cross-link them. Both pages already point to each other.
- **Motion graphics shots vs Build a product offer reel in code.** Both make flat graphic product reels. One generates wordless plates with an AI tool; the other builds the whole reel in code. Worth one line on each page saying which to pick.
- **Pick the right format for your script** overlaps with the "check fit" step that starts every script skill. It's still useful on its own, as the step before choosing a style.

## Things I was unsure about

- **Job for the two reference skills.** I filed them under `study-competitors` ("remaking a style in your own way"). If you'd rather keep all script writing together, move them to `make-video-ads`.
- **Read-aloud polish job.** Filed under `make-video-ads`; it also fits `check-ads` or `write-ad-copy`, since it works on read ad text too.
- **Code reel `how_to_use`.** It needs an AI tool that can run code, so step 1 adds "such as Claude Code" after the required opening sentence.
- **Linked skill names.** `script-from-reference-idea` depends on `video-ad-script-from-customer-research`, and `read-aloud-script-polish` lists `machine-sounding-copy-tells-check` in its item.yaml. Both are in other batches. The SKILL.md describes the first one in plain words ("the skill that writes a video ad script from customer research") instead of using its old slug. Update it once that block's new name is fixed.
- **Banned words in the read-aloud skill.** The original listed "game-changer", "elevate", "seamless", "unlock" and "journey" as words to remove. Our writing rules ban those words, so I swapped in other examples ("must-have", "level up your", "transform your", "say goodbye to"). The SKILL.md still names "it's not X, it's Y" as a pattern to remove. That's a mention, not a use.
- **Reference example input.** The reference-rewrite example needs a reference ad, and the sprout files have no full breakdown of one. The input uses a short made-up meal-planning app ad, clearly labelled as described and not Sprout's. All of the output is from sprout's files.
- **Sprout facts that kept coming up MISSING:** what a single daily pack looks like (colour, printing), the pouch's height, the colour of the "28 Daily Packs" text, the logo and font files, and a photo that shows the testing. These show as MISSING in several examples. Adding them to sprout/brand.md would make the video examples stronger.
- **Founder example.** Sprout has no founder material and no people on file, so the run says the ad can't be made yet and writes only questions for the founder plus the shape of the brief. I think that's the honest result and a useful one to show.
- **Example output lengths.** Several director outputs are cut to the opening still and the first clip or two, ending with "(cut for length: ...)", to stay under 70 lines.

## Sweep

Outcome copy pass on all 22 pages: new `name`, `summary`, `headline`, `subhead` and `new_slug`; a `test` block after `judge`; `improve` rewritten as "Improve it for your business" (edits to the skill file, what to save to the brand file, and what to pair it with, described by what it does). SKILL.md frontmatter `name` and H1 updated. Cross-references to sibling names inside these pages were updated. All examples were already on Sprout with `output_shape`, so none were rerun. `node tools/lint-pages.mjs` shows no issues for these pages.

| Old slug | Final new_slug | New name |
|---|---|---|
| claymation-mechanism-video-ad-director | turn-claymation-script-into-ready-video-shots | Turn your claymation script into ready-to-make video shots |
| claymation-story-ad-script-format-rules | get-claymation-ad-script-that-sells | Get a claymation ad script that sells |
| code-rendered-product-offer-reel | get-offer-reel-that-shows-your-real-product | Get an offer reel that shows your real product |
| collage-explainer-video-ad-director | turn-cutout-explainer-script-into-ready-video-shots | Turn your cutout explainer script into ready-to-make video shots |
| comic-page-ad-script-format-rules | get-comic-page-ad-script-that-sells | Get a comic page ad script that sells |
| comic-page-desk-video-ad-director | turn-comic-page-script-into-ready-video-shots | Turn your comic page script into ready-to-make video shots |
| cutout-argument-ad-script-format-rules | get-cutout-explainer-ad-script-that-sells | Get a cutout explainer ad script that sells |
| founder-decision-ad-script-format-rules | get-founder-ad-script-people-believe | Get a founder ad script people believe |
| knitted-wool-ad-script-format-rules | get-knitted-wool-ad-script-that-sells | Get a knitted wool ad script that sells |
| knitted-wool-video-ad-director | turn-knitted-wool-script-into-ready-video-shots | Turn your knitted wool script into ready-to-make video shots |
| long-narrated-video-ad-script-format-rules | get-long-narrated-ad-script-that-sells | Get a long narrated ad script that sells |
| motion-graphics-video-ad-director | turn-motion-graphics-script-into-ready-video-shots | Turn your motion graphics script into ready-to-make video shots |
| paper-world-ad-script-format-rules | get-paper-world-ad-script-that-sells | Get a paper world ad script that sells |
| paper-world-video-ad-director | turn-paper-world-script-into-ready-video-shots | Turn your paper world script into ready-to-make video shots |
| podcast-clip-ad-script-format-rules | get-podcast-clip-ad-script-that-sells | Get a podcast clip ad script that sells |
| podcast-clip-video-ad-director | turn-podcast-clip-script-into-ready-video-shots | Turn your podcast clip script into ready-to-make video shots |
| product-graphic-ad-script-format-rules | get-motion-graphics-ad-script-that-sells | Get a motion graphics ad script that sells |
| read-aloud-script-polish | get-script-presenter-can-say-without-stumbling | Get a script your presenter can say without stumbling |
| reference-ad-structure-script-rewrite | borrow-structure-of-ad-you-admire | Borrow the structure of an ad you admire |
| satisfying-motion-ad-script-format-rules | get-satisfying-motion-ad-script-that-sells | Get a satisfying motion ad script that sells |
| script-format-fit-advisor | know-which-ad-format-your-script-needs | Know which ad format your script needs |
| script-from-reference-idea | get-fresh-script-from-why-ad-worked | Get a fresh script from why an ad worked |

Notes:

- **Shots pattern changed from the brief.** "Turn your claymation script into shots a video tool can make" is 11 words, which fails the lint (10 max) and the 4 to 9 word rule, and two-word styles (knitted wool, paper world) make it 12. I used "Turn your <style> script into ready-to-make video shots" (8 or 9 words) and slugs `turn-<style>-script-into-ready-video-shots`. Scripts use "Get a <style> ad script that sells". If other batches settle on a different shots wording, swap it in here so all pairs match.
- **Non-pair pages** got specific outcomes rather than "that sells": founder ("people believe"), offer reel, read-aloud, format fit and the two reference skills.
- **Reference example** still uses a short described meal-planning app ad as the reference input (labelled, not Sprout). Everything in the output comes from Sprout files.
- Other batches that quote these blocks by their old names (for example "Write a claymation video ad script") will need updating to the names above.
- Cut "really" and "very" from page copy where they were qualifiers. "What almost stops them" (meaning objections) and "very close" (a camera framing) were left in SKILL.md files on purpose.
