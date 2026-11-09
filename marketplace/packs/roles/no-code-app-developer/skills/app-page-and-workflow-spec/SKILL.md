---
name: app-page-and-workflow-spec
description: Specs every page or screen of a no-code app (Bubble, Glide, Softr or Airtable Interfaces) as a card - purpose, who sees it, elements, what each button does, and the empty, loading and error states - plus every workflow and formula in When, If, Then form with what happens when it fails, and a build order for a first working test version. Use after the roles and data model are agreed and before building, or to document an app someone else built.
---

# App page and workflow spec

Builders get stuck on the questions nobody asked: what shows when a client has no tasks yet, what happens if the upload fails, who gets the email. A page and workflow spec answers them before the build, so the app works on day one.

Access levels for this skill: writing the spec needs level 1. Building pages and workflows in Bubble's Development version, a Glide copy with auto-publishing off, unpublished Softr pages or an Airtable interface draft needs level 2. Deploying or publishing, and switching on workflows that email real users or change live data, need level 3 within the client's limits, after the privacy tests pass. Workflows that send to people who haven't been emailed before, or that delete data, need a fresh yes.

## When to use

- After the roles table and data model are agreed.
- Before handing a build to a builder, or before building yourself.
- To document an inherited app before changing it.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- The roles table and data model (skills: roles-and-privacy-rules, app-data-model).
- The platform and plan, and its workflow features (Bubble workflows and backend workflows, Glide actions, Softr workflows and action buttons, Airtable automations).
- The jobs each role must do, in the client's words.

## Steps

1. **List jobs per role.** "Client uploads a receipt", "Staff marks a task done", "Partner invites a client". Each job maps to one or more pages.
2. **Mark must-have or later.** The first test version covers only must-have jobs for the main role.
3. **Write a card per page.** Purpose in one line; who can open it (and what logged-out visitors see); elements top to bottom (list, form, detail, buttons) with the table and fields each shows; filters, using the logged-in user where the data is private; what each button does.
4. **Write the states.** Empty (no records yet: say what to do next), loading, error (what went wrong and what to do), and no access (send to sign-in or a plain message).
5. **Write each workflow as When, If, Then.** When: the trigger (button click, record created, schedule, incoming webhook). If: the conditions, including the user's role. Then: each step in order. On failure: what the user sees, what is logged and who is told.
6. **Check platform limits.** Bubble workflows time out at 300 seconds and count towards workload; Airtable automations created through its MCP server stay as drafts until turned on in Airtable; Glide edits to Sheets, Airtable or Excel use updates; Softr workflows pause at the plan's monthly execution limit. Move heavy jobs to a schedule or a backend workflow, and keep the user's screen fast.
7. **Write formulas plainly.** For each computed field: what it calculates, from which fields, and an example with made-up numbers.
8. **Check emails and notifications.** Who receives each one, what data it carries (only the recipient's own), and the opt-out where needed.
9. **Order the build.** Data and privacy rules first, then the main role's must-have pages, then workflows, then the second role, then "later" items.
10. **Build (level 2), then publish (level 3).** Build in the development version or copy, test each card's states and each workflow's failure path with test users, then publish after the privacy tests pass and the client approves. Log each action.

## Checks

- Every must-have job has a page and, where needed, a workflow.
- Every page card has who can open it and all four states.
- Every private list filters by the logged-in user and relies on a server-side rule as well.
- Every workflow has a failure path, and no email carries another user's data.
- Heavy or slow work runs in the background, within platform limits.
- The build order gives a working test version early.

## Output format

1. **Jobs list** by role, must-have or later.
2. **Page cards**: purpose, who, elements, buttons, states.
3. **Workflows**: When, If, Then, On failure.
4. **Formulas** with examples.
5. **Build order** and **open questions**.

## Example of good output (short)

*Illustrative structure, not a real business: a tutoring agency building a parent portal in Bubble. Copy the shape, never the content: every fact comes from the client's own context.*

**Page card: My lessons (must-have)**
- Purpose: parents see their child's upcoming and past lessons.
- Who: role Parent, logged in; logged-out visitors go to sign-in.
- Elements: list of Lessons where Student's Parent is Current User, sorted by date; each row shows date, subject, tutor first name, status.
- Buttons: "Request a change" opens a form for that lesson.
- States: empty "No lessons booked yet. Your tutor will add them after the first call."; loading spinner on the list; error "We couldn't load lessons. Refresh, or email the office."

**Workflow: Request a change**
- When: Parent submits the change form.
- If: the lesson date is more than 24 hours away (the agency's own rule) and the lesson belongs to Current User's student.
- Then: create a Change request linked to the lesson; set lesson status to "Change requested"; email the lesson's tutor the date and the parent's note only.
- On failure: show "Your request didn't send. Please try again or call the office."; log the error with the lesson ID; email the office.
