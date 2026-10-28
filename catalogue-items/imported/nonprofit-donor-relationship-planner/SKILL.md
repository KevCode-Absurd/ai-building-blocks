---
name: nonprofit-donor-pipeline
description: "Builds and manages donor pipeline and moves-management systems: prospect identification, qualification, cultivation move sequencing, solicitation staging, and stage-to-stage conversion tracking. Use when a user asks to build a moves-management plan, set up pipeline/gift range stages, triage a prospect list, write a portfolio's next-move plan, calculate stage conversion rates, or diagnose why prospects are stalling in a stage. Does not cover setting ask amounts or structuring major-gift proposals (use nonprofit-major-gifts), thank-you/acknowledgment mechanics and lapsed-donor win-back (use nonprofit-donor-retention), or CRM software selection/configuration (use nonprofit-donor-crm)."
license: MIT
metadata:
  supervision: "review"
  supervision_note: "Moves management runs on donor records and personal information."
  date_added: "2026-09-07"
  date_added_source: "git:1860ed47a83901ff5e6d45abc4a2ef05be8fd4cd"
---

# Donor Pipeline & Moves Management

> Added by AI Blocks: donor records hold personal information. Before the person pastes any records, ask them to replace names, emails, phone numbers and addresses with IDs, and to check their organisation's data policy. If records arrive with names or contact details, do not repeat them in your answer. Use the IDs or row numbers instead.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **A chat AI that can read your files:** The skill works from records and drafts you provide. Research tasks also need current, checked public sources.
<!-- /needs -->

## When to Use This Skill

