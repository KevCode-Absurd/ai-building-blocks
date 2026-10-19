# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The run worked only from the two attached files and the owner's answers, copied every quote and number exactly, tagged everything, and refused to fill the unread site, missing brand notes and photos with guesses. For the owner it is an honest skeleton plus a precise list of what to supply before any image work can start, not a ready-to-design brief.

## Judge list

- Met: Every price in the files matches your price list exactly.
  "$29.99 for your first order, that's less than $1.10/day", "$20 off", "+$5 off", "$94 a month": all word for word from ads.md and R3; full price left [unknown].
- Met: Every fact carries a tag, and every confirmed fact names its page, label or person.
  "[confirmed: live ads main text 1, 4 Oct 2026]", "[confirmed: reviews R7, brand site]", "[confirmed: owner, Oct 2026]"; only derived word lists lack a tag.
- Met: Claims with nothing on file are marked pending, even when they're on your own site.
  "No claim is approved." Table marks "60+ whole-food ingredients", "Third-party tested", "Trusted by 1M+" all Pending.
- Met: Every customer quote is something a real customer wrote, with where it came from. Profiles without quotes say inferred.
  All quotes match R1 to R19 verbatim with source; shares marked "[inferred]"; GLP-1 profile limited to "customer words only".
- Met: Two sources that disagree are both recorded and tagged disputed, never quietly picked.
  "Ads: '61% off'. Site: 52%, 55%, 49% or 58% ... [disputed]"; probiotics vs prebiotic fiber [disputed]; 4.8/100,000 vs 4.0/2,411 [disputed].
- Met: The slice holds only what the next step needs. An image slice has no review quotes and no pending claims.
  Slice has Looks like, Pack, How it's used, Never show, photo jobs, words allowed; "No other claims are approved." No quotes.

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
### `00-start-here.md`

```markdown
# Sprout: start here

## Diagnosis
Buyers arrive already knowing the category: many have tried greens powders or a shelf of separate gummies, and the one who feels the problem most is the long-term gut and regularity sufferer ("normal for the 1st time in 15 years", "chronic IBS"). The biggest gap is that the ads lead with discounts (19 of the 40 newest ads are offer-led, all saying 61% off), while buyers praise finally sticking with a daily habit and quitting powders, and no ad tells either story.

## The business in five lines
- Sprout sells daily nutrition gummies in single packs: "60+ whole-food ingredients, 21 vitamins & minerals ... in one daily gummy pack" [confirmed: live ads main text 1, 4 Oct 2026] (claim pending, see proof-and-claims.md).
- Category: greens and daily nutrition supplements, sold as gummies instead of powder [inferred].
- Ranges seen: Original Low Sugar, Sugar-Free, a cartoon-movie tie-in flavour, and Kids [confirmed: reviews R14, R19, R11, R16, Sept to Oct 2026].
- Live now: $29.99 for the first box, with text sign-up [confirmed: owner, Oct 2026].
- Sold on its own site and through big-box retailer and warehouse club sites [confirmed: reviews.md source notes, Sept to Oct 2026].

## House rules for any AI
- Take claims only from the claims list in proof-and-claims.md. Only claims marked **approved** may appear as fact. None are approved yet.
- Never use anything tagged [inferred], [unknown] or [disputed] as fact in copy.
- Never say: "probiotics" (the ingredient list shows prebiotic fiber and no probiotics), anything about GLP-1 medication as the brand's own claim, "fix", "cure", weight-loss or muscle claims, or any before-and-after result as a promise.
- Never use a discount percentage. The ads say 61% and the site says 52%, 55%, 49% or 58%. Use "$29.99 for your first order" with its text sign-up condition.
- Never invent a review, rating, customer count, colour, font or logo.
- Always: tell a customer result as one buyer's story, quote reviews word for word with their number, and keep colours and fonts in voice-and-look.md only.

## Which file for which task
| Task | Load |
|---|---|
| Planning, angles, briefs | business.md, customers.md, proof-and-claims.md |
| Ad or email copy | offers.md, proof-and-claims.md, customers.md, voice-and-look.md |
| Image or video work | offers.md (truth sheet), voice-and-look.md, proof-and-claims.md |
| Competitor or positioning work | market.md, business.md |
| Anything about results or what's live | log.md |

## How to update
Edit the file, add a dated line at the top of log.md, then upload the changed file again wherever it is loaded.
```

