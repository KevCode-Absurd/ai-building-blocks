# Amazon listing, from facts to live and checked

A new or improved Amazon listing (title, bullets, description, search terms, main and secondary images, and A+ content where you have Brand Registry), checked for rules and claims, published only with your yes on the exact change, read back from Amazon, and judged on sessions and conversion after 30 days.

**Starts from:** A new product going on Amazon (including Amazon.in), a listing that converts poorly, a suppressed or flagged listing, or you asking for a listing refresh. Indian marketplaces other than Amazon.in go to the India marketplace listing process; eBay, Walmart, bol, Zalando and Etsy go to the marketplace listing process.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Garrett (garrett-amazon) | intake.md, fact-sheet.md | intake-complete | no | read |
| 2 | Title, bullets, description and search terms | Garrett (garrett-amazon) | listing.md, term-map.csv, image-brief.md | copy-lint, readability, proof-check, copy-review, compliance-review | no | draft |
| 3 | Main image, secondary images and A+ | Tanvi (tanvi-listing-images) | images/images.md, images/aplus.md | image-review, logo-contrast, compliance-review | no | draft |
| 4 | Listing pack for your approval | Garrett (garrett-amazon) | listing-pack.md | pack-complete | yes | draft |
| 5 | Publish the listing | Garrett (garrett-amazon) | publish-record.md | none | yes, the plan | publish |
| 6 | Check what Amazon shows | Garrett (garrett-amazon) | verify.md | live-check | no | read |
| 7 | Day 30 readout | Garrett (garrett-amazon) | results/readout.md | numbers-check, readout-review | no | read |
| 8 | Write down what we learned | Callum (callum-reporting) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects the facts before anyone writes: who buys this, the doubts they raise in reviews, questions and return reasons, the product facts and claims we can prove, the rival listings we compete with, the last 90 days of sessions and conversion by child ASIN, Brand Registry status, and which stores (for example amazon.com, amazon.co.uk, amazon.in) this covers. Lists the access that exists for Seller Central today and at which level. Gaps become questions for you.

- **Needs:** context/org-context/ (customers, voice, claims, do's and don'ts); context/goals.json; context/learnings.md; Seller Central Business Report by child ASIN and the current listing (read), or their downloads; rival listings and reviews you pasted or exported; the task that started this job
- **Makes:** intake.md, fact-sheet.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, every fact in fact-sheet.md has a source, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the buyer, the top doubts with their source, the stores, the access level, the current numbers with dates, and the answered questions; fact-sheet.md lists every product fact with its source.

### 2. Title, bullets, description and search terms

Builds a term map from real search data (Brand Analytics, Product Opportunity Explorer or a keyword tool export, marked as estimates), then writes the title, five bullets, description and backend search terms. Each bullet answers a real buyer doubt with a fact from the fact sheet. Nothing is invented: no size, material, certificate or 'best' claim without proof. Also writes the A+ outline and the image brief for the designer.

