# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A thorough, page-specific audit that catches every real problem on Sprout's product page (SMS-only price, four discount figures, hidden renewal and first-order-only guarantee, unsupported claims) and ranks them correctly with an accurate score. Every number traces to the page or brand file, gaps are marked MISSING rather than guessed, and the fixes are copy the owner could ship this week.

## Judge list

- Met: Every finding quotes or points to a specific place on the page.
  All 19 rows name a spot, e.g. "Screen 1 (bar) and screen 2 (plan box) ... 'applies only to your initial purchase', appears only in the last FAQ."
- Met: The ranking follows severity first, then position on the page.
  Sev 4 first, then sev 3 ranks 2-4 (screen 1) before 5-7 (screen 2); sev 2 ranks 8-10 screen 1, 11-14 screen 2, 15-18 lower.
- Met: No money figure or predicted lift appears without analytics.
  "No conversion rate or traffic was given, so the sample size can't be worked out"; only on-page prices used, no lifts.
- Met: No fix asks for proof, ratings, counts or urgency you don't have.
  Fixes use on-file study numbers, the widget's 4.75/109,639, FAQ delivery line; "Drop 'Limited Time Sale', or give a real end date."
- Met: The advice is about this page.
  "Remove 'DISCOUNT AUTO-APPLIED' unless it is true without the text sign-up"; "On the tile: 'One box, then back to Original.'"

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
**1. Job and verdict**

**Job:** win a first purchase, set up by default as a subscription start.

**Verdict:** the product is easy to want, but the buyer can't work out what they'll pay. The page shows several discount figures. The $29.99 price quietly needs a text sign-up. The renewal price and the first-order-only guarantee sit in small print.

**2. Scent**

MISSING: the ad. A full check isn't possible. The brand file does say the Meta ads offer "up to 61% OFF + 4 FREE gifts." This page shows neither 61% nor any gifts; it shows 52% and 55%. So a mismatch is likely for anyone arriving from those ads [inferred].

**3. Glance (first phone screen)**

This is inferred from the text order, because there were no screenshots.

- **What is this?** Only half answered. "Sprout Superfood Gummies" says gummy supplement. It doesn't say greens, one daily pack, or no water or shaker. The under-title line, "revive whole body vitality," explains nothing.
- **Who is it for?** Blank. No buyer is named. "Adults" first appears at "How many Adults?" in the plan box.
- **What do I do next?** Blank [inferred]. The plan box and the "Start Now" button likely sit below the first screen.
- **What stood out?** The rotating bar ("Save up to $80", "Grab it before it's gone", "Save 52%", "FREE SHIPPING + 30-DAY GUARANTEE") and the line "4.8/5.0 (100,000), 1M+ Customers."

**4. Skim**

"Greens-ish gummies with 60+ ingredients that boost energy, immunity, clarity and digestion, rated 4.8 by 100,000 people.
$29.99 with 55% off (or 52%?), free shipping, cancel anytime, money-back guarantee, and cheaper than powders."

What the skimmer misses:
- the $49.99 renewal price
- that the $29.99 needs a text sign-up
- that the guarantee covers the first order only
- what the button actually starts

**5. Findings**

