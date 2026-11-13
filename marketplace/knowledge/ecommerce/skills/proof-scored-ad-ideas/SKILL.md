---
name: proof-scored-ad-ideas
description: "Produce twenty or more distinct ad directions for a store in one sitting, then keep only those the store can back up. First lists the store's real proof assets (counted reviews and quotes, creator videos with usage rights, tests, certifications, guarantees, founder facts, customer photos), then generates directions from seven evidence sources, and scores every idea on proof held, buyer fit, gross profit per purchase of the product, production speed, policy risk and distance from live ads. Ideas with no proof or a policy block drop out. Each survivor is tagged with hook, angle, buyer, awareness stage, proof used and risk, in ranked order. Use when the production queue is empty or winners are tiring. Read access only."
---

# Proof-scored ad ideas for an online store

**You get:** a ranked table of ad ideas the store can prove, a parked list of the next eight, a dropped list with reasons, a proof inventory and the proof to get next, saved as one dated file.

## When to use

- The production queue is empty and the team needs directions today.
- Winners are tiring and every new idea is a copy of the winner.
- A creator or designer asks "what should I make?" and needs a ranked list.
- A new product or buyer group needs a first set of directions.
- The team has many ideas and no way to choose.

## Not for

- Turning chosen ideas into full briefs and a test plan: use `weekly-creative-sprint`.
- Writing finished ad copy with character counts: use `store-meta-concepts`.
- Mapping everything the account has ever tested: use `creative-gap-map`.
- Openers for a body that already works: use `ad-opener-writer`.

## What you need

Required:

1. **Product facts:** product page URL, price, what is in the box, what it does.
2. **Store profile** from `store-meta-brand-dna`: buyer groups, claims allowed, quote bank. If it does not exist, the reviews export (CSV from the review app: rating, title, body, date, reviewer) is the minimum.
3. **Money line** per product: gross profit per purchase (GPP), from `store-meta-math`.
4. **Current winners and live ads:** ad names with a one-line description, or the ad-level export.

Optional: creator video list with usage rights and expiry dates; test reports and certificates; post-purchase survey answers; abandoned-checkout feedback; founder story notes.

Missing 2: read 50 to 100 reviews by hand and pull exact quotes; automated summaries strip the buyer's own words [AVT-0007]. Missing 3: ideas can be listed but not ranked; say so.

**Access:** level 1 (read).

## Before you start: the gates

1. **Money.** *Pass:* GPP per product. *Fail:* list and filter ideas; leave rank blank.
2. **Proof inventory exists.** *Pass:* step 1 finds at least three usable proof assets. *Fail:* the first job is getting proof (a post-purchase survey [CRO-0018], seeding product to creators), not ideas. Say so and give that plan with the list.
3. **Capacity.** *Pass:* you know what the team can make this month (statics, phone video, creator video). *Fail:* rank production speed using the store's last month of launches.
4. **Tracking.** Not needed to generate ideas; needed later to judge them.

## Steps

### 1. Build the proof inventory

| Proof asset | Count or detail | Date | Where it lives | Can be used in ads? |
|---|---|---|---|---|
| Star rating and review count | e.g. 4.7 from 312 | Today | Review app | Yes, as shown on site |
| Repeated review quotes | Theme and 3 exact quotes | Review dates | Reviews CSV | Yes, with name and source shown [LPG-0037] |
| Creator videos | Number, creator, rights end date | Contract | Folder | Only within rights |
| Tests and certificates | Lab, standard, date | Report | File | Only the exact claim |
| Guarantee and returns | Terms | Policy page | Site | Yes |
| Founder facts | True origin details | Founder | Notes | Yes, never invented [MCR-0009] |
| Customer photos | Count, permission | Review app | App | Only with permission |

Any claim not in this table cannot appear in an idea.

### 2. Generate from seven sources

Aim for at least 20 directions, at least two per source:

1. **The buyer's moment:** a specific situation when the problem bites, in review words.
2. **Failed fixes:** what buyers tried before and why it let them down; past spenders buy fastest [AVT-0009].
3. **Who it is for:** a buyer group named by outcome, person and situation [MCR-0050].
4. **Objections:** one idea per real reason people hesitate [MCR-0043]; write for the top (problem and solution) and the bottom (one objection) [MCR-0044].
5. **A belief to flip:** a common misconception the store can disprove with proof it holds [ORG-0027].
6. **Customer and creator material:** angles customers used that the brand never did [MCR-0035].
7. **Show it working:** demonstration; reaction formats only when the effect is felt within seconds [MCR-0045].

