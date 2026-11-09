---
name: tiktok-campaign-plan
description: Plan a paid TikTok campaign with a test phase and a scale phase. Works out the most the business can pay per sale or sign-up, checks the Pixel and Events API (event_id deduplication, hashing, consent), chooses between Smart+ and a manual set-up, sets budgets as proposals for the client to approve, plans three to five hooks across formats, and flags teen, AI-label and restricted-product rules. Use for a first TikTok campaign, a new product, or a rebuild when costs have climbed.
---

# TikTok campaign plan

## When to use

- A brand is starting TikTok ads, or launching a new product or market.
- Costs have climbed and the account needs a reset.
- The client has a budget but no plan for what to test first.

## What you need

- Product, price, margin and any shipping or payment costs; or, for sign-ups, what a sign-up is worth.
- Monthly budget and how long the client will give the test phase.
- Shop platform (for example Shopify or WooCommerce) and whether the Pixel and Events API are set up.
- Who can film: staff on a phone, creators who already post about the brand, or neither.
- Who the buyers are, and whether the product is restricted or could reach under-18s.

**Access:** level 1 to plan. Level 2 to build drafts (Smart+ has a draft mode). Level 3 to launch, after the client confirms the action list and limits.

## Steps

### 1. Break-even maths
- Break-even cost per sale = price minus product cost, shipping, payment fees and expected refunds.
- For sign-ups, ask what share become paying customers and what each is worth. If unknown, say so and plan to measure it.
- Show the maths in a small table. This number is the test's yardstick.

### 2. Check tracking before spending
- Pixel base code installed; key events fire (for a shop: ViewContent, AddToCart, InitiateCheckout, CompletePayment).
- Events API sends the same events from the server, with the same event_id as the Pixel copy so TikTok counts each once.
- Email and phone normalised and SHA-256 hashed before sending, or hashed by the Pixel's advanced matching.
- Pixel fires only after consent for UK and EU visitors; the server route respects the same choice.
- Place a test order with the test event code and confirm one browser and one server event, deduplicated.
- If tracking fails, write the fix spec and do not launch a conversion campaign yet.

### 3. Choose Smart+ or manual
- **Smart+** when tracking works, the shop has enough orders for the system to learn, and there is a steady supply of creative. Use its previews to check every creative combination, and draft mode for level 2 work.
- **Manual** when you need a clean answer to one question, the client insists on a constraint, or tracking is not trusted yet.
- Pick the objective for the action the business is paid for: Reach for awareness; Traffic, Video views or Community interaction for consideration; App promotion, Lead generation or Sales for conversion (TikTok's list, checked 7 Nov 2026). Name the attribution window (default 7-day click, 1-day view) in the plan.

### 4. Plan the creative
- Three to five hooks, each named ("Shelf drop", "Morning routine"), written for different awareness levels, not one hook reworded.
- Spread them across formats: talking head, demo, unboxing, slideshow.
- Brand visible in the first 2 seconds and most ads under 25 seconds, per the TikTok and Ebiquity advice.
- One change per test cell. Each cell gets a kill rule set now: the spend or time after which it stops if cost per result is above break-even.
- Mark any AI-made realistic person, voice or scene for the AIGC disclosure.

### 5. Budget as proposals
- Test phase: enough daily budget per cell to reach a decision within the time the client allows. Use the client's break-even and the kill rule to size it; show the maths.
- Scale phase: what triggers it (a hook beating break-even over the agreed period), and the step size for budget increases, agreed with the client.
- Every budget is a proposal. The client sets the cap.

### 6. Rules check
- Teen targeting: when under-18s are in the audience, only broad options (age, location, language, device). In the EU, no targeted ads to children.
- Restricted products: read TikTok's ad policy handbook for each market before planning.
- Files: 9:16, MP4 or MOV, up to 500 MB, with sound; text inside TikTok's safe-zone files.
- Creator content: agreement, approved fee and in-video disclosure.

### 7. Launch checklist
Tracking tested, identity linked in Business Center, creative approved, AI disclosures set, test cells and kill rules written, budget and cap confirmed, action list approved.

## Checks

- Break-even is shown and every budget ties back to it.
- No benchmark numbers that are not from the client or a dated source.
- At least three distinct hooks with names and kill rules.
- Steps that need level 2 or 3 are marked.
- Every TikTok rule used carries its check date; anything that differs on screen is marked "check in Ads Manager".

## Output format

1. Break-even table.
2. Tracking check: pass, fix, or not checked, with the fix spec.
3. Campaign choice (Smart+ or manual) with the reason.
4. Test matrix: hook name, format, length, first two seconds, kill rule.
5. Budget proposal for test and scale phases.
6. Rules check and launch checklist.

## Example of good output (short)

*Illustrative structure, not a real business: a refillable lip balm brand, 9 GBP each. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Break-even:** price 9.00 GBP; product, packing and postage 2.70; payment fees 0.30. Break-even cost per sale 6.00 GBP.
>
> **Tracking:** fix first. CompletePayment fires from the Pixel only; no Events API. Spec: add the server event with event_id = order number, test with the test event code.
>
> | Hook | Format | Length | First two seconds | Kill rule |
> |---|---|---|---|---|
> | Pocket swap | Demo | 15 s | Hand pulls an empty tube from a jeans pocket, clicks in a refill | Stop if cost per sale is above 6.00 GBP after the agreed test spend |
> | Bin count | Talking head | 20 s | "I threw away 12 lip balms last year." | Same |
> | Refill ASMR | Slideshow | 12 s | Close-up click, no voice | Same |
>
> **Campaign:** manual for the first test so each hook gets an equal read; Smart+ once a winner is clear and tracking is fixed.
