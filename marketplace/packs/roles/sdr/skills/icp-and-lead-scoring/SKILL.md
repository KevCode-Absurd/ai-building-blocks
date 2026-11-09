---
name: icp-and-lead-scoring
description: Builds an ideal customer profile from the client's own won, lost and churned deals, turns it into a reusable lead scoring sheet with red flags and tier cut-offs, scores and tiers a pasted lead list (up to 500 rows) with a reason for each score, and plans the outreach effort per tier. Use it when a team has more leads than time, sells to "everyone", or wants its gut feel about good customers written as rules. Works only from the data provided; never looks up or adds contact details. Writes scores into the CRM only with level 3 access, within the client's limits.
---

# Ideal customer profile and lead scoring

## When to use

- The team has a big list and no idea who to call first.
- The founder says "we sell to everyone".
- Reps argue about which leads are good; nobody has written the rules down.
- A new segment or market is being tested and needs a starting profile.
- Scores in the CRM no longer match who actually buys.

Do not use it to find emails or phone numbers, buy lists or decide whether a list may be used where the client sells. Those are the client's calls, with the official guidance in `knowledge.md`.

## Access needed

- **Level 1 (read):** CRM deals (won, lost, churned), company records and activity history, or an export.
- **Level 2 (read and draft):** save the scoring sheet as draft properties or a draft score, and the scored list as a view or a draft import file.
- **Level 3 (read, write and publish):** write scores and tiers to records, create lists per tier and assign owners, within the limits the client confirmed (which objects, which fields, how many records). Log every change.

Without access, everything comes back as a spreadsheet and text.

## What you need

1. A deal export: company, industry, size (staff or revenue band), location, deal value, date opened and closed, outcome (won, lost, churned), reason lost or churned if known, how long customers stayed. Names of people are not needed; replace them with IDs.
2. Any notes on the best and worst customers: what made them good or painful.
3. The list to score: company name, website, industry, size, location, and any trigger data the client already holds (hiring, new site, funding).
4. Team size and channels: how many callers or senders, and what each tier can get.
5. The sales cycle and the closer's view of a good meeting.

If there are only a handful of won deals, say the profile is a hypothesis and plan to test it.

## Steps

### 1. Clean and split the deals

Separate won, lost and churned. Remove duplicates and test accounts. Flag missing fields per row. Note the date range; old deals may describe an old business.

### 2. Find what separates great from poor customers

For each trait (industry, size band, location, tools used, buying trigger, who signed), compare the share among won-and-stayed deals with the share among lost or churned deals. Look at deal value and time to close as well as win rate. A trait that appears in many wins but just as often in losses is not a signal.

Write each pattern as a sentence with the evidence: "Clinics with 2 to 5 practitioners: 14 of 19 won deals, 3 of 22 losses; median time to close 24 days." Keep the client's own numbers; do not add industry averages.

### 3. Write the profile

- **Firmographics:** industry, size band, location, tools or setup.
- **Triggers:** dated events that came before most wins (a new manager, a second site, a failed audit).
- **Pains in the buyer's words,** taken from notes or call transcripts.
- **Who buys and who influences.**
- **Anti-profile:** traits common in churned or painful customers.
- **Confidence:** strong, medium or guess for each line, with the deals that prove it.

### 4. Turn it into a scoring sheet

- Fit points for each trait, weighted by how strongly it separated wins from losses.
- Red flags that rule a lead out whatever the score (outside the service area, too small to afford it, a churn pattern).
- Missing-data rule: a blank field scores zero and is flagged, never guessed.
- Tier cut-offs: A, B, C. Set them so the A tier is no bigger than the team can work properly in the period.
- If the CRM supports it, note how the sheet maps to its scoring tool. HubSpot, for example, combines fit and engagement scores and labels them A1 to C3 [knowledge.md, section 3].

### 5. Score the list

Apply the sheet row by row. For each lead give the score, the tier, the one or two reasons that drove it, and any flags (missing data, doubtful data, possible duplicate). Never add facts about a company that are not in the list or the client's notes.

### 6. Plan effort by tier

- **A:** researched, personal first message, calls and email over a planned sequence.
- **B:** lighter research, a segment message, fewer touches.
- **C:** nurture or leave; revisit at rescore.

Turn this into weekly volumes for the team size. Add the rules that apply by country before any outreach (UK sole traders, EU national email rules, do-not-call screening), pointing to `knowledge.md`.

### 7. Set the rescore rule

Rescore when new deals close, when a segment test ends, or on a set date. Compare the A tier's meeting and win rates with B and C; if A does not beat B, the sheet is wrong, not the reps.

## Checks

- Every profile line has evidence from the client's deals, or is marked as a guess.
- The scoring sheet can be applied by hand, without the person who wrote it.
- Red flags and missing-data rules are written down.
- Scores in the list have reasons; nothing was looked up or invented.
- No personal data beyond what the task needs; people replaced by IDs where possible.
- At level 3, only the confirmed fields and records were changed, and every change is in the log.

## Output format

1. Profile (one page) with confidence and proof per line
2. Anti-profile
3. Scoring sheet (table: trait, points, why)
4. Red flags and missing-data rule
5. Scored list (ID, company, score, tier, reasons, flags)
6. Tier plan with weekly volumes
7. Rescore rule and what would prove the sheet wrong
8. Open questions for the client

## Example of good output (short)

*Illustrative structure, not a real business: a payroll bureau in Leeds selling to UK small firms. Copy the shape, never the content: every fact comes from the client's own context.*

> **Profile (from 46 won, 31 lost and 9 churned deals, 2024 to 2026):**
> - Firms with 10 to 49 staff: 33 of 46 wins; 6 of 31 losses. *Strong.*
> - Hospitality and care, with shift pay: 21 of 46 wins; churn 1 of 9. *Strong.*
> - Trigger: switched accountant in the last six months (noted on 12 wins). *Medium.*
> - Anti-profile: under 5 staff, or payroll run in-house by a family member (7 of 9 churned). *Strong.*
>
> | Trait | Points | Why |
> |---|---|---|
> | 10 to 49 staff | +30 | Most wins, few losses |
> | Shift-based pay | +25 | Highest retention |
> | Changed accountant recently | +15 | Trigger on a quarter of wins |
> | Under 5 staff | Rule out | Churn pattern |
>
> | ID | Company | Score | Tier | Reasons | Flags |
> |---|---|---|---|---|---|
> | L-014 | Care firm A | 70 | A | 32 staff; shift pay; new accountant (client note) | none |
> | L-022 | Bakery B | — | Out | 3 staff | sole trader? check before any email |
