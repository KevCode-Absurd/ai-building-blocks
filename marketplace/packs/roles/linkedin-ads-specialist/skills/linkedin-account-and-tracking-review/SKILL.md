---
name: linkedin-account-and-tracking-review
description: Review a LinkedIn ads account from Campaign Manager and demographics exports plus CRM data. Reads spend by job title, seniority, company and ad to find waste, checks the Insight Tag, Conversions API, deduplication, conversion windows and consent, compares LinkedIn's leads and conversions with the CRM, and ends with the three changes most likely to pay back. Use for a new client, a 90-day review, when leads are cheap but poor, or when LinkedIn and the CRM disagree.
---

# LinkedIn account and tracking review

## When to use

- First look at an account you have not run before.
- Every quarter, or after a sales-cycle length of data.
- Sales says LinkedIn leads are poor, or LinkedIn's conversions do not match the CRM.
- After a website, tag manager, consent banner or CRM change.

## What you need

- Campaign Manager export, last 90 days (or one sales cycle), by ad set and ad: objective, bid strategy, spend, impressions, clicks, leads, form opens, conversions, qualified leads.
- Demographics export for the same period: job title, function, seniority, company, company size, industry.
- CRM report of LinkedIn-sourced leads by stage, with names removed.
- Screenshots of the conversions list and each conversion's settings (source, window, attribution), and the conversion breakdown.
- The cookie banner set-up for UK and EU visitors.

**Access:** the whole review works at level 1. Fixes become a change list; I make them only at level 3, inside the confirmed limits, or you make them.

## Steps

### 1. Read the account shape
Count campaigns and ad sets, note objectives and bid strategies, and estimate each ad set's audience size. Flag ad sets under LinkedIn's suggested 50,000 members that are split further, and any Audience Expansion or LinkedIn Audience Network setting nobody chose on purpose.

### 2. Read spend by who saw it
Read the demographics export before any other column, because clicks from the wrong people look like success.
- Sort spend by seniority and function. Flag spend on entry-level, student or unrelated functions.
- Sort by company and company size. Flag companies too small to buy, current customers and competitors.
- Sort by job title. List the ten titles with most spend and the ten with most qualified leads. The gap between the two lists is the waste.

### 3. Read ads and formats
For each ad: spend, click-through rate, form open rate, form completion rate, cost per lead and, where the CRM allows, cost per qualified lead. Note which offers and formats bring qualified leads, not just leads.

### 4. Check lead quality against the CRM
- Match LinkedIn leads to CRM leads by week. Count how many became qualified, opportunities and won.
- Work out cost per qualified lead and cost per opportunity by ad set.
- If the CRM cannot say, record that as the first gap to fix.

### 5. Check tracking
- **Insight Tag:** on every page that matters, not on sensitive pages, and firing only after consent for UK and EU visitors. Check in a private browser window: answer "reject" and watch whether LinkedIn requests still go out.
- **Conversions:** each conversion's source (Insight Tag, Conversions API, CSV, CRM), window and attribution setting. Windows should fit the sales cycle; LinkedIn's default is 90-day click and 90-day view, with 180 or 365 days for lead types sent by API.
- **Deduplication:** where both tag and server send an event, both need the same eventId and their own conversion rules. In the breakdown, the Insight Tag line should show the higher count. Equal counts on both lines suggest double counting.
- **Qualified leads:** coming back from one source only (CRM Sync or Conversions API), within 30 days of the lead.
- **Freshness:** Conversions API events sent in real time or within a day.

### 6. Compare the numbers
Put LinkedIn leads and conversions next to CRM numbers for the same dates. Explain the gap: windows, view-through credit, modelled conversions, consent refusals, missing tags, or leads never imported.

### 7. Choose three changes
Rank by money at stake. Typical winners: exclude wasted seniority or functions, fix lead routing so sales calls fast, add a qualifying question, switch to the qualified leads goal, fix deduplication. Each change gets the evidence, the expected effect, the risk, how to undo it and the access level it needs.

## Checks

- Every finding names the export row or screenshot behind it.
- Waste is shown in money, not just percentages.
- The window and attribution setting are stated wherever a result is quoted.
- Consent findings are framed as practice points for the client's adviser, not legal rulings.
- You state what the data could not show.

## Output format

1. Verdict in one sentence.
2. Where the money went: table by seniority, function and company size.
3. Lead quality: LinkedIn leads versus CRM qualified leads, opportunities and won.
4. Tracking findings: tag, conversions, windows, deduplication, consent.
5. Three changes, ranked, with level needed.
6. What I could not check.

## Example of good output (short)

*Made-up business: Corvel Training, leadership courses for hospital managers.*

> **Verdict:** a third of spend reaches staff who cannot buy, and forms count twice.
>
> | Seniority | Spend (90 days) | Leads | Qualified |
> |---|---|---|---|
> | Entry, Training | 3,100 USD | 41 | 0 |
> | Manager | 4,800 USD | 22 | 6 |
> | Director, VP | 2,600 USD | 9 | 5 |
>
> **Tracking:** "Form submit" is sent by the Insight Tag and by Zapier without a shared eventId; both lines show 72 in the breakdown, while the CRM shows 72 leads in total.
>
> **Change 1 (level 3, inside limits):** exclude Entry and Training seniority. Expected: fewer, better leads; about 3,100 USD a quarter moved to managers and directors. Undo: remove the exclusion.
> **Change 2 (developer):** pass the same eventId from the page to Zapier.
> **Change 3 (needs your yes):** switch to the qualified leads goal once the CRM sends stages back.
