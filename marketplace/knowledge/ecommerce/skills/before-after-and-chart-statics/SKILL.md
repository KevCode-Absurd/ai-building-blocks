---
name: before-after-and-chart-statics
description: "Designs before-and-after, us-versus-them and chart static ads that pass Meta and Google review and show only what the store can prove: a claim-to-evidence sheet, 3 to 5 layouts (split before-and-after, comparison table, bar or line chart, mechanism diagram) with exact words and data labels, the honest-chart rules (zero baselines, real units, sources on the ad), and a policy-safe backup for every risky layout. Use when the product makes a visible or measurable difference, when competitors run comparison ads, or after an ad was rejected for misleading or health claims."
---

# Before-and-after and comparison chart ads

**You get:** a claim-to-evidence sheet and 3 to 5 static ad specs (layout, every word, data labels, source line, policy notes), each with a policy-safe backup version, ready for a designer to build and for the client to approve.

## When to use

- The product makes a visible change (cleaning, stain removal, hair, skin, home, car) and the store has real photos of it.
- The store has test data (lab test, timed demo, survey with a stated sample) that can become a chart.
- Buyers compare the store with a named or generic alternative and want a clear side-by-side.
- An ad was rejected for misleading claims or personal health and appearance, and needs a safe rebuild.

## Not for

- Comparison ad concepts and the full legal claims sheet against named competitors: use `comparison-ads-that-stay-legal`.
- Building the store's list of provable claims: use `product-claims-profile`.
- Checking finished copy for policy: use `check-ad-copy-for-policy-and-claims`.
- Comparison landing pages: use `build-comparison-page`.

## What you need

Required:

1. **The claims profile** for the product (`product-claims-profile`): each claim marked proven, supported, customer-reported, opinion or banned, with its evidence.
2. **Evidence files:** original before-and-after photos with date, device and conditions; lab or test reports; survey data with question wording and sample size; competitor facts with the page and date they came from.
3. **Product category and markets**, because weight-loss, cosmetic, supplement and health products face stricter rules.
4. **Gross profit per order** for the product (`store-meta-math`).

Optional: rejected ad screenshots and the rejection reason; competitor ads from the Meta Ad Library.

Read access is enough. Submitting ads for review needs draft access (level 2) and the client's yes.

## Before you start: the gates

1. **Every claim has evidence on file.** Pass: the claim is "proven" or "supported" in the claims profile. Fail: cut the claim; no chart or photo is made for it.
2. **Before-and-after photos are real and same-condition.** Pass: same light, angle, distance, device, no filter, with the original files and dates. Fail: do not use them.
3. **Category rules allow the format.** Meta's Health and Wellness standard requires 18+ targeting for weight-loss and cosmetic ads, and its 2024 and July 2026 versions ban side-by-side weight-loss transformations and imagery that builds negative self-perception [MCR-6044]. Read the live page on the day. Fail: use the policy-safe backup only.
4. **Gross profit per order is known** [MEA-0037]. Fail: compute it first.

## Steps

### 1. Fill the claim-to-evidence sheet

One row per claim the ad would show: exact wording, evidence file, what the evidence actually says, sample and conditions, status. Rewrite any claim down to what the evidence says. "Removes 99% of stains" becomes "Removed the coffee stain in our 3-minute test" if that is what was tested.

### 2. Pick the layout per claim

| Layout | Use when | Main risk |
|---|---|---|
| Split before-and-after | visible change on an object or surface | staged or edited photos |
| Before-and-after on a person | cosmetic results, hair, skin | platform health rules [MCR-6044], typical results |
| Us versus them table | 3 to 5 checkable facts | unfair or outdated competitor facts |
| Bar or line chart | test or survey numbers | misleading scale, hidden sample |
| Mechanism diagram | how it works | implied medical claims |

Objects and surfaces are safer than bodies. A stain, a pan, a car seat or a bathroom tile shows the product working without touching personal appearance rules.

### 3. Rules for before-and-after

- Same conditions both sides: light, angle, framing, camera, no filters or retouching on either side beyond exposure matching.
- Label "Before" and "After" with the time between ("after 4 weeks of daily use").
- Show a typical result, not the best one. If a standout result is used, the ad must also say what most users can expect; US guidance requires it [MCR-6025].
- Never show a body, face or skin in a way that says the viewer looks bad now. No "fix your ugly..." lines, no zoomed skin flaws, no "perfect body" [MCR-6044].
- For sensitive health problems, an illustration plus a clear persona-and-problem headline avoids graphic images [MCR-0020].
- Use customer photos only with written permission and the order match, as in `review-screenshot-ads`. Never use AI-made before-and-after images; they are invented proof.
- For slow-acting products, real before photos can come from buyers: ask new customers for a day-0 photo as part of a 90-day plan [CXP-0003], with consent for ad use asked separately.

