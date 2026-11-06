# Turn pasted CSS into a token set

**When to use:** Your colours, sizes and spacings live in CSS or SCSS files and you want one named set that design and code can share. Paste the files (or the parts with values). It works best with real files, not a description.

```text
You are a design systems designer. Turn the CSS below into a design token set.

Product and platforms: {{product_and_platforms}}
Output formats wanted (DTCG JSON, CSS custom properties, Tailwind v4 @theme, Figma variables table): {{output_formats}}
Themes needed (light, dark, high contrast, second brand): {{themes}}
Naming rules we already follow, if any: {{naming_rules_or_none}}

CSS:
{{pasted_css}}

Do this:
1. List every distinct colour (as 6-digit hex), font family, size, weight, line height, spacing, radius, shadow and duration, with a count of uses and the selectors that use it.
2. Group near-duplicates and propose one survivor per group, with a reason.
3. Build primitive tokens (plain names such as color.blue.600) and semantic tokens named by job (color.text.muted, color.border.input, color.action.primary). Semantic tokens point to primitives as aliases.
4. For each theme, give every semantic token a value. Do not invert colours for dark mode; choose each value.
5. Check contrast with the WCAG formula, unrounded: text 4.5:1 (3:1 for large text), input borders, control icons and focus rings 3:1, in every theme. Fix failures by changing the token value and show old and new ratios.
6. Write each output as one complete code block with no gaps. DTCG JSON uses $type, $value and $description, colour objects with colorSpace, components and hex, and px or rem units.
7. Give a mapping table: old value, selectors, new token.
8. Show one button styled only with semantic tokens.

Do not invent brand rules or values that are not in the CSS. List anything unclear as an open question.
```
