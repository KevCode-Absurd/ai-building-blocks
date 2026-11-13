---
name: creative-naming-and-tagging-system
description: "One naming rule for campaigns, ad sets and ads, plus a tag sheet with fixed code lists, so every ad can be sorted by buyer, angle, format, hook, creator, offer and language when results come in, and joined to store orders through UTMs. Sets short codes in a fixed order, a concept ID that links each ad to its brief, a check formula that flags names breaking the rule, and a monthly results view by tag on store gross profit after ad cost. Use before a new creative batch, when nobody can say which angles or creators win, or when ad names are a mix of dates, initials and 'final v2'."
---

# Ad naming and tagging system

**You get:** one naming rule (written out with examples) for campaigns, ad sets and ads; a tag sheet with a fixed code list for every field; a check formula that flags bad names; UTM settings that carry the ad name to store orders; and a results tab that sorts gross profit after ad cost by any tag.

## When to use

- Ad names are a mix of dates, initials and "final v2", and nobody can sort results.
- The team cannot say which angle, creator or format wins across the account.
- A creative roadmap or monthly batch is starting and needs clean records from day one.
- Several people or agencies launch ads in the same account.

## Not for

- The grid of buyer, stage and theme the store plans against: use `creative-gap-grid` (it uses these codes).
- Setting up UTM tracking across all channels: use `set-up-utm-tracking-for-all-channels`.
- Reading one test's result: use `call-creative-test-winners`.
- Checking whether live ads are near-duplicates: use `ad-lookalike-clusters`.

## What you need

Required:

1. **Ad-level export** for the last 90 days (Meta Ads Manager; TikTok or Google if used): ad ID, ad name, ad set, campaign, spend, purchases, launch date.
2. **Current briefs or a list of live concepts**, to seed the code lists.
3. **Creator and presenter list** with rights expiry dates.
4. **Gross profit per purchase by product** (`store-meta-math`), for the results tab.

Optional: the angle table from `mine-ad-angles-from-reviews`, past naming attempts, the store's UTM rules.

Read access is enough to design the system. Renaming live ads or setting URL parameters needs draft access and the client's yes; renaming is never required, since new ads can follow the rule from now on.

## Before you start: the gates

1. **Enough volume to be worth it.** Tagging pays when the store launches roughly 10 or more new creatives a month; below that, patterns are noise and a simple concept ID is enough [MCR-0051]. Fail: build the light version (concept ID, buyer, angle, format only).
2. **Profit line known** for the results tab. Fail: the system still works, but the results tab shows cost per purchase only and says so.
3. **One owner.** One named person approves new codes. Fail: the lists will drift within weeks.

## Steps

### 1. Pick the fields

Tag every ad on the same fields so a winner can be traced to one part [MCR-0051]: concept ID, buyer, angle, awareness stage, format, hook type, creator or presenter, offer, product, language, ratio, launch date, version. For video add setting and style if the store makes enough video to compare them.

### 2. Write the code lists

For each field, 4 to 12 short codes in capitals with a one-line definition. Examples of shapes, to be replaced with the store's own:

| Field | Code examples | Rule |
|---|---|---|
| Buyer | GIFTR (gift giver), NEWMUM, OFFICE | from the store's real buyer groups |
| Angle | PAIN, PROOF, CMPR, ORIGIN, PERUSE | one tension per code |
| Stage | UNAW, PROB, SOLN, PROD, MOST | five awareness stages |
| Format | UGC, FNDR, STAT, CARO, DEMO, PODC | how it is made |
| Hook | Q (question), STAT (number), DEMO, CALL (call-out), STORY | the opening type |
| Creator | CR01 to CR99 | number from the creator list |
| Offer | NONE, BNDL3, GWP, FSHIP, LAUNCH | live offers only |
| Language | EN, HI, TA, BN | India stores need this |

No "OTHER" code. A new code needs the owner's yes and a definition.

### 3. Write the naming rule

One order, underscores between parts, no spaces, capitals, under about 80 characters:

- **Campaign:** `Market_Objective_Stage` (for example `IN_SALES_PROSP`).
- **Ad set:** `Batch_Buyer_Angle_Offer` (for example `B014_GIFTR_PROOF_BNDL3`). Group ad sets by concept, the buyer plus angle plus offer, not by launch date [ADC-0058]; a batch number in the ad set name lets each batch be read on its own [ADC-0016].
- **Ad:** `ConceptID_Buyer_Angle_Stage_Format_Hook_Creator_Offer_Lang_Ratio_YYMMDD_v#` (for example `C031_GIFTR_PROOF_PROD_UGC_DEMO_CR07_BNDL3_HI_916_261113_v2`).

