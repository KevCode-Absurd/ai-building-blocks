---
name: guideline-generation
description: >
  This skill generates, creates, or builds brand voice guidelines from source
  materials. It should be used when the user asks to "generate brand guidelines",
  "create a style guide", "extract brand voice", "create guidelines from calls",
  "consolidate brand materials", "analyze my sales calls for brand voice",
  "build a brand playbook from documents", "synthesize a voice and tone guide",
  or uploads brand documents, transcripts, or meeting recordings for brand
  analysis. Also triggers when the user has a discovery report and wants to
  convert it into actionable guidelines.
---

# Guideline Generation

Generate comprehensive, LLM-ready brand voice guidelines from any combination of sources — brand documents, sales call transcripts, discovery reports, or direct user input. Transform raw materials into structured, enforceable guidelines with confidence scoring and open questions.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

**Makes it better (optional):**
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.
- **A transcript** (yours): the words from a recording, written out, with who said what.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text, customer words, a transcript. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Inputs

Accept any combination of:
- **Discovery report** from the discover-brand skill (structured, pre-triaged)
- **Brand documents** uploaded or from connected platforms (PDF, PPTX, DOCX, MD, TXT)
- **Conversation transcripts** from Gong, Granola, manual uploads, or Notion meeting notes
- **Direct user input** about their brand voice and values

When a discovery report is provided, use it as the primary input — sources are already triaged and ranked. Supplement with additional analysis as needed.

## Generation Workflow

### 1. Identify and Classify Sources

Determine what the user has provided. If no sources are available:
- Check if a discovery report exists from an earlier discovery step. The `/brand-voice:discover-brand` command is not part of this item. On AI Blocks, the Brand materials finder does the same job.
- Check `.claude/brand-voice.local.md` for known brand material locations. It is an optional settings file, so skip it if it does not exist.
- Suggest running discovery first, or ask the user to upload their documents.

### 2. Process Sources

The helper agents named below are not included in this item. If your AI has none, do each step yourself in the same chat, one after another.

**For documents:** Delegate to the document-analysis agent for heavy parsing. Extract voice attributes, messaging themes, terminology, tone guidance, and examples.

**For transcripts:** Delegate to the conversation-analysis agent for pattern recognition. Extract implicit voice attributes, successful language patterns, tone by context, and anti-patterns.

**For discovery reports:** Extract pre-triaged sources, conflicts, and gaps. Use the ranked sources directly.

### 3. Synthesize Into Guidelines

Merge all findings into a unified guideline document following the template in `references/guideline-template.md`. Key sections:

**"We Are / We Are Not" Table** — The core brand identity anchor:

| We Are | We Are Not |
|--------|------------|
| [Attribute — e.g., "Confident"] | [Counter — e.g., "Arrogant"] |
| [Attribute — e.g., "Approachable"] | [Counter — e.g., "Casual or sloppy"] |

Derive attributes from the most consistent patterns across sources. Each row should have supporting evidence.

**Voice Constants vs. Tone Flexes** — Clarify what stays fixed and what adapts:
- **Voice** = personality, values, "We Are / We Are Not" — constant across all content
- **Tone** = formality, energy, technical depth — flexes by context

**Tone-by-Context Matrix:**

| Context | Formality | Energy | Technical Depth | Example |
|---------|-----------|--------|-----------------|---------|
| Cold outreach | Medium | High | Low | "[example phrase]" |
| Enterprise proposal | High | Medium | High | "[example phrase]" |
| Social media | Low | High | Low | "[example phrase]" |

### 4. Assign Confidence Scores

Score each section using the methodology in `references/confidence-scoring.md`:
- **High confidence**: 3+ corroborating sources, explicit guidance found
- **Medium confidence**: 1-2 sources, or inferred from patterns
- **Low confidence**: Single source, inferred, or conflicting data

### 5. Surface Open Questions

Generate open questions for any ambiguity that cannot be resolved:

```markdown
## Open Questions for Team Discussion

### High Priority (blocks guideline completion)
1. **[Question Title]**
   - What was found: [conflicting or incomplete info]
   - Agent recommendation: [suggested resolution with reasoning]
   - Need from you: [specific decision or confirmation needed]
```

Every open question MUST include an agent recommendation. Turn ambiguity into "confirm or override" — never a dead end.

### 6. Quality Check

Before presenting, verify via the quality-assurance agent (defined in `agents/quality-assurance.md`):
- All major sections populated (including Brand Personality and Content Examples if sources support them)
- At least 3 voice attributes with evidence
- "We Are / We Are Not" table has 4+ rows
- Tone matrix covers at least 3 contexts
- Confidence scores assigned per section
- Source attribution for all extracted elements
- No PII exposed
- Open questions include recommendations

### 7. Present and Offer Next Steps

Summarize key findings:
- Total sections generated with confidence breakdown
- Strongest voice attribute and most effective message
- Number of open questions (if any)

### 8. Save for Future Sessions

The default save location is `.claude/brand-voice-guidelines.md` inside the user's working folder.

**Important:** The agent's working directory may not be the user's project root (especially in Cowork, where plugins run from a plugin cache directory). Always resolve the path relative to the user's working folder, not the current working directory. If no working folder is set, skip the file save and tell the user guidelines will only be available in this conversation.

1. **Resolve the save path.** The file MUST be saved to `.claude/brand-voice-guidelines.md` inside the user's working folder. Confirm the working folder path before writing.
2. **Check if guidelines already exist** at that path
3. **If they exist, archive the previous version:** Rename the existing file to `brand-voice-guidelines-YYYY-MM-DD.md` in the same directory (using today's date)
4. **Save new guidelines** to `.claude/brand-voice-guidelines.md` inside the working folder
5. **Confirm to the user** with the full absolute path: "Guidelines saved to `<full-path>`." The `/brand-voice:enforce-voice` command that would read them automatically is not part of this item, so tell the user to paste the file into their AI as a standing brief before they write.

The guidelines are also present in this conversation, so the user can ask for copy in this voice right away.

After saving, offer:
1. Walk through the guidelines section by section
2. Write or rewrite copy in this voice (the Brand voice rewriter on AI Blocks does this)
3. Resolve open questions

## Privacy and Security

Enforce these privacy constraints throughout the entire generation workflow, not only at output time:
- Redact customer names and contact information from all examples
- Anonymize company names in transcript excerpts if requested
- Flag any sensitive information detected during processing

## Reference Files

- **`references/guideline-template.md`** — Complete output template with all sections, field definitions, and formatting guidance
- **`references/confidence-scoring.md`** — Confidence scoring methodology, thresholds, and examples

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Brand voice rewriter](https://useaiblocks.com/skills/brand-voice-rewriter). It takes the brand guide.
- The [Brand voice rules writer](https://useaiblocks.com/skills/brand-voice-rules-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
