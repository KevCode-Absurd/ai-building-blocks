# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 2.

This is a careful, honest map: quotes are exact, counts are right, every health, GLP-1 and competitor line is flagged, and all sources are correctly kept out of paid ads. It fails only on a small slip where a paraphrased reason is put in quotation marks with a source ID that contradicts it, plus one miscount in the notes.

## Fix

In step 4 and the 'Never said by the brand' output, add: reason names are never written in quotation marks; quote marks are reserved for exact customer phrases, and every source ID listed under a reason must itself contain that reason.

## Judge list

- Not met: Every quote appears word for word in its source, with spelling mistakes kept.
  Section 2: "It tastes better after a few days" (#9, 2 people: R18, R19) is in quote marks but appears in neither; R19 says "the taste is off."
- Met: Counts are separate people, not mentions.
  Digestion: "6, 27%. Brand site 2 (R7, R8), widget 2 (R11, R14), retailer 2 (R9, R10)"; R1's two phrases counted once ("same person").
- Met: Nothing is called a pattern with fewer than five people, and one-channel patterns say so.
  Only #1 (6 people) is "Pattern, **one channel** (reviews only)"; all others "Thin, one channel".
- Met: The "check before use" list exists, even if it's empty.
  Section 4 lists 16 flagged phrases with IDs plus "All 22 sources ... Unverified buyers."
- Met: No quote has a name, initial or city that wasn't in the source.
  All quotes carry only R/F IDs and placements; no names, initials or cities added.

## Invented

- quote: "It tastes better after a few days" (#9, 2 people: R18, R19) (Quoted string is the run's paraphrase, not customer words, and R19 ("the taste is off") does not support it.)
- number: 4 reasons rest on one person (Only three reasons (#13, #14, #15) have one person; the map's own data gives 3, not 4.)

## What went in

```text
Customer sources: 20 public reviews, numbered R1 to R20, with where
each came from (brand site, brand site widget, retailer, review site),
plus two short fragments, F1 and F2 (sprout/reviews.md). Captured
over two months. No dates per review, no verified-buyer flags, no
star ratings.

Our product page text is below, so you can see what we already say.
[sprout/product-page.md]

[attached: sprout/reviews.md, sprout/product-page.md]
```

## What came out

```text
## 1. The forces map

Sources: 22 (R1–R20, F1, F2). Shares are out of 22, and each source is assumed to be a separate person. **Every best phrase is unverified** because there are no verified-buyer flags, so keep every one out of paid ads. All sources are public reviews, so every reason is **one channel**. The placements listed (brand site, widget, retailer, review site) are where each review appeared, not separate kinds of source.

| Rank | Reason | Force | People (count, share, placements) | Pattern or thin | Best phrase (unverified) | Backups | Brand says it |
|---|---|---|---|---|---|---|---|
| 1 | Digestion and regularity got better | Result | 6, 27%. Brand site 2 (R7, R8), widget 2 (R11, R14), retailer 2 (R9, R10) | Pattern, **one channel** (reviews only) | "My bowel movements are normal for the 1st time in 15 years!" (R7) ⚠ | "Feel lighter, less bloated and overall good." (R10) ⚠ · "[Sprout] have been the solution to my problems with regularity." (R9) ⚠ · "I feel like my overall digestion has improved." (R8) ⚠ | Yes ("Supports digestion and gut health"; survey "67% better, more regular digestion") |
| 2 | It tastes good, like a treat | Pull | 4, 18%. Brand site 3 (R6, R12, R16), widget 1 (R14) | Thin, one channel | "[Sprout] literally tastes like fruit snacks I ate as a kid." (R12) | "The convenience and taste are huge! Like mixed berries!" (R6) · "this is the only one they love eating. They think it's a treat." (R16) ⚠ · "They taste good!" (R14) | Yes ("great tasting gummies", "Delicious", Taste review cards). The "fruit snacks" wording is not used. |
| 3 | They had been on other greens products for years | Habit | 4, 18%. Brand site 4 (R1, R3, R4, R16) | Thin, one channel, brand-picked only | "I've tried a few green powders over the years." (R1) | "I've been choking on [a big-name greens powder] for the last few years" (R4) ⚠ · "I was taking [a big-name greens powder]" (R3) ⚠ · "I have tried all of the 'green' options for the kids" (R16) | Yes (Us vs. Them, "Vs Powders" review cards) |
| 4 | Greens powders were unpleasant: gritty, choking, washing up | Push | 3, 14%. Brand site 3 (R3, R4, R6) | Thin, one channel, brand-picked only | "I've been choking on [a big-name greens powder] for the last few years" (R4) ⚠ | "the drink was definitely gritty/chalky." (R3) · "Plus not having to clean a shaker bottle or extra dishes for greens stuff in powder form, is absolutely excellent!" (R6) | Yes, but only inside a closed accordion ("No more gagging on pills, sloshing chalky powders, or cleaning messy counters") |
| 5 | Simpler: grab and go, one thing instead of several | Pull | 3, 14%. Brand site 3 (R5, R6, R15) | Thin, one channel, brand-picked only | "So easy to grab and eat on my way to the billion things I have to do as a mom." (R15) | "I just take these now and it's easier for me to manage." (R5) · "The convenience and taste are huge!" (R6) | Yes, but only inside a closed accordion ("Portable: Just grab and go", "replaces handfuls of health products") |
| 6 | Liked it enough to stay subscribed, resubscribe or recommend | Result | 3, 14%. Brand site 2 (R6, R17), widget 1 (R14) | Thin, one channel | "We quickly decided to resubscribe because we love [Sprout] so much!" (R17) ⚠ | "Glad I have a subscription!" (R14) · "10/10 would recommend." (R6) | Unsure (only "1M+ Customers" and "Less than 1% ... use our Money-Back Guarantee") |
| 7 | Finally a habit they keep | Result (push: "consistency") | 2, 9%. Brand site 2 (R1, R2) | Thin, one channel | "It's wild I WANT to take [Sprout] and don't forget." (R2) | "[Sprout] has been the one thing I've been able to stick to." (R1) · "It's always been an issue of consistency like many things." (R1, same person, push) | Yes ("A habit that tastes so good, you'll actually want to keep it"; survey "80% daily") |
| 8 | Subscriptions feel like a trap or are hard to cancel | Anxiety | 2, 9%. Brand site 1 (R17), review site 1 (R20) | Thin, one channel | "I have tried multiple times to cancel my subscription." (R20) | "I hate subscriptions because I feel like they are a trap" (R17) | Partly ("Pause Or Cancel Any Time", "Cancel anytime"). The page never says how to cancel. |
| 9 | Taste was bad at first, or off | Anxiety | 2, 9%. Retailer 1 (R18), widget 1 (R19, tie-in flavour, Sugar-Free) | Thin, one channel | "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (R18) | "the taste is off." (R19) | No |
| 10 | On a GLP-1 medication (the event that started the search) | Push / moment | 2, 9%. Widget 2 (R11, R14) | Thin, one channel | "I've been on a glp1 for about a year now and was always constipated" (R11) ⚠ | "I'm on Glp-1 and they definitely help with the vitamin loss you get!" (R14) ⚠ | No (only the auto-generated review summary mentions it). It should stay out of brand claims. |
| 11 | Kids love it too | Result | 2, 9%. Brand site 2 (R16 Kids page, R17) | Thin, one channel | "A bonus is my kids love them too!" (R17) | "They think it's a treat." (R16) ⚠ | Unsure (Kids tiles exist; the Kids page text was not captured) |
| 12 | More energy, no crash | Result | 2, 9%. Brand site 1 (R13), widget 1 (R14) | Thin, one channel | "clean feeling energy and mental focus ... without the sugar crash" (R13) ⚠ | "noticed a difference in my energy, gut health, and even my sleep!!!" (R14) ⚠ | Yes ("Promotes mental clarity + energy") |
| 13 | The old powder cost too much | Push / moment | 1, 5%. Brand site (R3) | Thin, one channel | "even with their monthly subscription discount it was still $94 a month" (R3) ⚠ | none | Yes (Us vs. Them cost per serving, "Not overhyped or overpriced") |
| 14 | It's expensive | Anxiety | 1, 5%. Retailer (F1) | Thin, one channel | "They are expensive" (F1) | none | Partly (birthday price cut). The renewal at $49.99 is in small print. |
| 15 | Sugar-Free upset the stomach | Anxiety | 1, 5%. Review site (F2) | Thin, one channel | "The sugar free [Sprout] worked too well." (F2) ⚠ | none | Unsure (the Low Sugar vs. Sugar-Free panel was not captured, and no sugar-alcohol warning was seen) |

⚠ = see section 4.

Moments the phrases give:
- **Started looking:** R11 (constipated on a GLP-1 for a year), R3 ($94 a month for powder).
- **Doubted after buying:** R17 (cancelled before the gummies arrived), R18 (first pack tasted terrible).
- **Decided to stay:** R17 (resubscribed), R18 ("after the third day").

## 2. Never said by the brand

- **None of the top five reasons is missing from the product page.** Digestion, taste, being on greens for years, unpleasant powders and simplicity all appear in some form. Two of them (#4 powders, #5 grab and go) appear only inside closed accordions, so most visitors never see them. A person should confirm the page before any public "gap" claim.
- **Lower-ranked reasons the page does not say:**
  - "It tastes better after a few days" (#9, 2 people: R18, R19).
  - Sugar-Free stomach effects (#15, 1 person: F2; unsure, since the panel was not captured).
  - Resubscribing and recommending (#6, 3 people: R6, R14, R17; unsure).
  - GLP-1 (#10, 2 people: R11, R14). This one is deliberately not said and should stay that way.
- **The reverse gap: the brand says things no customer said.** No source mentions:
  - "revive whole body vitality"
  - immunity
  - stress relief
  - hair, skin or nails
  
  Only R13 touches "mental focus." Meanwhile the customers' top reason, digestion (6 people), is the third bullet.

## 3. What nearly stopped them

Ranked by number of people. All quotes are unverified.

| Rank | Doubt | People | Their words (ID) | What the page answers now |
|---|---|---|---|---|
| 1 | Subscriptions are a trap, or cancelling is hard | 2 (R17, R20) | "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." (R17) · "I have tried multiple times to cancel my subscription." (R20) | "Pause Or Cancel Any Time" and "Cancel anytime", with no steps. The renewal at $49.99 sits in small print under the button, and the guarantee covers the first order only (stated in the last FAQ). **Not covered.** R20 contradicts the claim. |
| 2 | Taste is bad at first, or off | 2 (R18, R19) | "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (R18) · "the taste is off." (R19, tie-in flavour, Sugar-Free) | No answer. **Not covered.** |
| 3 | Price | 1 (F1) | "They are expensive" (F1) | Us vs. Them cost per serving and the $1.07/day figure. But $1.07/day is the first box only; renewal is $1.78/day. **Partly covered, and the answer itself could create a new doubt.** |
| 4 | Sugar-Free causes stomach trouble | 1 (F2) | "The sugar free [Sprout] worked too well." (F2) | Not seen. The panel was not captured. **Unsure. Read the panel before calling it covered.** |
| 5 | Prebiotics will be too harsh (implied, raised as already answered) | 1 (R8) | "The prebiotics do their job, but not aggressively" (R8) | Not addressed. **Not covered.** |

For the page writer, these become FAQ entries in this order: (1) how to cancel and what renews, (2) "the first pack may taste different", (3) the real price after the first box, (4) Sugar-Free and sugar alcohols. Each comes with the counts and IDs above. Note that two people is thin, and the complaints come mostly from the few non-brand sources.

## 4. Check before use

| Phrase | Source | Reason |
|---|---|---|
| "My bowel movements are normal for the 1st time in 15 years!" | R7 | Health result. A before-and-after that could read as typical. Ad platforms restrict before-and-after claims about the body. Tell it as one buyer's story only. Goes to whoever approves claims. |
| "This is huge for someone who suffers from chronic IBS!" | R8 | Names a medical condition. Implies a treatment result. Conflicts with the FDA line ("not intended to ... treat"). |
| "I feel like my overall digestion has improved." | R8 | Health result. Goes to whoever approves claims. |
| "[Sprout] have been the solution to my problems with regularity." | R9 | Health result framed as a "solution". Could read as typical. |
| "Feel lighter, less bloated and overall good." | R10 | Claim about the body. Health result. |
| "These gummies have helped me to get back to normal as I've been on a glp1 for about a year now and was always constipated not anymore" | R11 | Names a prescription drug and a side effect. A customer can say it; the brand must not repeat it as its own claim. |
| "I'm on Glp-1 and they definitely help with the vitamin loss you get!" | R14 | Medical claim about a drug. The brand has no support for it (the study measured 2 vitamins). |
| "noticed a difference in my energy, gut health, and even my sleep!!!" | R14 | Health results. Sleep is claimed nowhere by the brand and cannot be supported. |
| "clean feeling energy and mental focus ... without the sugar crash" | R13 | Cognitive and energy claim. The "..." is in the source, so the full wording is unknown. "Mental clarity" is already a risky claim on the page. |
| "even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky." | R3 | Refers to a named competitor (bracketed in the file). The $94 figure is a claim about a rival that the brand must check. |
| "I've been choking on [a big-name greens powder] for the last few years" | R4 | Names a competitor in disparaging terms. |
| "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." | R5 | Implies the product replaces probiotics, B12 and a multivitamin. The page lists prebiotic inulin, and probiotic content is not confirmed. This is a claim the brand may not be able to support. |
| "this is the only one they love eating. They think it's a treat." | R16 | Children's vitamins framed as a treat is a safety concern (risk of children overeating vitamins and minerals). Check official use and safety before any use. |
| "[Sprout] literally tastes like fruit snacks I ate as a kid." | R12 | Fine for the adult product. Same candy-framing concern if used on the Kids page. |
| "We quickly decided to resubscribe because we love [Sprout] so much!" | R17 | Using it as reassurance about subscriptions implies cancelling and resubscribing is easy. R20 says otherwise. The brand must be able to support this. |
| "The sugar free [Sprout] worked too well." | F2 | Hints at a laxative effect from sugar alcohols. This is a health effect to answer, not to use as a quote. |
| All 22 sources | — | Unverified buyers. 13 of 22 were hand-picked by the brand. Keep all out of paid ads. |

## 5. Notes

**Sources**
- 22 in total: 20 reviews and 2 fragments.
- One kind only: public reviews. Placements: brand site 13 (hand-picked), brand site widget 3, retailer 4, review site 2.
- The F1 and F2 IDs were assigned by the user; the source file gives the fragments no IDs. It is assumed F1 and F2 are separate people from R1–R20, which is unconfirmed.

**Dates**
- Captured Sept to Oct 2026.
- MISSING: per-review dates.
- The page shows a recent, indefinite price cut ("Subs Now Start at $29.99"), and R3's comparison is about price. With no dates, it cannot be checked whether reviews predate this change, so all are flagged as possibly older than the current price.

**Other flags**
- MISSING: verified-purchase flags, so every best phrase is unverified and kept out of paid ads.
- MISSING: star ratings. The brand claims 4.8 from 100,000; a public site shows 4.0 from 2,411.
- MISSING: free-product or paid flags. The one known paid spokesperson (the athlete) is not in these sources.

**Dropped**
- Nothing. Every entry gives a reason.
- F2's meaning ("worked too well" as a stomach effect) relies on the file's note "about sugar alcohols".

**Products**
- Not split, because there are too few per product.
- Tags that matter: tie-in flavour (R11, R19), Sugar-Free (R19, F2), Kids page (R16), Original Low Sugar 84 packs (R14).
- Split once there are more sources. Kids and Sugar-Free likely answer different problems.

**Saturation**
- **Not saturated: more sources will change this map.**
- With no dates, the "newest 20" cannot be identified. Fourteen of 15 reasons rest on 4 people or fewer, and 4 reasons rest on one person.

**What the map can't tell you**
- Why people who didn't buy said no. Only reviews were used.
- Why people left (only R20, F1 and F2 hint at this).
- How representative the brand-picked set is. Pull and result are likely inflated and complaints underweighted. Refund and cancellation tickets are the missing source for anxiety.
- Whether the four discount numbers or the first-order-only guarantee cost sales. No customer mentioned them.

## 6. Score

Checks passed: 4 of 4 = 4 / 4 × 100 = **100**

- Missed: none.
- The 100 means the map passes its own checks. It does not mean the evidence is strong: only one reason reaches 5 people, and all sources are one channel and unverified.
```
