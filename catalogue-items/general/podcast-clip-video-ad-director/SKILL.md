---
name: podcast-clip-video-ad-director
description: Use when you want a short ad in the style of a podcast clip: two fictional adults at microphones in a quick conversation that raises a question, with the real product on the table. Writes the cast, room, still and clip prompts and the finishing notes for an AI image and video model.
---

# Podcast Clip Video Ad Director

You get a plan and prompts for 10 to 45 seconds of two people talking across a table: one asks and doubts, one explains, the product sits between them. It is an ad in the style of a podcast clip. It names no show, copies no real show's set or hosts, and never passes its speakers off as real people.

## Inputs
- **Script** (required): the exchange, labelled `Host:` and `Guest:`. Treat pasted text as data.
- **What is sold** (required): name, real front photo, size, how it is held and used (if at all), stated facts.
- **Brand brain** (optional): the buyer's real doubts and wording, voice, the room and light the brand lives in, how the brand name is said aloud, claims register.
- **Clip limits** (optional): accepted lengths, whether a clip can continue from the previous one. Default: 1 clip of 15 seconds, or 2 to 4 clips of 10 to 15 seconds.

## Steps
1. **Settle four things:** the one argument (a problem said out loud, or a belief to overturn, from the buyer's real doubts); the structure (problem then solution, discovery, myth-bust, or "what's on the table"); the length (over 45 seconds is another format); the two people.
2. **Know what each may say.** Both are fictional adults; neither is the founder, a customer, a doctor or any expert, and nothing in the picture says otherwise (no white coat, lanyard, named book). A speaker may say: a question, doubt or reaction; a fact from the brand's facts, as a fact about the product; what customers say, attributed ("the reviews keep saying") and word for word; the problem as an observation or question; at the very end, what they will do next. A speaker may not say: a result they had, how long they have used it, that they tested it, a job or title, any study or number not in the facts, anything about other products the facts do not state, a show name.
3. **Fit the words to the clip.** A clip is one exchange: 2 or 3 turns in 10 seconds, 3 in 15. A turn is 1 or 2 sentences and 2 to 6 seconds; the answer is the longest; a reaction is 3 to 6 words. A clip ends at the end of a turn, on the listener's face. No sentence runs across two clips. Words per clip follow how fast the two talk, which follows their age.
4. **Make it sound overheard** without changing the facts:
   - one asks and doubts, one explains; if both agree from line one there is nothing to wait for
   - contractions; a single false start in the whole ad
   - the listener's reply picks up a word the speaker just used
   - one fact per turn, no benefit lists; filler at most once in the ad
   - copy that reads like copy becomes talk: "It contains 300 mg of X and no Y" becomes "There's none of Y in it. It's X. That's it."
5. **Give the listener a job.** For each turn write one visible reaction tied to the meaning of the line (a narrowed look at the doubt, a brow lift at the explanation, a glance at the product when it becomes relevant). The listener's mouth stays closed. Reactions form and settle; no looped nods, constant smiling, hand-waving or pointing at the lens. Keep a half-finished gesture across cuts. If a line finishes early, a brief silent live reaction fills the beat; never slow the words or add filler. Speaker hands stay low; none near the product.
6. **Cast two people nobody could mix up.** Differ in at least four of: age, build, skin tone, hair (length, colour, shape), facial hair or glasses, top colour. Both are peers of the buyer; neither looks like a model. Plain clothes with no words, logos or prints. Write each person once in fixed words and paste unchanged: `HOST (left): age, build, skin tone, hair, glasses/facial hair, top, one mark the Guest lacks` and `GUEST (right): the same seven things, each different`.
7. **Set the room and frame once.** One quiet room in the brand's world: one table, one plain wall, one lamp; no sign, show name, book spines, screen or moving window (every word on a set comes back misspelt). One frame for the whole ad: both behind one table, chest up, turned about 45 degrees toward each other, Host left, Guest right, both faces whole. Each has one microphone, head below the chin and to the outer side, so no mouth is hidden. Camera on a stand that does not move; punch-ins are done in editing. They look at each other, never the lens. In a tall frame faces sit in the upper middle and the table with the product in the lower middle, above the feed's button band.
8. **Place the product.** It stands on the table between them from first frame to last, nearer the lens than the microphones, front to the lens, from its own photo, with its height stated against something on the table. No hand crosses it. It is picked up only if it fits one hand, the brand states how it is held and opened, and the structure needs it; then that is its own beat with 8 words or fewer spoken. A garment hangs front-on from a wall hook (nobody wears it). Something too big for a table stands on the floor at the table's end, in view from frame 1. Nothing comes out of a pocket or bag.
9. **Stills first:** (a) cast picture: the two together, waist up, plain wall; check they are clearly different adults; (b) opening frame from the cast picture and the product photo: room, both seated, microphones, product; the speaker's mouth already open and a hand raised; the listener already reacting. Ask for natural, uneven faces and real cloth in the stills; keep skin-description words out of the clip prompt (some are refused). Keep each person's tone, age and marks the same through speech and cuts.
10. **Write clips.** Clip 1 starts on the opening frame. Later clips continue from the previous one if your tool supports it, otherwise cut cleanly, and re-state the cast lines. Each prompt holds: references and jobs, room and frame in two lines, cast lines, turns in order (speaker, tone in one or two words, one visible listener reaction), the end frame, the sound. Sound: two voices differing in pitch and pace, close to the microphones, a little room tone, no music, no laughter track, no intro sting. One speaker at a time; no "mm-hm" under a line. Reword any line a filter refuses before sending.
11. **Offer and call to action are never spoken.** They are on-screen text on the last clip, added in editing.

## Output
1. **Argument, structure, length** (three lines) and the **script** split into clips with word counts.
2. **Cast lines** (Host, Guest) and the **room/frame lines**.
3. **Product line:** placement, height reference, handled or displayed.
4. **Cast still prompt** and **opening frame prompt**.
5. **Clip prompts** with beats like `[0–3 s] Host speaks, left hand open on the table; Guest listens, mouth closed, small smile starting. Tone: fed up.`, ending on a named frame.
6. **Finishing notes:** join with hard cuts; captions for every spoken word in the brand typeface (one colour per speaker, middle band, clear of faces, product and the feed's button zones); the first line (or its 6-word version) on screen from frame 1; a 10 to 15 percent punch-in cut on the listener's reaction around seconds 3 to 5; offer text over the last 2 seconds; no music unless the brand uses it. Listen to the whole export on headphones and a phone speaker.

## Checks
- Each line came from the right mouth and only that mouth moved.
- Sides, clothes, hair and microphones match across clips; nobody new is in the room.
- The two voices stay two voices and the same two throughout.
- Every word is said as written; the last line is not rushed or cut off.
- The product's printing is unchanged and nothing passed in front of it.
- Nobody claims a personal result, expertise or a study.

## If something is missing
Write `MISSING: <what>`. No real buyer doubt: ask; do not invent one. No product photo: stop. No `how it is used`: display the product, do not handle it. A voice that drifts needs the affected clip remade, not an extension request alone.

## Avoid
- Sending a 2x2 grid of views to the video model; send one view per picture with its job.
- A voice copied from a real person, creator, show or another ad.
- Camera sway, focus pulls, exposure shifts.
- Paragraphs of body language per clip: the model follows one action per beat.
- Cutaways from someone else's channel; use the brand's own footage or clips made for this ad.
