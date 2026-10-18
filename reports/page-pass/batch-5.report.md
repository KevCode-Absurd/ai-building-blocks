# Page pass, batch 5

18 blocks. Each one now has page.yaml (with `output_shape` placed just before `example`), a rewritten SKILL.md, and a rewritten boards/ecommerce.md where there was one (15 of 18). All examples are real runs on `knowledge/example-businesses/sprout/` only. Every page.yaml parses with the site's `yaml` package, and every example stays within 25 lines of input and 70 lines of output. No item.yaml, folder names or knowledge files were touched.

| Old slug | new_slug | job |
|---|---|---|
| advertorial-landing-page-copy | write-article-style-page-for-cold-readers | write-landing-page |
| brand-evidence-records-for-creative | sort-brand-facts-into-four-records | brand-file |
| brand-knowledge-folder-from-website | build-brand-file-from-your-website | brand-file |
| competitor-ad-swipe-board | sort-competitor-ads-into-study-board | study-competitors |
| competitor-ad-teardown-brief | find-what-competitor-ads-repeat-and-miss | study-competitors |
| customer-language-to-angle-library | turn-reviews-into-ranked-buying-reasons | understand-customers |
| founder-interview-to-fill-brand-gaps | interview-founder-to-fill-brand-gaps | brand-file |
| landing-page-copy-from-ad-and-facts | write-landing-page-that-continues-your-ad | write-landing-page |
| landing-page-cro-audit | audit-landing-page-and-plan-tests | audit-landing-page |
| landing-page-design-direction | plan-three-design-directions-for-page | write-landing-page |
| landing-page-layout-from-reference | borrow-layout-of-page-you-admire | write-landing-page |
| landing-page-quick-checklist-review | run-30-point-check-on-landing-page | audit-landing-page |
| page-conversion-review-in-buyer-order | review-page-in-order-buyers-read-it | audit-landing-page |
| page-objection-answer-map | match-customer-doubts-to-your-page | audit-landing-page |
| printable-brand-guide-from-brand-brain | make-printable-brand-guide | brand-file |
| reasons-why-landing-page-copy | write-five-reasons-landing-page | write-landing-page |
| shopify-landing-page-theme-export | turn-page-copy-into-shopify-page | write-landing-page |
| shopify-liquid-theme-reference | write-shopify-theme-code-that-installs-cleanly | write-landing-page |

## Merges and near-duplicates

