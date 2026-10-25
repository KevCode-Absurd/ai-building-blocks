# When to use `/ad-design-levers`

**What it does:** Configures the 8 visual levers that control every AI-generated ad image. Locks some, leaves others flexible for variation spread.

**Runtime:** 3-5 minutes.

## Run this when

1. **You want intentional visual direction.** Not just a theme, but exact mood, lighting, composition, and angle.
2. **Variations are coming out too similar.** Force spread by making more levers flexible.
3. **Variations are coming out too wild.** Lock more levers to constrain output.
4. **Training a designer or team on the system.** The 8-lever card makes the framework teachable.

## Before you run

- Brand DNA (for color palette and visual vocabulary)
- Chosen theme
- Audience definition
- Optional: reference images

## What you get back

- All 8 levers configured with explicit selections
- Locked vs flexible list
- Preview of how 3 variations will differ
- Variation preview showing which levers change per variation

## Chains well with

- `/brand-dna` first (supplies Lever 2 color palette)
- `/layout-templates` next (structural blueprint)
- `/generate-ad` finally (consumes the lever spec)
