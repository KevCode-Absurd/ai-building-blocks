# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest line-by-line review: every risky claim in the draft is caught with the right check, and every rewrite stays inside the facts given, with MISSING used wherever a fact was absent. It is over-cautious (it ignored Sprout's wider files, so items like 1M+ and the 4 gifts are marked MISSING rather than resolved) and uses a table instead of the LINE blocks, but the owner gets a usable, safe script plan.

## Judge list

- Met: Every problem quotes a real line from your script.
  All six quoted lines match the script word for word, e.g. "Sprout is the first smart gummy that fills the gaps."
- Met: Every check code it cites is in the reference, and the reason matches it.
  "Truth 2 | The discount is stated three ways... can't be used until one figure is agreed" matches the reference exactly; all others verified.
- Met: Truth problems come first.
  First seven table rows are Truth 1/2/3; Opening, Promise, Offer and CTA follow in beat order.
- Met: Every fix uses only your facts. Nothing from the reference's examples appears as a fact.
  Fixes reuse "6 grams of prebiotic fiber, plus 21 vitamins and minerals", "67% of surveyed users", "$29.99... then $49.99"; no reference examples.
- Met: Missing beats are named, as well as weak lines.
  "Problem (Problem 1, 2): missing", "Doubt (Doubt 1, 2): missing", "Guarantee: missing" each with a note or MISSING line.

## What went in

```text
Script to judge (30 seconds, voice-over; a draft stitched from
lines on our site and in our ads):
1 "Fix the Hot Girl Tummy."
2 "Sprout is the first smart gummy that fills the gaps."
3 "60+ potent ingredients to revive whole body vitality."
4 "Clinically backed formula for energy, immunity, and daily
   wellness."
5 "Trusted by 1M+."
6 "Get up to 61% OFF + 4 FREE gifts. Shop now!"

Facts: 1 pack = 60+ ingredients, 21 vitamins and minerals, 6 g
prebiotic fiber. Study: 12 weeks, blood vitamin C and folate only.
Allowed: "Supports digestion and gut health." Survey: "67% ...
experienced better, more regular digestion", always "of surveyed
users". Offer: site says 52% or 55%, ads say 61%. $29.99 first
order with SMS sign-up, renews at $49.99 every 4 weeks.
Buyer: the gut-fix seeker; has tried fiber powders and
probiotics. Doubt: "Will this upset my stomach more?"
Customer words: "The prebiotics do their job, but not
aggressively" (review 8).
Voice: playful, cheeky. Bought: reordered (subscription).
```

## What came out

