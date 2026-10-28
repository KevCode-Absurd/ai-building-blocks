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

Original instruction filename casing is preserved. Both the build and the guard can read an imported `skill.md`; public downloads use `SKILL.md`. Case-colliding primary files are rejected.

Maintained ZIP generators use a fixed calendar stamp of 05:30, matching the existing published archives. ZIP headers store calendar fields without a timezone. This keeps archive bytes consistent between machines; real publication dates still come from source history.

The check covers lists in `item.yaml`, `page.yaml` and the active fallback under `tools/orchestrator-pages`. New or changed input contracts and handoffs require evidence. Older unreviewed contracts remain visible in the coverage counts. Passing this guard does not mean every legacy item or recommendation has been reviewed or executed.

The initial records contain 12 input-contract reviews and three handoff reviews. They are AI Blocks source reviews, not a claim that Kevin approved them or that a workflow ran successfully. Do not generate approval records from type matches alone.

## GitHub checks

The workflow runs on pushes and pull requests, with Linux and Windows jobs. Windows also exercises the local DPAPI coverage. It installs locked dependencies, checks source contracts and generated sections, runs the complete unit suite, then builds and checks SEO. No model keys or deployment credentials are provided.

The action pins were checked against the official [checkout v7.0.1 release](https://github.com/actions/checkout/releases/tag/v7.0.1) and [setup-node v7.1.0 release](https://github.com/actions/setup-node/releases/tag/v7.1.0). Both use exact commit hashes. The CI base comes from the event and must exist in the full checkout; a missing force-push base fails rather than silently skipping changes.