### `business.md`

```markdown
# Business

**One line:** Daily nutrition gummies in single packs, made to replace greens powders and a shelf of separate supplements [inferred, from live ads main texts 1 and 2 and reviews R3 to R6].

**Category:** Greens and daily nutrition supplements, gummy format [inferred].

**Stage:** Established [inferred, from "Trusted by 1M+" (live ads #4, 4 Oct 2026, pending), a claimed 100,000 reviews, and retailer and warehouse club listings].

## Positioning
- **Options buyers weigh:** greens powders (R3, R4), separate probiotic, B12 and multivitamin gummies (R5), eating more vegetables or fiber, or doing nothing [confirmed: reviews R3 to R5, Sept to Oct 2026; options beyond these are inferred].
- **What only Sprout has:** greens-style nutrition in a single gummy pack, "without powders or prep" [confirmed: live ads main text 2, 4 Oct 2026]. Whether any rival offers the same format is [unknown: competitor list, owner].
- **What that gives buyers:** a habit they keep. "[Sprout] has been the one thing I've been able to stick to" [confirmed: reviews R1, Sept to Oct 2026].
- **Who cares most:** people who quit powders and want one daily step, and people with long-running gut or regularity trouble [inferred, from reviews R1 to R10].
- **Category it competes in:** greens powders and daily multivitamins [inferred].

## Story as the site tells it
[unknown: the about page could not be read; the owner can supply it]

## The promise
In the brand's words: "60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack" [confirmed: live ads main text 1, 4 Oct 2026]. The "probiotics" part is [disputed] (see proof-and-claims.md). The rest of the promise is pending.

## How the name is said
[unknown: owner. "Sprout" is a placeholder in the material, so the real name and how to say it are needed]
```

### `offers.md`

