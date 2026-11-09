---
name: motion-and-titles-spec
description: Specs short motion pieces to the frame - logo stings, kinetic text timed to voiceover, lower thirds, title and end cards, and animated social posts or loops - as keyframe tables with time in seconds and frames, layers, property changes, easing, sizes, safe margins and export settings, plus build steps for the client's tool (After Effects, Canva, CapCut or similar). Checks reading time against published subtitle speeds and checks flashing and autoplay limits from WCAG 2.2. Use when a client needs motion graphics that an animator or editor can build exactly.
---

# Motion and titles spec

Motion work fails in two ways: the words go by too fast to read, or the animator has to guess what "make it feel premium" means. A keyframe table fixes both. This skill turns the brand and the brief into a frame-accurate spec someone can build in an hour.

## When to use

- A logo sting of a few seconds for the start or end of videos.
- Kinetic text: words or lines timed to a voiceover or music.
- Lower thirds, title cards, chapter cards and end cards for a series.
- An animated social post, GIF or loop.

Not for: 3D or character animation, or copying a known logo animation.

## What you need

- What the motion is for, where it plays, its length and shape.
- The logo as layered vector files (SVG, AI or PDF), brand colours as hex codes, fonts with their licences.
- The voiceover or music file, if timing must match it.
- The build tool and the frame rate of the project (match the footage; YouTube lists 24, 25, 30, 48, 50 and 60 fps as common, checked 6 Nov 2026).
- **Access I have.** Steps 1 to 8 need level 1. Step 9 (building a draft in the client's tool, such as an animated Canva design) needs level 2. Exporting final files to a shared folder or uploading needs level 3 within the client's limits.

## Steps

1. **Set the frame.** Write the canvas size in pixels, the shape, the frame rate and the total length in seconds and frames. Example: 1920 x 1080, 25 fps, 4 s = 100 frames.
2. **List the layers.** Logo parts (symbol, wordmark), each text line, shapes, background, and sound. Name them as the animator will see them.
3. **Write the keyframe table.** For each change: time (seconds and frame number), layer, property (position, scale, opacity, rotation, mask), start value, end value, and easing (ease in, ease out, ease in-out, linear, or a named curve the tool offers). Every move gets a one-line reason ("the symbol settles first so the eye knows where to look").
4. **Hold text long enough.** For any line meant to be read, the time fully on screen is at least its character count divided by 20 seconds, the Netflix adult reading-speed limit, and never under five-sixths of a second. Add time for text that is still moving. Mark each line's count and hold time in the table.
5. **Sync to sound.** If there is a voiceover or music, mark each sync point with its timecode (a word, a beat, a hit) and tie the keyframe to it.
6. **Place titles safely.** For landscape video, keep titles and lower thirds inside a 5% margin from each edge (EBU R 95 graphics-safe). For vertical video, keep text and logos out of the top 14%, bottom 35% and 6% at each side (Meta Reels ad spec, checked 6 Nov 2026). Give sizes in pixels and how long each title stays up.
7. **Check flashing and autoplay.** Nothing may flash more than three times in any one second unless it is below WCAG 2.3.1's thresholds; replace strobes with fades or single cuts. If the piece will autoplay on a website for more than five seconds alongside other content, note that the page needs a pause control (WCAG 2.2.2).
8. **Write build steps and export settings.** Steps in the named tool's own terms. Export: container and codec (for YouTube uploads, MP4 with H.264 and AAC audio), size, frame rate, length, loop or not, transparent background or not (a lower third over other footage needs an alpha channel, so a format that supports it, such as a ProRes 4444 or PNG sequence; confirm with the editor).
9. **Level 2: build a draft.** With level 2 access in a connected tool, build the animation in a new design or project named "DRAFT", without sharing or exporting. Log what you made.

## Checks

- Total length in frames matches the brief.
- Colours are exactly the client's hex codes; fonts are licensed for video.
- Every readable line meets the reading-time floor.
- Titles sit inside the safe margins for every shape.
- No flashing above the WCAG threshold.
- Every keyframe has a reason; nothing copies a known animation.
- Export settings match the destination.

## Output format

1. **Header:** piece, purpose, canvas, frame rate, length (s and frames), tool, access I have.
2. **Layer list.**
3. **Keyframe table:** time (s), frame, layer, property, from, to, easing, reason.
4. **Text table:** line, characters, hold time, position, size.
5. **Sync points** (if any).
6. **Build steps** and **export settings.**
7. **Checks** ticked, and an action log for any level 2 or 3 work.

## Example of good output (short)

*Illustrative structure, not a real business: a bike shop with a 3-second end sting, 1920 x 1080, 25 fps (75 frames), built in After Effects by the client's editor. Access I have: level 1. Copy the shape, never the content: every fact comes from the client's own context.*

| Time (s) | Frame | Layer | Property | From | To | Easing | Reason |
|---|---|---|---|---|---|---|---|
| 0.00 | 0 | Wheel symbol | Scale | 0% | 100% | Ease out | The symbol arrives first and lands softly |
| 0.00-0.80 | 0-20 | Wheel symbol | Rotation | -90° | 0° | Ease out | One turn of the wheel, no spin loop |
| 0.80-1.40 | 20-35 | Wordmark | Opacity and position | 0%, 20 px right | 100%, 0 px | Ease in-out | The name follows the wheel |
| 1.40-3.00 | 35-75 | All | Hold | | | | 40 frames hold so "[Business]" (15 characters here) is readable |

*Text check: 15 characters need at least 0.75 s fully visible; the hold gives 1.6 s. Sound: one bell ring at frame 20 [needs: licensed sound effect]. No flashes. Export: MP4, H.264, 1920 x 1080, 25 fps, plus a version with alpha for overlays, format to confirm with the editor.*
