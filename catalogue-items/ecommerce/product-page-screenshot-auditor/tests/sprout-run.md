# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The audit itself is strong: every quote traces to the page text, the score arithmetic is right, nothing is invented, and the owner gets a concrete plan-box rewrite plus the cart tests needed before trusting it. It fails only on form: the report never opens with the SHOPPER'S QUESTION line and puts the score before the couldn't-show section, so it doesn't match the required output shape (and one row slightly overstates that 61% appears nowhere on the page, when it appears as a digestion stat).

## Fix

In 'What you hand back', state the full output shape in order, beginning 'SHOPPER'S QUESTION: <question>' then the table, WHAT THE CAPTURES COULDN'T SHOW, TESTS NEEDED IN A REAL BROWSER, TASK CLARITY SCORE, NEXT 3 STEPS; add a 'Check before you hand it back' bullet: 'The report opens with the shopper's question and the sections appear in this order.'

## Judge list

- Met: Every row points to a capture and a section; nothing described that isn't in the capture
  Each row carries "C1 · sprout.example/products/sprout · 13 Oct 2026 · ... · Plan box, under button"; all quoted lines exist in product-page.md.
- Met: Nothing called broken from a screenshot alone; broken-looking things go to the tests list
  "A shopper probably cannot tell what they pay today" plus test 2: "tap Start Now without the SMS sign-up and record the cart and checkout price."
- Met: No row promises more sales; sales effects marked unknown
  "This is a reading of the page words only and says nothing about sales." Watch metrics are listed, not promised.
- Met: 'Couldn't show' list exists and names real limits such as checkout and option pickers
  "No options were picked, nothing was added to cart, and no checkout or sign-up was submitted."
- Met: Proposed changes say what to keep as well as what to change
  Every row has a Keep line, e.g. "**Keep:** the existing renewal line and 'Cancel anytime.'"

## What went in

```text
Capture C1: page text of sprout.example/products/sprout
(sprout/product-page.md), with earlier notes.
Parts marked "(inferred)" in it were not seen directly.

Shopper's question: arriving from a "61% off" ad, can a shopper
see what they pay today, what it renews at and what the
guarantee covers, before tapping Start Now?

Brand facts: $29.99 first order needs the text sign-up discount.
Renews at $49.99 every 4 weeks. Money-back guarantee covers the
first order only. Buyer doubt on file: "Will the price jump
after the first order?"

[attached: sprout/product-page.md]
```

## What came out

