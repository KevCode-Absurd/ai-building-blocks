---
name: write-browse-abandonment-emails
description: "Two or three browse abandonment emails for known shoppers who viewed a product but did not add it to cart, written in full for each product type the store sells (considered buys, size and fit items, consumables and skincare, gifts), with subject lines, preview, body, dynamic product block, timing, entry filter and exit rules. Each email helps the shopper decide using the store's real size guides, comparisons, ingredients or delivery dates rather than pushing a code, and only offers money off when the shopper has never bought and the welcome offer is unused. Use when a store has no browse flow, or one generic email that shows the same product picture to everyone."
---

# Browse abandonment emails

**You get:** two or three browse emails written in full for each of the store's product types (up to four types), with subject lines, preview, body, a dynamic product block spec, timing, entry filters and exit rules, ready to load as drafts for the client to approve.

## When to use

- The store has traffic from known visitors (subscribers, past buyers) who view products and leave.
- The browse flow is one generic "still thinking about it?" email for every product.
- Fashion or gifting stores where browsing is most of the visit and cart flows catch too few people.
- A new product type needs its own decision help (size, ingredients, compatibility).

## Not for

- People who added to cart or started checkout: use `write-abandoned-cart-and-checkout-emails`.
- Products with views but few add-to-carts, where the product page is the problem: use `diagnose-low-add-to-cart-products`.
- Flow priorities: use `email-sms-flow-plan`.
- Writing size and how-to guides from scratch: use `write-size-fit-and-how-to-use-guides`, then link them here.

## What you need

Required (read access, level 1):

1. **Viewed Product volume**: last 30 days of known profiles who viewed a product, from the email platform's metric report, and the current browse flow report if one exists.
2. **Product list with types**: Shopify product export (Handle, Title, Type, Vendor, Variant Price, Tags) so each product maps to one type.
3. **Decision help that already exists**: size charts, comparison tables, ingredient lists, care guides, delivery dates by region, gift wrap or message options.
4. **Reviews export** with product handles, and five brand voice lines.
5. **Welcome offer terms**, if any, and whether codes are single use.

Optional: top product page questions from support or chat, return reasons by product (fit, quality, not as shown).

If no decision help exists for a type, write the email around the two most common pre-purchase questions from support for that type and flag the missing guide. Drafts need draft access (level 2); switching on needs the client's yes.

## Before you start: the gates

1. **Event tracking.** Viewed Product reaches the email platform with product name, image, price and URL. Fail: list the fix for the builder; do not write emails that will render empty.
2. **Flow collisions.** Added to Cart and Started Checkout make a person ineligible for browse at once; the cart flow owns the next contact. Shopify Messaging users: its 14-day suppression across cart, checkout and browse emails already applies [EML-0009].
3. **Consent.** Only subscribed profiles receive browse emails. Never email visitors matched by a third-party identity tool unless the store's counsel has cleared the consent basis; such tools rely on opt-ins given elsewhere [EML-0066].
4. **Gross profit per order.** Needed only if any email will carry money off. Fail: no offer in any browse email.

## Steps

### 1. Group products into types

Use at most four types so the flow stays buildable:

- **Considered buy** (higher price, longer choice): the question is "is this the right one for me?"
- **Size and fit** (clothing, shoes, rings, furniture dimensions): "will it fit?" Size uncertainty is a common reason apparel shoppers leave, and most apparel sites give too little sizing information [CXP-6161].
- **Use and results** (consumables, skincare, supplements, pet food): "will it work, and how do I use it?"
- **Gift** (gift sets, cards, seasonal items): "will it arrive on time, and can I send it as a gift?"

Map each product to one type with a tag the flow can split on.

### 2. Set entry, timing and length

- **Entry:** viewed a product; no add to cart, checkout or order since; not in this flow in the last 30 days (practitioner default, test it). For a busy store, require two views of the same product in 24 hours to cut low-intent sends, and test it against one view.
- **Timing:** email 1 between 30 minutes and 2 hours after the view [EML-0064]; 1 to 3 hours is the common range [EML-0046]. One store's site-abandon test found a 4-hour delay beat 30 minutes on orders despite fewer opens [EML-0023], so test the delay before the copy.
- **Length:** two emails by default; a third only for considered buys. Some practitioners run up to five [EML-0019]; start shorter and add only when a test shows the extra email earns more than its unsubscribes.

| Email | Send | Job |
|---|---|---|
| 1 | 1 to 2 hours after the view | Show the exact product and answer the type's main question |
| 2 | Day 2 | Proof or comparison: a review, the alternative, or the guide |
| 3 (considered buys only) | Day 5 | Help from a person: reply, chat or call option |

