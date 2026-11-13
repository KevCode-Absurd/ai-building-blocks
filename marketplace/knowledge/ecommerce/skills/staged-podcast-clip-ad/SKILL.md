---
name: staged-podcast-clip-ad
description: "Build an ad that looks like a clip from a two-person podcast where the product comes up naturally: a chosen story structure, two clearly different hosts locked in a reference grid and a consistency spec, a natural-sounding script kept to about four lines per 15-second clip, clip prompts for any video model with human texture added around the words, a consistency checker across clips, and an editing recipe for vertical feeds. The ad says on screen that the conversation is staged and paid, never borrows a real show or other people's footage, and only uses claims from the store's facts file. Includes a real-host path and a test judged on store orders."
---

# Staged podcast-clip ad

**You get:** a production package for a staged two-host podcast-clip ad: a timed script, a host reference grid and consistency spec, clip cards, an editing recipe and a test plan.

A podcast clip feels like overheard advice, which is why it works and why it can mislead. This skill makes the talk sound real, keeps both hosts identical across clips, and tells the viewer plainly it is a staged ad.

## When to use

- The product needs explaining and a conversation can carry an objection and its answer.
- The store wants a format that looks native in Reels, Shorts and TikTok.
- A founder or expert story exists, but the founder will not present alone.
- The store wants to test the format before paying for real podcast sponsorships.

## Not for

- One presenter to camera: use `ai-creator-style-video-ad`.
- An animated how-it-works film: use `mechanism-explainer-video-ad`.
- Buying real host reads as media: plan it in `full-funnel-30-day-plan`.
- Choosing the angle: use `store-meta-concepts`.

## What you need

**Required**

- The angle: product SKU, buyer group, the one objection the talk resolves, offer, destination URL.
- Length: 15 seconds (1 clip), 30 (2), 45 (3) or more.
- Facts file with sources and dates; reviews CSV for customer phrases; current winning and losing ads if known.
- Product reference photos and brand files (colours, voice lines).
- Gross profit per purchase and target cost per purchase.

**Optional**

- A real founder, staff expert or adviser willing to be one voice.

**Access.** Level 1, read. Paid generation, hosts or studio time need a yes and a cap. Paused upload needs level 2 and a yes.

## Before you start: the gates

1. **Money known.** Gross profit per purchase and target cost per purchase exist. Fail: run `store-meta-math`.
2. **A real objection.** The talk resolves an objection found in reviews or pre-sale questions. Fail: pick another format.
3. **Proof for every claim.** Fail: cut the claim.
4. **Cash and capacity.** Production plus test cost (3 times target cost per purchase [ADC-0039]) fits the cap, and someone can edit. Fail: 15 or 30 seconds only.
5. **Disclosure agreed.** The owner accepts "Staged conversation. Paid ad." on screen. Fail: do not make this format.

## Steps

### 1. Choose the path

| Path | When |
|---|---|
| Real hosts | Founder or staff plus one more person, two phones or cheap mics; most believable |
| Real sponsorship | Genuine host reads on rising shows can be cheap media [ORG-0032]; a media buy, not this ad |
| AI hosts | No people available, or testing the format first |

A founder story can be carried by a proxy such as an employee or adviser [MCR-0005]. If the founder's own profile posts about the brand, a partnership ad through it can help [ADC-0003].

### 2. Choose the story structure

| Structure | Product shows up | Fits |
|---|---|---|
| Problem to fix (default) | B-roll over the talk, later | Most products, including apparel, big items, routines |
| Discovery | B-roll, or held up if small | Products with a clear "I found this" moment |
| Myth-bust | B-roll | A habit buyers get wrong, provable |
| In-scene reveal | Guest produces it, host examines it | Only small handheld items it is natural to carry |

Never force a reveal for a product nobody would have in their bag.

### 3. Cast two clearly different hosts

- **The asker:** curious, a little sceptical, speaks for the viewer.
- **The guest:** founder, staff expert, or an unnamed "product lead". Never a fake doctor, a real public figure, or a title the store cannot back.

Make them differ on several traits (age, build, skin tone, hair, facial hair, glasses, clothing colour and cut). Similar descriptions come back as look-alikes, the fastest way a clip reads as fake. Keep both on-brand. Write a one-line bio: true for real people, plainly fictional for AI hosts.

### 4. Write the script

One continuous slice of a longer chat, for 45 seconds:

1. **Cold open:** start mid-sentence on the most surprising true line. Stay a conversation throughout; a pitch dressed as a podcast converts as neither [LPG-0044].
2. **The doubt:** the asker raises the objection in a customer's words.
3. **The why:** the guest explains the cause plainly, a few seconds of education before the product [MCR-0014]. A strong order: a bold provable claim, proof, the mechanism through a story, proof of the mechanism, then the ask [MCR-0006].
4. **The product:** it comes up as the answer, not a pitch [MCR-0027].
5. **The ask:** one plain line and the offer, matching the page.

