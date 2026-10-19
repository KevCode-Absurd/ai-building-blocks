# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable brief: the note is lifted exactly from the story, with no product or claim, and a generic screen with a design-tool build and a ready image prompt. The owner gets a caption and finishing steps, and the inferred time is flagged.

## Judge list

- Met: The note agrees with the story and is the narrator's own.
  Lifted exactly: "greens streak / day 1: done / day 2: done / day 3: forgot / day 4: back to day 1".
- Met: No product, result or claim appears in it.
  Note has only day counts; no product name or result.
- Met: It's 30 words or fewer and doesn't read as written for an audience.
  "Word count: 17" (actual about 16 words); plain private note.
- Met: The screen looks like no real phone's notes app.
  "no app icons, no brand styling, not any recognisable phone or app".
- Met: Every word in the picture matches the note exactly.
  Prompt quotes the four lines and title exactly; "check every word against section 4".

## What went in

```text
Story ad (approved, built on reviews 1 and 2):
I found this in my notes app last week:
  greens streak
  day 1: done
  day 2: done
  day 3: forgot
  day 4: back to day 1
I'd restarted that note more times than I can count.
I've tried a few green powders over the years. The issue was
never what was in them. It was consistency.
Sprout is one daily pack: tear the top, eat the small handful of
gummies inside. One reviewer put it this way: "It's wild I WANT
to take [Sprout] and don't forget."

Buyer: the quitter who wants to stick, 28 to 45, office jobs.
```

## What came out

```text
I can't draw the picture here because no image tool is connected, so this is the brief and prompt for you to finish elsewhere.

**1. Scene**
A plain phone note called "greens streak" that logs days 1 to 3 and then ends with "back to day 1."

**2. Shape**
Streak. The story quotes a day-count note that resets to day 1, and says the narrator "restarted that note more times than I can count."

**3. The screen**
- **Layout:** Generic notes screen with a white background. A bold title line sits at the top, with four plain left-aligned lines beneath it and lots of empty space below.
- **Status bar:** Shows only the time, 7:42. There are no carrier marks, real-phone icons or app chrome.
- **Font:** Plain sans-serif. The title is bold and the lines are regular weight.
- **Crop:** Square 1:1, cut a little at the bottom like a shared screenshot.

**4. Words on the image**
- Title: `greens streak`
- `day 1: done`
- `day 2: done`
- `day 3: forgot`
- `day 4: back to day 1`

Word count: 17 (title 2, lines 15).

**5. Blank version**
The same screen with only the title "greens streak," the status-bar time and empty space beneath.

**6. Line under the image**
how many day 1s this year? (26 characters)

**7. Flags**
- **Lifted:** The note is copied exactly from the story, with the same lower case, colons and line order.
- **Inferred:** The time (7:42), the white background and the bottom crop were chosen for the image.
- **Left out:** The note doesn't name the product, show a product image or state a result.

**8. How to make it**
**Best: build it in a design tool** (Figma, Canva or similar) with the words set as real text so nothing is misspelt.
1. Make a 1080×1080 white frame.
2. Add a thin status bar with "7:42" only.
3. Set the title "greens streak" in bold sans-serif at about 44px, with left margin around 60px.
4. Set the four lines in regular weight at about 34px, with generous line spacing.
5. Leave the lower half empty and crop the bottom edge slightly.
6. Export as PNG.

**Next best: image tool prompt**
> Square 1:1 screenshot of a generic phone notes app, cropped slightly at the bottom like a shared screenshot. Plain white background, no app icons, no brand styling, not any recognisable phone or app. Thin status bar at the top showing only the time "7:42". Below it, a bold title line in a plain sans-serif font: "greens streak". Under the title, four plain left-aligned lines in regular weight, exactly: "day 1: done", "day 2: done", "day 3: forgot", "day 4: back to day 1". Lots of empty white space beneath the text. No other words, no logos, no buttons, no products, no people. Flat, ordinary and unstyled, like a real screenshot someone took of their own note.

Afterwards, check every word against section 4.

**9. Score**
Score: 100/100 (6 of 6 checks)

**How to finish it**
- **ChatGPT or Gemini:** Paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** If you have `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. OpenAI or Google bills each picture. You can get keys at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google).
```
