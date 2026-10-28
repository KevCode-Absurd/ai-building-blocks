---
name: design-dna
description: >-
  Extract, define, and apply design DNA across three dimensions: design system
  (tokens), design style (qualitative feel), and visual effects (Canvas, WebGL,
  3D, particles, shaders, scroll effects, etc.). Use this skill when: (1) a user
  wants to see the full 3-dimension design structure/schema, (2) a user provides
  images, screenshots, or URLs of reference designs and wants them analyzed into
  a structured JSON profile covering all three dimensions, (3) a user has a
  Design DNA JSON and content and wants a design generated from it, or (4) any
  combination of these phases. Triggers on "design DNA", "extract design style",
  "analyze design", "design tokens from reference", "generate design from JSON",
  "design system from screenshot", "design profile", "style guide JSON",
  "visual effects analysis", "design with effects", "3d design analysis".
---

# Design DNA

**What you need.** The whole skill folder (this file, `references/` and `scripts/`), not this file alone. Exact colour measurement from screenshot files needs Node.js and an AI that can run code. Without them, say plainly that colours are estimated by eye and may be off. Do not use estimated colours where an exact brand colour matters.

A 3-phase workflow for extracting, structuring, and applying design identity across three dimensions:

1. **Design System** — measurable tokens (color, typography, spacing, layout, shape, elevation, motion, components)
2. **Design Style** — qualitative perception (mood, visual language, composition, imagery, interaction feel, brand voice)
3. **Visual Effects** — special rendering (Canvas, WebGL, 3D, particles, shaders, scroll effects, cursor effects, SVG animations, glassmorphism, etc.)

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **An image** (yours): a finished picture.

**Makes it better (optional):**
- **Your website** (yours): the link to your site or the page.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for an image, your website. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Phases

### Phase 1: Structure — Output the Schema

When the user asks for the structural dimensions or schema:

1. Read [references/schema.md](references/schema.md)
2. Present the full schema with field descriptions
3. Explain the three dimensions and their roles:
   - **design_system**: What you can measure — exact hex values, pixel sizes, rem scales
   - **design_style**: What you can feel — mood, personality, composition strategy
   - **visual_effects**: What you can see but can't express in CSS alone — WebGL scenes, particle systems, shader distortions, scroll-driven animations
4. Ask if the user wants to customize or extend any dimensions

### Phase 2: Analyze — Extract DNA from References

When the user provides images, screenshots, or links representing a target design style:

1. Read [references/schema.md](references/schema.md) for the full field list
2. For each reference provided:
   - If image/screenshot: **first run the deterministic color measurement** (see below), then analyze the remaining visual properties directly
   - If URL: fetch and analyze the page's visual design. Colors from a URL alone are visual estimates, not measured values, so say so in the output and tell the user not to use them where exact brand colours matter. Look at the page only to describe its style. Do not copy its assets.
3. For every field in the schema, extract or infer a value from the references
4. When multiple references conflict, note the dominant pattern and mention variants
5. Output a complete Design DNA JSON — every field populated, no empty strings
6. After output, ask: "Want to adjust any values before using this for generation?"

**Analysis approach per dimension:**

#### Dimension 1: design_system
- **color**: Do not estimate hex values by eye — perceived colors drift toward familiar palette defaults (often by a ΔE of 10+). When the reference is an image file, measure instead. Resolve `SKILL_ROOT` to the absolute directory containing this `SKILL.md`; never assume the current project directory contains the skill's `scripts/` folder. Use absolute paths for the reference and output, and keep one uniquely named measurement file per reference:
  ```bash
  npm install --prefix "$SKILL_ROOT/scripts" --silent
  node "$SKILL_ROOT/scripts/measure-colors.mjs" "$REFERENCE_IMAGE" > "$MEASUREMENT_JSON"
  ```
  Use the measured hexes verbatim in the DNA JSON: map the `background` role to `surface.background`; map `text` to the end of `neutral.scale` that contrasts with the measured background and document that foreground use in `neutral.usage`; and map `accent` to `accent.hex`. Keep both the measured palette and its `measurement` configuration in `design_system.color.measured_palette` and `design_system.color.measurement` so verification can reuse the same clustering configuration. Coverage values are fractions from `0` to `1`. Only fall back to visual sampling when measurement is impossible (for example, a URL-only reference that cannot be screenshotted). Choose primary and secondary colors by semantic role, use accent for CTA emphasis, and order the neutral scale from lightest to darkest regardless of theme.
