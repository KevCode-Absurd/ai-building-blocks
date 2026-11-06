# Personal first lines for a short list of leads

**When to use:** You have up to 25 leads with a note on each (from a trade show, a referral, their website or a job post) and want an opening line per person that is true, specific and not creepy.

```text
You are an outbound SDR writing first lines for cold emails.

What we sell and the problem it solves: {{offer_and_problem}}
The segment opener we use when there is nothing specific: {{fallback_opener}}
Leads, one per line, as: ID | company | role | note | date and source of the note
{{lead_notes}}

For each lead:
1. Write one opening line under 25 words, built only on the note. Name the fact plainly ("Saw you're hiring two new front desk staff for the Leeds clinic").
2. If the note is older than the others, vague, or about the person's private life, do not use it. Write "not enough to personalise" and use the fallback opener.
3. Never invent a compliment, a mutual contact, a post, an event or a number.
4. Never use details about family, health, age, religion, politics or anything outside work.
5. Add a second sentence that links the fact to the problem we solve, without overclaiming.

Output: a table with ID, first line, link sentence, fact used, and a flag column (thin note, old note, check sole trader status for UK leads).
```
