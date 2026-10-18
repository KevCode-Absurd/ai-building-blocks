# Batch 8 report

21 blocks. Each folder now has a page.yaml (parses as YAML), a plain-language SKILL.md with frontmatter `name` set to the new slug, and a rewritten boards/ecommerce.md where one existed (18 of 21). No item.yaml, folder name, knowledge file or other folder was touched.

## Renames

| Old slug | new_slug | Job | Example |
|---|---|---|---|
| script-voice-variant-converter | retell-script-as-i-you-or-they | make-video-ads | morrow |
| skeleton-ladder-ad-script-format-rules | write-cartoon-skeleton-ad-script | make-video-ads | morrow |
| skeleton-what-happens-if-video-ad-director | turn-skeleton-script-into-video-shots | make-video-ads | morrow |
| song-ad-script-format-rules | write-song-video-ad-script | make-video-ads | morrow |
| song-music-video-ad-director | turn-song-script-into-video-shots | make-video-ads | morrow |
| talking-object-ad-script-format-rules | write-talking-object-video-ad-script | make-video-ads | morrow |
| talking-object-video-ad-director | turn-talking-object-script-into-video-shots | make-video-ads | morrow |
| talking-presenter-hook-video-ad-director | make-ai-presenter-openings-for-video-ad | make-video-ads | morrow |
| ugc-creator-filming-brief | write-filming-brief-for-creator | make-video-ads | hale |
| ugc-selfie-ad-script-format-rules | write-selfie-style-video-ad-script | make-video-ads | morrow |
| ugc-video-script-writer | write-phone-video-script-and-shot-list | make-video-ads | morrow |
| video-ad-edit-plan-from-footage | plan-video-ad-edit-from-footage | make-video-ads | morrow |
| video-ad-script-from-customer-research | write-video-ad-script-from-customer-quotes | make-video-ads | morrow |
| video-ad-script-nine-beat-playbook | write-or-fix-video-ad-script | make-video-ads | ledgerly |
| video-ad-script-principles-reference | check-video-ad-script-against-rules | make-video-ads | ledgerly |
| video-ad-shot-list-director | turn-ad-script-into-shot-list | make-video-ads | morrow |
| video-ad-text-overlay-planner | plan-on-screen-text-finished-video-ad | make-video-ads | morrow |
| video-script-type-library | plan-batch-of-different-video-ad-scripts | make-video-ads | hale |
| watercolor-painted-ad-script-format-rules | write-watercolour-video-ad-script | make-video-ads | morrow |
| watercolor-video-ad-director | turn-watercolour-script-into-video-shots | make-video-ads | morrow |
| ecommerce/wordless-satisfying-hook-video-ad-director | make-wordless-satisfying-openings-video-ads | make-video-ads | morrow |

Video pairs follow the agreed pattern: "Write a X video ad script" for the script, "Turn a X script into video shots" for the shot-by-shot prompts. Slugs drop "a"/"an", which matches what other batches did (for example turn-claymation-script-into-video-shots).

Several examples chain together on purpose, so a reader can follow one ad from start to finish: the skeleton script feeds the skeleton shots, the song lyric feeds the song shots, the lamp monologue feeds the talking-object shots, the watercolour script feeds the watercolour shots, and the founder edit plan feeds the on-screen text plan.

## Should be merged, or are near-duplicates

- **write-selfie-style-video-ad-script and write-phone-video-script-and-shot-list.** These overlap the most: the same five-part talking-to-phone script, the same honesty rules for AI presenters, the same "one number" rule. The selfie one adds a posted-photo still; the phone one adds delivery notes, a shot list and three other openings. Merge them into one skill and keep both extras.
- **write-video-ad-script-from-customer-quotes and write-or-fix-video-ad-script.** The nine-beat playbook already has a "from research" mode that covers most of the research skill. Merge them, or keep the research skill as the simpler way in and say so on both pages.
- **check-video-ad-script-against-rules** is the reference both of those skills load. Used on its own it is a script review, which overlaps the playbook's review mode. Consider making it a reference file only, not a separate card.
- The four script/shots pairs repeat each other's rules on purpose (each shots skill restates the look and claim rules). That's fine, but each pair could become one skill with two modes.
- turn-ad-script-into-shot-list is the general version that the style-specific shots skills build on. It doesn't duplicate them.

## Things I wasn't sure about