- **Needs:** intake.md; fact-sheet.md; context/org-context/ voice and claims
- **Makes:** listing.md, term-map.csv, image-brief.md
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up stats)); readability (the readability checker exits 0 for a consumer audience); proof-check (every figure in the listing is backed by the fact sheet or the Org context); copy-review (the title leads with what people search, each bullet answers a real doubt with a fact, and no line could be published unchanged by a rival); compliance-review (no Amazon listing policy problems, no unproven or restricted claims for the category, images follow Amazon's image rules, and required safety or responsible person details for the stores are present)
- **Done when:** listing.md has the title, five bullets, description and search terms, each claim marked with its source, and image-brief.md lists each image with the doubt it answers.

### 3. Main image, secondary images and A+

Checks and fixes the main image to Amazon's rules (pure white background, the product filling the frame, no added text, props or logos), then makes six to eight secondary images from your real product photos: what it does, size and scale, in use, what is in the box, and a comparison, each answering a doubt from the brief. With Brand Registry, lays out the A+ modules with their text and alt text. Your real product and logo are laid on with an editing tool, never redrawn by a model. Uses no paid image generation; if a scene would need it, she asks you first with the cost.

- **Needs:** image-brief.md; listing.md; your real product photos and logo; context/org-context/ design rules
- **Makes:** images/images.md, images/aplus.md
- **Checks:** image-review (the product is the real one, text on secondary images is exact and readable at phone size, and each image answers its doubt from the brief); logo-contrast (every secondary or A+ image that carries the logo has a contrast ratio of at least 3 to 1); compliance-review (no Amazon listing policy problems, no unproven or restricted claims for the category, images follow Amazon's image rules, and required safety or responsible person details for the stores are present)
- **Done when:** images.md lists the main image and each secondary image with its file, size and the doubt it answers; aplus.md lists each module with its image, text and alt text, or says A+ does not apply.

### 4. Listing pack for your approval

Puts the exact change on one page: the current listing beside the new one, field by field, every image in order, the A+ modules, the stores it goes to, and how it will be published. Says plainly what cannot be undone quickly (A+ goes through Amazon's moderation, which Amazon's guide says can take up to 7 business days).

- **Needs:** listing.md; images/images.md; images/aplus.md
- **Makes:** listing-pack.md
- **Checks:** pack-complete (every field and image in the pack is present with its old and new version, the stores are named, and nothing differs from listing.md and images.md)
- **Done when:** listing-pack.md shows old and new side by side for every field and image, the stores, and the publish route.
- **You sign off:** You read the pack. Reply yes with the code to send exactly this to the publish step, or say what to change. The code stops working if any file changes.

### 5. Publish the listing

Shows you the publish plan, then on your yes runs it. The first step is Amazon's own dry run (validation preview), which checks the change without saving it; if it returns any error, the plan stops and comes back to you. Then it sends the same change for real, and submits the A+ document for Amazon's review. In Claude, the Amazon Selling Partner plugin (beta, US stores) can act on your account with your approval; check in its permission screen which listing actions it allows. Without an API tool or the plugin, this stage has no plan: you paste the signed-off fields into Seller Central yourself, and Garrett reads them back.

- **Needs:** listing-pack.md (signed off); Seller Central at level 3: a Selling Partner API app on your host, or the Amazon Selling Partner plugin, or you in Seller Central
- **Makes:** publish-record.md
- **Goes live:** Through the Selling Partner API (your own private app, Product Listing role): Listings Items API patchListingsItem for edits (putListingsItem only for a new listing, because it replaces the whole listing), first with mode VALIDATION_PREVIEW and then for real, images given as main_product_image_locator and other_product_image_locator links to your hosted files; then the A+ Content API createContentDocument, postContentDocumentAsinRelations and postContentDocumentApprovalSubmission.
- **Done when:** The dry run returned VALID, the real call returned ACCEPTED, the A+ document shows SUBMITTED, and publish-record.md lists each call, its time and its submission id; or, if you pasted it yourself, publish-record.md records what you entered and when.

### 6. Check what Amazon shows

ACCEPTED only means Amazon took the change for processing, not that it went live. A day later, reads the listing back (getListingsItem with its issues and status), compares every field and image with the pack, checks for suppression, new issues and Featured Offer status, and follows the A+ document until it is APPROVED or REJECTED. A rejection or a field Amazon changed comes back to you with the fix as a new plan.

- **Needs:** publish-record.md; Seller Central (read)
- **Makes:** verify.md
- **Checks:** live-check (the live listing matches the signed-off pack field for field and image for image, and every difference has a cause and a fix)
- **Done when:** verify.md shows each field and image as live and matching, or names the difference, its cause and the fix, plus the A+ status.

### 7. Day 30 readout

Compares 30 days of sessions, unit session percentage and units by child ASIN with the 30 days before the change, and notes anything else that moved (price, stock, ads, season), so the listing is not credited with someone else's change. Says keep, adjust or roll back, with the deciding number.

- **Needs:** Seller Central Business Report by child ASIN (read); warehouse view ads_daily for Amazon, if ads run; context/goals.json
- **Makes:** results/readout.md
- **Checks:** numbers-check (every rate and total in the readout recomputes from its own inputs); readout-review (the before and after periods are the same length, the numbers match the Business Report for the stated dates, and other changes in the period are named)
- **Done when:** readout.md gives before and after numbers with their dates, the other changes in the period, and one call with its reason.

### 8. Write down what we learned

Adds a dated lesson to context/learnings.md: which doubt, image or term change moved conversion, how sure we are, and what to try on the next listing. Small samples are marked as hunches.

- **Needs:** results/readout.md; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the sample, and the next listing writer can use it)
- **Done when:** learning.md holds one lesson with its evidence and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Listing pack for your approval:** You read the pack. Reply yes with the code to send exactly this to the publish step, or say what to change. The code stops working if any file changes.
- **Publish the listing:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most listings, unit session percentage, Amazon's conversion rate, and units sold per week by child ASIN).
- Health: no suppression, no listing issues of severity ERROR, and the Featured Offer kept.
- Clean publish: what Amazon shows matches the signed-off pack word for word and image for image.
