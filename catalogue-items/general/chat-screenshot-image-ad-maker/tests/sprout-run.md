# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

The run turns the story's own chat into a clean five-message screenshot brief with no invented facts. It flags the assumed time stamp, offers a fitting replacement story opening, and lists what's missing.

## Judge list

- Met: The others notice the problem. Nobody sells or cheers.
  Sam: "it's been open since january"; "so are you keeping it or what". No product named, no cheering.
- Met: Two to six messages, readable on a phone, three senders at most.
  Five messages, two senders (Sam and narrator), each under 12 words.
- Met: Thread ends with the narrator on the spot, and the story's first line picks it up.
  Ends on Sam's question; offers replacement opening "I didn't answer." in Flags.
- Met: Every message is from the story, or flagged as written for the image.
  "Words written for the image: none. All five messages are the story's own words."
- Met: Every name is made up, screen looks like no real app, no face as contact photo.
  Blank grey circle, no ticks/wallpaper/icons. Sam is a made-up name; run asks to confirm.

## Invented

- other: Tue 7:42 PM (Time stamp not in the story, but marked [inferred] and flagged as assumed.)

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
I can't make images in this chat, so you'll get a ready-to-paste prompt and how to turn it into the picture.

**1. Scene**
A text from someone's partner asking if they're ever going to deal with the green powder tub that's been open since January.

**2. Thread**
One-to-one. One person, Sam, noticed a habit only a partner would see. Family-in-story and group-chat fit don't apply.

**3. Who and when**
- **Sam:** the narrator's partner, shown as "Sam" with a blank grey circle.
- **Me:** the narrator, on the right with no name shown.
- **Group name:** none.
- **Time on screen:** "Tue 7:42 PM" `[inferred]`. The story only says March, from the kitchen.

**4. What they noticed**
The tub has been open since January and is barely used. This comes straight from the story's quoted chat: "it's been open since january."

**5. Messages**
1. Sam (left): "is the green tub in the cupboard still yours"
2. Me (right): "technically, yes. it's mine"
3. Sam (left): "it's been open since january"
4. Me (right): "i drank it twice. it was gritty"
5. Sam (left): "so are you keeping it or what"

It ends there, with Sam's question unanswered.

**6. Blank version**
- Same square screen: top bar with "Sam" and a blank grey circle, and the time stamp above the thread.
- Five empty bubbles in the same order: left, right, left, right, left.
- Each bubble is sized for one short line, with nothing after the last left bubble.

**7. Line under the image**
"Technically, still mine." (24 characters)

**8. Flags**
- **Words written for the image:** none. All five messages are the story's own words.
- **Story opening:** the approved story opens by retelling the same chat ("In March my partner Sam texted me from the kitchen:" followed by the five lines), so the copy repeats the picture. Replacement opening that picks up from Sam's last message: **"I didn't answer."** Then run straight on: "I'd tried a few green powders over the years…" and the rest of the story unchanged.
- **Names:** the narrator is a real customer. Confirm "Sam" is a made-up name, or swap it in both the story and the screen. Present this as a recreated chat, never as the customer's real screenshot.
- **Time stamp:** "Tue 7:42 PM" is assumed. Change it if you like.

**9. Image prompt**
Square 1:1 phone screenshot of a plain, generic text chat, slightly cropped at the edges, unpolished. Top bar shows only the name "Sam" beside a blank grey circle, no photo. Small grey time stamp "Tue 7:42 PM" above the messages. Light grey bubbles on the left, soft neutral beige bubbles on the right, plain white background. No wallpaper, icons, read ticks, banners, logos or real app styling. Left: "is the green tub in the cupboard still yours". Right: "technically, yes. it's mine". Left: "it's been open since january". Right: "i drank it twice. it was gritty". Left: "so are you keeping it or what". Nothing after the last message. Plain system font, lower case exactly as written.

**10. How to make it**
Best is a design tool such as Figma. Type the five messages into plain bubbles and export a square image. If you use an image tool instead, check every message letter by letter.

**11. Checks missed**
Names: "Sam" comes from a real customer's story and isn't confirmed as made up. Confirm it or swap it before this runs.

---

**To finish the picture:**
- **ChatGPT or Gemini:** paste the image prompt and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the file. Each picture is billed. Keys are at platform.openai.com/api-keys or aistudio.google.com/apikey.

**Gaps to fill later:**
- `MISSING:` brand brain (approved on-image words, voice). The [Website brand brain builder](https://useaiblocks.com/skills/website-brand-brain-builder) makes it.
- `MISSING:` how the buyer texts, beyond the lower case shown in the story.
- `MISSING:` the real time stamp, if you want one.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? It takes the image prompt. Or tell me what you'd like next.
```
