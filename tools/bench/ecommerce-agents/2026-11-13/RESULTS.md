# E-commerce agents vs plain Opus: blind bench, 13 Nov 2026

## Result

The e-commerce agents won **95 of 120** blind verdicts. Plain Opus won 23, and 2 were ties. That is 80.5% of the decided calls. Every one of the 10 judges preferred the agents, by margins of 9 to 3 up to 10 to 2.

| Criterion (1 to 10) | Agents | Plain Opus |
|---|---|---|
| Job done | 8.72 | 8.17 |
| Specific and actionable | 8.60 | 7.92 |
| Commercial judgment | 8.47 | 7.76 |
| Craft | 8.12 | 7.83 |
| **Overall** | **8.45** | **7.78** |

Of the agents' wins, 61 were slight and 34 clear. Of plain Opus's wins, 19 were slight and 4 clear.

| Job | Agent | Agents won | Plain won | Tie | Overall score (agents vs plain) |
|---|---|---|---|---|---|
| J01 Meta budget decisions (Bombay Shaving Company) | jared-performance-marketing | 8 | 2 | 0 | 8.3 vs 7.7 |
| J02 TikTok launch plan (Bombas) | zara-tiktok-ads | 9 | 1 | 0 | 8.3 vs 8.0 |
| J03 Meta ad concepts (Mokobara) | tendai-ad-creative | 10 | 0 | 0 | 8.7 vs 7.1 |
| J04 UGC video scripts (Olipop) | devon-video-ugc | 10 | 0 | 0 | 8.6 vs 7.2 |
| J05 Meta ad copy set (The Whole Truth) | kofi-ad-copy | 7 | 2 | 1 | 8.2 vs 8.0 |
| J06 Product page copy (Bellroy) | georgia-product-copy | 2 | 7 | 1 | 7.9 vs 8.1 |
| J07 Welcome email series (Minimalist) | lucia-email-copy | 10 | 0 | 0 | 8.2 vs 7.7 |
| J08 Win-back programme (Blue Tokai) | imogen-retention | 10 | 0 | 0 | 9.0 vs 7.6 |
| J09 90-day growth plan (Brooklinen) | malcolm-ecommerce-growth | 0 | 10 | 0 | 7.9 vs 8.8 |
| J10 Bundles and shipping threshold (Plum) | brendan-offers | 9 | 1 | 0 | 8.7 vs 7.9 |
| J11 Mattress page test plan (Wakefit) | gretchen-store-testing | 10 | 0 | 0 | 8.7 vs 7.9 |
| J12 WhatsApp COD and sales (Snitch) | rohan-chat-sales | 10 | 0 | 0 | 8.9 vs 7.3 |

## Method

- 12 jobs across media buying, creative, copy, email, retention, strategy, offers, conversion testing and chat sales, for real public brands. Every number in a brief is marked "(test)": these are test inputs, not the brands' figures.
- **Agent arm:** Opus 5.5, given the shipped pack zip for the matching agent from `dist/packs` (built from commit 8e00bd720). It used the pack as its instructions: AGENTS.md, WORK-METHOD.md, toolbox.md, toolkit.md, its skills and its cards.
- **Plain arm:** Opus 5.5, told to act as a senior specialist in the brief's role. It read only the brief and the rules.
- **Same for both arms:** the brief, the deliverable rules (`RULES-DELIVERABLE.md`) and the word limit. Neither arm used the web, and neither could ask questions.
- Both arms came in at about the same length: within 10% on 11 of 12 jobs. The exception is J05, where the agent wrote 956 words and plain Opus 792.
- **Blinding:** `build-packets.cjs` scrubs card ids, file names and tool names (none were found), and gives each judge its own random order of the two outputs per job. The answer key is `key/key.json`.
- **Judges:** 10 blind judges, 5 Opus and 5 Sonnet, each judging through a different expert lens (see `build-packets.cjs`). Each scored all 12 jobs on 4 criteria plus an overall score, and picked a winner, using `JUDGE-RULES.md`. That rubric rewards usefulness, not length, and asks judges to check any arithmetic that drives a decision.
- **Files:** `tally.cjs` unblinds the verdicts. Judges' reasons are in `reasons.txt`; the raw verdicts are in `verdicts/`.

## Why the agents lost where they lost (fix list)

- **J09 growth plan, 0 to 10.** Both arms found the same break-even. Plain Opus sized every move in one unit, a share of revenue, and tied it to the board's own goal: contribution margin, about 13.6% falling to 7.8%. The agent mixed units ("per 1,000 customers", monthly, quarterly), so its moves could not be ranked, and it used an unsupported "300" screen.
- **J06 product page, 2 to 7.** The agent left `[X]` placeholders in publishable copy and added one unsupported claim. Plain Opus also sent cash-heavy buyers to a wallet that holds more notes, which saved the sale instead of risking a return.
- **J05 ad copy, 7 to 2.** The agent repeated the same spec string and price in every primary text. Its "30 purchases per ad" test bar was unrealistic for the budget.
- **J01 Meta budget, 8 to 2.** In one version the headline count contradicted its own table, and it used a fudged target.
- **J10 offers, 9 to 1.** The one loss compared before and after periods across December and January instead of running a 50/50 split.
- **J02 TikTok, 9 to 1.** The one loss spread $100 per ad group, too thin to learn from, and judged day 30 on UTM-tagged orders only.

## What the judges credited the agents with

They named these, again and again:

- holdouts and true lift;
- offers held back until later messages, with gifts instead of discounts for full-price buyers;
- WhatsApp templates that are ready to submit, with categories and samples;
- a prepaid nudge sized to the RTO left after COD confirmation;
- safe zones and character counts in creative work;
- regulator checks (FSSAI, FTC disclosure);
- keep or cut rules with a number attached.
