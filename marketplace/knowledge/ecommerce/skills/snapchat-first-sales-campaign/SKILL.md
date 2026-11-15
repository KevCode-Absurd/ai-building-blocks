---
name: snapchat-first-sales-campaign
description: "Takes a store from no Snapchat ads to a first Sales campaign built paused for the owner's yes: Snap Pixel through the official Snapchat Ads app for Shopify and Conversions API server events passing one real test order once (shared order ID for deduplication, hashed email or phone), the campaign planned on the store's allowed cost per order, budget funded to Snap's own learning guide inside the owner's cap, broad targeting with buyers excluded, Snap-native creative to spec (full-screen 9:16, offer in the first two seconds, sound on), and a 14-day sheet with test and stop rules read on store orders. Works in any country Snap serves (US, UK, Canada, Australia, France, Saudi Arabia and others), including stores with many failed or refused deliveries. Use when a store wants to start Snapchat ads, restart an account that spent without tracked sales, or add Snap beside Meta or TikTok."
---

# First Snapchat Sales campaign

**You get:** a launch pack with a tracking pass on a real order, one Sales campaign (ad sets, ads, budgets, names) built paused, the creative list to Snap's specs, and a 14-day sheet with one test rule and one stop rule per ad set on store numbers, ready for the owner's yes.

## When to use

- The store has never run Snapchat ads and its buyers are mostly under 35.
- An old Snap account spent money with no purchases the store can see.
- Meta or TikTok works and the owner wants a second short-video channel using vertical video already on hand.
- The store sells where Snapchat is widely used by young buyers (for example the US, UK, France, the Nordics, Australia, Saudi Arabia and the UAE).

## Not for

- A tracking rebuild across every channel: use `set-up-utm-tracking-for-all-channels` and the store's tracking specialist; this skill needs only the launch pass.
- Writing scripts or shooting video: use `write-one-page-creative-brief`, `product-demo-in-15-seconds` and `captions-and-text-for-sound-off`.
- Deciding whether to test Snap at all: use `test-a-new-ad-channel`.
- Splitting one budget across channels: use `cross-channel-budget-reallocation`.

## What you need

Required:

1. **Allowed cost per order:** break-even and target, from `set-ad-budget-from-profit-target` or `store-meta-math`. For stores where many orders are refused or fail delivery (for example pay on delivery), worked on delivered orders after those losses.
2. **Shopify order export**, last 90 days, for the baseline: new customers a day and blended cost per new customer.
3. **The owner's Snapchat budget and end date** for the test.
4. **Vertical videos or images** with usage rights, or briefs to make them.
5. **Who buys**, by age, gender, country, city or region, from store orders.
6. **A customer list** the owner can upload as an exclusion audience.

Optional: winning Meta, TikTok or Reels ads with store-basis cost per order; a "how did you hear about us" question with Snapchat as an answer.

Access: the owner creates the Snapchat business account, ad account and payment method, and signs in to install the Snapchat Ads app on Shopify; the agent never handles passwords or card numbers. The agent drafts at level 2. Turning anything on, and every budget raise, needs the owner's yes in chat.

## Before you start: the gates

1. **Break-even known.** Fail: compute it first; no budget can be set without it.
2. **Budget can learn.** Snap's own guidance for a first conversion ad is at least 30 US dollars a day with no changes for the first 4 days; its hard minimum is 5 a day, with 20 to 50 a day suggested to finish the learning period sooner. Accounts in other currencies: use the figure Ads Manager shows. Fail: if the cap cannot fund one ad set at that level, optimise to add to cart and say the read is weaker, or wait.
3. **Native creative exists or is briefed.** Resized landscape or square ads with small text are not enough.
4. **Category allowed.** Check the product against Snapchat's advertising policies (health claims, supplements, age-restricted goods). Fail: get a policy check before building.

## Steps

### 1. Tracking pass

