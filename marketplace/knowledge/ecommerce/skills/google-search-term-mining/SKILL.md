---
name: google-search-term-mining
description: "Sorts a store's Google Ads search terms into six groups (irrelevant, waste, hidden winners, new themes, competitor and brand, watch) using gross profit per conversion, not ROAS alone, and turns them into negative keyword lists ready for Google Ads Editor, exact-match keyword candidates and new ad group ideas. Checks every negative against live keywords and existing negatives, finds queries that trigger more than one ad group, and handles mixed-language and mixed-script queries in any market (Spanish and English in the US, French and English in Canada, and others). Read access only; the client approves every list. Use it weekly, after a spend spike, or when cost per purchase climbs."
---

# Search term mining for an online store

**You get:** search terms sorted into six groups by gross profit, negative keyword lists checked for conflicts, new keyword and ad group ideas, and files ready to load in Google Ads Editor.

Shoppers type what they want; your keywords only guess at it. This skill reads what people actually typed, judges each term on the money it made after product costs, and hands back lists the client can paste into Google Ads Editor.

## When to use

- Weekly on accounts with new search terms each week; monthly on small ones.
- Cost per purchase in Search, Shopping or Performance Max has climbed for two weeks with no clear cause.
- A new broad match or Performance Max campaign has run for 14 days or more.
- The store sells in a mixed-language market (for example Canada, Belgium, Switzerland, much of Asia, or Spanish-speaking buyers in the US).
- Before raising budget, to stop paying for traffic that never buys.

## Not for

- Deciding which of your own keywords to raise, hold or pause: use `google-keyword-tiers`.
- Low Quality Score on keywords you keep: use `google-quality-score-triage`.
- Whether Performance Max is taking brand sales: use `google-pmax-diagnostics`.
- Meta ads: use `store-meta-ads`.

## What you need

Required, read access (level 1):

1. **Search terms report** (Insights and reports, Search terms), last 30 days; 90 for small accounts. Columns: Search term, Match type, Added/Excluded, Campaign, Ad group, Keyword, Impressions, Clicks, Cost, Conversions, Conv. value, Conversions (by conv. time).
2. **Performance Max search terms** where the account shows them (search terms report filtered to Performance Max, or Insights, Search term insights, which groups queries into themes).
3. **Gross profit per purchase**, from `store-meta-math` or computed here: net order value minus landed product cost, fulfilment, payment fees and expected returns.
4. **Existing negatives**: campaign and ad group negatives plus every shared negative keyword list (Tools, Shared library).
5. **Live keyword list** with match types, and the top converting search terms.

Optional: margin by product category (Shopify product export, "Cost per item"), a list of rival brands, and where pay on delivery is offered, its share of orders and the failed-delivery rate.

Missing input: ask once. Without gross profit per purchase, sort on cost per conversion against the account target, label the output "reduced confidence", and promote no winner.

## Before you start: the gates

1. **Money gate.** Gross profit per purchase known. If category margins differ by more than about 10 points, use category-level profit [GAD-0040]. Fail: compute it with `store-meta-math`, or run only the irrelevant pass (step 3), which needs no money data.
2. **Tracking gate.** One primary purchase conversion action with real order values [MEA-0017] [MEA-0016]. Two primary purchase actions double count; a GA4 import as primary undercounts by roughly 10 to 20% (GAD-0042 says 10 to 15, MEA-0017 about 20). Fail: fix tracking first; meanwhile add only clearly irrelevant negatives.
3. **Stock gate.** Ask which products are short. Do not promote a winner that sells an out-of-stock product.
4. **Recency gate.** Google credits conversions to the click date, so the last 3 to 4 days look weak [GAD-0035]. End the window 4 days ago or use the conversion-time columns.

## Steps

### 1. Clean and join

Remove terms already excluded. Lower-case and trim. Keep one row per term per campaign and ad group, because the same query in two places matters (step 6). Join gross profit per purchase, by category where known.

