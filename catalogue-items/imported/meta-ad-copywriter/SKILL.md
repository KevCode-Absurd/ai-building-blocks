---
name: ad-copy
description: "Write high-converting Meta (Facebook + Instagram) ad copy — primary text, headlines, descriptions, and UGC/video ad scripts. Use this skill whenever the user asks to write, rewrite, or brainstorm Meta ads, Facebook ads, Instagram ads, ad hooks, ad captions, ad primary text, UGC scripts, video ad scripts, talking head scripts, ad angles, ad variations, scroll-stopping hooks, or ad creative for social media. Also trigger for 'write me an ad', 'ADHD hook ad', 'in-feed VSL script', or any task involving creating paid social ad copy. Does NOT handle compliance review or non-ad copy types like landing pages, emails, or full VSLs."
---

> Created by **Rob Palmer**, direct-response copywriter.
> Source & updates: https://github.com/robpalmer99/claude-code-copywriting-skills
> Free under CC-BY-4.0. Attribution requested when redistributed.

# Meta Ad Copy Skill

**Real facts only (added by AI Blocks).** Health, weight-loss, body image and before-and-after ads face strict Meta ad rules, and lines like "your doctor won't tell you" or an implied personal health problem can be rejected. Check every line against Meta's current ad policy before launch. Every number, name, result, study, quote and review in your copy must come from the user's own real data. The sample lines in this file, such as the weight, health and "my sister sent me this article" lines, show the style only and are not claims to run. Write them as [X customers], [name], [result] and [source], and never invent proof. Any line that names an expert, a study or researchers needs a real, named source, or it comes out.

This skill writes high-converting ad copy for Meta platforms (Facebook + Instagram) — primary text, headlines, descriptions, and UGC/video ad scripts. It draws on proven direct response frameworks from Schwartz, Halbert, Makepeace, Georgi, Sultanic, and others.

The ad's ONLY job is to get the click. Not close the sale. Not educate fully. Get the click.

---

# Step 1: Classify the Ad Brief

Before writing a single word, determine these four things. Ask the user if unclear.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your org context.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a buyer brief, customer words. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Funnel Position

| Position | What They Know | Ad Approach |
|----------|---------------|-------------|
| **Cold traffic** | Nothing about you | Lead with problem/curiosity, longer education |
| **Warm/engaged** | Seen you before | More direct, mechanism-focused |
| **Retargeting** | Visited your page | Objection-handling, social proof, urgency |

## Awareness Level (Schwartz)

Eugene Schwartz's 5 Levels of Awareness determine everything — your headline, your copy length, your angle, and where the ad sends people:

| Level | Lead With | Ad Length | Send To |
|-------|-----------|-----------|---------|
| **Unaware** | Identity/emotion, not the problem | Long, educational | Advertorial |
| **Problem-Aware** | Name the pain vividly, tease mechanism | Medium-long | VSL or advertorial |
| **Solution-Aware** | Differentiate your mechanism | Medium | VSL or long PDP |
| **Product-Aware** | Overcome objections, add proof | Short-medium | PDP |
| **Most-Aware** | Lead with the deal | Short | Checkout or offer page |

The less aware they are, the longer your copy needs to be.

## Strategy: Sell the Click vs. Sell the Solution

This is the most important strategic decision for any Meta ad:

**Sell the Click** — Short caption, curiosity-driven image/video, minimal info revealed. The ad's job is ONLY to generate the click. The advertorial or VSL does the selling. Best for: unaware/problem-aware audiences, products that need explanation, high-ticket offers.

**Sell the Solution** — Longer video with education, visual demos, proof. The ad itself does much of the selling. The landing page just needs to close. Best for: solution-aware+ audiences, simple products, visual products, lower price points.

**Critical rule:** If you show the product in the ad, the viewer becomes product-aware. Never send a product-aware viewer to a blind VSL — send them to a PDP or offer page instead.

