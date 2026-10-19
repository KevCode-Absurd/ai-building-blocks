# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest doubt map that ties every review to the real page text, uses only the supplied facts and marks everything uninspected as unknown or MISSING. The owner gets a usable fix list that also flags the risky claims (GLP-1, digestion, energy) instead of hiding them.

## Judge list

- Met: Every row has a real quote and a source.
  All 12 rows quote reviews.md verbatim with source, e.g. "My bowel movements are normal for the 1st time in 15 years!" (R7, brand site).
- Met: Nothing is marked "missing" unless the FAQ, gallery and buying area were checked, or it's marked "unknown".
  No row uses "missing"; uninspected gallery/accordion rows say "**Unknown.** The accordion text and gallery were not seen."
- Met: No proposed answer states a fact, test or number you didn't supply.
  Answers use only supplied facts: "Sugar-Free is sweetened with sugar alcohols [MISSING: type, grams per pack]"; "$49.99 every 4 weeks ($1.78/day)" is arithmetic.
- Met: Counts are distinct sources, not mentions.
  Counts are per review ("5" for R7, R9, R10, R8, R11) and the output notes duplicate posters can't be ruled out.
- Met: With a small sample, priorities are labelled as a guess.
  "**Top 5 fixes** (priority is a guess: 20 reviews, 16 of them picked or shown by the brand)"

## What went in

```text
Customer words: 20 public reviews R1 to R20 plus two short fragments,
with where each came from (sprout/reviews.md).

The page: Sprout's main product page as text, including the closed
accordions and FAQ, with notes on what wasn't captured
(sprout/product-page.md).

Facts: Sugar-Free uses sugar alcohols. Subscriptions "Pause Or Cancel
Any Time". Guarantee: 30 days, first order only.

[attached: sprout/reviews.md, sprout/product-page.md]
```

## What came out

