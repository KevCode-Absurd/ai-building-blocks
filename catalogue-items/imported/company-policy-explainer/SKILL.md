---
name: policy-lookup
description: Find and explain company policies in plain language. Trigger with "what's our PTO policy", "can I work remotely from another country", "how do expenses work", or any plain-language question about benefits, travel, leave, or handbook rules.
argument-hint: "<policy topic — PTO, benefits, travel, expenses, etc.>"
---

# /policy-lookup

> In this skill, "~~knowledge base" means your handbook or policy documents (pasted, attached or connected), and "~~HRIS" means your HR system. If neither is connected, use the handbook text the user pastes.

Look up and explain company policies in plain language. Answer employee questions about policies, benefits, and procedures by searching connected knowledge bases or using provided handbook content.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **The policy** (yours): the written policy or rules, with the date they start.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **The policy** with the [Workplace policy and handbook writer](https://useaiblocks.com/skills/policy-handbook-writer). Bring your question, a document (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, the policy. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Usage

```
/policy-lookup $ARGUMENTS
```

Search for policies matching: $ARGUMENTS

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    POLICY LOOKUP                                   │
├─────────────────────────────────────────────────────────────────┤
│  STANDALONE (always works)                                       │
│  ✓ Ask any policy question in plain language                    │
│  ✓ Paste your employee handbook and I'll search it              │
│  ✓ Get clear, jargon-free answers                               │
├─────────────────────────────────────────────────────────────────┤
│  SUPERCHARGED (when you connect your tools)                      │
│  + Knowledge base: Search handbook and policy docs automatically │
│  + HRIS: Pull employee-specific details (PTO balance, benefits) │
└─────────────────────────────────────────────────────────────────┘
```

## Common Policy Topics

- **PTO and Leave**: Vacation, sick leave, parental leave, bereavement, sabbatical
- **Benefits**: Health insurance, dental, vision, 401k, HSA/FSA, wellness
- **Compensation**: Pay schedule, bonus timing, equity vesting, expense reimbursement
- **Remote Work**: WFH policy, remote locations, equipment stipend, coworking
- **Travel**: Booking policy, per diem, expense reporting, approval process
- **Conduct**: Code of conduct, harassment policy, conflicts of interest
- **Growth**: Professional development budget, conference policy, tuition reimbursement

## How to Answer

1. Search the handbook or policy documents for the relevant policy
2. Provide a clear, plain-language answer
3. Quote the specific policy language
4. Note any exceptions or special cases
5. Point to who to contact for edge cases

**Important guardrails:**
- Always cite the source document and section
- If no policy is found, say so clearly rather than guessing
- For legal or compliance questions, recommend consulting HR or legal directly

## Output

```markdown
## Policy: [Topic]

### Quick Answer
[1-2 sentence direct answer to their question]

### Details
[Relevant policy details, explained in plain language]

### Exceptions / Special Cases
[Any relevant exceptions or edge cases]

### Who to Contact
[Person or team for questions beyond what's documented]

### Source
[Where this information came from — document name, page, or section]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [HR policy drafter](https://useaiblocks.com/skills/hr-policy-drafter). It takes the document.
- The [Offboarding plan builder](https://useaiblocks.com/skills/offboarding-plan-builder). It takes the document.
- The [Ideal candidate profiler](https://useaiblocks.com/skills/ideal-candidate-profiler). It takes the document.
- The [Company handbook change reviewer](https://useaiblocks.com/skills/handbook-change-desk).
- **Lead the team** with the [Internal change announcement writer](https://useaiblocks.com/skills/change-announcement). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If Connectors Available

If **~~knowledge base** is connected:
- Search employee handbook and policy documents automatically
- Cite the specific document, section, and page number

If **~~HRIS** is connected:
- Pull employee-specific details like PTO balance, benefits elections, and enrollment status

## Tips

1. **Ask in plain language** — "Can I work from Europe for a month?" is better than "international remote work policy."
2. **Be specific** — "PTO for part-time employees in California" gets a better answer than "PTO policy."

Changed by AI Blocks (2026-10-28): added a note explaining the knowledge base and HR system placeholders and the pasted-handbook fallback.
