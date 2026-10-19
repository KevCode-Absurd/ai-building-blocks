# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 6 met. Invented facts: 0.

The run is scrupulously honest: nothing is invented, every unknown is marked, disputes are recorded, and the image slice refuses to let the designer guess at the pouch or claims. But because only the ads and reviews were attached and the site could not be read, most files are placeholders, and several buyer-profile lines (push, pull, tried before, words they use) are left untagged, so a later AI cannot tell which are grounded and which are reasoned.

## Fix

In step 8 (Cross-check) add: "In customers.md every sub-line (starts looking, push, pull, nearly stopped, tried before, words they use) carries its own tag or the quote number it comes from; untagged lines are rewritten as [inferred]."

## Judge list

- Met: Every price in the files matches your price list exactly.
  "$29.99 for your first order, that's less than $1.10/day", "$20 off", "+$5 off", "$94 a month" all match ads.md and reviews.md.
- Not met: Every fact carries a tag, and every confirmed fact names its page, label or person.
  customers.md lines "Push: cost, chalky taste, effort.", "Tried before: big-name greens powders, separate gummies.", "Words they use" carry no tag or quote reference.
- Met: Claims with nothing on file are marked pending, even when they're on your own site.
  "60+ whole-food ingredients | Pending | none on file"; "Third-party tested | Pending | no certificate on file"; "Proof on file: none."
- Met: Every customer quote is something a real customer wrote, with where it came from. Profiles without quotes say inferred.
  All quotes match R1-R20 with numbers and source, e.g. "My bowel movements are normal for the 1st time in 15 years!" (R7, brand site).
- Met: Two sources that disagree are both recorded and tagged disputed, never quietly picked.
  "61% off | Pending [disputed] | the site shows 52%, 55%, 49%, 58%"; rating 4.8/100,000 vs 4.0/2,411; probiotics vs none; first box vs first order.
- Met: The slice holds only what the next step needs. An image slice has no review quotes and no pending claims.
  Slice has no review quotes; "No health, number or proof claims. Every claim is pending or banned"; only owner-confirmed $29.99 allowed.

## What went in

```text
Website: sprout.example
Brand material I already have:
- brand notes (colours, fonts, pouch, product rules)
- live ads (15 headlines, 2 main texts)
- public reviews, numbered R1 to R20
Next step: image work. A designer is making image ads for the
Original pouch.

(Check-in) Fact sheet looks right.
(Questions, one at a time)
1 Proof for "1M+ customers" and the 4.8 rating? Skip.
2 What's live right now? The $29.99 first box with text sign-up.
3 Logo and font files? Not to hand. Skip.
4 Past results with numbers? None. Skip.
5 Who may appear in content? Skip.
Competitors: your list of five is right, go ahead.

[attached: sprout/reviews.md, sprout/ads.md]
```

## What came out

