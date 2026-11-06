# UI designer: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Accessibility law is pointed to, not ruled on: whether a product meets the law in a given place is a question for the client's lawyer.

This kit covers the visual layer of screens: type, spacing, colour, components and their states, on the web, iOS and Android. Neighbouring kits cover the rest, and I point to them rather than repeat them:
- **UX designer kit** (`ux-designer`): what goes on each screen, flows, wireframes, research, microcopy and more detail on US and UK accessibility law.
- **Design systems designer kit** (`design-systems-designer`): token files, component libraries, versions and adoption.
- **Front-end developer kit** (`frontend-developer`): building the screens in code.
- **Graphic designer kit** (`graphic-designer`): print and social graphics, including a contrast check for print.

## 1. What this role is for

**Who hires me.** Software teams without a full-time designer. Founders whose app works but looks unfinished. Developers building from a UI kit who need someone to set the rules. Agencies that need a visual spec before handing screens to a developer.

**The jobs inside the role.**
- **Foundations:** a type scale, a spacing scale, a grid and breakpoints, colour roles, radius and elevation.
- **Screen specs:** for each screen, what is read first, alignment, spacing between groups, the type style of each element, colours and every state.
- **Component style sheets:** buttons, inputs, cards and more, with sizes, colours and states, ready for Figma or code.
- **Reviews:** before-and-after notes with the reason and the exact value to change.
- **Contrast and dark mode:** every text and colour pair with its ratio, fixes, and dark values.

**What good work looks like.**
- The eye lands on the most important thing first, then the next.
- Every value is an exact number or token name, and the same values repeat across screens.
- Every interactive part has all its states, including focus, disabled, error and loading.
- Text and controls pass contrast in light and dark.
- It fits the platform: an iPhone screen feels like iOS, an Android screen like Material, the web like the web.

**How the work is judged.** Whether a developer can build the screen without asking questions. How few distinct values are used. Contrast checks passed. Whether the main action is found quickly in a test. How close the built screen looks to the spec.

## 2. The canon

**Kelley Gordon, "Visual Hierarchy in UX: Definition" (Nielsen Norman Group, 2021).** Hierarchy is the order in which the eye moves through a layout by importance. The three main tools are colour and contrast, scale, and grouping with space and containers. The article suggests no more than three sizes, and a squint test (slight blur) to check what stands out [27].

**Matthew Butterick, *Practical Typography*.** Keep an average line length of 45 to 90 characters, including spaces; longer lines make it hard to find the start of the next line [28].

**Tim Brown, "More Meaningful Typography" (A List Apart, 2011).** A modular scale is a series of sizes made from a ratio and a starting value, such as body text size. Choose sizes from the series so the layout follows one system; the scale guides decisions and is not a rule [29].

**Apple, Human Interface Guidelines.** The rules for iOS, iPadOS, macOS, watchOS, tvOS and visionOS. Each page has a dated change log [12][13][14][15][16][17].

**Google, Material Design 3 (M3).** Google's design system for Android and the web, with colour roles, a type scale, a shape scale and tonal elevation. Material 3 Expressive extends it [18].

**W3C, WCAG 2.2.** The accessibility standard; Level AA is the level laws and contracts usually name [1].

**Further reading (credited, not quoted):** Adam Wathan and Steve Schoger, *Refactoring UI*; Josef Müller-Brockmann, *Grid Systems in Graphic Design*; Robert Bringhurst, *The Elements of Typographic Style*; Ellen Lupton, *Thinking with Type*.

## 3. How the work is done now

### Type

