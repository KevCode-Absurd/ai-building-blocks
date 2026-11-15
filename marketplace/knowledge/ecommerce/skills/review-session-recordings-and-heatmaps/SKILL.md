---
name: review-session-recordings-and-heatmaps
description: "A structured review of session recordings and click, scroll and tap maps that turns what buyers actually do into ranked fixes. Picks which sessions to watch (by page, device and outcome) instead of random viewing, codes every observation on a fixed tag sheet, counts how often each pattern appears, checks it against analytics or survey evidence, and ranks the fixes by gross profit at stake, marking bugs as repairs. Works with any recording tool, including free ones, with privacy masking and consent checked first. Use when traffic is too low to split test, when a page underperforms and nobody knows why, or before a redesign."
---

# Session recording and heatmap review

**You get:** an observation log of 60 to 120 coded sessions, a pattern table (each behaviour with how often it appears, on which page and device), heatmap readings for the key pages, and a ranked fix list of 5 to 12 items, each with its evidence from two sources, gross profit at stake and whether it is a repair or a test idea.

## When to use

- The store has too little traffic to split test, so behaviour evidence must guide changes [CRO-0003].
- One page (often a product page or the cart) underperforms and the numbers do not say why.
- Before a redesign, to know what buyers use and ignore.
- After a launch or theme change, to catch bugs and confusion fast.

## Not for

- A full conversion audit across every page: use `storefront-conversion-audit`.
- Planning a split test from these findings: use `design-store-ab-test`.
- Checkout steps in depth: use `fix-checkout-drop-off`.
- Mobile-only walkthroughs on real phones: use `mobile-conversion-audit`.

## What you need

Required (read access, level 1):

1. **Access to the recording tool** (Microsoft Clarity is free; Hotjar and others work the same way) with at least 2 weeks of data on the pages to review.
2. **Page numbers from GA4 or Shopify** for the same window: sessions, add-to-cart rate and conversion by page and device.
3. **The question:** which page, which device, and what problem (for example "mobile product pages: why do 85% leave without adding to cart?").
4. **Gross profit per order.**

Optional: on-page or post-purchase survey answers, support tickets, the page's change history.

If no tool is installed, recommend one free tool, list the privacy settings in Gate 2, and get the client's yes before adding any script. Installing a tool or changing its settings needs draft or publish access to the theme and the client's yes.

## Before you start: the gates

1. **Enough sessions.** At least 100 recorded sessions on the page and device under review (practitioner default). Fewer: wait, or widen the date range.
2. **Privacy is set.** Text inputs and personal fields masked (most tools mask by default; check it), no recording on account or payment pages, the privacy policy names the tool, and recording respects the store's consent banner where consent is required (EU and UK visitors, and visitors from other countries whose privacy laws expect notice and consent for personal data). Fail: fix settings before watching anything.
3. **Bots filtered.** Exclude very short sessions with no interaction and known bot traffic; Shopify's own session counts include bots [MEA-0012].
4. **Gross profit per order known** [MEA-0037].

## Steps

### 1. Choose the sessions to watch

Never watch at random. Pick 3 or 4 segments tied to the question, 20 to 30 sessions each:

- **Lost buyers:** reached the page, stayed over 20 seconds, did not add to cart.
- **Cart quitters:** added to cart, did not reach checkout.
- **Buyers:** completed an order (the comparison group: what do buyers do that others do not?).
- **Problem flags:** sessions the tool marks with rage clicks, dead clicks, quick backs or errors.

Split by device; mobile and desktop behave differently.

### 2. Code each session on the tag sheet

For each session, note the entry source, device, pages seen, outcome and every observation, using fixed tags:

| Tag | What it looks like |
|---|---|
| Dead tap or click | Taps on something that does nothing (image, price, badge, text) |
| Rage click | Repeated fast taps on one spot |
| Quick back | Leaves a page within seconds back to the previous one |
| Hunting | Scrolls up and down repeatedly, opens and closes tabs or accordions |
| Hesitation | Long pause on price, shipping, size or variant area |
| Zoom or pinch | Zooms images or text |
| Form trouble | Retypes, error messages, abandons a field |
| Skipped key info | Scrolls past reviews, delivery or returns without stopping |
| Gallery deep swipe | Swipes through most images before scrolling |
| Bug | Broken layout, frozen element, error, overlay that will not close |

Write one plain line per observation ("tapped the delivery icon twice expecting details; nothing opened").

### 3. Read the heatmaps for scale

Recordings show why; heatmaps show how many. For each key page and device:

- **Scroll map:** read the 75%, 50% and 25% lines; in audited pages half of visitors left right after the hero and under a third reached deep proof sections [LPG-0051]. Expect big drops after the hero and about 10% more per row on grids [LPG-0041]. Note which key elements sit below where most visitors stop.
- **Click or tap map:** elements under about 1% of clicks are candidates to cut; the most-clicked elements may deserve more space or a higher spot [LPG-0043]. An element with a high share of clicks but reached by few visitors is a strong candidate to move up [CRO-0022].
- **Gallery:** check swipe depth; many shoppers swipe the whole gallery rather than scroll the page [LPG-0060].

