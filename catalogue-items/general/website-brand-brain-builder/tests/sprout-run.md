# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The run worked honestly from the two files it was actually sent, refused to invent the pouch, colours, fonts or competitor list, and flagged every gap and disagreement so the owner knows exactly what to supply. For the designer, the image slice is correctly thin and safe, though the owner should add the text-sign-up condition to the $29.99 line before it goes on an image and will need to attach the brand notes and photos for the slice to be useful.

## Judge list

- Met: Every price in the files matches your price list exactly.
  "$29.99 for your first order", "less than $1.10/day", "$20 off", "+$5 off", "$94 a month" all match ads.md main text 1 and R3 exactly.
- Met: Every fact carries a tag, and every confirmed fact names its page, label or person.
  "[confirmed: ads.md main text 1, 30 Sept & 4 Oct 2026]", "[confirmed: owner, this session]"; one untagged inference ("Weight-loss ads (A9) aim at this buyer") is the only slip.
- Met: Claims with nothing on file are marked pending, even when they're on your own site.
  "No claim is approved"; "Third-party tested | Pending | none"; "60+ whole-food ingredients... | Pending | none".
- Met: Every customer quote is something a real customer wrote, with where it came from. Profiles without quotes say inferred.
  All quotes trace to R1–R20 or the 'also seen' lines; "Like mixed berries!" [R6], "worked too well" [review site]. Sub-lines without quotes read [unknown]/[inferred].
- Met: Two sources that disagree are both recorded and tagged disputed, never quietly picked.
  "61% off... but 52%, 55%, 49% or 58% on the site | [disputed]"; probiotics "[disputed: ads.md main text 1 vs product page]"; rating 4.8/100,000 vs 4.0/2,411 [disputed].
- Met: The slice holds only what the next step needs. An image slice has no review quotes and no pending claims.
  Image slice lists only offer words from main text 1, says "Any review quote" not allowed, excludes pending "$1.10/day" and all % off.

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
# 00-start-here.md

**Sprout in five lines**
1. Sprout sells a daily nutrition gummy in single-serve packs, as "one daily gummy pack." [confirmed: ads.md main text 1, 30 Sept & 4 Oct 2026]
2. Sold online, on a subscription, and through big-box and warehouse club retailers. [confirmed: reviews.md sources, Sept–Oct 2026; R14, R17]
3. Ranges seen: Original Low Sugar (84 packs), Sugar-Free, Kids, a cartoon-movie tie-in flavour, and a Raspberry Lemonade launch. [confirmed: R14, R19, R11, ads.md Kids headlines]
4. Offer live now: the $29.99 first box with text sign-up. [confirmed: owner, this session]
5. The main competitor buyers name is greens powders. [confirmed: R1, R3, R4]

**Diagnosis**
Buyers already know the category well: most have tried and dropped greens powders or a pile of separate gummies. The people who struggled to stick with a habit (R1–R6) and the people with gut and regularity problems (R7–R10) feel it most. The biggest gap is that the ads lead on price (19 of the 40 newest ads are offer-led, all saying 61% off). Buyers talk instead about finally sticking with it and quitting powders, and no ad tells either story.

**House rules for any AI**
- Use claims only from `proof-and-claims.md`, at their status. No claim is approved yet, so none may be stated as fact in finished copy without owner sign-off.
- Never use `[inferred]`, `[unknown]` or `[disputed]` lines as fact.
- **Never say:** "probiotics" (the ingredient list shows prebiotic fiber only). Never say anything about GLP-1 medication. Never say "fix" or make weight-loss promises. Never use a discount percentage until one figure is confirmed.
- **Always do:** copy prices exactly. Tell R7 as one buyer's story, never as a promise. Keep review quotes out of image text.
- Do not invent pack art, colours, fonts or a logo. They are not on file.

**Which file for which task**
| Task | Load |
|---|---|
| Ad or page copy | 00, offers, customers, proof-and-claims, voice-and-look |
| Image or video work | 00, offers (truth sheet), voice-and-look, or just the image slice |
| Planning or strategy | 00, business, customers, market, log |
| Offer design | 00, offers, customers, market |

**How to update:** edit the file, add a dated line to `log.md`, then re-upload.

