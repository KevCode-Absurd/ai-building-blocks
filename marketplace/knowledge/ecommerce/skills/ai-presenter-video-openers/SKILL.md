---
name: ai-presenter-video-openers
description: "Make a batch of about ten short talking-presenter openers to splice onto a video ad body that already sells. Angles come from the account's own opener data and from the product itself, never repeat within a batch, and each line has a cue word that times the reveal of the real product. Presenters (AI-made, staff or freelance) vary in look, setting and delivery pace, never pose as customers, and carry the disclosures Meta, TikTok, the FTC and the EU require. Each line is scored on clarity, relevance, novelty, specificity and credibility before anything is made, and written in a voice register matched to how sceptical the buyer is. The owner approves the lineup and the cost before any generation, every clip passes a product-accuracy check, and the test is sized from target cost per purchase."
---

# Talking-presenter openers for a proven ad body

**You get:** about ten talking-presenter openers for a proven video ad body, each with a line, cue word and prompt card or phone brief, plus a QC log and a round-by-round test plan.

The first seconds decide who keeps watching; the body decides who buys. When a body already sells, new openers are the cheapest way to reach new people with it. This skill picks opener angles from data and the product, writes and briefs them, and keeps any AI presenter honest.

## When to use

- A video ad body has hit the store's target cost per purchase and its reach or hook rate is slipping.
- The store wants opener variety without a new shoot.
- A sale or seasonal moment (with a real date) needs openers on a proven body.
- A creator or founder is unavailable and the store needs a presenter for openers only.

## Not for

- A whole new video ad: use `ai-creator-style-video-ad` or `mechanism-explainer-video-ad`.
- Openers with no person and no voice: use `wordless-video-openers`.
- Sorting live ads into scale, keep, fix, cut: use `store-meta-creative-review`.
- New concepts for a new body: use `store-meta-concepts`.

## What you need

**Required**

- The body: video file, transcript, first and last frames.
- Meta export by ad, last 60 to 90 days: ad name, spend, impressions, 3-second video plays, ThruPlays, average play time, CTR (link), purchases, cost per purchase. TikTok: the same with 2-second and 6-second views.
- Product page URLs and clean photos of the exact product, packaging and label.
- Brand voice: five real lines, words to avoid, claims to avoid. Facts file with sources and dates.
- Gross profit per purchase and target cost per purchase.

**Optional**

- Reviews CSV for customer phrases; cut openers with their numbers; the store's buyer types (who buys for whom).

**Access.** Level 1, read. Any spend on a generator, presenter or freelancer needs the owner's yes and a cap. Paused upload needs level 2 and a yes.

## Before you start: the gates

1. **The body is proven.** It spent at least 3 times target cost per purchase at or under target [ADC-0039]. Fail: stop; hooks on an unproven body multiply a weak ad [MCR-0048].
2. **Money known.** Gross profit per purchase and target cost per purchase exist. Fail: run `store-meta-math`.
3. **Cash and capacity.** Generation cost (including failed runs, which many tools still charge) plus test cost fits the cap, and someone can splice. Fail: fewer openers.
4. **Disclosure agreed.** The owner accepts that AI presenters are labelled and never speak as customers. Fail: use a real staff or freelance presenter.
5. **Tracking.** Meta purchases within about 20% of Shopify paid-social orders over 30 days (practitioner default, test it). Fail: read from Shopify with a UTM per opener.

## Steps

### 1. Read the opener data

For every past opener compute hook rate (3-second plays / impressions), hold rate (ThruPlays / impressions) and cost per purchase at ad set level [ADC-0059]. Group by angle. An angle wins only if hook rate and purchases hold together; a high hook rate with weak purchases draws the wrong viewers [MCR-0026] [MCR-0029].

### 2. Set the batch mix

Of about ten openers: five or six remake winning angles in a new way, two or three fix near-misses, at least two are new [MCR-0042]. With no history, run five new angles and call it exploration.

### 3. Look at the product, then pick angles

Start from what the product is and who buys it, then choose angles that fit; never write a line first and force a product into it. No angle repeats within a batch.

| Angle | Opener idea | Rule |
|---|---|---|
| Call-out | Names a habit or situation the right buyer recognises | No personal traits (Meta personal attributes policy) |
| Moment | The exact moment the problem shows up | Must match the body's problem |
| Near miss | The usual choice almost made instead | No first-person buyer story from an AI face |
| Result | The outcome shown, then the product | Only results in the facts file |
| Proof number | A dated review count or test result | Source on file |
| Objection | A doubt in a customer's words, then the turn | The body must answer it |
| Contrarian | A common habit that makes it worse | Provable fact only |
| Gift or occasion | Who it is for and the date | Real date only; deadline lines only with a real deadline |

