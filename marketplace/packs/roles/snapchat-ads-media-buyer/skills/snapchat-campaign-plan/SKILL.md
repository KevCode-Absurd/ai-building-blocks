---
name: snapchat-campaign-plan
description: Plan a paid Snapchat campaign for an online store with a test phase and a scale phase. Works out the most the business can pay per sale, checks the Snap Pixel and Conversions API (shared event_id, order ID, hashing, Shopify data sharing), picks the objective and bid strategy, decides when to add Dynamic Ads, sets budgets as proposals for the client to approve, plans three to five concepts in Snapchat's formats and safe zones, and flags age floors, teen limits and US or India rules. Use for a first Snapchat campaign, a new product or market, or a rebuild when costs have climbed.
---

# Snapchat campaign plan

## When to use

- A store is starting Snapchat ads, or launching a new product or market (for example the US or India).
- Costs have climbed and the account needs a reset.
- The client has a budget but no plan for what to test first.

## What you need

- Product, price, margin, shipping, payment fees and expected returns.
- Monthly budget, currency (USD or INR) and how long the client will give the test phase.
- Shop platform (for example Shopify or WooCommerce), and whether the Pixel, Conversions API and catalog are set up.
- Who can film: staff on a phone, creators who already post about the brand, or neither.
- Who the buyers are, which countries and states, and whether the product is age-restricted or could reach under-18s.

**Access:** level 1 to plan. Level 2 to build paused campaigns and ads. Level 3 to launch, after the client confirms the action list and limits.

## Steps

### 1. Break-even maths
- Break-even cost per sale = price minus product cost, shipping, payment fees and expected returns.
- For India, include cash-on-delivery returns if the store offers it; ask for the real return rate.
- Show the maths in a small table. This number is the test's yardstick.

### 2. Check tracking before spending
- Pixel fires PAGE_VIEW, VIEW_CONTENT, ADD_CART, START_CHECKOUT and PURCHASE, with value and currency on PURCHASE.
- Conversions API (v3, or CAPI Gateway) sends the same events from the server with the same event_id as the Pixel's client_dedup_id, and the order number as transaction_id and order_id on purchases.
- Email and phone normalised (phone with 91 or 1 country code, digits only) and SHA-256 hashed.
- On Shopify, the Snapchat app's data sharing is set to Always on.
- Place a test order with Test Events open, and send a server test to the validate endpoint. Confirm one purchase, deduplicated.
- If tracking fails, write the fix spec and do not launch a Sales campaign yet.

### 3. Pick objective, bid and structure
- Objective: Sales with Pixel Purchase as the goal once tracking works. Traffic or Awareness and Engagement only when the client's goal is reach or visits, said in writing.
- Bid: Auto-Bid when steady spend matters most; Target Cost at or below break-even when a cost per sale must hold. Avoid Max Bid until you know the auction, because a low bid stops delivery.
- Placement: automatic to start.
- Name the attribution window (default 28-day swipe, 1-day view) in the plan, and say how it differs from the client's other channels.
- Plan to leave ads alone for the first 1 to 4 days, and wait about 72 hours before bid or targeting changes, because conversions arrive late.

### 4. Decide on Dynamic Ads
- Add Dynamic Ads when the catalog has the required fields (id, title, description, link, image_link, availability, price, condition, and brand or mpn or gtin), Pixel item IDs match the catalog above 80%, and at least 1,000 Snapchatters have matched.
- If not ready, list the fixes and keep Dynamic Ads for the scale phase.

### 5. Plan the creative
- Three to five concepts, each named ("Mirror try-on", "Unbox at the gate"), written for different awareness levels, not one line reworded.
- Spread them across formats: Single Image or Video, a Story Ad with several Snaps, a Collection Ad with four products, and Sponsored Snaps if the profile is linked.
- 9:16 at 1080 x 1920, sound on with captions, brand before 2 seconds without a still logo opener, most ads short (Snap suggests about 5 to 6 seconds).
- Text and logos outside the top 150 px and bottom 330 px (bottom 450 px for Collection Ads).
- One change per test cell. Each cell gets a kill rule set now: the spend or time after which it stops if cost per sale is above break-even.

### 6. Budget as proposals
- Test phase: enough daily budget per cell to reach a decision within the time the client allows, and at least Snap's minimums on screen. Show the maths from break-even and the kill rule.
- Scale phase: what triggers it (a concept beating break-even over the agreed period, checked against shop orders), and the step size for budget increases, agreed with the client.
- Every budget is a proposal. The client sets the cap.

### 7. Rules check
- Age floors from Snap's policy for each country and state (for example alcohol 21+ in the US; 18+, 21+ or 25+ by Indian state).
- Under-18s in India, the EU or the UK: no customer lists or personalised targeting; broad options only.
- Restricted products: read Snap's ad policies before planning; gambling and prescription drugs need pre-approval.
- Creator content: Paid Partnership tag, the right permission level, in-video disclosure (FTC in the US, ASCI in India), and a fee the client approves.
- Public Profile linked to the ad account.

### 8. Launch checklist
Tracking tested, Public Profile linked, catalog checked if used, creative approved and inside safe zones, age floors set, test cells and kill rules written, budget and cap confirmed, action list approved. Submit ads at least a day before the start date for review.

## Checks

- Break-even is shown and every budget ties back to it.
- No benchmark numbers that are not from the client or a dated source.
- At least three distinct concepts with names and kill rules.
- Steps that need level 2 or 3 are marked.
- Every Snapchat rule used carries its check date; anything that differs on screen is marked "check in Ads Manager".

## Output format

1. Break-even table.
2. Tracking check: pass, fix, or not checked, with the fix spec.
3. Objective, bid strategy and Dynamic Ads decision, with reasons.
4. Test matrix: concept name, format, length, first two seconds, kill rule.
5. Budget proposal for test and scale phases.
6. Rules check and launch checklist.

## Example of good output (short)

*Illustrative structure, not a real business: a cotton kurta label selling online in India, 1,499 INR each. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Break-even:** price 1,499 INR; product and packing 520; shipping 90; payment fees 30; returns allowance 110. Break-even cost per sale 749 INR.
>
> **Tracking:** fix first. PURCHASE fires from the Pixel with no client_dedup_id; the Conversions API sends its own event_id. Spec: set client_dedup_id and event_id to the order number, add transaction_id and order_id, retest with Test Events and the validate endpoint.
>
> | Concept | Format | Length | First two seconds | Kill rule |
> |---|---|---|---|---|
> | Mirror try-on | Single video | 6 s | Hand pulls the kurta off a hanger, cut to the mirror | Stop if cost per sale is above 749 INR after the agreed test spend |
> | Fabric close-up | Story Ad, 3 Snaps | 3 x 5 s | Thumb rubs the cotton, caption "Breathes in May" | Same |
> | Four colours | Collection | 6 s | Model turns, four colour tiles below | Same |
>
> **Bid:** Auto-Bid for the test; Target Cost at 700 INR once a winner is clear. **Dynamic Ads:** later; match rate is 62%, below 80%.
