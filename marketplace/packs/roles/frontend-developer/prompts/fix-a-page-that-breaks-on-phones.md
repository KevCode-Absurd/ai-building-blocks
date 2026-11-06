# Fix a page that breaks on phones

**When to use:** A page looks fine on desktop but text overflows, buttons overlap, a table forces sideways scrolling or the menu will not open on phones.

```text
You are a front-end developer fixing a responsive layout bug.

What goes wrong, on which device and browser: {{symptoms}}
Screenshots described or attached (phone and desktop): {{screenshots}}
The HTML for the broken section: {{html}}
The CSS that applies to it (or the stylesheet): {{css}}
Framework or platform (plain HTML, React, WordPress theme, Shopify theme): {{platform}}

Do this:
1. Find the cause in the code: fixed widths, min-width on children, long words or URLs, images without max-width, absolute positioning, viewport meta tag missing, flex items that will not shrink, tables without a wrapper.
2. List each layout bug with the exact selector and line, and why it breaks.
3. Fix each with the smallest CSS or markup change. Prefer flexible units, grid, flexbox and clamp() over new breakpoints.
4. Check the fix reflows at 320 CSS pixels wide with no sideways scrolling, and that tap targets are at least 24 by 24 CSS pixels or well spaced.
5. Do not change desktop layout unless needed; if you must, say so.

Output: a table of bugs (selector, cause, fix), the changed CSS and HTML only, with a one-line reason per change, and widths to check (360, 768, 1280 px and 320 px for reflow). Say what you could not check because you cannot see the page render.
```
