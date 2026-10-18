# Page pass, batch 4

20 blocks. Each has a new page.yaml (with `output_shape` just before `example`), a rewritten SKILL.md (frontmatter `name` = new_slug), and a rewritten boards/ecommerce.md where one existed (9 boards). Every example uses `business: sprout` and only facts from `knowledge/example-businesses/sprout/`. All 20 page.yaml files parse with the site's yaml package, and pass a length, field-count and banned-word check (no em or en dashes, no Morrow/Ledgerly/Hale left).

| Old slug | new_slug | job |
|---|---|---|
| base-product-photos-from-reference | copy-photos-look-onto-your-product | product-photos |
| candid-flash-lifestyle-photo-set | make-party-snapshot-photos-of-your-product | product-photos |
| image-prompt-from-approved-plan | turn-image-plan-into-prompt | make-image-ads |
| one-colour-world-product-photo-set | make-one-colour-product-photo-set | product-photos |
| overhead-close-portrait-image-prompt | write-overhead-close-up-portrait-prompt | make-image-ads |
| pdp-gallery-12-frame-plan | plan-product-page-photos-image-by-image | product-photos |
| pdp-gallery-image-check | check-product-page-images-before-upload | product-photos |
| pdp-gallery-image-set-workflow | build-full-product-page-gallery | product-photos |
| product-photoshoot-set-workflow | make-full-set-of-product-photos | product-photos |
| product-truth-sheet-from-photos | describe-your-product-exactly-from-its-photos | product-photos |
| single-static-image-ad-script-format-rules | turn-script-into-one-image-ad | make-image-ads |
| static-ad-image-prompt-compiler | turn-approved-ad-into-image-prompt | make-image-ads |
| swipe-carousel-ad-script-format-rules | write-swipe-carousel-ad-card-by-card | make-image-ads |
| upscale-approved-image-with-checks | make-image-bigger-without-changing-it | make-image-ads |
| creator-product-seeding-plan | send-your-product-to-small-creators | grow-social |
| founder-video-series-plan | plan-ten-weeks-of-founder-videos | grow-social |
| offer-design-from-buyer-doubts | build-offer-around-your-buyers-doubt | make-offer |
| organic-video-edit-plan-from-footage | plan-edit-for-social-video | grow-social |
| stage-context-packet-design | decide-what-each-ai-step-gets | set-up-ai |
| starter-offer-list-from-brand-facts | list-offers-from-what-you-already-have | make-offer |

## Merges and near-duplicates

- **turn-image-plan-into-prompt** and **turn-approved-ad-into-image-prompt** do the same job (approved creative into one image prompt with photo roles). The second is a compact subset of the first. Suggest merging, with "compact, for a tool with a length limit" as a tweak on the first.
- **copy-photos-look-onto-your-product** overlaps steps 4 to 6 of **make-full-set-of-product-photos** (read a reference, carry it over, test one frame). The workflow could call the skill per shot instead of restating it.
- **make-party-snapshot-photos-of-your-product** and **make-one-colour-product-photo-set** are both "a set in one look". They could become looks inside the photoshoot workflow, but they also work fine on their own.
- **check-product-page-images-before-upload** and step 8 of **make-full-set-of-product-photos** are two versions of the same full-size check. One shared check skill would be cleaner.
- **build-offer-around-your-buyers-doubt** and **list-offers-from-what-you-already-have** share the five-part offer model. They should stay separate (a quick list versus building one offer in depth). They now link to each other.

## Things I was unsure about

- **Cross-references inside SKILL.md** keep the old slug in backticks, followed by the new name in quotes, for example `product-truth-sheet-from-photos` ("Describe your product exactly from its photos"). Folders aren't renamed yet and `tools/apply-renames.mjs` doesn't exist, so the rename step needs to rewrite these backtick slugs.
- **Inputs the Sprout files don't hold.** Some examples need inputs a user would supply and the brand files don't contain. I kept them to plain descriptions with no new brand facts: photo file names (pouch-front.jpg and so on), the reference photo someone "likes" (a jar of sweets on a windowsill), the footage clips and transcript in the edit-plan example (every spoken line is a brand fact), the user's readout of finished images in the image-check example, the image file size in the upscale example, and the "rejected shaker version" notes in the prompt-compiler example. Please check that this stays within the rule.
- **Examples that stop where the skill stops.** No images were made, so the image skills show prompts, shot lists and check lists, and say plainly what wasn't run. The upscale and portrait results are marked "not run". The two workflows stop at their first approval stop.
- **Flash photo set and Sprout.** Sprout's look is bright daytime, while this skill's look is evening flash. The example says so and asks for approval of the group frames, as the skill tells it to.
- **Founder videos.** The Sprout files name no founder (on purpose), so that example is mostly questions in square brackets, and week 3 is skipped because there's no real mistake on file.
- **One-colour set count.** The old SKILL.md said "8 to 15 photographs (12 at most per set)". I standardised on 8 to 12.
- **Job for the upscale skill.** I chose make-image-ads. product-photos would also fit.
- I wrote three examples with Morrow before the switch to Sprout, then replaced all three. Their business-specific tweaks were rewritten too.

