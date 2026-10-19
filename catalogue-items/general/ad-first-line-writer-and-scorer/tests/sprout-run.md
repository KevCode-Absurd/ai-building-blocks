# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 1.

This is a careful, usable set: ten hooks across four allowed moves, every number traceable, renewal price put before the first-box price, the star rating and guarantee wisely left out, and good MISSING flags. It misses only on one wrong aside, claiming the tie-in 'Brand New' flavour is not raspberry and blueberry when the brand file says it is, plus it omits the top FLAG line.

## Fix

In 'If something is missing', add: when two facts might describe the same thing (e.g. a named tie-in flavour and a flavour description), write MISSING rather than stating they differ; and in 'What you hand back' make the FLAG line a required first line.

## Judge list

- Met: No more than three hooks share a move, and no two start with the same three words.
  Proof 1,5,9; Gain 2,6,10; Flip 3,7; News 4,8. Openers all differ ("Sprout's 12-week", "One Sprout pack", "Think subscriptions are"...).
- Met: Every number matches a fact you gave it, word for word.
  "blood vitamin C up 40.1%", "120 adults", "80% ... 3,000+", "$1.78 on subscription", "$49.99 every 4 weeks", "1 month" all match input/files.
- Met: Every gap hook names the line in your ad that answers it.
  No Gap hooks written; "Gap (all forms): this move is not in the product-aware row." Vacuously met.
- Met: No hook tells the viewer they have a health or body condition.
  "Think subscriptions are a trap?" and "Expensive?" name doubts, not conditions; no body or health line anywhere.
- Met: An AI-made presenter never says "I tried it" or "I was sceptical".
  "None says 'I'." Hook 9 is framed "One customer wrote:" with on-screen source; narrator never claims the result.
- Met: In score mode, every hook under 3 has a fix you could use today.
  Write mode only; not applicable. Set score still given: "31 / (4 × 10) × 100 = 77.5, rounded to 78".

## Invented

- claim: The page file shows a cartoon-movie tie-in as the "Brand New" flavour, not raspberry and blueberry. (brand.md says the cartoon tie-in flavour IS raspberry and blueberry; the output asserts they differ instead of just saying MISSING.)

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
## Hooks: price doubter, product aware, 20-second video, AI narrator

All hooks are voiced by the AI-made narrator in "you" form or as an observer. None says "I". Each hook takes about the first 2 seconds. The ad body follows.

---

**1. Proof: the number**
- **Hook:** "Sprout's 12-week study: blood vitamin C up 40.1%."
- **Names:** a result they can check, on a brand they already know from the shelf.
- **Speaker:** narrator, as an observer.
- **Backed by:** 2025 study, 120 adults, 12 weeks, vs placebo: blood vitamin C up 40.1%.
- **Next line:** "2025 study, 120 adults, vs placebo." Then the body.
- **On screen:** "Blood vitamin C up 40.1%" (5 words)
- **Seen:** the pouch rotates into frame, then the "40.1%" figure lands beside it. **Read:** the on-screen line plus "12-week study vs placebo" in small type. **Heard:** the hook line.
- **A win would tell you:** a hard number moves people who hesitated on price more than taste or ease does.
- **Note:** the study measured vitamin C in the blood. The ad must not turn that into immunity or energy.

**2. Gain: in their terms**
- **Hook:** "One Sprout pack: 60+ ingredients, 6 g fiber, no water."
- **Names:** what the money buys, in one pack.
- **Speaker:** narrator, "you" form.
- **Backed by:** the ad body ("One pack: 60+ ingredients … 6 g fiber"). Tear-and-eat gummies need no water.
- **Next line:** "Tear the top, tip it into your hand." For this version, drop the body's opening line, because it repeats the hook.
- **On screen:** "60+ ingredients. 6 g fiber. No water." (6 words)
- **Seen:** a hand tears a pack and tips the gummies into the palm. **Read:** the on-screen line. **Heard:** the hook line.
- **A win would tell you:** this buyer judges value by what is in the pack.
- **Note:** the product page says "21 vitamins" in one place and "over 20" in another. Keep the vitamin count out of this hook until the page agrees with itself.

