# Page pass, batch 3

23 blocks done. Each has a new page.yaml and a rewritten SKILL.md and boards/ecommerce.md. All 23 page.yaml files parse. All pass the length limits, the banned-word and jargon checks, and have no em or en dashes. Every image prompt is 60 to 120 words. item.yaml was not touched and no folders were renamed.

## Renames

| Old slug | new_slug | Job | Example business |
|---|---|---|---|
| ai-visual-production-checklist | plan-and-check-ai-ad-images-and-clips | check-ads | morrow |
| creative-mistakes-register | turn-feedback-on-ai-ads-into-rules | check-ads | morrow |
| native-ad-image-abstract-curiosity | make-ad-from-one-odd-everyday-detail | make-image-ads | hale |
| native-ad-image-article-headline-photo | make-ad-that-looks-like-article-photo | make-image-ads | ledgerly |
| native-ad-image-brief-writer | pick-the-right-picture-for-story-ad | make-image-ads | hale |
| native-ad-image-candid-moment | make-ad-that-looks-like-everyday-snapshot | make-image-ads | morrow |
| native-ad-image-dont-buy-this | make-ad-that-says-dont-buy-this | make-image-ads | morrow |
| native-ad-image-drawn-panels | make-ad-from-hand-drawn-story-panels | make-image-ads | morrow |
| native-ad-image-feared-next-step | make-ad-showing-what-buyers-dread-next | make-image-ads | ledgerly |
| native-ad-image-group-chat-screenshot | make-ad-that-looks-like-group-chat | make-image-ads | hale |
| native-ad-image-handwritten-note | make-ad-that-looks-like-handwritten-note | make-image-ads | ledgerly |
| native-ad-image-marked-up-photo | make-ad-that-looks-like-circled-photo | make-image-ads | morrow |
| native-ad-image-news-bulletin | make-ad-with-news-style-caption | make-image-ads | morrow |
| native-ad-image-one-star-review-card | make-ad-that-looks-like-review-card | make-image-ads | morrow |
| native-ad-image-phone-notes-screenshot | make-ad-that-looks-like-phone-note | make-image-ads | hale |
| native-ad-image-phone-reminders-screenshot | make-ad-that-looks-like-phone-reminders | make-image-ads | morrow |
| native-ad-image-problem-leftover | make-ad-showing-what-problem-leaves-behind | make-image-ads | ledgerly |
| native-ad-image-room-that-changed | make-ad-from-empty-lived-in-room | make-image-ads | morrow |
| native-ad-image-sticky-note-photo | make-ad-that-looks-like-sticky-note | make-image-ads | ledgerly |
| native-ad-image-symptom-in-routine | make-ad-showing-a-visible-symptom | make-image-ads | morrow |
| native-ad-image-test-result-photo | make-ad-that-looks-like-test-result | make-image-ads | morrow |
| native-ad-image-two-person-text-thread | make-ad-that-looks-like-text-conversation | make-image-ads | ledgerly |
| native-ad-image-worn-object-photo | make-ad-from-old-thing-that-failed | make-image-ads | morrow |

## Cross-references now use the new slugs

The 20 picture-type skills and the picker point to each other by fallback ("if X is missing, use Y"). The rewritten SKILL.md and board files already use the **new** slugs (for example `make-ad-that-looks-like-everyday-snapshot`). This only works once `tools/apply-renames.mjs` renames the folders. The `uses:` lists in item.yaml still hold the old slugs, so the rename tool needs to rewrite those too, especially the 20-item `uses:` in native-ad-image-brief-writer/item.yaml.

## Examples where the honest run stops

Two examples end in MISSING, because the example business files don't contain the fact the picture needs. That is what the skill is told to do, and the pages say so.
- **Review card (morrow):** none of Morrow's 16 reviews has a complaint that is really praise, and no ad-use permission is recorded. The output shows the check of each review and points to the fallback.
- **Visible symptom (morrow):** the only visible symptom in the story is dark circles (a face, and not in the research), so the skill stops and hands a moment to the snapshot skill.

