# AI default patterns

Version 1.0.0, updated 2026-11-09. The same list as `patterns.json`; edit the JSON and keep this file in step.

Add a pattern only when a blind test, a buyer report or the same choice across unrelated brands shows it. Each pattern is a default to avoid unless the brand or the brief chooses it on purpose.

Name the ones you will avoid in the taste brief by id. A critic checks for every pattern in the deliverable's family. "Fine when" is the only way a pattern survives: the brand already does it, or a recorded decision chose it.

## Web pages

### `web-template-stack`

Centred hero, then 3 benefit cards, then "How it works in 3 steps", then testimonials, then FAQ, then a final call to action, whatever the category.

- **Why it reads as default:** It is the most common SaaS landing-page template in the model's training data, so it is what the model writes when nothing else decides the order.
- **Fine on purpose when:** A new software product with no site yet, where the buyer's questions really come in that order and a real reference page uses it.
- **How a critic checks:** Compare the section kinds with the brand's own section order in brand-dna.json. If the candidate matches this stack and the brand's pages do not, flag it.

### `web-purple-gradient`

Purple, indigo or blue-to-violet gradients on the hero, buttons or section backgrounds.

- **Why it reads as default:** Indigo was a framework default for years and models converge on it when no brand colour is given.
- **Fine on purpose when:** The brand's measured palette already uses those colours or a gradient.
- **How a critic checks:** Any gradient, or any colour covering 3% or more of the page, that is not in the brand palette.

### `web-font-swap`

Inter, Geist, Poppins, Manrope, Space Grotesk or system-ui used in place of the brand's fonts.

- **Why it reads as default:** These are the model's favourite modern sans fonts. A 'self-contained' or 'no external requests' brief also pushes it to system fonts without saying so.
- **Fine on purpose when:** The brand uses that font, or it is a new brand and the font was chosen in the taste brief for a stated reason.
- **How a critic checks:** Font family per role (h1, h2, body, button, nav) against brand-dna.json, and whether the brand font file actually loaded.

### `web-pill-buttons`

Fully rounded pill buttons where the brand's buttons are square or barely rounded.

- **Why it reads as default:** Pills read as friendly and modern, so the model picks them when the radius was not captured.
- **Fine on purpose when:** The brand's buttons are pills (Allbirds' measured button radius is fully round).
- **How a critic checks:** Primary button radius against the brand's primary button radius.

### `web-sentence-case-buttons`

Sentence-case, bold, 10 to 12 px rounded buttons replacing the brand's own button grammar, such as UPPERCASE letter-spaced labels.

- **Why it reads as default:** Button case and letter spacing are rarely written in a brand brief, so the model's habit fills the gap.
- **Fine on purpose when:** The brand's buttons are sentence case.
- **How a critic checks:** text-transform and letter-spacing of the primary button against the capture.

### `web-rounded-cards`

Rounded cards with soft shadows around every group of content.

- **Why it reads as default:** Cards are the model's default way to group anything, and soft shadows read as polish.
- **Fine on purpose when:** The brand's own components are rounded cards with shadows.
- **How a critic checks:** Card radius and shadows against shape.card_radius and shape.shadows in the capture.

### `web-emoji-icons`

Emoji used as feature icons or bullet markers.

- **Why it reads as default:** Emoji are the cheapest icon the model can produce without assets.
- **Fine on purpose when:** The brand uses emoji in its own site or social voice.
- **How a critic checks:** Emoji characters in headings, list items or icon slots.

### `web-glass-cards`

Frosted-glass cards (blur, translucent white, thin light border) over a gradient.

- **Why it reads as default:** A trend that is heavily over-represented in recent UI examples.
- **Fine on purpose when:** The brand's product UI uses it and the page is about that product.
- **How a critic checks:** backdrop-filter blur or translucent white surfaces not in the capture.

### `web-empty-logo-row`

A "Trusted by" or "As seen in" row with grey placeholder logos, invented names or logos the client never supplied.

- **Why it reads as default:** The template expects social proof there, so the model fills the slot.
- **Fine on purpose when:** Never with invented logos. Real logos with permission are fine.
- **How a critic checks:** Logo rows whose names are not in the client's facts or proof list.

### `web-stock-hero`

A generic stock-style or generated hero image (laptop on desk, smiling team, abstract 3D shapes) instead of the real product or the brand's house photography.

- **Why it reads as default:** It is what the model can make without the client's photos.
- **Fine on purpose when:** The brand has no product photos yet and the image is labelled as a planned shot, not shipped.
- **How a critic checks:** Hero image source: is it one of the brand's images or in the house style seen in the screenshots?

### `web-uniform-sections`

Every section the same height, padding and layout rhythm.

- **Why it reads as default:** One spacing rule applied everywhere is the simplest system to generate.
- **Fine on purpose when:** The brand's pages really are that even.
- **How a critic checks:** Spread of section height_share in the candidate against the brand's sections.

### `web-fade-up-everything`

The same fade-up entrance animation on every block.