### 2. Work out the money per term

- Gross profit = conversions x gross profit per purchase (or conv. value x category gross margin when values are reliable and margins vary).
- Profit after ads = gross profit minus cost.
- Break-even cost per conversion = gross profit per purchase.
- Clicks needed to judge = 3 / the campaign's conversion rate (150 clicks at 2%). Practitioner default, test it.

Cost per purchase is cost per click divided by conversion rate [MEA-0019] [GAD-0038], so a dear click is fine when it converts. Never judge a term on click cost alone.

### 3. Sort into six groups

First match wins.

| Group | Rule | Action |
|---|---|---|
| Irrelevant | Wrong product, wrong intent (free, jobs, DIY, repair, "how to make", wholesale when you sell retail), wrong place, or a size or type you do not sell. Any spend. | Negative now |
| Competitor and brand | Contains your brand, a rival brand or a marketplace name | Route (step 5); never auto-negate |
| Waste | Relevant, but cost at least 1.5x break-even with no conversions, or enough clicks to judge and profit after ads below zero | Negative |
| Hidden winner | 3 or more conversions, profit after ads above zero, not yet an exact keyword | Add as exact match (step 7) |
| New theme | Relevant cluster with real clicks that no ad group speaks to (a use, buyer or product line you have no ads for) | Propose a new ad group with its own ads and landing page |
| Watch | Everything else, mostly too few clicks | Keep; review next week |

Problem-led terms ("how to stop dog shedding") are not irrelevant by default; for products people search by the problem, problem queries with copy written to the problem can convert well [GAD-0025]. Judge them on money, and check health-claim rules first.

Rank the waste group by profit lost (cost minus gross profit), not by cost alone, so a dear term on a high-margin product is not cut before a cheap term that never sells.

### 4. Build negatives at the right type and level

- Use the narrowest type that blocks the waste: negative exact for one bad query, negative phrase for a bad modifier ("free", "second hand"), negative broad for single words that are never relevant. All three types exist (Google Ads Help, negative keywords).
- Negatives do not match close variants, plurals or misspellings, so add each common variant yourself.
- Remove any negative that already exists in a campaign, ad group or shared list.
- Test each new negative against every live keyword and the top 50 converting terms. Drop any that would block one, and list the conflict.
- Level: a pattern that wastes money in 3 or more campaigns goes in a shared negative keyword list applied account-wide (practitioner default, test it); one or two campaigns get campaign negatives; a term that belongs elsewhere in the same campaign gets an ad group negative.
- Keep brand terms as exact negatives on non-brand campaigns [GAD-0028].
- Performance Max: use the account-level or campaign-level negative options the account offers; check the current Help, as these controls change.

### 5. Route brand and competitor terms

- Your brand inside non-brand campaigns: exact negative there, and make sure a brand campaign exists and stays small [GAD-0028] [GAD-0024].
- Rival brand names: never in ad text you have no rights to. If a rival term earns profit after ads, move it to a separate competitor campaign with its own budget; otherwise negate it.
- Marketplace names ("amazon", "flipkart"): usually negative for a store selling on its own site, unless it sells there too.

### 6. Fix queries that trigger more than one ad group

When one search term shows in two or more ad groups or campaigns, they bid against each other and split the data. Pick the owner (the ad group whose landing page fits best), then add the term as an exact negative everywhere else.

### 7. Promote winners

Each hidden winner becomes an exact match keyword in the ad group whose landing page fits it, or in a new ad group if none does. When a winning term names a product attribute (material, size, use), pass it to the feed: proven search terms belong at the front of Merchant Center titles [GAD-0044].

### 8. Mixed-language markets

Practitioner default, test it. Queries can arrive in English, in the local language in its own script, in a mix of both written in Latin letters, and in phonetic spellings.

