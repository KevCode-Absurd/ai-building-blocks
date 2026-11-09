---
name: roles-and-privacy-rules
description: Plans and checks who can see and change what in a no-code app - a roles table, the platform's real server-side setting for each rule (Bubble privacy rules, Glide row owners and roles, Softr global data restrictions and user groups, Airtable interface sharing), and a privacy test list written as "log in as A, try to open B". Use before building a client portal or staff tool, before launch, after adding a role or table, or when a client worries that one customer can see another's data.
---

# Roles and privacy rules

A portal fails the day one client sees another client's invoice. Most leaks in no-code apps come from the same habit: hiding a page or filtering a list, while the data still reaches the browser or an API. Broken access control is the top risk in the OWASP Top 10:2025, which found some form of it in every application tested. This skill sets the rules on the server and proves them with tests.

Access levels for this skill: the plan and review need level 1 (read the app's settings or screenshots). Setting rules in a development version, a copy or with test users needs level 2. Changing live rules, user groups or restrictions needs level 3, within the client's limits, and only after the tests pass. Inviting real users, opening the Data API or making a page public needs a fresh yes.

## When to use

- Before building any app where people log in and must not see each other's data.
- Before launch, and after adding a role, table, page or integration.
- When taking over an app someone else built.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- The platform and plan (some features are plan-gated: Softr create, edit and delete restrictions need Business or above; Airtable interface-only collaborators need a paid plan; Bubble's advanced security checks need Growth or above).
- The list of user types and what each does.
- The data model: tables and fields, and which fields hold personal or sensitive data.
- Every way data leaves the app: pages, searches, file links, exports, emails, the Data API, integrations, public pages.

## Steps

1. **Write the roles table.** For each role: who they are, what they can see, add, change, and must never see. Start from "nothing" and add only what the job needs.
2. **Mark sensitive fields.** Names, emails, phone numbers, addresses, files, notes, money amounts. Ask whether each is needed at all; drop what isn't.
3. **Link every record to its owner.** Each private record needs a field that ties it to a user or a company (Created by, Client, Owner email). Without it, no rule can work.
4. **Set the rule in the platform's server-side feature.**
   - **Bubble:** a privacy rule per data type ("This Task's Client is Current User's Client"), View ticked only on needed fields, Constraint unticked on hidden fields, search privacy set to Strict for sensitive data, file viewing limited, and an "Everyone else" rule that grants nothing. Remember hidden fields can still be changed by workflows, so check workflows too.
   - **Glide (Classic):** make the app private, assign roles in the users table, and set Row Owner columns so each row goes only to its owner or role.
   - **Softr:** user groups for each role, plus global data restrictions per table, usually matching the logged-in user's email to a field; use "Can only" for own records and remember "Can't" wins on conflicts. Visibility on pages and blocks is extra, not a substitute. Airtable views and Sheets filters are not security.
   - **Airtable Interfaces:** share each interface page only with the people who should open it. Page filters decide which records show, not who can open the page, and there are no per-person permissions inside one page, so build separate pages for separate audiences. Don't share pages publicly if they hold personal data.
5. **Close side doors.** Data API off unless needed, and then only the needed data types; no admin tokens in outside tools; no public pages with private data; email workflows send only the recipient's own data; exports limited to admins.
6. **Write the privacy tests.** For each role, with test users and made-up data: log in as A, try to open B's record by link, find B in a search, open B's file link, and change B's record. Also test logged-out access and the least trusted role first. In Bubble, a collaborator with "run as" data permission can log in as a test user.
7. **Run the tests (level 2).** Record expected and actual results. Any fail stops the work until fixed.
8. **Publish (level 3).** Show the test results, the action list and the limits; get a yes; deploy or publish; repeat the key tests on live with test accounts; log each action.

## Checks

- Every table with personal data has a server-side rule, not only hidden pages or filters.
- Every private record has an owner field the rule uses.
- An "Everyone else" or default rule grants nothing.
- Side doors (API, public pages, file links, emails, exports) are listed and closed or limited.
- Every role has passing tests, including logged out.
- No real personal data used in tests.

## Output format

1. **Roles table**: role, who, can see, can add, can change, must never see.
2. **Rules per table**: the platform setting and its exact condition.
3. **Side doors**: each one and how it is closed.
4. **Privacy test list**: test, steps, expected, actual, pass or fail.
5. **Open questions** for the client.

## Example of good output (short)

*Illustrative structure, not a real business: a small accounting firm with a Softr client portal on an Airtable base. Copy the shape, never the content: every fact comes from the client's own context.*

| Role | Can see | Can add | Can change | Must never see |
|---|---|---|---|---|
| Client | Own company's tasks and uploads | Receipts for own company | Own contact details | Other companies, staff notes |
| Staff | All clients' tasks and uploads | Tasks | Tasks, statuses | Billing settings |
| Partner | Everything staff sees | Users | User groups | Card numbers (never stored) |

**Rule (Softr global data restriction):** Tasks table, group Clients, View "Can only" where the task's Client Member Emails field (a lookup from the linked Company) contains the logged-in user's email. Not by email domain, because unrelated people can share a domain.

| Test | Steps | Expected | Result |
|---|---|---|---|
| Client A opens B's task by link | Log in as test-client-a, paste B's task URL | No record shown | Pass |
| Client A searches B's company name | Search box on Tasks page | No results | Pass |
| Logged out | Open the Tasks page URL | Sent to sign-in | Pass |
| Client A opens B's receipt file link | Paste the file URL | Blocked | Fail: file link is public; fix before launch |
