# Batch 2 page pass report

Status when this report was written: page.yaml present in 15 of 23 folders. Six (marked "done, checked") were written and linted by the batch lead. The other 17 were given to three helper agents, which were still running when the run had to hand back. Those rows are "in progress" and need a check: page.yaml present, SKILL.md and boards/ecommerce.md rewritten, YAML valid, no banned words.

| old slug | new_slug | job | status |
|---|---|---|---|
| ad-concept-grid-planner | plan-ad-ideas-that-are-truly-different | plan-ad-tests | done, checked |
| buyer-quote-static-ads | make-image-ads-from-customers-own-words | make-image-ads | done, checked |
| carousel-ad-copy-card-by-card | write-swipe-carousel-ad-card-by-card | write-ad-copy | done, checked |
| cold-audience-concept-static-ads | make-image-ads-for-people-new-to-you | make-image-ads | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| cold-traffic-native-story-ad-writer | write-short-story-ad-for-strangers | write-ad-copy | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| creative-brief-three-concepts-nine-variants | brief-three-ad-ideas-and-nine-versions | plan-ad-tests | in progress (page.yaml present) |
| creative-direction-lever-snippets | steer-how-your-ad-looks-and-sells | make-image-ads | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| fifty-static-ad-test-sprint | plan-and-make-50-image-ads-to-test | plan-ad-tests | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| google-ads-export-review-by-module | find-fixes-in-your-google-ads-export | read-ad-results | in progress (page.yaml present) |
| meta-ad-policy-check | check-ad-against-meta-ad-rules | check-ads | done, checked |
| native-story-ad-copy-long-form | write-long-story-ad-from-customer-research | write-ad-copy | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| native-story-ad-setup-sheet | plan-story-ad-before-you-write-it | plan-ad-tests | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| pre-launch-ad-creative-checklist | check-finished-ad-before-you-spend | check-ads | done, checked |
| problem-first-static-ad-concept | make-image-ad-that-shows-the-problem | make-image-ads | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| ecommerce/sale-offer-static-ad-set | make-image-ads-for-one-offer | make-image-ads | in progress (page.yaml present) |
| same-ad-new-format-remake | remake-your-ad-in-new-format | make-video-ads | in progress (no page.yaml yet) |
| static-ad-and-storyboard-review | find-flaws-in-finished-image-ads | check-ads | done, checked |
| static-ad-archetype-and-layout-planner | plan-image-ad-layout-from-its-job | make-image-ads | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| static-ad-copy-and-layout-planner | plan-and-write-one-image-ad | make-image-ads | in progress (no page.yaml yet) |
| static-ad-format-families | find-image-ad-types-youre-missing | plan-ad-tests | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| static-ad-layout-adaptation-workflow | rebuild-proven-ad-layouts-for-your-brand | study-competitors | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| static-template-slot-contract | check-your-facts-fit-ad-template | make-image-ads | done by helper (YAML valid, lint clean per helper; not re-checked by lead) |
| winning-ad-style-to-new-ad-concepts | make-new-ads-in-your-winners-style | make-image-ads | in progress (no page.yaml yet) |

## Near-duplicates and possible merges
- **static-ad-archetype-and-layout-planner** is mostly a subset of **static-ad-copy-and-layout-planner** (step 7, choosing the ad type, plus step 10, the layout). Merge it in, or keep it as the "layout only" step.
- **static-ad-layout-adaptation-workflow** already uses **static-template-slot-contract** as its fit check. They overlap heavily. Keep the contract only as a step inside the workflow.
- **cold-traffic-native-story-ad-writer** overlaps with the `brief` length of **native-story-ad-copy-long-form** (same cold-traffic story, same "send them to a teaching page" rule). **native-story-ad-setup-sheet** is the planning step in front of both. Consider one story-ad family with three steps.
- **pre-launch-ad-creative-checklist** and **static-ad-and-storyboard-review** both check finished ads. The checklist is craft and phone checks; the review is proof, argument and batch variety. Keep both, but the pages should point to each other (they do).
- **ad-concept-grid-planner**, **creative-brief-three-concepts-nine-variants**, **static-ad-format-families** and **fifty-static-ad-test-sprint** all plan what to test. They differ in scale (a few ideas, a 3x3 brief, two formats, 50 ads). Worth one "plan what to test" chooser on the job page.
- **same-ad-new-format-remake** repeats mode A of static-ad-copy-and-layout-planner and the "exactly like the reference" choice in creative-direction-lever-snippets.

## Unsure about
- **Job for winning-ad-style-to-new-ad-concepts:** filed under make-image-ads. read-ad-results ("what to make next") also fits.
- **Job for same-ad-new-format-remake:** filed under make-video-ads, but it also handles video to carousel and image to video.
- **sale-offer-static-ad-set name:** it's called "Make image ads for one offer" because Morrow has no dated sale on file, so the example uses subscribe and save.
- **google-ads-export-review-by-module:** no example business has Google Ads data, so the example can only be a run that stops at MISSING and lists what to export. A small Google Ads sample in knowledge/example-businesses/ would make a much better example.
- **Morrow knowledge gaps that show up as MISSING across many examples:** verified-buyer status (only review 1 is marked verified), product photo files, the font name, a logo file, an article-style teaching page, and terms and dates for the A6 "15% off" ad.
- **native-story-ad-copy-long-form/references/forms-and-arcs.md** uses "Personal journey" (a banned word). The helper agent was asked to rename it; check that it did.
- **Old slugs in backticks:** cross-references to blocks outside this batch inside SKILL.md files still use old slugs in backticks (for example `product-truth-sheet-from-photos`). apply-renames may need to rewrite them.

