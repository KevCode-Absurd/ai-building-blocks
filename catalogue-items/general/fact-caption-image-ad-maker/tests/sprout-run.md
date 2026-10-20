# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable brief: the fact is kept exactly as sourced, the source line is honest about being brand-run, and the picture is a plain captioned phone photo with no news-outlet look. The owner gets clear MISSING lines (the study paper, who ran and funded it) and sensible flags on the ad text's 'against placebo' wording; only small nits remain (the line under the image lacks its type/character-count tag, and the generic colourful gummies are a stand-in rather than Sprout's green bears, which it does flag).

## Judge list

- Met: The number and the wording match the source exactly.
  Caption: "Blood vitamin C up 40.1% (2.7x placebo)" matches the input fact word for word; "40.1% and 2.7x stay exactly as given."
- Met: There's one fact, with a source line you can read.
  One caption, then "Sprout's 2025 study, 120 adults, 12 weeks, double-blind, placebo-controlled" at "small but readable" size.
- Met: It looks like a captioned photo, not a news report or a TV graphic.
  "black at 60% opacity... phone's system font... no outlet name, no ticker, no clock, no brand colour" over a messy kitchen counter.
- Met: Nothing claims more than the source measured.
  "The image says blood vitamin C only, with no folate and no health outcome"; even flags 'absorption' gloss in the ad text.
- Met: It's flagged for a person to check before it runs.
  "A fact on the image: a person checks it against its source before it runs."

## What went in

```text
Story ad (approved; narrator: a customer who agreed, example
only):
I figured gummy vitamins were candy with a label on.
Then I read Sprout's study. 12 weeks, 120 adults, randomized and
placebo-controlled. Blood vitamin C went up 40.1%, and folate up
20.5%, against placebo.
It measured absorption, nothing else. That was the part I'd
doubted.
One daily pack: 21 vitamins and minerals and 6 g prebiotic fiber,
in a small handful of gummies.

Fact: "Blood vitamin C up 40.1% (2.7x placebo)."
Source: Sprout science page. 2025 study, 12 weeks, randomized,
double-blind, placebo-controlled, 120 healthy adults aged 23 to
59.
```

## What came out

```text
I can't make images here, so you'll get the prompt to paste into an image tool. How to do that is at the end.

**1. The fact and its source**
- **As the source states it:** "Blood vitamin C up 40.1% (2.7x placebo)."
- **Who:** Sprout's own study, as shown on the Sprout science page.
- **How:** 12 weeks, randomized, double-blind, placebo-controlled, 120 healthy adults aged 23 to 59.
- **Year:** 2025.
- MISSING: the study itself (paper or report). The Sprout science page is the only source on file.
- MISSING: who ran the study and who funded it.

**2. Source check**
- **Number: pass.** 40.1% and 2.7x stay exactly as given. They are not rounded.
- **Verbs: pass.** "Up" is kept. Nothing says "boosts" or "proves".
- **What was measured: pass on the image.** The image says blood vitamin C only, with no folate and no health outcome.
  - Story flag: the ad text says "went up 40.1%… against placebo." That can read as "40.1% more than placebo." The source says the group rose 40.1%, which was 2.7x the placebo rise. Have a person confirm which one the study means and match the ad text to it.
  - Story flag: "absorption" in the ad text is a gloss on "blood vitamin C". Confirm the study uses that word.
- **Year: pass.** 2025 is within five years.

**3. Scene**
"Someone's hand holding a few gummy vitamins over a messy morning counter, with a caption saying vitamin C went up 40.1%."

**4. Where and when**
- **Place:** a home kitchen counter with a half-drunk mug of coffee, a phone face down, crumbs and a dish towel.
- **Time:** a weekday morning, around 7:30.
- **Light:** soft daylight from a window to the left, slightly cool, with no flash.
- **Camera:** handheld phone at chest height, looking down at about 45° onto an open palm in the upper-middle of the frame. The lower third is calm counter surface.

**5. Words on the image**
- **Caption:** Blood vitamin C up 40.1% (2.7x placebo)
- **Source line:** Sprout's 2025 study, 120 adults, 12 weeks, double-blind, placebo-controlled

**6. The strip**
- **Where:** a full-width band across the lower fifth of the frame.
- **Colour:** black at 60% opacity, with white text.
- **Typeface:** one plain sans serif, such as the phone's system font, Inter or Helvetica.
- **Text sizes:** the caption is about 2× the size of the source line. The source line sits directly below it, small but readable.
- **Left out:** no outlet name, no ticker, no clock, no brand colour.

**7. Blank version**
The same photo with no strip and nothing else added. The lower fifth is plain counter.

**8. Line under the image**
Candy with a label on?

**9. Flags**
- A fact on the image: a person checks it against its source before it runs.
- The study behind the claim isn't on file. Get it before this runs.
- The gummies are generic and unbranded, not Sprout's real product. If you want the real product shown, ask, and it will go small and to one side.
- The ad-text wording "against placebo" needs a person to match it to the study (see item 2).

**10. Image prompt**
Square 1:1 photo taken handheld on a smartphone, looking down at about 45 degrees onto a kitchen counter on a weekday morning. An adult's open palm, ordinary skin, no jewellery, holds four or five plain colourful gummy vitamins. There is no packaging, label or logo. Around it: a half-drunk mug of coffee, a phone face down, a crumpled dish towel and a few crumbs. Soft cool window light comes from the left, with slight grain, no flash and no retouching, and it looks casually snapped. The palm sits in the upper-middle of the frame, and the lower fifth is calm, empty counter surface. No text, no brand colours, no designed layout.
*(Only if the tool must add the strip):* Add a full-width black band at 60% opacity across the lower fifth, with white plain sans-serif text reading exactly: "Blood vitamin C up 40.1% (2.7x placebo)". Below it, in smaller text: "Sprout's 2025 study, 120 adults, 12 weeks, double-blind, placebo-controlled".

Best way to make it: generate the blank photo, then add the strip as real text in Canva or a phone editor so every digit is exact. If the image tool adds the strip, check "40.1%" and "2.7x" digit by digit.

**11. Checks missed**
- The study itself isn't on file, only the brand's science page, so "No 'study finds' without that study on file" is only partly met.
- Follow: I can't confirm the landing page opens on this fact with the full source near the top.
- The ad text's "against placebo" wording may not match the source's "2.7x placebo." It needs a person to check.

**How to finish it**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. You can also paste this whole skill there so it writes the prompt and makes the picture in one go. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. You can get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker), using the image prompt above? Or say what you'd like to do instead.
```
