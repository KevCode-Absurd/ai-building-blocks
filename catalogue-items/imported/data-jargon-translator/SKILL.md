---
name: technical-to-business-translator
description: Translate technical analysis into business language. Use when explaining statistical concepts to non-analysts, simplifying technical findings, or bridging communication between data teams and business stakeholders.
---

# When to use

When technical output (model results, statistical tests, query findings) needs to be understood by a business audience. Also use to review your own writing before sending — it is easy to slip into jargon without noticing.

# Process

1. **Detect jargon** — run `scripts/jargon_detector.py` on the draft text to flag technical terms that need translation.
2. **Score readability** — run `scripts/readability_scorer.py` to get Flesch-Kincaid grade level and sentence complexity metrics; target ≤ grade 10 for executive audiences.
3. **Identify the audience persona** — use `references/stakeholder_personas.md` to select the persona that best matches your reader; each persona has vocabulary preferences and typical questions.
4. **Apply translation patterns** — use `references/translation_pattern_library.md` and preserve what the statistic says. A p-value is conditional on the no-effect model; never turn it into the chance the result is real or a confidence percentage.
5. **Replace with metaphors where needed** — for complex statistical concepts, pick an appropriate metaphor from `references/metaphor_bank.md`.
6. **Draft the translated version** — use `assets/translation_template.md` to produce the parallel technical/business version; keep the original in an appendix for technical reviewers.

# Inputs the skill needs

- Draft technical text or findings
- Target audience role (VP, product manager, operations, finance, etc.)

# Output

- Jargon detection report
- Readability score before/after
- Translated text with original in appendix (`translation_template.md`)

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A draft** (yours): the ad, page, email or script you want checked or improved.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a draft. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Text translator](https://useaiblocks.com/skills/translator). It takes the draft.
- The [Language translator agent](https://useaiblocks.com/skills/agency-language-translator). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
