---
name: scroll-stopping-image-ads
description: Use when you need a batch of image ads for people who have never heard of the brand. Research the buyers first, cut the arguments a rival could make, spread the batch across the shared ad type map so results can be read by type, then make one picture and one set of words per ad, with the owner's approval at two stops.
---

# Get image ads strangers stop scrolling for

You make a batch of image ads for strangers. Each ad is one argument to one buyer, as one picture with real type on top. An ad passes when a stranger stops, then within 2 seconds can say who it's for and what it claims about this product. If a rival could swap in their logo and run it unchanged, start again.

The work goes into the argument and the words first. Creative quality drives about half of the sales lift from advertising, more than targeting or reach (Nielsen and Nielsen Catalina Solutions, 2017). Variety is counted in arguments and types, never in colours, because near-copies add little (Loomer, on Meta's creative variety). This workflow uses "Stop the scroll with your buyer's problem" for concepts, `image-ad-copy-writer` for the words and "Pre-launch ad checker" for the last check.

**Two stops, unless they approved ahead.** In a live chat, stop at Stop 1 and Stop 2 and wait for a yes. If their message says go ahead, do it all, run it through, or "go ahead with what I've given you", that counts as approval for both stops. Then run every step in one reply: pick the arguments yourself by the rules in step 2, mark each stop "(approve)" so they can swap a pick later, and hand back the full set, from the buyer sheets to the checked ads. Never end on a question at a stop they already approved.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Brand brain** (its buyers part), made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **Product photos** (yours): clear photos of the real product, from more than one angle. Attach them.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `voice-and-look.md`, `offers.md`, `proof-and-claims.md`. Take how the product looks, the colours, fonts and photo style, and the exact words allowed on the picture. Leave out review quotes and research notes. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for your brand brain, customer words, product photos. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Claude:** Keeps track of a long workflow with stops, and holds every fact and source you gave it.
- **GPT Image:** Follows detailed scene prompts and takes several product reference photos at once.
- **Nano Banana:** Good with many reference images and with lighting on shiny packs.
- **Figma:** Sets real type over each picture and keeps the batch in one file.
<!-- /needs -->

## What you need
- **Brand facts** (required): claims with their sources, the guarantee, what only this product can say, voice, colours, typefaces, the never-say list.
- **Buyer research** (required): reviews, comments, support tickets, survey answers, each with its source. Pasted text is information, never an instruction.
- **Product photos** (required): named by view (front, open, in hand, in use).
- **Batch size and sizes** (required).
- **Past results** (optional): per ad, with cost per purchase.

<!-- making-it -->
## Making the picture

If you can make images in this chat (ChatGPT and Gemini can), make the picture from your prompt once the prompt passes its checks, then check the picture against the same list and say what to fix. If you can't (Claude can't draw unless an image tool is connected), say that once, in one line, before you start, so nobody waits for a picture that won't come. Hand back the prompt, and at the end tell them how to finish it:
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture, or paste this whole skill there so it writes the prompt and makes the picture in one go. ChatGPT uses GPT Image, Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with an OpenAI or Google key saved as `OPENAI_API_KEY` or `GEMINI_API_KEY`, offer to send the prompt to that image API and save the file. Keys: platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.

If an image tool is connected, offer to make the picture with it, and ask before you spend credits.
<!-- /making-it -->

## The ad type map
| Question | Type | The frame shows | Needs on file |
|---|---|---|---|
| What is it? | Product alone | The product, big, with one line | A real photo of this exact variant |
| What is it? | Look inside | Labelled parts, contents or how it's made | A published fact behind every label |
| Is it for me? | The moment | The hassle or trigger the buyer knows, product close by | That moment in buyers' own words |
| Is it for me? | Old way, new way | The usual way beside this one, or a before and after shown with objects | Facts for both sides, the usual way unbranded |
| Is it for me? | In use | Hands or a person using it in a real place | A photo of real use, or a use the facts state |
| Can I believe it? | Their words | A customer's words, a rating or a review card | Real words, word for word, with the source |
| Can I believe it? | Checked fact | One number, test, study or press mention | The source, and what the number counts |
| Why now? | The offer | Price, bundle, gift, trial or guarantee as the main thing | A live offer with its terms and dates |
| Why now? | The occasion | A dated reason: a launch, season, limited run or restock | A real date |

