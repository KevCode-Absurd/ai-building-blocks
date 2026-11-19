# Publish the fresh 80-agent output study

No draft is in `src/content/blog`. A normal build cannot publish this pending article. The renderer lives in `scripts/lib/ecommerce-benchmark-article.mjs`; the authored methodology lives in `scripts/data/ecommerce-benchmark-methodology.html`.

## Evidence preparation

The fresh benchmark controller must first validate run completion, frozen inputs, artifact hashes, judge models, raw score arithmetic and gates. This publication adapter does **not** replace that strict audit. Produce a separate allowlisted public JSON export from audited rows. Do not feed it a raw private manifest. Personally review every public job description, reason, excerpt and limit for private identifiers and facts; automatic scanning is defense in depth only.

Schema `ecommerce-fresh80-public-v1`:

```json
{
  "schema": "ecommerce-fresh80-public-v1",
  "status": "COMPLETE",
  "freshAll80": true,
  "originalPrCompleted": true,
  "sourceRevision": "FULL_40_CHARACTER_COMMIT",
  "runStartedAt": "ISO_TIMESTAMP",
  "runCompletedAt": "ISO_TIMESTAMP",
  "protocolSha256": "SHA256",
  "evidenceManifestSha256": "SHA256_OF_STRICTLY_AUDITED_PRIVATE_MANIFEST",
  "protocol": "Exact observed models, conditions, source access, arm isolation, label reversal, limits and any changed-input dependencies.",
  "rubric": "The frozen scoring rubric, weights, arithmetic and hard gates, in public-safe words.",
  "limitations": ["Describe private, synthetic, local-only, unmeasured and unreproducible parts precisely."],
  "privacyReview": {"approved": true, "reviewedAt": "ISO_TIMESTAMP", "method": "Actual performed privacy review and redaction method."},
  "roster": ["ALL_80_UNIQUE_IDS"],
  "cases": [{
    "id": "agent-id",
    "name": "Display name",
    "role": "Role name",
    "job": "Public-safe form of the actual brief; acknowledge redaction.",
    "taskKind": "analysis",
    "fixtureKind": "private-redacted",
    "evidence": "What was actually accessible and checked, without private facts.",
    "executionLimits": "What the output does not prove. Explain environment limits.",
    "inputSha256": "SHA256",
    "originalPrTask": false,
    "selectedAttempt": 1,
    "attempts": [{
      "sourceRevision": "FULL_COMMIT_FOR_THIS_TESTED_PACKAGE",
      "packageSha256": "SHA256",
      "changes": [],
      "specialist": {"runId": "UNIQUE_RUN_ID", "fresh": true, "completed": true, "model": "OBSERVED_MODEL", "startedAt": "ISO_TIMESTAMP", "completedAt": "ISO_TIMESTAMP", "artifactSha256": "SHA256_OF_ARTIFACT_OR_ARTIFACT_MANIFEST"},
      "plain": {"runId": "UNIQUE_RUN_ID", "fresh": true, "completed": true, "model": "OBSERVED_MODEL", "startedAt": "ISO_TIMESTAMP", "completedAt": "ISO_TIMESTAMP", "artifactSha256": "SHA256_OF_ARTIFACT_OR_ARTIFACT_MANIFEST"},
      "judges": {
        "sol": {"valid": true, "model": "OBSERVED_MODEL", "specialistScore": 0, "plainScore": 0, "specialistStatus": "PASS", "plainStatus": "FAIL", "preference": "plain", "reason": "Actual public-safe finding", "reportSha256": "SHA256"},
        "terra": {"valid": true, "model": "OBSERVED_MODEL", "specialistScore": 0, "plainScore": 0, "specialistStatus": "PASS", "plainStatus": "FAIL", "preference": "tie", "reason": "Actual public-safe finding", "reportSha256": "SHA256"}
      }
    }],
    "outputs": [{"title": "Actual output excerpt", "arm": "specialist", "kind": "redacted-excerpt", "excerpt": "A reviewed actual excerpt, not a rewritten example.", "sourceArtifactSha256": "SHA256", "reviewNote": "State exactly which identifying details were removed and whether figures are synthetic. No private real brand figures."}]
  }]
}
```

The placeholders above are a format description, **not** benchmark data. Scores must come from strict validated reports. Exactly 80 distinct IDs and cases are required. One case identifies the original PR task. Each case's selected attempt must be its last, and both judges must pass that specialist output. All completed earlier attempts remain in order. Record interrupted runs and environment failures in the protocol/limits; do not pass them off as judged outputs. Accepted task kinds: `analysis`, `creative`, `code`, `workflow`, `research`. Fixture kinds: `public`, `private-redacted`, `synthetic`, `mixed`. Output kinds: `verbatim-public`, `redacted-excerpt`. Statuses: `PASS`, `NEEDS_REPAIR`, `FAIL`. Preferences: `specialist`, `plain`, `tie`.

The status vocabulary also includes `LIMITED_CAPABILITY`; preserve it in earlier attempts or plain-model results. It never qualifies a selected specialist as passed. Preferences also accept `insufficient_evidence`, counted separately from ties. Publication dates use Asia/Kolkata, while execution receipts retain their actual ISO timestamps.

If a repair reuses the same immutable plain-model run, **do not fabricate a fresh second plain run**. The current schema expects both arms freshly generated for each compared attempt. Either rerun the comparison or extend the schema, tests and prose to explicitly represent shared baseline provenance. Historical results cannot serve as a fresh run.