```text
| line | check | what's wrong | fix |
|---|---|---|---|
| 1 "Fix the Hot Girl Tummy." | Truth 3 | "Fix" is a watched claim word. The only allowed gut claim is "Supports digestion and gut health." | Drop "Fix". Carry the claim in the promise line (see line 2, Promise 1 & 2), and use the opening below. |
| 4 "Clinically backed formula for energy, immunity, and daily wellness." | Truth 1, Truth 3 | The study ran 12 weeks and measured only blood vitamin C and folate. It never tested energy, immunity or wellness, and immunity isn't an allowed claim. | Cut the line. Use the survey in its place (see Proof). To cite the study at all: `MISSING: study result and approved wording`. |
| 6 "Get up to 61% OFF + 4 FREE gifts. Shop now!" | Truth 2 | The discount is stated three ways: 52% and 55% on the site, 61% in ads. It can't be used until one figure is agreed. | Drop the percentage and use the real price (see Offer 2). |
| 6 (same) | Truth 1 | "4 FREE gifts" isn't in the facts. | Cut. `MISSING: what the gifts are and whether they're current` |
| 5 "Trusted by 1M+." | Truth 1 | No fact supports "1M+". | Cut. `MISSING: source for 1M+` |
| 3 "60+ potent ingredients to revive whole body vitality." | Truth 3, Truth 1 | "Revive whole body vitality" goes past the allowed claim, and "potent" has no supporting fact. | "Every pack: 6 grams of prebiotic fiber, plus 21 vitamins and minerals." |
| 2 "Sprout is the first smart gummy that fills the gaps." | Truth 1 | "First" and "smart" have no supporting fact. | Cut both words (full rewrite under Promise). |
| 1 "Fix the Hot Girl Tummy." | Opening 1, Opening 2, Fit 4 | It doesn't single out the buyer who has already tried fiber powders and probiotics. "Hot Girl Tummy" doesn't appear in the customer words given, so it may not be the buyer's own word. | "Tried fiber powders and probiotics, and the Hot Girl Tummy's still winning?" Keep the phrase only if it shows up in reviews or tickets: `MISSING: customer evidence for "Hot Girl Tummy"`. |
| 1→2 | Opening 3, Fit 1 | The opening is about the gut. Line 2 jumps to "fills the gaps", which is general nutrition. They don't run on, and the script switches buyer and awareness level. | Make line 2 continue the gut thread (see Promise). |
| 2 "Sprout is the first smart gummy that fills the gaps." | Promise 1, Promise 2 | This is a vague feature in place of a promise, aimed at nutrient gaps rather than the gut-fix seeker. | "This one supports digestion and gut health." It's small and provable by the survey (Promise 3). |
| 2 (same) | Offer 1, How it works 4 | The product is named on line 2 of 6, before it's shown. | Show the pack here and move "Sprout" to the offer line. |
| 3 "60+ potent ingredients to revive whole body vitality." | How it works 1, Fit 2 | It leads with an ingredient count, which is a bigger promise to a market that's tired of gut products. There's no "what it means for you" and no "why it works". | Lead with the 6 g of prebiotic fiber (fix above). Let review 8 supply what it means for them. `MISSING: why it works (mechanism)` |
| 4 "Clinically backed formula for energy, immunity, and daily wellness." | Proof 1 | It uses a study that doesn't prove the claim. Buyer evidence that does fit exists. | "67% of surveyed users experienced better, more regular digestion." `MISSING: full survey wording (the fact has "...") and sample size` |
| 5 "Trusted by 1M+." | Proof 3 | A bare count is weaker than a specific result with a source. | Replace with the survey line above, or with review 8 (see Doubt below). |
| 6 "Get up to 61% OFF + 4 FREE gifts. Shop now!" | Offer 2 | "Up to" percentage framing is used when real numbers exist. | "Sprout's $29.99 for your first order…" |
| 6 (same) | Offer 3 | The SMS sign-up condition and the $49.99 renewal every 4 weeks aren't said aloud. | "…with text sign-up, then $49.99 every 4 weeks." |
| 6 (same) | Call to action 1, Call to action 2 | "Shop now!" doesn't say what happens next or how easy it is. For reordered goods the work is starting, and no true reason for now is given. | "Tap Shop Now to start." `MISSING: true reason for now`. Leave urgency out until there is one (Call to action 3). |

**Beats**
- **Labels:**
  - 1 Opening
  - 2 Promise (feature in its place)
  - 3 How it works
  - 4 Proof
  - 5 Proof
  - 6 Offer + Call to action
- **Problem (Problem 1, 2):** missing. The new opening carries the workaround (fiber powders, probiotics). A separate problem line needs `MISSING: what those workarounds left unsolved`.
- **Doubt (Doubt 1, 2):** missing. The loudest doubt is upset stomach. Add: "Worried it'll upset your stomach? One reviewer: 'The prebiotics do their job, but not aggressively.'" (review 8, word for word).
- **Doubt 3 (reordered):** "can I stop" is unanswered. `MISSING: cancel/skip terms`
- **Guarantee:** missing. At 30 s it can be left out (Guarantee 3). `MISSING: guarantee terms`, if one exists.

**Word count**
- **Current draft:** about 50 spoken words.
- **Budget:** (30 − 2) × 3.0 = 84, with a range of 76–92.
- **Result:** under budget, with room for the Problem and Doubt beats.
- **Fixes above:** the opening, promise, how it works, doubt, proof, offer and call to action total about 77 words, which fits. Adding cancel terms may need one idea cut, for example "21 vitamins and minerals".

**MISSING**
- Customer evidence for "Hot Girl Tummy"
- What the fiber powders and probiotics left unsolved
- Why it works (mechanism)
- 12-week study result and approved wording
- Full survey wording and sample size
- Source for "1M+"
- Agreed discount figure (52%, 55% or 61%), or drop it
- What the 4 free gifts are and whether they're real
- Cancel/skip terms for the subscription
- Guarantee terms
- True reason to act now
- Screen text and end card, needed to check Delivery 4 and the landing-page match for Fit 1
```
