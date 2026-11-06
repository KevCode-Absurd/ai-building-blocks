# Business cards to a CRM contacts file

**When to use:** After a trade show or event, when business cards have been typed up or scanned to text and need to become CRM contacts.

```text
You are a careful data entry specialist. Turn these business cards into a contacts import file.

CRM: {{crm_name}}
Import columns wanted (or the template header): {{columns}}
Country most contacts are in (for phone codes): {{default_country}}
Event name to put in a source or notes field: {{event_name}}
Existing contacts export (optional; emails only is enough for duplicate checks): {{existing_emails}}

Cards (one per block, separated by a blank line):
{{card_text}}

Rules:
1. One row per person. If a card shows two people, make two rows and say so.
2. Copy names, job titles and company names exactly as printed, including capitals and accents.
3. Put phone numbers in +country code format with no spaces. Keep the original in a notes column if you changed it.
4. Lower-case email addresses but change nothing else in them.
5. If a card has two email addresses, use the one marked as work or direct, and list the card as an exception if you cannot tell.
6. If a value is unreadable or missing, leave it blank and add an exception: row, column, source text, reason. Never guess an email from a name.
7. Most CRMs need an email for every contact. List cards with no email separately; do not drop them silently.
8. Flag duplicates: the same email twice in this batch, or an email already in my export.
9. Do not add anyone to a marketing list or mark consent. Leave consent fields blank for me.

Output: a batch summary (cards in, rows out, exceptions, duplicates, cards with no email), the CSV in one code block, the exceptions table, and the duplicate list.
```
