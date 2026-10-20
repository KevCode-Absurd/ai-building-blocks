# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable brief: every metric is correctly derived from the CSV, prices and claims match the brand file, risky lines like "Fix" and the conflicting discount percentages are rewritten or dropped, and the three ideas hit three distinct doubts with nine genuinely different first frames. The owner gets a clear Extend plan plus a precise list of what to supply next (reviews, weekly T1 data, quote permissions, cancel wording).

## Judge list

- Met: Header grades the evidence; anything missing (like a target) is written as MISSING, not guessed
  "Evidence grade: Measured... there is no target" and "MISSING: T1 by week, and frequency for every ad"; no target or frequency guessed.
- Met: Every idea names a doubt in the buyer's words and the fact that answers it
  Idea 1: "Will this upset my stomach more?" held up by "6 g prebiotic fiber per pack (label)"; Ideas 2 and 3 likewise.
- Met: No two ideas answer the same doubt
  Idea 1 "Will it work for me?", Idea 2 "Will it work?", Idea 3 "Can I trust them?"
- Met: Within each idea, every version has its own first frame and says what else it changes
  Idea 3: pouch with price tags on cream / giant "30" on plum / chat bubble on yellow; each lists "What changes".
- Met: Every customer quote is word for word with its source, and no photo is named that you don't have
  "My bowel movements are normal for the 1st time in 15 years!" Source: brand file; every Photo field says "To be made".

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
# ad-brief: Sprout, round 1

## Header

**Evidence grade: Measured.** The export gives spend, purchases and revenue for each ad over 14 to 30 days. These are practice numbers. Nothing was split-tested or lift-tested, so no result counts as Tested. The export has no frequency column, and there is no target. Each ad is judged against the account as a whole: $21,500 spend, 623 purchases, $34.51 per sale, 1.15 return, and 2.60% of clicks becoming buys.

| Ad | Cost per sale | Return | Clicks per view | Buys per click |
|---|---|---|---|---|
| T1 Hot girl tummy | $21.21 | 1.98 | 1.65% | 4.00% |
| P1 Too expensive, days 1 to 21 | $26.79 | 1.28 | 1.50% | 2.99% |
| H1 One step never skip | $29.55 | 1.55 | 1.35% | 3.38% |
| K1 Fiber kids | $34.92 | 1.39 | 1.20% | 3.10% |
| F1 Fiber question | $39.13 | 1.03 | 1.10% | 3.02% |
| W1 Muscle weight loss | $39.13 | 1.14 | 1.40% | 2.56% |
| S1 Trusted by 1M | $42.11 | 0.78 | 1.25% | 2.38% |
| P2 Dont pay full price | $50.00 | 0.62 | 2.45% | 0.90% |
| P1 Too expensive, days 22 to 42 | $76.92 | 0.44 | 0.92% | 2.19% |
| R1 Runner | $100.00 | 0.40 | 0.70% | 1.86% |

**Plan: Extend.**
- **Why Extend.** T1 is the measured winner. It has the best cost per sale and the best buys per click in the account, over 30 days.
- **Why not Refresh.** T1 is one 30-day row, so its wear can't be read. The one wear curve on file is P1's. It went from $26.79 to $76.92 per sale, and from 1.50% to 0.92% clicks per view, between its first and second 21 days.
- **What the plan contains.**
  - One new opening for T1's idea, which is gut pain in slang, with the wording moved to "supports".
  - Two new ideas.
- `MISSING:` T1 by week, and frequency for every ad. If T1's weekly cost per sale is rising or its frequency is climbing, this becomes Refresh. That means two new openings for the gut idea, each with a new person and moment, plus one new idea.

**Diagnosis**
1. **Who the ads speak to, and the gap.**
   - Price ads (P1, P2, S1) take $10,100, or 47% of spend. They speak to the price doubter.
   - The quitter is about 40% of buyers. Only H1 speaks to them, with $1,300 (6% of spend), and it closed at $29.55.
   - The gap is the quitter.
2. **The stage with nothing running.**
   - Comparing has nothing. No adult ad puts the gummy against the powder, the pill stack or the multivitamin.
   - Waking is covered by T1, F1, W1 and R1. Closing is covered by P1, P2 and S1.
3. **The doubt that stops new buyers most.**
   - "Can I trust them?" on price.
   - P2 drew the most clicks per view in the account (2.45%) and the fewest buys per click (0.90%). The discount pulled people in and the page didn't close them.
   - That gap is measured. The reason is inferred: buyers ask "Which discount is real?" and "Will the price jump after the first order?" Five different discount figures are live at once: 49%, 52%, 55%, 58% and 61%.

---

## Idea 1: Gut, new opening for T1 (Extend)

