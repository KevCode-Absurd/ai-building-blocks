# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Every rate, median, budget figure and win line checks out against the CSV, the two signals are real and pass their read points, and both cards rest on sourced facts with the risky offer type correctly declined for lack of dated terms. Small blemishes only: the quote headline is 12 words not 11, and the cut log says no customer count is on file when the product page does show "1M+ Customers" (cutting it is still the safe call).

## Judge list

- Met: Every ad you run has one code, and headline-only codes are marked.
  "P1 | The offer · (headline only) · Warm" through F1; all six image ads coded once, videos noted as uncoded but in medians.
- Met: Every signal shows the numbers behind it and had enough clicks or sales to read.
  "P2 gets 2.45% click rate on 5,569 clicks" ... "0.90% ... (50 purchases)"; P1 drop on 3,750 then 1,780 clicks. R1 correctly excluded.
- Met: The picks are different types, and each traces to a signal.
  Card A "Their words" and Card B "Checked fact", both cite "P2 ... buys per click −67% with click rate +96%" row.
- Met: Every quote is word for word, and every number has its source.
  "Sprout has been the one thing I've been able to stick to." matches brand file; 40.1%, 20.5%, 4.75/109,639 all sourced.
- Met: Each card's headline is 7 words or fewer, or 12 for a real quote.
  Quote headline is 12 words (output miscounts it as 11, still within 12); Card B headline is exactly 7 words.

## What went in

```text
Image ads running now (ad-results.csv, practice numbers). The
images weren't captured, only headlines:
P1 image: "'Sprout is too expensive': here's 61% off to prove
   otherwise" (two 21-day windows)
P2 image: "Don't Pay Full Price. You Literally Don't Have To.
   (61% off inside)"
S1 image: "Trusted by 1M+: Take 61% OFF"
W1 image: "Support Muscle While You Lose Weight"
R1 image: "The Daily Nutrition Every Runner Forgets"
F1 carousel: "Struggling to Get Enough Fiber?"
Full results for all 10 rows pasted below (T1, H1, K1 are videos).
Buyer doubts: all 20 reviews (pasted below).
Claims and offers: Sprout brand file (pasted below).

[attached: sprout/brand.md, sprout/ad-results.csv]
```

## What came out

