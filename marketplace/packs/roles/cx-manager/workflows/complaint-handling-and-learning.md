# Complaint handling and learning

**Trigger and cadence:** Daily for new complaints and deadlines; weekly for the deadline review; monthly for root causes. For any business with a complaint log, and essential for firms with regulated time limits (UK FCA-regulated firms, US consumer finance firms) or an ombudsman or ADR scheme.

**Access:** Ask which level the client grants for each tool (help desk, inbox, complaint log, CRM, tracker) and write it down as "Access I have". Until they answer, work at level 1. Log every action: what, where, when, result.

## Steps

1. **Capture (daily).** Make sure every complaint, from any channel, is logged with the date received, channel, product, summary and owner. Look for complaints hiding in survey comments, reviews, chats and social messages. *Level 1. Level 2: draft log entries. Level 3 within limits: create entries and apply the complaint tag.*
2. **Acknowledge (daily).** Draft a prompt acknowledgement that says who is handling it and when the customer will hear next. For UK FCA-regulated firms, note whether the complaint can be settled quickly with a summary resolution under the firm's rules. *Level 2: drafts. Level 3 within limits: send the approved acknowledgement template, which is not a formal reply.*
3. **Investigate (as needed).** Gather the records: what happened, when, what the customer was told, what policy says. Mark each fact with its record. *Level 1.*
4. **Draft the reply.** Use the `formal-complaint-reply-draft` prompt, with the required contents for the sector pasted from the firm's policy or regulator. *Level 2: draft. Approval: every formal complaint reply needs a fresh yes for that specific reply, even at level 3.*
5. **Redress.** Prepare any refund, correction or payment for the client to make. *Payments stay with the client; I prepare them.*
6. **Deadline review (weekly).** Run the `complaint-deadlines-and-root-causes` prompt for deadlines within the warning window and overdue items, with owners and next actions. *Level 1. Level 3 within limits: update owners and due dates in the tracker.*
7. **Learn (monthly).** Code complaints by root cause, compare with last month, and turn the top three causes into fixes with owners and measures; link them to survey themes and the customer path map. *Level 2: draft fix entries. Level 3 within limits: create them.*
8. **Escalate (same day).** Anything that suggests many customers were harmed the same way, a vulnerable customer, a safety issue, a data breach or a regulator or ombudsman contact goes to the client the same day.

Check this with local rules: time limits and required contents differ by country and sector, and a qualified adviser should confirm them.

## Outputs

- Complete complaint log with dates and owners
- Acknowledgements sent (at level 3) or drafted
- Reply drafts with claim-and-record lists, held for approval
- Weekly deadline table
- Monthly root cause report and fix list
- Escalation notes and the action log

## Needs the client's approval

Every formal complaint reply (fresh yes each time); any redress or payment (made by the client); contacting the ombudsman, regulator or a new party; deleting or changing complaint records; anything outside the agreed level 3 limits.