Other runs carry real MISSING lines too: the news caption has no outside source behind Morrow's approved claim, the article photo has no page headline for Ledgerly's sign-up page, the test result has no real batch report layout, and the production checklist has no photo of the tub open or the scoop, no lid-opening steps, no caption typeface and no tool prices.

If you want full-picture examples for those two, add to knowledge/example-businesses/ first: a Morrow review whose complaint is a side effect of the drink working (with permission noted), and a buyer-described visible symptom for one of the three businesses.

## Near-duplicates and merge candidates

- **Sticky note and handwritten note.** Same idea (handwriting on paper), split by length (3 to 10 words vs 8 to 25) and by place (stuck on a surface vs lying on a table). Could merge into one "handwritten note" skill with a "sticky note" option.
- **Phone note and phone reminders.** Both generic phone screenshots of words the narrator set for themselves. Different enough in what they show (a log vs repeated alerts), but could be one "phone screenshot" skill with two modes.
- **Text conversation and group chat.** Same layout rules; the difference is two people vs three. Strong merge candidate ("message screenshot", one-to-one or group).
- **Circled photo and test result.** Both are a photo plus one rough red mark. The test result adds a claims check and a review flag. Keep separate, since the safety rules differ.
- **What the problem leaves behind and the old thing that failed.** Both are close object photos with no person. One is the problem's by-product, the other is the product that failed. Close, but the headlines and honesty rules differ.
- **Plan and check AI ad images and clips** (production checklist) overlaps with the general rules in **Turn feedback on AI ads into rules** (hands, product use, one look across a set). They are meant to work together. Consider having the checklist read from the register instead of repeating the rules.

## Things I was unsure about

