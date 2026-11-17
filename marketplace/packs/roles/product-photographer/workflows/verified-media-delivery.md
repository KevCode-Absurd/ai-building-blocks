# Finish feasible product images and preserve product identity

Use for product-photo execution or an image sequence. Inspect available originals before planning: product/variant identity, exact source file, angle, native pixels, visible geometry, finish, lighting and rights reference. Specifications can establish dimensions; a photograph cannot by itself establish alloy, gemstone identity, certification or an unseen feature.

Choose the buyer question for every slot: recognition, detail, scale, use, included parts or material evidence. Plan distinct scenes rather than repeated specification cards. Preserve real product geometry, colour and visible features when preparing crops or compositions. Record cropping/upscaling and distinguish an actual photo, edited photo, generated concept and technical illustration. Use the host image tool for requested raster edits/generation when available; no generated product detail becomes evidence for the actual SKU.

Complete the feasible requested outputs with the supplied evidence. If a required angle, genuine product photo, ruler/scale reference or packaging photo is absent, list that exact dependency and deliver the shoot setup and feasible outputs without claiming the missing shot exists. Do not infer cross-SKU matching from similar-looking jewellery or filenames.

Open each final export beside the original. Check silhouette, perspective, edge detail, labels, stone count/setting, shadows, scale claims and phone-size legibility. Never stretch a schematic to pretend its geometry has been measured. State whether the output is ready for the requested use or only a concept awaiting identity/rights review.

Include editable composition/render files and permitted originals in the handoff, with all dependencies local. Give actual dimensions, source references, change log and shot gap list. Run the delivery check below for finished media, not for a planning-only request.

## Delivery integrity check

Create `manifest.json` beside the handoff's sources, editable project and exports; run `node tools/media-delivery.mjs path/to/manifest.json`. The optional local dependency `ffprobe` measures media metadata; missing support is reported, never counted as a pass. SHA-256 values must come from the actual files after the final edit.

The manifest uses `schema: "media-delivery/1"` and these arrays:

- `requiredSourceKinds`: the actual brief's requirements, such as `["photograph"]` or `["footage"]`. Do not remove a required kind to turn an incomplete deliverable into a pass.
- `sources`: `id, path, sha256, kind, provenance, rightsReference`. Kind is `photograph`, `footage`, `audio`, `illustration`, `generated` or `reference`. Record the evidence for each declaration; the checker cannot authenticate it.
- `editableFiles`: `path, sha256` for the project/render source and its local dependencies.
- `outputs`: `path, sha256, kind` (`image` or `video`), `placement, sourceIds, width, height, review`. Video also has `durationSeconds` and `audioExpected`.
- Each output's `review`: its current `sha256`, `reviewer`, concrete `notes`, and `"reviewed"` only for checks actually completed. Images require `phoneSize, productFidelity, textAndCrop`. Video requires `phoneSize, productFidelity, captions, fullPlayback, sound`. For a deliberately silent export, explain the checked absence of sound; do not claim listening to nonexistent dialogue.

All paths are relative to the manifest directory. An `INTEGRITY_PASS` checks containment, bytes, metadata and the presence of current review declarations. It does **not** certify actual visual quality, product identity, rights, marketplace compliance, full playback or permission to publish. Keep useful completed work moving while the specific missing dependency is held.

