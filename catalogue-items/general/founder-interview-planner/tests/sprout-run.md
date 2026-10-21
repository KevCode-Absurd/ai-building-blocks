# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A thorough, correctly tagged call plan that turns every real discrepancy in the brand file (discount mess, star ratings, 35 vs 99 tests, Kids $74.98 renewal, probiotics ad) into a question with a gap tag and target file, and keeps known facts as quick checks. The after-call sections are rightly omitted since no answers exist yet, and missing files, ad results and photos are flagged rather than guessed.

## Judge list

- Met: Nothing the brand file already confirms is asked as a fresh question
  Known facts moved to checks: "C1 One pouch holds 28 daily packs... only checked, not asked as fresh questions." Q8's 'renewal price' is partly on file but Kids/84-pack renewals are not.
- Met: Every question says which gap it fills and which file the answer goes to
  Every Q and F row carries both, e.g. "Live offer [disputed]; deepest discount [unknown] | offers.md: price summary and policies"
- Met: Every filed answer carries founder, date and question number in the named file
  Not applicable: input says "No answers yet"; nothing was filed, no untagged entries exist.
- Met: Beliefs are filed as story, not as claims
  No answers yet; plan instructs "note whether the answer is a document, a belief or a story" and "graded 'reported' unless a number is given".
- Met: Rights recorded with who, where, how long, paid or unpaid
  Q5: "Get who, where, how long, and paid or unpaid for every person." F19 repeats it for photos, music, font.

## What went in

```text
Brand file: the Sprout folder built from the website, reviews and
ads (00-start-here.md to log.md).

Gaps it already shows:
- Star rating stated four ways [disputed]
- "21" and "over 20" vitamins and minerals [disputed]
- One ad says "probiotics"; the ingredient list has none
- Grams of sugar per pack [unknown: founder]

The call is next Tuesday. Make the call plan. No answers yet.

[attached: sprout/brand.md, sprout/reviews.md]
```

## What came out

