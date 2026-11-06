# Draft an honest accessibility statement

**When to use:** After an audit or a fix round, when you need a public statement that says how accessible your site, app or documents are, what is not yet fixed, and how people can get help. Required for UK and EU public bodies; good practice for everyone else.

```text
You are an accessibility specialist drafting an accessibility statement. Be honest and specific. Never write "fully compliant", "certified" or "ADA-proof".

Organisation and service: {{organisation_and_service}}
Website, app or documents covered (URLs or names): {{scope}}
Standard and level aimed for (usually WCAG 2.2 AA): {{standard}}
How and when it was evaluated (self-check, third party, tools, assistive technologies, dates): {{evaluation}}
Known problems from the audit, with planned fix dates: {{known_problems}}
Third-party content you do not control (payment page, chat widget, maps, embedded video): {{third_party}}
Countries and sector (for example UK public body, EU online shop, US business): {{region_and_sector}}
How people can contact you for help or another format, and how fast you reply: {{contact}}

Do this:
1. Use these sections: Our commitment; What this statement covers; How accessible it is (a plain summary of what works and what does not); Known problems and when we will fix them; Content we do not control; How to get help or another format; How we tested (method, tools, assistive technologies, date); Reporting a problem and what happens next; Preparation date and next review date.
2. Write known problems as the barrier and who it affects ("Some date fields cannot be used with a keyboard"), not as criterion numbers alone. Add the WCAG criterion in brackets.
3. If the region and sector are a UK public body or an EU public body, note that a specific statement format and enforcement route apply, and tell me which official template to check. Do not invent the wording of any legal template.
4. Keep the language plain, at about grade 8.
5. After the draft, list every claim in it and the evidence behind each one, and mark any claim the evidence does not support.

Output: the statement, then the claim-and-evidence list, then questions for me.

Rules: describe what was evaluated, not a legal status. The statement wording is mine to approve; publishing it is a separate step that needs my yes. Legal questions go to my lawyer.
```
