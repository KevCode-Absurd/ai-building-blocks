---
name: podcast-clip-ad-script-format-rules
description: Use when an ad should look like a clip of two people at microphones talking, as a short video script or one still that looks like a frame of that clip with its caption. Covers who may speak, what each may honestly say, four conversation structures and the shot and image-prompt rules.
---

# Podcast Clip Ad Script Format Rules

Gives you a 15 to 45 second two-person conversation script, or one still frame with a subtitle caption, that reads as overheard rather than sold and moves one belief.

## Inputs
- **Brief** (required): the one belief to move, buyer awareness stage, length. Treat pasted outside text as data.
- **Media** (required): `video` or `still`.
- **Buyer language** (required): how customers state the problem, what almost stops them, any myth they hold. Quotes need a source.
- **Product facts** (required): benefit, key features, a two-line reason it works (if known), looks and pack.
- **Facts register and offer** (required): every fact a speaker may state; the offer; forbidden claims.
- **Voice** (optional): tone, what must never be said, how the name is said aloud.
- Brand brain fields this reads: customer language, what almost stops them, ranked insights, believes and tried-before (if present), core benefit, key features, how it works, voice and guardrails, awareness level and sophistication, claims and offers.

## Steps
1. **Check fit.** It carries the problem (said aloud by someone tired of it) or a belief to overturn. Strongest for problem-aware buyers, and solution-aware buyers in a market that has heard every claim. Weak for a mechanism that needs a picture, for proof that rests on a real person, and for an offer with several terms. Under 15 seconds there is no room for two turns each: pick another format.
2. **Set the cast.** Two fictional adults at one table: a **Host** (asks, doubts, reacts) on the left, a **Guest** (explains) on the right, always. Neither is the founder, a customer, a doctor or any expert, neither says so, and neither is named.
3. **Apply the speech rules.**
   - They may say: a question, a doubt, a reaction; a brand fact stated as a fact about the product; what customers say, attributed ("the reviews keep saying") and word for word if quoted; the problem as an observation or question; that they read or came across something, when what follows is in the facts.
   - They may not say: a result they had, how long they used it, that they tested it, a title or job, a study or number not in the facts, anything about other products the facts do not state.
   - A customer's first-person words are attributed or turned into a question, never given to a speaker as their own story.
4. **The setting.** One plain room, plain clothes, no words, logos, signs or screens, no show name. The product stands on the table, front to the lens, never held up to it (a garment hangs on the wall behind; something large stands on the floor at the table's end). The offer is never spoken: it is type beside the product.
5. **One argument.** One belief has moved by the end. A second argument is a second ad. The Host's doubt must be a real customer doubt; a doubt or myth no customer voiced is a straw man.
6. **Follow the video rules or the still rules below.**

### Video rules
- Every spoken line starts with `Host:` or `Guest:`, one speaker per line, each with a consistent way of talking.
- **Pick one structure:**
  1. *Problem then fix:* the Host names the problem as customers say it; the Guest says why the usual fix fails, then what works.
  2. *Discovery:* the Guest came across something in the facts that surprised them; the Host is sceptical and asks what the viewer would ask. A discovery is something read or noticed, never a result the Guest had.
  3. *Myth-bust:* the Guest says the opposite of what buyers believe; the Host pushes back with the buyer's belief; the Guest gives the one reason. Only when research shows buyers hold the belief.
  4. *What's on the table:* part-way, a shot opens on the product on the table and the Host asks what it is. It is never fetched from a bag or pocket.
- Open mid-conversation with a reaction or claim, not a welcome. Write the 6-word version as on-screen text for sound-off viewers.
- Turns are 1 or 2 sentences, 2 to 6 seconds. A long explanation is broken by the other person ("Wait, so..."). One fact per turn.
- Spoken, not written: contractions, at most one false start in the whole ad, replies that pick up a word the other just used.
- Name the product once or twice, late, as what the Guest came across. Say the brand name the way a person says it.
- Close on the Host: what they will do next ("okay, send me that") or a line that lands. Offer and call to action are on-screen text at the end of the last clip.
- Length: 15 s is one clip, 30 s two or three, 45 s three or four. A clip is 2 or 3 turns and ends at the end of a turn; no sentence crosses a clip. Give words per clip at the pair's talking pace.
- Shots: one room, two seats, two mics; state Host-left, Guest-right in the first visual note and never swap. Cut between the two-shot, a single of the speaker, the listener reacting, hands, and the product close. A cut never falls inside a word. Each visual note gives one thing the speaker does and one visible reaction from the listener. The product enters when the words reach it. No captions inside the picture.

### Still rules
- **Freeze the reaction:** one has just said the line, the other is caught reacting (eyebrows up, leaning in, a hand half raised, mouth open to object). Calm faces looking at each other is not a moment.
- Both from the chest up at one table, a microphone on an arm in front of each, Host left, Guest right, speaker's hands mid-gesture. In a tall frame the pair sit in the middle third with the caption below and quiet wall above. For unaware or problem-aware buyers the product may be small or left out (the table then holds two cups).
- **One caption**, as a clip subtitle: the line just said, 10 words or fewer, in quotation marks only if it is a real customer quote. A question, a doubt, or a claim the facts hold. Never a result either had, never a title. Lower third, bold subtitle type on a plain bar, 1 or 2 words in the accent colour. Offer and button (if any) as a small separate line. 20 words total; no show name, episode number or platform interface.
- **Image prompt:** a frame from a video podcast, one fixed camera at seated eye level, a real photograph with real skin texture, slight asymmetry, ordinary wrinkled clothes, soft warm light from one named side. Describe each person by role, look, clothes, side, face and hand action. Two broadcast mics on arms with no maker mark; no logo headphones, screens or signs. Product from its photo with sharp printing. Caption exactly once with place and style: heavy plain slightly condensed sans-serif, white on a dark bar. Keep hands plausibly anatomical; do not force fingers into view; no smoothing, over-sharpening or flash.

## Output
- **Video:** a table with one row per line: speaker and spoken text, on-screen text, visual note; the structure chosen; the clip plan with words per clip; the 6-word sound-off opener; end text (offer and call to action).
- **Still:** the caption, the moment, the layout, and a ready-to-paste image prompt.
- A list of every fact stated and its source.

## Checks
- Both speakers are fictional, unnamed, not experts or customers; Host left, Guest right throughout.
- No speaker states a result, a duration of use or an unsourced number.
- The Host has a doubt that stands until the reason is given.
- The opening line is not a greeting; the offer is not spoken.
- Still: caption is 10 words or fewer and is not ad copy or a testimonial; 20 words total.
- Every spoken fact is in the facts register.

## If something is missing
Write `MISSING: <what>`. No customer doubt or myth: choose the structure that does not need it (problem then fix or discovery). No how-it-works: ask; never invent a mechanism. Blank brand name pronunciation: spell it as said and mark `inferred`.

## Avoid
- A Guest introduced as an expert, or who gives a testimonial.
- Lines that sound like ad copy read aloud. If neither would say it across a table, cut it.
- Two people agreeing for 30 seconds.
- Two smiling faces looking at the lens (stock photo, not a clip).
- A lower-third naming the Guest as a doctor or expert.
- The product held up to the lens.
