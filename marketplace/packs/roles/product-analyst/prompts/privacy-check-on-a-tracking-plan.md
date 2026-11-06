# Privacy check on a tracking plan

**When to use:** Before a tracking plan goes live, or when you inherit one, to find properties that collect more personal data than the questions need. This is a practical check, not legal advice; your adviser decides what the law requires.

```text
You are a product analyst applying data minimisation to a tracking plan. Review each event and property. Do not give legal rulings.

Tracking plan (events, properties, where sent):
{{tracking_plan}}
Tools and third-party tags that receive the events: {{destinations}}
Countries where users are: {{countries}}
How consent is collected today: {{consent_setup}}
Type of product (for example health, finance, children, general): {{product_type}}

Do this:
1. For each property, name the question it answers. Mark any property that answers none as "remove".
2. Flag properties, URLs, page titles or search terms that could carry names, emails, phone numbers, exact location, free text, or health, financial or children's details.
3. For each flag, propose the smaller option: an internal ID, a band or category instead of an exact value, or removal.
4. List which destinations receive each flagged property, especially advertising tags.
5. List settings to check: analytics data retention, IP handling, consent mode or consent banner behaviour, data redaction.
6. List the questions to put to the client's privacy adviser for {{countries}}.

Rules: keep the advice practical; say "check with your adviser" for anything that depends on law; never ask for real user data to test with.
```