---

# business.md

- **One line:** A daily gummy pack carrying "60+ whole-food ingredients, 21 vitamins & minerals" and 6 g fiber, sold as an easier alternative to greens powders. [confirmed: ads.md main text 1 and 2 — the brand's wording; claims are pending, see proof-and-claims]
- **Category:** daily greens and multivitamin gummy supplement. [inferred]
- **Stage:** established. [inferred: retail presence per reviews.md, a "1M+" claim, and a claimed 100,000 reviews]
- **Name pronunciation:** [unknown: owner]

**Positioning**
- **Options buyers weigh:**
  - Greens powders. [confirmed: R1, R3, R4]
  - Separate probiotic, B12 and multivitamin gummies. [confirmed: R5]
  - Other "green" options for kids. [confirmed: R16]
  - Doing nothing, or relying on food. [inferred]
- **What only Sprout has:** a greens-type product in gummy form, with no shaker or prep, that tastes like a treat. [confirmed: R6, R12, R16; ads.md main text 2 "without powders or prep"]
- **What that gives buyers:** a habit they keep. [confirmed: R1, R2]
- **Who cares most:** past powder users who couldn't stick with it, and people with regularity problems. [inferred from quote count and strength]
- **Category it competes in:** greens powders and daily multivitamins. [inferred]

**Story as the site tells it:** [unknown: site not read; owner or about page]

**Promise:** [unknown: site not read]. The ads lean on "Nutrition Made Ridiculously Easy." [confirmed: ads.md, near A12]

---

# offers.md

## Price summary
| Item | Figure | Tag |
|---|---|---|
| First box, live now | $29.99, with text sign-up | [confirmed: owner, this session] |
| First order (ad wording) | "$29.99 for your first order" | [confirmed: ads.md main text 1] |
| Per day | "less than $1.10/day" | [confirmed: ads.md main text 1] |
| First-order discount | "$20 off your first order" | [confirmed: ads.md main text 1] |
| Extra people | "+$5 off for every extra person" | [confirmed: ads.md main text 1] |
| Headline discount | "61% off" in all ads, but 52%, 55%, 49% or 58% on the site depending on page | [disputed: ads.md vs site per ads.md "The mix"] |
| Gifts | "up to 61% OFF + 4 FREE gifts: online exclusive" | [confirmed: A3]; percentage [disputed] |
| Partner gift | "30 Days Of [a fitness app], Free" | [confirmed: ads.md "Also live"] |
| Price cut | "We're Lowering Our Prices 🔥" (the birthday price cut) | [confirmed: A5]; new prices [unknown: owner] |
| Full price after the first box | — | [unknown: owner or pricing page] |
| Big-name rival, for comparison | "$94 a month" even with its subscription discount | [confirmed: R3 — customer's figure for a rival, not a Sprout fact] |

## Original pouch: truth sheet
- **Kind:** eaten, as a gummy. Bought again when it runs out, or on a plan. [confirmed: ads.md main text 1 "daily gummy pack"; R14 "subscription"]
- **How long one unit lasts:** one pack a day. [confirmed: ads.md Kids headline "One pack a day"] Packs per pouch: an "84 packs" option exists on Original Low Sugar. [confirmed: R14] Whether that is the "Original pouch": [unknown: owner]
- **Made of:**
  - "60+ whole-food ingredients, 21 vitamins & minerals." [confirmed: ads.md main text 1]
  - "6g of fiber, prebiotics." [confirmed: ads.md main text 2]
  - Prebiotic fiber, no probiotics. [confirmed: product page ingredient list, as noted in ads.md]
  - "Gut-supporting probiotics." [disputed: ads.md main text 1 vs product page]
  - Full ingredients with amounts: [unknown: label or product page]
- **Serving, size, how long it lasts, storage:** [unknown: label]
- **Taste:** "Like mixed berries!" [confirmed: R6 — one customer]. Flavours: Original Low Sugar, Sugar-Free, cartoon tie-in, Raspberry Lemonade. [confirmed: R14, R19, R11, ads.md]
- **How it works (brand's words):** "supports digestion with 6g of fiber, prebiotics, and daily vitamins to help keep your gut balanced without powders or prep." [confirmed: ads.md main text 2] Claim status: pending.
- **What it replaces:**
  - Greens powders and shaker bottles. [confirmed: R3, R4, R6]
  - Separate probiotic, B12 and multivitamin gummies. [confirmed: R5]
- **Main reason to buy:** a daily habit that sticks without prep. [confirmed: R1, R2, R6]

**Camera facts:** none written. No photos or brand notes were attached, and these lines may only come from looking at photos.
- Looks like: [unknown: product photos]
- Pack: [unknown: pouch photo]. Large printed words: [unknown]. Versions that look different: [unknown]
- How it's used, as hands do it: [unknown: photos or video]. "Grab and eat on my way" [confirmed: R15] gives the use moment only, not the look.
- Visible result: nothing changes on camera. [inferred] Show instead: the pack opened on the go, a kid reaching for it, or a powder tub and shaker pushed aside. [inferred]
- Moves and sounds: tearing a pack, gummies tipping into a palm, a pouch rustling. [inferred — none heard]
- Never show:
  - A powder, scoop or shaker presented as Sprout. [inferred]
  - Probiotic wording. [confirmed: ads.md note]
  - GLP-1 pens or medication. [confirmed: reviews.md note]
  - Before-and-after bodies. [inferred]
  - Invented pack art or text. [rule]
- Reference photos:
  - Pack front: none
  - Out of the pack: none
  - In a hand: none
  - In use: none
  - Close-up: none

## Policies
- Delivery cost, free-delivery level, time: [unknown: shipping page]
- Returns window and who pays: [unknown: returns page]
- Guarantee: [unknown: site]
- Subscription pause, skip and cancel:
  - Terms: [unknown: subscription terms page]
  - One buyer cancelled before her first delivery and then resubscribed. [confirmed: R17]
  - Another wrote "I have tried multiple times to cancel my subscription." [confirmed: R20]
- Text sign-up terms: [unknown: owner]
- Membership perks: "gifts, limited flavours, savings." [confirmed: A11 description]

## Buyer questions with the brand's answers
- Does it have probiotics? [disputed — see above; owner to answer]
- Is it expensive? The brand's answer: "'Sprout is too expensive': here's 61% off to prove otherwise." [confirmed: A1]
- What about Sugar-Free and sugar alcohols? A customer wrote it "worked too well." [confirmed: review site]. Brand answer: [unknown: FAQ]
- Kids' version folate: "Methylfolate, Not Folic Acid." [confirmed: A15]

---

# customers.md

Ranked by number of quotes on file and strength of feeling. Share of buyers is not measured. [inferred]

## 1. The powder quitter who wants a habit that sticks
- **Quotes:** R1, R2, R3, R4, R5, R6
- **Starts looking:** after dropping powders yet again. [R1]
- **Push:** "consistency," plus a gritty or chalky drink at "$94 a month." [R1, R3, R4]
- **Pull:** taste, convenience, no shaker to clean. [R6]
- **Nearly stopped them:** [unknown: no quote; possibly price per "They are expensive" (retailer)]
- **Tried before:** greens powders, and separate probiotic, B12 and multivitamin gummies. [R3, R4, R5]
- **How much they know:** a lot. They compare against named rivals. [R1, R3]
- **Words they use:** "stick to," "don't forget," "choking on," "gritty/chalky," "easier to manage." [R1–R5]
- **Words that turn them off:** [unknown: no quote. Open question: survey past powder users]
- **On camera:** pushing a powder tub aside and opening a pack at the counter. [inferred]

## 2. The person with gut and regularity trouble
- **Quotes:** R7, R8, R9, R10
- **Starts looking:** after years of irregularity or IBS. [R7, R8]
- **Push:** "15 years" of abnormal bowel movements; chronic IBS. [R7, R8]
- **Pull:** gentle prebiotics that work "not aggressively." [R8]
- **Nearly stopped them:** Sugar-Free sugar alcohols "worked too well" [review site], and taste at first. [R18]
- **Tried before:** [unknown: no quote]
- **How much they know:** fairly high; they know the word "prebiotics." [R8]
- **Words they use:** "regularity," "lighter, less bloated," "normal." [R7, R9, R10]
- **Words that turn them off:** [unknown. The ad word "Fix" (A6) is flagged as risky in ads.md, not by buyers]
- **On camera:** a calm morning routine, pack eaten with coffee. [inferred]
- **Rule:** R7 is one buyer's story, never a promise. [confirmed: reviews.md note]

## 3. The busy parent buying for the family
- **Quotes:** R15, R16, R17
- **Starts looking:** when kids reject "all of the 'green' options." [R16]
- **Push:** no time — "the billion things I have to do as a mom." [R15]
- **Pull:** kids "think it's a treat." [R16]
- **Nearly stopped them:** subscriptions feel "like they are a trap." [R17]
- **Tried before:** other green options for kids. [R16]
- **How much they know:** medium to high; some read labels. [inferred from A15 targeting label-reading parents]
- **Words they use:** "grab and eat," "treat," "my kids love them." [R15, R16, R17]
- **Words that turn them off:** "subscription" and "trap." [R17]
- **On camera:** handing a pack to a kid on the way out of the door. [inferred]

## 4. The GLP-1 medication user
- **Quotes:** R11, R14
- **Starts looking:** after constipation or "vitamin loss" on GLP-1 medication. [R11, R14]
- **Push:** being "always constipated." [R11]
- **Pull:** taste, then a noticed difference in "energy, gut health, and even my sleep." [R14]
- **Nearly stopped them:** [unknown]
- **Tried before:** [unknown]
- **How much they know:** high about their own treatment. [inferred]
- **Words they use:** "glp1," "get back to normal," "subscription." [R11, R14]
- **Words that turn them off:** [unknown]
- **On camera:** [inferred] everyday use only. Never show medication.
- **Rule:** the brand must not repeat GLP-1 claims as its own. [confirmed: reviews.md note] Weight-loss ads (A9) aim at this buyer with no evidence on file.

**Taste complaints across profiles:** "tasted terrible" at first, then better by day three [R18]; "the taste is off" (tie-in flavour, Sugar-Free) [R19].

---

# proof-and-claims.md

No claim is **approved**: no test, certificate or label is on file for any of them.

| Claim as written | Status | Proof on file | Source, date | How it may be shown |
|---|---|---|---|---|
| "Trusted by 1M+" | Pending | none (owner skipped) | A4, Oct 2026 | Not as fact |
| 4.8 stars from 100,000 reviews | Pending, [disputed] | A public review site shows 4.0 from 2,411 | reviews.md header | Not at all until a source is named |
| "60+ whole-food ingredients, 21 vitamins & minerals" | Pending | none | ads.md main text 1 | Not until the label is on file |
| "6g of fiber" / "6 g prebiotic fiber" | Pending | Product page ingredient list (second-hand, ads.md note) | ads.md | After the label is checked |
| "gut-supporting probiotics" | Banned | Product page shows no probiotics | ads.md note | Never |
| "Third-party tested" | Pending | none | ads.md main text 1 | Not until the certificate is named |
| "Methylfolate, Not Folic Acid" (Kids) | Pending | none | A15 | After the label is checked |
| "supports digestion… keep your gut balanced" | Pending | none | ads.md main text 2 | Not as fact |
| "Fix the Hot Girl Tummy" | Pending, risky ("Fix") | none | A6 | Avoid "fix" |
| "Nutrition for Healthy Hair" | Pending | none | A8 | Not as fact |
| "Support Muscle While You Lose Weight" | Pending, risky | none | A9 | Avoid |
| "Perfect Supplement for Weight Loss Support" | Pending, risky | none | ads.md "Also live" | Avoid |
| GLP-1 benefits (R11, R14) | Banned as a brand claim | customer words only | reviews.md note | Never as the brand's words |
| "My bowel movements are normal for the 1st time in 15 years!" | Customer story | R7 | brand site | Only as one buyer's story, attributed, never as a promise |
| "less than $1.10/day" | Pending | depends on full price [unknown] | ads.md main text 1 | After pricing is checked |
| "61% off" | [disputed] | site shows 52/55/49/58% | ads.md | Not until one figure is confirmed |

**Guarantee, word for word:** [unknown: site]

---

# voice-and-look.md

## Voice
Taken from the brand's own ad lines. Site copy was not read.

**Traits**
1. **Plain-spoken, not clinical.** "Nutrition Made Ridiculously Easy." [confirmed: ads.md]
2. **Cheeky, not prim.** "One pack a day keeps the gut happy 💩" [confirmed: ads.md Kids]
3. **Answers objections head-on, not defensively.** "'Sprout is too expensive': here's 61% off to prove otherwise" [confirmed: A1]
4. **Story-led, not list-led (sometimes).** "He Asked What Day It Was. I Handed Him a Gummy." [confirmed: A13]

**Scales** [inferred from the ads]

| Scale | Where Sprout sits |
|---|---|
| Formal ↔ casual | Casual |
| Serious ↔ funny | Leans funny |
| Respectful ↔ cheeky | Cheeky |
| Calm ↔ excited | Excited (🔥, emojis, caps) |

**Tone by situation**
- **Selling:** offer-first, with insider framing. "You Literally Don't Have To." [confirmed: A2]
- **Explaining:** a short list with ticks. [confirmed: ads.md main text 1]
- **Saying sorry:** [unknown: support emails]

**Words**
- **Use:** "daily," "easy," "gummy pack," "without powders or prep." [confirmed: ads.md]
- **Avoid:** "probiotics," "fix," weight-loss promises, GLP-1. [confirmed: ads.md and reviews.md notes]

## Look
- **Colours (hex and job):** [unknown: brand notes, not attached]
- **Fonts and job:** [unknown: brand notes]
- **Logo file:** [unknown: owner, not to hand]
- **Font files:** [unknown: owner, not to hand]
- **Product's real colours:** [unknown: photos]
- **Image style, do and don't:** [unknown: brand notes or lifestyle photos]
- **Brand world** (places, surfaces, light, who appears, what never appears):
  - [unknown: lifestyle photos]
  - Who may appear: [unknown: owner skipped]
  - Ads use a cartoon-movie tie-in for Kids. [confirmed: ads.md]
- **Motion and sound:** [unknown: no videos watched]. Ad formats: [unknown: not captured in ads.md]

---

# market.md

## Options buyers weigh
- Greens powders. [confirmed: R1, R3, R4]
- Separate single-purpose gummies. [confirmed: R5]
- Other kids' "green" options. [confirmed: R16]
- Doing nothing, or relying on food. [inferred]

## Competitors
You confirmed a list of five, but that list is not in the material I was given, so I can't record it.

| Who | Address | Pitch | Price range | Strength | Gap |
|---|---|---|---|---|---|
| [a big-name greens powder] (name swapped in the material) | [unknown] | [unknown] | "$94 a month" with subscription discount [confirmed: R3] | Big name [inferred] | "gritty/chalky," "choking on" it [R3, R4] |
| Competitors 2 to 5 | [unknown: owner's confirmed list] | | | | |

## Open ground
- No ad tells "I quit powders" or "I finally stuck with it," the two strongest review themes. [confirmed: ads.md "The mix"]
- Whether any rival holds these: [unknown: competitor research]

---

# log.md

## Recent changes (newest first)
- **2 Oct 2026:** six hair ads created ("Nutrition for Healthy Hair"). [confirmed: A8]
- **30 Sept – 3 Oct 2026:** of the 40 newest ads, 19 are offer-led, 7 perks, 6 hair, 3 habit or story, 2 gut, 2 limited flavour, 1 weight loss. [confirmed: ads.md]
- **Live now:** the $29.99 first box with text sign-up. [confirmed: owner, this session]
- **Birthday price cut** announced ("We're Lowering Our Prices"). [confirmed: A5] Date: [unknown]
- **Raspberry Lemonade launch** ("The Lemon Aid Stand is open."). [confirmed: ads.md] Date: [unknown]
- **Fitness-app partner gift** live. [confirmed: ads.md]

## Decisions
None on file. [unknown: owner]

## Results
All seen running, all with results [unknown]. No spend or outcome data exists. [confirmed: ads.md; owner has no past results]

| Ad | Copies live |
|---|---|
| A1 | 15+ |
| A3 | 10 |
| A2 | 8+ |
| A11 | 7 |
| A8 | 6 |
| A6 | 5 |
| A4 | 4 |

Copy count is not proof of performance.

## Open questions
- Probiotics: fix the ad, or update the label?
- Which discount percentage is correct?
- Source for "1M+" and for 4.8 from 100,000 reviews.
- Full price after the first box, and the cancel steps (R20).
- Is the "Original pouch" the Original Low Sugar 84 packs?
- Who may appear in content?
- The five competitors.

---

## Summary
- **Files written:** all eight.
- **Site:** sprout.example could not be read. Home, about, pricing, FAQ, policies, product, shipping, returns, ingredients and subscription pages are all unread. Brand notes (colours, fonts, pouch, product rules) were named but not attached.
- **Disputed:**
  - Discount: 61% in ads vs 52/55/49/58% on the site.
  - Probiotics: ad vs ingredient list.
  - Rating: 4.8 from 100,000 vs 4.0 from 2,411.
- **Profiles:** four, all grounded in numbered quotes. Sub-lines with no quote are marked `[inferred]` or `[unknown]`.
- **Check-in:** you approved a fact sheet that isn't in this conversation. Only facts backed by the attached files or your answers were carried into the files.

**Gaps**
- MISSING: brand notes file (colours with hex, fonts, pouch description, product rules), owner
- MISSING: logo and font files, owner
- MISSING: Original pouch photos for all five photo jobs, owner or product feed
- MISSING: label or ingredient list with amounts, owner
- MISSING: proof for "1M+" and the 4.8 rating, owner
- MISSING: certificate behind "Third-party tested," owner
- MISSING: one confirmed discount percentage, owner
- MISSING: full price after the $29.99 first box, and text sign-up terms, owner
- MISSING: shipping, returns, guarantee and subscription cancel terms, site or owner
- MISSING: the five confirmed competitors, owner
- MISSING: who may appear in content, owner
- MISSING: name pronunciation, owner
- MISSING: past results with numbers, ad account or store
- MISSING: brand videos and lifestyle photos, owner

## Image slice: Original pouch
- **Product look, pack and printed words:** none on file. Do not draw, generate or guess the pouch, its colours or its text. Wait for photos.
- **How it's used:** one pack a day, grabbed and eaten on the go. [confirmed: ads.md; R15 for the moment]
- **Photo jobs filled:** none.
- **Colours, fonts, logo:** none on file. Do not substitute.
- **Words allowed on the picture** (offer facts only, exactly as written):
  - "$29.99 for your first order" [ads.md main text 1] or "$29.99 first box" [owner]. Confirm which wording you want.
  - "$20 off your first order"
  - "+$5 off for every extra person"
  - "Online-exclusive offer"
- **Not allowed on the picture:**
  - Any % off.
  - "1M+," star ratings, ingredient counts, fiber grams, "third-party tested."
  - "probiotics," "fix," weight loss, GLP-1.
  - Any review quote.
- **Never show:** a powder or shaker as Sprout, medication, before-and-after bodies, invented pack art.

CHECKS MISSED:
- Original pouch has no Looks like, Pack or How it's used lines from photos, and no photo jobs filled (no photos attached).
- Policy lines are `[unknown]`, not quoted (site unreadable).
- The image slice has no pack printed words (no photos).
- Logo and font files are not recorded (not to hand).

**How to load it:** paste `00-start-here.md` into the instructions box of a Claude project, a ChatGPT project or custom GPT, or a Gemini Gem. Add the other seven files as knowledge. For the designer, hand over only the image slice above. After any change, edit the file, add a line to `log.md` and upload it again.

What next? You could fill the gaps with the [Founder interview planner](https://useaiblocks.com/skills/founder-interview-planner), [write the ad copy](https://useaiblocks.com/prompts/fact-based-ad-copy-writer), [understand your buyers](https://useaiblocks.com/skills/customer-buying-reasons-finder), [make video ads](https://useaiblocks.com/skills/video-ad-script-writer-from-customer-quotes), [make an offer people want](https://useaiblocks.com/prompts/hidden-offer-finder) or [write the landing page](https://useaiblocks.com/skills/ad-matched-landing-page-writer). You can also type your own.
```
