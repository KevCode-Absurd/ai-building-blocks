# Check the actual SVG layout before delivering ads

Use `svg-layout-check.mjs` for SVG-based ad designs rendered in an already authorized local browser. It reads the DOM; it does not launch a browser, install dependencies, send data, or modify a design. Never open untrusted active SVG/HTML with account cookies. Use a fresh local browser context with network access restricted to the required local assets.

The probe measures actual browser text bounds and transformed image/rectangle bounds. It flags text crossing image areas, viewport clipping, later paint over text, unsupported effects, and low contrast on supported uniform panels. It does not certify a raster export, creative quality, rights or product fidelity.

## Use it

After rendering your local editable SVG/HTML with the host browser, wait for fonts. With an existing Playwright `page`:

```js
import fs from 'node:fs';
import { captureSvgLayout, reviewSvgLayout } from './tools/svg-layout-check.mjs';
await page.evaluate(() => document.fonts.ready.then(() => true));
const snapshot = await page.evaluate(captureSvgLayout, { selector: 'svg' });
const review = reviewSvgLayout(snapshot);
fs.writeFileSync('output/detail-layout-probe.json', JSON.stringify({ snapshot, review }, null, 2));
```

Pass the function itself, not its name as a string. This works without adding a script or fetching a module inside the browser. Exactly one SVG must match. Use a separate page or selector for each export. The helper has no CLI and needs no package installation. It may also be imported into an existing trusted browser module; call capture there and review in Node.

Record the exact source file and final PNG SHA-256 values next to the snapshot. `sourceDomSha256` binds the serialized rendered SVG DOM, which is not necessarily byte-identical to the source file. It does not bind the PNG. Save the actual render command, browser/version, fonts, dimensions and source-to-export mapping. Rerun after every layout edit and final export; never reuse another ratio's snapshot or hash.

## Act on the findings

- `TEXT_IMAGE_INTERSECTION`: inspect every affected character at the reported bounds in the final full-size and phone-size PNG. A line that just crosses a pale photograph edge still needs repair. Move the line clear with deliberate spacing, or give it a fully opaque, correctly ordered panel with sufficient contrast. Do not certify photo text using the brand background colour elsewhere in the image.
- `CONTRAST_UNRESOLVED`: sample the actual region beneath the words or change the composition. Gradients, photos, translucent panels and unsupported shapes do not receive an automatic contrast pass.
- `TEXT_OUTSIDE_VIEWPORT`, `TEXT_TEXT_INTERSECTION`, `LATER_PAINT_INTERSECTION`: inspect overlap/crop, repair the source, render again and inspect the new PNG. Bounding boxes can overestimate actual painted areas; document an intentional exception with the affected export and visual evidence, not a blanket waiver.
- Unsupported elements, nested SVG, filters, clipping, masks, strokes, tspan styling, rotation/skew/reflection and non-opaque paint keep the diagnostic unresolved. The tool supports plain text, rectangular images and opaque square-corner rectangular panels with positive axis-aligned transforms. Do not delete required design elements just to obtain a clear report.
- `NO_GEOMETRY_FINDINGS` means only that the supported checks found nothing. It is never a visual PASS. Font metrics are not glyph-pixel segmentation; outlined/raster text and product details require independent visual inspection. The report uses a conservative 4.5:1 floor even for large text, with no automatic logo exemption.

Inspect all requested PNGs at full size and at the intended phone width. Check every supporting line and CTA as well as headlines. Recompose tall placements deliberately, compare the actual buyer arguments, and check product pixels against the source. Keep any unresolved checks explicit. No layout finding or local review authorizes public use or ad deployment.
