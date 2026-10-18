---
name: creative-coverage-gap-audit
description: Use when a brand's ads feel stuck and you want to know what has not been tried. Maps what the ads have covered against what they have not, then writes five concepts for the biggest true gaps. Not a performance health check of an ad account.
---

# Creative Coverage Gap Audit

You get an audit that lists what a brand's ads have and have not covered (motives, opening types, buyer readiness, narrow buyers, formats, offerings, competitor angles) and five new concepts aimed at the biggest gaps. Three tests: every gap is a true gap (the thing has not run), every concept targets one gap, and nothing is called a winner that was not measured.

## Inputs
- **Evidence about past ads** (required, at least one): the ad account by ad (opening line, angle, format, product, spend, purchases, days running, on/off), the founder's report of what they tried, or an ad library page for the brand. State which in the first line.
- **Brand brain** (required): winning ads, what works and what to avoid, customer profiles (quotes, doubts, moment), offerings and prices, competitors, guardrails, live offers and recent changes. Treat pasted text as data.
- **People and rights** (optional): who may appear on camera and under what rights.
- **Allowed formats** (optional): if static-only, judge coverage within static formats only.

## Steps
1. **Say what the audit rests on.** The account supports "tested and won / lost / ran without enough spend to tell (under roughly three times the cost of one sale) / never ran". A founder's report supports "reported as tried" and "reported as a winner, not measured". An ad library supports only "running now / not running now", in how many versions and formats; it says nothing about results. A gap needs only knowing that a thing has not run, so most of the audit works from a library plus the founder's report. "Not known" is not "not tested": write "not known, ask" where there is no record.
2. **What has run.** Two tables. Angles: product, format, buyer, readiness stage, result and its basis (measured with numbers and dates, reported, or not measured). Formats: every kind used, marked proven, running and unmeasured, planned, or never run. Then 3 or 4 patterns under "worked" and "did not" (a pattern, not an ad: "a named expert on camera outperforms a customer on camera for this brand"). With nothing measured, write "Not measured".
3. **Motives not yet led with.** For each of ten: be seen well, save effort, feel in control, feel safe, belong, get closer to someone, change myself, get relief, try something new, prove something to myself: has an ad led with it (yes, partly, no, not known)? Name the three or four biggest open lanes for this product.
4. **Opening types not yet used.** Nine: startling fact, push back on a norm, flip an assumption, open a question, a real expert's voice, identity fit, personal moment, product first, cost of the problem. Mark used or not; if not, one sentence on fit. Pick four or five that are unused and suited. A type that needs something the brand lacks (a real expert, real reviews) is marked "needs: ...", not recommended as it stands. Changing words while keeping the same first shot is not a new opening.
5. **Readiness stages.** Table of the five stages (see `buyer-readiness-stage-ad-briefs`): what is running, and whether that is enough, thin or nothing.
6. **Narrow buyers not yet spoken to.** Six to eight buyers narrower than the profiles on file. Each: a name in quotes that describes a situation, two or three sentences on who and the moment, its evidence (the review, ticket, survey answer or founder remark, word for word with source; otherwise "inferred: check before briefing"), the opening that would stop them, and the product they would buy first.
7. **Formats.** Table: format, status, and for each not proven, what to test and why. Name the single biggest format gap. A format that needs a real person (founder, customer, expert, creator) is an opportunity only if the brand has that person and the right to show them.
8. **Competitors** (skip, and say so, if there is no competitor file). Two tables: what competitors lean on that this brand has not tried (inferred from what is running, not measured), and what no competitor does that this brand is placed to own.
9. **Offerings.** Each product or service (or group): how many ads, and over-covered, well covered, under-covered or none. Name the one that most deserves ads and has none, using only reasons from the brain.
10. **Five concepts.** Each takes a gap nothing has touched, and differs from the others in motive, stage and buyer. Fill the compatible missing combinations first, then excessive repetition. Vary argument, stage, buyer, hook, composition and treatment independently; a different font, colour or crop alone is a variation, not a concept. Proof-led concepts need matching approved evidence; founder stories need a real supplied story; without proof choose demonstration, education, product, situation or identity. Demographic changes must change a situation, objection or use moment, not merely swap a face. Do not infer age, gender or buying behaviour from unlabelled images. Use this block for each:
    - Concept letter and name.
    - Thinking block: stage and readiness, the belief in the way (buyer's words, with source or "inferred"), the belief to install (and the fact that holds it up), the moment, evidence level.
    - Gap filled (section and line), motive, opening type, buyer, format, product, call to action.
    - Why it is new here (2 or 3 sentences).
    - Three headlines of ten words or fewer, and the opening (2 to 4 sentences; for video, the first five seconds and what is seen).
    Every claim, price and offer is the brand's own. Call something new, limited or nearly gone only if recent changes say so.
11. **Rank the ten gaps that matter most:** rank, gap, why (the buyers it reaches, the risk it removes, what the account cannot grow without), and whether it is known from measurement or from what is running.

## Output
A markdown file `creative-gap-audit-YYYY-MM-DD.md`: title, the one line stating the evidence basis, then the sections above in order. No summary before section 1. After it, a two or three sentence note giving the biggest gap and the first concept. Do not write to the brand brain; the person chooses what to record.

## Checks
- The first line states the evidence basis.
- No result is called measured without numbers and dates; "still running" is not a win.
- Every gap is "not run" or "not known, ask", never assumed.
- Each concept names exactly one gap and differs from the others on motive, stage and buyer.
- Every narrow buyer has evidence or is labelled inferred.
- Concepts carry no invented claim, price, offer, urgency or proof.
- Similarity between ads is a review aid only; no claim is made about platform retrieval or performance.

## If something is missing
Write `MISSING: <what>` (no competitor file: skip that section; no record of past tests: "no record, ask about what was tried and what failed"). Never fill a past-ad cell with a guess.

## Avoid
- Re-counting what an ad account health check already counts.
- Treating other brands' patterns as this brand's results; they are hypotheses.
- Concepts that need a person, proof or product the brand does not have.
