---
name: build-review-collection-system
description: "A review collection system for the store: when to ask each product's buyers (timed to when the product has done its job, not a fixed day count), which channel, what to ask so reviews answer real buyer doubts, how to ask for photos and videos, which incentives each platform allows, how to moderate fairly, and where reviews show on the site. Follows Google's ban on incentives and review gating and the US FTC review rule, with market notes for WhatsApp asks and the languages your buyers use. Tool-neutral with a free path. Use when a product has few reviews, review rate is low, reviews are generic, or the store wants photo and video reviews."
---

# Review collection system

**You get:** a review request plan per product (timing, channel, question prompts, photo and video ask, incentive rule), the moderation policy, the display plan for product pages, and a monthly tracker, ready to set up in the review app or by hand.

## When to use

- New products have fewer than about 80 reviews.
- Review rate (reviews per delivered order) is low or falling.
- Reviews say "great product" and nothing a doubtful buyer needs.
- The store wants photo and video reviews for pages and ads.

## Not for

- Replying to bad reviews: use `reply-to-negative-reviews`.
- Amazon reviews, which follow Amazon's own stricter rules: use `get-early-amazon-reviews`.
- Writing the full post-purchase email series: use `write-post-purchase-emails` or `post-purchase-repeat-sequence`; this skill sets the review step they carry.
- Turning reviews into ads: use `review-screenshot-ads` or `write-review-based-ad-copy`.

## What you need

Required (read access, level 1):

1. **Shopify order export**: Name, Created at, Fulfilled at, Lineitem sku, Customer email and phone consent, Payment Method.
2. **Delivery dates** from the carrier or tracking app.
3. **Reviews export** from the review app: product, rating, date, text, media, verified buyer flag.
4. **Product use facts**: how long until the product shows a result or gets real use (a mug on day one, a serum after weeks).
5. **Top pre-sale doubts** per product from tickets and chats.

Optional: support tickets per SKU, current review request settings, Google Business Profile access.

Changing review app settings and request messages needs draft access (level 2); turning requests on for buyers needs the client's yes.

## Before you start: the gates

1. **Platform rules, per destination.** Google reviews: no incentives of any kind, no asking only happy buyers, no discouraging bad reviews, no staff review quotas [CXP-6300]. US, the store's own site: incentives allowed only if no sentiment is required or implied; asking only happy buyers may break the FTC Act; no suppressing reviews except by rules applied equally [CXP-6301]. Any step that breaks these is dropped.
2. **Fix effort first.** If order-status or damage complaints are high, fix those before asking for reviews, or the asks collect complaints.
3. **Consent.** Email asks go to buyers under the store's transactional or marketing consent as the platform's rules allow; SMS and WhatsApp asks need opt-in for that channel.
4. **Cash.** If the review app is paid, check the free tier or Shopify's free review options first.

## Steps

### 1. Set the target per product

Reviews matter most early: one card saw conversion roughly double going from zero to about 80 reviews, with little gain from count after that; beyond it, reviews that prove the specific claim matter more [LPG-0062]. So: products under 80 reviews get the strongest ask; products over 80 shift to asking for photos, videos and specific answers.

### 2. Time each ask to when the product has done its job

Ask after delivery and real use, never before delivery. For each product, set "days to first real use" from the use facts:

| Product kind | Ask after delivery | Second ask |
|---|---|---|
| Used at once (accessories, home goods, apparel fit) | 3 to 7 days | 7 days later |
| Needs some use (kitchen tools, shoes, bags) | 10 to 14 days | 10 days later |
| Results take time (skincare, supplements, hair) | When results show, often 21 to 45 days | Before reorder |

These are practitioner defaults; test them. Refine with the store's data: the review dates of existing reviews and the timing of "how do I use" tickets show when buyers form a view. Only two asks per order; stop when the buyer reviews.

### 3. Write the ask

One message, one action, a one-click link to the review form with the star rating in the email or message.

- Subject or opener names the product, not "We value your feedback".
- One sentence on why it helps: other buyers decide with it.
- Two or three prompts tied to real doubts, so reviews answer them: "How was the fit compared with your usual size?", "How long did it take to notice a difference?", "What did you use it with?" Reviews that answer one known objection each are more useful than praise [EML-0033].
- Photo and video ask: "A photo of it in use helps people most." Show two or three real buyer photos in the message as examples, with permission.

Asks go to every buyer of the product, with the same wording, whatever their likely rating. No survey or "are you happy?" step in front that sends only happy buyers to the review form.

### 4. Set the incentive rule

- **Google reviews:** no incentive at all [CXP-6300].
- **Store's own reviews (US and similar rules):** a small reward for a photo or video review is allowed only if it is given for any honest review, good or bad, and the wording never implies a positive one [CXP-6301]. Wording: "Leave an honest review with a photo and get [reward], whatever you think." Disclose incentivised reviews on the site if the review app supports a label.
- **Amazon and marketplaces:** follow their own rules; most ban incentives.
- **UK, EU and other markets:** follow the same honesty rules; the UK and EU ban fake reviews and require stores to say whether and how they check reviews are genuine. Never give incentives that only go to five star reviews.

