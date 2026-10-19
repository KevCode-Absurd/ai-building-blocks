# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 3 of 6 met. Invented facts: 3.

The script is structured well, uses MISSING placeholders honestly and avoids banned words. But it admits a rival could paste in the opening and promise, trims a quote, and has loose word-count and 'tell the viewer what they have' issues.

## Fix

In step 11 and Rules, require quotes be copied verbatim with no trimming and the spoken count be computed with placeholders at maximum length; in step 5, rewrite any line a rival could paste before handing back instead of only scoring it.

## Judge list

- Met: The belief shift is there, and every beat serves it.
  Belief shift stated; beats cover 6 g, 'not aggressively', Low Sugar, survey, offer. Shift wording is long but present.
- Not met: No line would work for the product next to yours on the shelf.
  Run itself admits: 'could be pasted in by a rival' for the opening and promise line.
- Not met: Every quote is word for word with a source, and every fact traces to your facts.
  Quote 8 trimmed to 'The prebiotics do their job, but not aggressively.' with period; 'Worried it'll upset your stomach more?' framed as customer-sourced; survey wording altered.
- Met: The problem is one person's workaround, not solved yet, and the product is named late, at the offer.
  Problem lines leave it unsolved; 'It's Sprout: first order $29.99...' is first naming. Pack shot with logo turned away.
- Met: Every picture note can be made with your real product and an adult.
  Adult presenter, real packs, unbranded tubs; no children or celebrities.
- Not met: The spoken word count fits the budget for the length and pace.
  Claims '125' spoken vs budget 129, but includes placeholder lines and the folded guarantee; count unverified, likely over once filled.

## Invented

- other: AI presenter (adult woman, about 40) (Presenter details are a creative choice, fine, but the 'Before' scene (mornings planned around the bathroom) is not from quotes; it is flagged assumed.)
- quote: Belief shift 'buyers say it works "but not aggressively"' (Quote is truncated and the wording presented slightly differently than source.)
- quote: Worried it'll upset your stomach more? (Presented in evidence as a doubt from the brief, not a customer quote; paraphrase of brief wording.)

## Safety

- Spoken line 'Mornings planned around the bathroom' and 'still don't feel normal' tell viewers what they have, against the never-tell rule.
- Offer says '$29.99 first order with text sign-up' but guarantee 'first order only' is fine; however the 67% survey line with 'Sensitive stomach? Start with Low Sugar' implies gentleness for gut-sensitive buyers without a flagged allowed claim.
- The belief shift line that '$29.99 ... money back is a low-risk way' leans on a guarantee claim; opening 3 quote 7 presents an IBS-adjacent single result with only a legal-review note.

## What went in

```text
Buyer: the gut-fix seeker, 25 to 55, mostly women. Has tried fiber
powders and probiotics. Doubt: "Will this upset my stomach more?"
Reason to buy: to feel normal. Offer: first order price.
Quotes:
7 "My bowel movements are normal for the 1st time in 15 years!"
  (brand site)
8 "The prebiotics do their job, but not aggressively, and I feel
  like my overall digestion has improved. ..." (brand site)
10 "Feel lighter, less bloated and overall good." (retailer)
Facts: 1 daily pack = 6 g prebiotic fiber, a small handful of
gummies. Low Sugar or Sugar-Free; point gut-sensitive buyers to
Low Sugar. Survey of 3,000+ customers after 3 months: "67% ...
experienced better, more regular digestion" (always "of surveyed
users"). $29.99 first order with the text sign-up, renews at
$49.99 every 4 weeks. 30-day money back, first order only.
Allowed claims: "Supports digestion and gut health."
Never say: fix, treat, cure, IBS, bloating relief as a promise.
Knows: the problem and the fixes, not Sprout. Length: 45 seconds.
Speaker: AI presenter.
```

## What came out

