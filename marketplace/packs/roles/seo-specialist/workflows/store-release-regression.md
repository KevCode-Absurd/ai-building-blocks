# Ecommerce release regression check

**Trigger:** a store theme, catalogue, navigation, variant selector, feed integration or market configuration changes. Use the site-migration workflow for a domain or URL migration; this check covers routine releases that can quietly damage product discovery or buying.

**Outcome:** a reproducible before/after evidence pack, a ranked defect list and a release recommendation. A successful crawl is not proof of indexing, revenue lift or a successful checkout.

## 1. Freeze the merchant baseline

Record brand, store/domain, environment, market, currency, release ID, capture time and source hashes. Preserve the last reviewed baseline; write the new capture separately. If no comparable baseline exists, produce a current-state audit and say regression is unproven. Do not manufacture a before state from memory.

Select representative URLs from the actual changed templates and commercial exposure: top organic landing collections, high-contribution products where known, new products, multi-variant products, temporarily unavailable products, discontinued products, paginated collections and relevant markets. Record selection reasons, total known affected URLs, sampled count and untested templates. Unknown revenue exposure stays unknown. Do not call a sample a full-store audit.

## 2. Inspect discovery and the purchase destination

For each URL, capture the request/response and rendered observations with timestamps:

- HTTP status, redirect destination/chain, canonical, robots meta/header and robots.txt accessibility; distinguish staging restrictions from unintended live restrictions.
- Title/H1, product and collection links, navigation and pagination; verify products beyond the first screen are discoverable through crawlable links. Paginated collection pages need their own URLs and canonicals, not a blanket canonical to page one.
- Product/variant identity, selected SKU, image, displayed price/currency, availability and structured-data values. For variant markup, check distinct variant IDs and the appropriate single-page or multi-page ProductGroup model. A valid JSON document alone does not establish valid or accurate product markup.
- Consistency among the customer-visible product, cart, structured data and the feed export, if provided. Report mismatches by SKU, market and capture time; distinguish feed lag from proven ongoing disagreement.
- Shipping, returns and offer conditions visible at the destination. On an authorized test store, verify variant selection and cart behavior and save the readback. Do not place a live order merely to complete an SEO check. Hand purchase-path defects to the store/CRO owner with exact reproduction steps.

Treat missing pages, blocked requests and missing feed/Search Console access as incomplete evidence, not zero defects. Distinguish raw HTML, rendered DOM, lab performance and observed Search Console data. Do not infer current indexing from a local crawl, or field Core Web Vitals from a single lab run.

## 3. Make intent-specific decisions

Compare each observation with the approved release changes and the pinned baseline. Separate expected changes, verified regressions, pre-existing defects and unresolved differences. A price/stock change can be legitimate; a mismatch needs a source-of-truth check before correction.

Do not canonicalize every filter to its parent or redirect every discontinued SKU to a category. Evaluate search intent, distinct useful inventory, replacement equivalence and the merchant's lifecycle policy. Explain each proposed mapping. A robots.txt block prevents a crawler from reading a page's noindex directive; do not promise removal from indexing by combining the two blindly.

Rank verified defects using affected purchase paths/templates, observed organic exposure, inventory and contribution where available, severity, confidence and reversibility. Keep projected lost revenue separate from measured loss. Avoid summing overlapping URL/template exposure. Name an owner, smallest fix, rollback condition and retest for each actionable defect.

## 4. Close the loop without erasing evidence

Deliver `release-check.csv` with URL/SKU, market, before/after references, expected change, finding status, severity, confidence, owner and retest; include raw captures, sample coverage and a short recommendation. Record missing evidence and an explicit scope limit for any go/no-go recommendation. Only make authorized changes; verify deployed state independently of a successful write response.

After fixes, rerun the affected cases and an unchanged control template. Preserve failures and new receipts. Promote a new baseline only after the responsible owner reviews the changes. Plan later Search Console and purchase-outcome review around available data maturity; a clean release check does not establish causal sales lift. Use existing job/intervention memory to retain the hypothesis, release, receipts and review date rather than creating a second merchant history.

## Technical references

Checked 2026-11-17; recheck if platform behavior changes:

- [Google: pagination and incremental loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading).
- [Google: product variant structured data](https://developers.google.com/search/docs/appearance/structured-data/product-variants).
- [Google: noindex and crawler access](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Original ecommerce release contract informed by reviewing the baseline/compare/review pattern in [NotFair](https://github.com/nowork-studio/notfair-plugin) commit `deed0436d0c68cbc20a78523fffc67edd12aa25c`. No NotFair code, prompts or hosted capabilities are included in this workflow.