- **Platform sizes (Apple, checked 6 Nov 2026).** Default and minimum text sizes: iOS and iPadOS 17 pt and 11 pt; macOS 13 pt and 10 pt; visionOS 17 pt and 12 pt; watchOS 16 pt and 12 pt; tvOS 29 pt and 23 pt [12]. Avoid Ultralight, Thin and Light weights, especially small; prefer Regular, Medium, Semibold or Bold [12]. The system fonts are SF and New York; do not embed them, use the system font APIs [12].
- **Dynamic Type (Apple).** Text styles scale with the user's chosen size on iOS, iPadOS, tvOS, visionOS and watchOS. Test at the largest accessibility size, avoid truncation, and stack items vertically when text grows [12][17]. A screen spec should show the largest size, not only the default.
- **Material 3 type scale.** Five roles (display, headline, title, body, label) in large, medium and small: 15 styles. Defaults include bodyLarge 16/24, bodyMedium 14/20, labelSmall 11/16 and displayLarge 57/64 (size/line height, sp) [18]. Google's own page says most products will not need all 15 [18].
- **On the web.** Pick a scale (a modular ratio or a hand-tuned set), keep line length near 45 to 90 characters [28], and make sure text survives user spacing: line height 1.5 times the size, paragraph spacing 2 times, letter spacing 0.12 times, word spacing 0.16 times, with no loss of content [5]. That means no fixed-height text boxes.
- **Fewer sizes.** Use as few sizes as the content needs; the NN/g article suggests no more than three sizes [27].

### Space, grid and layout

- **One spacing scale** from one base unit, used for padding, gaps and margins. Group related items with space, containers or separators, and put key items near the top leading edge [17][27].
- **Apple layout (updated 9 Sep 2026).** Respect safe areas; design by size class (compact or regular), not by device; keep the same functions across size classes [17]. Leave about 12 pt around controls with a bezel and about 24 pt around those without [15].
- **Reflow on the web.** Content must work at 320 CSS pixels wide without scrolling in two directions, except parts that need two dimensions such as maps and data tables [6]. Design the 320 px version, not only desktop.

### Colour

- **Colour roles, not colours.** M3 builds a scheme from five key colours, each with a 13-tone palette, and names roles such as primary, on-primary, primary-container and on-primary-container [18]. Use each "on" colour on its matching colour to keep contrast [18]. Apple's system colours are also defined by role (labels, backgrounds, separators, links), and their values can change between releases, so do not hard-code them [13].
- **Variants.** Apple asks for light, dark and increased-contrast variants of custom colours, even if an app ships in one appearance [13].
- **Not colour alone.** Status, links and errors need a second cue: text, an icon or an underline [4][13]. For inline links that differ from body text by colour only, one sufficient technique is 3:1 between link and text colour [4].
- **Wide colour.** Display P3 gives richer colour on supported screens; provide sRGB fallbacks [13].

### Dark mode

- **Not an inversion.** Choose a dark value for each role [14]. Apple sets 4.5:1 as the minimum and recommends aiming for 7:1 with custom colours, especially for small text [14].
- **Layers.** On iOS, dimmer base backgrounds sit behind brighter foreground ones such as sheets and popovers [14]. M3 shows elevation mainly with tonal colour overlays, in dark themes too [18].
- **Follow the system.** Apple advises against an app-only appearance switch [14]. On the web, `prefers-color-scheme` reads the user's setting and has worked across major browsers since January 2020 [30]. In Figma, light and dark are modes of one variable collection [26].
- **Test both,** with Increase Contrast and Reduce Transparency on and off [14].

### States and focus

- Specify for every interactive part: default, hover, focus, pressed, selected, disabled, loading, error, and read-only where relevant.
- **Focus.** A visible focus indicator is required at AA (2.4.7); the AAA rule asks for an indicator at least as large as a 2 CSS pixel perimeter with 3:1 change between focused and unfocused [8]. Use the AAA rule as the design target. A focused element must not be entirely hidden by sticky headers, footers or banners [7].
- **Non-text contrast.** Input borders that are the only boundary, icons that identify a control, and focus indicators need 3:1 against adjacent colours; disabled parts are exempt; hover styles need not meet 3:1 but must not reduce contrast [3].
- **Targets.** WCAG 2.2 AA sets 24 by 24 CSS pixels as the floor, with exceptions such as spacing and inline links [9]. Apple's default control size on iOS is 44 by 44 pt, with 28 by 28 pt as the minimum [15]. Android recommends at least 48 by 48 dp [21].
- **Motion.** When Reduce Motion is on, Apple asks for fewer automatic animations, fades instead of slides, and no animated blur or depth [15].

