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
- The live page or flow, captured with `node tools/capture-brand-dna.mjs <url> <steps...>` (screenshots at 390 and 1440 px plus the page's fonts, colours, buttons and section order), or the client's screenshots on mobile and desktop.
- Customer words: reviews, survey answers, support questions (the conversion copywriter kit's voice-of-customer method).
- Speed data if available (PageSpeed Insights or the site's Core Web Vitals report).

## Steps

1. **Define the funnel.** List each step from landing to the goal action. For each, get visitors who reached it, by device and source. Show counts and step-to-step rates.
2. **Find the biggest leak.** Rank steps by visitors lost (absolute), not only by rate. A small drop on a busy step can matter more than a big drop on a quiet one.
3. **Split it.** Compare mobile and desktop, new and returning, and the top traffic sources at the leaking step. A segment difference generates a bug or message-mismatch hypothesis; inspect traffic mix, tracking, sample size and buyer intent before assigning a cause.
4. **Watch behaviour.** In heatmaps and recordings, look at the leaking step: rage clicks, dead clicks, scrolling past the button, form fields re-typed, error messages, long pauses. Note the pattern and how many recordings show it. Only use recordings that meet the client's consent rules, with masking on.
5. **Check checkout and forms.** Against Baymard's public findings: are there surprise extra costs, forced account creation, slow delivery shown late, unclear trust signals, too many fields, or errors? Count the fields.
6. **Check speed.** Compare the page with Core Web Vitals "good" thresholds at the 75th percentile: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less.
7. **Check motivation, ability and prompt.** Using Fogg's model: is the visitor motivated here (relevant promise, proof, price clear), able (fast, simple, few steps), and prompted (a visible next step)? Name the missing element.
8. **Read customer words.** Which doubts, questions or complaints match the leak? Quote them briefly.
9. **Run a quick usability round if possible.** Recruit relevant users for the target journey, record who was sampled and what they stumble on; a small qualitative round does not establish prevalence or guarantee most problems were found.
10. **Rank the fixes.** For each finding: the fix, the evidence, expected payoff (visitors affected and size of the problem), confidence (strength of evidence), effort. Sort into:
    - **Fix now:** clear bugs and errors. No test needed.
    - **Test:** uncertain changes on steps with enough traffic (size it with the test-design-and-sample-size skill).
    - **Judgement call:** uncertain changes on steps without enough traffic; ship with a dated note and watch the trend.
    - **Drop:** ideas with no evidence.
11. **Say what you could not see.** Data gaps, consent limits, tools without access.

## Evidence scope and completed journey

Join funnel, behavior, customer-language and page evidence by the same journey, device, time period and consent scope. State whether counts describe users, sessions or events; repeated events are not unique buyers. Record analytics coverage, unavailable steps and denominator definitions before comparing rates. Separate measured breakage, observed friction, customer testimony and hypotheses. A screenshot or a generic benchmark cannot establish the cause of a conversion-rate change. Field Core Web Vitals and a lab simulation answer different questions; do not relabel a single lab run as a 75th-percentile field result.

Trace query/ad promise → landing hero/offer → selected product/variant → cart → checkout or lead outcome. Mark promise mismatches with evidence and coordinate an ad-only, page-only or paired-chain experiment. Paired changes measure the bundle, not the separate effects. Preserve current experiments and record other releases, promotions, stockouts and tracking changes before interpreting outcomes.

For executable fixes, produce a journey receipt: URL/build, test time, viewport, inputs/variant, expected action, observed action, screenshot or test artifact, and pass/fail/blocked status. Exercise empty/error states and keyboard navigation as relevant. Use a local/test checkout for non-production trials; never mark a simulated payment or a blocked production checkout as a verified purchase. A successful smoke test proves behavior, not sales uplift. Recheck the original defect after the fix, and record its intervention ID, owner, primary outcome, guardrail, review trigger and rollback. Reuse existing authorization; only genuinely new live scope needs a decision.

## Checks

- Every finding cites its evidence: a funnel number, a recording pattern with a count, a user-test note or a customer quote.
- Rates show their counts.
- Bugs are separated from test ideas.
- No benchmark is used as a target; the client's own data is the baseline.
- Recordings used only where consent rules are met, and no personal data in the report.
- Copy rewrites, where needed, follow the conversion copywriter kit.
- Each fix is a change to the live page that keeps its nav, footer, fonts and components unless the fix is about them; built fixes pass `tools/check-brand-fidelity.mjs` against the capture before they go live.

## Output format

1. **Summary:** the biggest leak, its likely cause and the top three fixes, in five lines.
2. **Funnel table:** step, visitors, step rate, by device.
3. **Findings:** each with evidence and source.
4. **Ranked fix list:** fix, evidence, payoff, confidence, effort, category (fix now, test, judgement call, drop).
5. **Data gaps** and what would close them.
6. **Journey receipt:** tested states, evidence and pass/fail/blocked results for implemented fixes; distinguish local preview from verified integration.
7. **Next step:** the first supported fix and first appropriately scoped test, with intervention ID and outcome review trigger.

## Example of good output (short)

*Illustrative structure, not a real business: a jewellery store with an online purchase flow. Figures only show the shape. Copy the shape, never the content: every fact comes from the client's own context.*

**Summary:** the largest measured mobile drop is landing to product view: 9,800 - 4,450 = 5,350 visitors; its cause is unresolved. Prioritize the reproducible phone-field defect at shipping details: 14 of 30 reviewed mobile recordings show rejection of numbers containing spaces. That step loses 1,140 of 2,010 mobile visitors (57%), versus 31% on desktop, but the recordings do not establish that this defect caused all of that abandonment. Fix and recheck the defect within the existing authority, investigate the larger upstream loss, then test showing delivery charges on the product page.

**Funnel (last 6 weeks)**

| Step | Mobile | Desktop |
|---|---|---|
| Landing | 9,800 | 4,100 |
| Product viewed | 4,450 (45%) | 2,300 (56%) |
| Added to cart | 2,010 (45%) | 1,240 (54%) |
| Details completed | 870 (43%) | 856 (69%) |
| Paid | 610 (70%) | 640 (75%) |

**Ranked fixes**

| Fix | Evidence | Payoff | Confidence | Effort | Category |
|---|---|---|---|---|---|
| Accept phone numbers with spaces | 14 of 30 mobile recordings show the error | High | High | Low | Fix now |
| Show delivery charges before checkout | 9 support emails ask about delivery charges; quantify prevalence before predicting uplift | Medium | Medium | Low | Test |
| Shorten the details form from 11 fields to 7 | Field count; recordings show pauses at "Company (optional)" | Medium | Medium | Medium | Test after first |
| New hero photo | No evidence | Unknown | Low | Medium | Drop |

**Data gap:** no recordings for EU visitors, because Clarity runs only with consent there. Results describe consenting visitors.

## Method attribution

Adapted measurement, evidence and deliverable procedures from NotFair: [Message-chain testing](https://github.com/nowork-studio/notfair-plugin/blob/deed0436d0c68cbc20a78523fffc67edd12aa25c/google-ads/landing/references/message-chain-testing.md); [Decision quality](https://github.com/nowork-studio/notfair-plugin/blob/deed0436d0c68cbc20a78523fffc67edd12aa25c/google-ads/manage/references/decision-quality.md). Pinned source reviewed 2026-11-17. Platform claims must be checked against current official documentation and observed account settings; source heuristics are not universal thresholds.

<details>
<summary>NotFair MIT notice</summary>

MIT License

Copyright (c) 2026 Toprank Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

</details>
