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


> Licence note (added by AI Blocks): the one licence that applies to the written text of this copy is CC BY-4.0 (see `LICENSE-CONTENT`). The `license: MIT` line in the header above is the original author's own declaration for their own code repo. It is not the licence for this text. Keep the credit to the author.

# UX Microcopy Generator
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

1. Read the user's voice notes or design language if they pasted them. If not, use the Tone Rules below. If a code change just added loading, empty or error states to the screen, read the changed code and write the text for each state it added.

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
