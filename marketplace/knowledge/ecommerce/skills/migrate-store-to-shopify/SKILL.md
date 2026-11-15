---
name: migrate-store-to-shopify
description: "A migration plan that moves a store from WooCommerce or another platform to Shopify without losing products, customers, orders, URLs or search rankings: an inventory of what exists, a field map, a URL redirect map for every page that has traffic or links, a dated cut-over plan with a freeze window, a test plan, and a 30-day watch on rankings, organic traffic and orders. Free migration tools and CSV first, paid importers only for what they cannot move. Covers customer account re-activation, consent records for email and SMS, gift card and subscription balances, and local tax and payment settings. Use when a store has decided to move to Shopify, or is choosing a cut-over date."
---

# Move a store to Shopify

**You get:** a migration workbook with 5 tabs (inventory, field map, redirect map, cut-over plan, test and watch log), a dated cut-over plan with a go or roll-back rule, and a 30-day watch report template, ready for the client to approve before anything moves.

## When to use

- The owner has decided to leave WooCommerce, Magento, Wix, Squarespace or another platform for Shopify.
- A migration is half done and rankings or orders dropped after go-live.
- A cut-over date is being chosen and the team needs a freeze window and roll-back rule.

## Not for

- Deciding whether to migrate at all: compare total cost and team skills first with the client.
- A full technical SEO audit after migration: use `technical-seo-audit-shopify`.
- Rebuilding the theme or page designs: use `shopify-theme-section-builder`.
- Setting up tracking from zero on the new store: use `set-up-ga4-for-store-and-check-data`.

## What you need

Required:

1. **Exports from the old platform**: products with variants, images, SEO titles and descriptions; customers with marketing consent fields; orders (at least 2 years if the client wants history); pages and blog posts; discount codes; gift card balances; subscription records if any.
2. **A full URL list** of the old site: the XML sitemap plus a crawl with a free crawler (or the free tier of a paid one).
3. **Google Search Console** access (read) for the old domain, with the last 16 months of pages by clicks, and a backlinks export from any free or paid tool.
4. **GA4 or old analytics**: sessions and revenue by landing page, last 12 months.
5. **List of apps and integrations** on the old store (payments, shipping, email, reviews, ERP, tax invoices).

Optional: past order volume by month (to pick a quiet week), staff list.

Reading is level 1. Imports, redirects and theme work happen in the new store at level 2, before launch. DNS changes and switching off the old store are live: the client does them or approves each one.

## Before you start: the gates

1. **Business case is signed.** The client has written why they are moving and the monthly cost both sides. Fail: stop.
2. **Quiet window exists.** Pass when a cut-over week avoids sales, launches and peak season. Fail: move the date; never migrate in the 6 weeks before a peak.
3. **Gross profit per order is known** so the post-launch watch can judge the new store [MEA-0037]. Fail: compute it from the old store's data first.
4. **Data rules.** Customer data moves only between the client's own systems; consent records move with it. Passwords and card data never move; ask nobody for them.

## Steps

### 1. Inventory

Count everything: products, variants, images, collections or categories, customers, orders, pages, posts, redirects already in place, discount codes, gift cards, reviews, subscriptions. These counts are the acceptance test: after import, each must match or the gap must be explained.

### 2. Rank URLs by value

From Search Console, analytics and backlinks, list every old URL with clicks in the last 16 months, revenue, or an external link. These are the URLs that must redirect to the closest match. On stores with more than about 50 products, collection pages tend to carry most organic revenue [SEO-0003], so category URLs come first.

### 3. Map fields

Map each old field to Shopify: product type, vendor, tags, metafields for specs, variant options (Shopify limits options per product, so complex products may need splitting), SEO title and description, image alt text. Map old categories to collections; use automated collection rules where tags allow (`set-up-navigation-and-collections`).

### 4. Build the redirect map

Shopify uses fixed paths (`/products/`, `/collections/`, `/pages/`, `/blogs/`), so almost every old URL changes. For each ranked URL: old path, new path, type of match (exact product, parent collection, closest page). Never send everything to the home page. Import the map through Shopify's URL redirect CSV import. Also remove the `within: collection` product links from the theme so product URLs stay canonical [SEO-0004]. Assistants send many visits to 404 pages, so redirect any old URL with AI referrals too [AEO-0008].

### 5. Import in order

1. Products and collections (free migration app or CSV), then check counts and 10 random products by eye.
2. Customers with marketing consent flags. Customer passwords cannot move; plan an account invite email after launch.
3. Orders for history, using Shopify's migration tool where it supports the source platform, otherwise a paid importer; test with 50 orders first.
4. Gift card balances and open subscriptions: recreate with exact balances and next charge dates; a subscription that double-charges or stops is the costliest error.
5. Reviews: export and import with dates and ratings kept; never re-write or invent reviews.