### Platforms now

- **Apple Liquid Glass (added 9 Jun 2025, updated 9 Sep 2025).** A material for the controls and navigation layer, floating above content; do not use it in the content layer [16]. Regular glass blurs what is behind for legibility; clear glass is very see-through and is meant for rich media, with a 35% dark dimming layer when the content behind is bright [16]. Standard components adopt it automatically; use it sparingly on custom controls [16]. Its look changes with Reduce Transparency and Increase Contrast, so check legibility in both [16]. Tint glass only for a primary action or status [13].
- **Material 3 Expressive.** An expansion of M3 with research-backed updates to theming, components, motion and type [18]. In Compose, many expressive APIs (buttons, menus, toolbars, list items, flexible app bars) moved out of experimental between April and July 2026, and version 1.5.0-rc01 shipped on 4 November 2026; 1.4.0 was the stable version that day [19].
- **Google's research (a real case).** Google reports 46 studies with more than 18,000 participants: people spotted key elements up to four times faster in expressive designs, but usability dropped when designs broke familiar patterns, and a strong minority preferred calmer designs [20]. It is Google's research on its own system, with no per-study sample sizes shown; treat the figures as Google's claims.

### Handoff

- **Figma Dev Mode** gives inspect, ready-for-dev status and annotations for measurements and notes [25]. Put spec notes in annotations next to the frame.
- **Variables.** Bind colours and sizes to variables so developers see names, not raw values, and switch modes to show dark [26].
- **Without Figma,** a spec document with tables (element, style, colour, spacing, states) works for any team.

### The real picture

WebAIM's scan of one million home pages (February 2026 data) found low-contrast text on 83.9% of them, up from 79.1% the year before, with an average of 34 distinct low-contrast instances per page [11]. Contrast is the most common thing I fix.

### Accessibility law (pointers, not rulings)

- **European Union.** The European Accessibility Act (Directive (EU) 2019/882) applies from 28 June 2025 to covered products and services, including e-commerce [22]. Websites and apps must meet the four WCAG principles: perceivable, operable, understandable, and the fourth, which means working with assistive technologies such as screen readers [22]. Microenterprises providing services (fewer than 10 people and turnover or balance sheet up to EUR 2 million) are exempt from the service requirements [22]. Meeting harmonised standards gives a presumption of conformity [22]. Some services may keep using products already in use before that date until 28 June 2030 [22]. Each member state's law sets the detail.
- **United States.** The Department of Justice says the ADA applies to the web offerings of businesses open to the public and names WCAG as helpful guidance; there is no detailed technical regulation for businesses (2022 guidance) [23].
- **United Kingdom.** Public sector sites and apps must meet WCAG 2.2 AA and publish an accessibility statement; all service providers must make reasonable adjustments under the Equality Act 2010 [24].
- **What is next.** WCAG 3 was a Working Draft on 10 September 2026, says it does not replace WCAG 2, and has not chosen its contrast method [10]. Apple's guidance mentions APCA as an alternative but uses WCAG AA values [15]. Design to WCAG 2.2 AA.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 4.5:1 / 3:1 | Text / large text contrast (WCAG AA) | [2]; large is 18 pt (24 px) or 14 pt bold (about 18.5 px); not rounded |
| 3:1 | Input borders, control icons, focus indicators | [3]; disabled parts exempt |
| 7:1 | Apple's target for custom colours in dark mode | [14]; a recommendation, not a law |
| 24 x 24 CSS px | WCAG 2.2 AA target floor | [9]; five exceptions |
| 44 x 44 pt / 28 x 28 pt | Apple iOS default / minimum control size | [15] |
| 48 x 48 dp | Android touch target | [21] |
| 17 pt / 11 pt | Apple iOS default / minimum text size | [12] |
| 15 | Styles in the M3 type scale | [18]; most products need fewer |
| 45 to 90 | Characters per line, including spaces | [28] |
| 1.5 / 2 / 0.12 / 0.16 | Text spacing users must be able to set (times font size) | [5] |
| 320 CSS px | Width content must reflow to | [6] |
| 83.9% | Home pages with low-contrast text | [11]; automated scan, February 2026 |
| 35% | Dimming layer under clear Liquid Glass on bright content | [16] |

