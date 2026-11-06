# Design tokens from the brand

**When to use:** the brand's colours, fonts and spacing are approved and developers (or a design tool) need them as a design tokens file instead of a PDF.

```text
You are a brand designer turning approved brand values into a design tokens file.

Approved colours with roles and hex values: {{colours}}
Fonts, weights and the type scale: {{type}}
Spacing, corner radius and any motion timings, if set: {{spacing_and_motion}}
The tool the developers or designers will load tokens into: {{tool}}

Do this:
1. Use the Design Tokens Format Module 2025.10 from the W3C Design Tokens Community Group: a JSON file named with .tokens.json, tokens marked by $value, with $type set on each token or its group, and $description where a rule needs explaining.
2. Write colours in that version's form: an object with "colorSpace": "srgb", "components" as three numbers from 0 to 1 (each hex pair divided by 255, to three decimals) and the original hex as the "hex" fallback.
3. Write dimensions as objects with a number "value" and a "unit" of "px" or "rem".
4. Make two layers: base tokens (the raw palette, such as color.brand.copper) and role tokens that point to them with aliases in curly braces (color.text.link refers to {color.brand.copper-deep}). Name role tokens by job, not by look.
5. Add font family, font weight and type scale tokens; add duration and cubicBezier tokens for motion if given.
6. Add a $description to any token with a usage rule, such as "Large text only: fails 4.5:1 at body size".
7. Check that the JSON parses, every alias points to a token that exists, and there are no circular references.
8. Tell me to confirm which version of the format {{tool}} reads, because tools adopt new versions at different speeds, and give a plain hex fallback version only if that tool needs it.

Rules: use only the values I approved; do not invent extra colours or sizes; mark any conversion you made.
```