| Rank | Read | Where | What the page does now | Fix | Sev | Ease | Needs analytics to size? |
|---|---|---|---|---|---|---|---|
| 1 | Doubt | Screen 2 (plan box) [inferred], also footer and birthday section | The plan box shows ~~$66.65~~ $29.99 and says "DISCOUNT AUTO-APPLIED". The footer says the price "assumes customer has received and uses promotional SMS discount reserved for new customers only". The birthday section says "Subs Now Start at $29.99 … indefinitely." | Put the condition next to the price: "$29.99 first box with text sign-up (new customers only)". Show the price without the sign-up beside it (MISSING: that price). Remove "DISCOUNT AUTO-APPLIED" unless it is true without the text sign-up. Add the same condition to the birthday section. | 4 | High | Yes |
| 2 | Glance / skim | Screen 1 (bar) and screen 2 (badge, pop-up) | The page shows "Save 52%" (bar), "GET UP TO 55% OFF" (badge) and "Sign Up for 55% Off" (pop-up). The struck $66.65 reads as a former price, but it is today's one-time price. | Use one figure everywhere. $29.99 against $66.65 is 55% off, so write "55% off your first box". Label the struck price "one-time price $66.65". Check the ads' 61% against this figure. | 3 | High | Yes |
| 3 | Doubt | Screen 1 (bar) and screen 2 (plan box) | The bar says "30-DAY GUARANTEE" and the plan box says "30-Day Money-Back Guarantee." The limit, "applies only to your initial purchase", appears only in the last FAQ. | Say "30-day money-back guarantee on your first order" in both places. | 3 | High | No |
| 4 | Glance / doubt | Screen 1 (under-title, bullets) | The page claims "revive whole body vitality", "Promotes mental clarity + energy" and "Supports immunity + stress relief", all right beside "Clinically tested." The study measured only blood vitamin C and folate. Nothing on file supports clarity or stress relief. | Under-title: "60+ ingredients, 21 vitamins & minerals and 6g fiber in one daily pack." Bullets: "Supports digestion and gut health". "Clinically tested for absorption: blood vitamin C +40.1%, folate +20.5% over 12 weeks (2025 placebo-controlled study, 120 adults)". Keep any energy or immunity line as a nutrient-function "supports" line, kept apart from the study. | 3 | High | No |
| 5 | Doubt | Screen 2 (plan box) | Subscribe is selected by default [inferred] and shows "$1.07/day." The renewal price, "Renews at $49.99 each 4 weeks" ($1.78/day), is only in small text under the button. | Put both prices in the tile itself: "First box $29.99, then $49.99 every 4 weeks ($1.78/day)." | 3 | High | Yes |
| 6 | Doubt | Screen 2 (one-time tile) | The one-time tile says "No Free Shipping" but never gives the shipping cost. These are the buyers most wary of subscriptions. | State the cost (MISSING: one-time shipping cost) and drop the scolding "No First Order Discount." | 3 | High | Yes |
| 7 | Doubt | Screen 2 (plan box, under button) | The page says "Pause Or Cancel Any Time" and "Cancel anytime" but never says how. Cancelling is the loudest complaint on public review sites. | Add one line saying exactly how to pause or cancel, using the site's real process (MISSING: cancel steps). Promise nothing beyond that. | 3 | Med | Yes |
| 8 | Glance | Screen 1 | The format (28 daily packs, tear one open, a small handful of gummies) and who it's for are buried in the closed "Directions" accordion. | Add a line under the title: "28 daily packs. Tear one open, eat the handful of greens gummies. No water, no shaker. For adults (Kids version for ages 2 to 13)." | 2 | High | Yes |
| 9 | Skim / doubt | Screen 1 (rating) vs bottom (widget) | The header says "4.8/5.0 (100,000), 1M+ Customers". The widget at the bottom says 4.75 from 109,639. The 1M+ figure has no source. | Show the widget's live figure with its source: "4.75 from 109,639 reviews on sprout.example." Keep "1M+" only if it can be sourced (MISSING: its source). | 2 | High | Yes |
| 10 | Doubt | Screen 1 (bar) | The bar says "Limited Time Sale" and the tie-in says "Grab it before it's gone", but neither gives an end date. The birthday section calls the price "indefinitely". | Drop "Limited Time Sale", or give a real end date. For the tie-in, state the real date or the "4 to 8 weeks" window if it is known. | 2 | High | No |
| 11 | Doubt | Screen 2 (sugar selector) | The page offers Low Sugar / Sugar-Free with no warning about sugar alcohols [inferred: panel not captured]. Grams of sugar are not shown. The gut-sensitive buyer is a core buyer. | Next to the selector: "Sugar-Free uses sugar alcohols, which can upset sensitive stomachs. Gut-sensitive? Start with Low Sugar." Add grams of sugar (MISSING). | 2 | High | Yes |
| 12 | Skim | Screen 2 (button) | The button says "Start Now", which doesn't say what you get. | Name the result: "Start my first 28 packs". | 2 | High | Yes |
| 13 | Doubt | Screen 2 (flavour tiles) | The tie-in tile says "Brand New". That it is one box only and then switches back to Original is said only in the FAQ. | On the tile: "One box, then back to Original." | 2 | High | Yes |
| 14 | Doubt | Screen 2 (under button) | The page says "Less than 1% of customers use our Money-Back Guarantee." This is brand-reported and unverified. It can also read as "the guarantee is hard to use." | Remove it, or give its source. | 2 | High | No |
| 15 | Doubt | Lower (FAQ) | The delivery promise, "ship within 24 hours … arrive 3-5 days later", is only in the FAQ. | Add "Ships in 24 hrs, arrives in 3 to 5 days on average" under the button. | 2 | High | Yes |
| 16 | Doubt | Lower ("Modern Living…") | One stat reads "[number missing] of U.S. adults…". The 61% digestive stat has footnotes that only say "Source." | Fill in the number and name the source, or cut the line. | 2 | High | No |
| 17 | Doubt | Lower ("Us vs. Them") | The comparison uses "Sprout $1.26" (it matches none of the page's prices: $1.07, $1.78, $2.38), "$3.60" for powders (dated), and a "~$35" column with no label. | Use the real per-day prices from the current prices, date and source the powder figure, and label or drop the third column. | 2 | High | No |
| 18 | Skim / doubt | Lower (reviews at very bottom) | The best proof (powder quitters, gut stories, "the one thing I've stuck to") sits far from the button. | Put 2 or 3 real review cards, labelled with what was bought, beside the plan box. | 2 | Med | Yes |
| 19 | Doubt | Lower (ingredients accordion) | The accordion says "over 20 vitamins & minerals"; the label says 21. | Say "21" everywhere. | 1 | High | No |

**6. Quick wins this week**

1. Put the text-sign-up condition next to $29.99 and drop "DISCOUNT AUTO-APPLIED" (rank 1).
2. Use one discount figure, 55% off the first box, and label $66.65 as the one-time price (rank 2).
3. Change the bar and plan box to "30-day money-back guarantee on your first order" (rank 3).
4. Swap the under-title and bullets for the supported claims (rank 4).
5. Show "First box $29.99, then $49.99 every 4 weeks ($1.78/day)" in the plan tile itself (rank 5).

**7. Tests**

No conversion rate or traffic was given, so the sample size can't be worked out. Before running any test:
- Plug the current first-order rate and the smallest lift worth finding into a sample-size calculator.
- If the page can't reach that sample in about a month, ship the change and watch revenue per visitor instead.
- Measure first orders, second-box rate and cancellations, not just starts.

The three tests:

1. **Proof by the button.** Move 3 reviews (powder quitter, gut, habit) beside the plan box. Hypothesis: doubters who need proof before paying start more first orders when the proof sits next to the price.
2. **Habit-led first screen.** Lead with "the supplement you'll actually stick to" (the top review theme, barely used in ads) against the current vitality line. Hypothesis: the biggest buyer group, people who quit powders and pills, sees their own problem and stays.
3. **No default plan.** Show both plans with no default, full terms visible, against Subscribe pre-selected. Hypothesis: there may be slightly fewer starts but more second boxes and fewer refunds, giving higher revenue per visitor over two renewals.

**8. Page score**

- **Now:** 100 − 25 (1 × sev 4) − 60 (6 × sev 3) − 44 (11 × sev 2) − 1 (1 × sev 1) = −30, which stops at **0**.
- **After the quick wins:** 100 − 20 (2 × sev 3) − 44 (11 × sev 2) − 1 (1 × sev 1) = **35**.

This score measures how much stands in a buyer's way. It does not predict sales.

**9. What the page can't tell us**

- **No phone screenshots.**
  - What actually fills the first screen is unknown.
  - Text size, button reach and whether the button is on screen 1 are unknown.
  - Whether the "Sign Up for 55% Off" pop-up covers the first screen on load is unknown.
- **MISSING: speed** (no PageSpeed or Core Web Vitals figures).
- **MISSING: analytics**, so there are no money figures, lifts or phone vs desktop split.
- **MISSING: the ad**, so the scent check is incomplete. The 61% and "4 free gifts" can't be matched.
- **MISSING: page facts:**
  - the price without the text sign-up
  - the one-time shipping cost
  - the actual cancel and pause steps
  - grams of sugar
  - the content of the Low Sugar vs. Sugar-Free panel
  - what the "52%" is measured against
  - a source for "1M+ Customers"
  - limited-flavour prices on this page
- **Cart and checkout not seen.** Forced account, express payment, pre-ticked extras and the total shown up front are unchecked.

Want to turn the three tests into a brief with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Bring this audit, or name another next step.
```
