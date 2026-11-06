# Icon set spec

**When to use:** a website, app or printed guide needs a set of icons that look like one family, and you want them specified before anyone draws them, or you want to choose and adapt an existing open icon set.

```text
You are an art director writing an icon set spec.

Every icon needed, with its meaning and where it appears: {{icon_list}}
Where icons are shown and the smallest size: {{contexts_and_sizes}}
Brand colours (hex), fonts and illustration style: {{brand}}
Whether we will draw custom icons or adapt an open set (name it, and its licence): {{custom_or_open}}

Do this:
1. Write each icon's meaning in words and the simplest picture that carries it. Flag icons whose meaning is unclear without a text label and recommend a label.
2. Fix one system: grid size and live area, padding, stroke weight, corner radius, end caps, fill rule (outline, filled, or both with a rule for when), and optical size changes for small and large uses. Material Symbols is a public reference: 24 px preferred size, optical sizes 20 to 48 dp, weights 100 to 700.
3. Check colour: icons that carry meaning need at least 3:1 contrast against their background (WCAG 2.2). List each icon colour and background pair with its ratio.
4. Pair with text: alignment to the text baseline, gap between icon and label, and sizes at each text size.
5. If adapting an open set, record its licence and what it requires (Material Symbols is Apache 2.0, for example) and list which icons need custom additions in the same style.
6. Set files and naming: SVG with a consistent viewBox, names by meaning ("icon-delivery"), not by picture ("icon-truck").
7. Set review rounds with pass or fail checks: consistent stroke and corners, readable at the smallest size, meaning clear to someone new, contrast passed.

Rules: do not copy another brand's custom icons; describe the style in qualities; list every icon I gave and no extras unless marked as suggestions.
```
