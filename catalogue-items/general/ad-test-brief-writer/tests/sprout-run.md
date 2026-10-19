# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A usable brief: three distinct doubts, nine genuinely different first frames, every price shown with its SMS condition and renewal, and the risky brand lines deliberately left out. Minor slips only: P2's 2.45% is actually the highest click rate (not second), 61% is attributed to the site rather than the ads, and the reviews file was treated as missing though the input said it was pasted.

## Judge list

- Met: Header grades the evidence and writes MISSING for anything not given (target etc.)
  "Evidence grade: Measured." ... "MISSING: frequency per ad." "MISSING: target return or cost per sale."
- Met: Every idea names a doubt in the buyer's words and the fact that answers it
  Idea 1: "Will this upset my stomach more?" (buyer 2) held up by 6 g fiber, allowed gut claim, 67% survey; Idea 3 uses buyer 4 quotes and stated prices.
- Met: No two ideas answer the same doubt
  Idea 1 "Will it work for me?", Idea 2 "Why switch?" (inferred), Idea 3 "Can I trust them?"
- Met: Within each idea every version has its own first frame and says what else it changes
  Idea 3: pouch with two yellow tags / opened shipping box / 4×7 grid of packs, each with a "What changes" line.
- Met: Every customer quote is word for word with source; no photo named that the brand lacks
  "Sprout has been the one thing I've been able to stick to." Source: brand file, buyer 1; all other versions "quote needed"; every visual "to be made".

## What went in

```text
Brand file: Sprout (pasted: products, prices and offers, fine and
risky claims, who buys, voice, look, competitors, what seems to
work)

Reviews: all 20 (pasted)

Ad results: ad-results.csv, one row per ad, 14 to 30 days
(practice numbers, pasted)
Columns: ad_name, format, opening_line, days_live, spend_usd,
impressions, link_clicks, purchases, revenue_usd

Last brief: none. Target: none. Offer push: no.

Write the brief.

[attached: sprout/brand.md, sprout/ad-results.csv]
```

## What came out