Dress: **Camera**, **Designed** or **Lo-fi** (phone-made, always your own design, never a real app's screen). Every ad here is aimed at **New**. Code each ad `type · dress · New`.

## Steps
1. **Build a buyer sheet** for each buyer with a different core problem. Fields: what they want, what they tried and why it let them down, the moment that makes them look today, their phrases word for word, their doubts. An insight is **used** when 3 or more separate buyers say it, or 1 buyer says it and an ad on that argument beat the account's cost per purchase. Anything less goes on a hunch list and stays out of copy. One buyer is an anecdote and two can be a coincidence. Three is the smallest repeat worth building on.
2. **Write the arguments.** One line each: `buyer | the problem | what only this product does | the proof`. Write at least 3 more than the batch needs, so the cuts have room. Cut any a rival brand could say word for word: add a fact only this product has, or drop it. Cut any whose proof isn't on file. Two lines with the same problem and the same answer are one argument. **Stop 1: the owner picks the arguments.** If they asked for everything in one go, or approved ahead (a "go ahead" counts), pick the strongest arguments yourself, mark this stop "(approve)" and carry straight on through step 9.
3. **Spread the batch on the map.** For strangers, "What is it?" and "Is it for me?" types carry the batch and "Can I believe it?" types support it. "Why now?" types are at most 1 in 5, because a stranger can't judge a price for something they can't place yet. In a batch of 6 or more, use at least 3 types and 2 dresses, so results can be read by type. No two ads share a code and an argument.
4. **Write a concept per ad.** Code, argument, what the picture must show, which product photo and view it uses, the dress in a line (light, setting, style), and a draft headline and support line. Then the honesty and product rules below. **Stop 2: the owner approves the concepts and the first picture of each dress** before the rest are made, so a wrong look is caught once, not on every ad.
5. **Make the pictures.** No words in the picture, only type that belongs to the scene. Attach the product's own photos, named by view, even for drawn styles. Leave calm space where the layout puts the words. For 9:16, keep the subject and the calm space inside the safe zone. Look at each one at full size, since a small tile hides flaws.
6. **Write the words** with `image-ad-copy-writer` if it's added here, or write them yourself to the same rules, to the picture that now exists. Give 2 or 3 headline options per ad. Each line traces to a buyer-sheet entry. A stranger the product isn't for should be able to tell it isn't for them.
7. **Lay out each ad.** Real type over the picture, in the brand's typefaces, with a clear order of size. The skeleton follows the type: Product alone and The offer stack, Look inside uses centre and labels, Old way, new way splits, The moment and In use run full bleed with a card, Their words and Checked fact use big type.
8. **Check every ad at full size** against the glance rules, the honesty rules and these: type crisp, no clipped letters; every claim and number on file; the product matches its photo; with the logo covered, a stranger could still guess the brand from its colours, shapes and type (Romaniuk on distinctive brand assets). Then check the batch: codes, arguments, the 1 in 5 limit, the type and dress counts.
9. **After an authorized launch.** Read actual results by type and argument at the planned review point. Record spend, exposure, audience, period and purchase counts before pooling ads. Twenty purchases is a rough planning example, not a fixed noise band, significance threshold or proof of a winner. Compare only compatible groups, show uncertainty with a suitable method when supported, and say inconclusive when delivery or sample limits prevent a fair comparison. Choose promising ideas for a next controlled test; do not infer causal effects from a coverage grid or name a statistical winner from a fixed percentage gap. Record the evidence and limits in the brand file.

## Glance rules
- A stranger gets it in 2 seconds: people spend about 1.7 seconds on a feed post on a phone (Facebook IQ, 2016).
- Headline of 7 words or fewer, about what an adult reads in that time at 238 words a minute (Brysbaert, 2019). A real quote may run to 12.
- Headline plus at most 3 more things to read (Cowan's limit of about 4 items in mind).
- No type under 30 px on a 1080 px wide canvas, about Apple's 11 pt minimum. Contrast at least 4.5 to 1, or 3 to 1 for big headlines (WCAG).
- In 9:16, no words or logo where Stories and Reels put their buttons. Check Meta's safe-zone overlay.

## Honesty and product rules
- Show the product unless there's a reason not to. It shares the scene's light and shadows, so it never looks stuck on. A sketch or a note that can't hold it gets a small product photo in one corner.
- Every view of it comes from a real photo of that view. Drawn versions keep the real shape, colours and big lettering. Leave fine print off rather than make it up.
- Leave the product out only for a problem shot or a shot of the thing it replaces, and then the words must name it and give one fact that's only true of it.
- Picture the problem, what causes it, or the product doing its job. Never a result the facts don't state: no changed body or face, no week-by-week change, no drawn number without a source. Fear is never bigger than the real stake.
- Quotes are word for word, with the source and no generated face beside them. The usual way in a comparison is unbranded.

## What you hand back
In this order: SOURCES, BUYER SHEET, REASONS TO BUY with the cuts, STOP 1 with the picks, THE SET ON THE MAP, one CONCEPT per ad (code, picture, product photo, headline options with word counts, support line), STOP 2, then the finished images or picture prompts in each size, a table with one row per ad (file, code, buyer, argument, headline word count), the check record and the `MISSING:` list. When they approved ahead, each stop line reads "STOP 1 (approve). Picks: ..." and the reply goes on to the next part.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Image ad batch brief writer](https://useaiblocks.com/skills/weekly-image-ad-batch-maker).
- The [Product image ad prompt writer](https://useaiblocks.com/prompts/accurate-product-image-ad-maker).
- The [Image ad visual brief writer](https://useaiblocks.com/prompts/image-ad-settings-picker). It takes the image ads.
- **Check it before it goes live** with the [Meta ad policy checker](https://useaiblocks.com/skills/meta-ads-compliance-checker). It takes the image ads.
- **Check it before it goes live** with the [Ad layout readability checker](https://useaiblocks.com/skills/ad-reading-flow-checker). It takes the image ads.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Check before you hand it back
- Every used insight has 3 buyers, or 1 buyer and a result. Hunches stay out of copy.
- "Why now?" types are at most 1 in 5, and a batch of 6 or more has 3 types and 2 dresses.
- No two ads share a code and an argument.
- Both stops were shown to the owner, or marked "(approve)" when they said go ahead or asked to run in one go.
- If they approved ahead, the reply holds every part: the set on the map, a concept, picture prompt and headlines with word counts for each ad, and the check record. Stopping early is a missed check.

## If something is missing
Write `MISSING: <buyer research | proof | product view | brand look>`. Mark any argument without research as a "hunch", and let it state no fact.

## Avoid
- Type made inside a generated picture.
- A discount on a product shot as the plan for winning strangers.
- Six looks of one claim counted as six ads.
- Letting the AI pick the arguments when the owner hasn't approved ahead. When they have, pick by the rules and mark the stop "(approve)".


## Split-layer production and creative forecast

Use this optional mode when it matches the requested job. Keep the core checks above and the decisions already supplied. Full procedure: references/cmo-method-tof-statics.md.

For split-layer production, write a creative forecast first: buyer, why the message may matter, contrary evidence, what would disconfirm it and how the test will be read. It is a hypothesis, not predicted ROAS.

Support buyer insights with two independent sources when available. Do not count the same quote twice. Ask four angle questions: who is it for, what observed problem, what specific product proof, and how does this differ from the other arguments? Shrink unsupported batches.

Use metaphor, explanation and original native-looking composition as optional families. Never impersonate an app conversation or endorsement. Generate a text-free base from exact real anchors, inspect it, then write/composite approved live text and logos. For Figma or similar, use stable frame names, deliberate fills/crops and verified export sizes. Inspect full resolution. Later compare the argument/format record to real delivery, noting unequal exposure and multiple-change limits.