**3. Flip: the usual belief**
- **Hook:** "Think subscriptions are a trap? Pause or cancel Sprout any time."
- **Names:** their own doubt ("I hate subscriptions because I feel like they are a trap").
- **Speaker:** narrator, "you" form.
- **Backed by:** "Pause Or Cancel Any Time" (plan box) and "Pause or cancel any time" (ad body).
- **Next line:** "On subscription, $49.99 every 4 weeks. Pause or cancel any time." This moves the body's last line up front, so the full price comes before anything else.
- **On screen:** "Pause or cancel any time." (5 words)
- **Seen:** the pouch on a counter, then a phone screen showing the pause option. **Read:** the on-screen line. **Heard:** the hook line.
- **A win would tell you:** fear of the subscription is the bigger blocker, more than price.
- **Note:** keep "30-Day Money-Back Guarantee" out of this ad. It covers the first order only.

**4. News: the launch**
- **Hook:** "New Sprout flavour: raspberry and blueberry."
- **Names:** something new about a product they already know.
- **Speaker:** narrator, as an observer.
- **Backed by:** raspberry and blueberry flavour shown as NEW.
- **Next line:** "Subscribers get it for 1 month, then Original."
- **On screen:** "New: raspberry and blueberry" (4 words)
- **Seen:** the new pouch slides in front of the Original pouch. **Read:** the on-screen line. **Heard:** the hook line.
- **A win would tell you:** novelty can reopen a buyer who walked past on the shelf.
- **Note:** run this only while the flavour is on sale. The page file shows a cartoon-movie tie-in as the "Brand New" flavour, not raspberry and blueberry. MISSING: confirmation that raspberry and blueberry is on sale on the ad's run dates.

**5. Proof: the number, label kept**
- **Hook:** "80% of surveyed customers take Sprout daily."
- **Names:** proof that buyers keep using what they pay for.
- **Speaker:** narrator, as an observer.
- **Backed by:** survey of 3,000+ customers: 80% take it daily.
- **Next line:** "From a survey of 3,000+ customers." Then the body.
- **On screen:** "80% take it daily" (4 words), with "survey of 3,000+ customers" in small type.
- **Seen:** a run of quick morning cuts, each with a pack in hand. **Read:** the on-screen line and its label. **Heard:** the hook line.
- **A win would tell you:** "Will I actually use it?" sits under "It's expensive."

**6. Gain: the preview**
- **Hook:** "Here's one day of Sprout, from pack to palm."
- **Names:** exactly what one day's serving looks like.
- **Speaker:** narrator, "you" form.
- **Backed by:** directions on the page ("Grab a single pack daily") and the ad body ("Tear the top, tip it into your hand"). The cut footage shows it. The ad makes no single-take claim.
- **Next line:** "Tear the top, tip it into your hand."
- **On screen:** "One day of Sprout" (4 words)
- **Seen:** the pack is torn and the gummies drop into the palm, shot in cuts. **Read:** the on-screen line. **Heard:** the hook line.
- **A win would tell you:** showing the product beats stating facts for someone who has only seen the box.

**7. Flip: the usual belief (price)**
- **Hook:** "Expensive? Count it per day: $1.78 on subscription."
- **Names:** their own doubt ("They are expensive").
- **Speaker:** narrator, "you" form.
- **Backed by:** $1.78/day on subscription.
- **Next line:** "On subscription, $49.99 every 4 weeks. Pause or cancel any time."
- **On screen:** "$1.78/day on subscription" (4 words)
- **Seen:** the price on the shelf box is replaced by "$1.78/day". **Read:** the on-screen line. **Heard:** the hook line.
- **A win would tell you:** the cost per day answers the price doubt better than proof does.
- **Note:** do not use $1.07/day or $29.99 here. Both apply to the first box only.

**8. News: the launch, terms said up front**
- **Hook:** "New raspberry and blueberry: 1 month on subscription, then Original flavour."
- **Names:** the new flavour and the real subscription terms, before they ask.
- **Speaker:** narrator, as an observer.
- **Backed by:** NEW raspberry and blueberry flavour. Subscribers get it for 1 month, then Original.
- **Next line:** "One pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber." This is the body.
- **On screen:** "New flavour, 1 month, then Original" (6 words)
- **Seen:** the new pouch, then the Original pouch. **Read:** the on-screen line. **Heard:** the hook line.
- **A win would tell you:** stating the terms openly earns trust from the buyer who fears traps (compare with hook 4).
- **Note:** same availability check as hook 4.