### 4. Rules for charts

- Bars start at zero. A cut axis makes small gaps look big.
- Label units and the exact measure ("minutes to dissolve", "% of 212 buyers who said yes").
- Put the source on the ad in small type: "Internal test, 12 Oct 2026, 3 samples each" or "Survey of 212 customers, Sep 2026".
- Show the sample size. Under about 30 responses, say "small sample" or do not chart it (practitioner default, test it).
- One message per chart. If the chart needs a legend with more than two items, simplify it.
- Make the chart readable at phone size: bars thick, labels at least the size of body text, two or three bars only.

### 5. Rules for us-versus-them

- Compare like with like: same size, same price point, same use.
- Each row is a fact either side can check, with the source and date for the competitor's value. Re-check on the day before launch.
- Generic "other brands" is safer than a named brand. Naming a competitor needs the full legal process in `comparison-ads-that-stay-legal`.
- In India the ASCI Code (Chapter IV) allows comparisons only if they are factual, accurate, provable and do not unfairly denigrate the other product; the US expects the same truth and proof.
- Use ticks and crosses only for yes or no facts. Never a cross for "not as good".

### 6. Write the specs

For each ad: layout, headline (6 to 10 words, one idea), every on-image word, data labels, source line, disclaimer or typical-result line, product shot, sizes. Keep the headline fully clear; a static half-clear headline loses [MCR-0019]. Then write the policy-safe backup: the same idea without the riskiest element (object instead of body, generic instead of named, descriptive instead of numeric).

### 7. Pre-check and approval

Run each spec through `prelaunch-ad-check` and `check-ad-copy-for-policy-and-claims`. For weight-loss and cosmetic products, set 18+ targeting [MCR-6044]. Submit the main and backup versions as drafts; the client approves both before review.

### India and US notes

- **India:** ASCI special care applies to products for perceived physical problems (height, baldness, weight); claims cannot go beyond what the product can do. Drugs and Magic Remedies Act rules bar some disease claims entirely; skip any medical framing. Show Indian test conditions (water hardness, climate) where they matter.
- **US:** typical-results disclosure for standout results [MCR-6025]; for health claims, competent scientific evidence is expected; a single in-house test is a demonstration, not a clinical claim.

## Checks before you hand it over

- Every claim on every ad links to an evidence file and says no more than it.
- Before-and-after photos are real, same-condition, dated and unretouched, with permission where a person appears.
- No image or line builds negative self-perception or shows a weight-loss side-by-side on Meta.
- Chart bars start at zero, units and sample size are shown, and a source line is on the ad.
- Comparison rows are like for like, sourced and re-checked today.
- Each risky ad has a policy-safe backup.
- 18+ targeting is noted for weight-loss and cosmetic ads.
- Nothing was submitted without the client's yes.

## Output

**One-screen summary:** claims used and cut, layouts chosen, the riskiest ad and its backup, policies checked (with dates), approvals needed.

**Claim-to-evidence sheet:**

| Claim on ad | Evidence file | What the evidence says | Sample and conditions | Status | Used in ad |
|---|---|---|---|---|---|

**Ad spec:**

| Ad | Layout | Headline | On-image words | Data labels and units | Source line | Typical-result or disclaimer line | Visual | Sizes | Backup version |
|---|---|---|---|---|---|---|---|---|---|

## Common mistakes

- **Best-case photos.** Step 3 shows the typical result or adds what most users get [MCR-6025].
- **Different light on each side.** Step 3 requires the same conditions and original files.
- **Bars that start at 80.** Step 4 starts every bar at zero.
- **Charts with no sample size.** Step 4 puts sample and source on the ad.
- **Body shaming as a hook.** Step 3 bans it and gate 3 checks the live policy [MCR-6044].
- **No backup.** Step 6 makes a safe version so a rejection does not stop the launch.

## Sources

- MCR-6044: Meta Health and Wellness: 18+ targeting, no side-by-side weight loss, no negative self-perception.
- MCR-6025: disclose typical results for standout testimonials.
- MCR-0020: illustration plus persona headline for sensitive health problems.
- MCR-0019: a static headline must be fully clear.
- CXP-0003: day-0 before photos in a 90-day plan.
- MEA-0037: gross margin is the delivered cost to the door.

What makes this skill ours: every number or photo on the ad is traced to an evidence file and rewritten down to what that file says; objects are preferred over bodies to show the change; charts carry their sample and source on the ad itself; and every risky layout ships with a policy-safe backup so one rejection does not stop the launch.
