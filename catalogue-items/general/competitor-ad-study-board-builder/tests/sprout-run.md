# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly refuses to file anything from headlines alone, since there are no screenshots, library IDs or start dates. It gives a clear list of what to collect and lists every headline as not looked at, with nothing invented.

## Judge list

- Met: None of your own ads are on the board.
  Board holds a single 'none' row; no ads filed.
- Met: Every card has a library ID and start date you can check in the library.
  No cards filed; run states 'MISSING: library ID for every ad' instead of inventing them.
- Met: No ad appears twice, and each full type has three cards from at least two advertisers.
  No cards; gaps section says all nine types empty and explains one advertiser can't satisfy the rule.
- Met: Nothing is called a winner. Tier is shown as a hint, with days live.
  No winners named; 'no tier can be set without it' (start date).
- Met: The 'what to study' line points at structure, not wording to copy.
  Only row says 'No cards filed. See Gaps and Not looked at.'

## What went in

```text
My business: a smaller greens gummy brand. I'm studying the category
leader's ads before we plan ours.

The ads: 15 live headlines from Sprout in the public Meta Ad Library,
with what each one pushes and how many
copies were live, plus the extra Kids headlines (sprout/ads.md).
Formats and start dates weren't copied. Headlines only; no
screenshots, no library IDs.

[attached: sprout/ads.md]
```

## What came out

```text
## 1. Board

| type | code | advertiser | library ID | start date | tier | live? | what to study |
|---|---|---|---|---|---|---|---|
| none | none | none | none | none | none | none | No cards filed. See Gaps and Not looked at. |

`MISSING: screenshot or plain account of each creative` (the rule is: no screenshot, don't file)
`MISSING: library ID for every ad`
`MISSING: "started running" date for every ad` (no tier can be set without it)
`MISSING: platforms per ad`
`MISSING: ads from at least one other advertiser` (every type needs two)

## 2. Notes

- **What is it?** No cards, so there is no pattern and no dominant dress to report.
- **Is it for me?** No cards, so there is no pattern and no dominant dress to report.
- **Can I believe it?** No cards, so there is no pattern and no dominant dress to report.
- **Why now?** No cards, so there is no pattern and no dominant dress to report.

## 3. Gaps

- **All nine types are empty.** Product alone, Look inside, The moment, Old way new way, In use, Their words, Checked fact, The offer and The occasion have 0 cards each.
  - **Why:** Only headline text was supplied. A card is filed from the creative, meaning the first frame and the biggest thing in it, not from its words. A headline alone can't settle the type or the dress (Camera, Designed or Lo-fi).
- **Only one advertiser.** Even once Sprout's creatives are captured, every type would still be one advertiser short. With a single advertiser, a pattern can't be told apart from Sprout's house habit.
- **What to collect to fill the board:**
  - Open Sprout's own page in the library, with the country set to US and filtered to active ads.
  - For each ad, take a screenshot and copy its library ID and start date.
  - Do the same for at least one more greens or gummy-vitamin advertiser.
  - If a type is still thin after that, run one search in a neighbouring category whose buyers ask the same question, for example kids' vitamins or fiber supplements.
- **Versions to merge once seen.** The "copies live" counts are versions. Each headline is one card, keeping its earliest start date. This applies to #1 (15+), #2 (8+), #3 (10, plus a sister line), #8 (6), #11 (7) and #6 (5).

## 4. Not looked at

All of these are Sprout ads where only the headline was given, with no screenshot, library ID or start date. They stay off the board.

1. "'Sprout is too expensive': here's 61% off to prove otherwise" (15+ versions)
2. "Don't Pay Full Price. You Literally Don't Have To. (61% off inside)" (8+ versions)
3. "Get up to 61% OFF + 4 FREE gifts: online exclusive" (10 versions, with a sister line)
4. "Trusted by 1M+: Take 61% OFF" (4 versions)
5. "We're Lowering Our Prices 🔥" (1)
6. "Fix the Hot Girl Tummy" (5)
7. "Struggling to Get Enough Fiber?" (versions not counted)
8. "Nutrition for Healthy Hair" (6, all made 2 Oct)
9. "Support Muscle While You Lose Weight" (1)
10. "The Daily Nutrition Every Runner Forgets" (2)
11. "Perks That Really Pile Up" (7)
12. "One Step I Never Skip" (1, plus "Nutrition Made Ridiculously Easy")
13. "He Asked What Day It Was. I Handed Him a Gummy." (1)
14. "Fiber Kids Won't Fight" (not counted)
15. "Methylfolate, Not Folic Acid" (not counted)
16. "[Cartoon tie-in]-Themed Fun. Vitamins They Actually Want." (Kids)
17. "The veggies they won't eat. In a gummy they will." (Kids)
18. "One pack a day keeps the gut happy 💩" (Kids)
19. "The Lemon Aid Stand is open. 🍋" (Kids, Raspberry Lemonade launch)
20. "30 Days Of [a fitness app], Free" (partner gift)
21. "Perfect Supplement for Weight Loss Support | Support Energy & Wellness"
```
