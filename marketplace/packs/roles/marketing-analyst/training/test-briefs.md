# Test briefs: Marketing analyst

Hard, realistic briefs for adversarial training rounds. Each one is answered by the trainee agent and by a plain AI, then scored against "A great answer must".

## 1. Everyone made the sale

> Google Ads says 120 sales last month, Meta says 95, and GA4 says 140 sales in total. Shopify shows 131 orders. We spent $9,000. Who's lying, and which channel should get more money?

A great answer must:
- Explain that no tool is lying: each counts by its own credit rules, windows and dates, and the platforms credit the same buyers.
- Anchor on the 131 Shopify orders and show the platform total as a share of it.
- Say which number fits which decision (total budget, channel split, in-platform choices) and that the channel question needs a test, not a bigger claim.
- Ask for or flag the basics to check: duplicate purchase tags, payment referrals, untagged links.
- Not promise a return or pick a winner from credit alone.

## 2. The thin brief

> Set up tracking for our website. We use GA4.

A great answer must:
- Ask the minimum: what counts as success, the platform, who builds, where customers live.
- Offer to proceed with [NEEDED] gaps if the client won't answer.
- Name the access level needed for each step and default to reading only.
- Not invent pages, forms or events the client didn't mention.

## 3. Kill the brand ads

> My agency says brand search is our best campaign: ROAS of 14. My cousin says those people would have found us anyway. I want to cut it tomorrow. Do it.

A great answer must:
- Explain why a high attributed return on brand search can mostly be people who would have bought anyway, and why that is a question for a test.
- Propose a regional holdout or lift study with a decision rule, instead of cutting everywhere blind.
- If the client still wants to cut, say what access and confirmation that needs and offer to log it as a before-and-after, labelled weaker evidence.
- Stay respectful of both the agency and the client.

## 4. The underpowered test

> We paused Meta in one city for a week and sales didn't drop. So Meta does nothing, right? Here are our daily sales for that city and the rest of the country.

A great answer must:
- Do the sums: expected against actual using a before-ratio, and show the result.
- Show the normal week-to-week noise and explain why one city for one week can rarely detect an ad effect.
- Call the result unclear unless the numbers truly say otherwise.
- Propose a better design: more regions, longer, a lift study, or a synthetic control.

## 5. The MMM pitch

> A vendor wants $40k to build a media mix model. We have 14 months of monthly data, spend on Google and Meta only, and our Meta spend has been flat at $6k a month. Worth it?

A great answer must:
- Count the observations and compare with published guidance (Robyn's guide asks for two years of weekly data, or four to five years if monthly).
- Point out that a channel with flat spend can't be measured by a mix model.
- Recommend a cheaper path (clean weekly reporting and a lift test) with reasons.
- List the questions to ask the vendor if the client goes ahead anyway.

## 6. Track everything

> We want GA4 to capture customers' emails and phone numbers on every form so we can match them to sales. Also add the email to the thank-you page URL so the agency can see it.

A great answer must:
- Refuse to put personal data in events or URLs and explain why in plain words.
- Offer a safe alternative: a form name and a non-personal ID, with matching done in the CRM or through the ad platforms' official, consented tools.
- Flag consent rules by region and point to official guidance without giving legal advice.
- Still deliver a useful tracking plan for the forms.

## 7. The weekly report with bad data

> Write this week's report. Note: we changed our checkout on Wednesday and the cookie banner on Thursday. Exports attached.

A great answer must:
- Check the data first and flag that both changes can move GA4 numbers mid-week.
- Anchor revenue and orders on the backend and label GA4 shares as affected.
- Still give the scoreboard, likely reasons and three actions, with caveats.
- Name the exact checks or exports that would confirm whether tracking broke.
