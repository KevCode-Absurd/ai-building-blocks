# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

Ten varied, honest hooks for the price doubter, each tied to a fact from the input or product page, with a long and careful SKIPPED list and a correct set score. Hook 10 scored only 2 and the first-person review hooks (5, 7) rely on the on-screen source being visible, but nothing is invented or unsafe.

## Judge list

- Met: No more than three hooks share a move, and no two start with the same three words.
  Moves: Gain 1,6; Proof 2,5,7; Flip 3,8,10; News 4,9. All ten openings begin with different three-word runs.
- Met: Every number matches a fact you gave it, word for word.
  "$1.78 a day", "40.1% in a 12-week, 120-adult study", "$49.99 every 4 weeks", "3,000+ customers, 80% take it daily" all match input.
- Met: Every gap hook names the line in your ad that answers it.
  No Gap hooks written; SKIPPED lists "Gap: MISSING fit for a product-aware buyer", which matches the moves table.
- Met: No hook tells the viewer they have a health or body condition.
  Closest 'you' line is "Hate subscriptions? This one pauses or cancels any time." No health or body condition named.
- Met: An AI-made presenter never says "I tried it" or "I was sceptical".
  First-person lines in hooks 5 and 7 are review quotes with "brand-site review" on screen; narrator makes no personal claim.
- Met: In score mode, every hook under 3 has a fix you could use today.
  Write mode run; score-mode fix rule does not apply.

## What went in

```text
Mode: write, 10 hooks, 20-second video
Buyer: the price doubter. Knows Sprout from a store shelf, hasn't
bought. Doubts: "They are expensive." "I hate subscriptions because
I feel like they are a trap." Stage: product aware.
Who speaks: an AI-made narrator over product footage
Ad body (illustrative, written for this example): "One pack: 60+
ingredients, 21 vitamins & minerals, 6 g fiber. Tear the top, tip it
into your hand. On subscription, $49.99 every 4 weeks. Pause or
cancel any time."
Proof on file: 2025 study, 120 adults, 12 weeks, vs placebo: blood
vitamin C up 40.1%. 4.75 stars from 109,639 reviews (product page
widget). Survey of 3,000+ customers: 80% take it daily. $1.78/day on
subscription. Brand line: "Tastes like a treat, works like a
supplement." Reviews (brand site): "We quickly decided to resubscribe
because we love [Sprout] so much!" (had cancelled before the gummies
arrived) / "It's wild I WANT to take [Sprout] and don't forget."
Raspberry and blueberry flavour shown as NEW; subscribers
get it for 1 month, then Original. "Subs Now Start at $29.99" (no date).
Never: "fix", weight loss, energy or immunity results.
No unbroken footage of the pack in use. No offer end date.

[attached: sprout/product-page.md]
```

## What came out

