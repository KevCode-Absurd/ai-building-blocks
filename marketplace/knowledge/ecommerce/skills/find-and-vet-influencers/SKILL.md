---
name: find-and-vet-influencers
description: "A ranked shortlist of 10 to 30 influencers who fit the store's buyer, each checked for real audience (location, age, gender from their own insights), past brand results, fake followers and disclosure habits, with a fair fee worked out from their recent views and the store's profit per order. Use before any creator outreach, gifting round or paid collab, when the store has a list of names and wants to know who is worth paying, or when past creator posts got views but no sales."
---

# Find and vet influencers

**You get:** a shortlist sheet of 10 to 30 creators (name, handle, platform, tier, fit score, audience check, fake-follower flags, past brand results, disclosure check, suggested deal and maximum fee), with a one-screen summary naming the top 5 to contact first and why.

## When to use

- The store wants to start creator marketing and has no list.
- The team has a list of names from DMs, agencies or a tool and needs to know who is real and worth paying.
- Past creator posts got views but few sales, and the next round must pick better.
- A creator quoted a fee and the owner wants to know if it is fair.

## Not for

- Writing the first messages and offers: hand the shortlist to `write-influencer-outreach`.
- Recruiting creators inside TikTok Shop's affiliate center: use `tiktok-shop-creator-affiliate-outreach`.
- Running a creator's post as a paid ad: use `run-creator-partnership-ads` or `tiktok-spark-ads-with-creators`.
- Instagram collab posts between brand accounts: use `grow-instagram-with-collabs`.

## What you need

Required:

1. **Buyer profile:** who buys (age, gender, city tier or state, language, budget) from the Shopify customer export or `store-knowledge-folder`. If missing, pull the last 90 days of orders by shipping state and ask the owner the age and gender split.
2. **Gross profit per order** for the hero product, from `build-sku-profit-sheet`.
3. **Market:** the countries the store sells in, and the platforms that matter there (Instagram, YouTube, and TikTok where it is available).
4. **Budget** for the round: cash for fees plus units for gifting.

Optional: names the team already likes, competitor brands whose creators to study, past creator results (codes, links, survey answers).

Access: read only (level 1). The agent browses public profiles. Creator insight screenshots come from the creators, asked for only after the client approves contact.

## Before you start: the gates

1. **Profit per order known.** Pass when gross profit per order after product, shipping, fees and returns is on the sheet. Fail: stop and run `build-sku-profit-sheet`. A fee cannot be judged without it [MEA-0037].
2. **Product ready to demo.** In stock for at least 60 days of expected orders and shows its benefit on camera. Fail: fix stock first; creators cannot sell what is out of stock.
3. **Claims list exists.** What creators may and may not say (health, results, comparisons). Fail: run `check-ad-copy-for-policy-and-claims` first.
4. **Category rules.** For health, nutrition or finance products, check your market's rules on who may give advice; some markets require creators who give advice to hold and state relevant qualifications [ORG-6420]. Fail on a creator who lacks what your market requires: they may show the product but not advise.

## Steps

### 1. Write the fit card

One paragraph: who the buyer is, where they spend time, the language they watch in, and 3 to 5 content types where the product shows naturally (morning routine, gym bag, kitchen hack). Scouts should look like the buyer or know their feeds; search from varied locations or fresh accounts so everyone's feed does not surface the same people [ORG-0040].

### 2. Build the long list (40 to 80 names)

Free routes first:

- Platform search and hashtags for the problem the product solves, not the brand name.
- Who competitors' buyers follow: open tagged posts and comments on rival brands.
- The store's own customers and followers who post (the best match for fit).
- Creators outside the niche whose audience matches the buyer. A non-endemic creator has fewer competing sponsors and often costs less [ORG-0032].

Paid discovery tools are optional; they speed up the long list but never replace the checks below.

Tag each by tier (practitioner default): nano under 10,000 followers, micro 10,000 to 100,000, mid 100,000 to 500,000, macro above. New brands get more sales per dollar, pound or euro from many micro and nano creators than from one big name [ORG-0036].

### 3. Fit score (cut to 25 to 40)

Score 1 to 5 on each, from the last 12 posts:

| Factor | Weight | What to look at |
|---|---|---|
| Audience match | 30% | Comments: do buyers like ours talk here? Language and location |
| Content skill | 20% | Clear hook, product shown in use, good sound |
| Selling proof | 20% | Past sponsored posts that drew questions like "where to buy" |
| Brand safety | 15% | No content that clashes with the brand or category rules |
| Reliability | 15% | Posts on a steady schedule, replies to comments |

Weights are a practitioner default; change them with the owner if the job is pure reach. Drop anyone below 3.0.

### 4. Check the audience is real

Do these checks on every name still in. Mark each pass, flag or fail:

