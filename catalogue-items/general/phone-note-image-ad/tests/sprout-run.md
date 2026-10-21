# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run gives a clear, usable brief for a plain phone-note screenshot using the narrator's own lines with no product or claims. It sets out a design-tool build and a fallback prompt, and flags what it assumed (the time, sizes, crop).

## Judge list

- Met: The note agrees with the story and is the narrator's own.
  Lines lifted exactly: "greens streak / day 1: done ... day 4: back to day 1" from the approved story.
- Met: No product, result or claim appears in it.
  Note holds only a title and day counts; no product name, result or claim.
- Met: 30 words or fewer and doesn't read as written for an audience.
  Stated "(17 words)"; actual count is about 16. Lines are plain, lower-case, personal.
- Met: The screen looks like no real phone's notes app.
  Generic white screen, neutral sans-serif (avoids SF Pro and Roboto), no icons, toolbar or brand colours.
- Met: Every word in the picture matches the note exactly.
  Prompt quotes "greens streak" and the four lines identically to section 4; says to check each word.

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
I can't make images here, so you'll get the build and the prompt, with how to finish it at the end.

**1. Scene**
A screenshot of someone's plain phone note counting a "greens streak" that collapses on day 3 and goes "back to day 1."

**2. Shape**
Streak. The story quotes a day-count note that keeps resetting, and the narrator says they'd "restarted that note more times than I can count." The reset line is the sting.

**3. The screen**
- **Size:** square 1:1, 1080 × 1080.
- **Background:** plain white.
- **Status bar:** the time "7:12" only, small, top-left. No carrier name, battery icon or signal icons in any recognisable style.
- **Title:** bold, black, left-aligned, about 48 px, with a left margin of about 64 px. It sits in the upper third.
- **Lines:** regular weight, black, about 40 px, with generous line spacing.
- **Font:** a neutral sans-serif such as Inter. Avoid SF Pro and Roboto, because they point to a specific phone maker.
- **Space and crop:** lots of empty white below the last line. The image is cut off a little at the bottom, as if someone cropped the screenshot by hand. The crop goes through empty space, not through text.
- **Nothing else:** no toolbar, no app icons, no cursor, no keyboard.

**4. Words on the image** (17 words)
```
greens streak
day 1: done
day 2: done
day 3: forgot
day 4: back to day 1
```

**5. Blank version**
The same screen with only the bold title "greens streak" under the status bar, and the rest empty white.

**6. Line under the image**
Ever restarted this note? (25 characters)

**7. Flags**
- Title and all four lines are lifted exactly from the approved story. Nothing was written for the image.
- [inferred] The time "7:12" (a morning, when a daily habit would be checked).
- [inferred] The crop amount and the type sizes.
- MISSING: brand brain. This doesn't affect the image, because it carries no brand look, product or claim.

**8. How to make it**

*Best: design-tool build (Canva or Figma)*
1. Make a 1080 × 1080 white frame.
2. Add "7:12" as small text at the top-left as the only status-bar element.
3. Type the title and four lines as live text, using the sizes and margins in section 3.
4. Leave the lower half empty, and trim the bottom edge slightly unevenly.
5. Export as PNG.
6. Duplicate the frame and delete the four lines to make the blank version.

*Fallback: image prompt*
> A square 1:1 phone screenshot of a plain, generic notes app, cropped slightly at the bottom like a shared screenshot. White background, black plain sans-serif text, no app icons, no brand colours, no recognisable phone or app design. A minimal status bar at the top shows only the time "7:12". Below it, a bold title line: "greens streak". Then four plain lower-case lines, left-aligned, exactly: "day 1: done" / "day 2: done" / "day 3: forgot" / "day 4: back to day 1". Lots of empty white space below the text. No other words, no logos, no product, no buttons, no keyboard. Flat, unstyled, real-looking, like a personal note.

If you use the prompt, check every word in the result against section 4, character by character.

**9. Checks missed**
none

---

**To finish it:**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. You can also paste this whole skill there so it writes the prompt and makes the picture in one go. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the file. Get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? Bring the image prompt above, or tell me what you'd like to do next.
```
