# PRD: round 2, a 10X jump in e-commerce work an owner would ship

Date: 13 November 2026. Owner: AI Blocks quality programme. Tickets: `TICKETS-NEXT15.md` in this folder. Round 1 plan: `PRD-TOP10.md`. Round 1 results: `RESULTS.md`.

This round has 11 e-commerce leaps and 5 general fixes. The brief asked for 10 e-commerce leaps; Kevin then added an eleventh (knowledge use across the whole library), so it is ranked into the list rather than swapped for another.

## 1. Goal and the 10X target

Goal: make e-commerce agents hand over work the owner would ship as it stands, judged by the owner rubric (`../rubrics/OWNER-RUBRIC.md`), not just work that beats plain Opus.

### Where we are (e-commerce post-test, 235 verdicts per arm)

| Measure | Agent | Plain |
|---|---|---|
| Wins against the other arm | 200 (85.1%) | 35 |
| "Use as is" | 52 (22%) | 23 (10%) |
| "With small tweaks" | 167 | 180 |
| "With major rework" | 10 | 26 |
| Overall 10 of 10 | 48 | 7 |
| Overall 9 or more | 154 | 62 |

The headline hides a judge-family split. Gemini judges gave 48 of the agent's 52 "as is" verdicts and 46 of its 48 tens. The other three families almost never ship anything as it stands:

| Judge family (60 or 55 verdicts each) | Agent "as is" | Agent tens | Agent overall 9+ | Wins vs plain |
|---|---|---|---|---|
| Claude | 0 | 0 | 33 | 59 to 1 |
| OpenAI | 1 | 1 | 33 | 41 to 19 |
| DeepSeek | 3 | 1 | 33 | 49 to 6 |
| Gemini | 48 | 46 | 55 | 51 to 9 |

So the strict judges (Claude, OpenAI, DeepSeek) would ship 4 of 175 agent outputs as they stand: 2.3%. "As is or small tweaks" is already 93% and cannot show a 10X jump, so it is not the north star.

### The north star and its targets

**North star: the share of e-commerce outputs the strict judges would ship as is, plus the count of 10 of 10 overalls they give.** Every other number below is a guardrail.

| Measure (e-commerce) | Now | Round 2 gate | 10X north star |
|---|---|---|---|
| Strict-judge "as is" | 4 of 175 (2.3%) | 20 (11%) | 40 or more (23%) |
| Strict-judge overall 10 | 2 | 10 | 20 or more |
| Strict-judge overall 9 or more | 99 of 175 (57%) | 125 (71%) | 150 (86%) |
| All-judge "as is" | 52 of 235 (22%) | 90 (38%) | 120 or more (51%) |
| "Major rework" | 10 | 5 or fewer | 2 or fewer |
| Win share against plain | 85.1% | 90% | 95% |
| OpenAI family wins | 41 to 19 | 48 to 12 | 54 to 6 |
| Dimensions | clear 8.53, below plain's 8.74 | every dimension above plain; correct and clear 9.0 or more | every dimension 9.2 or more |
| Held-out store jobs (H01 to H03) | 21 to 35 | 30 or more of 56 | 40 or more of 56 |

General work keeps its own guardrails (section 9): share at or above 77%, no job lost, and no dimension below plain.

## 2. Kevin's owner lens

Every e-commerce leap maps to one or more of these questions. The leap list in section 5 names which.

| Code | The owner's question | Rubric dimension |
|---|---|---|
| BRAND | On brand: voice, the customer's own words, the brand's reading level, no jargon, design and copy principles | Voice, clear |
| PERSONA | The persona nailed down, with the right segments from the data (if 45 to 64 has the best return, build for them) | Fit, voice |
| RANGE | Real variety in concepts, formats, angles and hooks | Range |
| INSIGHT | New insight, and gaps in the owner's thinking | New insight |
| LEVERAGE | Most leverage for the least effort first | Priorities |
| NUMBERS | Numbers right, and pulled from the right data | Correct, reasoning |
| SHIP | Actionable and shippable with few tweaks | Ready |
| MEDIA | For media buying: tracking, audiences, formats, messaging, concepts, past winners and relaunches | Fit, priorities |
| VISUAL | For pages and visuals: on-brand fonts and colours, faithful to the current design, no AI errors | Voice, ready |

## 3. What round 1 changed, and what regressed

Round 1 lifted e-commerce from 79.1% to 85.1% and general from 55.8% to 77.0%; held-out stayed flat (62.9% to 60.9%). It fixed homework lists (agent homework cites fell from 34 to 6 on e-commerce) and the arbitrary rules it targeted. It also added rules that judges now hold against us.

### Regressions and their causes

