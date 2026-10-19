# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 7 of 7 met. Invented facts: 0.

A thorough, honest offer list: every live deal is quoted, the discount tangle is laid out with the 49% math exposed, and the ten proposals are built only from Sprout's own stock with clear must-arrange lines. The only slips are cosmetic: two LIVE said-simply lines carry two numbers, and the tabular LIVE layout differs from the shape.

## Judge list

- Met: Every live offer is there, in your exact wording.
  20 LIVE rows quote brand.md verbatim, e.g. "Save 52% + free shipping on your first order", "MOST POPULAR: GET 49% OFF" at $45.33, "Buy 2 Save $5".
- Met: Every clash between pages is listed, with the smaller figure in use.
  "Headline discount: 49%, 52%, 'up to 55%', 55%, 58%, 'up to 61%' ... Figure used: 49%"; Kids $22.49 vs $24.99 uses $24.99; $20 off vs $29.99/$45.33 uses $20 off.
- Met: Every price is one of yours, or worked from yours with the sum shown.
  "$49.99 ÷ 28 = $1.785", "$19.97 ÷ 12 = $1.66", "$29.99 + ... $24.99 − $5 = $49.98", "1 − 45.33 ÷ 66.65 = 32% off".
- Met: The guarantee is quoted in full, with its limits.
  "30-day money-back. 'This policy applies only to your initial purchase.'" repeated in LIVE 19 and N1 terms.
- Met: No more than two new offers are only money off.
  Only N2 "(money-off 1 of 2)" and N4 "(money-off 2 of 2)"; N7 states "It claims no saving, because there isn't one."
- Met: Every new gift, size or service sits under "must arrange".
  N10 tote: "Must arrange: The gift program itself. Stock. Its end date."; N3: "Or sell the 12-pack on sprout.example."
- Met: Nothing says "limited time" or "exclusive" without a real end date, and there are no exclamation marks.
  No exclamation marks anywhere; "limited flavors" appears only inside the quoted VIP line, never "limited time" or "exclusive".

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

| # | Name | Brand's words (terms) | Said simply | For | Stage |
|---|---|---|---|---|---|
| 1 | First-order bar, 52% | "Save 52% + free shipping on your first order" | About half off your first order, shipping free | Price doubter | Knows you |
| 2 | Bar line, 55% | "Save 55% + Free Shipping" | Over half off, shipping free | Price doubter | Knows you |
| 3 | Product page plan box | "MOST POPULAR: GET UP TO 55% OFF" | Up to 55% off if you subscribe | Price doubter | Knows you |
| 4 | How-it-works plan box | "MOST POPULAR: GET 49% OFF" at $45.33 ($1.62/day) | $45.33 for your first month | Price doubter | Knows you |
| 5 | Kids plan box | "MOST POPULAR: GET 58% WITH FREE SHIPPING" at $22.49, "Renews at $74.98 each 4 weeks" | Kids' first month is $22.49 | Busy parent | Knows you |
| 6 | Text sign-up pop-up | "Sign Up for 55% Off" | Give your number and get 55% off | Price doubter | Comparing options |
| 7 | Meta ads | "up to 61% OFF + 4 FREE gifts" (which gifts changes) | Up to 61% off plus four gifts | Price doubter | Knows you |
| 8 | Ad dollar offer | "$20 off your first order" and "+$5 off for every extra person" | $20 off, and $5 more for each extra person | Busy parent | Knows you |
| 9 | Birthday price | "Same Sprout. New Lower Price. Subs Now Start at $29.99." "Not just for a week but indefinitely." Footer: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only." | Your first subscription order is $29.99 | Price doubter | Knows you |
| 10 | Subscription | $49.99 every 4 weeks ($1.78/day); "Pause Or Cancel Any Time" | $49.99 every four weeks | Quitter | Knows you |
| 11 | One-time purchase | $66.65 ($2.38/day); framed "No Free Shipping", "No First Order Discount" | $66.65 with no subscription | Price doubter | Knows you |
| 12 | Buy more, save more | "Buy 2 Save $5" | $5 off when you order for two people | Busy parent | Knows you |
| 13 | VIP program | "Save up to $80, get limited flavors, and VIP access" | Members save and get the new flavours | Quitter | Knows you |
| 14 | Limited flavour | New one every 4 to 8 weeks. Subscribers get it for 1 month, then switch back to Original automatically. Adults 28 packs: $70.38 Low Sugar / $77.05 Sugar-Free one-time; $52.79 / $57.79 subscription; $32.79 first order. Kids: $57.05 one-time, $27.79 first order. | Try the new flavour for a month | Quitter, busy parent | Knows you |
| 15 | Cashback app | 20% cash back or 40% store credit after purchase, through a third-party app | Get some money back through an app | Price doubter | Knows you |
| 16 | Referral and giveaway | Referral program and a monthly smartwatch giveaway | Refer friends, enter to win a watch | Quitter | Knows you |
| 17 | HSA/FSA | HSA/FSA eligible through a third-party service | You can pay with your health account | Price doubter | Comparing options |
| 18 | Fitness app partner | Free 30 days of a fitness app (one ad) | A month of a fitness app comes with it | Quitter | Knows you |
| 19 | Guarantee | 30-day money-back. "This policy applies only to your initial purchase." Also: "Less than 1% of customers use our Money-Back Guarantee" | Your first order is refundable for 30 days | Gut-fix seeker, price doubter | Comparing options |
| 20 | Shipping | Orders "typically ship within 24 hours and on average arrive 3-5 days later" | It usually arrives within a week | Busy parent | Knows you |