```text
FLAG: Picking up the Sprout pouch on the store shelf and thinking "They are expensive."

1. "On subscription, $1.78 a day for 60+ ingredients."
   Gain (the gain in their terms) | backed by: "$1.78/day on subscription"; ad body "60+ ingredients"
   Next:   One pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber.
   Screen: $1.78 a day, on subscription | Seen: Pouch on a counter, the price card slides in, then a hand tears one pack.
   A win says: A per-day price changes how the shelf price feels.

2. "Blood vitamin C up 40.1% in a 12-week, 120-adult study."
   Proof (the number) | backed by: "2025 study, 120 adults, 12 weeks, vs placebo: blood vitamin C up 40.1%"
   Next:   Tested against placebo. One pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber.
   Screen: Vitamin C up 40.1%: 2025 study | Seen: Pouch in frame, then the study figure builds on screen beside it.
   A win says: Evidence that it works matters more to this buyer than price.

3. "Hate subscriptions? This one pauses or cancels any time."
   Flip (the usual belief) | backed by: "Pause Or Cancel Any Time" (plan box); ad body "Pause or cancel any time."
   Next:   On subscription, $49.99 every 4 weeks. Pause or cancel any time.
   Screen: Pause or cancel any time | Seen: A phone screen shows the account page with the pause button, then the pouch.
   A win says: Fear of the subscription trap is the main thing stopping this buyer.

4. "New raspberry and blueberry flavour, now in Sprout gummies."
   News (the launch) | backed by: Raspberry and blueberry flavour shown as NEW
   Next:   Subscribers get it for 1 month, then Original.
   Screen: New: raspberry and blueberry | Seen: The new pouch drops in next to the Original pouch the buyer knows from the shelf.
   A win says: Something new can tip a buyer who knows the product but hasn't bought.

5. "It's wild I WANT to take Sprout and don't forget."
   Proof (the real line) | backed by: review on the brand site, quoted exactly
   Next:   In a survey of 3,000+ customers, 80% take it daily.
   Screen: "I WANT to take Sprout": brand-site review | Seen: The review text appears over a hand tipping gummies from a pack, with the source on screen.
   A win says: Proof that people keep taking it answers "expensive" better than a price does.

6. "Here's what $49.99 every 4 weeks puts in your hand."
   Gain (the preview) | backed by: ad body "On subscription, $49.99 every 4 weeks." and "Tear the top, tip it into your hand."
   Next:   One pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber. Tear the top, tip it into your hand.
   Screen: $49.99 every 4 weeks, in hand | Seen: The price card, then a cut to the pack being torn, then gummies tipped into a palm.
   A win says: Showing the full renewal price up front builds more trust than a first-box teaser.

7. "We quickly decided to resubscribe because we love Sprout so much!"
   Proof (the real line) | backed by: review on the brand site, quoted exactly (the reviewer had cancelled before the gummies arrived)
   Next:   That customer cancelled before the gummies arrived, then came back.
   Screen: "We quickly decided to resubscribe": brand-site review | Seen: The review text appears over the pouch being opened, with the source on screen.
   A win says: A real person who cancelled and came back calms the fear of a trap.

8. "The costly supplement is the one you stop taking."
   Flip (the usual belief) | backed by: survey of 3,000+ customers, "80% take it daily"; review "It's wild I WANT to take [Sprout] and don't forget."
   Next:   In a survey of 3,000+ customers, 80% take it daily.
   Screen: Costly is the one you stop | Seen: The pouch on a counter, then a quick montage of daily packs being torn.
   A win says: Reframing price as value-in-use beats arguing about the sticker price.

9. "Raspberry and blueberry Sprout is new. Subscribers get it one month."
   News (the launch) | backed by: "Subscribers get it for 1 month, then Original."
   Next:   After that month, your subscription goes back to Original.
   Screen: New flavour, 1 month for subscribers | Seen: The new pouch, then a calendar-style card reading "1 month, then Original".
   A win says: Stating the subscription terms plainly turns the launch into a reason to trust.

10. "Supplements feel like a chore. Sprout tastes like a treat."
   Flip (the usual belief) | backed by: brand line "Tastes like a treat, works like a supplement."; review "It's wild I WANT to take [Sprout]..."
   Next:   Tear the top, tip it into your hand. One pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber.
   Screen: Tastes like a treat | Seen: Gummies tipped into a palm and eaten, then the pouch.
   A win says: Taste is a stronger lever than price for this buyer.

SKIPPED
Mirror: MISSING fit for a product-aware buyer, and MISSING buyer notes with real moments or objects
Gap: MISSING fit for a product-aware buyer
Gain (the deal, "Subs Now Start at $29.99"): MISSING a most-aware buyer; the conditions would also need to be kept: SMS sign-up, new customers only, first box only, renews at $49.99
News (the change, $29.99 price cut): MISSING the date the price changed
News (the finding, 2025 study): MISSING proof it is still new
Proof (the live test): MISSING unbroken footage of the pack in use
Proof (4.75 stars from 109,639 reviews): not used, because the page shows four different ratings (4.8/100,000; 4.74/118,002; 4.0/2,411)
Timing: MISSING an offer end date
Founder, customer or expert forms: MISSING a real speaker (AI-made narrator only)
News hooks 4 and 9: MISSING confirm raspberry and blueberry flavour and the [cartoon-movie tie-in flavour] are the same
21 vitamins & minerals: MISSING confirm the count (the ingredients panel says "over 20")
$1.07/day and $1.26/serving on the page: not used, because they conflict with $1.78/day; MISSING which is current
Ad body: MISSING final ad body (the supplied one is illustrative)

SET SCORE
31/40 = 78 out of 100 (3+3+3+3+3+4+3+3+4+2 = 31; no gate failures)
Hook scores (Flags, Gain, New, Clear):
- 1: 1, 1, 0, 1
- 2: 0, 1, 1, 1
- 3: 1, 1, 0, 1
- 4: 0, 1, 1, 1
- 5: 0, 1, 1, 1
- 6: 1, 1, 1, 1
- 7: 1, 0, 1, 1
- 8: 1, 0, 1, 1
- 9: 1, 1, 1, 1
- 10: 0, 1, 0, 1
```