Practitioner default: start without an incentive; add one only for photo or video reviews if media rate stays low after 60 days.

### 5. Moderate fairly

Write a published moderation policy: reviews are removed only for profanity, private data, spam, reviews of a different product, or non-buyers where the app verifies purchase. Apply it the same way to one star and five star reviews [CXP-6301]. Never hold back negative reviews from showing. Reply to negative ones through `reply-to-negative-reviews`.

### 6. Display them where buyers decide

- Star rating and count near the product title; on mobile, above it.
- Show reviewer name, photo and source, not anonymous quotes; anonymous proof now reads as fake [LPG-0037].
- Place three or four reviews that answer the top doubts beside the add-to-cart and bundle selector [LPG-0005].
- Make sure review text is visible in the page HTML, not only loaded by script, so search and AI crawlers can read it [AEO-0002]. Send structured data work to `add-product-schema-and-rich-results`.

### 7. Google reviews for the store

If the store has a Google Business Profile, send one separate, plain ask to all buyers after the product review step, with no incentive and no filtering.

**Stars in Google Shopping and the store badge.** Product ratings in Google ads and free listings come through Merchant Center, from Google's own customer reviews, an approved review partner, or a feed sent from the review app. Google's help pages have asked for at least 50 reviews across all products and say stars can take a couple of weeks to appear after onboarding; read the current page and write down the date you checked, because these limits change. Some practitioners also want a few reviews (they say 3) on a product before its stars help, so list the products under that line and point the review asks at them first. The top quality store badge compares the store with others in the same country on things such as shipping speed and cost, returns, site experience and ratings. The store can only improve the inputs it controls: a clear returns window and cost, real delivery times shown, and a steady flow of new reviews. Only genuine reviews from real buyers, never filtered to the happy ones [CXP-6300].

### 8. Market notes

- **Chat-first markets:** where buyers live on WhatsApp, asks there often beat email; use an approved utility or marketing template with opt-in, and a link that opens the review form on mobile.
- **All markets:** let buyers write in the languages they use, and show those reviews; they help buyers who read that language. Buyers who refused delivery get no review ask.
- **US:** follow the FTC rule on fake and insider reviews; staff, family and creators who got free product must not post undisclosed reviews.

### 9. Track monthly

Per product: delivered orders, asks sent, reviews, review rate, share with photo or video, average rating, share that answer a top doubt.

## Checks before you hand it over

- Each product has an ask timing based on its use, not one fixed day count.
- Asks go to all buyers with the same wording; no gating step.
- Incentive rule is set per destination, with none for Google.
- Prompts in each ask tie to that product's real doubts.
- A written moderation policy treats good and bad reviews the same.
- Display plan places doubt-answering reviews near add to cart.
- No ask goes live without the client's yes.

## Output

**One-screen summary:** products below 80 reviews, review rate now, the timing change with the biggest expected gain, and the incentive rule.

**Request plan:** Product, Reviews now, Target, Kind, First ask (days after delivery), Second ask, Channel, Prompts, Photo or video ask, Incentive (none or rule), Template text.

**Moderation policy** text for the site.

**Display plan:** Page, Element, Placement, Reviews chosen, Doubt answered.

**Tracker:** Month, Product, Delivered, Asked, Reviews, Rate, Media share, Average rating.

## Common mistakes

- **Fixed day counts for every product.** Step 2 times asks to real use.
- **Filtering happy buyers first.** Gate 1 and step 3 ask everyone the same way.
- **Rewards for good reviews.** Step 4 rewards honest reviews only, and never on Google.
- **Hiding bad reviews.** Step 5 moderates by equal rules.
- **Generic praise.** Step 3 prompts answer real doubts.
- **Reviews loaded only by script.** Step 6 keeps them readable by crawlers.

## Sources

- AEO-0002: script-loaded review widgets are invisible to AI crawlers.
- CXP-6300: Google bans incentives, gating and quotas.
- CXP-6301: FTC rule on incentives, gating and suppression.
- EML-0033: pick reviews that answer one objection each.
- LPG-0005: place objection-answering reviews by the buy button.
- LPG-0037: show name, photo and source.
- LPG-0062: zero to about 80 reviews matters most; relevance after.

What makes this skill ours: asks are timed to when each product has done its job, not a fixed day; prompts make reviews answer real buyer doubts; incentive rules differ by destination under Google and FTC rules; and moderation is equal for good and bad reviews, with WhatsApp and local-language asks where buyers use them.

## Selling in India

- WhatsApp asks often beat email; let buyers write in Hindi or regional languages.
- COD buyers who refused delivery get no review ask.
