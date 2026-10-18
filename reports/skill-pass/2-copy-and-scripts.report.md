# Family 2: copy and scripts. Report

18 source folders in, 27 blocks out. All 27 are `general` (none ecommerce-only). 10 carry a `boards/ecommerce.md` add-on. All live in `catalogue-items\general\`. Creative Engine was only read.

| old folder | new slug(s) | category | origin | cut % (rough) | note |
|---|---|---|---|---|---|
| copy-craft (CES-022, purchased) | buyer-read-before-writing-copy | general | rebuilt | ~35 | reader + buyer parts |
| | sales-opening-picker-six-leads | general | rebuilt | | leads part; new lead names |
| | long-story-copy-for-cold-buyers | general | rebuilt | | long-story part |
| | headline-and-image-words-writer | general | rebuilt | | headlines + picture-words + feed-copy merged |
| | selling-points-list-writer (+ecommerce board) | general | rebuilt | | points part |
| | persuasive-body-copy-with-proof-and-close (+ecommerce board) | general | rebuilt | | body + close merged |
| | scroll-stopping-hook-writer-and-grader | general | rebuilt | | hooks + hook-check merged |
| | copy-draft-edit-and-repair-pass | general | rebuilt | | editor + repair + revise merged |
| | machine-sounding-copy-tells-check | general | rebuilt | | tells part; shapes renamed, new examples |
| | copy-final-sweep-fifteen-questions | general | rebuilt | | sweep part |
| copy-floor (CES-023, own) | plain-copy-priority-order | general | own | -30 (grew: added template sections) | `type: prompt` |
| copy-principles (CES-024, own) | ad-copy-sell-pass (+ecommerce board) | general | own | ~70 | author names dropped |
| image-ad-copy (CES-044) + image-ad-copywriter (CES-045), both own | static-ad-copy-and-layout-planner (+ecommerce board) | general | own | ~80 | MERGED: the "no research" copywriter is now the "No research?" step 2 |
| (carousel section of the same two) | carousel-ad-copy-card-by-card (+ecommerce board) | general | own | n/a | split out: a carousel is useful on its own |
| native-ad-copy (CES-053, own) | native-story-ad-copy-long-form (+ecommerce board) | general | own | ~68 | 10 forms + 5 arcs kept as tables in `references/forms-and-arcs.md`, not split into 15 blocks (each too thin) |
| hook-bank (CES-043, course) | ad-hook-opener-shape-bank | general | rebuilt | ~80 | about 45 new shapes in 14 kinds in `references/shapes.md`; the 135-line bank.json was not reused; founder hooks renamed |
| video-ad-copywriter (CES-145) + video-ad-scripts (CES-146), both own | video-ad-script-nine-beat-playbook (+ecommerce board) | general | own | ~78 | MERGED: with or without research; includes review, variants and length-change modes |
| script-from-research (CES-128, own) | video-ad-script-from-customer-research (+ecommerce board) | general | own | ~25 | the research-led method; overlaps the playbook on purpose (see Doubts) |
| script-reference-principles (CES-129) | script-from-reference-idea | general | own | ~20 | |
| script-reference-structure (CES-130) | reference-ad-structure-script-rewrite | general | own | ~22 | |
| script-surfaces (CES-131) | script-format-fit-advisor | general | own | ~36 | `role: check`, outputs a `plan` |
| script-transpose (CES-132) | script-voice-variant-converter | general | own | ~30 | |
| script-voice-pass (CES-134) | read-aloud-script-polish | general | own | ~45 | app-side code checks and voice-performance links dropped |
| script-types (CES-133, incl. emotions.md) | video-script-type-library (+ecommerce board) | general | own | ~47 | 19 types in `references/types.md`; used-up/kept example openings moved to the ecommerce board; emotions merged in as a feel table |
| ugc-script (CES-144, course) | ugc-video-script-writer (+ecommerce board) | general | rebuilt | ~45 | 5 beats renamed (opening line, setup, shown use, understated verdict, easy handoff); clip-placement card folded in |
| (creator-brief-template of ugc-script) | ugc-creator-filming-brief | general | rebuilt | ~40 | split out as its own block; new template and examples |
| ad-script-principles (CES-004, own) | video-ad-script-principles-reference | general | own | ~72 | 13 sections in one `references/principles.md`; classic-writer names removed |

Merges: image-ad-copy + image-ad-copywriter; video-ad-copywriter + video-ad-scripts. Inside copy-craft: reader+buyer, headlines+picture-words+feed-copy, body+close, hooks+hook-check, editor+repair+revise.

Left out on purpose: the app-only "which step is sent which part" tables and rationale (copy-craft), the Creative Engine brain-document field tables (replaced by "Brand brain: voice, claims..." lines), the stats from the saved-winners libraries (`winning-ad-patterns.md`, counts of saved ads, not test results), `bank.json`.

## New port types
- `copy_draft`: any customer-facing copy awaiting a check or edit (used as input by the edit, tells and sweep blocks and as output of the priority-order card). Not in `_types.yaml` yet; add it, or map it to `ad_copy`.

## Doubts
- **Too many thin copy-craft blocks?** The purchased copy-craft became 10 blocks. The three small checks (edit pass, tells check, sweep) could become one "copy review" block if the catalogue looks cluttered.
- **Overlap in video scripts.** `video-ad-script-nine-beat-playbook` and `video-ad-script-from-customer-research` do much the same job (one with a research-optional playbook, one research-led and shorter). I kept both because the inventory lists them separately, but you may want to pick one as the beginner entry.
- **Origin of the "9-beat playbook".** Inventory says `own` for video-ad-scripts and ad-script-principles, but their text refers to an outside "9-beat ad script playbook" and to classic copywriting frameworks. I removed names but kept the method as `own`. If the 9 beats came from a course, they should be re-marked `rebuilt` and reworded.
- **`plain-copy-priority-order` role.** A rules card that writes nothing by itself; I typed it `prompt`, role `make`, output `copy_draft`. Change the role if you prefer rules cards as `check`.
- **Examples borrowed from Creative Engine's own text.** Own-origin blocks (static, native, type library, principles) keep the made-up example lines from the source (pans, jackets, serum). They are invented, not real brands. No private client data or Gehna anywhere.
