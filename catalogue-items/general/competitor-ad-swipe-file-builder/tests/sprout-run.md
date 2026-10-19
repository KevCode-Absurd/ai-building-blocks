# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 5 met. Invented facts: 0.

The run correctly refused to file headline-only ads and made no invented IDs, dates or tiers, and it clearly told the owner what to collect next. However, the board is empty, so the business gets no study board yet, and the run's own check (three cards from two advertisers per type) fails.

## Fix

Add a step that, when no screenshots are supplied, returns only a collection checklist and skips the score. Or treat the "three from two advertisers" check as not applicable when no ads were filed, so a correct refusal can pass.

## Judge list

- Met: None of your own ads are on the board.
  Board has a single empty row: "No cards." No ads of the user's own appear.
- Met: Every card has a library ID and start date you can check in the library.
  No cards exist; IDs and dates flagged "MISSING: library IDs" instead of invented.
- Not met: No ad appears twice, and each full type has three cards from at least two advertisers.
  "No type has any cards, and only one advertiser was collected." Output itself marks this check missed.
- Met: Nothing is called a "winner". The tier is shown as a hint, with the days live.
  "'copies live' counts are a hint about what Sprout is betting on, not results." No winner language.
- Met: The "what to study" line points at structure, not wording to copy.
  The only what-to-study cell reads "No cards. None of the ads came with a screenshot"; no wording to copy.

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

| Type | Code | Advertiser | Library ID | Start date | Tier | Live? | What to study |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | No cards. None of the ads came with a screenshot, so none could be looked at or filed. |

`MISSING: screenshots of each creative`
`MISSING: library IDs`
`MISSING: "started running" dates (tiers left blank)`
`MISSING: platforms, active status and version notes per ad`
`MISSING: ads from at least one other advertiser`

## 2. Notes

- **What is it?** No cards. No pattern or dress can be read.
- **Is it for me?** No cards. No pattern or dress can be read.
- **Can I believe it?** No cards. No pattern or dress can be read.
- **Why now?** No cards. No pattern or dress can be read.

Headlines alone are not the creative. The biggest thing in the frame decides the type, so filing from the text would be filing from the search.

## 3. Gaps

- **All nine types are empty**: Product alone, Look inside, The moment, Old way new way, In use, Their words, Checked fact, The offer, The occasion. The cause is no screenshots, not a lack of ads.
- **One advertiser only.** Even with screenshots, every type would fail "three from at least two advertisers." Sprout alone can only show Sprout's habits.
- **No neighbouring-category search run.** I can't browse the library. To fill the board, collect by hand from the library (logged out, country US, "All ads"):
  - Sprout's own page.
  - Two or three other greens, gummy-vitamin or daily-supplement brands whose buyers ask the same questions.
- **For each ad, bring:**
  - A screenshot (the first frame, for video).
  - The library ID.
  - The "started running" date.
  - Active or not.
  - Platforms.
  - Whether it has several versions.
  - Where the link leads (product page, collection, or article-style page).

## 4. Not looked at

All are Sprout headlines with no screenshot, no ID and no start date. Duplicate versions are already merged per line.

1. "'Sprout is too expensive': here's 61% off to prove otherwise"
2. "Don't Pay Full Price. You Literally Don't Have To. (61% off inside)"
3. "Get up to 61% OFF + 4 FREE gifts: online exclusive" (plus sister line)
4. "Trusted by 1M+: Take 61% OFF"
5. "We're Lowering Our Prices 🔥"
6. "Fix the Hot Girl Tummy"
7. "Struggling to Get Enough Fiber?"
8. "Nutrition for Healthy Hair"
9. "Support Muscle While You Lose Weight"
10. "The Daily Nutrition Every Runner Forgets"
11. "Perks That Really Pile Up"
12. "One Step I Never Skip" (plus "Nutrition Made Ridiculously Easy")
13. "He Asked What Day It Was. I Handed Him a Gummy."
14. "Fiber Kids Won't Fight"
15. "Methylfolate, Not Folic Acid"
16. "[Cartoon tie-in]-Themed Fun. Vitamins They Actually Want."
17. "The veggies they won't eat. In a gummy they will."
18. "One pack a day keeps the gut happy 💩"
19. "The Lemon Aid Stand is open. 🍋"
20. "30 Days Of [a fitness app], Free"
21. "Perfect Supplement for Weight Loss Support | Support Energy & Wellness"

The two main texts aren't tied to a headline or screenshot, so they can't be matched to a card. One says "probiotics," but the product page lists none. Don't treat its claims as fact.

The "copies live" counts are a hint about what Sprout is betting on, not results.

## 5. Score

3 / 5 checks passed = 3 ÷ 5 × 100 = **60 / 100**

- **Missed: "Every card was looked at, and has a library ID and start date."** No screenshots, IDs or dates were supplied, so no card could be made. It can't be fixed without the screenshots.
- **Missed: "Each full type has three cards from at least two advertisers."** No type has any cards, and only one advertiser was collected. It needs screenshots plus ads from at least one more brand.
```
