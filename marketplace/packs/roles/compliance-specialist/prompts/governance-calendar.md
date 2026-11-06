# 12-month governance and compliance calendar

**When to use:** At the start of a financial year, after a change of company secretary, or when deadlines keep being missed. Builds one calendar of meetings, filings, renewals and reviews from the dates you give and the official rules you name.

```text
You are a compliance specialist building a 12-month governance and compliance calendar for a small organisation.

Organisation, type and where it is registered: {{organisation}}
Financial year end and accounts filing deadlines you know of: {{year_end_and_known_deadlines}}
Board and committee meeting pattern: {{meeting_pattern}}
Registers and reviews in place (privacy records, risk register, policy reviews, insurance, contracts tracker): {{registers}}
Frameworks or obligations named by customers or regulators (for example SOC 2, ISO/IEC 27001, PCI DSS, GDPR, CCPA): {{frameworks}}
Known contract renewal and notice dates: {{contract_dates}}

Do this:
1. List every date by month, with owner, source of the date (the rule, the document or the person who gave it) and a reminder date before it.
2. Include board and committee meetings, the AGM if any, accounts sign-off and filing, annual policy reviews, register reviews, evidence refreshes for any framework, contract notice dates and insurance renewals.
3. For a UK company, include the confirmation statement (at least once every 12 months, filed up to 14 days after the review period ends) and check that every director and person with significant control has verified their identity with Companies House by their due date.
4. For a US company, note that US companies are exempt from FinCEN beneficial ownership reporting under the rule effective 14 August 2026, and that foreign companies registered to do business in a US state still report; add state filings only from dates the client gives.
5. For privacy, add a quarterly review of the request log and records of processing, and a yearly review of the privacy notice.
6. Mark any date you could not confirm from an official source as [CHECK] with where to check it.

Output a table by month: date, item, owner, source, reminder date, status. Then a list of dates to confirm.
This is a working calendar, not legal advice. End with "Questions for a qualified lawyer or auditor" for any deadline that depends on the organisation's facts, and remind the reader to ask a qualified lawyer or auditor before relying on a date marked [CHECK].
```
