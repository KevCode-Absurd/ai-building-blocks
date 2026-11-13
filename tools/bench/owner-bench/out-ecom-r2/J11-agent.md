# Memory foam mattress page: the first five tests

## The short version

- **Fix the in-app checkout first. Don't test it.** Inside Instagram and Facebook, only 24% of shoppers with a cart reach checkout. On Chrome and Safari it is 53%. Of the 4,300 "pop-up blocked" errors on "Proceed to checkout", 4,128 came from in-app browsers. Fixing it should add an estimated ₹17.0 to ₹34.0 lakh gross profit a month, more than any test below.
- **Then run five tests, one at a time, two weeks each,** from Week 2 to Week 11.
- **Bad news:** mobile turns 0.56% of sessions into orders, desktop 1.44%, in-app mobile only 0.26%. And in two weeks, each test's order guardrail can only catch a big drop (about 14% or more). So keep watching orders after each change ships.
- **This week:** ship the checkout fix and the trial line. Run your test tool on two identical versions for one week to prove the split is even.

## Ship without testing (Week 1)

**1. In-app checkout fix.** Make "Proceed to checkout" open in the same tab, not in a new window. Check it on iPhone and Android, inside both Instagram and Facebook, before release. Then watch two numbers daily for two weeks: in-app cart-to-checkout (now 24%) and pop-up errors (now about 138 a day).

Projection: say in-app cart-to-checkout climbs halfway (39%) or all the way (53%) to the Chrome and Safari rate. With checkout-to-order steady at 30%, that is 279 to 558 more orders a month. At ₹14,500 and 42% margin, each order earns ₹6,090 gross profit after product cost. That gives ₹17.0 to ₹34.0 lakh a month. The one assumed input is how much of the gap closes.

Why no test: it's a broken button. A test would leave half your in-app shoppers on it.

**2. Trial line under the price.** Add "Try it for 100 nights." with a link to the trial terms. Trial and returns make up 16% of pre-sale chats, and today the answer sits only in the FAQ at the bottom. It is a true fact, and your own rule puts it in the first screen. Moving it carries no real risk.

Not in the first five: the hero image. Its only evidence is the page note, so it is test six.

## The five tests, ranked

