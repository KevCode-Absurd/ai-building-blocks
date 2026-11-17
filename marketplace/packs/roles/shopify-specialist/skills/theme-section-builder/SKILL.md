---
name: theme-section-builder
description: Builds one small Shopify theme change as safely as possible - a Liquid or CSS snippet, or a custom section with settings and blocks the owner can edit in the theme editor. Checks first whether a theme setting, built-in feature or existing section already does the job, then writes commented code for a duplicate theme with install, test and undo steps. Builds it on the duplicate itself with level 2 access and publishes only with level 3 access. Use when a store owner asks for a change their theme cannot make, such as a promise strip, a custom banner, a product page add-on or a layout fix.
---

# Theme section builder

The owner wants one change. This skill delivers it as the smallest, most editable, most reversible piece of theme code that works, built on a duplicate theme. It goes live when the owner publishes it, or when I do with level 3 access.

Access levels for this skill: level 1 (read) to plan and write the code for the owner to paste; level 2 (read and draft) to build it myself on an unpublished duplicate; level 3 (read, write and publish) to publish it within the owner's limits.

## Verifiable patch handoff

Keep byte-exact `output/before/` and `output/after/` trees, using the same theme-relative paths and including added assets in the after tree. Generate the patch with `node tools/verify-patch.mjs --create output/change.patch output/before output/after`. This preserves missing final newlines and verifies the applied result. Never hand-assemble a diff or treat browser checks as proof that a patch applies. Run the main `tools/quality/qe-check.cjs` against the final handoff; it must check the sibling patch. Deliver its receipt with the patch and rollback files. If Git is unavailable, label patch verification NOT_RUN and provide the edited files without claiming an applicable patch.

## When to use

- A new section the owner can place on pages and fill in (a promise strip, an image-with-text variant, a comparison table, a launch banner).
- A small snippet or CSS fix (hide an element on mobile, align a badge, change how a price line wraps).
- A block added to an existing section, where the theme allows it.

Not for: checkout changes (use checkout extensibility or an app), a whole new theme, or anything that needs the owner's password. For showing metafields, use the metafield-display skill.

## What you need

- **Theme name and version**, and whether it came from the Theme Store, elsewhere or a developer. Updates only reach Theme Store themes, and conflicting code edits can be dropped in an update.
- **Access I have**: the level the owner grants for the store, and the limits, written down. Until then, level 1.
- **The files involved**: at level 1, a downloaded copy of the duplicate theme or the specific files pasted (for example `sections/main-product.liquid`, `layout/theme.liquid`); at level 2 or 3, a collaborator account with the Themes and Edit code permissions. Never a password.
- **What the owner wants**, as a screenshot with notes: which page, where on the page, phone and desktop.
- **Who edits it later**: if the owner will change the words or colours, they must be settings.
- **Brand basics**: colours as hex values and the theme's own font settings to reuse.

## Steps

1. **Check for a no-code route.** Look at the theme editor screenshots and the theme's existing sections. If a setting, an existing section, a theme block or a built-in Shopify feature can do it, say so and stop. That is the best answer.
2. **Pick the smallest container.**
   - Content the owner places and fills in: a new section in `sections/`, with a `{% schema %}`, settings and blocks.
   - A reusable piece used in several places: a snippet in `snippets/`, rendered with `{% render %}`.
   - A visual fix only: CSS in the theme's own stylesheet or the section's `{% stylesheet %}`, scoped to a unique class.
   - On a theme built on theme blocks (for example Horizon), a new block in `blocks/` may fit better than a section. A section either defines its own blocks or accepts theme blocks, not both.
3. **Design the settings.** Every word, image, colour and link the owner might change becomes a setting with a sensible default. Use the right input type (`text`, `richtext`, `image_picker`, `color`, `url`, `select`, `checkbox`). Give each a clear label. Add `presets` so the section appears in the theme editor's Add section list.
4. **Write the Liquid.** Reuse the theme's existing classes, colour schemes and typography where you can. Add `{{ block.shopify_attributes }}` to each block wrapper so the theme editor can select it. Guard against empty settings with `!= blank`. Escape plain text output with `| escape` where it is not rich text.
5. **Keep it light.**
   - Images through `image_url` and `image_tag`, with real widths, so Shopify serves sized images with `srcset`.
   - No lazy loading on an image that will sit at the top of the page.
   - No new JavaScript unless the feature needs it; if it does, load it with `defer` and only in this section.
   - No external fonts or libraries.
