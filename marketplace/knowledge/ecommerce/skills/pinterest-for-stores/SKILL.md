---
name: pinterest-for-stores
description: "Pinterest set up for a store's search traffic: business account, claimed site and tag, product catalog from the store's existing feed, 8 to 12 boards named for real search phrases, the first month of Pins written to Pinterest's own guidance (2:3 images, keyword titles under 100 characters, matching landing pages), a weekly posting rhythm with seasonal lead times, and a 90-day read of outbound clicks, store sessions and gross profit with the right attribution window. Starts with a fit check, since Pinterest pays for planned, visual purchases (home, fashion, beauty, food, gifts, weddings) more than for impulse buys. Use when a store's buyers plan on Pinterest, when Pinterest has been set up but ignored, or before testing Pinterest ads."
---

# Pinterest for a store

**You get:** a Pinterest account ready to grow: setup checklist done, catalog connected, a board plan, 30 written Pins, a weekly posting rhythm with seasonal dates, and a 90-day results sheet, ready for the client to approve and publish.

## When to use

- The store sells visual, planned purchases (home decor, fashion, beauty, recipes and food, gifts, weddings, crafts) and Pinterest is not set up.
- Pinterest exists but has a few old Pins, no catalog and no plan.
- Search traffic matters and the store wants a channel where posts keep working for months.
- Before running Pinterest ads, so organic Pins and the catalog are in place.

## Not for

- Pinterest ads and their budget test: use `test-a-new-ad-channel`.
- Fixing product feed titles for search across channels: use `write-product-feed-titles-that-match-searches`.
- Keyword research for the store's own pages: use `keyword-research-for-collections-and-products`.
- Instagram planning: use `plan-30-day-instagram-calendar`.

## What you need

Required (read access, level 1):

1. **Store URL** and platform (Shopify or other), and who controls the domain's DNS or theme.
2. **Product feed**: the Shopify product export or the existing Google Merchant Center feed, with id, title, description, link, image link, price, availability and variant group.
3. **Gross profit per order** by product, from `build-sku-profit-sheet`.
4. **Policy pages**: contact, shipping and refund pages live on the site.
5. **Photo library**: lifestyle and product images the store has rights to use.

Optional: GA4 access, past Pinterest analytics, seasonal sales calendar, blog posts or guides.

If the feed is missing, build it from the Shopify export or use Shopify's Pinterest sales channel, which syncs products. Creating the account, claiming the site and installing the tag need the client to sign in and grant access; the agent never handles passwords. Drafting Pins needs draft access (level 2). Publishing Pins or connecting a catalog needs the client's yes.

## Before you start: the gates

1. **Fit.** Pinterest fits when buyers plan before they buy. Check Pinterest's own search bar and Pinterest Trends (free) for the store's main product phrases. Pass when the phrases show rising or steady interest. Fail: say Pinterest is a low priority and stop here. Pick one hero platform where buyers are densest and treat others as extras [ORG-0022]; Pinterest earns hero status only for planning-led categories.
2. **Region.** Catalogs are not available in every region [ORG-6400]. Fail: plan standard Pins only.
3. **Merchant basics.** A claimed site, the Pinterest tag, and clear contact, shipping and refund pages are required for catalogs [ORG-6400]. Fail: fix those first.
4. **Gross profit per order** is known, so you know which products to push. Fail: compute it first.
5. **Capacity.** At least 1 to 2 hours a week for new Pins. Fail: post less, but every week.

## Steps

### 1. Set up the account (once)

