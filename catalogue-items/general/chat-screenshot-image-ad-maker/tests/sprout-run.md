# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 5 met. Invented facts: 1.

The brief is clean: it uses the story's own five messages, makes no product mention and keeps the screen generic. It fails because the Follow check is missed, so the story's first line doesn't pick up the hanging message.

## Fix

In the step 'Find what they noticed' or 'End it open', add a rule: if the story's first line repeats the chat, give a replacement opening for the copy (e.g. start at 'I didn't answer.') in FLAGS and count it as passed only once offered.

## Judge list

- Met: The others notice the problem. Nobody sells or cheers.
  Sam: "it's been open since january" / "so are you keeping it or what"; no product named.
- Met: Two to six messages, readable on a phone, three senders at most.
  Five messages, two senders (Sam and narrator), each under 12 words.
- Not met: Thread ends with narrator on the spot, and the story's first line picks it up.
  Ends on Sam's question, but output itself admits the story opens by restating the chat, not picking it up.
- Met: Every message is from the story, or flagged as written for the image.
  "No 'words written for the image' flags. All five messages are the story's own words."
- Met: Names made up, screen like no real app, no face as contact photo.
  "blank grey circle and no photo"; "No ticks, icons, wallpaper, logos, banners or app styling."

## Invented

- other: 7:42 pm (Time stamp made up, but it is a screen detail the brief requires, not a fact.)

## What went in

```text
Story ad (approved; narrator: a customer who agreed, built on
reviews 1 and 3, example only):
In March my partner Sam texted me from the kitchen:
  sam: is the green tub in the cupboard still yours
  me: technically, yes. it's mine
  sam: it's been open since january
  me: i drank it twice. it was gritty
  sam: so are you keeping it or what
I didn't answer. I'd tried a few green powders over the years.
The issue was never what was in them. It was sticking with it.
Sprout is one daily pack of gummies: tear the top, eat them. 60+
ingredients, 21 vitamins and minerals, 6 g prebiotic fiber. No
water, no shaker.

Buyer: the quitter who wants to stick, 28 to 45.
```

## What came out

```text
I can't draw the picture here because no image tool is connected, so this is the brief and a ready-to-paste prompt.

**1. Scene**
A text from someone's partner asking whether the green tub that's been open since January is still theirs, with no reply.

**2. Thread**
One-to-one. Sam is the only person in the story who noticed. Group-chat fit doesn't apply.

**3. Who and when**
- **Sam:** the narrator's partner. Shown as "Sam" with a blank grey circle and no photo.
- **Narrator:** "me", with bubbles on the right and no name shown.
- **Group name:** none.
- **Time on screen:** "7:42 pm"

**4. What they noticed**
The green-powder tub has sat open in the cupboard since January, barely used. This comes from the story's quoted chat: "it's been open since january."

**5. Messages**
1. Sam (left): "is the green tub in the cupboard still yours"
2. Me (right): "technically, yes. it's mine"
3. Sam (left): "it's been open since january"
4. Me (right): "i drank it twice. it was gritty"
5. Sam (left): "so are you keeping it or what"

The thread ends on Sam's question with no reply, which matches "I didn't answer."

**6. Blank version**
Same screen, same top bar ("Sam", blank circle, "7:42 pm"). Five empty bubbles in the same order and sides (left, right, left, right, left), each sized for roughly 5 to 8 words. Leave empty space below the last left bubble.

**7. Line under the image**
Opened in January. Still full.

**8. Flags**
- No "words written for the image" flags. All five messages are the story's own words.
- Confirm "Sam" is a made-up name and not the reviewer's real partner. If it's real, swap it (e.g. "Jo") in both the image and the story.
- Run it as the narrator's own chat. Never present it as a customer's real screenshot.

**9. Image prompt**
Plain smartphone screenshot of a one-to-one text conversation, square 1:1, slightly cropped at the edges, unpolished. Generic messaging screen with a white background. The plain top bar has a blank grey circle and the name "Sam", with a small time stamp "7:42 pm" above the thread. Light grey bubbles on the left, pale blue-grey bubbles on the right, plain sans-serif text, all lower case as written. No ticks, icons, wallpaper, logos, banners or app styling. Messages in order: left "is the green tub in the cupboard still yours", right "technically, yes. it's mine", left "it's been open since january", right "i drank it twice. it was gritty", left "so are you keeping it or what". Empty space below the last bubble, no reply.

**10. How to make it**
- **Best option:** type the five messages into plain bubbles in any design tool and export a 1:1 PNG, so every word is exact.
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** paste the prompt into a chat and ask for the picture. Free plans have tight daily limits. Codex on a paid ChatGPT plan can also make it.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` (platform.openai.com/api-keys) or `GEMINI_API_KEY` (aistudio.google.com/apikey) saved, I can send the prompt to that API and save the file. Each picture is billed by OpenAI or Google.
- **If an image tool makes it:** check every message letter by letter.

**11. Score: 83/100** (5 of 6 checks passed: 5/6 × 100 = 83)
- **Follow (missed):** the approved story opens by restating the same chat ("In March my partner Sam texted me…") instead of picking up the hanging question. Opening the copy at "I didn't answer." would fix this. I haven't changed it because the text is approved.
```
