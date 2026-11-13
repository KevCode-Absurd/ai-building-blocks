---
name: creative-gap-grid
description: "Keep the store's standing creative plan: a grid of buyer type, awareness stage and selling theme that every new ad is named into, so each batch fills an untested or under-fed cell instead of repeating what runs. Before each batch it updates cell status from store-side results, scores open cells by the gross profit per purchase of the product promoted, buyer share, proof strength and whether the team can actually make it, checks the live mix for spread, and turns the month's affordable number of cells into a dated production list. Use before every creative batch or monthly planning. For a one-off deep dive when results have stalled, use creative-gap-map first. Read access only."
---

# Creative gap grid

**You get:** an updated creative grid of buyer type, awareness stage and theme showing each cell's status and results, a ranked list of open cells, and this month's production list with a naming rule.

This is the store's standing creative plan. Every ad gets one address on a three-axis grid (buyer type, stage, theme), so each new batch is aimed at a cell rather than made from taste. It is reused before every batch; the one-off historical diagnosis of an account that has stalled belongs to `creative-gap-map`, whose coverage map can seed this grid.

## When to use

- Before every creative batch or monthly creative planning.
- New ads keep looking like old ads.
- A new product, buyer type or theme needs a place in the plan.
- After a creative review, to turn its verdicts into next month's list.

## Not for

- A one-off deep dive across a year of ad history when results have stalled for a month, ending in five briefed concepts: use `creative-gap-map`.
- Judging live ads as scale, keep, fix or cut: use `store-meta-creative-review`.
- Finding buyer types or themes: use `buyer-decision-map` and `product-claims-profile`.
- Writing the concepts: use `store-meta-concepts`.

## What you need

**Required**

- Meta Ads Manager export, last 90 days, ad level: ad ID, ad name, ad set, first delivery date, spend, purchases (7-day click), purchase value. Add TikTok or Google video exports if they carry real spend.
- Shopify orders by UTM campaign and content for the same period.
- Buyer types with share of buyers (from `buyer-decision-map`); themes with claim tier and quote counts (from `product-claims-profile`).
- The products table with gross profit per purchase and status (Advertise, Protect, Skip).
- The monthly test budget and the team's output per week by format (statics, phone video, creator video).

**Optional**

- The coverage map from `creative-gap-map`, to seed cell status on first use.
- Meta's incremental attribution column.

**When something is missing.** Without buyer types or themes, run one pass of `buyer-decision-map` first and mark the grid "first pass". Without gross profit per purchase, show cell status but rank nothing.

**Access.** Level 1, read.

## Before you start: the gates

1. **Gross profit per purchase is known** for every product the grid can promote. It sets each cell's target cost per purchase and is the main ranking weight. Fail: status only, unranked.
2. **Cash sets how many cells to test.** A cell needs about three times target cost per purchase to read [ADC-0039]. Cells this month = monthly test budget divided by three times target cost per purchase. Fail (no budget stated): rank, but recommend no volume.
3. **Capacity sets what can be made.** Weekly output by format. If affordable cells exceed capacity, capacity wins.
4. **Results are checked store-side.** Meta purchases and Shopify orders by UTM agree within about 20% (practitioner default, test it). Fail: use Shopify orders by UTM content, or mark statuses "platform-reported".

## Steps

### 1. Fix the axes and the naming rule

- **Buyer types** from the decision map with share of buyers, plus "general" for ads aimed at nobody in particular.
- **Stages:** unaware, problem-aware, solution-aware, product-aware, most aware.
- **Themes:** the store's own list from the claims profile, typically 6 to 12 (for example problem and fix, how it works, customer proof, comparison with the old way, founder story, in-use lifestyle, offer). A theme the store cannot back with an allowed claim is not on the list.

Every new ad name carries its cell and its tags, for example `B2_PA_proof_SKU12_bundle_ugc_v1`, so status updates come straight from the export and no ad is an orphan. Use the same fields every time so results trace to one element [MCR-0051].

### 2. Update cell status from this month's results

Collapse near-duplicates first: ads that differ only in background, pose or small wording are one concept, because Meta groups them and they add little reach [MCR-0078]; a new background or pose is not a new ad [MCR-0022].

| Status | Rule |
|---|---|
| Winner | A concept spent three times target and holds store-side cost per purchase at or under target |
| Dead | Two or more distinct concepts each spent three times target with none or one purchase [ADC-0039]; one failed concept is not enough (practitioner default, test it) |
| Inconclusive | Spent less than three times target |
| Untested | No concept |
| Blocked | Banned claim, product in Protect or Skip, or buyer type below threshold |

Judge at ad set level where ads share a set [ADC-0059]; where the incremental column exists, winners should clear the store's floor [ADC-0008]. Revisit dead cells after six months or a product or offer change (practitioner default, test it). Meta's default bidding favours the cheapest product to sell [ADC-0022], so note when winners cluster on low-margin products.

### 3. Start from a fit map, then let evidence overrule it

