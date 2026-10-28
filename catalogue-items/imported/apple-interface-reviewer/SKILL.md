---
name: apple-hig-expert
description: "Audits and designs iOS/macOS/watchOS/visionOS interfaces against the Apple Human Interface Guidelines, including the Liquid Glass design language (announced WWDC25, shipped with iOS 26/macOS Tahoe, Sept 2025). Use when reviewing an Apple-platform mockup or app for HIG compliance, checking contrast or tap-target sizes, or designing native-feeling Apple UI (e.g., 'audit my iOS app against the HIG', 'is this text readable on Liquid Glass?')."
license: MIT
metadata:
  version: 1.1.0
  author: Alireza Rezvani
  category: design
  updated: 2026-06-11
---

# Apple HIG Expert

Design and audit apps against the Apple Human Interface Guidelines (HIG, [developer.apple.com/design/human-interface-guidelines](https://developer.apple.com/design/human-interface-guidelines)), including the **Liquid Glass** design language. HIG content evolves with each OS release — when a claim matters, verify against the live HIG pages cited in `references/`.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A design file** (yours): a design in a design tool, such as a Figma file, with its parts and styles.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a design file. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When not to use

- Web pages or Android apps. Apple's rules do not apply there.
- Reusable colour and spacing tokens. Use the design system auditor or design system file writer.
- Real user research or personas. Talk to real users.

## Before Starting

If `product-context.md` or `ios-design-context.md` exists, read it before asking questions. Then gather:

1. **Platform target**: iOS, macOS, watchOS, or visionOS?
2. **Current state**: new design or auditing an existing mockup/code?
3. **App category**: utility, productivity, game, social, etc.

## Modes

- **Mode 1 — Design from scratch**: pick the platform navigation paradigm and layout primitives first (see `references/platform-specifics.md`), then apply typography and semantic color (`references/visual-design.md`).
- **Mode 2 — HIG audit**: fill in `templates/hig-audit-template.md`, run `scripts/hig_checker.py` on every measurable element, and deliver a scored report (see Worked example below).

## The Compliance Tool

`scripts/hig_checker.py` (stdlib-only) has three subcommands:

```bash
# 1. Contrast ratio (WCAG formula; pass >= 4.5:1 for text up to 17 pt,
#    >= 3:1 with --large for text 18 pt and up, or bold)
python3 scripts/hig_checker.py contrast "#8E8E93" "#FFFFFF"
# -> Contrast Ratio: 3.26 [FAILED] (minimum 4.5:1)

# 2. Tap-target size against the platform's sizes (--platform is required)
python3 scripts/hig_checker.py target 32 32 --platform ios
# -> Tap Target: 32x32 pt on ios is under the recommended 44x44 pt (minimum 28x28 pt) [BELOW_RECOMMENDED]

# 3. Batch audit from JSON -> scorecard (starts at 100, -10 per violation)
python3 scripts/hig_checker.py batch audit.json
```

Control sizes come from the HIG Accessibility page (Mobility), in points, as recommended default / minimum: iOS and iPadOS 44x44 / 28x28, macOS 28x28 / 20x20, tvOS 66x66 / 56x56, visionOS 60x60 / 28x28, watchOS 44x44 / 28x28. Below the minimum is `FAILED`; between the minimum and the recommended size is `BELOW_RECOMMENDED`. Both count as violations. Source: https://developer.apple.com/design/human-interface-guidelines/accessibility

Bad input never passes. An invalid colour, a missing or unknown platform, or a size that is not a positive number is an error (exit code 2). A batch with any error returns `"score": null` and `"complete": false`; fix the input and run it again rather than reporting a score.

Batch input shape:

```json
{
  "platform": "ios",
  "checks": [
    {"type": "contrast", "name": "caption-on-card", "fg": "#8E8E93", "bg": "#FFFFFF"},
    {"type": "contrast", "name": "large-title", "fg": "#8E8E93", "bg": "#FFFFFF", "large": true},
    {"type": "target", "name": "close-button", "w": 32, "h": 32}
  ]
}
```

`platform` at the top applies to every target check; a check can set its own `platform`. `large: true` marks text 18 pt and larger, or bold.

**Scorecard rubric:** the batch score starts at 100 and subtracts 10 per failed check (and is not given at all if any check has invalid input); violations are listed by element name. 90-100 = ship, 70-80 = fix before release, below 70 = systematic rework. Checks the tool cannot measure (VoiceOver labels, Dynamic Type behavior, Reduce Transparency) are assessed manually via the audit template and tagged with confidence.

## Worked example: iOS settings-screen audit

**Input:** mockup with body text `#1C1C1E` and captions `#8E8E93` on white cards, a 32x32 pt close button, and a 343x50 pt primary CTA.

**Run:**

```bash
python3 scripts/hig_checker.py batch audit.json
```

**Output (real):**

```json
{
  "score": 80,
  "complete": true,
  "violations": [
    "Contrast 3.26 fails 4.5:1 for caption-on-card",
    "Target 32x32 pt on ios is under the recommended 44x44 pt (minimum 28x28 pt) for close-button"
  ],
  "errors": []
}
```

(`large-title` passes: 3.26 meets the 3:1 minimum for large text.)

**Findings → fixes (bottom line first):**

> **HIG score 80/100 — two fixes before release.**
> 1. Captions fail contrast (3.26 < 4.5). Use `.secondaryLabel` (semantic color) instead of hardcoded `#8E8E93`, or darken to ≥ `#6E6E73` on white. 🟢 verified by tool.
> 2. Close button is 32x32 pt (under the 44x44 pt recommended size for iOS). Keep the glyph small but expand the hit region to 44x44 with padding/`contentShape`. 🟢 verified by tool.
> 3. Manual check: the card uses an ultra-thin material over a photo background — re-test caption contrast against the *busiest* underlying region and with Reduce Transparency on. 🟡 needs device test.

## Core Design Principles

1. **Liquid Glass** — translucent material hierarchy (announced at WWDC25, June 2025; shipped Sept 2025 across iOS 26, iPadOS 26, macOS Tahoe, watchOS 26, tvOS 26, visionOS 26). In SwiftUI, apply it via the `glassEffect` view modifier; keep hierarchy between content and controls. See `references/visual-design.md`.
2. **Accessibility first** — VoiceOver labels on every element, the platform's recommended control size (44x44 pt on iOS, iPadOS and watchOS; 28x28 pt on macOS; 60x60 pt on visionOS; 66x66 pt on tvOS), 4.5:1 contrast for normal text (3:1 large text), Dynamic Type support. See `references/accessibility.md`.
3. **Platform ergonomics** — tab bars/thumb reach on iOS, sidebars + menu bar + shortcuts on macOS, ornaments + gaze states on visionOS, glanceable vertical layouts on watchOS. See `references/platform-specifics.md`.

## Proactive Triggers

Surface these WITHOUT being asked: low contrast over translucent layers; interactive elements under the platform's recommended control size; icon buttons with no accessibility label; density overload (no breathing room between glass layers).

## Communication

- **Bottom line first** — compliance status before details.
- **What + Why + How** — "Expand the hit region (What) because 32 pt targets are under the 44 pt iOS recommended size (Why); pad to 44x44 via contentShape (How)."
- **Confidence tagging** — 🟢 tool-verified / 🟡 needs device test / 🔴 assumed.

## What next

Hand the fix list to a developer. After the fixes, run the batch check again, then test any glass surfaces on a real device with Reduce Transparency on.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product-specific interface designer](https://useaiblocks.com/skills/product-true-ui-designer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
