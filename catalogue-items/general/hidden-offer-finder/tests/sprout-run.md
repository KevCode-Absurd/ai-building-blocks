# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 7 of 7 met. Invented facts: 0.

A thorough, honest offer map: every live deal is quoted, the discount mess is laid out with arithmetic that exposes it, and the nine new offers all come from things Sprout already has. The three picks (cancel terms up front, first-order guarantee, the 12-pack store trial) are cheap to arrange and aimed at real buyer doubts; minor nits are a few said-simply lines with two numbers and NEW 3's "most people who try it" leaning on a customer survey (qualified in its terms).

## Judge list

- Met: Every live offer is there, in your exact wording
  22 LIVE items, e.g. "Save 52% + free shipping on your first order", "Sign Up for 55% Off", VIP, cashback, HSA/FSA, guarantee, shipping all quoted.
- Met: Every clash between pages is listed, with the smaller figure in use
  "Figure used: 49%. Even 49% does not match its own $45.33, so new offers quote dollar prices and no percent."
- Met: Every price is one of yours, or worked from yours with the sum shown
  "$22.49 ÷ 28 = $0.80 a day", "$52.79 − $49.99" = $2.80; per-day table shows each division.
- Met: The guarantee is quoted in full, with its limits
  "30-day money-back, first order only. 'This policy applies only to your initial purchase.' ... Renewals are not covered."
- Met: No more than two new offers are only money off
  Only NEW 5 ("money-off proposal 1 of 2") and NEW 9 ($29.99 first order) rest on money off.
- Met: Every new gift, size or service sits under "must arrange"
  NEW 4: "Write the real pause and cancel steps"; NEW 7: "An opt-out choice"; NEW 1: "A store finder".
- Met: Nothing says "limited time" or "exclusive" without a real end date, and there are no exclamation marks
  "exclusive" appears only inside the quoted brand VIP line in LIVE 15; no exclamation marks in the run's own text.

## What went in

```text
[brand file: sprout/brand.md, the products, prices and offers
sections, plus the buyers section]

Prices: Adults 28 packs $66.65 one-time ($2.38/day); subscription
$49.99 every 4 weeks ($1.78/day); $29.99 first order with the text
sign-up discount. 84-pack pouch sold. Big-box retailer 12-pack:
$19.97 Adults, $14.97 Kids. Kids 28 packs $53.32 one-time.
Deals live at once: 49%, 52%, "up to 55%", 55% and 58% (Kids page)
off; ads say 61%. Kids plan box: $22.49, "Renews at $74.98 each 4
weeks". "Buy 2 Save $5". 4 free gifts on a first order in ads
(which gifts changes). VIP: "Save up to $80, get limited flavors,
and VIP access". Subscription: "Pause Or Cancel Any Time".
Guarantee: 30-day money-back, first order only. Ships within 24
hours, arrives in 3 to 5 days on average. New limited flavour every
4 to 8 weeks.
Buyers: the quitter, the gut-fix seeker, the busy parent, the
price doubter.

[attached: sprout/brand.md]
```

## What came out