```text
| What was seen | Capture ID, address, date, screen size, section | What it might mean for a shopper | Proposed test or change | Still unknown |
|---|---|---|---|---|
| **[Blocks]** Under the button: "DISCOUNT AUTO-APPLIED". The plan box shows ~~$66.65~~ $29.99. The pop-up reads "Sign Up for 55% Off" with a phone number field. The only statement of the condition is in the footer: "**Offer assumes customer has received and uses promotional SMS discount reserved for new customers only." | C1 · sprout.example/products/sprout · 13 Oct 2026 (merged with 30 Sept notes; the file does not say which read each line comes from) · MISSING: screen size (unconfirmed) · Plan box, under button, pop-up, footer | The page tells the shopper the discount is already applied. The price, however, depends on a text sign-up that appears only in the footer. A shopper probably cannot tell what they pay today, and may expect $29.99 without signing up. | **Change:** Put the condition next to the price, for example: "$29.99 today with text sign-up (new customers)." Remove "AUTO-APPLIED" or make it accurate. **Keep:** the $29.99 figure and the 30-day guarantee line. **Watch:** Start Now taps that reach checkout, and the cart price shown with and without sign-up. **Evidence needed:** a controlled add-to-cart with and without the SMS sign-up. | What the cart actually charges without sign-up. Whether a "**" marker sits near the price. When and whether the pop-up appears. |
| **[Slows]** Announcement bar: "Save 52% + free shipping on your first order". Badge: "MOST POPULAR: GET UP TO 55% OFF". Pop-up: "55% Off". The file says the referring ad shows 61%. That figure does not appear anywhere in the C1 page text. | C1 · sprout.example/products/sprout · 13 Oct 2026 · MISSING: screen size (unconfirmed) · Announcement bar, plan box badge, pop-up | A shopper arriving from a 61% ad meets 52% and 55% instead. They may doubt the offer or search for the "missing" 61% before they work out the actual price. | **Change:** Use one discount figure that matches the ad from landing to plan box. Alternatively, send 61% ad traffic to a page state that shows 61% and explains how it is calculated. **Keep:** "first order" wording in the bar. **Watch:** bounce rate and Start Now tap rate from that ad. **Evidence needed:** the ad itself, and a capture of landing through the ad link. | The ad was not captured. Whether the ad link carries a different offer or page state. |
| **[Slows]** Plan box: "$29.99. $1.07/day. Free Shipping Today. Pause Or Cancel Any Time." The only renewal statement is under the button: "Renews at $49.99 each 4 weeks. Cancel anytime." The file describes this line as small, but that cannot be confirmed from text. | C1 · sprout.example/products/sprout · 13 Oct 2026 · MISSING: screen size (unconfirmed) · Plan box, under button | The renewal price is stated before the tap, which partly answers "Will the price jump?" However, the per-day figure ($1.07) is for the first box only and reads as ongoing. At renewal the cost is $1.78/day. | **Change:** Show both prices together in the plan box, for example: "$29.99 first box ($1.07/day), then $49.99 every 4 weeks ($1.78/day)." **Keep:** the existing renewal line and "Cancel anytime." **Watch:** cancellations or refunds after the first renewal, and support contacts about the price. **Evidence needed:** phone screenshots showing the type size and whether the line sits on the same screen as the price. | Text size and contrast of the renewal line. Whether checkout restates the renewal. |
| **[Slows]** Section "birthday price cut": "Same Sprout. New Lower Price. Subs Now Start at $29.99." "...lowering prices. Not just for a week but indefinitely." | C1 · sprout.example/products/sprout · 13 Oct 2026 · MISSING: screen size (unconfirmed) · Birthday section, below plan box | "Subs ... $29.99 ... indefinitely" can be read as a permanent subscription price. That contradicts "Renews at $49.99" and feeds the doubt on file that the price will jump. | **Change:** Reword to "first box from $29.99" and state the $49.99 renewal there too. Alternatively, remove "indefinitely" if only the first-box price changed. **Keep:** the birthday framing if the brand wants it. **Watch:** the same renewal-complaint figure as above. **Evidence needed:** confirmation from the brand of which price was cut. | What price "lower" refers to (first box or renewal). Where this section sits on a phone. |
| **[Slows]** Plan box (Subscribe & Save): "30-Day Money-Back Guarantee", listed with ongoing benefits. The limit appears only in the last FAQ: "a simple 30-day guarantee on your first order ... This policy applies only to your initial purchase." | C1 · sprout.example/products/sprout · 13 Oct 2026 · MISSING: screen size (unconfirmed) · Plan box; FAQ "How do you handle returns?" | Before tapping, the shopper sees a guarantee with no stated scope next to the subscription. The first-order limit is near the bottom of the page, well below the button. | **Change:** Write "30-day money-back guarantee on your first order" in the plan box. **Keep:** the FAQ answer. **Watch:** guarantee claims made on renewal orders, and support contacts. **Evidence needed:** the scroll distance on a phone between the button and the FAQ. | Whether checkout or the confirmation email states the limit. |
| **[Minor]** Announcement bar: "📦 FREE SHIPPING + 30-DAY GUARANTEE 🔒". Under button: "Less than 1% of customers use our Money-Back Guarantee." | C1 · sprout.example/products/sprout · 13 Oct 2026 · MISSING: screen size (unconfirmed) · Announcement bar, under button | These are two more guarantee mentions without scope, which adds to the impression that it covers every order. | **Change:** Add "first order" to the bar line. **Keep:** the claim-rate line, if it can be supported. **Watch:** as above. | How the bar rotates and how long each message shows. |
| **[Minor]** One Time Purchase option: "No First Order Discount". | C1 · sprout.example/products/sprout · 13 Oct 2026 · MISSING: screen size (unconfirmed) · Plan box | This is the only wording in the plan box suggesting the discount applies to the first order alone, and it sits on the option the shopper is not choosing. | **Change:** Move the "first order" wording to the Subscribe & Save option. **Keep:** the side-by-side prices. **Watch:** the share of shoppers choosing each option. | Which option is selected by default. This is inferred in the file and not scored. |

**Task clarity score**
- Now: 100 − 25 (1 block) − 40 (4 slows × 10) − 6 (2 minor × 3) = **29**
- With every proposed change made: 100 − 0 − 0 − 0 = **100**. This is a reading of the page words only and says nothing about sales.
- Not scored, because they are inferred or outside the shopper's question: Subscribe & Save selected by default, the content of the first phone screen, star rating mismatches, health claims, the sugar-free warning, and the Kids page "$22.49 / renews at $74.98" mismatch. The Kids page is a different product and is not compared like with like.

**What the captures couldn't show**
- MISSING: phone and desktop screenshots. C1 is page text only, so layout, type size, contrast, what fits on the first screen and the button's state were not checked.
- MISSING: screen size for C1. All rows are unconfirmed on this point.
- MISSING: the 61% ad and the page state reached through its link.
- MISSING: a list of the page's visible controls. The default plan selection and the Low Sugar / Sugar-Free and 1 / 2 Adults price changes are unknown.
- The capture merges the 13 Oct read with the 30 Sept notes. The source date of each line is unknown.
- No options were picked, nothing was added to cart, and no checkout or sign-up was submitted. The price actually charged, whether the discount is applied, and whether the renewal and guarantee terms appear in checkout are all untested.
- It is unknown whether a "**" marker sits next to the $29.99 price.
- Pop-up timing and trigger, and announcement bar rotation, are unknown.

**Tests needed** (normal browser, on a real phone and on desktop)
1. Click through the live 61% ad and take full-length phone and desktop screenshots, each with an ID, date and screen size.
2. With Subscribe & Save, tap Start Now without the SMS sign-up and record the cart and checkout price. Repeat after the sign-up.
3. In checkout, check whether the $49.99 renewal and the first-order-only guarantee are stated.
4. Change sugar level and number of adults, and record the price shown and the renewal line for each.
5. Record when the pop-up appears and whether it covers the plan box or the button.

**Next 3 steps**
1. Take the missing screenshots through the actual 61% ad link (tests 1 and 5) so the layout and offer match can be scored.
2. Run the controlled cart test with and without the SMS sign-up (tests 2 and 3) before rewriting the price.
3. Draft one plan-box block and test it against the current box, watching Start Now taps, checkout completion, and refunds and support contacts after the first renewal. Draft: "$29.99 first box with text sign-up · then $49.99 every 4 weeks · 30-day money-back guarantee on your first order", using one discount figure that matches the ad.
```
