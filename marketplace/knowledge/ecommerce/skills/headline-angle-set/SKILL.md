---
name: headline-angle-set
description: "Write five truly different headlines for one ad concept (benefit, curiosity, question, call-out, contrarian), each built from the store's approved facts and real customer words, cut to fit Meta, Google Search, Shopping and TikTok limits with character counts, and checked against category claim rules. Picks the pair to test first from the buyer's awareness stage, sizes the test from the store's target cost per purchase, reads the winner on store orders, and says what the result teaches for the next round. Use when a concept is chosen and the wording is the open question, or a Google ad or landing page needs headlines."
---

# Headline angle set for one concept

**You get:** five truly different headlines for one concept with character counts for Meta, Google, Shopping and TikTok, a list of struck lines, an optional Google pack and a test plan for the first pair.

Five headlines that each make a different kind of promise, so a test tells the store what kind of framing its buyers answer to, not just which synonym won. Every word traces to a fact the store can prove or a phrase a customer used.

## When to use

- A concept is chosen (product, buyer group, angle, offer) and the store wants to know which framing sells it.
- A Google responsive search ad needs a real spread of headlines instead of ten near-copies.
- A Meta ad's wording has tired and the image or video still works.
- A new category or product, where nobody knows yet which framing lands.

## Not for

- Full copy sets with body text and calls to action: use `ad-copy-test-sets`.
- Choosing the concept itself: use `store-meta-concepts`.
- Rewriting the landing page: use `store-meta-landing`.
- A sized experiment with holdouts: use `store-meta-test`.

## What you need

**Required**

- The concept: product SKU, buyer group, angle, offer, destination URL, and the buyer's awareness stage (unaware, problem-aware, solution-aware, product-aware, ready to buy). If the stage is unknown, take it from the destination: an article or quiz implies problem-aware, a product page solution- or product-aware. Say which you assumed.
- A facts file: each claim the store may make, with source and date. If none exists, build it from the live product and policy pages today and mark it low confidence.
- Customer words: reviews CSV (rating, title, body, date) or 20 pasted reviews.
- Gross profit per purchase and target cost per purchase for the SKU.
- Placements: Meta feed, Reels or Stories; Google Search; Shopping; TikTok; landing page.

**Optional**

- Meta export by ad, last 90 days: ad name, headline, impressions, CTR (link), purchases, cost per purchase. Google asset report: asset, performance label, impressions.

**Access.** Level 1, read. Loading paused drafts needs level 2 and a yes. Nothing goes live from this skill.

## Before you start: the gates

1. **Money known.** Gross profit per purchase and target cost per purchase exist; an offer headline has its break-even recomputed at the discount. Fail: run `store-meta-math` first.
2. **Cash for the test.** Each headline tested needs about 3 times target cost per purchase [ADC-0039]. Fail: test fewer headlines, never thinner budgets.
3. **Claims file exists.** Fail: write only benefit and call-out headlines from the live page and list the missing proof.
4. **Tracking can read the test.** Meta purchases over 30 days within about 20% of Shopify paid-social orders (practitioner default, test it). Fail: read from Shopify with a UTM per ad.

## Steps

### 1. Freeze everything but the headline

Same image or video, body, offer and page. Only then does a result say something about the words [MCR-0080].

### 2. Fix the stage and the destination

Keep every headline on one awareness stage; mixing stages fails both groups [MCR-0056]. A curious headline needs a page that explains; a clear one can go to the product page [MCR-0019] [MCR-0024].

### 3. Mine the raw material

Copy exact review phrases about the before, the result, the doubt and the moment they decided, with date and rating [AVT-0007].

### 4. Write two drafts for each approach, keep the stronger

| Approach | Job | Rule |
|---|---|---|
| Benefit | Names the result in buyer words | One concrete result with a number or detail from the facts file; a vague benefit ("feel your best") fails |
| Curiosity | Opens a gap the page closes | The page must pay it off; still name the buyer or category so it filters [MCR-0026] |
| Question | Asks something the right buyer answers yes to | A no from the wrong buyer is fine; never ask about a health condition or body trait |
| Call-out | Names the buyer by situation or habit | Naming the segment in copy can replace interest targeting [ADC-0032]; specific beats broad; no personal traits (Meta personal attributes policy) |
| Contrarian | Challenges a habit in the category | Needs a provable fact; no "it's not X, it's Y" pattern [MCR-0016] |

If an approach does not fit the stage, write a second proof-led or offer-led headline in its place and say so; never pad with a copy of another approach. An offer headline uses a real deadline or stock count only.

Keep the stronger draft: the one with a concrete noun, a number from the facts file, or a customer phrase. Put the word that matters in the first two or three words.

Pain-led openings are the default many writers reach for, but in crowded categories every rival names the same pain; open with curiosity, proof or a promise instead [LPG-0045]. Use pain only when it is specific to this buyer group and the store holds proof for the fix.

