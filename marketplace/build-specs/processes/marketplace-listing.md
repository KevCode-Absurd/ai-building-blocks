# Marketplace listings outside Amazon and India, from data to live

Listings for eBay, Walmart, bol, Zalando, Etsy or another marketplace outside Amazon and India, built from your real product data with a price floor per item, images reworked to that marketplace's guide, checked for rules and claims, published only with your yes on the exact sheet, and reviewed after 30 days.

**Starts from:** A decision to sell on a new marketplace (often after a new marketplace entry plan), new products for a marketplace you already sell on, or listings that are rejected or convert poorly. Amazon listings go to the Amazon listing process; Flipkart, Myntra, Nykaa, Ajio and Meesho go to the India marketplace listing process.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Sudhir (sudhir-marketplaces) | intake.md, fact-sheet.md | intake-complete | no | read |
| 2 | Price floors and what you keep | Sudhir (sudhir-marketplaces) | price-sheet.csv, price-notes.md | margin-check | no | draft |
| 3 | Field map, titles and attributes | Sudhir (sudhir-marketplaces) | field-map.md, listing.md, upload/bulk-sheet.csv | copy-lint, proof-check, copy-review, compliance-review | no | draft |
| 4 | Images for this marketplace | Tanvi (tanvi-listing-images) | images/images.md | image-review, compliance-review | no | draft |
| 5 | Listing pack for your approval | Sudhir (sudhir-marketplaces) | listing-pack.md | pack-complete | yes | draft |
| 6 | Publish the listings | Sudhir (sudhir-marketplaces) | publish-record.md | none | yes, the plan | publish |
| 7 | Check what went live | Sudhir (sudhir-marketplaces) | verify.md | live-check | no | read |
| 8 | Day 30 review | Sudhir (sudhir-marketplaces) | results/readout.md | numbers-check, readout-review | no | read |
| 9 | Write down what we learned | Callum (callum-reporting) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects the facts first: which marketplace and country, why (the gap or buyers we want to reach), your product data with identifiers such as GTINs, costs, the marketplace's fee invoice or rate card, current listings and their errors, account health, and for EU sales the manufacturer and EU responsible person for each product. Writes down the access level you grant for each marketplace. Opening a seller account, signing the agreement and entering identity, tax and bank details stay with you every time.

- **Needs:** context/org-context/ (customers, voice, claims, do's and don'ts); context/goals.json; context/learnings.md; product data export from your shop; the marketplace's fee invoice, rate card and listing export; the task that started this job
- **Makes:** intake.md, fact-sheet.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, fees carry their date, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the marketplace, country, buyers, products, fees with their source and date, account health, access level and answered questions; fact-sheet.md lists every product fact with its source.

### 2. Price floors and what you keep

Works out what you keep on each item after the marketplace's commission, fees, shipping, returns and payment costs, then sets a floor and a target price per item. Items that lose money at any sensible price are flagged, not listed.

