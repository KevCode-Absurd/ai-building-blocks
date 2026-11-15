# Indian marketplace listings, from margin to live

Listings on Flipkart, Myntra, Nykaa, Ajio or Meesho with a floor price per product that holds after commission, fees, shipping, return to origin (RTO) and TCS, Legal Metrology details on every listing, images to each marketplace's guide, published only with your yes on the exact sheet, and reviewed on profit per delivered order after 30 days.

**Starts from:** A decision to sell on an Indian marketplace (often from a go-to-market plan), new products for one you already sell on, or listings that are rejected or lose money. Amazon.in goes to the Amazon listing process with Garrett; quick commerce (Blinkit, Zepto, Instamart) onboarding is a separate job with Ishita.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Ishita (ishita-india-commerce) | intake.md, fact-sheet.md | intake-complete | no | read |
| 2 | Margin and floor price per product | Ishita (ishita-india-commerce) | price-sheet.csv, price-notes.md | margin-check | no | draft |
| 3 | Listing data and copy | Georgia (georgia-product-copy) | listing.md, upload/catalog-sheet.csv | copy-lint, proof-check, india-rules, compliance-review | no | draft |
| 4 | Images for this marketplace | Tanvi (tanvi-listing-images) | images/images.md | image-review, compliance-review | no | draft |
| 5 | Listing pack for your approval | Ishita (ishita-india-commerce) | listing-pack.md | pack-complete | yes | draft |
| 6 | Publish the listings | Ishita (ishita-india-commerce) | publish-record.md | none | yes, the plan | publish |
| 7 | Check the quality check result | Ishita (ishita-india-commerce) | verify.md | live-check | no | read |
| 8 | Day 30 review | Ishita (ishita-india-commerce) | results/readout.md | numbers-check, readout-review | no | read |
| 9 | Write down what we learned | Callum (callum-reporting) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects the facts first: which marketplace and why (where your category sells), your GST registration, product data with GS1 barcodes, costs, each marketplace's commission, fee and return terms with the date checked, past settlement reports with their TCS and TDS lines, and for each product the Legal Metrology details (maker or importer, net quantity, MRP, unit sale price, date, origin, customer care) and any BIS or FSSAI need. Writes down the access level for each seller panel. Opening the seller account and entering GST, bank and identity details stay with you.

- **Needs:** context/org-context/ (customers, voice, claims, do's and don'ts); context/goals.json; context/learnings.md; product data export and cost sheet; marketplace rate cards and settlement reports; the task that started this job
- **Makes:** intake.md, fact-sheet.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, fees carry their date, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the marketplace, buyers, products, fees and terms with their source and date, the access level and the answered questions; fact-sheet.md lists every product fact and Legal Metrology line with its source.

### 2. Margin and floor price per product

Works out profit per delivered order for each product after commission, fixed and collection fees, shipping both ways on RTO, damaged returns, TCS and GST, then sets a floor price and a target. Products that lose money on COD orders are flagged with a prepaid-only or price option.

- **Needs:** intake.md; your cost sheet
- **Makes:** price-sheet.csv, price-notes.md
- **Checks:** margin-check (every fee, TCS and the RTO cost are counted on delivered orders, floors cover landed cost, and the working is shown)
- **Done when:** price-sheet.csv gives each product's cost, every fee, RTO allowance, floor and target, and price-notes.md shows the working and names the products not to list.

### 3. Listing data and copy

Fills the marketplace's own catalog template from real data: titles and key attributes the way that marketplace's buyers search, descriptions that answer real doubts, and the Legal Metrology fields exactly as on the pack. Missing facts become questions, never guesses.

- **Needs:** fact-sheet.md; price-sheet.csv; the marketplace's current catalog template; context/org-context/ voice and claims
- **Makes:** listing.md, upload/catalog-sheet.csv
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up stats)); proof-check (every figure in the listings is backed by the fact sheet or the Org context); india-rules (every listing carries the Legal Metrology details exactly as on the pack, MRP and unit sale price are right, BIS or FSSAI needs are flagged with the rule and check date, and items for your CA or lawyer are named); compliance-review (no unproven or restricted claims for the category, images follow the marketplace's guide, and nothing breaks the marketplace's listing policy)
- **Done when:** Every product has every required field and Legal Metrology line filled from a named source, and prices sit at or above their floor.

### 4. Images for this marketplace