## Sweep

Final copy sweep, 18 Oct 2026. New outcome-first `name`, `summary`, `headline` and `subhead`; a new `test` list after `judge`; `improve` rewritten as "Improve it for your business" (what to edit in the skill file, or for workflows which steps to swap, add or drop and which step skill to tune, plus what to pair it with, described by what it does). Examples were already on Sprout with `output_shape`, so none were rerun. `node tools/lint-pages.mjs` reports nothing for these pages.

| Old slug | Final new_slug | New name |
|---|---|---|
| base-product-photos-from-reference | borrow-a-photos-look-for-your-product | Borrow a photo's look for your product |
| candid-flash-lifestyle-photo-set | get-product-snapshots-that-dont-look-like-ads | Get product snapshots that don't look like ads |
| image-prompt-from-approved-plan | get-images-that-match-your-plan-word-for-word | Get images that match your plan, word for word |
| one-colour-world-product-photo-set | get-product-photos-that-look-like-one-shoot | Get product photos that look like one shoot |
| overhead-close-portrait-image-prompt | get-overhead-portraits-that-still-look-human | Get overhead portraits that still look human |
| pdp-gallery-12-frame-plan | know-what-each-product-page-photo-should-show | Know what each product page photo should show |
| pdp-gallery-image-check | catch-product-page-image-mistakes-before-shoppers-do | Catch product page image mistakes before shoppers do |
| pdp-gallery-image-set-workflow | get-a-product-page-gallery-that-answers-doubts | Get a product page gallery that answers doubts |
| product-photoshoot-set-workflow | get-a-full-product-photoshoot-from-phone-photos | Get a full product photoshoot from phone photos |
| product-truth-sheet-from-photos | stop-ai-pictures-getting-your-product-wrong | Stop AI pictures getting your product wrong |
| single-static-image-ad-script-format-rules | make-an-image-ad-people-get-at-a-glance | Make an image ad people get at a glance |
| static-ad-image-prompt-compiler | stop-image-tools-redrawing-your-product-and-words | Stop image tools redrawing your product and words |
| swipe-carousel-ad-script-format-rules | make-each-carousel-card-earn-the-next-swipe | Make each carousel card earn the next swipe |
| upscale-approved-image-with-checks | get-a-sharper-bigger-image-with-nothing-changed | Get a sharper, bigger image with nothing changed |
| creator-product-seeding-plan | get-honest-videos-from-small-creators | Get honest videos from small creators |
| founder-video-series-plan | build-trust-with-ten-weeks-of-founder-videos | Build trust with ten weeks of founder videos |
| offer-design-from-buyer-doubts | get-an-offer-that-answers-your-buyers-doubt | Get an offer that answers your buyer's doubt |
| organic-video-edit-plan-from-footage | turn-raw-footage-into-a-clear-social-post | Turn raw footage into a clear social post |
| stage-context-packet-design | pass-work-between-ai-steps-without-losing-facts | Pass work between AI steps without losing facts |
| starter-offer-list-from-brand-facts | find-offers-hiding-in-what-you-already-sell | Find offers hiding in what you already sell |

Also in this sweep:
- SKILL.md frontmatter `name` and H1 match the new slug and name. Cross-references inside these 20 folders (SKILL.md, boards/ecommerce.md, page.yaml) now carry the new names; on the pages, mentions of other blocks in `how_it_works` describe what the block does instead of naming it.
- Four list items that parsed as maps (a colon mid-line) were reworded so they are plain text.
- Near-duplicate: `carousel-ad-copy-card-by-card` (another batch, "Write a carousel ad people swipe through") does the same job as `swipe-carousel-ad-script-format-rules`. Mine is now "Make each carousel card earn the next swipe" so the two cards read differently, but they should probably merge. That block still names mine by its old name in its SKILL.md and board.
