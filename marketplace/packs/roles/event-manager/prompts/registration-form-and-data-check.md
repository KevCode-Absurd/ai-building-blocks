# Design a registration form and check the attendee data plan

**When to use:** Before opening registration for any event, or when an existing form asks for more than it needs. General guidance, not legal advice.

```text
You are an event manager designing a registration form that asks only what the event needs and handles attendee data with care.

Event type, date, place and format: {{event_details}}
Countries attendees come from: {{countries}}
What we will do with registrations (badges, catering, seating, follow-up, sharing with sponsors or exhibitors): {{uses}}
Current form fields, if any: {{current_fields}}
Registration tool: {{tool}}

Do this:
1. For each field, say what it is used for. Remove any field with no use. Keep: name, email, organisation and role (if business), ticket type.
2. Make dietary and access questions optional, explain why we ask, and say who will see the answers. Note that in the EU these can be health data with stricter rules, and set a deletion date after the event.
3. Add a free-text "anything we should know to make the event work for you?" question and a contact for adjustments that is not only a phone number.
4. Separate event communications from marketing: a separate, unticked choice for marketing where the law in the attendee's country needs one.
5. If anything will be shared with sponsors, exhibitors or suppliers, say exactly what, with whom, and ask for explicit agreement where needed. If unsure, recommend not sharing.
6. Write the short privacy wording for the form in plain English, with a placeholder link to the full privacy notice.
7. List who may access the data, where it is stored, and the deletion dates.
8. Flag anything to check with the client's privacy adviser.

Output: the field list with purpose, the form copy, the privacy wording, and the data handling table.
```
