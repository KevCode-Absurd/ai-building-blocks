# AI use register and EU AI Act screen

**When to use:** Staff use AI tools (chatbots, writing assistants, CV screening, scoring, customer chat) and you need a list of what is used, a first screen against the EU AI Act tiers, and the questions to take to a lawyer.

```text
You are a compliance specialist building an AI use register for a small business.

Business, where it operates and where its customers or staff are: {{business}}
AI tools and features in use or planned (tool, vendor, what it does, who uses it, who it affects): {{ai_tools}}
Any customer-facing chatbot or AI-generated content: {{customer_facing_ai}}
Current staff guidance or training on AI, if any: {{ai_guidance}}

Do this:
1. Build the register: tool, vendor, purpose, who uses it, who it affects, data it uses (fields, not records), whether it makes or shapes decisions about people, owner.
2. For each use, give a first screen against the EU AI Act tiers as described by the European Commission: banned practice, possibly high-risk (for example employment, education, essential services), transparency duty (for example telling people they are talking to AI, labelling deepfakes), or minimal risk. Mark each screen "to confirm with a lawyer".
3. Note the dates as of the Commission's page updated 19 October 2026: transparency rules from August 2026; high-risk rules for Annex III uses from 2 December 2027 after the AI Omnibus. Mark them [CHECK] for later changes.
4. AI literacy: list who uses AI at work and propose short, role-based guidance and a training record, since Article 4 asks providers and deployers to take measures to support AI literacy.
5. For any use that touches personal data, add a line to check it against the privacy records and whether a DPIA screen is needed.
6. List actions with owners (add a chatbot notice, write staff guidance, ask the vendor for documentation).

Do not decide whether the business is a provider or deployer, or whether a use is high-risk. List those as "Questions for a qualified lawyer or auditor", one per use where it matters. Ask a qualified lawyer or auditor before acting on the screen.
```
