# Wakefit memory foam mattress page: the first five tests

## The short answer

Fix the in-app checkout bug this week. It may be worth up to about ₹34 lakh gross profit a month. Ship three safe changes with it. Then run five tests in three waves over 13 weeks. Every test runs 4 full weeks on all traffic, split 50/50, and can detect a 10% lift in orders per session.

| Rank | Test | Main evidence | Wave |
|---|---|---|---|
| 1 | Delivery date by pincode, under the price | 34% of pre-sale chats ask when it will arrive | 1 (weeks 2 to 5) |
| 2 | Four main sizes as big buttons | Top 4 sizes are 81% of orders; 17% of chats ask about fit | 1 (weeks 2 to 5) |
| 3 | "How firm is it?" in plain words | 19% of chats ask about firmness | 2 (weeks 6 to 9) |
| 4 | EMI and cash on delivery under the price | 14% of chats ask about EMI | 2 (weeks 6 to 9) |
| 5 | Mattress-first hero image | Page review only | 3 (weeks 10 to 13) |

## Ship without testing (week 0)

**1. Fix the in-app checkout bug.** In Instagram and Facebook's in-app browsers, 24% of carts reach checkout (1,500 of 6,300). In Chrome and Safari, 53% do (5,600 of 10,500). The cart logged 4,300 "pop-up blocked" errors on "Proceed to checkout", 96% from in-app browsers.
- Change: "Proceed to checkout" opens in the same tab, never a pop-up or new window. Check it by hand in both apps, on Android and iPhone, through UPI and EMI payment.
- Worth: at the Chrome and Safari rate, 1,860 more in-app carts would reach checkout each month. At 30%, that is about 558 orders, or about ₹34 lakh gross profit (558 x ₹6,090). It is a ceiling; some of the gap may be lower intent.

**2. "Try it for 100 nights" under the price**, linked to the trial terms. Today it sits only in the FAQ, and 16% of chats ask about trial and returns.

**3. "4.5 stars from 20,000+ reviews" under the product name**, jumping to the reviews, which now sit below six image tiles.

**4. Tracking.** Purchases in analytics should match real orders within about 5%. Add events for size chosen, pincode checked, EMI plans opened and trial link tapped.

## How every test runs

- **Split:** all visitors, devices and sources, 50/50 by visitor. The same person always sees the same version. Split on the server; page-swapping scripts flicker and can fake a win.
- **Main metric:** orders per page session. The ship call uses gross profit per session (orders per session x ₹6,090).
- **Sample size:** baseline 0.70% (3,500 orders from 500,000 sessions), about 116,700 sessions a week. Four weeks gives about 233,300 per version. For a two-sided 5% test at 80% power, each version needs about 16 x p x (1 - p) / d². For a 10% lift (0.70% to 0.77%): 16 x 0.007 x 0.993 / 0.0007² = about 227,000. It fits. Confirm in your testing tool's calculator and use the larger number.
- **Smallest effect:** 10% relative, about 350 more orders a month, worth about ₹21 lakh gross profit. A smaller real lift reads as flat; then keep the cheaper version. After the bug fix the baseline should rise to about 0.81%, which needs only about 196,000 per version.
- **Two tests per wave:** each visitor is placed in each test separately, so both get full traffic. At the end, read the four combinations. If the pair does worse together than apart, ship only the stronger change.
- **Stop rules:** read on the planned end date, not before. Stop early only if a version breaks, a guardrail limit is crossed, or the split drifts from 50/50 (check day 2, then weekly).
- **Segments, named now:** mobile versus desktop, and in-app versus Chrome and Safari. Too small to call a winner alone.
- **Calendar:** never start in a sale week.

## Test 1: Delivery date by pincode

