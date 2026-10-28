---
name: methodology-explainer
description: Explain analysis methodology to diverse audiences. Use when documenting 'how we did this' sections, building trust through transparency, or teaching analytical approaches to stakeholders.
---

# When to use

Any time you deliver findings that require the audience to trust the method — A/B tests, attribution models, forecasts, statistical analyses, or anything where "how did you get that?" is a likely question. Write the methodology section before distributing results, not after questions arrive.

# Process

If you cannot open the reference files, use these short versions. Executive: why and what, in three sentences. Analyst: what and how, at a high level. Technical: full detail. Replace each statistical term with a plain word, and keep the term in brackets the first time.

1. **Identify the audience tier** — use `references/audience_depth_guide.md` to determine the appropriate level: executive (why/what), business analyst (what/how at high level), or technical peer (full detail).
2. **Select the explanation pattern** — use `references/methodology_explanation_patterns.md` to pick the structure: narrative, layered (short summary + appendix), or Q&A format.
3. **Draft the core explanation** — cover: what question was asked, what data was used, what method was applied, what assumptions were made, and what the key limitation is.
4. **Apply plain-language rewrites** — replace statistical terms with business equivalents per the translation table in `references/methodology_explanation_patterns.md`.
5. **Add a limitations paragraph** — every methodology explanation must include at least one honest limitation and what it means for the conclusions.
6. **Produce deliverables** — write-up using `assets/methodology_writeup_template.md`; if the methodology will be presented, use `assets/methodology_slide_template.md`.

# Inputs the skill needs

Gather these first: your raw method notes, the data source and date range, and the decision the reader must make.

- Description of the analytical method used (technique, data, steps)
- Audience type (executive / business / technical). If none is given, use business analyst and say so at the top.
- Any assumptions or known limitations

# Output

- Plain-language methodology write-up
- Limitations section
- Completed `methodology_writeup_template.md` or `methodology_slide_template.md`

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Analysis assumptions logger](https://useaiblocks.com/skills/analysis-assumptions-logger). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
