# Optional craft reference

This is example vocabulary and house guidance, not a promise of tool behavior. The main skill and user brief take priority. Verify current model-specific syntax or limits before use.

> **Version:** 3.0 (camera engine, GPT Image 2.5 notes)
> **Compatible Models:** Midjourney V7/V8, GPT Image 2 / 2.5, Nano Banana Pro / Nano Banana 2, Seedream
> **Output Format:** 4 to 5 natural language sentences written as cinematic direction
> **Camera authority:** `CAMERA.md` governs where the camera stands. Section 3 here is reference vocabulary.

---

## 1. Core Philosophy

Every prompt is a shot description written by a director who knows exactly what they want. You are not listing keywords; you are describing a single frozen moment with enough physical specificity that any cinematographer could set up the shot.

Three pillars hold every prompt together:

**Pillar 1, Subject:** Replace vague nouns with specific physical definitions. "A woman" becomes "a woman in her late twenties with close-cropped natural hair and deep umber skin." Clarify spatial hierarchy: what is closest to the lens, what is farthest.

**Pillar 2, Context:** Define the physics of the scene. Where is the light coming from, how intense is it, what color does it cast, how does it scatter? Clarify spatial relationships between subject and environment. Describe any motion: frozen, blurred, or suspended.

**Pillar 3, Style:** Use camera vocabulary with intention. Where the camera stands, how far away it is and what lens it carries shape how the viewer responds before they process what they see. Reference real materials, textures and cinematic techniques. The camera position is psychology, not decoration.

---

## 2. Prompt Architecture


**Sentence flow (flexible, not rigid):**

1. **The Shot:** where the camera stands in the world, its distance and lens, and one visible consequence that locks it (see `CAMERA.md`).
2. **The Subject:** who or what is in the frame, with physical specificity: build, skin, hair, clothing, accessories, pose, expression, action.
3. **The Light:** where light originates, how it behaves on surfaces, what shadows it creates, what color temperature it carries.
4. **The World:** environment, atmosphere, foreground and background layers, particles, textures, depth.
5. **The Feel:** color grade, mood, cultural or cinematic touchstones ("vibes"), realism anchor.

Not every prompt needs all five in strict order. Some shots demand light first, some the subject. The order serves the image.

**Realism Anchor:** End every photorealistic prompt with a grounding phrase: "hyper-realistic, not CGI," "shot on film, not rendered," "real photograph." This steers models away from plastic rendering. GPT Image 2.5 responds especially well to "photorealistic" or "real photograph" stated outright.

**Semantic Positives:** Frame exclusions as what IS present. Write "clean empty surface," not "no clutter." Write "single subject, unobstructed," not "no other people."

**No em dashes in prompts.** Commas, colons, periods or parentheses.

---

## 3. Camera & Lens Knowledge

`CAMERA.md` decides where the camera goes and how a batch of four spreads. This section is the vocabulary.

### 3.1 What Height Does (once it's chosen)

Height is the LAST dial (`CAMERA.md`). This table describes the effect of a height once the brief has earned it; it is not the menu for making four variations look different.

| Height | Psychological Effect | Earned When |
|-------|---------------------|----------|
| **Extreme Low / Worm's Eye** | Power, dominance, monument | One exit per batch at most; a towering subject or a true under-view (glass floor, grate) |
| **Low (hip, knee)** | Strength, presence, slight threat | Common and human: a seated or crouching witness |
| **Eye Level** | Equality, trust, being in the room | The workhorse. Interest comes from distance, lens, foreground and crop |
| **Just Above Head** | Gentle exposure, approachability | A tall witness, one stair up |
| **Elevated (balcony, landing, bleachers)** | Watching from above, surveillance | A witness who is part of the world up there |
| **Overhead / Top-Down** | Pattern, detachment, diagram | The subject is already on a surface (table spread, flat lay, bed, pool, a crowd in formation) and the pattern IS the picture. Never re-pose a subject to earn it |
| **Dutch (Canted)** | Unease, instability | Chaos, danger, a world gone wrong |

### 3.2 Specialized & Underutilized Angles