**9. Proof: the real line**
- **Hook:** "We quickly decided to resubscribe because we love [Sprout] so much!"
- **Names:** a real customer who cancelled and came back, which speaks to the trap fear.
- **Speaker:** narrator, as an observer. The narrator introduces it as a quote: "One customer wrote…". The quote appears on screen with its source. The narrator never claims it.
- **Backed by:** review on the brand site (the customer had cancelled before the gummies arrived).
- **Next line:** "They'd cancelled before their gummies arrived, then resubscribed."
- **On screen:** "“We quickly decided to resubscribe”" (5 words), with "Review, Sprout site" underneath.
- **Seen:** the review card overlaid on the pouch. **Read:** the quote and its source. **Heard:** "One customer wrote:" followed by the hook line.
- **A win would tell you:** a real customer's voice settles the subscription doubt better than the brand's own promise.

**10. Gain: in their terms (brand line)**
- **Hook:** "Sprout tastes like a treat, works like a supplement."
- **Names:** the brand they know, plus a reason to pay for it.
- **Speaker:** narrator, as an observer.
- **Backed by:** brand line "Tastes like a treat, works like a supplement."
- **Next line:** "One pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber." This is the body.
- **On screen:** "Tastes like a treat" (4 words)
- **Seen:** gummies tipped into the hand, then a bite. **Read:** the on-screen line. **Heard:** the hook line.
- **A win would tell you:** taste is the value case for this buyer.

---

## SKIPPED
- **Mirror (all forms):** this move is not in the product-aware row. There are also no buyer moments or objects on file.
- **Gap (all forms):** this move is not in the product-aware row.
- **Gain, the deal:** this form is for most-aware buyers only. The $29.99 price also needs the SMS sign-up, covers the first box only, and renews at $49.99.
- **News, the change ("Subs Now Start at $29.99"):** no date on file for the price change.
- **News, the finding:** the study is from 2025, so it cannot be called new in a 2026 run. It is used as Proof instead (hook 1).
- **Proof, live test:** no unbroken footage of the pack in use.
- **Proof, 4.75 stars from 109,639 reviews:** this is on file but was left out on purpose. The page shows four different ratings (4.8 from 100,000; 4.75 from 109,639; 4.74 from 118,002; 4.0 from 2,411 on a public site). A viewer who checks will find a different number.
- **Flip, off the hook:** no buyer truth on file that would take the blame off the buyer.
- **Timing add-on:** no offer end date.
- **Founder, customer and expert speaker forms:** the only speaker is the AI narrator.
- MISSING: whether raspberry and blueberry is on sale on the run dates (affects hooks 4 and 8).

## Set score

| # | Move | Flags | Gain | New | Clear | Gate | Score |
|---|---|---|---|---|---|---|---|
| 1 | Proof | 1 | 0 | 1 | 1 | pass | 3 |
| 2 | Gain | 1 | 1 | 0 | 1 | pass | 3 |
| 3 | Flip | 1 | 1 | 0 | 1 | pass | 3 |
| 4 | News | 1 | 0 | 1 | 1 | pass | 3 |
| 5 | Proof | 1 | 0 | 1 | 1 | pass | 3 |
| 6 | Gain | 1 | 1 | 0 | 1 | pass | 3 |
| 7 | Flip | 1 | 1 | 1 | 1 | pass | 4 |
| 8 | News | 1 | 0 | 1 | 1 | pass | 3 |
| 9 | Proof | 1 | 0 | 1 | 1 | pass | 3 |
| 10 | Gain | 1 | 1 | 0 | 1 | pass | 3 |

Sum: 3+3+3+3+3+3+4+3+3+3 = 31. Set score = 31 / (4 × 10) × 100 = 77.5, rounded to **78**.

This measures the hooks against the four checks, not how they will perform.
```
