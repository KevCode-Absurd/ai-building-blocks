# Report: family 5-native-ads

25 blocks written, all in `catalogue-items\general\` with `boards\ecommerce.md` (except the upscale block, which has no store detail). All native blocks carry `example: native`. No Creative Engine file was touched.

| old folder | new slug(s) | category | origin | cut % (rough) | note |
|---|---|---|---|---|---|
| native-ad-creative (CES-054) | native-ad-image-brief-writer | general (+ecommerce board) | own | ~30% net (about 60% on the old text; the 19-row type picker is new) | Parent: finds the material in the copy, picks one of the 20 types, applies shared rules, returns brief plus image prompt. role=orchestrate. Skin, hands, worn-detail and makeup paragraphs squeezed into one "People" bullet. |
| native-ad-types, abstract-curiosity (CES-056) | native-ad-image-abstract-curiosity | general | own | n/a (grew ~50%) | See note under the table on why type blocks grew. |
| native-ad-types, annotated-photo (CES-057) | native-ad-image-marked-up-photo | general | rebuilt | n/a | Renamed, new examples. |
| native-ad-types, breaking-news (CES-058) | native-ad-image-news-bulletin | general | own | n/a | Flags a human review before publishing. |
| native-ad-types, candid-moment (CES-059) | native-ad-image-candid-moment | general | own | n/a | Universal fallback. |
| native-ad-types, curiosity-object (CES-060) | native-ad-image-problem-leftover | general | rebuilt | n/a | New examples (lint tray, hairbrush, water jug). |
| native-ad-types, dont-buy-this (CES-061) | native-ad-image-dont-buy-this | general | own | n/a | |
| native-ad-types, emotional-scene (CES-062) | native-ad-image-room-that-changed | general | rebuilt | n/a | New examples. |
| native-ad-types, handwritten-note (CES-063) | native-ad-image-handwritten-note | general | own | n/a | |
| native-ad-types, hook-headline-photo (CES-064) | native-ad-image-article-headline-photo | general | rebuilt | n/a | Four new headline shapes written. |
| native-ad-types, illustration-chronicle (CES-065) | native-ad-image-drawn-panels | general | rebuilt | n/a | New style examples. |
| native-ad-types, medical-imaging (CES-066) | native-ad-image-test-result-photo | general | rebuilt | n/a | Widened to any readout (pressure map, tracker chart, test strip). |
| native-ad-types, nightmare-scenario (CES-067) | native-ad-image-feared-next-step | general | rebuilt | n/a | New object examples. |
| native-ad-types, notes-app (CES-068) | native-ad-image-phone-notes-screenshot | general | own | n/a | |
| native-ad-types, one-star-review (CES-069) | native-ad-image-one-star-review-card | general | own | n/a | Needs a real review with permission on file. |
| native-ad-types, phone-reminder (CES-070) | native-ad-image-phone-reminders-screenshot | general | own | n/a | |
| native-ad-types, sticky-note (CES-071) | native-ad-image-sticky-note-photo | general | own | n/a | |
| native-ad-types, symptom-closeup (CES-072) | native-ad-image-symptom-in-routine | general | rebuilt | n/a | New examples. |
| native-ad-types, text-bubbles (CES-073) | native-ad-image-two-person-text-thread | general | own | n/a | |
| native-ad-types, whatsapp-chat (CES-074) | native-ad-image-group-chat-screenshot | general | own | n/a | Renamed to drop the app name. |
| native-ad-types, worn-object (CES-075) | native-ad-image-worn-object-photo | general | own | n/a | |
| native-ad-types (CES-055 knowledge row) | none | n/a | n/a | n/a | The folder has no top-level SKILL.md; only the 20 subfolders exist. The "which type" knowledge became the type picker inside native-ad-image-brief-writer (own wording, rebuilt, not copied). |
| native-ads + testing.md (CES-076) | native-story-ad-setup-sheet | general (+ecommerce board) | own | ~15% | Turned from a reference doc into a one-page setup decision (fit, tension, aim, narrator, image types, test set). The unmeasured test figures moved to the ecommerce board and are labelled illustrative. |
| indirect-ads SKILL + CARD (CES-048) | cold-traffic-native-story-ad-writer | general (+ecommerce board) | rebuilt | ~70% | Rebuilt: new openers, a five-beat story spine, new headline shapes, own pain-to-picture mapping. Image-type list is now the 20 blocks. |
| gpt-image-ads (CES-042) | none | n/a | n/a | n/a | Retired in the source and superseded by the image prompt and static ad blocks. Course-derived, no useful method left that other blocks lack. Not rebuilt. |
| image-prompt-craft + CARD (CES-046) | image-prompt-from-approved-plan | general (+ecommerce board) | own | ~55% (main 10.5K from 32K, plus a 4K store board) | Main skill is subject-agnostic; pack, printing, size, hands and worn-detail rules are in boards\ecommerce.md. |
| image-upscaling (CES-047) | upscale-approved-image-with-checks | general | rebuilt | ~10% | Rebuilt from the lesson idea: new prompt, new check table. |

Why the 20 type blocks grew (about +30 to 50% over their source cards): each now runs alone in any chat, so each repeats a one-line base-rules step, a fixed Output, Checks and a fallback list. The shared long rules (skin, hands, words policy) live once in the parent.

Two source skills merged: none. native-ads and indirect-ads stay separate (setup decision vs. cold-traffic writing).

## New port types
- image_plan: an approved image plan: what the image argues, exact words, scene, layout, formats and fixed choices (input of image-prompt-from-approved-plan).
- approved_image: an approved image file with its pixel size and aspect ratio (input of the upscale block).
- upscaled_image: a larger, reviewed copy of an approved image, with measured size and a source-versus-result review (output of the upscale block).

Other types used from _types.yaml: ad_copy, persona, brand_brain, voc_reviews, product_data, landing_page, image_prompt, plan.

## Doubts
- The parent is `role: orchestrate` because it picks a type and delegates; it could equally be `render` since it ends in an image prompt. Change if the canvas needs it.
- The 20 type blocks have `uses: [native-ad-image-brief-writer]` and the parent lists all 20 in `uses`, so the pair references each other; drop one direction if the site disallows cycles.
- Several type blocks need a person to review before running (news bulletin, test-result photo, one-star review card, group chat/thread): the flags are in their Output, but no block is marked "needs review" in item.yaml (no field for it).
- `long-story-copy-for-cold-buyers` (another family) sits close to cold-traffic-native-story-ad-writer. Mine is the short 150 to 400 word ad plus picture plus page rule; consider linking them via `uses`.
- Test figures (cost per thousand views, click rates) in the setup-sheet ecommerce board came with the source method, not measured; they are labelled illustrative and may be better dropped under the "real numbers or none" rule.
