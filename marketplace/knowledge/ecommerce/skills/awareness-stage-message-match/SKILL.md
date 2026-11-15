---
name: awareness-stage-message-match
description: "Match every ad, email and page to how much its shoppers already know, from not yet aware of the problem to ready to buy. Works out each traffic source's stage from data (campaign audience, new versus returning visitors, search queries, email segment), diagnoses which pieces speak to the wrong stage or mix stages, then drafts copy per stage with the proof and offer that suit it and pairs each with the right page and email. Sets the creative mix by stage from the store's own sales, not a fixed rule. Use when cold traffic will not convert, when ads, pages and emails feel disconnected, or before planning a new funnel. Read access only."
---

# Awareness stage message match

**You get:** a stage map for each traffic source, a diagnosis of which ads, pages and emails speak to the wrong stage, new drafts written for each stage, and a pairing table that joins ad, page and email.

A shopper who has never thought about the problem needs a different first line than one comparing two products in a cart. Most stores send both to the same page with the same copy. This skill works out each audience's stage from data, finds where the message and the stage disagree, and writes the fix for the ad, the page and the email together.

## When to use

- Cold traffic clicks but does not buy, while retargeting looks fine.
- Ads, landing pages and emails were written by different people and do not join up.
- The store wants to grow beyond people who already know it.
- Before building a new landing page, advertorial or email flow.
- Search ads or SEO pages convert poorly on some queries.

## Not for

- Finding the buyer types and their triggers: use `buyer-decision-map` first.
- Writing a full Meta concept set and test plan: use `store-meta-concepts`.
- Rebuilding the product page itself: use `store-meta-landing`.
- Email deliverability or flow timing: a lifecycle email audit, not this skill.

## What you need

**Required**

- Current copy for each piece in scope: live ads (primary text, headline, first three seconds of video), landing pages, and the email flows (welcome, browse abandon, cart abandon, post-purchase).
- Meta Ads Manager export, last 90 days, at ad set and ad level: campaign, ad set, audience definition (new, engaged, existing customers, or the Advantage+ audience segments), spend, purchases (7-day click), landing page URL.
- GA4 report: landing page by session source and medium, with "New / established" (or new versus returning) users, sessions, and purchases. Filter the conversion metric to purchase only; the default key event rate counts any key event [MEA-0002].
- Google Ads search terms report and Google Search Console queries, last 90 days, if the store runs search or gets organic traffic.
- Klaviyo (or Shopify Email, Omnisend) flow report: flow, recipients, placed order rate, revenue per recipient.
- Product facts and allowed claims from `product-claims-profile`, and gross profit per purchase.

**Optional**

- Quiz answers, post-purchase survey answers, Shopify orders by UTM.

**When something is missing.** Without GA4 or the search reports, infer stage from campaign audience alone and mark the diagnosis "partial: no visitor or query data".

**Access.** Level 1, read. Drafts are delivered as files. Building pages or ads needs draft access; publishing and any spend need the owner's yes.

## Before you start: the gates

1. **Gross profit per purchase is known.** Colder stages cost more per order and pay back later, so the store must know how much a first order can carry. Fail: diagnose only; draft nothing for cold stages.
2. **Cash and capacity for new pages.** Each stage-matched page must be built and kept current. Fail: pair stages with existing pages and change only their first screen.
3. **Tracking can tell stages apart.** Purchases appear by source, campaign and landing page in GA4 or by UTM in Shopify. Fail: fix UTM tagging first; without it the diagnosis is a guess.

## Steps

### 1. Name the five stages in the store's terms

For this product, write one line per stage: **unaware** (has the situation, has not named the problem), **problem-aware** (feels the problem, does not know solutions), **solution-aware** (knows the kind of fix, not this product), **product-aware** (knows this product, not yet convinced), **most aware** (wants it, waiting for the right offer or moment). Use the buyer's own words from `buyer-decision-map`.

### 2. Infer each audience's stage from data

| Signal | Usually means |
|---|---|
| Meta prospecting, existing customers excluded, broad audience | Unaware to solution-aware |
| Meta engaged audience (site visitors, video viewers) | Product-aware |
| Cart or checkout abandoners | Most aware |
| Existing customers | Most aware |
| Search query about the problem or symptom | Problem-aware |
| Query for a kind of product ("best X for Y", "X under 50") | Solution-aware |
| Brand name, "brand reviews", "brand vs" | Product-aware |
| "Brand discount code", brand plus product name | Most aware |
| GA4 new user from social, landing on an article | Unaware or problem-aware |
| Email subscriber who has not bought | Product-aware |
| Quiz answer naming a fix already tried | Solution-aware or later [AVT-0023] |

