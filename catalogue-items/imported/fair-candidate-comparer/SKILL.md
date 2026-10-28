---
name: candidate-evaluation
description: "This skill should be used when the user asks to evaluate candidates, compare candidates, debrief, hiring decision, candidate comparison, synthesize feedback, candidate ranking, who should we hire, summarize interviews, interview debrief, candidate assessment, score this transcript, metaview transcript, score this screen, score this interview, rate this candidate, transcript evaluation, interview scoring, or needs to aggregate interview feedback, score an interview transcript against a scorecard, facilitate hiring decisions, or compare candidates against each other."
---

# Candidate Evaluation for Recruiting

## Purpose

Synthesize multi-interviewer feedback into evidence-based hiring recommendations. Reduce bias, surface gaps, and produce structured candidate comparisons that hiring managers can act on.

## Before you start

You need a written scorecard for the role (questions, follow-ups, green and red flags) and the interview transcript or notes. If there is no written scorecard, stop and ask the user to write one first. If you work in a plain chat, ask the user to paste both.

## Use with care

- The AI scores evidence and shows gaps. A person makes every hiring decision. Never let the AI pick who to hire or reject.
- Candidate transcripts and notes are personal data. Before you paste them, check your employment-law and data-protection rules, and your AI tool's data policy. Remove or anonymise candidate names and personal details first (use "Candidate A" and "Candidate B"), and only use a tool your company has approved for candidate data. Rating people with AI carries hiring-bias and legal risk, so never use the ratings as the only basis for a decision.
- If you work in a plain chat with no folders, paste the transcript, the scorecard and any candidate notes into the chat. Ignore the `roles/...` file paths below and ask for the results in the chat.
- The Teamtailor and Metaview parts are paid tools and are optional. Skip them if you do not use them. The scorecards work without them.
- Every rating and recommendation below is a draft for people to review. A person must check the quotes behind each rating before anyone acts on it.

## Transcript Scoring (Single Candidate, Single Stage)

When the user pastes a Metaview transcript (or any interview transcript), produce two files:

### Required Inputs

1. **Transcript** (pasted by user or saved to file)
2. **Stage scorecard**: `roles/[role-name]/scorecards.md` (the rubric with questions, probes, green/red flags)
3. **Teamtailor kit setup**: `roles/[role-name]/teamtailor-setup.md` (kit structure, question names, instruction text)
4. **Candidate context** (if available): `roles/[role-name]/candidates/[name]-outreach.md` or dossier

### Output 1: Teamtailor Scorecard (`candidates/[name]-teamtailor-scorecard.md`)

Maps 1:1 to the interview kit's questions and skills/traits. This is what gets entered into Teamtailor.

**Structure (per question in kit order):**

```markdown
## Q[N]: [Question as asked or as written in the kit]

**[Candidate]'s answer:**
[Summarize what was actually said. Include key quotes.]

**Probe: [Probe text from scorecard]**
[Was it asked? What was the answer? If not asked, note "Not asked" and the impact.]

**Note:** [Analytical note: what this tells us, what's missing, how it compares to the rubric's green/red flags]
```

**After all questions, include:**

