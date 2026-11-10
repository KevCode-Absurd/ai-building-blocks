---
name: canvas-design
description: Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists' work to avoid copyright violations.
license: Complete terms in LICENSE.txt
---

These are instructions for creating design philosophies - aesthetic movements that are then EXPRESSED VISUALLY. Output only .md files, .pdf files, and .png files.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **A design direction** (yours): the page's type, colours and layout rules.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A design direction** with the [Type-led poster planner](https://useaiblocks.com/skills/type-led-poster-planner). Bring a brief. It uses your brand file.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a brief, a design direction. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude with file tools or Claude Code:** The skill draws with code and saves files, so the AI needs to run code.
- **Codex or another coding AI:** It can also run the drawing code and save the PNG or PDF.
<!-- /needs -->

## BEFORE YOU START

**What this skill is for:** one finished, design-forward poster or piece of art, made on a canvas with code. Words on it are few. It is not a template tool, and it does not make photo-real images or exact brand logos.

**When NOT to use it:**
- A poster that must carry a lot of text, such as a full event schedule or a price list. Use a layout or slide tool instead.
- A poster that must use a real logo or a product photo. This skill does not draw them. Place them yourself afterwards.
- A print job with strict press rules (bleed, colour profile). Ask the printer for specs first and check the file against them.

**Needs:** an AI that can run code (for example Python with Pillow for a PNG or reportlab for a PDF) and save files. If it cannot, say so, write the design philosophy and a short brief for the piece, and stop. Do not pretend to have made an image.

**Ask once, in one message, for anything not given:**
- The topic or message of the poster (required)
- The exact words that must appear, such as an event name, date and place (optional). If given, use them exactly as written and check the spelling. Never invent a date, a place, a name or a price.
- Size and format (optional). If none is given, make a portrait A3 page (297 x 420 mm) as a PNG at 150 dots per inch (1754 x 2480 pixels), or as a PDF if the user wants to print it. Say which you chose.
- Mood, colours or style hints (optional)

If the topic is missing, ask for it and stop. For anything else that is missing, use your own choice and list it under "Assumed" at the end.

If the poster needs to say what it is about (an event name, a date), put those few words on it in a clear, readable way. That need comes before the idea of a hidden, subtle reference below.

Complete this in order:
1. Ask once for anything missing (see above).
2. Write the design philosophy and save it as `philosophy.md`.
3. Pick the one subtle reference from the topic.
4. Set the canvas size, then draw the poster in code, using fonts from `./canvas-fonts`.
5. Check margins, overlaps and spelling, and fix them.
6. Save the poster as `poster.png` or `poster.pdf` and end with the short note below.

First, undertake this task:

## DESIGN PHILOSOPHY CREATION

To begin, create a VISUAL PHILOSOPHY (not layouts or templates) that will be interpreted through:
- Form, space, color, composition
- Images, graphics, shapes, patterns
- Minimal text as visual accent

### THE CRITICAL UNDERSTANDING
- What is received: Some subtle input or instructions by the user that should be taken into account, but used as a foundation; it should not constrain creative freedom.
- What is created: A design philosophy/aesthetic movement.
- What happens next: Then, the same version receives the philosophy and EXPRESSES IT VISUALLY - creating artifacts that are 90% visual design, 10% essential text.

Consider this approach:
- Write a manifesto for an art movement
- The next phase involves making the artwork

The philosophy must emphasize: Visual expression. Spatial communication. Artistic interpretation. Minimal words.

### HOW TO GENERATE A VISUAL PHILOSOPHY

**Name the movement** (1-2 words): "Brutalist Joy" / "Chromatic Silence" / "Metabolist Dreams"

**Articulate the philosophy** (4-6 paragraphs - concise but complete):

To capture the VISUAL essence, express how the philosophy manifests through:
- Space and form
- Color and material
- Scale and rhythm
- Composition and balance
- Visual hierarchy

**CRITICAL GUIDELINES:**
- **Avoid redundancy**: Each design aspect should be mentioned once. Avoid repeating points about color theory, spatial relationships, or typographic principles unless adding new depth.
- **Hold the work to a clear quality bar**: The philosophy asks for careful, precise execution. Do not claim the work took countless hours or came from a named expert. Judge the finish by the checks in the final step: spacing, margins, no overlaps, one consistent font system.
- **Leave creative space**: Remain specific about the aesthetic direction, but concise enough that the next Claude has room to make interpretive choices also at a extremely high level of craftmanship.

