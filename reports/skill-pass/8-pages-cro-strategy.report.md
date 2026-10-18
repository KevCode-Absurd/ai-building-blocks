# Report: 8-pages-cro-strategy

20 blocks written (17 general, each with `boards/ecommerce.md`; 3 ecommerce). All 16 source folders processed.

| old folder | new slug(s) | category | origin | cut % (rough) | note |
|---|---|---|---|---|---|
| advertorial-v1 | advertorial-landing-page-copy | general (+ecommerce board) | rebuilt | 65 | Merged with landing-pages/kinds/advertorial.md (same job). Dropped HTML build, template, brain-contract tables. Headline shapes renamed. |
| landing-pages (CES-050) | landing-page-copy-from-ad-and-facts | general (+ecommerce board) | own | 70 | Writer method from SKILL, CARD, kinds/pdp, copy-formulas. Product-page structure and buy box moved to the ecommerce board. |
| landing-pages | conversion-metrics-and-test-sizing | general (+ecommerce board) | own | 70 | Split out: revenue per visitor, traffic mix, test size. Store-number traps and abandonment research in the board. |
| landing-pages | page-objection-answer-map | general (+ecommerce board) | own | 40 | From objection-answer-map.md. Gallery/buy-box placement in the board. |
| landing-pages | landing-page-quick-checklist-review | general (+ecommerce board) | own | 60 | From checklist.json, 30 checks in 6 areas with ICE ranking. Dropped check IDs and app fields. |
| five-reasons-lp + five-reasons-lp-pro | reasons-why-landing-page-copy | general (+ecommerce board) | rebuilt | 80 | Two skills, one job, merged (the "-lp" one said it was superseded). Plus own kinds/listicle.md. Count is adjustable (default 5), the old "always exactly 5" rule dropped. Shopify export became its own ecommerce block. |
| clone-from-screenshot | landing-page-layout-from-reference | general (+ecommerce board) | rebuilt | 80 | Python clone tools, 1:1 clone file and lint dropped. Now a layout map plus slot map, layout only, no source words. |
| cro-audit | landing-page-cro-audit | general (+ecommerce board) | rebuilt | 70 | Figma deck playbook, capture script, image pipeline dropped. 8-surface store coverage and the data request are in the board. |
| ecommerce-funnel-inspection | storefront-evidence-inspection | ecommerce | own | 35 | Works from captures you supply. Removed app capture/network wording. MIT source attribution kept in one line. |
| ecommerce-page-design | landing-page-design-direction | general (+ecommerce board) | own | 45 | Merged SKILL, CARD, review.md. Apache 2.0 attribution line kept. Product/variant/terms notes in the board. |
| shopify-liquid-themes | shopify-liquid-theme-reference | ecommerce | rebuilt | 90 | The 9 reference files (filters, tags, objects) not carried; replaced by one rule sheet. |
| shopify-liquid-themes ("landing page as theme page" part) | shopify-landing-page-theme-export | ecommerce | rebuilt | n/a | New block from that section: copy to section + page template JSON. Also cites five-reasons-lp-pro's Shopify bundle idea (CES-035). |
| organic-content | founder-video-series-plan | general (+ecommerce board) | rebuilt | 55 | Part 1 of the source. New openers, beats and week names; filming and one-shoot-six-pieces reworded. |
| organic-content | creator-product-seeding-plan | general (+ecommerce board) | rebuilt | 55 | Part 2. Tiers renamed, pay figures removed, disclosure kept on every brief. |
| foreplay-ad-board | competitor-ad-swipe-board | general (+ecommerce board) | rebuilt | 85 | Foreplay connector, folders, downloads, curl, README dropped. Now an index built from public ad libraries or the user's own exports, no scraping. Buckets renamed. |
| foreplay-creative-strategy | competitor-ad-teardown-brief | general (+ecommerce board) | rebuilt | 85 | Foreplay, Gemini, HTML deliverable and brain-enrichment steps dropped. Run time kept as a labelled hint. |
| recreate-winning-ads | winning-ad-style-to-new-ad-concepts | general (+ecommerce board) | rebuilt | 55 | Brain file writes dropped; two approval stops kept. |
| ad-reference-exact | same-ad-new-format-remake | general (+ecommerce board) | own | 25 | Light tighten; hard rules kept. |
| ad-compliance | meta-ad-policy-check | general (+ecommerce board) | own | 90 | 79 KB digest condensed to a 30-row area table. Verdict and severity scheme kept. D2C priority list in the board. |
| creative-qa | pre-launch-ad-creative-checklist | general (+ecommerce board) | rebuilt | 50 | Advisory only; app-specific "what the app checks" columns replaced with check/person. |

## New port types
- `store_capture`: screenshots, page text and control list of a store page, each with ID, URL, date, viewport.
- `page_layout_spec`: section-by-section layout map of a reference page (order, proportions, component kinds, slot map).
- `design_direction`: palette roles, type roles, focal move, layout principles, three composition options.
- `ad_style_dna`: how a business's measured winning ads look and argue (six dimensions, argument, result, not yet tried).
- `theme_files`: Shopify section, template JSON, locale entries and an image list.
- `objection_map`: table linking customer doubts to where the page answers them, with visibility and missing proof.

Existing types used: brand_brain, offer, ad_copy, voc_reviews, persona, product_data, performance_sheet, reference_set, competitor_set, ad_breakdowns, shortlist, brief, plan, script, image_prompt, static_ads, video_ads, landing_page, audit_report.

## Doubts
- **Splits and merges to confirm.** landing-pages became five blocks (copy, metrics, objection map, checklist, plus advertorial/reasons merged with their course twins); organic-content became two; shopify-liquid-themes became two. The `_names.yaml` proposed one name each.
- **Reasons-why page** keeps a variable count. The source sold a fixed "5 reasons" page; I used `reasons-why-landing-page-copy` and default five. Rename to `five-reasons-landing-page-copy` if the fixed count matters for the catalogue.
- **Licences.** landing-page-design-direction (Apache 2.0, Anthropic frontend-design and Impeccable) and storefront-evidence-inspection (MIT, REA) are adapted from open-source methods and carry a one-line attribution. Confirm whether the repo needs a NOTICE file. The own-text landing-pages skills quote a Baymard Institute figure set via a course; I kept it in the ecommerce board marked "read the current study".
- **Meta policy digest** was read in October 2026 and will age. The block tells users to confirm against the live pages, but a dated refresh routine would keep it honest.
- **Competitor research** now relies on the user's own exports or hand-browsed public ad libraries. If the product later wants automated pulls, that needs a decision on the licence of any ad-intelligence tool and on Meta Ad Library API terms, not scrapers.