**Thinking block**
- **Stage:** Waking. She knows the tummy feeling but doesn't know a daily fiber pack is a fix. The stage is inferred.
- **Doubt:** "Will it work for me?" In the buyer's words: "Will this upset my stomach more?" Source: brand file, gut-fix seeker doubts (from public reviews).
- **Answer, what she believes after:** "A pack a day gives me 6 g of prebiotic fiber that supports digestion, and it's a gummy, not another powder."
- **Facts behind the answer:**
  - 6 g prebiotic fiber per pack (label).
  - "Supports digestion and gut health" (allowed claim).
  - "67% of surveyed users experienced better, more regular digestion" (brand survey of 3,000+ customers).
  - Low Sugar is the gentler pick for sensitive stomachs, because Sugar-Free upsets some stomachs. This steers the product choice and is never claimed on the ad.
- **Moment:** 3:30 pm at her desk. Her jeans button is eased open under the table. At home there's a fiber powder tub she stopped after a week. Inferred.
- **Evidence:** Measured for the angle (T1, $21.21 per sale over 30 days). The gut claims rest on the label and a brand-reported survey. They are not in the clinical study, which measured blood vitamin C and folate only.
- **Five links:**
  - Who: strong. Gut pain in her own slang.
  - Gain: thin. "Feel normal" has one customer quote behind it.
  - Proof: thin. Brand survey only.
  - Risk: thin. The 30-day money-back is kept for Idea 3.
  - Step: thin. The first-order price needs a text sign-up.
- **Video:**
  - The first three seconds are already moving: her hand eases the button open under the desk, then cuts to a daily pack being torn straight across the top.
  - On camera: a made-up adult, never presented as a customer, founder or expert.

**Product and price:** Sprout Original (Adults), Low Sugar, 28 daily packs.
- Subscription renews at $49.99 every 4 weeks ($1.78/day).
- First order is $29.99 ($1.07/day), only with the text sign-up discount for new customers.
- One-time purchase is $66.65.

### Version A
- **What changes:** Format is video. The person and moment are the 3:30 pm desk. The message is fiber as the thing she's short of.
- **Layout:** Big claim.
- **First frame:** Close shot under an office desk. A hand eases a jeans button open. At 1 s it cuts to a deep-green daily pack torn straight across its top edge, with green bears pouring into her palm.
- **Headline:** Hot girl tummy? Meet 6 g of fiber.
- **Support line:** Prebiotic fiber that supports digestion. In gummies.
- **Customer words:** Quote needed. Spoken lines from the made-up adult are not customer words.
- **What is seen:** A made-up woman in her late 20s, at a sunny office desk, in casual clothes. She tips matte deep-green bears from a pack torn at the top into her palm. The glossy green adult pouch, Low Sugar, stands closed by her laptop.
- **Photo file:** To be made.

### Version B
- **What changes:**
  - Message: a buyer's result replaces the fiber pitch.
  - Format: still image.
  - No person on screen.
- **Layout:** Quote card.
- **First frame:** Warm cream #FFF7DF. The quote fills two thirds of the frame in the chunky display font, deep forest green #002C17.
- **Headline:** "My bowel movements are normal for the 1st time in 15 years!"
- **Support line:** 6 g prebiotic fiber in every pack, to support digestion.
- **Customer words:** "My bowel movements are normal for the 1st time in 15 years!" Source: brand file, gut-fix seeker (public review). `MISSING:` the original review, the reviewer's name and permission.
- **What is seen:** The quote over cream. Bottom right is a small closed adult pouch with five or six deep-green bears scattered in front.
- **Photo file:** To be made.

### Version C
- **What changes:**
  - Message: the survey number replaces the fiber amount and the quote.
  - Person and moment: a parked car before work.
- **Layout:** Claim and proof line.
- **First frame:** Inside a parked car in morning sun. A woman in the driver's seat tears a daily pack straight across the top. Steering wheel in shot, engine off.
- **Headline:** Better poops, by the numbers.
- **Support line:** 67% of surveyed users had better, more regular digestion.* (*Small print: brand survey of 3,000+ customers.)
- **Customer words:** Quote needed.
- **What is seen:** A made-up woman in her 40s in casual clothes, parked. Green bears pour from the torn top of the pack into her palm. The closed adult pouch sits on the passenger seat.
- **Photo file:** To be made.

---

## Idea 2: "A gummy can't hold enough" (new)

