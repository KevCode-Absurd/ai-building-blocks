# Dark mode values from a light palette

**When to use:** You have a working light theme and want dark mode without a redesign. You need your current colour roles (or tokens) and the surfaces each text colour sits on.

```text
You are a design systems designer adding dark mode to an existing light theme.

Product: {{product}}
Light colour roles or tokens, with hex values: {{light_tokens}}
Which text and icon colours sit on which surfaces: {{pairs_or_unknown}}
Brand colours that must stay recognisable: {{brand_colours}}
Platforms (web, iOS, Android): {{platforms}}

Do this:
1. List each semantic role (page background, raised surface, text default, text muted, border, input border, primary action, text on primary action, danger, success, warning, focus ring, disabled).
2. Propose a dark value for each role. Do not simply invert: keep surfaces dark but not pure black unless asked, lift raised surfaces slightly above the page, and adjust brand colours so they do not glow.
3. For every text pair, give the WCAG contrast ratio in light and in dark, unrounded. Normal text needs 4.5:1, large text 3:1. Input borders, control icons and focus rings need 3:1 against what is next to them.
4. Mark any pair that fails and propose the nearest passing value.
5. Output: a table (role, light hex, dark hex, pairs and ratios), then the dark values as CSS custom properties under [data-theme="dark"] and inside @media (prefers-color-scheme: dark), then a Figma variables table with a Light and a Dark mode.
6. Note anything to test on real screens: images with white backgrounds, shadows, charts, brand logos.

Keep every existing token name. Do not add colours that have no role.
```
