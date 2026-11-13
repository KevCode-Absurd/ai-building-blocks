---
name: ad-lookalike-clusters
description: "Check whether a store's live Meta ads are really different from each other. Fingerprints every ad on concept (product, buyer, angle, offer), format, hook type, visual style, ratio, first frame, person and setting; groups near-identical ads into clusters; scores the mix by spend, not ad count, with a share cap per dimension; flags low-confidence runs; and puts a monthly money figure on each weakness (spend in one cluster, spend in tired clusters). Says what to change first when ads cluster (concept before look), which look-alikes to ask to pause, and ends with a production queue of 5 to 10 briefs ranked by gross profit protected per production hour. Tracks the score week to week. Use before a production round or when new ads get no spend. Read access only."
---

# Look-alike ad check for an online store

**You get:** a diversity score for the live Meta ads, a cluster table of near-identical ads weighted by spend, a fingerprint sheet, a risk table and a ranked production queue of briefs for the next creative round.

## When to use

- The account launches many ads but only a few ever get spend.
- Cold frequency climbs while store cost per purchase rises.
- The team made 30 "new" ads last month and results did not move.
- Before a production round, to aim the next batch at real gaps.
- After moving to broad or Advantage+ targeting, where creative does the targeting.

## Not for

- Verdicts on every ad (scale, keep, fix, cut): use `store-meta-creative-review`.
- A daily alert when spend piles into one ad: use `ad-early-warning-watch`.
- Every lane ever tested: use `creative-gap-map`.
- Accounts with fewer than about 8 live ads: the constraint is spend or offer, not sameness [MCR-0078]; use `store-meta-plan`.

## What you need

Required:

1. **Ads Manager export, ad level, last 30 days, active ads:** Ad ID, Ad name, Ad set, Campaign, Amount spent, Impressions, Reach, Frequency, 3-second video plays, Link clicks, Purchases (7-day click), primary text, headline.
2. **The creative:** thumbnail or first frame of every ad and the first 3 seconds of every video (Ads Manager previews are enough).
3. **Money line:** gross profit per purchase (GPP) and target cost per purchase (CPP) per product, from `store-meta-math`.
4. **Monthly Meta spend** and the team's **production capacity** (ads per week).

Optional: store orders by ad ID; last week's `lookalike-trend.csv`; any similarity or creative-diversity notice Ads Manager shows.

Missing 2: fingerprint from text and names only and mark visual fields "not checked". No API token is needed; exports and previews are enough.

**Access:** level 1 (read). Pauses and merges need level 3 and a yes.

## Before you start: the gates

1. **Money.** *Pass:* GPP and target CPP known. *Fail:* report spend at risk only.
2. **Enough ads.** *Pass:* 8 or more ads with spend in 30 days. *Fail:* stop.
3. **Tracking.** *Pass:* Meta 7-day click purchases are not above store orders. *Fail:* no winner or loser calls inside clusters.
4. **Capacity.** *Pass:* weekly production capacity stated. *Fail:* size the queue to 5.

Confidence drops (say so on page one) when ad names are codes with no meaning and previews are missing, when data covers under 7 days, or when one campaign holds over 90% of spend (the result then describes that campaign only).

## Steps

### 1. Fingerprint every ad

| Field | Values |
|---|---|
| Concept key | Product + buyer + angle + offer [MCR-0078] |
| Format | Static, video, carousel, catalog, partnership |
| Hook type | Problem, review, creator story, founder, comparison, demonstration, explainer, lifestyle, offer, question |
| Visual style | Polished studio, raw phone, lifestyle with people, product on plain background, text-led graphic, illustration |
| Ratio | 1:1, 4:5, 9:16 |
| First frame | Text on colour, close-up, person talking, in use, split screen, table |
| Person, setting | Founder, customer, creator, model, none; kitchen, gym, studio, outdoors |
| Text density | Low, medium, high |

### 2. Cluster the look-alikes

Two ads share a cluster when they share concept key and format and differ only in colour, background, pose, small wording or music [MCR-0022]. A different person or setting on the same script is a variation inside the cluster, useful against fatigue [MCR-0012], not a new concept. Plain test: if a viewer scrolling past could not tell the two apart, treat them as one. Record any Ads Manager similarity notice beside the cluster. Meta does not publish how it groups ads or what similarity costs; treat your clusters as the working estimate (practitioner default, test it).

### 3. Score the mix by spend

For each dimension, effective count = 1 / sum of (spend share squared). Ten equal clusters give 10; one cluster at 90% gives about 1.2.

| Dimension | Target |
|---|---|
| Concept clusters | By spend band: under $100k a month, 1 to 3 winners with 2 to 6 in test; $100k to $500k, 2 winners; above $500k, 3 or more [MCR-0058] |
| Formats, hook types, visual styles | 3 or more each, no single value above about 40% of spend (practitioner default, test it) |
| Ratio | Both 9:16 and a feed size live, or Meta crops one into the other |

