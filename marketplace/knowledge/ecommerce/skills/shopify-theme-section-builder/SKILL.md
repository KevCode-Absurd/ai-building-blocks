---
name: shopify-theme-section-builder
description: "Builds new Shopify theme sections, blocks and snippets the owner can edit in the theme editor: valid Liquid, a settings schema with sensible defaults and presets, translation keys, scoped CSS and minimal JavaScript, reusing the theme's own patterns. Works only on an unpublished duplicate theme, runs Shopify Theme Check until it reports no errors, tests every setting and empty state in the editor, and compares mobile page speed against the live theme before handing over. The owner publishes. Use when a conversion fix or new page needs a section the current theme lacks, or when an app could be replaced by a lighter native section."
---

# Shopify theme section builder

**You get:** new Shopify theme section files (Liquid, settings schema, locale entries, CSS and JavaScript) on an unpublished theme, with a settings table, test results, a preview link and a one-page owner guide.

A new section the owner can add, edit and remove in the theme editor, proven not to slow the page, built on a copy of the theme and handed over for the owner to publish.

## When to use

- A fix from `storefront-conversion-audit` needs a section the theme does not have (a comparison table, an objection-answering review block, a bundle picker layout).
- A landing page needs custom sections the owner can reuse.
- An app adds a simple element (a trust bar, a free-shipping bar) that a native section could do without its scripts.
- The owner wants to edit content that is currently hard-coded in the theme.

## Not for

- Deciding what the page should say or which fix comes first: use `storefront-conversion-audit` or `store-meta-landing`.
- Store settings (payments, shipping, tax): use `store-settings-checklist-audit`.
- A full theme rebuild or a move between themes: a separate project with its own plan.
- Headless or non-Shopify storefronts: the Liquid rules here do not apply.

## What you need

Required:

1. **The section's goal**: what the shopper should do after seeing it, the page template it goes on, and a sketch, screenshot or reference URL.
2. **Theme access**: the owner adds the developer as a staff member or collaborator with theme permissions, or connects the theme to a GitHub repository. The developer signs in to Shopify CLI with their own account. Never share passwords.
3. **Theme name and version**, and whether it is an Online Store 2.0 theme (JSON templates). Older themes cannot add sections to every page.
4. **Brand tokens** from `store-visual-identity-sheet`, or the theme's own settings.
5. **Content**: real text, images and reviews for the default preset.

Optional: languages the store sells in, current PageSpeed results for the target page.

Access: draft (level 2) on an unpublished duplicate theme. Publishing the theme is the owner's action, after a yes.

## Before you start: the gates

1. **Gross profit per purchase and expected gain.** Pass when the section comes from a ranked fix with a gross profit figure (`storefront-conversion-audit`) or the client accepts it as a brand or content need. Fail: ask what the section must earn before building it.
2. **Capacity.** Build hours and who maintains the code after handover. A section the owner cannot edit or the team cannot maintain is a liability.
3. **Theme fit.** Pass for Online Store 2.0 themes. For older themes, narrow the job to the templates that support sections, and say so.
4. **Speed baseline.** Record mobile PageSpeed for the target template on the live theme before building. Without a baseline, the speed check in step 9 cannot pass.

## Steps

### 1. Work on a copy

Duplicate the live theme in the admin. Pull the duplicate with `shopify theme pull`. Never edit the live theme.

### 2. Read the theme's patterns

Look through `sections/`, `blocks/`, `snippets/`, `assets/`, `locales/` and `config/settings_schema.json`. Note how the theme handles: colour schemes, spacing, headings, buttons, the image snippet, and loading of section CSS. Reuse these. A section that looks native and uses the theme's variables survives theme updates better.

### 3. Write the section spec

| Item | Decide |
|---|---|
| Settings | What the owner edits: heading, text, image, link, colour scheme, padding |
| Blocks | Repeating items and their types; a maximum count |
| Presets | A default that looks finished when first added, with real content |
| Where allowed | Templates or section groups it may appear in |
| Empty states | What shows with no image, no blocks or no product |
| Mobile | Layout at 390 px wide first |

For product page sections, follow the page rules: price, add to cart and a risk reducer in the first mobile screen [LPG-0034]; risk reducers directly under the main button [LPG-0038]; links that lead away from the product can cost sales [LPG-0071].

### 4. Write the Liquid and schema

