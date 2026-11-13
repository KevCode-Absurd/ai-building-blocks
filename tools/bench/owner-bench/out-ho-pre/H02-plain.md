# Rothy's: Google Shopping and Performance Max plan, next 30 days

## The short answer

You keep 40% of each sale, so spend under 2.5 ROAS loses money. Brand searches hide this inside the 4.0.

| Campaign | Spend | Value | Profit after ad cost |
|---|---|---|---|
| Brand search | $12,000 | $204,000 | $69,600 |
| PMax, brand terms | $14,700 | $275,520 | $95,508 |
| Bags Shopping | $18,000 | $86,400 | $16,560 |
| PMax, everything else | $195,300 | $396,480 | -$36,708 |
| **Total** | **$240,000** | **$962,400** | **$144,960** |

Brand terms are 11% of spend and 50% of value, mostly from buyers who already chose you. Without brand terms, PMax runs at 2.03 and loses about $36,700 a month.

## What is working, and what to cut

**Working**
- Bags Shopping at 4.8, and it ran out of budget (lost 38% of impressions).
- "Washable shoes" and "machine washable flats" at 3.9 (+$15,680).
- "Comfortable work flats" and "flats for standing all day" at 3.4 (+$7,560). This is Claire's search.

**Losing money**
- "Women's flats" and broad terms: 1.2 (-$33,280).
- Display, video and unknown: 1.7 (-$18,748).
- "Sustainable shoes": 1.6 (-$7,920). The material story works as a second reason, not the lead.

**Wasted**
- $14,700 of PMax spend on brand terms with no brand exclusion. Brand search should take these at lower cost.

## The $240,000 split

| Line | Budget | Change | Setup |
|---|---|---|---|
| Brand search | $18,000 | +$6,000 | Absorbs brand queries leaving PMax. Target impression share. |
| Bags Standard Shopping | $29,000 | +$11,000 | $18,000 ÷ 62% share ≈ $29,000 to close the budget gap. |
| Non-brand Search, washable and work comfort | $35,000 | New | Exact and phrase match on the four winning themes. |
| PMax, brand excluded | $128,000 | -$82,000 | Target ROAS 3.0, feed-led asset groups. |
| Reserve | $30,000 | New | Released weekly only to lines holding ROAS 3.0 or better. |
| **Total** | **$240,000** | | |

The cap is a ceiling. Unspent reserve is profit.

## Fix the feed first

**Price mismatch.** 212 pointed flat variants in sizes 5 to 7.5 are off Shopping since 21 October. Those sizes are 46% of pointed flat sales, and the pointed flat is 34% of site revenue. So about 15.6% of site revenue cannot show in Shopping right now.

1. Open five disapproved variants. Compare the feed price, the price on the page with that size selected, and the price in the page's structured data.
2. Likely causes: a site sale price missing from the feed, a size-level price, or a variant link that loads another size.
3. Fix the source. Use `sale_price` with dates for promotions. Make each variant link open with its size selected.
4. Turn on automatic item updates for price and availability, then request review.

**Titles.** "The Pointed Flat | Black" says nothing a shopper searches for. Use: product name, what it is, what it does, color, size.

- Before: The Pointed Flat | Black
- After: The Pointed Flat, Women's Machine Washable Pointed Toe Flat, All-Day Comfort, Black, Size 6
- Bags: [Bag name], Washable Knit Travel and Work Tote, Folds Flat, [Color]

Keep key words in the first 70 characters. Claim "folds flat" only where true.

**Other fields.** Fill size, size system (US), gender, color and material. Add highlights: "Machine washable" and "Knit from thread spun from recycled plastic bottles." Add custom labels for best sellers and core sizes.

**Search ads.** Headlines: "Made to Walk, Made to Wash", "Flats You Can Wash", "Stand All Day in Comfort". Description: "Flats made for eight hours on your feet. When they get dirty, put them in the wash."

## What to expect

Planning estimates, not promises. I assume brand value holds at 95% after the switch, as most brand buyers come anyway.

| Line | Spend | Base ROAS | Base value | Cautious ROAS |
|---|---|---|---|---|
| Brand search | $18,000 | about 25 | $455,000 | same |
| Bags Shopping | $29,000 | 4.3 | $124,900 | 4.0 |
| Non-brand Search | $35,000 | 3.2 | $112,000 | 2.8 |
| PMax | $128,000 | 2.6 | $332,800 | 2.2 |
| Reserve | $30,000 | 3.0 | $90,000 | not spent |

- **Base case:** $240,000 spend, $1,114,700 value, ROAS 4.6. Profit after ad cost about $205,900, up about $60,900 from today.
- **Cautious case:** $210,000 spend, $950,600 value, ROAS 4.5. Profit about $170,200, up about $25,300.

Bags assume the extra $11,000 earns 3.5. PMax at 2.6 depends on the feed fix and the higher target. Judge by profit, not ROAS.

## First week, in order

1. **Day 1.** Diagnose and fix the price mismatch. Push the corrected feed, turn on automatic item updates and request review.
2. **Day 1.** Add a brand exclusion for Rothy's to PMax. Raise brand search to $600 a day with a target impression share bid.
3. **Day 2.** Raise bags Shopping to about $967 a day.
4. **Day 2.** Cut PMax to about $4,270 a day. Set target ROAS at 2.6 now and 3.0 next week, so it does not stall. Move asset groups toward feed-led setups to cut display and video spend.
5. **Day 3.** Launch the non-brand Search campaign at about $1,170 a day with the four themes and the ads above.
6. **Day 3 to 4.** Rewrite pointed flat titles first through a supplemental feed. Then the rest of the flats, then bags.
7. **Day 5.** Check disapprovals cleared, brand impression share is above 90%, and pacing.
8. **Day 7.** Review each line against the 2.5 break-even. Release reserve only to lines at 3.0 or better.

## Assumptions

- The search category table is an agency estimate. Check it in week one before cutting further.
- Conversion values follow your current attribution setting. Repeat purchase value is not counted.
