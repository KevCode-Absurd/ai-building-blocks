# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

A clean, faithful brief: the note is lifted exactly from the approved story, with no product or claim, and the build steps are practical. The owner can hand it straight to a designer or image tool.

## Judge list

- Met: The note agrees with the story and is the narrator's own.
  Lines copied exactly from the story's quoted note: "day 4: back to day 1".
- Met: No product, result or claim appears in it.
  Note only has "greens streak" and day lines; Sprout appears nowhere in it.
- Met: It's 30 words or fewer and doesn't read as written for an audience.
  Stated 17 words; actual count is about 16, still well under 30; plain private note.
- Met: The screen looks like no real phone's notes app.
  "generic signal and battery shapes... No real phone's icons"; no app chrome.
- Met: Every word in the picture matches the note exactly.
  Prompt quotes the same title and four lines exactly as in section 4.

## Invented

- other: 8:47 (Time is flagged as inferred, which the skill allows; not a Sprout fact.)

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
**1. Scene**
A screenshot of someone's plain phone note called "greens streak," where the day count goes back to day 1.

**2. Shape**
Streak. The story quotes a day-count note that resets ("day 4: back to day 1"), and the narrator says they'd "restarted that note more times than I can count." It is the restart pattern for something people use up.

**3. The screen**
- **Format:** Square 1:1, styled as a cropped personal screenshot.
- **Status bar:** A thin generic bar showing the time **8:47** on the left and plain generic signal and battery shapes on the right. No real phone's icons.
- **Note view:** An off-white background with no app chrome. At most there is a small, unbranded back arrow at the top left.
- **Title:** "greens streak" in bold, a size up from the body, left-aligned.
- **Body:** Four plain lines in a neutral sans-serif in dark grey. Left-aligned, normal line spacing, no bullets or checkboxes.
- **Space:** Wide margins and a lot of empty space below the last line.
- **Crop:** The bottom is cut off a little, leaving blank note area with no keyboard or toolbar. It should read as a quick share, not a framed mockup.
- **Excluded:** No logo, product, packaging, brand colour, price or button.

**4. Words on the image**
```
greens streak
day 1: done
day 2: done
day 3: forgot
day 4: back to day 1
```
Word count: 17 (title 2, lines 3 + 3 + 3 + 6).

**5. Blank version**
The same generic note screen with only the bold title "greens streak," the status bar showing 8:47, and empty space below.

**6. Line under the image**
Ever restart the same note? (27 characters)

**7. Flags**
- **Lifted:** The note is copied word for word, in lower case, from the approved story ad. No line was written for the image.
- **Inferred:** The time 8:47 (a morning, before work, which fits office-job buyers), the off-white background, the dark-grey text and the bottom crop.
- **Product:** It is absent from the note and the screen. Sprout appears only in the ad text.

**8. How to make it**
**Best (design tool):** Build a 1080×1080 frame in Figma or similar.
1. Fill the frame with off-white (#FAF9F6).
2. Add a 44px generic status bar with "8:47" in a neutral sans-serif (e.g., Inter) at the left and simple grey signal and battery shapes at the right.
3. Set the title "greens streak" in Inter Bold at about 44px, about 96px from the left edge.
4. Set the four lines as live text in Inter Regular at about 34px in #333, with 1.4 line spacing.
5. Leave the lower half empty and crop the bottom edge so the note looks like it continues.
6. Proofread every character against section 4 before export.

**Next best (image tool prompt):**
"A cropped square screenshot of a plain, generic phone notes screen, not any real brand of phone or app. Off-white background, thin status bar showing the time 8:47 with simple grey signal and battery icons. Bold title at top left reading exactly: 'greens streak'. Below it, four plain left-aligned lines in a neutral sans-serif, dark grey, reading exactly: 'day 1: done', 'day 2: done', 'day 3: forgot', 'day 4: back to day 1'. All lower case. Lots of empty space underneath, bottom edge slightly cut off like a shared screenshot. No logos, no products, no keyboard, no checkboxes, no colour accents, no hands, no phone frame."
After generating, check every word letter by letter against section 4. Regenerate or fix the text in a design tool if anything is wrong.
```