```markdown
# Offers

## Price summary
| Item | Price | Source |
|---|---|---|
| First order (live now) | $29.99 for the first box, with text sign-up | [confirmed: owner, Oct 2026] |
| First order, ad wording | "$29.99 for your first order, that's less than $1.10/day" | [confirmed: live ads main text 1, 4 Oct 2026] |
| First order discount | "$20 off your first order" | [confirmed: live ads main text 1, 4 Oct 2026] |
| Extra people | "+$5 off for every extra person" | [confirmed: live ads main text 1, 4 Oct 2026] |
| Discount percentage | Ads: "61% off" / "up to 61% OFF". Site: 52%, 55%, 49% or 58% depending on page | [disputed: live ads #1 to #4 vs site as reported in ads.md, 4 Oct 2026] |
| Gifts | "4 FREE gifts: online exclusive" | [confirmed: live ads #3, 4 Oct 2026] |
| Partner gift | "30 Days Of [a fitness app], Free" | [confirmed: live ads, 4 Oct 2026] |
| Full price after the first order | [unknown: pricing page or owner] | |
| Price cut | "We're Lowering Our Prices 🔥" (the birthday price cut) | [confirmed: live ads #5, 4 Oct 2026]; old and new prices [unknown: owner] |

The offer is online-exclusive [confirmed: live ads main text 1, 4 Oct 2026].

## Subscription and membership
- A subscription exists [confirmed: reviews R14, R17, R20, Sept to Oct 2026].
- Membership perks: "gifts, limited flavours, savings" [confirmed: live ads #11 "Perks That Really Pile Up", 4 Oct 2026].
- Billing interval, what the first price becomes, pause, skip and cancel terms: [unknown: subscription terms page or owner].
- Note: one buyer "tried multiple times to cancel" [confirmed: reviews R20]. The cancel route is needed before any copy mentions how easy it is to cancel.

## Delivery, returns, guarantee
- Delivery cost, free-delivery level, time: [unknown: shipping page or owner]
- Returns window and who pays: [unknown: returns page or owner]
- Guarantee, exact terms: [unknown: owner]

## Products
| Product | What is known | Source |
|---|---|---|
| Original Low Sugar, 84 packs | Name and pack count as shown on the review widget | [confirmed: reviews R14, Sept to Oct 2026] |
| Sugar-Free | Contains sugar alcohols ("worked too well") | [confirmed: reviews R19 and short quote, Sept to Oct 2026] |
| Cartoon-movie tie-in flavour | Limited flavour, also in Sugar-Free | [confirmed: reviews R11, R19] |
| Kids range | Fiber, methylfolate, cartoon tie-in, Raspberry Lemonade launch | [confirmed: live ads #14, #15 and Kids headlines, 4 Oct 2026] |

Prices per product, pack sizes other than 84, and full flavour list: [unknown: product pages or owner]

## Truth sheet: Original pouch

**Kind:** Eaten. Bought once (retailer) or on a plan (subscription) [confirmed: reviews.md source notes, R14]. How long one unit lasts: [unknown: owner; 84 packs at one pack a day would be 84 days, inferred].

**Made of, size, serving**
- Ingredients with amounts: [unknown: label or product page, owner]
- Brand's stated contents: "60+ whole-food ingredients, 21 vitamins & minerals" and "6g of fiber, prebiotics" [confirmed: live ads main texts 1 and 2, 4 Oct 2026] (pending until the label is on file)
- Probiotics: [disputed]. The ad says "probiotics"; the product page ingredient list shows prebiotic fiber and no probiotics [ads.md note, 4 Oct 2026].
- Serving: "one daily gummy pack" [confirmed: live ads main text 1]. Gummies per pack: [unknown: label]
- Pack size: 84 packs (Original Low Sugar) [confirmed: reviews R14]. Whether the pouch holds 84 packs: [unknown: owner]

**Camera facts:** none can be written. No product photos were supplied, and the brand notes covering the pouch were listed but not attached.
- Looks like (gummy shape, own colour, finish, size beside a hand): [unknown: photos]
- Pack (pouch colours, every large printed word and where it sits, versions that look different): [unknown: photos and brand notes, Oct 2026]
- How it's used: tear open a single pack and eat the gummies, no water, shaker or prep [inferred, from "one daily gummy pack" and "without powders or prep"]
- Visible result: nothing changes on camera [inferred]. What can be shown instead: the single step, eaten on the go, with no shaker bottle to wash [inferred].
- Moves and sounds: pack tear, gummies tipped into a hand, pouch set down [all inferred, sounds unheard]
- Never show: powder or a shaker bottle as part of the product; capsules or pills; the word "probiotics"; GLP-1 pens or medication; before-and-after framing; a discount percentage [inferred, from the claims rules]
- Reference photos: none (see photo jobs)

**Photo jobs:** pack front: none. Out of the pack: none. In a hand: none. In use: none. Close-up: none.

## Buyer questions with the brand's answers
| Question | Brand's answer | Source |
|---|---|---|
| Isn't it too expensive? | "'Sprout is too expensive': here's 61% off to prove otherwise" | [confirmed: live ads #1] (percentage disputed) |
| Do I need powders or prep? | "without powders or prep" | [confirmed: live ads main text 2] |
| Is there enough fiber? | "Struggling to Get Enough Fiber?" / "6g of fiber" | [confirmed: live ads #7, main text 2] |
| Which folate is in the Kids range? | "Methylfolate, Not Folic Acid" | [confirmed: live ads #15] |
| Is it tested? | "Third-party tested" | [confirmed: live ads main text 1] (pending) |
```

### `customers.md`

