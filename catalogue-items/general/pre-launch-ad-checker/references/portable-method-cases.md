# Fictional offline method cases

These examples do not prove external runtime or business performance.

## chat-only

Input: Only a script is pasted. It contains “[insert rating]” and a CTA URL not provided. No media or tracking probe is available.

Expected: Do not give launch-ready or100 based on absent checks; flag placeholder; report scope and next action.

Result: VERDICT: INCOMPLETE for the script version supplied. Observed stop-ship: unfilled rating placeholder; remove it or supply verified rating. Destination, placement preview, actual media and tracking are NOT CHECKED. The editing score may describe observed text defects, but cannot clear launch. Next action: owner supplies the destination and final media or removes the unsupported rating. No policy or event firing passed.

Checks:
- Placeholder identified
- Missing checks are not passes
- Verdict incomplete
- No tracking or policy claim

## file-capable

Input: ad.txt says price10; approved-offer.md says12. Image asset and placement spec are absent; supplied destination export also says12.

Expected: Locate offer mismatch; keep visual/spec/tracking unknown; write report bound to inspected version.

Result: Wrote preflight.md for ad.txt versionA. FIX: price10 conflicts with approved offer and destination12; replace only after draft owner confirmation. Visual product, crop, spelling inside image, current placement spec and live event firing remain NOT CHECKED. Verdict INCOMPLETE despite any provisional text-score improvement. No file upload, ad publication or tracking event sent.

Checks:
- Mismatch located across supplied artifacts
- Version bound
- Unknown media/spec checks remain open
- No external mutation
