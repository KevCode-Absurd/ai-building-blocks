---
name: presentation-creation
description: Create polished, audience-tailored presentations from outlines or documents, with support for Marp, reveal.js, Google Slides, and PPTX output formats. Use when the user requests presentation creation or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Presentation Creation

This skill enables an AI agent to transform raw content — outlines, documents, meeting notes, or data — into professional presentation slide decks. The agent applies slide design principles such as one idea per slide, visual hierarchy, and minimal text to produce decks that are clear, engaging, and presentation-ready. It supports multiple output formats including Marp Markdown, reveal.js HTML, Google Slides, and PPTX.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, a brief. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Gather content and define the audience.** Collect the source material — an outline, a technical document, meeting notes, or a set of talking points. Identify the target audience (executives, engineers, customers, investors) and the presentation goal (inform, persuade, train, pitch). The audience determines vocabulary depth, level of detail, and visual style. An investor pitch uses bold claims and metrics; a technical deep-dive uses architecture diagrams and code snippets.

2. **Structure the narrative arc.** Organize the content into a logical story: opening hook, problem statement, solution or key message, supporting evidence, and closing call to action. Map this arc onto a slide-by-slide outline. A typical 15-minute presentation uses 10-15 slides. Each slide should convey a single idea — if a slide needs two headings, it should be two slides. Add transition beats between sections to maintain narrative flow.

3. **Write slide content with minimal text.** For each slide, write a concise headline (under 8 words) that states the takeaway, not the topic. Use "Revenue grew [X%] YoY" (with the real figure from the source) instead of "Revenue Overview." Keep body text to 3-5 bullet points or a single short paragraph. Where possible, replace text with visuals — a chart, diagram, screenshot, or image that communicates the point faster. Write speaker notes for each slide with the full talking points the presenter should deliver verbally.

4. **Suggest visual elements and layout.** For each slide, recommend the appropriate visual treatment: bar chart for comparisons, line chart for trends, flow diagram for processes, screenshot for product demos, icon grid for feature lists, or a full-bleed image for emotional impact. Specify layout as title-only, title-and-body, two-column, image-left, or full-image. Suggest a consistent color palette and font pairing (e.g., Inter for headings, Source Sans for body).

5. **Generate the slide deck in the target format.** Produce the complete deck in the requested format. For Marp, output a single Markdown file with `---` slide separators and Marp directives. For reveal.js, output an HTML file with section tags. For PPTX, generate a python-pptx script or direct file. For Google Slides, output a structured JSON payload compatible with the Slides API. Include speaker notes, slide numbers, and any embedded media references.

6. **Review and refine.** Check the deck against presentation best practices: no slide exceeds 40 words of body text, every slide has a clear takeaway headline, visual variety prevents monotony (not all bullet-point slides), the opening slide grabs attention, and the closing slide has a clear next step. Adjust pacing — if the deck is too long, identify slides that can be merged or moved to an appendix.

## Usage

Provide the agent with the source content (or a description of the topic), the target audience, desired slide count, and output format. The agent will return a complete slide deck with speaker notes.

**Prompt format:**

~~~
Create a presentation about [topic].
Source material: [outline, document path, or key points]
Audience: [who will see this]
Slide count: [target number of slides]
Output format: [marp / revealjs / pptx / google-slides]
~~~

## Examples

The two examples below show the format only. Every value in brackets is a placeholder. In a real deck, use only figures that come from the user's source. Where one is missing, write a bracketed placeholder such as [X%] or [Customer] and ask for it.

### Example 1: Product Launch Slide Deck (Marp Format)

**Input:**

~~~
Create a presentation for the launch of "[PRODUCT NAME]", [WHAT IT DOES IN A FEW WORDS].
Audience: [WHO WILL WATCH].
Slide count: 7
Output format: marp
~~~