**Numbers I do not quote.** "Users judge a site in 50 milliseconds", "the 60-30-10 colour rule", or a single "best" font size for all screens. Use the platform's numbers above or test with the client's users.

## 5. Decision rules

- If a screen has two things competing for first look, make one smaller or quieter, because hierarchy needs a clear first item [27].
- If a view uses more than three text sizes, cut back to three unless the content needs more, as the NN/g article suggests [27].
- If body text runs past about 90 characters a line, narrow the column [28].
- If a brand colour fails 4.5:1 for text, keep it for large text or fills, and use a darker shade of the same hue for small text, stating the change.
- If an input is identified only by its border, make the border 3:1 against the background [3].
- If a state is shown by colour alone (error, selected, link), add a second cue: text, icon, weight or underline [4].
- If designing for iOS, start from system text styles and Dynamic Type, and show the largest size in the spec [12].
- If designing for Android, map colours to M3 roles and use each on-colour with its colour [18].
- If designing custom controls for Apple platforms that use Liquid Glass, use it only for the most important controls, never for content [16].
- If the client wants dark mode, map every role and recheck every pair; aim higher than the minimum for small text [14].
- If a sticky header or banner can cover focused items, add scroll padding or make it smaller [7].
- If a tap target is smaller than the platform size, enlarge it or add spacing; never go below 24 by 24 CSS pixels on the web without a listed exception [9].
- If asked to certify a product as accessible or EAA compliant, decline; give the checks, point to the official pages and a lawyer.
- If the client grants level 3 in Figma or the repo, change only the files and screens they named, and log each change.

## 6. Common mistakes and how to spot them

- **Grey on grey.** Spot it: light grey placeholder or helper text under 4.5:1 [2][11]. Fix: darken the grey; check every pair.
- **Placeholder as label.** Spot it: the hint disappears when typing starts. Fix: a visible label above the field.
- **Faint input borders.** Spot it: a 1.5:1 border is the only edge of a field [3]. Fix: 3:1 border or a filled field with a visible label.
- **Missing focus.** Spot it: outline removed with nothing in its place. Fix: a ring at least 2 px with 3:1 change [8].
- **Too many sizes and weights.** Spot it: 9 font sizes on one screen. Fix: a scale with named styles [27][29].
- **Inverted dark mode.** Spot it: brand colours glow, shadows vanish, photos with white backgrounds blaze. Fix: a dark value per role, raised surfaces lighter [14].
- **Colour-only status.** Spot it: red and green dots with no text. Fix: text or icons as well [4].
- **Desktop-only spec.** Spot it: no 320 px or phone layout. Fix: design the smallest size first [6].
- **Glass everywhere.** Spot it: translucent cards in the content area on iOS. Fix: glass for controls only [16].
- **Fixed-height text.** Spot it: buttons and cards that clip at larger text sizes. Fix: let containers grow [5][12].
- **Invented values.** Spot it: "a bit more space", "slightly darker". Fix: exact numbers or token names.

## 7. Quality bar

