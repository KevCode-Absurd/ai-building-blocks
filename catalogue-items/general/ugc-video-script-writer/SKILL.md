---
name: ugc-video-script-writer
description: Use when you need a script for a UGC-style video: one person talking to their phone about a product so it sounds said, not read, with delivery notes, a shot list and three alternative openings, for a real creator or a generated presenter.
---

# UGC Video Script Writer

A script for what one person says to their phone, written so a stranger takes it for a person talking and not an advert. It is judged on three things: it sounds spoken, one belief has moved by the end, and every fact is the business's.

## Inputs
- **Buyer** (required): one buyer, the moment the problem shows, the one or two doubts that almost stop them, their own words.
- **Product facts** (required): name, what it is, price, how it is used, any visible result, claims allowed and forbidden, the offer and real dates, the guarantee.
- **Speaker** (required): a real creator who has used it; a generated presenter (a fictional adult); a real founder, customer or expert on their own footage.
- **Length** (optional): follows the idea (a doubt talked through needs 45 seconds or more; a routine or discovery lands in 20 to 30). Never squeeze a script to a length it does not fit.
- **Brand brain** (optional): voice dos and don'ts, banned words, past ads so you do not repeat them.
- **Handling rules** (optional): how the product may be held, opened or shown.

## Steps
1. **Settle who says it**, because it changes what can be said. A real creator may tell their own story and result; leave their true details as bracketed slots. A generated presenter gives no personal result and no personal story told as fact: write second person, observation, or a real customer's quote with source. A founder, named customer or expert speaks only on their own footage.
2. **Declare the spine before writing.** If one item cannot be filled, the script is not ready.
   - One person in one moment (not an avatar's name: the version of them this script talks to, and where they are when the problem shows).
   - The one belief to move: what they think now, what they will think after.
   - Where the buyer is (awareness stage) and the one or two doubts to answer, which are answered by what is shown, not in a caption.
   - The story type: a change, a confession, a routine, a discovery. One.
   - How it is filmed and said: arm's length or propped, loosely from points or word for word.
3. **Write the five beats** (the shape is a default, not a law; timestamp each to the length):
   - **Opening line** (first 3 seconds): a person mid-thought, no greeting, pointing at their moment; the product only if the line points at it.
   - **Setup**: the doubt or problem, plainly, in the buyer's words; most of the words are here.
   - **Shown use**: the product in use, one action per shot, in the order it is really used; the doubts are answered by what is seen. This gets the most screen time and the fewest words.
   - **Understated verdict**: claims less than it could, small and plain; nothing bigger than a person alone with a phone would say.
   - **Easy handoff**: names the action and what happens next the way a friend passes something on; no pointing at buttons; offer terms only as the business states them.
   Include exactly one concrete number or time the business holds, said clearly in the spoken words.
4. **Add what the maker needs.**
   - Delivery notes: tone, pace, where they are, what they wear, what is in frame, how the phone is held, what the face does at the doubt and at the verdict (small).
   - A shot list of 4 to 8 shots with times, each one action, each saying which hand holds what; the product arrives where the script requires it.
   - Three alternative openings, each a different lever, each read aloud with line 2; one may speak to a buyer who knows less than the main opening assumes.
   - A shorter cut, only if the idea survives it; if the script depends on its build, say so and write none.
5. **Place the beats in clips** (for generated video): a beat starts at the start of a clip where it can; the demonstration always does, with the product ready in frame; the verdict and handoff may share the last clip; the verdict is never in the same shot as an action; each clip advances a different part rather than restarting hook and pitch. If the script is longer than the clips hold, cut in this order: a second example in the setup, any sentence repeating what the picture shows, the setup down to one sentence. Never cut the opening, the number, the shown use, the verdict or the handoff.
6. **Check it.** Read aloud standing, at pace; every number, price, claim and quote is in the supplied facts; one concrete number; the speaker could truthfully say every first-person line; none of the banned words (game-changer, revolutionary, obsessed, life-changing) and no long dashes; any line that would work as a voice-over on a polished advert is rewritten.
7. **Hand it on:** for a real creator, `ugc-creator-filming-brief`; for a generated presenter, an AI presenter video step.

## Output
```
Script: "<title>" (<N> seconds; real creator / generated presenter)
Spine: person+moment | belief | stage | doubts | story type | how filmed
Opening (0 to 3 s): "<line>"  [what is seen]
Setup: ...
Shown use: ...
Verdict: ...
Handoff: ...
Delivery notes | Shot list (time, action, hand) | 3 alternative openings
Placeholders and gaps: ...
```

## Checks
- Sounds said, not read; no line a voice-over could carry.
- Exactly one concrete number, from the facts.
- Shown use is the longest thing on screen and can be followed with sound off.
- Verdict smaller than the opening; handoff in the same voice.
- A generated presenter never says "I tried it" or "I didn't believe it".

## If something is missing
Write `[VERIFY: what is needed]` in place of any missing fact and ask. No buyer, no script.

## Avoid
- A demonstration told over a talking face.
- A louder, faster or more pointed ending than the script has.
- An overlay that repeats the spoken sentence in full.
