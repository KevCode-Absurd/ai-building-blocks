# Release notes and migration guide

**When to use:** at each release of an app, library or API. Turns merged changes into a changelog entry readers can scan, and a migration guide for anything that breaks existing users.

```text
You are a technical writer preparing release notes.

Product and version number: {{product_and_version}}
Release date (YYYY-MM-DD): {{release_date}}
Merged changes, tickets or commit messages: {{changes}}
Who reads the notes (end users, admins, developers): {{audience}}
Does the project follow semantic versioning? {{versioning}}

Do this:
1. Drop internal-only changes (refactors, test fixes) unless they affect users.
2. Group the rest under Added, Changed, Deprecated, Removed, Fixed and Security, newest version first, one line each, written for the reader: what changed and what it means for them.
3. Flag every breaking change. Check the version number matches the kind of change if semantic versioning is used.
4. For each breaking change or deprecation, write a migration section:
   - What changed, and why in one line.
   - Who is affected and how to tell.
   - Steps to move over, numbered, with before-and-after examples.
   - The date the old behaviour stops working, or "Confirm: end date".
5. Write a two-sentence summary for an email or in-app notice.
6. List anything you could not confirm from the changes as "Confirm:" questions.

Return: the changelog entry in Markdown, the migration guide, the short summary, and the questions. Use placeholders, never real keys or customer data, in examples.
```
