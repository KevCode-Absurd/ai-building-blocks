---
name: product-test-and-certificate-plan
description: "A test and certificate plan for one new product in each market it will sell in: the rules that likely apply (for example CPSC rules, a Children's Product Certificate or General Certificate of Conformity, Prop 65 and FTC labels in the US; GPSR, CE marking and REACH in the EU; UKCA or CE and importer details in Great Britain), the tests, the lab, the sample count and which sample stage they use, cost and timing from lab quotes, who issues each certificate, the retest triggers, and the label and pack lines that follow, set with meenakshi-compliance. Use before the first sample of a new product, so the factory and lab know what it must pass."
---

# Test and certificate plan before sampling

**You get:** a market-by-market rule list for the product, a test plan with samples, labs, cost and dates, a certificate list saying who issues each one, the label lines the rules require, and the retest triggers, all marked for Meenakshi to confirm.

## When to use

- A new product is chosen and the spec is being written.
- The store is adding a new market (EU, UK, Australia, Canada) for an existing product.
- A material, factory or design change could change test results.
- A marketplace or customs broker has asked for a certificate the store does not have.

## Not for

- Confirming which rules apply in law: Meenakshi (`meenakshi-compliance`) decides, with a lawyer where needed. This skill builds the plan she checks.
- Inspecting production lots: use `aql-sampling-plan-and-inspection-calls`.
- Writing the full spec: use `write-product-spec-sheet-for-factory` (this plan feeds its tests and labels sections).
- Ad and claims policy: use `check-ad-copy-for-policy-and-claims`.
- Electronics or medical devices that need a qualified engineer: say so and stop.

## What you need

Required:

1. **The product**: what it is, materials, who it is for (age matters), how it is used, any battery, electrics, food contact or skin contact.
2. **Markets** it will sell in.
3. **The factory's existing test reports** for this or a similar product, with lab name, standard and date.
4. **Launch date and order quantity.**

Optional: competitors' listings that show certificates, marketplace category rules, past customs holds.

Maxine and Phuong draft at level 2. Lab quotes are requested only with the owner's yes, and lab fees need the owner's yes. Meenakshi confirms the rule list before anything is ordered.

## Before you start: the gates

1. **Age and use clear.** Pass: the store has decided who the product is for. Fail: decide first. In the US a product designed mainly for children 12 and under is a children's product, with third-party testing and its own certificate.
2. **Risky categories flagged.** Pass: battery, electrical, food contact, cosmetic, medical or protective use is listed. Fail: ask; these change everything.
3. **Factory reports read, not trusted.** Pass: each report names the exact product, standard, lab and date. Fail: treat it as no report.

## Steps

### 1. List the likely rules per market

**United States**

- CPSC rules for the category. A children's product (12 and under) needs testing at a CPSC-accepted third-party lab, a Children's Product Certificate issued by the US importer (not the factory), permanent tracking labels, lead in substrate under 100 ppm and in paint under 90 ppm. Retest at least yearly, or less often under a production testing plan.
- A general-use product covered by a CPSC rule needs a General Certificate of Conformity based on a test or a reasonable testing programme.
- Each certificate covers one product, carries a unique ID (GTIN or SKU), lists each rule, gives the manufacture month and factory, and names a records contact. Certificate data must now be eFiled with customs at entry.
- California Prop 65: if a listed chemical is present, a warning on the product page or before checkout; the short form must name a chemical. A store selling its own brand carries this duty.
- FTC care labels for apparel, textile fibre content, and country of origin marking (unmarked goods can owe an extra 10% duty).

**European Union**

- General Product Safety Regulation: a responsible economic operator in the EU named with a postal address on the product, pack or paperwork; an internal risk assessment and technical file; a batch or serial number; contact details; safety information in the local language.
- CE marking where a product law applies (for example toys, electrical goods), with the conformity file behind it.
- REACH: restricted substances, and disclosure if a substance of very high concern is above 0.1% by weight in an article.
- Textile labelling by fibre names and percentages.

**Great Britain**

- CE is still accepted beside or instead of UKCA for most product rules, but the GB importer's name and address must be on the product, or its pack if too small.

**Australia, Canada and others**

- Check the national list of mandatory standards and bans (for example Product Safety Australia's mandatory standards; Health Canada's consumer product rules). Mark each "to confirm with Meenakshi".

### 2. Turn rules into tests

For each rule: the test standard, what is tested, the number of samples the lab needs, and which sample stage it uses. Lab tests for a certificate should use pre-production or production units, not a hand-made proto, because the certificate covers what is sold.

### 3. Get lab quotes and timing

