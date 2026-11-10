---
name: landing-page-copy
description: "Write landing page copy with attention to the hero, value proposition, social proof, objection handling, and conversion-focused CTAs. Use this skill whenever the user wants to write a landing page, sales page, hero section, or any conversion-focused web copy. Triggers on landing page, sales page, hero copy, value proposition, headline, subheadline, hero section, CTA copy, conversion copy, opt-in page, squeeze page. Also triggers when the user has a marketing campaign or product launch needing dedicated conversion copy. Use Landing page 30-point checker instead when the page already exists and the ask is to lift its conversion rate through testing rather than to write the copy."
category: content
catalog_summary: "Landing pages, sales pages, hero-to-CTA flow"
display_order: 4
---

# Landing Page Copy

Write copy for pages with a single conversion goal: signup, purchase, demo request, download, lead capture. Stack-agnostic.

This skill is narrower than a general writing skill. Landing pages exist to drive a specific action, not to inform broadly.

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Brand file**, made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand file.
3. This one.

**From the brand file, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a buyer brief, your brand file. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Writing a hero section for a homepage or product page
- Writing a sales page or long-form sales letter
- Drafting opt-in or lead-capture page copy
- Campaign-specific landing pages
- Pricing page copy
- Demo or signup CTAs

## When NOT to use

- Long-form blog content (ask your AI to write it directly, or use On-page SEO tuner for search copy)
- Email sequences (use Follow-up email sequence writer)
- Brand voice definition (use Brand voice one-pager writer)
- Page design and layout decisions (use Landing page design planner)

---

## Required inputs

- The product, service, or offer
- The target audience and the specific objection they bring
- The conversion goal (one specific action)
- Brand voice
- Existing customer language (testimonials, support tickets, sales calls)
- Any constraints (length, format, regulatory)

If audience is unclear or objections are unknown, ask the user for their buyers' main doubts, or for notes from sales calls, before writing.

---

## The framework: 7 sections

A landing page does seven things in sequence. The structure can flex (combine, reorder, expand), but the elements stay constant.

### 1. Hero

The first 3 to 5 seconds. Decides whether the visitor stays.

**Three components:**

- **Headline.** The promise. Specific, outcome-focused, free of cliche.
- **Subheadline.** The mechanism. How you deliver the promise.
- **Primary CTA.** The action. One button, descriptive label.

**Strong hero patterns:**

- **Outcome + audience + mechanism.** "Ship features 3x faster, for engineering teams who hate meetings, with our async-first project tool."
- **Pain reversal.** "Stop losing customers to slow page loads."
- **Surprising claim.** "The note-taking app that gets used. We have data."
- **Direct address.** "You have 47 unread Slack messages. Here's what to do about it."

**Weak hero patterns:**

- Generic adjective stacking ("Powerful, intuitive, scalable")
- "Welcome to our platform"
- Brand-name-only headlines ("Acme: The Future of X")
- Vague benefits ("Streamline your workflow")

### 2. Social proof (early)

Within the first scroll, prove someone else trusts you.

