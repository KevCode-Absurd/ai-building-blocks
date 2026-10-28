---
name: hig-foundations
description: Apple Human Interface Guidelines design foundations.
risk: none
source: community
date_added: '2026-02-27'
---

# Apple HIG: Design Foundations

Check for `.claude/apple-design-context.md` before asking questions. If it does not exist (for example in a web chat), ask the user to paste their design notes. Use existing context and only ask for information not already covered.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A design file** (yours): a design in a design tool, such as a Figma file, with its parts and styles.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a design file. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Key Principles

1. **Prioritize content over chrome.** Reduce visual clutter. Use system-provided materials and subtle separators rather than heavy borders and backgrounds.

2. **Build in accessibility from the start.** Design for VoiceOver, Dynamic Type, Reduce Motion, Increase Contrast, and Switch Control from day one. Every interactive element needs an accessible label.

3. **Use system colors and materials.** System colors adapt to light/dark mode, increased contrast, and vibrancy. Prefer semantic colors (`label`, `secondaryLabel`, `systemBackground`) over hard-coded values.

4. **Use platform fonts and icons.** SF Pro, SF Compact, SF Mono by default. New York for serif. Follow the type hierarchy at recommended sizes. Use SF Symbols for iconography.

5. **Match platform conventions.** Align look and behavior with system standards. Provide direct, responsive manipulation and clear feedback for every action.

6. **Respect privacy.** Request permissions only when needed, explain why clearly, provide value before asking for data. Design for minimal data collection.

7. **Support internationalization.** Accommodate text expansion, right-to-left scripts, and varying date/number formats. Use Auto Layout for dynamic content sizing.

8. **Use motion purposefully.** Animation should communicate meaning and spatial relationships. Honor Reduce Motion by providing crossfade alternatives.

## Reference Index

| Reference | Topic | Key content |
|---|---|---|
| [accessibility.md](references/accessibility.md) | Accessibility | VoiceOver, Dynamic Type, color contrast, motor accessibility, Switch Control, audio descriptions |
| [app-icons.md](references/app-icons.md) | App Icons | Icon grid, platform-specific sizes, single focal point, no transparency |
| [branding.md](references/branding.md) | Branding | Integrating brand identity within Apple's design language, subtle branding, custom tints |
| [color.md](references/color.md) | Color | System colors, Dynamic Colors, semantic colors, custom palettes, contrast ratios |
| [dark-mode.md](references/dark-mode.md) | Dark Mode | Elevated surfaces, semantic colors, adapted palettes, vibrancy, testing in both modes |
| [icons.md](references/icons.md) | Icons | Glyph icons, SF Symbols integration, custom icon design, icon weights, optical alignment |
| [images.md](references/images.md) | Images | Image resolution, @2x/@3x assets, vector assets, image accessibility |
| [immersive-experiences.md](references/immersive-experiences.md) | Immersive Experiences | AR/VR design, spatial immersion, comfort zones, progressive immersion levels |
| [inclusion.md](references/inclusion.md) | Inclusion | Diverse representation, non-gendered language, cultural sensitivity, inclusive defaults |
| [layout.md](references/layout.md) | Layout | Margins, spacing, alignment, safe areas, adaptive layouts, readable content guides |
| [materials.md](references/materials.md) | Materials | Vibrancy, blur, translucency, system materials, material thickness |
| [motion.md](references/motion.md) | Motion | Animation curves, transitions, continuity, Reduce Motion support, physics-based motion |
| [privacy.md](references/privacy.md) | Privacy | Permission requests, usage descriptions, privacy nutrition labels, minimal data collection |
| [right-to-left.md](references/right-to-left.md) | Right-to-Left | RTL layout mirroring, bidirectional text, icons that flip, exceptions |
| [sf-symbols.md](references/sf-symbols.md) | SF Symbols | Symbol categories, rendering modes, variable color, custom symbols, weight matching |
| [spatial-layout.md](references/spatial-layout.md) | Spatial Layout | visionOS window placement, depth, ergonomic zones, Z-axis design |
| [typography.md](references/typography.md) | Typography | SF Pro, Dynamic Type sizes, text styles, custom fonts, font weight hierarchy, line spacing |
| [writing.md](references/writing.md) | Writing | UI copy guidelines, tone, capitalization rules, error messages, button labels, conciseness |

## Applying Foundations Together

Consider how principles interact:

1. **Color + Dark Mode + Accessibility** -- Custom palettes must work in both modes while maintaining WCAG contrast ratios. Start with system semantic colors.

2. **Typography + Accessibility + Layout** -- Dynamic Type must scale without breaking layouts. Use text styles and Auto Layout for the full range of type sizes.

3. **Icons + Branding + SF Symbols** -- Custom icons should match SF Symbols weight and optical sizing. Brand elements should integrate without overriding system conventions.

4. **Motion + Accessibility + Feedback** -- Every animation must have a Reduce Motion alternative. Motion should reinforce spatial relationships, not decorate.

5. **Privacy + Writing + Onboarding** -- Permission requests need clear, specific usage descriptions. Time them to when the user will understand the benefit.

## Steps

1. Read the design notes (see the first line of this file) and ask only for what is missing.
2. Collect the design (screenshots or a description), the target device and system, and the app's purpose.
3. Check each screen against the Key Principles above, using the Reference Index files that were provided.
4. Write each finding using the Output Format below, in a table.
5. Order the fixes: accessibility and privacy first, then colour, type and icons, then polish.

## Output Format

If the reference files were not provided, say each finding comes from general knowledge and not from a cited file.

1. **Cite the specific HIG foundation** with file and section.
2. **Note platform differences** for the user's target platforms.
3. **Provide concrete code patterns** (SwiftUI/UIKit/AppKit).
4. **Explain accessibility impact** (contrast ratios, Dynamic Type scaling, VoiceOver behavior).

Put the findings in a table with these columns: screen, principle, finding, fix and accessibility impact.

## Questions to Ask

1. Which platforms are you targeting?
2. Do you have existing brand guidelines?
3. What accessibility level are you targeting? (WCAG AA, AAA, Apple baseline?)
4. System colors or custom?

## What next

After the fixes, run the accessibility checker on the updated design, then the App Store listing optimiser before you submit.

---

*Built by [Raintree Technology](https://raintree.technology) · [More developer tools](https://raintree.technology)*

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Web accessibility checker](https://useaiblocks.com/skills/accessibility-checker).
- **Check the landing page** with the [App store listing optimiser](https://useaiblocks.com/skills/app-store-listing-optimiser).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations
- Not for Android or web designs.
- This is not proof of accessibility or App Store approval. Test on a real device.
- Stop and ask if the design, target device or app purpose is missing.
