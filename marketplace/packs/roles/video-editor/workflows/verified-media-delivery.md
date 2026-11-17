# Deliver a reproducible video edit

Use for actual finished-video requests. Inspect and log the supplied clips before cutting: clip IDs, source file, available time ranges, resolution, orientation, frame rate, audio tracks, transcript confidence, subject/product identity and rights reference. Existing edited ads can contain stale claims and embedded music; being in the asset folder does not establish a fresh music or creator licence.

Build the cut from the approved script and actual usable footage. Keep dialogue meaning and product demonstrations intact. For each version record the one changed hook/body/ending and its source in/out timecodes. If no footage was supplied, finish the edit decision list and optional clearly labelled animatic, not a supposed filmed demonstration. Silence is an explicit creative choice, not a fabricated sound check.

Ship the actual rendered MP4s plus the editable timeline or runnable render source, captions, fonts/licence references and media dependencies inside one handoff directory. Use relative paths and test the render command from that directory. Avoid a source file left in a separate scratch folder. Keep originals intact.

Probe each final file for actual codec, duration, pixel dimensions and audio presence. Play every complete cut once muted and once with sound at the intended display size; compare captions against audible speech and verify pacing, cut boundaries, overlays, safe areas and end card. Sampling frames or reading ffprobe output is not full playback or an audio review. If playback/listening is unavailable, name the unrun check and hold ready-to-publish status; do not mark it reviewed. Recheck every changed export.

Use current placement requirements and inspect each aspect ratio separately rather than assuming centre cropping works. Run the delivery check below and attach its receipt with the actual playback observations and remaining external dependencies. Never infer performance lift from an attractive edit or from a single historical ad metric.

## Delivery integrity check

Create `manifest.json` beside the handoff's sources, editable project and exports; run `node tools/media-delivery.mjs path/to/manifest.json`. The optional local dependency `ffprobe` measures media metadata; missing support is reported, never counted as a pass. SHA-256 values must come from the actual files after the final edit.

The manifest uses `schema: "media-delivery/1"` and these arrays:

- `requiredSourceKinds`: the actual brief's requirements, such as `["photograph"]` or `["footage"]`. Do not remove a required kind to turn an incomplete deliverable into a pass.
- `sources`: `id, path, sha256, kind, provenance, rightsReference`. Kind is `photograph`, `footage`, `audio`, `illustration`, `generated` or `reference`. Record the evidence for each declaration; the checker cannot authenticate it.
- `editableFiles`: `path, sha256` for the project/render source and its local dependencies.
- `outputs`: `path, sha256, kind` (`image` or `video`), `placement, sourceIds, width, height, review`. Video also has `durationSeconds` and `audioExpected`.
- Each output's `review`: its current `sha256`, `reviewer`, concrete `notes`, and `"reviewed"` only for checks actually completed. Images require `phoneSize, productFidelity, textAndCrop`. Video requires `phoneSize, productFidelity, captions, fullPlayback, sound`. For a deliberately silent export, explain the checked absence of sound; do not claim listening to nonexistent dialogue.

All paths are relative to the manifest directory. An `INTEGRITY_PASS` checks containment, bytes, metadata and the presence of current review declarations. It does **not** certify actual visual quality, product identity, rights, marketplace compliance, full playback or permission to publish. Keep useful completed work moving while the specific missing dependency is held.