- **Logistics section** (comp, availability, notice period, other processes, language)
- **Candidate questions section** (what they asked, assessment of quality)
- **Culture value ratings table** (each trait: rating + key evidence)
- **Summary table for Teamtailor entry** (one-line per question/competency with rating + note)
- **Teamtailor Comment** (blockquote summary for pasting into the kit's comment section on the candidate card)

**Rating scale:** Use the scale in the role's scorecard. If the scorecard has none, use the 1-4 scale in the Rating Scale table further down, and use the same scale for every candidate. Do not mix scales. Rate against the green/red flags in the scorecard, not against other candidates.

### Output 2: Screen Evaluation (`candidates/[name]-screen-evaluation.md`)

The analytical narrative for recruiter/HM decision-making. Grouped by competency theme, not by kit question order.

**Structure:**

```markdown
# Recruiter Screen Evaluation: [Name]

[Header: role, candidate, location, current role, screen date, interviewer, source, profile type]

## Profile vs. Target Persona
[How does this candidate map to the defined personas? Where do they fit, where do they diverge?]

## Competency Ratings
### [N]. [Competency Group]: [Rating] ([Label])
**Evidence for:** [Bullet points with quotes/specifics]
**Evidence against:** [Bullet points with quotes/specifics]
**Why [Rating]:** [Analytical justification]

## Stage Recommendation: [Rating] ([Label])
### Must-Have Gate Check
[Checklist of pass/fail gates]

### Red Flags
[Numbered list of concerns with evidence]

### Sell Points That Resonated
### Notes for [Next Interviewer] (Stage [N] Prep)
[Numbered actionable items: what to test, what to probe, what to watch for]

## Process Gaps (Interviewer Calibration)
[What the interviewer missed: unasked probes, accepted vague answers, skipped questions]
```

### Scoring Rules

1. **Score against the rubric, not your impression.** Use the green/red flags from `scorecards.md` as the primary rating input.
2. **"Not asked" is not "no signal."** If a probe was skipped, note it as a process gap. Rate the competency based on whatever evidence exists, but flag the confidence as low.
3. **Vague answers get low ratings.** "Yeah, I can do that" without specifics is a 2, not a 3. The scorecard instruction text often warns about this explicitly.
4. **Evaluate interviewer execution.** The Process Gaps section is not optional. It's the calibration feedback loop that improves future screens.
5. **Compare to persona, not to other candidates.** The Profile vs. Target Persona section anchors the evaluation in the role requirements, not relative performance.
6. **Observation prompts get scored from the full transcript.** Traits marked "NOT a spoken question" in the kit are rated by reviewing the entire conversation, not a single answer.

### Naming Convention

- `candidates/[firstname-lastname]-teamtailor-scorecard.md`
- `candidates/[firstname-lastname]-screen-evaluation.md`

For stages beyond the recruiter screen, replace "screen" with the stage name (e.g., `[name]-roleplay-evaluation.md`).

---

## Feedback Synthesis Method (Multi-Candidate)

Step-by-step process for turning raw interview feedback into a structured evaluation:

1. **Collect all scorecard data** per candidate per stage
2. **Aggregate competency ratings** across interviewers — don't average ratings. Instead, identify consensus vs disagreement. A 4/5 and 2/5 is not a 3/5 — it's a disagreement that needs discussion.
3. **Extract key evidence** (quotes, examples) for each competency — ratings without evidence are opinions, not assessments
4. **Identify patterns** across the interview panel:
   - Consistent strengths (multiple interviewers, multiple stages)
   - Consistent concerns (same signal from different angles)
   - Mixed signals (disagreement between interviewers on the same competency)
5. **Flag competencies with insufficient data** — if only one interviewer assessed a competency, the signal is thin. Note this as a gap.
6. **Produce a structured summary** with evidence backing every claim — no unsupported assertions

## Decision Framework

How to go from aggregated feedback to a summary a person can decide from. The AI does not pick who to hire or reject. It reports what the evidence shows and what is still open.

### Evidence summary

| Must-have competencies | Nice-to-have competencies | What the evidence shows |
|----------------------|--------------------------|----------------|
| All rated Lean Yes or higher | Most rated Lean Yes or higher | Strong evidence against the bar |
| All rated Lean Yes or higher | Few rated Lean Yes or higher | Meets the bar, thin on extras |
| Most met, 1 borderline | Most met | Depends on how much the one gap matters |
| Any must-have rated Strong No | Not applicable | Clear gap against the bar |
| Mixed signals on must-haves | Not applicable | More evidence needed before anyone decides |

### Confidence Levels

- **High** — 3+ interviewers agree, strong evidence, no major gaps in assessment coverage
- **Medium** — General agreement but some mixed signals, adequate evidence overall
- **Low** — Significant disagreement between interviewers, thin evidence, key competency untested

## Candidate Comparison Matrix

Weighted comparison methodology for evaluating multiple candidates against each other and the bar.

1. List must-have competencies (weight: 3x) and nice-to-haves (weight: 1x)
2. Rate each candidate on each competency using aggregated scorecard data
3. Calculate weighted scores
4. Produce a visual matrix comparing candidates side-by-side
5. Don't let the math override judgment — use the matrix to surface the conversation, not end it

### Template

```markdown
| Competency | Weight | Candidate A | Candidate B | Candidate C |
|------------|--------|-------------|-------------|-------------|
| [Must-have 1] | 3 | [Rating + evidence] | [Rating + evidence] | [Rating + evidence] |
| [Must-have 2] | 3 | | | |
| [Must-have 3] | 3 | | | |
| [Nice-to-have 1] | 1 | | | |
| [Nice-to-have 2] | 1 | | | |
| **Weighted Total** | | **X** | **Y** | **Z** |
```

### Rating Scale

Use a consistent scale across all competencies:

| Rating | Label | Meaning |
|--------|-------|---------|
| 4 | Strong Yes | Exceeds the bar, strong evidence |
| 3 | Lean Yes | Meets the bar, adequate evidence |
| 2 | Lean No | Below the bar, or insufficient evidence |
| 1 | Strong No | Clearly does not meet the bar |

## Bias Mitigation

Common biases to check for, with the fix. The full checklist is in **`references/bias-checklist.md`**.

- **Halo and horn effects.** One strong or weak signal colors everything. Rate each competency on its own evidence.
- **Anchoring and recency.** The first opinion or the latest interview dominates. Collect independent scorecards before any debrief.
- **Similarity bias.** "Culture fit" or "reminds me of myself" stands in for evidence. Name the specific behavior seen.
- **Contrast effect.** Candidates are compared to each other, not to the bar. Compare to the job requirements.
- **Confirmation bias.** Seek contradictory evidence for every strong opinion.

## Debrief Facilitation

Keep the debrief short and evidence-based. Collect every scorecard before the meeting. Talk about the disagreements, not the consensus. Say what was not assessed. Let the junior interviewers speak first. The hiring manager makes the decision with input from the panel.

## Output Format

Standard structure for candidate evaluation deliverables saved to `roles/[role-name]/reports/`. It reports evidence-based ratings and open questions only. It does not label anyone Hire or No Hire. A person makes that call.

```markdown
# Candidate Evaluation: [Role Title]
**Date:** [Date] | **Evaluator:** [Name]
**Candidates evaluated:** [N]

## Comparison Matrix
[Weighted comparison table]

## Individual Summaries

### [Candidate Name]
**Evidence rating:** [rating from the scale used for every candidate]
**Confidence:** High / Medium / Low

**Strengths (with evidence):**
- [Strength 1]: [Evidence from interview stage X]

**Concerns (with evidence):**
- [Concern 1]: [Evidence from interview stage Y]

**Gaps in assessment:**
- [Competency not sufficiently tested]

**Interviewer consensus:**
| Interviewer | Stage | Rating | Key Evidence |
|-------------|-------|--------|--------------|
| [Name] | [Stage] | [Rating] | [Evidence] |

[Repeat for each candidate]

## Open questions for the person who decides
[What the evidence does not settle, and what to ask or test next. No hire or reject label.]

## Debrief Notes
[Key discussion points, disagreements resolved, action items]
```

## What next

For a clean table of finalists, use the Candidate comparison table builder.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Candidate comparison table builder](https://useaiblocks.com/prompts/candidate-comparison-table-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Reference Files

You are **strongly encouraged** to read the reference files

- **`references/decision-frameworks.md`** — Weighted scorecard method, bar-raiser approach, portfolio hiring, consensus vs veto models.
- **`references/bias-checklist.md`** — Pre-debrief and during-debrief bias check questions.
