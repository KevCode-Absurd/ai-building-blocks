---
name: nonprofit-retail-pricing-merchandising
description: "Sets pricing strategy for used/donated goods, plans store floor layout, seasonal category rotation, and visual merchandising/display for a thrift or resale store. Use for 'price our donated inventory,' 'redesign the store floor plan,' 'plan a seasonal color-tag rotation.' Online marketplace listing/pricing lives in nonprofit-online-resale."
license: MIT
metadata:
  supervision: "unsupervised"
  supervision_note: "Pricing and floor layout for donated goods; adjust and move on."
  date_added: "2026-09-07"
  date_added_source: "git:1860ed47a83901ff5e6d45abc4a2ef05be8fd4cd"
---

# Nonprofit Retail Pricing & Merchandising

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **A chat AI that can read your files:** The skill works from records and drafts you provide. Research tasks also need current, checked public sources.
<!-- /needs -->

## When to Use This Skill

Use this skill to set in-store pricing strategy for donated/used goods and to design the physical
retail experience: floor layout, category adjacency, seasonal rotation, and visual merchandising.
Typical triggers: "how should we price donated clothing," "our floor feels cluttered, redesign the
layout," "set up a color-tag markdown rotation," "plan our seasonal changeover for back-to-school,"
"boutique-price our name-brand section."

**Boundary:** this skill covers in-store shelf/rack pricing and physical merchandising only. Listing
and pricing high-value items sold through online marketplaces (ShopGoodwill, eBay-style auction
listings) is `nonprofit-online-resale` — hand off any item identified as online-appropriate rather
than pricing it for the floor. Point-of-sale system configuration, cash handling, and loss prevention
are `nonprofit-retail-store-operations`. Grading and triage of incoming donations before they reach
pricing is `nonprofit-donation-intake-grading`.

## Core Framework: Pricing a Non-Fixed-Cost Inventory

Resale pricing differs fundamentally from ordinary retail because there is no wholesale cost basis —
every item's "cost" is effectively zero, so price is set entirely by estimated market clearing value
and the need to keep inventory moving. Anchor decisions to three named levers:

1. **Category price bands** — a published price list or matrix by category/subcategory (e.g.,
   men's dress shirts $4-6, women's dresses $6-12, hardback books $2, small appliances $5-15; these are placeholders only, so set your own bands from your sold records and nearby shop prices) so
   pricing is consistent across volunteers/staff and shifts, not improvised item-by-item.
2. **Boutique/premium tier** — a designated higher-margin section for name-brand, vintage, or
   like-new items identified during grading, priced individually rather than by the standard band;
   this is where most of a thrift store's blended margin actually comes from, since the bulk of
   floor inventory sells near cost-of-handling.
3. **Markdown/aging cadence** — a systematic, date-stamped markdown schedule (commonly a color-tag
   system: each week's new stock gets a color, and tags age through markdown percentages on a fixed
   calendar) that forces stale inventory to clear rather than accumulating.

## Standard Terminology

- **Color-tag rotation**: a system where each intake week (or day) is assigned a rotating tag color;
  a fixed markdown schedule (e.g., 25% off after 4 weeks, 50% after 6, clearance/bag-sale after 8; example steps only, so set yours from how fast your stock sells)
  applies by tag color so aging is enforced mechanically, not judged case-by-case.
- **Sell-through rate**: % of floor inventory in a category that sells within a defined window
  (commonly 30/60/90 days); the primary diagnostic for whether a category's pricing or space
  allocation is right-sized.
- **Category adjacency**: placing complementary categories near each other (e.g., housewares near
  furniture "vignettes," children's clothing near toys) to increase basket size — a core visual
  merchandising principle borrowed from conventional retail and directly applicable to thrift floors.
- **Vignette/staging**: arranging furniture and housewares together as a styled room display rather
  than a warehouse aisle, materially increasing sell-through and price realization on big-ticket
  floor items.
- **Boutique section**: a physically distinct, better-lit, better-fixtured area for premium graded
  items, priced above standard category bands.

## Step-by-Step: Setting Pricing Strategy

1. **Build the category price-band matrix** from grading tiers handed off by intake
   (`nonprofit-donation-intake-grading`): list every major category/subcategory with a standard price
   or narrow range, published for staff/volunteer reference at the pricing table.
2. **Carve out the boutique/premium tier criteria** explicitly (named brands list, "like-new"
   condition standard, vintage indicators) so graders and pricers apply it consistently rather than
   subjectively.
3. **Set the markdown/color-tag calendar** with specific week thresholds and markdown percentages,
   and physically tag or date-stamp items at intake so the system runs without manual tracking.
4. **Benchmark against comparable resale operations** (other thrift chains in the market, online
   sold-comps for boutique items) periodically — stale price bands that haven't been revisited in
   years are a common source of underpricing as thrift/vintage demand has risen.
5. **Review sell-through by category monthly** and adjust price bands or space allocation: a category
   with low sell-through is overpriced, overstocked, or poorly placed — diagnose which before cutting
   price broadly.
6. **Design the floor plan** with clear category zones, sightlines from the entrance, high-traffic
   "impulse" placement near checkout, and a boutique section positioned to be discovered, not hidden
   in a back corner.
7. **Plan seasonal rotation on a calendar** (e.g., swap in back-to-school and fall clothing 6-8 weeks
   ahead of season, rotate holiday decor/costumes ahead of the relevant weeks) and stage the
   changeover in backstock so the floor swap happens in a single push, not gradually.
8. **Run the color-tag clearance mechanically**: enforce markdowns and end-of-cycle bag sales or
   bulk/liquidator pulls on schedule rather than letting aged stock linger and crowd the floor.
9. **Refresh visual merchandising display points** (window, entrance table, endcaps) on a short cycle
   (weekly to biweekly) — a static display is the fastest way for a repeat-visit thrift shopper to
   stop returning.

## Standard Deliverables

- Category price-band matrix (published, versioned)
- Boutique-tier criteria and pricing guide
- Color-tag/markdown calendar
- Floor plan with category zones and boutique placement
- Seasonal rotation calendar
- Monthly sell-through-by-category report

## Common Failure Modes

- **Improvised item-by-item pricing** with no published band, producing inconsistent prices across
  shifts and volunteer frustration.
- **No markdown mechanism**, so aged inventory piles up, crowds the floor, and suppresses new-stock
  visibility and sales.
- **Boutique-worthy items priced at standard band** because grading and pricing criteria aren't
  aligned, leaving margin on the table that should have gone to the premium tier or online resale.
- **Floor plan with no sightlines or adjacency logic**, producing a "warehouse" feel that suppresses
  basket size and return visits.
- **Seasonal rotation reactive instead of calendared**, missing the demand window for back-to-school,
  holiday, or costume categories.
- **Price bands never revisited**, systematically underpricing against a rising secondhand/vintage
  market.

## Practitioner vs. Advisor Framing

- **As a store manager**, publish the price-band matrix physically at the pricing table and retrain
  to it whenever sell-through data shows drift — pricing consistency is a training and enforcement
  problem more often than a strategy problem.
- **As a consultant advising a resale operation**, start any pricing engagement with a sell-through-
  by-category pull; it tells you in one report whether the presenting complaint ("sales are flat")
  is really a pricing problem, a merchandising/space problem, or an intake-quality problem upstream,
  and points you to the right lever before you touch prices.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Resale store daily procedure planner](https://useaiblocks.com/skills/resale-store-daily-procedure-planner).
- The [Donated goods online resale planner](https://useaiblocks.com/skills/donated-goods-online-resale-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