| # | Regression | Evidence | Cause |
|---|---|---|---|
| R1 | Clear fell below plain on e-commerce (8.53 vs 8.74) and held-out (8.62 vs 8.90) | "Too long or padded" cited 32 vs 6 (e-commerce), 34 vs 17 (general), 14 vs 4 (held-out). "Dense" cited 28 vs 1 on e-commerce | Not raw length: across 28 jobs the agent wrote 33,721 words and plain 33,239. The agent spends them on bolt-on sections (a labelled bolder move in 26 of 28 outputs, plain 0; unasked test, budget and measurement sections) and on tables (462 table rows vs 345; table words 25% of the text vs 18%) |
| R2 | Correct fell 0.14 on e-commerce (8.83 to 8.69) and 0.25 on held-out | J01 8.89 to 8.22, J09 8.80 to 8.40, J06 8.85 to 8.55, H01 8.79 to 7.89, H06 8.79 to 8.32 | Round 1 told the agent to "decide every open point with the assumption a top practitioner would pick" and to be specific about "dates". It now invents operating facts: invented-detail cites on e-commerce rose from 17 to 33 (plain 18) and date cites from 22 to 28 (plain 7) |
| R3 | Maths and consistency faults cited more often | Maths theme against the agent: e-commerce 27 to 49, general 30 to 43, held-out 15 to 28; plain flat. Self-contradiction cites: e-commerce 10 to 22 | Round 1 welcomed projections and house rule 3 asks for a before-and-after forecast, but nothing reconciles the numbers, their bases or the labels with the tables |
| R4 | "One bolder move" and "combine complementary moves" read as a menu | General judges cite the bolder move 25 times vs 2 (G08 10, G07 5, G04 5); G08: "effectively making two recommendations" (OpenAI) | WORK-METHOD step 4 and quality engine rule 4 require a bolder move in every plan, and allow combined moves even when the owner asked for one |
| R5 | Unasked extras in copy jobs | E-commerce "unasked extras" cites 25 vs 11: J05 7, J06 5, J07 6 (plain 0), J04 4 | The bolder move plus card and skill steps that add a test question (paid-social-ads card), a "watch metric and a fallback" (write-product-page-copy step 12) and "size the read bar to the budget" (ad-copy-test-sets) |
| R6 | G04 went from 10 to 10 to 8 to 12; G05 from 10 to 10 to 7 to 13 | G04: 20-minute call asks (12 agent cites, 3 plain), an invented send window (9, plain 0). G05: the exercise left as "a real ticket from the last 90 days" (16 vs 8), 45% weight on interview rows against a 0.11 correlation (11 vs 5) | Invented timing (R2), the bolder move sent against the trigger signal (R4), a heavier ask than the data supports, and a deliverable described instead of written |
| R7 | Held-out store jobs got worse | H01, H02, H03 together went from 28 to 29 to 21 to 35. H04 to H06 went from 45 to 14 to 49 to 10 | The store jobs carried e-commerce packs and still slipped on the same faults as R1 to R3: an invented four-day delay to purchase orders (H01, 7 vs 0), a $104,000 reserve (H02, 14 vs 5), money valued at order value and units mixed across periods (H03, 8 vs 3) |
| R8 | The 85% length aim did nothing useful | Visible words still landed at 87% to 97% of the limit; judges asked to "trim" in the same rows that asked for more content | A word-count target, not an owner judgment. Length hurts only where it costs clarity |

### What the held-out set says about knowledge

H04 (a language-learning app), H05 (a bill-splitting app) and H06 (a creator platform) are not store businesses, so their packs rightly carried no e-commerce knowledge, and they won 49 to 10. The held-out jobs that slipped are the three store jobs, and those packs did carry e-commerce knowledge. So the missing-knowledge theory does not explain the flat held-out result. The knowledge leap (E3) is still worth doing, for the reasons in section 5, but its gain must be measured, not assumed.

## 4. Evidence and method

- 1,094 post-test judge rows (`judge-*-post/feedback.jsonl`) and 1,100 pre-test rows, unblinded with `key.json`; dimension scores from `raw/`.
- `scripts/themes.cjs` on all six judge folders, plus narrower keyword counts per job, checked by reading the rows. Counts below are "agent rows vs plain rows that cite it". Keyword counts are close, not exact.
- Word counts from `scripts/limits.cjs`; table and bolder-move counts from the outputs.
- Owner notes, briefs and both outputs read for J01, J02, J06, J08, J09, J10, J11, G04, G05, G08, H01, H02, H03.
- Noise: one output per arm per job, and plain's own scores moved between panels. Treat a 2-vote swing on one job as noise.

What the agent still does better and must keep (post-test, e-commerce): decision rules and gates praised 76 vs 22, traced maths praised 63 vs 32, new insight 8.93 vs 7.85, range 8.53 vs 7.65, priorities 9.03 vs 8.11.

## 5. The e-commerce leaps, ranked by expected gain on the owner lens

Ranking weighs the strict-judge faults each leap removes, how many jobs it touches, and how far it reaches unseen jobs. Several leaps touch the same jobs, so gains overlap.

| Rank | Leap | Lens | Main dimension | New tool or file | Group |
|---|---|---|---|---|---|
| E1 | Brand brain and signal-to-asset map | PERSONA, BRAND, INSIGHT, LEVERAGE | Fit, insight, voice | No (house rules and skill steps) | EA, plus each skill group |
| E2 | Ship what was asked, written in full | SHIP, BRAND | Ready, clear | No | EA, ED, EE |
| E3 | Use the whole e-commerce library, with a traced retrieval step | NUMBERS, INSIGHT, MEDIA | Correct, insight | Yes: `trace-check.cjs`, wider pack build | EA |
| E4 | Owner-first clarity | BRAND, SHIP | Clear | No | EA, plus each skill group |
| E5 | A numbers ledger with a reconciliation pass | NUMBERS | Correct, reasoning | Yes: `numbers.cjs` | EB |
| E6 | Grounded operating details | NUMBERS, SHIP | Correct | No | EA, plus each skill group |
| E7 | A media-buying audit spine | MEDIA, LEVERAGE, NUMBERS | Fit, priorities, correct | No | EC |
| E8 | A concept matrix for real variety | RANGE, PERSONA, BRAND | Range, voice | No | ED |
| E9 | Customer messages true for every segment | PERSONA, SHIP, BRAND | Fit, ready, voice | No | EE |
| E10 | Offers and growth plans that lead with the proven winner | LEVERAGE, INSIGHT, NUMBERS | Priorities, correct | No | EB |
| E11 | A store test for every big objection | INSIGHT, NUMBERS | Fit, correct | No | EC |

