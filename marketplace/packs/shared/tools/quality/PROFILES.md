# Length and shape profiles

How the editor uses a profile:

1. Match the request to a family in `tools/quality/profiles.json` (`_any` if none fits). Where a card and its profile differ on length or counts, the profile wins.
2. Count the plain draft with `node tools/quality/wordcount.cjs <final> <plain>`. `ceiling` (times the plain draft's words) is a cap, never a target; pass it only when the brief asks for more. `aim` is the typical winning ratio, reached only with parts the reader will use.
3. Follow `shape`. Its counts apply to the piece the reader uses directly (an ad, email, buyer page, public reply), which stays no longer than the plain draft's version. Kits, tables and scripts follow under labels.
4. Read time fits `reader_minutes` at about 230 words a minute.
5. Short is not clear: spell out codes, say shared lines once, define each term once.

Dev evidence (engine/plain words; engine wins of 8):

| Task kind | Ratio | Verdict |
|---|---|---|
| Outbound emails | 1.69 | 8 (short emails, kit after) |
| Retail pitch | 1.45 | 8 (buyer page 0.89x) |
| Paid social ads | 1.29 | 5 (boilerplate in every ad) |
| Support macros | 1.27 | 8 (clarity -1.9) |
| Help guide | 1.27 | 8 |
| Creator brief | 1.22 | 8 ("long") |
| Job description | 1.07 | 8 |
| Crisis response | 1.04 | 4 (dense) |
| Competitor analysis | 1.02 | 8 |
| Landing page | 0.93 | 8 |
| Review reply | 0.93 | 8 |
| Webinar script | 0.92 | 7, 1 tie |
| Pricing analysis | 0.91 | 8 (clarity -1.6) |
| Claims review | 0.90 | 8 |
| Experiment design | 0.84 | 4 (jargon) |
| Welcome emails | 0.70 | 5 (read like notices) |

Total length did not decide results. Longer answers won when the reader-facing piece stayed short. They lost when it was padded, and short answers lost when they were dense.
