# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A disciplined audit that sticks to the page text, correctly says there are no screenshots, and works out 55%, 25% and $1.78/day from given prices without inventing anything. The owner gets a clear priority (the AUTO-APPLIED vs SMS-footer contradiction), concrete rewrites with Keep lines, a correct score (29 to 97), and a sensible browser test list.

## Judge list

- Met: Every row points to a capture and a section
  Each entry has Where: "C1, sprout.example/products/sprout, read 13 Oct 2026 ... Sections: Autoship and Save, announcement bar, and FAQ".
- Met: Nothing called broken from a screenshot alone; broken-looking things go to the tests list
  "Select Subscribe & Save and tap Start Now without the SMS sign-up. Record the cart total" sits in tests; entries describe text only.
- Met: No row promises more sales; effects on sales marked unknown
  Watch lines name metrics only, e.g. "Watch: Start Now tap rate from 61%-ad traffic"; no sales lift claimed.
- Met: Couldn't-show list present with real limits such as checkout and option pickers
  "Which plan is selected by default", "What the cart and checkout show after tapping Start Now, with and without the SMS sign-up."
- Met: Proposed changes say what to keep
  All seven Try lines carry Keep, e.g. "Keep: the strikethrough $66.65 and the per-day line."

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
SHOPPER'S QUESTION: Arriving from a "61% off" ad, can a shopper see what they pay today, what it renews at, and what the guarantee covers, before tapping Start Now?

CAPTURE NOTE  C1 is the page text of sprout.example/products/sprout, read 13 Oct 2026, merged with notes from 30 Sept 2026. The two reads are not separated line by line. There are no screenshots. MISSING: screen size, device, and list of controls, so every entry is unconfirmed for layout, type size and what sits on the first screen. The words "small" for the renewal line come from the notes, not from an image. The 61% ad is not in the capture. Several items are marked (inferred) in the source and are not scored: the default selection of Subscribe & Save, the gallery, the phone first screen, the share of phone visitors, the Low Sugar vs. Sugar-Free panel, and the Kids $74.98 renewal. Ratings, claims, the vitamin count and the review position are outside this question and were left out.

1. Seen:    The page shows three discount figures. The announcement bar says "Save 52% + free shipping on your first order". The plan badge says "MOST POPULAR: GET UP TO 55% OFF". The pop-up says "Sign Up for 55% Off". The figure 61% appears on the page only as a stat: "61% of Americans experience weekly digestive issues". $29.99 against $66.65 works out to 55% off. The $49.99 renewal works out to 25% off.
   Where:   C1, sprout.example/products/sprout, read 13 Oct 2026 (may draw on 30 Sept notes), screen size MISSING (unconfirmed). Sections: announcement bar, Autoship and Save badge, pop-up, "Modern Living Leaves Our Bodies Deficient".
   Means:   A shopper expecting 61% off finds no 61% offer. They may decide the ad was misleading, or hunt for a hidden code before tapping.
   Try:     Use one discount figure that matches the ad across the bar, badge, pop-up and ad, or change the ad to the page figure. Keep: the $66.65 / $29.99 price pair and the plan box layout. Watch: Start Now tap rate from 61%-ad traffic.
   Unknown: The exact wording and destination of the 61% ad. Whether 52% belongs to a different offer. The 49% and 58% figures on other pages.
   Tag:     slows

2. Seen:    Under the button, the page says "DISCOUNT AUTO-APPLIED". The footer says "**Offer assumes customer has received and uses promotional SMS discount reserved for new customers only." Nothing in or near the plan box says that $29.99 needs the text sign-up.
   Where:   C1, sprout.example/products/sprout, read 13 Oct 2026, screen size MISSING (unconfirmed). Sections: under the Start Now button, and the footer.
   Means:   The page tells the shopper the discount is automatic, and then says in the footer that it is not. A shopper cannot tell whether today's price is $29.99 or something else without the SMS step. The brand facts confirm the SMS condition.
   Try:     Remove the contradiction. Either make the discount truly auto-applied, or put "$29.99 with text sign-up" in the plan box next to the price and drop "DISCOUNT AUTO-APPLIED". Keep: the strikethrough $66.65 and the per-day line. Watch: share of carts reaching checkout at $29.99 against $66.65.
   Unknown: What price the cart shows with and without the SMS sign-up. Where the footer's "**" marker points on the page, if anywhere.
   Tag:     blocks

3. Seen:    The plan box shows "~~$66.65~~ $29.99. $1.07/day" and "28 packs each 4 weeks". The renewal, "Renews at $49.99 each 4 weeks. Cancel anytime.", appears only under the Start Now button, not in the plan box.
   Where:   C1, sprout.example/products/sprout, read 13 Oct 2026, screen size MISSING (unconfirmed). Sections: Autoship and Save (Subscribe & Save tile), and under the button.
   Means:   $1.07/day is the first box only. The ongoing cost is $1.78/day. A shopper with the doubt on file ("Will the price jump after the first order?") has to read past the button to find the answer. On a phone it may sit below the fold.
   Try:     Put the renewal price inside the Subscribe & Save tile, for example "$29.99 today, then $49.99 every 4 weeks ($1.78/day)". Keep: "Pause Or Cancel Any Time" and the line under the button. Watch: cancellations before the second box, and support contacts about the renewal price.
   Unknown: The type size and position of the renewal line on a phone. Whether checkout restates the renewal.
   Tag:     slows