The philosophy must guide the next version to express ideas VISUALLY, not through text. Information lives in design, not paragraphs.

### PHILOSOPHY EXAMPLES

**"Concrete Poetry"**
Philosophy: Communication through monumental form and bold geometry.
Visual expression: Massive color blocks, sculptural typography (huge single words, tiny labels), Brutalist spatial divisions, Polish poster energy meets Le Corbusier. Ideas expressed through visual weight and spatial tension, not explanation. Text as rare, powerful gesture - never paragraphs, only essential words integrated into the visual architecture. Every element placed on a clear grid.

**"Chromatic Language"**
Philosophy: Color as the primary information system.
Visual expression: Geometric precision where color zones create meaning. Typography minimal - small sans-serif labels letting chromatic fields communicate. Think Josef Albers' interaction meets data visualization. Information encoded spatially and chromatically. Words only to anchor what color already shows. Colour zones follow clear, consistent rules.

**"Analog Meditation"**
Philosophy: Quiet visual contemplation through texture and breathing room.
Visual expression: Paper grain, ink bleeds, vast negative space. Photography and illustration dominate. Typography whispered (small, restrained, serving the visual). Japanese photobook aesthetic. Images breathe across pages. Text appears sparingly - short phrases, never explanatory blocks. Each composition balanced with the care of a meditation practice.

**"Organic Systems"**
Philosophy: Natural clustering and modular growth patterns.
Visual expression: Rounded forms, organic arrangements, color from nature through architecture. Information shown through visual diagrams, spatial relationships, iconography. Text only for key labels floating in space. The composition tells the story through spatial arrangement.

**"Geometric Silence"**
Philosophy: Pure order and restraint.
Visual expression: Grid-based precision, bold photography or stark graphics, dramatic negative space. Typography precise but minimal - small essential text, large quiet zones. Swiss formalism meets Brutalist material honesty. Structure communicates, not words. Every alignment is checked against the grid.

*These are condensed examples. The actual design philosophy should be 4-6 substantial paragraphs.*

### ESSENTIAL PRINCIPLES
- **VISUAL PHILOSOPHY**: Create an aesthetic worldview to be expressed through design
- **MINIMAL TEXT**: Always emphasize that text is sparse, essential-only, integrated as visual element - never lengthy
- **SPATIAL EXPRESSION**: Ideas communicate through space, form, color, composition - not paragraphs
- **ARTISTIC FREEDOM**: The next Claude interprets the philosophy visually - provide creative room
- **PURE DESIGN**: This is about making ART OBJECTS, not documents with decoration
- **CAREFUL FINISH**: The final work must look precise and cared for. Check it against the quality checks in the final step

**The design philosophy should be 4-6 paragraphs long.** Fill it with poetic design philosophy that brings together the core vision. Avoid repeating the same points. Keep the design philosophy generic without mentioning the intention of the art, as if it can be used wherever. Output the design philosophy as a .md file.

---

## DEDUCING THE SUBTLE REFERENCE

**CRITICAL STEP**: Before creating the canvas, identify the subtle conceptual thread from the original request.

**THE ESSENTIAL PRINCIPLE**:
The topic is a **subtle, niche reference embedded within the art itself** - not always literal, always sophisticated. Someone familiar with the subject should feel it intuitively, while others simply experience a masterful abstract composition. The design philosophy provides the aesthetic language. The deduced topic provides the soul - the quiet conceptual DNA woven invisibly into form, color, and composition.

This is **VERY IMPORTANT**: The reference must be refined so it enhances the work's depth without announcing itself. Think like a jazz musician quoting another song - only those who know will catch it, but everyone appreciates the music.

---

## CANVAS CREATION

With both the philosophy and the conceptual framework established, express it on a canvas. Take a moment to gather thoughts and clear the mind. Use the design philosophy created and the instructions below to craft a masterpiece, embodying all aspects of the philosophy with expert craftsmanship.

**IMPORTANT**: For any type of content, even if the user requests something for a movie/game/book, the approach should still be sophisticated. Never lose sight of the idea that this should be art, not something that's cartoony or amateur.