### E1. Brand brain and signal-to-asset map

**Lens:** PERSONA, BRAND, INSIGHT, LEVERAGE. **Dimensions:** fit, new insight, voice, priorities.

**Problem.** The agent finds the signals, then fails to turn each one into a shippable asset placed where the buyer decides. Plain often misses them too, but the owner rubric rewards the output that acts.
- J06: 21% of returns are "card slots too tight", yet the break-in note sits low on the page (12 agent cites). "The break-in expectation is missing from the bullets and the line under the button" (Claude).
- J08: the lapsed dark-roast buyers get a quiz, not a named coffee (9 vs 0). The email "sends people to a quiz instead of naming the closest coffee still on sale" (Claude).
- J11: "Firmness, the second biggest chat topic, gets no test of its own" (Claude); 10 cites.
- J02: on-feet worker creative wins, but the plan has "a thin pipeline for the style the data shows works" (Claude); 8 vs 1.
- J03: the 41-plus segment is ignored, and three of eight concepts drift back to the static style the owner called flat (10 vs 0).
- J12: 31% of chats arrive after hours and get only a bot (10 vs 5).
- General confirms: G02 hero skips the persona's own phrase (9 vs 0).
- Held-out confirms: H03 sends first-time buyers back to a fit quiz instead of giving fit help (19 vs 15).

**Change.** Two new first house rules, rendered at the top of every e-commerce toolkit, plus a matching step in each e-commerce skill the groups own:
1. **Brand brain first** (a working file, never in the deliverable): the brand's voice lines and banned words from the brief, its reading level, the persona or personas with their own phrases, and every segment the data ranks (best return on spend, click rate, repeat rate, return rate), each with its number. Every customer-facing line is checked against it.
2. **Signal-to-asset map** (working file): each signal becomes a named asset in the deliverable, placed where the buyer decides. A past winner gets a relaunch. The best segment gets its own creative, message or ad set. The top return or complaint reason is answered in the bullets and the line by the button. Every chat or return topic above about 10% gets a fix or a test. A signal with no asset is a gap to close before hand-over.

**How we will know.** Signal hits (`scripts/signal-hits.mjs`) at 95% fully acted on, and above plain on every job. J06, J08, J11 and J02 judges no longer cite the missed asset.

### E2. Ship what was asked, written in full

**Lens:** SHIP, BRAND. **Dimensions:** ready, clear.

**Problem.** Copy jobs come back with plans attached, and some customer-facing pieces are described rather than written.
- Unasked extras on e-commerce: 25 vs 11. J05 "invents a budget and test setup beyond the brief" (OpenAI); 7 cites. J07 "spends space on test and projection sections the owner didn't ask for" (Claude); 6 vs 0. J06 adds a measurement section and a fallback (5). J04 adds rights, contract terms and a test plan (4).
- A labelled bolder move sits in 11 of 12 e-commerce outputs, copy jobs included.
- Described, not written: J08's quiz email (9 vs 0); J11 leaves the EMI figure as "₹X" (2); J07 emails have no greeting or sign-off (2).

**Change.**
- House rule: the deliverable is what the brief asks for. A copy job ships copy. No test budgets, cell plans, measurement sections, rights or contract terms, fallback recommendations or bolder moves unless the brief asks; at most one line on what to watch.
- House rule: every customer message is final copy for every branch that gets it, names the product or answer, and uses only merge fields the brief's tools support, each with a fallback.
- Skill and card edits: `write-product-page-copy` step 12 becomes one optional line; `ad-copy-test-sets` and `store-meta-concepts` add a test plan only when the brief asks for one; `creator-video-script` keeps rights and disclosure to one line each; the `paid-social-ads` card stops asking for "first test" in the shape.

**How we will know.** "Unasked extras" cites at or below plain. No copy deliverable carries a test plan, budget or bolder move it was not asked for. Ready rises to 9.0 or more.

### E3. Use the whole e-commerce library, with a traced retrieval step

Added by Kevin. **Lens:** NUMBERS, INSIGHT, MEDIA. **Dimensions:** correct, new insight, reasoning.

