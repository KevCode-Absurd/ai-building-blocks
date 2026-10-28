---
name: professional-proofreader
description: >
    Use when a user asks to "proofread", "review and correct", "fix grammar", "improve readability while keeping my voice", and to proofread a document file and save an updated version.
risk: safe
source: original
date_added: "2026-03-04"
---

# Professional Proofreader

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A draft** (yours): the ad, page, email or script you want checked or improved.

**Makes it better (optional):**
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a draft, a brief, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

This skill transforms flawed writing — whether pasted text or uploaded documents — into publication-ready prose without altering the author’s intent.
It eliminates grammatical, spelling, punctuation, clarity, and tone issues while strictly preserving the author’s voice and intent.
Returns a corrected version plus a structured modification log, or generates an updated file when requested. Not for code editing or technical refactoring.

---

## When to Use
- Use when user asks to "proofread", "review and correct", "fix grammar", "polish this text", "improve readability while keeping my voice".
- Use when user asks to proofread a document file (like .docx, .pdf, .txt) and save the updated version as new file with 'UPDATED_' prefix.

## When Not to Use
- Code, full rewrites in a new voice, or legal, medical or academic sign-off. Use a code review, an editor, or a qualified reviewer instead.

---

# WORKFLOW MODES

This skill operates in two modes:
1. Inline Text Mode
2. File Processing Mode

### MODE 1: Inline Text

Refer [markdown](references/inline-text-mode.md) for complete inline text mode.

### MODE 2: File Processing

Trigger when user says:

- "Proofread [filename].[extension]
- "Edit this document"
- "Correct grammar in this file"
- "Save updated version"
- "Add prefix UPDATED_"
- "Return corrected .[extension]"

Refer [markdown](references/file-processing-mode.md) for complete file processing mode.

---

## Best Practices

### ✅ **Do:** [Good practice]
- Always include modification explanations.
- Always keep quality standards equivalent to: Academic proofreading, business document refinement, pre-publication review.
- Always follow below editing standards:

#### Grammar
- Subject-verb agreement  
- Tense consistency 
- Article usage 
- Prepositions
- Pronoun clarity 

#### Spelling
- Correct typos 
- Maintain original spelling variant (US/UK)

#### Punctuation
- Commas 
- Apostrophes 
- Quotation marks 
- Sentence boundaries 

#### Style & Tone
- Maintain author voice 
- Avoid unnecessary formalization 
- Preserve rhetorical choices 

#### Readability
- Improve structure 
- Enhance logical flow 
- Remove redundancy 

### ❌ **Don't:** [What to avoid] 
- Never alter meaning.
- Never drop formatting intentionally.
- Never change file name logic beyond request.
- Never expand the content

---

# Output Rules

If inline:
-> Return Corrected Version + Modifications list.

If file rewrite:
-> Save updated file.
-> Confirm filename.
-> Provide modifications list unless suppressed.

Give friendly message to user in the end.

---

## Example

**User request:**

> Proofread this text for grammar, clarity, consistency, and readability while preserving my voice.

**Expected reply:** the corrected text first, then the modification log in the format above. (The original skill gives no sample output.)

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Text proofreader](https://useaiblocks.com/skills/proofreader). It takes the draft.
- The [Long-form draft editor](https://useaiblocks.com/skills/long-form-draft-editor). It takes the draft and notes.
- The [Dialogue editor](https://useaiblocks.com/skills/dialogue-ear-checker). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
