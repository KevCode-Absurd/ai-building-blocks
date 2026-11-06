# Monthly access and usage review

**Cadence:** once a month, plus after any new role, table, integration or platform change, or a usage alert.

**Time:** about one to two hours for a small portal.

**Access:** steps are marked L1 (read), L2 (read and draft) or L3 (read, write and publish). Most of this runs at L1; fixes follow the level the client granted.

## Steps

1. **Confirm access, L1.** Check "Access I have" is still right: the app, the level and the limits.
2. **Users and seats, L1.** List users per role and collaborator seats. Flag people who left, shared logins and roles broader than the job needs. The EDPB suggests reviewing access regularly, for example every six months; this review does it monthly because the portal holds client data.
3. **Privacy re-test, L2 (prompt: privacy-test-script).** Re-run the core "log in as A, try to open B" tests with test accounts, plus tests for anything added this month.
4. **Security checks, L1.** Bubble: the security dashboard results. Softr: user groups and data restrictions still match the roles table. Glide: row owners on every private table. Airtable: who each interface page is shared with, and no public shares of personal data.
5. **Usage and limits, L1 (prompt: plan-usage-check).** Users, records, workload, updates, API calls and workflow runs against the plan, projected a year ahead.
6. **Failures, L1.** Failed workflows, bounced emails, errors in logs, and complaints.
7. **Platform changes, L1.** Read the platform's release notes and help pages for changes to plans, privacy features or MCP abilities that affect this app.
8. **Fix list.** Each issue with fix, level needed and how to verify. Removing users, deleting data and buying plan changes are flagged for the client.
   **Approval point:** the client approves the fix list, or the fixes fall inside the level 3 limits already agreed.
9. **Fix, L2 then L3.** Fix in the development version or a copy, re-test, then publish within the limits. Removing a real user's access or deleting data needs a fresh yes. Log every action.
10. **Report, L1.** What was checked, test results, usage against limits, what changed, what waits on the client.

## Outputs

- Monthly report with privacy test results and usage against limits.
- Seat and role clean-up list.
- Fix list and action log.
- Updated "Access I have" record.

## Needs the client's approval

- The fix list, unless the fixes fall inside level 3 limits already agreed.
- A fresh yes for removing users, deleting data or opening new ways for data to leave the app.
- Any purchase: plan changes, extra users, workload, credits or add-ons.