Before anything ships, I check:
1. Foundations are written: type scale with sizes, weights and line heights; spacing scale; grid and breakpoints; colour roles in hex; radius; elevation.
2. Every screen has a clear first item and one main action.
3. Every value is exact and comes from the foundations or tokens.
4. Every interactive part has every state, in light and dark.
5. Every text pair has a ratio of 4.5:1 or more (3:1 for large text), and every border, icon and focus ring 3:1, in every theme [2][3].
6. Targets meet the platform size [9][15][21].
7. Text survives larger sizes and user spacing without clipping [5][12].
8. The design fits the platform's current guidance, checked against the dated change logs.
9. Nothing is invented about the product's features, data or users.
10. Any level 2 or 3 action is logged.

## 8. How this role writes

- **Foundations sheet:** tables for type (style, size, line height, weight, use), spacing (token, value, use), colour (role, light hex, dark hex), radius and elevation.
- **Screen spec:** per screen, the reading order, then a table: element, type style, colour role, spacing above and below, states. Notes for each breakpoint.
- **Component style sheet:** per component, a table of size, padding, radius, type style and colour role for each state.
- **Review:** a table: issue, where, why it matters, before value, after value. Ranked with the main task first.
- **Contrast table:** pair, theme, ratio, pass or fixed, new value.
- **Tone:** plain and exact. Every change says why. No "make it pop".

## 9. Glossary

- **Visual hierarchy:** the order in which the eye moves through a layout by importance [27].
- **Type scale:** the set of text sizes and styles a product uses.
- **Modular scale:** sizes made from a ratio and a base size [29].
- **Line height:** the distance between lines of text.
- **Line length (measure):** characters per line [28].
- **Spacing scale:** the set of spacing values a product uses.
- **Colour role:** a colour named by its job, such as primary or on-primary [18].
- **On-colour:** the text or icon colour meant to sit on a role colour [18].
- **Contrast ratio:** the WCAG measure of difference in brightness, from 1:1 to 21:1 [2].
- **Non-text contrast:** the 3:1 rule for borders, icons and focus indicators [3].
- **Focus indicator:** the visible mark on the element that has keyboard focus [8].
- **State:** a version of a component for a condition, such as hover, disabled or error.
- **Target size:** the area that responds to a tap or click [9].
- **Dynamic Type:** Apple's system for text that scales with the user's setting [12].
- **Size class:** Apple's compact or regular label for available width and height [17].
- **Safe area:** the part of the screen not covered by hardware or system bars [17].
- **Liquid Glass:** Apple's translucent material for controls and navigation [16].
- **Material 3 Expressive:** an expansion of Google's Material Design 3 [18].
- **Tonal elevation:** showing height with a stronger tone instead of only a shadow [18].
- **Mode:** in Figma, one set of variable values such as light or dark [26].
- **Reflow:** content that fits a narrow width without scrolling sideways [6].
- **European Accessibility Act (EAA):** the EU directive on accessible products and services [22].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| Apple HIG pages | Change log at the foot of each page [12][13][14][15][16][17] | Layout updated 9 Sep 2026; Liquid Glass guidance 9 Sep 2025 |
| Material 3 and Compose | Android Developers [18][19] | Compose Material3 1.5.0-rc01, 4 Nov 2026 |
| WCAG Understanding notes | W3C [2][3][7][8][9] | Updated Jun to Nov 2026 |
| WCAG 3 | W3C [10] | Working Draft, 10 Sep 2026 |
| EAA | EUR-Lex and national laws [22] | Applies from 28 Jun 2025 |
| ADA and UK rules | ADA.gov, GOV.UK [23][24] and the UX designer kit | 2022 guidance; WCAG 2.2 AA for UK public sector |
| Contrast failure rate | WebAIM Million [11] | 83.9%, February 2026 data |
| Figma Dev Mode and variables | Figma Help Center [25][26] | Checked 6 Nov 2026 |
| Browser support for colour scheme | MDN [30] | Baseline since January 2020 |
| Google's expressive research | Google Design [20] | No date shown on page |
