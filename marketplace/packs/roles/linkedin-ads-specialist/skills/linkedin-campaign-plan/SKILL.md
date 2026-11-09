---
name: linkedin-campaign-plan
description: Plan a LinkedIn ads campaign for a B2B offer, sized to deal value. Works out the most you can pay per lead and per qualified lead from deal size, close rate and sales cycle, maps the buying group to job functions, seniority, company size and industry, checks audience size against budget, picks objective, formats, bid strategy and conversion set-up, and ends with a launch checklist. Use for a first LinkedIn campaign, a new offer or market, or when an existing account needs a rebuild.
---

# LinkedIn campaign plan

## When to use

- A B2B business wants to start LinkedIn ads or launch a new offer.
- The current account has many small ad sets, unclear targeting, or no link between spend and pipeline.
- A client gives a budget and a target but no reasoning between them.

## What you need

- Deal size (first-year value or contract value), gross margin, close rate from a qualified lead to a won deal, and the length of the sales cycle.
- Who signs, who uses, who could block: job titles are enough.
- Target company sizes, industries and regions, plus companies or groups to exclude (current customers, competitors, your own staff).
- Monthly budget and how long the client will commit before judging.
- Tracking state: Insight Tag, Conversions API or CRM Sync, consent tool for UK and EU visitors.
- Anything about jobs, housing, credit, education, finance, health or alcohol.

**Access:** level 1 is enough to plan. Building the campaign as drafts needs level 2. Launching needs level 3 and the confirmed action list.

## Steps

### 1. Do the deal maths
Work backwards from revenue to a lead cost the client can afford:
- Value per won deal × close rate from qualified lead = value of one qualified lead.
- Decide with the client what share of that value can go to acquiring it (their call, not yours). That gives a target cost per qualified lead.
- Estimate the share of leads that become qualified from past data. If there is none, say so and plan to measure it in the first month instead of inventing it.
- Show the maths in a small table. If the budget cannot buy enough qualified leads to learn anything in a month, say it plainly.

### 2. Map the buying group
For each role (decision maker, user, blocker), list job functions and seniority levels, and write one line on what that person cares about. This becomes both targeting and the message plan.

### 3. Build the audience
- Start from job function plus seniority, then company size and industry. Use job titles only where function is too broad.
- Add exclusions: students, entry-level seniority if it never buys, current customers, competitors, your own company.
- Check the estimated size. LinkedIn needs at least 300 members to run and suggests 50,000 or more, and 300,000 or more for Sponsored Content and Sponsored Messaging. If the audience is small, plan fewer ad sets, not more.
- Decide on Audience Expansion and the LinkedIn Audience Network on purpose, and write the choice down.
- For a named-account list, upload a company list and pair it with a function filter. In the EEA and Switzerland, expect smaller matched lists because only opted-in members match.
- Consider predictive audiences once there is a source of over 300 leads or conversions, or buyer groups for supported product categories. Note that buyer groups switch off predictive audiences and A/B tests.
- If the ad is about jobs, housing, credit or education, complete the discrimination certification and leave out age targeting where LinkedIn bars it.

### 4. Pick objective and formats
- Lead generation with Lead Gen Forms when the ask is small (a call, a demo, a guide) and sales can follow up fast.
- Website conversions when the site converts well and the Insight Tag or Conversions API is in place.
- Brand awareness or engagement for the out-of-market majority, judged on reach in target companies.
- Formats: single image for a direct offer, document ads to teach (gate only if sales can act on the lead), video for proof, Thought Leader Ads when a real person's post carries the message.
- Remember the objective and format cannot be changed after launch.

### 5. Pick bidding and budget
- Maximum delivery to start when there is no cost history.
- Cost cap once you know a workable cost per lead and need control; expect lower spend if the cap is tight.
- Manual bidding when a tiny audience needs steady, controlled delivery.
- Split budget between always-on reach in target companies and lead generation. Write the split and the reason, citing the client's own goals.

### 6. Set up measurement
- Conversions: form submits, key website actions, and qualified leads from the CRM through CRM Sync or the Conversions API (one source).
- Windows long enough for the sales cycle; 180 or 365 days for lead types sent by API where the cycle is long.
- Insight Tag fires after consent for UK and EU visitors. Tag and server events share an eventId.

### 7. Write the launch checklist
Tag tested, conversions linked to ad sets, form tested with a test lead, CRM sync tested, exclusions in, budget and dates set, ads approved by the client, policy check done.

## Checks

- Every number in the plan comes from the client or from a dated LinkedIn source, never a guessed average.
- Audience size is shown for each ad set.
- The plan states what will be judged at week 2, week 6 and the end of one sales cycle.
- No sensitive-category targeting; no age or gender targeting where barred.
- Steps that need level 2 or 3 are marked.

## Output format

1. Deal maths table.
2. Buying group table: role, functions, seniority, what they care about.
3. Audience table per ad set: facets, exclusions, estimated size.
4. Objective, formats, bid strategy and budget split, with one reason each.
5. Measurement set-up.
6. Launch checklist with owner and access level for each item.

## Example of good output (short)

*Illustrative structure, not a real business: a managed IT provider for law firms with 20 to 100 staff. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Deal maths.** First-year deal 40,000 USD. Close rate from qualified lead 20%, so a qualified lead is worth 8,000 USD of first-year revenue. You chose to spend up to 10% of that, so the target is 800 USD per qualified lead. Budget 4,000 USD a month buys about five at target. That is enough to learn, not to judge, in month one.
>
> | Ad set | Facets | Exclusions | Est. size |
> |---|---|---|---|
> | Decision makers | Industry: Law practice; Company size 11-200; Function: Operations, Legal; Seniority: Partner, Director, Owner | Current clients (company list), students | (from Campaign Manager forecast) |
>
> **One campaign, one ad set** while the audience is this narrow. Lead generation objective, document ad ("IT checklist for a 50-lawyer firm") gated after three pages, maximum delivery for the first four weeks. Qualified leads come back from HubSpot through the Conversions API.