```text
## 1. The grid

MISSING: image. No images were captured, so all six image ads are coded "(headline only)" and their dress is blank. None of the 27 type × dress cells can hold an ad yet.
MISSING: source. The 20 reviews were mentioned but not attached. Buyer doubts come from the brand file, which gives no repeat counts.

**Codes** (audience is inferred from the headline)

| Ad | Code | Note |
|---|---|---|
| P1 | The offer · (headline only) · Warm | Names an objection from someone who knows the brand. |
| P2 | The offer · (headline only) · Ready | |
| S1 | The offer · (headline only) · New | Could be Checked fact if "1M+" is the biggest thing in the frame. Filed by the 61% call. |
| W1 | The moment · (headline only) · New | |
| R1 | The moment · (headline only) · New | |
| F1 | The moment · (headline only) · New | Carousel. |

T1, H1 and K1 are videos. They are not coded, but they count toward the medians.

| Question | Type | Camera | Designed | Lo-fi | Dress unknown | Total |
|---|---|---|---|---|---|---|
| What is it? | Product alone | 0 | 0 | 0 | 0 | 0 |
| What is it? | Look inside | 0 | 0 | 0 | 0 | 0 |
| Is it for me? | The moment | 0 | 0 | 0 | 3 (W1, R1, F1) | 3 |
| Is it for me? | Old way, new way | 0 | 0 | 0 | 0 | 0 |
| Is it for me? | In use | 0 | 0 | 0 | 0 | 0 |
| Can I believe it? | Their words | 0 | 0 | 0 | 0 | 0 |
| Can I believe it? | Checked fact | 0 | 0 | 0 | 0 | 0 |
| Why now? | The offer | 0 | 0 | 0 | 3 (P1, P2, S1) | 3 |
| Why now? | The occasion | 0 | 0 | 0 | 0 | 0 |

**Per question:**
- What is it? 0
- Is it for me? 3
- Can I believe it? 0
- Why now? 3

**Empty types:**
- Product alone
- Look inside
- Old way, new way
- In use
- Their words
- Checked fact
- The occasion

## 2. Signals

**How the results were read**
- These are practice numbers.
- Medians use one row per ad, with P1's two windows combined, across all 9 ads including the videos. Median click rate is 1.25%. Median buys per click is 2.73%.
- Start dates aren't in the file and run lengths vary from 14 to 30 days. The medians compare each ad's own run, not matched dates.

| Ad | Click rate | vs median | Buys per click | vs median | Read point met? |
|---|---|---|---|---|---|
| P1 (all 42 days) | 1.25% | 0% | 2.73% | 0% | yes / yes |
| P1 days 1–21 | 1.50% | +20% | 2.99% | +9% | yes / yes |
| P1 days 22–42 | 0.92% | −26% | 2.19% | −20% | yes / yes (39 buys) |
| P2 | 2.45% | +96% | 0.90% | −67% | yes / yes |
| S1 | 1.25% | 0% | 2.38% | −13% (tie) | yes / yes |
| W1 | 1.40% | +12% | 2.56% | −6% (tie) | yes / yes |
| R1 | 0.70% | −44% | 1.86% | — | yes / **no (10 buys)** |
| F1 | 1.10% | −12% | 3.02% | +10% (tie) | yes / yes |
| T1 / H1 / K1 (video) | 1.65 / 1.35 / 1.20% | | 4.00 / 3.39 / 3.10% | | median only |

**Signals that fired**

1. **Click rate fine, buys per click under the median, so buyers are stuck on "Can I believe it?"**
   - P2 gets 2.45% click rate on 5,569 clicks, 96% above the median.
   - Only 0.90% of those clicks buy (50 purchases), 67% below the median.
   - People click the "61% off" promise, then don't believe it once they land. The brand file names the doubts behind this: "Which discount is real?", "Will the price jump after the first order?" and "Is this just candy?".
   - This signal picks Their words and Checked fact.

2. **The look has worn out.**
   - P1's click rate fell from 1.50% to 0.92%, a 39% drop on 3,750 and then 1,780 clicks. Purchases fell from 112 to 39.
   - The windows are 21 days, not 14. The drop is still well past the 30% line.
   - The skill says to answer this with the same type in a new dress. That type is The offer, and **I'm not briefing it**:
     - The "61% off" appears only in ads, with no terms.
     - The site shows 49%, 52%, 55% and 58% at the same time.
     - The $29.99 SMS first order has terms but no start or end date. It is framed as "indefinitely".
   - MISSING: source (dated offer terms).

**Rows that did not fire**
- **Click rate under the median on most ads.** Only 4 of 9 ads are under it.
- **Most ads are Why now types.** It is 3 of 6 image ads, half but not most.
- **Warm vs New.** There is no split by audience.
- **One dress.** The dress is unknown (MISSING: image).
- **Review doubt repeated 3 or more times.** The reviews weren't attached (MISSING: source).

**Budget**
- Image ads spend about $437 a day, so two weeks is about $6,120.
- Image cost per purchase is $43.40 ($13,800 ÷ 318 purchases). Twenty purchases cost about $868 per new ad.
- That leaves room for 7 new ads, so the ceiling of 3 applies.
- Only two cells trace to a usable signal, so there are **two picks**. Run each beside the current ads, not against each other.

## 3. Ad cards

### Card A: Their words · Lo-fi · Warm

- **Signal:** P2, with click rate +96% over the median but buys per click −67% (0.90% vs 2.73%, 50 purchases, 5,569 clicks).
- **Picture:**
  - A phone-snapped kitchen counter in morning light.
  - A handwritten sticky note in marker, our own design with no app screen or logo, stuck to the deep-green Sprout pouch. The pouch stands upright and closed at its resealable top.
  - In front, a hand holds a daily pack torn straight across its top edge, with small matte deep-green bears poured into the palm.
  - A coffee mug sits in the background.
- **Words:**
  - Headline (the quote, 11 words): "Sprout has been the one thing I've been able to stick to."
  - Line: "4.75 stars from 109,639 reviews (sprout.example review widget)"
  - Line: "1 pack. 21 vitamins & minerals. 6g fiber."
  - Line: "Rip. Tip. Enjoy."
- **Proof:**
  - The quote is from the brand file's review summary (public reviews, captured Sept–Oct 2026). The rating is from the on-page widget.
  - MISSING: source. Find the original review link and reviewer before launch, and check the quote word for word.
- **Read it by:**
  - Measure: buys per click.
  - Read point: 20 purchases.
  - Win line: 3.41% or better (25% over the 2.73% median). Anything between about 2.05% and 3.41% is a tie.
- **Where it breaks:** The quote answers "is it worth sticking with", but P2's clickers may really be stuck on the renewal. The price goes from $29.99 to $49.99, and cancelling is the loudest public complaint. If buys per click stays low, the stuck point is the offer terms, not belief. Don't add any easy-cancel line to fix it.

### Card B: Checked fact · Designed · Warm

- **Signal:** The same P2 row, buys per click −67% with click rate +96%. It answers "A gummy can't hold enough" and "Is this just candy?".
- **Picture:**
  - Warm cream (#FFF7DF) background.
  - "+40.1%" huge in the chunky display font in deep forest green (#002C17).
  - A simple two-bar chart labelled "Blood vitamin C, 12 weeks", with a Sprout bar and a placebo bar and "2.7x" between them.
  - The green pouch stands closed at the right, with a few deep-green bears scattered at its base.
  - A DM Mono tag along the bottom.
- **Words:**
  - Headline (7 words): "Clinically tested: blood vitamin C up 40.1%"
  - Line: "Folate up 20.5%, 2.9x placebo."
  - Tag: "RANDOMIZED · DOUBLE-BLIND · PLACEBO-CONTROLLED · 120 ADULTS · 2025"
  - Line: "Tastes like a treat, works like a supplement."
- **Proof:** Brand study, 2025, 12 weeks, 120 healthy adults aged 23 to 59. Blood vitamin C rose 40.1% (2.7x placebo) and folate rose 20.5% (2.9x placebo). The source is the science page. The claim stays at absorption only.
- **Read it by:**
  - Measure: buys per click.
  - Read point: 20 purchases.
  - Win line: 3.41% or better. Anything closer is a tie.
- **Where it breaks:** The buyer wants "will I feel better", and blood levels read as dry. The pull is to add "energy", "immunity" or "it works", and the study supports none of those (see the log). If the clicks are low, read it at 100 clicks before judging.

## 4. Cut-claims log

| Claim | Where | Why cut | Don't bring back as |
|---|---|---|---|
| "Support Muscle While You Lose Weight" | W1 | No evidence on file for muscle or weight loss | "lean", "tone", "while you slim down", GLP-1 framings |
| "Trusted by 1M+" | S1 | No customer count on file. The file has a 3,000+ survey and about 110k–118k reviews. | "a million fans", "millions trust" |
| "61% off" | P1, P2, S1 | An offer with no terms or dates on file. The site shows 49–58%. Held until it is dated. | "up to 60%+", "over half off" |
| "Fix the Hot Girl Tummy" | T1 (video) | "Fix" implies treating bloating. The rule is "supports". | "cure", "end", "get rid of bloat" |
| "Clinically backed for energy, immunity" / "Sprout works" | Shop and science pages | The study measured absorption of 2 nutrients only | "proven to boost", "clinically energizing" |
| "Each gummy delivers 100%…" | Science page | It is per pack, not per gummy | Any per-gummy dose claim |
| "4.8 stars from 100,000 reviews" | Everywhere | It doesn't match any source | Use only a named figure, e.g. 4.75 / 109,639 (site widget) |
| Easy or anytime cancel | (kept out of Card A) | It goes beyond the site's own words, and cancelling is the top complaint | "cancel in one click", "no strings" |
```
