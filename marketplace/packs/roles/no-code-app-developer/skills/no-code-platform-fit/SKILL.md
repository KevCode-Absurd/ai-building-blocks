---
name: no-code-platform-fit
description: Picks the right home for a client portal or staff tool - Airtable Interfaces, Glide, Softr or Bubble - or says plainly when no-code is the wrong choice, by scoring the client's users, data size, data source, concurrency, permissions, mobile needs, sensitive data, code ownership and usage-based costs against each platform's documented limits. Returns a recommendation, a fallback, the plan limits to check, and the risks. Use before a client commits to a platform or plan, or when an existing no-code app is hitting limits.
---

# No-code platform fit

The wrong platform is expensive twice: once to build, once to move. This skill matches the job to the platform's documented limits before anything is built, and it is willing to say "not no-code".

Access levels for this skill: the whole skill runs at level 1 (read: the brief, the data structure, plan and usage pages). Buying a plan or add-on stays with the client.

## When to use

- A client asks "Bubble, Glide or Softr?" or "can we do this in Airtable?".
- An existing app is slow, near a record cap, or getting large usage bills.
- Before any build that involves sensitive data.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- Who logs in (staff, clients, public), how many now and in a year, and how many at once.
- The data: where it lives, records now and in a year, and whether it is sensitive.
- The jobs the app must do, and any must-haves: native app store listing, offline use, payments, files, complex logic, integrations.
- Whether the client must own the code or might move hosts.

## Steps

1. **Screen for "not yet".** Card numbers stored in the app: no; use the payment provider's hosted checkout. Health records, children's data or other special data: stop for a compliance review and check what the platform will sign. Strict data residency: check the vendor's terms first.
2. **Screen for "not no-code".** Any of these points away from no-code or towards a hybrid: the client must own runnable code (Bubble apps can't be exported as code; leaving means a rebuild and password resets); data or traffic beyond what any plan or source supports; fine-grained permissions on fields within one screen for many roles; heavy background processing with unpredictable usage costs; a required native app store presence on a platform that makes web apps only.
3. **Score the platforms against the job.** For each need, mark native, possible with add-ons, or not possible, using the platform's docs:
   - **Airtable Interfaces:** best when the team already lives in one base and users are staff or invited collaborators. Interface-only collaborators need a paid plan; there are no per-person permissions inside a page; records per base cap at 1,000 (Free), 50,000 (Team) or 125,000 (Business).
   - **Glide (Classic):** mobile-friendly web apps for staff and field teams from tables; row owners and roles for privacy; Airtable as a source needs Business or above; publishing needs a paid plan. GlideOS is a separate newer product; Classic apps can't be migrated to it.
   - **Softr:** client portals on Softr Databases, Airtable, Sheets or SQL; user groups and global data restrictions (create, edit and delete restrictions on Business and above); plans count Team and Client users separately.
   - **Bubble:** full web apps, native mobile on mobile plans, complex logic and its own database; privacy rules; usage measured in workload units against a monthly allowance; version control and branching depend on plan.
4. **Check the data source.** Airtable's API allows 5 requests per second per base; Softr's own guidance suggests 200 to 300 concurrent users for Airtable and 50 to 100 for Google Sheets. If the numbers don't fit, plan to move data to the platform's own database.
5. **Check the plan.** List the limits to confirm on the vendor's current pricing page: users, records, workload or updates, collaborators, publishing, custom domain, privacy features. No prices; they change.
6. **Name the risks.** Lock-in, usage costs, platform changes (for example GlideOS launching beside Glide Classic), and who maintains the app.
7. **Recommend.** One platform and one fallback, or "not no-code" with the reason and what to brief a developer on instead.

## Checks

- Sensitive data screened before any recommendation.
- Every need scored against documented features, with unsure items marked "check on the vendor's page".
- Users, records and concurrency checked against plan and source limits, with a year's growth.
- Lock-in and usage costs stated plainly.
- No prices quoted; purchase decisions left to the client.

## Output format

1. **Verdict**: platform and fallback, or not no-code, in two sentences.
2. **Fit table**: need, and native / add-on / not possible for each platform.
3. **Limits to confirm** on each vendor's pricing page.
4. **Risks** and **questions for the client**.

## Example of good output (short)

*Parkside Physio Group is a made-up business used only to show the format: four clinics want a portal where patients book, see treatment notes and pay.*

**Verdict:** not yet. Treatment notes are health data, so a compliance review comes first and must confirm which platforms will sign the agreements the clinics need. Payments should use the payment provider's hosted checkout, not card fields in the app.

| Need | Airtable Interfaces | Glide | Softr | Bubble |
|---|---|---|---|---|
| Patients log in and see only their own records | Not suited: no per-person permissions inside a page | Row owners | Global data restrictions | Privacy rules |
| Booking | Form only | Possible with integration | Possible with integration | Native build |
| Payment | Link to hosted checkout | Link to hosted checkout | Link to hosted checkout | Hosted checkout via plugin or API |
| Treatment notes (health data) | Review first | Review first | Review first | Review first |

**Questions:** which booking system do the clinics use now? Could the portal link to it instead of rebuilding booking?
