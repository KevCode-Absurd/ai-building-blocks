# Plan, build and launch a client portal or staff tool

**Trigger:** a client wants a portal for their customers or a simple app for staff, built on Bubble, Glide, Softr or Airtable Interfaces from their current sheet or base.

**Time:** usually two to six weeks, depending on roles and data, much of it waiting for data clean-up and approvals.

**Access:** steps are marked L1 (read), L2 (read and draft) or L3 (read, write and publish). Until the client grants more, everything runs at L1 and the client or their builder does the L2 and L3 steps from my spec.

## Steps

1. **Brief (prompt: client-portal-brief), L1.** Roles, jobs, data, sensitive data, regions, numbers. Ask which level the client grants for each tool and the limits (which app or base, which kinds of change, until when), and write it down as "Access I have".
2. **Platform fit (skill: no-code-platform-fit), L1.** Recommend a platform and fallback, or say "not no-code" or "not yet" (sensitive data needs a review first).
   **Approval point 1:** the client confirms the platform. Buying the plan is the client's step.
3. **Roles and privacy plan (skill: roles-and-privacy-rules), L1.** Roles table, rules per table, side doors, privacy tests.
4. **Data model (skill: app-data-model; prompt: sheet-tidy-list), L1.** Tables, fields, owner fields, tidy list, limits check.
   **Approval point 2:** the client approves the roles table, data model and tidy list.
5. **Tidy the data, L2.** In a copy of the sheet or base. Check row counts before and after. The cut-over to live data needs a fresh yes if it overwrites anything.
6. **Page and workflow spec (skill: app-page-and-workflow-spec), L1.** Page cards with states, When, If, Then workflows, build order.
   **Approval point 3:** the client approves the spec and the must-have list.
7. **Build, L2.** In Bubble's Development version, a Glide copy (or with auto-publishing off), unpublished Softr pages or an Airtable interface draft. Privacy rules first, then pages, then workflows. Test users and made-up data only. Log every action.
8. **Privacy tests (prompt: privacy-test-script), L2.** Run every test for every role, logged out and least trusted first. Any fail stops the work until fixed.
9. **Client test, L2.** The client tries the test version with test accounts for each role.
   **Approval point 4:** the client approves the test results and the launch action list.
10. **Launch, L3 or the client.** At L3: show the action list, test results and limits; get one yes; deploy or publish; re-run the key privacy tests on live with test accounts; log each action. Bubble deploys happen in the Bubble editor, because its MCP server can't deploy. Inviting real users needs a fresh yes, because invites can give access at once.
11. **Hand over (prompt: app-handover-guide), L1.** Guide, action log, and seats to remove.

## Outputs

- "Access I have" record.
- Brief, platform fit, roles table, data model, tidy list and spec.
- Privacy test results (expected, actual, pass or fail).
- Action log (what, where, when, result).
- Handover guide.

## Needs the client's approval

- The access level and limits for each tool at the start, and any change to them.
- The platform (point 1), the plans (point 2), the spec (point 3), and the test results and launch list (point 4).
- A fresh yes for inviting real users, overwriting or deleting data, opening the Data API or public pages.
- Plan upgrades, extra users, overages and add-ons are always the client's own purchase.
