# Source checks

These checks read local files and Git objects. They make no model calls and do not edit catalogue items, licences or evidence.

Run from the repository root:

```sh
node tools/qa/check.mjs --worktree
node tools/qa/check.mjs
node tools/qa/check.mjs --base <previous-commit>
git -c core.longpaths=true config --local core.hooksPath .githooks
```

The first command previews working changes. The second checks the exact staged bytes, including partial commits. The third checks committed changes for CI. The last command enables this repository's pre-commit hook. It does not change global Git settings.

The guard checks YAML and Markdown front matter, values that should be text, and line endings against the previous version. It preserves unchanged lines in mixed-ending files. It blocks changes to `tested` data, existing licence files and test/run evidence.

## Review input and handoff changes

Read the whole method before recording a review in `catalogue-review.json`. Each input needs an exact quote and a short explanation of how the supplied material maps to that type. Keep requiredness accurate. A matching word alone is insufficient. Quote the actual method; front matter and generated `needs`/`next` sections do not count.

Each reviewed handoff names its real producer and consumer ports, quotes both methods and explains what passes between them. An optional output needs a condition. Different types need a concrete adaptation and the real source and target types. A handoff can supply one part of the next skill's inputs; it does not mark every input accepted or create missing facts, credentials, permissions or execution evidence.

The method and port hashes bind each record to the content reviewed. A later change requires another review. A generated-section rebuild alone does not invalidate a method review.

Original instruction filename casing is preserved. Both the build and the guard can read an imported `skill.md`; public downloads use `SKILL.md`. The source guard rejects new case-colliding primary files. A build can read legacy variants only when their bytes match apart from CRLF/LF; it chooses canonical SKILL.md when present and changes neither original. Different instruction contents are rejected.

Maintained ZIP generators use a fixed calendar stamp of 05:30, matching the existing published archives. ZIP headers store calendar fields without a timezone. This keeps archive bytes consistent between machines; real publication dates still come from source history.

The check covers lists in `item.yaml`, `page.yaml` and the active fallback under `tools/orchestrator-pages`. New or changed input contracts and handoffs require evidence. Older unreviewed contracts remain visible in the coverage counts. Passing this guard does not mean every legacy item or recommendation has been reviewed or executed.

The initial records contain 12 input-contract reviews and three handoff reviews. They are AI Blocks source reviews, not a claim that Kevin approved them or that a workflow ran successfully. Do not generate approval records from type matches alone.

## Verify local delivery evidence

The generic host adapter checks actual files before the host submits artifact/source/receipt references to MCP or the HTTP API. It makes no network, model or tool-execution calls and does not run commands found in a manifest. Choose an authorised absolute project directory as a host argument; a manifest cannot choose its root.

```sh
node tools/verify-delivery-evidence.mjs --root <absolute-project-directory> --manifest evidence.json
node tools/verify-delivery-evidence.mjs --root <absolute-project-directory> --manifest evidence.json --output evidence-report.json
```

The manifest and optional new report path are relative to that directory. Without `--output`, no file is written. An output parent must already exist; the adapter never overwrites an existing report, the manifest or an evidence file. Exit codes are 0 for matching bytes, 1 for failed evidence, and 2 for invalid CLI/manifest-file access or report-write errors.

Use this manifest shape, replacing every hash with the SHA-256 of the actual saved bytes:

```json
{
  "schema": "ai-blocks-file-evidence/1",
  "artifacts": [
    {
      "id": "result",
      "path": "work/result.zip",
      "sha256": "<actual lowercase SHA-256>",
      "receipts": [{"path": "work/checks.json", "sha256": "<actual lowercase SHA-256>"}]
    }
  ],
  "sources": [{"id": "baseline", "path": "inputs/current-source.json", "sha256": "<actual lowercase SHA-256>"}]
}
```

All paths use relative `/` separators. Absolute/traversal/device paths, duplicate IDs or case-insensitive duplicate paths, and symlink/junction components are rejected. Every declared input must be a regular readable file under the resolved project root. Defaults cap the manifest at 2 MiB, the declared files (including receipts) at 1,000, each file at 256 MiB and total accepted file bytes at 1 GiB. The exported `verifyDeliveryEvidence({root,manifest,limits})` module permits tighter limits only. File identity/size/timestamp checks detect changes during hashing; the host should still use a controlled snapshot rather than a concurrently writable or hostile directory.

The result reports observed hashes/byte counts and errors with assurance `LOCAL_BYTES_VERIFIED_SEMANTICS_UNVERIFIED`. Retain the report with the run and submit the matching artifact/receipt references. Re-run after a source or deliverable changes; a previously saved PASS is not current evidence. This local report is itself host-supplied to a remote service, not a signed remote attestation.

