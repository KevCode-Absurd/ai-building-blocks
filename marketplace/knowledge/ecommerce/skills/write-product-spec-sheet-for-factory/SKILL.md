---
name: write-product-spec-sheet-for-factory
description: "A versioned product spec sheet a factory can quote and make from: drawings, materials with weights and finishes, measurements with tolerances for every size, colours by standard code, hardware, labels with the required legal wording for India or the US, retail and shipping packaging, carton marks, and the checks the product must pass. Use before asking for quotes on a custom or private-label product, before switching factories, or when batches keep coming back different from the sample."
---

# Product spec sheet for a factory

**You get:** a versioned spec sheet (one document plus a measurement table and label and packaging artwork list) that any factory can quote and produce from, and that the store owns and can take to another factory.

## When to use

- Before sending a request for quote for a custom, private-label or modified product.
- Before moving production to a new factory.
- When batches arrive in different shades, weights or sizes than the approved sample.
- When reviews show a repeated product complaint that the next run must fix.

## Not for

- Finding the factory: use `find-and-vet-suppliers`.
- Getting and comparing prices: use `write-rfq-and-compare-quotes` (it attaches this sheet).
- Testing samples against the sheet: use `order-samples-and-quality-check`.
- Designing the unboxing moment and inserts: use `packaging-and-unboxing-brief`.

## What you need

Required:

1. **The product**: a physical example (yours or the reference you want to match), photos from every angle, or design files.
2. **Sizes or variants** and the target customer (for sizing: the store's size chart and fit complaints).
3. **Materials wanted**, as precisely as the owner knows them.
4. **Markets**: India, US or both (labels differ).
5. **Brand assets**: logo files, brand colours with codes.

Optional: competitor products, 1-star reviews of competing products, the store's own return reasons, an existing factory's spec (often thin).

If the owner does not know a material spec (fabric weight, metal grade, plastic type), measure or test the reference product, or ask the shortlisted factories to propose one in writing and fix it after the sample. Do not leave it blank. Nothing here needs store access; sharing the sheet with factories is done by the client or at level 2 with the client's approval of who receives it.

## Before you start: the gates

1. **Product decided.** Pass: the store has decided to make this product and has a target landed cost. Fail: run `validate-demand-before-buying-stock` first.
2. **Ownership.** Pass: the store owns the design, artwork and brand assets it will put in the sheet. Fail: do not copy another brand's design or trade dress; change it until it is the store's own.
3. **Rules listed.** Pass: the label and pack rules for each market are listed (step 6). Fail: list them before artwork.

## Steps

### 1. Head the document

Product name, internal SKU codes, spec version number, date, owner, and a change log line. Every quote, sample and purchase order cites the version. A factory makes the easiest choice wherever the spec is silent [COG-0007], so version control is how the store keeps control.

### 2. Drawings

Front, back, sides, top, bottom and any detail views, with every measurement point marked by a letter that matches the measurement table. Mark placement of logos, prints, stitching and hardware in exact distances from fixed edges. Never write "centred": write the distance from each edge, for example 4 inches from the top and 2 from each side [COG-0005].

### 3. Materials and components (the bill of materials)

One row per component: name, material, grade or composition, weight (fabric weight in grams per square metre, metal gauge, wall thickness), finish or treatment, colour code, supplier if you require one, and the test or certificate needed. At higher volume, add each component's cost, sub-supplier and lead time so price breaks can be negotiated line by line [COG-0001].

Write material weights as numbers: a factory that quietly lowers fabric weight can then be caught by weighing pieces [COG-0011].

Turn known complaints into spec lines: if competing products' 1-star reviews say the zip breaks, name the zip grade [AMZ-0002].

### 4. Measurements and tolerances

A table with every measurement point for every size, the target, and a plus or minus tolerance. Tolerances: practitioner default, test it; ask the factory what it can hold and agree it in writing. For apparel, give grading between sizes and ask for several pre-production samples across sizes. Add weight per unit with a tolerance.

### 5. Colours, prints and finishes

Colour by a standard code system (for example Pantone) plus a physical swatch or approved strike-off; screens show colour differently. Print method, artwork file names and versions, and print size in exact measures.

### 6. Labels and legal wording

Write the exact wording and position of every label.

- **US textiles:** fibre content by percentage in descending order, country of origin on the front of the label, and the maker's name or RN number; at a neck, inside centre of the neck [COG-6263]. Other categories (children's products, cosmetics, electronics) have their own rules; list them and check with the owner's adviser.
- **India packaged goods:** maker, packer or importer name and address, country of origin for imports, generic name, net quantity, month and year of manufacture, best-before where relevant, MRP inclusive of all taxes, unit sale price and consumer care details [COG-6264]. For imports, it is the Indian importer's details that go on the pack.
- Care label, size label, barcode (format and number source), and any certification mark the product legally needs.