1. **Views versus followers.** Take the median views of the last 10 videos, not the best one. A 300,000-follower account averaging 4,000 views has an audience that no longer watches.
2. **Engagement shape.** High-view videos with very low engagement (under about 2% likes and comments to views) are often paid boosts; leave them out of the median [ORG-0010].
3. **Follower growth.** Sudden jumps with no viral post behind them (visible in free public trackers or the creator's own insights) suggest bought followers. Flag.
4. **Comment quality.** Generic emoji comments from the same accounts, or comments in a language the creator never uses, are a flag.
5. **Audience insights.** After the client approves contact, ask each finalist for screenshots of their audience insights (top countries or cities, age, gender) dated within 30 days. No screenshot, no paid deal.
6. **Disclosure habit.** Look at past sponsored posts. In the US, the relationship should be stated in the post in plain words, not only a platform tool or a vague "collab" [ORG-6405]. In the UK, the ASA and CMA expect a clear label such as "Ad" at the start. In the EU and elsewhere, use the label your market's ad rules require and keep it on screen long enough. A creator who hides past deals will expose the store too.

Two flags: ask the creator about them. Three or more, or a failed insight check: drop.

### 5. Check past brand results

Ask finalists (after approval) for proof from past campaigns: code redemptions, affiliate dashboard screenshots, or a brand they worked with. Rank by sales per 1,000 views, not view counts; on TikTok Shop that figure varied more than 100 times across top videos [MCR-0046]. Never invent or estimate a creator's past sales; leave the cell blank and say "not shared".

### 6. Work out the fair fee

1. **View-based fee:** median views of last 10 videos x target cost per 1,000 views / 1,000. One brand sets its target at about half its Meta CPM, then cuts it by the share of the audience it cannot sell to: 30% outside your market means pay 30% less [ORG-0041].
2. **Profit cap:** maximum fee = expected orders x gross profit per order. Expected orders = median views / 1,000 x a sales-per-1,000-views rate from your own past creators; with no history, use a cautious planning figure and say it is one.
3. Suggest the lower of the two. If the creator's quote is above the cap, propose gift plus commission or a floor-or-commission deal instead.

### 7. Market notes

- **All markets:** search creators who speak the languages your buyers use; they are often cheaper and closer to those buyers. Check that their audience lives where you ship, with low failed-delivery and return rates. Ask the accountant whether products creators keep count as taxable income or need reporting by the store.
- **US:** creators outside the US who reach US buyers still fall under US disclosure rules [ORG-6405]. TikTok creators can also be recruited through TikTok Shop; hand off to `tiktok-shop-creator-affiliate-outreach`.

## Checks before you hand it over

- Every creator has a fit score, a median-views figure and a pass, flag or fail on each audience check.
- No paid deal is suggested without an insights screenshot or a clear "ask for it" note.
- Every fee has both the view-based figure and the profit cap shown.
- Past results are only what creators shared; blanks say "not shared".
- Health, nutrition and finance creators are marked for qualifications where they would give advice.
- Disclosure habit is checked on past sponsored posts.
- Nobody was contacted without the client's yes.

## Output

**One-screen summary:** top 5 creators to contact first, why each fits, total suggested spend versus budget, and the 3 names dropped for fake-audience flags.

**Shortlist sheet** (Google Sheet or CSV), one row per creator:

| Column | Example of what goes in |
|---|---|
| Name, handle, platform, link | |
| Tier | nano, micro, mid, macro |
| Language, main audience location | from comments, then insights |
| Fit score (weighted) | 3.0 to 5.0 |
| Median views, last 10 | |
| Engagement on median posts | % |
| Fake-follower flags | list, or "none" |
| Insights screenshot | received, date / asked / not asked |
| Past brand results | sales per 1,000 views, or "not shared" |
| Disclosure on past deals | pass / flag |
| Category check | qualified to advise / show only |
| Suggested deal | gift only, gift + commission, flat fee, floor or commission |
| View-based fee, profit cap, suggested fee | |
| Next step, owner | |

## Common mistakes

- **Picking by follower count.** Step 4 uses median views and the audience share you can sell to.
- **Trusting one viral video.** The median of 10 removes outliers and boosted posts.
- **Fees with no profit cap.** Step 6 caps every fee at expected gross profit.
- **Skipping disclosure history.** A creator with hidden past deals puts the brand at risk; step 4 checks it.
- **Health creators giving advice without qualifications.** Gate 4 and the category column catch it.
- **Guessing past sales.** Step 5 only records what creators show.

## Sources

- MEA-0037: gross margin is the delivered cost, all fees in.
- ORG-0040: scouts who match the buyer and vary their feeds.
- ORG-0032: non-endemic creators are cheaper sponsors.
- ORG-0036: micro creators over big names for a new brand.
- ORG-0010: low engagement on high views suggests paid boosts.
- MCR-0046: rank on sales per 1,000 views, not views.
- ORG-0041: price fees from recent views and cut for off-market audience.
- ORG-6405: FTC disclosure rules for influencers.

What makes this skill ours: every fee is capped by the store's own gross profit per order, not a rate card; the audience check uses median views and dated insight screenshots instead of follower counts; past disclosure habits are a pass or fail; and buyers are matched by language and by regions the store can deliver to with low failed-delivery and return rates.

## Selling in India

- One of ASCI's labels must be used and kept on screen long enough [ORG-6406].
- Creators who give health, nutrition or finance advice must hold and state relevant qualifications [ORG-6420].
- Search regional-language creators for tier 2 and 3 buyers; they are often cheaper and closer to COD buyers. Check that their audience's states are ones you ship to without high RTO rates.
- Product gifts that creators keep may need TDS under Section 194R [FIN-6423].

Sources: ORG-6406 (ASCI labels and on-screen durations); ORG-6420 (ASCI health and finance influencer qualifications); FIN-6423 (India TDS on products creators keep).