```text
# Sprout brand file

## 00-start-here.md

**What Sprout is**
1. Sprout sells a daily gummy pack described as "60+ whole-food ingredients, 21 vitamins & minerals … in one daily gummy pack" `[confirmed: live ads, main text 1, 30 Sept/4 Oct 2026]`. The same text says "gut-supporting probiotics", which is `[disputed]`: see proof-and-claims.md.
2. It is pitched as a greens and nutrition habit with "6g of fiber, prebiotics, and daily vitamins … without powders or prep" `[confirmed: live ads, main text 2, 30 Sept/4 Oct 2026]`.
3. It sells on its own site and through big-box retailers and warehouse clubs `[confirmed: public reviews, source notes, Sept–Oct 2026]`. It also has a Kids line `[confirmed: public reviews R16, Kids page, Sept–Oct 2026]`.
4. The offer live now is "$29.99 first box with text sign-up" `[confirmed: owner, Q2 answer, this build]`.
5. Category: daily vitamin and greens gummy packs `[inferred]`. Stage: established `[inferred]`, based on retailer and warehouse-club presence.

**Diagnosis**
Most buyers already know the category well: they arrive having tried green powders and separate gummies, and they talk about price and about sticking with a habit. The buyer who feels the problem most is the one with long-running gut trouble ("normal for the 1st time in 15 years", "chronic IBS"). The biggest gap is that the ads lead with discounts (19 of the 40 newest), while buyers praise "the one thing I've been able to stick to" and quitting powders, two themes no live ad uses.

**House rules for any AI**
- Use claims only from the claims list in proof-and-claims.md, and only those with status Approved. Nothing is Approved yet, so no health, number or proof claim may appear as fact.
- Never use `[inferred]`, `[unknown]` or `[disputed]` items as fact.
- Never say:
  - "probiotics"
  - anything about GLP-1 medication
  - weight-loss promises
  - "Fix" as a promise
  - one buyer's result as a promise
  - any discount percentage other than the one confirmed for that page
- Always:
  - quote prices exactly
  - keep reviews as one buyer's words
  - use real logo and font files once they exist, never stand-ins

**Which file to load for which task**

| Task | Files |
|---|---|
| Planning | customers.md, market.md, proof-and-claims.md |
| Writing | offers.md, proof-and-claims.md, customers.md, voice-and-look.md (voice part) |
| Image work | The image slice below, or offers.md (Original truth sheet) plus voice-and-look.md |

**How to update**
1. Edit the file.
2. Add a dated line at the top of log.md.
3. Re-upload the file.
4. Owner answers are tagged "owner, this build". Replace them with dated tags when they are confirmed again.

---

## business.md

**One line:** a daily gummy pack meant to replace greens powders and separate supplement gummies `[inferred]`, from customer words in public reviews R3, R4 and R5.

**Category:** daily vitamin and greens gummy packs `[inferred]`.

**Stage:** established `[inferred]`. The "1M+" figure is pending, so it is not used as evidence.

**Positioning**
- **Options buyers weigh:**
  - green powders `[confirmed: public reviews R1, R3, R4]`
  - separate probiotic, B12 and multivitamin gummies `[confirmed: public reviews R5]`
  - getting kids to eat veggies `[confirmed: live ads, Kids headline "The veggies they won't eat"]`
  - doing nothing `[inferred]`
- **What only Sprout has:** `[unknown: owner; site not read]`.
- **What buyers say it gives them:**
  - a habit they keep `[confirmed: public reviews R1, R2]`
  - no shaker or dishes `[confirmed: public reviews R6]`
  - taste like fruit snacks `[confirmed: public reviews R12]`
- **Who cares most:** the gut and regularity buyer `[inferred]`, from R7 and R8.
- **Category it competes in:** greens and daily nutrition `[inferred]`.

**Story as the site tells it:** `[unknown: about page not read]`.

**Promise:** "Nutrition Made Ridiculously Easy" `[confirmed: live ads, sister line to #12]` is the closest stated line. The site promise is `[unknown: home page not read]`.

**How the name is said:** `[unknown: owner]`.

---

## offers.md

### Price summary

| Item | Figure | Tag |
|---|---|---|
| First box | "$29.99 first box with text sign-up" | `[confirmed: owner, Q2, this build]` |
| Ad main text | "$29.99 for your first order, that's less than $1.10/day" | `[confirmed: live ads, main text 1]` |
| First order discount | "$20 off your first order" | `[confirmed: live ads, main text 1]` |
| Extra people | "+$5 off for every extra person" | `[confirmed: live ads, main text 1]` |
| Discount in ads | "61% off" | `[disputed]` |
| Discount on site | "52%, 55%, 49% or 58%, depending on the page" | `[disputed]` (live ads note) |
| Gifts | "up to 61% OFF + 4 FREE gifts: online exclusive" | `[confirmed: live ads #3]` |
| Partner gift | "30 Days Of [a fitness app], Free" | `[confirmed: live ads, other headlines]` |
| Price cut | "We're Lowering Our Prices 🔥" (the birthday price cut) | `[confirmed: live ads #5]`. Amounts are `[unknown: owner]` |

- **Full price after the first box:** `[unknown: subscription terms page, owner]`.
- **"First box" vs "first order":** the owner says "first box"; the ad says "first order". This is a wording difference, kept both ways `[disputed]`.

### Original pouch: truth sheet

- **Kind:** eaten. Daily packs, "one daily gummy pack" `[confirmed: live ads, main text 1]`. Bought again on a plan: "Glad I have a subscription!" `[confirmed: public reviews R14]`.
- **How long one unit lasts:** `[unknown: product page]`.
- **Version name:** a variant is labelled "Original Low Sugar 84 packs" `[confirmed: public reviews R14, widget label]`. Whether this is the "Original pouch" is `[unknown: owner]`.
- **Ingredients with amounts, serving, pack size:** `[unknown: product page, ingredients page, label photo]`.
- **Brand-stated contents:**
  - "6g of fiber, prebiotics" `[confirmed: live ads, main text 2]`
  - the product page shows prebiotic fiber and no probiotics `[confirmed: live ads, note on product page]`
- **Camera facts:**
  - Looks like: `[unknown: no product photos received]`
  - Pack: `[unknown: no pouch photos received; brand notes not received]`
  - How it's used: open a daily pack, eat the gummies `[inferred]`, from R15 "grab and eat"
  - Visible result: `[unknown]`. Nothing likely shows on camera `[inferred]`. What could be shown instead: no shaker or dishes to clean `[inferred, from R6]`
  - Moves and sounds: `[inferred]` the pack tearing open, gummies tipped into a hand. Sounds not heard.
  - Never show: `[unknown: brand notes]`. Until photos exist, never draw a pouch, gummy colour or printed word from imagination.
- **Photo jobs (pack front, out of the pack, in a hand, in use, close-up):** all empty. No photos received.

### Other products seen

- Kids line `[confirmed: public reviews R16]`
- Raspberry Lemonade launch `[confirmed: live ads, Kids headlines]`
- A cartoon-movie tie-in flavour, including Sugar-Free `[confirmed: public reviews R11, R19]`
- Limited flavours for members `[confirmed: live ads #11]`

Truth sheets for these are `[unknown: product pages]`.

### Policies

| Policy | Status |
|---|---|
| Delivery cost, free-delivery level, time | `[unknown: shipping page]` |
| Returns window, who pays | `[unknown: returns page]` |
| Guarantee | `[unknown: site, owner]` |
| Subscription pause, skip, cancel | `[unknown: subscription terms]`. A buyer reports cancelling before the first delivery `[confirmed: public reviews R17]`. Another reports "I have tried multiple times to cancel my subscription" `[confirmed: public reviews R20]` |
| Membership perks | "gifts, limited flavours, savings" `[confirmed: live ads #11]` |

**Buyer questions with the brand's answers:** `[unknown: FAQ not read]`.

---

## customers.md

Profiles are ranked by quote count and strength of feeling `[inferred]`. Share is `[unknown: store data]`.

### 1. The powder quitter: wants a habit that sticks

**Quotes**
- "The issue has never been nutritive content. It's always been an issue of consistency… [Sprout] has been the one thing I've been able to stick to." (R1, brand site)
- "It's wild I WANT to take [Sprout] and don't forget." (R2, brand site)
- "…$94 a month and the drink was definitely gritty/chalky." (R3, brand site)
- "I've been choking on [a big-name greens powder] for the last few years" (R4, brand site)
- "not having to clean a shaker bottle or extra dishes" (R6, brand site)
- "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." (R5, brand site)

**Buying situation**
- **Starts looking:** after giving up on, or being tired of, a powder `[inferred]`.
- **Push:** cost, chalky taste, effort.
- **Pull:** taste, ease, one product instead of many.
- **Nearly stopped them:** price ("They are expensive", retailer) `[confirmed: public reviews, short quotes]`.
- **Tried before:** big-name greens powders, separate gummies.
- **How much they know:** a lot. They already compare products.
- **Words they use:** "stick to", "consistency", "gritty/chalky", "choking", "easier to manage".
- **Words that turn them off:** `[unknown]`.
- **On camera:** `[inferred]` pushing a shaker bottle aside and tearing open a pack.

### 2. The gut and regularity buyer

**Quotes**
- "My bowel movements are normal for the 1st time in 15 years!" (R7, brand site). Tell it only as one buyer's story.
- "This is huge for someone who suffers from chronic IBS!" (R8, brand site)
- "the solution to my problems with regularity." (R9, retailer)
- "Feel lighter, less bloated and overall good." (R10, retailer)

**Buying situation**
- **Starts looking:** with long-running digestion trouble `[inferred]`.
- **Push:** bloating, irregularity.
- **Pull:** fiber and prebiotics that work "not aggressively" (R8).
- **Nearly stopped them:** sugar alcohols ("The sugar free [Sprout] worked too well.", review site).
- **Tried before:** `[unknown]`.
- **How much they know:** they know the problem and the ingredients.
- **Words they use:** "regularity", "bloated", "lighter", "digestion".
- **Words that turn them off:** `[unknown]`.
- **On camera:** `[inferred]` a calm morning routine, eating a pack with breakfast.

### 3. The busy parent

**Quotes**
- "So easy to grab and eat on my way to the billion things I have to do as a mom." (R15, brand site)
- "this is the only one they love eating. They think it's a treat." (R16, Kids page)
- "I hate subscriptions because I feel like they are a trap… We quickly decided to resubscribe" (R17, brand site)

**Buying situation**
- **Starts looking:** when kids refuse greens `[inferred]`.
- **Push:** picky eaters, no time.
- **Pull:** kids treat it as a treat, grab-and-go.
- **Nearly stopped them:** distrust of subscriptions (R17).
- **Tried before:** "all of the 'green' options for the kids" (R16).
- **How much they know:** a lot.
- **Words they use:** "treat", "easy to grab", "trap".
- **Words that turn them off:** "subscription" said as a trap (R17).
- **On camera:** `[inferred]` handing a pack to a child at the door.

### 4. The GLP-1 user

**Quotes**
- "…I've been on a glp1 for about a year now and was always constipated not anymore" (R11, widget)
- "I'm on Glp-1 and they definitely help with the vitamin loss you get!" (R14, widget)

**Rules for this profile**
- Use it for research only. The brand must not repeat these health claims (banned).
- The weight-loss ads (#9 and the "Perfect Supplement" line) aim at this buyer with no evidence on file.

**On camera:** `[inferred]`. Do not film this buyer for ads until claims are cleared.

**Open question:** what this buyer may be told legally `[unknown: owner, compliance]`.

---

## proof-and-claims.md

### The claims list

| Claim as written | Status | Proof | Source and date | How it may be shown |
|---|---|---|---|---|
| "60+ whole-food ingredients" | Pending | none on file | live ads, main text 1, Oct 2026 | not as fact |
| "21 vitamins & minerals" | Pending | none on file | live ads, main text 1 | not as fact |
| "gut-supporting probiotics" | Banned `[disputed]` | product page shows no probiotics | live ads, main text 1 and note | never |
| "6g of fiber" / "6 g prebiotic fiber" | Pending | ingredient list noted, amount not read | live ads, main text 2, #7 | not as fact |
| "Third-party tested" | Pending | no certificate on file | live ads, main text 1 | not as fact |
| "supports digestion" | Pending | none | live ads, main text 2 | not as fact |
| "Trusted by 1M+" | Pending | owner skipped proof | live ads #4 | not as fact |
| "4.8 stars from 100,000 reviews" | Pending `[disputed]` | a public review site shows "4.0 from 2,411" | public reviews, notes | not as fact |
| "Fix the Hot Girl Tummy" | Pending (risky word "Fix") | none | live ads #6 | not as fact |
| "Nutrition for Healthy Hair" | Pending | none | live ads #8 | not as fact |
| "Support Muscle While You Lose Weight" | Pending (risky) | "no evidence on file" | live ads #9 | not as fact |
| "Perfect Supplement for Weight Loss Support \| Support Energy & Wellness" | Pending (risky) | none | live ads, other | not as fact |
| "Methylfolate, Not Folic Acid" | Pending | label not read | live ads #15 | not as fact |
| "Online-exclusive offer" | Pending | none | live ads, main text 1 | not as fact |
| "less than $1.10/day" | Pending | pack count unknown | live ads, main text 1 | not as fact |
| "61% off" | Pending `[disputed]` | the site shows 52%, 55%, 49%, 58% | live ads note | not until one figure is confirmed per page |
| Any GLP-1 benefit (R11, R14) | Banned | customer words only | public reviews notes | never as the brand's claim |
| R7 result as a promise | Banned as a promise | one review | public reviews notes | only as one buyer's story, quoted |

- **Proof on file:** none. No test results, certificates or verified rating sources were received.
- **Guarantee:** `[unknown: site, owner]`.

---

## voice-and-look.md

### Voice

Samples come from the live ads `[confirmed: live ads, Oct 2026]`. Site lines are `[unknown: site not read]`.

**Traits**
- **Blunt about price, not coy:** "'Sprout is too expensive': here's 61% off to prove otherwise"
- **Insider, not salesy:** "Don't Pay Full Price. You Literally Don't Have To."
- **Playful, not clinical:** "One pack a day keeps the gut happy 💩"
- **Story-led, not feature-led:** "He Asked What Day It Was. I Handed Him a Gummy."

**Scales** `[inferred]`
- casual over formal
- funny over serious
- cheeky over respectful
- excited over calm

**Tone by situation**
- Selling: offer-first `[confirmed: live ads mix]`.
- Explaining: "supports digestion with 6g of fiber, prebiotics, and daily vitamins" `[confirmed: main text 2]`.
- Saying sorry: `[unknown]`.

**Words to use** (customer words): "stick to", "easy", "treat", "no shaker".

**Words to avoid:**
- "probiotics"
- "Fix"
- GLP-1
- weight-loss promises
- "trap"-style subscription pressure `[inferred, from R17 and R20]`

### Look

| Item | Status |
|---|---|
| Colours (hex and job) | `[unknown: brand notes not received]` |
| Fonts and job | `[unknown: brand notes not received]` |
| Logo files | `[unknown: owner; not to hand]` |
| Font files | `[unknown: owner; not to hand]` |
| Product's real colours | `[unknown: no photos]` |
| Image style, do and don't | `[unknown]` |
| Brand world (places, surfaces, light, who appears, what never appears) | `[unknown: no lifestyle photos]`. Who may appear: `[unknown: owner skipped]` |
| Motion and sound | `[unknown: no videos watched]`. Ad formats were not captured |

The 💚 emoji appears in an ad `[confirmed: main text 1]`.

---

## market.md

### Options buyers weigh

- **Green powders:** a "$94 a month" big-name powder with subscription, "gritty/chalky" `[confirmed: public reviews R3]`.
- **Separate gummies:** probiotic, B12, multivitamin `[confirmed: R5]`.
- **Other kids' "green" options** `[confirmed: R16]`.
- **Doing nothing or relying on food** `[inferred]`.

### Competitor table

The owner approved "your list of five", but no named list exists in the material received.

| Who | Address | Pitch | Price range | Strength | Gap |
|---|---|---|---|---|---|
| `[unknown: owner, 5 names]` | `[unknown]` | `[unknown]` | `[unknown]` | `[unknown]` | `[unknown]` |

### Open ground

The habit story ("the one thing I've been able to stick to") and the "I quit powders" story appear in reviews but in no live Sprout ad `[confirmed: live ads, mix note]`. Whether competitors hold this ground is `[unknown]`.

---

## log.md

### Recent changes
- **This build:** the live offer is "$29.99 first box with text sign-up" `[confirmed: owner, Q2]`.
- **2 Oct 2026:** six "Nutrition for Healthy Hair" ads were created `[confirmed: live ads #8]`.
- **30 Sept–3 Oct 2026:** of the 40 newest ads, 19 were offer-led, 7 perks, 6 hair, 3 habit or story, 2 gut, 2 limited flavour and 1 weight loss `[confirmed: live ads]`.
- **Undated:**
  - Raspberry Lemonade launch ("The Lemon Aid Stand is open. 🍋")
  - the birthday price cut ("We're Lowering Our Prices 🔥")

### Decisions
None recorded `[unknown: owner]`.

### Results
All ads are graded **seen running** and their results are `[unknown]`; the owner has no numbers. Number of copies live:
- #1: 15+
- #3: 10
- #2: 8+
- #11: 7
- #6 and #8: 5 and 6
- the others: 1 to 4 or not counted

Copy counts are not proof of results.

### Open questions
- Which discount figure is correct on each page?
- Should the "probiotics" line be pulled?
- What evidence is there for the weight-loss and hair claims?
- What are the subscription cancel steps (see R20)?
- What full price follows the first box?

---

## Summary

- **Files written:** 8. The site could not be read, so every site page counts as not loaded:
  - home, about, pricing, FAQ, policies, reviews
  - product pages and collections
  - shipping, returns, ingredients, subscription terms
- **Disputed facts:**
  - discount: 61% in ads vs 52/55/49/58% on the site
  - rating: 4.8 from 100,000 vs 4.0 from 2,411
  - "probiotics" in the ad vs none on the product page
  - "first box" vs "first order"
- **Buyer profiles:** 4. All are grounded in numbered quotes; ranking and On-camera lines are `[inferred]`.

**Gaps**
- MISSING: brand notes file (colours, fonts, pouch, product rules), listed but not attached. Owner.
- MISSING: website pages (home, about, product, ingredients, policies, subscription terms). Owner, as pasted pages.
- MISSING: Original pouch photos for all five photo jobs (pack front, out of pack, in a hand, in use, close-up). Owner.
- MISSING: logo and font files. Owner or designer.
- MISSING: proof for "Trusted by 1M+" and "4.8 stars from 100,000 reviews". Owner.
- MISSING: test certificate for "Third-party tested". Owner.
- MISSING: ingredient amounts, serving and pack size for the Original pouch. Product label or owner.
- MISSING: whether "Original pouch" is the same as "Original Low Sugar 84 packs". Owner.
- MISSING: full price after the first box, and the exact first-box terms. Owner.
- MISSING: delivery, returns, guarantee and cancel terms. Site policy pages.
- MISSING: names of the five confirmed competitors. Owner.
- MISSING: who may appear in content. Owner.
- MISSING: ad results with numbers. Owner or ad account.
- MISSING: how "Sprout" is said. Owner.

---

## Slice: image work, Original pouch

- **How the product looks:** `[unknown]`. No photos were received. Do not draw the pouch, the gummies, their colours or any printed pouch words until real photos arrive.
- **Looks like / Pack / How it's used / Never show:**
  - Looks like: `[unknown]`
  - Pack: `[unknown]`
  - How it's used: open a daily pack and eat the gummies `[inferred]`
  - Never show: an invented pouch, an invented logo, a shaker or powder presented as the product, pills or capsules `[inferred]`
- **Filled photo jobs:** none.
- **Colours, fonts, logo:** `[unknown]`. Wait for the brand notes and real files. No stand-ins.
- **Photo style and brand world:** `[unknown]`.
- **Exact words allowed on the picture:**
  - "$29.99", only as the first-box price with the text sign-up condition `[confirmed: owner]`. The exact on-image wording is `[unknown: owner]`.
  - No health, number or proof claims. Every claim is pending or banned.
- **Never on the picture:**
  - "probiotics"
  - "Fix"
  - GLP-1
  - weight loss
  - "61%" or any other discount percentage
  - "1M+"
  - "4.8"
  - "Third-party tested"
  - "60+"
  - "21 vitamins"
  - "6g"

---

## Score: 75 / 100 (6 of 8 checks passed)

- Missed: the Original pouch has no Looks like, Pack or How it's used written from photos, and no photo jobs are filled.
- Missed: the image slice cannot carry the camera facts, the filled photo jobs or the pack's printed words, because no pouch photos were received.

## Loading it into an AI

1. Paste `00-start-here.md` into the instructions box of a Claude project, a ChatGPT project or custom GPT, or a Gemini Gem.
2. Add the other seven files as knowledge. A Gem takes up to 10 files.
3. In a plain chat, attach the start file plus the files the task needs, or give the designer just the slice above.
4. Most uploaded copies don't update themselves; a Google Doc linked to a Gem does. After a change, edit the file, add a line to `log.md` and upload it again.
```