These create distinctive imagery. Each still needs a reason in the brief.

- **Reverse POV (Impossible POV):** camera inside a character's head looking out. Instant tension, surreal.
- **Mirror POV:** through a reflective surface. Identity splits, psychological depth.
- **Voyeur Shot:** through gaps, bodies, objects. Intrusion, secrecy. (Telephoto through chain-link is BURNED as a default.)
- **Stranger 1st Person POV:** an unknown observer's viewpoint. Unease.
- **Through-the-Floor:** beneath glass looking up. Unusual intimacy.
- **Fish-Eye Interior:** distorted wide from inside a small space (fridge, cabinet, locker). Discovery.
- **Vehicle Interior Looking Out:** isolation, glass layers, contained perspective.
- **Periscope / Probe Lens:** the lens down among objects. Curiosity, creature exploration.
- **Upside-Down:** inverted 180 degrees. Dream, disorientation.
- **Canted Ceiling Shot:** angled up at a ceiling. Oppressive, claustrophobic.

The witness positions in `CAMERA.md` are the everyday version of this list: real places a person or object could be.

### 3.3 Lens Selection

Perspective comes from distance. A wide lens means the camera is close; a long lens means it is far. Name both.

| Lens | Effect | Use Case |
|------|--------|----------|
| **14 to 20mm (Ultra-Wide), camera close** | Space stretches, near things loom, rooms read huge | Environmental portraits, epic interiors, forced perspective |
| **24 to 35mm (Wide), camera near** | Subject and world both readable, moderate distortion | Street, documentary, being in the room |
| **50mm (Normal), conversation distance** | Closest to the human eye, honest | Natural portraits, editorial |
| **85mm (Short Telephoto), a few steps back** | Flattering compression, the background melts | Beauty, fashion, headshots. The most prompted AI look: never the default |
| **100 to 200mm (Telephoto), camera far** | Heavy compression, stacked layers, watching | Cinematic, surveillance, the world glued to a shoulder |
| **Macro** | Extreme detail, texture as landscape | Material, skin, product, evidence |

### 3.4 Aperture & Depth of Field

- **f/1.4 to f/2.0:** razor-thin focus, extreme isolation, creamy bokeh. Intimacy, romance, dream.
- **f/2.8 to f/4.0:** moderate separation, background soft but recognizable. Editorial standard.
- **f/5.6 to f/8.0:** deep focus, subject and environment both readable. Documentary, environmental portrait.
- **f/11 to f/16:** everything sharp. Landscape, architecture, geometry, deep-focus staging.

Shallow focus is the AI default "cinematic" crutch: the audit found it on nearly every close shot. Deep focus is the rarer flex. Give every sharp plane a job.

### 3.5 Optical & Lens Effects

- **Anamorphic:** horizontal streak flares, oval bokeh, widescreen feel.
- **Split-Diopter:** a near object and a far subject both sharp, a soft seam between them.
- **Tilt-Shift:** selective focus that makes a real scene read as a miniature.
- **Free-Lensing:** a detached lens: light leaks, a sweeping band of focus. Organic, ethereal.
- **Bokeh Foreground Occlusion:** out-of-focus colored shapes across the foreground. Dreamlike, layered.
- **Vintage glass:** swirl bokeh, lifted blacks, sharp center and soft edges, warm veiling flare.
- **Diffusion:** halation glow around highlights. One glass character per prompt at most.

---

## 4. Lighting Mastery

### 4.1 Light Direction (Clock System)

Describe light position on a clock face with the subject at center:
- **12 o'clock:** directly above (top light, butterfly lighting)
- **2 o'clock:** front-right high (classic beauty, Rembrandt)
- **3 o'clock:** direct side (split lighting, dramatic)
- **6 o'clock:** below (horror uplighting, campfire)
- **9 o'clock:** direct side opposite (split lighting)
- **Behind subject:** rim light, backlight, silhouette

### 4.2 Light Quality