**Real-world example (Rob Palmer's own observation, not verified here; do not quote it as a fact in an ad):** Many 8-figure brands run BOTH strategies simultaneously. Static ads with product images sell the solution and send to PDPs. Curiosity video ads sell the click and send to advertorials or VSLs. Different awareness levels, different funnels, same brand.

## Ad Format

- **Static image + primary text** — Caption does the work, image stops the scroll
- **Short UGC / talking head** (15-60s) — First-person, phone-filmed feel
- **ADHD super hook ad** (3-7min) — Rapid-fire hooks, never stops hooking
- **Story-style video** (60-120s) — Personal narrative arc

---

# Step 2: Write the Ad

## Meta Ad Specs (Quick Reference)

Read `references/meta-ad-specs.md` for full specs. Key numbers:

- **Primary text**: First 125 characters show before "See more" — this is everything
- **Headline**: 27 characters optimal for mobile display (40 max)
- **Description**: 27 characters visible, often hidden on mobile entirely

---

## Writing Meta Primary Text

### The Three Fields

**Primary Text (above the creative)** — The main sell. First 125 characters are your headline equivalent.

Structure for "See more" expansion:
```
[Hook — first 125 chars. Must create an open loop or pattern interrupt]
                                               ← "See more" break
[Expand: agitate the problem, tease the mechanism, drop proof]
[CTA: tell them what to do next]
```

The "See more" click is a micro-conversion. Make expanding irresistible.

**Headline (below the creative)** — Benefit-driven, specific. NOT a label — a second hook.

Weak: "Learn More" | "Check This Out" | "Click Here"
Strong: "The 7-Second [Routine Name]" | "Why [Common Approach] Fails After [Age or Stage]" | "[Real Result] in [Real Time]"

**Description (below the headline)** — Secondary benefit or risk reversal. Often hidden on mobile, so don't put critical info here. Use for friction reduction: "Free shipping" | "No credit card needed" | "2-minute read"

### The WHY / WHAT / HOW Structure

Use this fill-in-the-blank formula (from Alen Sultanic) to structure any ad:

**WHY (The Problem)** — Open with curiosity or a contrarian hook. State the problem. Agitate.

> "Why do _____ matter more than _____ after ___?"
> "[Deep identifier — something that resonates with their identity]"
> "[Named expert or source, only if real] calls it '[NAME]'. But it's not a [COMMON GUESS] at all..."
> "It hits from all sides: [PROBLEM 1]. [PROBLEM 2]. [PROBLEM 3]. It's not [WRONG CAUSE], and it's not [WRONG BELIEF]."

(These are fill-in patterns for style only. Do not claim a cause, a cure or a personal health problem the user cannot prove, and check Meta's health ad rules before you run anything like it.)

**WHAT (The Mechanism)** — Pivot to the mechanism. Tease the solution without revealing it.

> "Fortunately, there is another way. One that focuses on _____ rather than _____."
> "Using this approach, [proof: thousands of people / specific number] are [specific result]."

**HOW (The Product/CTA)** — Reveal just enough to make the click inevitable.

> "Click below to discover how [mechanism] works for [their specific situation]."

---

## Hook Writing

The hook is the single biggest lever in ad performance. Test more hooks than anything else.

### Hook Types

| Type | Example | When to Use |
|------|---------|-------------|
| **Curiosity** | "There's a reason [the usual advice] never works for [problem]..." | Cold traffic, unaware |
| **Contrarian** | "Everything you've been told about _____ is wrong." | Problem-aware, skeptical |
| **Social proof** | "Over [X] [customers] have tried this 30-second trick..." | Solution-aware+ |
| **Story** | "Last [month] I was stuck with [problem] and [someone I trusted] said..." | Cold, emotional markets |
| **Demographic callout** | "Attention [group] who..." (Meta bars ads that imply you know a person's age, health or other personal traits, so check its policy first) | Cold, specific targeting |
| **Result** | "I [real result] in [real time] without giving up [real thing]." | Warm/retargeting |
| **Pattern interrupt** | "Stop scrolling. This actually matters." | Cold, saturated markets |
| **Fascinating fact** | "[A real fact about your topic, with a source you opened]." | Unaware, education-first |

### Hook Rules

- First 3 seconds of video / first line of text must arrest attention
- Use fragmented, open-ended curiosity — NOT complete fascinations that close the loop
- Be specific: use the exact count from the user's own records ("[X] women") not "thousands of women"
- Deploy tangible curiosity: hint at what they'll discover without revealing it
- Tell them what it's NOT to intensify what it IS: "It's not [common option A]... not [common option B]... not [common option C]..."
- A single winning hook can run for months. Test constantly.

### The Curiosity Toolbox

**Open Loops** — Create an information gap that can only be closed by clicking. Tease without resolving.

> "I tested [NUMBER] headlines. One pattern beat everything else by [X]x." (Which pattern? Use only your own real test results.)
> "The formula has three parts. The first is obvious. The third is counterintuitive. But the second? That's where the magic happens." (What's the second?)

**Tangible Curiosity** — Make curiosity concrete and specific, not vague.

Weak: "Discover the secret to [the result]"
Strong: "Discover the [SPECIFIC, TRUE METHOD] that [REAL RESULT YOUR PRODUCT DELIVERS]"

**Bucket Brigades** — Transition phrases that maintain momentum and pull forward:
- "But here's the thing..."
- "Here's what I discovered..."
- "This is where it gets interesting..."
- "Wait, it gets better..."
- "And that's not even the best part..."
- "Now here's what nobody tells you..."
- "Which brings me to the real secret..."

Use 2-3 per ad. Every paragraph ending with a bridge gets tiresome.

---

## Intrigue Intensifiers

These techniques make any ad more compelling:

**Tell them what it's NOT:**
> "It's not [common option A]... not [common option B]... not [common option C]..."
> "It's not what [the usual source] told you. It's not what the internet says."

**Tell them where it's NOT:**
> "You can't find it in any store, any pharmacy, any website..."
> "It's not available in any health food store — and for good reason."

**Drop specific hints:**
> "[A real fact about its age or size]"
> "[Real institution] announced it only last week" (only if true)
> "[A real fact about where it comes from]"

**Authority anchors:**
> "[Named expert] calls it..." (only with a real, named expert)
> "A study from [institution] proved..." (only with a real study you can link)
> "Researchers found..." (only with a real, cited study)
> "[Number] studies now show..." (only with real, cited studies)

## Making the Mechanism Appealing

The mechanism is what makes your solution different from everything else they've tried. The strongest mechanisms are:

- **Credible**: Backed by the most authoritative source possible
- **Exotic/rare**: Hard to find, expensive to produce, newly discovered
- **Small and specific**: "7-second trick" beats "20-minute routine"
- **Simple, fast, easy**: Low perceived effort to get the result
- **Expert-backed**: Someone credible behind the scenes
- **Celebrity-associated**: Known figures connected to it

---

## Proof and Credibility in Ads

Every claim needs support. In short-form ads, proof must be compressed:

- **Specific numbers**: the exact count from the user's own records ("[X] customers") not "thousands of customers"
- **Named results**: a real, consented customer result ("[Name] [real result]") not "our customers love it"
- **Timeframes**: "in 8 weeks" not "fast results"
- **Authority mentions**: Publications, institutions, studies
- **Visual proof**: Before/after, screenshots, product demos
- **Social proof**: User count, review ratings, waitlist numbers

---

## The Teaching Pattern (For Educational Ads)

When selling the solution through education, use this structure to help the prospect understand the problem — so they assume you have the solution:

1. **When things are normal, it's like this** (describe the baseline)
2. **Due to [UNAVOIDABLE FACTOR], the process breaks down** (explain the disruption)
3. **This causes your current symptoms/problems** (connect to their reality)
4. **If unaddressed, it gets worse, plus [other bad things] can happen** (raise stakes)

The prospect thinks: "They clearly understand the problem. They must have the solution." Then your CTA becomes: "Here's what to do about it."

---

## The So What? Chain

For every feature, ask "so what?" until you hit something emotional or financial:

> **Feature:** Fast database
> "So what?" → Queries load in milliseconds
> "So what?" → Users don't bounce, revenue doesn't leak
> "So what?" → You stop waking up stressed about churn

The bottom of the chain is where the ad copy lives. Not "saves 4 hours" but "close your laptop at 5pm instead of 9pm."

Three levels deep. Then write from there.

---

# Writing UGC / Video Ad Scripts

## Format A: Short UGC / Talking Head (15-60 seconds)

The goal: look and sound like a real person filmed this on their phone. NOT a scripted ad.

**Structure:**
```
[HOOK — 0-3s] Pattern interrupt, curiosity question, or bold claim
  [VISUAL: talking to camera, casual setting]

[PROBLEM — 3-10s] Name the pain specifically, make them nod
  [VISUAL: frustrated expression, relatable scenario]

[MECHANISM — 10-25s] Tease the discovery/solution, explain just enough
  [VISUAL: showing product casually, or demonstrating]

[RESULT — 25-40s] Specific transformation, before/after
  [VISUAL: showing results, genuine excitement]

[CTA — 40-60s] Natural close, not salesy
  [VISUAL: direct to camera, genuine recommendation]
```

**Voice rules:**
- First person, conversational — sounds like a real person sharing what worked for them
- Include verbal fillers sparingly ("honestly," "like," "I mean") for authenticity
- Specific details: names, dates, numbers, places — not vague claims
- The CTA should feel like a recommendation to a friend, not a pitch
- Include `[VISUAL DIRECTION]` notes for what should be on screen

## Format B: ADHD Super Hook Ad (3-7 minutes)

In-feed VSLs designed for cold traffic. They never stop hooking.

**Structure:**
```
[RAPID-FIRE HOOKS — 0-30s]
  3-5 different hooks back-to-back, each one an open loop
  Different speakers/angles, fast cuts
  DO NOT close any loops yet

[EDUCATIONAL/MECHANISM — 30s-3min]
  Teaching section: explain WHY the problem exists
  Use the teaching pattern above
  Tease the mechanism throughout — constant "but here's the thing..."
  Pattern interrupts every 30-45 seconds

[PROOF MONTAGE — 3min-5min]
  Testimonial clips with specific results
  Before/after visuals
  Authority mentions (studies, experts, publications)

[CTA — final 30-60s]
  Simple, direct, low-friction
  "Click the link below" or "Tap learn more"
```

**Critical rules:**
- NEVER mention the product by name — sell the click to a VSL/advertorial
- Constant hooks and pattern interrupts throughout — the moment it gets boring, they scroll
- Use fragmented hooks (not complete fascinations that resolve curiosity)
- Multiple speakers/perspectives create variety and social proof simultaneously
- Contrarian claims keep attention: challenge what they think they know

## Format C: Story-Style Video (60-120 seconds)

Personal narrative arc. Most effective for emotional markets.

**Real people only.** Every name, quote, timeframe and result in a story or UGC script must come from a real customer who agreed to be quoted. If there is none, write [quote from a real customer] and stop. Never write a testimonial for a person who does not exist, and never present a made-up story as a real one. The lines below show the shape only.

**Structure:**
```
[HOOK — 0-5s] Start in the middle of the struggle
  "[Time ago], I was [the struggle, in the customer's words]."

[STRUGGLE — 5-20s] Failed attempts, relatable frustration
  "I tried [what the customer really tried]. Nothing worked."

[DISCOVERY — 20-40s] The turning point, how they found the solution
  "Then [a real person or source] showed me [a real tip, article or product]..."

[TRANSFORMATION — 40-60s] Specific results with numbers and timelines
  "In [real time], I [real result]. [Real detail from the customer.]"

[CTA — 60-90s] Natural recommendation, not a pitch
  "I just wanted to share what actually worked for me. Link's below."
```

---

# Advertorial Awareness (What Your Ad Feeds Into)

Since many Meta ads send traffic to advertorials, understand the four advertorial types your ad might connect to:

1. **Story-Based** — Personal transformation narrative ("I was stuck with [a real problem your buyer has] until I tried [product]", from a real customer who agreed to be quoted). Makes it personal, real, and lets the reader live it.
2. **Listicle** — "5 reasons homeowners are switching to..." or "We tested the top 5 and found..."
3. **Editorial/Consumer** — Looks like a news article or editorial review.
4. **eCom Disruptor** — "Small watch company is disrupting the billion dollar industry." Underdog story.

**Match your ad to the advertorial:** If the advertorial is story-based, your ad hook should tease the story. If it's a listicle, your ad can tease the #1 finding. The ad and advertorial should feel like one continuous experience.

---

# Testing & Variation Strategy

## Always Output Variations

Every ad request should produce **3-5 variations** for testing. Label each with its angle:

```
## Variation 1: Curiosity Hook
[Primary Text]
[Headline]
[Description]

## Variation 2: Contrarian Hook
[Primary Text]
[Headline]
[Description]

## Variation 3: Social Proof Hook
...
```

## Testing Hierarchy (In Order of Impact)

1. **Hooks** — THE BIGGEST LEVER. Test 5-10 different hooks with the same ad body
2. **Images/thumbnails** — Different visuals with identical copy
3. **Caption length** — Short click-sellers vs. long story-sellers
4. **Video length** — 2 min vs. 7 min versions of same content
5. **Copy angle** — Different emotional approaches, same creative

## Testing Pattern of Winning Brands

- Control creative runs continuously for months
- New hooks tested constantly (same video body, different openings)
- When a hook wins, it becomes the new control
- Multiple ad sets running simultaneously with different hook/creative combinations
- Very rarely do people buy the first time. Frequency + multiple touchpoints = conversion.

---

# Shareability Principles (STEPPS Framework)

When an ad gets shared organically, your reach multiplies for free. Six principles drive sharing:

1. **Social Currency** — People share what makes them look smart or in-the-know. Use insider language, "secret" positioning, remarkable statistics.
2. **Triggers** — Tie your product to daily rituals ("Every morning when you..."). Frequent mental triggers = frequent sharing.
3. **Emotion** — High-arousal emotions drive sharing: awe, excitement, anger, anxiety. Low-arousal (sadness, contentment) kills sharing.
4. **Public** — Design messages that advertise themselves. Testimonials with real names. "Share your results" CTAs.
5. **Practical Value** — People share useful information. Tips, how-tos, frameworks are inherently shareable.
6. **Stories** — People retell stories, not facts. Embed your message inside a narrative people want to share. Your product must be integral to the story.

---

# Voice & Anti-Patterns

## The Tingle Factor

From Clayton Makepeace: feel your way through ad copy, don't think your way through it. Every sales message is a chain, link by link, to the click. The chain breaks when: the tingle drops (reader gets bored), something feels unbelievable, or clarity is lost.

Read your ad aloud. When the tingle dips at any passage, that's where you rewrite.

## Power Words (Use Liberally)

Check each word against Meta's ad policy first. Words like Miracle, Guaranteed and Shocking can get an ad rejected, and health claims face stricter rules.

Amazing, Astonishing, Breakthrough, Discover, Easy, Effortless, First Time Ever, Free, Guaranteed, How To, Hurry, Immediate, Instant, Introducing, Last Chance, Limited, Miracle, New, Now, Proven, Quick, Revolutionary, Secret, Shocking, Simple, Special, Surprising, Truth, Unique, Win, YOU

## Words and Phrases to Ban

**AI tells:** delve, dive into, comprehensive, robust, cutting-edge, utilize, leverage, crucial, vital, essential, unlock, unleash, supercharge, game-changer, revolutionary (when used generically), landscape, navigate, streamline

**Ad cliches:** "click the link in my bio," "you won't believe," "game-changer," "take your X to the next level," "in today's fast-paced world," "are you ready to"

**Wimpy hedging (Makepeace):** can, could, should, might, may, ought to — tell them what it WILL do

**Structural tells:** Every sentence the same length. Every bullet starting the same way. Perfect grammar that sounds written, not spoken. Overly organized with too many headings.

## The UGC Authenticity Test

Before delivering a UGC script, ask: would a real person actually say this out loud, on camera, to their phone? If it sounds like a copywriter wrote it, rewrite it. UGC scripts should feel slightly imperfect — that's what makes them believable.

## Readability

Aim for Flesch-Kincaid Grade 6 or lower. Short sentences. Simple words. If a 12-year-old wouldn't understand it, simplify.

## The Final Check

Before delivering ad copy, verify:

1. Does the first line stop the scroll? Would YOU stop scrolling for this?
2. Is every claim backed by a specific number or proof point?
3. Does it sound like someone talking, or someone "writing copy"?
4. Are there open loops pulling them to click?
5. Is it about THEM (their transformation) or about YOU (your product)?
6. Does the rhythm alternate? (Punchy moments, then breathing room)
7. Would a real person actually say this out loud?
8. Is the CTA benefit-driven, not command-driven?

If any answer is no, rewrite that part.

---

# Classic Direct Response Principles (Reference)

These foundational principles inform all good ad copy:

**Eugene Schwartz** — Match your headline and approach to the reader's awareness level. The less aware they are, the more indirect and longer your copy must be. At higher awareness, lead with the deal.

**Claude Hopkins** — Advertising is salesmanship in print. The only purpose is to make sales. Reason-why copy: don't just claim, explain WHY. Specificity creates believability. Test everything.

**David Ogilvy** — 5x as many people read the headline as read the body copy. Write the way you talk. Tell the truth, but make the truth fascinating. Give facts — readers remember facts, not adjectives.

**Gary Halbert** — Find a starving crowd first — the offer matters more than the copy. Write to one person. Tell stories, not pitches. Read your copy aloud.

**John Caples** — One headline can outpull another by 19.5x. Same product, same offer, different headline. Self-interest beats cleverness. Specifics beat generalities.

**Joseph Sugarman** — Every element has one job: get them to read the next element (the slippery slide). Seeds of curiosity: end paragraphs with hooks that pull forward. Honesty, Proof, Specificity, Familiarity, and Story are the biggest psychological triggers.

**Robert Collier** — Enter the conversation already taking place in the customer's mind. Six essentials: grab attention, describe, argue why they should buy, persuade NOW, risk-free offer, clear CTA.

**Clayton Makepeace** — The Tingle Factor: feel your way through copy. If the tingle drops, rewrite. Ban wimpy hedging words. Use the 75 Power Words. Address prospects directly with "YOU." Prove every point.

The greats all agree: know your audience before writing a word. Lead with their self-interest. Be specific, never vague. Tell stories. The headline does most of the work. Write like you talk. Honesty and proof beat hype.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check it before it goes live** with the [Meta ad policy checker](https://useaiblocks.com/skills/meta-ads-compliance-checker). It takes the ad copy and script.
- The [Headline promise checker](https://useaiblocks.com/skills/headline-promise-checker). It takes the ad copy.
- The [Ad awareness stage reviewer](https://useaiblocks.com/skills/ad-awareness-stage-checker). It takes the ad copy.
- The [Ad response copy editor](https://useaiblocks.com/skills/reply-getting-fix-writer). It takes the ad copy.
- The [Fresh line rewriter](https://useaiblocks.com/skills/fresh-line-rewriter). It takes the ad copy.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
