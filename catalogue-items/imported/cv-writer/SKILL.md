---
name: cv-generator
description: "Generate professional, ATS-optimized CVs for FlowCV, Canva, Google Docs, or Word. Handles multi-source merging, JD targeting, seniority adaptation, and humanized rewriting. Outputs paste-ready text with an ATS flaw report and improvement suggestions."
category: content
risk: safe
source: community
date_added: "2026-06-06"
author: "WHOISABHISHEKADHIKARI"
user-invokable: true
tags:
  - cv
  - resume
  - ats
  - career
  - job-application
  - career-change
---

# CV Generator Skill — FlowCV / Canva Edition

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Your resume** (yours): your resume or CV, pasted or attached.
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.
- **The job description** (yours): the role's title, team, duties and level, as a job post or plain notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your resume, source text, the job description. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use

Use this skill when you need to:
- Generate a professional, ATS-optimized CV from multiple sources (LinkedIn, GitHub, Portfolio).
- Tailor an existing CV for a specific Job Description (JD).
- Improve the language, metrics, and structure of a draft resume.
- Prepare a paste-ready version of your CV for tools like FlowCV or Canva.

Turns raw profile data into a polished, ATS-ready CV. Outputs a paste-ready plain-text
version formatted for FlowCV, Canva, Google Docs, or Word — with a flaw report and
missing-info checklist.

---

## What to give it

- Your background in at least one form: LinkedIn text or PDF, old CVs, or a GitHub or portfolio link.
- The job post, if the CV is for one job. It is needed for the keyword match. With no target role you get a clean general CV, but no keyword match. To rework the layout of a CV you already have, use Resume layout editor.
- Links need web access. If your AI cannot open a link, paste the text instead.

## Core steps

1. Gather sources and merge them. Remove repeats and keep dates exactly as written.
2. Match your wording to the job post, without adding skills or titles you do not have.
3. Flag gaps and ask for real figures. Never fill them in.
4. Return the result in this order: (a) the CV text, ready to paste, (b) the flaw report for applicant filters, (c) the missing-info checklist, (d) notes on every reworded line.
5. Next steps: paste the CV into the chosen tool, then use the change notes and the missing-info checklist to fill the gaps before you apply.

The detailed guide below has the full procedure.

## Not for

- A cover letter. This skill only makes the CV.
- Jobs that need a portfolio or a formal application form.
- Adding skills or jobs you do not have.

## Limitations

- **No hallucination.** Never invent a title, company, date, degree, cert, skill, metric, or award.
- **No fake metrics.** If the user says "we grew a lot", ask for specifics — never insert a percentage.
- **Respect source truth.** "Junior Developer" stays "Junior Developer" — suggest a reframe if needed; never silently change it.
- **No silent changes.** If something is materially reworded, note the change.
- **One version at a time.** Complete the CV before offering variants.
- **Privacy.** Do not expose full home address, national ID, DOB, marital status, or religion unless the user's target market requires it.
- **No keyword stuffing.** Adding skills the user does not have is fraud. Flag gaps; never fabricate.
- **OCR warning.** Show this only when a file was scanned and read by OCR. Display before continuing: "OCR was used — please verify the extracted text for accuracy."

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Resume parsing checker](https://useaiblocks.com/skills/agency-engineering-ats-validator-architect). It takes the resume.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