### 4. Count the patterns

A behaviour becomes a pattern when it appears in at least 3 of 20 sessions in one segment (practitioner default). For each pattern: count, share of segment, device, page, and whether buyers did it too (if buyers do it as often, it is probably not the problem). Rage clicks under 1 to 2% of sessions are normal background; dead clicks on price or navigation and quick backs from product pages point to missing information [CRO-0023].

### 5. Check each pattern against a second source

Admit a pattern as a fix only with a second, different piece of evidence: analytics (a drop at that step), a survey answer, support tickets or reviews [CRO-0013]. If no second source exists, add a short on-page question, timed to show about 60% of the way through the average session on that page [LPG-0042], and hold the item as a hypothesis.

### 6. Turn patterns into fixes

- **Bug:** repair now; no test.
- **Missing information** (dead taps on icons, hunting for delivery or size): add the information where they looked.
- **Hidden information** (key proof below the 50% scroll line): move it up.
- **Distraction** (heavy clicks on elements that lead away): reduce or move.
- **Confusing control** (variant picker, quantity, accordion): simplify.

### 7. Rank the fixes

Gross profit at stake a month = page sessions on that device a month x pattern share x expected conversion gain (working figure: 10% of the affected sessions recovered, marked) x conversion rate x gross profit per order. Bugs first, then by gross profit per hour of work. Mark each "ship" (repairs and clear information gaps) or "test" (layout changes, where the store has volume).

### 8. Market notes

- **Every market:** review sessions on low-end Android phones separately; watch for slow loads that look like hesitation, delivery date or postcode checker use, payment and delivery questions and chat button taps. Recording scripts add weight; check speed before and after installing.
- **US, UK, EU and beyond:** check that the consent banner and the recording tool agree for visitors from the EU, the UK and US states with privacy laws, and that accessibility issues (tiny tap targets, low contrast) are logged as bugs.

## Checks before you hand it over

- Sessions were chosen by segment, not at random, with counts per segment.
- Every observation uses a tag from the sheet and a plain-language line.
- Each pattern shows its count and share, and whether buyers did it too.
- Every fix has two different kinds of evidence, or is held as a hypothesis.
- Masking and consent settings were checked before watching.
- Bugs are listed first as repairs.
- No script installed or setting changed without the client's yes.

## Output

**One-screen summary:** the question, sessions reviewed by segment, the top 3 patterns with their share, and the first 3 fixes.

**Observation log:** Session ID, Date, Segment, Device, Source, Pages, Outcome, Tags, Note.

**Pattern table:**

| Pattern | Page | Device | Count (of sessions) | Share | Buyers too? | Second evidence | Fix type |
|---|---|---|---|---|---|---|---|

**Heatmap notes:** page, device, scroll 75/50/25% positions, key elements below 50%, top and bottom clicked elements.

**Fix list:** #, Fix, Page, Pattern and evidence, Repair or test, Sessions affected a month, GP at stake a month, Owner, Effort, Approval.

## Common mistakes

- **Watching random sessions.** Step 1 picks segments tied to one question.
- **Stories from one recording.** Step 4 needs a pattern in at least 3 of 20.
- **Fixing what buyers also do.** Step 4 compares with the buyer group.
- **Recording what should never be recorded.** Gate 2 checks masking and consent first.
- **Treating heatmaps as answers.** Step 3 uses them for scale; Step 5 needs a second source.
- **Testing bugs.** Step 6 repairs them directly.

## Sources

- CRO-0003: below about 25,000 to 30,000 monthly visitors, use recordings and heatmaps instead of A/B tests.
- CRO-0013: admit no idea without two pieces of evidence.
- CRO-0022: high-click, low-reach elements are test candidates.
- CRO-0023: rage clicks under 1 to 2% normal; dead clicks and quick backs signal missing information.
- LPG-0041: drop after the hero and per grid row.
- LPG-0042: time the on-page survey at about 60% of session length.
- LPG-0043: prune elements under about 1% of clicks.
- LPG-0051: read scroll maps at 75, 50 and 25%.
- LPG-0060: shoppers swipe the gallery more than they scroll.
- MEA-0012: Shopify sessions include bots.
- MEA-0037: gross margin is delivered cost.

What makes this skill ours: sessions are picked by segment with buyers as a comparison group, so behaviours buyers share are not mistaken for problems; every observation is coded on one tag sheet and a pattern needs at least 3 of 20 sessions plus a second kind of evidence; privacy masking and consent (EU, UK, US states and other privacy laws) are checked before any viewing; and bugs bypass testing.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. The Digital Personal Data Protection Act expects notice and consent for personal data. Watch for pincode checker use, COD questions and WhatsApp button taps.