- **Needs:** intake.md; your cost sheet
- **Makes:** price-sheet.csv, price-notes.md
- **Checks:** margin-check (every fee on the marketplace's invoice or rate card is counted, the floors cover landed cost, fees, shipping and returns, and the working is shown)
- **Done when:** price-sheet.csv gives each item's cost, fees, floor and target price, and price-notes.md shows the working and names the items not to list.

### 3. Field map, titles and attributes

Maps your product data to the marketplace's own template field by field, then fills the bulk sheet: titles in the order that marketplace's buyers search, attributes from real data, descriptions that answer buyer doubts, and safety details where the country needs them. Missing facts become questions, never guesses.

- **Needs:** fact-sheet.md; price-sheet.csv; the marketplace's current listing template; context/org-context/ voice and claims
- **Makes:** field-map.md, listing.md, upload/bulk-sheet.csv
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up stats)); proof-check (every figure in the listings is backed by the fact sheet or the Org context); copy-review (titles follow how this marketplace's buyers search, attributes come from real data, and descriptions answer real doubts); compliance-review (no restricted products or wording for this marketplace, no unproven claims, images follow its guide, and safety and responsible person details for the country are present)
- **Done when:** Every item has every required field filled from a named source in bulk-sheet.csv, prices sit at or above their floor, and listing.md shows the copy in readable form.

### 4. Images for this marketplace

Reworks your image set to this marketplace's current image guide (background, sizes, what is allowed on the main image), and adds a back-of-pack image where your market's rules say buyers must be able to read the labelling. Uses your real product photos; nothing is redrawn by a model, and there is no paid generation without your yes and the cost.

- **Needs:** listing.md; your real product photos and logo; the marketplace's current image guide
- **Makes:** images/images.md
- **Checks:** image-review (the product is the real one, each image meets the marketplace's guide, and text is readable at phone size); compliance-review (no restricted products or wording for this marketplace, no unproven claims, images follow its guide, and safety and responsible person details for the country are present)
- **Done when:** images.md lists every image per item with its file, size and the rule it meets.

### 5. Listing pack for your approval

Puts the exact upload on one page: each item with its title, key attributes, price against its floor and images, the number of items, and how it will be published. The first listing on a new marketplace or in a new country always needs this yes.

- **Needs:** upload/bulk-sheet.csv; listing.md; price-sheet.csv; images/images.md
- **Makes:** listing-pack.md
- **Checks:** pack-complete (every item in the sheet appears in the pack with its price, floor and images, and nothing differs from the sheet)
- **Done when:** listing-pack.md shows every item, price, floor and image, the item count, and the publish route.
- **You sign off:** You read the pack. Reply yes with the code to send exactly this sheet to the publish step. The code stops working if any file changes.

### 6. Publish the listings

Where you set up the marketplace's official seller API or an official connector for it, shows you the publish plan and on your yes uploads exactly the signed-off sheet. Where there is none, this stage has no plan: you upload the signed-off sheet in the marketplace's own seller panel yourself, and Sudhir reads the processing report. The exact route for each marketplace is checked on its own developer or seller help pages before the first upload.

- **Needs:** listing-pack.md (signed off); the marketplace at level 3 through its official API or connector, or you in its seller panel
- **Makes:** publish-record.md
- **Goes live:** Through the marketplace's official seller API or connector, set up by you: one upload of the signed-off bulk sheet, or one create call per item with exactly the signed-off fields. Without one, you upload the sheet in the seller panel.
- **Done when:** publish-record.md lists the upload or each call, its time and its submission id, or what you uploaded and when.

### 7. Check what went live

Reads the marketplace's processing report and the live listings: which items went live, which were rejected and why, and whether price, stock and images match the pack. Rejection fixes come back to you as a new, smaller sheet; nothing is resubmitted without a yes.

- **Needs:** publish-record.md; the marketplace (read)
- **Makes:** verify.md
- **Checks:** live-check (the live listings match the signed-off pack, and every rejection has a cause and a fix)
- **Done when:** verify.md lists each item as live and matching, or rejected with its cause and fix.

### 8. Day 30 review

Reads the first 30 days: orders, what you kept per order after every fee, returns and their reasons, buyer messages and cases, and account health against the marketplace's standards. Says keep, fix or stop for each item, against the stop rule in the entry plan if there is one.

- **Needs:** the marketplace's orders, fees and performance reports (read); price-sheet.csv; context/goals.json
- **Makes:** results/readout.md
- **Checks:** numbers-check (every rate and total in the review recomputes from its own inputs); readout-review (kept per order matches the marketplace's payout report for the stated dates, and each call follows the stop rule)
- **Done when:** readout.md gives per item orders, kept per order, return rate and one call, with dates and sources.

### 9. Write down what we learned

Adds a dated lesson to context/learnings.md about this marketplace: which items and prices worked, what got rejected and why, and what to change on the next upload.

- **Needs:** results/readout.md; verify.md; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence and the next listing writer can use it)
- **Done when:** learning.md holds one lesson with its evidence and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Listing pack for your approval:** You read the pack. Reply yes with the code to send exactly this sheet to the publish step. The code stops working if any file changes.
- **Publish the listings:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most sellers, what you keep per order after the marketplace's fees, shipping and returns).
- Health: listings live without rejections, and the marketplace's seller standards (for example late shipment and defect rates) inside its limits.
- Clean publish: what the marketplace shows matches the signed-off sheet, and every rejection was fixed within two days.