To create museum or magazine quality work, use the design philosophy as the foundation. Create one single page, highly visual, design-forward PDF or PNG output (unless asked for more pages). Generally use repeating patterns and perfect shapes. Treat the abstract philosophical design as if it were a scientific bible, borrowing the visual language of systematic observation—dense accumulation of marks, repeated elements, or layered patterns that build meaning through patient repetition and reward sustained viewing. Add sparse, clinical typography and systematic reference markers that suggest this could be a diagram from an imaginary discipline, treating the invisible subject with the same reverence typically reserved for documenting observable phenomena. Anchor the piece with simple phrase(s) or details positioned subtly, using a limited color palette that feels intentional and cohesive. Embrace the paradox of using analytical visual language to express ideas about human experience: the result should feel like an artifact that proves something ephemeral can be studied, mapped, and understood through careful attention. This is true art. 

**Text as a contextual element**: Text is always minimal and visual-first, but let context guide whether that means whisper-quiet labels or bold typographic gestures. A punk venue poster might have larger, more aggressive type than a minimalist ceramics studio identity. Most of the time, font should be thin. All use of fonts must be design-forward and prioritize visual communication. Regardless of text scale, nothing falls off the page and nothing overlaps. Every element must be contained within the canvas boundaries with proper margins. Check carefully that all text, graphics, and visual elements have breathing room and clear separation. This is non-negotiable for professional execution. **IMPORTANT: Pick two or three fonts from the `./canvas-fonts` directory and use only those. Regardless of approach, sophistication is non-negotiable.**

Use fonts from the `./canvas-fonts` folder first. Only fetch another font if none of them fits, and only if you can reach the internet and the font is free to use (no paid fonts). Get creative by making the typography actually part of the art itself -- if the art is abstract, bring the font onto the canvas, not typeset digitally.

To push boundaries, follow design instinct/intuition while using the philosophy as a guiding principle. Embrace ultimate design freedom and choice. Push aesthetics and design to the frontier. 

**CRITICAL**: Aim for a very high level of finish and detail. Ensure the composition, spacing, color choices and typography all show expert-level craftsmanship. Do not add a signature, an artist credit or any claim that a person made the work. Double-check that nothing overlaps, formatting is flawless, every detail perfect. Create something clean and well finished.

Output the final result as a single, downloadable .pdf or .png file, alongside the design philosophy used as a .md file.

Then end your reply with this short note:
```
Files: <poster file name and size in pixels or mm>, <philosophy file name>
Movement: <the one or two word name>
Text on the poster: <the exact words used>
Assumed: <size, colours or anything you chose yourself>
Next: ask for another round (change colours, spacing or layout), or add your logo and print details yourself.
```

---

## FINAL STEP

**IMPORTANT**: Refine the poster you already made. Do not start over.

Quality checks before you hand it back:
- Margins are even and nothing touches the edge.
- Nothing overlaps. Text sits clear of every shape.
- Fonts come from one small set, and every word is spelled as the user gave it.
- The file opens and is the size you said.

**CRITICAL**: To refine the work, avoid adding more graphics; instead refine what has been created and make it extremely crisp, respecting the design philosophy and the principles of minimalism entirely. Rather than adding a fun filter or refactoring a font, consider how to make the existing composition more cohesive with the art. If the instinct is to call a new function or draw a new shape, STOP and instead ask: "How can I make what's already here more of a piece of art?"

Take a second pass. Go back to the code and refine/polish further to make this a philosophically designed masterpiece.

## MULTI-PAGE OPTION

To create additional pages when requested, create more creative pages along the same lines as the design philosophy but distinctly different as well. Bundle those pages in the same .pdf or many .pngs. Treat the first page as just a single page in a whole coffee table book waiting to be filled. Make the next pages unique twists and memories of the original. Have them almost tell a story in a very tasteful way. Exercise full creative freedom.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Colour contrast checker](https://useaiblocks.com/skills/colour-contrast-checker). It takes the image.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

Changed by AI Blocks (2026-10-28): added numbered steps, a plain quality bar and a font fallback rule earlier; today made the font rule one rule (two or three fonts from ./canvas-fonts).
Changed by AI Blocks (2026-11-10): refreshed the generated Before you start and After this guidance from catalogue metadata.