```text
**Belief shift:** Now they believe fiber products are scoops and capsules that might upset their stomach more. After this ad they believe a small daily handful of Sprout gummies gives them 6 g of prebiotic fiber, that buyers say it works "but not aggressively," and that a $29.99 first order with money back is a low-risk way to try it.

**Assumed:**
- **Before:** there is no customer quote. The tub, bottle and bathroom-morning scene is a guess.
- **Trigger:** this point is empty, and no line uses it.
- **Tries:** this comes only from the buyer profile ("fiber powders and probiotics"). No quote supports it.
- **Last doubt:** this comes from the brief ("Will this upset my stomach more?"). No sourced customer quote supports it.
- **After:** quotes 7, 8 and 10 cover this point. Quote 10 is held back because "less bloated" would read as a bloating promise.

| Concept | Awareness | Claim fatigue | Reordered or kept | Length | Pace | Budget | Spoken words (exact) |
|---|---|---|---|---|---|---|---|
| Gut-fix seeker; reason to buy is "to feel normal"; first-order price | Solution aware (knows the problem and the fixes, not Sprout) | 4 of 5, so lead with how it works, then who it's for (Low Sugar for sensitive stomachs) | Reordered (subscription, used up) | 45 s | 3.0 w/s | (45 − 2) × 3.0 = 129 | 125, not counting [PAUSE/CANCEL STEPS]. Filling that placeholder with up to 4 words keeps it at or under 129. |

| Person/tense | Selling beat | Suggested format |
|---|---|---|
| Second person, present. The AI presenter never says "I" and never claims a personal result. | Doubt ("will it upset my stomach more?"), backed by proof | AI presenter to camera, as briefed. The belief rests on reassurance in buyers' words, which suits a person to camera. Use the real product photos as reference for the hand-held inserts. |

| Beat | Spoken line | On-screen text | Picture note | Evidence (quote or fact, with source) |
|---|---|---|---|---|
| 1 Opening | If you've tried fiber powders and probiotics and still don't feel normal, | Tried powders AND probiotics? | AI presenter (adult woman, about 40) at a kitchen counter, mid-motion, sliding an unbranded fiber tub and capsule bottle aside. Cut on the push. | Tries: buyer profile ("Has tried fiber powders and probiotics"). "Feel normal" is the reason to buy (brief). |
| 2 Problem | First a tub on the shelf. | (none) | Close-up: a hand pushes an unbranded tub to the back of a shelf. | Assumed Before scene |
| 2 Problem | Then a bottle in the drawer. | (none) | A drawer slides shut on an unbranded capsule bottle. | Assumed Before scene |
| 2 Problem | Now mornings planned around the bathroom. | Mornings planned around the bathroom | Presenter at the front door, keys in hand, glances back down the hall. Hold the beat; leave it unsolved. | Assumed Before scene |
| 3 Promise | Feeling normal starts with a daily habit that supports digestion and gut health. | "My bowel movements are normal for the 1st time in 15 years!" (customer review, brand site) | Presenter to camera, unhurried morning, coffee in hand. The review card slides in as an overlay. | Allowed claim: "Supports digestion and gut health." After: quote 7, brand site. |
| 4 How it works | Each daily pack is 6 grams of prebiotic fiber in a small handful of gummies. | 6 g prebiotic fiber per daily pack | Real Sprout pack with the logo turned away, torn open, gummies tipped into a palm. | Fact: 1 daily pack = 6 g prebiotic fiber, a small handful of gummies |
| 5 Doubt | Worried it'll upset your stomach more? | Will this upset my stomach more? | Presenter pauses with the gummies in her palm and looks down at them. | Last doubt (brief); type is "works / fit" |
| 5 Doubt | One review: "The prebiotics do their job, but not aggressively." | "The prebiotics do their job, but not aggressively..." (customer review, brand site) | Presenter chews one gummy. The quote card appears as an overlay. | Quote 8, brand site |
| 5 Doubt | Sensitive stomach? Start with Low Sugar. | Gut-sensitive? Start with Low Sugar | Two real packs (Low Sugar, Sugar-Free) side by side. A hand picks Low Sugar. | Fact: point gut-sensitive buyers to Low Sugar |
| 6 Proof | Of 3,000-plus customers surveyed after three months, 67% of surveyed users experienced better, more regular digestion. | 67% of surveyed users: better, more regular digestion* / *Survey of 3,000+ customers after 3 months | A simple bar showing the real 67% figure beside the presenter, with nothing added beyond the survey's own number. | Fact: survey of 3,000+ customers after 3 months, "67% ... experienced better, more regular digestion" (always "of surveyed users"). This is buyer-reported proof, paired with the 6 g on the pack label, which viewers can check, in row 4. |
| 7 Offer | It's Sprout: first order $29.99 with text sign-up and 30-day money back, then $49.99 every four weeks. | Sprout: $29.99 first order (text sign-up), then $49.99 every 4 weeks | Presenter turns the Sprout box to camera, logo forward. This is the first time the product is named. | Fact: $29.99 first order with text sign-up, renews at $49.99 every 4 weeks |
| 8 Guarantee | (Folded into the offer line: "30-day money back.") | 30-day money back, first order only | Same shot as the offer | Fact: 30-day money back, first order only. MISSING: how the buyer claims it |
| 7 Offer | Pause or cancel by [PAUSE/CANCEL STEPS]. | Pause or cancel: [STEPS] | Presenter's thumb on a phone, with the screen angled so it can't be read. The overlay carries the text. | MISSING: real pause/cancel steps |
| 9 Call to action | Tap below, sign up by text, and start. | Tap below, sign up by text | Presenter tears open the first pack and smiles. Keep the product clear of the bottom buttons. | Offer mechanics (text sign-up) |
| End card (2 s, silent) | (none) | Sprout. $29.99 first order with text sign-up, then $49.99 every 4 weeks. 30-day money back, first order only. | Real product on a clean background. Readable with sound off, clear of the top bar and bottom buttons. Captions on throughout. | Offer and guarantee facts |

**Openings:**

| # | Source | Spoken | Overlay | First frame | Who / Why stay / Flow / Agree |
|---|---|---|---|---|---|
| 1 | Tries (buyer profile) | If you've tried fiber powders and probiotics and still don't feel normal, | Tried powders AND probiotics? | Presenter mid-push, sliding an unbranded tub and bottle aside | Pass / Pass / Pass / Pass |
| 2 | Last doubt (brief) | Worried the next fiber you try will upset your stomach more? | Will this upset my stomach more? | Presenter mid-pour of unbranded powder, stopping short | Pass / Pass / Pass / Pass. If used, cut doubt line 5a ("Worried it'll upset your stomach more?") so the doubt isn't repeated. |
| 3 | After (quote 7, brand site) | "My bowel movements are normal for the 1st time in 15 years!" one customer wrote. | "normal for the 1st time in 15 years" | Presenter mid-turn to camera, coffee in hand | Pass / Pass / Pass / Pass. This runs 3 words over opening 1. If used, change the promise overlay to the allowed claim so the quote isn't repeated. |
| 4 | Fact (6 g) | Six grams of prebiotic fiber, in a small handful of gummies. | 6 g prebiotic fiber, as gummies | Gummies tumbling from a torn pack into a palm | Pass / Pass / **Fail**: it doesn't run on into "First a tub on the shelf"; it needs its own join. / Pass |
| 5 | Offer | If you've tried powders and probiotics, a first order here is $29.99. | $29.99 first order, text sign-up | A hand sliding a pack across the counter | Pass / Pass / Pass / Pass |

**Test plan:**
- **What changes:** run openings 1, 2, 3 and 5 on the identical body (rows 2 to 9). Change nothing else. Hold opening 4 until it has its own join.
- **Primary read:** 3-second hold.
- **Secondary read:** click-through rate.
- **What a win means:**
  - If 2 (doubt) wins, the worry is the real lead. Next, build a body that opens the doubt earlier and adds a second buyer quote on gentleness, if one exists in the research.
  - If 1 or 5 (tries or offer) wins, the buyer is shopping on switching and price. Next, test per-day pricing once the pack count is known.
  - If 3 (After quote) wins, the result story pulls. Next, test a story-led body built on After quotes (legal review first).
- **What to make next:**
  - New openings on the winning body when it fades.
  - Then a second reason to buy, such as the gummy format against scooping, with no claims about rival products.

**Placeholders and risky claims:**
- **[PAUSE/CANCEL STEPS]:** MISSING. This is required for a subscription. Keep it to 4 words or fewer, or the script goes over budget.
- **How to claim the 30-day money back:** MISSING. Add it to the end card or landing page.
- **Where the tap lands:** MISSING. What happens after the click beyond the text sign-up is unknown, and the landing page must match this awareness level.
- **Packs per 4-week order:** MISSING, so no per-day price frame is used.
- **Reason for now:** none on file, and none used.
- **Quote 7 (individual result):**
  - It is a strong single result. Always label it as one customer's review and never imply it is typical.
  - Legal should approve it, given the "fix/treat" ban.
- **Quote 10:** not used, because "less bloated" would act as a bloating-relief promise.
- **Low Sugar line:** this is a brand direction, not a claim that the gummies won't upset a stomach. Don't add "gentle" or "won't upset."
- **Survey:** who ran it and how are not stated. Treat it as buyer-reported and always say "of surveyed users."
- **Before scene:** assumed, not from customer quotes. The tubs and bottles must stay unbranded.
- **AI presenter:** follow each platform's AI-content disclosure rules. She never says "I" about results.

**Score: 83/100** (5 of 6 checks passed)
- **Missed (no line would work for the product on the next shelf):** the opening and the promise line ("Feeling normal starts with a daily habit that supports digestion and gut health") could be pasted in by a rival. Only the review card, the 6 g fact, the Low Sugar line and the survey make them Sprout's.
```