```text
# Sprout founder call plan: Tuesday

Gaps come from `sprout/brand.md` and `sprout/reviews.md`, plus the four you listed. Those two files carry no gap tags, so I tagged each gap myself as `[unknown]`, `[disputed]` or `[inferred]`. Target files follow the standard eight-file folder.

**Send the written form and the documents list by Sunday, two days before the call.**

---

## 1. Yes-or-no checks (confirm in the first 3 minutes, do not discuss)

These are stated on the label, the product page or the brand's own rules. They are only checked, not asked as fresh questions.

| # | Check | File |
|---|---|---|
| C1 | One pouch holds 28 daily packs. The 84 size is 3 pouches. | `offers.md` |
| C2 | Kids pack is 15 g and 6 gummies, for ages 2 to 13. | `offers.md` |
| C3 | Pectin base, no gelatin, vegan. Free from gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners and synthetic dyes. | `offers.md` |
| C4 | Folate is methylfolate and B12 is methylcobalamin. | `offers.md` |
| C5 | The daily pack is torn straight across the top only. The big pouch is never shown torn. | `00-start-here.md` house rules |
| C6 | Tie-in characters and partner marks are never shown. Only the flavour description is used. | `00-start-here.md` house rules |
| C7 | Subscribers get a limited flavour for 1 month, then switch back to Original automatically. | `offers.md` policies |
| C8 | The 30-day money-back guarantee covers the first order only. | `offers.md` policies |
| C9 | Orders typically ship within 24 hours and arrive in 3 to 5 days. | `offers.md` policies |
| C10 | Study: 2025, 12 weeks, randomized, double-blind, placebo-controlled, 120 adults aged 23 to 59. Vitamin C up 40.1%, folate up 20.5%. | `proof-and-claims.md` |
| C11 | Brand colours: #00582D, #002C17, #FFF7DF, #007E40, #FFCC2E, #581E5A. Fonts: Work Sans and DM Mono. | `voice-and-look.md` |

---

## 2. Ranked call list (about 10 questions plus the close)

Record the call with a transcript running. After any claim, ask "How do you know?" and note whether the answer is a **document**, a **belief** or a **story**. Ask for real moments, not habits. Don't lead, don't correct, and let silences run.

| Q | Question | Gap | Target file |
|---|---|---|---|
| **Q1** | "Right now the site and ads show 49%, 52%, 55%, 58% and 61% off, $20 off, and $29.99 'indefinitely', which the footer says needs the text-message code. Tell me about the last time you set a discount. Which one is the real first-order offer today, what's the deepest you'll ever go, and which offers will you never run?" | Live offer `[disputed]`; deepest discount `[unknown]` | `offers.md`: price summary and policies; `log.md`: Decisions |
| **Q2** | Go through the pending claims one at a time and ask "How do you know?" for each. The claims are: energy and immunity ("clinically backed formula for energy, immunity"), "[Sprout] works", weight loss and muscle support, healthy hair, "fast bioavailability", and the 30/60/90-day timeline (radiant skin, metabolism, hormone health). | Claims pending `[unknown]` | `proof-and-claims.md`: claims list |
| **Q3** | "Tell me about the last ad that was rejected, pulled or flagged by a platform, retailer, lawyer or regulator." Then follow up: "One ad says 'probiotics' and the ingredient list has none. How did that happen, and what would make you pull an ad the same day?" | Banned lines `[unknown]`; probiotics ad `[disputed]` | `proof-and-claims.md`: claims list; `00-start-here.md`: house rules |
| **Q4** | "GLP-1 users, kids' brain health and fixing a bloated tummy are all in your ads or reviews. Which of these topics will the brand touch, and how far? Which topics does it never touch?" | Topics off limits `[unknown]` | `00-start-here.md`: house rules |
| **Q5** | "Will you appear in ads or lend your voice? Is an AI version of you saying approved lines acceptable? Who else may appear, including children and the people in your current photos, and on what terms?" Get who, where, how long, and paid or unpaid for every person. | Rights `[unknown]` | `proof-and-claims.md`: rights |
| **Q6** | *Product in hand.* "Hold up the Adults pouch, then a daily pack, and use it once while you talk me through each step: where it opens, what comes out, what each hand does, and how it sounds." Repeat for Sugar-Free, Kids and the current limited flavour. Then ask: "How do drawings or AI images usually get it wrong?" Keep their exact words on shape, colour, shine and size. | Looks and use `[inferred from photos]`; sounds `[unknown]`; how many gummies are in an adult pack `[unknown]` | `offers.md`: that product |
| **Q7** | "When does a buyer first notice a change, what do they notice first, and could a camera see it on day one, after a week, after a month, or never? Where does Sprout fall short, and who shouldn't buy it?" Probe the first-days taste and Sugar-Free stomach upset. | Time to effect `[unknown]`; trade-offs and who it's wrong for `[inferred]` | `offers.md`: that product |
| **Q8** | "Tell me about the last cancel complaint that reached you. What exactly happens after the first order: renewal price, pausing, cancelling?" | After first order and cancel steps `[unknown]` | `offers.md`: policies; `customers.md` |
| **Q9** | "Describe one real best customer, no name. Then describe a buyer who surprised you." Reviews show four groups: powder quitters, gut-fix seekers, busy parents and price doubters. Ask: "Who do you want more of, and fewer of?" If the founder's picture differs from the reviews, write down both. | Buyer `[inferred]` from reviews | `customers.md`: marked "founder's view" |
| **Q10** | "How far can the humour go? The site has 'f*&$%#g work' and 'better poops', and the ads have 'Hot Girl Tummy'. Give me a line you'd say and a line you'd never sign off. Who approves ads, and how fast?" | Humour limits and banned words `[unknown]`; approver `[unknown]` | `voice-and-look.md`; `log.md`: Decisions |
| **Q11** | "Your 'too expensive, here's 61% off' ad has 15+ copies. Name your three best ads, why you think they worked, and the number you judge them by. What flopped, and was it the idea or the making?" | Results `[unknown]` (the ad library shows no spend) | `log.md`: Results, graded "reported" unless a number is given |
| **Q12** | "The week you decided to start Sprout: what was going on? Which parts of the story are private?" | Origin `[unknown]` | `business.md`: story |
| **Close** | "What must be true in 90 days for this to be worth it, as one number? What haven't we asked?" | Goal `[unknown]` | `log.md`: Decisions |

---

## 3. Written form (send by Sunday)

| # | Ask | Gap | Target file |
|---|---|---|---|
| F1 | The star rating can appear four ways: 4.8 from 100,000, 4.75 from 109,639, 4.74 from 118,002, and 4.0 from 2,411 on a public site. Which number may ads use, from which source, and as of what date? | `[disputed]` | `proof-and-claims.md`: claims list |
| F2 | The vitamin and mineral count appears as "21", "20+" and "over 20". What is the exact count per the Supplement Facts panel, for Adults and for Kids? | `[disputed]` | `offers.md`: product; `proof-and-claims.md` |
| F3 | Does any Sprout product contain probiotics? Send the ad that says "probiotics" (its ID or copy). | `[disputed]` | `proof-and-claims.md`: claims list |
| F4 | Grams of sugar per pack for Adults Low Sugar, Adults Sugar-Free, Kids and each limited flavour. Also name the sugar alcohol in Sugar-Free and its grams. | `[unknown: founder]` | `offers.md`: that product |
| F5 | How many gummies are in an adult pack? | `[unknown]` | `offers.md`: that product |
| F6 | The site lists 70 + 4 + 16 + 9 tests but also says "35 substances tested". Which is right, and do you have the September 2026 lab certificate? | `[disputed]` | `proof-and-claims.md`: claims list |
| F7 | The full study report: who paid, which lab ran it, whether it's published, and the file. | Document `[unknown]` | `proof-and-claims.md`: claims list |
| F8 | The 3,000+ customer survey: date, method, exact question wording, and the file. | `[inferred]` | `proof-and-claims.md`: claims list |
| F9 | Source and date for each of these: "35,000+ studies", "most fiber supplements contain only 5g", "less than 1% use our guarantee", and "$1.26 vs $3.60 a serving". | `[unknown]` | `proof-and-claims.md`: claims list; `market.md` |
| F10 | Kids subscription price. The Kids page says "Renews at $74.98" against a $53.32 one-time price. Is that line wrong? | `[disputed]` | `offers.md`: price summary |
| F11 | Subscription prices for the 84-pack, Adults and Kids. | `[unknown]` | `offers.md`: price summary |
| F12 | The guarantee in full: what's covered, who pays return shipping, how it's claimed, and the claim rate. | `[unknown]` | `offers.md`: policies |
| F13 | The cancel and pause steps, word for word as the site allows them. | `[unknown]` | `offers.md`: policies |
| F14 | The current "4 free gifts" list, and how often it changes. | `[unknown]` | `offers.md`: price summary |
| F15 | Electrolyte variety pack facts and ingredients. | `[unknown]` | `offers.md`: that product |
| F16 | Cost to make one pack and to ship one order (if you'll share it), and the most you'll pay to win one buyer. | `[unknown]` | `offers.md`: price summary |
| F17 | Stock limits, shipping limits and last-order dates for the next 90 days, plus dates for the next limited flavours. | `[unknown]` | `log.md`: Recent changes |
| F18 | Retailer logos you may show, NSF and GMP mark rules, exact trademark spellings, and the limits in each tie-in contract. | `[unknown]` | `offers.md`; `proof-and-claims.md`: rights |
| F19 | Rights on file for the people in current photos and videos, plus music and the display font. For each: who, where, how long, paid or unpaid. | `[unknown]` | `proof-and-claims.md`: rights |
| F20 | May reviews be quoted word for word, with or without names? Reviews on file include GLP-1 and IBS mentions. | `[unknown]` | `proof-and-claims.md`: rights |
| F21 | Required warnings: the FDA line in ads (currently missing), any age or choking note for kids, and a sugar-alcohol note. | `[unknown]` | `proof-and-claims.md`: claims list |
| F22 | May we name rivals or compare prices? | `[unknown]` | `market.md` |
| F23 | AI presenters: allowed, any limits, and must they be labelled? May an ad tell a story blended from several real reviewers? May a post be styled like a text message or a notes app? | `[unknown]` | `proof-and-claims.md`: rights; `00-start-here.md`: house rules |
| F24 | Three things you wrote yourself: an email, a post and a voice note. | `[unknown]` | `voice-and-look.md` |
| F25 | Three ads you wish were yours, three you never want to resemble, and the video pace you want (fast or slow, phone or polished). | `[unknown]` | `voice-and-look.md` |

---

## 4. Documents to bring

- **Products on the desk, in their shipping boxes:**
  - Adults Low Sugar
  - Adults Sugar-Free
  - Kids
  - the current limited flavour
- **Five plain photos per product:**
  - pack front as sold
  - gummies out of the pack
  - gummies in a hand for size
  - in use (tearing and pouring)
  - a close view of the gummy surface
- **Supplement Facts panel** for every product.
- **Proof files:** the study report, the survey file and the September 2026 lab certificate.
- **The ad that says "probiotics"** and the current offer calendar.
- **Policy text:** the guarantee and the cancel/pause policy.
- **Contract terms:** tie-in flavour contracts, model releases, and music and font licences.

---

MISSING: the other brand-folder files (00-start-here.md to log.md). Only brand.md and reviews.md were attached, so every gap tag above is mine, not the builder's.
MISSING: the "probiotics" ad. It is not in the captured file and was taken from your note.
MISSING: ad spend or results of any kind.
MISSING: product photos. No product picture or clip should be made until these and Q6 are on file.

CHECKS MISSED: none

Next, would you like to fill the gaps in your brand brain with the [Brand guide builder](https://useaiblocks.com/skills/brand-guide-builder), or make an offer with the [Offer builder that answers buyer doubts](https://useaiblocks.com/skills/offer-builder)? You can also name your own next step.
```