Exit on Added to Cart, Started Checkout or Placed Order.

### 3. Decide the offer rule

Default: no money off in browse emails. Browsing is low intent, and codes here teach shoppers to view and wait. Some practitioners give browsers the most generous offers in the funnel [OFF-0009]; this skill allows only one case: the profile has never bought and has an unused welcome offer, so email 2 may remind them of that same offer and its real expiry. No new or bigger code.

### 4. Write the emails per type

Every email: dynamic product block (image, name, price, link to that product), one button, grade 8 reading level, subject lines that name the product or the question.

- **Considered buy.** Email 1: the product and three facts that matter for choosing it, taken from the spec sheet. Email 2: "how it compares": the product beside its nearest sibling in the store, two or three rows from a real comparison. Email 3: a short note offering a reply from a person who knows the range.
- **Size and fit.** Email 1: the product with a direct link to its size guide, how the item runs (true to size, runs small) only if the reviews or fit data say so, and the exchange policy in one line. Email 2: one or two reviews that mention fit, with the reviewer's stated size if they gave it [EML-0033].
- **Use and results.** Email 1: how to use it in three steps and when people usually notice a change, only as the approved claims allow (check with `product-claims-profile`). Email 2: a review that answers the main doubt (taste, texture, sensitive skin), quoted exactly.
- **Gift.** Email 1: delivery dates by region for the next gift date, gift wrap or message options, and the return or exchange rule for gift recipients. Email 2: two or three related gifts at different prices from the same collection.

Write two subjects per email. Good shapes: the product name plus the question ("Your size in the linen shirt"), or the useful thing inside ("How the 3 serums compare"). Avoid "You forgot something"; they did not.

### 5. Market notes

- **India:** show the price including GST as on the site, COD availability by pin code if the store limits it, and delivery days for metro and non-metro. If the store sells in regional languages, write the email in the language the shopper's profile records, never by guessing from a name.
- **US:** postal address and unsubscribe in every email; subject lines must match the content [EML-6341].

### 6. Plan the test

First test the delay of email 1, copy fixed. Then one view versus two views as the entry rule. Flows need about 1,000 recipients per variant [EML-0061]. Judge on add-to-cart and order rate per entrant within three days, and on unsubscribes.

## Checks before you hand it over

- Each product type has its own emails, and every product maps to one type.
- Entry filter, 30-day re-entry limit and exits on cart, checkout and order are written down.
- No new codes; any offer is the unused welcome offer with its real expiry.
- Fit, results and comparison lines come from the size guide, spec sheet, approved claims or exact reviews.
- Gift delivery dates match the courier cut-offs on the shipping page.
- The product block spec names each dynamic field.
- Nothing switched on without the client's yes.

## Output

1. **One-screen summary:** product types and their main questions, timing, the offer rule, the first test.
2. **Flow sheet:** Type, Email, Delay, Job, Question answered, Exit, Subject A, Subject B, Preview.
3. **Each email in full:**

```
Type: [considered / size and fit / use and results / gift]   Email [n]
Send: [delay]   Exit: Added to Cart, Started Checkout, Placed Order
Subject A / B: [...] / [...]   Preview: [...]
Body: [2 to 6 lines answering the type's question]
[Product block: image, name, price, URL]
Button: [See your size / Compare the three / Check delivery dates]
Sources: [size guide URL / review id / claims list line]
```

4. **Product block spec:** Field, Source event property, Fallback if empty.
5. **Missing help list:** guides or comparisons the store should create, by type.

## Common mistakes

- **One email for every product.** Step 1 splits by the question each type raises.
- **Treating a view like a cart.** Step 3 keeps codes out.
- **Results promises the store cannot back.** Step 4 uses approved claims only.
- **Empty product blocks.** Gate 1 checks the event first.
- **Browse and cart emails to the same person on one day.** Gate 2 makes cart win.

## Sources

- CXP-6161: apparel sites give too little sizing information (proposed).
- EML-0009: Shopify Messaging suppression.
- EML-0019: common flow lengths.
- EML-0023: delay tests; 4 hours beat 30 minutes in one test.
- EML-0033: reviews that answer one objection.
- EML-0046, EML-0064: browse timing.
- EML-0061: flow test size.
- EML-0066: identity-matching tools and consent.
- EML-6341: US CAN-SPAM rules (proposed).
- OFF-0009: offers by funnel stage.

What makes this skill ours: the emails split by the question each product type raises rather than one generic reminder; codes are kept out except the shopper's own unused welcome offer; every fit, result or delivery line is traced to the store's guides, claims list or exact reviews; and identity-matched visitors without consent are left out.