Meta's audience segments let you read new, engaged and existing customers separately [ADC-0015]. Record each source's share of sessions and of purchases. Use one rule set for edge cases, since sources disagree: product page visitors and subscribers who have not bought are product-aware; cart and checkout abandoners are most aware. Stage comes from behaviour, never from age or gender. Where the data cannot tell, mark the stage "unknown" and test openings for two neighbouring stages rather than defaulting to one. Recheck the map monthly; audiences move down the stages as they see more. Also note the market's stage: in a market that has seen every claim, only a new mechanism or messenger cuts through [ADC-0001].

When copy for colder stages is in scope, read the market's sophistication properly: list the main promise in 5 rival ads. Stage 1, nobody makes the claim, so state it plainly. Stage 2, everyone makes it, so make it more specific within proof. Stage 3, buyers doubt it, so lead with the mechanism. Stage 4, every rival has a mechanism, so sharpen yours. Stage 5, buyers believe none of it, so sell who the buyer becomes. Write one stage above the rivals [MCR-6696].

### 3. Diagnose each piece

For each ad, page and email, read the opening (first line, headline, first three seconds, first screen) and decide which stage it speaks to. Then compare with the stage of the traffic it gets. Mark:

- **Match**, **mismatch** (for example a price-and-offer opening on cold prospecting), or **mixed**: a product-aware image with solution-aware copy fails both groups; one piece should hold one stage or move steadily downward [MCR-0056].
- **Wrong destination:** a curiosity static sent straight to a product page; a curiosity headline needs an educational page, while a fully clear one can go to the product page [MCR-0024].
- **Abrupt jump:** the product appears before the reader has the problem named.

Put the store-side cost per purchase beside each piece so mismatches are ranked by money.

### 4. Draft copy for each stage

For each stage in use, write the opening, the body beats, the proof and the offer. Only claims from `product-claims-profile`.

| Stage | Opening | Proof | Offer | Destination |
|---|---|---|---|---|
| Unaware | A situation they recognise, no product | A relatable story or customer quote | None or soft | Article, advertorial or quiz |
| Problem-aware | The problem in their words, and why it happens | An explanation they can check | Soft | Problem-led page or advertorial |
| Solution-aware | Why this kind of fix beats the others | Comparison, mechanism, ingredient facts | Starter offer | Product page with comparison block |
| Product-aware | The doubt that stops them | Reviews matched to objections, guarantee | Clear offer | Product page |
| Most aware | The offer, restock or deadline | Rating and count | Best offer the margin allows | Product page or cart |

Use the framework and lead that suit each stage:

| Stage | Framework | Lead to start with |
|---|---|---|
| Unaware | A story or a lesson they want, the hidden problem revealed, the kind of fix introduced, a soft ask to learn more | Story, secret, or proclamation (a bold, true claim read like news) |
| Problem-aware | The problem in their words, the consequence they live with, the cause, the kind of fix | Problem and solution, or secret |
| Solution-aware | Why this kind of fix beats the others: the difference, the mechanism, the proof | Promise backed in the next line, or problem and solution |
| Product-aware | The alternatives on one concrete measure, objections answered, the offer | Promise |
| Most aware | The offer and a true reason to act now | Offer |

Each lead needs its material: a secret needs a real, checkable fact; a story needs a real scene from buyers; an offer needs its full terms. Without it, move to the nearest lead the facts support. Each stage needs its own opening, and cost per result rises as copy goes colder [MCR-6692].

Under each draft, add one line: the neighbouring stage it would also suit, and the stage it would fail (usually two steps away), so nobody reuses it on the wrong audience. Deadlines, low-stock lines and countdowns appear only when they are true; invented urgency is a deceptive practice under the FTC Act, the UK's consumer protection law (enforced by the CMA) and the EU's unfair commercial practices rules. Judge early-stage pieces on new-customer cost per purchase over a full week of 7-day click results, not on first-day ROAS; judge most-aware pieces on cost per purchase and order value.

Send cold traffic to an advertorial instead of the product page when the product needs about three minutes of explaining; simple, understood products go straight to the product page [LPG-0004]. Build an advertorial only after an ad to the plain product page shows the angle can roughly break even [LPG-0030]. Route unaware ads to articles or quizzes, persona ads to persona pages and retargeting to product pages when spend per persona justifies a page [LPG-0070].

### 5. Pair each stage with its page and email

- **Page:** order the first screen by traffic: interruption traffic from social gets the problem or education block high, high-intent search traffic gets proof there [LPG-0050]. Carry the winning ad headline into the page headline so the click and the page agree [LPG-0067].
- **Email:** welcome flow for problem and solution-aware subscribers (explain, then prove); browse and cart abandon for product-aware (objections, reviews, then the offer); post-purchase and replenishment for most aware. Split flows first by new, returning and subscriber customers [EML-0053].