- Group terms that mean the same thing across scripts and spellings; judge the group on money.
- Wrong-intent words to check in every language: "free", "job" or "jobs", "how to make", "wholesale", "used" or "second hand", "repair", "near me" when there is no shop. Do not auto-negate "cheap" or its local forms: if cheap-seeking terms make money, keep them.
- Write each negative in every script and spelling you saw.
- Where pay on delivery is common, judge on profit per placed order: delivered share x profit per delivered order minus failed-delivery share x loss per failed order (`store-meta-math`, step 4). A refused order still counts as a conversion.

### 9. Write the files

Google Ads Editor import format, one row per negative: Campaign, Ad group (blank for campaign level), Keyword, Criterion Type (Negative exact, Negative phrase or Negative broad). Shared-list negatives go in a separate file with the list name.

## Checks before you hand it over

- Gross profit per purchase is stated with its source and date, and used in every waste and winner call.
- No new negative duplicates an existing one, and none blocks a live keyword or a top-50 converting term (the conflict test is shown).
- Every waste term had enough clicks or cost to judge.
- The window ends 4 or more days ago, or uses conversion-time columns.
- Brand terms are routed, not deleted; no rival brand appears in ad text.
- Mixed-language terms are grouped, and each negative covers the spellings seen.
- Spend across the six groups adds up to the report total.
- Nothing is added in the account. The client approves the lists; at level 2 they can be staged, at level 3 applied within agreed limits.

## Output

**One-screen summary first:** spend reviewed, spend in irrelevant and waste groups (amount and share), profit lost, number of negatives and conflicts found, hidden winners with their profit after ads, new themes worth an ad group, and the files to approve.

**Table "Search terms":** Search term, Language or script, Campaign, Ad group, Clicks, Cost, Conversions, Gross profit, Profit after ads, Group, Reason, Action.

**Table "Negatives to add":** Negative, Type, Level, Terms it blocks, Profit it would have saved, Conflict check (pass or fail).

**Table "New keywords and themes":** Keyword or theme, Ad group (existing or new), Landing page, Conversions, Profit after ads, Feed title note.

**Files:** `negatives-editor.csv`, `negatives-shared-list.csv`, `new-exact-keywords.csv`. Google Ads Editor is free; a spreadsheet works as well.

## Common mistakes

- **Cutting on cost per conversion alone.** A high-margin term can be the best one. Step 2 uses gross profit.
- **Negatives that block winners.** Step 4 tests every negative before it ships.
- **Re-adding negatives that already exist.** Step 4 checks every level and list.
- **Two ad groups chasing one query.** Step 6 names one owner.
- **Judging the latest days.** They are always under-counted [GAD-0035].
- **Counting cash-on-delivery orders as sales.** Step 8 uses profit per placed order.

## Sources

- GAD-0024, GAD-0028: keep brand apart with exact brand negatives, and keep brand spend small.
- GAD-0025: problem queries with problem-led copy can convert.
- GAD-0035: recent days under-report conversions.
- GAD-0038, MEA-0019: cost per purchase equals cost per click over conversion rate.
- GAD-0040: use margin tiers when margins differ by more than about 10 points.
- GAD-0042, MEA-0016, MEA-0017: one primary purchase action with real values.
- GAD-0044: proven search terms lead feed titles.

What makes this skill ours: waste and winners are judged on gross profit after ad cost, ranked by profit lost; every negative is checked against live keywords and existing negatives before it ships; queries split across ad groups get one owner; and pay-on-delivery losses and mixed-script queries are handled in every market.

## Selling in India

- Queries arrive in English, Hindi in Devanagari, Hinglish in Latin script ("sasta", "kam daam", "cotton wali kurti") and phonetic spellings. Write each negative in every script and spelling you saw.
- Wrong-intent words to check: "naukri" (job), "kaise banaye" (how to make), "purana" (used), "theek" (repair). Do not auto-negate "sasta" (cheap) if it makes money.
- Where COD is common, judge on profit per placed order: delivered share x profit per delivered order minus RTO share x loss per RTO order (`store-meta-math`, step 4). Bring the COD share and RTO rate as inputs.