**Thinking block**
- **Stage:** Comparing. He knows powders, pill stacks and multivitamins, and has quit them.
- **Doubt:** "Will it work?" In the buyer's words: "A gummy can't hold enough to replace my powder." Source: brand file, quitter doubts (from public reviews).
- **Answer, what he believes after:** "One pack holds 60+ ingredients, 21 vitamins and minerals and 6 g of fiber, and a study measured it getting into the blood."
- **Facts behind the answer:**
  - 60+ ingredients, 21 vitamins and minerals and 6 g fiber per pack (label).
  - About 100% of daily value for the vitamins.
  - 2025 study: 12 weeks, randomized, double-blind, placebo-controlled, 120 adults. Blood vitamin C rose 40.1% (2.7x placebo) and folate rose 20.5% (2.9x placebo).
- **Moment:** Sunday, 8 pm. He's wiping green dust off the counter and the shaker still smells. The tub is two thirds full. Inferred.
- **Evidence:** Inferred. No ad in the export makes this comparison. The proof rests on the brand's own study, which covers absorption of 2 nutrients only.
- **Five links:**
  - Who: strong. The half-used tub.
  - Gain: strong. No water, no shaker.
  - Proof: strong but narrow. The study.
  - Risk: thin.
  - Step: thin.
- **Video (version C):**
  - The first three seconds are already moving: a hand slides a powder tub to the back of a cupboard and lifts the pouch out from the front.
  - On camera: a made-up adult man (powder switchers lean male), never presented as a customer, founder or expert.

**Product and price:** Sprout Original (Adults), Low Sugar, 28 daily packs.
- $49.99 every 4 weeks ($1.78/day).
- $29.99 first order with the text sign-up for new customers.
- $66.65 one-time.

### Version A
- **What changes:** Message is how much one pack holds. Moment is the evening counter. Format is a still image.
- **Layout:** Side by side.
- **First frame:** Split frame.
  - Left: a messy counter with a half-used generic green powder tub (no brand marks) and a shaker crusted with green clumps.
  - Right: a clean counter with one daily pack torn across the top and a small handful of green bears in a palm.
- **Headline:** 60+ ingredients. Zero shaker.
- **Support line:** One pack: 21 vitamins and minerals, plus 6 g fiber that supports digestion. No water.
- **Customer words:** "Sprout has been the one thing I've been able to stick to." Source: brand file, quitter (public review). `MISSING:` the original review and permission.
- **What is seen:** Muted, cluttered left side against a bright, sunny right side. Real pack, torn straight across its top. Deep-green matte bears.
- **Photo file:** To be made.

### Version B
- **What changes:**
  - Message: proof that it gets absorbed replaces the pack's contents.
  - No person, no counter.
- **Layout:** Claim and proof line.
- **First frame:** "+40.1%" huge in sunflower yellow #FFCC2E on deep forest green #002C17. A small closed adult pouch sits bottom right.
- **Headline:** Yes, a gummy gets in: blood vitamin C up 40.1%.
- **Support line:** 12-week placebo-controlled study, 120 adults. Folate up 20.5%.
- **Customer words:** Quote needed.
- **What is seen:** The number, the line and the closed glossy green pouch with three bears in front. No lab-coat imagery.
- **Photo file:** To be made.

### Version C
- **What changes:**
  - Format: video, 15 to 20 s.
  - Person and moment: a made-up man in his 30s on a weekday morning.
  - Message: daily-value coverage.
- **Layout:** Big claim.
- **First frame, moving:** A hand slides a two-thirds-full generic powder tub to the back of a kitchen cupboard. In the same motion it lifts the adult pouch out from the front.
- **Headline (on screen):** Powder: retired.
- **Support line:** One pack covers about 100% of daily value for its vitamins. Rip. Tip. Enjoy.
- **Customer words:** Quote needed.
- **What is seen:**
  1. A made-up man in his 30s in a sweatshirt, in his kitchen, opens the pouch at its resealable top.
  2. He takes out one daily pack and tears it straight across the top.
  3. He tips bears into his palm.
- **Photo file:** To be made.

---

## Idea 3: "Will the price jump?" (new)

**Thinking block**
- **Stage:** Closing. She knows the product and is near checkout.
- **Doubt:** "Can I trust them?" In the buyer's words: "I hate subscriptions because I feel like they are a trap." and "Will the price jump after the first order?" Source: brand file, price doubter doubts (from public reviews).
- **Answer, what she believes after:** "I know exactly what I pay now, what I pay after, and that the first order comes with my money back if it's not for me."
- **Facts behind the answer:**
  - $29.99 first order, only with the text sign-up discount for new customers.
  - Renews at $49.99 every 4 weeks for 28 packs ($1.78/day).
  - 30-day money-back on the first order only. The FAQ says: "This policy applies only to your initial purchase."
