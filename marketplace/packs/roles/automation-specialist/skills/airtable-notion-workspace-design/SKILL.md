---
name: airtable-notion-workspace-design
description: Designs an Airtable base or a Notion workspace a team will actually use - tables or databases for each thing tracked, fields with types and allowed values, links between them, views for each role, built-in automations only where they save real time, naming and ownership rules, a migration plan off spreadsheets with clean-up and import checks, and a one-page team guide. Level 1 to review the current set-up, level 2 to build in a new base or private teamspace, level 3 to migrate live data, turn on automations and change permissions within the client's limits.
---

# Airtable and Notion workspace design

## When to use

- A team is drowning in copies of the same spreadsheet.
- Client lists, projects, content calendars, inventories or volunteer rotas live in five places.
- An existing base or workspace has grown messy and nobody trusts it.
- A move from spreadsheets to Airtable or Notion is planned.

Pick Airtable when the work is mainly structured records, views and automations; pick Notion when it is mainly documents and wikis with some databases. Say which and why.

## What you need

1. How work flows: what comes in, who touches it, what decisions are made, what reports are needed.
2. The current sheets or exports (masked), and screenshots of the current base or workspace.
3. Team size, roles and who should see or edit what.
4. The plan (Free or paid matters: Notion database automations need a paid plan; Airtable automation runs have monthly limits by plan).
5. Access: level 1 to review the current set-up; level 2 to build in a new base or a private teamspace; level 3 to import live data, turn on automations, invite people or change permissions.

## Steps

### 1. List the things you track

Clients, projects, tasks, orders, products, volunteers. Each becomes a table (Airtable) or a database (Notion). One kind of thing per table.

### 2. Define the fields

For each: name, type (single select, date, number, link, person, checkbox), required or not, allowed values. Remove fields nobody uses. Use single selects instead of free text wherever a fixed list exists.

### 3. Link the tables

One client to many projects; one project to many tasks. Use links, lookups and rollups (Airtable) or relations and rollups (Notion) instead of copying data.

### 4. Design views for each role and job

A board by status, a calendar by due date, a "my items" list filtered to the viewer, a weekly report view. Name views by who uses them and why.

### 5. Add automations only where they save real time

Status changes that notify the owner, recurring task creation, a weekly digest. For each: trigger, action, who is notified on failure, the monthly run estimate against the plan, and how to switch it off. In Airtable, failure notices go to the last person who turned the automation on, so choose that person on purpose. In Notion, remember one database automation cannot trigger another.

### 6. Set naming and ownership rules

Table, field and view naming patterns; who owns each table; who may add fields; when records are archived.

### 7. Plan the migration (if moving from spreadsheets)

Map old columns to new fields; write clean-up rules (dates, names, duplicates, category spellings); decide import order (parents before children so links resolve); count records before and after; check a sample by hand. Keep the old sheets read-only until the new set-up has run for an agreed period.

### 8. Write the build sheet and team guide

Build sheet in build order, with a check after each step. A one-page guide: where things live, how to add and update records, naming rules, who owns what.

### 9. Build and go live

Level 2: build in a new base or private teamspace and test with sample records. Level 3, after the client confirms the action list: import live data, turn on automations, invite the team and set permissions. Log each action.

## Checks

- One kind of thing per table; no copied data where a link would do.
- Every field has a type and a reason to exist.
- Each role has a view that shows only what they need.
- Automations are few, inside plan limits, with a named failure contact and switch-off steps.
- Migration counts reconcile; a sample was checked by hand.
- Permissions match who should see and edit what.

## Output format

1. **Recommendation:** Airtable or Notion, and why.
2. **Schema:** tables or databases, fields with types, links.
3. **Views** by role.
4. **Automations** with trigger, action, failure contact, usage estimate, switch-off.
5. **Migration plan** with counts and checks.
6. **Build sheet** in order, with the access level each step needs.
7. **Team guide** (one page).

## Example of good output (short)

*Made-up organisation: Harbourside Food Bank, volunteers and shifts on Airtable Team.*

> **Tables.** Volunteers (name, phone, skills: multi-select, DBS checked: checkbox, status: single select). Shifts (date, site: single select, slots: number). Sign-ups (link to Volunteer, link to Shift, attended: checkbox).
>
> **Views.** Coordinators: "Unfilled shifts this week" (Shifts where filled < slots). Volunteers: shared form for sign-ups. Trustees: "Hours this quarter" (rollup by volunteer).
>
> **Automation.** When a shift is still unfilled 48 hours before it starts, email the coordinator. About 30 runs a month, well inside Team's 25,000. Failure contact: the coordinator who turns it on.
>
> **Migration.** 412 volunteer rows in the old sheet; 9 duplicates merged on phone number after review; 403 imported; 20 checked by hand.
