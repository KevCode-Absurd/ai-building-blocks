---
name: ai-creator-style-video-ad
description: "Build a phone-footage-style creator video ad without hiring a creator: three angle options, a locked script with three to five hook variations, a consenting or fictional presenter, reference images with a fixed slot map, clip-by-clip prompts for any video model (hands, surfaces, light, room sound and the product's own sounds spelled out), an approved first frame before any video spend, and a ready creator brief as the human path. First checks whether real buyer footage or a paid creator would do better. The AI presenter is labelled, never speaks as a customer, and only repeats claims from real reviews or the facts file, shown with their source. Tested against the store's best video."
---

# Creator-style video ad with an AI presenter

**You get:** a production-ready creator-style video ad package: a locked script with hook variations, a presenter reference set with slot map, clip-by-clip prompt cards or a creator brief, a QC log and a test plan.

Phone-style creator videos sell because they look like a person showing a real product. An AI version can borrow the look, not the trust of a real buyer. This skill makes the look convincing and keeps the claims honest: the presenter shows and explains, real reviews do the vouching, and the label is on.

## When to use

- The store needs a creator-style video for a concept and has no creator budget or lead time.
- An angle or script exists and the store wants a production-ready package.
- The store wants to test the creator format before paying creators.
- A winning creator script needs versions in new settings or with a new presenter look.

## Not for

- Openers only, spliced onto a proven body: use `ai-presenter-video-openers`.
- A staged two-person conversation: use `staged-podcast-clip-ad`.
- An animated how-it-works film: use `mechanism-explainer-video-ad`.
- Choosing the concept: use `store-meta-concepts`.

## What you need

**Required**

- Product SKU, the angle or a draft script, destination URL, current price.
- Product reference images: front, back, label close-up, in hand for scale, in use. Clean photos, no stickers, watermarks or text.
- Reviews CSV (rating, title, body, reviewer name, date, verified flag).
- Facts file with sources and dates; banned words and claims.
- Gross profit per purchase and target cost per purchase.

**Optional**

- Real customer photos or videos with usage permission; past creator ads with spend, purchases and cost per purchase.

**Access.** Level 1, read. Spending on a video model, creator or freelancer needs a yes and a cap. Paused upload needs level 2 and a yes.

## Before you start: the gates

1. **Money known.** Gross profit per purchase and target cost per purchase exist. Fail: run `store-meta-math`.
2. **Real beats fake check.** Step 1 compares real footage and creators first. Fail to compare: do not proceed.
3. **Proof exists.** At least five dated real reviews support the script's claims. Fail: script a demo only, no outcome claims.
4. **Cash and capacity.** Generation, editing and test cost (3 times target cost per purchase [ADC-0039]) fit the cap. Fail: one 15-second version.
5. **Disclosure agreed.** The owner accepts an on-screen AI label and the platform AI label. Fail: use a real presenter.

## Steps

### 1. Choose the source

| Option | Use when | Cost driver |
|---|---|---|
| Real customer footage | The store has rights to buyer video; mine it for angles first [MCR-0035] | Editing |
| Paid creator, partnership ad | A creator's audience matches the buyer [ADC-0011] | Flat fee from the creator's recent average views [ORG-0041] |
| AI presenter | No footage or creator budget, or testing the format | Generation and editing |

Many accounts mix sources [MCR-0037]. Under about $30k a month of Meta spend, founder or staff phone content is often the cheaper real option [MCR-0082].

### 2. Lock the angle and the script

With no angle given, offer three, one line each (hook and payoff), and let the owner pick. Then write:

1. Three to five hook lines on the same body, each opening mid-action.
2. Body, 20 to 40 seconds: the buyer's moment in a review phrase; what they tried, selling feeling kept low [MCR-0027]; the product in use with one named mechanism [MCR-0066]; a real review read as a review, with name, stars and date on screen; the ask and offer, matching the page.
3. Benefits before features, product shown after the hook for cold viewers [MCR-0077]. No "it's not X, it's Y" lines [MCR-0016].

**Honesty rules, which override any draft:**

- The presenter speaks as a presenter ("Here's how it works", "Reviewers keep saying"), never as a buyer ("I've used it for two weeks").
- Every outcome claim is a facts row or a quoted real review on screen with its source; anonymous quotes read as fake [LPG-0037].
- Price lines are checked against today's price ("under $100 for the set" only if true).
- No invented numbers, no before and after, no implied medical result.

Speech can sound natural (contractions, short fragments, a pause) without pretending to be a customer. Once the owner approves, the script is locked.

### 3. Make the reference set

