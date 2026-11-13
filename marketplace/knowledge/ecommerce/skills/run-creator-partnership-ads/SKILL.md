---
name: run-creator-partnership-ads
description: "Meta partnership ads that run through a creator's Instagram or Facebook handle, set up properly: the usage agreement first, then the right platform permission (account-level permission or a per-post ad code), a permission sheet that tracks status and end dates, ads built with the creator's identity and disclosure, and a fair test of each creative through the creator's handle against the store's own handle, judged on store purchases at the target cost. Covers creator fees priced off Meta CPM, flat fees instead of a share of spend, and ending usage on time. Use when a store has creator content and wants to run it as ads, or when partnership ads are live but nobody knows if they beat brand-handle ads."
---

# Creator partnership ads on Meta

**You get:** a signed-off usage terms sheet per creator, a permission sheet (creator, permission type, status, ad codes, end date), the partnership ads built paused, and a handle test plan with its read rule and dates, ready for the client's yes.

## When to use

- The store has creator videos or photos and wants to run them from the creator's handle.
- A creator posted about the product and the store wants to put money behind that post.
- Partnership ads already run and the owner asks whether they beat the same ad on the brand handle.
- The founder has a personal profile with relevant content and wants to run founder ads through it.

## Not for

- Finding and vetting creators: use `find-and-vet-influencers`, then `write-influencer-outreach`.
- Writing the creator's script: use `creator-video-script`.
- Tracking sales and profit per creator over time: use `track-creator-sales`.
- TikTok's version of the same job: use `tiktok-spark-ads-with-creators`.

## What you need

Required:

1. **Creator list** with handle, follower count, average views of last 10 videos, and the content to run (post links or files).
2. **Signed usage terms** per creator, or the client's go-ahead to draft them (step 2).
3. **The store's Instagram professional account and Facebook Page** connected to the ad account.
4. **Target cost per purchase** from `store-meta-math`.
5. **Ads Manager export**, last 30 days, for the store's CPM and current cost per purchase.

Optional: past partnership ad results, the store's naming rule, creator audience demographics screenshots.

If 2 is missing, stop before any permission request: running ads from a person's handle without written terms is the main risk in this job. Sending permission requests and building ads need draft access (level 2). Paying creators and switching ads on need the client's yes.

## Before you start: the gates

1. **Profit known.** Pass with target cost per purchase from gross profit. Fail: no test; you cannot call a winner.
2. **Rights in writing.** Pass when each creator's terms cover paid use on Meta, the term, edits allowed, and whether their audience may be targeted. Fail: draft terms (step 2), get both signatures, then continue.
3. **Disclosure.** Pass when every ad will carry the platform's paid partnership label and the creator's own words are real. Fail: no AI-made person or invented review may be presented as a real creator; disclose AI-made content under Meta's rules.
4. **Relevant profile.** Pass when the creator's (or founder's) profile has content close to the product. Handle ads help only when the profile is relevant [ADC-0003].

## Steps

### 1. Price the creator

- Pay a flat fee for ad usage, not a share of ad spend; one large brand pays flat fees and recruits by gifting product [ORG-0033].
- Price from Meta's numbers: aim for the creator's cost per thousand views at about half the store's Meta CPM, set the flat fee from their last 10 videos' average views, and cut it by the share of their audience outside the target market [ORG-0041].
- Worked example (illustrative): store CPM 300 rupees, target 150 per thousand views; creator averages 40,000 views, so about 6,000 rupees, less 25% off-target audience, about 4,500.

### 2. Write the usage terms

One page per creator, signed by both sides before any request:

| Term | Write down |
|---|---|
| Content | Which posts or files |
| Use | Paid ads on Facebook and Instagram from the creator's handle and the brand's |
| Term | Start and end date; usage stops on the end date |
| Edits | Cuts, captions, new hooks allowed or not |
| Audience | Whether the creator's followers may be included or excluded in targeting |
| Fee | Amount, when paid, any renewal price |
| Disclosure | Paid partnership label on; creator keeps their own words |
| Exclusivity | Competitor limits, if any, and their term |

### 3. Choose the permission type

| Type | How | Use when |
|---|---|---|
| Account-level permission | The store sends a request; the creator accepts in the Instagram app. The store can then run ads from the creator's handle without an existing post, use posts that tag the brand, and include or exclude the creator's audience [ADC-6081] | Ongoing partners, several pieces of content, new media made for ads |
| Ad code per post | The creator makes a partnership ad code for a post they own and sends it; the store enters it in Ads Manager. The creator can remove the code later (Meta documentation) | One post, one-off deals, creators who prefer post-by-post control |