6. **Make it accessible.** Real headings in order, alt text from the image setting (or empty alt for decorative images), visible focus states, text contrast of at least 4.5:1 (3:1 for large text), and tap targets large enough for a thumb.
7. **Install on the duplicate.** At level 1, write install steps for a non-developer: duplicate the live theme; on the copy, open Edit code; create or open the named file; paste at the marked line; save; open the theme editor on the copy; add the section; fill in the settings; preview on a phone. At level 2, do these steps myself on an unpublished duplicate, log each action, and send the owner a preview link.
8. **Test**: phone and desktop; empty settings; long text; every block count from one to the maximum; a sold-out product if it sits on a product page; keyboard tabbing through any links. Stop and report any Liquid error or editor warning.
9. **Write undo steps**: delete the section from the template in the theme editor, then delete the file; or restore the file from your saved original. Note that the code editor's Timeline restores whole files, has limited history, and cannot bring back deleted files, so keep originals.
10. **Write the change request**: what changes, files touched, risk, test results, and who publishes.
11. **Go live (level 3 only).** Keep a backup copy of the current live theme, show the owner the action list and limits, get a yes, then publish the duplicate or schedule it with Rollouts. Publishing over the live theme without a backup, or anything outside the limits, needs a fresh yes. Log the action and check the live pages straight after.

## Checks

- Could a setting or existing section have done this? If yes, the code is not delivered.
- Every visible word and colour is a setting with a default.
- The section has a preset and shows up in the theme editor.
- No hard-coded store URLs, product handles or prices.
- No new script loads on pages that do not use the section.
- The code runs on the duplicate theme with no Liquid errors (Theme Check, if the developer uses Shopify CLI).
- Contrast passes; images have alt text or empty alt if decorative.
- Install, test and undo steps are complete and in plain English.
- Every action was within the access level and limits written in "Access I have", and is in the log.

## Output format

1. **Answer first**: whether a no-code route exists.
2. **Change request**: what, why, files, risk, who publishes.
3. **Code**: one fenced block per file, with the file path above it.
4. **Install steps**, numbered.
5. **Test table**: page, device, case, expected result.
6. **Undo steps** and a note on theme updates.
7. **Action log** (level 2 and 3): what, where, when, result.

## Example of good output (short)

*Illustrative structure, not a real business: a small loose-leaf tea shop on a Theme Store theme. Copy the shape, never the content: every fact comes from the client's own context.*

**No-code check:** the theme has no strip of short promises with icons, and the announcement bar holds one line only. A small section is the smallest fix.

**Change request:** add a "Promise strip" section with up to four promises. New file `sections/promise-strip.liquid`. No other files change. Risk: low. Access I have: level 2 (duplicates only, until Friday). I build it on "Copy of [Business] live"; the owner previews and publishes.

```liquid
{% comment %} sections/promise-strip.liquid {% endcomment %}
<div class="promise-strip" style="--ps-bg: {{ section.settings.background }}; --ps-text: {{ section.settings.text_color }};">
  <ul class="promise-strip__list" role="list">
    {%- for block in section.blocks -%}
      <li class="promise-strip__item" {{ block.shopify_attributes }}>
        {%- if block.settings.icon != blank -%}
          {{ block.settings.icon | image_url: width: 48 | image_tag: width: 24, height: 24, alt: '' }}
        {%- endif -%}
        <span>{{ block.settings.text | escape }}</span>
      </li>
    {%- endfor -%}
  </ul>
</div>

{% stylesheet %}
  .promise-strip { background: var(--ps-bg); color: var(--ps-text); padding: 12px 16px; }
  .promise-strip__list { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 24px; margin: 0; padding: 0; list-style: none; }
  .promise-strip__item { display: flex; align-items: center; gap: 8px; }
{% endstylesheet %}

{% schema %}
{
  "name": "Promise strip",
  "max_blocks": 4,
  "settings": [
    { "type": "color", "id": "background", "label": "Background", "default": "#1F3A2E" },
    { "type": "color", "id": "text_color", "label": "Text", "default": "#FFFFFF" }
  ],
  "blocks": [
    {
      "type": "promise",
      "name": "Promise",
      "settings": [
        { "type": "image_picker", "id": "icon", "label": "Icon (optional)" },
        { "type": "text", "id": "text", "label": "Text", "default": "Packed by hand within 2 working days" }
      ]
    }
  ],
  "presets": [{ "name": "Promise strip", "blocks": [{ "type": "promise" }, { "type": "promise" }] }]
}
{% endschema %}
```

**Test:** home page, phone, four promises with long text: items wrap onto two lines, nothing overflows. **Undo:** remove the section in the theme editor, then delete the file. Promise wording must match what the shop actually does; the default text is a placeholder for the owner to replace.
