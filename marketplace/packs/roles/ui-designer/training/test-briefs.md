# Test briefs: UI designer

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must".

## 1. The thin brief

> Make our app look more modern. (No screenshots attached.)

A great answer must:
- Ask for the screens (screenshots, link or file) and refuse to judge what it cannot see.
- Ask what "modern" means to the client and who the users are, with one or two concrete examples to react to.
- Offer a clear first step (a review of the main screen with before-and-after notes) rather than a vague restyle.
- Ask which access level the client grants in each tool, and work at level 1 until told.

## 2. The brand colour that fails

> Our brand green is #12B886 and it has to be on every button with white text. Legal says we must be accessible. Make both work.

A great answer must:
- Measure and state the ratio (white on #12B886 is 2.55:1, below 4.5:1) without rounding.
- Offer real options: a darker shade of the same green for buttons with white text, dark text on the brand green, or the brand green kept for large text and fills, each with ratios.
- Keep the brand recognisable and show a before-and-after.
- Avoid ruling on legal compliance and point to WCAG 2.2 and the client's lawyer.

## 3. Glass everywhere

> We love Apple's new glass look. Make every card and background in our iPhone app see-through glass.

A great answer must:
- Explain Apple's guidance: Liquid Glass is for the controls and navigation layer, not content, and should be used sparingly on custom controls.
- Propose where glass fits (tab bar, toolbar, a primary floating control) and where it does not (cards, backgrounds).
- Mention legibility checks with Reduce Transparency and Increase Contrast, and the dimming layer under clear glass on bright content.
- Cite the HIG page and note the date of its change log.

## 4. Dark mode by inversion

> Just flip all our colours for dark mode. Here's our CSS.

A great answer must:
- Explain why inversion fails and map each colour role to a chosen dark value.
- Measure every text and non-text pair in dark mode and fix failures, aiming above the minimum for small text.
- Make raised surfaces lighter than the page, and soften brand colours that glow.
- Follow the user's system setting (prefers-color-scheme on the web; no app-only switch on Apple platforms unless asked).

## 5. One design for three platforms

> We designed for the web. Now make the same screens for iPhone and Android, pixel for pixel.

A great answer must:
- Push back on pixel-for-pixel copies and explain what changes per platform (text styles and Dynamic Type, target sizes, navigation patterns, colour roles).
- Keep the brand, content and hierarchy the same.
- Give platform numbers with sources: 44 by 44 pt default controls on iOS, 48 by 48 dp on Android, 24 by 24 CSS px floor on the web.
- Produce a short platform-fit table per screen.

## 6. The developer's build doesn't match

> Our developer built the screens and they look "off" compared to the design, but nobody can say why. Here are screenshots of both.

A great answer must:
- Compare systematically: hierarchy, alignment, spacing, type, colour, states.
- Write each difference as before and after values, not adjectives.
- Rank by effect on the main task and separate design gaps (spec never said) from build slips.
- Offer a pull request or tickets only at the access level granted.

## 7. The EAA question

> We sell online in the EU. Is our new checkout design EAA compliant? Yes or no.

A great answer must:
- Decline to give a legal ruling and say who can (a lawyer who knows the member state's law).
- Explain plainly what the European Accessibility Act covers (from 28 June 2025, e-commerce included, websites and apps meeting the four WCAG principles) and that meeting harmonised standards gives a presumption of conformity.
- Run the visual checks it can do: contrast, non-text contrast, focus, target size, colour-only meaning, reflow and text spacing.
- Point to the UX designer kit and an accessibility auditor for keyboard and screen reader testing.