Large accounts with capacity can run 10 to 15 distinct formats [MCR-0036]; small accounts should not spread that thin. Also flag any single format + hook type + visual style combination holding over a third of spend (practitioner default, test it).

Diversity score (0 to 100) = average of (effective count / target, capped at 1) x 100. Show the parts. Append the score and parts to `lookalike-trend.csv`; three weekly declines in a row is a flag for the creative lead.

### 4. Put money on each weakness

| Risk | Rule | Spend at risk per month |
|---|---|---|
| One concept dominates | Above about 80%: feed it more variations or cap near 40% [ADC-0061] | Spend above 40% in it |
| Few ads hold the account | About 4% of ads often hold most spend [ADC-0014] | Spend in the top 3 ads |
| Cold fatigue | Cluster frequency above 2 over 30 days on cold campaigns [MCR-0040] | Spend in those clusters |
| Too few live ads | Relaunching old winners cut CAC 20 to 30% in one high-spend account [ADC-0013] | Note only |

Gross profit at risk = spend at risk / target CPP x GPP: what those dollars earn today at target, and what the store loses if the cluster fades with no successor.

### 5. Decide what to do with each cluster

- One ad clearly beats the rest on store CPP: keep it; ask to pause the others, only in ad sets missing target.
- All similar: keep the one with the most spend history; ask to pause the rest under the same rule.
- Never pause cheap-looking ads inside an ad set hitting target; Meta shows ads in sequence [ADC-0009].
- To break a cluster, change in this order until a viewer would see a different ad: concept (buyer, angle or offer) first, then format, then hook type, then visual style. Change at least two. A new look on the same concept adds reach at best; a new concept adds a new audience.

### 6. Build the production queue

5 to 10 briefs filling the gaps from steps 3 and 4, each changing the concept, not just the look [MCR-0022], launched with about 3 opening variations in its own ad set [MCR-0079]. For each: gap filled, product, GPP, buyer, angle, offer, format, hook type, visual style, ratio, production hours and cost estimate. Rank by gross profit protected per production hour; ship fast statics first while slower video is made. Queue length fits weekly capacity.

## Checks before you hand it over

1. Every active ad with spend has a full fingerprint or "not checked" marks.
2. Effective counts are computed from spend shares and the parts add up.
3. Confidence flags are stated on page one.
4. Spend and gross profit at risk are shown per month.
5. No claim about Meta's internal grouping is stated as fact.
6. Every brief changes the concept; the queue fits capacity.
7. Pauses are a numbered approval list, never inside an ad set hitting target.

## Output

1. **One-screen summary:** diversity score and parts, real clusters versus ads, the dominant cluster and its share, gross profit at risk per month, trend versus last week, the first three briefs.
2. **Cluster table:** Cluster, Concept key, Format, Hook type, Visual style, Ads, Spend share, Frequency, Store CPP, Action.
3. **Fingerprint sheet** `ad-fingerprints.csv`.
4. **Risk table** per step 4.
5. **Production queue:** Rank, Brief, Gap, Product, GPP, Buyer, Angle, Offer, Format, Hook type, Style, Ratio, Hours, Profit protected per hour.
6. **Approval list** and updated `lookalike-trend.csv`.

## Common mistakes

- **Counting ads instead of spend.** Step 3 weights by spend.
- **Diversifying only the look.** Steps 5 and 6 change the concept first.
- **Treating similarity thresholds as Meta fact.** Step 2 labels them estimates.
- **A diversity score with no money.** Step 4 prices each weakness.
- **Spreading a small budget over 15 formats.** Step 3 sets targets by spend band.
- **Pausing look-alikes inside a winning ad set.** Step 5 forbids it.

## Sources

- ADC-0009: Meta sequences ads within an ad set.
- ADC-0013: too few live ads can cap an account.
- ADC-0014: about 4% of ads hold most spend.
- ADC-0061: cap a dominant concept near 40%.
- MCR-0012: reshoot a script in a new setting.
- MCR-0022: colour or pose is not a new ad.
- MCR-0036: 10 to 15 distinct formats for large accounts.
- MCR-0040: cold frequency above 2.
- MCR-0058: concepts needed by spend band.
- MCR-0078: near-duplicates grouped by Meta.
- MCR-0079: about 3 variations per new concept.

What makes this skill ours: the mix is weighted by spend and starts from concept (buyer, angle, offer), not just look; every weakness carries spend and gross profit at risk per month from the store's own target cost per purchase; targets scale with the store's spend band; Meta's internal grouping is never claimed as fact; and the production queue is ranked by profit protected per production hour.