## CLASHES

| Clash | Where each shows | Figure used |
|---|---|---|
| Headline discount: 49%, 52%, "up to 55%", 55%, 58%, "up to 61%" | How-it-works box (49%); announcement bar (52%); product page box (up to 55%); bar line and SMS pop-up (55%); Kids box (58%); Meta ads (up to 61%) | **49%**. The new offers below lead with dollar prices instead. |
| The 49% does not compute from the one-time price | How-it-works box: $45.33 against $66.65 is 1 − 45.33 ÷ 66.65 = 32% off. A 49% cut would need a "was" price of $45.33 ÷ 0.51 = $88.88, and no such price is on file. | Do not quote 49% until the brand names its base price. |
| Adults first-order price: $29.99 vs $45.33 | Birthday line and "starts at" ($29.99, with SMS only); how-it-works box ($45.33) | $29.99 only with the SMS condition beside it; otherwise $45.33 |
| Dollar vs percent first-order deal | Ad: "$20 off your first order" ($66.65 − $20 = $46.65) vs $29.99 or $45.33 elsewhere | $20 off |
| Kids first-order price: $22.49 vs $24.99 | Kids plan box ($22.49); "starts at" ($24.99) | $24.99 (the less generous figure) |
| Kids renewal above the Kids one-time price | Kids box: "Renews at $74.98 each 4 weeks" vs Kids one-time $53.32 | None confirmed. Kids subscription offers hold until fixed. If quoted, use $74.98 as the page shows it. |
| Multi-person saving | "Buy 2 Save $5" vs ad "+$5 off for every extra person" | $5 per order |
| "Indefinitely" vs new-customer-only | Birthday line ("Not just for a week but indefinitely") vs footer ("reserved for new customers only") | $29.99 is a first order for new customers using the SMS discount. It renews at $49.99. |
| Price per serving | Product page "$1.26" vs $1.07/day first order vs $1.78/day subscription | $1.07 (first order) and $1.78 (renewal). Drop $1.26. |
| Free gifts: "4 FREE gifts" with no names | Meta ads only; the gifts change | Not quoted. The gifts are unnamed and their price is unknown. |

## STOCK

- **Sizes:**
  - Adults 28 packs (Low Sugar, Sugar-Free) and 84 packs (3 pouches).
  - Kids 28 and 84 packs.
  - Limited flavour 28 packs.
  - Big-box 12-pack, Adults and Kids, sold in shops only.
- **Prices per day/pack:**
  - Adults one-time: $66.65 ÷ 28 = $2.38.
  - Adults subscription: $49.99 ÷ 28 = $1.785 (the brand states $1.78).
  - Adults first order: $29.99 ÷ 28 = $1.07.
  - Sugar-Free: subscription $54.99 ÷ 28 = $1.96; one-time $73.32 ÷ 28 = $2.62.
  - Adults 84 packs: $199.95 ÷ 84 = $2.38, the same per day as one-time with no bulk saving.
  - Kids: $53.32 ÷ 28 = $1.90, and $159.96 ÷ 84 = $1.90.
  - Big-box Adults: $19.97 ÷ 12 = $1.66 a pack, which is below the site subscription. Big-box Kids: $14.97 ÷ 12 = $1.25.
- **Guarantee:** 30-day money-back, first order only. It sits in the FAQ, plus a "less than 1%" line on the product page. It is not a headline anywhere.
- **Delivery:** ships within about 24 hours and arrives in 3 to 5 days on average. Free shipping comes on first orders and subscriptions. One-time orders are "No Free Shipping". No threshold is on file.
- **Extras:**
  - Kids line.
  - Sugar-Free option.
  - Limited flavours.
  - Electrolyte variety pack, $75.88.
  - Merch: hoodie $45.49, tee $25.99, tote $36.99, caps $25.99.
