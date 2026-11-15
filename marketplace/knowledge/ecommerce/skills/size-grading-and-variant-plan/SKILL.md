---
name: size-grading-and-variant-plan
description: "A size and colour plan for one product that comes in variants: a grading table with the target measurement and a tolerance for every point of measure in every size, a check that tolerances never let two sizes overlap, the sizes and colours to make and the ones to drop, the quantity split per size and colour taken from the store's own sales on in-stock days and its size-return reasons, and a check of every variant against the factory's minimum per style, colour, size and fabric, with the cheapest fix for each gap. Ends with the size-set sample plan and the variant table for the store. Use when a product comes in sizes or colours and you need to decide what to make and how many of each, before a first order or a reorder."
---

# Size grading and variant plan

**You get:** a grading table a factory can sample from, a make list of sizes and colours with the units of each, a minimum order check with a fix for every variant that falls short, and the variant table for the store, all for one product.

## When to use

- A new product comes in sizes or colours and the first purchase order is close.
- On a reorder, some sizes sell out while others pile up.
- Size returns ("too small", "too big") are high on one product or one size.
- The factory's minimum per colour forces more units than the store can sell.
- The range adds an extended size or a new colour and nobody knows how many to make.

## Not for

- The full factory spec (materials, labels, packaging): use `write-product-spec-sheet-for-factory`; this skill fills its measurement table.
- The size guide buyers read on the product page: use `write-size-fit-and-how-to-use-guides`.
- Whether to make the product at all: use `validate-demand-before-buying-stock`.
- Bargaining the minimum order down: use `negotiate-moq-and-price`.
- Reorder points and safety stock once sizes are set: use `set-reorder-points-and-safety-stock`.
- Which products to keep in the range: use `sku-range-review-kill-keep-fix-grow`.

## What you need

Required:

1. **The base size spec:** the approved fit sample's measurements, or the current product's spec sheet.
2. **Sales by variant, last 12 months,** with stockout dates (Shopify order export with Lineitem sku and Lineitem variant, plus inventory history), or a sales plan if the product is new.
3. **Returns by variant with reasons.** Shopify records a reason per returned line item [COG-6323]; a refund given without a return records no reason [CXP-6612].
4. **Factory minimums:** per style, per colour, per size if any, and the fabric or material minimum per colour or dye lot, with any surcharge for going under.
5. **Total units to buy** from `forecast-demand-per-sku` or an open-to-buy plan, and landed cost per unit.
6. **Markets and size systems** the product sells in (US, UK, EU, Australia or others).

Optional: reviews that mention fit; fit quiz or customer measurement data; exchange records (which size buyers swapped to); a rival's published size chart for comparison only.

Access: read only (level 1) on orders, returns and stock. The grading table and make list are drafts (level 2). Sending anything to a factory or placing an order waits for the owner's yes.

## Before you start: the gates

1. **The base size fits.** Pass: a fit sample in the base size has been tried on a real body or form and signed off. Fail: no grading yet; grading a bad base copies the fault into every size.
2. **One size system per market.** Pass: the store has its own measured chart and each market label (US, UK, EU) maps to it. Fail: do not guess conversions between systems; measure.
3. **Clean demand.** Pass: size shares come from sales on in-stock days [OPS-0014]. When a size is out, some buyers take the next size and some leave, so the missing size reads low and its neighbour reads high [OPS-6632]. Fail: mark the share "estimated" and correct it in step 4.
4. **Return reasons are logged.** Pass: most returns carry a reason. Fail: read reviews and tickets for fit words and say the read is weaker.
5. **Minimums known at every level.** Pass: style, colour and material minimums are written down. Fail: ask the factory in writing before planning the split.

## Steps

### 1. List the points of measure

Write every point that decides fit. Apparel: chest, waist, hip, length, sleeve, shoulder, rise, inseam. Footwear: foot length and width. Fitted goods (rings, helmets, pet harnesses, bedding, phone cases): the one or two measures that decide whether it fits. Each point gets a plain "how to measure" line, with an exact start and end point, never words like "around the middle" [COG-0005].