- **Names over 8 words.** The brief asked for names like "Make an ad that looks like a sticky note" (9 words). Twelve names are 9 words, above the 8-word maximum in PAGE-FORMAT.md. The slugs stay at 7 words or fewer. If 8 is a hard limit, "Make an ad that looks like a sticky note" could become "Make a sticky note ad" and so on.
- **The picker's "first match wins" table.** In the original brief writer, the first row ("a moment a camera could catch") matches almost any story, so read literally the picker always picks the snapshot unless the user names a type. I kept the rule as written and showed the switching logic in the example (a requested type that can't be made honestly). The table might need re-ordering, with the snapshot moved to last as the fallback.
- **Drawn panels ground rules.** The original repeated the phone-photo ground rules, which don't fit a drawing. I kept the safety rules (no logo, product, children, made-up adults only) and dropped "looks taken on a phone" for that skill only.
- **Review card brand-file line.** The original said blank fields should be filled from the story's own lines. For reviews that would invite made-up review data, so the rewrite says to mark blank review fields MISSING and never fill them.
- **Job for the two checkers.** I filed both under `check-ads`. The production checklist is half planning, so `make-image-ads` would also be defensible.
- **Literal camera "angle".** The word stays in SKILL.md where it means a camera angle (checklist, handwritten note, leftover), not the banned sense. It has been removed from page.yaml files.
- **Story copy in the inputs.** Each example's "approved story ad" is written for the run. It uses only facts from the business files (reviews, buyer notes, product facts, claims), but the narrator's small story details (where the remote was, the sisters' chat name) were written for the example. No numbers, results or claims were added beyond the files.


## Sweep

Outcome names, `test` added after `judge`, `improve` rewritten as "Improve it for your business", `output_shape` added, and a new Sprout example for all 23 pages, made by following each SKILL.md on an input built from the Sprout files. No Morrow, Ledgerly or Hale left anywhere in these folders. SKILL.md frontmatter `name` and H1 set to the new slug and name. Sibling cross-references inside these SKILL.md files (the brief writer's picture-type table, the fallbacks in each "If something is missing", one in handwritten-note boards/ecommerce.md) were switched to the final slugs, with no other wording change. `node tools/lint-pages.mjs` reports nothing for these pages, and all 23 page.yaml files parse.

| Old slug | Final new_slug | New name |
|---|---|---|
| ai-visual-production-checklist | get-ai-ads-that-show-your-real-product | Get AI ads that show your real product |
| creative-mistakes-register | stop-paying-for-the-same-ai-mistake-twice | Stop paying for the same AI mistake twice |
| native-ad-image-abstract-curiosity | puzzle-people-into-reading-with-one-odd-photo | Puzzle people into reading with one odd photo |
| native-ad-image-article-headline-photo | get-your-ad-read-like-a-shared-article | Get your ad read like a shared article |
| native-ad-image-brief-writer | get-story-ads-read-with-the-right-picture | Get your story ad read with the right picture |
| native-ad-image-candid-moment | stop-your-buyer-mid-scroll-with-a-snapshot | Stop your buyer mid-scroll with an everyday snapshot |
| native-ad-image-dont-buy-this | get-doubters-reading-with-a-dont-buy-warning | Get doubters reading with a don't-buy warning |
| native-ad-image-drawn-panels | keep-people-reading-with-a-hand-drawn-story | Keep people reading with a hand-drawn story |
| native-ad-image-feared-next-step | stop-worried-buyers-with-what-they-dread | Stop worried buyers with the thing they dread |
| native-ad-image-group-chat-screenshot | get-read-with-a-family-group-chat-ad | Get read with a family group chat ad |
| native-ad-image-handwritten-note | stop-the-scroll-with-a-handwritten-note | Stop the scroll with a handwritten note |
| native-ad-image-marked-up-photo | make-people-look-with-one-red-circle | Make people look with one red circle |
| native-ad-image-news-bulletin | get-one-true-fact-read-in-a-caption-bar | Get one true fact read in a caption bar |
| native-ad-image-one-star-review-card | turn-a-real-complaint-into-praise-people-read | Turn a real complaint into praise people read |
| native-ad-image-phone-notes-screenshot | make-people-read-a-private-phone-note | Make people read a private phone note |
| native-ad-image-phone-reminders-screenshot | stop-tired-buyers-with-ignored-reminders | Stop tired buyers with the reminders they ignore |
| native-ad-image-problem-leftover | make-people-look-twice-at-the-leftover-mess | Make people look twice at the leftover mess |
| native-ad-image-room-that-changed | make-buyers-see-themselves-in-an-empty-room | Make buyers see themselves in an empty room |
| native-ad-image-sticky-note-photo | get-noticed-with-a-sticky-note-ad | Get noticed with an ad that's a sticky note |
| native-ad-image-symptom-in-routine | reach-the-right-people-with-a-visible-symptom | Reach the right people with a visible symptom |
| native-ad-image-test-result-photo | get-a-second-look-with-a-test-result-photo | Get a second look with a test result photo |
| native-ad-image-two-person-text-thread | get-believed-with-a-text-someone-else-sent | Get believed with a text someone else sent |
| native-ad-image-worn-object-photo | get-recognised-with-the-old-things-that-failed | Get recognised with the old things that failed |

Notes:
- Three examples end in a stop, because that is what the skill does with Sprout's facts: the review card (no review qualifies, no stars or ad-use permission on file), the visible symptom (bloating sits on the stomach, so it hands over a lunchbox snapshot), and the brief writer (the news caption asked for has no source behind its 61% figure, so it switches to a snapshot).
- Real issues the examples surfaced in the Sprout files: the testing claim lists 70 + 4 + 16 + 9 = 99 substances but the same page says 35; the product page headline is the product name, so an article-style ad can't match it; the 61% digestive-issues stat has no source.
- Some SKILL.md files still use "really" or "almost" in their body text. Left as is, since the brief was to change only the name and H1.
- site/public/ still holds the earlier slugs; it is build output and was not touched.
- Each new example input is a story ad written for the run and labelled with the reviews it is built on. Product facts, prices, claims and quotes come from the Sprout files. The narrator details (a shaker used as a pen pot, a sticky note on a monitor, the family chat) were written for the example, and no results were added. Where a product could appear, the flags say it stays out, and the daily pack is only ever shown torn across the top.
