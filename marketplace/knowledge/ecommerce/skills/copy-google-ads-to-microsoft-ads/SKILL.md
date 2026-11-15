---
name: copy-google-ads-to-microsoft-ads
description: "Copies a store's working Google Ads campaigns into Microsoft Advertising with the free Google import, without carrying over the losers: picks only campaigns that earn gross profit on Google, sets up Microsoft's own tag, conversion goal and Merchant Center first, lists every setting to check or change after import (budgets, bids, locations, networks, audiences, brand split), stops scheduled imports from overwriting Microsoft-only edits, and runs a capped six-week test judged on store gross profit. Built paused for the client's yes. Use when Google Search or Shopping is profitable and the store wants more of the same buyers at a possibly lower cost, mainly in the US and other desktop-heavy markets."
---

# Copy Google Ads to Microsoft Ads

**You get:** an import plan naming which Google campaigns go across and why, a pre-import set-up checklist (tag, conversion goal, Merchant Center, brand split), a post-import settings sheet with the value to set for every setting, a capped six-week test budget with a stop rule, and the import schedule choice, all paused for the client's yes.

## When to use

- Google Search or Shopping campaigns are profitable and steady for 60 days or more.
- The store sells in the US, UK, Canada or Australia, or to desktop-heavy or older buyers.
- Google is near its profitable ceiling and the store wants more of the same intent elsewhere.
- A Microsoft account exists but runs an old copy that nobody maintains.

## Not for

- Fixing the Google account first: use `google-ads-account-audit`; never copy a broken account.
- Building new Search campaigns: use `build-google-search-campaign` on Google, then copy.
- Deciding the full channel budget: use `cross-channel-budget-reallocation`.
- Tracking checks on Google: use `check-google-ads-conversion-tracking`.

## What you need

Required:

1. **Google Ads campaign report, last 90 days**: Campaign, Type, Cost, Conversions, Conv. value, Impression share, by campaign.
2. **Gross profit per purchase** and break-even ROAS from `store-meta-math`.
3. **Google conversion set-up** checked as "trust" by `check-google-ads-conversion-tracking`.
4. **Microsoft Advertising account** owned by the client, with billing set by the client.
5. **Merchant Center feed** in good health, for Shopping.
6. **Search share in the market**: a public source such as StatCounter for desktop and mobile search engine share in the store's countries.

Optional: Shopify Microsoft channel app, Google Ads Editor export, past Microsoft data.

Access: the client signs in and links the Google account to Microsoft's import; never ask for passwords. Draft access to build paused. The client approves budgets, import and launch.

## Before you start: the gates

1. **Profit on Google.** Only campaigns earning above break-even ROAS on Google in the last 90 days go across [GAD-0023]. Fail: no campaign qualifies, so stop and fix Google.
2. **Tracking.** Google tracking passed, and Microsoft's own tag and purchase goal can be installed before import. Fail: do not import yet.
3. **Market.** Microsoft's search share in the store's countries is high enough that a test can reach 30 purchases in six weeks at the store's conversion rate (practitioner default, test it). Microsoft's share is highest in the US, UK, Canada and Australia, and on desktop; in markets where it is small, check the current figure and expect a slow test, or skip it. US and UK: usually worth a test.
4. **Cash.** The client can carry the capped test in step 6.

## Steps

### 1. Pick what goes across

| Google campaign | Copy? | Why |
|---|---|---|
| Brand Search | Yes | Cheap, protects the name on Bing and its partners |
| Non-brand Search, above break-even | Yes | Same intent, often less competition |
| Standard Shopping, above break-even | Yes, after Microsoft Merchant Center is set | Product feed carries most store sales on Google [GAD-0054] |
| Performance Max | Only after the above prove out | Assets may not import; Microsoft runs its own version |
| Below break-even campaigns | No | Copying a loser copies the loss |
| Display, Demand Gen, YouTube | No | Different networks; plan separately |

### 2. Set up Microsoft before importing

- Install Microsoft's UET tag through the store's Microsoft channel app, Tag Manager or Shopify Customer events, and create one purchase conversion goal with real order values and transaction ID. Microsoft counts conversions through its own tag and goals, set up inside Microsoft Advertising [GAD-6127]. One primary purchase goal, as on Google [MEA-0017].
- Send real order revenue, not a fixed value [MEA-0016].
- Set up Microsoft Merchant Center: import the Google Merchant Center feed or connect the store; one feed per currency, as on Google [GAD-0049].
- Keep the brand split: brand terms as exact negatives in non-brand campaigns [GAD-0028].

### 3. Run the import once, then review everything

Use Microsoft's Google import for the chosen campaigns only, as a single run first. Microsoft says not everything imports, so every campaign must be reviewed after import and missing items added back [GAD-6127]. Leave imported campaigns paused.

