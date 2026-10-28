---
name: segmentation-analysis
description: Customer/user segmentation with actionable insights. Use when identifying distinct customer groups, analyzing segment-specific behavior, profiling high-value segments, or testing segmentation hypotheses.
---

# Segmentation Analysis

# When to use
- The team needs to understand who the best customers are and what distinguishes them
- Marketing wants distinct groups to target with different messages or offers
- Product needs to prioritise features based on high-value user behaviour patterns
- Churn is high and the team needs to identify at-risk users before they leave
- An existing segmentation feels arbitrary and needs data validation or improvement

# Process
1. **Define the segmentation goal** — clarify what decisions the segments will inform (product roadmap, marketing campaigns, retention programs). The goal determines which variables matter and how many segments are useful (typically 3–7). See `references/segmentation_approaches.md`.
2. **Select and prepare variables** — choose 3–7 attributes or behaviours that vary across users and relate to the business outcome. Handle missing values and scale continuous variables. Remove outliers only if they would distort cluster centroids.
3. **Run the segmentation** — for data-driven segmentation, run k-means clustering yourself in code (for example with scikit-learn: scale the variables, try k from 2 to 8, keep the k with the best silhouette score) and add a segment label to each user. For rule-based segmentation, apply the business logic rules and validate that segments are distinct and non-overlapping. Then run `scripts/segmentation_runner.py --csv <file> --segment-col <label column> --metric-col <number column>` to profile each segment against the overall average. The script does not cluster. It expects a column that already holds each user's segment label.
4. **Profile each segment** — compute the mean and median for each variable by segment, expressed as % above/below the overall average. Identify the 2–3 defining characteristics of each segment and assign a descriptive name.
5. **Validate and interpret** — confirm segments are meaningfully different (silhouette score > 0.3 for clustering) and make business sense. Sanity-check by asking whether you would actually treat each segment differently.
6. **Map to strategy and report** — assign each segment to a recommended strategy (Retain & Expand, Monetise, Activate, Win-Back, Sunset). Produce `assets/segment_profile_template.md` with the profiles and strategic priorities.

# Inputs the skill needs
- User-level data with attributes (demographics, plan type) and behavioural metrics (sessions, revenue, feature usage, recency)
- Business goal the segmentation will serve
- Any existing segmentation to validate or replace
- Minimum of ~100 users per expected segment for clustering to be meaningful

# Output
- `scripts/segmentation_runner.py` — profiles pre-labelled segments against the overall average and ranks them by how far they sit above or below it (it does not cluster). The k-means run, elbow and silhouette charts come from the AI's own code
- `references/segmentation_approaches.md` — when to use k-means vs. RFM vs. rule-based; interpretation guide
- `assets/segment_profile_template.md` — filled segment profiles with size, key characteristics, recommended strategy, and tracking plan

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your customer list** (yours): a customer or order export with dates, amounts and what they bought.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your customer list, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Email audience and exclusion planner](https://useaiblocks.com/skills/email-segment-builder).
- **Understand your buyers** with the [Customer cancellation risk finder](https://useaiblocks.com/skills/churn-risk-finder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
