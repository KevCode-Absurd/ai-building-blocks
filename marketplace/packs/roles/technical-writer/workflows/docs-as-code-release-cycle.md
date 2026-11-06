# Docs-as-code release cycle

**Cadence:** every release of a software product or API, plus a quarterly docs audit.

**Trigger:** a feature, fix or API change is ready to merge, or a release date is set.

## Steps

1. **Access and scope.** Confirm the repositories, docs site and help centre involved and the access level granted for each, written under "Access I have". Level 1 until the client answers.
2. **Read the change.** From the pull requests, tickets and spec diff, list what users will notice: new features, changed behaviour, new or changed endpoints, errors, settings, removed features.
3. **Map the change to pages (prompt: docs-gap-audit, scoped to this release).** Which pages need edits, which are new, which go stale. Classify new pages by type: tutorial, how-to, reference or explanation.
4. **Write and update.**
   - Setup and READMEs (skill: readme-and-setup-guide).
   - API reference and quickstart from the OpenAPI document (skill: api-reference-and-quickstart).
   - Help articles for user-facing changes (skill: help-centre-articles-from-tickets).
   - Docstrings for new public code (prompt: docstrings-for-one-file).
   - Decision records for significant design choices (prompt: decision-record-from-notes).
5. **Docs in the same pull request.** At level 2, add the docs to the feature's pull request or a linked one, so the change and its docs are reviewed together. Run the prose linter and link checker in the build.
6. **Review.** An engineer checks accuracy; the writer checks clarity, structure and style; a support lead checks help articles.
   **Approval point 1:** reviewers approve the docs pull request.
7. **Test the steps.** Follow new or changed procedures on a clean setup or test account. Run every API example that can run. Record results.
8. **Release notes (prompt: release-notes-and-migration-guide).** Changelog entry, migration guide for breaking changes, short summary for customers.
   **Approval point 2:** the product owner approves the release notes and any customer notice.
9. **Publish.**
   - Level 2: everything ready in pull requests and drafts; the client merges and publishes.
   - Level 3: merge the approved docs pull requests and publish help articles in the named repositories and sections, within the client's limits. Log each action.
10. **After release.** Check the live site: links, search, rendered code blocks, versions. Watch the first week's tickets for confusion about the change and fix pages fast.
11. **Quarterly audit.** Run the full docs-gap-audit, retire stale pages (with the owner's yes), and update owners and review dates.

## Outputs

- Change-to-page map.
- Updated docs, API reference, help articles and docstrings in reviewed pull requests or drafts.
- Test record of steps and examples.
- Changelog entry, migration guide and customer summary.
- Action log and post-release check note.

## Needs the client's approval

- Docs pull requests, by an engineer and the writer (point 1).
- Release notes and any customer-facing notice (point 2).
- At level 3, the action list and limits before the first live action, and a new yes before anything outside them: deleting or archiving pages, changing navigation, redirects or permissions, or merging to a protected branch.
