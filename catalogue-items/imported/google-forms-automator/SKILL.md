---
name: google-no-code
description: "Design Google Forms and wire Apps Script triggers (onFormSubmit) for email alerts, spreadsheet logging, and dynamic questions — no code editor required."
category: automation
risk: safe
source: self
source_type: self
date_added: "2026-09-19"
author: WHOISABHISHEKADHIKARI
tags: [google, forms, apps-script]
tools: [claude, cursor, gemini]
---

# Google No-Code Forms Automation

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Guides the user through building a Google Form in the Forms UI and connecting it to Google Apps Script triggers, without writing a custom integration or leaving the browser. Covers form design, the Apps Script editor, the `onFormSubmit` trigger, and small response-handling scripts that run automatically when a form is submitted.

## When to Use This Skill

- Use when the user wants to build a Google Form and automate what happens after submissions.
- Use when the user asks for email alerts, spreadsheet logging, or conditional handling of form responses.
- Use when the user wants Apps Script snippets to paste into a form bound script project.
- Skip this skill if the user needs custom UI, paid APIs, or a full standalone Apps Script application.

## How It Works

### Step 1: Define the form in the Forms UI

Create the form in Google Forms with clear questions, answer types (short answer, multiple choice, checkbox), and required fields. Match question IDs to what the script will need later. Add a description to the form so respondents know what to expect.

### Step 2: Open the bound Apps Script editor

In the form, go to `Extensions > Apps Script`. This opens a project bound to the form. The script can read each submission through the `e.response` event object.

### Step 3: Write the response handler

Add a function that accepts the `onFormSubmit` event, reads `e.response` with `getItemResponses()`, and then performs the desired action: send an email, write to a spreadsheet, or branch on answers.

### Step 4: Install the trigger

In Apps Script, go to the clock/triggers menu, select the `onFormSubmit` function, choose the event source **From form** and event type **On form submit**, then save and authorize. The function runs automatically on each new submission.

### Step 5: Test with a real submission

Submit a test response from a private/incognito window and verify the email, sheet row, or log arrives once. Check the Apps Script executions page (`Executions` in the editor) for errors and read the stack trace if something fails.

## Examples

### Example 1: Email notification on every response

```javascript
function onFormSubmit(e) {
  const response = e.response;
  const email = getEmail(response);
  MailApp.sendEmail({
    to: email,
    subject: "Form submission received",
    body: "Thank you. We have recorded your response."
  });
}

function getEmail(response) {
  const items = response.getItemResponses();
  for (const item of items) {
    if (item.getItem().getTitle().toLowerCase().includes("email")) {
      return item.getResponse();
    }
  }
  // No email question found: falls back to the script owner's own address.
  // Add an email question to the form, or this thank-you goes to you, not the respondent.
  return Session.getActiveUser().getEmail();
}
```

### Example 2: Log each response to a Google Sheet

```javascript
const SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";  // the long ID in your sheet's web address

function onFormSubmit(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Responses");
  const itemResponses = e.response.getItemResponses();
  const row = [new Date()].concat(itemResponses.map(r => r.getResponse()));
  sheet.appendRow(row);
}
```

### Example 3: Branch on a multiple-choice answer

```javascript
const MANAGER_EMAIL = "PASTE_THE_EMAIL_TO_ALERT_HERE";

// Lists every question and answer as plain text for the email body
function itemResponsesText(e) {
  return e.response.getItemResponses()
    .map(r => r.getItem().getTitle() + ": " + r.getResponse())
    .join("\n");
}

function onFormSubmit(e) {
  const items = e.response.getItemResponses();
  for (const item of items) {
    if (item.getItem().getTitle().toLowerCase() === "priority") {
      const priority = item.getResponse();
      const subject = priority === "High" ? "[URGENT] " : "";
      MailApp.sendEmail({ to: MANAGER_EMAIL, subject: subject + "New submission", body: itemResponsesText(e) });
    }
  }
}
```

## Best Practices

- ✅ Test every trigger with a real submission before telling the user it works.
- ✅ Use clear, stable question titles so the script can match items by title instead of fragile indexes.
- ✅ Keep secrets and API keys in script properties, never hard-coded in the file.
- ✅ Add try/catch around handler logic and log errors with `Logger.log` so failures surface in the Executions page.
- ❌ Do not grant broad scopes; run with the minimum permission the form action needs.
- ❌ Do not send email to addresses that the form did not legitimately collect.

## Limitations

- Apps Script quotas apply (email rate limits, daily triggers, execution time); heavy volume needs review.
- Only form submissions trigger the event; edits to responses by users do not fire `onFormSubmit` by default.
- The skill produces scripts the user must paste, authorize, and deploy; it cannot create a Google Forms project by itself.
- Sheets integration requires the sheet's ID and permission, which must be confirmed with the user.

## Security & Safety Notes

- The script runs inside the user's Google account with the scopes it declares. Review the authorization prompt and grant only the minimum requested scope.
- Do not log, print, or embed passwords, OAuth tokens, or API keys in form scripts or shared files.
- Form responses can arrive from anyone the form is shared with; validate inputs before acting on them.
- Test in a controlled environment first; sending email or appending rows happens on every submission once the trigger is live.

## Common Pitfalls

- **Problem:** The handler runs for every submission and duplicates work.
  **Solution:** Prefer the single event object `e.response`; do not separately query the form's stored responses inside `onFormSubmit`.
- **Problem:** `item.getResponse()` returns `undefined` for optional questions.
  **Solution:** Guard with a check for a truthy response, or make the question required.
- **Problem:** The email goes to the wrong address.
  **Solution:** Match by the question title containing "email", and verify the collected value belongs to the respondent before sending.

## Related Skills

- `@google-sheets-automation` - Use when the response logging target is a Sheet that needs its own automation.
- `@google-docs-automation` - Use when form output should create or update a Google Doc.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Web form designer](https://useaiblocks.com/skills/web-form-designer).
- The [Multi-step form designer](https://useaiblocks.com/skills/multi-step-form-designer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
