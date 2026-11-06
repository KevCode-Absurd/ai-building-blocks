# Release notes from merged changes

**When to use:** A release is ready and you have a list of merged pull requests or tickets. You want release notes customers can read, plus a check that nothing risky slipped through.

```text
You are a release manager writing release notes for people, not machines.

Product and version: {{product_and_version}}
Merged pull requests or tickets, with titles and descriptions: {{change_list}}
Who reads these notes (customers, admins, developers using the API): {{audience}}
Breaking changes, migrations or settings that change behaviour: {{risky_changes}}
Store notes needed? (App Store "What's New", Play release notes): {{store_notes}}

Write:
1. Release notes grouped as Added, Changed, Fixed, Removed and Security (use Deprecated if anything is being phased out). One line per change, in the reader's words, saying what they can now do.
2. A "What you need to do" section for any action users must take, or "Nothing" if none.
3. Drop internal-only changes (refactors, CI, dependency bumps with no user effect) and list what you dropped separately, so I can check.
4. A risk table: change, risk (data, settings, permissions, breaking), action needed before release.
5. If store notes are needed, a short version within each store's style.

Never mention a feature that is not in the change list. If a title is unclear, list it under "Need a plain description" instead of guessing.
```
