---
name: candidate-comms
description: "This skill should be used when the user asks to write a candidate email, rejection message, schedule interview, status update, offer letter, interview confirmation, how to reject, welcome email, interview prep email, candidate update, between rounds email, onboarding email, feedback to candidate, or needs to communicate with candidates at any stage of the interview process."
---

# Candidate Communications for Recruiting

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **An audit report** with the [Fair candidate comparer](https://useaiblocks.com/skills/fair-candidate-comparer). Bring your notes, a transcript (optional), a document (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** This is a writing job. Claude, ChatGPT or Gemini all do it well, with nothing to install.
<!-- /needs -->

## Purpose

Provide ready-to-customize communications for every candidate touchpoint from screening invite through onboarding welcome. Good candidate comms are fast, transparent, personalized, and respectful of the candidate's time.

## How to run this skill

1. **Collect the facts.** You need the candidate's first name, the role, the stage, the next step with its date, and who signs the message. One real detail from your conversation makes it personal. Ask once for what is missing. If the user cannot give a date, reason or detail, write a clear `[BRACKET]` in the draft. Never invent a date, a salary, a reason or something the candidate said.
2. **Find the stage** in the map below, then open the matching template in `references/comms-templates.md`.
3. **Draft the message** from that template. Keep to the principles: reply in a day, give a real timeline, one action, short paragraphs.
4. **For a rejection,** follow the Rejection Framework. Share only what the table allows. Never give scores, other candidates' names or what an interviewer said.
5. **For an offer,** write the call script or email structure only. Pay and terms come from the user, and HR or a lawyer should check the written offer.
6. **Stop and say so** if the user wants first contact with someone who has not replied (use the Candidate outreach drafter), or the message is about a legal dispute or a dismissal (send them to HR or a lawyer).

### Output format

```
Stage: <stage>
Subject: <subject line>
<email, two or three sentences per paragraph>
One ask for the candidate: <the single action>
Send: <when, from the timing table>
Tone options: <warmer line> / <more direct line>
Still to fill: <any [BRACKET] or missing fact>
```

## Communication Principles

1. **Speed wins** — respond within 24 hours at every stage. 48hrs max. Candidates evaluate you by your responsiveness.
2. **Transparency builds trust** — share timeline, next steps, and process clearly. "We'll get back to you in 5 business days" beats "soon."
3. **Personalization scales** — at minimum: use their name, reference the specific role, mention something from the conversation. Never send a fully generic template.
4. **Tone matches stage** — early stages are warmer and more inviting; later stages are more substantive and direct. Rejection messages are always respectful.
5. **One action per email** — what do you need them to do? Make it crystal clear.
6. **Mobile-first** — most candidates read on phones. Keep paragraphs short (2-3 sentences max).

## Stage-Based Communication Map

What to send at each pipeline transition:

| Pipeline Stage | Communication | Timing | Channel |
|---------------|--------------|--------|---------|
| Identified → Contacted | Initial outreach | Day 0 | Not covered here. Use the Candidate outreach drafter |
| Responded (positive) → Screening | Screening invite | Within 24hrs of response | Email |
| After Screening (advance) | Next stage confirmation + prep | Within 24hrs of decision | Email |
| After Screening (reject) | Rejection (stage-appropriate) | Within 48hrs of decision | Email |
| Between interview rounds | Status update / encouragement | If gap > 3 days | Email |
| After each interview round | Thank you + next steps | Same day or next morning | Email |
| Submitted to HM | "Your profile is with the team" update | Day of submission | Email |
| HM pass | Advancement notification + prep | Within 24hrs | Email |
| HM reject | Rejection (stage-appropriate) | Within 48hrs | Email/Phone |
| Interview scheduled | Confirmation with details + prep | Within 24hrs of scheduling | Email + calendar invite |
| After final round | Timeline for decision | Same day | Email |
| Offer | Verbal offer call + written follow-up | ASAP after decision | Phone + Email |
| Offer accepted | Welcome + onboarding info | Same day | Email |
| Offer declined | Graceful close + silver medalist flag | Within 24hrs | Email |
| Candidate withdraws | Understanding close | Within 24hrs | Phone preferred |

## Rejection Framework

The most important communications to get right.

### Principles

- Always thank them for their time
- Be honest about the reason without being hurtful
- Be specific enough to be respectful, vague enough to be safe
- The candidate should feel respected, even if disappointed
- Your employer brand depends on how you reject

### What Feedback to Share by Stage

| Stage | What to Share | What NOT to Share |
|-------|--------------|-------------------|
| Screening reject | "Role requires X, which doesn't align with your current experience" | Specific scoring, comparison to other candidates |
| HM reject | "After review, the team is looking for stronger [area]" | Which interviewer said what, internal deliberations |
| Interview reject | "The team felt [general area] wasn't quite the match they needed" | Specific scores, quotes from feedback, personal critiques |
| Final round reject | More detailed feedback if requested (use judgment) | Comparative rankings, internal politics |

### Tone by Stage Depth

- **Early rejection (screening):** Brief, warm, professional. 3-4 sentences.
- **Mid-process rejection (HM review, first round):** More personal, acknowledge effort. 5-6 sentences.
- **Late rejection (final round):** Phone call preferred, offer to provide feedback, silver medalist consideration. Detailed.

## Offer Communications

### Verbal Offer Script Structure

1. Excitement and congratulations
2. Confirm continued interest
3. Walk through package (strongest element first)
4. Pause and listen
5. Next steps and timeline

### Written Offer Structure

- **Subject:** "Your Offer from [Company] — [Role Title]"
- **Open:** genuine excitement
- **Package table** (clear, scannable)
- **Benefits highlights** (top 3-5)
- **Start date and logistics**
- **Decision timeline**
- **Who to contact with questions**

## Timing & SLAs

| Communication | SLA | Escalation |
|--------------|-----|-----------|
| Response to candidate question | 24 hrs | Flag to hiring manager |
| Post-interview next steps | 24 hrs | Ping debrief participants |
| Rejection after decision | 48 hrs | Never delay rejections |
| Offer presentation | Same day as decision | Coordinate with comp/HR |
| Scheduling | 48 hrs | Backup interviewers |
| Between-stage update | Every 3 business days of silence | Proactive "no news" update |

## Tone Adaptation

- Read the candidate's communication style and match it
- Engineers often prefer direct, no-fluff communication
- Executives expect more formality and strategic framing
- Junior candidates need more guidance and reassurance
- When in doubt, err professional-warm, never corporate-cold

## Reference Files

Read the reference file before you draft:

- **`references/comms-templates.md`** — Ready-to-customize templates for every stage.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Applicant evidence and hiring reply drafts](https://useaiblocks.com/skills/hiring-pipeline-runner).
- The [Candidate sourcing plan writer](https://useaiblocks.com/skills/candidate-sourcing-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
