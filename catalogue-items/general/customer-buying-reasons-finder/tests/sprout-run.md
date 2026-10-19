# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest map: every quote is exact, counts and shares are correct, no reason is oversold as a pattern, and the health, GLP-1, competitor and kids phrases are all flagged before use. The owner gets a usable FAQ list (cancel, taste, price, sugar-free) and a clear warning that 13 of 22 reviews are brand-picked and all are unverified.

## Judge list

- Met: Every quote appears word for word in its source, with spelling mistakes kept.
  "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (R18) matches reviews.md exactly; all 30+ quotes checked.
- Met: Counts are separate people, not mentions.
  "6, 27%. Brand site 2 (R7, R8), retailer 2 (R9, R10), widget 2 (R11, R14)" lists one ID per person; shares are n/22.
- Met: Nothing is called a pattern with fewer than five people, and one-channel patterns say so.
  "No reason can be called a pattern"; rank 1 marked "6 people, but one channel (reviews only)", rank 2 "one channel, all hand-picked".
- Met: The 'check before use' list exists, even if it's empty.
  Section "4. Check before use" lists 14 flagged phrases with IDs and reasons.
- Met: No quote has a name, initial or city that wasn't in the source.
  Attribution is only source IDs and channel ("R17 brand site, R20 review site"); no names or places added.

## What went in

```text
Customer sources: 20 public reviews, numbered R1 to R20, with where
each came from (brand site, brand site widget, retailer, review site),
plus two short fragments, F1 and F2 (sprout/reviews.md). Captured
over two months. No dates per review, no verified-buyer flags, no
star ratings.

Our product page text is below, so you can see what we already say.
[sprout/product-page.md]

[attached: sprout/reviews.md, sprout/product-page.md]
```

## What came out

