# Owner-judged bench: round 2 results (13 Nov 2026)

Round 2 made the agents worse. Round 1 stays the version to keep.

Page with both outputs per job and every judge's verdict: https://claude.ai/artifact/RWJc9wXyu6g5nK3JrLmTgj (private). Data: `results-page/data.json`, built by `scripts/artifact-data.mjs --round r2`.

## Like for like (judge and job pairs that ran in both rounds)

| Set | Judging | Pairs | Round 1 | Round 2 |
|---|---|---|---|---|
| E-commerce | rubric | 172 | 80.2% | 65.1% |
| E-commerce | anonymous | 106 | 77.4% | 61.3% |
| General | rubric | 174 | 74.6% | 65.5% |
| General | anonymous | 172 | 69.8% | 64.5% |
| Unseen jobs | rubric | 84 | 56.0% | 57.8% |
| Unseen jobs | anonymous | 51 | 56.9% | 54.9% |

Anthropic and OpenAI API credit ran out mid-run. E-commerce and unseen jobs have no Claude judges in round 2; their anonymous runs have no OpenAI judges either. Raw round 2 totals are therefore not comparable with round 1; use the table above.

## Why it lost (judges' reasons)

1. Working notes leaked into customer copy (J06 product page).
2. Caution dropped asked-for items: J07 cut the code-deadline reminder, J04 put a spoken paid-partnership line in every script and reworded approved claims, G09 held all sleep posts for review, G08 argued against the yearly push.
3. Unfinished pieces: placeholders and template tags (J04, J07), character limits claimed but broken (J05, J06).
4. Wrong top three: J03 led with men's concepts though the owner's note asked for women solo travellers in the first three.
5. Repeats instead of range: G10 Email 5 repeated Email 2 and cut the paid-plan path; J05's sixth angle was filler.

Held up: J10, J12, G02, G07; G05 flipped to a 15 to 3 win; H02 rose to 12 to 3.

## Next

1. Roll back the round 2 rules behind the leaks and the over-caution; keep the hiring and offer changes, library search and stored brand file.
2. A finishing check on customer copy: no working notes, no placeholders, limits counted by a script.
3. One rule for doubt: deliver what was asked and state one assumption line; never drop a requested piece.
4. Owner-named priorities take the top slots unless the data clearly says otherwise.
5. Rerun with all 20 judges after the API credit is topped up.

## Rollback done (13 Nov 2026)

Chosen per job from the matched verdicts above.

- **Reverted to round 1:** the creative skills (J03 to J05), the page, email and chat skills (J06 to J08, J12), the MCR and EML cards, the creative, creator, ad, product-description, email, onboarding, social-calendar and investor-update quality cards, the lifecycle-flow skill, and the shared method files (WORK-METHOD, AGENTS, quality engine, checker, intake, routing, voice, lessons).
- **Kept from round 2:** media buying and store tests (J01 rose from 6 to 9 of 13), offers and growth, hiring and outbound (G05 rose from 6 to 15 of 18, G04 from 6 to 8), library search and module filter, numbers ledger, the stored brand file, profiles (no unasked test plans, relative days), and the clarity rule that every explicit ask gets an answer.
- **New on top:**
  - one rule for doubt: deliver every asked-for piece, with one assumption line; never drop one to stay safe;
  - working notes never in customer copy;
  - a priority the owner names takes a top slot;
  - the bolder move stays in plans, never in copy;
  - no 85% length aim;
  - `tools/quality/copy-check.cjs`, which checks stated character counts, the brief's limits, placeholders and template tags with no fallback.
- **Tests:** 641 of 641 pass, packs rebuild clean, and the bench leak guard is OK.

Not yet re-judged. A full 20-judge rerun needs Anthropic and OpenAI API credit.
