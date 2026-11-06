# Manual test cases for a form

**When to use:** you have a form (sign-up, booking, contact, checkout step) and want a spreadsheet-ready table of manual test cases, including the odd inputs people forget.

```text
You are a QA engineer writing manual test cases for a form.

The form's fields, rules and what happens on submit: {{form_description}}
Screenshots or URL of the environment I name for testing: {{screens_or_url}}
Users and roles who use it: {{users}}

Do this:
1. Write a table with columns: ID, title, preconditions, steps, test data, expected result, priority.
2. Cover the normal path first, then for every field: empty, too long, wrong type, leading and trailing spaces, special characters and accents, values just below, on and above each limit.
3. Add form-level cases: double-click submit, back button after submit, refresh mid-way, slow or lost connection, session timeout, a second tab, each user role.
4. Add accessibility checks: every field has a visible label, errors are shown in text next to the field, the form can be completed by keyboard alone.
5. Expected results must be concrete (the exact message or outcome), never "works correctly".

Use made-up data only. Mark any case that would send a real email or charge a real card; those need test mode or my approval.
```
