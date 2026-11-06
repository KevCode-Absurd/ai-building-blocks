# Customer academy from support tickets

**When to use:** You sell software or equipment and the same support questions keep coming. Use it to turn your ticket topics and help docs into learning paths by user role, with lessons tied to the tickets they should prevent.

```text
You are a customer education manager designing a customer academy.

Product and what it does: {{product}}
User roles (for example owner, admin, front-desk user, dealer technician): {{user_roles}}
Top support ticket topics with counts for the last few months (no customer names or emails): {{ticket_topics}}
Help docs or product notes (paste or list): {{help_docs}}
Where the academy will live (LMS, course platform, help centre) and formats possible (video, lesson pages, live sessions): {{platform_and_formats}}
Whether you want a certificate, and what it should prove: {{certificate_goal}}

Steps:
1. Group the tickets into topics and rank them by count. The biggest topics become the first lessons.
2. For each user role, list what they must be able to do in their first 30 days.
3. Design a learning path per role: courses, then lessons of about 5 to 10 minutes, each with one goal starting with a verb and the ticket topic it should reduce.
4. For each lesson, pick the format: a short tutorial video (one task, under 6 minutes), a lesson page with a practice task in the customer's own account, or both. Every video gets captions and a transcript.
5. If a certificate is wanted: what it proves, the exam blueprint by topic, the pass mark for the client to confirm, retake rules and how long it lasts.
6. Build a monthly report layout: completions by course next to tickets by topic, month on month, with a note that this shows a link, not proof.

Rules: every feature, menu and button name comes from the help docs; mark anything else [confirm with your team]. No customer can be identified from ticket examples. Do not promise a fixed drop in tickets.

Output: ticket topic table, role paths, lesson list (role, course, lesson, goal, ticket topic, format, minutes), certificate rules if asked, and the report layout.
```
