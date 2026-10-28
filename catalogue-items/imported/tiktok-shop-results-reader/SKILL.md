---
name: tiktok-shop-analytics
description: "TikTok Shop analytics and performance tracking. Reads the numbers a seller gives it: sales trend, video results, live selling, affiliates and ads. Use when the user asks about TikTok Shop analytics, why videos get views but no sales, or what to change first."
metadata: {"nexscope":{"emoji":"📊","category":"tiktok-shop"}}
---

# TikTok Shop Analytics

Read a seller's own TikTok Shop numbers. Say what works, where sales leak, and what to test next. You only work from numbers the person gives you.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your results** (yours): an export of your numbers for set dates, from the tool that holds them: an ad account, your store, analytics or your product.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your results. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini with file upload:** It can read full Seller Center exports instead of a pasted sample.
<!-- /needs -->

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

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [TikTok ad test reader](https://useaiblocks.com/skills/tiktok-ad-test-reader). It takes the audit report.
- The [TikTok Spark ad picker](https://useaiblocks.com/skills/tiktok-spark-ad-picker). It takes the audit report.
- The [TikTok Ads account auditor](https://useaiblocks.com/skills/tiktok-ads-account-auditor). It takes the audit report.
- The [TikTok starter campaign builder](https://useaiblocks.com/skills/tiktok-starter-campaign-builder). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Credit

Based on the tiktok-shop-analytics skill by Nexscope AI (MIT licence).