4. Seen:    The plan box lists "30-Day Money-Back Guarantee" under Subscribe & Save. The bar says "FREE SHIPPING + 30-DAY GUARANTEE". The limit, "This policy applies only to your initial purchase", appears only in the last FAQ, below the plan box.
   Where:   C1, sprout.example/products/sprout, read 13 Oct 2026, screen size MISSING (unconfirmed). Sections: Autoship and Save, announcement bar, and FAQ "How do you handle returns?".
   Means:   Placed next to an ongoing subscription, the guarantee reads as covering every box. The first-order limit (confirmed by the brand facts) is far below the button.
   Try:     Change the plan box line to "30-day money-back guarantee on your first order". Keep: the FAQ answer as is. Watch: refund requests on second and later boxes that are turned down.
   Unknown: Whether checkout or the confirmation email states the limit.
   Tag:     slows

5. Seen:    The birthday section says "Same Sprout. New Lower Price. Subs Now Start at $29.99" and "we're lowering prices. Not just for a week but indefinitely."
   Where:   C1, sprout.example/products/sprout, read 13 Oct 2026, screen size MISSING (unconfirmed). Section: birthday price cut.
   Means:   "Indefinitely" next to $29.99 can read as $29.99 being the lasting price, which clashes with the $49.99 renewal and feeds the price-jump doubt.
   Try:     Rewrite the section to say what actually dropped and what the ongoing price is, for example "First box $29.99, then $49.99". Keep: the birthday theme and headline. Watch: support contacts saying "I was told $29.99".
   Unknown: What price changed in the birthday cut, and what it was before.
   Tag:     slows

6. Seen:    The "Us vs. Them" section gives Sprout's cost per serving as $1.26. The plan box shows $1.07/day. The renewal works out to $1.78/day.
   Where:   C1, sprout.example/products/sprout, read 13 Oct 2026, screen size MISSING (unconfirmed). Section: Us vs. Them.
   Means:   A third per-day figure that matches neither today's price nor the renewal makes the true daily cost harder to pin down.
   Try:     Base the comparison on a stated price, for example the renewal at $1.78, and name it. Keep: the comparison columns and the powder figure. Watch: scroll-back from Us vs. Them to the plan box (if tracked).
   Unknown: How $1.26 was worked out.
   Tag:     minor

7. Seen:    Subscribe & Save says "Free Shipping Today". One Time Purchase says "No Free Shipping. No First Order Discount."
   Where:   C1, sprout.example/products/sprout, read 13 Oct 2026, screen size MISSING (unconfirmed). Section: Autoship and Save.
   Means:   "Today" may mean renewals do not ship free, which would change the real renewal cost. The one-time tile hints that the discount is first-order only, but the subscribe tile does not say so.
   Try:     State the shipping terms for renewals in the subscribe tile once the fact is confirmed. Keep: the two-tile layout. Watch: shipping-related cancellations after the first box.
   Unknown: MISSING: whether renewals ship free (not in the brand facts or C1).
   Tag:     minor

WHAT THE CAPTURES COULDN'T SHOW
- Which plan is selected by default (marked inferred in the source).
- What sits on the first phone screen, and where the renewal line and plan box fall relative to the fold.
- Type size and visual weight of the renewal line, the footer note and the guarantee line.
- What the cart and checkout show after tapping Start Now, with and without the SMS sign-up.
- Whether checkout restates the renewal price, renewal shipping and the first-order guarantee limit.
- When the pop-up appears, and whether it blocks the plan box.
- The 61% ad itself and where its link lands.
- The contents of closed accordions, including Low Sugar vs. Sugar-Free.
- Whether the "**" in the footer is tied to any marked price.

TESTS NEEDED IN A REAL BROWSER
- At phone width, open the page from the 61% ad link. Save a full-length screenshot and record the first screen.
- Select Subscribe & Save and tap Start Now without the SMS sign-up. Record the cart total, renewal text and guarantee text.
- Repeat the same steps with the SMS sign-up completed, and compare the totals.
- Read the checkout terms and confirmation for renewal price, renewal shipping and the guarantee limit.
- Record which plan is selected on load, and when the pop-up fires.

TASK CLARITY SCORE
Now: 100 - 25 x 1 - 10 x 4 - 3 x 2 = 29
With the changes made: 100 - 3 x 1 = 97 (entry 7 stays until the renewal shipping fact is known)

NEXT 3 STEPS
1. Fix entry 2 first: remove "DISCOUNT AUTO-APPLIED" or the SMS condition, and put the true today price in the plan box.  2. Move "$49.99 every 4 weeks" and "first order only" into the Subscribe & Save tile, and align the birthday copy and the discount figures with the 61% ad.  3. Run the real-browser cart tests above, with and without SMS, and confirm whether renewals ship free.
```
