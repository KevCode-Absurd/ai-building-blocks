# Visual review

Use this for anything people look at: pages, emails with layout, decks, ads with images. Look at the real render, not the code.

## Steps

1. Render: `node tools/quality/render.cjs <file.html> <out-prefix>`. It writes `-phone.png` (390 wide) and `-desktop.png` (1280 wide), plus readable slices `-phone-1.png`, `-desktop-1.png`. Outside requests are blocked so anything needing the network shows up broken.
2. Read every slice, phone first. Judge as a senior designer seeing it cold.
3. Fix the file, render again, and look again. Stop when the checklist passes on both sizes.

The renderer also saves `-layout.json` with actual browser fonts, colors, margins and padding. Compare them with the intended design; invalid CSS can silently fall back to browser defaults while producing no overflow. For objective brand/layout requirements, pass an optional third argument pointing to a JSON contract, for example `{"computed_styles":[{"selector":"body","property":"font-family","equals":"Arial"}]}`. Values are exact browser-computed strings; `view` may restrict a check to `phone` or `desktop`. Every matched element must satisfy the check. `CHECKS_PASS` covers only these declared checks, never the whole design.

Note: a fixed or sticky bar appears once mid-image in a full-page shot. Check it does not cover the main button or headline on the first phone screen.

## Checklist

- The first phone screen shows what it is, who it is for and the main action.
- Clear hierarchy: one h1, scannable sections, each with a short heading.
- Body text at least 16px on phone; small print not below 12px; strong contrast.
- Even spacing and aligned edges; nothing crammed against the screen edge.
- Nothing broken, overlapping, cut off or scrolling sideways (render.cjs flags horizontal overflow).
- Read punctuation, currency, dimensions and names in the final render for encoding corruption. Save explicit UTF-8; changing a charset label does not repair already-corrupted text. No-overflow is insufficient: do not split SKU identifiers or ordinary words into unreadable table fragments; use labelled cards or a deliberate scrollable table.
- No lorem, empty boxes, "image here" or fake placeholders.
- Images and icons load; no hotlinks to files that are not there.
- Style matches the brand's own look: colors, type, tone.
- Keep prose cleanup out of HTML/CSS/JavaScript syntax. A global spacing substitution can corrupt `16px`, `#F5F0E8`, `h1`, identifiers or URLs. After any transformation, check the actual computed styles and final render again; a successfully saved screenshot is not proof that styling applied.
- Buttons look tappable: solid fill, at least 44px tall, clear verb label.

## Three common AI page failures

1. **Wall of equal cards.** Every section is the same bordered box, so nothing stands out. Fix: vary the rhythm; give the offer and proof sections more weight and cut weak cards.
2. **Tables and long labels that break on phone.** A wide table hides columns off-screen. Fix: stack rows into cards on phone, or keep the most important column next to the labels.
3. **First screen spent on decoration.** A big illustration or a vague slogan pushes the offer below the fold. Fix: put the plain promise, the price or key fact and the main button above the fold; move art below or shrink it.