**Pacing rule:** about four lines per 15-second clip (two each, one sentence each, about 40 to 45 words). More and the model rushes or cuts mid-sentence; split the beat into another clip. No "it's not X, it's Y" lines [MCR-0016]. Most viewers leave early, so the first half carries the point [MCR-0077].

### 5. Split into clips and add human texture

Cut at every scene change and only at clean line ends. Mark where B-roll drops in. For each clip, keep the words exactly, then add:

- **Inline cues:** a breath, a short beat, a soft "mm" under the other's line, a half-second delay before a reply, a small restart. Few and deliberate, never sprinkled.
- **Five short notes:** body language tied to words, camera (slight handheld drift, a soft focus shift), audio (room tone, breaths, a chair creak), pacing (nothing perfectly timed), tone (curious, explaining, not selling).

### 6. Lock consistency

- **Reference grid:** one photoreal 2 x 2 image (wide two-shot, close on each host, alternate two-shot) as the single source of truth, asking for natural skin texture and slightly uneven real faces.
- **Consistency spec,** pasted word for word into every clip prompt:

| Element | Asker | Guest | Set |
|---|---|---|---|
| Face, hair | exact | exact | |
| Clothing | item and colour | item and colour | |
| Seat side | camera left or right | the other side | |
| Microphone | model, arm position | model, arm position | |
| Props | cup, notes | product on table, label to camera | |
| Background | | | wall, shelf, lamp; no real show names or logos |
| Light and sound | | | key side, colour temperature, room tone |

- Attach the grid panels to every clip and use the last frame of clip N as the start of clip N+1. Use the real product photo for any reveal.

### 7. Check consistency across clips

For each pair of neighbouring clips compare first and last frames: same faces, clothes, seats, mic positions, props, readable label, light side, background. Listen for voice changes; roles sometimes swap between clips. Any fail: regenerate that clip. If one voice drifts, re-record or regenerate those lines with the same consented or synthetic voice. Log every check.

### 8. Edit

- Trim abrupt endings; let audio overlap the cuts so the talk flows; cut dead gaps.
- Captions in two colours, one per speaker, with a dark shadow.
- Small punch-in zooms around seconds 3 to 5, where drop-off is highest (practitioner default, test it).
- B-roll from the store's own footage or licensed stock only, never other creators' videos.
- On screen early and on the end card: "Staged conversation. Paid ad by [store name]." With AI hosts add "AI-generated hosts" and set the platform's AI label. This follows FTC endorsement rules, ASCI disclosure rules and the EU AI Act; check current rules per market.

### 9. Test

Own ad set, against the store's best video as control, at ad set level. Two to four cold-open variants at modest budgets [MCR-0013]; the B-roll-heavy cut can be a second variant. Keep or cut at 3 times target cost per purchase on store orders [ADC-0039]. If rivals start running podcast-style ads, expect the edge to fade [MCR-0062].

## Checks before you hand it over

1. The talk resolves one real objection from reviews or pre-sale questions.
2. Every claim maps to the facts file; no fake titles or credentials.
3. Each 15-second clip holds about four lines.
4. "Staged conversation. Paid ad." is on screen early and at the end; AI label set if used.
5. No real show, person, logo or third-party footage is used.
6. Every neighbouring clip pair passed the consistency check.
7. Costs fit the cap; nothing is live without a yes.

## Output

1. **One-screen summary:** path, structure, objection, length, cost, control, read date.
2. **Script table:** time, speaker, line, inline cues, shot, B-roll, claim source.
3. **Reference grid prompt** and **consistency spec**.
4. **Clip cards:** clip, lines, five notes, duration, start frame, end frame.
5. **Consistency log**, **editing recipe** and **test plan**.

## Common mistakes

- **A pitch in a podcast costume.** Step 4 stays a conversation.
- **Twin hosts.** Step 3 contrasts them.
- **Six lines crammed into 15 seconds.** Step 4 caps it at about four.
- **Drift between clips.** Steps 6 and 7 lock and check.
- **Lifted footage or a real show's look.** Step 8 and gate 5 forbid it.
- **No disclosure.** Step 8 puts it on screen twice.

## Sources

- [ADC-0039]: judge after 3x target cost per purchase.
- [ORG-0032]: real host reads can be cheap media.
- [MCR-0005]: a proxy can carry a founder story.
- [ADC-0003]: founder partnership ads need an active profile.
- [LPG-0044]: commit to one editorial identity.
- [MCR-0014]: educate before the product.
- [MCR-0006]: claim, proof, mechanism, proof, ask.
- [MCR-0027]: avoid abrupt jumps into the pitch.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [MCR-0077]: most viewers leave before the second half.
- [MCR-0013]: 2 to 4 hook variants.
- [MCR-0062]: formats fade once widely copied.

What makes this skill ours: the talk must resolve a real objection from the store's reviews; it is labelled staged and paid and uses only the store's own or licensed footage; a written spec and a frame-pair checker hold two deliberately different hosts steady; and it is judged against the store's best video on store orders.
