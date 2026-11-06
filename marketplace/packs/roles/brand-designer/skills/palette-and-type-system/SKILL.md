---
name: palette-and-type-system
description: Builds a brand colour palette and type system people can actually apply - five to eight colours with roles and values (hex, RGB, CMYK and Pantone where supplied), a contrast pairing table for every text and background combination against WCAG 2.2, a heading and body font pair with weights, a size scale for web and print, licence checks and Office fallbacks - and exports it as design tokens in the W3C community format (2025.10). Use for a new identity, a refresh, settling arguments about colour, or handing brand values to developers.
---

# Palette and type system

A palette is not a set of swatches. It is a set of jobs: which colour is the brand, which one draws the eye to the button, which one is text, and which pairs may sit together. The same goes for type. This skill turns brand choices into rules a team can follow and a file a developer can load.

## When to use

- A new identity needs colours and fonts.
- A brand has drifted into many shades and fonts and needs one source of truth.
- A team argues about colour and needs reasons.
- Developers need brand values as tokens.

Not for: logo drawing, or print production specs for a single piece.

## What you need

- Feeling words and the logo (or logo direction).
- Current colours in use, with values if known, and where each appears.
- Where the brand appears: web, app, print, signage, Office documents, video.
- Fonts in use or liked, and how they were licensed.
- Who will use the system: designers, staff in Canva or Office, developers.
- **Access I have.** Steps 1 to 8 need level 1. Step 9 (creating colour and text styles or variables in a draft Figma file, or a draft Canva brand kit) needs level 2. Updating the client's live shared library or brand kit needs level 3 within the client's limits.

## Steps

1. **Collect what exists.** List every colour and font in use, where, and how often. For a refresh, mark what customers recognise; keep it unless there is a reason to drop it.
2. **Assign roles.** Five to eight colours: primary, secondary or accent, text, background, surface, and functional colours (success, warning, error) if the brand has a product or website. One sentence per colour on its job and roughly how much of a page it covers.
3. **Give values.** Hex and RGB for every colour; CMYK and Pantone only where the client or their printer supplied them. Mark any conversion I made as "[check with your printer]". Avoid very saturated screen colours for print without a proof; Spotify's guidelines warn about over-saturated colours in CMYK.
4. **Build the pairing table.** Every text-on-background pair the brand might use, with its contrast ratio, checked in a contrast tool. WCAG 2.2 AA needs 4.5:1 for normal text and 3:1 for large text (18 pt, or 14 pt bold); icons and meaningful graphics need 3:1. Mark each pair: body text, large text only, or decoration only. Logos are exempt; other brand text is not.
5. **Fix failing brand colours.** If the primary colour fails as text, keep it for shapes and backgrounds, and add a darker shade of the same hue for text. Give the new value and its ratio.
6. **Pair the fonts.** A heading font and a body font that are real, named families, with weights in use. Give one reason for the pair (contrast of structure, shared proportions). Add a free web fallback and a system font for Office.
7. **Check licences.** For each font: source, licence type, and whether it covers desktop, web, app, logo and video use. Fonts under the SIL Open Font License may be used in logos, and the artwork is not bound by the OFL; commercial fonts need their own licence checked for each use. Record where each licence file lives.
8. **Set the scale and write tokens.** A type scale for web (px or rem) and print (pt), with line spacing. Then write a tokens file in the Design Tokens Format Module 2025.10: JSON with $type and $value, grouped by role, with aliases such as {color.brand.copper} so text colours refer to base colours. In that version a colour's $value is an object with a colorSpace (such as "srgb") and components (0 to 1 for sRGB), with an optional hex fallback; a dimension is an object with a number and a unit of px or rem. Name tokens by role ("color.text.primary"), not by look.
9. **Level 2: build styles.** With level 2 access, create colour and text styles or variables in a new draft Figma file, or a draft brand kit in Canva, named "DRAFT". Do not change the live library. Log what you created.

## Checks

- Every colour has a role and values; every conversion I made is marked.
- Every text pair in use is in the table with a ratio and a permitted use.
- No body text pair is under 4.5:1.
- Fonts are named families with licences recorded, plus fallbacks.
- Tokens parse as JSON, use $type and $value, and are named by role.
- Do and don't rules are one short sentence each.

## Output format

1. **Palette table:** name, role, hex, RGB, CMYK, Pantone, share of use, notes.
2. **Pairing table:** text colour, background, ratio, permitted use.
3. **Type system:** fonts, weights, scale (web and print), line spacing, fallbacks, licences.
4. **Do and don't rules.**
5. **Tokens file** (JSON).
6. **Open questions** and an action log for any level 2 or 3 work.

## Example of good output (short)

*Wrenfold Tea Rooms is a made-up cafe used only to show the format. Ratios below are illustrative; in a real job each is measured in a contrast checker and recorded exactly.*

| Name | Role | Hex | Use |
|---|---|---|---|
| Copper | Primary, shapes and large headings | #B5652B | About a fifth of a page |
| Copper Deep | Text in the brand hue | #7A3E14 | Links, small headings |
| Cream | Background | #FBF5EC | Most of the page |
| Ink | Body text | #2B2420 | All body copy |

| Text | Background | Permitted use |
|---|---|---|
| Ink | Cream | Body text |
| Copper Deep | Cream | Body text, if the measured ratio is 4.5:1 or more |
| Copper | Cream | Large text only, if 3:1 or more; otherwise shapes only |

```json
{
  "color": {
    "$type": "color",
    "brand": {
      "copper": { "$value": { "colorSpace": "srgb", "components": [0.71, 0.396, 0.169], "hex": "#b5652b" } },
      "copper-deep": { "$value": { "colorSpace": "srgb", "components": [0.478, 0.243, 0.078], "hex": "#7a3e14" } }
    },
    "text": {
      "primary": { "$value": { "colorSpace": "srgb", "components": [0.169, 0.141, 0.125], "hex": "#2b2420" } },
      "link": { "$value": "{color.brand.copper-deep}" }
    }
  },
  "spacing": {
    "$type": "dimension",
    "base": { "$value": { "value": 16, "unit": "px" } }
  }
}
```

*Components are the hex values divided by 255. Before handing over, run the file through the developer's token tool, because tools adopt new format versions at different speeds.*
