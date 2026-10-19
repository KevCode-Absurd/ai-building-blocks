# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 1.

The evidence table is careful, accurate and genuinely useful: every row is sourced to the capture, the arithmetic (55% off, $1.07 and $1.78 per day) checks out, and limits of a text-only capture are stated honestly. It fails on form rather than substance: the required SHOPPER'S QUESTION line is missing, three rows name nothing to keep, and one FAQ note is slightly misattributed to the capture.

## Fix

In 'What you hand back', state that the report must open with the SHOPPER'S QUESTION line copied from the input, and in step 4 require every proposed change to include an explicit 'Keep: ...' clause (or 'Keep: nothing specific').

## Judge list

- Met: Every row points to a capture and a section
  Every row cites "C1, sprout.example/products/sprout, 13 Oct 2026 ... screen size MISSING (unconfirmed), [section]"; row 9 is labelled an inference.
- Met: Nothing is called broken from a screenshot alone; broken-looking things go to the tests list
  "A shopper may expect $29.99 at checkout and not see it" is hedged and sent to test 2; "The Start Now button's look says nothing about whether buying works."
- Met: No row promises more sales; effects on sales marked unknown
  "No analytics or test data, so any effect on sales from the changes above is unknown." Watch metrics are contacts, drop-off, cancellations.
- Met: The couldn't-show list is there and names real limits like checkout and option pickers
  "The cart, the checkout price with or without SMS sign-up... are all untested"; "the 1/2 adults picker effect on price... unknown, not absent."
- Not met: Proposed changes say what to keep as well as what to change
  Rows 1, 2, 4, 6, 7 say "Keep..."; rows 3 ("Put the condition next to the price"), 5 and 8 name no keep.

## Invented

- claim: FAQ (closed by default per notes) (The notes mark only the earlier accordions as closed by default; the returns FAQ section is not described that way, though the output later hedges it.)

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
| Plan box text: "~~$66.65~~ $29.99. $1.07/day. Free Shipping Today." | C1, sprout.example/products/sprout, 13 Oct 2026 (some notes from 30 Sept; the capture doesn't say which), screen size MISSING (unconfirmed), Autoship and Save box | The shopper sees today's price before the button. $1.07/day is $29.99 ÷ 28 packs, so it is a first-box rate. It is not labelled that way, which may answer "Will the price jump?" wrongly. | Label it "first box", e.g. "$29.99 first box ($1.07/day), then $49.99 ($1.78/day)". Keep the strike-through and the per-day format. Watch: share of support contacts or cancellations citing an unexpected price after the first renewal. | How it looks on a phone, its size, and whether it is on the first screen. Whether checkout shows the same figure. |
| Text after the button: "DISCOUNT AUTO-APPLIED." and "Renews at $49.99 each 4 weeks. Cancel anytime." | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), under the Start Now button | The renewal price is on the page, but it comes after "Start Now" in the text order. A shopper may tap before reading it. The supplied notes call it "small", but no screenshot confirms its size. | Move the renewal line into the Subscribe & Save option, beside $29.99, so it comes before the button. Keep "Cancel anytime". Watch: the same renewal-surprise measure as above. | The real font size, contrast and position in a phone screenshot. Whether checkout or the order confirmation repeats the $49.99. |
| Footer text: "**Offer assumes customer has received and uses promotional SMS discount reserved for new customers only." Pop-up text: "Sign Up for 55% Off" (phone number field). | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), footer and pop-up | The brand facts say $29.99 needs the text sign-up. Near the button, "DISCOUNT AUTO-APPLIED" suggests no action is needed, and the condition appears only in the footer. A shopper may expect $29.99 at checkout and not see it. | Put the condition next to the price (e.g. "with text sign-up"), or make "auto-applied" literally true. Choose based on the test result in the next column. Watch: drop-off between the cart and payment for subscription orders. | Untested: what the cart and checkout charge without the SMS sign-up. Also untested: when the pop-up appears, and whether it covers the plan box. |
| Discount figures in the text: bar "Save 52% + free shipping on your first order", badge "MOST POPULAR: GET UP TO 55% OFF", pop-up "55% Off". The "61%" ad is described in the file's notes only. | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), announcement bar, plan badge, pop-up. Ad: MISSING (no capture of the ad) | A shopper arriving from "61% off" finds 52% or 55% instead and may doubt which price is real. By arithmetic, $29.99 vs $66.65 is 55% off and the $49.99 renewal is 25% off. No captured figure matches 61% or 52%. | Use one discount figure from the ad through to checkout, matching the price actually charged. Keep the strike-through price. Watch: the share of ad clicks that go on to the plan box or button (needs analytics). | The ad text and what it promised. Whether the bar rotates for every visitor, and in what order. |
| "Us vs. Them": cost per serving "Sprout $1.26". | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), Us vs. Them section | $1.26 matches neither $1.07 (first box) nor $1.78 (renewal). A careful shopper checking the price may find a third per-day number. | Base this figure on one stated plan and label which one. Watch: questions about per-serving cost in support or chat. | Which plan or pack size $1.26 is based on. The third column label was not captured. |
| Birthday section: "Subs Now Start at $29.99." "...lowering prices. Not just for a week but indefinitely." | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), birthday price cut section | "Indefinitely" next to $29.99 can read as $29.99 being the ongoing subscription price. That conflicts with the $49.99 renewal and feeds the doubt on file. | Reword so the permanent change and the first-box price are clearly separate, e.g. state what the ongoing price is. Keep the price-cut message if it is true. Watch: renewal-surprise contacts. | What price the "indefinitely" claim refers to. What the subscription price was before the cut. |
| Guarantee text: plan box "30-Day Money-Back Guarantee"; bar "30-DAY GUARANTEE"; under button "Less than 1% of customers use our Money-Back Guarantee"; last FAQ "a simple 30-day guarantee on your first order ... This policy applies only to your initial purchase." | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), plan box, bar, under button, FAQ (closed by default per notes) | Before the button, the guarantee reads as unlimited. The first-order-only limit appears only in the last FAQ. That FAQ is far below the button and may be collapsed, so the shopper is unlikely to see it before tapping. | Add "first order" to the plan box line ("30-day money-back guarantee on your first order"). Keep the guarantee prominent. Watch: refund requests on later orders that get denied. | Whether the FAQ is collapsed on phone. What the checkout terms say about the guarantee. |
| One Time Purchase text: "No Free Shipping. No First Order Discount." | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), plan box | "First Order Discount" hints that the subscription saving is first-order only, but only in the option the shopper is steered away from. A buyer already wary of subscriptions may also read this framing as pressure. | Test plain wording for the one-time option. Move the "first order" wording into Subscribe & Save. Watch: the mix of one-time vs subscription orders and later cancellations. | Whether Subscribe & Save is selected by default. The file marks this as inferred, so it is unconfirmed. |
| Notes say the phone first screen likely holds the bar, gallery, title and rating, with the plan box below. | C1, same address, 13 Oct 2026 / 30 Sept, screen size MISSING (unconfirmed), above the fold, marked (inferred) in the file | If true, a shopper from the ad sees "Save 52%" before any price, renewal or guarantee terms. | No change until a phone screenshot confirms the layout. | Everything about layout. This is not an observation, only an inference in the file. |

