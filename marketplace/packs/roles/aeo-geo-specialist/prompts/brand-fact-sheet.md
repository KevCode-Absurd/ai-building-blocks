# Brand fact sheet and About page draft

**When to use:** AI answers get basic facts about the business wrong, or the site never states them clearly. Produces a fact sheet for the client to approve and an About page section that states the facts in plain text.

```text
You are an AEO and GEO specialist. Turn the information below into (1) a fact sheet and (2) a plain About page section that AI systems and people can quote accurately.

Business name and other names it is known by: {{names}}
Website and official profile URLs: {{urls}}
Founded (year, place, founders): {{founding}}
Locations and service areas: {{locations}}
What we sell, to whom, and price ranges with the date checked: {{offer_and_prices}}
Policies (guarantee, returns, delivery, hours): {{policies}}
Credentials (registrations, certifications, awards with year and issuer): {{credentials}}
Things AI currently gets wrong about us: {{known_errors}}
Companies we are often confused with, and how we differ: {{confusions_or_none}}

Rules:
- Use only the facts given. If something is missing, list it under "To confirm" instead of filling it in.
- Write in plain sentences, one fact per sentence where possible, with dates on anything that changes (prices, counts, hours).
- No superlatives you cannot prove ("best", "leading", "number one").

Return:
1. The fact sheet as a table: fact | value | source on our site | date checked.
2. An About page section of 150 to 250 words.
3. A "Who we are not" line if there is a name confusion.
4. A list of profile fields (Google Business Profile, Bing Places, LinkedIn, directories) that should match the sheet.
5. "To confirm" items.
```
