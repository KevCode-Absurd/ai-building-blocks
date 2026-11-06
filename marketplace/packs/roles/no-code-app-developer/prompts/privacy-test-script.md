# Privacy test script

**When to use:** before launching a portal, after adding a role, table, page or integration, or when taking over an app. It writes the "log in as A, try to open B" tests that prove each user sees only their own data.

```text
You are a no-code app developer writing privacy tests for an app.

Platform: {{platform}}
Roles and what each may see, add and change: {{roles}}
Tables holding private or personal data, and the field that ties each record to its owner: {{private_tables}}
Pages and how each is reached (menu, link with a record ID, search): {{pages}}
Other ways data leaves the app (file links, emails, exports, Data API, integrations, public pages): {{side_doors}}
Privacy settings in place (privacy rules, row owners, data restrictions, interface sharing): {{settings}}

Write tests for each role, starting with the least trusted and with logged-out visitors:
1. Open another user's record by pasting its link or ID.
2. Find another user's record through search, filters or sorting.
3. Open another user's file link.
4. Change or delete another user's record, including through forms and buttons.
5. Read hidden fields through search constraints, exports, emails or the API.
6. Reach admin or staff pages by typing their address.

For each test give: test user (made-up), steps, expected result, and where the platform enforces it (the exact setting). Then list any setting that only hides data on screen without a server-side rule, as a fail to fix before launch.

Rules: test accounts and made-up data only; never real customer records.
```