**Problem.**
- Each e-commerce pack carries 2 to 4 of the 23 card modules (`personaVerticalFiles` in `src/modules/knowledge/bundle.ts` keeps `persona.modules.slice(0, 4)`), plus the baseline cards. zara-tiktok-ads carries ADC, MCR and MEA. The full public library is 890 cards from 397 sources: about 2.0 MB of markdown, about 650 KB gzipped. The e-commerce zip today is about 1.25 MB.
- Retrieval (`tools/ask-knowledge.mjs`) is optional. Round 1 run transcripts show about 1 or 2 queries a job (Kevin's read). No output or working note traces which card drove which call.
- Judges cite the gap this leaves: J09's "unsourced 'about half' benchmark for flow revenue" (Claude) and stacked yardsticks (8 vs 0); J02's learning bar and release lines called "shaky operating rules" (OpenAI). A sourced card number with its id would replace a remembered yardstick.
- Routing: a role pack only gets the e-commerce kit when its persona is tagged `vertical: ecommerce` (45 personas). A role agent given a store brief gets no house rules and no cards.
- Caution: as section 3 shows, this did not cause the flat held-out result. Its gain is unproven, so the rerun measures it directly (trace coverage and correct).

**Change.**
- **Whole library in reach.** Every e-commerce agent carries all 23 module files of public cards (shared copies, served once like today), so `ask-knowledge.mjs` searches the whole library offline. If the zip passes 2.5 MB, ship instead a compact one-line-per-card index (id, claim, holds when, the number, source tier) for the modules not carried, and point to the connector's `ask_vertical_knowledge` for full card text.
- **Retrieval is a required step.** One query per data signal and one per major decision, run before drafting. The results go in a private working trace, `context/trace.md`: the question, the card ids used, and the call each one supports. Never in the deliverable.
- **The trace is checked.** A new `tools/quality/trace-check.cjs` fails when the trace is missing, has fewer queries than signals plus decisions, or names a card id that is not in the pack. `qe-check.cjs` runs it when a trace exists.
- **Any store job gets the store kit.** A role pack whose role also appears on any e-commerce persona (for example email-marketing-specialist, growth-marketer, cx-manager) carries the e-commerce house rules, the compact card index and a toolkit pointer. Every other pack gets one AGENTS.md line: if the business sells goods online, use the connector's `ask_vertical_knowledge` for the e-commerce library.
- **Licence rule unchanged.** Only public cards from public sources ship. Licensed and study-only sources stay as logic-only cards in the repo, with no raw text.

**How we will know.** Every e-commerce rerun output has a trace that passes. Unsourced-benchmark cites fall to plain's level or below. Correct reaches 9.0. Pack zips stay at or under 2.5 MB.

### E4. Owner-first clarity

**Lens:** BRAND, SHIP. **Dimensions:** clear (the one dimension below plain), ready.

**Problem.** Clear is 8.53 for the agent and 8.74 for plain; it fell most on J09 (minus 1.10 vs plain), J01 (minus 0.89) and J04 (minus 0.75). "Dense" is cited 28 times vs 1. J09 has "dense algebraic equations" in the main text (Gemini); 10 vs 0. J03 primary text runs longer than the brand's short, grade-7 lines (5 judges). Plain's J01 won praise because its "two lines per ad set are easy for a team to follow" (Claude). Held-out confirms: H01 and H06 called dense.

**Change.** A house rule and an output-section edit in every e-commerce skill a group owns:
- Each decision in two plain lines: what to do, and why, with one number.
- At most one table per decision, five columns or fewer, no formulas in the body. The working goes in the numbers ledger (E5) or a short appendix.
- Every line at the brand's reading level; customer copy at the brief's grade.
- No jargon the brief does not use; spell out terms like holdout or detectable effect in plain words.
- Length: stay within the owner's limit and stop when the job is done. No word-count aim.

**How we will know.** Clear at 9.0 or more and above plain. "Dense" cites at or below plain.

### E5. A numbers ledger with a reconciliation pass

**Lens:** NUMBERS. **Dimensions:** correct, reasoning.

**Problem.**
- Maths faults cited against the agent rose from 27 to 49 on e-commerce while plain stayed at 58 to 55, and self-contradiction cites rose from 10 to 22.
- J01 labels retargeting "Cut" while still funding it (7 vs 0).
- J08 has an arithmetic slip in reachable buyers and an unexplained profit-per-returner figure (4).
- J10 "mixes two bases" in one break-even column (DeepSeek); 4.
- J11 applies an add-to-cart lift to orders and mixes device baselines (5).
- J07's projections "stop at revenue rather than gross profit" (Claude).
- Held-out confirms: H03 values each saved return at order value, not margin, and mixes monthly and 90-day units (8 vs 3); H06's projection rests on volumes the brief never gave (13, plain 14).

**Change.**
- New `tools/quality/numbers.cjs`. The agent writes `context/numbers.json`: each figure with its inputs, formula, unit, period, money basis (revenue, gross profit or contribution) and source (a brief line or a card id). The tool computes every figure and then reads the deliverable.
- It flags a number that is in neither the ledger nor the brief, a total that does not match its rows, two periods or two money bases in one table, and a verdict label that its number contradicts (Cut with spend above zero, Hold with a raise).
- A house rule: one basis per number. Savings are valued at margin, not order value. Stock is split into on hand, held, inbound and sellable before cover is worked out. One period per table.
- The offers, growth and testing skills call the tool before hand-over (E10, E11).

**How we will know.** Maths and contradiction cites at or below plain. Correct at 9.0 or more on e-commerce and held-out.

### E6. Grounded operating details

**Lens:** NUMBERS, SHIP. **Dimension:** correct.

**Problem.** Invented-detail cites on e-commerce: 33 vs 18 (17 vs 19 before round 1). Date cites: 28 vs 7.
- J01 counts 86% of prospecting purchases as real, a "midpoint" the brief never gave (11 vs 0).
- J06 invents a 10 to 11 mm thickness for 6 or 7 cards (11 vs 1).
- J02 adds a 25-and-up age floor (6 vs 2) and three zero-spend setup days (3).
- J09 uses a "practitioner yardstick" (8 vs 0).
- J11 and J08 pin plans to invented calendar dates (6 and 5); J08 even writes 2027.
- Held-out confirms: H01 delays purchase orders to a Friday for no reason (7 vs 0); H03 invents a mid-November start.
- Cause: round 1's "decide every open point with the assumption a top practitioner would pick", "be specific: real names, prices, dates" and "plans: dated steps" in WORK-METHOD (fixed in G2), and skill fields that ask for a start date.

**Change.**
- House rule: only the brief's facts, and cards cited by id in the trace, may set a number, a date, a window, an age range, a delay or a product spec. Plans use relative time (Day 1, Week 2) unless the brief gives a date. When a fact is missing, the plan works without it or states one assumption line, never a precise-looking figure.
- Skill sweep in each group: "start date" and "end date" fields become "start day" and "run time".
- Attribution uses the store-vs-platform gap the brief gives.
- Product facts are quoted, never interpolated.

**How we will know.** Invented-detail and date cites at or below plain. No calendar date in a rerun output that is not in its brief (the G5 check counts them).

### E7. A media-buying audit spine

**Lens:** MEDIA, LEVERAGE, NUMBERS. **Dimensions:** fit, priorities, correct.

**Problem.** J01 is the weakest e-commerce job (10 to 8) and the biggest correctness drop (8.89 to 8.22):
- the invented 86% attribution midpoint (11);
- verdict labels that do not match the numbers (7);
- a ₹1,49,100 reserve and no scale calls (Claude);
- extra testing logic the owner did not ask for (2).

J02 (15 to 4) shares the same weaknesses:
- a release rule that counts TikTok-reported cost (2);
- a convoluted day-30 rule (Claude);
- zero spend in days 1 to 3 (3);
- an age floor (6);
- a thin pipeline for the winning style (8).

Held-out confirms: H02 holds $104,000 (43% of the budget) in reserve (14 vs 5).

**Change.** A fixed spine in the media-buying skills, in this order, each step one short section:
1. **Tracking:** read the store-vs-platform gap the brief gives, per ad set where given; judge on store numbers.
2. **What worked before:** list past winners, including paused ones, and relaunch them first with fresh cuts.
3. **Audiences:** from the data's best segments; no age or interest floor the data does not support.
4. **Formats and messaging:** weighted to the proven style, with enough new creative in that style to feed the budget.
5. **Budget:** the full budget is planned. Proven winners are funded from day one where tracking works. A reserve is at most 15% and has a release rule on store numbers the account will hit within the period.
6. **Verdicts:** one label per line that matches its number (Cut means zero, Trim means lower, Hold means the same, Scale means higher).
7. **Rules:** one cut or scale rule per ad set, in one line, read on store numbers.

House rule 11 is rewritten to match point 5.

**How we will know.** J01 won by 14 or more of 20. Reserve, label and attribution cites at or below plain. H02 reserve cites fall (as a check, not a target).

### E8. A concept matrix for real variety

**Lens:** RANGE, PERSONA, BRAND. **Dimensions:** range, voice, fit.

**Problem.**
- J03 drifts back to "the product shots we already have" (Claude); 10 vs 0. It also ignores the 41-plus segment.
- J04's spoken disclosure sits inside the hook. One judge: "Forcing creators to say clunky lines out loud mid-hook" (Gemini). J04 voice is the lowest in e-commerce (8.00).
- J02 underbuilds the winning on-feet style (8 vs 1).
- J05 has no headline that leads with taste, the top review theme (4).

Range is already a lead (8.53 vs 7.65), so the gain is in voice and fit as much as range.

**Change.** Creative skills and cards build a concept matrix before writing (a working table): one row per concept, with segment (from the brand brain), angle, format, hook source (a customer phrase), and first frame.
- At least three formats.
- No concept in a style the owner called tired.
- At least half of the new creative in the proven style, with enough creators or variants to feed the budget.
- One concept for each top segment, including the best-performing one.
- The top review theme leads at least one headline.
- Disclosure rules: on-screen and in the caption from the first second. A spoken line goes at a natural beat after the hook, never inside the payoff.
- Spoken lines are read aloud in the creator's voice before hand-over.

**How we will know.** Range at 9.0 or more; voice on J04-type jobs at or above plain; no "tired style" or "mid-hook disclosure" cites.

### E9. Customer messages true for every segment

**Lens:** PERSONA, SHIP, BRAND. **Dimensions:** fit, ready, voice.

**Problem.**
- J07 tells sunscreen buyers to use their product "every other night" (8 agent cites; plain had the same fault 9 times, so this is a lead to take, not a gap to close).
- J12's cart template says cash on delivery is on for every cart (Claude) and leaves the evening wave unstaffed (10 vs 5).
- J08 gives the oldest lapsed group 15% off with no test (2) and sends a quiz instead of a coffee (9 vs 0).
- J06's top return reason is not answered at the button (12).
- General confirms: G10's control group gets no emails at all (6 vs 0).
- Held-out confirms: H03's day-3 update "excludes no-scan parcels", the very group with the problem (3), and its fit help is a quiz link.

**Change.** Retention, chat and page skills add a segment truth check (a working table): each message against each segment that receives it.
- Is every line true for that segment (usage, availability, payment method, offer)?
- Does the message reach the segment where the problem lives?
- Does it give the answer (the named product, the fit tip) rather than send people to a tool?
- Offers are valued at margin.
- The flow is measured against the current flow, not against no messages.
- Any work the plan adds (calls, shifts, replies) names who does it and in which hours.

The product page answers the top return reason in the bullets and the line by the button.

**How we will know.** No segment-truth or "sends to a quiz" cites. J08 and J12 each won 19 or more of 20 (they already win; the gain is strict-judge "as is").

### E10. Offers and growth plans that lead with the proven winner

**Lens:** LEVERAGE, INSIGHT, NUMBERS. **Dimensions:** priorities, correct, reasoning.

**Problem.**
- J10 turns the proven two-product pair into a three-item set: "makes the hero offer a 3-item set instead of leading with" the winner (OpenAI); 6 judges.
- J10 keeps the free-shipping threshold while also testing a higher one, which reads as hedged (3).
- J09 rests gains on stacked assumptions (8 vs 0) and is dense (10 vs 0).
- J09 also puts the product fix lower than the linen problem deserves (OpenAI).

**Change.** Offer and growth skills:
- The proven winner leads unchanged. Any change to it is a test, not the plan.
- One call per decision, with a point estimate and its range in one line.
- Moves ranked by money per unit of effort, first-week action first.
- At most one assumed input per projection, named in the line.
- Each move names who does it.
- The numbers ledger (E5) runs before hand-over.

**How we will know.** J09 and J10 each won by 18 or more of 20; correct on both at 9.0 or more.

### E11. A store test for every big objection

**Lens:** INSIGHT, NUMBERS. **Dimensions:** fit, correct.

**Problem.**
- J11 (14 to 6) gives firmness, 19% of pre-sale chats, no test of its own (10, plain 8).
- It treats the smallest detectable effect as the expected lift (Gemini).
- It applies an add-to-cart effect to orders (DeepSeek), mixes mobile and all-device baselines (4) and pins the plan to invented dates (6).

**Change.**
- `design-store-ab-test`, `read-store-ab-test-result`, the CRO cards and the readiness checker: every objection above about 10% of chats or returns gets a test or a direct fix.
- The plan states the expected lift and the smallest detectable effect as two different numbers.
- A lift measured at one funnel step reaches orders only through the step's pass-through rate from the data.
- One baseline per traffic scope; schedules in relative weeks.

**How we will know.** J11 won by 17 or more of 20; no MDE, baseline or date cites.

### Considered, not ranked into the list

- **Rendered pages, emails and static ads with a visual check.** The packs already carry `render.cjs` and `check-logo-contrast.cjs`. An HTML page or email in brand fonts and colours, rendered phone first and checked for AI errors, would serve the VISUAL lens. But the bench judges read text only and cannot see a render, and image generation was out of scope in round 1. Proposal for round 3: add a visual judge pass (renders plus the brand's live site screenshots) and a VISUAL rubric line, then build this leap. It needs no new pack tool, only a bench change.
- **Job-type skills** (`src/modules/catalogue/data/jobs-*.json`): some general packs (G04, G05) carry generated job skills. Editing that data is wider than this round's evidence supports.

## 6. The general fixes, ranked

| Rank | Fix | Main dimension | Group |
|---|---|---|---|
| G1 | Retune the round 1 rules that regressed | Clear, priorities, fit | GA, GB |
| G2 | Decide without inventing | Correct | GA |
| G3 | The strongest signal sets the weights, the order and the asks | Fit, priorities, reasoning | GA |
| G4 | Write it in full, with one light ask | Ready, voice | GB |
| G5 | Trace-to-brief checks | Correct, ready | GB |

### G1. Retune the round 1 rules that regressed

**Problem.**
- A labelled bolder move sits in 26 of 28 agent outputs (plain 0). General judges cite it 25 times vs 2: G08 10, G07 5, G04 5.
- G08: "It breaks the brief by effectively making two recommendations" (OpenAI). G07 demotes a standard gate: it "keeps the staged 10% rollout as an optional 'bolder move'" (Claude).
- The 85% length aim did not shorten anything (R8).
- Held-out confirms: bolder-move cites 7 vs 2.

**Change.**
- Quality engine rule 4, ROUTING, WORK-METHOD step 4, CHECKER, lessons and `_any.md`: the bolder move becomes optional.
  - Use it only in plans and strategies, only when it would beat the plan, inside the plan's length, and never in copy deliverables.
  - Never use it when the owner asks for one plan or one recommendation.
  - A standard safety gate is never a "bolder move".
- "Combine complementary moves" applies only when the owner did not ask for one recommendation, and the result reads as one decision.
- The 85% aim goes. Stay within the owner's limit, stop when the job is done, and cut any section the owner did not ask for.
- `wordcount.cjs` and `qe-check.cjs` drop the 85% warning and fail only above the owner's limit.
- "Act fully on the signal" stays: it fixed G10 (3 to 19) and G08.

**How we will know.** Bolder-move cites at or below plain. G08 and G07 hold their wins. General clear at or above plain.

### G2. Decide without inventing

**Problem.**
- G03 states a 27 November ship date and a New York base as settled (10 vs 4): "It invents a 27 November ship date" (Claude).
- G04 invents a 12th-to-15th send window that delays the trigger (9 vs 0).
- General invented-claim cites rose from 4 to 12, and date cites from 11 to 21.
- Held-out confirms: H01 delays its purchase orders (7 vs 0).

**Change.**
- WORK-METHOD lines 7, 52 and 56 and quality engine rule 1: decide what is yours to decide (the plan, the copy, the order). Never state the owner's own decisions or the business's operating facts as done.
- When a fact is missing, write the plan so it works either way, or state one assumption line. Use relative timing unless the brief gives dates.
- "Dated steps" becomes "steps in order, with owners and days relative to the start".

**How we will know.** Invented and date cites on general at or below plain; no date in a rerun output that is not in its brief.

### G3. The strongest signal sets the weights, the order and the asks

**Problem.** The agent quotes the deciding number, then lets something else set the weight, the order or the ask.
- G05 "puts 45% of the scorecard weight on interview rows" (Claude) against a 0.11 correlation (11 vs 5).
- G04 asks for a 20-minute call when a calendar link had the lowest reply rate (12 vs 3).
- G06 puts "the fastest and cheapest money" second (11 vs 7).
- G07's ranking table contradicts its own rule (8 vs 4).
- G01 "drops the consolidation and redirect of dead blog posts I explicitly asked for" (DeepSeek); 11 vs 2.

**Change.**
- WORK-METHOD step 0 adds the asks list: every explicit ask in the brief, each with where the deliverable meets it.
- The signal pass adds "what this signal sets": a weight, an order, an ask, a timing.
- Step 5 and quality engine step 8 check both. Ranking defaults to money per unit of effort, fastest money first unless a dependency blocks it.
- `blind-review.mjs` asks two more questions: which explicit asks are missing, and which weight, order or ask cuts against a signal.

**How we will know.** G05 and G04 each won by 12 or more of 20; signal hits at 95% fully; no "dropped ask" cites.

### G4. Write it in full, with one light ask

**Problem.**
- G05 leaves the exercise as "a real ticket from the last 90 days" (16 vs 8).
- G10's email 5 is "two branch snippets rather than full bodies" (Claude); 17 vs 6.
- G04's asks are heavy or two-in-one (12 vs 3).
- G09 declares that nothing needs clinical or legal review when two drafts touch sleep problems (13 vs 9).

**Change.** General cards and role skills:
- Every exercise, prompt, email branch and template is written in full.
- An onboarding holdout gets the current series, not nothing.
- An outbound first touch has one light ask that the data supports, timed from the trigger, not from a calendar window.
- A review or compliance call names what would trigger review and flags anything close. When unsure, flag it. This is a safety rule and stays strict.

**How we will know.** No "describes instead of writes" or "heavy ask" cites at or above plain; G05 and G10 judges cite no unwritten piece.

### G5. Trace-to-brief checks

**Problem.** Nothing mechanical catches an invented date, a figure from nowhere, a bolder move in a copy job, a "use a real ticket" description or a Cut label with spend. Every one of those was cited in the post-test.

**Change.**
- `check-handover.mjs` and `leakcheck.cjs` gain a `--brief` mode that flags:
  - calendar dates and weekdays that are not in the brief;
  - money and percentage figures that are in neither the brief nor `context/numbers.json`;
  - a "Bolder move" heading under a copy profile;
  - describe-not-write phrases ("use a real", "pick one from", "take the quiz", "[X]").
- `qe-check.cjs` runs `numbers.cjs` (E5) and `trace-check.cjs` (E3) when their inputs exist.

**How we will know.** On the frozen post-test outputs, the checks flag the J01, J08, J11, G03 and G04 dates, the G05 description and the copy-job bolder moves, and flag 3 or fewer plain outputs.

## 7. What the held-out evidence confirmed

The held-out set stays a test set. No ticket edits a held-out job's skill (inventory reorder, Shopping and Performance Max, returns and order-status, cancel flow, help centre, affiliates). Each fix below rests on main-set evidence first; held-out only confirms it.

| Fix | Held-out confirmation |
|---|---|
| E1 signal-to-asset | H03 fit help left to a quiz (19 vs 15) |
| E4 clarity | H01, H06 called dense; held-out clear 8.62 vs 8.90 |
| E5 numbers ledger | H03 order value instead of margin, mixed periods (8 vs 3); H06 projection on volumes not in the brief |
| E6 grounded details | H01 purchase orders delayed for no reason (7 vs 0); H03 invented start |
| E7 media-buying spine | H02 $104,000 reserve (14 vs 5) |
| E9 segment truth | H03 day-3 update excludes the no-scan group |
| G1 retune | bolder-move cites 7 vs 2 |
| G2 no inventing | H01 delay, H03 timeline |

Not confirmed: E3 (knowledge use). The held-out store jobs had e-commerce packs and still slipped. H04 to H06 are not store jobs.

## 8. Rules from round 1 that we soften or remove

| Round 1 rule (where) | What it did | New rule |
|---|---|---|
| "Plans add one labelled bolder move" (WORK-METHOD l.50, QUALITY-ENGINE-v3 rule 4, ROUTING light and standard, CHECKER, `_any.md`, paid-social-ads card) | 26 of 28 outputs carry one; G08 menu, G07 demoted gate, G04 move against the signal, copy jobs padded | Optional; plans only; only if it beats the plan; never in copy or when one plan is asked |
| "One recommendation, which may combine complementary moves" (WORK-METHOD l.50, QE step 2) | G08 read as two recommendations | Combine only when the owner did not ask for one, and say it as one decision |
| "Aim at about 85% of the owner's limit" (WORK-METHOD l.55, QE rule 3, PROFILES.md, wordcount.cjs, qe-check.cjs) | No shorter output; a word-count target | Within the owner's limit; stop when done; no bolt-on sections. Length is judged only by clarity and the owner's own limit |
| "Decide every open point with the assumption a top practitioner would pick" (WORK-METHOD l.7, QE rule 1) | Invented midpoints, dates, windows, owner decisions | Decide what is yours; never invent the business's facts; one assumption line or a plan that works either way |
| "Be specific: real names, prices, dates" and "Plans: ... dated steps" (WORK-METHOD l.52, l.56) | Invented calendars in J08, J09, J11, G03 | Relative days unless the brief gives dates |
| "Projections ... welcome" (QE rule 1) and house rule 3 "Show the after" | More projections, more maths faults | Kept, but every projection goes through the numbers ledger, with at most one assumed input |
| House rule 11 "Spend plans add up ... a release rule" | H02 and J01 still park big reserves | Full plan; reserve at most 15% with a release rule the account will hit |
| "Act fully on the signal" | Fixed G10 and G08 | Kept, extended to weights, order and asks (G3) |

## 9. Guardrails

- **Keep what wins.** Decision rules, traced maths, profit-based calls and new insight are the agents' edge. No edit removes "show the working"; the working moves to the ledger or an appendix, it does not vanish.
- **Safety stays as it is.** Nothing is spent, sent or published without the client's yes; approvals live in the agent's own message, outside the deliverable. No invented facts, results or reviews. No passwords. AI-made people are never passed off as real. Disclosure rules move to better places in a script; they never get weaker.
- **No teaching to the test.** No bench brand, held-out brand, number, persona name or owner-note answer goes into a pack, skill, card or rule. Add the held-out brands (SUGAR Cosmetics, Rothy's, Lounge Underwear, Babbel, Splitwise, Podia) to `scripts/bench-leak-guard.cjs`. Examples in rules are generic.
- **The owner trumps rules.** Every rule added here keeps the line at the top of WORK-METHOD: if a rule makes the work worse for this owner's stated goal and data, follow the owner and say why in one line.
- **General work holds.** General share at or above 77%, no general job lost, no general dimension below plain.
- **Writing.** Plain English at grade 8 to 9, no em or en dashes, no AI Blocks prices.

## 10. The rerun

- Same 20-judge panel, briefs, owner notes, rubrics and harness (`../owner-judge.mjs`); plain outputs frozen from round 1.
- Packs rebuilt from the merged sources, then the agent arm runs per `ARMS.md` and `RULES-DELIVERABLE.md`, using the pack map in section 11.
- Report: every target in section 1, the general guardrails, `themes.cjs`, `signal-hits.mjs`, `limits.cjs`, a new strict-judge ship-rate script, trace and ledger pass rates, and held-out.
- Ship rule: ship when the round 2 gate in section 1 is met, correct and clear are above plain, general holds and held-out store jobs do not fall. Otherwise ship only the groups whose effect shows per job.

## 11. Which pack each bench job's agent arm used

E-commerce jobs are recorded in `../ecommerce-agents/2026-11-13/RESULTS.md`. The general and held-out mappings are written down nowhere in this folder; they are inferred from the 28 pack folders the round 1 runs used (`<round-1 scratchpad>/bench/v3/packs-post/`, which holds exactly these 28 packs), from the role each pack's `pack.json` names, and from `PRD-TOP10.md`'s appendix (G08, G09, G10). Round 1 scratchpad: `C:/Users/kevin/AppData/Local/Temp/claude/8f10770e160c21fe/54b7bad7-7e5c-417d-b31e-901f61d12720/scratchpad/bench/`. Pre-test packs sat in `packs-v2/` (e-commerce), `v3/packs/` (general) and `v3/packs-ho-pre/` (held-out); post-test packs in `v3/packs-post/`. To rerun, rebuild and take each pack from `marketplace/dist/packs/<id>/` (or its zip).

| Job | Pack (agent id) | Role in pack.json | E-commerce kit | Source of the mapping |
|---|---|---|---|---|
| J01 Meta budget | jared-performance-marketing | growth-marketer | yes | recorded |
| J02 TikTok launch | zara-tiktok-ads | tiktok-ads-media-buyer | yes | recorded |
| J03 Meta concepts | tendai-ad-creative | ad-creative-strategist | yes | recorded |
| J04 UGC scripts | devon-video-ugc | video-producer | yes | recorded |
| J05 Meta ad copy | kofi-ad-copy | advertising-copywriter | yes | recorded |
| J06 Product page | georgia-product-copy | ecommerce-copywriter | yes | recorded |
| J07 Welcome series | lucia-email-copy | email-marketing-specialist | yes | recorded |
| J08 Win-back | imogen-retention | lifecycle-marketer | yes | recorded |
| J09 90-day plan | malcolm-ecommerce-growth | ecommerce-manager | yes | recorded |
| J10 Bundles and shipping | brendan-offers | growth-marketer | yes | recorded |
| J11 Mattress test plan | gretchen-store-testing | cro-specialist | yes | recorded |
| J12 WhatsApp COD | rohan-chat-sales | chatbot-specialist | yes | recorded |
| G01 SEO plan | danielle-seo | seo-specialist | no | inferred |
| G02 Landing page | dawei-landing-pages | cro-specialist | no | inferred |
| G03 Investor update | paloma-investorupdate | startup-fundraising-consultant | no | inferred |
| G04 Cold email | silvia-sales-playbooks | sales-enablement-specialist | no | inferred |
| G05 Job post | nathan-jobpost | recruiter | no | inferred |
| G06 Competitor analysis | kojo-competitor-analysis | market-research-analyst | no | inferred |
| G07 Launch plan | jocelyn-product-launch | product-marketing-manager | no | inferred |
| G08 Pricing | osman-subscriptionpricing | pricing-strategist | no | inferred, named in PRD-TOP10 appendix |
| G09 Content plan | achieng-content-strategy | content-marketer | no | inferred, named in PRD-TOP10 appendix |
| G10 Onboarding emails | candice-email-marketing | email-marketing-specialist | no | inferred, named in PRD-TOP10 appendix |
| H01 Stock plan | omar-inventory-planning | supply-chain-planner | yes | inferred |
| H02 Shopping and PMax | raymond-google-ads | google-ads-media-buyer | yes | inferred |
| H03 Post-purchase | latoya-post-purchase | cx-manager | yes | inferred |
| H04 Cancel flow | mercedes-cancel-save | customer-success-manager | no | inferred |
| H05 Help centre | ankit-help-docs | technical-writer | no | inferred |
| H06 Affiliates | varun-affiliates | affiliate-influencer-manager | no | inferred |

Note for G04: silvia-sales-playbooks carries the sales-enablement skills and a generated `sales-playbook` job skill, not `sdr/cold-email-sequence`. Ticket F1 records this map as a file in the bench folder so the next run does not depend on a temp folder.
