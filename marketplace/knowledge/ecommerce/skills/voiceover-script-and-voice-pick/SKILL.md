---
name: voiceover-script-and-voice-pick
description: "A timed voiceover script sized to the locked cut from the chosen voice's measured pace, with pause and emphasis marks and a pronunciation list, plus a voice brief that works for a human voice actor or an AI voice tool. Decides human or AI from the job (a voice that claims experience must be a real person who had it), picks between two or three candidate voices by a blind listen over the actual cut, records consent and usage terms for the voice, and applies the disclosure rules for synthetic voices on Meta, YouTube and TikTok and US and Indian advertising codes. Use when a video ad, explainer or product clip needs narration, when narration sounds read rather than spoken, or before cloning or buying any voice."
---

# Voiceover script and voice choice

**You get:** one timed voiceover script that fits the locked cut to the second, marked for pauses and emphasis, with a pronunciation list; a voice brief usable for a human actor or an AI voice; and a voice record (who, consent, usage, disclosure), ready to record.

## When to use

- A video ad, explainer or product clip needs narration.
- Existing narration sounds read aloud, rushed, or runs over the cut.
- The store wants the same ad in more than one language or accent.
- Someone suggests cloning a voice, the founder's or anyone else's.

## Not for

- Scripts spoken on camera by a creator: use `creator-video-script`.
- Animated explainers with their own voice step: use `mechanism-explainer-video-ad`.
- Music and sound effects under the voice: use `music-and-sound-for-ads`.
- Captions for the narration: use `captions-and-text-for-sound-off`.

## What you need

Required:

1. **The locked cut** (or a timed storyboard) with section lengths in seconds.
2. **The message:** the script draft or brief, the buyer, and the one action wanted.
3. **Approved claims list** (`product-claims-profile`).
4. **Language and accent** of the target buyer.
5. **Voice options available:** voice actors the store can book, or the AI voice tool the client already pays for, with its commercial terms.

Optional: the brand voice guide (`brand-voice-guide`), past ads the client liked, and reviews in buyers' own words.

Access: read only. Booking an actor, buying a voice plan or creating a voice clone spends money or creates an account: the client does it or says yes first.

## Before you start: the gates

1. **Money.** Gross profit per order is known from delivered costs [MEA-0037]; actor fees or tool costs count as production cost against the ad [MCR-0023].
2. **Who is speaking.** Decide the speaker's role before writing. A narrator explains; only a real person who used the product may say "I use this". A synthetic or hired voice must not speak as a customer [MCR-6045].
3. **Consent for any real voice.** A cloned voice needs the owner's written consent for this use, these platforms and this term. Never clone a public figure, a creator or a customer without it. Fail: use a stock voice or a booked actor.
4. **Claims.** Every spoken claim is on the approved list.
5. **Disclosure plan.** Know before recording whether the ad will need an AI label (step 7).

## Steps

### 1. Time the cut

List each section of the cut with its length in seconds: opener, problem, proof, product, ask. Leave half a second of silence at the start and end of the ad and around any visual reveal.

### 2. Measure the pace