- Install the Snap Pixel with the official Snapchat Ads app for Shopify, which places the pixel and syncs the catalog.
- Add server events through the Conversions API, using the app if it offers them, or a partner or direct setup. Snap recommends running the Conversions API alongside the pixel.
- Deduplication: the pixel's `client_dedup_id` must equal the server event's `event_id`, unique to each order (the order ID is the best choice), within 48 hours. For purchases also send the order reference (`transaction_id` in the pixel, `order_id` in the server event), which matches for up to 30 days. Placeholder values like "null" or an empty template are not matched.
- Match keys: each server event carries at least one hashed identifier (email or phone, lowercased and trimmed before hashing). Add name, city and postcode where consent allows; more keys mean more purchases Snap can match.
- Place one real order (refund it after). Pass when Events Manager shows one purchase with the right value and currency, not two and not zero. Anything else is fixed before spend.
- Tag every ad with UTMs so store orders can be matched by ad set.

### 2. Bring in what already works

- Rank the store's best ads on other channels by store-basis cost per order. Remake the top 3 to 5 for Snap: new first frame, the product and offer in the first two seconds, full screen.
- If an old Snap account had ads with real store orders, relaunch those first with fresh cuts.

### 3. Campaign structure

- **Objective:** Sales (it covers website conversions and catalog sales), optimised to purchases. If the pixel has too few purchases, start on add to cart and say so.
- **Bidding:** auto-bid first. Target cost only once purchases are steady and the store knows its allowed cost.
- **Attribution:** use Snap's suggested click-led window and keep it the same through the test, so days compare.
- **Ad sets:** one or two to start. Ad sets funded = daily budget / learning figure from gate 2, rounded down.
- **Targeting:** country (and, where delivery costs or failed deliveries vary a lot by area, the regions or cities the store delivers to reliably), the age band the store's orders show, and little else. Turn on audience expansion. Exclude existing customers with the uploaded list.
- **Names:** `SNAP_SALES_[country]_[audience]_[date started as Day 1]` for ad sets, `[concept]_[format]_[length]` for ads.
- **Several countries:** one campaign per country, so budgets, currency and language stay separate; write ads in the languages your buyers use.

### 4. Creative to spec

| Format | Use it for | Specs that matter |
|---|---|---|
| Single image or video | The main test | 9:16, at least 720 x 1280, video 3 to 180 seconds (aim for 5 to 6), brand name up to 25 characters, headline up to 34 |
| Story ad | Several products or reasons to buy in one tap-through | 3 to 20 cards, a strong first card |
| Collection ad | Range stores | A hero video or image with four tappable product tiles |
| Catalog (dynamic) ad | After purchases flow | From the synced catalog and a product set |

Rules for every ad:
- The product or hero message from the first frame; offer and point within the first two seconds.
- Made for sound on (Snap reports most of its ads are watched with sound), with captions so it still works muted.
- Looks like a Snap: shot on a phone, a real person, fast cuts. User-made style ads tend to be watched to the end.
- Key text and buttons kept clear of the bottom of the screen.
- 3 to 6 ads per ad set; at least half in the style that already sells for the store.
- Claims checked with `check-ad-copy-for-policy-and-claims`. Any AI-made person or voice is labelled and never shown as a real customer.

### 5. Budget inside the cap

- The whole test budget is planned: daily budget x days, at or under the owner's cap, ending on the end date.
- Campaign daily cap set so a mistake cannot overspend.
- A reserve of up to 15% may be held, with a release rule on store numbers.

### 6. Build paused, then ask

Build everything paused at level 2. Show the owner one action list: campaign, ad sets, budgets, dates, audiences, exclusions, ads, the tracking pass result and the rules in step 7. Turn on only after their yes.

### 7. Test and stop rules

From Day 1, one rule per ad set, written before launch, read on store orders:

- **Days 1 to 4:** no edits except fixing rejections, tracking breaks or clear losses.
- **Stop an ad** that has spent 3 times the allowed cost per order with no store order.
- **Creative flags** (not verdicts on their own): swipe rate well under the account's other ads, or most viewers leaving before second 2.
- **Day 7:** write the gap: store orders tagged Snap divided by Snap's reported purchases. Use it to read Snap's numbers for the rest of the test.
- **Day 14 verdict per ad set:**
  - Scale (budget up about 20% every 3 to 4 days): two reads agree cost per new customer is at or under the allowance (tagged store orders, and survey share or blended cost against the baseline).
  - Hold: reads disagree, or under 4 days since a change.
  - Trim: cost between the allowance and 1.5 times it, trending down.
  - Cut: two reads agree cost is above 1.5 times the allowance with no trend down.