**Output (shape only; every bracketed value must come from the user's source, or stay a placeholder and be flagged as missing):**

~~~markdown
---
marp: true
theme: default
paginate: true
---

# [PRODUCT NAME]
## [THE PROMISE, WITH THE USER'S REAL NUMBER IF THEY GAVE ONE]

![bg right:40%](hero-image.png)

<!-- Speaker notes: [Welcome line. State what the audience will have learned by the end.] -->

---

# The Problem: [ONE-LINE PROBLEM]

- [EVIDENCE FROM THE USER'S SOURCE, WITH ITS SOURCE NAMED]
- [SECOND POINT ABOUT THE PROBLEM]
- [THIRD POINT ABOUT THE PROBLEM]

<!-- Speaker notes: [Talking points for the problem slide.] -->

---

# How [PRODUCT NAME] Works

1. **[STEP 1]**: [WHAT THE USER DOES]
2. **[STEP 2]**: [WHAT HAPPENS NEXT]
3. **[STEP 3]**: [WHAT THEY GET]

<!-- Speaker notes: [Talking points for how it works.] -->

---

# Results: [WHAT CUSTOMERS ACHIEVED]

| Customer | Result | Time to result |
|----------|--------|----------------|
| [CUSTOMER 1] | [RESULT] | [TIME] |
| [CUSTOMER 2] | [RESULT] | [TIME] |

Average: **[X%]** [MEASURE] within [TIMEFRAME].

<!-- Speaker notes: [Only use this slide if the user supplied real customer results. Otherwise write MISSING: customer results and ask for them.] -->

---

# Built for [AUDIENCE]

- [FEATURE OR BENEFIT 1, FROM THE USER'S SOURCE]
- [FEATURE OR BENEFIT 2]
- [FEATURE OR BENEFIT 3]

<!-- Speaker notes: [Talking points.] -->

---

# Pricing

- **[PLAN 1]:** [PRICE AND TERMS FROM THE USER]
- **[PLAN 2]:** [PRICE AND TERMS FROM THE USER]

<!-- Speaker notes: [Talking points. If the user gave no prices, write MISSING: pricing.] -->

---

# Get Started Today

**[NEXT STEP AND LINK OR CONTACT FROM THE USER]**

- [WHAT HAPPENS FIRST]
- [WHAT THEY SEE AND WHEN]

<!-- Speaker notes: [Close and invite questions.] -->
~~~

### Example 2: Converting a Technical Document to a Presentation Outline

**Input:**

~~~
Convert the following technical document summary into a presentation outline.
Source: "[CURRENT STATE WITH THE USER'S REAL NUMBERS]. [TARGET]. Root cause: [CAUSE].
Proposed fix: [FIX]. Expected impact: [IMPACT, IF THE USER GAVE ONE]. Rollout plan: [PLAN]."
Audience: [WHO WILL WATCH]
Output format: outline
~~~

**Output (shape only; every bracketed value must come from the user's source):**

~~~
Slide 1: Title
  Headline: "[THE TAKEAWAY IN UNDER 8 WORDS]"
  Subtitle: [DOCUMENT TYPE] - [DATE]
  Visual: None (clean title slide)

Slide 2: Current State
  Headline: "[WHAT IS WRONG TODAY, IN UNDER 8 WORDS]"
  Bullets:
    - [CURRENT FIGURE FROM THE SOURCE]
    - [TARGET FROM THE SOURCE]
    - [WHAT THE SOURCE SAYS CORRELATES WITH THE PROBLEM]
  Visual: Line chart of [METRIC] over [PERIOD] with the target marked

Slide 3: Root Cause
  Headline: "[CAUSE IN UNDER 8 WORDS]"
  Bullets:
    - [WHY IT HAPPENS, FROM THE SOURCE]
    - [WHAT IT COSTS, ONLY IF THE SOURCE GIVES A FIGURE]
  Visual: [DIAGRAM OF WHERE THE CAUSE SITS]

Slide 4: Proposed Solution
  Headline: "[FIX IN UNDER 8 WORDS]"
  Bullets:
    - [WHAT CHANGES]
    - [HOW IT WORKS]
    - [WHAT HAPPENS IF IT FAILS]
  Visual: Before/after diagram

Slide 5: Expected Impact
  Headline: "[IMPACT IN UNDER 8 WORDS]"
  Bullets:
    - [PROJECTED RESULT, MARKED "projected" AND ONLY IF THE SOURCE GIVES IT]
    - MISSING: [ANY FIGURE THE SOURCE DID NOT GIVE]
  Visual: Bar chart of current vs projected [METRIC]

Slide 6: Rollout Plan
  Headline: "[ROLLOUT IN UNDER 8 WORDS]"
  Bullets:
    - [PHASE 1 FROM THE SOURCE]
    - [PHASE 2 FROM THE SOURCE]
    - [PHASE 3 FROM THE SOURCE]
  Visual: Timeline of the phases
  CTA: "[THE NEXT STEP AND DEADLINE FROM THE USER]"
~~~

## Best Practices

- **One idea per slide.** If you need two headings on a slide, make two slides. Cognitive overload kills retention. Audiences remember single, clear takeaways.
- **Use headlines that state the takeaway, not the topic.** "Revenue grew [X%] YoY" (with the real figure from the source) is better than "Revenue Overview." The audience should understand the slide's point from the headline alone.
- **Follow a 3:1 visual-to-text ratio.** For every three slides with charts, images, or diagrams, allow at most one text-heavy slide. Visual variety sustains attention.
- **Write speaker notes for every slide.** The slides are the audience's experience; the speaker notes are the presenter's script. Never put on the slide what should be said aloud.
- **Keep the deck under 1 slide per minute of speaking time.** A 15-minute slot means 12-15 slides max. Rushing through dense slides is worse than cutting content.
- **End with a clear next step.** The final slide should tell the audience exactly what to do: visit a URL, schedule a meeting, approve a proposal, or review a document by a specific date.

## Edge Cases

- **No source material provided.** If the user gives only a topic without supporting content, generate an outline with bracketed placeholders only, such as [X%] or [Customer]. Never invent metrics or customer results. Clearly mark assumptions. Prompt the user to supply key metrics and claims.
- **Highly technical content for a non-technical audience.** Simplify jargon, replace architecture diagrams with high-level metaphors, and focus on outcomes (cost savings, speed improvements) rather than implementation details.
- **Very large source documents (10+ pages).** Prioritize ruthlessly. Identify the 3-5 most important points and move supporting detail to an appendix deck. Offer to generate both a summary deck and a detailed reference deck.
- **Accessibility requirements.** Ensure sufficient color contrast (WCAG AA), provide alt-text descriptions for all visuals, and avoid conveying meaning through color alone. Use large fonts (24pt+ for body, 32pt+ for headlines).
- **Multiple output formats requested.** Generate the canonical version in Marp Markdown (the most portable format), then provide conversion instructions or scripts for the additional formats.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Decide what to do** with the [Claim fact checker](https://useaiblocks.com/skills/claim-fact-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