### 6. Rebuild settings

Payments, shipping, tax, policies, notifications and tracking, using `launch-new-shopify-store-checklist`. Local settings: sales tax or VAT rates and any tax invoice tool, local payment methods, pay on delivery rules if used, postcode delivery settings, and the SMS or WhatsApp provider. Remove old platform scripts from anything carried over; WooCommerce loads shop scripts on every page [SPD-0014], and those habits should not be rebuilt on Shopify.

### 7. Test before cut-over

On the password-protected Shopify store: counts match the inventory; 20 sample redirects resolve with one hop; test orders through every payment path [SET-0003]; tracking fires once; emails show the right sender. Crawl the new store and fix broken links.

### 8. Cut-over plan

- **Freeze:** stop product edits on the old store 48 hours before; take a last delta export of orders and customers after the freeze.
- **Go:** the client points DNS to Shopify, the redirect map is live, the new sitemap is submitted to Google and Bing [AEO-0028], and Search Console gets the new sitemap.
- **Roll-back rule:** if checkout fails or orders drop to zero for 2 hours in trading time, point DNS back. Keep the old store running read-only for 30 days.
- After go: send the account invite email to customers who had accounts, with plain words on why.

### 9. 30-day watch

Daily for 7 days, then weekly: orders and gross profit per order against the same weeks last year; organic clicks from Search Console by top 50 URLs; 404s from Search Console and the store's own logs; redirects with chains; GA4 data retention set and internal traffic filtered [MEA-0003]. Shopify sessions include bot traffic GA4 removes, so compare traffic in GA4, not Shopify, against the old analytics [MEA-0012]. A dip in rankings for 2 to 4 weeks is common; a URL that lost traffic and returns 404 is a bug to fix that day.

## Checks before you hand it over

- Product, customer, order, gift card and review counts match the inventory, or each gap is explained.
- Every ranked URL has a redirect to a relevant page, with no chains and no home-page dumps.
- Consent flags for email and SMS came across; nobody is subscribed who was not.
- Subscriptions and gift cards show exact balances and dates on 10 spot checks.
- Test orders pass on every payment path, including each local payment method and pay on delivery if offered.
- The cut-over plan has a freeze time, an owner for DNS, and a roll-back rule.
- No password, card number or API secret appears in the workbook.

## Output

**One-screen summary:** what moves, what does not (passwords, some app data), cut-over date, freeze window, roll-back rule, and the 3 biggest risks with owners.

**Workbook tabs:**

1. **Inventory:** Item, Old count, New count, Gap, Reason.
2. **Field map:** Old field, Shopify field, Transform rule, Example.
3. **Redirect map:** Old URL, Clicks (16 months), Revenue, Backlinks, New URL, Match type, Tested (yes or no).
4. **Cut-over plan:** Step, Date and time, Owner, Done, Notes.
5. **Watch log:** Date, Orders, Gross profit per order, Organic clicks (top 50 URLs), New 404s, Fixes made.

## Common mistakes

- **Redirecting everything to the home page.** Rankings drop. Step 4 maps each URL to its closest match.
- **Forgetting collection URLs.** They carry most organic revenue on larger stores [SEO-0003]. Step 2 ranks them first.
- **Importing customers without consent flags.** That turns a migration into a spam problem. Step 5.
- **Subscriptions recreated by hand without dates.** Step 5 checks balances and next charge dates.
- **Migrating in peak season.** Gate 2.
- **Judging the move on Shopify's own sessions.** They include bots [MEA-0012]; step 9 uses GA4.

## Sources

- SEO-0003: collection pages carry most organic revenue on larger Shopify stores.
- SEO-0004: remove collection-scoped product links to keep canonical URLs.
- AEO-0008: redirect AI-referred 404s.
- AEO-0028: submit the sitemap to Google and Bing.
- SPD-0014: WooCommerce loads shop scripts on every page.
- SET-0003: test orders before removing the password.
- MEA-0003: GA4 retention and internal traffic filter.
- MEA-0012: Shopify sessions include bot traffic GA4 filters.
- MEA-0037: gross margin uses delivered cost.

What makes this skill ours: URLs are ranked by clicks, revenue and links before mapping; the import order protects the costliest errors (subscriptions, gift cards, consent); the cut-over has a freeze window and a written roll-back rule; and the 30-day watch judges the move on gross profit per order and GA4 traffic, not Shopify sessions.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Move GST rates and the GST invoice tool, COD rules, pincode settings and the WhatsApp provider. Test orders must pass on COD and UPI.