## Preview and publication

Each output identifies its `arm` as `specialist` or `plain`; never label a comparator artifact as specialist work. An output may include `files` with reviewed native downloads or PNG previews. Each file has `filename`, `sha256`, integer `bytes`, `kind` (`download` or `image`), `label`, and `reviewNote`. Images also need actual integer pixel `width` and `height`, checked against the PNG header. Use flat lowercase filenames; allowed extensions are PNG, ZIP, CSV, JSON, TXT and PDF. `results.json` is reserved. Inline images must be PNG. Active HTML and SVG cannot be served directly through this adapter; a reviewed editable native bundle can be offered as a ZIP download. Review every ZIP member, document metadata, screenshot and source link for private data before staging it.

Put only those reviewed files in a separate flat staging directory and pass `--artifact-dir ABSOLUTE_REVIEWED_DIRECTORY`. The publisher verifies all file sizes, hashes and resolved locations before writing any public content. Each file is limited to 15 MB and the total to 60 MB. These checks bind publication to reviewed bytes; they do not replace a privacy or content review. Preserve native output bytes where possible. Document screenshots, packaging, redactions and any other transformation in `reviewNote`.

From `site/`, calculate the exact SHA-256 of the reviewed export, then:

```powershell
node scripts/publish-ecommerce-benchmarks.mjs --input ABSOLUTE_PUBLIC_EXPORT_PATH --sha256 EXACT_SHA256 --out ABSOLUTE_PRIVATE_PREVIEW_DIR
node --test test/ecommerce-benchmark-article.test.mjs test/blog.test.mjs
```

Review the rendered private preview and the public JSON. Once complete and approved within the user's publication authorization:

```powershell
node scripts/publish-ecommerce-benchmarks.mjs --input ABSOLUTE_PUBLIC_EXPORT_PATH --sha256 EXACT_SHA256 --publish
node --test test/ecommerce-benchmark-article.test.mjs test/blog.test.mjs
npm run build
```

Publication writes the normal JSON/HTML blog pair, puts public results at `/blog-assets/ecommerce-ai-agents-output-benchmarks/results.json`, and registers the slug in `ORDER`. The sitemap, prerenderer and client already consume those files. Keep the body at the house reading level; the existing blog unit test evaluates final text and metadata. Review at mobile/desktop, verify all 80 rows/cases, expand output samples, test both prompt copy buttons, verify downloadable evidence, and check console/network errors, SEO, accessibility and speed. Creative visual assets may be added only after a separate asset privacy review; never copy a private brand screenshot into public assets merely because it appeared in a benchmark.

## Deployment distinction

The blog is on `https://useaiblocks.com/blog/ecommerce-ai-agents-output-benchmarks`, in the **site** Cloudflare Worker named `ai-building-blocks`. It is separate from the **marketplace** Worker serving `agents.useaiblocks.com`. `site/package.json` has `worker:deploy` (`wrangler deploy --env=`), but this checkout initially contains only `wrangler.example.jsonc`. Resolve the established production config from the owner's existing deployment setup; do not deploy the example's placeholder D1 IDs or change production variables. Use the existing repo/Cloudflare workflow, not a new Sites project. Read back both deployments and the main ref after the authorized release.

## Arithmetic-only judge corrections

A strict audit may reject an otherwise complete judge report because its derived weighted total disagrees with its dimension scores. Preserve that original invalid report. If the same judge independently corrects only those totals, the separate audit must verify exact equality of all other JSON fields and reapply the original scoring and hard-gate checks. This is a correction to a judgment, not another agent execution or a changed verdict.

A valid corrected judge entry can include `correction` with `kind: derived-total-only`, `originalValidity: INVALID_REPORT`, `sameAuthor: true`, `substantiveFieldsUnchanged: true`, the original report and correction audit SHA-256 values (`originalReportSha256`, `auditSha256`), the original derived totals (`originalSpecialistTotal`, `originalPlainTotal`), and a public-safe `reason`. Its main `reportSha256` binds the corrected report. Only populate these fields from an actual validated correction audit. The adapter checks their shape; it cannot independently prove the private audit.

The article keeps both report hashes and the original invalid state, displays original and corrected totals, and counts corrected judge reports separately from output repair attempts. First-attempt output pass counts can use these validated corrections but must not be described as error-free original judgments. Changes to dimension scores, gates, verdicts, evidence or preference need a different explicit process and are not accepted by this correction type.

Each output must include its one-based `attemptNumber`. Bind its source artifact hash to that attempt and arm in the private completion manifest. Each case needs an output from the selected specialist attempt. Earlier failed output excerpts retain their original attempt number.

## Owner-disclosed limitations

When the owner approves releasing with named cases that did not pass both judges, add top-level `disclosedLimitations: [{id, summary}]`. Each ID must be a roster case whose selected specialist output did not pass both judges; a passing case, an unknown ID or a duplicate is refused. Those cases publish as limitations, never as passes: the opening summary, a dedicated `#not-passed` section, their table rows, their case headings and the limits list all name them. The private assembler takes the matching `owner_disclosed_limitations` list in the release spec, and the ledger state then reads `ALL80_EXECUTED_<passed>_PASSED_<n>_DISCLOSED_LIMITATIONS`. Released 19 Nov 2026 with two: the Shopify developer (no store-backed Shopify runtime) and Shopify page speed (no matching slow-page evidence).
