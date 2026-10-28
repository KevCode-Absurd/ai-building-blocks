---
name: case-competition-slide-deck-builder
description: Create an answer-first case competition or strategy deck with editable charts, a financial bridge, rollout gates and backup answers from a supplied case and rubric.
---

# Case competition deck

Build an answer-first recommendation deck for a judged case competition or a strategy decision. The method is the upstream case method in [SKILL.upstream.md](SKILL.upstream.md): answer first, complete-sentence titles, one chart per analysis slide, financial checks, an implementation plan and backup slides for questions.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text, your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can run Python to build the PowerPoint file with real charts.
- **PowerPoint or Google Slides:** You edit and rehearse the final deck there.
<!-- /needs -->

## What you need

Ask once for anything missing. Never invent it.

- **The case brief**: the situation, the decision and any limits. If it is missing, stop and ask.
- **The judging rubric and time limit**: slide count and speaking time depend on them. If missing, say "no rubric given" and use the standard structure below.
- **Your analysis and numbers**: market size, costs, prices, timelines, each with its source. If you only have the brief, do the analysis from the brief, label every number as an assumption and say so on the slide.
- **Team name and date** (optional): used on the title slide.
- **To build the editable PowerPoint file**: an AI that can run Python with `python-pptx` installed. Without that, hand back the slide-by-slide outline in "No code" below.

## Steps

1. **Read the case and the rubric.** Write the decision in one sentence.
2. **Develop the answer.** Use the upstream method: one recommendation, two or three reasons that do not overlap, and the evidence for each. Keep facts apart from assumptions.
3. **Write the slides as a deck spec.** Standard order: title, executive summary, context, two or three analysis slides, financials, roadmap with rollout gates, risks, appendix divider, backup slides. Every title is a full sentence that states the takeaway. The executive summary holds the recommendation, the reasons and the quantified impact.
4. **Run the titles test.** Read only the titles in order. They must tell the whole story. Rewrite any that read as labels.
5. **Check the numbers.** Totals add up, units are stated, every figure has a source note or is marked as an assumption. Do not use made-up market data to fill a gap. Write "assumption: ..." or "not available".
6. **Build the file.** Read [launch-tools/USAGE.md](launch-tools/USAGE.md). Run `python launch-tools/build_case.py <your-spec>.json case.pptx` from the package folder. Use `launch-tools/build_case.py`, not the upstream script, which only draws chart placeholders. Each `analysis` and `financials` slide needs a `chart` with real `categories` and `series` values. The included `sample.json` is synthetic. Replace it with the user's case.
7. **Render and inspect every slide.** Check titles fit, labels are readable, negative values and units are right, and source notes are present. Fix and rebuild.

## No code

If you cannot run Python, hand back the deck as an outline instead. For each slide give: slide number, type, the full-sentence title, the body points, the chart data as a small table (categories and values) with chart type, and the source note. Say it is an outline to build in PowerPoint or Google Slides.

## What you hand back

- The deck file `case.pptx`, or the outline if you could not build it.
- A list of the slide titles in order, so the user can run the titles test.
- A list of assumptions and open questions, so the team knows what to confirm.
- The top five questions judges are likely to ask, each matched to a backup slide.

Keep the main story short and put depth in the appendix. The recommendation must be on the slide after the title.

Upstream method and layout: Calvinkub, MIT. AI Blocks added this entrypoint and compatibility helpers after a 22 October 2026 sample check. That check covers the retained fixture; it does not establish quality for every case.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [PowerPoint deck change reviewer](https://useaiblocks.com/skills/powerpoint-deck-change-reviewer). It takes the slide deck.
- The [PowerPoint accessibility reviewer](https://useaiblocks.com/skills/powerpoint-accessibility-reviewer). It takes the slide deck.
- The [Excel to PowerPoint number checker](https://useaiblocks.com/skills/excel-powerpoint-number-checker). It takes the slide deck.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
