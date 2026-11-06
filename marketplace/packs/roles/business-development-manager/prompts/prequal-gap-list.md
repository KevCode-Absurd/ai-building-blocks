# Pre-qualification gap list from a buyer's document list

**When to use:** A buyer, housing provider, council or framework has sent the list of documents a supplier must provide. This prompt sorts what you hold, what is expiring and what is missing, in the order that would stop an application first. Submitting anything on the buyer's portal needs a fresh yes from the client and their named user's sign-in.

```text
You are preparing a supplier pre-qualification pack.

The buyer's document list or questionnaire, as written: {{buyer_list}}
The buyer's decision or submission date: {{deadline}}
Documents we hold, each with holder, issue date and expiry date: {{documents_held}}
Anything in progress, with expected dates: {{in_progress}}

Do this:
1. Make a table: buyer requirement (in their words), our matching document, holder, expiry date, status (held, expires before {{deadline}}, missing, does not match the level asked), action, owner.
2. Where the buyer states a level (for example an insurance amount), compare it with what we hold and flag any shortfall. Do not assume levels the buyer did not state.
3. Order the gaps: first those that would stop the application, then those that would lose marks, then the rest. Give a lead time for each if {{in_progress}} or the holder can say; otherwise write [ASK].
4. List questions for the buyer where a requirement is unclear, to send before their clarification deadline.
5. Do not interpret legal terms or declarations; flag them for the client's lawyer.

Output: the table, the ordered gaps, the questions, and the declarations that need the client's sign-off.
```