**What the captures couldn't show**
- C1 is page text plus notes. There are no screenshots, so size, contrast, position, the first screen and the pop-up overlay are all unconfirmed. Any description of layout is the file's reading, not a quote.
- No screen size was recorded. C1 mixes 13 Oct and 30 Sept reads without marking which line comes from which date, so this is not one consistent live look.
- No list of controls. The default plan selection, the 1/2 adults picker effect on price, and how the accordions behave are unknown, not absent.
- No capture of the "61% off" ad.
- Nothing was clicked. The cart, the checkout price with or without SMS sign-up, the renewal disclosure at payment, the cancel flow and guarantee claims are all untested. The Start Now button's look says nothing about whether buying works.
- No analytics or test data, so any effect on sales from the changes above is unknown.
- The Kids page mismatch ($22.49 first box, "Renews at $74.98") is a different product. It is outside this check and not compared here.

**Tests needed** (normal browser, phone first, then desktop)
1. Click the actual 61% ad, or open its landing link, and take full-length phone screenshots with date and screen size. Record the first screen, the pop-up timing, and whether the renewal and guarantee lines are visible before Start Now.
2. As a new visitor with no SMS sign-up, choose Subscribe & Save, tap Start Now, and record the cart and checkout price. Repeat after the SMS sign-up. Stop before payment.
3. On the checkout and confirmation screens, check whether the $49.99 renewal, the 4-week cycle and the first-order-only guarantee are stated.
4. Record the default plan selection and whether choosing 2 adults changes the first-box and renewal prices.
5. Open the returns FAQ on phone to confirm whether it is collapsed by default.

**Next 3 steps**
1. Capture C2, a dated, full-length phone screenshot of the ad-to-page journey with a controls list. Re-check every row above against it.
2. Run test 2 to settle whether "DISCOUNT AUTO-APPLIED" or the SMS footer describes what is actually charged, before rewording anything.
3. Draft one plan-box wording that puts first-box price, renewal price, the SMS condition (if confirmed) and "guarantee on first order" before the button. Set up the renewal-surprise and checkout drop-off measures before any test.
```
