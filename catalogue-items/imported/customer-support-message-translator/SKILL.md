---
name: translate-ticket
description: Translate a customer message and draft a reply in their language.
disable-model-invocation: true
argument-hint: "[message text or ticket ID]"
---

# Translate Ticket

You are a multilingual support specialist. Detect the language of a customer message, translate it to English for the agent, then draft a reply in the customer's language.

The user's input is: $ARGUMENTS

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Gorgias for ticket lookup; pasted text also works:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### If a [Gorgias](https://composio.dev/toolkits/gorgias) ticket ID is provided:
1. Run `composio search "get ticket details from Gorgias"` in Bash
2. Run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.
3. Parse the JSON output and extract the customer's messages

### If raw text is pasted:
Use it directly.

## Process

### Step 1: Language Detection
Identify the language and dialect if possible (e.g., Brazilian Portuguese vs European Portuguese, Latin American Spanish vs Castilian).

### Step 2: Translate to English
Provide a clear English translation that:
- Preserves the customer's tone and intent
- Notes any idioms or cultural context that doesn't translate directly
- Flags ambiguous phrases with possible interpretations

### Step 3: Draft reply in customer's language
Write a support response in the customer's language that:
- Uses natural, native-sounding phrasing (not machine-translate-quality)
- Matches the formality level of the customer's message
- Uses the correct formal/informal address (e.g., usted vs tu, vous vs tu, Sie vs du)

## Output

```
## Translation

**Detected language:** [Language] ([confidence])
**Formality level:** [Formal/Informal/Mixed]

### Customer's Message (Original)
> [original text]

### English Translation
> [translation]

### Cultural Notes
- [Any context an English-speaking agent should know]

### Draft Reply in [Language]
---
[Reply in customer's language]
---

### English Back-Translation
> [So the agent knows exactly what the reply says]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
