# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

Ten usable hooks, every number traceable to the files, with the risky offers (the $29.99, the discount percentages, the star rating, the guarantee) correctly set aside and explained. The only soft spots are the missing top-level FLAG line and hook 4's next line, which assumes the viewer already has an account.

## Judge list

- Met: No more than three hooks share a move, and no two start with the same three words
  "Spread: Proof 3, Flip 3, Gain 3, News 1." First three words differ across all ten hooks; no two adjacent share a move.
- Met: Every number matches a fact you gave it, word for word
  "40.1%", "120 adults, 12 weeks", "$1.78/day", "$49.99 every 4 weeks", "3,000+ customers, 80%", "60+ ingredients, 21 vitamins & minerals, 6 g fiber" all on file.
- Met: Every gap hook names the line in your ad that answers it
  No Gap hooks written; "Gap (all forms): it doesn't fit a product-aware buyer, per the awareness table."
- Met: No hook tells the viewer they have a health or body condition
  Hooks name price, subscription fear, flavour, pack contents; e.g. "Hate subscriptions?" is not a condition.
- Met: An AI-made presenter never says 'I tried it' or 'I was sceptical'
  Review hooks: "The narrator introduces the quote and does not voice it." Heard: "Here's a review from Sprout's site."
- Met: In score mode, every hook under 3 has a fix you could use today
  Write mode run; score checks not applicable.

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
## Hooks: Sprout, price doubter (product aware), AI narrator, 20-second video

**1. "Blood vitamin C up 40.1% in Sprout's 12-week study."**
- **Move / form:** Proof, the number
- **Names:** a measured result, a new fact for someone who only knows the shelf pack
- **Speaker:** AI narrator, as observer
- **Backed by:** 2025 study, 120 adults, 12 weeks, vs placebo, "blood vitamin C up 40.1%"
- **Next line:** "2025 study: 120 adults, 12 weeks, against a placebo." Then the body: "One pack: 60+ ingredients…"
- **On screen:** "Blood vitamin C up 40.1%". Add a source card: "2025 study, 120 adults, vs placebo".
- **Seen:** hand tips the gummies from a Sprout pack in the first second, then a cut to a clean chart card.
- **Read:** the on-screen line plus the source card.
- **Heard:** the hook line, read flat.
- **A win tells you:** a measured result moves the price doubter more than price talk does.
- Keep it to vitamin C. It must not imply immunity.

**2. "Pricey on the shelf? On subscription it's $1.78/day."**
- **Move / form:** Flip, the usual belief
- **Names:** their doubt, "They are expensive", and the shelf where they saw it
- **Speaker:** AI narrator, "you" voice
- **Backed by:** $1.78/day on subscription (on file)
- **Next line:** "That's $49.99 every 4 weeks, for 28 daily packs."
- **On screen:** "Pricey? $1.78/day on subscription"
- **Seen:** a pouch picked off a shelf, then a cut to one pack torn open.
- **Read:** the on-screen line.
- **Heard:** the hook line.
- **A win tells you:** a per-day price breaks the "expensive" belief.

**3. "Pause or cancel your Sprout subscription any time."**
- **Move / form:** Gain, the gain in their terms
- **Names:** their fear, "subscriptions are a trap"
- **Speaker:** AI narrator, "you" voice
- **Backed by:** "Pause or cancel any time" (ad body and plan box)
- **Next line:** "On subscription, $49.99 every 4 weeks. Here's what's in each pack."
- **On screen:** "Pause or cancel any time"
- **Seen:** the Sprout pouch on a counter in the first second, with a thumb tapping "Pause" on a phone.
- **Read:** the on-screen line.
- **Heard:** the hook line.
- **A win tells you:** the subscription fear is a bigger block than the price.

**4. "New: raspberry and blueberry Sprout. One month, then back to Original."**
- **Move / form:** News, the launch
- **Names:** a new flavour, with its real limit
- **Speaker:** AI narrator, as observer
- **Backed by:** shown as NEW on 13 Oct, and subscribers get it for 1 month, then Original
- **Next line:** "Add it in your account. Your next box goes back to Original."
- **On screen:** "NEW: raspberry & blueberry. 1 month."
- **Seen:** the new pack is torn and the gummies tip into a palm, in the first second.
- **Read:** the on-screen line.
- **Heard:** the hook line.
- **A win tells you:** novelty gets a product-aware holdout to look again.
- Run it only while the flavour is on sale. Check the flavour name: the product page calls it a "cartoon-movie tie-in".

**5. "We quickly decided to resubscribe because we love [Sprout] so much!"**
- **Move / form:** Proof, the real line
- **Names:** cancelling and coming back, which goes straight at the trap fear
- **Speaker:** AI narrator, as observer. The narrator introduces the quote and does not voice it as their own.
- **Backed by:** a review on the brand site, quoted exactly. Put the real brand name back in for [Sprout].
- **Next line:** "This reviewer had cancelled before the gummies arrived."
- **On screen:** "“We quickly decided to resubscribe…” (review, Sprout site)"
- **Seen:** a pouch landing on a doormat, in the first second.
- **Read:** the full quote, with its source.
- **Heard:** "Here's a review from Sprout's site."
- **A win tells you:** proof that people can leave, and choose to come back, eases the trap fear.

