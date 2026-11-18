# Check an email draft locally

This tool checks your editable draft against an explicit **local-preview-v1** field contract. It renders synthetic full and missing-value profiles into text and HTML. It does not connect to a sending platform or claim that its syntax works in Klaviyo, Mailchimp or any other provider.

Use it when an email draft needs field and fallback checks before handoff. Keep the brand's approved voice, product facts and offer evidence beside the draft; this tool does not establish that those claims are true.

## Run it

Copy `tools/email-draft-example.json` to `context/email-draft.json`. Replace the example messages, field contract and source locators with your authorized work. Keep the profiles synthetic. Then run from the pack folder:

```sh
node tools/email-draft-preflight.mjs --input context/email-draft.json --out output/email-preview
```

Both paths must stay inside the current working folder. Use a new output directory for each check; the tool never overwrites a prior report. It rejects traversal, absolute paths, symlinks/junctions and special device names. No packages, network or credentials are used.

The result contains `report.json` and editable `.html` and `.txt` previews. Every preview has a hash and its message/profile IDs. Open the HTML files and inspect the layout separately; a static local check is not a browser or inbox-client test. Keep the entire folder together when handing it over.

Exit code 0 means the **local draft checks** passed. Exit code 1 means at least one local preview failed. Exit code 2 means the input/paths were invalid. Neither a zero exit nor a local PASS means ready to send.

## The field contract

- A token has two opening braces, a lowercase field name with underscores, and two closing braces. The example JSON shows the exact syntax. Filters, expressions, dotted paths, includes and vendor tags are rejected. No code is evaluated.
- Each declared field has a type (`string`, `number` or `boolean`), a `required` flag and an optional same-type fallback. A referenced empty or absent value uses its explicit fallback. Without one, a missing referenced field fails; an optional field also needs a fallback when used in copy.
- Unknown fields, malformed tokens, wrong types and unsafe object keys fail. HTML escapes values; plain text remains readable. Subjects, preview text and CTA labels reject header/control breaks.
- CTA URLs must be explicit absolute HTTPS URLs without credentials, controls or merge fields. Nothing is fetched. The tool checks syntax, not whether a destination exists or is approved.
- Source locators are declarations to review, not proof that the tool read or verified a source. Put no real customer data in synthetic profiles.

Work is bounded before expansion: at most 2,048 tokens and 64 KiB of expanded text per field, 256 KiB conservatively reserved per text/HTML preview pair, and 6 MiB reserved across previews. The reservation includes worst-case HTML escaping before strings are built. The JSON report has a separate 2 MiB limit; the whole written bundle is limited to 8 MiB. A large batch may hit the conservative limit before its actual files reach 6 MiB. Split it into smaller reviewed batches. Profile and fallback strings are limited to 10,000 characters, CTA URLs to 2,048 characters, and input files to 2 MB.

## Read the three results

| Result | What it means |
| --- | --- |
| `local_draft_checks` | The supplied local contract rendered without the listed field or URL errors. |
| `provider_checks` | `BLOCKED` for a disconnected sender; otherwise `UNVERIFIED`. Even `reported_connected` is only a supplied claim. |
| `activation_readiness` | Always `BLOCKED`. This offline tool cannot establish sending permission, provider correctness or delivery readiness. |

Record missing footer, business identity, unsubscribe endpoint, redemption mechanism, cutoff timezone, current stock and other dependencies in `activation_dependencies`. An empty list does not remove the mandatory remaining checks in the report.

Check audience consent separately from sequence membership. A subscriber may have email permission yet lack a verified welcome event or win-back lapse. Exclude suppressed contacts and check support/recent-purchase rules against the actual requested flow. This renderer does not certify eligibility, offer accuracy or legal compliance.

Before activation, identify the actual authorized sender, map its fields, run its native previews and fallbacks, verify links/footer/offers and recheck the audience. Keep provider receipts separate from local results. No send, account write or delivery occurs here.

If a request requires provider verification and no provider is available, say that requirement is blocked. A useful local preview does not resolve that dependency. A failed readiness check can still be an important finding in a draft task.