| Quality | Description | Mood |
|---------|-------------|------|
| **Hard / Direct** | Sharp shadows, defined edges, high contrast | Drama, power, tension |
| **Soft / Diffused** | Gradual shadows, gentle transitions | Beauty, calm, intimacy |
| **Specular** | Bright pinpoint reflections on surfaces | Glamour, wet skin, metal |
| **Volumetric** | Visible rays through atmosphere | Mystical, cinematic, epic |
| **Dappled** | Broken by leaves or patterns, irregular pools | Natural, peaceful, organic |

### 4.3 Lighting Setups

- **Rembrandt:** key at about 45 degrees makes a triangle of light under the eye opposite the light. Classic portrait drama.
- **Butterfly / Paramount:** light directly above and in front. Shadow under the nose, glamorous. Fashion and beauty standard.
- **Split:** light from the direct side (3 or 9 o'clock). Half the face lit. Conflict, duality. (The 85mm profile with split light "carving the face in half" is BURNED as a default.)
- **Rim / Edge:** light from behind outlining the subject. Separation, heroic.
- **Silhouette:** strong backlight, no fill. Mystery, form, icon.
- **Chiaroscuro:** extreme contrast between light and dark. Painterly, moody.
- **Practical Lighting:** light from sources in the scene (lamps, screens, neon, candles, a cab meter). Naturalistic, atmospheric.

### 4.4 Color Temperature

- **Warm (2700K to 3500K):** golden, amber, candlelight. Cozy, nostalgic, intimate.
- **Neutral (4000K to 5500K):** daylight. Clean, natural, editorial.
- **Cool (6000K to 8000K):** blue-white, overcast, clinical. Cold, sterile, tense.
- **Mixed:** warm practicals with cool ambient, or teal shadows with orange highlights. Cinematic tension, depth.

### 4.5 Camera + Light Pairings

| Camera | Lighting | Mood |
|-------|----------|------|
| Close and wide, face-on | Hard key from above-side, deep shadow | Menace, confrontation |
| Full figure, long lens from far | Rim or backlight, silhouette | Heroic, iconic |
| Far and long, partly blocked foreground | Practical light from the subject's side, the witness in shadow | Watched, exposed |
| Conversation distance, foreground shoulder | Soft window light, warm practicals | Intimate |
| Three-quarter close, off-axis | Soft butterfly or a single specular source | Desire, beauty |
| Wide, subject in negative space | Flat overcast or one distant practical | Isolation |
| Ground-level witness (floor, step, grass) | Low raking light across the surface | Tactile, grounded |

---

## 5. Subject Specificity

### 5.1 People

Never write "a man" or "a woman." Specify:
- **Age range:** "in her early thirties," "elderly," "teenage"
- **Build:** "athletic build," "slender frame," "stocky"
- **Skin:** "deep umber skin," "warm bronze complexion," "freckled pale skin with visible sun damage"
- **Hair:** "cornrow braids pulled tight," "silver bob with blunt bangs," "shaved sides with loose curls on top"
- **Expression:** "contemplative with furrowed brow," not "thoughtful." "Raw triumphant roar, mouth wide open," not "excited."
- **Clothing:** specific garments, materials, colors, fit. "Oversized vintage leather bomber jacket, cream cable-knit sweater underneath," not "jacket."
- **Accessories:** jewelry type and material, eyewear, visible tattoos, piercings.
- **Pose / Action:** the body position and the moment. "Torso lunging toward camera, arms tensed mid-celebration," not "celebrating." One clear action reads better than three.
- **Body framing:** say what's in frame. "Full body visible, feet included," "framed from mid-thigh up," "hands resting on the table." GPT Image 2.5 follows this language closely.

### 5.2 Stylized Characters & Mascots

Characters with nonstandard anatomy (stubby arms, no legs, a face on food or an object) break when the limbs are over-described. Give each variation one readable gesture built from the body's simplest shapes (arms raised, hands on hips, one arm waving, leaning back, a small hop), with no crossed arms, fingers, held props or limbs propping the face, and put the complexity in the face, the expression, the material and the surface texture. Across four variations, change the expression and the gesture each time; four frames of one pose read as one image. (Detailed arm choreography breaks small clay characters in render after render.)

### 5.3 Objects & Products

- **Material:** "brushed titanium with visible machining marks," not "metal."
- **Surface condition:** "patinated copper with verdigris spots," not "old copper."
- **Scale indicators:** include something for size reference when it matters.
- **Texture interaction:** how light plays on the surface. "Catches overhead light in long specular streaks."

### 5.4 Environments

- **Time of day:** "blue hour, 20 minutes after sunset," not "evening."
- **Weather / atmosphere:** "low fog hugging the ground, visibility 50 meters," not "foggy."
- **Surfaces:** "rain-slicked asphalt reflecting neon," not "wet street."
- **Depth layers:** foreground, midground, background as separate planes.

---

## 6. Color & Post-Processing

### 6.1 Color Grade Language

- **Teal-Orange:** cinematic blockbuster standard. Cool shadows, warm highlights.
- **Desaturated Cool:** muted, editorial, introspective.
- **Saturated Warm:** punchy, vibrant, energetic.
- **Monochromatic:** single hue dominance. Graphic, intentional.
- **Cross-Processed:** shifted color channels. Retro, experimental.
- **Lifted Blacks:** shadows never reach true black. Faded film, vintage, dreamy.
- **Crushed Blacks:** deep, true blacks. High contrast, dramatic, modern.
- **One hot color:** a desaturated frame with one element left saturated (the cab's yellow, the red meter).

### 6.2 Film Grain & Texture

- **Fine grain (ISO 100 to 400):** clean, sharp, commercial.
- **Medium grain (ISO 800 to 1600):** textured, editorial, atmospheric.
- **Heavy grain (ISO 3200+):** gritty, raw, documentary.
- **Medium format grain:** subtle but present; tactile in a way distinct from 35mm.

### 6.3 Skin Tone Rendering

Always specify how skin renders:
- "Rich dark skin with golden sweat sheen"
- "Warm bronze with visible pores and natural texture"
- "Pale porcelain with pink undertones, no airbrushing"
- "Sun-weathered tan with deep smile lines"

---

## 7. Composition Techniques

### 7.1 Framing Strategies

- **Negative Space Dominance:** subject tiny in a vast environment. Loneliness, scale.
- **Forced Foreground:** an oversized element near the lens, the subject beyond. Dramatic depth.
- **Doorway / Threshold Framing:** the subject framed through an opening. Natural vignette.
- **Over-the-Shoulder Extreme:** a shoulder fills 40 to 50% of the frame. Implied presence.
- **Reflection-in-Eye:** the scene captured in the iris. Intimate, voyeuristic.
- **Silhouette Backlit:** form, mystery.
- **Bokeh Foreground:** blurred colored shapes in front. Dreamlike, layered.
- **Focus on the Wrong Thing:** the foreground object sharp, the subject soft. The picture becomes the object.

### 7.2 Composition Rules

- **Rule of Thirds:** subject on the intersections.
- **Leading Lines:** environmental lines drawing the eye to the subject.
- **Symmetrical:** centered, balanced, formal; the deadpan frontal.
- **Golden Ratio / Spiral:** natural proportion, organic flow.
- **Frame-within-Frame:** environmental elements as secondary borders.
- **Edge Tension:** the subject pushed to an edge, looking out of frame.

See CROP AND PLACEMENT in `CAMERA.md` for crop lines and horizon placement.

---

## 8. Atmosphere & Particles

Atmosphere creates depth and mood. Describe particle behavior:

- **Dust motes:** "suspended in a shaft of window light, catching gold"
- **Smoke / Vapor:** "cigarette smoke curling upward in a thin column, backlit blue"
- **Rain:** "individual drops frozen mid-fall, backlit by a streetlight"
- **Fog / Mist:** "low fog hugging the ground, diffusing ambient light"
- **Snow:** "individual flakes visible, caught by rim light"
- **Sweat / Water droplets:** "beaded on the forehead, each droplet a tiny specular highlight"
- **Sparks / Embers:** "floating upward, orange-hot, motion-blurred"
- **Pollen / Spores:** "suspended in golden afternoon light, shallow focus making them glow"

---

## 9. The Vibes System

Every prompt ends with a cultural or cinematic touchstone, a "vibes" reference that communicates an entire aesthetic in shorthand. Format: "[Reference A] energy meets [Reference B] meets [Reference C]."

These are not artist names or copyrighted works. They are energy descriptors, cultural movements or aesthetic categories:

- "90s hip-hop music video energy meets golden hour magic realism"
- "Scandinavian minimalism meets brutalist concrete poetry"
- "Tokyo street fashion editorial meets neon noir"
- "Renaissance painting drama meets modern athletic power"
- "Afrofuturist royalty meets high-fashion editorial"
- "Symmetrical pastel dreamscape meets storybook diorama"
- "Film noir tension meets contemporary fashion"
- "GoPro extreme sports meets trap music video aesthetic"

The vibes line is a compression layer: mood, era, culture and energy that would otherwise take several sentences.

---

## 10. Style Extraction & Locking

### 10.1 Extracting Style from Reference Images

When analyzing reference images, extract:

- **Lighting Signature:** primary light behavior, shadow quality, direction.
- **Color Palette:** dominant hues, shadow color, highlight color, midtone treatment.
- **Texture / Grain:** film stock feel, digital cleanliness, tactile quality.
- **Camera Language:** typical distance, focal length, aperture tendency, where the camera tends to stand, height pattern.
- **Mood Keywords:** 3 to 5 words capturing the emotional register.
- **Realism Level:** photorealistic, stylized, illustration, hybrid.

Output a compact style block:

```
STYLE: [Name]
Light: [signature] | Color: [palette] | Grain: [texture]
Lens: [focal length] at [aperture], [DOF preference]
Camera tendency: [distance, position, height pattern] ([psychological intent])
Mood: [keyword], [keyword], [keyword]
Realism: [level]
```

### 10.2 Style Locking

When the user says "lock this style," confirm the style and apply it to all subsequent prompts. Note the active lock at the top of each output. A locked style locks light, color, grain and realism; the camera spread still runs unless the style block locks the camera too.

Commands: "unlock style" / "use [style name] for this one" / "modify locked style: [changes]"

---

## 11. Edit & Inpaint Prompts

When writing edit prompts (inpainting, style transfer, semantic edits), document:

1. **What exists now** (current state).
2. **What it should become** (target state), with equal specificity.
3. **How it integrates** with the existing light, color and scene physics.
4. **What stays unchanged:** identity, pose, framing, layout, lighting, labels. GPT Image 2.5 and Nano Banana follow "change only X, keep Y" far better than a rewrite alone.

Edit format (still 4 to 5 sentences): write the full scene as if it already contains the edit, then append the edit note:

```
[Full scene description with the change already written in]

Edit: Change [element] from [current state] to [target state]. The new [element] should [integration detail]. Keep everything else unchanged: [identity, pose, framing, lighting].
```

When several reference images are attached, name each by number and role (subject, style, clothing, background) and say how they combine.

---

## 12. Platform-Specific Notes

### 12.1 Midjourney V7/V8

- Rebuilt with strong natural-language understanding; sentence prompts work as well as or better than keyword lists.
- Excels at stylistic, cinematic, editorial and atmospheric imagery.
- Adds its own aesthetic interpretation; for literal results, state constraints plainly in the prose.
- V8 rejects prompts over 1,300 characters: V8 mode caps at 1,250.

### 12.2 GPT Image 2 / 2.5

- GPT Image 2.5 ships as **Flare** (small, fast) and **Sunburst** (base, highest quality). Better precise editing and subject preservation than GPT Image 2.
- Natively multimodal and literal: what you describe is what you get, so vague direction returns the median image.
- **Camera specs are cues, not physics.** OpenAI's own guidance: "Treat camera specifications as cues for appearance, not a guarantee of exact physical simulation." Name the lens and position, then lock them with a visible consequence (what's visible, where the horizon cuts, the crop edges, the relative scale). See `CAMERA.md`.
- **Body framing language is obeyed:** "full body visible, feet included," "looking down at the open book," "hands gripping the handlebars."
- **Concrete over mood words:** name scale, atmosphere and color instead of relying on adjectives.
- **Say "photorealistic" or "real photograph"** when that is the goal.
- **Text:** put exact wording in quotes, say where it sits and in what type; spell unusual words letter by letter.
- **Edits:** "change only X" plus the list of what to preserve. For iteration, feed the previous output back, request one change, repeat the preserve list.
- **References:** number each input and give it a role (subject, style, clothing, background).
- Labeled sections, paragraphs and JSON all work for the model; this skill stays in sentences because they carry across every platform.

### 12.3 Nano Banana Pro / Nano Banana 2

- Prompt quality is the primary control lever; the same natural-language approach works directly.
- With reference images, assign roles ("use reference image 1 for the face, image 2 for the style").


### 12.4 Universal Compatibility Notes

- **Lead with the most important visual element.** Models weight earlier content more heavily, which is why the camera sentence comes first.
- **Photography terminology is universally understood:** focal lengths, lighting setups, camera positions.
- **Visible consequences beat angle names on every model.**
- **Semantic positive framing works everywhere.**
- **Specificity always wins.** Vague prompts produce generic results on every platform.
- **The vibes line translates across models.**
- **No parameter flags.** No -- commands, no --ar, no --stylize.

---

## 13. Specialized Prompt Categories

### 13.1 Fashion Editorial
Lead with garment detail, fabric behavior and skin texture. Material interaction with light matters most. Butterfly or Rembrandt setups. 85mm to 110mm, but vary distance across a batch: a full-length frame on a 35mm in the street does more than four 85mm headshots.

### 13.2 Extreme Sports & Action
Lead with the peak moment: the apex of the jump, the spray. Wide and close inside the action for power; long and far for the stacked, compressed sprint. Flash-freeze motion. Environmental interaction (dust, water, particles) is critical.

### 13.3 Food Photography
Lead with texture: steam, condensation, melt, glisten. Side light for texture, backlight for translucency. Macro and 45-degree angles. Top-down is earned here (a table spread is already a pattern on a surface), but one per batch.

### 13.4 Architectural Spaces
Lead with material properties and weathering. Golden hour or harsh midday for texture. Scale indicators (people, furniture). Ultra-wide lenses for context.

### 13.5 Product Photography
Lead with product definition: materials, finishes, form. Crisp studio or dramatic lighting. Surface interactions (reflections, shadows). Clean or contextual backgrounds.

### 13.6 Portrait & Character Study
Lead with the person. Specific expression, skin texture. Vary the distance across a batch (a face, a half figure, a full figure in their world) rather than four close-ups at four heights. Rembrandt or split for drama, butterfly for beauty.

### 13.7 Surreal & Conceptual
Lead with the impossible or unexpected element. Real-world physics around an impossible scenario. A witness position makes the impossible feel documented. Keep photorealistic rendering even for surreal content.

---

## 14. Quality Checklist

Before finalizing any prompt, verify:

- [ ] Every noun is specific (no "a man," "a building," "some flowers")
- [ ] Light has a source, direction and behavior on surfaces
- [ ] The camera has a place in the world (a witness position or a stated distance and lens)
- [ ] The camera is locked by one visible consequence
- [ ] Height is human unless the brief earned an exit; no subject re-posed to justify the camera
- [ ] Lens focal length matches the intended emotional distance, and the lens is written with its distance
- [ ] At least one texture or material is physically described
- [ ] Depth layers exist (foreground, subject, background are distinct)
- [ ] Color grade or tonal direction is specified
- [ ] A vibes reference anchors the mood
- [ ] Realism is anchored ("hyper-realistic, not CGI" or equivalent)
- [ ] Semantic positives instead of negative exclusions
- [ ] No em dashes
- [ ] It reads like a director describing a shot, not a keyword list

**Batch check (four variations):** four different distances (or, on a locked distance, four different lens/orientation/foreground choices); no shared distance + lens; at least three orientations; at least two witness positions or foregrounds; at most one exit height; at least one frame not on shallow focus; no burned setup used as filler.