- **Partner perks:**
  - Cashback app.
  - HSA/FSA via a third party.
  - 30-day fitness app.
  - Smartwatch giveaway.
  - Referral program.
- **Proof:**
  - 2025 12-week study: vitamin C +40.1%, folate +20.5%.
  - Third-party testing: 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants. Outside lab, Sept 2026.
  - Survey of 3,000+ users.
- **Reachable buyers:**
  - Subscribers.
  - SMS list.
  - VIP members.
  - Reviewers. 109,639 is the on-page widget count.
- **Dates:** a new limited flavour every 4 to 8 weeks. A past holiday flavour shows a season exists. No cut-offs are on file.

## NEW

**N1. First Month, Money Back**
- **Said simply:** "If it doesn't work for you, you get your first 30 days back."
- **Terms:** First order $29.99 with the SMS sign-up discount (new customers only), renewing at $49.99 every 4 weeks. 30-day money-back guarantee: "This policy applies only to your initial purchase." Gut-sensitive buyers are pointed to Low Sugar.
- **For:** Gut-fix seeker ("Will this upset my stomach more?"); price doubter.
- **Stage:** Comparing options.
- **Changes:** Surer.
- **Must arrange:**
  - Put the guarantee in the headline, not just the FAQ.
  - Write one line saying how to cancel.
- **Costs you:** Refunds on first orders. Unknown.
- **Why:** It takes the risk off the doubt with the strongest feelings, using a guarantee the brand already gives but barely shows.

**N2. A Dollar-Seven a Day** *(money-off 1 of 2; reuses live offer 9)*
- **Said simply:** "Your first month works out to about a dollar a day."
- **Terms:** $29.99 for your first 28 packs ($29.99 ÷ 28 = $1.07/day) with the SMS sign-up discount, new customers only, then $49.99 every 4 weeks ($1.78/day). Free shipping on the first order, per the site bar.
- **For:** Price doubter ("Will the price jump after the first order?").
- **Stage:** Knows you.
- **Changes:** Cheaper to start.
- **Must arrange:**
  - Retire the competing percentages.
  - Write the cancel steps.
- **Costs you:** Nothing new. This is today's first-order price.
- **Why:** One price and its renewal in the same sentence answers "which discount is real?"

**N3. Try the 12-Pack**
- **Said simply:** "Not sure yet? Grab the small pack at the store first."
- **Terms:** The 12-pack is sold at big-box retailers, $19.97 Adults ($1.66/pack) or $14.97 Kids ($1.25/pack). It is a one-time buy with no subscription.
- **For:** Quitter ("A gummy can't hold enough"); busy parent ("Is this just candy?").
- **Stage:** Hasn't noticed the problem.
- **Changes:** Cheaper to start, surer.
- **Must arrange:**
  - A store-finder link.
  - Or sell the 12-pack on sprout.example. It is shops-only today.
- **Costs you:** Unknown. It may pull buyers from the site price.
- **Why:** A small, safe try already exists. Note the retail pack is cheaper per day than the subscription.

**N4. One Box, Whole Household** *(money-off 2 of 2; reuses live offer 12)*
- **Said simply:** "Your gummies and the kids' come in one box, $5 off."
- **Terms:** Adults first order $29.99 + Kids first order $24.99 − $5 = $49.98. The renewal price must be stated before launch.
- **For:** Busy parent ("Two subscriptions is too much money").
- **Stage:** Knows you.
- **Changes:** Easier, more.
- **Must arrange:**
  - Confirm the Kids renewal price ($74.98 vs $53.32 one-time).
  - Confirm whether $5 applies on renewals.
  - Confirm whether the SMS price applies to Kids.
  - Write the cancel steps.
- **Costs you:** $5 per order, plus anything unknown.
- **Why:** It answers the two-subscription doubt with a deal the brand already runs.

**N5. Your Plan, Spelled Out**
- **Said simply:** "It bills every four weeks, and you can pause or cancel any time."
- **Terms:** $49.99 every 4 weeks. "Pause Or Cancel Any Time." A limited flavour runs 1 month, then switches back to Original automatically. All of this sits beside the price before checkout.
- **For:** Price doubter ("subscriptions… are a trap").
- **Stage:** Comparing options.
- **Changes:** Easier.
- **Must arrange:**
  - Exact cancel and pause steps.
  - Say whether skip exists.
  - Promise nothing beyond the site's words.
