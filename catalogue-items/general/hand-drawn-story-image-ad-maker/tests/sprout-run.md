# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief is well-made: one repeated desk frame, a faceless figure, stomach never shown, and an open last panel. But it does not follow the output shape, so the owner gets a differently labelled layout.

## Fix

In "What you hand back", require the exact output-shape layout: plain labelled lines (SCENE, THE FRAME ... SCORE) with the SCORE line written as "<passed> / 6 checks x 100 = <score>", and the LINE UNDER IMAGE line giving the line type and character count.

## Judge list

- Met: Every panel shows the same place from the same angle.
  "The desk, clock and angle are identical in every panel."
- Met: The panels follow your story's order, and the last one stays unresolved.
  Push at 3:00, then powder and pills (habit), last: "Nothing has changed for her."
- Met: There are no words, captions or speech bubbles in the drawing.
  "Words on the image: None." and prompt says "No words, no labels."
- Met: No panel shows the product, a cure, a body diagram or a doctor.
  Only generic powder tub and pill bottle, which are the tried habits, not Sprout.
- Met: It looks like a page from someone's notebook, not polished art.
  "lined notebook page... blue ballpoint, uneven ink, a few scribbled-out lines."

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
No image tool is connected here, so this is a written brief; how to turn it into a picture is at the end.

1. **Scene:** A ballpoint notebook sketch of the same woman at the same desk, three times, chair pushed back at 3pm, with more abandoned tubs piling up.

2. **The frame:** An office desk seen from the side and slightly behind, with a wall clock in the top corner and the chair in the middle of the panel. The desk, clock and angle are identical in every panel.

3. **Panels:** 3
   - **Push:** The clock reads 3:00. The figure has pushed her chair back from the desk and sits still, staring ahead. A cup of tea sits untouched and the desk is otherwise bare.
   - **Habit:** Same clock, same 3:00, same chair pushed back. A plain lidded tub of powder with a scoop now sits on the desk.
   - **Habit / open end:** Same clock, same 3:00, same chair pushed back. The powder tub is shoved to the back and a small plain pill bottle has joined it. Nothing has changed for her.

4. **Figure:** A simple made-up adult with dot eyes, short hair and a striped cardigan, the same in every panel. She sits upright with her hands on the armrests. Her posture shows only stillness and waiting. No hand goes to the belly.

5. **Drawn with:** Blue ballpoint on a lined office notebook page.

6. **Words on the image:** None.

7. **Line under the image:** Every day, 3pm, same chair

8. **Flags:**
   - The limit is never show the stomach. Keep hands on the armrests, not the belly. Don't have her hunched over or clutching her middle. The clothes must not draw attention to the waist.
   - The tub and bottle must stay plain, with no labels or lettering, so they don't read as named brands.
   - The narrator is an example only. The figure is a made-up adult, not a likeness of the customer.

9. **Image prompt:**
   > Phone photo of a lined notebook page lying on a wooden office desk, a keyboard edge visible. On the page, three panels hand-drawn in blue ballpoint, uneven ink, a few scribbled-out lines. Every panel repeats the same side view of a desk with a wall clock reading 3:00 in the corner. A simple adult with dot eyes, short hair and a striped cardigan sits with her chair pushed back from the desk, hands on the armrests, staring ahead, tea untouched. Panel 1: desk bare. Panel 2: a plain lidded powder tub and scoop on the desk. Panel 3: the tub pushed aside, a small plain pill bottle added. No words, no labels. Square 1:1.

10. **Score:** 100. All 6 checks passed (6/6 × 100 = 100).

**To finish it:**
- **ChatGPT or Gemini:** Paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can also make it.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** If you have `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. Get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.
```