Keep at most one wildcard (a whisper, an exaggeration) per batch, and only if the brand voice allows it.

Match the angle to how much the buyer knows. Problem-agitation openers reach only people who already feel the problem and stall at scale; a contrarian truth works at every awareness level [MCR-6656]. Lead with the problem rather than a label: "agency owners, listen up" feels like an ad, and a batch full of narrow persona call-outs leaves Meta unable to tell who fits which, so the same viewer sees several and none feels personal [MCR-6855] [MCR-6786]. Rewriting a product line into a lesson the viewer wants (a quick label check before buying) lets the opener start as education [MCR-6740].

### 4. Write each opener

- 3 to 6 seconds, about 8 to 18 spoken words; up to 8 seconds only for a calm read that needs a pause (practitioner default, test it).
- Three levers: spoken line, on-screen text, visual [MCR-0028]; the opening words carry most of the weight [MCR-0063].
- One cue word in the line times the product reveal ("...then I found this"). The product shown is the real one from the reference photos.
- The last half second bridges into the body's first line [MCR-0015] [MCR-0027].
- No "it's not X, it's Y" lines [MCR-0016]; no "hey guys" openings; never start with "Introducing" or "Meet the".
- **Time it the same way every time:** spoken words divided by 2.5, plus half a second for each marked pause, rounded to the nearest half second and labelled "estimate". Read each aloud and time it before production; trim anything that runs past the length set above.
- **Delivery notes per line:** pace (slow, medium, fast), the one stressed word, where the pause goes, and the background sound (silence, room, music).
- **Pick a voice register per opener**, and keep one register for the whole ad it opens:

| Register | Sounds like | Who may say it | Suits |
|---|---|---|---|
| Educator | Calm, a fact or a cause the store can source ("Here's what nobody checks on the label") | Anyone, including an AI presenter | Buyers who want trust |
| Narrator | Third person, story-led ("She stopped buying the big tub. Here's why.") | Anyone | Brand stories; slower to sell |
| Casual friend | Direct, warm, like a text ("Quick thing about your morning shake") | Anyone; premium brands may find it too casual | Sceptical buyers |
| Observer | Passes on a real customer's words, quoted exactly with the source ("One buyer wrote: ...") | Anyone, with the quote on file | Proof-led bodies |
| Customer | First person, own use ("Two weeks in. Honest take.") | Only a real customer filming their own opener, never a presenter | Sceptical buyers |
| Founder | First person, why it was made | Only the real founder on their own footage | Trust and origin |

Sceptical buyers often take to friend and customer voices; buyers who want trust often take to educator and founder voices. These are starting points to test, not rules. A batch made only with presenters uses the first four registers.

**Score every line before the lineup.** Rate each 1 to 5 on clarity (a stranger gets it in 3 seconds), relevance (a real problem, not a label), novelty, specificity (a number, a name, an outcome) and credibility (does the presenter look right saying it) [MCR-6668]. Add the five and multiply by 4 for a score out of 100, with the sum shown. Any line with clarity or relevance under 3 is dropped whatever its total; 80 and up goes to the lineup, 60 to 79 is rewritten once, under 60 is cut (starting bands, test them). Rewrites change one lever at a time: the spoken line, the text or the visual.

### 5. Cast and pace for variety

- Vary presenter look, setting (kitchen, car, desk, outdoors) and delivery pace (calm, quick, level). No presenter appears more than twice in a batch. A different person on the same body counts as new; recut footage does not [MCR-0047]. Premium brands drop the quick, loud reads; loud brands lean into them.
- Openers must differ in angle, line and visual, or Meta groups them as one ad [MCR-0078].

### 6. Keep AI presenters honest

An AI presenter speaks as the brand or a narrator ("Here's what this does"), never as a buyer ("I bought this for my dad"). No invented reviews or results. Add "AI presenter" on screen where the market requires it and set the platform's AI label: the FTC treats AI testimonials posing as customers as fake reviews, and its 2024 rule bans AI-generated fake testimonials outright [MCR-6045]; virtual influencers must disclose they are not human where local influencer codes say so; TikTok requires realistic AI content to be labelled; the EU AI Act requires deepfake disclosure. Check current rules. Never copy a real person's face or voice, and keep other brands' names and landmarks out of prompts.

### 7. Approve the lineup and cost, then produce

