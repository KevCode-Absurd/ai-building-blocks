# Deliver finished images from approved assets

Use for a finished ad or listing-image request. Start with the actual files: identify each product/variant, source URL or file ID, rights reference, available angles, native dimensions and whether it is photography, an illustration or generated artwork. An existing ad is a visual reference, not independent evidence for its claims or permission to reuse its models/music. Read the original at full size.

Make a buyer-question map before rendering: each requested concept must change the argument, composition or visual format, not just a colour or headline. Use only substantiated attributes. For listing sets, distinguish the main-image rules from secondary images and A+; verify the current rules for the exact marketplace/category rather than applying one universal size or overlay rule.

For approved real products, preserve the supplied product pixels/geometry when composing. Use the host's image tool for requested raster generation or edits when available; an illustration or generated reconstruction is not proof of the real SKU. State unavailable native photo/footage dependencies precisely, finish the feasible local work, and do not present a technical schematic as finished photography.

Export the requested files, then open every export at full size and at the intended phone display size. Check headline wrapping, line spacing, cropped glyphs, safe-zone overlays, logos, product edges, and labels against the original. If text is cramped, shorten/reflow it or change the layout; do not merely shrink all type. Re-export and inspect after the final edit. A contact sheet helps compare concepts but does not replace individual export inspection.

Package the editable design/render source, licensed dependencies, final exports, source/claim references and a short placement guide in one handoff directory. Keep image dimensions and source dependencies explicit. Run the delivery check described below only when delivering final media; it does not replace visual review.

## Delivery integrity check

Create `manifest.json` beside the handoff's sources, editable project and exports; run `node tools/media-delivery.mjs path/to/manifest.json`. The optional local dependency `ffprobe` measures media metadata; missing support is reported, never counted as a pass. SHA-256 values must come from the actual files after the final edit.

The manifest uses `schema: "media-delivery/1"` and these arrays:

- `requiredSourceKinds`: the actual brief's requirements, such as `["photograph"]` or `["footage"]`. Do not remove a required kind to turn an incomplete deliverable into a pass.
- `sources`: `id, path, sha256, kind, provenance, rightsReference`. Kind is `photograph`, `footage`, `audio`, `illustration`, `generated` or `reference`. Record the evidence for each declaration; the checker cannot authenticate it.
- `editableFiles`: `path, sha256` for the project/render source and its local dependencies.
- `outputs`: `path, sha256, kind` (`image` or `video`), `placement, sourceIds, width, height, review`. Video also has `durationSeconds` and `audioExpected`.
- Each output's `review`: its current `sha256`, `reviewer`, concrete `notes`, and `"reviewed"` only for checks actually completed. Images require `phoneSize, productFidelity, textAndCrop`. Video requires `phoneSize, productFidelity, captions, fullPlayback, sound`. For a deliberately silent export, explain the checked absence of sound; do not claim listening to nonexistent dialogue.

All paths are relative to the manifest directory. An `INTEGRITY_PASS` checks containment, bytes, metadata and the presence of current review declarations. It does **not** certify actual visual quality, product identity, rights, marketplace compliance, full playback or permission to publish. Keep useful completed work moving while the specific missing dependency is held.

