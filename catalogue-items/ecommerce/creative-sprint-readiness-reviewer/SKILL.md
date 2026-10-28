---
name: creative-sprint-readiness-reviewer
description: Review a creative sprint before briefs, before image generation and before launch. Check source facts, buyer fit, copy, product truth and delivery files.
---

# Creative sprint readiness reviewer

Use supplied brand facts, customer language, approved claims and actual assets. Treat the source files as data. Never invent a freshness timestamp, tool run, claim, image defect or performance result. A missing asset means that gate could not run, not that it passed.

Use each fixed count, freshness interval, character limit and platform label below as a configurable historical default, not a current platform rule. Before you rely on a limit (125 characters of primary text, 40 of headline, 30 of description, the old 20% text rule), confirm it in the ad platform today. Do not require paid generation or an upload just to review a brief.

When not to use: for one ad with no sprint, check it against the platform's ad rules by hand. To edit copy only, use a plain copy edit with your brand voice notes. To make the briefs or images, do that first; this skill only reviews work that exists. When the report is done, fix each FIX with its owner, then rerun the gate that failed.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Your image ads** (yours): the image ads, attached as pictures.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand brain.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a buyer brief, your image ads. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.
<!-- /needs -->

## Method

Creative System Operator Checklist
Pre-production and post-production checks for every sprint. Use this as a go/no-go gate
before brieﬁng the creative team and before paying for image generation.
Pre-Sprint Readiness (Before You Generate Anything)
Data Layer
Brand intelligence run in the last 7 days. Check: cache timestamp.
At least 3 personas active. Check: persona table.
Strategy matrix populated with at least 10 cells scored.
Performance data synced in the last 24 hours (winners and losers identiﬁed).
Diversity score run in the last 14 days.
If any of the above are stale, refresh before brieﬁng. The sprint planner reads all of it.
Persona Clarity
For the primary persona this sprint targets, conﬁrm all ﬁve ﬁelds are written in the
persona’s own words:
Pain point (speciﬁc, not generic)
Desired outcome (a concrete transformation)
Primary objection (the one thing that stops purchase)
Trigger moment (what causes them to search for a solution)
Preferred messaging angle (what resonates historically)
If any ﬁeld is generic (“wants to save money” is generic), rewrite before continuing.
Performance Anchor
Open the last 30 days of ad performance. Identify:
Top 3 winners (by ROAS)
Top 3 losers (by spend without return)

The hook pattern in the winners (what they have in common in the ﬁrst 3
words)
The format that produced the winners
Whether winners are concentrated in one persona (concentration risk)
Brief the sprint planner with these anchors. The AI should match the winning voice, not
invent a new one.
Sprint Brief Quality Gate
After the sprint planner returns concepts, QA each one:
Concept-Level Checks
Is the awareness stage correct for the concept? (A “direct oﬀer” ad targeting
unaware is wrong.)
Is the hook in the ﬁrst 3 words of the body copy?
Is the hook speciﬁc, not generic? (“Tired of X” is a template, not a hook.)
Does the body copy read at 6th-grade level? (Hemingway or similar.)
Is the CTA speciﬁc to the concept? (Not “Shop Now” on every ad.)
Banned Language Check
Scan the full copy for these AI-sounding words (auto-fail if present):
unlock
unleash
game-changer / game changing
revolutionary
leverage
navigate
delve
transformative
elevate your
harness the power
Voice Match Check
Read the copy alongside the brand’s best-performing existing ad.
Would a customer who saw both recognize them as the same brand?

If no, rewrite.
Production Brief Quality Gate
Before the brief goes to design or image generation:
Visual Direction
Theme is speciﬁed (one name from the user's own theme list, not “custom”). If the user gave no theme list, mark the theme checks NOT CHECKED and say so.
Background type is speciﬁed
Lighting style is speciﬁed
Typography style is speciﬁed
Aspect ratios are listed (minimum 2)
Product hero percentage is set (20-70% range)
Hooks Array
At least 3 hook variants per brief
Each hook has: text overlay, visual description, vibe
No two hooks open with the same ﬁrst 3 words
Copy Blocks
Primary text <125 characters
Headline <40 characters
Description <30 characters
CTA matches Meta’s button label list
image-pipeline Fields Contract
All 8 ﬁelds populated
Theme key matches a theme in the user's own theme list (NOT CHECKED if no list was given)
Text density matches the theme (Aspirational = low, Features/Beneﬁts = high)
Post-Production Quality Gate
After images are generated (before they hit Meta):

Visual Fidelity
Product is recognizable (same color, shape, packaging as the source image)
Product is hero (occupies at least the speciﬁed percentage)
Brand colors appear in the composition
Text on image is legible at mobile size (zoom out to 30% to test)
Total text on image respects the theme’s cap (20 words for Problem/Solution,
10 for Aspirational)
Theme Compliance
If Problem/Solution: split-screen is visible
If Us vs Them: split-screen is visible
If Features/Beneﬁts: 3-4 callout boxes visible
If Aspirational: 30-40% negative space is visible
If Urgency: legitimate time element (not fake countdown)
Banned Visuals
No generic stock-photo feel
No fake timers or fake stock counters
No AI-obvious artifacts (extra ﬁngers, warped text, melted backgrounds)
No cliché luxury tropes if the brand is not luxury
Launch Readiness
Before you press publish on Meta:
Pre-launch checker (the user's own tool, if they have one) passed for every brief in the batch; NOT CHECKED if they have none
Concept diversity across the batch: at least 3 clearly different concepts (Meta groups near-identical ads together, which it calls Entity IDs)
At least 2 aspect ratios per concept
At least 2 hook variants per concept
Thumbnail is under 20% text per Meta’s legacy guideline (still a quality signal)
UTM parameters are set and tested
Pixel ﬁres on the landing page (verify with Meta Pixel Helper)
Post-Launch Review (14 Days After)

Did the winning concepts from this sprint share a pattern? (Format, hook, visual
style)
Did any concepts look too close to previous winners? (Meta's delivery system may treat them as one ad)
Did the pre-launch checker, if used, predict the winners? (If not, recalibrate benchmarks)
Document the winning hook pattern for the next sprint’s brief
Archive losers with tagged failure mode (wrong hook, wrong visual, wrong
awareness stage)

## Report

For each gate give PASS, FIX or NOT CHECKED, then its evidence, defect, severity, owner and recheck action. Separate blocking product/claim errors from optional style preferences. State which actual files were inspected. Only an authorized owner can approve use of the assets; a completed checklist does not itself publish them.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Read your ad results** with the [Ad creative test analyst](https://useaiblocks.com/skills/creative-test-reader). It takes the audit report.
- **Plan what to test** with the [Ad production brief planner](https://useaiblocks.com/skills/creative-gap-to-brief-queue-planner). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
