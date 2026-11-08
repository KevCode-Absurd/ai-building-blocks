# Reviewing current work without an unnecessary rewrite

`ai-blocks-work-context/1` accepts an optional `retention` record for an IMPROVE job whose inspected current native artifacts already meet the accepted request. Full review can retain those exact files. It does not require a new prototype, a hybrid, another model call or a rewrite to justify the review. Existing records that propose changes remain valid under the existing rules.

An empty `changes` array alone still fails an IMPROVE job. Retention cannot accompany proposed changes or be used with CREATE or ASSESS. A requested fix that the current artifact does not satisfy remains a failed criterion and blocks retention. This is a host-reported review outcome, not owner approval, a semantic guarantee or proof that the host extracted every required edit from free text.

The optional record has this shape (example only, not quality evidence):

```json
{
  "reason": "The current native file meets the accepted request; no supported change is justified.",
  "request_review": {
    "observation": "Reviewed the original request and each requested edit against current source and accepted criteria; no required edit remains unresolved.",
    "receipt": "receipts/request-review.json"
  },
  "artifacts": [
    {
      "path": "project/current.md",
      "sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "source_id": "current-work"
    }
  ],
  "criteria": [
    {
      "id": "next-action",
      "artifact_path": "project/current.md",
      "artifact_sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "status": "PASS",
      "observation": "The current instruction identifies the responsible role and next action required by the accepted criterion.",
      "receipt": "receipts/current-review.json"
    }
  ]
}
```

Each artifact maps to an inspected CURRENT BASELINE source in `work_context.sources`, with the same SHA-256 and the existing dated observation/inspection receipt. Keep all original baseline snapshots and scoped preservation rules. For a multi-file deliverable, map every actual delivered file, including copied assets. The retained and actual production path/hash sets must be exactly equal; changed, added, omitted, duplicate and case-colliding paths fail. A bundle hash does not stand in for separately declared child files.

Criterion observations identify actual accepted criterion IDs and exact artifact paths/hashes, with evidence and a receipt. Cover every accepted criterion and every retained artifact, with no duplicate criterion/artifact pair or unknown IDs. Record the criteria applicable to each artifact; do not omit a required criterion's relevant output because another output passed it. Scope may propose retention while checks remain NOT_RUN or FAIL; production requires the actual accepted criteria and every retention observation must be PASS. The existing baseline-to-result comparison still covers all current hashes and must pass. For outcomes, IDs match the existing brief `done` mapping: `done-0`, `done-1`, and so on.

Retention does not bypass required native checks, source-use evidence, independent review, critical acceptance checks, unresolved blockers, spending authority or publication approval. The validator checks the submitted records and hash relationships; it does not independently inspect bytes or judge whether an observation is true. Use actual file verification and native inspection when available, and keep unavailable checks explicit. Re-run affected checks if a later candidate changes the files before adopting it.
