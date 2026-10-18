# Report: the 7 workflows

Page files are in `tools/orchestrator-pages/<old-slug>.yaml`. Every file parses with the site's yaml package, has every page.yaml field plus `output_shape` (just before `example`), and uses business `sprout`. The generator was not run, `catalogue-items/` was not touched and git was not used.

| Old slug | new_slug | job | Example |
|---|---|---|---|
| brand-brain-to-video-ad-script-and-shot-list | plan-a-video-ad-from-your-reviews | make-video-ads | Full run. A 37-second script for the powder quitter, clip 1's shot list and the ad rules check |
| customer-reviews-to-static-ad-set | turn-customer-reviews-into-image-ads | make-image-ads | Full run. Three image ads with character counts, the image prompt for ad 1 and the pre-launch check |
| ad-to-landing-page-with-review | write-design-and-check-a-landing-page | write-landing-page | Full run on the live $29.99 ad. Page copy, design plan and review. It catches the ad's "probiotics" error |
| customer-reviews-to-native-story-ad | turn-reviews-into-a-story-ad-for-strangers | write-ad-copy | Full run. Setup, a 187-word story, the image prompt and the ad rules check |
| competitor-ads-to-original-script | turn-competitor-ads-into-your-own-script | study-competitors | Partial run, which stops at step 1 (see problems) |
| ad-results-to-next-creative-brief | decide-your-next-ads-from-your-latest-results | read-ad-results | Full run. Every figure was worked out from ad-results.csv |
| product-photos-to-product-page-gallery | build-a-product-page-gallery-from-real-photos | product-photos | Truth sheet and 12-frame plan. It stops at the approval gate, and no images were made |

## Changes to tools/make-orchestrators.mjs

- FLOWS: new `name`, `when`, `summary` and step notes. The FLOWS name and summary match each page file. I did not change slugs, step `uses`, `job`, `level`, `boards`, `category` or the wiring (checked with a diff of those values).
- `NAMES` now holds plain labels for every port type the workflows use (for example "brand file" instead of "brand brain", and "list of buying reasons"). A new `HINTS` map adds one plain line per input in the generated SKILL.md. Both are labels only.
- The SKILL.md template now uses the PAGE-FORMAT section names (What you need, Steps, What you hand back, Check before you hand it back, If something is missing, Avoid). Each step shows its note in bold, then the skill to use.
- I ran the generator against a scratchpad output folder to check it. Every item.yaml parses.

## Problems and notes

1. **Competitor workflow example.** The Sprout files have no competitor ads, only descriptions of each competitor. The swipe board step won't sort ads it can't see, so the honest example is a run that stops at step 1 and says what to collect. If the site needs a full example, someone has to capture 20 or more real competitor ads into `sprout/` first.
2. **Name collision fixed.** The landing page copy skill already uses "Write a landing page that continues your ad", so the workflow became "Write, design and check a landing page".
3. **Wiring quirk (not changed).** The competitor workflow lists "Ad copy" as a required input, because the ad rules check needs an `ad_copy` input and no earlier step makes one. The script is really what gets checked. The fix belongs in the wiring or in the ports of `meta-ad-policy-check`.
4. **Gallery example.** The two photos come from the photo descriptions in `brand.md`, and the product page marks its gallery "inferred". The example shows only text (truth sheet and plan), as PAGE-FORMAT requires.
5. **Reviews are not marked verified.** The buying reasons skill keeps unverified quotes out of paid ads, so no paid ad in the examples quotes a review. The gallery frames show reviews but flag `[NAME AS PUBLISHED NEEDED]`.
6. The `improve` bullets name other blocks by their new page names ("Check a finished ad before you spend", "Check an ad against Meta's ad rules"), taken from those blocks' page.yaml files as they stood when I wrote this. If those names change, update the bullets.
7. `job` in item.yaml still uses the old values (video, image, page, ads, analysis), as instructed. The new job id is in each page file.

## Sweep

Final copy sweep, 18 Oct 2026. New outcome-first `name`, `summary`, `headline` and `subhead`; a new `test` list after `judge`; `improve` rewritten as "Improve it for your business" (what to edit in the skill file, or for workflows which steps to swap, add or drop and which step skill to tune, plus what to pair it with, described by what it does). Examples were already on Sprout with `output_shape`, so none were rerun. `node tools/lint-pages.mjs` reports nothing for these pages.

| Old slug | Final new_slug | New name |
|---|---|---|
| ad-results-to-next-creative-brief | know-which-ads-to-make-next | Know which ads to make next |
| ad-to-landing-page-with-review | get-a-checked-landing-page-for-your-best-ad | Get a checked landing page for your best ad |
| brand-brain-to-video-ad-script-and-shot-list | turn-reviews-into-a-video-ad-ready-to-film | Turn reviews into a video ad ready to film |
| competitor-ads-to-original-script | turn-competitor-ads-into-your-own-script | Turn competitor ads into your own script |
| customer-reviews-to-native-story-ad | get-an-ad-strangers-read-built-from-reviews | Get an ad strangers read, built from reviews |
| customer-reviews-to-static-ad-set | turn-your-reviews-into-image-ads-buyers-believe | Turn your reviews into image ads buyers believe |
| product-photos-to-product-page-gallery | turn-real-photos-into-a-product-page-gallery | Turn real photos into a product page gallery |

Also in this sweep:
- `tools/make-orchestrators.mjs`: only `name` and `summary` changed in each FLOWS entry (`when` was already fine). Slugs, step `uses`, wiring, job, level and boards are untouched (checked with a diff). The generator was not run.
- `turn-competitor-ads-into-your-own-script` keeps its name; it already promised the outcome.
- One judge item in `customer-reviews-to-static-ad-set` parsed as a map and was reworded.