```text
## 1. The forces map

All 22 entries are public reviews, which is one kind of source. No reason can be called a pattern. Shares are out of 22 entries, assuming one person per entry. Every best phrase is **unverified** and stays out of paid ads.

| Rank | Reason | Force | People (count, share, channels) | Pattern or thin | Best phrase (source ID) | Backups | Brand says it |
|---|---|---|---|---|---|---|---|
| 1 | Digestion and regularity got better | Result | 6, 27%. Brand site 2 (R7, R8), retailer 2 (R9, R10), widget 2 (R11, R14) | 6 people, but one channel (reviews only) | "My bowel movements are normal for the 1st time in 15 years!" (R7) | "Feel lighter, less bloated and overall good." (R10); "[Sprout] have been the solution to my problems with regularity." (R9); "The prebiotics do their job, but not aggressively" (R8) | Yes. Bullet "Supports digestion and gut health"; survey "67% better, more regular digestion" |
| 2 | Greens powders were gritty, a chore, and hard to keep up | Push (habit in R4: stayed "for the last few years") | 5, 23%. All brand site, hand-picked (R1, R3, R4, R6, R16) | 5 people, but one channel, all hand-picked by the brand | "the drink was definitely gritty/chalky." (R3) | "I've been choking on [a big-name greens powder] for the last few years" (R4); "not having to clean a shaker bottle or extra dishes for greens stuff in powder form" (R6); "The issue has never been nutritive content. It's always been an issue of consistency" (R1) | Yes. "Why Sprout?" accordion ("sloshing chalky powders"), Us vs. Them section, "Vs Powders" review cards. The accordion is closed by default. |
| 3 | Tastes good, like a treat | Pull | 4, 18%. Brand site 3 (R6, R12, R16), widget 1 (R14) | Thin | "[Sprout] literally tastes like fruit snacks I ate as a kid." (R12) | "The convenience and taste are huge! Like mixed berries!" (R6); "They think it's a treat." (R16); "They taste good!" (R14) | Yes. "great tasting gummies"; "Taste" review cards |
| 4 | Easy to grab on a busy day, nothing to wash or juggle | Pull / Result | 3, 14%. All brand site (R5, R6, R15) | Thin | "So easy to grab and eat on my way to the billion things I have to do as a mom." (R15) | "not having to clean a shaker bottle or extra dishes" (R6); "I just take these now and it's easier for me to manage." (R5) | Yes. "Portable: Just grab and go. No Mess, No Stress" (in a closed accordion) |
| 5 | Bought again or recommends it | Result | 3, 14%. Brand site 2 (R6, R17), widget 1 (R14) | Thin | "We quickly decided to resubscribe because we love [Sprout] so much!" (R17) | "Glad I have a subscription!" (R14); "10/10 would recommend." (R6) | Unsure. The page has "1M+ Customers" and "95% take it", but no line about reordering or recommending |
| 6 | Actually sticks with it daily | Result | 2, 9%. Brand site (R1, R2) | Thin | "It's wild I WANT to take [Sprout] and don't forget." (R2) | "[Sprout] has been the one thing I've been able to stick to." (R1) | Yes. "A habit that tastes so good, you'll actually want to keep it"; "80% daily" |
| 7 | More energy and focus | Result | 2, 9%. Brand site (R13), widget (R14) | Thin | "clean feeling energy and mental focus ... without the sugar crash" (R13) | "noticed a difference in my energy" (R14) | Yes. Bullet "Promotes mental clarity + energy" |
| 8 | Kids will eat it | Result | 2, 9%. Brand site (R16, R17) | Thin | "this is the only one they love eating." (R16) | "A bonus is my kids love them too!" (R17) | Unsure. This page only has a Kids flavour tile; the Kids page was not supplied |
| 9 | Helps with GLP-1 side effects (constipation, vitamin loss) | Push (trigger) / Result | 2, 9%. Widget (R11, R14) | Thin | "was always constipated not anymore" (R11) | "they definitely help with the vitamin loss you get!" (R14) | No. It appears only in the auto-generated review summary, not in brand copy. The brand should not say it. |
| 10 | Replaces several other supplements | Pull / Result | 1, 5%. Brand site (R5) | Thin | "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." (R5) | none | Yes. "replaces handfuls of health products" |
| 10 | Old powder cost too much | Push | 1, 5%. Brand site (R3) | Thin | "even with their monthly subscription discount it was still $94 a month" (R3) | none | Yes. Us vs. Them cost per serving |
| 10 | Better sleep | Result | 1, 5%. Widget (R14) | Thin | "and even my sleep!!!" (R14) | none | No |

## 2. Never said by the brand

- **Top five:** four of the five are already on the page: gut (6 people), powders (5), taste (4) and convenience (3).
- **Rank 5, bought again or recommends (3 people: R6, R14, R17):** the page has no line about reordering or recommending. This is unsure, and a person must confirm it before it is called a gap.
- **Placement, not a gap:** the powder reason (5 people) and convenience (3) sit in a closed accordion and in review cards near the bottom, far from the button.
- **Outside the top five, not said:**
  - GLP-1 (2 people: R11, R14). Do not adopt this as a brand claim.
  - Sleep (1 person: R14).
  - Kids eating it (2 people: R16, R17). Unsure on this page.

## 3. What nearly stopped them

| Rank | Anxiety or complaint | People | Their words (source ID) | What the page says now |
|---|---|---|---|---|
| 1 | The subscription is a trap and hard to cancel | 2 (R17 brand site, R20 review site) | "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." (R17, before buying, later resolved); "I have tried multiple times to cancel my subscription." (R20, unresolved) | "Pause Or Cancel Any Time" and "Cancel anytime." The page never says how to cancel. Subscribe & Save is the default, and One Time Purchase is made to look worse. Not covered. |
| 2 | Taste is bad at first, or off | 2 (R18 retailer, R19 widget, tie-in flavour, Sugar-Free) | "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (R18); "the taste is off." (R19) | No answer seen. The FAQ has nothing on taste taking a few days. Not covered. |
| 3 | Too expensive | 1 (F1 retailer) | "They are expensive" (F1) | The page shows $29.99 / $1.07/day. Renewal is $49.99 ($1.78/day) in small print, and the $29.99 needs the SMS sign-up. Partly covered, and in a way that may create this complaint. |
| 4 | Sugar-Free upset the stomach | 1 (F2 review site) | "The sugar free [Sprout] worked too well." (F2) | Nothing about sugar alcohols was seen. The Low Sugar vs. Sugar-Free panel was not captured. Unknown; read the panel before calling this covered. |

## 4. Check before use

| Phrase | Source ID | Reason |
|---|---|---|
| "My bowel movements are normal for the 1st time in 15 years!" | R7 | Health result. A before-and-after that could read as typical when it isn't. Ad platforms restrict body-result claims. Tell it as one buyer's story only. Goes to the claims approver. |
| "This is huge for someone who suffers from chronic IBS!" | R8 | Names a medical condition, which implies a treatment claim. This conflicts with the FDA line in the footer. |
| "[Sprout] have been the solution to my problems with regularity." | R9 | Health result ("solution"). |
| "Feel lighter, less bloated and overall good." | R10 | Health result about the body. |
| "These gummies have helped me to get back to normal as I've been on a glp1 for about a year now and was always constipated not anymore" | R11 | Health result tied to a prescription drug. The brand must not repeat it as its own claim. |
| "I'm on Glp-1 and they definitely help with the vitamin loss you get!" and "noticed a difference in my energy, gut health, and even my sleep!!!" | R14 | Drug-related health claim plus several body results (energy, gut, sleep) the study did not measure. |
| "clean feeling energy and mental focus ... without the sugar crash" | R13 | Cognitive and energy claim. The study measured only 2 vitamins in the blood. "without the sugar crash" is an unsupported comparison. |
| "I was taking [a big-name greens powder] but even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky." | R3 | Names a competitor. The $94 figure is a price claim the brand would need to verify. |
| "I've been choking on [a big-name greens powder] for the last few years" | R4 | Names a competitor in a disparaging way. |
| "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." | R5 | Implies the product fully replaces specific supplements. The brand must be able to support that. |
| "I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat." | R16 | Child-directed. Treat framing for a supplement raises a child safety and overconsumption concern. Check official use and safety before using it. |
| "[Sprout] literally tastes like fruit snacks I ate as a kid." | R12 | Candy comparison. Same child-safety concern if it is used near kids' products. |
| "The sugar free [Sprout] worked too well." | F2 | Describes a stomach side effect. Use it to fix the page, not in ads. |
| All best phrases and backups | R1–R20, F1, F2 | No verified-purchase flags, so all are unverified and stay out of paid ads. Paid or free-product status is unknown. 13 of 22 were hand-picked by the brand. |

## 5. Notes

**Sources**
- 22 entries, all one kind (public reviews):
  - 13 brand site, hand-picked (R1–R8, R12, R13, R15–R17)
  - 3 brand site widget (R11, R14, R19)
  - 4 retailer (R9, R10, R18, F1)
  - 2 review site (R20, F2)
- Separate people is assumed, because reviewer names were removed.
- Brand-picked reviews make up 59% of entries, so pull and result are over-weighted. Five of the six anxiety and complaint entries (R18, R19, R20, F1, F2) come from outside the hand-picked set.

**Date range:** captured Sept to Oct 2026.

**Missing**
- MISSING: dates per review.
- MISSING: verified-purchase flags.
- MISSING: star ratings.
- MISSING: received-free or paid flags.
- MISSING: product, flavour and sugar level for most entries. Only R11, R14 and R19 are tagged.
- Because dates are missing, I can't check which reviews predate the "birthday" price cut to $29.99. Price-related lines (R3, F1) may describe the old pricing.

**Dropped:** nothing. Every entry gives a reason. The rating figures (4.8 / 4.75 / 4.74 / 4.0) are not customer words and are not on the map.

**Moments seen**
- R11: trigger was being "on a glp1" and "always constipated".
- R3: first thought was "$94 a month".
- R17: decided, cancelled before arrival, then resubscribed.

**Saturation:** the newest-20 test can't be run without dates. Most groups have 1–3 people, and the last sources (R18–R20, F1, F2) each added a new reason. Not saturated: more sources will change this map.

**What the map can't tell you**
- Why non-buyers didn't buy. These are reviews only, with no tickets, refund requests or surveys.
- How reasons differ between:
  - Adults and Kids
  - Original and the tie-in flavour
  - Low Sugar and Sugar-Free
- Whether the four rating figures reflect the same reviews.

How often a reason comes up describes these 22 sources only. It is not a typical result and does not predict ad performance.
```
