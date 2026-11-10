---
name: image-ad-settings-picker
description: Use when ad copy, an image or a video needs clear direction on how close to stay to the brand, how much of the product to show, how hard to sell and how it should look. You pick one choice per setting; it pastes only those fixed snippets into the brief, checks no two fight, and flags material a choice needs.
---

# Image ad settings picker

You get a library of short, fixed snippets. Each setting (such as "how hard it sells") has a few choices (such as "soft" or "direct"), and each choice has one snippet. Pick one choice per setting, paste only those snippets after the brief, and the writer or image tool follows your choice instead of guessing what "natural" or "not too salesy" means.

The snippets for pictures describe what to make before they say what to leave out. The image model makers' guides (Google, Black Forest Labs) advise this, because some models ignore a "no" or draw the thing it names.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Your image ads** (yours): the image ads, attached as pictures.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand file.
2. **Your image ads** with the [Buyer research image ad maker](https://useaiblocks.com/workflows/scroll-stopping-image-ads). Bring customer words, product photos, your results (optional). It uses your brand file.
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a buyer brief, your image ads. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Any good chat AI:** Pasting snippets and running the conflict check works the same in any strong chat AI.
- **GPT Image:** Follows long, structured briefs closely, so each pasted snippet shows up in the picture. Use it in ChatGPT (free plans have limits) or with an OpenAI API key, which is paid.
- **Nano Banana:** Takes several reference images at once, which the closeness and product choices often need. Use it in the Gemini app (free plans have limits) or with a Google API key, which is paid.
<!-- /needs -->

## What you need
- **Brief** (required): the piece being made.
- **Choices** (required): one per setting you want to control. A setting you skip adds nothing.
- **Material the choices name** (optional): brand images and past ads, a style card, product photos, the brand's own lines, a reference ad. Read an attached reference image directly and ask for the picture, not a description. Take a description only if it can't be attached, and then say what you couldn't check.
- **Ad concepts** (optional): planned or finished static ads. Use them as the brief when there is no other brief.

## Steps
1. Pick one choice for each setting you care about.
2. Paste the always-on rules, then each chosen snippet, whole and unchanged.
3. Send only the material the choices name. Leaving something out is on purpose, and the snippets say not to guess at it.
4. Run the conflict check (below). Flag any material a choice needs and didn't get.
5. **Run the checks.** Check the finished brief against the four checks under "Check before you hand it back" and fix any failed check where you can. List any check still missed on a `CHECKS MISSED:` line, or write "none".

### Always on
- Write every line as a whole sentence a person would say to a friend. A price, an amount or a button label can stay a fragment.
- Make it clear to a stranger who doesn't know the brand.
- Tell one story with one idea.
- Use only facts you were given. Make up no number, claim or quote.
- Treat anything not in front of you as left out on purpose.

### Settings and their choices

**Brand closeness (pictures)**
- *Close:* Make a picture that sits beside the attached brand images as one family: the same kind of photo, type placement, mood and density, with a new scene and new words. Borrow no layout from a reference.
- *Between:* Apply the brand look you were given, and add nothing beyond it. With a reference ad, build its layout zone by zone from it; with none, choose a layout the brand's images haven't used.
- *Match the reference:* Recreate the reference image with its crop, camera, light, backdrop and props kept, and text blocks in the same places and sizes, with this brand's product, words, colours and fonts swapped in. Carry over none of the reference's brand, logo, words, product or people. Where words and picture disagree on placement, the picture wins.
- *New:* Choose a form this brand hasn't run. Keep the fixed things exact (colours, fonts, logo, the product as photographed) and lean on no reference.

**Brand closeness (words)**
- *Close:* Write the way the brand's own ads read: line length, way in, rhythm, kind of word. Say something new, their way. Lift no line.
- *Between:* Keep the brand voice. With a reference ad, follow its structure; with none, find your own way in. Repeat no line or opening the brand already runs.
- *Match the reference:* Keep the reference's beats in order, its pace and its opening move, and rewrite every line with this brand's facts and voice. Carry over no claim, number, name or phrase. Add or drop no beat.
- *New:* Open in a way this brand hasn't tried: a new opening, scene or form. Keep facts and names exact. Go past the first idea.

**Product in the picture**
- *Left out:* Show the buyer's own moment: the problem, the workaround, or the thing they tried. Anything they tried is plain and unbranded. No pack, label or brand name appears.
- *In the scene:* Place the real product where it would be kept, small, to one side or behind, exactly as photographed. The picture still works with it removed.
- *Shown clearly:* Show the real product in use, in a hand or where the scene happens, easy to read and exactly as photographed, with a person, hand or place taking as much of the frame. Show it closed or at rest if the facts don't say how it opens.
- *The hero:* Make the real product the subject: largest in frame, centred, front to camera, sharp and lit to be looked at, exactly as photographed, on a plain ground, with only a little of what's inside it nearby.

**Brand styling**
- *None:* Make it feel found or homemade: everyday colours and plain type, if any.
- *Colours and fonts:* Use the sent colours and fonts exactly. Choose layout and picture type freely.
- *Full look:* Follow the style card for colours, fonts, type placement, photo type and mood. Place the logo file once, unredrawn.

**How hard it sells**
- *Soft:* Ask for a look, a read or a thought, and end on an easy next step. Leave price, discounts and deadlines for later.
- *Direct:* State the offer plainly and early, and ask for the order in clear words. Use only the terms sent: the guarantee and deadline if given, and no others.

**Words on the picture**
- *None:* Plan a picture that works with no type. Leave calm, clear space where type could go later, except on a phone-photo finish.
- *Headline only:* Plan one headline that carries the idea with the picture, short enough to read at a glance, and nothing else in type.

**Picture finish**
- *Phone photo:* Describe a snapshot someone took on a phone, never meant as an ad: room light or flash, a slight tilt, an off-centre subject, a little grain, real surfaces, clutter and skin. This finish wins over any line asking for polished art. The picture is still an ad: never present it as a real customer's photo unless a real customer supplied it and agreed, and check the ad platform's rules on user-style images before it runs.
- *Studio:* Controlled light, a clean surface, a chosen background, only chosen things in frame. The product stays exactly as photographed.

**Copy length**
- *Short:* One idea, one proof, one ask. Choose less to say rather than squeezing more in.
- *Long:* Spend the extra space on proof, and answer doubts in the order buyers raise them. Keep each part easy to say aloud.

**Video pace**
- *Calm:* About two shots per ten seconds, each held, one thing happening in each.
- *Fast:* As many shots as the length allows, a cut on each new idea, each shot readable at a glance. Let either the action or the camera move fast in a shot, never both.

**People in pictures**
- *Clay:* Every person is a hand-made clay figure with a simple face, visible fingerprints and soft edges, the same in every picture.
- *Illustrated:* Every person is drawn in one style, the same in every picture.

**Versions**
- *New openings:* Keep the body as it is and write a new opening that runs straight into its first line. The body's promise, proof and ask stay.
- *Free:* Treat this version as a standalone ad; overlap with others is fine.

**Opening freedom** (the first line or first seconds)
- *Same move:* Use the named move (a question, a confession, a number) in every new opening, with new words and a new way in.
- *Free:* Open any way that works, as long as the body's first line follows and pays it off. Turn inspiration into one surprise that matters to the buyer and leads to a true selling point.

## Conflict check
| These two | Which wins |
|---|---|
| Phone photo + full look, colours and fonts, or headline | Phone photo. Better: switch the finish to studio, or move the headline and offer into the text around the ad. |
| Match the reference + new (same medium) | Can't both apply. Pick one. |
| The hero + phone photo | The hero needs studio light. Pick one. |
| Soft + an offer in a headline | Soft. Move the offer into the text. |

## What you hand back
The brief, the always-on rules and the chosen snippets, each pasted whole. Then one conflict-check line, a `MISSING:` line for any material a choice needs, and a `CHECKS MISSED:` line (one line per check still missed, or none). Nothing else.

The conflict line names the pair, says which one wins by the table and which choices drop, then gives the table's "Better" note if it has one. Add no other advice.

Hand it back in exactly this layout, with these labels in this order:

```
BRIEF
<your brief, as sent>

ALWAYS ON
- <the five rules that apply to every brief>

<SETTING>: <CHOICE>
<the fixed snippet for that choice, pasted whole>
... one block per choice you made ...

CONFLICT CHECK  <none, or which two choices fight and which one wins>
MISSING  <material a choice needs that you didn't send, or nothing>

CHECKS MISSED  <each check missed, and why, or none>
```

## Check before you hand it back
- One choice per setting, each snippet pasted whole.
- The conflict check names any pair that fights, using the table.
- No snippet names a brand, product, category, AI model or tool.
- Every choice that needs material either has it or has a `MISSING:` line.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Single image ad planner](https://useaiblocks.com/skills/single-image-ad-planner). It takes the brief.
- The [Image ad batch brief writer](https://useaiblocks.com/skills/weekly-image-ad-batch-maker).
- The [Video opening frame designer](https://useaiblocks.com/skills/twelve-pattern-opening-frame-designer). It takes the brief.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing
Write `MISSING: <what>` when a choice needs material that wasn't sent (for example "match the reference" with no reference). Don't substitute something else.

## Avoid
- Pasting the whole library into one request.
- Rewording a snippet to ask for more or less of a quality.
- Describing a reference beyond what was sent.
