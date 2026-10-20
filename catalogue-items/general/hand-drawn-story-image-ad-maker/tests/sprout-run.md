# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run gives a clear three-panel wordless brief that repeats one frame, ends unresolved, keeps the stomach and product out, and flags the missing brand brain. The image prompt is ready to paste and nothing is invented.

## Judge list

- Met: Every panel shows the same place from the same angle.
  "An office desk seen from the side at seated height. A wall clock reads 3:00 in every panel"
- Met: The panels follow your story's order, and the last one stays unresolved.
  Push, habit, then "open end... Nothing has changed for the figure." Matches the story's push then habit.
- Met: There are no words, captions or speech bubbles in the drawing.
  WORDS ON IMAGE none; prompt says "no words, lettering or logos".
- Met: No panel shows the product, a cure, a body diagram or a doctor.
  "Sprout gummies are left out of every panel." Tubs are unlabeled; no doctor or diagram.
- Met: It looks like a page from someone's notebook, not polished art.
  "Phone photo of a page from a lined office notebook... blue ballpoint, uneven ink"

## What went in

```text
Story ad (approved; narrator: a customer who agreed, example only):
Every day at 3pm I'd push my chair back from my desk and wait
for my stomach to settle.
I'd tried fiber powders. I'd tried probiotics. Nothing stuck.
Sprout is a daily pack of gummies with 6 g prebiotic fiber. It
supports digestion and gut health.

Buyer: the gut-fix seeker, 25 to 55, mostly women, office jobs.
Body limits: never show the stomach.
```

## What came out

```text
I can't make pictures in this chat, so this is the brief and image prompt. How to finish it is at the end.

```
SCENE             A ballpoint sketch in an office notebook: three panels of the same person at the same desk at 3pm, chair pushed back, while the tubs on the desk pile up.
THE FRAME         An office desk seen from the side at seated height. A wall clock reads 3:00 in every panel and a window sits behind the desk.
PANELS            3
                  1 (push): chair pushed back from the desk, figure leaning back and staring at the ceiling, nothing on the desk but a keyboard and a mug.
                  2 (habit): same posture, one plain unlabelled tub and a shaker bottle now on the desk corner.
                  3 (open end): same posture, three plain tubs and a pill bottle in a row, the shaker still there. Nothing has changed for the figure.
FIGURE            A simple made-up adult with dot eyes, short dark hair in a low bun, a plain cardigan over a shirt and dark trousers. Arms rest on the chair arms, never on the body.
DRAWN WITH        Blue ballpoint on lined notebook paper, the kind on any office desk.
WORDS ON IMAGE    none
LINE UNDER IMAGE  Every day at 3pm, the same. (plain caption, 27 characters)
FLAGS             The stomach is never shown, and no hand rests on the belly or middle. The problem shows only through the pushed-back chair, the stare and the growing pile of tubs.
                  The tubs carry no labels, so no rival brand appears. Sprout gummies are left out of every panel.
                  MISSING: brand brain (any body limits beyond the stomach, and the words allowed near the image).
                  MISSING: narrator details (an office worker is [inferred] from the story).
IMAGE PROMPT      Phone photo of a page from a lined office notebook lying on a wooden table, edge of the table visible. Three hand-drawn panels across the page in blue ballpoint, uneven ink, no words, lettering or logos. Each panel repeats the same frame: a side view of an office desk, a wall clock reading 3:00, a window. A simple adult figure with dot eyes, hair in a low bun, plain cardigan, sits with the chair pushed back from the desk, leaning back, staring at the ceiling. Panel one: empty desk. Panel two: one unlabeled tub and a shaker bottle on the desk. Panel three: three unlabeled tubs and a pill bottle, figure unchanged. Square 1:1.
CHECKS MISSED     none
```

How to finish it:
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** paste the image prompt into a chat and ask for the picture. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, the prompt can be sent to that image API and the file saved. Each picture is billed.
- **Pen and paper:** the most real-looking option is to draw it yourself or pay an illustrator, then shoot it on a table with your phone. Agree in writing that you may use it in ads.
```