- **typography**: Identify font families by visual characteristics (geometric, humanist, serif class). Estimate scale ratios from heading/body size relationships.
- **spacing**: Assess density by element proximity. Measure rhythm by section gap consistency.
- **layout**: Identify grid by content alignment patterns. Note max-width, column count, asymmetry.
- **shape**: Measure border-radius by comparing to element height. Note border and divider presence.
- **elevation**: Classify shadow softness, spread, and layering approach.
- **motion**: If observable (video/interactive), note easing curves and duration feel.

#### Dimension 2: design_style
- Synthesize holistic impressions — mood, personality, composition strategy
- Compare against genre archetypes (SaaS, editorial, brutalist, etc.)
- Note ornamentation level and whitespace philosophy

#### Dimension 3: visual_effects
- **From code**: Scan for `<canvas>`, WebGL contexts, Three.js/Pixi.js imports, GSAP/Lottie usage, custom shaders, IntersectionObserver scroll triggers, SVG `<animate>` elements
- **From screenshots**: Describe visible effects that go beyond standard CSS — glowing particles, 3D object renders, noise textures, gradient animations, parallax depth, cursor trails, text distortions, glassmorphic surfaces. Note these in `composite_notes` when exact implementation can't be determined.
- **From video/interaction demos**: Note scroll behaviors, hover distortions, transition choreography, loading sequences
- Set `enabled: false` for any effect category not present in the reference
- Rate `overview.effect_intensity` and `overview.performance_tier` based on what's observed

### Phase 3: Generate — Apply DNA to Content

When the user provides DNA JSON + content to design:

1. Read [references/generation-guide.md](references/generation-guide.md)
2. Parse the DNA JSON and extract all tokens across three dimensions
3. Build CSS custom properties from `design_system` values
4. Apply `design_style` qualitative fields to guide subjective design decisions
5. When the design needs assets or source materials, fetch them from the original source whenever possible. If the user provided a URL, retrieve the real asset from that URL instead of recreating, approximating, or substituting it. Only do this for assets the user owns or has the right to use, and remind the user to check the licence of anything fetched before they reuse it. Never fetch or reuse another company's logos, photos, text or other assets; recreate the look from the profile instead.
6. Implement `visual_effects` using appropriate technologies:
   - Lightweight effects → CSS animations, SVG, vanilla JS
   - Medium effects → Canvas 2D, GSAP, Lottie
   - Heavy effects → Three.js, custom GLSL shaders, Pixi.js
7. Generate the design output (default: self-contained HTML with inline CSS/JS)
8. Run quality checks from the generation guide
9. **Verify (when the DNA contains a measured palette)**: save the current Design DNA JSON if it is not already a file, screenshot the generated output, then score it against that DNA file. Resolve `SKILL_ROOT` from this `SKILL.md` and use absolute paths; do not assume a temporary file named `measured-colors.json` exists:
   ```bash
   node "$SKILL_ROOT/scripts/verify.mjs" "$IMPLEMENTATION_SCREENSHOT" "$DESIGN_DNA_JSON"
   ```
   A standalone measurement JSON may be used instead of the DNA file when that is the only persisted artifact. For multiple image references, verify against each reference's measurement separately. The report gives per-color ΔE and coverage drift with PASS/FAIL thresholds. If it fails, fix the offending colors and re-verify instead of asking the user to judge fidelity by eye.

**If the user provides only content without DNA JSON**, ask whether to:
- Analyze a reference first (go to Phase 2)
- Use a described style (extract DNA from description, then generate)

## Phase Combinations

Users may invoke any combination:
- **Phase 1 only**: "Show me the design structure/schema"
- **Phase 2 only**: "Analyze this design" (with images/links)
- **Phase 2 → 3**: "Analyze this design and build me a landing page in the same style"
- **Phase 1 → 2 → 3**: Full pipeline
- **Phase 3 only**: User already has DNA JSON

Detect which phase(s) are needed from context and execute accordingly.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Colour contrast checker](https://useaiblocks.com/skills/colour-contrast-checker). It takes the design direction.
- The [Page typography and layout planner](https://useaiblocks.com/skills/page-grid-and-type-planner). It takes the design direction.
- The [Logo strength tester](https://useaiblocks.com/skills/logo-strength-tester). It takes the design direction.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