Have the candidate voice (or the actor's demo, or the AI voice) read a 20-second sample from the draft. Count words per second. Conversational English ads often sit around 2.3 to 2.8 words per second (practitioner default; measure, do not assume). Hindi and many Indian languages carry more syllables per word, so word counts run lower for the same time. Words per section = seconds x measured pace, minus pauses.

### 3. Write for the ear

- One idea per line. Short, common words. Contractions.
- The first line carries the point and matches the opening on-screen text; on most direct-response ads the opening words do most of the hook's work [MCR-0063].
- Keep the selling tone low early and raise it slowly; narration that pitches from the first word loses people [MCR-0027].
- Numbers written as spoken: "four ninety-nine", "ek hazaar".
- Product and brand names spelled as said in the pronunciation list.
- No line that the visuals contradict. If the picture shows it, the voice need not say it.

### 4. Mark the delivery

Use plain marks any actor or tool can follow: `/` short pause, `//` half-second pause, CAPITALS on the one stressed word per line, and a pace note per section (calm, warmer, brisk). Some AI tools take bracketed tags for tone; use them sparingly and only where the tool documents them.

### 5. Choose human or AI

| Situation | Choose |
|---|---|
| The voice claims personal use or results | Real person who had them (customer, founder) |
| The founder's story | The founder's own voice, recorded on a phone in a quiet room; or a proxy who says who they are [MCR-0005] |
| Neutral narration, explainer, product facts | Human actor or AI stock voice |
| Many languages or fast iteration | AI stock voice, each version checked by a fluent listener |
| Category built on trust (health, baby, finance-adjacent) | Human actor preferred |

### 6. Write the voice brief

One paragraph, the same for an actor or a tool: age range, gender if relevant, accent (Indian English, Hindi, Tamil, US General, Southern US), pitch (low, mid), texture (warm, clear, slightly raspy), energy on a 0 to 5 scale, pace in words per second from step 2, and who they sound like they are talking to ("a friend across the table, not a crowd"). Add three words the voice should never sound like (salesy, breathless, robotic).

For AI tools, paste this brief word for word every time. Changing even a few words can change the voice between clips.

### 7. Apply the disclosure rules

- **YouTube:** cloning your own voice for narration is a minor use with no disclosure; a realistic synthetic voice making a real person seem to say something they did not say needs disclosure [MCR-6064].
- **Meta:** may label content as AI when it detects AI signals or when the uploader discloses; plan for the label to appear [MCR-6063].
- **TikTok:** check the AI-generated content setting in TikTok Ads Manager on the day; realistic synthetic media is expected to be labelled.
- **US:** a voice presented as a customer must be a real customer with that experience [MCR-6045].
- **India:** check the current ASCI code and any AI guidance on ascionline.in at launch; disclose clearly where a voice is synthetic.

### 8. Pick the voice by blind listen

Record the same 15-second section with two or three candidate voices. Play each over the actual cut on a phone speaker to someone who did not choose them, without saying which is which. Ask: which one would you keep listening to, and which one do you trust? Pick the winner; note the runner-up.

### 9. Record and check

- Human: quiet soft room, phone or mic an arm's length away, three full takes plus pickups for any fluffed line.
- AI: generate per section, not the whole script at once, so one bad line is easy to redo.
- Check against the cut: every line lands on its visual, nothing runs over, names pronounced right.
- Hand the final audio to `music-and-sound-for-ads` for mixing and to `captions-and-text-for-sound-off` for captions.

## Checks before you hand it over

- Script fits every section at the measured pace with pauses included.
- Each spoken claim is on the approved list.
- The speaker's role is honest: no synthetic or hired voice speaks as a customer.
- Written consent exists for any real person's voice or clone, with platforms and term.
- The voice brief is identical across all clips of one ad.
- The blind listen result and runner-up are recorded.
- Disclosure needs are marked per platform.
- Pronunciation of brand and product names is correct in the final audio.

## Output

**One-screen summary:** ad, speaker role, human or AI and why, chosen voice and runner-up, total length, disclosure needed per platform, production cost.

**Timed script:**

| Section | In | Out | Seconds | Words allowed | Line (with marks) | Visual it lands on |
|---|---|---|---|---|---|---|

**Pronunciation list:** Word, Say it like, Notes.

**Voice brief:** one paragraph, plus never-sound-like words.

**Voice record:** Voice name or actor, Human or AI, Source or tool, Consent document link, Platforms covered, Term, Disclosure needed (per platform), Date.

## Common mistakes

- **Writing to a word count from a template.** Step 2 measures the real voice's pace.
- **A synthetic voice saying "I love this".** Gate 2 and step 5 keep it a narrator.
- **Cloning a voice without consent.** Gate 3 stops it.
- **Rewording the voice brief between clips.** Step 6 pastes it word for word.
- **Choosing the voice the team likes.** Step 8 uses a blind listen over the cut.
- **Narration that repeats the picture.** Step 3 cuts lines the visuals already say.

## Sources

- MCR-0005: founder voice or a proxy instead of the founder on camera.
- MCR-0023: gross profit per ad after production cost.
- MCR-0027: raise the sense of being sold gradually.
- MCR-0063: opening words carry most of a video hook.
- MCR-6045: no testimonials that misrepresent experience.
- MCR-6063: Meta's AI info label and self-disclosure.
- MCR-6064: which synthetic content needs disclosure.
- MEA-0037: gross margin uses delivered cost.

What makes this skill ours: the script is sized from the chosen voice's measured pace, not a template word count; the speaker's role is fixed before writing so no hired or synthetic voice poses as a customer; voice clones need written consent; and the final voice is picked by a blind listen over the real cut on a phone speaker.
