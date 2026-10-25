# Optional craft reference

This is example vocabulary and house guidance, not a promise of tool behavior. The main skill and user brief take priority. Verify current model-specific syntax or limits before use.

# CAMERA: where the camera stands

The camera engine for Prompter V3. SKILL.md says when to run it; this file says how. It replaces the old habit of picking four angles off a height chart.

---

## Why this file exists

An audit of 105 prompts the previous version (Unified Prompter V2) wrote (August to September 2026, `scripts/camera_scan.py`) found the camera stuck in a template:

- In open four-prompt batches, a from-above shot (overhead, top-down, high and looking down) showed up in 4 of 6 batches, always in slot 3 or 4.
- 3 of those 6 batches reproduced three or four of the old worked example's setups: the 14mm worm's-eye hero, the 85mm profile with split light, the overhead drone, the telephoto through a fence.
- Twice the overhead slot re-posed the subject to justify itself ("lying back so her mouth appears upside down in frame").
- Shallow focus (f/1.8 to f/2.8) sat on almost every close shot, and 85mm/100mm were the default close lenses.

The causes were in the skill itself: the only worked example was the template; the angle table ranked cameras by HEIGHT, so "four different angles" became "four different heights" and overhead was the cheapest way to look different; vulnerability and isolation were wired to overhead; eye level was treated as a failure ("never default to eye level").

---

## THE LAW: height is the last dial

A camera has eight dials. The first six change what the picture is. Height mostly changes how gimmicky it looks. Turn them in this order:

1. **DISTANCE (shot size).** Detail, close-up, medium, full figure, wide (subject and world), extreme wide (the world, the subject a mark in it). The biggest change in what the picture is about.
2. **LENS, which means how far away the camera physically is.** Wide and close: the face looms, the room stretches, you are in it. Normal: honest proportions, you are near. Long and far: the world stacks up behind them, you are watching. The same framing at 24mm and at 135mm is two different pictures.
3. **ORIENTATION.** Which side of the subject the lens sees (face-on, three-quarter, profile, three-quarter back, from behind so their view becomes the picture) and where their eyes go (into the lens, off frame, at something in frame).
4. **FOREGROUND.** What sits between lens and subject: nothing; a soft shape (a shoulder, steam, glass, leaves); a frame (a doorway, a car window, a gap); a reflection; or a sharp near object that matters as much as the subject.
5. **PLACEMENT AND CROP.** Where the subject sits and where the edges cut: centered punch, pushed to an edge, small in a corner, cropped through the forehead, cut at the knees, horizon high or low.
6. **FOCUS.** Deep (everything matters), shallow (one plane), focus on the wrong thing (the foreground sharp, the subject soft), split.
7. **HEIGHT.** The ladder below. Most pictures live in the human band.
8. **TILT.** Level by default; canted when the world should feel wrong.

Most great photographs are made at or near eye level. Their interest comes from dials 1 to 6. Eye level is not a failure; an unearned altitude is.

---

## THE WITNESS POSITION (the default way to place a camera)

The strongest stills are shot from a place someone or something in that world could actually be. Before choosing an angle, ask: **who is holding this camera, and where are they standing?** The next barstool. The back seat. The doorway of the next room. Across the street behind a parked van. The wedding photographer kneeling in the aisle. The phone propped against the mirror.

A named position gives the model a height, a distance, a foreground and an orientation in one phrase, and it is specific where "low angle" never is. It also makes the picture feel taken rather than rendered, because a body was there.

**Name the place, never the person.** Write "from the back-door step at seated height," not "at the eye line of a line cook on his smoke break." A person named in the camera sentence gets painted into the frame. The witness is a location and a height; describe a person there only when they belong in the picture.

**At least two of every four variations name a witness position or a foreground.** The library is at the end of this file. When the camera is no one (a clean studio portrait, a product on seamless, a character on white), place it by distance and lens instead; the label simply omits a position.

---

## THE HEIGHT LADDER

**Human band (the default; all four variations live here unless one earns an exit):**

- **Floor:** the lens on the ground. A dropped phone, a dog, a child lying down.
- **Knee:** a child's eye line, a crouching photographer, a seated person's lap.
- **Hip / waist:** the camera held low; the bartender's view across the bar top; the gunfighter's eye line.
- **Chest / seated eye:** someone sitting at the table, in the booth, in the car.
- **Standing eye:** a person in the room. The workhorse.
- **Just above head:** a tall person, a raised arm, one stair up.