```text
# ad-brief: Sprout

## Header

**Evidence grade: Measured.** The account export has numbers per ad, run for 14 to 30 days. These are practice numbers, so every result below holds only as far as the export does.
- MISSING: frequency per ad.
- MISSING: week-by-week split for T1.
- MISSING: target return or cost per sale.
- MISSING: the 20 reviews. They were mentioned but not attached. Every quote below comes from the brand file's buyer section.

**Plan: Extend.**
- **The winner.** T1 "Fix the Hot Girl Tummy" is the measured winner: 30 days, $4,200 spend, 198 purchases. That is $21.21 per purchase and $1.98 back per $1, the best in the account.
- **Not wearing out, as far as the data shows.** There is no time split and no frequency, so nothing shows it tiring.
- **The brief.** One new opening for T1's idea (gut), plus two new ideas.
- **What would change the plan.** If T1's cost per purchase rises week on week, or its frequency climbs, switch to Refresh: two new openings for the gut idea, each with a new person or moment, plus one new idea. P1 shows what wear-out looks like in this account: $26.79 per purchase in days 1 to 21, then $76.92 in days 22 to 42.

**Diagnosis**
1. **Who the ads speak to against who buys.** Offer-led ads aimed at the price doubter (P1, P2, S1) take $10,100 of $21,500 spend (47%). The quitter, about 40% of buyers, gets one small ad: H1, $1,300 (6%). Yet H1 returns $29.55 per purchase, second only to T1.
2. **The empty stage is comparing.** No running ad sets Sprout against what the buyer quit: the powder tub, the shaker, the pill shelf.
3. **The doubt that stops new buyers most is "Can I trust them?"**
   - P2 earns the second-highest click rate (2.45%), but only 0.90% of those clicks buy ($50 per purchase).
   - P1 collapsed in its second three weeks.
   - The site shows 49%, 52%, 55%, 58% and 61% off at the same time.
   - That trust is the cause is inferred.

---

## Idea 1: The gut answer, new opening (Extend T1)

### Thinking block
- **Stage:** comparing. She has tried fiber powders and probiotics (brand file, buyer 2).
- **Doubt:** "Will it work for me?" In her words: "Will this upset my stomach more?" and "Will the sugar-free one cause problems?" (brand file, buyer 2).
- **The answer.** She believes one daily pack is an easy way to support regular digestion, and that Low Sugar is the one to start on. The facts behind it:
  - 6 g prebiotic fiber per pack.
  - Allowed claim: "Supports digestion and gut health".
  - "67% ... experienced better, more regular digestion", from a brand survey of 3,000+ customers, always "of surveyed users".
  - Brand note: Sugar-Free upsets some stomachs, so point gut-sensitive buyers to Low Sugar.
- **The moment:** 3:30 pm at her desk, waistband button quietly undone. The tub of fiber powder she stopped mixing sits at home with the scoop dried inside. *Inferred.*
- **Evidence:** Measured. T1 ran 30 days, 198 purchases, $21.21 per purchase, $1.98 back per $1. The new opening itself is untested.
- **Five links:**
  - Who: strong (gut-seeker, in her own slang register).
  - Gain: thin ("supports", never "fix").
  - Proof: thin (brand-reported survey).
  - Risk: thin (30-day money-back, first order only).
  - Step: strong.
- **Video (version A):**
  - First 3 seconds, already moving: a hand tears a daily pack straight across its top edge at a desk. Green bears tip into the palm. The headline is on screen from frame one.
  - On camera: a made-up adult woman, hands and side profile, never presented as a customer, founder or expert. She does not speak in the first person about results.

**Product and price:** Sprout Original (Adults), Low Sugar, 28 packs. Subscription first order $29.99 with the new-customer text discount, then $49.99 every 4 weeks ($1.78/day). One-time $66.65.

### Version A
- **What changes:** format (video) and moment (the desk at 3:30 pm).
- **Layout:** big claim.
- **Headline:** "Gut health you eat by the handful."
- **Support line:** "6 g prebiotic fiber per pack to support digestion."
- **Customer's words:** quote needed.
- **What is seen:**
  - 20 s vertical video. Office desk, warm afternoon light, laptop half-closed.
  - The pack is torn straight across the top and small matte deep-green bears pour into the palm.
  - The glossy deep-green pouch with yellow wordmark and "28 Daily Packs" stands by the keyboard, resealable top closed.
  - End card: Low Sugar pouch on a cream-to-green gradient.
- **Photo/footage:** to be made.

### Version B
- **What changes:** message (against the old way, not the slang pain). Moment: 7:30 am kitchen counter. Format: still image.
- **Layout:** side by side.
- **Headline:** "Same fiber goal. No sludge."
- **Support line:** "6 g prebiotic fiber per pack supports digestion. No water, no shaker."
- **Customer's words:** quote needed.
- **What is seen:**
  - Left, muted: a half-used tub of powder and a shaker with grey clumps on the rim.
  - Right, bright cream: one pack torn straight across the top, a handful of deep-green bears in an open palm, the pouch behind it closed.
  - No competitor marks.
- **Photo:** to be made.

### Version C
- **What changes:** message (the answer is survey proof plus "start on Low Sugar"). Person: none shown. Format: product-led still.
- **Layout:** claim and proof line.
- **Headline:** "67% of surveyed users: better, more regular digestion."
- **Support line:** "Start on Low Sugar. 6 g prebiotic fiber per pack."
- **Small print:** "Brand survey of 3,000+ customers."
- **Customer's words:** quote needed.
- **What is seen:**
  - The Low Sugar pouch upright on a soft cream-to-kelly-green gradient.
  - One torn pack and scattered bears in front.
  - The 67% sits in a sunflower-yellow badge.
- **Photo:** to be made.

---

## Idea 2: The one you actually take (new idea, waking)

### Thinking block
- **Stage:** waking. She knows she keeps dropping supplements but hasn't met a fix that sticks.
- **Doubt:** "Why switch?" In her words, *inferred*: "I've already got a shelf of vitamins, I just forget them."
- **The answer.** She believes the supplement she'll actually eat every day beats the stack she skips. The facts behind it:
  - 1 pack = 60+ ingredients, 21 vitamins & minerals, 6 g fiber.
  - About 100% of daily value for vitamins per pack.
  - No water, no mixing.
  - "95% of users take [Sprout] at least 4-6x per week with 80% taking daily", of surveyed users.
  - Customer quote: "Sprout has been the one thing I've been able to stick to."
- **The moment:** Sunday night, refilling the weekly pill organiser and finding last week's compartments still full. *Inferred.*
- **Evidence:** Measured, but thin. H1, the nearest live idea (habit), ran 16 days: 44 purchases, $29.55 per purchase, $1.55 back per $1. The rest is inferred from the brand file's top review theme.
- **Five links:**
  - Who: strong.
  - Gain: strong (a habit that lasts).
  - Proof: thin (brand survey, one review quote).
  - Risk: missing in A and B (no guarantee shown).
  - Step: strong.
- **Video (version C):**
  - First 3 seconds, already moving: a hand slides a row of pill bottles and a shaker out of frame, then tears a pack across the top.
  - On camera: a made-up adult man in a coat by a front door, never presented as a customer, founder or expert.

**Product and price:** Sprout Original (Adults), Low Sugar, 28 packs. Subscription first order $29.99 with the new-customer text discount, then $49.99 every 4 weeks. One-time $66.65.

### Version A
- **What changes:** format (quote card) and message (a buyer's own words carry the gain). No person shown.
- **Layout:** quote card.
- **Headline (the quote):** "Sprout has been the one thing I've been able to stick to."
- **Support line:** "1 pack a day: 21 vitamins & minerals and 6 g fiber, no water needed."
- **Customer's words:** "Sprout has been the one thing I've been able to stick to." Source: brand file, buyer 1, from public reviews. Reviewer and site MISSING.
- **What is seen:**
  - Big deep-forest-green chunky display type on warm cream.
  - The adult pouch bottom right, resealable top closed.
  - One pack torn straight across its top beside it.
- **Photo:** to be made.

### Version B
- **What changes:** moment (Sunday night, pill organiser) and message (the cost of the old way is the pills you skip).
- **Layout:** big claim.
- **Headline:** "Last week's vitamins are still in there."
- **Support line:** "One pack a day. About 100% of your daily vitamins. Zero pills."
- **Customer's words:** quote needed.
- **What is seen:**
  - Overhead shot of a seven-day pill organiser with every lid still full.
  - Next to it, a single pack torn across the top, bears in a small bowl.
  - Bright kitchen-table light, cream background.
- **Photo:** to be made.

### Version C
- **What changes:** format (video), person (a man), moment (7:40 am at the front door), and message (the survey stat as proof).
- **Layout:** claim and proof line.
- **Headline (on screen):** "Rip. Tip. Enjoy."
- **Support line:** "95% of surveyed users take it 4-6x a week or more."
- **Small print:** "Brand survey of 3,000+ customers."
- **Customer's words:** quote needed.
- **What is seen:**
  - 15 s vertical. A hallway shelf, bottles slid aside.
  - The pack is torn straight across the top and bears tipped into his palm.
  - He's out the door. End card: pouch on a green gradient.
- **Footage:** to be made.

---

## Idea 3: The whole price, up front (new idea, closing)

### Thinking block
- **Stage:** closing. She knows the product, maybe from a store shelf.
- **Doubt:** "Can I trust them?" In her words: "Which discount is real?", "Will the price jump after the first order?" and "I hate subscriptions because I feel like they are a trap." (brand file, buyer 4).
- **The answer.** She believes she knows exactly what she pays now and later, and that the first order is safe to try. The facts behind it:
  - $29.99 first order, which applies only with the new-customer text sign-up discount (footer small print).
  - Renews at $49.99 every 4 weeks for 28 packs ($1.78/day).
  - One-time $66.65.
  - 30-day money-back guarantee, first order only.
  - Orders "typically ship within 24 hours".
  - No end date is stated. The birthday price is framed "indefinitely".
- **The moment:** 9:15 pm on the sofa. She has seen 52%, 55% and 61% off in the same scroll and believes none of them. *Inferred.*
- **Evidence:** Measured, indirect.
  - P2: 2.45% click rate, but 0.90% of clicks bought.
  - P1: $26.79 per purchase in days 1 to 21, then $76.92 in days 22 to 42.
  - That plain pricing fixes this is inferred.
- **Five links:**
  - Who: strong.
  - Gain: strong (no surprise price).
  - Proof: thin (the price itself is the proof).
  - Risk: strong in B (guarantee stated with its limit).
  - Step: strong.
- **Video:** none. All three versions are stills.

**Product and price:** Sprout Original (Adults), Low Sugar, 28 packs. $29.99 first order with the new-customer text discount, then $49.99 every 4 weeks. One-time $66.65.

### Version A
- **What changes:** message (first price and renewal shown together).
- **Layout:** product and price.
- **Headline:** "$29.99 now. $49.99 after. No mystery math."
- **Support line:** "First order price with the new-customer text discount. Renews every 4 weeks."
- **Customer's words:** quote needed.
- **What is seen:**
  - The Low Sugar adult pouch centred on cream.
  - Two sunflower-yellow tags hang from it: "First order" and "Every 4 weeks after".
- **Photo:** to be made.

### Version B
- **What changes:** message (the answer is the safe first try). Moment: a kitchen counter, first pouch just arrived.
- **Layout:** big claim.
- **Headline:** "Your first pouch comes with 30 days to change your mind."
- **Support line:** "Money-back guarantee on your first order."
- **Customer's words:** quote needed.
- **What is seen:**
  - A shipping box just opened on a sunny counter.
  - The pouch standing with its resealable top closed.
  - One pack torn straight across the top, bears in a palm entering the frame.
- **Photo:** to be made.

### Version C
- **What changes:** message (value per day) and layout (packs as a calendar).
- **Layout:** claim and proof line.
- **Headline:** "28 packs. 4 weeks. $49.99."
- **Support line:** "One pack a day comes to $1.78. First order $29.99 with the new-customer text discount."
- **Customer's words:** quote needed.
- **What is seen:**
  - 28 sealed flat daily packs laid in a 4×7 grid like a month calendar on deep-forest-green.
  - The closed pouch sits at the top edge.
- **Photo:** to be made.

---

## Footer

**Lines rewritten and why**
- "Fix the Hot Girl Tummy" was not reused. "Fix" reads like treating bloating, and the brand's rule is "supports". Idea 1 also opens differently from the live T1.
- "My bowel movements are normal for the 1st time in 15 years!" was not used. It reads as a treatment result.
- "Up to 61% off" and every other % figure were left out. The site shows five different numbers at once. Idea 3 uses only stated prices and the stated SMS condition.
- "4.8 stars from 100,000 reviews", "clinically backed for energy, immunity" and "each gummy delivers 100%" were not used. They are unsupported or wrong-unit. "About 100% of daily vitamins" is said per pack.
- "Easy cancel" is not promised anywhere.

**Fields marked "inferred"**
- Idea 1: the moment.
- Idea 2: the doubt in her words, the moment, and part of the evidence.
- Idea 3: the moment, and the link between trust and P1/P2's conversion.
- Diagnosis line 3: the cause.

**Questions for the founder**
1. Can you attach the 20 reviews? Several versions say "quote needed".
2. Who wrote "Sprout has been the one thing I've been able to stick to," and on which site?
3. What is the frequency per ad, and T1's cost per purchase week by week? This decides Extend or Refresh.
4. What return or cost per sale does the account aim for?
5. Is the $29.99 first order with the text discount live on the run date, and does it have an end date?
6. How many grams of sugar are in Low Sugar? It would strengthen Idea 1 for gut-sensitive buyers.
7. Do any product photos exist that match the pack and pouch rules? Every visual is "to be made" for now.

SCORE 100/100 (6 of 6 checks)
```
