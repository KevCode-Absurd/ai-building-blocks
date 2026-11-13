# Memory foam mattress page: the first five tests

## The call

**Fix the in-app checkout bug this week, before any test.** In Instagram and Facebook in-app browsers, only 23.8% of carts reach checkout (1,500 of 6,300). In Chrome and Safari it is 53.3%. The cart logged 4,300 "pop-up blocked" errors, 96% in-app. At the Chrome and Safari rate, in-app carts would make 1,860 more checkouts and about 558 more orders a month. Projection: recovering half to all of that gap is 280 to 560 orders, or ₹17 to ₹34 lakh gross profit a month.

**Then run five tests in two lanes, all done by 17 January.**

| Rank | Test | Who sees it | Main metric | Run | Smallest effect |
|---|---|---|---|---|---|
| 1 | Delivery date on the page | All devices | Orders per session | 4 weeks | 9.9% |
| 2 | Four common sizes first | Mobile | Add to cart | 2 weeks | 6.3% |
| 3 | EMI line under the price | All devices | Orders per session | 4 weeks | 9.9% |
| 4 | Reviews above the image tiles | Mobile | Add to cart | 2 weeks | 6.3% |
| 5 | Mattress-first hero image | All devices | Add to cart | 2 weeks | 5.5% |

**Bad news.** Mobile converts 0.56% of sessions, desktop 1.44%, in-app just 0.26%. These tests only catch fairly big lifts; a smaller real lift will read as flat. Mobile checkout-to-order is also weak (33% against desktop's 44%). That is a checkout job for later.

**Numbers rest on:**
- Gross profit per order of ₹6,090 (42% of ₹14,500), before delivery, payment and return costs. Real gains will be lower.
- Sessions as a stand-in for visitors: 98,000 mobile and 116,700 total a week. If a test is short of its sample at the planned end, add one full week.
- 95% confidence, 80% power, and a server-side split so the old page never flashes.

## Ship without testing (16 to 22 November)

1. **In-app checkout fix.** "Proceed to checkout" opens in the same tab. Do the same for any EMI, payment or size-guide link that opens a new window. Confirm pop-up errors drop to near zero.
2. **"Try it for 100 nights" beside the price,** linked to the plain-words trial terms. Your own rule puts the trial above the first scroll. 16% of chats ask about it.
3. **"4.5 out of 5 from 20,000+ reviews" under the product name,** linked to the reviews.
4. **Tracking check.** Test-tool purchases must match store orders within about 5%.

Tests start once item 1 is live. Until then, in-app gains die at the cart.

## The five tests

### 1. Delivery date on the page

- **Problem and evidence:** the date shows only at checkout. "When will it be delivered?" is 34% of chats, the top topic. Rohit and Neha: "We move in on the 10th."
- **Change:** under the price, "Enter your pincode to see your delivery date." Then: "Delivered by Tue, 1 Dec," using the real date for that size and pincode.
- **Hypothesis:** because a third of chats ask about delivery and the date hides until checkout, showing it will raise orders per session by at least 9.9%.
- **Metric and guardrail:** orders per session (0.70%). Not add to cart: people now add to cart just to find the date, so it may fall while orders rise. Guardrails: gross profit per order, and deliveries on or before the shown date.
- **Split and run:** 50/50 by visitor, all devices, mobile and desktop read as named segments. 4 weeks, 23 November to 20 December, about 233,000 sessions per version.
- **Smallest effect:** 9.9%, about 347 orders or ₹21 lakh a month (projection).

### 2. Four common sizes first (mobile)

- **Problem and evidence:** 30+ sizes in one long list, yet four make 81% of orders (Queen 36%, King 22%, Single 14%, Double 9%). "Will it fit my bed?" is 17% of chats. Deepa: "Too many sizes, I just need queen."
- **Change:** four buttons in sales order: Queen 78 x 60 in, King 78 x 72, Single 72 x 36, Double 75 x 48. Then "Other sizes (26)" and "Which size fits my bed? Measure inside your frame." No size is pre-picked.
- **Hypothesis:** because four sizes cover 81% of buyers and the list buries them, showing them first will raise mobile add to cart by at least 6.3%.
- **Metric and guardrail:** mobile add to cart (4.0%). Guardrails: orders per mobile session, gross profit per order (size mix), and size returns read 4 weeks after delivery.
- **Split and run:** 50/50 by visitor, mobile only. 2 weeks, 23 November to 6 December, about 98,000 sessions per version.
- **Smallest effect:** 6.3%. If half reaches orders, about ₹4.5 lakh a month (projection).

### 3. EMI line under the price

- **Problem and evidence:** EMI shows only at checkout. 14% of chats ask about it. Deepa: "I want to see the EMI before I decide."
- **Change:** "Or pay ₹X a month on EMI. See plans." X is the lowest monthly amount for the chosen size, pulled live from your payment partner. "See plans" opens a sheet on the same page.
- **Hypothesis:** because EMI buyers must reach checkout to see the cost, showing it under the price will raise orders per session by at least 9.9%.
- **Metric and guardrail:** orders per session (0.70%); add to cart would mislead, as people add to cart to see EMI. Guardrails: gross profit per order after EMI fees (no-cost EMI costs you margin) and COD share.
- **Split and run:** 50/50 by visitor, all devices, desktop as the named segment. 4 weeks, 21 December to 17 January, about 233,000 sessions per version.
- **Smallest effect:** 9.9%, about ₹21 lakh a month (projection).

### 4. Reviews above the image tiles (mobile)

- **Problem and evidence:** 20,000+ reviews sit below six image tiles. Firmness is 19% of chats. Rohit and Neha: "What if it's too soft for us?"
- **Change:** move the review block above the tiles, with "Firmness", "Delivery" and "Size" tabs that filter real reviews.
- **Hypothesis:** because firmness doubt is common and the reviews that answer it are buried, moving them up will raise mobile add to cart by at least 6.3%.
- **Metric and guardrail:** mobile add to cart (4.0%). Guardrails: orders per mobile session and page load time.
- **Split and run:** 50/50 by visitor, mobile only. 2 weeks, 7 to 20 December, about 98,000 sessions per version.
- **Smallest effect:** 6.3%, about ₹4.5 lakh a month if half reaches orders (projection).

### 5. Mattress-first hero image

- **Problem and evidence:** the first image is a bedroom with the mattress small in frame. Thinnest evidence of the five, so it ranks last.
- **Change:** the first image shows the mattress filling the frame from a low side angle, showing its height; the bedroom moves to second.
- **Hypothesis:** because shoppers cannot see the product on the first screen, a mattress-first image will raise add to cart by at least 5.5%.
- **Metric and guardrail:** add to cart (4.4%). Guardrails: orders per session and page load time.
- **Split and run:** 50/50 by visitor, all devices, in-app against other mobile as the named segment. 2 weeks, 21 December to 3 January, about 116,700 sessions per version.
- **Smallest effect:** 5.5%, about ₹5.9 lakh a month if half reaches orders (projection).

## Rules for every test

- **Two lanes.** Tests 1 then 3 in one lane; tests 2, 4 then 5 in the other. Each visitor is assigned to each test separately. One at a time would take 14 weeks, and these change different parts of the page. Dates may vary by size, so also read tests 1 and 2 in their four combined groups; if one combination behaves differently, report them together.
- **No peeking.** Read only at the planned end. Stop early only for a broken version, orders per session down more than 10%, or an uneven split.
- **Split check.** At the end, test that visitors split 50/50. An uneven split voids the result until the cause is found.
- **Ship rule.** Ship when the main metric wins at 95% and gross profit per visitor is up with no guardrail breach. Flat means the effect is below the smallest effect: ship the simpler version and move on.
- **Sales.** Move any test that would overlap a sale.

## Bolder move: let buyers pick their delivery day

If test 1 wins, let shoppers choose a delivery day on the page, not just see one. Each 1% lift in orders is about 35 orders, or ₹2.1 lakh gross profit a month (projection). First step: ask logistics which pincodes can keep a chosen day. Risk: a missed day breaks the promise, so offer it only where on-time delivery is proven.