Show the owner a table (angle, presenter, setting, pace, line, cue word, reveal) with the cost estimate. Generate nothing until they approve; if they change one row, redo only that row.

Prompt card per opener, any talking-video or avatar tool: presenter look and energy; setting and light; handheld phone framing, not studio; the line word for word in quotes; the cue word and what the camera does on it; "the exact product from the reference images"; pace words; one product only. About 100 to 180 words per prompt (practitioner default). Manual path: the same card as a phone brief for staff or a freelancer.

Spec: 9:16 at 1080 x 1920, captions burned in, text clear of the top and bottom interface areas, same frame rate as the body.

### 8. Check every clip

Reject if lip sync drifts, hands or faces warp, the product's colour, logo, label or size is wrong, a claim is missing from the facts file, the disclosure is missing, or it runs long. Save as body ID, opener number, angle, presenter.

### 9. Plan the test

- 2 to 4 openers per body per round at modest budgets [MCR-0013]; larger accounts 4 to 5 [MCR-0076]. Ten openers make two or three rounds.
- Optional free pre-test: cuts posted as Instagram trial reels without the call to action [MCR-0041].
- Launch as variations in the body's own ad set [MCR-0079]. Keep or cut at 3 times target cost per purchase [ADC-0039]; store orders win when they disagree with Meta.

## Checks before you hand it over

1. The body passed gate 1, with its numbers shown.
2. Every angle traces to the data table or is labelled new; none repeats.
3. Every line has a cue word, reveals the real product and bridges into the body.
4. No AI presenter speaks as a customer; every AI clip carries its disclosure.
5. Every claim maps to the facts file; deadlines are real.
6. The owner approved the lineup and cost before generation.
7. Every clip passed step 8; rounds and budgets fit the cap.
8. Every line has a score with its sum, a register a presenter may honestly use, delivery notes and a timed estimate.

## Output

1. **One-screen summary:** body, first four openers to test, rounds, cost, read dates, disclosure used.
2. **Opener data table:** angle, openers run, hook rate, hold rate, cost per purchase, verdict.
3. **Lineup table:** ID, angle, presenter, setting, pace, line, cue word, on-screen text, reveal, length.
4. **Prompt cards and phone briefs**, one per opener.
5. **QC log:** clip, each check, pass or fail.
6. **Test plan:** round, ad set, openers, budget, start, read date, keep or cut rule.

## Common mistakes

- **New openers on a body that never sold.** Gate 1 stops it.
- **An AI face telling a buyer's story.** Step 6 bans it.
- **Lines written before looking at the product.** Step 3 starts from the product.
- **Ten openers Meta reads as one.** Step 5 varies angle, line, look and setting.
- **Paying for a batch nobody approved.** Step 7 gates spend.
- **A warped label.** Step 8 rejects it.

## Sources

- [ADC-0039]: judge after 3x target cost per purchase.
- [MCR-0048]: hooks on unproven bodies multiply a weak ad.
- [ADC-0059]: judge at ad set level.
- [MCR-0026]: hooks must filter for buyers.
- [MCR-0029]: high CTR can be a false winner.
- [MCR-0042]: split remakes, near-misses and new.
- [MCR-0028]: hooks have audio, text and visual levers.
- [MCR-0063]: opening copy carries most of the hook.
- [MCR-0015]: hook and body must match.
- [MCR-0027]: avoid abrupt jumps into the pitch.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [MCR-0047]: a new person on the hook revives a winner.
- [MCR-0078]: near-duplicates share one Meta entity.
- [MCR-0013]: 2 to 4 hooks per body.
- [MCR-0076]: larger accounts cut 4 to 5 openers.
- [MCR-0041]: pre-test cuts as trial reels.
- [MCR-0079]: test variations in the concept's ad set.
- [MCR-6045]: the FTC rule bans fake and AI-generated testimonials.
- [MCR-6656]: match hook type to awareness; contrarian truths work at every level.
- [MCR-6668]: score hooks on five traits.
- [MCR-6740]: turn a product hook into a lesson.
- [MCR-6786]: many narrow persona call-outs blur together.
- [MCR-6855]: lead with the problem, not a persona label.

What makes this skill ours: openers are only made for a body that hit target cost per purchase; angles come from hook rate and purchases together and from the product itself; every line is scored before production and spoken in a register the presenter may honestly use; AI presenters may never speak as customers and carry market-by-market disclosure; and the owner approves lineup and cost before any generation spend.

## Selling in India

- The ASCI guidelines require virtual influencers and AI presenters to disclose that they are not human, on screen and in the caption.
- Check the current ASCI code on the day the ads launch.
