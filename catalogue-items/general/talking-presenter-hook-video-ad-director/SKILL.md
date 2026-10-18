---
name: talking-presenter-hook-video-ad-director
description: Use when you need 6 to 8 second talking hooks to put in front of an existing ad: one fictional adult presenter says one line to their phone and the real product comes up on a cue word. Writes 2 or 3 hook lines with different levers, the opening still prompt and the clip prompts.
---

# Talking Presenter Hook Video Ad Director

You get 2 or 3 hook lines, each using a different honest lever, plus the opening still and clip prompts to make them with a fictional AI presenter. A hook sells line 2 of the ad body; it has one job: keep people watching so the body gets seen.

## Inputs
- **The ad body** (required): its first spoken line, first frame, who is in it and where. If there is no body yet, the hook is the first clip of a new ad and the script comes first.
- **What is sold** (required): name, real photos by job (front, in hand, in use), scale and handling evidence, how it is used, `Replaces`, `Visible result`.
- **Buyer and brand brain** (required): who they are, what almost stops them, their own words, the moment; brand voice and pace; claims with sources; a real deadline only if one exists.
- **Approved presenter** (optional): reuse if the brand has one.
- **Clip limits** (optional): accepted lengths. Default 6 seconds (8 for a quiet hook).

## Steps
1. **Apply the rules:**
   - the line is written against the body and read aloud with the body's first line before anything is made
   - a generated presenter is a fictional adult who says nothing only a real customer could say; a founder, customer or expert appears only from their own upload; no children
   - the product comes from its photos, is in the opening frame, and is lifted into view on a cue word; the camera does not turn to find it
   - 18 words or fewer, at the speaker's pace; 8 or fewer while the product is lifted
   - every number, date, price or claim is the brand's own; a customer's words word for word with the source
   - it looks like a phone video: one person, one real room, the room's own light
   - voice and sound named; no music
   - it ends on a closed mouth and a still product so no word crosses the join
   - a still first, then one clip, then a batch of 2 or 3; never 10
2. **Pick the presenter** (approved one, or three options from the buyer profile, one chosen and made as one picture). If the body has a real creator, use that creator's own footage or a plainly different person; never a generated look-alike.
3. **Choose a lever per hook** from the list; look at the product first, then choose. A product with a visible action: watch-this, replaces-these, number-first. A gift: for-someone-else, mirror. A doubted category: doubt-first, flip-the-belief, quote-a-customer. An edge that is a number: number-first. Never draft the line first and force the product to fit. Each line starts mid-thought, no greeting, no brand name in the first 3 words, no "so". Mark one cue word near the end.
   - **Mirror:** a habit so specific the right buyer thinks "that's me" (needs the buyer's `Who they are`)
   - **Put it down:** tells the viewer to set the usual thing down (needs `Replaces`)
   - **Open question:** a question the body answers (needs what almost stops them)
   - **Flip the belief:** the opposite of what buyers believe, only if the brand can back it (needs a stated mechanism)
   - **Watch this:** the product's action is the hook and the line points at it (needs `Visible result` and real motions)
   - **Number first:** one fact said plainly, then what it belongs to (needs the sourced number)
   - **Quote a customer:** a real review line as a quote, with its source
   - **Doubt first:** names the objection before the viewer forms it (needs what almost stops them)
   - **Replaces these:** the old things are in frame from the start and slid aside (needs `Replaces` and a claim that it does)
   - **For someone else:** the buyer is not the user (a gift, a household)
   - **Real deadline:** only with a real date and terms in the offer
   - Wildcards, one per batch at most: *quiet aside* (close to the lens, almost whispered, for brands whose voice allows it); *caught mid-task* (the presenter is doing the thing and speaks without looking up at first).
   - Only a real person can say: a confession or near miss, their own result, a family story, a filmed reaction. Leave true details as `[placeholders]` for a real creator.
4. **Choose a pacing per hook.** *Quiet:* low, warm, steady, almost no gesture, product lifted gently, 10 to 14 words (suits quote, for-someone-else, quiet aside). *Fast:* bright, quick, eyebrows moving, one free hand, a small lean in, 14 to 18 words (suits put-it-down, replaces-these, deadline, mid-task). *Direct:* level eyes, even voice, shoulders square, one clear lift, 12 to 16 words (suits mirror, open question, flip, watch-this, number, doubt). The brand's voice decides first; match the body's opening pace; at most one Quiet in a batch. Describe each as what is seen and heard, not a mood word. All start with the mouth opening, no greeting, and end with the mouth closed and the pose held for half a second.
5. **Check each line:** a lever not used elsewhere in the batch; fits the clip with half a second to spare when read aloud; cue word marked; a fictional adult could truthfully say it; every fact in the brand's facts word for word; read with the body's first line it leads in; deadline only with a real date. Name the question or expectation the body pays off and the exact use step or explanation that does so; an unrelated stunt is a different concept, not a better hook.
6. **Shape for 6 seconds:** 0.0 presenter mid-thought, mouth just opening, eyes on the lens, product already in frame low in a hand or on a surface; 0 to 4 the line, face and one free hand doing what the pacing says; about 4 to 5 the cue word, one hand lifts the product to chest height beside the face, front to the lens; last half second mouth closed, eyes on lens, product held still. Approved handling overrides this: with display-only evidence, reveal the verified sealed front on a support at the cue cut and leave it there. If an approved line cannot fit, propose shorter words, get the revised line approved, then generate; never cut or stretch silently.
7. **Line-up for a yes:** rows of lever, line (cue word marked), pacing, room, product at start and the lift, what it leads into. State what the stills and clips will cost, fresh.
8. **Opening still, approved.** Made from the presenter's picture and tagged product photos. Check: product matches its photo; presenter matches the approved picture; reads as a phone video at thumb size; product in frame with printing uncovered; nothing important in the top or bottom sixth. Hooks sharing a presenter and room share this still.
9. **Clip prompt** (one first, then the batch): aspect, length, real speed, references and jobs, place, the only objects in the scene, camera (propped or arm's length), the line with its cue, the lift, the last still frame, voice (age, pace, traits, accent), room sound, product sound on its beat, no music, no subtitles. Use phone-video words and leave out film words (cinematic, bokeh, anamorphic, grain, dramatic lighting, any camera maker, slow motion).
10. **Check the clip:** the whole line said word for word, not rushed or cut off; lips match; the product comes up on the cue word and is the brand's product; phone look with an unsmoothed face; last frame a closed mouth and a still product that sits beside the body's first frame; a person has listened. Deliver each as the raw clip, its last frame as a picture, the line and the lever; test the same body with each hook in front as separate ads.

## Output
1. **Line-up table** (lever, line with cue word, pacing, room, product start and lift, lead-in).
2. **Presenter line** (fixed words) and **room line**.
3. **Opening still prompt.**
4. **Clip prompt** per hook.
5. **Check list** and delivery list.

## Checks
- Different lever in each hook; no lever its input does not support.
- 18 words or fewer; cue word marked; none starts with a greeting or the brand name.
- No personal result, personal story as fact, "this worked for me".
- Facts are the brand's, word for word.
- Last frame: closed mouth, still product.

## If something is missing
Write `MISSING: <what>`. No pack photo: no hook. No `how it is used` or `visible result`: do not use watch-this. No sourced quote: do not use quote-a-customer. No real date: no deadline.

## Avoid
- A generated look-alike of a real creator or any real person.
- Facts the brand has not stated.
- A word running across the join into the body.
- Ten hooks at once.
