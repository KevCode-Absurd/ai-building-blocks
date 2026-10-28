---
name: brand-voice-enforcement
description: >
  This skill applies brand guidelines to content creation. It should be used when
  the user asks to "write an email", "draft a proposal", "create a pitch deck",
  "write a LinkedIn post", "draft a presentation", "write a Slack message",
  "draft sales content", or any content creation request where brand voice should
  be applied. Also triggers on "on-brand", "brand voice", "enforce voice",
  "apply brand guidelines", "brand-aligned content", "write in our voice",
  "use our brand tone", "make this sound like us", "rewrite this in our tone",
  or "this doesn't sound on-brand". Not for generating guidelines from scratch
  (use guideline-generation) or discovering brand materials (use discover-brand).
---

# Brand Voice Enforcement

Apply existing brand guidelines to all sales and marketing content generation. Load the user's brand guidelines, apply voice constants and tone flexes to the content request, validate output, and explain brand choices.

**AI Blocks route note:** In a normal chat, paste your approved brand guidelines and a brief or draft. Follow the workflow below in the same conversation. Plugin commands and separate agents are optional host features. Without guidelines, stop and ask for them; do not make up brand rules.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brand guide** (yours): a printable brand guide: voice, look, do and don't, with examples.
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **The post or message** (yours): the post, comment, message or email you're replying to, with who wrote it and where.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A brand guide** with the [Brand voice guide builder](https://useaiblocks.com/skills/brand-voice-guide-builder). Bring source text, customer words (optional), a transcript (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a brand guide, a brief, the post or message. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Loading Brand Guidelines

Find the user's brand guidelines using this sequence. Stop as soon as you find them:

1. **Session context** — Check for approved brand guidelines already shared in this conversation. Use them directly. If the host has the brand-voice plugin, its `/brand-voice:generate-guidelines` command is one way they may have been created; the command is not needed in a normal chat.

2. **Local guidelines file** — Check for `.claude/brand-voice-guidelines.md` inside the user's working folder. Do NOT use a relative path from the agent's current working directory — in Cowork, the agent runs from a plugin cache directory, not the user's project. Resolve the path relative to the user's working folder. If no working folder is set, skip this step.

3. **Ask the user** — If no guidelines were found, ask them to paste approved guidelines, attach a file you can read, or use the [Brand voice guide builder](https://useaiblocks.com/skills/brand-voice-guide-builder) first. In a host with the brand-voice plugin installed, `/brand-voice:discover-brand` and `/brand-voice:generate-guidelines` are optional shortcuts. Do not ask people to run those commands in an ordinary chat.

   Wait for the user to provide or approve guidelines before proceeding.

If you have project-file access and `.claude/brand-voice.local.md` exists, read its enforcement settings (even if guidelines came from another source). In a normal chat, use the person's stated preferences and ask only about missing settings that change the draft:
- `strictness`: strict | balanced | flexible
- `always-explain`: whether to always explain brand choices

## Enforcement Workflow

### 1. Analyze the Content Request

Before writing, identify:
- **Content type**: email, presentation, proposal, social post, message, etc.
- **Target audience**: role, seniority, industry, company stage
- **Key messages needed**: which message pillars apply
- **Specific requirements**: length, format, tone overrides

### 2. Apply Voice Constants

Voice is the brand's personality — it stays constant across all content:
- Apply "We Are / We Are Not" attributes from guidelines
- Use brand personality consistently
- Incorporate approved terminology; reject prohibited terms
- Follow messaging framework and value propositions

Refer to `references/voice-constant-tone-flexes.md` for the "voice constant, tone flexes" model.

### 3. Flex Tone for Context

Tone adapts by content type and audience. Use the tone-by-context matrix from guidelines to set:
- **Formality**: How formal or casual should this be?
- **Energy**: How much urgency or enthusiasm?
- **Technical depth**: How detailed or accessible?

### 4. Generate Content

Create content that:
- Matches brand voice attributes throughout
- Follows tone guidelines for this specific content type
- Incorporates key messages naturally (not forced)
- Uses preferred terminology
- Mirrors the quality and style of guideline examples

Draft and review in the same conversation when separate agents are unavailable. If the host supports agents and their use is authorised, `agents/content-generation.md` and `agents/quality-assurance.md` are optional drafting and review roles. Do not claim that another agent reviewed the work unless it actually did.

### 5. Validate and Explain

After generating content:
- Briefly highlight which brand guidelines were applied
- Explain key voice and tone decisions
- Note any areas where guidelines were adapted for context
- Offer to refine based on feedback

When `always-explain` is true in settings, include brand application notes with every response.

## Handling Conflicts

When the user's request conflicts with brand guidelines:
1. Explain the conflict clearly
2. Provide a recommendation
3. Offer options: follow guidelines strictly, adapt for context, or override

Default to adapting guidelines with an explanation of the tradeoff.

## Open Questions Awareness

Open questions are unresolved brand positioning decisions flagged during guideline generation, stored in the guidelines under an "Open Questions" section. When generating content, check if the brand guidelines contain open questions:
- If content touches an unresolved open question, note it
- Apply the agent's recommendation from the open question unless the user specifies otherwise
- Suggest resolving the question if it significantly impacts the content

## Reference Files

- **`references/voice-constant-tone-flexes.md`** — The "voice constant, tone flexes" mental model, "We Are / We Are Not" table structure, and tone-by-context matrix explanation
- **`references/before-after-examples.md`** — Before/after content examples per content type showing enforcement in practice

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Draft brand voice checker](https://useaiblocks.com/skills/draft-brand-voice-checker). It takes the draft.
- The [Brand voice consistency reviewer](https://useaiblocks.com/skills/brand-voice-reviewer). It takes the draft.
- The [Voice and tone guide writer](https://useaiblocks.com/skills/voice-and-tone-guide-writer). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