Pick the right file type: a **section** for a full-width module the owner places; a **theme block** (`blocks/`) for a small piece with its own settings that nests inside sections; a **snippet** for shared markup with no settings, called with `render` and given every value it needs (snippets cannot see the caller's variables). Start each snippet with a `{% doc %}` header listing its parameters.

- Schema: valid JSON inside `{% schema %}`, unique setting ids, the right setting types, `max_blocks` where needed, and presets. Use `visible_if` to hide settings that do not apply. Accept app blocks where the theme does, so apps can still slot in.
- Liquid traps: no brackets or ternaries in conditions (nest `if` tags instead); `render`, never the old `include`; loops stop at 50 items unless paginated.
- A landing page section also gets one CTA link setting that drives every button, and a page template (`templates/page.<handle>.json`) preloaded with the real copy so the page renders on install.
- Never ship default proof: no placeholder star rating, review count or customer count. Leave the field empty and hide the block until real proof exists.
- Put `{{ block.shopify_attributes }}` on each block's wrapper so the editor can select it, and scope ids and CSS with `section.id`.
- No hard-coded shopper-facing text: use translation keys with the `t` filter, adding keys to `locales/en.default.json` and schema labels to `locales/en.default.schema.json`. Add other store languages if they exist.
- Escape owner-entered text where it lands in attributes.

### 5. Images

Use the `image_url` filter with a width and the `image_tag` filter with `widths` and `sizes`, so phones get small files. Rules:

- An image in the first screen loads eagerly with high fetch priority, never lazy or faded in; this is the most common slow-LCP cause on Shopify [SPD-0006].
- Every other image is lazy loaded.
- Width and height (or an aspect ratio) are set so nothing jumps when it loads; apps and late elements are the usual cause of layout shift [SPD-0007].
- Source images around 2,000 px wide, compressed well below 500 KB [SPD-0008]; product shots near 100 KB and heroes near 200 KB where possible [SPD-0002].
- Video: a light embed that loads only a thumbnail until clicked, not a full player; no autoplay on mobile; any short looping clip is muted with a poster image [SPD-0010].
- Images come from image picker settings and the store's Files, not bundled into theme assets, so the owner can swap them.

### 6. CSS and JavaScript

- CSS: scoped to the section id, using the theme's variables, mobile first, loaded only where the section renders. Static rules go in one `{% stylesheet %}` tag per file (it does not run Liquid); values that come from settings go in a `{% style %}` tag or a CSS variable on the wrapper; a choice that changes several properties maps to a class.
- JavaScript: only if the section needs behaviour. Small, plain JavaScript, loaded with `defer`, no new libraries, nothing in the theme head. Code pasted into the head blocks rendering [SPD-0011].
- Re-run setup on the theme editor's section load event so the section works while the owner edits it.
- No "quick view" style preloading of product data for many items; fetch on click [SPD-0012].

### 7. Accessibility

Real headings in order, buttons as buttons, alt text from the image's alt field, visible focus states, and text contrast of 4.5 to 1 or better.

### 8. Run Theme Check and the editor test

Run `shopify theme check` on the duplicate. Fix every error; read every warning and fix or note why it stays. Typical hits are invalid schema, missing translation keys, images without width and height, and parser-blocking scripts.

Then preview with `shopify theme dev` or push to the unpublished theme. In the theme editor:

- Add the section from its preset; it should look finished.
- Change every setting; remove every block; add the maximum blocks.
- Try long text, missing images and a second language.
- Check on a phone and on desktop.

### 9. Run the speed test

Run PageSpeed Insights (mobile) three times on the target template in the duplicate theme's preview and three times on the live theme. Compare medians. Pass when (practitioner defaults, test them):

- Largest Contentful Paint is no more than 10% worse than live.
- Layout shift stays under 0.1.
- The section adds under about 20 KB of JavaScript and no new third-party requests.

Lab numbers move at once; field data on the live page takes about 28 days to show a change [SPD-0005]. If the section replaces an app, remove the app's leftover code too; stores with fewer third-party services score far higher on mobile [SPD-0001].

### 10. Hand over

Give the owner: the preview link, a one-page guide (how to add, edit and remove the section, with screenshots), the Theme Check and speed results, and a rollback note (the live theme stays unchanged until they publish). The owner publishes after a yes. Measure the effect with the test rules in `storefront-conversion-audit`.

## Checks before you hand it over

- All work is on an unpublished duplicate; the live theme is untouched.
- Theme Check reports no errors; every warning is fixed or explained.
- The preset looks finished; every setting, empty state and block count was tested in the editor.
- No hard-coded shopper-facing text; translation keys exist for each store language.
- First-screen images load eagerly; all others lazy; every image has dimensions.
- Speed medians pass against the live theme.
- Nothing was published without the owner's yes.

## Output

1. **One-screen summary:** what the section does, where it is allowed, Theme Check result, speed result against live, and the preview link.
2. **Files:** the section, any snippets or blocks, locale entries, CSS and JS, listed with paths.
3. **Settings table:** Setting, Type, Default, What it changes.
4. **Test table:** Check, Result (Theme Check, editor tests, mobile, desktop, speed medians live and new).
5. **Owner guide:** one page with screenshots.

## Common mistakes

- **Editing the live theme.** Step 1 works on a duplicate only.
- **Lazy-loading the hero.** Step 5 loads first-screen images eagerly [SPD-0006].
- **Hard-coded text.** Step 4 uses translation keys.
- **A preset that looks empty.** Step 3 ships real default content.
- **Adding a library for one slider.** Step 6 keeps JavaScript small and deferred.
- **Skipping the editor test.** Step 8 tests every setting and empty state.
- **Trusting one speed run.** Step 9 compares medians of three.

## Sources

- LPG-0034: mobile product page first screen.
- LPG-0038: risk reducers under the main button.
- LPG-0071: links away from the product can cost sales.
- SPD-0001: fewer third-party services, faster mobile scores.
- SPD-0002, SPD-0008: image weight and upload size.
- SPD-0005: field data lags about 28 days.
- SPD-0006: eager hero image.
- SPD-0007: layout shift from late elements.
- SPD-0010: light video embeds.
- SPD-0011: scripts in the theme head block rendering.
- SPD-0012: avoid quick view preloading.

What makes this skill ours: every section is built on an unpublished duplicate and must pass Theme Check, a full editor test and a three-run mobile speed comparison against the live theme before handover; it starts from a fix that has a gross profit figure; and the owner, not the agent, publishes.