Convert to or create a business account; claim the domain; install the Pinterest tag (Shopify's Pinterest app does both); confirm that the purchase event fires. Fill the profile with the store name, a keyword-rich description and the site link.

### 2. Connect the catalog

Use the store's existing feed. Required fields are id, title, description, link, image link, price and availability, plus item group id for products with variants; a missing or badly formatted required field fails the whole catalog [ORG-6400]. Hosted feeds are read daily, so the link must stay live. Group products into product groups by collection so they can be shown on boards and used later in ads. Fix feed titles with `write-product-feed-titles-that-match-searches` if they read like internal codes.

### 3. Build the keyword list

Type the store's main product words into Pinterest search and note the suggested phrases. Check each in Pinterest Trends. Keep 20 to 40 phrases, grouped by buyer use ("small balcony ideas", "minimal gold earrings for work") rather than by your collection names.

### 4. Plan the boards

Make 8 to 12 boards (practitioner default, test it), each named with a search phrase from step 3, each with a 1 to 2 sentence description using the phrase naturally. Pinterest says to put relevant keywords in board titles and descriptions as well as Pin titles and descriptions [ORG-6401]. Mix products with useful ideas: a board about "rental-friendly kitchen ideas" can hold the store's products and how-to Pins.

### 5. Write the first 30 Pins

Per Pin:

- **Image or video:** 2:3 vertical for images and videos, high quality, readable on a phone [ORG-6401]. Text on image, if any, is short and states the idea.
- **Title:** up to 100 characters, with the keyword phrase first.
- **Description:** up to 800 characters; Pinterest uses it to judge relevance even though it is not shown in feeds. Match it to the landing page [ORG-6401].
- **Link:** the exact product or collection page the Pin shows, with the store's UTM tags; always set source, medium and campaign [MEA-6221].
- **Board:** the best-fit board.

Write about two thirds of Pins for products with the highest gross profit, and one third as ideas, guides or how-tos that lead to those products.

### 6. Set the posting rhythm

Pinterest advises publishing fresh Pins of your own, frequently and consistently, aiming for original content weekly [ORG-6401]. Start with 3 to 5 new Pins a week (practitioner default, test it), each a new image or video, not the same image re-saved. Pins have no set engagement window and can resurface seasonally [ORG-6401], so publish seasonal Pins 45 to 60 days before the date (practitioner default, test it): festive gifting in India before Diwali and wedding season; in the US, Mother's Day, back to school, Halloween decor and holiday gifting.

### 7. Measure at 30, 60 and 90 days

Read in Pinterest analytics: impressions, saves, outbound clicks per Pin and per board. Read in GA4: sessions, add to carts and purchases from source pinterest. Pinterest's own conversion reports default to a 30-day click and 1-day view window [MEA-6100], longer than most ad platforms, so compare with GA4 and store orders before calling a win. Add Pinterest to the post-purchase "how did you hear about us" question with `post-purchase-how-did-you-hear-survey`.

At 90 days: if Pinterest sessions convert at a cost in team hours the client accepts and gross profit from tracked orders is rising, keep going and consider ads with `test-a-new-ad-channel`. If outbound clicks stay flat after 90 days of weekly Pins, cut to a monthly seasonal batch.

### 8. India and US notes

- **India:** Pinterest's audience is smaller than Instagram's and leans to fashion, wedding, jewellery and home inspiration. Check catalog availability for India in the account. Prices in the feed must match the store in rupees, including GST. If most orders are COD, Pinterest-tagged sessions may convert lower in GA4 because some orders are cancelled or returned; read delivered orders, not placed orders.
- **US:** Pinterest is a strong planning platform for home, food, events and gifts. Plan holiday Pins early; buyers search weeks before.

## Checks before you hand it over

- Site claimed, tag firing and policy pages present, or the gap is listed.
- Catalog passes ingestion with all required fields, or the failing fields are named.
- 8 to 12 boards, each named and described with a real search phrase.
- 30 Pins written, all 2:3, titles under 100 characters, each linking to the matching page with UTM tags.
- Two thirds of product Pins feature the highest gross profit products.
- Seasonal Pins are dated 45 to 60 days ahead.
- The 90-day read compares Pinterest, GA4 and store orders.
- Nothing is published without the client's yes.

## Output

1. **One-screen summary:** the fit verdict, setup status, boards, products featured and why, weekly rhythm and hours, seasonal dates, and the 90-day keep-or-cut rule.
2. **Setup checklist**: Item, Status, Owner, Note (business account, claimed site, tag, purchase event, policy pages, catalog, product groups).
3. **Board plan**: Board name (search phrase), Description, Keyword group, Products or ideas it holds.
4. **Pin sheet** (`pinterest-pins-<month>.csv`): Pin number, Publish date, Board, Product, Image or video file, Text on image, Title, Description, Link with UTM, Season tag, Status.
5. **Results sheet**: Month, Impressions, Saves, Outbound clicks, GA4 sessions, Orders, Delivered orders, Gross profit, Hours spent, Verdict.

## Common mistakes

- **Setting up Pinterest for an impulse product.** The fit gate checks search interest first.
- **Re-saving the same image over and over.** Step 6 asks for fresh Pins.
- **Boards named after internal collections.** Step 4 uses search phrases.
- **Pins that link to the home page.** Step 5 links to the matching page.
- **Calling a win on Pinterest's own conversions.** Step 7 compares with GA4 and orders.
- **Posting holiday Pins the week before.** Step 6 sets 45 to 60 days ahead.

## Sources

- MEA-6100: Pinterest's default 30-day click, 1-day view window.
- MEA-6221: always set UTM source, medium and campaign.
- ORG-0022: one hero platform where buyers are densest.
- ORG-6400: catalog requirements and required feed fields.
- ORG-6401: keywords, fresh weekly Pins, 2:3 format, matching links, no engagement window.

What makes this skill ours: it starts with a fit check so stores that will not earn from Pinterest stop early; the catalog reuses the store's existing feed; Pins favour products by gross profit; seasonal lead times and attribution windows are set from Pinterest's own documentation; and the 90-day verdict reads delivered orders, not platform clicks.