### 4. Check and change these settings after import

| Setting | What to check | Set to |
|---|---|---|
| Budgets | Imported at Google's level, or scaled by a percentage | The test budget in step 6, not Google's budget |
| Bids and bid strategy | Smart strategies need conversions Microsoft does not have yet | Manual CPC or enhanced CPC capped at Google's average CPC for the same keyword group, until 30 purchases; move to target ROAS then, at or just below actual [GAD-0021] |
| Location targeting | Some locations may not match; check the location option | People in the location only |
| Ad distribution | Bing, AOL and Yahoo owned sites versus syndicated search partners | Owned sites only at launch; add partners after reading their search terms (practitioner default, test it) |
| Audience network | Whether the campaign can also show beyond search, where the interface offers it | Off at launch |
| Ad schedule and devices | Copied from Google | Keep; review device results at week 3 |
| Audiences | Some Google audience types may not carry over | Rebuild remarketing lists on Microsoft's tag |
| Ads and assets | Text, sitelinks, callouts | Check every final URL works and offers are live |
| Negatives | Shared lists | Confirm all shared negative lists arrived |
| Tracking template | Google click IDs and UTMs | UTMs say source microsoft, medium cpc, per `set-up-utm-tracking-for-all-channels` |

### 5. Decide on scheduled imports

Microsoft can import now, once, daily, weekly, monthly or on an automatic schedule, with options to scale budgets, skip budget updates on existing campaigns and delete items removed in Google; newly supported item types are added to scheduled imports by default [GAD-6127].

Recommendation: after the first import, use a weekly schedule only for keywords, ads and negatives, with budget updates off, so Microsoft-only budgets and bids are not overwritten. If the Microsoft account will be managed on its own, switch scheduled imports off and copy changes by hand.

### 6. Set the capped test

- Test budget = Google's cost per purchase for the same campaigns x 30 purchases, spread over six weeks, capped at what the client approves.
- Stop rule: pause any campaign that spends 2 times the break-even cost per purchase with no purchase (practitioner default, test it).
- Read on store data: orders with source microsoft in UTMs or the Microsoft click ID, gross profit after ad cost, and new versus returning customers. Read recent days on conversion date, as late conversions fill in later [GAD-0035].
- Week 6 decision: keep and raise in steps of 20% or less if gross profit after ad cost is positive [GAD-0042]; keep at test level if within 10% of break-even; stop otherwise.

## Checks before you hand it over

- Only campaigns above break-even on Google are in the import list.
- Microsoft tag and purchase goal are live, with real values, before any campaign is enabled.
- Every row of the settings sheet has a value set, not "same as Google".
- Brand and non-brand are split, with brand negatives in place.
- Scheduled import settings cannot overwrite Microsoft-only budgets.
- The test budget, stop rule and decision date are written.
- Everything is paused until the client approves.

## Output

1. **One-screen summary:** campaigns to copy, the test budget and cap, what must be set up first, and the week 6 decision date.
2. **Import plan:** Google campaign, Type, 90-day ROAS, Break-even ROAS, Copy (yes or no), Reason.
3. **Pre-import checklist:** Item, Done (yes or no), Evidence.
4. **Settings sheet:** the step 4 table with a Client yes column.
5. **Test tracker:** Week, Campaign, Spend, Store orders, Gross profit, Gross profit after ad cost, Stop rule hit (yes or no).

## Common mistakes

- **Importing the whole account.** Step 1 copies only profitable campaigns.
- **Launching before Microsoft's tag works.** Step 2 sets it up first.
- **Google budgets copied straight across.** Step 4 sets a capped test budget.
- **Smart bidding with no Microsoft data.** Step 4 starts manual until 30 purchases.
- **Weekly import wiping Microsoft edits.** Step 5 turns budget updates off.
- **Judging on Microsoft's own reports alone.** Step 6 reads store orders.

## Sources

- GAD-0021: when to move from manual bids to target ROAS.
- GAD-0023: break-even ROAS from margin; budget step rule.
- GAD-0028: brand negatives in every non-brand campaign.
- GAD-0035: late conversions fill in recent days.
- GAD-0042: budget changes in about 20% steps.
- GAD-0049: one feed per currency.
- GAD-0054: Shopping carries most store sales on Google.
- GAD-6127: Microsoft import schedules, options and review.
- MEA-0016, MEA-0017: real values, one primary purchase goal.

What makes this skill ours: only campaigns that earn gross profit on Google are copied; Microsoft's own tag and goal go live before anything spends; every imported setting gets an explicit value instead of "same as Google"; scheduled imports are set so they never overwrite Microsoft-only budgets; and the test is capped and judged on store gross profit.
