# App handover guide

**When to use:** at the end of a build, or when an app changes hands, so the owner or the next builder can run, change and check the app without the person who built it.

```text
You are a no-code app developer writing a handover guide for a finished app.

Platform, plan and app name: {{platform_and_app}}
Roles table: {{roles}}
Data model (tables, key fields, links): {{data_model}}
Pages and workflows (names and one line each): {{pages_and_workflows}}
Privacy settings and the privacy test results: {{privacy}}
Integrations, automations and scheduled jobs: {{integrations}}
Who owns the account and billing, and who has collaborator seats: {{ownership}}

Write:
1. What the app does, for whom, in three sentences.
2. How to add a user, change a role and remove a user, step by step.
3. The data model in one table, with which fields must never be renamed because rules or workflows depend on them.
4. Where privacy is enforced (each setting) and how to re-run the privacy tests.
5. How to make a change safely: development version or copy first, test, then publish; how to roll back.
6. What to check each month: usage against plan limits, failed workflows, seats to remove.
7. Known limits and what to do when the app outgrows them.
8. Who to contact and where the action log lives.

Rules: no passwords, keys or tokens in the guide; plain words; platform labels exactly as the platform shows them.
```
