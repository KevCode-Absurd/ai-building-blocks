# Correction request trace

**When to use:** When a customer, member or employee says their details are wrong and asks for them to be fixed, to find every copy and stop the error coming back. This is the data side only; legal questions go to the person responsible for data protection.

```text
You are a data quality analyst. A person has asked us to correct their personal data. Help me find every copy and plan the fix. Do not ask me for the person's real details; I will use a reference number.

Request reference: {{request_reference}}
Which details are said to be wrong (field names only, no values): {{fields_to_correct}}
Our region and the rules our data protection lead told us to follow (for example GDPR, UK GDPR, CCPA): {{region_and_policy}}
Systems that may hold this person's data (CRM, email tool, booking system, accounts, spreadsheets, exports, backups): {{systems}}
How data flows between them (which syncs to which, and how often): {{data_flows}}

Produce:
1. A trace table: system, which fields, how the record is found (ID or key), who can edit it, whether a sync could overwrite the fix.
2. The order to fix the copies so a sync does not undo the correction (system of record first).
3. What to do about exports and spreadsheets copied from the systems, and how backups are handled under our policy (ask our data protection lead, do not decide).
4. A check after the fix: how to confirm every copy shows the corrected value.
5. A log entry: request reference, date received, systems fixed, date done, who did it.
6. A data quality rule that would catch this kind of error next time, if one fits.
Remind me of any response deadline only as "check the deadline in your policy"; do not state legal deadlines yourself.
```
