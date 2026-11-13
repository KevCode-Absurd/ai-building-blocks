---
name: creative-gap-map
description: "A one-off deep dive when a store's ad results stall: map every creative direction the account has really tested against everything it has not, across buyer wants, buyer types, hook types, awareness stages, formats, products and rivals' lanes. Pulls the tested list from the ad account's own history, counts a lane as tested only after enough spend to judge it, separates lost from under-tested, takes buyer wants and buyer types from the store's own reviews and surveys instead of a stock list, compares each product's ad spend with its share of gross profit, scores untested lanes by buyer size, gross profit per purchase, proof held and policy risk, and ends with five fully briefed concepts and a money-ranked gap list. Read access only."
---

# Creative gap map for an online store

**You get:** a one-off map of what the ad account has and has not tested, lane scores, five brief cards, the top ten gaps and a revival list, saved as a dated gap map file and concept history.

## When to use

- Store cost per purchase has risen for four weeks or more and new ads are not fixing it.
- The team says "we have tried everything" and nobody can show the list.
- One buyer type, angle or product has carried the account for months.
- Before a quarterly creative plan, a new agency or a creator programme.
- After a large spend increase, when the first buyer group looks used up [MCR-0038].

## Not for

- The standing grid reused before every batch: use `creative-gap-grid`; this skill is the deep dive behind it.
- The weekly cycle of briefs and test slots: use `weekly-creative-sprint`.
- Clusters of near-identical live ads: use `ad-lookalike-clusters`.
- Rivals' ads in detail: use `store-meta-competitor`, then bring its gap table here.

## What you need

Required:

1. **Ad history from the account**, ad level, last 12 months or lifetime: Ad ID, Ad name, Ad set, Campaign, Date created, Amount spent, Purchases (7-day click), Impressions, Frequency, and creative text (primary text, headline, link) from export columns or previews. The Marketing API can pull the same in one go; optional.
2. **Store orders** for the period, with `utm_content` (ad ID) where tagged, or the order export with Created at, Total, Lineitem sku, Customer type.
3. **Money line per product:** gross profit per purchase (GPP), target cost per purchase (CPP), stock, from `store-meta-math`.
4. **Buyer evidence:** reviews export (rating, body, date), post-purchase survey answers, and if available support emails, ad comments, quiz answers, creator or affiliate sales by code.

Optional: `store-meta-competitor` output; the store profile from `store-meta-brand-dna`.

Missing 1: use the history that exists and state the months covered. Missing 4: read at least 100 reviews by hand and mark buyer sizes "estimated" [AVT-0007].

**Access:** level 1 (read). Nothing changes in the account, and the store's brand files are not updated without the owner's yes.

## Before you start: the gates

1. **Money.** *Pass:* GPP for every product in the history. *Fail:* map lanes but do not score or rank them.
2. **Volume.** *Pass:* about 30 or more ads with spend. *Fail:* element patterns are noise [MCR-0051]; skip to step 6 and brief from research, saying so.
3. **Tracking.** *Pass:* Meta 7-day click purchases do not exceed store orders. *Fail:* won or lost calls use store orders only.
4. **Cash and capacity.** *Pass:* the owner says how many new concepts next month can fund. *Fail:* brief five and let them choose.

## Steps

### 1. Pull and tag every ad

Tag each ad on one fixed set of fields [MCR-0051]: product, buyer type, buyer want, angle, offer, proof type, format, awareness stage, hook type (question, bold claim, call-out, story, myth-bust, demonstration, review, problem list). An AI pass can tag from text and thumbnails; a person checks a random 10% and fixes the rules if more than 1 in 10 is wrong (practitioner default, test it). Colour or pose changes are the same concept [MCR-0022].

### 2. Decide what was really tested

Group ads into concepts (product, buyer, angle, offer). Per concept:

- **Tested:** spend reached 3x target CPP [ADC-0039].
- **Won:** store CPP at or under target at that spend.
- **Lost:** 0 or 1 purchases at 3x, or store CPP above 1.5x target at 5x (practitioner default, test it).
- **Under-tested:** never reached 3x. Not a loss; candidates for revival [ADC-0031].

Under campaign budgets a few ads take most spend [ADC-0014], so many "tried" ideas never got a fair look. Then write three to four lines each on what worked and what did not, as patterns ("named-reviewer statics beat creator video for this store"), never as ad names.

### 3. Build buyer wants and buyer types from evidence

Do not use a stock list of human desires. From reviews, survey answers, support emails, ad comments and creator sales, list:

- **Wants** buyers name in their own words, grouped into 5 to 10 (save time, stop a pain, look good to someone, protect a child, feel in control, give a good gift).
- **Buyer types** as outcome x person x situation [MCR-0050], each with its evidence count. Self-identifying phrases that repeat ("as a nurse") mark a group [AVT-0016]; buyers who already paid for failed fixes buy fastest [AVT-0009].

Name each buyer type plainly ("night-shift nurse, sore feet"), with the share of reviews or answers that mention it.

### 4. Build the coverage tables