### 2. Write the grade rules

For each point, set the change from one size to the next. Ask the pattern maker or factory for their rule and agree it in writing; do not invent increments. Mark the break points where the step changes (many ranges use a bigger step in extended sizes). Fill the grading table: base size target, step, and the target for every size.

### 3. Set a tolerance on every point

A measurement with no tolerance cannot be failed fairly at inspection, and a tolerance that is too wide shows up as size returns. One shirt brand allows plus or minus 0.4 in on chest width, 0.5 in on lengths and 0.3 in on collar and cuffs, doubling for circumferences [COG-6330]. Stretch knits and washed fabrics need looser limits.

**Overlap check:** if twice the tolerance is equal to or larger than the grade step, a large small and a small medium can measure the same. Tighten the tolerance or widen the step until every size stands apart (practitioner default; test it on the size set).

### 4. Read demand by size and colour

- Size share = units sold per in-stock day for each size, divided by the total for the product. Do the same for colour, and for size within each colour if colours sell to different buyers.
- Correct for stockouts: add back lost sales on the out-of-stock size, and take the same units off the neighbour that caught them (about 45% of shoppers switch across retail categories [OPS-6632]; use the store's own exchange data if it has it).
- Count exchanges toward the size the buyer kept, not the size first ordered.
- New product with no history: use the closest product the store already sells in the same size system, label it an estimate, and keep a buffer for the reorder.

### 5. Read the size returns

For each size, work out the size-return rate (returns for too small or too big divided by units sold).

- One size returns far more than the product's average (practitioner default: over 1.5 times): measure units of that size from stock against the spec before buying more. It may be out of tolerance at the factory.
- "Too small" across all sizes: the grading or the base runs small; fix the spec, do not just buy more of the next size up.
- Fit returns spread evenly: the size guide is the likely fix; hand to `write-size-fit-and-how-to-use-guides`.
- In fashion, returns cut the real value of each sale, so a size with high returns earns less than its sales suggest [MEA-6383].

### 6. Choose what to make

- Keep every size and colour that clears the minimum and its contribution after returns.
- A size or colour with a small share is still kept when repeat buyers depend on it; cutting a whole size option shoppers rely on backfires [MEA-6401]. Make it in smaller runs, as a pre-order or a later drop.
- Fewer colours and sizes per order lower the factory's cut and make cost, because small runs mean more changeovers [COG-6302]. Fewer, finished choices can also ease buying worries [AVT-0001]. Assortment-led products (fashion colour, beauty shades) need breadth, so weigh the saving against lost choice.
- Write the make list: every size and colour, make or drop, and the reason.

### 7. Split the quantity

Units per variant = total buy x colour share x size share within that colour. Round to the factory's pack or carton ratio. Add a small buffer to the two best sizes and hold a floor for range fillers, so no kept size arrives with fewer units than a week of sales (practitioner default; test it).

### 8. Check every variant against the minimums

| Variant | Planned units | Minimum | Gap | Fix | Extra cost per unit |
|---|---|---|---|---|---|

Fixes, cheapest first: move units from an over-planned size of the same colour; use the factory's stock fabric or colour; pay the small-run surcharge (show it per unit against contribution); combine with another style that shares the fabric; make it a pre-order or later drop; drop the colour. Never pad a colour with units the sales split does not support just to clear a minimum without showing the stock and cash it ties up.

### 9. Approve the size set before bulk

Ask for a size set: three of each size in final fabric and finishes, measured against the grading table and tolerances before bulk is approved [COG-6354]. Approve in stages and keep one approved sample of each size [COG-0007]. Record every point that falls outside tolerance and the factory's fix.

### 10. Set up the variants in the store

- Option order that matches how buyers choose (usually colour, then size), the same order as the photos.
- One SKU and one barcode per variant, with a pattern such as STYLE-COLOUR-SIZE.
- Weight per size where it changes the shipping rate, and a cost per item for every variant, so profit reports include it [MEA-6402].
- Shopify allows up to three options per product; check the current variant limit on your platform before adding a fourth dimension.
- Hand the size chart to `write-size-fit-and-how-to-use-guides` and the spec table to `write-product-spec-sheet-for-factory`.

### 11. Read it after launch

At 4 and 8 weeks, compare sell-through by size and colour with the plan and the size-return rate with the baseline. Feed the gaps into the next buy.

### 12. Market notes

- **US:** sizes are often letters or numbers with inches; garment labels need fibre content and country of origin [COG-6263].
- **UK, EU and Australia:** sell with centimetres beside any letter size, and check EU and UK size labels and conversions on your own measured chart, not a generic table.
- **Fashion returns:** US and UK fashion returns can run up to double other markets [MEA-6266]; plan return allowances by market.

## Checks before you hand it over

- Every point of measure has a target in every size and a tolerance.
- No point fails the overlap check.
- Size shares come from in-stock days and are corrected for stockouts and exchanges.
- Every size with high size returns is measured against spec before more are bought.
- Every variant is checked against every minimum, and each gap has a fix with its cost per unit.
- Kept sizes that loyal buyers rely on are not dropped for a small share.
- The size set is planned before bulk.
- Nothing was sent to a factory or ordered without the owner's yes.

## Output

**One-screen summary:** the product, sizes and colours to make and drop, total units, the three biggest changes from the last buy, the minimum gaps and their fixes, and the size-set date.

**Grading table:** Point of measure, How to measure, Base target, Step, Target per size (one column per size), Tolerance, Overlap check.

**Make list and split:** Colour, Size, Share (in-stock days), Size-return rate, Make or drop, Units, Reason.

**Minimum check:** Variant, Planned units, Minimum, Gap, Fix, Extra cost per unit.

**Store variant table:** Option 1, Option 2, SKU, Barcode, Weight, Cost per item.

## Common mistakes

- **Grading an unfitted base.** Gate 1 needs a signed-off fit sample.
- **Tolerances wider than the step.** Step 3 runs the overlap check.
- **Buying from raw sales.** Step 4 uses in-stock days and corrects for stockouts.
- **Buying more of the next size to cure "too small".** Step 5 fixes the spec instead.
- **Dropping a size loyal buyers use.** Step 6 keeps range fillers in small runs.
- **Padding a colour to clear a minimum.** Step 8 shows the cost of every fix.
- **Skipping the size set.** Step 9 approves all sizes before bulk.

## Sources

- COG-6323: return reasons per line item in Shopify.
- CXP-6612: refunds without a return record no reason.
- OPS-0014: demand on in-stock days.
- OPS-6632: stockouts move demand to other sizes.
- COG-0005: exact measurements, never vague words.
- COG-6330: working tolerances per measurement point.
- MEA-6383: returns cut the real value of a sale.
- MEA-6401: cutting a size option buyers rely on backfires.
- COG-6302: fewer colours and sizes per order lower cut and make cost.
- AVT-0001: fewer finished choices can ease buying worries.
- COG-6354: size set samples before bulk.
- COG-0007: staged sample approval and kept samples.
- MEA-6402: a cost per item on every variant.
- COG-6263: US textile label rules.
- MEA-6266: higher fashion returns in the US and UK.

What makes this skill ours: every tolerance is tested against the grade step so sizes never overlap; size shares come from in-stock days with stockouts and exchanges put back; size returns are traced to the spec before more stock is bought; and every minimum gap gets a priced fix instead of quiet over-buying.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, Indian marketplaces and GST; hand those parts to her. Size returns and refused COD parcels both count against a size's contribution. Myntra, Ajio and Amazon.in each use their own size chart templates, so map them to the store's measured chart before listing.
