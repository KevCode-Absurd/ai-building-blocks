# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run turns the brand lead's four comments into two tight, checkable product rules, keeps the counter request as a one-off, and hands over paste-ready prompt lines plus clear MISSING asks for the next kitchen set. Nothing is invented and the owner could act on it immediately, though it could have pulled the pack look and 'never show' rules from brand.md instead of asking for them.

## Judge list

- Met: Every rule can be checked by looking at a finished image or clip
  "A tear on the side, bottom or a corner, or gummies leaving anywhere but the torn top, fails." Both rules are visually checkable.
- Met: Every rule has a prompt line, a check line, a reason and the kind of work it covers
  Each new rule lists Prompt line, Check line, Reason, Slipped in, Covers ("copy, images, video" / "images, video") and Count.
- Met: Each comment names where the mistake slipped in, and the fix matches it
  "Not asked. The prompt said only 'being opened'... Fix: put that wording into a fixed product description"; counter comment correctly "One-off... n/a".
- Met: Nothing about your specific product ended up on the any-product list
  Pack and gummy rules filed as "Product rule: Sprout daily pack" / "Sprout gummies"; any-product list only gets "count +1".
- Met: Repeats were counted, not written twice
  "Product rule (counted with #1, not written twice)" and "Used the real way: count +1".

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

### Each comment sorted

| # | Brand lead's words | Rule or one-off | Where it slipped in | List |
|---|---|---|---|---|
| 1 | "Two of them have the daily pack torn down the side. We tear across the top. Always." | Lasting rule ("Always") | **Not asked.** The prompt said only "being opened". The offers.md wording ("torn straight across its top edge") never reached the prompt. Fix: put that wording into a fixed product description and use it in every prompt. | Product rule: Sprout daily pack |
| 2 | "In the palm one the gummies are coming out of the bottom corner." | Lasting rule. It is the same fault as #1 and is already a fact in offers.md. | **Not asked.** The prompt never said where the gummies leave the pack. Fix: as #1. | Product rule (counted with #1, not written twice) |
| 3 | "And they look like little jelly cubes. They're bears." | Lasting rule. It is a product fact in offers.md. | **Not asked.** The prompt said only "gummies". pouch-front.jpg doesn't show the gummies. Fix: put the offers.md description into the fixed product description, and add a photo of the gummies. | Product rule: Sprout gummies |
| 4 | "Also could the counter be lighter?" | **One-off.** This is taste on this set. | n/a | None. Apply it to any redo of yesterday's images if wanted. It does not carry into the new set unless the brand lead says it's a rule. |

### New product rules (Sprout)

**Daily pack: torn across the top, poured from the top** *(new)*
- **Prompt line:** "The Sprout daily pack is torn straight across its top edge; the gummies pour out of the torn top."
- **Check line:** A tear on the side, bottom or a corner, or gummies leaving anywhere but the torn top, fails.
- **Reason:** In one set, two images showed a side tear and one showed gummies spilling from the bottom corner.
- **Slipped in:** Not asked.
- **Covers:** copy, images, video.
- **Count:** 3 (three faults in one set of three images). That is two or more, so it goes into every pre-job list.
- **offers.md:** already says this. No change needed.

**Gummies: small deep-green bears** *(new)*
- **Prompt line:** "Small opaque deep-green gummy bears, soft matte finish, about thumbnail height."
- **Check line:** Cubes or any other shape, clear or glossy gummies, any colour but deep green, or gummies larger than a thumbnail fail.
- **Reason:** The gummies came back as little jelly cubes.
- **Slipped in:** Not asked.
- **Covers:** images, video.
- **Count:** 1.
- **offers.md:** already says this. No change needed.

### Any-product rules updated (counted, not rewritten)

- **Used the real way:** count +1. The pack was drawn split at the side, and gummies spilled from a corner.
- **The whole action, in words:** count +1. "Being opened" left the tool to guess again.
- The earlier counts aren't recorded on the list. Add one to whatever is on file.
- **Retired:** none. The words are in offers.md but not yet in a prompt template, so nothing is fixed at the source.

---

## Before the job: new set of kitchen images

### Prompt lines to paste (images)

**Fixed product description.** Reuse this word for word in every image of the set:
> "The Sprout daily pack [MISSING: pack shape, size, colours and label, in words matching pouch-front.jpg] is torn straight across its top edge; the gummies pour out of the torn top. The gummies are small opaque deep-green gummy bears, soft matte finish, about thumbnail height."

**The product**
- Show the Sprout daily pack torn straight across its top edge, with the gummies pouring out of the torn top.
- Describe the whole action. Name the pack, say it is torn across its top edge [MISSING: which side the tear starts from], say the deep-green gummy bears pour out of the torn top, say they fall downward, and say where they land (for example, an open palm held below the pack).
- Use the fixed product description above word for word in every image, so the pack and the bears look identical across the set.

**People and bodies**
- Describe the hands in full. Name each hand (for example, the right hand holds the pack and the left hand is an open palm). Place the thumb and each finger on the pack. Say which side of the pack faces the camera. Give the free hand a job. Keep the label clear of fingers, and show no more hands than people.
- Every person shown is a clearly adult figure.
- No founder, customer or expert appears unless they supplied their own photo.

**Scene**
- Everything rests on the counter or is held by a hand. The pack, the bears and the hands are in true scale to each other: the bears are about thumbnail height. Any styled mid-air pour is stated in the plan.

Check each finished image against the check lines above and the any-product list. Any image that fails one is redone.

### MISSING
- `MISSING: how the daily pack looks, in words (shape, size, colours, label)`. Only pouch-front.jpg exists. Ask the brand and add the answer to offers.md.
- `MISSING: whether the pack has a tear notch, and which side the tear starts from`. Until answered, show the pack already torn across the top or still closed. Don't show the tear in progress.
- `MISSING: a photo of the top edge or a torn pack`. pouch-front.jpg doesn't show where it opens.
- `MISSING: a photo of the gummy bears`. No photo shows them yet.
- `MISSING: what never to show` for this product, beyond the tear and pour points. Ask the brand.
```
