---
name: discovery-to-demo-script
description: Turns discovery notes into a tailored demo script for a B2B buyer. Lists the buyer's top three problems in their words, who is in the room and what each person needs to see, then builds a timed demo that shows the result for each problem first, with talking points, questions to ask, a do-not-show list and a same-day follow-up email. Flags gaps in discovery before building. Use before any software, IT or equipment demo where technical and business people will attend.
---

# Discovery to demo script

A demo is the buyer's first look at their own problem being solved. This skill builds it from what the buyer said, not from the product menu, and leaves out everything that does not help this buyer decide.

## When to use

- A demo is booked and discovery notes, a call recording or an email thread exist.
- A previous demo went badly and the team wants to rebuild it around the buyer.
- A new rep or the founder needs a script they can run without a sales engineer.

Not for: public webinars (no single buyer to tailor to) or a demo with no discovery at all. For that, run the `discovery-gap-check` prompt first.

## What you need

**Access:** level 1 to read the CRM record, notes and transcripts. Level 2 to save the script and follow-up as drafts and to prepare demo data in a sandbox. Level 3 to log the demo in the CRM, move the deal stage and send the approved follow-up to named contacts within the client's limits.

- Discovery notes or a transcript, in the buyer's words where possible.
- Who will attend: names or roles, and what each cares about.
- The buyer's current tools and any integration they asked about.
- What a yes looks like for this deal and who decides.
- The product facts: what it does today, what is roadmap (with dates the product team has committed to in writing), and what it does not do.
- The demo environment and what sample data is available.

## Steps

1. **Check discovery.** List what is known and unknown: problems, attendees, current setup, decision process, timing, success measure. If the top problems or the attendees are unknown, stop and send the gaps back as questions. A demo built on guesses shows the wrong things.
2. **Write the top three problems.** In the buyer's words, ranked by how much they cost the buyer. If the notes give a cost (hours, errors, money), include it with its source. If not, write "cost not yet known".
3. **Map the room.** For each attendee: role, what they need to see, their likely worry. A finance lead wants the cost case; an IT lead wants integration, security and support; daily users want their task to get easier.
4. **Pick the proof for each problem.** For each problem, the one screen, workflow or result that solves it. Use the buyer's kind of data: their product names, their volumes, their terms. Mark anything that needs configuration or is roadmap.
5. **Build backwards.** Open with the buyer's situation in their words and the result they want. Show the result for problem one first, then how it works only as far as they need. Then problem two, then three. Value goes at the start, not the end.
6. **Write the do-not-show list.** Features that add nothing for this buyer, unfinished features, anything that invites a tangent. Note why each is excluded.
7. **Add questions.** After each problem, one question that checks it landed ("Is that how your team would count stock today?") and one that moves the deal ("Who else would need to see this?").
8. **Prepare for the technical person.** Three likely technical questions with honest answers, and what to say if the answer is "not today". Pull from the `solution-summary-and-objections` skill if an objection sheet exists.
9. **Time it.** Fit the plan inside the booked slot with real time left for questions. If it does not fit, cut problem three, not the questions.
10. **Draft the same-day follow-up.** What they saw against each problem, open questions with owners and dates, the agreed next step.
11. **After the demo.** [L3] Log the demo, attendees, reactions and open questions in the CRM, update the deal stage, and send the approved follow-up to the named contacts. At lower levels, these wait as drafts.

## Checks

- Every problem is in the buyer's words and comes from the notes, not from the product's feature list.
- Every claim on screen is true today; roadmap items are labelled with committed dates only.
- Nothing on the do-not-show list appears in the flow.
- Each attendee has at least one moment aimed at them.
- Demo data is sample or sandbox data, never a live customer's records.
- The follow-up repeats nothing the buyer did not see.

## Output format

1. **The buyer's three problems** (ranked, in their words, with cost if known).
2. **Who is in the room** (table: person or role, what they need to see, likely worry).
3. **Demo flow** (timed table: minute, what we show, problem it answers, talking point, question to ask).
4. **Do-not-show list** (feature, why excluded).
5. **Technical questions to expect** (question, honest answer, follow-up question).
6. **Same-day follow-up email** (draft).
7. **Gaps** marked `[NEED: ...]`.

## Example of good output

*Illustrative structure, not a real business: warehouse scanning software, demoing to a three-site distributor. Copy the shape, never the content: every fact comes from the client's own context.*

**The buyer's three problems**
1. "We ship the wrong item about twice a week and only find out from the customer." (Ops manager; cost not yet known.)
2. "Stock counts take a whole Saturday at each site."
3. "Our ERP is old and IT won't touch anything that writes to it."

**Who is in the room**

| Person | Needs to see | Likely worry |
|---|---|---|
| Ops manager | A mis-pick caught before it ships | Will pickers actually use it? |
| IT lead | How data reaches the ERP | Writes to a fragile system |
| Finance director | Fewer returns, shorter counts | Cost and payback |

**Demo flow (30 minutes)**

| Min | What we show | Problem | Talking point | Question |
|---|---|---|---|---|
| 0-3 | Their situation, read back | All | "Here's what you told us." | "Anything changed since?" |
| 3-10 | Picker scans the wrong item; handheld blocks it | 1 | The check happens at the shelf, not at the customer | "How often would that have shipped?" |
| 10-16 | Rolling count by aisle during a shift | 2 | Counts move into normal hours | "Who runs the Saturday count now?" |
| 16-22 | Nightly export file, read-only to the ERP | 3 | Nothing writes into the ERP unless IT chooses | "Would a file drop suit your IT rules?" |
| 22-30 | Questions and next step | | | "Who else needs to see this?" |

**Do not show:** the route-planning module (they run no vans), the dashboard builder (tangent), the beta voice picking (not released).

**Same-day follow-up (draft):** "Thanks for today. You saw three things: a wrong item blocked at the shelf, counts by aisle during the shift, and a nightly file your ERP can read without us writing to it. Open: your IT lead will check whether a file drop meets your rules (by Friday); we will send the export format (by Wednesday). Next step: a 30-minute call with IT on the export."