Ranked by the evidence (chat share, buyers' words, page notes), then by how many visitors the change reaches.

| # | Test | Who sees it | Split | Runs | Smallest lift it can detect (add to cart) |
|---|---|---|---|---|---|
| 1 | Delivery date by pincode | All visitors | 50/50 | Weeks 2 to 3 | 5.5% (4.40% to 4.64%) |
| 2 | Four-size picker | Mobile | 50/50 | Weeks 4 to 5 | 6.3% (4.00% to 4.25%) |
| 3 | Firmness in plain words | All visitors | 50/50 | Weeks 6 to 7 | 5.5% (4.40% to 4.64%) |
| 4 | EMI and COD under the price | All visitors | 50/50 | Weeks 8 to 9 | 5.5% (4.40% to 4.64%) |
| 5 | Reviews moved up | Mobile | 50/50 | Weeks 10 to 11 | 6.3% (4.00% to 4.25%) |

Each test runs exactly 14 days: two full weekly cycles. Keep price, offers, hero image and ad links unchanged meanwhile.

How the lifts were worked out: visitors needed per version = 16 x p x (1 - p) / d², where p is the add to cart rate and d the change. The 16 sets 95% confidence and 80% power. Fourteen days gives 116,667 sessions per version for all visitors, or 98,000 for mobile. Solving for d gives the table.

- **95% confidence:** a 1 in 20 chance of calling a winner that isn't real.
- **80% power:** a 4 in 5 chance of catching a real lift of that size.

### Test 1: Delivery date by pincode

- **Problem and evidence:** "When will it be delivered?" is the top chat topic, at 34%. Rohit and Neha say: "When will it actually come? We move in on the 10th." Today the date only appears at checkout.
- **Change:** a pincode box under the price. Once a pincode is entered, one line shows the arrival weekday and date. Remember the pincode for the next visit. Pad the date so most orders arrive on or before it.
- **Hypothesis:** Because a third of chats ask about delivery and the date hides until checkout, showing it under the price to all visitors will raise add to cart by at least 5.5%.
- **Main metric:** add to cart per session. **Guardrail:** orders per session. Two weeks after the test ends, check that at least 90% of test orders arrived by the date shown.

### Test 2: Four-size picker

- **Problem and evidence:** on mobile, 30 sizes sit in one long list. Queen, King, Single and Double make up 81% of orders. "Will it fit my bed?" is 17% of chats. Deepa says: "Too many sizes, I just need queen."
- **Change:** four large buttons with sizes in inches: Queen 78 x 60, King 78 x 72, Single 72 x 36, Double 75 x 48. Below them, "See 26 more sizes" opens the full list. A "Which size fits my bed?" link says: "Measure the inside of your bed frame, length and width, in inches. Pick the size that matches."
- **Hypothesis:** Because four sizes make 81% of orders but hide in a list of 30, four buttons and a fit guide will raise mobile add to cart by at least 6.3%.
- **Main metric:** mobile add to cart per session. **Guardrails:** mobile orders per session, and the other 26 sizes' share of orders (now 19%).

### Test 3: Firmness in plain words

- **Problem and evidence:** firmness is 19% of chats. Rohit and Neha ask: "What if it's too soft for us?" Your rule is plain words over foam jargon.
- **Change:** a "How does it feel?" line in the first screen. It shows a five-step scale from soft to firm, with this mattress's level marked, and "Not sure? Try it for 100 nights." No foam names in this block.
- **Hypothesis:** Because one chat in five asks about firmness, a plain firmness scale in the first screen for all visitors will raise add to cart by at least 5.5%.
- **Main metric:** add to cart per session. **Guardrail:** orders per session. Over the following months, watch trial returns that give feel as the reason.

### Test 4: EMI and COD under the price

- **Problem and evidence:** EMI is 14% of chats, and EMI and COD only appear at checkout. Deepa says: "I want to see the EMI before I decide."
- **Change:** one line under the price: "EMI from", then the lowest monthly amount on your live EMI plans for the chosen size, then "Cash on delivery available" where the pincode allows it. "See EMI plans" opens the plans without leaving the page.
- **Hypothesis:** Because buyers can't see the monthly cost until checkout, showing EMI and COD under the price will raise add to cart by at least 5.5%.
- **Main metric:** add to cart per session. **Guardrails:** orders per session, and COD share of orders. Read desktop alone as a check only, not as the result.

### Test 5: Reviews moved up

- **Problem and evidence:** 4.5 stars from 20,000+ reviews sit below six image tiles. On a phone, a buyer must scroll past all six to see them.
- **Change:** "4.5 stars from 20,000+ reviews" under the product name, with a tap that jumps to the reviews. Move the reviews block above the six tiles, with filters for feel, size and delivery.
- **Hypothesis:** Because strong proof sits below six images, moving it into view for mobile visitors will raise add to cart by at least 6.3%.
- **Main metric:** mobile add to cart per session. **Guardrails:** mobile orders per session and mobile page load time.

## Rules for every test

1. **Split by visitor, not by session,** so each person sees one version on every visit.
2. **Check the split before reading.** If either version is more than 0.5 points off 50% (say 50.6 to 49.4), the tracking is broken. Fix it and rerun.
3. **Read once, on day 14.** Don't stop early when a result looks good.
4. **Ship** if add to cart rises, the 95% range for the lift sits above zero, and orders per session is not lower. **Stop** if either falls with its range below zero. **No clear result:** keep the simpler version; don't extend.
5. **After shipping,** watch orders per session weekly for four weeks. The guardrail only catches drops of about 14% (all visitors) or 17% (mobile).
6. **Each winner becomes the control** for the next test. No version uses fake timers or stock messages.

## Assumptions

1. Sessions stand in for visitors. Fewer real visitors raise the smallest detectable lift a little; keep the 14-day run anyway.
2. Traffic stays near the last 30 days, about 116,700 sessions a week.
3. The mattress has a stated firmness level, and your EMI partner gives a lowest monthly amount for each size.
