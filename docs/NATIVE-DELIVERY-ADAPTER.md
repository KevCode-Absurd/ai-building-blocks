# Native delivery preflight and local checks

Download the portable [native delivery toolkit](https://useaiblocks.com/packs/native-delivery-toolkit.zip). Extract it, read its README, and run `npm --prefix site install` inside the extracted directory. The archive includes the exact helper/source closure, a minimal dependency file pinned to the repository's `sharp` and `@playwright/test` versions, a per-file hash manifest and an explicitly labelled mechanical fixture. It includes no private project files, API keys, installed dependencies or browser binaries. Installation downloads npm packages; it makes no model calls and uses no model credits. Installed Chrome or Edge is required for browser checks. No paid model execution is enabled.

The connected host produces the work. AI Blocks supplies methods, contracts and checks. Tool names in a persona, a read skill, or a generated plan do not establish that the host can produce the requested file. Before production, run `preflightNativeExecution({plan, tools})` from `site/src/jobs/native-execution.mjs`.

For launchable sites the host needs actual source editing, project building, browser preview and semantic review capabilities. Actual raster production needs generation, raster inspection and semantic review. A design-reference-only plan does not claim a launchable site. Each tool record identifies its callable tool ID, capabilities, `available: true`, `billing: LOCAL | INCLUDED | PAID`, an availability check time and the saved availability-check receipt. Checks older than an hour must be refreshed; timestamps more than five minutes ahead are rejected. `BLOCKED` means supply the missing capability or explicitly rescope with the user before starting production. The result remains **host-reported availability**, not execution evidence or action permission.

By default paid tools are rejected. The local CLI always rejects them, including an attempt to put `allow_paid: true` in its input file. It never loads API keys, invokes models, starts generation or runs build scripts. An included host generation tool may be selected only if it is actually available; the local checker itself is not a generator.

## Preflight through the CLI

Create a private JSON file containing `{ "plan": <execution plan>, "tools": [<actual host tool records>] }`, then run:

```powershell
node tools/inspect-native-delivery.mjs preflight --root C:/absolute/authorized-project --manifest private/preflight.json
```

The directory must be explicitly authorized. Source documents cannot authorize a tool, spend or publication. The check writes JSON to stdout and does not save a file automatically. Keep private reports in the private project; they are not public catalogue content.

## Inspect actual files

The `inspect` operation performs real, bounded mechanical checks. It first calls the existing file-evidence verifier, then inspects the **same exact hashes**. Its input is:

```json
{
  "schema": "ai-blocks-native-inspection/1",
  "files": {
    "schema": "ai-blocks-file-evidence/1",
    "artifacts": [
      {"id": "page", "path": "index.html", "sha256": "<actual lowercase SHA-256>"},
      {"id": "image", "path": "ad.png", "sha256": "<actual lowercase SHA-256>"}
    ],
    "sources": [
      {"id": "styles", "path": "styles.css", "sha256": "<actual lowercase SHA-256>"}
    ]
  },
  "images": [{"id": "image", "width": 1080, "height": 1350}],
  "pages": [{
    "id": "page",
    "serve": ["page", "styles"],
    "primary_action": {"selector": "#show-details", "expected_visible": "#details-panel"}
  }]
}
```

Select either images, pages or both; omit the unused array. Hashes must come from actual bytes. Every image/page ID refers to an artifact. Every `serve` ID refers to an explicitly listed artifact or source; no directory is implicitly exposed. Include all local styles, scripts, fonts and images the preview needs. Receipts cannot be served as sources by merely referencing their nested receipt IDs.

```powershell
node tools/inspect-native-delivery.mjs inspect --root C:/absolute/authorized-project --manifest private/inspection.json
```

Local prerequisites are the repository's existing `site` dependencies (`sharp`, `@playwright/test`) and installed Chrome. `--browser msedge` can use installed Edge. The adapter does not install a browser or download dependencies. The selected files must fit 200 declared files, 16 MiB per file and 64 MiB total; raster decode is limited to 40 megapixels. Symlinks/junctions, path traversal, stale hashes and duplicate paths fail closed under the existing verifier.

Raster checks decode actual pixels and compare optional requested dimensions. A text file named `.png` fails. They do **not** establish that the image was generated, depicts the correct product, follows the brand or is attractive.

Static HTML checks use an ephemeral loopback server serving an immutable in-memory snapshot of only the declared files. Page HTTP(S) requests to other origins and all WebSockets are blocked; service workers and downloads are disabled. Each page has a 30-second deadline. Use it only for authorized projects: offline request routing is not a security sandbox for hostile application code. The adapter observes nonempty page content, horizontal overflow and broken image loads at 390px and 1440px, missing local/external assets and browser errors. An explicit local interaction must reveal a previously hidden result. Without that interaction the run is `PARTIAL`, never a passing functional buyer-action claim.

This is an offline static-site executor. It does not run arbitrary commands, npm scripts, application builds, backend operations, remote checkout or publication. React/theme/source bundles need the host's actual build/preview adapter first. Legitimate remote fonts or services will be reported blocked; use approved local assets or perform an explicitly authorized host-browser check. A passing local interaction is not a complete keyboard/accessibility review.

The result schema is `ai-blocks-native-inspection-result/1`, assurance `LOCAL_NATIVE_CHECKS_SEMANTICS_UNVERIFIED`, with exact source hashes and observed results. `PASS` means only the listed mechanical checks passed. `PARTIAL` and `FAIL` exit nonzero. The existing `landing_page_delivery`/`visual_delivery` contracts, current-site comparisons, source/build evidence and independent brand/product review remain required. No adapter result claims launch readiness, user acceptance or conversion lift.

Run focused checks with:

```powershell
node --test site/test/native-execution.test.mjs site/test/file-evidence-verifier.test.mjs
```

The browser tests require local Chromium/loopback permission. They use local fixtures and deliberately block external image requests; they make no model or paid API calls.