- **Moment:** 11 pm, checkout tab open. Her thumb hovers over Subscribe while she scrolls for the renewal price. Inferred.
- **Evidence:**
  - The clicks-without-buys pattern on P2 is Measured: 2.45% clicks per view, 0.90% buys per click.
  - That trust is the cause is Inferred.
- **Five links:**
  - Who: strong.
  - Gain: thin.
  - Proof: strong. Real numbers, stated plainly.
  - Risk: strong. Money-back, kept to "first order".
  - Step: strong. A clear first price.
  - No promise about cancelling beyond the site's own words. `MISSING:` the site's cancel wording.

**Product and price:** Sprout Original (Adults), Low Sugar, 28 daily packs.
- First order $29.99 ($1.07/day) with text sign-up, new customers only.
- Then $49.99 every 4 weeks ($1.78/day).
- One-time $66.65.
- No percentage-off figure is used.

### Version A
- **What changes:** Message is the full price path, then and after. Format is a still image with no person.
- **Layout:** Product and price.
- **First frame:** Warm cream. The adult pouch stands at left. At right are two receipt-style tags, stacked: "First order: $29.99" and "Every 4 weeks after: $49.99".
- **Headline:** The price after the deal: $49.99.
- **Support line:** $29.99 first order with text sign-up. Then $49.99 every 4 weeks for 28 packs.
- **Customer words:** Quote needed.
- **What is seen:** The closed glossy green pouch, "28 Daily Packs" visible, with a few bears in front. Tags set in DM Mono uppercase.
- **Photo file:** To be made.

### Version B
- **What changes:** Message is the safe first try (risk) instead of the price path.
- **Layout:** Big claim.
- **First frame:** A giant sunflower-yellow "30" on plum purple #581E5A. One daily pack, torn across the top, leans on the numeral with bears spilling.
- **Headline:** 30 days to decide.
- **Support line:** Money back on your first order. Then $49.99 every 4 weeks.
- **Customer words:** Quote needed.
- **What is seen:** The "30", the torn pack (top edge only) and green bears on a plum background.
- **Photo file:** To be made.

### Version C
- **What changes:** Message names the fear first, then answers it. The format is a chat-bubble card.
- **Layout:** Quote card.
- **First frame:** Sunflower yellow background with a large white text-message bubble holding the quote in deep forest green.
- **Headline:** "I hate subscriptions because I feel like they are a trap."
- **Support line:** Fair. First order $29.99 with text sign-up, then $49.99 every 4 weeks.
- **Customer words:** "I hate subscriptions because I feel like they are a trap." Source: brand file, price doubter (public reviews). `MISSING:` the original review and permission.
- **What is seen:** The bubble, with a small yellow bear face from the pouch's mark as the reply avatar. No person, no phone frame.
- **Photo file:** To be made.

---

## Footer

**Lines rewritten, and why**
- **"Fix the Hot Girl Tummy" became "Hot girl tummy? Meet 6 g of fiber."** "Fix" reads as treating bloating. The brand's own rule is "supports".
- **"61% off" and every other % figure were dropped.** Five different discounts are live at once: 49%, 52%, 55%, 58% and 61%. Only the stated prices are used.
- **"Each gummy delivers 100%" became "One pack covers about 100% of daily value for its vitamins."** The amount is per pack, not per gummy, and it covers vitamins only.
- **The study is never stretched to energy or immunity.** The ads use only the two blood numbers.
- **"4.8 stars from 100,000 reviews" and "Trusted by 1M+" are not used.** The figures conflict, and the source is unnamed.
- **Survey figures always carry "of surveyed users" and the survey's size.**

**Fields marked "inferred"**
- Idea 1: the stage and the 3:30 pm desk moment.
- Idea 2: the Sunday 8 pm counter moment and the whole idea's evidence grade.
- Idea 3: the 11 pm checkout moment, and trust as the cause of P2's low buys per click.
- All quotes come from the brand file's summaries. The 20 reviews were not attached.

**Questions for the founder**
1. Can you send the 20 reviews? They were mentioned but not attached, and the quotes need checking word for word.
2. Do we have permission to use the three customer quotes, and who wrote them?
3. What does T1 look like by week (cost per sale and frequency)? This decides Extend or Refresh.
4. Is $29.99 with text sign-up the current first-order price, and does it have an end date?
5. Which discount % is the real one, if any should appear at all?
6. What is the site's exact wording on cancelling a subscription?
7. Do you have photos of the torn daily pack, the bears in a palm and the adult pouch we can use, or should everything be shot new?
8. Does Low Sugar contain sugar alcohols, and how many grams of sugar are in a pack?
9. Has anyone outside the brand checked the 67% survey figure and the "normal for the 1st time" quote for use as gut claims?

`CHECKS MISSED:` none
```