**Exits (at most ONE per batch, and only when earned):**

- **Elevated:** a balcony, a stairwell landing, a second-floor window, the top row of bleachers, a ladder. A witness up there must be part of the world.
- **Overhead / top-down / drone (90 degrees down).**
- **True worm's-eye:** lens under the subject looking straight up (through a glass floor, a grate, from the bottom of a pool).

**Overhead is earned only when all three hold:** the subject is ALREADY lying on or spread across a surface in the brief (a table spread, a bed, a flat lay, a pool, a game board, a crowd forming a shape, a body in the snow); the pattern seen from above IS the picture; and the brief doesn't depend on reading a face. **Never re-pose the subject to justify the camera.** If a figure has to lie down so the overhead works, the camera is bossing the picture; pick a different camera.

**The worm's-eye hero (ultra-wide from the ground up at a towering figure) has the same cap:** one per batch, not the automatic answer to "power."

When the user asks for overhead, top-down, bird's-eye, drone or worm's-eye, deliver it. The caps govern defaults, not requests.

**Don't flatten, either.** Zero exits is fine, but four frames parked at standing eye level read as one calm mood. Two habits keep the energy:

- **Use the whole human band.** Across four variations, use at least two different heights inside it (floor, knee, hip, seated, standing). Floor and knee are human and still change the picture completely.
- **Spend the exit on SCALE.** When the brief has a scale story (a giant, a monster, a catch bigger than the boat, a crowd, a ruin, a city), the one exit is often the strongest frame in the set: the face bigger than the hull from below the waterline, the tiny figure on the giant's palm from the giant's shoulder. Earned by scale counts the same as earned by a pattern on a surface.

---

## THE BATCH SPREAD (four variations)

Run this check before writing the prose:

- **Distance first.** Four different distances where the brief allows: a detail or close-up, a medium, a full figure, a wide. Each tells a different part of the story.
- **When the brief locks the distance** ("lips only," "focus on the details," a product close-up, a face): vary lens, orientation, foreground, crop and focus instead. Never let two variations differ only in height.
- No two variations share the same distance AND lens.
- At least three different orientations across the four.
- At least two variations name a witness position or a foreground.
- At least two different heights inside the human band.
- At most one variation outside the human band. Zero is fine; a scale brief usually wants its one.
- At least one variation NOT on shallow focus (deep focus where the world matters, or a sharp foreground). Shallow focus is still right for many close beauty and intimacy frames; the rule is a mix, not a ban.
- At least one frame with motion underway (something falling, turning, swinging, landing), unless the brief is a still portrait or a sheet.
- None of the BURNED setups below unless the brief calls for them.

Then write one label per variation, which goes above its code box in the output:

`**2 · Medium · 50mm from the next booth · three-quarter, eyes off frame · seated eye**`

Distance · lens and where the camera is · orientation · height. If two labels read alike, change one before writing the prose.

---

## LOCK THE CAMERA BY WHAT IT SHOWS (adherence)

Image models treat angle words and lens numbers as cues, not physics. OpenAI's own GPT Image guidance: "Treat camera specifications as cues for appearance, not a guarantee of exact physical simulation." Write "low angle" and you get the model's median low angle. So after naming the position and lens, add **one visible consequence that only that camera could produce**:

- **What the height reveals:** "the underside of his jaw and the ceiling tiles behind him," "we see the tops of the bar stools and the tiled floor beyond," "her eyes level with the rim of the cup."
- **Where the horizon or ground line sits:** "the horizon cutting through her knees," "the floor filling the bottom third."
- **Crop edges:** "framed from mid-thigh to just above her head," "full body visible, feet included, floor under them." (GPT Image 2.5 follows body-framing language reliably.)
- **Scale from the lens:** "his outstretched hand as large as the car behind him" (wide and close); "the moon the size of her head behind her" (long and far).
- **The foreground's behavior:** "the passenger's shoulder a soft dark wedge filling the left third."

One consequence per prompt, two at most. It lives in the camera sentence, which should run about 25 to 40 words.

### Make the geometry possible

The judges of the first A/B caught frames that no camera could make. Check three things before writing:

