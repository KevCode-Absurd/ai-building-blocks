---
name: duplicate-review-and-merge-plan
description: Finds duplicate customers, companies, products or contacts in a CRM export, spreadsheet or table, from strict keys (record ID, email, domain) through normalised fingerprints to fuzzy and probabilistic matches (OpenRefine clustering, Splink), checks a sample by hand, writes survivorship rules field by field, and produces a merge list in batches with counts. Reads and matches at access level 1; prepares the merge list and a sandbox test at level 2; runs merges at level 3 only batch by batch, each with a backup export, a count, a sample shown and a fresh yes, because tools such as HubSpot cannot unmerge. Use before a migration, when two lists must be combined, or when a CRM has grown duplicates.
---

# Duplicate review and merge plan

## When to use

- A CRM, booking system or mailing list holds the same customer more than once.
- Two customer lists must be combined before a move to a new system.
- Reports count one customer twice, or two people get each other's emails.
- A duplicate tool (such as HubSpot's duplicate manager) has suggested pairs and someone wants to bulk-merge them.

## What you need

1. An export of the records with their system IDs, the fields used for matching (name, email, phone, postcode, company, domain) and fields showing activity (created date, last activity, owner).
2. Which system is the system of record for each field, if any.
3. The tool that will do the merge (HubSpot, Salesforce, a spreadsheet, SQL) and whether its merges can be undone.
4. Access: level 1 to read and match. Level 2 to build the merge list and test in a sandbox. Level 3 to merge, one batch at a time, each with a backup export, a count, a sample and a fresh yes.

Personal data stays in the client's tools or in an export they control. In chat, I use record IDs and masked values.

## Steps

### 1. Normalise a copy

On a copy: trim spaces, lower-case emails and domains, strip `www.` and `http` from websites, put phone numbers in one format with the country code, standardise postcodes, and keep the original columns alongside.

### 2. Match from strict to loose

1. **Exact shared ID** (customer number, record ID).
2. **Exact key** (normalised email for people, domain for companies).
3. **Fingerprint:** OpenRefine's key collision method (trim, lower-case, remove punctuation, plain letters, sort words) catches "Smith, Jo" and "Jo Smith". It is the least likely to make false matches.
4. **Fuzzy:** edit distance on names within a block (same postcode or same domain). Small n-grams and PPM find more but make many false matches.
5. **Probabilistic:** for large lists with no shared ID, Splink scores pairs with Fellegi-Sunter weights across several fields.

Record which rule matched each pair. Stop loosening when the sample check (step 3) starts finding wrong pairs.

### 3. Check a sample by hand

Take a sample from each match rule, including the weakest pairs, and have a person who knows the customers confirm them. Two people at one address or a parent and child with the same name are classic false matches. Drop or tighten any rule that produces wrong pairs.

### 4. Write survivorship rules

Field by field, decide which value wins:
- **System of record wins** for fields it owns (billing address from accounts).
- **Most recent non-blank wins** for contact details.
- **Keep both** where the target can hold both (a second email field, a notes field).
- **Never merge** across certain flags (different legal entities, opted-out versus opted-in), which need a person's decision.

Check how the tool merges. In HubSpot, the primary record's values are kept, blanks are filled from the secondary, associations and activities are combined, merges fail once the two records' combined merge count reaches 250, and records cannot be unmerged. Bulk merges in HubSpot need Data Hub Professional or Enterprise. With web search connected, re-check the tool's merge page on the day; without it, ask the client to confirm the behaviour in their account.

### 5. Build the merge list in batches

One row per pair: primary ID, secondary ID, match rule, score, fields that will change, and the survivorship rule applied. Batches small enough to review. Pairs needing a person's decision go to a separate list.

### 6. Test (level 2)

Run one small batch in a sandbox or test portal, or on a copy of the table, and check the result field by field against the plan.

### 7. Merge (level 3, one batch at a time)

For each batch: take a fresh export of every record in the batch, show the count and a sample of the changes, get a fresh yes for that batch, merge, then check counts and a sample of merged records. Stop and ask if any merge fails or the result differs from the plan.

### 8. Stop new duplicates

Recommend the prevention: unique-value properties, a required email, validation lists, import with record IDs (in HubSpot, rows without a Record ID create new records), and a weekly duplicate check.

## Checks

- Every pair shows which rule matched it.
- A sample from each rule was checked by a person, and wrong rules were dropped.
- Survivorship is written for every field that differs.
- Each batch has a backup export, a count, a sample and a fresh yes before it runs.
- Pairs across legal entities or consent status went to a person.
- No personal data appears in chat beyond record IDs and masked values.
- Counts after each batch equal counts before minus merged secondaries.

## Output format

1. Summary: records in, pairs found per rule, sample results, pairs proposed, pairs for a person.
2. Survivorship table: field, rule, reason.
3. Merge list (CSV) in batches.
4. Test result from the sandbox or copy.
5. Merge log per batch: backup taken, count, yes recorded, result.
6. Prevention steps.

## Example of good output (short)

*Made-up business for illustration: "Copperfield Garden Rooms", 6,840 HubSpot contacts.*

> | Match rule | Pairs | Sample checked | Wrong in sample | Use? |
> |---|---|---|---|---|
> | Same email (normalised) | 412 | 40 | 0 | Yes |
> | Same phone + same surname | 96 | 30 | 0 | Yes |
> | Fingerprint name + same postcode | 58 | 30 | 4 (couples at one address) | No: send to a person |
>
> Survivorship: phone and email, most recent non-blank wins, old values kept as secondary email or in notes. Lifecycle stage and marketing status: check against HubSpot's rules before merging.
>
> Batch 1: 50 pairs, export saved as `batch1_before.csv`, waiting for your yes. HubSpot cannot unmerge.