```text
## LIVE

**1. "Save 52% + free shipping on your first order"** (announcement bar)
- **Name:** 52% First Order
- **Said simply:** "They take about half off your first box and ship it free."
- **Terms:** First subscription order only. The base price for the 52% is not stated.
- **For:** price doubter
- **Stage:** knows you already

**2. "Save 55% + Free Shipping"** (second announcement bar line)
- **Name:** 55% Off Bar
- **Said simply:** "Over half off and free shipping."
- **Terms:** No first-order limit is shown on this line, though line 1 limits it to the first order. The base price is not stated.
- **For:** price doubter
- **Stage:** knows you already

**3. "MOST POPULAR: GET UP TO 55% OFF"** (product page plan box)
- **Name:** Up to 55%
- **Said simply:** "The subscription gets you up to about half off."
- **Terms:** Subscription. "Up to" is not explained.
- **For:** price doubter
- **Stage:** knows you already

**4. "MOST POPULAR: GET 49% OFF" at $45.33 ($1.62/day)** (how-it-works page plan box)
- **Name:** 49% Plan
- **Said simply:** "The plan's about $45 for the first box."
- **Terms:** $45.33 ÷ 28 = $1.62 a day. The renewal price is not shown in this box.
- **For:** price doubter
- **Stage:** knows you already

**5. "MOST POPULAR: GET 58% WITH FREE SHIPPING" at $22.49, "Renews at $74.98 each 4 weeks"** (Kids page plan box)
- **Name:** Kids 58%
- **Said simply:** "The kids' first box is about $22."
- **Terms:** First order $22.49 ($22.49 ÷ 28 = $0.80 a day), then $74.98 every 4 weeks ($2.68 a day).
- **For:** busy parent
- **Stage:** knows you already

**6. "Sign Up for 55% Off"** (text sign-up pop-up)
- **Name:** Text for 55%
- **Said simply:** "Give them your number and you get more than half off."
- **Terms:** Needs a text-message sign-up. New customers only, per the footer.
- **For:** price doubter
- **Stage:** knows you already

**7. "up to 61% OFF + 4 FREE gifts"** (Meta ads)
- **Name:** 61% + Gifts
- **Said simply:** "Big discount plus a few gifts in the box."
- **Terms:** The gifts are not named and change from ad to ad. Fails step 6 until the gifts are named and the conditions sit next to the offer.
- **For:** price doubter
- **Stage:** knows you already

**8. "$20 off your first order" and "+$5 off for every extra person"** (one ad's main text)
- **Name:** $20 Off, $5 Per Person
- **Said simply:** "Twenty off your first order, and a bit more for each person you add."
- **Terms:** The base price for the $20 is not stated.
- **For:** price doubter, busy parent
- **Stage:** knows you already

**9. "Same Sprout. New Lower Price. Subs Now Start at $29.99." / "Not just for a week but indefinitely."** (birthday price cut)
- **Name:** $29.99 Start
- **Said simply:** "The subscription now starts at thirty bucks."
- **Terms:** The footer says: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only." That condition sits in a footnote, not next to the offer, so this fails step 6. Renews at $49.99 every 4 weeks.
- **For:** price doubter
- **Stage:** knows you already

**10. Subscription terms**
- **Name:** Subscribe and Save
- **Said simply:** "It's $49.99 every 4 weeks and you can pause or cancel."
- **Terms:**
  - Adults Low Sugar is $49.99 every 4 weeks ($1.78/day as shown). Sugar-Free is $54.99.
  - The site says "Pause Or Cancel Any Time" (from the brief; the steps are not captured).
  - One-time purchase is framed as "No Free Shipping" and "No First Order Discount".
- **For:** quitter, price doubter
- **Stage:** knows you already

**11. Limited flavour pricing and rule**
- **Name:** Limited Flavour
- **Said simply:** "There's a new flavour every month or two."
- **Terms:**
  - Adults: starts at $32.79, renews at $52.79 Low Sugar or $57.79 Sugar-Free.
  - Kids: starts at $27.79. The Kids renewal is not captured.
  - "Subscribers get the limited flavour for 1 month, then switch back to Original automatically."
- **For:** busy parent, quitter
- **Stage:** knows you already

**12. Kids "starts at" $24.99** (Kids price list)
- **Name:** Kids from $24.99
- **Said simply:** "Kids' boxes start around $25."
- **Terms:** First order. The renewal is not stated here.
- **For:** busy parent
- **Stage:** knows you already

**13. "Buy 2 Save $5"**
- **Name:** Buy 2 Save $5
- **Said simply:** "Add a second person and save $5."
- **Terms:** Applies to more than one adult or kid on the order. It is not stated whether it applies to renewals.
- **For:** busy parent
- **Stage:** knows you already

**14. 4 free gifts with a first order** (ads)
- **Name:** 4 Free Gifts
- **Said simply:** "Your first order comes with some gifts."
- **Terms:** The gifts change and are not named. Fails step 6 until each gift is named.
- **For:** price doubter
- **Stage:** knows you already

**15. VIP: "Save up to $80, get limited flavors, and VIP access"** (also "Savings, exclusive flavors, and a minor sense of superiority.")
- **Name:** VIP
- **Said simply:** "Members save money and get the special flavours."
- **Terms:** Not captured: the basis for the $80, the cost to join and what "VIP access" is.
- **For:** quitter
- **Stage:** knows you already

**16. Cashback** through a third-party app
- **Name:** Cashback App
- **Said simply:** "You get some of your money back through an app."
- **Terms:** 20% cash back or 40% store credit after purchase. The app's terms are not captured.
- **For:** price doubter
- **Stage:** knows you already

**17. Referral program**
- **Name:** Refer a Friend
- **Said simply:** "You get something for sending friends."
- **Terms:** Not captured.
- **For:** quitter
- **Stage:** knows you already

**18. Monthly smartwatch giveaway**
- **Name:** Smartwatch Giveaway
- **Said simply:** "They give away a smartwatch every month."
- **Terms:** Rules not captured.
- **For:** price doubter
- **Stage:** knows you already

**19. HSA/FSA eligible** through a third-party service
- **Name:** HSA/FSA
- **Said simply:** "You can pay with HSA or FSA money."
- **Terms:** Goes through a third-party service. The details are not captured.
- **For:** price doubter
- **Stage:** comparing options

**20. Free 30 days of a fitness app** (partner offer, one ad)
- **Name:** Fitness App Month
- **Said simply:** "You get a month of a fitness app."
- **Terms:** Partner offer. The conditions are not captured.
- **For:** quitter
- **Stage:** knows you already

**21. Guarantee: 30-day money-back, first order only.** "This policy applies only to your initial purchase."
- **Name:** 30-Day Money Back
- **Said simply:** "If the first order isn't for you, you can get your money back."
- **Terms:** First order only. Renewals are not covered.
- **For:** gut-fix seeker, quitter
- **Stage:** comparing options

**22. Shipping: "typically ship within 24 hours and on average arrive 3-5 days later"**
- **Name:** Ships in a Day
- **Said simply:** "It usually ships the next day."
- **Terms:** These are typical and average times, not promises.
- **For:** busy parent
- **Stage:** knows you already

## CLASHES

1. **Discount size.**
   - Live figures:
     - 49%: how-it-works page
     - 52%: announcement bar
     - "up to 55%": product page
     - 55%: bar line and text pop-up
     - 58%: Kids page
     - "up to 61%": Meta ads
   - Worked against one-time prices:
     - $29.99 vs $66.65: 1 − 29.99/66.65 = 55.0%
     - $45.33 vs $66.65: 32.0%, not 49%
     - Kids $22.49 vs $53.32: 57.8%
     - No price on file gives 61%. It would need $66.65 × 0.39 = $25.99, which was not seen.
   - **Figure used: 49%.** Even 49% does not match its own $45.33, so new offers quote dollar prices and no percent.
2. **First-order Adults price.**
   - $29.99 appears in the birthday banner and the "starts at" price, and needs the text sign-up.
   - $45.33 appears on the how-it-works page.
   - "$20 off your first order" (ad) gives $29.99 if taken from $49.99, or $46.65 if taken from $66.65.
   - **Figure used: $45.33**, or $29.99 only with "with text sign-up, new customers only" stated beside it.
3. **How long $29.99 lasts.**
   - The birthday banner says "indefinitely".
   - The footer says "reserved for new customers only".
   - **Figure used:** first order, new customers only.
4. **First-order Kids price.**
   - $22.49 on the Kids plan box.
   - $24.99 as the Kids "starts at" price.
   - **Figure used: $24.99.**
5. **Kids renewal.**
   - "Renews at $74.98 each 4 weeks" on the Kids plan box.
   - The Kids one-time price is $53.32, so the renewal is $21.66 more than buying once ($74.98 − $53.32).
   - The brand file marks the Kids subscription price as unclear.
   - **Figure used: $74.98.**
6. **Free shipping scope.**
   - "on your first order" (bar line 1).
   - "Save 55% + Free Shipping" with no limit (bar line 2).
   - "No Free Shipping" on one-time purchases.
   - **Figure used:** free shipping on the first subscription order only.
7. **Multi-person saving.**
   - "Buy 2 Save $5" (site).
   - "+$5 off for every extra person" (ad).
   - **Figure used:** $5 off once, on an order with 2 people.
8. **84-pack format.**
   - The brief says "84-pack pouch".
   - The brand file says the 84-pack is 3 pouches of 28.
   - **Figure used:** 3 pouches of 28.
9. **Per-day price.**
   - The product page compares "$1.26" a serving (dated).
   - The current subscription is $49.99 ÷ 28 = $1.785, which the site shows as $1.78.
   - **Figure used:** $1.79 ($1.785 rounded).

## STOCK

**Sizes**
- Adults 28 packs, Low Sugar or Sugar-Free
- Adults 84 packs (3 × 28)
- Kids 28 and 84 packs
- Limited flavour 28 packs, Adults and Kids
- **Shops only:** 12-pack at a big-box retailer, Adults $19.97 and Kids $14.97

**Prices per day**

| Product | Price | Per day |
|---|---|---|
| Adults one-time, Low Sugar | $66.65 ÷ 28 | $2.38 |
| Adults one-time, Sugar-Free | $73.32 ÷ 28 | $2.62 |
| Adults subscription, Low Sugar | $49.99 ÷ 28 | $1.79 |
| Adults subscription, Sugar-Free | $54.99 ÷ 28 | $1.96 |
| Adults first order (text sign-up) | $29.99 ÷ 28 | $1.07 |
| Adults first order (how-it-works) | $45.33 ÷ 28 | $1.62 |
| Adults 84 packs, Low Sugar | $199.95 ÷ 84 | $2.38 |
| Adults 84 packs, Sugar-Free | $219.96 ÷ 84 | $2.62 |
| Kids one-time | $53.32 ÷ 28 | $1.90 |
| Kids 84 packs | $159.96 ÷ 84 | $1.90 |
| Kids first order (plan box) | $22.49 ÷ 28 | $0.80 |
| Kids first order ("starts at") | $24.99 ÷ 28 | $0.89 |
| Kids renewal | $74.98 ÷ 28 | $2.68 |
| Shop 12-pack, Adults | $19.97 ÷ 12 | $1.66 |
| Shop 12-pack, Kids | $14.97 ÷ 12 | $1.25 |
| Limited flavour, Adults first order | $32.79 ÷ 28 | $1.17 |
| Limited flavour, Adults renewal (Low Sugar) | $52.79 ÷ 28 | $1.89 |

- The 84-pack gives no unit saving: it costs exactly 3 times the 28-pack price.
- The shop 12-pack costs less per day than the site subscription.

**Guarantee**
- 30-day money-back, first order only. It sits in the FAQ.
- The product page says "Less than 1% of customers use our Money-Back Guarantee" (brand-reported).

**Delivery**
- Ships within 24 hours typically, then arrives in 3 to 5 days on average.
- Free shipping on the first subscription order. None on one-time orders.
- Free-delivery threshold: MISSING.

**Extras**
- Kids line
- Sugar-Free version
- Limited flavours every 4 to 8 weeks
- Electrolyte variety pack, $75.88
- Merch: hoodie $45.49, tee $25.99, tote $36.99, caps $25.99

**Partner perks**
- Cashback app
- HSA/FSA through a third-party service
- 30 days of a fitness app
- Monthly smartwatch giveaway
- Referral program

**Proof**
- 2025 study of 120 adults over 12 weeks: blood vitamin C up 40.1%, folate up 20.5%.
- Brand-reported survey of 3,000+ customers: "95% ... at least 4-6x per week with 80% taking daily" (of surveyed users).
- Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants.

**Past buyers it can reach**
- Subscribers
- The text-message list
- VIP members
- Reviewers (on-page widget: 109,639)

The size of each list is MISSING.

**Dates**
- A new limited flavour every 4 to 8 weeks.
- The birthday price cut (date not captured).
- The holiday season, with an earlier holiday flavour. Shipping cut-offs are MISSING.

## NEW

**1. Try a 12 First**
- **Said simply:** "Grab the 12-pack at the store and see if you like it before you subscribe."
- **Terms:** The Sprout Adults 12-pack has been seen at a big-box retailer for $19.97 ($19.97 ÷ 12 = $1.66 a day), and the Kids 12-pack for $14.97 ($1.25 a day). The retailer sets the shelf price. There is no subscription.
- **For:** price doubter and quitter ("expensive", "can a gummy replace my powder")
- **Stage:** hasn't noticed the problem / comparing options
- **Changes:** cheaper to start, surer
- **Must arrange:**
  - A store finder or retailer wording the ads may use.
  - A check of the current shelf price.
  - A ruling on whether a shop purchase counts for the guarantee.
- **Costs you:** unknown (retailer margin)
- **Why:** It is the smallest real way to try that already exists. Twelve days also covers the "tastes better after day three" pattern reviewers describe.

**2. Your First Order Is Covered**
- **Said simply:** "Your first order has a 30-day money-back guarantee, so if your stomach doesn't like it, you're not stuck."
- **Terms:**
  - 30-day money-back guarantee: "This policy applies only to your initial purchase." Renewals are not covered.
  - First order $45.33, then $49.99 every 4 weeks.
  - Gut-sensitive buyers are pointed to Low Sugar, not Sugar-Free.
- **For:** gut-fix seeker ("Will this upset my stomach more?")
- **Stage:** comparing options
- **Changes:** surer
- **Must arrange:**
  - Move the guarantee and its limit from the FAQ to the plan box and the ads.
  - Confirm what a refund covers (opened packs, shipping).
- **Costs you:** refunds on returned first orders. The brand says under 1% use the guarantee (brand-reported, unverified).
- **Why:** It answers the strongest-feeling buyer's fear with a promise the brand already makes but keeps quiet.

**3. Stick-With-It Proof**
- **Said simply:** "Most people who try it actually keep taking it every day."
- **Terms:**
  - First order $45.33, then $49.99 every 4 weeks, covered by the 30-day first-order money-back guarantee.
  - Shown with "80% taking daily" (of surveyed users, from a brand-reported survey of 3,000+ customers).
- **For:** quitter ("one habit that lasts")
- **Stage:** comparing options
- **Changes:** surer
- **Must arrange:** the survey date and method beside the claim
- **Costs you:** none beyond current pricing
- **Why:** The top review theme is barely used in ads, and this puts that proof up front.

**4. Cancel Terms Up Front**
- **Said simply:** "It's $49.99 every 4 weeks and they show you how to pause or cancel before you pay."
- **Terms:**
  - Renews at $49.99 (Low Sugar) or $54.99 (Sugar-Free), billed every 4 weeks.
  - "Pause Or Cancel Any Time", with the actual steps printed next to the price and shown before checkout.
- **For:** price doubter ("I hate subscriptions because I feel like they are a trap")
- **Stage:** comparing options / knows you already
- **Changes:** easier
- **Must arrange:**
  - Write the real pause and cancel steps.
  - Confirm whether skip exists.
  - Make checkout show the same renewal price.
  - Promise nothing beyond the site's words.
- **Costs you:** unknown (possibly more pauses)
- **Why:** Cancelling is the loudest public complaint, and this passes the subscription check outright.

**5. One Box, Whole House**
- **Said simply:** "I put mine and the kids' on one order and saved $5."
- **Terms:**
  - Adults and Kids on one order with "Buy 2 Save $5".
  - Adults renews at $49.99 every 4 weeks. Kids renews at $74.98 every 4 weeks, as the Kids page shows, until the brand confirms its price.
  - Both renewal prices are stated before payment.
- **For:** busy parent ("Two subscriptions is too much money")
- **Stage:** knows you already
- **Changes:** easier, more (money-off proposal 1 of 2)
- **Must arrange:**
  - Confirm the Kids renewal price.
  - Confirm it is one charge and one shipment.
  - Confirm whether the $5 repeats on renewals.
- **Costs you:** $5 per qualifying order
- **Why:** It turns two bills into one using a deal that is already live.

**6. Ships in a Day**
- **Said simply:** "It usually ships within a day and shows up a few days later."
- **Terms:** Orders "typically ship within 24 hours and on average arrive 3-5 days later". This is not a guaranteed date.
- **For:** busy parent, and the quitter whose powder has run out
- **Stage:** knows you already
- **Changes:** sooner
- **Must arrange:** nothing
- **Costs you:** none
- **Why:** It is a true speed fact, and it removes "I'll order later".

**7. New Flavour Month**
- **Said simply:** "Subscribers get each new flavour for a month, then it goes back to the regular one on its own."
- **Terms:**
  - Subscribers get the limited flavour for 1 month, then switch back to Original automatically. A new flavour comes every 4 to 8 weeks.
  - The Adults limited flavour renews at $52.79, which is $2.80 more than Original ($52.79 − $49.99). That difference is stated next to the offer.
- **For:** busy parent (picky eaters), quitter
- **Stage:** knows you already
- **Changes:** more
- **Must arrange:**
  - Confirm what subscribers are charged in the flavour month.
  - An opt-out choice.
  - The next flavour's date.
  - Flavour descriptions only, with no tie-in characters or partner marks.
- **Costs you:** unknown
- **Why:** It gives a recurring reason to stay with no discount.

**8. Pay With HSA/FSA**
- **Said simply:** "You can use your HSA or FSA money for it."
- **Terms:** HSA/FSA eligible through a third-party service. The service's name and steps sit beside the offer. Eligibility depends on the buyer's plan.
- **For:** price doubter
- **Stage:** comparing options
- **Changes:** cheaper to start
- **Must arrange:** name the service and confirm any fee or paperwork
- **Costs you:** unknown
- **Why:** It answers "too expensive" without cutting the price.

**9. The $1.79 Day**
- **Said simply:** "After the first box it's under $1.80 a day."
- **Terms:**
  - $49.99 every 4 weeks ÷ 28 packs = $1.785 a day.
  - First order $29.99 with text sign-up for new customers only ($1.07 a day), then $49.99 every 4 weeks.
- **For:** price doubter ("Will the price jump after the first order?")
- **Stage:** knows you already
- **Changes:** cheaper to start
- **Must arrange:** drop the dated "$1.26" comparison
- **Costs you:** none
- **Why:** It leads with the price the buyer will actually keep paying.

## TRY FIRST

- **4:** It answers the loudest complaint and the trap fear, and needs only the cancel steps written down.
- **2:** It answers the strongest-feeling buyer with a guarantee the brand already gives, at almost no new cost.
- **1:** It is the cheapest real way to try, and the pack is already on shelves, so there is nothing to build.

## MISSING

- MISSING: the base price behind each % claim, and whether $66.65 was openly charged for a real stretch of time.
- MISSING: the Kids subscription renewal price ($74.98 vs the $53.32 one-time).
- MISSING: the actual pause, skip and cancel steps.
- MISSING: whether renewals ship free, the free-delivery threshold, one-time shipping cost and average order value.
- MISSING: the names and values of the 4 free gifts.
- MISSING: VIP cost and terms, and the basis for "up to $80".
- MISSING: terms for the referral program, smartwatch giveaway, cashback app, fitness app and the HSA/FSA service.
- MISSING: whether "Buy 2 Save $5" applies to renewals.
- MISSING: the 84-pack subscription price and the Sugar-Free first-order price.
- MISSING: what subscribers pay in a limited-flavour month, and the next flavour date.
- MISSING: current big-box shelf price and stores, and whether shop purchases are covered by the guarantee.
- MISSING: grams of sugar per pack, which matters for the busy parent's "Is the sugar okay for kids?"
- MISSING: cost per order (unit, delivery, gifts).
- MISSING: subscriber and text-list sizes.
- MISSING: the birthday price-cut date and holiday shipping cut-offs.
```