### 7. Packaging and cartons

Retail packaging: type, material, size, print, insert, and how the product is folded or placed. The retail box is product cost; the plain shipping carton is a shipping cost [FIN-0008], so specify them separately. Choose parcel-friendly shapes and sizes; awkward packaging can make a product hard to ship at a profit [PRD-0013]. Budget the unboxing extras: one practitioner range is under 0.50 dollars an order for basic and 2.80 to 4.50 for premium [CXP-0008].

Master cartons: units per carton, carton size and gross weight limits, carton marks (SKU, quantity, carton number, country of origin), and pallet or container loading rules. Give the final box sizes and weights to whoever sets up shipping: with calculated rates, Shopify needs each box's empty weight and size saved as a package, or orders quietly undercharge shipping [SET-0007].

### 8. Quality standards and tests

List the checks every lot must pass and how, referring to the quality checklist in `order-samples-and-quality-check`: critical, major and minor defects, functional tests, and the inspection sampling level. State the approval sequence: material sample, pre-production golden sample, production sample [COG-0007].

### 9. Commercial notes

Order quantities per variant, target dates, and a line that the design, files and spec belong to the store and may not be sold to others. Keep the source files on the store's side so the spec can move to a new factory.

### 10. Review it with a stranger

Give the sheet to someone who has not seen the product and ask them to sketch it or list what they would have to guess. Every guess becomes a spec line. Then send it to two factories and ask each to list questions; answer them in the next version.

## Checks before you hand it over

- The sheet has a version number, date and change log.
- Every measurement point in the drawing appears in the table with a target and tolerance.
- No placement uses words like "centred" or "standard"; all are distances.
- Every material has a numeric weight, grade or composition.
- Colours have codes plus a physical standard.
- Label wording meets the rules for each market sold in.
- Retail packaging and shipping cartons are specified separately, with sizes and weights.
- A stranger's review found nothing left to guess.

## Output

**One-screen summary:** the product, spec version, top five critical specs, label rules covered, open questions for the factory.

**Spec sheet (fill every section):**

1. Header: product, SKUs, version, date, owner, change log.
2. Drawings with lettered measurement points.
3. Bill of materials:

| Component | Material and grade | Weight or gauge | Finish | Colour code | Required supplier | Test or certificate | Cost (optional) | Lead time (optional) |
|---|---|---|---|---|---|---|---|---|

4. Measurement table:

| Point | Description | Size 1 | Size 2 | Size 3 | Tolerance plus or minus | How to measure |
|---|---|---|---|---|---|---|

5. Colour and print: code, swatch reference, method, artwork file and version, size and placement.
6. Labels: label, wording, size, material, exact position, market rule it meets.
7. Packaging: retail pack, inserts, folding, master carton (units, size, weight limit, marks), loading.
8. Quality: defect classes, tests, inspection level, approval sequence.
9. Commercial: quantities per variant, dates, ownership line.

**Factory question log:** question, factory, answer, version it changed.

## Common mistakes

- **Words instead of numbers.** Steps 2 to 4 measure everything.
- **No version.** Step 1 versions the sheet and every quote cites it.
- **Leaving materials to the factory.** Step 3 fixes weight and grade.
- **Labels as an afterthought.** Step 6 writes legal wording before artwork is made.
- **One box spec for both retail and shipping.** Step 7 splits them and feeds sizes to Shopify.
- **Writing for yourself.** Step 10 tests the sheet on a stranger and two factories.

## Sources

- AMZ-0002: competitors' 1-star complaints become spec lines.
- COG-0001: bill of materials by component, sub-supplier and lead time.
- COG-0005: exact distances, never "centred"; send a reference sample.
- COG-0007: undefined details get the factory's easiest choice; three sample stages.
- COG-0011: a full tech pack cuts supplier errors; weigh fabric to catch cuts.
- CXP-0008: unboxing cost ranges per order.
- FIN-0008: retail box is product cost, shipping carton is shipping cost.
- PRD-0013: parcel-friendly packaging.
- SET-0007: save box weights and sizes in Shopify for calculated shipping.
- COG-6263 (proposed): US textile label rules.
- COG-6264 (proposed): India packaged goods declarations.

What makes this skill ours: buyer complaints become spec lines; the label section carries India's Legal Metrology declarations and US textile rules side by side; retail and shipping packaging are specified apart because they land in different cost lines and feed Shopify's shipping set-up; and the sheet is tested on a stranger before any factory sees it.
