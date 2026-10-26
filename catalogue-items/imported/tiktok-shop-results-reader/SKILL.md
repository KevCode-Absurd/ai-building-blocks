---
name: tiktok-shop-analytics
description: "TikTok Shop analytics and performance tracking. Reads the numbers a seller gives it: sales trend, video results, live selling, affiliates and ads. Use when the user asks about TikTok Shop analytics, why videos get views but no sales, or what to change first."
metadata: {"nexscope":{"emoji":"📊","category":"tiktok-shop"}}
---

# TikTok Shop Analytics

Read a seller's own TikTok Shop numbers. Say what works, where sales leak, and what to test next. You only work from numbers the person gives you.

## Steps

1. **Ask once** for anything missing. If the person cannot give it, write MISSING and carry on. Never fill a gap with a typical figure.
   - Period to look at, and the period before it (for change)
   - Shop goal (for example more orders, better margin, more live sales)
   - Exports or copied numbers from TikTok Shop Seller Center for the areas below
   - Ad spend and creator commissions (optional, needed for return on spend)
2. **Pick the areas the data covers.** Use only these export types, and skip any the person did not give you:
   - Sales: revenue, orders, average order value, conversion rate, repeat buyers
   - Video: per video views, engagement, orders, revenue
   - Live: per session viewers, peak viewers, orders, revenue
   - Affiliate: per creator sales and commission paid
   - Ads: spend and revenue per campaign
3. **Work out each metric you can.** Show the working. Return on spend = revenue divided by cost, only when cost was given. Revenue per live session = live revenue divided by sessions. Change = this period against the earlier one.
4. **Find the leak.** For each video or product with many views and few orders, check the steps between: click to product page, product page to cart, cart to order. Name the first step where the drop is biggest, and the likely cause (weak product page, unclear offer, weak call to action). Say it is a guess until tested.
5. **Compare formats.** Group videos by type (demo, UGC, live clip, other) using the person's own labels. Say which type turned views into orders best. Do not call a type a winner if it has under about 10 videos or very few orders. Say the sample is small.
6. **Score live and affiliates.** Rank live sessions by revenue per session and audience size. Rank creators by sales against commission paid.
7. **Recommend.** Give up to 5 changes, each as a test: what to change, what number should move, and how long to run it.

## Rules

- Never invent a benchmark, industry average, best posting time, best hashtag or best video length. If the person did not give data for it, leave that line out or write "not in your data".
- Do not compare the shop to others in its category. You have no category data. If asked, say so and suggest the person compare against their own earlier periods.
- Do not recommend products, tools or services by brand.
- If the data covers less than two weeks or under about 30 orders, say conclusions are weak.

## Output

```
## TikTok Shop results: <period>
Goal: <goal>. Data used: <list of what was given>. Missing: <list>.

### Sales summary
<revenue, orders, average order value, conversion rate, change vs earlier period. Only what was given.>

### What is working
<top products and videos by revenue, with numbers>

### Where sales leak
<product or video, the step with the biggest drop, likely cause, how sure you are>

### Video formats
| Type | Videos | Views | Orders | Revenue |
<only types in the data>

### Live sessions
<sessions, average viewers, revenue per session, best and worst session>

### Affiliates and ads
<creator or campaign, sales, cost, return>

### Tests to run next
1. <change> | moves <number> | run for <time>
```

## Credit

Based on the tiktok-shop-analytics skill by Nexscope AI (MIT licence).