- **Why it reads as default:** One animation library call applied to every section is an easy way to look 'designed'.
- **Fine on purpose when:** The brand's site animates that way, or one planned entrance on the first screen.
- **How a critic checks:** Count of elements with the same entrance animation class or keyframes.

### `web-dropped-chrome`

The client's header and footer replaced by a minimal logo bar and a thin footer with a few links.

- **Why it reads as default:** Landing-page templates strip navigation to 'focus' the visitor, and the model treats the page as standalone.
- **Fine on purpose when:** A paid-traffic page where the client chose to remove navigation, recorded in DECISIONS.md, with the footer's legal and contact links kept.
- **How a critic checks:** Nav and footer item overlap with the capture (brand-fidelity-check, chrome).

### `web-cream-premium`

Cream, ivory or beige backgrounds swapped in to look 'premium', 'artisan' or 'luxury'.

- **Why it reads as default:** The model can substitute its idea of premium for the measured brand palette, overusing cream even when the source site uses it sparingly.
- **Fine on purpose when:** Cream is a measured brand surface at a similar share.
- **How a critic checks:** Area share of near-cream colours against the brand's share.

### `web-accent-promoted`

A minor brand colour (a badge or seasonal accent) promoted to the top bar, the main button or whole bands.

- **Why it reads as default:** Colour lists without area shares make every colour look equal, which can promote a minor accent into a dominant surface or primary action.
- **Fine on purpose when:** The client asked for it for a campaign and it is in the change list.
- **How a critic checks:** palette area-share drift: an accent growing past twice its measured share.

### `web-signature-element`

An invented 'memorable' signature element (a custom price tag, a novel card shape, a decorative motif) that is not in the brand's component set.

- **Why it reads as default:** Design skills tell the model to give every page one memorable thing, which is right for a new brand and wrong for an existing one.
- **Fine on purpose when:** Mode is new, or the element is built only from the brand's tokens and the plan says why no existing component fits.
- **How a critic checks:** Components on the candidate with no match in the captured page (shape, colour, type).

### `web-thin-merchandising`

Far fewer images and product modules than the brand's pages, with more white space.

- **Why it reads as default:** The model's taste favours calm, sparse pages. Dense merchandising looks 'cluttered' to it even when buyers expect it.
- **Fine on purpose when:** A deliberate test of a simpler page, recorded with its hypothesis.
- **How a critic checks:** images.per_1000px and image area share against the capture.

### `web-centred-everything`

Every heading and paragraph centred.

- **Why it reads as default:** Centring is the template's default for short marketing text.
- **Fine on purpose when:** The brand centres its own sections.
- **How a critic checks:** text-align of section headings and body against the brand's pages.

### `web-visible-placeholders`

Placeholder chips, dashed boxes, 'to shoot' image slots or 'client to supply' labels inside the page meant for launch.

- **Why it reads as default:** The model is honest about gaps but puts them in the page instead of in a hand-off list.
- **Fine on purpose when:** A review build that is clearly marked, with a clean launch build beside it.
- **How a critic checks:** brand-fidelity-check, placeholders.

### `web-hardcoded-offer`

Sale prices, countdowns and dated offers written straight into the markup.

- **Why it reads as default:** The model can copy a temporary sale price from a capture without preserving its expiry or checking the current offer.
- **Fine on purpose when:** The offer is held in one dated data block with an end date.
- **How a critic checks:** Prices and offers against the capture date (brand-fidelity-check, facts).

### `web-bento-grid`

A bento grid of mismatched tiles for features.

- **Why it reads as default:** A recent trend in product marketing pages that models now reach for.
- **Fine on purpose when:** The brand's site uses it.
- **How a critic checks:** Grid sections with tiles of 3 or more different sizes not in the capture.

## Copy

### `copy-ai-verbs`

Unlock, elevate, seamless, game-changer, supercharge, effortless, empower, transform, revolutionise, delve, harness.

- **Why it reads as default:** These words appear far more often in model output than in human writing about the same subjects.
- **Fine on purpose when:** The word is in the client's own voice samples.
- **How a critic checks:** Search the text for the list and compare with voice.samples.

### `copy-stock-opener`

"In today's fast-paced world", "Ever wondered", "Tired of", "Say goodbye to", "Meet X".

- **Why it reads as default:** Stock openers are the most likely first words for a marketing paragraph.
- **Fine on purpose when:** Almost never. Start with the specific thing.
- **How a critic checks:** The first five words of each section.

### `copy-rule-of-three`

Lists of exactly three everywhere: three benefits, three adjectives, three steps.

- **Why it reads as default:** Three reads as complete and rhythmic, so the model uses it by reflex.
- **Fine on purpose when:** There really are three things.
- **How a critic checks:** Count lists and adjective triplets; more than two on one page is a flag.

### `copy-headline-formula`

Formula headlines: "The smarter way to X", "X, without the Y", "It's not X. It's Y.", "Not just X. Y."

