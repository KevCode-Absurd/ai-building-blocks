---
name: email-drafter
description: 'Draft and review professional emails that match your personal writing style. Analyzes your sent emails for tone, greeting, structure, and sign-off patterns via WorkIQ, then generates context-aware drafts for any recipient. USE FOR: draft email, write email, compose email, reply email, follow-up email, analyze email tone, email style.'
---

# Email Drafter

Draft professional emails that match your established writing style and tone. Uses WorkIQ to analyze your sent emails and prior correspondence with recipients, then produces context-aware drafts you can review and refine.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, source text, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- "Draft an email to [person] about [topic]"
- "Write a follow-up email to [customer] regarding [project]"
- "Reply to [person]'s email about [subject]"
- "Compose a proposal email for [initiative]"
- "Analyze my email tone with [recipient]"

## Workflow

### Step 1 — Gather Context

Before drafting, collect:

1. **Recipient(s)** — who is the email for?
2. **Purpose** — what is the email about? (proposal, follow-up, technical guidance, introduction, status update, etc.)
3. **Key points** — what needs to be communicated?
4. **Relationship context** — use WorkIQ to check prior email history with the recipient if available

If the user pastes a document the email is about (such as a finished review), take the key points from it. If the user pastes sample emails, use them for the tone check. If the user provides all of these upfront, proceed directly. Otherwise, ask clarifying questions (max 3).

### Step 2 — Analyze Tone

When drafting for a recipient, use WorkIQ to understand the user's established communication patterns:

1. Pull 3–5 recent sent emails from the user to the same recipient or similar recipients
2. Identify patterns:
   - **Greeting style** — formal ("Dear"), standard ("Hello"), casual ("Hi"), or direct (no greeting)
   - **Structure** — short paragraphs vs. bullet lists vs. numbered steps
   - **Sign-off** — what closing and name format the user typically uses
   - **Formality level** — professional, friendly-professional, casual
   - **Language** — which language the user writes in with this recipient
3. Apply those patterns to the draft

If WorkIQ is unavailable or no prior emails exist, use sensible professional defaults and note that the tone was inferred.

### Step 3 — Draft the Email

Apply the discovered (or default) style rules:

**Greeting:**
- Match whatever greeting style was found in Step 2
- Default: "Hello [FirstName]," for external, "Hi [FirstName]," for internal
- For multiple recipients: "Hello [Name1], [Name2],"

**Tone:**
- Direct and concise — no filler language
- Friendly but professional
- Get to the point quickly
- Offer help proactively where appropriate ("Happy to discuss further", "Let me know if you need anything")

**Structure:**
- Short emails (1–2 points): simple paragraphs, no bullets needed
- Longer emails (proposals, multi-point updates): use bullet points or numbered lists
- Include context from prior conversations when relevant ("Following our recent conversation about...")

**Sign-off:**
- Match the user's established sign-off pattern from Step 2
- Default: "Best regards," followed by the user's first name on the next line

**Language:**
- Default to English unless the user specifies otherwise
- Match the recipient's language if prior correspondence was in another language

### Step 4 — Output

1. Present the draft for review with a brief note on the tone/style applied
2. Apply edits as the user requests — iterate until satisfied
3. Save the final draft to `outputs/<year>/<month>/` with a descriptive filename (e.g., `2026-03-26-email-acme-followup.md`)

## Important Rules

- **Never send emails** — only draft them as files for the user to review and send manually
- Always check WorkIQ for prior context with the recipient when available
- If the user says "draft email" or "write email", activate this skill automatically
- Save drafts using the `outputs/<year>/<month>/` folder convention
- Respect privacy: do not include sensitive information from unrelated email threads

## Example Prompts

- "Draft an email to Sarah about the project timeline"
- "Write a follow-up to the customer about their migration questions"
- "Compose a proposal email for the new training initiative"
- "Reply to John's email — agree with his approach but suggest we add monitoring"
- "Analyze my email tone with the Acme team"

## Requirements

- **WorkIQ MCP tool** is recommended for tone analysis and recipient context (Microsoft 365 / Outlook)
- Without WorkIQ, the skill still works but uses professional defaults instead of personalized tone matching
- Output is saved as markdown files in the workspace

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Campaign change impact reviewer](https://useaiblocks.com/skills/campaign-change-impact-mapper). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