### 6. Set the creative mix from the store's own sales

Cards give different splits. For broad-targeted Meta accounts trying to grow past their warm audience, put roughly 80% of new creative in the unaware and problem-aware stages and the rest in later stages [MCR-0057]; a second source says 80% in the first three stages and 20% in the last two [MCR-0011]. Those two agree closely and win for growth. They fail for small accounts and brands with strong outside demand, which still find enough product-aware buyers. So read the store's own data first: if most purchases come from brand search, returning visitors and existing customers, the store is harvesting demand it already has; shift toward early stages step by step, judged on new-customer cost per purchase, not blended ROAS.

### Chat-first and low-trust markets

In markets where buyers live on WhatsApp or other chat apps (much of Latin America, Southern Europe, Africa and Asia), for product-aware and most-aware shoppers who opted in, automated chat journeys far outperformed broadcasts in one large dataset [EML-0048]. Payment safety (pay on delivery where offered, buyer protection), easy returns and delivery promises belong in the product-aware proof block.

## Checks before you hand it over

1. Every piece shows its traffic's stage, the evidence for it, and match, mismatch or mixed.
2. Every draft holds one stage or moves steadily downward.
3. Every draft uses only claims from the claims profile.
4. Every ad draft names its destination page and email flow.
5. Curiosity openings never point straight to a product page; every deadline or stock line is true.
6. GA4 conversion rates are filtered to purchase.
7. The mix recommendation cites the store's own share of purchases by stage.
8. Nothing was published or spent.
9. Every draft's lead suits its stage and has the material it needs.

## Output

1. **One-screen summary first:** each traffic source with its stage and share of purchases, the three costliest mismatches, and the recommended mix.
2. **Stage map table:** source or audience, evidence, stage, share of sessions, share of purchases, store-side cost per purchase.
3. **Diagnosis table:** piece, where it runs, its stage, its traffic's stage, verdict, fix.
4. **Drafts by stage:** ad (primary text, headline, character counts), page first screen (headline, subhead, proof, button), email (subject, preview text, opening, one ask).
5. **Pairing table:** stage, ad, page, email flow.

## Common mistakes

- **Guessing stage from the copy alone.** Step 2 infers it from audience, query and visitor data.
- **One page for every stage.** Step 5 pairs each stage with its page and email.
- **Mixed-stage ads.** Step 3 flags them.
- **A fixed 80/20 rule for every store.** Step 6 starts from the store's own sales.
- **Advertorials before proof.** Step 4 waits for the angle to break even on the product page.
- **Unfiltered GA4 conversion rates.** The inputs filter to purchase.
- **Defaulting to one stage when unsure.** Step 2 marks it unknown and tests two.
- **Fake urgency for the last stage.** Step 4 allows only true deadlines and stock lines.
- **A secret lead with no secret.** Step 4 moves to the nearest lead the facts support.

## Sources

- [MEA-0002]: GA4 key event rate must be filtered to purchase.
- [AVT-0023]: quiz answers naming failed fixes show stage.
- [ADC-0015]: Meta audience segments for new, engaged and existing.
- [ADC-0001]: the market's stage sets the lead.
- [MCR-0056]: one ad, one stage, or move downward.
- [MCR-0024]: curiosity statics need an educational page.
- [LPG-0004]: about three minutes of explaining means an advertorial.
- [LPG-0030]: build the advertorial after a break-even ad.
- [LPG-0070]: route traffic by awareness.
- [LPG-0050]: order page sections by traffic source.
- [LPG-0067]: carry the ad headline into the page.
- [EML-0053]: split flows by new, returning and subscriber.
- [MCR-0057]: about 80% of creative in early stages.
- [MCR-0011]: 80% in stages one to three, 20% later.
- [EML-0048]: WhatsApp journeys beat broadcasts in one large dataset.
- [MCR-6696]: write one stage above the market's sophistication.
- [MCR-6692]: each stage needs its own opening; colder copy costs more per result.

What makes this skill ours: stage comes from audience, query and visitor data instead of a guess; every mismatch is ranked by store-side cost per purchase; the ad, page and email are fixed together as one path; and the stage mix starts from the store's own sales and margin, not a fixed split.

## Selling in India

- The EML-0048 dataset came from Indian stores, so the WhatsApp journey advice is strongest there.
- India's CCPA guidelines on dark patterns also ban invented urgency.
- Cash on delivery belongs in the product-aware proof block.
