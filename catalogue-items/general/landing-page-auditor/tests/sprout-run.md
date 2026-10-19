# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

This is a strong, usable audit: every finding is anchored to the page, the prices and claims all trace to Sprout's files, the score arithmetic is correct, and missing data is flagged rather than guessed. It fails only on a small ranking slip, where the guarantee finding (which touches screen 1) was placed below a screen-2 finding of equal severity.

## Fix

In step 8, add: "If a finding spans several screens, rank it by the highest screen it touches; within one severity, sort every finding by that screen before ease."

## Judge list

- Met: Every finding quotes or points to a specific place on the page.
  Each row names a location and quotes, e.g. "Screen 2 (under button, small)" with "Renews at $49.99 each 4 weeks".
- Not met: The ranking follows severity first, then position on the page.
  #6 "Screen 1 (bar) + screen 2" sits below #5 "Screen 2" at the same severity; #4, also screen 1, was placed above #5.
- Met: No money figure or predicted lift appears without analytics.
  Only page prices and arithmetic ("$29.99 against $66.65 is 55%"); hypotheses say "raises first orders" with no number.
- Met: No fix asks for proof, ratings, counts or urgency you don't have.
  Fixes use on-file claims ("vitamin C +40.1%, folate +20.5%", "4.75 from 109,639") or say "name a source... or cut it".
- Met: The advice is about this page.
  Specific rewrites: "$29.99 first box, then $49.99 every 4 weeks ($1.78/day)"; delete "DISCOUNT AUTO-APPLIED" unless true.

## What went in

```text
The page: sprout.example/products/sprout, as text top to bottom, with
the notes on what was and wasn't seen (sprout/product-page.md).

Brand file: sprout/brand.md (buyers and their doubts, offers, the
guarantee, claims that are fine and risky).

No ad and no analytics this time. Judge the page on its own.

[attached: sprout/brand.md, sprout/product-page.md]
```

## What came out

