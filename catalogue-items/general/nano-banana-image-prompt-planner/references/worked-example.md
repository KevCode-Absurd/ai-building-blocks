# Fictional offline practice case

## Input

Edit visible plain red mug to teal; keep camera, label-free shape, background and light; no rendered output requested.

## Example result

PLAIN LANGUAGE
Change only the mug glaze from red to teal. Preserve the mug shape, absence of text, camera, background and lighting; teal reflections must follow the existing light.
JSON
{"mode":"edit","subject":{"object":"mug"},"context":{},"style":{},"references":[],"edits":[{"element":"mug glaze","current_state":"red","target_state":"teal","integration":"preserve existing light and reflections"}],"preserve":["shape","no text","camera","background","lighting"]}
NOT RUN
Image rendering and output inspection.

## Checks

- Valid JSON
- Explicit current and target state
- Both representations preserve same non-color properties
- No false image-generation claim

No external service was called in this practice case.
