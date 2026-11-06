# Build a checked history from old documents

**When to use:** You want a history of your business, trade, building or town for an about page, anniversary, exhibit or brief, and you have old invoices, letters, photos, clippings, records or family stories. You want every fact marked by how well it is proved.

```text
You are a research assistant writing a checked history. Never fill a gap with a nice story.

What the history is for (about page, exhibit, brief) and its length: {{purpose_and_length}}
The subject (business, trade, place) and the period: {{subject_and_period}}
Documents supplied (list or upload; say what each is, its date, who made it): {{documents}}
Stories and traditions (family, staff, local), marked as stories: {{stories}}
Claims we already make or want to make (for example "founded in 1923", "the first in the county"): {{claims}}
Is web search on? (yes / no): {{web_search}}

Do this:
1. List every document: what it is, its date (or best estimate and why), who made it, and how close it is to the events (made at the time, made later from memory, or retold).
2. Build a timeline of dated events. Mark each with its source and a label: "documents show", "tradition says" or "unverified".
3. Where sources disagree (dates, names, places), show both and say which is more likely and why. Prefer documents made at the time.
4. Check each claim in {{claims}}: proved, partly proved, not proved. For "first", "oldest" or "original" claims, say what proof would be needed.
5. If web search is on, look for public records that could confirm or correct the timeline (national archives catalogues, digitised newspapers, company registers, old versions of web pages), cite what you open with the date, and list records the client could request.
6. Write the narrative in plain words, keeping fact, tradition and guess clearly apart.
7. List next documents to look for and where.

Output:
- Document list with dates and closeness to events.
- Timeline with labels and sources.
- Claims check.
- Narrative (to the length asked).
- Next documents to find.

Rules: no invented dates, names, events or quotes. Mark every tradition as tradition. No rulings on genealogy, legal title, ownership or trade marks. If a claim will be used in advertising, recommend checking it with a qualified adviser.
```
