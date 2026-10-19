# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The owner gets three tight, checkable Sprout rules, a correct one-off call on the counter, a paste-ready prompt set for the next kitchen images and honest MISSING lines instead of guesses. Headings differ from the shape and the finished piece is unscored, but that is because the images were not attached, which the run says plainly.

## Judge list

- Met: Every rule can be checked by looking at a finished image or clip
  "A pack torn down the side, across the bottom or at a corner fails"; "Cubes, other shapes, translucent or glossy gummies... fail"
- Met: Every rule has a prompt line, a check line, a reason and the kind of work it covers
  Each of the 3 rules lists Prompt line, Check line, Reason, Covers (e.g. "Copy, images, video") and Count.
- Met: Each comment names where the mistake slipped in, and the fix matches it
  "Not asked... Fix: put the offers.md wording into the fixed product description"; comment 4 correctly sorted as one-off. Comment 3 adds a photo fix too, minor blend.
- Met: Nothing about your specific product ended up on the any-product list
  Any-product section only says "Used the real way: +1" and "The whole action, in words: +1"; pack/bear rules sit under "New product rules: Sprout daily pack".
- Met: Repeats were counted, not written twice
  "Updated any-product rules (counted, not rewritten)... now logged as 2 and goes into every pre-job list"; new product rules only because list was empty.

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
## After feedback

**Comment 1:** *"Two of them have the daily pack torn down the side. We tear across the top. Always."*
- **Type:** Lasting rule. The brand lead said "Always."
- **Where it slipped in:** *Not asked.* `offers.md` already says "torn straight across its top edge," but the prompt only said "being opened," so the tool guessed. **Fix:** put the `offers.md` wording into the fixed product description used in every prompt.
- **List:** Product rule (Sprout daily pack). It is already in `offers.md`, so nothing new needs copying.

**Comment 2:** *"In the palm one the gummies are coming out of the bottom corner."*
- **Type:** Lasting rule. It matches `offers.md`: "Gummies pour out of the torn top."
- **Where it slipped in:** *Not asked.* The prompt said "pouring into a palm" but never said where they pour from. **Fix:** name the exit point in the prompt.
- **List:** Product rule. It is already in `offers.md`.

**Comment 3:** *"And they look like little jelly cubes. They're bears."*
- **Type:** Lasting rule. This is a product fact, not taste.
- **Where it slipped in:** *Not asked.* The prompt said only "gummies," and the `offers.md` description was not used. No gummy photo was sent either, so add one as a reference.
- **List:** Product rule. It is already in `offers.md`.

**Comment 4:** *"Also could the counter be lighter?"*
- **Type:** One-off. It is one person's taste on this set and was not stated as a rule. It is not added to any list. Ask the brand lead whether lighter counters should be a standing kitchen setting.

### New product rules: Sprout daily pack

**1. Torn across the top**
- **Prompt line:** "Tear the Sprout daily pack straight across its top edge."
- **Check line:** A pack torn down the side, across the bottom or at a corner fails.
- **Reason:** The brand always tears across the top. Two of three images showed a side tear.
- **Slipped in:** Not asked.
- **Covers:** Copy, images, video.
- **Count:** 2 (two images). At two or more, it goes into every pre-job list.

**2. Gummies leave from the torn top**
- **Prompt line:** "Gummies pour out of the torn top edge of the daily pack."
- **Check line:** Gummies leaving from the bottom, a corner, the side or anywhere but the torn top fail.
- **Reason:** In the palm image the gummies came out of the bottom corner.
- **Slipped in:** Not asked.
- **Covers:** Copy, images, video.
- **Count:** 1.

**3. Gummies are bears**
- **Prompt line:** "Gummies are small opaque deep-green bears, soft matte, about thumbnail height."
- **Check line:** Cubes, other shapes, translucent or glossy gummies, other colours, or gummies larger than a thumbnail fail.
- **Reason:** The gummies came back as jelly cubes.
- **Slipped in:** Not asked.
- **Covers:** Images, video.
- **Count:** 1.

### Updated any-product rules (counted, not rewritten)
- **Used the real way:** +1. The pack opened and spilled from the wrong place again. No count was recorded before, so it is now logged as 2 and goes into every pre-job list.
- **The whole action, in words:** +1. "Being opened" left the tool to guess again. It is now logged as 2 and goes into every pre-job list.

### Retirement
None. The product rules' words are in `offers.md` but not yet in a prompt template, and they failed on this job.

## Before the next job: kitchen images

**Fixed product description.** Paste this word for word into every prompt in the set:
> The Sprout daily pack [MISSING: pack shape, size, colour, label wording]. It is torn straight across its top edge. Small opaque deep-green gummy bears, soft matte, about thumbnail height, pour out of the torn top.

**Prompt lines (images):**
- Tear the Sprout daily pack straight across its top edge.
- Gummies pour out of the torn top edge of the daily pack.
- Gummies are small opaque deep-green bears, soft matte, about thumbnail height.
- Show the pack opened and used exactly as described above. In any shot without an opening step, keep it closed and at rest.
- Name the whole action: the top edge is torn straight across by hand, green gummy bears tip out of the torn top, fall downward and land in an open adult palm held below.
- Reuse the fixed product description word for word in every image of the set.
- Name the hand holding the pack, place the thumb and each finger, say which side of the pack faces the camera, and give the free hand a job (for example, the open palm catching the bears).
- Show only adults, or adult hands only.
- No founder, customer or expert face unless their own photo is supplied.
- Everything rests on the counter or is held in a hand, and the pack, bears and hands are true to size against each other.

**Check lines to run on the finished set:** the 3 product rules above, plus Used the real way, Whole action, One look across a set, Hands described in full, No generated children, No made-up face, and A scene a camera could shoot. Any image that fails one is redone.

**Missing:**
- `MISSING:` a written description of the daily pack's look (shape, size, colour, label) for the fixed description.
- `MISSING:` confirmation that `pouch-front.jpg` shows the daily pack. The file name says "pouch," and a photo beats a description written from a file name.
- `MISSING:` a photo of the gummy bears and a photo of a pack torn across the top, as references.
- `MISSING:` how the pack is held while tearing (which hand, grip). Until the brand answers, use the hands line above as a proposal.
- **Counter shade:** ask whether "lighter" applies to this new set. It is not built into the prompts.

## Score

**Rules score:** 4 of 4 checks passed. 4 / 4 × 100 = **100**.

**Finished piece score:** not given. The three images weren't attached; I only had the brand lead's description. Without the images I couldn't check:
- hands and grip
- floating objects or size mismatches
- whether the pack looked the same across all three images
- the third image's tear
- whether any people appear

Please send the images so they can be scored against the check lines.
```