```text
| Doubt | Quote and source | Distinct sources | Where the page answers it now | Visible, hidden, missing or unknown | Fact still needed | Answer to add, and where |
|---|---|---|---|---|---|---|
| Will Sugar-Free upset my stomach? | "The sugar free [Sprout] worked too well." (review site fragment, about sugar alcohols) | 1 | The "Low Sugar vs. Sugar-Free" accordion exists, but its text was not captured. The sugar-level picker says nothing about it. | **Unknown.** The accordion text and gallery were not seen. Nothing appears in the captured text, buy area or FAQ. | Supplied fact: Sugar-Free uses sugar alcohols. MISSING: which sugar alcohols and how much per pack. MISSING: brand-approved wording on tolerance. | Add one line directly under the Low Sugar / Sugar-Free picker: "Sugar-Free is sweetened with sugar alcohols [MISSING: type, grams per pack]." Mirror it in the accordion. Don't add tolerance claims until a fact exists. |
| Can I get out of the subscription? | "I have tried multiple times to cancel my subscription." (R20, review site). "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." (R17, brand site) | 2 | Plan box: "Pause Or Cancel Any Time." Under the button: "Renews at $49.99 each 4 weeks. Cancel anytime." No steps for how to cancel are shown anywhere. | **Visible** for the promise. **Unknown** for how to cancel, because the gallery was not seen and the steps are absent from the text and FAQ. | **Needs a fact.** MISSING: how to cancel (account page, email or other), any cutoff before the next charge, and whether R20's experience reflects a broken process. Copy can't fix a cancel flow that doesn't work. | Under the Start Now button, in one block: the renewal price, "Pause or cancel any time" with the actual steps [MISSING], and the guarantee terms (see the next row). Put the same steps in the FAQ. |
| What if it doesn't work for me? (raised by the trap fear) | "I hate subscriptions because I feel like they are a trap…" (R17, brand site). No review asks about returns directly. | 1 (indirect) | Plan box: "30-Day Money-Back Guarantee." The first-order-only limit appears only in the last FAQ. | **Hidden.** The limit is far below the button. | Supplied fact: 30 days, first order only. MISSING: how to claim it, and whether it is a full refund. | Change the plan-box line to "30-day money-back guarantee on your first order." Put the claim steps [MISSING] in the block under the button. |
| How much will I really pay, and is it worth it vs powders? | "even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky." (R3, brand site). "They are expensive" (retailer fragment) | 2 | Plan box shows $29.99, $1.07/day, and "Renews at $49.99" in small text under the button. The footer says the price needs the SMS sign-up. Us vs Them says "$1.26" per serving, which matches none of $1.07, $1.78 or $2.38. | **Visible** for the first-box price. **Hidden** for the renewal and SMS condition (small print and footer). Us vs Them sits far below the button. | **Needs a fact.** MISSING: how $1.26 and $3.60 were calculated. MISSING: whether $29.99 truly needs the SMS sign-up when the button area says "DISCOUNT AUTO-APPLIED." MISSING: which discount % is current (52, 55, 61, 49 and 58 all appear). | Beside the price, use one consistent line: first box $29.99 ($1.07/day), then $49.99 every 4 weeks ($1.78/day), plus the SMS condition if it is true. Fix or remove the $1.26 figure so it matches. R3 can sit near the plan box as one buyer's comparison. |
| Will I actually stick with it? | "The issue has never been nutritive content. It's always been an issue of consistency… [Sprout] has been the one thing I've been able to stick to." (R1, brand site). "It's wild I WANT to take [Sprout] and don't forget." (R2, brand site) | 2 | "Why Sprout?" accordion ("A habit that tastes so good…"). Survey below the plan box: 95% take it 4 to 6 times a week, 80% daily. | **Hidden.** It sits in a closed accordion and below the plan box. | MISSING: survey method (how the 3,000+ were chosen, question wording, whether incentivised). | Place the R1 quote and the survey line, with its method note, just above or beside the plan box. Phone view not seen; the first screen is inferred. |
| What does it taste like, and will I like it? | "literally tastes like fruit snacks I ate as a kid." (R12, brand site). "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (R18, retailer). "the taste is off." (R19, widget, tie-in Sugar-Free) | 3 (R6 also praises taste: brand site, 4 total) | Flavor tile: "Where fresh strawberries meets clean greens." Taste reviews appear only in the bottom widget. | **Visible** for the flavor line. **Hidden** for the reviews at the bottom. | MISSING: whether Sugar-Free and the tie-in taste differ from Original Low Sugar. That is a guess drawn from R19 alone. | Next to the flavor/sugar picker, show 2 or 3 taste reviews by variant, including a mixed one like R18 rather than only praise. |
| Will it help my digestion? | "My bowel movements are normal for the 1st time in 15 years!" (R7, brand site). "the solution to my problems with regularity." (R9, retailer). "Feel lighter, less bloated" (R10, retailer). R8 (brand site), R11 (widget) | 5 | Bullet "Supports digestion and gut health" (visible). Survey "67% better, more regular digestion" and the reviews (below the plan box). Inulin is in the ingredients accordion (closed). | **Visible** for the claim. **Hidden** for the proof. | **Needs a fact.** The 2025 study measured only 2 vitamins in blood, so there is no supplied evidence for a digestion effect. MISSING: the brand's own description of what inulin does, and any gut-specific test. | Next to the digestion bullet, keep three things apart. Feature: inulin, listed in ingredients. How it works: [MISSING]. Customer experience: R7 told as one buyer's story with "results vary," plus the survey with its method. Don't present R7 as a promise. |
| Will I feel more energy, and when? | "clean feeling energy and mental focus … without the sugar crash" (R13, brand site). "noticed a difference in my energy, gut health, and even my sleep!!!" (R14, widget) | 2 | Bullet "Promotes mental clarity + energy" (visible). FAQ "When will I feel something?" says "days or weeks… consistent daily use" (bottom). Survey 52% "more energized" (below the plan box). | **Visible** for the claim. **Hidden** for the timing and proof. | **Needs a fact.** MISSING: evidence for the energy and mental-clarity claims beyond the survey. The study covers 2 vitamins only. | Move the FAQ timing line beside the bullets. Soften or source the bullet. Moving copy must not hide an unsupported claim. |
| Does it replace my other supplements? | "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." (R5, brand site) | 1 | "Why Sprout?" ("replaces handfuls of health products"). Benefits ("replace a big shelf in your medicine cabinet"). Ingredients accordion. "View Nutrition Label" link. | **Hidden.** These are closed accordions; the label link is visible but its content wasn't seen. | **Needs a fact.** MISSING: full label amounts and % daily value. MISSING: which count is right, "21 vitamins" or "over 20." MISSING: whether a probiotic is actually present (R5 implies one; the page lists prebiotics). | Add a real nutrition-label image to the gallery and link it beside the bullets. Drop "replace" wording that the label can't back. |
| Is it easy to take daily, no mess? | "not having to clean a shaker bottle or extra dishes" (R6, brand site). "So easy to grab and eat on my way…" (R15, brand site) | 2 | "Why Sprout?" (Portable, No Mess). Directions accordion (28 packs, "small handful"). FAQ "What's inside each order?" The gallery reportedly shows gummies in a hand (inferred). | **Hidden** in the text. **Unknown** in the gallery, which was not seen. | MISSING: the number of gummies per pack. | Gallery image brief. Question: what's in a pack? Answer: one real photo of an opened pack and its gummies, captioned "1 pack a day, 28 per pouch [gummy count MISSING]." Sources: R6, R15. |
| Will my kids eat it? | "this is the only one they love eating. They think it's a treat." (R16, brand site Kids page). "my kids love them too!" (R17, brand site) | 2 | "Find Your Flavor" tiles for Kids, far below. The Kids page is separate. | **Hidden.** | MISSING: what the Kids page's "Renews at $74.98" covers (inferred to be 2 kids, but not stated). | Near the "How many Adults?" picker, add a link to the Kids version. Fix the Kids page renewal wording once the fact is known. |
| Is it OK alongside my GLP-1 medication? | "I've been on a glp1 for about a year now and was always constipated not anymore" (R11, widget). "I'm on Glp-1 and they definitely help with the vitamin loss" (R14, widget) | 2 | Only the auto-generated review summary at the bottom, which mentions GLP-1 side effects. | **Hidden.** It is also a risk, because the brand's widget voices the claim. | **Needs a fact.** None supplied. The brand should not make this claim. | Add no claim. Review whether the auto-summary should repeat GLP-1 language. Customer reviews can stay as customer words. |

**Top 5 fixes** (priority is a guess: 20 reviews, 16 of them picked or shown by the brand)
1. Put a sugar-alcohols line under the Low Sugar / Sugar-Free picker. The fact is supplied and the gut buyer is core.
2. Put one block under Start Now: renewal $49.99 every 4 weeks, real cancel steps, and "30-day guarantee, first order only."
3. Make the price story consistent beside the price: first box, then renewal per day. Show the SMS condition if it's true, and fix the $1.26 figure.
4. Back the digestion bullet next to the claim. Keep inulin, how it works and customer stories apart, and tell R7 as one buyer's story.
5. Move habit and taste proof (R1, the survey with method, mixed taste reviews by variant) up beside the plan box and flavor picker.

**Facts to collect before writing**
- Cancel steps, the cutoff before the next charge, and why R20 couldn't cancel.
- Sugar alcohol type and grams per pack, plus brand-approved tolerance wording.
- Whether $29.99 needs the SMS sign-up, and the single current discount %.
- How the Us vs Them $1.26 and $3.60 figures were calculated.
- Survey method for the 95%, 67% and 52% figures.
- Evidence for the digestion, energy, immunity and clarity claims beyond the 2-vitamin study.
- Full nutrition label amounts, the correct vitamin count, and whether a probiotic is included.
- Gummy count per pack, and what the Kids $74.98 renewal covers.
- Guarantee claim steps and refund terms.
- A phone screenshot of the page, the gallery images in order, and the Low Sugar vs. Sugar-Free accordion text. Until these are seen, nothing here can be marked "missing."

**What this can't tell you**
- These are mostly brand-picked happy reviews, so they show what fans mention, not why visitors left. People who didn't buy may have different doubts.
- How often a doubt comes up here is not lost sales. Reviewer names were removed, so one person posting twice can't be ruled out.
- Phone layout, gallery content and page speed weren't inspected, so visibility labels are based on the text order.
```
