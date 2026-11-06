---
name: conversion-research-audit
description: Finds where and why visitors leave a landing page, store or booking flow - funnel by device and source, behaviour from heatmaps and recordings (only where consent rules are met), checkout and form friction, speed against Core Web Vitals, and customer words - then ranks fixes by payoff, confidence and effort, and sorts each into fix now, test, or drop. Use when traffic is steady but sales, bookings or sign-ups are not, before planning any A/B test, or when someone asks "why isn't my page converting?".
---

# Conversion research audit

Most failed tests were never going to win, because the idea came from taste rather than evidence. This skill finds the real leaks first: where people drop, what they do just before, and why. It ends with a ranked list that separates bugs to fix today from ideas worth testing and ideas to drop.

## When to use

- A page or store gets visitors but few convert.
- Before planning any A/B test.
- After a redesign, a platform move or a traffic change, when conversion fell.
- When a client has a list of "ideas to test" with no evidence behind them.

## What you need

**Access:** level 1 for every step. Level 2 to write fixes into a draft or duplicate page. Level 3 to publish clear bug fixes the client approved in the action list.

- The goal action and its value (order, booking, qualified lead).
- Analytics for recent whole weeks: visits and conversions by step, device and source. A GA4 exploration export or Viewer seat is enough.
- Heatmap and recording notes or screenshots, if the tool runs with consent (see the tracking-and-consent-check skill).
- Screenshots of the page or flow on mobile and desktop.
- Customer words: reviews, survey answers, support questions (the conversion copywriter kit's voice-of-customer method).
- Speed data if available (PageSpeed Insights or the site's Core Web Vitals report).

## Steps

1. **Define the funnel.** List each step from landing to the goal action. For each, get visitors who reached it, by device and source. Show counts and step-to-step rates.
2. **Find the biggest leak.** Rank steps by visitors lost (absolute), not only by rate. A small drop on a busy step can matter more than a big drop on a quiet one.
3. **Split it.** Compare mobile and desktop, new and returning, and the top traffic sources at the leaking step. A leak on one device or source points to a bug or a message mismatch.
4. **Watch behaviour.** In heatmaps and recordings, look at the leaking step: rage clicks, dead clicks, scrolling past the button, form fields re-typed, error messages, long pauses. Note the pattern and how many recordings show it. Only use recordings that meet the client's consent rules, with masking on.
5. **Check checkout and forms.** Against Baymard's public findings: are there surprise extra costs, forced account creation, slow delivery shown late, unclear trust signals, too many fields, or errors? Count the fields.
6. **Check speed.** Compare the page with Core Web Vitals "good" thresholds at the 75th percentile: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less.
7. **Check motivation, ability and prompt.** Using Fogg's model: is the visitor motivated here (relevant promise, proof, price clear), able (fast, simple, few steps), and prompted (a visible next step)? Name the missing element.
8. **Read customer words.** Which doubts, questions or complaints match the leak? Quote them briefly.
9. **Run a quick usability round if possible.** Five people trying the main task find most usability problems; note what they stumble on.
10. **Rank the fixes.** For each finding: the fix, the evidence, expected payoff (visitors affected and size of the problem), confidence (strength of evidence), effort. Sort into:
    - **Fix now:** clear bugs and errors. No test needed.
    - **Test:** uncertain changes on steps with enough traffic (size it with the test-design-and-sample-size skill).
    - **Judgement call:** uncertain changes on steps without enough traffic; ship with a dated note and watch the trend.
    - **Drop:** ideas with no evidence.
11. **Say what you could not see.** Data gaps, consent limits, tools without access.

## Checks

- Every finding cites its evidence: a funnel number, a recording pattern with a count, a user-test note or a customer quote.
- Rates show their counts.
- Bugs are separated from test ideas.
- No benchmark is used as a target; the client's own data is the baseline.
- Recordings used only where consent rules are met, and no personal data in the report.
- Copy rewrites, where needed, follow the conversion copywriter kit.

## Output format

1. **Summary:** the biggest leak, its likely cause and the top three fixes, in five lines.
2. **Funnel table:** step, visitors, step rate, by device.
3. **Findings:** each with evidence and source.
4. **Ranked fix list:** fix, evidence, payoff, confidence, effort, category (fix now, test, judgement call, drop).
5. **Data gaps** and what would close them.
6. **Next step:** the first fix to ship and the first test to plan.

## Example of good output (short)

*Fernway Bike Hire is a made-up bike rental business with an online booking flow, used only to show the format. All numbers are invented.*

**Summary:** the biggest leak is the "Your details" step on mobile: 1,140 of 2,010 mobile visitors who reached it left (57%), against 31% on desktop. Recordings show the phone field rejecting numbers with spaces. Fix that today; then test showing the deposit amount on the bike-selection step.

**Funnel (last 6 weeks)**

| Step | Mobile | Desktop |
|---|---|---|
| Landing | 9,800 | 4,100 |
| Dates chosen | 4,450 (45%) | 2,300 (56%) |
| Bike chosen | 2,010 (45%) | 1,240 (54%) |
| Details completed | 870 (43%) | 856 (69%) |
| Paid | 610 (70%) | 640 (75%) |

**Ranked fixes**

| Fix | Evidence | Payoff | Confidence | Effort | Category |
|---|---|---|---|---|---|
| Accept phone numbers with spaces | 14 of 30 mobile recordings show the error | High | High | Low | Fix now |
| Show the deposit on the bike step | 9 support emails ask about the deposit; Baymard lists extra costs as the top abandonment reason | Medium | Medium | Low | Test |
| Shorten the details form from 11 fields to 7 | Field count; recordings show pauses at "Company" | Medium | Medium | Medium | Test after first |
| New hero photo | No evidence | Unknown | Low | Medium | Drop |

**Data gap:** no recordings for EU visitors, because Clarity runs only with consent there. Results describe consenting visitors.