Use this skill to build, run, or audit the system that moves individual donors and prospects
through fundraising stages — not to decide what to ask them for (that's `nonprofit-major-gifts`)
and not to design the thank-you/retention mechanics after a gift lands (that's
`nonprofit-donor-retention`). Typical triggers:

- "Build a moves-management pipeline for our major-donor prospects"
- "Set up gift-range/pipeline stages for our development team"
- "Review this prospect list and tell me who's stalled"
- "Write next-move plans for a portfolio of 40 prospects"
- "What's our stage-to-stage conversion rate and where's the bottleneck?"
- "How many qualified prospects do we need to hit our fundraising goal?"

## Core Framework: Moves Management

Moves management (a term coined at Cornell's fundraising program, dating to David Dunlop) is the
discipline of deliberately advancing a prospect's relationship with the organization through a
sequence of stages via specific, planned actions ("moves"). Treat every prospect as sitting in
exactly one stage at a time:

1. **Identification** — Suspect enters the pipeline from a data source: wealth screening flags,
   board/staff referral, event sign-in, volunteer roster, grateful-client list, digital engagement
   score. Not yet a "prospect" until minimally qualified.
2. **Qualification** — Confirm capacity (ability to give), affinity (connection to mission), and
   propensity (giving history/philanthropic behavior) — the standard "linkage, ability, interest"
   (LAI) triage used by prospect researchers. Assign a qualification rating (e.g., A/B/C or
   $ capacity band) and a suggested portfolio owner.
3. **Cultivation** — A sequence of relationship-building moves (1:1 visits, tours, small
   convenings, briefings, volunteer roles) intended to deepen affinity and confirm interest area.
   Each move should have a stated purpose tied to what you still need to learn or build.
4. **Solicitation** — The ask itself. Pipeline work ends at "ready to solicit" and hands off ask
   strategy, amount-setting, and proposal structure to `nonprofit-major-gifts`; for
   pipeline purposes, track only that the ask stage was entered, the date, and the outcome.
5. **Stewardship** — Post-gift relationship maintenance and impact reporting. Pipeline tracking
   should log that a donor moved to stewardship, but acknowledgment workflows, thank-you SLAs, and
   the donor journey itself belong to `nonprofit-donor-retention`.

## Standard Deliverables

1. **Pipeline stage matrix** — columns: Stage, Definition, Entry Criteria, Exit Criteria, Typical
   Duration, Required Moves, Owner. Set explicit time-in-stage caps (e.g., no prospect sits in
   Qualification longer than 90 days without a disposition) so stalls are visible, not implicit.
2. **Portfolio move plan** — per prospect: current stage, last move date, next move (specific
   action + date + purpose), rating, portfolio owner. Standard portfolio size for a major-gift
   officer is 100-150 active prospects (fewer if the portfolio skews principal-gift).
3. **Pipeline/funnel report** — count and $ value of prospects at each stage, converted to a
   funnel visual, run monthly at minimum. Pair with a **stage conversion rate** (% moving
   Identification→Qualification→Cultivation→Solicitation→Closed) to find the leaking stage.
4. **Prospect rating scale** — document the capacity bands and LAI scoring rubric used, so ratings
   are consistent across gift officers.

> Added by AI Blocks: the numbers in this skill (a 30-50% close rate, 100-150 prospects per officer, a 60-90 day stall window) are rules of thumb with no source. Replace them with your own history when you have it, and say so in the plan. The skills named here (`nonprofit-major-gifts`, `nonprofit-donor-retention`, `nonprofit-annual-appeals`) are not included. Tell the person which hand-offs you skipped.

## Concrete Steps

1. Pull all active donor/prospect records and bucket each into exactly one current stage using the
   entry/exit criteria above — do not allow a prospect to sit unassigned.
2. For each prospect with no move logged in the last 60-90 days (a "stalled" prospect), flag for
   triage: either assign a next move with a date, downgrade the rating, or move to a
   low-touch/annual-appeal track (handoff point to `nonprofit-annual-appeals` mass channels).
3. Calculate the pipeline math backward from the goal: if the major-gift goal is $2M and average
   major gift is $25K, you need roughly 80 closed asks; at a typical 30-50% solicitation-to-close
   rate, you need 160-270 prospects actively in Solicitation-ready status, which in turn requires a
   qualification pipeline several multiples larger — build this ratio table explicitly rather than
   asserting a headcount.
4. Assign portfolios by rating and relationship fit, capping each officer near 100-150 prospects.
5. Draft next-move plans: each move must specify purpose (what question it answers or what
   relationship step it advances), not just an activity ("coffee meeting" is not a move; "coffee
   meeting to gauge interest in the new clinic building before drafting a proposal" is).
6. Set a recurring pipeline review cadence (weekly for officers, monthly for the ED/board
   development committee) reporting stage counts, $ value by stage, and stalled-prospect counts.
7. Recalculate conversion rates quarterly and diagnose the weakest stage transition before adding
   more top-of-funnel volume — a common failure mode is chasing more suspects while
   Cultivation→Solicitation conversion is the actual bottleneck.

## Common Failure Modes

- **Ghost pipeline**: prospects listed in the CRM with no stage movement in 6+ months and no
  disposition decision — audit and clear these quarterly.
- **Stage skipping**: soliciting a prospect who was never truly qualified, producing low close
  rates and donor fatigue; enforce exit criteria before allowing a stage transition.
- **Officer hoarding**: gift officers holding oversized portfolios "just in case," diluting
  attention; cap portfolio size and require a reassignment trigger after a set stall period.
- **No move specificity**: "keep in touch" logged as a move — reject vague moves; require a stated
  purpose and next action date.
- **Conflating qualification with wealth alone**: capacity without affinity or propensity produces
  wasted cultivation time; always score all three legs of LAI.

## For Advisors

When engaging as a consultant, open with a **pipeline health audit** before recommending new
tactics: pull stage counts, time-in-stage, and conversion rates first — a client asking for "more
major donor training" often actually has a stalled-Cultivation problem that no amount of training
fixes. Present findings to the board/ED as a funnel diagram with the weakest transition
highlighted, and frame recommendations as capacity questions ("you have enough suspects; you lack
qualification bandwidth") rather than generic best-practice lists. Recommend the client formalize
the stage matrix and portfolio caps in a written gift officer job aid — the unwritten pipeline is
the single most common root cause of inconsistent major-gift performance in small-to-mid shops.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Weekly work review planner](https://useaiblocks.com/skills/weekly-review-guide). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