**What it does not establish:** that every required deliverable was listed, that a source is current/true/owned, that a receipt describes an actual test, that the output is correct or visually good, or that the user approved publication. Compare the manifest with the agreed job/required output set, run real task checks, and preserve independent review and permissions separately. A receipt containing an invented PASS can have a matching hash; byte verification does not validate that claim. Factual currentness and task acceptance remain explicit host evidence, never inferred from the file timestamp.

Run `node --test site/test/file-evidence-verifier.test.mjs` for focused regression coverage. Windows junction creation may require a host that allows the temporary test fixture; a skipped boundary test is reported explicitly and does not count as a passed security check.

## GitHub checks

The workflow runs on pushes and pull requests, with Linux and Windows jobs. Windows also exercises the local DPAPI coverage. It installs locked dependencies, checks source contracts and generated sections, runs the complete unit suite, then builds and checks SEO. No model keys or deployment credentials are provided.

The action pins were checked against the official [checkout v7.0.1 release](https://github.com/actions/checkout/releases/tag/v7.0.1) and [setup-node v7.1.0 release](https://github.com/actions/setup-node/releases/tag/v7.1.0). Both use exact commit hashes. The CI base comes from the event and must exist in the full checkout; a missing force-push base fails rather than silently skipping changes.

## Local quality work

The handoff's one-off helpers are replaced by read-only commands. Run these from the repository root:

| Earlier helper | Maintained command | Behavior |
| --- | --- | --- |
| `eol-match.mjs`, `yaml-check.mjs` | `node tools/qa/check.mjs --worktree` | Checks changed YAML, front matter and exact HEAD line endings. Reports errors; never normalizes files. |
| `front-check.mjs` | `node tools/qa/catalogue-audit.mjs front` | Checks tracked catalogue front matter. Names the deliberate bad-colon teaching fixture separately. |
| Full YAML audit | `node tools/qa/catalogue-audit.mjs yaml` | Parses tracked catalogue and workflow YAML without editing it. |
| `cleanup.mjs` | `node tools/qa/catalogue-audit.mjs cleanup` | Finds affiliate tags for source review. Never changes protected examples, imported text or credits automatically. |
| `header-licence*.mjs` | `node tools/qa/catalogue-audit.mjs licences` | Checks sickn33's own header, original licence-file presence, change credits and final Apache notices. Never writes licences or relabels content. |
| `book-order*.mjs` | `node tools/qa/catalogue-audit.mjs book-order` | Finds the old claims about an author's step order. Review each result against the source. |
| Old `release.mjs` | `node tools/qa/catalogue-audit.mjs held` | Lists the existing held entries. It cannot release, hide or delete an item. |
| `own-list.mjs`, `remain.mjs` | `node tools/qa/weekly-report.mjs` | Saves the 50 lowest latest saved scores, with source-change flags, under `reports/weekly-quality/latest.json`. |

Use `node tools/qa/catalogue-audit.mjs all` for every catalogue audit above. Findings return a nonzero status and are review leads, not automatic permission to edit imports. Commands reject `--fix`. The audit excludes protected test/run evidence and original licence contents.

The weekly report makes no model calls. Its scores are historical screening results out of 100, not fresh reviews or successful execution tests. A later source commit or dirty file is flagged. Unknown dates remain unknown. The saved screening fingerprint includes the model, rubric and prompt, so the report does not mistake it for a method hash. Missing-source and malformed saved result rows are counted. Source-change flags cover each item folder and its workflow-page fallback; they do not certify every shared generator or global copy change. Imports remain in the report. An unchanged report is not rewritten.

## Release

`node tools/release.mjs` runs the required minds, two indices, generated sections, complete units, production build, SEO and production-build browser checks in order. It stops at the first failure. Browser AI and account writes are mocked; no live model-spending flag is enabled. It checks the final deployment inventory, including directories, against the existing asset safety limit.

After reviewing and committing generated changes, push the source to origin. Run `node tools/release.mjs --deploy` to repeat the gates and publish that exact clean source. It requires existing authentication, enabled public API/OAuth/AI settings, no latched spending hold and an active live composer. It cannot resume a spending pause. No source files are automatically staged.

After deployment, it compares published pages and data with the build, checks every sitemap entry, the API status and MCP tool list, then sends only changed URLs to IndexNow. It commits and pushes only the verified IndexNow state with the repository's co-author line. Failed deployment or live checks leave publication state untouched. It never resubmits a sitemap. A failure after the live deployment must be investigated before retrying; the command does not silently roll back or claim the release completed.

The weekly report also checks the selected items as they exist now. Each row lists the primary metadata, instructions and active page inspected, a separate current-source SHA-256, and local YAML/front matter, licence-notice and prose findings. These checks do not change the historical score or grade supporting files. A later edit changes the source digest even while a file is already dirty. Findings require source review; no fixes are applied automatically.