- **Why it reads as default:** These shapes score well in copywriting examples, so they are the model's default headline.
- **Fine on purpose when:** The client's best-performing ads use that shape, with evidence.
- **How a critic checks:** Headline shape against the client's own headlines in voice.samples.

### `copy-fake-urgency`

"Limited time", "Only a few left", countdowns and "Don't miss out" with no real deadline or stock count.

- **Why it reads as default:** Urgency is a standard conversion device in templates.
- **Fine on purpose when:** A real, dated offer or a real stock figure from the capture.
- **How a critic checks:** Each urgency claim traced to a fact with a date.

### `copy-any-competitor`

Benefits any competitor could claim: high quality, great service, fast shipping, made with love.

- **Why it reads as default:** With no specific facts, the model writes the category average.
- **Fine on purpose when:** Never as the main claim. Replace with the specific fact ("BIS hallmarked", "7-day return and exchange").
- **How a critic checks:** Could a competitor publish this sentence unchanged? If yes, flag it.

### `copy-invented-proof`

"Trusted by thousands", "Loved by 10,000+ customers", star ratings or quotes not in the facts.

- **Why it reads as default:** Templates have a proof slot and the model fills it with plausible numbers.
- **Fine on purpose when:** Never. Use captured numbers with their source and date.
- **How a critic checks:** Every number traced to facts in brand-dna.json or a supplied source.

### `copy-voice-flattening`

A consultant-style explanatory voice replacing the brand's own register (short and plain, ornate, playful, technical).

- **Why it reads as default:** The model's helpful-assistant voice is its average register.
- **Fine on purpose when:** The brand has no voice yet and the taste brief chose one.
- **How a critic checks:** Sentence length, we/you ratio and word choice against voice.stats and voice.samples.

## Ads

### `ads-one-look`

Every concept in a batch shares one look: the same layout, type treatment and colour block.

- **Why it reads as default:** The model varies wording, not art direction, unless the axes are named.
- **Fine on purpose when:** A deliberate test of copy only, with the look held constant on purpose.
- **How a critic checks:** Put the thumbnails side by side; if they differ only in words, flag it.

### `ads-hook-formula`

The same hook formula reused across variants: "POV:", "Stop scrolling", "3 reasons why", "I tried X so you don't have to".

- **Why it reads as default:** Hook formulas from creator advice are heavily represented in training data.
- **Fine on purpose when:** The client's own winning ads use the formula, with results.
- **How a critic checks:** First line of each variant; repeated structure across more than one in five is a flag.

### `ads-product-on-gradient`

The product cut out and floated on a soft gradient or a plain studio colour.

- **Why it reads as default:** It is the easiest product image to generate and needs no scene.
- **Fine on purpose when:** The brand's own ads use that look.
- **How a critic checks:** Background of each product image against the brand's house photo style.

### `ads-variants-by-surface`

Variants that differ only in colour, crop or wording instead of in idea, proof, offer or audience.

- **Why it reads as default:** Surface variation is cheap and looks like range.
- **Fine on purpose when:** A planned creative test of one surface variable.
- **How a critic checks:** Name the axis each variant changes. If every axis is colour, crop or wording, flag the batch.

## Audits

### `audit-fixed-checklist`

A fixed checklist score out of 100 with no diagnosis of why this account's or page's numbers moved.

- **Why it reads as default:** Checklists are easy to complete without understanding the business.
- **Fine on purpose when:** As a short hygiene pass after the specific diagnosis.
- **How a critic checks:** Does the top finding name a number from this account or page and a cause specific to it?

### `audit-redesign-instead-of-patch`

An audit that ends in 'rebuild the page' when its findings are each fixable on the live page.

- **Why it reads as default:** A new design feels like a bigger answer, and the model enjoys building.
- **Fine on purpose when:** The brand or business changed, the page hit a ceiling after tested patches, or traffic is too low to test.
- **How a critic checks:** Each finding mapped to one change on the live page, with evidence and a test.

### `audit-generic-advice`

"Add social proof", "Improve your call to action", "Make it mobile friendly" with no evidence from this page.

- **Why it reads as default:** Best-practice lists are the average answer to 'audit my page'.
- **Fine on purpose when:** Never without a screenshot, a number or a quote from this page.
- **How a critic checks:** Each recommendation cites what was seen, where, and at which screen size.

## Strategy and plans

### `strategy-template-frame`

A SWOT, 4P or three-option frame filled with statements that fit any business in the category.

- **Why it reads as default:** Frameworks give structure without needing facts.
- **Fine on purpose when:** The frame is filled with this business's numbers and named competitors.
- **How a critic checks:** Strike the business name. Could the plan belong to a competitor?

### `strategy-straw-options`

Three options where two are weak on purpose so the third wins.

- **Why it reads as default:** The model has already chosen and builds options to justify it.
- **Fine on purpose when:** Never. Each option should be one a sensible person might pick.
- **How a critic checks:** Write the strongest case for each losing option. If you cannot, the options are straw.