Vary each idea across persona, stage, angle, offer, proof and who speaks (founder, customer, expert, nobody) [MCR-0009].

### 3. Drop what cannot run

Drop an idea when any of these is true, and log why:

- It needs proof not in the inventory.
- It implies the viewer has a condition or makes a disease or body claim [MCR-0020].
- It compares with a named rival without a provable, current fact.
- It matches a live ad's product, buyer, angle and offer; colour or pose changes do not count as new [MCR-0022].
- The product has under 30 days of stock with no restock date.

### 4. Score the survivors

| Factor | 1 | 2 | 3 |
|---|---|---|---|
| Proof strength | One quote | Several quotes or one test | Counted reviews plus a test, or creator video with rights |
| Buyer fit | Guess | Seen in a few reviews | Repeats in reviews or survey |
| GPP of product | Below median | Median | Top |
| Production speed | Shoot or creator needed (1 to 4 weeks for creator content [MCR-0037]) | Phone video in house | Static in a day |
| Distance from live ads | New wording only | New angle | New buyer or new offer |

Rank score = proof x 2 + buyer fit + GPP + speed + distance. Proof counts double because an idea the store cannot back does not convert or gets rejected. Weights are practitioner defaults; test them against the store's own results after a month.

### 5. Tag each idea

Hook (one line, buyer words), angle, buyer, awareness stage, proof used (inventory row), format, risk, and a first test: a still image with one value line can smoke-test an angle cheaply before video [MCR-0075]. A hook must pull buyers, not just viewers [MCR-0026]. No "it's not X, it's Y" lines [MCR-0016].

### 6. Split the list

Top 8 to make now, the next 8 to park, and the dropped list with reasons. Within the top 8, keep a mix: no more than three on one buyer, at least one aimed at people who do not yet know the product.

## Checks before you hand it over

1. At least 20 directions were generated before filtering, from at least five sources.
2. Every surviving idea names its proof row; none uses a claim outside the inventory.
3. Every dropped idea has a reason.
4. No idea in the top 8 repeats a live ad's concept key.
5. Scores are shown per factor, not just a total.
6. Every product in the top 8 has GPP and stock for 30 days.
7. The top 8 would beat a plain list of "ideas for this product": each is specific to the store's buyers and proof.

## Output

1. **One-screen summary:** directions generated, dropped and kept; the top 3 with why; the proof gap that blocked the most ideas.
2. **Ranked idea table:** Rank, Idea name, Hook, Angle, Buyer, Stage, Proof used, Format, GPP, Score (proof, buyer, GPP, speed, distance), Risk, First test.
3. **Parked list:** the next 8, same columns.
4. **Dropped list:** Idea, Reason.
5. **Proof inventory** table from step 1.
6. **Proof to get next:** the one or two assets that would unlock the most dropped ideas.

Save as `AD-IDEAS-<date>.md`.

## Common mistakes

- **Ideas the store cannot prove.** Step 3 drops them; proof counts double in step 4.
- **Inventing a founder or customer story to fit an angle.** Step 1 allows true facts only.
- **Twenty versions of one idea.** Step 2 uses seven sources; step 3 drops near-copies.
- **Ranking by what sounds clever.** Step 4 ranks on proof, buyer fit, GPP, speed and distance.
- **Health and body claims in hooks.** Step 3 drops them before scoring.
- **Ignoring stock.** Step 3 drops products about to run out.

## Sources

- AVT-0007: read reviews by hand to keep buyer words.
- AVT-0009: past spenders on failed fixes are highest intent.
- CRO-0018: two-question post-purchase survey.
- LPG-0037: show reviewer name and source; quotes under press logos.
- MCR-0009: concept matrix; never invent story details.
- MCR-0016: ban "it's not X, it's Y" lines.
- MCR-0020: illustrated health ads still face policy.
- MCR-0022: colour or pose is not a new ad.
- MCR-0026: hooks should filter for buyers.
- MCR-0035: mine customer content for unused angles.
- MCR-0037: creator content takes 1 to 4 weeks.
- MCR-0043: one ad per objection.
- MCR-0044: write for the top and the bottom.
- MCR-0045: reaction videos only for instant effects.
- MCR-0050: segments by outcome, person, facet.
- MCR-0075: smoke-test angles with a simple static.
- ORG-0027: misconception stories as ads.

What makes this skill ours: ideas start from a dated inventory of the store's real proof and anything it cannot back drops out; proof strength counts double in the rank next to the gross profit per purchase of the product; stock and policy filters run before scoring; and the list ends with the proof to collect next, so the store fixes the cause of weak ideas.