The concept ID is the same one written on the brief, so the ad, its brief and its result link up. A new concept ID is only for a new buyer, angle or offer; a new hook, creator or ratio is a new version of the same concept [MCR-0022].

### 4. Build the tag sheet and check formula

One row per ad, keyed on the platform's ad ID (names can change, IDs do not). In Google Sheets, split the name with `=SPLIT(B2,"_")` into the tag columns, and flag rule breaks with a pattern check such as `=REGEXMATCH(B2,"^C\d{3}_[A-Z]+_[A-Z]+_[A-Z]+_[A-Z]+_[A-Z]+_CR\d{2}_[A-Z0-9]+_[A-Z]{2}_\d{2,3}_\d{6}_v\d+$")` (ratio written 916, 45 or 11). Excel: Text to Columns and a helper column. Every row also records rights expiry and whether AI made any part (and its platform label).

### 5. Carry the name to store orders

In Meta, set the ad's URL parameters so `utm_content` carries the ad name through the platform's dynamic name field (check Meta's current help page for the exact parameter), and `utm_campaign` the campaign name. Then Shopify orders show which ad sent them, a cross-check on platform-reported purchases. Hand wider UTM set-up to `set-up-utm-tracking-for-all-channels`.

### 6. Keep each ad readable

Avoid ad types that mix many assets into one ad when the store wants to learn: they hide which creative drove results [ADC-0065]. Avoid near-duplicates too; they are grouped by the delivery system and add little [MCR-0078].

### 7. Build the results tab

Join the ad export to the tag sheet on ad ID. Pivot by any tag: spend, store-matched purchases, gross profit after ad cost, hit rate (ads that reached the keep rule over ads launched [ADC-0017]). Read a tag only once it has several ads and enough spend; a single ad is not a pattern.

### 8. Roll it out

Apply the rule to every new ad from the next batch. Rename old ads only if the client agrees; otherwise map them in the sheet by ad ID. Review the code lists monthly: merge codes nobody uses, add ones the roadmap needs.

## Checks before you hand it over

- Every field has a code list with definitions and no "OTHER".
- The ad name pattern is written out with two filled examples that pass the check formula.
- The concept ID links ad, brief and result.
- The sheet is keyed on platform ad ID, not name.
- UTM settings carry the ad name to Shopify orders, tested with one live click.
- The results tab shows gross profit after ad cost by tag, or says it cannot yet.
- One owner is named for new codes.
- No live ad was renamed without the client's yes.

## Output

**One-screen summary:** the rule in one line, the fields, the owner, what changes from the next batch, and the first question the results tab can answer.

**Naming rule card:** campaign, ad set and ad patterns, with two examples each.

**Code lists tab:** Field, Code, Meaning, Added by, Date.

**Tag sheet (`ad-tags` tab):** Ad ID, Ad name, Name check (pass or fail), Concept ID, Batch, Buyer, Angle, Stage, Format, Hook, Hook text, Creator, Offer, Product SKU, Language, Ratio, Length, Landing URL, AI used and label, Rights expiry, Launch date, Status.

**Results tab:** Tag field, Tag value, Ads, Spend, Store-matched purchases, Gross profit after ad cost, Hit rate, Notes.

## Common mistakes

- **Free-text tags.** Step 2 fixes the code lists and bans "OTHER".
- **Names keyed as the only ID.** Step 4 keys on ad ID.
- **New concept IDs for every hook.** Step 3 keeps versions under one concept.
- **Platform numbers only.** Step 5 carries names to store orders.
- **Mixed-asset ads in tests.** Step 6 keeps each ad readable.
- **Reading a pattern from one ad.** Step 7 waits for several ads per tag.

## Sources

- ADC-0016: batch number, buyer and angle in ad set names.
- ADC-0017: hit rate from consistent records.
- ADC-0058: group ad sets by concept.
- ADC-0065: mixed-asset ads hide which creative won.
- MCR-0022: a new concept means a new buyer, angle or offer.
- MCR-0051: tag every ad on the same fields.
- MCR-0078: near-duplicates are grouped.

What makes this skill ours: the concept ID ties each ad to its brief and result; names are checked by a formula, not by memory; the ad name travels into Shopify orders through UTMs so tags can be read on store gross profit, not platform return; language and AI use are fields, which Indian stores and disclosure rules need; and a light version exists for small stores where full tagging would be noise.
