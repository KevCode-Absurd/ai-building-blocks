---
name: email-drafting
description: Draft a professional, audience-aware email or reply with calibrated tone and a clear call to action. Use when the user needs one message, response, follow-up, support note, or meeting request; use the Email sequence writer for a coordinated multi-touch outbound campaign.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Email Drafting

This skill enables an AI agent to compose professional, context-appropriate emails across a variety of scenarios. The agent analyzes the purpose, audience, and tone requirements, then produces a complete email with subject line, body, and call to action. It supports common email types including cold outreach, follow-up sequences, customer support responses, internal status updates, and meeting requests.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a brief. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Identify the email type and objective.** Determine the category of the email — cold outreach, follow-up, customer support reply, internal update, or meeting request. Each type has different structural expectations. A cold outreach email prioritizes a compelling hook, while a support response leads with empathy and resolution. Clarify the single desired outcome: a scheduled call, an acknowledged resolution, an informed team, etc.

2. **Profile the recipient and calibrate tone.** Gather details about the recipient: name, title, company, relationship history, and any previous interactions. Use this context to select the appropriate tone — formal for executive outreach, conversational for peer updates, empathetic for complaint responses, or urgent when time-sensitive action is required. Apply personalization tokens such as `{{first_name}}`, `{{company}}`, and `{{pain_point}}` when drafting templates.

3. **Compose the subject line.** Write a subject line that is specific, concise (under 60 characters), and action-oriented. Avoid generic phrases like "Quick question" or "Touching base." Instead, reference a concrete benefit or context point the user gave you, e.g., "Cut your onboarding time by [X%] — here's how" (only with a figure the user supplied) or "Follow-up: action items from Thursday's standup."

4. **Draft the email body with clear structure.** Follow a proven structure: opening hook (1-2 sentences establishing relevance), body (2-3 short paragraphs delivering the core message with supporting evidence or context), and closing with a single, unambiguous call to action. Keep paragraphs under 3 sentences. Use bullet points for lists of items or benefits. Avoid walls of text.

5. **Add signature and formatting polish.** Include an appropriate sign-off ("Best regards," for formal, "Thanks," for casual, "Cheers," for friendly) followed by the sender's name, title, and contact info. Review the draft for grammar, spelling, and readability. Ensure the email can be scanned in under 30 seconds.

6. **Review against checklist and deliver.** Verify the email meets these criteria: subject line is compelling, tone matches the audience, the CTA is clear and singular, the email is under 200 words for outreach or under 300 words for detailed responses, and no placeholder tokens remain unresolved. Output the final email in a ready-to-send format.

**Facts rule.** Use only the facts, numbers, offers and results the user gave you. Do not add any figure, discount, promise or customer result of your own. Do not state that something is fixed, active, refunded or done unless the user said so. Put a bracketed placeholder such as [X%], [discount if approved] or [only if confirmed: ...] where a fact is missing, and tell the user to fill it in or delete it before sending. A draft with any bracket left in is not ready to send. The numbers and offers in the examples below are made-up placeholders, not claims to reuse.

## Usage

Provide the agent with the email type, recipient details, purpose, key points to include, and desired tone. The agent will return a complete email with subject line, body, and signature.

**Prompt format:**

~~~
Draft a [type] email to [recipient details].
Purpose: [what you want to achieve]
Key points: [information to include]
Tone: [formal / casual / empathetic / urgent]
~~~

## Examples

### Example 1: Cold Outreach Email

**Input:**

~~~
Draft a cold outreach email to Sarah Chen, VP of Engineering at Cloudstream Inc.
Purpose: Introduce our API monitoring platform and book a 15-minute demo.
Key points: Their engineering blog mentions scaling challenges; our tool reduces incident response time by [X%, from our own customer data].
Tone: Professional but conversational.
~~~

**Output:**

~~~
Subject: Reducing incident response time at Cloudstream

Hi Sarah,

I read your recent post on scaling Cloudstream's microservices architecture — the scaling challenges you described are the problem our platform is built for.

We built Watchdog specifically for engineering teams navigating that transition. Our API monitoring platform [one line on what it does, in your own words]. Teams using Watchdog have cut their mean incident response time by [X%, from our customer data], saving [N] engineering hours per week.

Would you be open to a 15-minute walkthrough? I can show you how Watchdog would map onto Cloudstream's stack. Here's a link to grab a time that works: [calendar link]

Best regards,
Alex Rivera
Account Executive, Watchdog
alex@watchdog.io | (555) 234-5678
~~~

### Example 2: Customer Support Response to a Complaint

**Input:**

~~~
Draft a customer support response to Marcus Webb who is upset about being double-charged for his subscription renewal.
Purpose: Acknowledge the error, confirm the refund, and retain the customer.
Key points: Refund of $49.99 will appear within 3-5 business days; root cause was a billing system migration.
Tone: Empathetic and reassuring.
~~~

**Output:**

~~~
Subject: Your refund for the duplicate charge has been processed

Hi Marcus,

I'm truly sorry about the duplicate charge on your account — I completely understand how frustrating that must be, and I want to assure you that we've already taken care of it.

We've processed a full refund of $49.99 to your original payment method. You should see the credit reflected within 3-5 business days. The duplicate charge was caused by an issue during our billing system migration. [Only if your team has confirmed it: We've fixed the cause.]

[Only if you have checked the account: Your subscription is still active.] [Only if you are authorised to offer it: As a thank-you for your patience, I've also applied a [discount] to your next renewal.]

If you have any other questions or concerns, please don't hesitate to reply to this email — I'm happy to help.

Warm regards,
Jamie Torres
Customer Support, BrightSaaS
~~~

## Best Practices

- **One call to action per email.** Multiple CTAs dilute urgency and reduce response rates. Choose the single most important next step and make it unmissable.
- **Front-load the most important information.** Recipients often scan only the first two sentences. Lead with relevance — why should they care right now?
- **Match paragraph length to formality.** Formal emails can tolerate slightly longer paragraphs; casual outreach should use 1-2 sentence paragraphs with generous whitespace.
- **Personalize beyond the name.** Reference a recent achievement, shared connection, or specific pain point. Generic personalization ("I see you work at Acme") feels robotic.
- **Use time-bounded CTAs when appropriate.** "Would Thursday or Friday afternoon work?" outperforms "Let me know when you're free" because it reduces decision friction.
- **Proofread for tone as well as grammar.** Read the email aloud to catch phrases that sound condescending, pushy, or overly casual for the context.

## Edge Cases

- **Unknown recipient name.** When the recipient's name is unavailable, use a role-based greeting ("Hi there" or "Hello, Marketing Team") rather than "To whom it may concern," which reads as impersonal.
- **Emotionally charged complaints.** For angry or frustrated customers, avoid defensive language. Lead with validation ("I understand why that's frustrating") before explaining the resolution. Never blame the customer.
- **Multi-recipient emails.** When addressing a group, ensure the CTA specifies who should take action. Diffusion of responsibility leads to no one responding.
- **Follow-up after no response.** Reference the original email briefly and add new value (a relevant case study, a deadline, or a simplified ask) rather than simply bumping the thread.
- **Legal or compliance-sensitive content.** Flag emails that may involve contracts, NDAs, financial disclosures, or regulatory language for human review before sending.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Fresh draft reviewer](https://useaiblocks.com/skills/cold-reread-marker). It takes the draft.
- The [Story impact reviewer](https://useaiblocks.com/skills/single-effect-draft-checker). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