Account-level permission has no stated expiry in Meta's documentation [ADC-6081], so the end date in the terms is the control. Revoke the permission on that date.

### 4. Keep the permission sheet

Columns: Creator, Handle, Terms signed (date), Permission type, Status (pending, approved, revoked), Ad code(s), Posts allowed, Usage end date, Fee paid (date), Revoke done (date). Check it before every build and every month.

### 5. Build the ads

- Identity: creator's handle with the store as partner; the paid partnership label on.
- Use the existing post where possible, so its comments and reactions show; new media only under account-level permission.
- Statics work too: a native list-style post through a creator handle has scaled without any explicit call to action [MCR-0021].
- URL parameters: put the creator's name in utm_content so `track-creator-sales` can read store orders.
- Each creator video is a separate concept only if it differs on persona, angle or format; otherwise it is a variation.
- Build paused; run each ad through `ad-launch-prepublish-check`.

### 6. Test the creator handle against the store handle

The question: does the same creative do better through the creator's handle than through the store's?

- **Cells:** for each of the top 2 to 4 creatives, one ad from the creator's handle (partnership) and one from the store's handle, same media, same text, same landing page.
- **Method:** Meta's A/B test through `store-meta-test` if the budget allows; otherwise two ad sets with equal daily budgets and the same audience and exclusions.
- **Read rule:** after each cell spends 3 times the target cost per purchase, compare purchases; 3 or more versus 0 to 1 is a call, anything closer means wait [ADC-0039]. Confirm on store orders by utm_content.
- **What to expect:** practitioners report the founder's handle beating the brand page by about 5 to 30% when the profile is relevant [ADC-0003], and partnership ads taking up to 40% of spend in some accounts because delivery can use both audiences [ADC-0011]. These are reports to test, not promises.

### 7. Decide and renew

- Creator handle wins: shift more creatives to partnership ads, and ask that creator for more content.
- No difference: keep brand-handle ads for simplicity, and use the creator's content as raw material; winning creator angles can be rebuilt as statics [MCR-0035].
- Rebook or not, per creator, from `track-creator-sales`.
- On each usage end date: pause the ads, revoke permission, log it.

### 8. India and US notes

- **India:** ASCI's influencer guidelines require a clear disclosure label on paid content; keep the platform label on every ad, and use Hindi or regional disclosures where the content is in that language. Many Indian creators work through managers; get the creator's own written consent, not only the manager's.
- **US:** the FTC's endorsement guides require clear disclosure of paid relationships and real opinions; never edit a creator's words into a claim they did not make.

## Checks before you hand it over

- Signed terms exist for every creator before any request was sent.
- The permission sheet shows status, type, codes and end date for each creator.
- Every ad carries the paid partnership label.
- The creator's fee is worked out from views and the store's CPM, not guessed.
- The handle test has matched cells, a read rule and dates.
- utm_content carries the creator name on every ad.
- Revoke dates are in the calendar.
- No ad goes live and no fee is paid without the client's yes.

## Output

**Summary (one screen):** creators, content pieces, permission status, fees, test cells and budget, read date, the yes needed.

**Usage terms:** one filled page per creator (table in step 2).

**Permission sheet:** columns in step 4.

**Handle test plan:** Creative, Cell (creator or store handle), Ad set, Daily budget, Spend to read (3 x target), Read date, Purchases, Store orders by utm_content, Call.

## Common mistakes

- **Permission before paperwork.** Gate 2 puts signed terms first.
- **Paying a share of spend.** Step 1 sets a flat fee from views and CPM [ORG-0041].
- **Permission that never ends.** Step 3 uses the end date in the terms and revokes on it [ADC-6081].
- **Calling the test early.** Step 6 waits for 3 x target spend per cell [ADC-0039].
- **New media from a creator with an unrelated profile.** Gate 4 checks relevance [ADC-0003].
- **No creator name in the URL.** Step 5 tags it, so sales per creator can be read.

## Sources

- ADC-0003: founder handle ads beat the brand page only with relevant content.
- ADC-0011: partnership ads can take a large share of spend.
- ADC-0039: spend-based read rule.
- ADC-6081: account-level partnership permission and revoking (proposed card).
- MCR-0021: partnership statics through a creator handle.
- MCR-0035: rebuild winning creator angles as statics.
- ORG-0033: flat fees for partner ads, not a share of spend.
- ORG-0041: price creator deals off Meta CPM and views.

What makes this skill ours: signed usage terms come before any platform permission; creator fees are priced from their views against the store's own Meta CPM; every permission has an end date and a revoke step; and the creator handle must beat the store's handle on store orders in a matched test before more money moves.
