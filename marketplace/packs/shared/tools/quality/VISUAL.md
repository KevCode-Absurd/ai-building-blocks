# Visual review

Use this for anything people look at: pages, emails with layout, decks, ads with images. Look at the real render, not the code.

## Steps

1. Render: `node tools/quality/render.cjs <file.html> <out-prefix>`. It writes `-phone.png` (390 wide) and `-desktop.png` (1280 wide), plus readable slices `-phone-1.png`, `-desktop-1.png`. Outside requests are blocked so anything needing the network shows up broken.
2. Read every slice, phone first. Judge as a senior designer seeing it cold.
3. Fix the file, render again, and look again. Stop when the checklist passes on both sizes.

Note: a fixed or sticky bar appears once mid-image in a full-page shot. Check it does not cover the main button or headline on the first phone screen.

## Checklist

- The first phone screen shows what it is, who it is for and the main action.
- Clear hierarchy: one h1, scannable sections, each with a short heading.
- Body text at least 16px on phone; small print not below 12px; strong contrast.
- Even spacing and aligned edges; nothing crammed against the screen edge.
- Nothing broken, overlapping, cut off or scrolling sideways (render.cjs flags horizontal overflow).
- No lorem, empty boxes, "image here" or fake placeholders.
- Images and icons load; no hotlinks to files that are not there.
- Style matches the brand's own look: colors, type, tone.
- Buttons look tappable: solid fill, at least 44px tall, clear verb label.

## Three common AI page failures

1. **Wall of equal cards.** Every section is the same bordered box, so nothing stands out. Fix: vary the rhythm; give the offer and proof sections more weight and cut weak cards.
2. **Tables and long labels that break on phone.** A wide table hides columns off-screen. Fix: stack rows into cards on phone, or keep the most important column next to the labels.
3. **First screen spent on decoration.** A big illustration or a vague slogan pushes the offer below the fold. Fix: put the plain promise, the price or key fact and the main button above the fold; move art below or shrink it.
