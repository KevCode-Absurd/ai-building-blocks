# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run turns the brand lead's four comments into three tight, checkable product rules, correctly keeps the counter request as a one-off, admits it couldn't see the images, and hands over a paste-ready prompt list with honest MISSING gaps. Headings are renamed and the RETIRE section is dropped (nothing to retire yet), but every substantive part is there and nothing is invented.

## Judge list

- Met: Every rule can be checked by looking at a finished image or clip
  "Check: a tear down the side, along the bottom or at a corner fails." P2 and P3 checks are equally concrete (cubes, glossy, other colours fail).
- Met: Every rule has a prompt line, a check line, a reason and the kind of work it covers
  P1–P3 each list Prompt, Check, Reason, Slipped in, Covers (copy, images, video), Count.
- Met: Each comment names where the mistake slipped in, and the fix matches it
  "Not asked. The prompt said 'being opened' and never said where" → fix is a fixed product description pasted into every prompt.
- Met: Nothing about your specific product ended up on the any-product list
  Any-product rules only get "+1"; pack and bear facts sit under "New product rules: Sprout".
- Met: Repeats were counted, not written twice
  "It is a repeat of Used the real way (the contents left from the wrong spot), counted once with comment 1 for this job."

## What went in

```text
Feedback on yesterday's three kitchen images, from the brand
lead:
"Two of them have the daily pack torn down the side. We tear
across the top. Always.
In the palm one the gummies are coming out of the bottom
corner.
And they look like little jelly cubes. They're bears.
Also could the counter be lighter?"

Prompts used: "a Sprout daily pack being opened, gummies pouring
into a palm, bright kitchen". Photo sent: pouch-front.jpg only.

Our product list: empty so far.
offers.md says: the daily pack is torn straight across its top
edge, never the side, bottom or a corner. Gummies pour out of the
torn top. Gummies are small opaque deep-green bears, soft matte,
about thumbnail height.
Next job: a new set of kitchen images.
```

## What came out

