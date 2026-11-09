---
name: responsible-ai-risk-check
description: Runs a responsible-AI check on a model or AI tool that scores, ranks or decides about people or money (CV screener, credit or fraud score, churn or lead score, a vendor AI tool) - maps its use with the NIST AI RMF functions (Govern, Map, Measure, Manage), measures performance and error rates by group with counts, calibration and fairness metrics, flags the US, UK and EU rules that may apply (EU AI Act high-risk uses and AI literacy, UK assurance techniques, FTC claims, the four-fifths rule of thumb, NYC Local Law 144) for the client's legal adviser, and writes a one-page model card and a risk register with owners, human oversight and monitoring. Not legal advice. Use it before a people-scoring tool goes live, at renewal, or after a complaint.
---

# Responsible AI risk check

## When to use

- A tool will score, rank, filter or decide about customers, applicants, staff or members.
- A vendor sells an AI tool for hiring, lending, pricing, fraud or eligibility.
- A complaint or odd pattern suggests a score treats some groups worse.
- The client wants a short, honest record of what a model does and how it is watched.

This is a technical and practical check, not legal advice. Whether a system is "high-risk" under the EU AI Act, or lawful under employment, credit or data protection law, is for the client's qualified legal adviser.

## What you need

1. **What the system does:** who it scores, what it outputs, what people do with the output, and who can override it.
2. **Who built it** (vendor or in-house), what data it uses, and any documentation (model card, audit, technical sheet).
3. **Outcomes data:** decisions and real outcomes for a recent period, with counts.
4. **Group data, only where the client lawfully holds it** for this purpose, or the vendor's own group results.
5. **Where it is used:** countries and, for hiring, cities (New York City has its own rule).
6. **Access:** level 1 to read reports and exports. Writing the model card or risk register into the client's shared space is level 2 or 3. Changing the live tool's settings is level 3, within the limits you set.

## Steps

### 1. Map the use (NIST "Map")

Write the context in plain words: the decision, the people affected, what happens to them if the system is wrong in each direction, whether they can appeal, and who checks. Note any use the system was not designed for.

### 2. Check the governance basics (NIST "Govern")

A named owner; a record of what the system is for; who may change it; how staff using it are trained (the EU AI Act's AI literacy duty applies to providers and deployers); how complaints reach someone who can act.

### 3. Measure performance (NIST "Measure")

- Overall: the confusion matrix and rates from the `model-and-ai-claim-review` skill, on recent data from the client's own use.
- Calibration if it outputs probabilities.
- By group: selection rate, recall and false positive rate per group, each with counts and an interval. Fairlearn's demographic parity (difference and ratio) and equalized odds summarise these.
- The US four-fifths rule of thumb: a group's selection rate under 80% of the highest group's is generally regarded by US agencies as evidence of adverse impact, but small samples and significance matter both ways. Fairlearn's documentation warns against applying it mechanically. Report it, with a significance test, and send it to the legal adviser.
- Note that fairness measures can conflict; choosing which matters is a decision for the client, made in the open.

### 4. Flag rules that may apply (for the legal adviser)

- **EU:** high-risk uses in the AI Act include credit scoring, CV sorting and worker management, and education scoring. High-risk duties for Annex III uses apply from 2 December 2027 after the AI Omnibus (check the Commission page for changes). AI literacy duties already apply.
- **UK:** no single AI law; DSIT's assurance techniques (impact assessment, bias audit, performance testing and others) are a practical checklist.
- **US:** FTC treats AI claims under existing consumer protection law; the four-fifths rule of thumb in the federal Uniform Guidelines; New York City requires a bias audit within a year before using an automated employment decision tool, a public summary and candidate notices.

### 5. Plan the controls (NIST "Manage")

- Human oversight: who reviews which outputs before action, and with what information.
- Thresholds and actions chosen with the client's costs.
- Monitoring: which rates are rechecked, how often, by group, and the trigger for review.
- A way for affected people to ask for review.
- What to do if the system fails or drifts: pause, fall back to the manual process.

### 6. Write the model card and risk register

Model card (one page): purpose, intended and out-of-scope uses, inputs, owner, performance overall and by group with counts and dates, known limits, monitoring plan. Risk register: risk, likelihood, impact, control, owner, review date.

## Checks

- The use and the people affected are described before any metric.
- Group results show counts; small groups are flagged, not over-read.
- The four-fifths figure, if used, comes with a significance test and a caution.
- Every rule flagged is linked to its official page and marked for legal review.
- Controls have owners and dates.
- No group data was used without a lawful reason the client confirmed.

## Output format

1. **Summary:** use it as is / use with controls / pause, and why.
2. **Context map.**
3. **Governance gaps.**
4. **Performance overall and by group,** with counts.
5. **Rules to check with your legal adviser.**
6. **Controls and monitoring.**
7. **Model card** (one page) and **risk register.**

## Example of good output (short)

*Illustrative structure, not a real business: a logistics firm with 60 staff in the Netherlands and the UK, piloting a vendor's CV-screening tool for warehouse roles. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Summary: pause automatic rejections; use the tool only to sort, with a person reviewing every rejection, until your legal adviser has reviewed it.** CV sorting is listed as a high-risk use under the EU AI Act.
>
> **By group (pilot, last 8 weeks, your voluntary survey data).** Group A: 36 of 120 advanced (30%). Group B: 16 of 80 advanced (20%). Ratio 20 ÷ 30 = 0.67. For reference only, US agencies treat a ratio under 0.8 as a sign of adverse impact; your adviser will say what applies in the Netherlands and the UK. Fisher's exact test: two-sided p = 0.14, so with these small numbers the gap may be chance, but it is too large to ignore.
>
> **Controls.** A named owner (head of operations); a person reviews every rejection; monthly check of advance rates by group; candidates told a tool is used and how to ask for a human review; renewal only after the vendor shares its own group results with counts.
