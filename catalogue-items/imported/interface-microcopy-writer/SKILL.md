---
name: ux-copy
description: Generate UX microcopy (button labels, error messages, empty states, toasts) following a casual-but-polite voice and tone
risk: critical
source: https://github.com/bitjaru/styleseed/tree/main/engine/.claude/skills/ss-copy
source_repo: bitjaru/styleseed
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/bitjaru/styleseed/blob/main/LICENSE
---


> Added by AI Blocks. Licence: this skill follows the MIT licence in its original header and the included LICENSE file. Keep the source notices and author credits. We also retain the collection's LICENSE-CONTENT file.

# UX Microcopy Generator
<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Brand brain**, made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for your question, your brand brain, a code change. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

Use this skill when you need generate UX microcopy (button labels, error messages, empty states, toasts) following a casual-but-polite voice and tone.


## When NOT to use

- For long-form content (blog posts, docs, marketing pages) — out of scope
- For full feedback state design (not just text) → not included in this copy; work with a designer on loading, success and error states
- For brand voice/tone definition itself — this skill consumes a voice spec, doesn't create it
- For translations to non-English languages — single-language only

**Gather these first** (ask once for anything missing, and never invent it):
- The screen name or flow.
- What each button or action on it does, in the user's words.
- The language to write in (one language per run).
- Any voice notes or design language (optional).

> **Note (added by AI Blocks).** The rules below are the full rule set in this copy. If the user pastes their own voice notes or design language, follow those first.
>
> The rule set the skill applies: buttons name the action (not "Submit"), errors help instead of blame, empty states invite, money copy stays calm, one term per concept.

## Instructions

1. Read the user's voice notes or design language if they pasted them. Where their notes clash with a Tone Rule below, follow their notes and point out the clash. If they gave none, use the Tone Rules below. If a code change just added loading, empty or error states to the screen, read the changed code and write the text for each state it added.

2. Apply the voice principles:

### Tone Rules
- **Casual but polite**: Friendly, not robotic. Like talking to a helpful friend.
- **Active voice**: "We saved your changes" not "Your changes have been saved"
- **Positive framing**: "Free shipping on orders over [AMOUNT]" not "Orders under [AMOUNT] have shipping fees"
- **Plain language**: "Send money" not "Initiate transfer"
- **Concise**: Every word must earn its place

### Copy Patterns by Context

#### Button Labels (CTA)
```
Format: [Action verb] + [Object] (optional)
Good: "Place order", "Get started", "Save changes", "Try again"
Bad:  "Submit", "OK", "Click here", "Proceed to next step"
```
- One primary CTA per screen
- Label must clearly describe what happens next
- Max 3 words for primary CTA

#### Empty States
```
Format: [Friendly observation] + [Suggested action]
Good: "No activity yet. Create your first project to get started."
Bad:  "No data found."
```
- Always suggest a next action
- Use a relevant icon (32px, text-text-tertiary)
- Tone: encouraging, not blaming

#### Error Messages
```
Format: [What happened] + [What to do]
Good: "Couldn't load the data. Please try again."
Bad:  "Error 500: Internal Server Error"
```
- Never show technical errors to users
- Blame the system, not the user
- Always provide a recovery action

#### Toast Notifications
```
Format: [Confirmation of what happened]
Good: "Saved!", "Changes applied", "Item deleted · Undo"
Bad:  "Operation completed successfully"
```
- Max 2 lines
- Include "Undo" link for reversible destructive actions
- Info toasts: 3 seconds. Action toasts: 5 seconds.

#### Form Labels & Helpers
```
Label: Noun phrase ("Email address", "Password")
Placeholder: Example or hint ("name@example.com")
Helper: Format guidance ("Must be at least 8 characters")
Error: Specific issue ("This email is already registered")
```

#### Confirmation Dialogs
```
Title: [Question about the action]
Body: [Consequence explanation]
Primary: [Action verb] ("Delete", "Confirm")
Secondary: "Close" (not "Cancel" — avoids confusion)
```

3. Work in this order:
   1. List every state the screen has: each button, each error, the empty state, any toast or dialog.
   2. Write one line of copy for each state, using the patterns above.
   3. Check the term list: use one word per idea, and compare against the terms from any earlier screens the user pasted.

   Then give the user:
   - **Primary copy:** the exact on-screen text for each state, one line per label, message or toast.
   - **Variants:** one line for each changed cause (for example a different error cause).
   - **Do's and Don'ts:** 3 to 5 short bullets for this screen.

4. **Next steps:** tell the user to save the approved term list in their design notes so new screens reuse the same words. For the voice itself, point them to the Brand voice guide builder.

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Forms and instructions rewriter](https://useaiblocks.com/skills/plain-words-interface-rewriter). It takes the draft.
- The [Interface interaction details designer](https://useaiblocks.com/skills/small-interface-details-designer). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