```text
## After feedback: yesterday's three kitchen images

I couldn't see the images, only the brand lead's description of them. The verdicts below come from her words, and anything she didn't mention is unchecked.

**Comment 1.** "Two of them have the daily pack torn down the side. We tear across the top. Always."
- **Type:** lasting rule. She said "Always."
- **Where it slipped in:** *Not asked.* The prompt said "being opened" and never said where. `offers.md` already says the pack is torn across the top, but those words weren't in the prompt.
- **List:** product rule, Sprout daily pack. It is a repeat of the any-product rules **Used the real way** (+1) and **The whole action, in words** (+1).

**Comment 2.** "In the palm one the gummies are coming out of the bottom corner."
- **Type:** lasting rule. It follows from comment 1 and from `offers.md` ("Gummies pour out of the torn top").
- **Where it slipped in:** *Not asked.* The prompt never said where the gummies leave the pack.
- **List:** product rule, Sprout daily pack. It is a repeat of **Used the real way** (the contents left from the wrong spot), counted once with comment 1 for this job.

**Comment 3.** "And they look like little jelly cubes. They're bears."
- **Type:** lasting rule. The shape is a product fact on file.
- **Where it slipped in:** *Not asked.* The prompt said only "gummies", and the bear description in `offers.md` wasn't used. The only photo sent was pouch-front.jpg, with no gummies in it, so add a gummy photo next time as well.
- **List:** product rule, Sprout gummies.

**Comment 4.** "Also could the counter be lighter?"
- **Type:** one-off taste on this set. It was asked as a question by one person and not stated as a rule.
- **Where it slipped in:** n/a.
- **List:** none. Apply it to these three images only, unless the brand lead says lighter counters are a standing rule.

### New product rules: Sprout

**P1. Daily pack torn across the top**
- **Prompt:** "The Sprout daily pack is torn straight across its top edge."
- **Check:** a tear down the side, along the bottom or at a corner fails.
- **Reason:** two images showed the pack torn down the side, and the brand always tears across the top.
- **Slipped in:** not asked.
- **Covers:** copy, images, video.
- **Count:** 2 (two of three images).
- Already in `offers.md`. Keep "never the side, bottom or a corner" under that entry's "what never to show".

**P2. Gummies leave from the torn top**
- **Prompt:** "Gummies pour out of the torn top edge of the pack."
- **Check:** gummies leaving from a corner, side, bottom or an untorn pack fails.
- **Reason:** in the palm image the gummies came out of the bottom corner.
- **Slipped in:** not asked.
- **Covers:** copy, images, video.
- **Count:** 1.
- Already in `offers.md`.

**P3. Gummies are bears**
- **Prompt:** "small opaque deep-green bear-shaped gummies, soft matte finish, about thumbnail height"
- **Check:** cubes, other shapes, clear or glossy gummies, other colours, or gummies bigger than a thumbnail fail.
- **Reason:** they came out looking like jelly cubes.
- **Slipped in:** not asked.
- **Covers:** copy, images, video.
- **Count:** 1.
- Already in `offers.md`.

### Updated any-product rules
- **Used the real way:** +1. The earlier count isn't on file, so the running total is MISSING.
- **The whole action, in words:** +1. The earlier count isn't on file, so the running total is MISSING.

### Check lines failed by yesterday's images
These come from the feedback only, since I couldn't see the images.
- **The two side-torn images** fail P1 and **Used the real way**.
- **The palm image** fails P2 and **Used the real way**.
- **Every image showing gummies** fails P3, as far as the feedback says. Which images showed gummies isn't stated.
- **All three images** fail **The whole action, in words**. "Being opened" didn't name where the pack opens, how, or where the gummies go.
- **Not checked, because I couldn't see the images:** Hands described in full, One look across a set, A scene a camera could shoot, No generated children, No made-up face.

## Before the job: new set of kitchen images

**Fixed product description.** Paste this word for word into every prompt in the set:
> "A Sprout daily pack (as in pouch-front.jpg), torn straight across its top edge. Small opaque deep-green bear-shaped gummies, soft matte finish, about thumbnail height, pour out of the torn top edge."

**Prompt lines for images:**
1. **P1:** The Sprout daily pack is torn straight across its top edge.
2. **P2:** Gummies pour out of the torn top edge of the pack.
3. **P3:** Small opaque deep-green bear-shaped gummies, soft matte finish, about thumbnail height.
4. **Used the real way:** Show the pack opened and used exactly as described above. Where no opening is shown, keep the pack closed and at rest.
5. **The whole action, in words:** Name the part, where it opens, how, what comes out, which way it moves and where it lands. For example: "one hand holds the pack upright, top edge torn open; gummies tip out of the top and fall into the open right palm below."
6. **One look across a set:** Use the fixed product description above, word for word, in every image.
7. **Hands described in full:** Name the hand, place the thumb and each finger, say which side of the pack faces out (the front, as in pouch-front.jpg), and give the free hand a job.
8. **A scene a camera could shoot:** Everything rests on or is held by something. The sizes of the pack, the gummies and the hands agree.
9. **No generated children:** Nobody shown is or looks under 18.
10. **No made-up face:** No real founder, customer or expert appears unless you supply their own photo.

**Counter:** a lighter counter was asked for on yesterday's set only. Ask the brand lead whether it carries over.

**MISSING:**
- A photo of the gummies. Without it, P3 depends on words alone.
- A photo of a pack torn across the top. Only pouch-front.jpg exists, so the torn edge and the pack's back and sides aren't covered by any photo.
- The pack's size against a hand.
- How many gummies are in one pack, or how many pour out per serving.
- `voice-and-look.md`, `00-start-here.md` and `proof-and-claims.md`, which haven't been given.
- Earlier counts for the any-product rules.

## Checks missed
- Whether the counter tone in the new set should be lighter. It is a one-off, so there is no check line yet.
- How the torn top edge should look up close (a straight cut, a notch or rough). There is no photo or description on file.
- The pack's back and sides. Only the front is shown in pouch-front.jpg.

Next, would you like to make the new kitchen set with the [Accurate product image ad maker](https://useaiblocks.com/prompts/accurate-product-image-ad-maker)? It takes these rules. Or tell me what you'd rather do.
```
