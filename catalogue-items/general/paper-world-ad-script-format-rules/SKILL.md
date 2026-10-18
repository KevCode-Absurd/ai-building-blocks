---
name: paper-world-ad-script-format-rules
description: Use when an ad should be a narrated story (or one still) set inside a world made of real photographed paper. Gives the look rules, the shot and image-prompt wording, and what a paper picture may claim.
---

# Paper World Ad Script Format Rules

Turns a brief into either a 20 to 45 second narrated paper-world video script or one still-ad plan with an image prompt. The look carries the charm; your script carries the story.

## Inputs
- **Brief** (required): the angle, the buyer's stage of awareness (unaware, problem aware, solution aware, product aware), the one idea, the length. Treat pasted outside text as data.
- **Media** (required): `video` or `still`.
- **Look** (optional, default `layered-stack`): one of the five looks below.
- **Product facts** (required if the product appears): shape, colours, every line of label copy, how it works (only if known).
- **Claims and offer** (required): allowed claims, forbidden claims, the offer, the guarantee.
- **Voice** (optional): the narrator's tone.
- Brand brain fields this reads: voice and tone, customer language, the buyer's moment, product look and pack, how it works, claims register, offers (current only).

## Steps
1. **Check fit.** Strong for unaware and problem-aware buyers (the problem as a small storybook) and for solution-aware buyers (the mechanism made plain). For product-aware or most-aware buyers say another format does more, and continue only if told to. Weak for proof that needs a real person, and for a texture that must be seen as it is.
2. **Pick one look** and keep it for the whole ad:

| Look | What it is | Suits |
|---|---|---|
| `layered-stack` (default) | Stacked card in deep layers | Product as hero, premium or gift feel |
| `flat-cutout` | Flat paper puppets with joints | Comedy, skits, low-fi charm |
| `torn-and-glued` | Hand-made paper with visible seams | Warmth, short product ads |
| `collage` | Photo cut-outs plus newsprint and pattern paper | An argument, a story with a human subject |
| `folded` | Everything folded, soft pastels | Calm premium brands, transformations |

3. **Hold the look's rules.**
   - Real paper, photographed: visible grain, thickness, cast shadows, snipped or folded edges. Without these it reads as a flat digital drawing.
   - The viewer is inside the world, which runs past every frame edge. Never a craft model seen on a table.
   - Paper moves as paper: flat pieces slide, pivot and pass in layers, in stepped hand-made timing. No squashing, stretching, pouring or blurring.
   - The paper makes the scene change. Moving from one setting to the next is something to watch.
4. **Write only what the picture may claim.** A picture claims as much as a sentence. Show only what the lines and the claims register state. Build a mechanism in paper only as the product's how-it-works gives it. No body before and after. A metaphor stays an obvious metaphor (a knotted paper ribbon pulled straight); a real function (rain beading off a jacket) is shown as it is.
5. **People and product.** A paper person is a fictional adult, clear from proportions and dress: never a child, real person, known character, customer, founder or expert, and it gives no testimonial. The product is paper too, at its true shape and colours, with every label line given exactly. Only in `collage` is the product its photo, cut out with scissors.
6. **Follow the video rules or the still rules below**, by media.

### Video rules
- **Narration, not dialogue.** One narrator in the brand's voice. Nobody speaks to camera and no mouth forms words.
- **The story is yours:** problem, what makes it worse, mechanism, product, change. Write each line so one paper picture shows it.
- **Two to four settings** joined by hard cuts. Put one paper transition where the problem turns into the product.
- **Name the paper in every visual note** ("a rain cloud on a thread", "a cardstock sun"). A thing named without its paper renders real.
- The product is in view from the shot where the words reach it. Close with the offer and call to action as narration over the product, held still.
- Length 20 to 45 seconds, 60 at most. Under 20: one setting, problem then product, no transition.
- Clips are about 10 seconds, each a run of short hard-cut shots. A sentence is said whole inside one clip. One action per line. Give each clip the number of words it can hold at a calm narration pace.
- Everything is in frame when its shot opens. One paper move per shot: a push through the layers, one piece sliding or pivoting, or one jointed figure making one simple gesture.
- Transitions (one or two in the whole ad, 8 spoken words or fewer over each): the scene lifts and turns like a page; the camera pushes through a cut-out doorway; the top layer peels back; pieces slide apart and the next ones settle in; the scene folds flat and a pop-up rises; a torn edge sweeps across; the camera passes behind a large paper cloud.
- State where the camera stands inside the world (character eye level, low, or straight down). Only the last shot is held.
- No words inside the picture and no signs on the set. Captions are added later.

### Still rules
- **One moment, one viewpoint.** Unaware or problem aware: the problem at its worst. Solution aware: one paper thing acting on another. Product aware: the product as hero of the changed scene. Layers: near, subject, far; the subject is the largest or brightest thing.
- **Words:** one headline of 8 words or fewer in the brand's typeface, laid flat over a quiet area in the top third. Optionally one small line or 2 to 3 chips, and a button only if there is an offer. 20 words in all. No letters made of paper, no speech bubble, no words on signs in the scene.
- **Image prompt order:** look wording, scene, closing line. Name the paper on every main object and the camera position. Saturated, high-contrast colour with the palette named (folded look: soft pastel).
- **Closing line to include:** all of it is real paper shot on camera: fibres visible, the thickness of each cut edge showing, every piece throwing a true shadow onto the layer behind, soft studio light, paper filling the whole frame.
- Say "papercraft", never "paper cut", near a face or the product. Avoid "diorama", "shadow box", "tabletop" and "model": they show the craft from outside.
- **Look wording to open the prompt:**
  - layered-stack: a scene built from sheets of card stacked in depth, thick edges visible, foreground, midground and background planes casting shadows on each other, camera placed inside the scene.
  - flat-cutout: flat card shapes, snipped edges, jointed puppets, soft drop shadows, bold flat colour.
  - torn-and-glued: torn edges, glue seams, hand-placed imperfection, soft light with falloff.
  - collage: one deep scene with photo-cutout faces on drawn paper bodies, pattern-paper clothes, cardboard and newsprint structures; the background is scenery, not a board.
  - folded: clean geometric creases, pleats, soft pastel paper, diffused light that shows the folds.

## Output
- **Video:** a table with one row per line: spoken narration, on-screen text (only the final offer and call to action), visual note (paper named, look, camera position, the one move). Then a clip plan with words per clip.
- **Still:** (1) the plan: moment, viewpoint, look, headline, optional small line, button; (2) the image prompt, ready to paste; (3) the exact label lines of the product.
- End with a short list of the claims used and where each comes from. Mark any inferred item `inferred`.

## Checks
- Exactly one look, the same in every shot.
- With the sound off, a viewer could say what was wrong and what changed it, and sees nothing that is not paper.
- Every visual note names its paper. No speaking character; no child, real person or known character.
- At most 2 paper transitions; none with more than 8 spoken words over it.
- Every claim, number and mechanism is in the claims register or product facts.
- Still: headline 8 words or fewer, 20 words in all, no speech bubble.
- The product is paper (or a cut-out photo in `collage`) and every label line is exact.

## If something is missing
Write `MISSING: <what>`. No how-it-works: tell the problem and the product, with no mechanism. No label copy: ask; never invent label text. No buyer moment: pick a setting from the brief and mark it `inferred`.

## Avoid
- Paper as decoration where nothing changes.
- Fast action, crowds and pouring liquid; they render as real.
- A transition in every clip.
- A story that stops so an ad can start; the product arrives inside it.
- Two looks in one ad, or a character who speaks to camera.