- **audit-landing-page-and-plan-tests and review-page-in-order-buyers-read-it** are near-duplicates. Both walk the same seven buyer questions on a phone and stop at the first one the page fails. The audit adds money estimates and test write-ups; the review adds plain principles and quick wins. Either merge them (the review becomes the audit's "page only" mode), or present them with run-30-point-check-on-landing-page as a three-step ladder: quick check, then review, then full audit. The pages already point to each other in that order.
- **sort-brand-facts-into-four-records and build-brand-file-from-your-website** overlap. The four records are mostly a re-cut of the brand file plus a handoff slice. It could become a step or an option inside the brand file skill.
- **write-article-style-page-for-cold-readers, write-five-reasons-landing-page and write-landing-page-that-continues-your-ad** repeat the same offer-block rules and the same "bought again or bought once" rules. They're fine as separate jobs, but the shared rules could live in one reference so they don't drift apart.
- **write-shopify-theme-code-that-installs-cleanly** reads like a reference sheet for turn-page-copy-into-shopify-page more than a standalone job. Consider keeping it as a dependency rather than a public card.

## Things I was unsure about

- **Competitor examples.** Sprout's files only hold Sprout's own ads, as headlines with no images or videos. So both competitor examples are framed as "a smaller greens gummy brand studying the category leader". Following its own rules, the study-board skill can't place ads it hasn't seen, so its example honestly comes back with an empty board, text hints and a MISSING list. The breakdown skill runs as a labelled text-only study. Adding ad screenshots or descriptions, or a few rival ads, to the sprout files would make both examples much stronger.
- **Layout example.** There's no reference screenshot in the files, so the example uses Sprout's own adult product page (a page you own is allowed) as the reference for a Kids page. Height and columns are marked "not captured".
- **Folder name in the brand file skill.** The output folder is now `brand-file/` instead of `brand-brain/`. The file names inside (brain.md, customer-avatars.md, and so on) are unchanged. Other skills that point to a `brand-brain/` path may need the same rename.
- **Banned words inside skills.** The article-style page SKILL.md used to tell the AI to avoid "unlock", "elevate", "seamless" and "game-changer" by name. I reworded that to "stock ad words any brand could use", so the file passes the banned-word check. The five-reasons skill also refers to "stock AI phrases" without listing them.
- **Shopify code in the examples** (selling_plan_allocations, visible_if, shop.refund_policy) follows the skill's rules, but I haven't tested it in a live store.
- **Review filter.** The buying-reasons example applies the skill's "drop entries under about 20 words" rule, which drops R7, Sprout's strongest gut quote. The output says so, and tells you to read the dropped complaints by hand.
- **Names that drop a small word.** "Build a brand file from your website" becomes build-brand-file-from-your-website, and "Write a landing page that continues your ad" becomes write-landing-page-that-continues-your-ad.
- **Morrow drafts.** The first two examples were written on Morrow before the switch and have been redone on Sprout. No Morrow, Ledgerly or Hale text is left in any batch-5 file.

## Sweep

Outcome names, summaries, headlines and subheads rewritten per brand/COPYWRITING.md. Every page now has `test` (4 or 5 steps, placed after `judge`) and an `improve` rewritten as "Improve it for your business" (edits to the skill file itself, what to save to the brand file, and what to pair it with, described by what it does). SKILL.md frontmatter `name` and H1 match. Examples were already Sprout with `output_shape`, so none were rerun. `node tools/lint-pages.mjs` shows no issues for these 18 pages.

| Old slug | Final new_slug | New name |
|---|---|---|
| advertorial-landing-page-copy | win-over-strangers-with-article-style-page | Win over strangers with an article-style page |
| brand-evidence-records-for-creative | give-ai-tools-brand-facts-they-can-trust | Give AI tools brand facts they can trust |
| brand-knowledge-folder-from-website | turn-website-into-brand-file-for-ai | Turn your website into a brand file for AI |
| competitor-ad-swipe-board | learn-from-competitor-ads-sorted-by-type | Learn from competitor ads, sorted by type |
| competitor-ad-teardown-brief | find-ad-ideas-competitors-all-miss | Find the ad ideas your competitors all miss |
| customer-language-to-angle-library | find-why-customers-buy-in-their-words | Find why customers buy, in their words |
| founder-interview-to-fill-brand-gaps | fill-brand-file-gaps-in-one-founder-call | Fill your brand file's gaps in one founder call |
| landing-page-copy-from-ad-and-facts | finish-the-sale-your-ad-started | Finish the sale your ad started |
| landing-page-cro-audit | find-where-page-loses-buyers-test-fixes | Find where your page loses buyers, then test fixes |
| landing-page-design-direction | choose-three-on-brand-designs-for-page | Choose from three on-brand designs for your page |
| landing-page-layout-from-reference | borrow-landing-page-layout-you-admire | Borrow a landing page layout you admire |
| landing-page-quick-checklist-review | find-what-stops-visitors-buying-30-quick-checks | Find what stops visitors buying, in 30 quick checks |
| page-conversion-review-in-buyer-order | fix-page-in-order-buyers-read-it | Fix your page in the order buyers read it |
| page-objection-answer-map | answer-doubts-that-stop-customers-buying | Answer the doubts that stop customers buying |
| printable-brand-guide-from-brand-brain | get-brand-guide-any-designer-can-follow | Get a brand guide any designer can follow |
| reasons-why-landing-page-copy | give-shoppers-reasons-to-switch-to-you | Give shoppers reasons to switch to you |
| shopify-landing-page-theme-export | get-landing-page-live-in-shopify-store | Get your landing page live in your Shopify store |
| shopify-liquid-theme-reference | get-shopify-theme-code-that-installs-cleanly | Get Shopify theme code that installs cleanly |

Notes:
- **The three page checks now read as a ladder:** 30 quick checks (pass, warn or fail), then a ranked fix list in buyer order (page only, no sales data), then the full audit (sized in money from your numbers, with tests). The summaries say which is which.
- **Numbers checked against SKILL.md:** 30 checks, 11 board groups, 13 page parts, nine brand files, three design directions, six install steps, and "up to five" reasons (five is only the default).
- **Slugs drop small words** where the name has them (a, the, your, from, in). Three slugs are 8 words: give-ai-tools-brand-facts-they-can-trust, fill-brand-file-gaps-in-one-founder-call and find-what-stops-visitors-buying-30-quick-checks.
- **Name references:** quoted skill names in a Shopify tweak, two Shopify SKILL.md files and the five-reasons store add-on were replaced with plain descriptions, so the renames can't break them.
- **Close to other batches:** find-what-stops-shoppers-backed-by-screenshots (storefront-evidence-inspection) sounds a lot like the 30-check name. tell-the-problem-so-buyers-see-themselves (long-story-copy-for-cold-buyers) covers ground close to the article-style page.
- **Filler words:** two uses of "really" outside the examples were removed. Line endings were kept as CRLF.
