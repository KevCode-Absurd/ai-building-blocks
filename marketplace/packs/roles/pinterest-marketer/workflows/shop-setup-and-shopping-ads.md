# Shop set-up and shopping ads

**Trigger:** an online shop wants its products on Pinterest, or wants to run shopping ads, or its Pinterest conversions don't match its sales.

**Goal:** the pieces Pinterest shopping depends on, set up in order and checked, then a first shopping campaign with a cap and working tracking.

## Steps

1. **Business account and claimed site** (level 1 to check; the client or their developer adds the tag or DNS record). A free business account, and the website claimed by HTML tag, HTML file or DNS TXT record. Marketplace shops (Etsy, eBay, Amazon) generally can't be claimed.
2. **Pinterest tag and events** (level 1 to check; level 2 to write the steps for the developer or the shop platform's Pinterest integration). Base code on every page; PageVisit, AddToCart and Checkout events, with currency and a product ID on checkouts (the Verified Merchant Program asks for both); event_id on each event.
3. **API for Conversions** (optional, through a partner or a developer). Server events alongside the tag, deduplicated by event_id; the token is created in Ads Manager and stays in the server or partner settings. Aim for a "Good" Event Quality Score.
4. **Product Rich Pins.** Open Graph or Schema.org product markup on product pages, so Pins show current price and stock.
5. **Catalog** (level 2 to prepare feed fixes; level 3 to fix product data the client approved, if the shop platform allows). A CSV, TSV, XML or Google Sheets feed with id, title, description, link, image_link, price and availability (item_group_id for variants), price and stock current within seven days. Fix errors until most products ingest.
6. **Merchant check.** Return policy and contact details easy to find; each product Pin shows one item for sale; no affiliate or wholesale catalog.
7. **Verified Merchant Program** (automatic once eligible). Note which requirements are met and which aren't yet (account age, site age, catalog ingestion, weekly events).
8. **First shopping campaign** (skill: `seasonal-pin-calendar` for timing; level 2 to build paused). Sales objective, product groups starting from all products, Performance+ bidding as Pinterest recommends at launch, a daily cap the client sets.
9. **Approval and launch.** A new campaign and its cap always need the client's yes. At level 3, launch it and log the time.
10. **First review after two to four weeks.** Conversions in Ads Manager against shop orders from Pinterest, cost per sale against the product margins, product groups that spend without sales.

## Outputs

- Set-up checklist with pass or fix for each step.
- Developer steps for the tag, events and markup.
- Feed fix list.
- Shopping campaign build sheet (paused) and launch log.
- First review note.

## Approval

**Always needs the client's yes:** any change to website code, the tag or DNS (the client or their developer makes it), the catalog source, a new ad account, every new campaign and its cap, spend above the cap, and any customer list upload.

**At level 3, inside the agreed limits:** product data fixes the client approved, bid and budget changes within the cap on the launched campaign, and pausing product groups that meet the agreed stop rule.