```markdown
# Customers

Ranked by how often the theme shows up in the 20 reviews on file and how strongly people feel it. The sample is small and partly hand-picked by the brand, so share is [inferred].

## 1. The gut and regularity sufferer
**Quotes**
- "My bowel movements are normal for the 1st time in 15 years!" [confirmed: reviews R7, brand site]
- "The prebiotics do their job, but not aggressively ... This is huge for someone who suffers from chronic IBS!" [confirmed: reviews R8, brand site]
- "[Sprout] have been the solution to my problems with regularity." [confirmed: reviews R9, retailer]
- "Feel lighter, less bloated and overall good." [confirmed: reviews R10, retailer]

- **Starts looking:** after years of irregularity, bloating or IBS [confirmed: R7, R8].
- **Pushed by:** long-running discomfort [confirmed: R7, R8].
- **Pulled by:** fiber and prebiotics that work gently ("not aggressively") [confirmed: R8].
- **Nearly stopped by:** the Sugar-Free version's sugar alcohols ("worked too well") [confirmed: short quote, review site].
- **Tried before:** [unknown: survey or support emails]
- **How much they know:** high; they know the word "prebiotics" [confirmed: R8].
- **Words they use:** regularity, bloated, lighter, digestion, IBS, normal.
- **Words that turn them off:** [inferred] aggressive, harsh, "fix".
- **On camera:** a relaxed morning routine, eating one pack with no fuss [inferred].

## 2. The powder quitter who wants a habit that sticks
**Quotes**
- "The issue has never been nutritive content. It's always been an issue of consistency ... [Sprout] has been the one thing I've been able to stick to." [confirmed: reviews R1, brand site]
- "It's wild I WANT to take [Sprout] and don't forget." [confirmed: reviews R2, brand site]
- "even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky." [confirmed: reviews R3, brand site]
- "I've been choking on [a big-name greens powder] for the last few years" [confirmed: reviews R4, brand site]
- "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." [confirmed: reviews R5, brand site]
- "not having to clean a shaker bottle or extra dishes" [confirmed: reviews R6, brand site]

- **Starts looking:** when they keep skipping a powder, or the bill or the taste wears them down [confirmed: R1, R3, R4].
- **Pushed by:** gritty or chalky texture, $94-a-month cost, washing shakers, a crowded supplement shelf [confirmed: R3 to R6].
- **Pulled by:** taste, convenience, one step instead of several [confirmed: R2, R5, R6].
- **Nearly stopped by:** price ("They are expensive", retailer); taste on the first days [confirmed: R18].
- **Tried before:** big-name greens powders, separate gummies [confirmed: R3 to R5].
- **How much they know:** high; they compare products and prices [confirmed: R1, R3].
- **Words they use:** stick to, consistency, gritty, chalky, choking, shaker bottle, easier to manage.
- **Words that turn them off:** chalky, gritty, prep [confirmed as complaints in R3, R6].
- **On camera:** pushing a shaker bottle aside and tearing open one pack [inferred].

## 3. The busy parent buying for the family
**Quotes**
- "So easy to grab and eat on my way to the billion things I have to do as a mom." [confirmed: reviews R15, brand site]
- "I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat." [confirmed: reviews R16, brand site Kids page]
- "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived. We quickly decided to resubscribe" [confirmed: reviews R17, brand site]

- **Starts looking:** when kids refuse vegetables or other greens products [confirmed: R16].
- **Pushed by:** picky eaters, no time [confirmed: R15, R16].
- **Pulled by:** kids treat it as a treat; grab-and-go [confirmed: R15, R16].
- **Nearly stopped by:** fear of subscription traps [confirmed: R17].
- **Tried before:** "all of the 'green' options for the kids" [confirmed: R16].
- **How much they know:** medium to high; the brand targets label-readers ("Methylfolate, Not Folic Acid") [inferred].
- **Words they use:** easy, grab, treat, love, mom.
- **Words that turn them off:** trap, subscription [confirmed: R17].
- **On camera:** handing a pack to a child on the way out the door [inferred].

## 4. The GLP-1 medication user
Customers may say this; the brand may not repeat it as its own claim.
**Quotes**
- "I've been on a glp1 for about a year now and was always constipated not anymore" [confirmed: reviews R11, brand site widget]
- "I'm on Glp-1 and they definitely help with the vitamin loss you get! Glad I have a subscription!" [confirmed: reviews R14, brand site widget]

- **Starts looking:** constipation or worry about nutrition while on the medication [confirmed: R11, R14].
- **Pushed by:** constipation, "vitamin loss" [confirmed: R11, R14].
- **Pulled by:** taste, energy, gut and sleep changes they noticed [confirmed: R14].
- **Nearly stopped by:** [unknown: support emails]
- **Tried before:** [unknown]
- **How much they know:** medium; they name their own needs [inferred].
- **Words they use:** glp1, constipated, vitamin loss, energy, gut health.
- **Words that turn them off:** [unknown]
- **On camera:** not for brand content; the brand should not target this buyer on medication claims [confirmed: reviews.md notes].

## Taste and energy (theme, not a separate buyer)
- "[Sprout] literally tastes like fruit snacks I ate as a kid." [confirmed: R12]
- "clean feeling energy and mental focus ... without the sugar crash" [confirmed: R13]
- Against: "tasted terrible, but after the third day they started tasting better" [confirmed: R18]; "the taste is off." [confirmed: R19, tie-in Sugar-Free]
```