- **Presenter:** a fictional face generated for this brand, or a person who has given written consent. Never a stranger's photo pulled from the web. One reference for every clip.
- **Product:** the store's own photos, unchanged; the source of truth for shape, label and colour.
- **Setting:** one room, one time of day, phone-camera look (arm's length, slight handheld movement, window light).

Write a slot map and keep the upload order fixed in every clip: image 1 presenter, image 2 product, image 3 setting, image 4 approved first frame. Wrong order gives wrong results.

### 4. Write the clip prompts

Split the script into clips no longer than the model allows, one action arc per clip. Each prompt, in order:

- The slot map, then a plain realism line: real skin texture, true-to-life light, phone footage, not animated, not glossy.
- Per 5-second block: what each hand does, the facial expression, what is on the surface and what is not, background, light source and direction. Anything left out gets invented.
- The spoken line word for word, the voice (age, tone, energy) and the room sound that fits the setting (tiled bathroom echo, soft bedroom, car closeness).
- One product sound at the action beat (cap click, pump, pour, crunch, zip); reinforce it with a real sound effect in the edit if it comes out weak.
- Avoid polished-film words (cinematic, dramatic lighting, lens flare, crane, color grade); keep the phone look.
- The end frame, so the next clip starts from it.

Manual path: a creator brief with concept, hook table, body beats, a b-roll tick list, and filming rules (vertical, eye level, HDR off, clean light, no other brand logos, raw files only, named "Hook 1", "Body", "B-roll 1_action").

### 5. Preview the first frame before spending

Generate one still for the opening of each clip from the references. Check presenter, product label, props and framing. Fix the prompt, not the video. After the owner approves, animate from the approved frame and chain each clip's last frame into the next.

### 6. Assemble and label

Cut the clips, burn in captions for sound-off viewing, place reviews on screen with their source, and add "AI-generated presenter" in the first seconds plus the platform's AI label. This follows the FTC rule against fake testimonials, the UK ASA's guidance on AI and influencer disclosure, TikTok's AI labelling and the EU AI Act deepfake disclosure; check current rules per market.

### 7. Check the cut

Reject if the product's shape, label or colour drifts, hands warp, lip sync slips, the face changes between clips, a claim is not in the locked script, or the label is missing.

### 8. Test

Run against the store's best current video or a real creator ad as control, judged at ad set level [ADC-0059]. Use 2 to 4 of the hook lines at modest budgets [MCR-0013]. Keep or cut at 3 times target cost per purchase [ADC-0039], on store orders.

## Checks before you hand it over

1. Step 1 shows why AI beat real footage or a creator for this job.
2. The presenter is fictional or consenting; no web photo of a real person.
3. The locked script makes no first-person buyer claims; prices match today.
4. Every claim is a facts row or a sourced real review on screen.
5. The first frame was approved before video generation.
6. Every clip passed the product, hands, sync and consistency checks.
7. The AI label is on screen and the platform label is set; nothing is live without a yes.

## Output

1. **One-screen summary:** source chosen and why, angle, length, cost, control ad, read date.
2. **Locked script table:** time, line, on-screen text, visual, claim source; hook lines listed.
3. **Reference set** with the slot map.
4. **Clip prompt cards:** clip, duration, prompt, sound beat, end frame.
5. **Creator brief** (human path), **QC log** and **test plan**.

## Common mistakes

- **An AI face saying "I've been using this".** Step 2 bans first-person buyer claims.
- **A stranger's photo as the presenter.** Step 3 requires a fictional or consenting face.
- **Claims added in the edit.** The script locks at step 2.
- **Burning money on video before the look is right.** Step 5 previews first.
- **Drift between clips.** Steps 3 and 5 fix the references and chain frames.
- **No control.** Step 8 tests against the best current video.

## Sources

- [ADC-0039]: judge after 3x target cost per purchase.
- [MCR-0035]: mine real customer content for angles.
- [ADC-0011]: partnership ads use creator and brand audiences.
- [ORG-0041]: price creator fees from recent average views.
- [MCR-0037]: mix AI, creator and in-house creative.
- [MCR-0082]: resourcing by monthly Meta spend.
- [MCR-0027]: keep the selling feeling low early.
- [MCR-0066]: one named mechanism beats adjectives.
- [MCR-0077]: benefits before features; reveal later.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [LPG-0037]: anonymous reviews read as fake.
- [ADC-0059]: judge at ad set level.
- [MCR-0013]: 2 to 4 hooks per body.

What makes this skill ours: it first asks whether real buyers or a priced creator would beat an AI presenter; the presenter is fictional or consenting and barred from first-person buyer claims, with every outcome a sourced real review on screen; the first frame is approved before video spend; and the ad must beat the store's best video on store orders.

## Selling in India

- ASCI requires virtual influencers to be disclosed; keep the "AI-generated presenter" line.