**Forms:**
- Customer logos (recognizable beats unknown)
- Quantitative trust signal ("Over 10,000 teams")
- One strong testimonial with name and role
- Press mentions (logos of where you've been featured)

**Placement:** Right below the hero, before the visitor invests in reading more.

### 3. Problem / promise

Establish that you understand the visitor's situation.

**Pattern:**
- 1 to 3 paragraphs naming the specific problem
- Use the visitor's language (mined from research, not your marketing language)
- Stop before you sell. Resonate first.

**Test:** Read the problem section aloud. Does the target audience nod? If they don't, you don't understand them yet.

### 4. Solution / mechanism

How you solve the problem. The "what we actually do" section.

**Effective structure:**
- One headline summarizing the solution
- 3 to 5 specific features or capabilities, each with a 1-2 sentence explanation
- Each feature framed as the benefit it produces, not the technical detail
- Visual support (screenshots, illustrations, video clips)

**Failure mode:** Listing features without translating to outcomes. "Real-time collaboration" is a feature. "Edit together without copying-pasting from email" is the outcome.

### 5. Proof and detail

The expanded social proof and case studies section.

**Components:**
- 1 to 3 detailed case studies (specific customer, specific outcome, specific numbers)
- Multiple testimonials with attribution
- Specific data points (usage stats, success metrics, growth)
- Awards, certifications, or third-party validation

The deeper proof section is where committed visitors convert. Skim-readers won't make it here, but the ones who do are ready to buy.

### 6. Objection handling

Anticipate the reasons people say no. Address them directly.

**Common objection types:**
- **Price.** "Is this worth it?"
- **Time.** "Will this take forever to set up?"
- **Trust.** "Will this actually work for my situation?"
- **Risk.** "What if I commit and it's wrong?"
- **Comparison.** "How is this different from [competitor]?"
- **Implementation.** "Can my team handle the change?"

**Handling formats:**
- **FAQ section.** Structured, scannable.
- **Comparison table.** Vs. competitors or vs. alternatives.
- **Risk reversal.** Money-back guarantee, free trial, no-contract terms.
- **Proof of effort needed.** "Setup takes 5 minutes, not 5 weeks."

### 7. Final CTA

The closer. Re-state the offer. Re-state the action.

**Strong final CTAs:**
- Repeat the primary CTA from the hero (consistency)
- Frame in terms of the visitor's situation ("Get your team set up in 5 minutes")
- Remove friction ("No credit card required")
- One action only (avoid offering 5 alternatives that paralyze decision)

**Avoid:**
- Multiple CTAs competing for attention at the bottom
- New offers introduced only at the bottom (visitor is now confused)
- Long forms that ask for more information than needed for the action

---

## The CTA itself

Buttons matter. Treat the button copy as a whole-page-worth of attention.

**Strong CTA patterns:**

- **Action + outcome.** "Start your free trial," "Get my pricing," "Send me the guide"
- **First-person.** "Show me how" outperforms "Show you how"
- **Specific.** "Book a 15-minute demo" beats "Contact us"
- **Low-friction.** "Free trial, no credit card" reduces commitment cost

**Weak CTAs:**
- "Submit" (functional but lifeless)
- "Click here" (no value statement)
- "Learn more" (vague; about what?)
- "Get started" (started doing what?)

---

## Workflow

1. **Confirm the offer.** What exactly is being offered? At what price (if any)? What does the visitor get?
2. **Confirm the audience and objection.** Specific segment. The specific worry they bring.
3. **Mine the language.** Customer testimonials, support tickets, sales calls. Use real customer phrases.
4. **Draft the hero.** Headline, subheadline, CTA. Test 5 to 10 variations.
5. **Build the structure.** All 7 sections in order. Sections can combine for shorter pages.
6. **Draft sections.** Section by section. Don't polish until the structure is sound.
7. **Edit for friction.** Remove every word that doesn't earn its place. Landing pages do not have words to spare.
8. **Test the CTA.** Read the page aloud. By the end, is the visitor's next action obvious?
9. **Hand off with a post-import checklist.** The deliverable is a markdown document, not a built page, so step 9 is not something you perform: it is a list you attach for whoever builds the page. Spell-check the copy yourself, then hand over the rest. Every destination URL resolves. Mobile preview of the built page. SEO basics if SEO is a goal. If the page is already built and you are revising it in place, run the checklist yourself instead of handing it over.

---

## Failure patterns

- **Hero that explains instead of sells.** "We're an X for Y" is description. "Get X without Y" is sell.
- **Feature lists with no outcomes.** Features without benefits read as a spec sheet.
- **Generic testimonials.** "Great product!" is worth less than nothing. "[a specific result a real customer gave, with the number they gave]" is gold. Never write that result yourself.
- **Multiple competing CTAs.** Pick one primary action. Everything else is noise.
- **Walls of text.** Visitors scan. Use short paragraphs, bullet lists, and visual breakpoints.
- **No social proof.** Trust is the first hurdle. Without proof, the rest of the page does not earn the chance to be read.
- **Mismatched headline and CTA.** Hero promises X, CTA asks for Y. Visitor confused.
- **Writing for everyone.** "Our solution works for any business" appeals to no one. Specificity converts.
- **Ignoring mobile.** Most visitors are on mobile. Test the page at 375px first.

---

## Output format

Default output is a structured markdown document for the page, with each section labeled. The markdown is ready to import into the CMS or hand to design.

Structure:

```markdown
# [Page Title]

## SECTION: Hero
- Headline: [text]
- Subheadline: [text]
- Primary CTA: [button text]
- Supporting cue: [optional, e.g., "No credit card required"]
- Hero visual notes: [if any]

## SECTION: Social proof (early)
- Logo bar: [list customer/press logos]
- Trust statistic: [if any]

## SECTION: Problem / promise
[2 to 3 paragraphs]

## SECTION: Solution
- Headline: [text]
- Feature 1: [headline + description]
- Feature 2: [headline + description]
- Feature 3: [headline + description]

## SECTION: Proof
- Case study 1: [customer, outcome, numbers, or state the gap per the data-availability rule]
- Testimonials: [list]
- Data points: [list]

## SECTION: Objection handling
- FAQ: [questions and answers]
- OR Comparison table: [vs alternatives]
- OR Risk reversal: [guarantee, terms]

## SECTION: Final CTA
- Headline: [text]
- Final CTA button: [text]
- Supporting cue: [optional]

## Variants for testing
- [Alternate headlines]
- [Alternate CTAs]
- [Alternate proof framings]

## Handoff checklist
- [ ] Every button and link goes to a working address
- [ ] The built page looks right on a phone
- [ ] SEO basics are set, if search is a goal
- [ ] Real proof is added wherever this copy marks a gap: [list each gap]
- [ ] The copy is spell-checked
```

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If required data is unavailable

This skill's output depends on data, measurements, or tool results it cannot generate on its own. When a required input, tool, or data source is unavailable or unverifiable, the sanctioned output is the deliverable with the gap stated: what was needed, what was actually obtained or verified, and which parts of the output are affected. Fabricating, estimating, or interpolating a required number to complete the deliverable is never sanctioned. A stated gap is a complete answer.

---

## Reference files

- [`references/hero-formulas.md`](references/hero-formulas.md) - Patterns and formulas for hero headlines.
- [`references/objection-library.md`](references/objection-library.md) - Common objections by category, with handling strategies.