Mark each stage and theme pair as likely, possible or unlikely as a starting assumption: offer themes rarely work on unaware buyers; how-it-works themes rarely move most-aware ones. Adjust it per buyer type from their evidence: a group whose reviews show distrust of hype loses countdown and status themes at every stage. Any cell the store's own results contradict follows the results.

### 4. Score open cells

For each untested or inconclusive, unblocked cell:

**Priority = gross profit per purchase of the product × share of buyers in the type × proof weight × can-make weight**

Practitioner defaults, test them: proof weight 1.0 for a proven claim, 0.8 supported, 0.7 customer-reported with ten or more quotes, 0.4 opinion only. Can-make weight 1.0 if the team has the assets and format skills now, 0.6 if it needs a creator or a shoot, 0.3 if it needs something the store lacks (for example in-use photos that do not exist yet). Add a 1.2 stage bonus where the store underfeeds early stages; broad-targeted accounts trying to grow past warm demand put most new creative in unaware and problem-aware stages [MCR-0057]. Show every input in the table.

### 5. Check the live mix for spread

Practitioner defaults, test them: live creative should cover at least three buyer types (or every type the store has, if fewer), three stages and four themes, with no single concept holding most of the spend. If not, the next batch fixes spread before chasing the top score. Distinct formats with spend spread across them outlast iterating one winner [MCR-0036].

### 6. Set this month's volume

Two ways, and they disagree:

- From the account's history: new ads needed = winners lost per month divided by hit rate [MCR-0025]; a normal hit rate is around 5% [ADC-0017].
- Rule of thumb: about one new ad per $1,000 of monthly Meta spend [MCR-0059].

History wins once the account has six months and a few dozen launched ads. Cap by gates 2 and 3. Split effort about half to 60% remaking winners in new formats or with new people, 20 to 30% fixing near-misses, 20 to 30% net-new cells from this grid, never zero [MCR-0042]; with limited production, apply new formats to winning ideas first [MCR-0052]. At a high-spend plateau, net-new cells should usually be new buyer types defined by a different problem [MCR-0038].

### 7. Write the production list

For each chosen cell: cell address, product, gross profit per purchase, target cost per purchase, claim wording allowed, two quotes, proof row, format, owner, due date, launch week, and the read date (when it will have spent three times target). Hand it to `store-meta-concepts`. Read fatigue from results, not from a fixed lifespan: clicks holding while purchases fall means the piece is too soft for its stage; purchases falling with rising frequency means it needs a new person or setting.

## Checks before you hand it over

1. Every ad with spend has a cell or is listed as unclear, and spend totals match the export.
2. Near-duplicates are collapsed; counts are concepts.
3. Every status follows step 2 with spend and store-side purchases shown.
4. No blocked cell is on the production list.
5. Every ranked cell shows all four priority inputs.
6. The list fits the budget and the team's weekly output.
7. The spread check in step 5 is shown, and failures are addressed first.

## Output

1. **One-screen summary first:** cells winning, dead, open and blocked; spend share in "general"; the spread check; this month's cell count and split; the top five cells.
2. **The grid:** rows buyer type by stage, columns themes; each cell shows status, concepts, spend and store-side cost per purchase (table, and an HTML heat map if useful).
3. **Ranked open cells:** cell, product, gross profit per purchase, buyer share, proof weight, can-make weight, stage bonus, priority.
4. **Production list** as in step 7, and the naming rule.

## Common mistakes

- **Counting ads instead of concepts.** Step 2 collapses near-duplicates first.
- **Killing a cell on one bad ad.** Step 2 needs two failed concepts at full spend.
- **Ranking by gaps only.** Step 4 weights gross profit, buyer share, proof and ability to make it.
- **A generic stage map applied to every buyer.** Step 3 adjusts it by each group's evidence.
- **One concept carrying the account.** Step 5 fixes spread first.
- **A plan bigger than the budget or the team.** Gates 2 and 3 cap volume.

## Sources

- [ADC-0039]: judge a concept at three times target cost per purchase.
- [MCR-0051]: tag every ad on the same fields.
- [MCR-0078]: near-duplicates are grouped and add no reach.
- [MCR-0022]: a new background or pose is not a new ad.
- [ADC-0059]: judge at ad set level.
- [ADC-0008]: winners should clear the incremental floor.
- [ADC-0022]: default bidding favours the cheapest product to sell.
- [MCR-0057]: most new creative in early stages for growth.
- [MCR-0036]: many distinct formats outlast one winner.
- [MCR-0025]: volume from winner churn divided by hit rate.
- [ADC-0017]: about 5% hit rate is normal.
- [MCR-0059]: about one new ad per $1,000 of monthly spend.
- [MCR-0042]: split effort between remakes, fixes and new.
- [MCR-0052]: apply new formats to winners first.
- [MCR-0038]: at a plateau, open new buyer types.

What makes this skill ours: every ad is named into one cell so the plan updates itself from the export; open cells are ranked by gross profit per purchase, buyer share, proof strength and whether the team can actually make them; a generic stage map is overruled by each buyer group's evidence and the store's own results; and the month's volume comes from the store's churn, hit rate, cash and weekly output.