### `proof-and-claims.md`

```markdown
# Proof and claims

No claim is approved. No test result, certificate, review export or customer count is on file.

| Claim as written | Status | Proof on file | Source and date | How it may be shown |
|---|---|---|---|---|
| "60+ whole-food ingredients" | Pending | None | live ads main text 1, 4 Oct 2026 | Not as fact until the label is on file |
| "21 vitamins & minerals" | Pending | None | live ads main text 1, 4 Oct 2026 | Not as fact until the label is on file |
| "6g of fiber" / "6 g prebiotic fiber" | Pending | None | live ads main text 2, ads #7, 4 Oct 2026 | Not as fact until the label is on file |
| "gut-supporting probiotics" | Banned | Contradicted: the product page ingredient list shows prebiotic fiber and no probiotics | live ads main text 1 vs ads.md note, 4 Oct 2026 | Never. Flagged in the material as an error |
| "Third-party tested" | Pending | None | live ads main text 1, 4 Oct 2026 | Not until the lab and test are named |
| "Trusted by 1M+" | Pending | None (owner skipped) | live ads #4, 4 Oct 2026 | Not until a source is on file |
| 4.8 stars from 100,000 reviews | Pending, [disputed] | None. A public review site shows 4.0 from 2,411 | reviews.md, Sept to Oct 2026 | Neither number, until a review export is on file |
| "61% off" | [disputed] | Site shows 52%, 55%, 49% or 58% | live ads #1 to #4 vs site, as reported in ads.md, 4 Oct 2026 | Not used. Use the $29.99 first-order price instead |
| "$29.99 for your first order" | Offer fact | Owner confirms it is live, with text sign-up | owner, Oct 2026; live ads main text 1 | May be shown with the text sign-up condition |
| "less than $1.10/day" | Pending | Depends on the full price and pack count [unknown] | live ads main text 1, 4 Oct 2026 | Not until the maths is on file |
| "Fix the Hot Girl Tummy" | Pending, flagged risky ("Fix") | None | live ads #6, 4 Oct 2026 | Not in new work |
| "Support Muscle While You Lose Weight" | Pending, flagged risky, no evidence | None | live ads #9, 4 Oct 2026 | Not in new work |
| "Perfect Supplement for Weight Loss Support" | Pending, flagged risky | None | live ads, 4 Oct 2026 | Not in new work |
| "Nutrition for Healthy Hair" | Pending | None | live ads #8, 4 Oct 2026 | Not until evidence is on file |
| "Methylfolate, Not Folic Acid" (Kids) | Pending | None | live ads #15, 4 Oct 2026 | Not until the Kids label is on file |
| GLP-1 help (from R11, R14) | Banned as a brand claim | Customer words only | reviews.md notes, Sept to Oct 2026 | Only as a quoted customer, never as the brand's claim |
| "normal for the 1st time in 15 years" (R7) | Banned as a promise | One buyer's words | reviews.md notes, Sept to Oct 2026 | Only as one buyer's story, quoted, never as a result to expect |

**The guarantee:** [unknown: owner]
**Awards and press:** [unknown: owner]
```

### `voice-and-look.md`

