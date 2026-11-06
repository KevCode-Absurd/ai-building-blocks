---
name: linkedin-lead-gen-form-and-follow-up
description: Design a LinkedIn Lead Gen Form that balances lead volume and quality, inside LinkedIn's field and character limits and the Ads Agreement rules, then plan the follow-up so sales calls within a day and qualified leads flow back to LinkedIn. Covers offer, fields, custom questions, hidden fields, privacy link and disclosure checkboxes, thank-you text, CRM routing, qualified-lead feedback through CRM Sync or the Conversions API, and the first-week sales sequence. Use when launching lead generation, when leads are cheap but poor, or when leads go unanswered.
---

# LinkedIn Lead Gen Form and follow-up

## When to use

- A new lead generation campaign needs a form.
- Leads are cheap but sales says they are junk.
- Leads arrive but nobody follows up quickly, or they never reach the CRM.
- The client wants to switch to the qualified leads optimisation goal.

## What you need

- The offer behind the form (demo, consultation, guide, event, audit) and what sales does next with a lead.
- What sales must know to qualify a lead: for example company size, role, timeline or current tool.
- The CRM or marketing automation tool, and who owns it.
- The client's privacy policy URL and any consent wording their adviser has approved.
- Past form data if any: opens, submissions, and how many leads became qualified.

**Access:** level 1 to review existing forms. Level 2 to build the form in draft. Level 3 to attach it to live ads within the agreed limits. Consent and privacy wording is the client's decision; I draft it, their adviser approves it.

## Steps

### 1. Decide what the form must filter
Ask sales for the two or three facts that separate a real prospect from a tyre-kicker. Each becomes a pre-filled profile field or a custom question. Anything sales does not use is cut.

### 2. Choose fields
- LinkedIn recommends three to four fields; the maximum is 12, including up to three custom questions of 100 characters each.
- Prefer pre-filled profile fields (name, email, company, job title, company size) because they cost the member no typing.
- Use one custom question for the strongest qualifier, as multiple choice where possible ("When do you plan to switch? This quarter / This year / Just researching").
- If the business needs a work email, say so in the plan and expect fewer submissions.
- Add hidden fields (up to 20) for campaign, ad set, ad and offer, so the CRM knows where each lead came from.

### 3. Write the offer and thank-you text
- Headline up to 60 characters; details up to 160. Match the ad: same offer, same words.
- Confirmation message up to 300 characters. Say how and when you will be in touch ("A specialist will call you within one working day"). Keep that promise.
- LinkedIn does not deliver promised content. Put an ungated link to the asset in the thank-you message or send it yourself.

### 4. Privacy and consent
- Each form must link to the client's privacy policy. Privacy text can run to 2,000 characters.
- Use disclosure checkboxes (up to five, 500 characters each) only for purposes that need separate permission, such as marketing emails. Keep each to one purpose and never pre-tick; LinkedIn shows no default consent checkbox to EU members.
- Do not ask for sensitive data: health, financial, government ID or anything about children.
- Plan how opt-out and deletion requests are honoured, and where leads are stored, because LinkedIn keeps form data available for one year only.
- These are practice points. The wording and the legal basis are for the client and their adviser to approve.

### 5. Route leads
- Connect the form to the CRM through a LinkedIn Marketing Partner integration or the CRM's own LinkedIn connector. If neither exists, set a daily CSV download and import, and name who does it.
- Check permissions: downloading leads needs viewer access or higher on the ad account and a Lead Gen Forms role on the Page.
- Send a test lead and confirm it lands in the CRM with hidden fields intact.

### 6. Plan the follow-up
- Day 0: auto-email with the asset or booking link, sent from a person.
- Within one working day: call or personal email from sales, referring to the offer.
- Days 2 to 7: two more touches with something useful, then a clear close-the-loop message.
- Mark each lead's stage in the CRM: qualified, not qualified (with reason), won, lost.

### 7. Close the loop with LinkedIn
- Send qualified leads back through CRM Sync or the Conversions API, using one source only.
- When there are five or more qualified leads within two weeks, consider the qualified leads optimisation goal. Expect cost per lead to rise and cost per qualified lead to fall.

## Checks

- Field count and character counts are inside LinkedIn's limits.
- Every field has a named use in sales qualification or routing.
- Privacy link present; checkboxes unticked and one purpose each; no sensitive questions.
- Test lead reached the CRM; follow-up owner and time named.
- Steps needing level 2 or 3 are marked.

## Output format

1. Form spec table: field, type (pre-filled, custom, hidden), why it is there.
2. Offer, headline, details and confirmation text with character counts.
3. Privacy and checkbox drafts, marked "for your adviser to approve".
4. Routing plan and test steps.
5. Follow-up sequence by day with owner.
6. Feedback plan for qualified leads.

## Example of good output (short)

*Made-up business: Fernway Analytics, a reporting tool for mid-size logistics firms.*

> | Field | Type | Why |
> |---|---|---|
> | First name, last name, work email | Pre-filled | Contact |
> | Company name, company size | Pre-filled | Sales only calls 50+ staff |
> | Job title | Pre-filled | Routes to the right rep |
> | "When will you choose a reporting tool?" This quarter / This year / Researching | Custom | Priority for sales |
> | utm_campaign, ad_set, offer | Hidden | CRM source |
>
> **Headline (36/60):** Free fleet-cost report for your firm
> **Confirmation (110/300):** Thanks. Your sample report is at the link below, and Priya from our team will call you within one working day.
>
> **Follow-up:** Priya calls within one working day; "This quarter" leads first. Qualified leads go back to LinkedIn through the HubSpot Conversions API integration.