**6. "Hate subscriptions? Here's the real renewal price: $49.99 every 4 weeks."**
- **Move / form:** Flip, the usual belief. The belief is "subscriptions hide the real price", and the turn is stating it.
- **Names:** their fear, in their own word "hate"
- **Speaker:** AI narrator, "you" voice
- **Backed by:** "$49.99 every 4 weeks" (ad body) and "Renews at $49.99 each 4 weeks" (product page)
- **Next line:** "That's $1.78/day. Pause or cancel any time."
- **On screen:** "Real renewal: $49.99 every 4 weeks"
- **Seen:** the Sprout pouch with a price tag flipping over to "$49.99", in the first second.
- **Read:** the on-screen line.
- **Heard:** the hook line.
- **A win tells you:** saying the renewal price up front earns trust that a discount can't.

**7. "Here's one Sprout pack, from torn top to your hand."**
- **Move / form:** Gain, the preview
- **Names:** what they get, shown
- **Speaker:** AI narrator, as observer
- **Backed by:** the body line "Tear the top, tip it into your hand." The ad must show this.
- **Next line:** "One pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber."
- **On screen:** "One pack, torn top to hand"
- **Seen:** the tear and the tip into a palm, in the first second. Cuts are allowed. **MISSING: confirm footage of the tear and tip exists.** If it doesn't, drop this hook.
- **Read:** the on-screen line.
- **Heard:** the hook line.
- **A win tells you:** seeing the product beats being told about it.

**8. "The pricey supplement is the one you stop taking."**
- **Move / form:** Flip, the usual belief. It turns "expensive" into "unused".
- **Names:** their doubt, "They are expensive"
- **Speaker:** AI narrator, "you" voice
- **Backed by:** a survey of 3,000+ customers, 80% take it daily
- **Next line:** "In a survey of 3,000+ customers, 80% take it daily."
- **On screen:** "Pricey: the supplement you stop taking"
- **Seen:** a Sprout pack torn open in the first second, then pouches emptying day by day.
- **Read:** the on-screen line, then "80% take it daily (survey, 3,000+ customers)".
- **Heard:** the hook line.
- **A win tells you:** value framed as "you'll use it" beats value framed as cost.
- The survey ran after 3 months, so it only counts people who stayed. Keep the label.

**9. "It's wild I WANT to take [Sprout] and don't forget."**
- **Move / form:** Proof, the real line
- **Names:** a reason to keep paying, because people want to take it
- **Speaker:** AI narrator, as observer. The narrator introduces the quote and does not voice it.
- **Backed by:** a review on the brand site, quoted exactly
- **Next line:** "Tastes like a treat, works like a supplement." (brand line)
- **On screen:** "“I WANT to take [Sprout]” (review, Sprout site)"
- **Seen:** gummies tipped into a hand at a kitchen counter, in the first second.
- **Read:** the full quote, with its source.
- **Heard:** "Here's a review from Sprout's site."
- **A win tells you:** taste and habit carry the price argument for this buyer.

**10. "60+ ingredients in one pack. No water, no shaker."**
- **Move / form:** Gain, the gain in their terms
- **Names:** what the money buys, in one pack
- **Speaker:** AI narrator, as observer
- **Backed by:** "One pack: 60+ ingredients" (ad body). It is a gummy, so no water is needed.
- **Next line:** "21 vitamins & minerals, 6 g fiber. Tear the top, tip it into your hand."
- **On screen:** "60+ ingredients. One pack. No water."
- **Seen:** a single pack in close-up in the first second, torn open.
- **Read:** the on-screen line.
- **Heard:** the hook line.
- **A win tells you:** "how much you get" answers "expensive" better than a price does.
- The vitamin count is not the same everywhere: "21" in the ad body, but "over 20" in the product page's ingredients panel. Line them up before running this.

**Spread:** Proof 3, Flip 3, Gain 3, News 1. No two hooks in a row share a move.

## SKIPPED
- **Mirror (all forms):** it doesn't fit a product-aware buyer, per the awareness table.
- **Gap (all forms):** it doesn't fit a product-aware buyer, per the awareness table.
- **Proof, the live test:** there is no unbroken footage of the pack in use.
- **Gain, the deal ("Subs Now Start at $29.99"):** this form is for most-aware buyers only. The offer's conditions also clash:
  - The $29.99 needs the text-message sign-up, and only the footer says so.
  - It applies to the first box only, then renews at $49.99.
  - The offer has no date.
- **News, the change (the price cut):** the price cut has no date on file.
- **News, the finding:** the 2025 study isn't new as of Oct 2026, so it runs as Proof instead (hook 1).
- **Timing add-on:** there is no offer end date on file.
- **Speaker forms for a real customer, founder or expert speaking from experience:** the only speaker is an AI narrator.
- **Proof, star rating (4.75 stars from 109,639 reviews):** left out on purpose. The same visit shows four different ratings: 4.8 from 100,000, 4.75 from 109,639, 4.74 from 118,002, and 4.0 from 2,411. A price doubter may check.
- **Not used:**
  - The "$1.26 cost per serving" on the page. It conflicts with $1.78/day on file.
  - The discount percentages (52%, 55%, 61%). They conflict with each other.
  - The guarantee. It covers the first order only, and the plan box doesn't say so.
```