- **Framing math.** At a distance D, a lens of focal length F frames roughly D × 36 / F wide (full frame). So: a face at 85mm needs about 1 m; head and shoulders on 85mm about 1.5 m; a full standing figure on 50mm about 3 to 4 m, on 135mm about 9 m or more; "macro" means centimeters, never a crown-to-mid-back frame. If the lens, the distance and the crop disagree, change one.
- **One sightline.** The way the lens points, the side of the subject it sees and the background described must coexist. A profile shot looks ACROSS the subject, so the background is whatever lies beside them, not what's in front of them or behind the lens.
- **Small cast, readable frame.** Two or three supporting figures at most, soft or small, never competing with the subject. Don't make a frame depend on legible text in Midjourney (GPT Image 2.5 handles text: put the exact words in quotes).

---

## EMOTION TO CAMERA (rewired: height last)

| Intent | First reach (distance, lens, orientation, foreground) | Height |
|---|---|---|
| Power, menace | Close and wide (24 to 35mm within arm's reach), face-on, the subject filling the frame and leaning toward the lens | Chest or hip is enough |
| Heroic, iconic | Full figure on a long lens from far away, the world stacked behind, rim or silhouette | Eye or hip |
| Vulnerability | Far and long, the subject small in a big frame, partly blocked by a foreground: watched from somewhere they don't know about | Eye. Not overhead |
| Isolation | Wide, the subject off-center in negative space, deep focus so the empty world stays sharp | Eye |
| Intimacy | Close, 50 to 85mm at conversation distance, the other person's shoulder or hand soft in the foreground, eyes off the lens | Eye |
| Desire, seduction | Close, slightly off-axis three-quarter, focus on one feature, silk, hair or glass in the foreground. On luxury and beauty briefs: restraint, no gimmick props | Eye or a hair below |
| Dread, being watched | A hiding witness (through slats, behind a parked car, from the dark room into the lit one), long lens, deep shadow | Eye or hip |
| Chaos, action | Wide and close inside it, canted a few degrees, foreground debris or bodies, deep focus | Chest or hip |
| Awe, scale | Extreme wide with one small human for scale, or a long lens stacking the giant thing behind them | Eye |
| Comedy | Full figure, deadpan frontal, centered, deep focus so the joke in the background reads | Eye |
| Grief, aftermath | Medium from behind or three-quarter back, so what they're looking at becomes the picture | Seated or standing eye |
| Triumph | Medium on a wide lens close in the middle of the celebration, other bodies crowding the frame edges | Chest |

---

## LENS IN VISIBLE BEHAVIOR (still-frame version)

Perspective comes from DISTANCE: a long lens means the camera is far away, a wide lens means it's close. Write both halves: "a 135mm from across the street," not "a 135mm."

- **Fisheye:** the world bends into a sphere; anything near the lens balloons. Skate video, rap video, peephole, paranoia.
- **14 to 20mm:** straight lines stay straight while space stretches like taffy; near things loom, rooms read huge, faces near the frame corners smear.
- **24 to 28mm:** the subject and the whole room both readable; within a foot of a face, features push forward (the confrontational close-up).
- **35mm:** honest and invisible; the room at conversation distance.
- **50mm:** true proportions; the observer's lens.
- **85mm:** the flattering face lens; the background jumps forward and melts. The single most prompted AI look, so never the default.
- **135mm:** compression as an effect; the world glued to their shoulder; foreground clutter dissolves into colored fog.
- **200 to 600mm:** space stops existing; layers stack into a wall; heat shimmer; the sun the size of a head.
- **Macro:** texture becomes landscape. **Probe lens:** the lens down among the objects, a bug's view of the room.

---

## FOCUS AND GLASS

Shallow blur is the AI default "cinematic" crutch. Deep focus is the rarer flex: give every sharp plane a job.

- **Deep focus staging:** foreground hand, midground face, background door, all sharp, all telling the story.
- **Razor-thin:** one feature sharp, everything else melted. Spend it on purpose, not by habit.
- **Focus on the wrong thing:** the foreground object sharp, the subject soft behind it. The picture becomes about the object.
- **Split diopter:** a near object and a far face both sharp, a soft seam between them.
- **Tilt-shift:** a real scene rendered as a miniature model.
- **Glass character (one layer per prompt at most):** anamorphic (oval bokeh, horizontal streak flare), vintage glass (swirl bokeh, lifted blacks, sharp center and soft edges), diffusion (a halation glow around highlights), a named flare (streak, ghost chain, veiling glare, starburst).

---

## CROP AND PLACEMENT

- **Centered frontal punch:** symmetry, confrontation, deadpan.
- **Bottom third:** the subject low in frame under a towering empty top.
- **Edge placement:** pushed to the edge looking out of frame (tension) or into the frame (room to breathe).
- **Crop through the forehead:** intensity, intimacy.
- **Cut at the knees or mid-thigh:** the cowboy frame, a body with attitude.
- **Full body, feet included, floor visible:** grounded, readable, required for character work.
- **Horizon high** (the ground dominates) or **horizon low** (the sky dominates).
- **Frame within a frame:** doorways, windows, mirrors, gaps between people.
- **Two subjects at opposite edges:** the gap between them is the story.

---

## LOCKED ASSETS SKIP THE SPREAD

Character sheets, turnarounds, environment plates, style-locked series and edits have a camera fixed by the job: straight-on at the subject's eye level (or the sheet's convention), full body with feet included, deep focus, centered.