| Table | Rows | Cells |
|---|---|---|
| Wants | Each want | Tested, partly tested (what part), not tested |
| Buyer x angle | Buyer types by angle | Tested / won / lost / under-tested, spend share |
| Stage x format | Awareness stage by format | Same |
| Hook types | Each hook type | Tested or not, best example |
| Formats | Static, video, carousel, catalog, partnership, advertorial or quiz destination | Proven, live but under target, briefed not live, never tried |
| Products | Every product or family | Ad spend share, gross profit share, stock days, verdict |
| Rival lanes | From `store-meta-competitor` | What rivals lean on that the store has not tried; what nobody does that the store can prove |

On products, flag any product whose share of ad spend is far below its share of gross profit and has stock; that gap is often worth more than a new angle. On stages, an account mostly in product-aware ads stays warm and frequency climbs [MCR-0057].

### 5. List and score untested lanes

Candidates come from the tables plus market stage: in a crowded market, a new buyer or a new reason it works beats louder claims [ADC-0001]; one ad per real objection [MCR-0043] [MCR-0044].

| Factor | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Buyer size | Under 2% of evidence | 2 to 5% | 5 to 15% | Over 15% |
| GPP of the product | Below median | Median | Above median | Top |
| Proof held | None | One quote | Several quotes or a test | Counted reviews, test, creator video with rights |
| Policy risk | Blocked | High | Some | None |

Score = sum. Any 0 on proof or policy drops the lane. Size bands are practitioner defaults; test them. For a product much like a bigger rival's, an unserved buyer beats a new mechanism claim [AVT-0014]; a narrow buyer can lead when the product is not clearly better [AVT-0012], but only if creative, page and proof all speak to it [AVT-0015].

### 6. Brief five concepts

Pick the top five scores, each on a different want, stage and buyer type where possible. Each brief: concept key, product, GPP, target CPP, buyer type, want, doubt to overcome, awareness stage, hook type, format, proof row, three headline options of 4 to 7 words, opening lines for the first 5 seconds written for that buyer, destination page, test budget (3x target CPP), read rule, and one line on what has never been tried here and why it opens a new lane.

### 7. Rank the top ten gaps by money

Gap, evidence, product GPP, buyer size, the monthly gross profit the store could reach if one concept in that lane hits target (target purchases per month x GPP, stated as a planning figure), and the first action.

## Checks before you hand it over

1. The tested list came from the account export, with months covered stated.
2. Every concept is tested, won, lost or under-tested at 3x target CPP.
3. Wants and buyer types cite their evidence counts; none is invented.
4. The product table compares spend share with gross profit share.
5. Every scored lane shows four factor scores; none briefed has a 0 on proof or policy.
6. The five briefs differ on want, stage or buyer.
7. Brand files are not edited without a yes.

## Output

1. **One-screen summary:** months and ads covered, tested versus under-tested, the biggest gap with its money figure, the concept to run first.
2. **Coverage tables** from step 4.
3. **What worked, what did not** as patterns.
4. **Lane scores:** Lane, Buyer size, GPP, Proof, Policy, Score, Evidence.
5. **Five brief cards** per step 6.
6. **Top ten gaps** per step 7.
7. **Revival list** of under-tested concepts.

Save as `GAP-MAP-<date>.md` and `concept-history.csv`.

## Common mistakes

- **Building the tested list from memory or a notes file.** Step 1 pulls it from the account.
- **Counting a two-day, $40 ad as tested.** Step 2 requires 3x target CPP.
- **Inventing cute personas.** Step 3 builds buyer types from counted evidence.
- **Ignoring products the ads never sell.** Step 4 compares spend with gross profit share.
- **Filling gaps the store cannot prove.** Step 5 drops lanes with no proof.
- **Ranking gaps by how empty they look.** Step 7 ranks by money.

## Sources

- ADC-0001: match the lead to market stage.
- ADC-0014: a few ads take most spend under campaign budgets.
- ADC-0031: ads with no spend can still win.
- ADC-0039: judge at 3x and 5x target CPA.
- AVT-0007: read reviews by hand to keep buyer words.
- AVT-0009: buyers who paid for failed fixes are highest intent.
- AVT-0012: start narrow without a clearly better product.
- AVT-0014: an unserved buyer beats a new mechanism for parity products.
- AVT-0015: a niche buyer needs creative, page and proof to match.
- AVT-0016: self-identifying review phrases mark segments.
- MCR-0022: colour or pose is not a new concept.
- MCR-0038: open new buyers by problem at a plateau.
- MCR-0043: one ad per real objection.
- MCR-0044: write for the very top and the very bottom.
- MCR-0050: segments are outcome x person x facet.
- MCR-0051: tag every ad on the same fields.
- MCR-0057: awareness mix and warm accounts.

What makes this skill ours: the tested list comes from the ad account and only counts after 3x target cost per purchase; buyer wants and types are counted from the store's own reviews and surveys rather than a stock list; products are checked for ad spend against their share of gross profit; and lanes and gaps are ranked by gross profit per purchase, buyer size and proof, with unprovable lanes dropped.
