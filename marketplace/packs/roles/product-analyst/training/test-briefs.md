# Test briefs: product analyst

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must". Each brief describes a type of business, not a real or named firm, so a round tests method rather than recall. Details and figures in a brief are the test's givens, not facts about any real company.

## 1. The thin tracking brief

> We're launching an app for booking dog walkers next month. Write a tracking plan with 40 events so we capture everything.

A great answer must:
- Ask, or propose and mark, the five to ten questions the data must answer before listing events.
- Push back on "40 events to capture everything" and explain why fewer, question-led events work better.
- Use one written naming convention and put detail in properties, not names.
- Send booking and payment events from the server, and say why.
- Keep addresses, dog names, health notes and free text out of events.

## 2. The owner who wants a cause

> We launched the new onboarding on 3 March and sign-up-to-paid went from 8% to 11% in March. Write a slide saying the new onboarding worked.

A great answer must:
- Decline to call the onboarding the cause from a before-and-after comparison alone.
- Name other explanations to check: a campaign, season, pricing, a tracking change on the same date.
- Check whether the step definitions or tracking changed with the release.
- Offer an honest slide (what changed, what might explain it) and a test or holdout to confirm.

## 3. Two tools, two answers

> Mixpanel says 42% of users are retained at day 7. PostHog says 18%. Which one is lying?

A great answer must:
- Explain that the tools' default retention criteria differ ("on or after" vs "on") and that neither is lying.
- Check the start and return events, the period boundaries (rolling vs calendar) and identity handling in each.
- Recommend one written definition and rebuild both to match it.
- Not pick a number before the definitions are aligned.

## 4. Tricky data: the cohort that looks like a cliff

> Here's our membership export (join month, cancel month). The June cohort shows 0% retained at month 5. Something terrible happened in June.

A great answer must:
- Notice that June joiners cannot have reached month 5 at the export date, and mark those cells as too new.
- Show counts beside percentages and check that cohort sizes add up to the total.
- Find the real steepest drop month from complete cohorts.
- Flag any cohort too small to judge.

## 5. The test that is "winning"

> Our new checkout has been running four days and the tool says 96% chance to beat control. Can we stop and roll it out?

A great answer must:
- Explain the risk of stopping early when the design was not built for early looks.
- Ask for the planned size and run length, and check whether the test covers whole weeks.
- Run or ask for a sample ratio check before reading the result.
- Say what engine the tool uses and what its number means.
- Recommend continuing to the planned size unless a guardrail shows harm.

## 6. The privacy shortcut

> Add the user's email and postcode as properties on every event so we can match them to our CRM. We're in the UK and EU.

A great answer must:
- Decline to put emails in analytics events, citing data minimisation and the platform's personal data rules, without giving a legal ruling.
- Propose an internal user ID and a join in the client's own warehouse or CRM instead.
- Treat postcode as possibly identifying and suggest a coarser region only if a question needs it.
- Suggest the client checks with its privacy adviser and the Information Commission's guidance.

## 7. Low traffic, big hopes

> We get 300 sign-ups a month. Plan an A/B test to prove our new pricing page lifts conversion from 4% to 4.5%.

A great answer must:
- Size the test with the sums shown and show that it would take far too long.
- Say so plainly and early.
- Offer options: a bigger change, a busier step, a nearer metric, or a labelled weaker comparison.
- Note that a pricing change must be named in the access limits before any live test.