```markdown
# Voice and look

## Voice (from live ad lines; site copy not read)
- **Casual, not clinical:** "Nutrition Made Ridiculously Easy" [confirmed: live ads, 4 Oct 2026]
- **Cheeky, not prim:** "One pack a day keeps the gut happy 💩" [confirmed: live ads, Kids, 4 Oct 2026]
- **Says the buyer's objection out loud, not around it:** "'Sprout is too expensive': here's 61% off to prove otherwise" [confirmed: live ads #1, 4 Oct 2026] (the percentage is disputed; the pattern is what counts)
- **Story-led, not spec-led:** "He Asked What Day It Was. I Handed Him a Gummy." [confirmed: live ads #13, 4 Oct 2026]

**Scales** [inferred, from the lines above]: casual (not formal); light and funny (not serious); cheeky (not respectful); upbeat and excited, with emoji (not calm).

**Tone by situation**
- Selling: plain offer plus a buyer's own objection, emoji allowed [confirmed: live ads #1 to #5].
- Explaining: short ingredient hooks ("Methylfolate, Not Folic Acid") [confirmed: live ads #15].
- Saying sorry: [unknown: support emails or owner]

**Words to use:** easy, daily, one pack, gummy, without powders or prep [confirmed: live ads main texts].
**Words to avoid:** probiotics, fix, cure, weight loss, any discount percentage, GLP-1 [confirmed: proof-and-claims.md]; chalky, gritty, trap [inferred, buyer complaints].

## Look
The brand notes (Oct 2026) that cover colours, fonts and the pouch were listed but not attached, and the site could not be read.
- Colours with hex and job: [unknown: brand notes, Oct 2026]
- Fonts and job: [unknown: brand notes, Oct 2026]
- Logo file: [unknown: owner, not to hand]
- Font files: [unknown: owner, not to hand]
- Product's real colours (gummies, pouch): [unknown: product photos]
- Image style, do and don't: [unknown: lifestyle photos]
- Brand world (places, surfaces, light, who appears, what never appears): [unknown: lifestyle photos]. Who may appear: [unknown: owner, skipped]
- Motion and sound: [unknown: no videos watched]
```

### `market.md`

```markdown
# Market

## Options buyers weigh
- Greens powders, including "a big-name greens powder" at "$94 a month" even with a subscription discount [confirmed: reviews R3, R4, Sept to Oct 2026]
- Separate probiotic, B12 and multivitamin gummies [confirmed: reviews R5]
- Other "green" options for kids [confirmed: reviews R16]
- Eating vegetables or fiber foods ("The veggies they won't eat") [confirmed: live ads Kids headline, 4 Oct 2026]
- Doing nothing [inferred]

## Competitors
The owner confirmed a list of five competitors, but the list is not in the attached material. Names are not filled in here to avoid guessing.

| Who | Address | Pitch | Price range | Strength | Gap |
|---|---|---|---|---|---|
| A big-name greens powder (name swapped in reviews) | [unknown] | [unknown] | "$94 a month" with subscription discount [confirmed: R3] | Big name [confirmed: R3, R4] | Texture: "gritty/chalky", "choking" [confirmed: R3, R4] |
| Competitors 2 to 5 | [unknown: owner's confirmed list] | [unknown] | [unknown] | [unknown] | [unknown] |

## Open ground
- The "I finally stuck with it" story and the "I quit powders" story are the two strongest review themes, and no live ad tells them [confirmed: ads.md, 4 Oct 2026]. Whether rivals tell them is [unknown: competitor list].
```

### `log.md`

```markdown
# Log (newest first)

## Recent changes
- 4 Oct 2026: Live now: $29.99 first box with text sign-up [confirmed: owner, Oct 2026].
- 2 Oct 2026: Six new hair ads ("Nutrition for Healthy Hair") made [confirmed: live ads #8].
- Around 30 Sept to 4 Oct 2026: Birthday price cut, "We're Lowering Our Prices 🔥" [confirmed: live ads #5]; Raspberry Lemonade Kids launch, "The Lemon Aid Stand is open. 🍋" [confirmed: live ads]; partner gift "30 Days Of [a fitness app], Free" [confirmed: live ads].

## Decisions
- Oct 2026: Owner confirmed the fact sheet and the list of five competitors. The competitor list itself is not in the material.
- Oct 2026: "probiotics" marked banned until the ingredient list and the ad agree.
- Oct 2026: Discount percentages kept out of new work because ads and site disagree. Turned down: picking one figure.

## Results
No numbers on file (owner: none).
| What | Grade | Result |
|---|---|---|
| Ad #1 "'Sprout is too expensive'..." (15+ copies, most in account) | Seen running | [unknown] |
| Ad #3 "Get up to 61% OFF + 4 FREE gifts" (10 copies) | Seen running | [unknown] |
| Ad #2 "Don't Pay Full Price..." (8+ copies) | Seen running | [unknown] |
| Ad #11 "Perks That Really Pile Up" (7 copies) | Seen running | [unknown] |
| Ad #8 hair (6 copies) | Seen running | [unknown] |
| Ad #6 "Fix the Hot Girl Tummy" (5 copies) | Seen running | [unknown] |
| Ads #4, #5, #9, #10, #12, #13 (1 to 4 copies each) | Seen running | [unknown] |
| Mix of 40 newest ads: 19 offer, 7 perks, 6 hair, 3 habit or story, 2 gut, 2 limited flavour, 1 weight loss | Seen running | [unknown] |
| Ratings: brand 4.8 from 100,000; review site 4.0 from 2,411 | Reported | [disputed] |

## Open questions
- What is the full price after the first order, and the subscription interval?
- How do customers cancel, and what does the cancel route look like (R20)?
- What does the label say: ingredients with amounts, fiber, probiotics or not?
- Which discount percentage is current, if any?
- Who are the five confirmed competitors?
- Source for "1M+" and the 4.8 rating?
- What is the real brand name, and how is it said?
```