```text
## 1. Job and verdict

**Job:** win a first purchase. Specifically, a first Subscribe & Save order from a cold visitor, most likely arriving from a Meta ad on a phone. Subscribe appears to be the default choice, though that is inferred.

**Verdict:** The product is easy to like, but the page makes the buyer work out the real price, the real discount and the real guarantee. It also leads with vague health claims instead of the plain idea that sells it: daily greens you'll actually keep taking.

## 2. Scent

`MISSING: ad to compare.` No ad was supplied, so this can't be judged properly.

One risk to flag from the brand file: live ads promise "up to 61% OFF + 4 FREE gifts" and "$20 off your first order". This page shows neither. It says 52% in the bar, "up to 55%" in the badge and 55% in the pop-up, and it never mentions gifts. If those ads link here, the offer the buyer clicked for isn't on the page.

## 3. Glance (phone first screen, inferred from text: announcement bar, gallery, title, rating)

- **What is this?** Only half answered. "Sprout Superfood Gummies" says gummies. The subhead, "60+ potent ingredients to revive whole body vitality", doesn't say greens, daily packs or one pack a day.
- **Who is it for?** Blank. Nothing names adults, people who quit powders or pills, or people with gut trouble.
- **What do I do next?** Likely blank on screen 1. The plan box and "Start Now" most likely sit below it (inferred).
- **What stood out?** The rotating discount bar ("Save 52%", "Save up to $80"), "4.8/5.0 (100,000), 1M+ Customers", and the word "vitality".

`MISSING: phone screenshots.` I couldn't check text size, button reach, or whether the "Sign Up for 55% Off" pop-up covers the first screen.

## 4. Skim

"Green superfood gummies that help with energy, immunity, stress and digestion. About $30 a month with free shipping, a money-back guarantee, a million customers, lab testing, and cheaper than powders."

A skimmer doesn't see three things:
- The price becomes $49.99 after the first box.
- The $29.99 needs a text sign-up.
- The guarantee covers the first order only.

## 5. Findings

| Rank | Read | Where | What the page does now | Fix | Sev | Ease | Needs analytics to size? |
|---|---|---|---|---|---|---|---|
| 1 | Doubt | Screen 2 (plan box) + footer | Shows ~~$66.65~~ $29.99 and "DISCOUNT AUTO-APPLIED", but the footer says the price "assumes customer has received and uses promotional SMS discount reserved for new customers only." The buyer finds out late, or at checkout. | Pick one. Either make $29.99 truly auto-applied, or put the condition beside the price: "$29.99 first box with your new-customer text code." Remove "DISCOUNT AUTO-APPLIED" unless it is true. | 4 | High | No |
| 2 | Glance | Screen 1 (title, subhead) | "Sprout Superfood Gummies" / "60+ potent ingredients to revive whole body vitality". It doesn't say what it is or who it's for. | Lead with the format and the reason to switch, using the brand's voice and only fine claims. Example: "Your daily greens, in gummy form." Subhead: "One pack a day. 60+ ingredients, 21 vitamins & minerals, 6g fiber. No shaker, no pills." | 3 | High | Yes |
| 3 | Glance / skim | Screen 1 (bullets); lower (Benefits accordion, "Why Sprout?") | "Promotes mental clarity + energy" and "Supports immunity + stress relief" go beyond the study, which measured only blood vitamin C and folate. The accordions add "replace a big shelf in your medicine cabinet" and "replaces handfuls of health products". | Swap the bullets for claims on file: "Supports digestion and gut health"; "Clinically tested for nutrient absorption (2025 study: vitamin C +40.1%, folate +20.5%)"; "Third-party tested for 70 pesticides, 4 heavy metals and more"; "Vegan, pectin-based, no synthetic dyes or sweeteners". Drop the "medicine cabinet" line. | 3 | High | No |
| 4 | Skim | Screen 1 (bar) + screen 2 (badge) + pop-up | Gives 52% in the bar, "UP TO 55%" in the badge and 55% in the pop-up. A "Limited Time Sale" bar also contradicts the birthday section's "Not just for a week but indefinitely." | Use one number that matches the price shown: $29.99 against $66.65 is 55%. Better still, name the price, not a percentage: "First box $29.99." Remove "Limited Time Sale" unless there is a real end date. Line up the ads and pop-up to match. | 3 | Med | No |
| 5 | Doubt | Screen 2 (under button, small) | "$1.07/day" sits large in the plan box. "Renews at $49.99 each 4 weeks" sits small under the button. If Subscribe is pre-selected, the recurring charge is easy to miss. | Put both prices in the plan box at the same size: "$29.99 first box ($1.07/day), then $49.99 every 4 weeks ($1.78/day)." This answers the price doubter's "Will the price jump?" | 3 | High | No |
| 6 | Doubt | Screen 1 (bar) + screen 2 (plan box) | Says "30-DAY GUARANTEE" and "30-Day Money-Back Guarantee" with no condition. The last FAQ adds "applies only to your initial purchase." The under-button line "Less than 1% of customers use our Money-Back Guarantee" is unverified and can read as "it's hard to claim." | Write "30-day money-back guarantee on your first order" wherever the guarantee appears. Replace the "<1%" line with how to claim the refund. | 3 | High | No |
| 7 | Doubt | Screen 2 (plan box) | Says "Pause Or Cancel Any Time" but never says how. Cancelling is the loudest complaint on public review sites. | `MISSING: cancellation method.` Add the real steps, for example where in the account to pause, skip or cancel. Promise nothing beyond what the site actually does. | 3 | Med | No |
| 8 | Doubt | Screen 1 (header) vs bottom (widget) | Header says "4.8/5.0 (100,000)". The widget on the same page says 4.75 from 109,639. | Show the widget figure with its source in the header: "4.75 from 109,639 reviews on sprout.example". Drop the rounded, older count. | 2 | High | No |
| 9 | Doubt | Screen 2 (Select Sugar Level) | Offers Low Sugar / Sugar-Free with no note that Sugar-Free uses sugar alcohols. The comparison panel wasn't captured (inferred). | One line under the selector: "Sugar-Free uses sugar alcohols, which can upset sensitive stomachs. Gut-sensitive? Start with Low Sugar." Show the price difference at the selector too. | 2 | High | Yes |
| 10 | Doubt | Screen 2 (One Time Purchase) | Says "No Free Shipping" but never says what shipping costs, so the cost appears late. "No First Order Discount" reads as a push toward subscribing. | `MISSING: one-time shipping cost.` State the actual shipping price. Describe the one-time option plainly ("28 packs, once, no renewal") instead of listing what it lacks. | 2 | High | Yes |
| 11 | Skim | Screen 2 (under button) | The delivery time ("ship within 24 hours ... arrive 3-5 days later") appears only in the FAQ. | Add "Ships within 24 hours, arrives in 3 to 5 days on average" to the risk line under the button. | 2 | High | Yes |
| 12 | Doubt | Lower (Us vs. Them) | Compares "$1.26" with "$3.60" and "~$35" (unlabelled). $1.26 matches none of the current prices ($1.07 first box, $1.78 renewal, $2.38 one-time). | Recalculate from the real renewal price ($1.78/day) and label every column. Name a source for the competitor figure, or cut it. | 2 | High | No |
| 13 | Doubt | Lower (Modern Living section) | Shows "[number missing] of U.S. adults don't meet..." and footnotes that just say "Source". | Fill in the number with a named source, or cut the line. Make the footnotes name the study. | 2 | High | No |
| 14 | Skim | Lower (reviews at the very bottom; themed cards mid-page) | Keeps the strongest proof ("the one thing I've been able to stick to", gut stories, powder quitters) far from the button. | Put 2 or 3 real reviews beside the plan box: one on the habit, one on digestion, one versus powders. Label each with what was bought (flavour, sugar level). | 2 | Med | Yes |
| 15 | Doubt | Lower (ingredients panel) | Says "over 20 vitamins & minerals" where the science page says 21. | Use "21" everywhere. | 1 | High | No |
| 16 | Doubt | Bottom (review summary) | Shows an auto-generated summary that mentions GLP-1 side effects next to the product. This is drug-adjacent. | Review or turn off the auto-summary. Keep GLP-1 wording out of brand-controlled copy unless it has been checked. | 1 | Med | No |

## 6. Quick wins this week

1. **The $29.99 condition (#1).** Either truly auto-apply it, or state the text-code condition next to the price and delete "DISCOUNT AUTO-APPLIED".
2. **Renewal price in the plan box (#5).** "$29.99 first box, then $49.99 every 4 weeks ($1.78/day)", at the same size as the first price.
3. **Guarantee wording (#6).** "On your first order" in the bar and the plan box. Replace the "<1%" line with how to claim.
4. **Bullets (#3).** Swap the energy, immunity, stress and "vitality" claims for the fine-to-repeat set (fiber and vitamin count, absorption study with its two numbers, digestion, testing).
5. **Title and subhead (#2).** Say what it is (daily greens gummies, one pack a day) and why to switch (no shaker, no pills).

## 7. Tests

`MISSING: conversion rate, traffic.` I can't size the sample without them. A standard approximation at 80% power and 5% significance is: visitors per version ≈ 16 × p(1−p) ÷ (p × r)², where p is the current conversion rate and r is the smallest relative change worth detecting. If the page can't reach that number in about a month, ship the change and watch revenue per visitor.

1. **Habit-led first screen against price-led.** Hypothesis: leading with "the supplement you'll actually stick with", backed by real reviews, raises first orders and lowers early cancellations. It speaks to the largest buyer group, and the brand file says almost no ads use this idea.
2. **Reviews beside the plan box against reviews at the bottom.** Hypothesis: putting gut and powder-quitter reviews next to "Start Now" answers "Is this just candy?" and "Will it upset my stomach?" at the moment of choice, and lifts revenue per visitor.
3. **Neutral one-time option against the current "No Free Shipping / No First Order Discount" framing.** Hypothesis: showing the real shipping cost and a plain one-time option eases subscription fear. Fewer people may subscribe, but total first orders and revenue per visitor should not drop. Measure 60-day cancellations as well.

## 8. Page score

- **Now:** 100 − (1×25 + 6×10 + 7×4 + 2×1) = 100 − 115. That falls below zero, so the score stops at **0**.
- **After the quick wins** (removes the severity 4 and four severity 3s): 100 − (2×10 + 7×4 + 2×1) = 100 − 50 = **50**.

The score measures friction only. It doesn't predict sales.

## 9. What the page can't tell us

- **Phone layout:** `MISSING: phone screenshots`. I couldn't check what is on screen 1, whether the button is within reach, or whether the pop-up covers the first screen and when it fires.
- **Speed:** `MISSING: speed`.
- **Performance:** `MISSING: analytics`. That includes conversion, the phone share and drop-off by step.
- **Checkout:** I couldn't see whether the text sign-up is forced, whether an account is required, whether express pay is offered, or whether anything is pre-ticked.
- **Subscribe default:** I couldn't confirm it is actually pre-selected (inferred).
- **Missing terms:**
  - The contents of the Low Sugar vs. Sugar-Free panel and the grams of sugar.
  - How cancelling works.
  - The one-time shipping cost.
- **Struck-through price:** I couldn't confirm that $66.65 is a price the product openly sells at in real volume, which the FTC former-price rule requires.
- **The ad and gifts:** I couldn't see which ad sends traffic here or whether the "4 FREE gifts" reach the cart.
- **The Kids page (out of scope):** it carries its own mismatch ("GET 58%" at $22.49, then "Renews at $74.98", likely for 2 kids but not stated) and needs its own audit.
```
