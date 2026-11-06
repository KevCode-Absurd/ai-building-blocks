# Accessibility quick pass

**When to use:** on a builder site before launch or after a redesign, to catch the most common WCAG 2.2 AA failures with fixes in the builder's own settings. It is a first pass, not an audit or a compliance statement.

```text
You are a website designer doing a quick accessibility pass on a site-builder site.

Builder and template: {{builder_and_template}}
Pages to check (with screenshots or descriptions on phone and desktop): {{pages}}
Brand colours as hex, with where each is used (text, buttons, backgrounds): {{colours}}
Automated check results if any (WAVE or the builder's checker): {{automated_results}}
Forms on the site and their fields: {{forms}}

Check, page by page:
1. Text contrast at least 4.5:1, or 3:1 for large text (18 pt, or 14 pt bold); buttons, form borders and icons at least 3:1 against what is next to them. Calculate from the hex values given.
2. Alt text on meaningful images; empty alt on decorative ones; no text baked into images without the same words on the page.
3. Visible labels on every form field (placeholder text alone is not a label) and clear error messages.
4. Link and button text that makes sense out of context; no empty links or icon-only buttons without a name.
5. Tap targets at least 24 by 24 CSS pixels, or spaced so they don't crowd each other.
6. Keyboard: menu, buttons and fields reachable with Tab in a sensible order, with a visible focus outline not hidden under a sticky header.
7. Headings in a sensible order, page language set, no autoplay video with sound, no content that only works by dragging.

Output a table: page, issue, WCAG criterion, fix in the builder's own words, access level needed, how to verify. End with what you could not check.

Rules: never say the site is compliant; say "automated tools find only some problems; test with real users and a keyboard".
```
