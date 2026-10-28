---
name: crm-data-enrichment
description: Enrich CRM records with firmographic and contact data, filling gaps in company and person profiles to improve segmentation, routing, and outreach quality. Use when the user requests crm data enrichment or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# CRM Data Enrichment

Enrich company and contact records in your CRM with up-to-date firmographic, technographic, and demographic data. This skill identifies gaps in existing records, sources enrichment data from available signals, merges and deduplicates entries, validates accuracy, and updates fields — giving sales teams cleaner data for segmentation, lead routing, and personalized outreach.

## Before you start

Ask once for any of these that are missing. If the user cannot give one, write MISSING and carry on. Never invent a value to fill a field. An empty field is better than a made-up one.

1. The records to enrich: a pasted table or an exported file.
2. The fields that matter most (for example industry, company size, job title).
3. Fields that must never be overwritten (optional).
4. The CRM name (optional).

Tools this skill may need:

- **Web search.** Without it, work only from what the user pastes and say so.
- **Paid data services.** If the user wants a third-party provider, they need their own account and key. Never guess at what such a provider would return.
- **Site terms.** Some sites, including LinkedIn and many directories, limit automated reading in their terms. Read public pages the user could open in a browser. Do not use scraping tools on sites whose terms forbid it. If a source needs a login or breaks its terms, skip it and say so.
- **Personal data.** Company details are the default. Fill personal details (a person's title, direct phone or personal email) only for contacts the user already has a lawful reason to hold. In places with privacy law such as GDPR or CCPA, consent or another legal basis may be required. If unsure, fill company fields only and tell the user why. Do not look for personal mobile numbers or home details.
- If the CRM has a built-in enrichment tool and its terms bar outside data, suggest the user use that instead.

## Workflow

1. **Identify Gaps in CRM Data** — Audit the target CRM records to surface missing or outdated fields. Common gaps include annual revenue, employee count, industry classification, technology stack, current job titles, and business contact details already held. Prioritize fields that directly impact lead scoring and routing logic.

2. **Source Enrichment Data** — Look in places the user could also open: the company website, job postings, press releases, public filings, public DNS records (for tech stack hints), and a data provider the user has an account with. Cross-reference at least two independent sources per data point where possible.

3. **Match and Merge Records** — Align enrichment data to CRM records using deterministic matching on domain, email, or unique identifiers, supplemented by fuzzy matching on company name and location. When enrichment suggests two CRM entries are the same entity, flag them for merge review. Do not merge them.

4. **Validate Accuracy** — Give each new value one confidence level (see Confidence scale). Cross-check revenue and headcount against a second source where one exists. Do not claim an email or phone was verified unless a check was actually run.

5. **Show the changes** — Present a before and after table. Do not write anything to a CRM. The user decides what to copy in. Respect any fields the user marked as protected, and never overwrite manually verified data. Log each change with source and date.

## Confidence scale

Use these three levels and no others. Put every value in exactly one.

- **High:** two independent sources agree.
- **Medium:** one reliable source, such as the company's own site or a public filing.
- **Low:** one weak source, an estimate, or an old page. Put it in the review list. Do not recommend writing it to the CRM until a person checks it.

## Output Format

For each record:

```
RECORD: <company or contact>
| Field | Old value | New value | Source | Confidence |
|---|---|---|---|---|
| <field> | <blank or old> | <new> | <where> | High, Medium or Low |

REVIEW LIST
- <field>: <why it needs a person>

DUPLICATES
- <record A> and <record B>: <why they look the same>

CHANGE LOG
<field> | <old> | <new> | <source> | <date>

MISSING
- <fields it could not find, and why>
```

After the last record, give a one-line count: fields filled, fields sent to review, fields not found.

## Usage

Provide the CRM records (or describe the fields and current data) you want enriched, along with which fields to prioritize. Specify the CRM system if relevant (Salesforce, HubSpot, etc.) and any enrichment constraints.

**Example prompt:**
> Enrich this company record. We have the company name and domain only. Fill in industry, employee count, headquarters, founding year and tech stack. Format as a before/after comparison with a source and confidence for each value.

## Illustration (made up, to show the layout only)

The company, person and values below are invented for this example. They do not describe a real business. Real output uses real, sourced values only.

| Field | Old value | New value | Source | Confidence |
|---|---|---|---|---|
| Company Name | Example Co | Example Co, Inc. | Company website footer | Medium |
| Industry | — | Software | Company website, public filing | High |
| Employee Count | — | 200 to 300 | Company site "About" page | Medium |
| Headquarters | — | Austin, TX | Company website footer | Medium |
| Tech Stack | — | PostgreSQL | One job posting | Low |

Review list: Tech Stack (one job post only). Fields filled: 4. Sent to review: 1. Not found: 0.

## Best Practices

- Always enrich the company record before enriching associated contacts — firmographic context improves contact validation.
- Preserve manually entered data by default; only suggest an overwrite when new data is clearly more recent and rated High.
- Run enrichment on a recurring schedule (monthly for active pipeline accounts, quarterly for nurture) rather than one-off batches.
- Log every field change with source and date so sales reps can assess trustworthiness.
- Respect data privacy regulations (GDPR, CCPA) — do not enrich with personal data where consent requirements are unmet.

## Edge Cases

- **Domain mismatch or redirect** — When a company domain redirects to a parent org, verify whether the CRM record refers to the subsidiary or parent before merging firmographic data.
- **Stale job titles** — Titles found online can lag real changes by months. Mark them Medium at best, and cross-check with a recent press release or announcement where possible.
- **Duplicate records post-enrichment** — Enrichment may reveal that two CRM accounts (e.g., "Example" and "Example Co Inc.") are the same entity. Flag for merge review rather than merging, to prevent data loss.
- **Private companies with no public financials** — Revenue and funding data may be unavailable or speculative. Give a range, mark it as an estimate, and rate it Low.
- **Contacts with common names** — When matching contacts by name alone, require a secondary identifier (domain, company, location). Never enrich a contact based solely on name similarity.

## Next steps

Copy the High and Medium changes into your CRM. Have a person check the review list. Then use the Lead prioritizer to rank the updated records.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Win and loss pattern finder](https://useaiblocks.com/skills/win-and-loss-pattern-finder). It takes the lead list.
- The [Sales lead priority ranker](https://useaiblocks.com/skills/who-to-call-first-ranker). It takes the lead list.
- The [Lead grader](https://useaiblocks.com/skills/lead-grader). It takes the lead list.
- The [Lead source field checker](https://useaiblocks.com/skills/lead-source-field-checker). It takes the lead list and spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