- **Stores with many failed deliveries:** count delivered orders only; placed orders that are refused or come back are not sales.

### 8. Catalog ads, once purchases flow

When the pixel shows steady purchases, sync the Shopify catalog (the app does this), build product sets (best sellers, new in, under a price), and add a catalog ad set that retargets viewers and add to carts, with recent buyers excluded. Test it against the main ad set on the same rules.

## Checks before you hand it over

- One real test order reached Snap once, with the right value, and the order ID is the dedup key in both pixel and server event.
- Server events carry at least one hashed identifier.
- Objective is Sales, optimised to purchase (or add to cart, stated).
- Each ad set is funded to the learning figure, the whole budget fits the cap and end date.
- Every ad is 9:16, shows the offer in the first two seconds and works with sound on and off.
- Existing customers are excluded.
- Every ad set has its stop rule written before launch, on store orders.
- Everything is paused until the owner's yes.

## Output

**One-screen summary:** country, budget and end date, allowed cost per order, ad sets funded, ads by format, the Day 14 rule, and the one risk.

**Launch pack** (`snap-launch.md`):

1. Tracking pass: test order, Shopify value, Snap value, count, dedup key, pass.
2. Campaign: ad set, audience, exclusions, daily budget, bid, ads, stop rule.
3. Ad list: ad name, concept and source, format, length, sound, first-two-second message, AI label.
4. 14-day sheet (`snap-first-14-days.csv`): day, spend, Snap purchases, store orders tagged Snap, delivered orders (where deliveries often fail), cost per new customer, action taken.

## Common mistakes

- **Pixel without server events, or both without a shared ID.** Step 1 makes the order ID the dedup key.
- **Underfunded ad sets.** Gate 2 funds each one to Snap's own learning guide.
- **Resized feed ads.** Step 4 makes ads for a full-screen phone with the point in two seconds.
- **Editing in the first four days.** Step 7 leaves the learning period alone.
- **Judging on Snap's purchases.** Step 7 reads store orders and the Day 7 gap.
- **Counting placed orders that never arrive.** Step 7 counts delivered ones.

## Sources

- Snap for Business, setting up conversion campaigns for e-commerce: https://forbusiness.snapchat.com/setting-up-conversion-campaigns
- Snap for Business, ad pricing and daily spend: https://forbusiness.snapchat.com/advertising/pricing
- Snap for Business, ad formats and specs: https://forbusiness.snapchat.com/advertising/ad-formats
- Snap for Business, creative best practices: https://forbusiness.snapchat.com/blog/creative-best-practices-snapchat-for-business
- Snap for Business, ways to optimise campaigns: https://forbusiness.snapchat.com/blog/10-ways-to-optimize-your-snapchat-ads-campaigns
- Snap Marketing API, Conversions API introduction: https://developers.snap.com/api/marketing-api/Conversions-API/Introduction
- Snap Marketing API, Conversions API deduplication: https://developers.snap.com/api/marketing-api/Conversions-API/Deduplication
- Snap Marketing API, campaigns and the Sales objective: https://developers.snap.com/marketing-api/Ads-API/campaigns
- Snap Marketing API, dynamic product ads: https://developers.snap.com/api/marketing-api/Ads-API/dynamic-product-ads
- Snapchat Ads app for Shopify: https://apps.shopify.com/snapchat-ads

What makes this skill ours: the order ID is the one dedup key from pixel to server, checked on a real order before a cent is spent; every ad set is funded to Snap's own learning guide or not launched; creative is made for a full-screen phone with the point in two seconds; and every verdict reads store orders, with stores that see many failed deliveries judged on delivered orders only.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Snapchat is widely used by young buyers in Indian metros (Snap newsroom, Snapchat users in India: https://newsroom.snap.com/india-mau-250m). Target the metros the store delivers to without high RTO. Work the allowed cost per order on delivered orders after RTO, and count delivered orders only; placed COD orders that come back are not sales. Rupee accounts use the learning figure Ads Manager shows.
