---
name: email-issue-fixer
description: "Fix small email mistakes without touching the writer's voice, and strip tracking parameters from links on request. Always returns the corrected draft plus a change list."
category: writing
risk: safe
source: self
source_type: self
date_added: "2026-09-01"
author: whoisabhishekadhikari
tags: [email, proofreading, grammar, links]
---

# Email Issue Fixer

Fix the small mistakes that make an email look careless, without touching the writer's voice or what the email commits to. Always return the corrected draft plus a list of what changed.

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

## When to Use

- Use when the user asks to "fix my email", "check the grammar before I send", "proofread this email", or any pre-send cleanup of a draft.
- Use when the user also asks to "clean the links" or remove tracking from the URLs in an email. Link cleaning is never automatic.
- Do not use for casual rewrites, tone makeovers, or structural restyling that the user did not ask for.

## Pass 1: correctness only

Fix these:

- Duplicated words ("a a", "the the") and wrong articles. Choose a/an by sound, not spelling: "an hour", "a university", "a one-time offer".
- Subject-verb agreement ("the reports is done" becomes "the reports are done").
- Wrong-word slips: your/you're, its/it's, than/then, affect/effect, their/there.
- Capitalization, doubled spaces, missing or doubled punctuation.

Leave these alone. They are voice, not errors:

- Sentence fragments, contractions, one-line paragraphs.
- Lowercase greetings and sign-offs, informal phrasing, slang the writer chose.
- Repetition used for emphasis.

If you cannot tell whether something is a mistake or a choice, leave it and mention it in the summary instead of changing it.

Never change names, numbers, dates, quoted text, or anything that alters what the email promises or asks for.

## Pass 2: links (only when the user asks)

Do not touch links during a normal proofread. Clean them only when the user asks for it.

When asked, remove only these unambiguous tracking keys:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `mc_cid`, `mc_eid`, `fbclid`, `gclid`, `igshid`, `_hsenc`, `_hsmi`

Keep every other parameter. Values like `id`, `page`, `v`, `q`, or anything unfamiliar are often what makes the link work. When in doubt, keep it.

Treat `ref`, `ref_src`, and similarly generic keys as ambiguous: they are sometimes attribution, sometimes application state the link needs to work. Do not strip them automatically. Only remove them when context confirms they are attribution, or ask the writer first.

Do not delete whole links. Do not delete a link because it appears twice; signature links and repeated calls to action are usually deliberate.

Flag rather than fix: shortened links (bit.ly and similar), unfamiliar domains, and any query string that looks like a token, session ID, or credential. Point them out and let the writer decide.

If a query parameter looks like a credential, token, or session ID, do not echo its value anywhere in the output. Keep the link only by replacing the sensitive value with a placeholder such as `[REDACTED]` (for example `?auth=[REDACTED]`), list the redaction in "Changes made", and tell the writer to re-enter the real value before sending. If they prefer, advise rotating the leaked value first.

## Always return

- The corrected email, in the same format and layout it arrived in.
- A "Changes made" list, one line per change.
- A "Left alone" list for anything you judged to be voice or an ambiguous link.
- If nothing needed fixing, say so plainly rather than inventing changes.

## Never

- Send, schedule, or file the email. Hand the draft back for the writer to send.
- Repeat credentials, tokens, or personal details found inside links.
- Rewrite for tone, length, or structure unless asked. If the user wants that, ask what direction they want first.

## Examples

### Articles and agreement

Input:

```text
Please find attached a a copy of the report. Our sales team achieved a amazing quarter.
```

Output:

```text
Please find attached a copy of the report. Our sales team achieved an amazing quarter.
```

Changes made:

- a a to a (duplicated word)
- a amazing to an amazing (vowel sound)

### Link cleaning

Input:

```text
https://app.example.com/reports?utm_source=newsletter&utm_medium=email&id=123
```

Output:

```text
https://app.example.com/reports?id=123
```

Changes made:

- Removed 2 tracking parameters (utm_source, utm_medium)
- Kept id=123, which the link needs to open the right report

## Limitations

This reads and edits text only. It cannot judge whether the email's facts, tone, or timing are right. That stays with the writer.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Email and SMS results reviewer](https://useaiblocks.com/skills/email-and-sms-performance-reader). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