## Sweep

Final copy sweep, 2026-10-18. All 23 pages: outcome-led name, summary, headline (subheads kept where they already explained the headline), new `test` after `judge`, `improve` rewritten as "Improve it for your business", `output_shape` added before `example`, and a new Sprout example run by following each SKILL.md. Every Morrow, Ledgerly and Hale mention is gone from these folders. SKILL.md frontmatter `name:` and H1 set to the new slug and name; the H1 of each boards/ecommerce.md updated to match; quoted cross-references to renamed blocks in this batch updated in SKILL.md and boards files. `node tools/lint-pages.mjs` reports no issues for any page in this batch.

| old slug | final new_slug | new name |
|---|---|---|
| ad-concept-grid-planner | get-ad-ideas-that-each-test-something-new | Get ad ideas that each test something new |
| buyer-quote-static-ads | turn-one-customer-quote-into-image-ads | Turn one customer quote into image ads |
| carousel-ad-copy-card-by-card | write-a-carousel-ad-people-swipe-through | Write a carousel ad people swipe through |
| cold-audience-concept-static-ads | get-image-ads-strangers-stop-scrolling-for | Get image ads strangers stop scrolling for |
| cold-traffic-native-story-ad-writer | stop-strangers-scrolling-with-a-story-ad | Stop strangers scrolling with a story ad |
| creative-brief-three-concepts-nine-variants | get-three-ad-ideas-and-nine-versions | Get three ad ideas and nine versions |
| creative-direction-lever-snippets | make-ai-build-the-ad-you-pictured | Make AI build the ad you pictured |
| fifty-static-ad-test-sprint | learn-what-sells-from-50-different-image-ads | Learn what sells from 50 different image ads |
| google-ads-export-review-by-module | find-fixes-worth-making-in-your-google-ads | Find fixes worth making in your Google Ads |
| meta-ad-policy-check | keep-facebook-from-blocking-your-ads | Keep Facebook from blocking your ads |
| native-story-ad-copy-long-form | write-a-story-ad-buyers-see-themselves-in | Write a story ad buyers see themselves in |
| native-story-ad-setup-sheet | find-the-story-ad-worth-writing-first | Find the story ad worth writing first |
| pre-launch-ad-creative-checklist | catch-mistakes-in-your-ad-before-you-pay | Catch mistakes in your ad before you pay |
| problem-first-static-ad-concept | stop-the-scroll-with-your-buyers-problem | Stop the scroll with your buyer's problem |
| ecommerce/sale-offer-static-ad-set | sell-one-offer-three-ways-with-image-ads | Sell one offer three ways with image ads |
| same-ad-new-format-remake | get-your-best-ad-in-a-new-format | Get your best ad in a new format |
| static-ad-and-storyboard-review | fix-whats-wrong-in-finished-ads-before-launch | Fix what's wrong in finished ads before launch |
| static-ad-archetype-and-layout-planner | pick-the-right-layout-for-your-image-ad | Pick the right layout for your image ad |
| static-ad-copy-and-layout-planner | get-one-image-ad-ready-to-make | Get one image ad ready to make |
| static-ad-format-families | find-image-ad-types-worth-testing-next | Find image ad types worth testing next |
| static-ad-layout-adaptation-workflow | borrow-an-ad-layout-that-already-works | Borrow an ad layout that already works |
| static-template-slot-contract | fill-an-ad-template-with-provable-facts | Fill an ad template with provable facts |
| winning-ad-style-to-new-ad-concepts | get-new-ads-in-your-winners-style | Get new ads in your winners' style |

### Sweep notes
- Slugs drop apostrophes ("buyers", "winners", "whats"). Four slugs run to 8 dash-words (learn-what-sells-from-50-different-image-ads, pick-the-right-layout-for-your-image-ad, get-your-best-ad-in-a-new-format, fix-whats-wrong-in-finished-ads-before-launch) to keep them readable.
- Two names carry platform names, which the brand rules allow only by example: "Keep Facebook from blocking your ads" (taken from COPYWRITING.md) and "Find fixes worth making in your Google Ads".
- The Google Ads example still stops at MISSING: Sprout has no Google Ads data, so the run shows the skill rejecting ad-results.csv as a search terms export.
- Examples that quote Sprout reviews keep the customers' own exclamation marks; no other copy uses them.
- Examples surfaced real Sprout issues worth fixing in the brand file: "probiotics" in a live main text (the ingredients show prebiotic fiber), 61% in ads vs 49 to 58% on the site, "21" vs "over 20" vitamins and minerals, $49.99 / 28 rounding to $1.78, and Sugar-Free renewal at $54.99.
- The "Old slugs in backticks" note above still applies to references outside this batch.
