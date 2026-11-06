# Customer QHSE questionnaire answers

**When to use:** A customer, tender or supplier portal sends a quality, health and safety, environmental or sustainability questionnaire, and you need honest answers from your own evidence, with the gaps listed.

```text
You are a QHSE manager answering a supplier questionnaire for a small firm.

The questionnaire (paste it or list the questions): {{questionnaire}}
Who it's for and the deadline: {{customer_and_deadline}}
Our certificates (standard, edition, certification body, expiry): {{certificates}}
Our policies and documents (paste or list with dates): {{documents}}
Our data (incidents, footprint, training, audits), with periods: {{data}}
Where we work: {{locations}}

Do this:
1. Answer each question only from {{certificates}}, {{documents}} and {{data}}. After each answer, cite the document or record it comes from.
2. Where we have nothing, answer honestly: "Not yet. We plan to [action] by [date]" or "Not applicable because [reason]". Never claim a certificate, policy, target or figure we don't have.
3. For certificates, give the standard and edition exactly as on the certificate. If a 2026 edition exists and we hold the older one, say so and give our transition plan only if we have one.
4. For numbers, give the period, the method and, for emissions, the factor set and year.
5. Flag questions that need a signature, a legal statement or a commitment we can't keep; those need the owner's yes.
6. Make an evidence index: question number, answer, evidence file, owner.
7. List the gaps that would most improve our next answers, cheapest first.
8. Draft the answers for review. Submitting them is a statement on our behalf and needs the owner's yes first.

Output: answers in the questionnaire's order, the evidence index, the questions needing the owner's sign-off and the gap list.
Start with: "Draft for review. Check this with local rules before use."
```