---

**Summary**

- **Files written:** all eight. The website could not be read and no pages were pasted, so everything comes from the two attached files and the owner's answers.
- **Disputed facts:** discount percentage (ads 61% vs site 52/55/49/58%); "probiotics" (ad vs ingredient list); star rating (4.8 from 100,000 vs 4.0 from 2,411).
- **Buyer profiles:** four are grounded in quotes: gut sufferer, powder quitter, busy parent, and GLP-1 user (customer words only).

MISSING: brand notes, Oct 2026 (colours, fonts, pouch, product rules). Listed but not attached. Owner.
MISSING: website pages (home, about, pricing, FAQ, policies, product, subscription terms, shipping and returns). Owner can paste them.
MISSING: product photos of the Original pouch for all five photo jobs (pack front, out of the pack, in a hand, in use, close-up). Owner. A phone photo on a plain table is enough.
MISSING: logo file and font files. Owner.
MISSING: Original label (ingredients with amounts, gummies per pack, pack count per pouch). Owner or supplier.
MISSING: full price, subscription interval, pause, skip and cancel terms. Owner.
MISSING: delivery, returns and guarantee terms. Owner.
MISSING: source for "Trusted by 1M+" and the 4.8 from 100,000 rating. Owner.
MISSING: "third-party tested" lab and test results. Owner.
MISSING: names and addresses of the five confirmed competitors. Owner.
MISSING: who may appear in content. Owner.
MISSING: ad results with numbers. Owner or ad account.
MISSING: real brand name and pronunciation. Owner.
MISSING: about-page story. Owner.

---

**Slice: image work, Original pouch**

This slice is not ready to design from. Without the pouch photos and the brand notes, a designer or image tool will guess at the product and the pack.

- **Product:** Sprout Original, daily nutrition gummies in single packs.
- **Looks like:** not on file. Gummy shape, colour and size are needed from photos.
- **Pack:** not on file. Pouch colours, printed words and their positions are needed from photos and the brand notes.
- **How it's used:** tear open one pack and eat the gummies, with no water, shaker or prep.
- **Never show:**
  - powder or a shaker bottle as part of the product
  - capsules or pills
  - medication or injection pens
  - before-and-after framing
  - the word "probiotics"
  - any discount percentage
- **Colours, fonts, logo:** not on file. Do not substitute stand-ins.
- **Photo jobs filled:** none.
- **Words allowed on the picture:**
  - "Sprout"
  - "$29.99 for your first order", shown with the text sign-up condition. The exact condition wording is to be confirmed by the owner.
- **No other claims are approved.**

---

**How to load it:** Paste `00-start-here.md` into the instructions box of a Claude project, a ChatGPT project or custom GPT, or a Gemini Gem, and add the other seven files as knowledge (a Gem takes up to 10 files). In a plain chat, attach the start file plus the files the task needs, or just the slice. Uploaded copies don't update themselves unless the file is a Google Doc linked to a Gem. After a change, edit the file, add a line to `log.md` and upload it again.
```