- **Costs you:** Nothing.
- **Why:** Cancelling is the loudest public complaint. Clear terms answer it without a discount.

**N6. Proof Next to the Price**
- **Said simply:** "In their study, vitamin C levels in the blood went up 40% in 12 weeks."
- **Terms:** $29.99 first order (SMS, new customers only), then $49.99 every 4 weeks. 21 vitamins & minerals and 6 g fiber per pack. Clinically tested for nutrient absorption (2025, 12 weeks, 120 adults: vitamin C +40.1%, folate +20.5%). Third-party tested, Sept 2026.
- **For:** Quitter ("can't hold enough to replace my powder").
- **Stage:** Comparing options.
- **Changes:** Surer.
- **Must arrange:** Nothing new. Keep the claims at "supports".
- **Costs you:** Nothing.
- **Why:** It answers the quitter's doubt with facts the brand owns.

**N7. 84 Days, No Subscription**
- **Said simply:** "Three months of gummies in one order, nothing to cancel."
- **Terms:** 84 packs, $199.95 Low Sugar, one-time ($199.95 ÷ 84 = $2.38/day, the same as three single pouches). No renewal. Shipping is charged per the "No Free Shipping" one-time rule.
- **For:** Price doubter who hates subscriptions.
- **Stage:** Knows you.
- **Changes:** More, easier.
- **Must arrange:** State the shipping cost.
- **Costs you:** Nothing new.
- **Why:** It gives a real way out of the subscription fear. It claims no saving, because there isn't one.

**N8. Pay With Your HSA**
- **Said simply:** "You can use your HSA or FSA card for it."
- **Terms:** HSA/FSA eligible through a third-party service. Prices as above: $29.99 first order (SMS, new customers only), then $49.99 every 4 weeks.
- **For:** Price doubter.
- **Stage:** Comparing options.
- **Changes:** Cheaper to start, without cutting price.
- **Must arrange:**
  - Name the service.
  - State any steps or fees.
- **Costs you:** Unknown.
- **Why:** It eases the price without adding a sixth discount.

**N9. Ships Within a Day**
- **Said simply:** "It usually ships the next day."
- **Terms:** Orders "typically ship within 24 hours and on average arrive 3-5 days later."
- **For:** Busy parent.
- **Stage:** Knows you.
- **Changes:** Sooner.
- **Must arrange:** Nothing.
- **Costs you:** Nothing.
- **Why:** A true, quick start. It must keep "typically" and "on average".

**N10. Tote on Order Two**
- **Said simply:** "Stick with it to your second box and a tote comes with it."
- **Terms:** On your first renewal at $49.99, a Sprout tote (sold at $36.99) ships with it, one per customer.
- **For:** Quitter ("the one thing I've been able to stick to").
- **Stage:** Knows you.
- **Changes:** More.
- **Must arrange:**
  - The gift program itself.
  - Stock.
  - Its end date.
- **Costs you:** Tote cost, unknown.
- **Why:** It rewards the habit, which is the open lane in ads, with a gift that has a real price.

## TRY FIRST

1. **N1:** It answers the biggest-feeling doubt using a guarantee the brand already gives. Only placement and cancel wording are needed.
2. **N2:** It turns five clashing discounts into one price with its renewal. It costs nothing beyond today's offer.
3. **N5:** It takes on the loudest complaint directly at zero cost. It needs only written terms.

## MISSING

- `MISSING: how to cancel and pause`, word for word. Also whether skip exists.
- `MISSING: Kids subscription renewal price` ($74.98 vs $53.32 one-time) and whether the SMS price applies to Kids.
- `MISSING: whether "Buy 2 Save $5" applies on renewals.`
- `MISSING: free-shipping threshold, renewal shipping, one-time shipping cost.`
- `MISSING: average order value.` The add-on free-delivery check can't be run.
- `MISSING: cost per order`, and the names and prices of the "4 FREE gifts".
- `MISSING: the base price behind 49%, 52%, 55%, 58% and 61%.`
- `MISSING: what subscribers pay in a limited-flavour month`, and the next flavour's dates.
- `MISSING: holiday shipping cut-offs.`
- `MISSING: HSA/FSA service name and fees`, VIP terms, and the 84-pack subscription price.
- `MISSING: whether the site can sell the 12-pack.`

## SCORE

Score: 86/100 (6 of 7 checks)

- **Missed, "Each 'free', 'was', subscription and urgency line passes step 6":** the subscription offers (N1, N2, N4, N5, N6, N8) can't yet say how to cancel, because the file only gives "Pause Or Cancel Any Time". N4 also has no confirmed renewal price.
```
