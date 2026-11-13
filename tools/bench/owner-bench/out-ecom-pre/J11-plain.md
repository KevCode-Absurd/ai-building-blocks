# Memory foam mattress page: first five tests

## What the numbers say

| Last 30 days | Add to cart | Cart to checkout | Checkout to order | Orders per session |
|---|---|---|---|---|
| Desktop | 6.5% | 50% | 44% | 1.44% |
| Mobile, Chrome and Safari | 4.2% | 53% | 34% | 0.76% |
| Mobile, Instagram and Facebook in-app | 3.7% | 24% | 30% | 0.26% |

Two problems stand out.

1. **A checkout bug.** In-app shoppers add to cart almost as often as other mobile shoppers, but only 24% reach checkout, against 53% in Chrome and Safari. The cart log shows 4,300 "pop-up blocked" errors on "Proceed to checkout", about 4,130 from in-app browsers. That nearly matches the 4,800 in-app carts that never reach checkout. It is a fix, so it ships without a test.
2. **The page hides the answers people ask for.** Chats ask about delivery date (34%), firmness (19%), bed fit (17%), trial (16%) and EMI (14%). None of these is answered at the top of the page. Mobile adds to cart at 4.0% against 6.5% on desktop.

## Ship now, without testing

1. **Fix the in-app checkout pop-up.** Open checkout in the same tab, not a new window. If in-app cart-to-checkout rose to the 53% Chrome and Safari get, about 1,860 more shoppers a month would reach checkout. At the in-app 30% close rate, that is up to about 560 more orders a month: roughly ₹81 lakh in sales and ₹34 lakh in gross margin. Check the errors fall to near zero.
2. **Put the trial next to the price.** "Try it for 100 nights." with a link to how it works. Your own rule says the trial shows before the first scroll, and you already make the promise.
3. **Put the star rating under the product name.** "4.5 stars from 20,000+ reviews", linking to the reviews. True, standard, low risk.
4. **Track the new actions.** Log pincode entry, size chosen, size helper, EMI plans and firmness info opened. Without these you cannot read tests 1 to 4.

In the week the fix goes live, run an A/A test (two identical groups) to check the split and get a clean new baseline.

## How the tests are sized

- 95% confidence, 80% power, two-sided, 50/50 by visitor.
- About 16,700 sessions a day, 14,000 on mobile.
- Baselines are today's, before the fix, so these are the cautious case.
- Run whole weeks only. Mattress buyers visit several times before buying, so never stop early on one good week.
- The main metric is **orders per session**, because that pays. Add to cart is an early read only, except in Test 5.
- For scale: 10% more orders is about 350 orders a month, ₹51 lakh in sales and ₹21 lakh in gross margin.

## The five tests, ranked

### 1. Delivery date by pincode, above the fold

- **Problem and evidence:** "When will it be delivered?" is the top chat topic at 34%. The date only appears at checkout. Rohit and Neha move in on the 10th and need to know before they commit.
- **Change:** Under the price, a pincode box: "Check delivery date." After entry: "Delivered by Tue, 18 Nov to 411001." The date updates when size changes, since some sizes may take longer. Remember the pincode for the next visit.
- **Hypothesis:** If shoppers see a real delivery date before they choose, more of them will buy, because the biggest unknown is gone.
- **Main metric:** orders per session, all devices.
- **Guardrail:** cancellations before dispatch, and orders arriving after the shown date. A missed date costs more than no date. Also watch page load time.
- **Split and length:** 50/50, all devices, 4 weeks.
- **Smallest effect it can detect:** about 10% relative, from 0.70% to 0.77% orders per session.

### 2. Four big size buttons and a fit helper (mobile)