Ask two labs for a quote: tests, sample count, cost, turnaround, and whether the lab is accepted for the rule (for US children's products, on the CPSC list). Never put a cost or date in the plan that a lab has not given; write "quote pending".

### 4. Say who issues each certificate

The US importer issues the Children's Product Certificate or General Certificate; in the EU and GB the maker or importer holds the technical file and declaration. Write the name of the person in the store who signs and keeps records, and how fast they can answer a regulator.

### 5. Write the label and pack lines

Every line the rules require: tracking label, warnings, fibre content, care, origin, importer or responsible person name and address, batch number, CE or UKCA mark. Hand these to Maxine's spec and Alistair's pack artwork before artwork is made.

### 6. Set retest triggers

Retest when: the material or a sub-supplier changes, the factory changes, the design changes in a tested area, the periodic retest date comes, or a regulator or marketplace asks. Put each date in the plan.

### 7. Hand to Meenakshi

She confirms the rule list, adds anything missing, and signs off before lab orders. Hold the first PO until the plan is signed.

## Checks before you hand it over

- Age group and risky features are decided and written.
- Every market has a rule list marked "to confirm" where unsure.
- Every test names its standard, sample count, stage and lab.
- No cost or date appears without a lab quote.
- Each certificate names who issues and keeps it.
- Label and pack lines are listed for the spec and artwork.
- Meenakshi has signed off before lab orders.

## Output

**Rule list:**

| Market | Rule | Applies because | Test or document | Who issues | Status (confirmed or to confirm) |
|---|---|---|---|---|---|

**Test plan:**

| Test | Standard | Market | Samples | Stage | Lab | Cost | Turnaround | Booked | Result |
|---|---|---|---|---|---|---|---|---|---|

**Label and pack lines**, **retest calendar**, and **sign-off** by Meenakshi.

## Common mistakes

- **Trusting the factory's old report.** Gate 3 checks product, standard, lab and date.
- **Testing the proto.** Step 2 tests what will be sold.
- **Letting the factory issue the US certificate.** Step 4: the importer does.
- **Forgetting the EU operator.** Step 1 names one with an address.
- **Labels after artwork.** Step 5 hands lines over first.
- **No retest after a material change.** Step 6 sets triggers.

## Sources

- COG-6261: US duty now applies to small shipments, including samples.
- COG-6263: US textile labels need fibre content, origin and maker ID.
- COG-0007: never send a factory a product without a tech pack.
- CPSC, Business Desktop Reference Guide: https://www.cpsc.gov/s3fs-public/Quick%20Resource%20Guide%20KO.pdf
- CPSC, Children's Product Certificate: https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/Childrens-Product-Certificate
- Federal Register, Certificates of Compliance final rule (16 CFR part 1110): https://govinfo.gov/content/pkg/FR-2025-01-08/pdf/2024-30826.pdf
- 16 CFR 1107.21 Periodic testing: https://www.law.cornell.edu/cfr/text/16/1107.21
- 27 CCR 25602 and 25603, Prop 65 warning methods and content: https://www.law.cornell.edu/regulations/california/27-CCR-25602
- 27 CCR 25600.2, Responsibility to provide warnings: https://www.law.cornell.edu/regulations/california/27-CCR-25600.2
- FTC, Care Labeling Rule (16 CFR 423): https://www.ftc.gov/legal-library/browse/rules/care-labeling-textile-wearing-apparel-certain-piece-goods-text
- CBP, Marking of Country of Origin on U.S. Imports: https://www.cbp.gov/trade/rulings/informed-compliance-publications/marking-country-origin-us-imports
- 19 USC 1304, Marking of imported articles: https://www.law.cornell.edu/uscode/text/19/1304
- GOV.UK, EU Regulation 2023/988 on General Product Safety: detailed guidance: https://www.gov.uk/government/publications/general-product-safety-regulations-northern-ireland/eu-regulation-2023988-on-general-product-safety-detailed-guidance
- Business.gov.uk, EU General Product Safety Regulation: https://www.business.gov.uk/campaign/europe/european-union-eu-regulations/eu-general-product-safety-regulation-eu-gpsr/
- GOV.UK, Using the UKCA marking: https://www.gov.uk/guidance/using-the-ukca-marking

What makes this skill ours: the plan is built before the first sample, so the factory makes and the lab tests the same thing; every rule is marked confirmed or to confirm for Meenakshi; no cost or date is guessed; and label lines reach the spec and artwork before anything is printed.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. For products under a Quality Control Order, the BIS Standard Mark under a licence or certificate is compulsory, so check the list before choosing a supplier [COG-6266]. Add Legal Metrology pack declarations to step 5, and ask Meenakshi to confirm the list with Ishita.
