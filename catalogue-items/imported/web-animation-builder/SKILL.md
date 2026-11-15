---
name: animejs-animation
description: Advanced JavaScript animation library skill for creating complex, high-performance web animations.
risk: safe
source: community
date_added: "2026-03-07"
---

# Anime.js Animation Skill

[Anime.js](https://animejs.com/) is a lightweight but extremely powerful JavaScript animation engine. It excels at complex timelines, staggering, and precise control over DOM, CSS, and SVGs.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Context

This skill is used for creating high-fidelity, jaw-dropping web animations that go far beyond simple CSS transitions. It's the tool of choice for awards-caliber interactive sites.

## When to Use
Trigger this skill when:

- Creating complex, multi-stage landing page orchestrations.
- Implementing staggered animations for revealing grids, text, or data visualizations.
- Animating SVG paths (morphing shapes, drawing dynamic lines).
- Building highly interactive, kinetic UI elements that respond fluidly to user input.

## Execution Workflow

1. **Identify Targets**: Select the DOM elements or SVGs to be animated.
2. **Define Properties & Easing**: Specify values to animate. **Crucially**, utilize advanced easing functions (e.g., custom `cubicBezier`, `spring`, or `elastic`) instead of basic `linear` or `ease-in-out` to make the motion feel expensive and natural.
3. **Orchestrate Timelines**: Check the installed major version first, before you write any code (look at `package.json` or the script tag, or ask the user). If it is v3, use `anime.timeline()` and the v3 snippet below. If it is v4, use `createTimeline()` and the v4 snippet below. If the user does not know or has nothing installed, ask which they want to install, and do not mix the two. Master the use of timeline offsets (relative `'-=200'` vs absolute) to create seamless overlapping motion.
4. **Implement**:
   For a bundler with Anime.js v3 installed, `import anime from "animejs";` supplies the `anime` binding. The selectors must exist in the rendered DOM.

   ```javascript
   const tl = anime.timeline({
     easing: "spring(1, 80, 10, 0)",
     duration: 1000,
   });
   tl.add({
     targets: ".hero-text",
     translateY: [50, 0],
     opacity: [0, 1],
     delay: anime.stagger(100),
   }).add(
     { targets: ".hero-image", scale: [0.9, 1], opacity: [0, 1] },
     "-=800",
   );
   ```

   For Anime.js v4 (imports are named, targets move into `add()`, and `translateY` becomes `y`), the same idea looks like this. Check the names against the official docs for the installed version before you ship it:

   ```javascript
   import { createTimeline, stagger } from "animejs";

   const tl = createTimeline({ defaults: { duration: 1000, ease: "out(3)" } });
   tl.add(".hero-text", { y: [50, 0], opacity: [0, 1], delay: stagger(100) })
     .add(".hero-image", { scale: [0.9, 1], opacity: [0, 1] }, "-=800");
   ```

## Motion and Compatibility

- **Scope**: Use motion when it serves the product brief and user task. Respect the existing design system; simple transitions and static states are valid choices.
- **Staggering**: Leverage `anime.stagger()` extensively to add organic rhythm to multiple elements.
- **Performance**: Monitor main thread usage; use `will-change: transform, opacity` where appropriate for GPU acceleration.

## Example

**User request:**

> My landing page has a headline, a subline and a hero image. Make the headline and subline slide up one after the other, then fade in the image. I use Anime.js v3.

**What a finished result looks like:**

- The version used (v3) and the selectors the HTML must have (`.hero-text`, `.hero-image`).
- One timeline with the order, easing, stagger and offsets.
- A reduced-motion fallback that shows the final state with no movement.
- Short notes on where to put the code and how to test it in a browser.

## Limitations
- The code above uses the v3 API. Anime.js v4 uses imported `createTimeline()` and a different target/parameter signature; do not mix major-version examples. Consult [official timeline documentation](https://animejs.com/documentation/timeline/) for the installed version.
- Respect `prefers-reduced-motion`: provide a static final state, avoid scroll hijacking, and keep focus/keyboard interactions immediately usable. Dispose animations when their component unmounts.
- `will-change` is a temporary optimization hint, not a guarantee of GPU acceleration; measure real frames and avoid leaving it on every element.
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Accessible UI builder](https://useaiblocks.com/skills/accessible-ui-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