- **Problem and evidence:** delivery is the top chat topic at 34%, and the date appears only at checkout. Rohit and Neha: "We move in on the 10th."
- **Change:** a pincode box under the price, "Check your delivery date". It then shows "Delivered by Thu, 10 Dec to 411001" and remembers the pincode. Control: no date until checkout.
- **Hypothesis:** because a third of chats ask about delivery, showing a real date on the page will raise orders per session by at least 10%.
- **Guardrails:** share of orders delivered by the date shown (no lower than today's on-time rate), cancellations before dispatch, page load time.
- **Why test, not ship:** the lookup is new code, and long dates for some pincodes may put buyers off.

## Test 2: Four main sizes first

- **Problem and evidence:** on mobile, 30+ sizes sit in one long list. Queen (36%), King (22%), Single (14%) and Double (9%) make 81% of orders. Deepa: "Too many sizes, I just need queen."
- **Change:** four big buttons with inches: Queen 78 x 60 in, King 78 x 72 in, Single 72 x 36 in, Double 75 x 48 in. A fifth, "Other sizes", opens the full list. A "Which size fits my bed?" link says: measure the inside of your bed frame and pick the closest size. Nothing is pre-selected.
- **Hypothesis:** putting the sizes 4 in 5 buyers choose in front of them will cut the scroll and the fit doubt, and raise orders by at least 10%.
- **Guardrails:** orders in the other 26 sizes (19% today) must not fall more than 10%; wrong-size exchange requests.
- **Note:** delivery dates may depend on size, so the combination read with Test 1 matters most here.

## Test 3: "How firm is it?" in plain words

- **Problem and evidence:** firmness is 19% of chats. Rohit and Neha: "What if it's too soft for us?"
- **Change:** under the size buttons, a firmness scale with this mattress marked, two plain lines on how it feels, and "Not sure? Try it for 100 nights." Feel facts come from your product team. No health claims.
- **Hypothesis:** answering the feel question in plain words, next to the trial, will settle the "too soft" fear and raise orders by at least 10%.
- **Guardrails:** trial returns and average order value. Read early return requests at 30 days, and the full read once 100 nights have passed for test buyers. If extra returns cancel the extra orders, roll it back.

## Test 4: EMI and cash on delivery under the price

- **Problem and evidence:** EMI is 14% of chats, and EMI and COD show only at checkout. Deepa: "I want to see the EMI before I decide."
- **Change:** one line under the price with the lowest real monthly EMI for the chosen size and "Cash on delivery available". "See EMI plans" opens the real plans from your payment partner. Say "No-cost EMI" only where it is.
- **Hypothesis:** showing the monthly cost before checkout will let EMI shoppers decide on the page and raise orders by at least 10%.
- **Main metric detail:** count delivered or prepaid orders, since COD orders are not money until delivered. The final read waits 3 weeks after the test ends.
- **Guardrails:** COD share, return-to-origin rate, average order value.
- **Note:** Deepa shops on a laptop, but a desktop-only test would need about 12 weeks. Run it on all devices; read desktop as a segment.

## Test 5: Mattress-first hero image

- **Problem and evidence:** the hero is a bedroom scene with the mattress small in frame. No chat data backs this, so it ranks last.
- **Change:** the first image shows the whole mattress filling the frame, with a corner cut away to show the layers in plain labels. The bedroom scene moves to image 2.
- **Hypothesis:** showing the product first will raise add-to-cart and orders by at least 10%.
- **Guardrails:** first-image load time, add-to-cart rate.
- **Note:** image changes rarely move orders this much; if flat, keep the brand's choice.

## Assumptions

- Gross profit per order is ₹6,090 (₹14,500 x 42%). This is before delivery, payment fees and returns, so true profit is lower. Rankings hold because every test uses the same unit.
- Your setup can split on the server and place a visitor in two tests at once.
- Week 1 runs clean after the bug fix to set the new baseline.

## To confirm

- Trial terms: what a return costs the buyer and how pick-up works.
- Firmness facts for this mattress.
- Real EMI plans by size, and which are truly no-cost.
- How accurate pincode dates are, and today's on-time rate.
- Whether COD covers every size and pincode.