**Variations of one character on white** ("four variations of this character") are not a sheet. Each of the four gets its own expression and its own single, simple gesture, AND its own camera (full figure, three-quarter, a close-up on the face, a material detail), never a different altitude. Four frames of the same pose and the same face from four distances read as one image; the A/B judges scored that "four near-identical sulks."

**Stylized anatomy stays simple.** Mascots and characters with nonstandard bodies (stubby arms, no legs, a face on an object): each variation gets ONE readable gesture built from the body's simplest shapes (arms raised, arms on hips, one arm waving, leaning back, a hop with both feet off the ground). No crossed arms, no fingers, nothing held in the hand, no foreshortened point at the lens, no limb propping the face. Put the personality in the face, the expression and the material. (Over-described arm poses break small clay characters in render after render.)

---

## BURNED CAMERA SETUPS

These came out of the audit. They aren't banned shots; they're banned DEFAULTS. Each may appear when the brief calls for it, never as filler for "variety."

- The 14mm worm's-eye "towering, conquering figure" hero shot.
- The 85mm profile with split light "carving the face in half."
- The overhead drone or top-down with the subject lying spread on the surface.
- Telephoto voyeur through chain-link, a fence or a fan as the default "wild card" slot.
- "Lying back so [the face/mouth] appears upside down in frame."
- f/1.8 to f/2.8 on every close-up.
- The batch that orders itself low hero, profile close-up, overhead, voyeur.

---

## WHERE THE CAMERA STANDS (witness positions)

Mostly human height. Pick the one that belongs to the world of the brief; invent new ones in the same spirit.

**Rooms:** the doorway of the next room · between the slats of a closet door · from the bed, head on the pillow · in the vanity mirror · a phone propped on the dresser · across the dinner table between the candles · the kitchen pass-through window · from the bathtub · behind the sofa · the stairwell landing (half a floor up, the mildest exit).

**Venues:** the next barstool · behind the bar at bartender height · the booth across · the coat check window · side of the stage behind the monitor wedge · the dressing room mirror ringed with bulbs · the ring apron at canvas height · the bench on the sideline · inside the crowd at shoulder height · the back of the line · through the ticket booth glass.

**Street:** across the street through traffic · from inside the laundromat through its window · the bus shelter glass · the passenger seat of a parked car · the corner store doorway · over the hood of a car · the subway platform across the tracks · a fire escape one floor up (an exit).

**Vehicles:** the driver's seat into the rearview mirror · the back seat between the headrests · the motorcycle tank · the train seat facing her · the truck bed · the cockpit jump seat.

**Work and craft:** over the workbench at the maker's eye line · the next sewing machine · the kitchen line between hanging tickets · from inside the oven, fridge or locker (fisheye) · the surgeon's assistant.

**Outdoors:** in the grass at a lying-down person's eye line · through reeds or tall grass · at the water's surface, half above and half below · from under the porch · from behind the next boulder.

**Object positions (the strangest true places):** inside the cup she's drinking from · the mailbox · the cash register · the mirror she's checking · the TV she's watching · a security camera (an exit, high).

---

## IN V8 MODE

The camera sentence survives compression whole: position, lens, one visible consequence, about 25 to 35 words. Cut the vibes line and midground detail first.

---

## THE MEASURING STICK

`scripts/camera_scan.py` reads local Claude Code transcripts, pulls every batch this skill wrote, and reports height distribution, exits per batch, distance spread, shallow-focus rate, witness positions and burned setups. "Refresh the camera burn list" = run it, propose changes to BURNED CAMERA SETUPS above, and let the user approve before editing.