- **Problem and evidence:** On mobile, 30+ sizes sit in one long list. Queen, King, Single and Double make up 81% of orders. "Will it fit my bed?" is 17% of chats. Deepa says: "Too many sizes, I just need queen."
- **Change:** Four large buttons with sizes in inches: Queen 78 x 60, King 78 x 72, Single 72 x 36, Double 75 x 48. Below them, "Other sizes" opens the full list. Add "Which size fits my bed?": "Measure the inside of your bed frame. Pick the size closest to it."
- **Hypothesis:** If the common sizes take one tap and the fit question is answered on the page, more mobile shoppers will pick a size and buy.
- **Main metric:** mobile orders per session.
- **Guardrail:** orders for the other 26 sizes (19% today) must not fall. Also watch wrong-size exchanges.
- **Split and length:** 50/50, mobile only, 4 weeks.
- **Smallest effect it can detect:** about 12% relative, from 0.56% to 0.63%.

### 3. Firmness made plain

- **Problem and evidence:** Firmness is 19% of chats. "What if it's too soft for us?" The page explains the mattress in foam terms, not in how it feels.
- **Change:** Next to the size buttons, a simple firmness bar with the product's real rating, for example "Medium firm: [real rating] out of 10." Add one line on who tends to like it, based on how people sleep (back, side, front). No health or pain claims. End with: "Not sure? Try it for 100 nights."
- **Hypothesis:** If shoppers can picture how the mattress feels, and know they can send it back, fewer will stall on "too soft or too hard."
- **Main metric:** orders per session, all devices.
- **Guardrail:** cancellations before dispatch. Then compare both groups' trial returns over the full 100 nights before calling it final.
- **Split and length:** 50/50, all devices, 4 weeks.
- **Smallest effect it can detect:** about 10% relative, from 0.70% to 0.77%.

### 4. EMI and cash on delivery shown under the price

- **Problem and evidence:** EMI is 14% of chats. Deepa says: "I want to see the EMI before I decide." EMI and COD only show at checkout.
- **Change:** Under the price: "EMI from ₹[amount]/month. See plans." The link opens a short table of monthly amounts for the size chosen. Add "Cash on delivery available." Use your partner's real terms. As a guide, ₹14,500 over 12 months with no-cost EMI is about ₹1,209 a month.
- **Hypothesis:** If shoppers see a monthly amount they can afford before checkout, more will buy, and some will choose a bigger size.
- **Main metric:** orders per session, all devices.
- **Guardrail:** cancellation and return-to-origin rate, and COD share. Also report average order value.
- **Split and length:** 50/50, all devices, 4 weeks.
- **Smallest effect it can detect:** about 10% relative, from 0.70% to 0.77%.

### 5. Show the mattress in the first image, and bring reviews up (mobile)

- **Problem and evidence:** The first image is a bedroom with the mattress small in frame. The 4.5-star reviews sit below six image tiles. Many mobile visitors arrive from Instagram and judge fast.
- **Change:** The first image becomes a close-up of the mattress that shows its thickness and layers. Move a review block above the image tiles: the rating, the count, and three recent real reviews that mention comfort, delivery or size.
- **Hypothesis:** If the product and real buyer views are seen in the first two swipes, more mobile shoppers will add to cart.
- **Main metric:** mobile add-to-cart rate, the most direct read for a top-of-page change.
- **Guardrail:** mobile orders per session must not fall, and page load time must not rise.
- **Split and length:** 50/50, mobile only, 2 weeks.
- **Smallest effect it can detect:** about 6% relative, from 4.0% to 4.25% add to cart.

## Schedule

| Week | What runs |
|---|---|
| 1 | Ship the fixes and tracking. Run the A/A test. |
| 2 to 5 | Test 1 (delivery date) and Test 2 (size buttons) |
| 6 to 9 | Test 3 (firmness) and Test 4 (EMI) |
| 10 to 11 | Test 5 (first image and reviews) |

Each pair changes different parts of the page, so both run at once on separate splits and each gets all the traffic. At the end, check that one change did not cancel the other. Ship each winner before the next wave.

All variant copy stays at grade 6 to 7, with no medical claims and no fake timers or stock counts.

## Assumptions

- Traffic stays near the last 30 days.
- The firmness rating and EMI terms are blanks to fill with real figures.
- The pop-up gain is a ceiling: it assumes in-app shoppers reach checkout at the Chrome and Safari rate once fixed.
- In-app browsers may lose cookies. Split by logged-in user where you can.