Reworks your image set to the marketplace's current image guide and adds a back-of-pack image where the label details buyers must be able to read are shown. Uses your real product photos; nothing is redrawn by a model, and there is no paid generation without your yes and the cost.

- **Needs:** listing.md; your real product photos and pack artwork; the marketplace's current image guide
- **Makes:** images/images.md
- **Checks:** image-review (the product is the real one, each image meets the marketplace's guide, and the back-of-pack details are readable at phone size); compliance-review (no unproven or restricted claims for the category, images follow the marketplace's guide, and nothing breaks the marketplace's listing policy)
- **Done when:** images.md lists every image per product with its file, size and the rule it meets, including the back-of-pack image.

### 5. Listing pack for your approval

Puts the exact upload on one page: each product with its title, price against its floor, profit per delivered order, Legal Metrology lines and images, the product count, and how it will be published. Items your CA or lawyer still needs to confirm (GST rate, BIS or FSSAI) are listed and held back.

- **Needs:** upload/catalog-sheet.csv; listing.md; price-sheet.csv; images/images.md
- **Makes:** listing-pack.md
- **Checks:** pack-complete (every product in the sheet appears in the pack with its price, floor, margin, Legal Metrology lines and images, and nothing differs from the sheet)
- **Done when:** listing-pack.md shows every product, price, floor, margin, Legal Metrology line and image, the held items, and the publish route.
- **You sign off:** You read the pack. Reply yes with the code to send exactly this sheet to the publish step. The code stops working if any file changes.

### 6. Publish the listings

On Flipkart, if you created developer access for your own account, shows you the publish plan and on your yes sends exactly the signed-off products through Flipkart's seller API. Myntra, Nykaa, Ajio and Meesho had no public self-serve seller API we could confirm on 15 November 2026, so for them, and for Flipkart without developer access, this stage has no plan: you upload the signed-off sheet in the marketplace's seller panel yourself, and Ishita reads the result.

- **Needs:** listing-pack.md (signed off); Flipkart developer access at level 3 on your host, or you in the seller panel
- **Makes:** publish-record.md
- **Goes live:** Through the Flipkart Marketplace Seller API (Listing Management), using developer access you created for your own account: one step per product with exactly the signed-off fields and price. Other Indian marketplaces: you upload the sheet in their seller panel.
- **Done when:** publish-record.md lists each call or the upload, its time and its result, or what you uploaded and when.

### 7. Check the quality check result

Reads which products passed the marketplace's quality check and went live, which were rejected and why, and whether price, stock, images and Legal Metrology lines match the pack. Fixes come back to you as a new, smaller sheet; nothing is resubmitted without a yes.

- **Needs:** publish-record.md; the seller panel or API (read), or your screenshot of the listing status
- **Makes:** verify.md
- **Checks:** live-check (the live listings match the signed-off pack, and every rejection has a cause and a fix)
- **Done when:** verify.md lists each product as live and matching, or rejected with its cause and fix.

### 8. Day 30 review

Reads the first 30 days from settlement reports, not order counts: delivered orders, RTO and return rates by product and pin code, profit per delivered order after every fee and TCS, and seller ratings. Says keep, fix or stop for each product.

- **Needs:** settlement and returns reports (read); price-sheet.csv; context/goals.json
- **Makes:** results/readout.md
- **Checks:** numbers-check (every rate and total in the review recomputes from its own inputs); readout-review (profit per delivered order matches the settlement reports for the stated dates, TCS is matched, and each call follows the stop rule)
- **Done when:** readout.md gives per product delivered orders, RTO rate, profit per delivered order and one call, with dates and sources.

### 9. Write down what we learned

Adds a dated lesson to context/learnings.md about this marketplace: which products and prices held their margin, what was rejected and why, and where RTO ate the profit.

- **Needs:** results/readout.md; verify.md; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence and the next marketplace job can use it)
- **Done when:** learning.md holds one lesson with its evidence and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Listing pack for your approval:** You read the pack. Reply yes with the code to send exactly this sheet to the publish step. The code stops working if any file changes.
- **Publish the listings:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most sellers, profit per delivered order, counted on delivered orders, not placed ones).
- Guardrails: RTO rate and return rate per product, and the marketplace's seller ratings.
- Clean publish: every listing passes the marketplace's quality check, with Legal Metrology details matching the pack.
