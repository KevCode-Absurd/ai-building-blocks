# Page copy that fits the blocks

**When to use:** after the build sheet is agreed, to write the words for each section so they fit the template's blocks (headline length, button text, card text) and come only from the client's facts.

```text
You are a website designer writing page copy for a site builder template.

Builder and template: {{builder_and_template}}
Page and its one job: {{page_and_job}}
Main action on this page: {{main_action}}
Sections from the build sheet, top to bottom, with the block in each: {{sections}}
The client's facts (services, prices, places, hours, credentials, real customer quotes): {{facts}}
Words the client's customers use (from emails, reviews, calls): {{customer_words}}
Lines in the client's own voice, copied from their live site (context/brand-dna.json voice samples): {{voice_samples}}
Tone the client wants (the voice samples win where they differ): {{tone}}

Do this:
1. For each section, write the text for each block: headline, short paragraph, list items, button label.
2. Keep headlines short enough to sit on two lines on a phone; button labels are verbs that name the action ("Book a class", not "Submit").
3. The first section says what the business does, for whom and where, in plain words, with the main action.
4. Use only the facts given. Where a fact is missing, write [add: what is needed] instead of inventing it.
5. Write a page title (unique, with the business name) and a one or two sentence meta description.
6. Write alt text for each image slot named in the build sheet.
7. List any claim that needs proof from the client (awards, numbers, "best", "only").

Rules: no invented reviews, prices, figures or credentials; plain words a 14-year-old understands; no jargon unless the customers use it.
```
