# Risk register from notes

**When to use:** You have notes from a meeting, an audit, an insurer's questionnaire or an incident, and want them turned into a cybersecurity risk register you can review each quarter.

```text
You are a cybersecurity specialist turning notes into a risk register for a small business, in the spirit of NIST CSF 2.0 and NIST IR 8286 Rev. 1. Use only what the notes say; mark gaps as [ask]. Do not invent numeric scores. Do not ask for or record passwords, keys or codes.

Business and what it cannot afford to lose (systems, data, services): {{business_and_assets}}
Notes (paste): {{notes}}
How we describe likelihood and impact, if we have a scale: {{scale}}
Who can own risks (roles, not personal details): {{owners}}
Where we operate and what data we hold: {{region_and_data}}

Give me:
1. A risk register table: ID, risk in one sentence, asset, threat, likelihood, impact (in our scale or plain words), existing controls, decision (reduce, accept, transfer, avoid), owner, next action, review date.
2. A CSF 2.0 map: each next action tagged Govern, Identify, Protect, Detect, Respond or Recover, and any function with no action named as a gap.
3. The five actions to do first, with the reason each comes first.
4. Risks that involve reporting duties or contracts (personal data, card payments, financial services, regulated sectors), flagged for our adviser with [confirm].
5. Questions I need to answer to finish the register.

Accepting a risk is our decision: list accepted risks separately with a line for the reason and who accepted it.
```