**Banned:** launch openers ("Introducing", "Meet", "The new"), stock hype words (game-changer, revolutionary, unlock), all-caps sentences, more than one exclamation mark on Meta and none in Google headlines (Google's editorial policy).

### 5. Fit each headline to every placement

Count characters with a script and show the count.

| Placement | Write to | Note |
|---|---|---|
| Meta headline | about 27 characters | Meta's recommendation, not a hard cap; truncation varies by placement |
| Meta primary text, first line | about 125 characters before "See more" | |
| Google search headline | 30 characters | Description 90, path 15 |
| Google Shopping title | 150 characters | Searched attributes in the first about 70 [GAD-0009] |
| TikTok ad text | 100 characters | Check the current spec |
| Landing page H1 | under about 10 words | Practitioner default, test it |

Write a short and a long version where limits differ. Non-Latin scripts can count differently; check in the platform preview.

### 6. Run the claims pass

Strike any headline that: uses "best" or "number one" without a dated ranking; changes a number from its source; uses cure, treat, heal or a disease name for a product not approved for it (US: FTC substantiation; UK: the CAP code and ASA; EU: health claims rules; elsewhere: your market's ad rules); names an expert, lab or press outlet the store cannot document; or compares with a named rival without a current, checkable fact. This is general practice, not a legal ruling.

### 7. Choose the pair to test first

| Buyer stage | Test first |
|---|---|
| Unaware or problem-aware | Curiosity and call-out |
| Solution-aware | Benefit and question |
| Product-aware | Contrarian and call-out |
| Ready to buy | Benefit and an offer line with a real deadline |

Number of headlines the budget funds = test cash / (3 x target cost per purchase) [ADC-0039]. At budgets under about $1,000 a day per concept, test 2 to 4 at once [MCR-0013]; large accounts can run many more and copy the winner to the page [LPG-0067]. The small-budget rule wins at store scale because each variant must reach purchases to be judged. Google: load 8 headlines and 2 descriptions so combinations get traffic [GAD-0052].

### 8. Read and learn

- Read at ad set level on 7-day click, over 7 days or more at low spend [ADC-0059] [ADC-0064].
- High CTR with few purchases is not a win [MCR-0029]. Store orders decide when Meta and Shopify disagree.
- What a win suggests: benefit, buyers trust the claim; curiosity, they want to be taught; question, they feel the problem unsolved; call-out, they want to be recognised; contrarian, they distrust the category. Treat it as a lead for the next round, and confirm it with a second test before changing all creative.
- The winner is the first candidate for the page headline, tested above the fold first [LPG-0016].

## Checks before you hand it over

1. Five headlines on five approaches, or a named substitute; no two share the same promise and proof.
2. Every claim maps to a facts row with source and date; struck lines are listed.
3. Every line shows its character count and fits its placements.
4. No headline implies a viewer's health, body, money or other personal trait.
5. All headlines sit on one awareness stage that suits the destination.
6. Headlines tested fit the test cash at 3 times target cost per purchase each.
7. Nothing is live; paused drafts only with a yes.
8. A plain one-pass list from the brief would not beat this set on proof or spread.

## Output

1. **One-screen summary:** concept, stage, the pair to test first and why, how many the budget funds, read date.
2. **Headline table:** approach, headline, characters, short version, characters, claim, facts row, customer phrase, placements.
3. **Struck lines:** headline, claim, reason.
4. **Google pack (if used):** 8 headlines, 2 descriptions, 2 paths, counts.
5. **Test plan:** variant, ad set, daily budget, start, read date, keep or cut rule, store-side check.
6. **Assumptions:** one line each, at most three, only where an unknown changes what to do. A claim with no proof on file is left out, not listed.

## Common mistakes

- **Five synonyms, not five approaches.** Step 4 gives each its own job.
- **A number nobody can source.** Step 6 strikes it.
- **Curiosity headline sent to a product page.** Step 2 matches destination.
- **More variants than the budget can judge.** Step 7 divides test cash.
- **Winner picked on CTR.** Step 8 reads purchases and store orders.
- **Rewriting all creative after one test.** Step 8 asks for a second read.

## Sources

- [ADC-0039]: judge after 3x target cost per purchase.
- [MCR-0080]: test angles by changing only the headline.
- [MCR-0056]: one awareness stage per ad.
- [MCR-0019]: statics are clear or deliberately curious.
- [MCR-0024]: curiosity statics go to an educational page.
- [AVT-0007]: paste exact customer quotes.
- [MCR-0026]: a hook must filter for buyers.
- [ADC-0032]: name the segment in copy.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [LPG-0045]: open with curiosity, proof and promise.
- [GAD-0009]: searched attributes first in Shopping titles.
- [MCR-0013]: 2 to 4 variants per body at modest budgets.
- [LPG-0067]: large tests copy the winning headline to the page.
- [GAD-0052]: 8 headlines and 2 descriptions.
- [ADC-0059]: judge at ad set level.
- [ADC-0064]: read over 7 days at low spend.
- [MCR-0029]: high CTR can be a false winner.
- [LPG-0016]: test the page headline first.

What makes this skill ours: the number of headlines comes from test cash and target cost per purchase; every line must match a dated facts row and a real customer phrase; the first pair is chosen from the buyer's stage; and the winner is read on store orders, never CTR.

## Selling in India

- Health headlines must also pass the Drugs and Magic Remedies Act and the ASCI code: no cure, treat or disease words for products not approved for them.