- **Jobs.** I put everything under make-video-ads. Two could arguably go elsewhere: check-video-ad-script-against-rules could go under check-ads (it reviews scripts), and plan-batch-of-different-video-ad-scripts could go under plan-ad-tests (it plans a batch of variants to test).
- **Name length.** Ten names are 7 or 8 words (the max is 8). Shorter versions lost meaning, for example "Retell a script as I, you or they" and "Make AI presenter openings for a video ad".
- **"Watercolour" spelling.** The names use British spelling, to match the skill text and the Morrow brand file. The folders say "watercolor". If other batches use US spelling, make them match.
- **"Opening" vs "hook".** Page names say "openings". The pages explain "hook" once in `terms`.
- **Example inputs that aren't from the business files.** Some examples need inputs a user would paste about their own work, so I wrote them: footage file names and a transcript with timings (edit plan), the first frame of ad A1 and its AI presenter (presenter openings, wordless openings), sampled video frames (on-screen text), and short approved scripts (voice converter, Hale filming brief). None of these adds a new fact about a product, price, claim or result. Where a run needed a business fact that isn't on file, the output says MISSING: whether Morrow uses music, the full Morrow label text, Morrow's typeface, the tub's real size, the buyer's accent, Morrow's real product motions and sounds, A1's full script, and the Hale shoot deadline and usage terms.
- **Reference files** (video-ad-script-principles-reference/references/principles.md and video-script-type-library/references/types.md) were not rewritten, because the task covered SKILL.md and boards only. They still use internal terms such as "awareness", "sophistication" and "VSL".
- **Banned words inside rules.** The two phone-video SKILL.md files listed "game-changer" as a word the AI must never use. To keep both the rule and our own word ban, I changed it to "changes the game". The playbook's rule "at most one 'it's not X, it's Y' line" is now "at most one 'not this, but that' contrast line".
- **A conflict between paired skills.** The talking-object script skill says the product enters at the turn. The talking-object shots skill says the product sits at the edge of the frame from frame 1, and the turn is the object's eyes moving to it. I kept both rules as they were, and the shots example notes the change.
- **Shot list step 9.** The original says two moves by the same hands "are one action; split them across two shots", which contradicts itself. I wrote "are two actions; split them".

## Sweep

All 21 pages: outcome name, summary, headline and subhead; `test` added after `judge`; `improve` rewritten as "Improve it for your business"; `output_shape` added before `example`; every example redone on Sprout by following SKILL.md; SKILL.md frontmatter `name` and H1 updated. US spelling (watercolor, color) in page copy. `node tools/lint-pages.mjs`: 173 pages, 0 issues.

| Old slug | Final new_slug | New name |
|---|---|---|
| script-voice-variant-converter | get-new-ads-from-your-best-script | Get new ads from your best script |
| skeleton-ladder-ad-script-format-rules | get-skeleton-ad-script-that-keeps-people-watching | Get a skeleton ad script that keeps people watching |
| skeleton-what-happens-if-video-ad-director | turn-skeleton-script-into-shots-ai-can-make | Turn your skeleton script into shots AI can make |
| song-ad-script-format-rules | get-catchy-song-ad-script-that-sells | Get a catchy song ad script that sells |
| song-music-video-ad-director | turn-song-script-into-shots-ai-can-make | Turn your song script into shots AI can make |
| talking-object-ad-script-format-rules | get-talking-object-ad-script-that-sells | Get a talking object ad script that sells |
| talking-object-video-ad-director | turn-talking-object-script-into-shots-ai-can-make | Turn your talking-object script into shots AI can make |
| talking-presenter-hook-video-ad-director | get-talking-openings-that-keep-viewers-watching | Get talking openings that keep viewers watching |
| ugc-creator-filming-brief | get-usable-creator-videos-from-one-clear-brief | Get usable creator videos from one clear brief |
| ugc-selfie-ad-script-format-rules | get-selfie-style-ad-script-that-sounds-human | Get a selfie-style ad script that sounds human |
| ugc-video-script-writer | get-phone-video-script-that-sounds-unscripted | Get a phone video script that sounds unscripted |
| video-ad-edit-plan-from-footage | turn-footage-into-ad-people-follow | Turn your footage into an ad people follow |
| video-ad-script-from-customer-research | get-video-ad-script-in-customers-words | Get a video ad script in your customers' words |
| video-ad-script-nine-beat-playbook | get-video-ad-script-that-sells | Get a video ad script that sells |
| video-ad-script-principles-reference | find-script-lines-that-lose-sale | Find the script lines that lose the sale |
| video-ad-shot-list-director | get-shot-list-that-keeps-ad-moving | Get a shot list that keeps your ad moving |
| video-ad-text-overlay-planner | make-video-ad-clear-with-sound-off | Make your video ad clear with the sound off |
| video-script-type-library | get-different-video-ads-from-same-research | Get different video ads from the same research |
| watercolor-painted-ad-script-format-rules | get-watercolor-ad-script-that-sells | Get a watercolor ad script that sells |
| watercolor-video-ad-director | turn-watercolor-script-into-shots-ai-can-make | Turn your watercolor script into shots AI can make |
| wordless-satisfying-hook-video-ad-director | get-wordless-openings-people-watch-to-end | Get wordless openings people watch to the end |

Notes:
- Video pairs use "Get a <style> ad script that ..." for the script and "Turn your <style> script into shots AI can make" for the shots (9 words; the suggested "...shots a video tool can make" is 11 words, over the 9-word name limit and the lint limit of 10). "talking-object" is hyphenated to stay at 9 words.
- Examples chain on Sprout: skeleton script to skeleton shots, song lyric to song shots, shaker monologue to talking-object shots, watercolor script to watercolor shots, filming brief to edit plan to on-screen text, and the voice-converter script is the ad the talking openings sit in front of.
- SKILL.md bodies were left as written, so they still say "watercolour" and "colour" (only name and H1 changed, per the rules).
- Facts not on file, flagged MISSING in outputs: whether Sprout uses music, full pouch label text and daily-pack printing, pack measurements, gummies per adult pack, an agreed discount figure, which 4 free gifts.
