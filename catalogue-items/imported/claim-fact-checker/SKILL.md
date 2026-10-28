---
name: fact-checking
description: Verify the accuracy of claims and statements by extracting individual assertions, identifying authoritative sources, cross-referencing evidence, and assigning confidence-scored verdicts. Use when the user requests fact checking or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Fact-Checking

This skill enables an AI agent to systematically verify claims and statements. Rather than offering a simple true/false judgment, the agent extracts discrete checkable claims from the input, identifies authoritative sources for each, cross-references evidence, and produces a structured verdict with a confidence score and supporting reasoning. The approach is designed to handle everything from single factual assertions to full articles containing dozens of claims.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Extract Claims:** Parse the input text and isolate individual, verifiable assertions. Each claim should be a single, self-contained statement that can be independently checked. Discard opinions, subjective judgments, and unfalsifiable statements, but note them as "not checkable" in the output.

2. **Classify Claim Types:** Categorize each claim by type — statistical (involves numbers or data), historical (references past events), scientific (references research findings), definitional (defines a term), or attribution (attributes a statement to a person or organization). The category guides where to look for verification.

3. **Identify Authoritative Sources:** For each claim, determine the most appropriate verification sources. Use primary sources whenever possible: official datasets for statistics, peer-reviewed papers for scientific claims, archived transcripts for quotations, and government records for legal or policy assertions. Supplement with reputable secondary sources like established fact-checking organizations (Snopes, PolitiFact, Full Fact).

4. **Cross-Reference and Evaluate Evidence:** Check each claim against at least two independent sources. Note whether sources corroborate, partially support, or contradict the claim. Assess source credibility by considering authority, recency, methodology, and potential bias. Only cite sources you actually opened. If a source cannot be reached or confirmed, mark the claim Unverifiable and say so. Never invent a URL, figure or quote.

5. **Assign Verdicts and Confidence Scores:** For each claim, assign a verdict from the scale: **True**, **Mostly True**, **Half True**, **Mostly False**, **False**, or **Unverifiable**. Accompany each verdict with a confidence score (0.0-1.0) reflecting the strength and consistency of available evidence, and a brief justification.

6. **Compile the Fact-Check Report:** Present findings in a structured format: list each claim, its verdict, confidence score, supporting evidence, and source links. Include an overall assessment summarizing the accuracy of the original text.

## Usage

Provide the agent with a statement, paragraph, or full article to fact-check. A finished document from an earlier step works too. You can optionally specify which claims to prioritize or request a particular output format.

```
Fact-check the following statement:
"[A CLAIM ABOUT A RANKING, WITH ITS SOURCE AND YEAR], and [A CLAIM ABOUT WHO CREATED IT AND WHEN]."
```

## Examples

The examples below show the format only, with bracketed placeholders. They hold no real findings. Never copy a verdict, figure or source from an example into a real report.

### Example 1: Fact-Checking a Short Post (format only)

**User Request:**
> Fact-check the key claims in this excerpt:
> "[CLAIM ABOUT A COMPARISON]. [CLAIM ABOUT AN EVENT AND ITS DATE]. [CLAIM ABOUT A SURVEY RESULT AND ITS YEAR]."

**Extracted Claims:**

| # | Claim | Type |
|---|---|---|
| 1 | [Comparison claim] | Comparative |
| 2 | [Event claim, with date] | Historical |
| 3 | [Survey claim, with year] | Statistical |

**Fact-Check Results:**

| # | Verdict | Confidence | Evidence |
|---|---|---|---|
| 1 | **[Verdict from the scale]** | [0.0-1.0] | [What the source says, in your own words]. Source: [PAGE YOU ACTUALLY OPENED, with link] |
| 2 | **[Verdict]** | [0.0-1.0] | [What two independent sources say]. Sources: [PAGE 1], [PAGE 2] |
| 3 | **Unverifiable** | [low score] | [Why no source could be opened or confirmed]. No link is made up. |

**Overall Assessment:** [One or two sentences on how accurate the whole text is, and which claims to fix first.]

---

### Example 2: Fact-Checking Statistical Claims (format only)

**User Request:**
> Verify: "[A TOTAL AMOUNT IN A GIVEN YEAR]. [A PERCENTAGE OF A NAMED GROUP]. [AN AVERAGE RETURN FIGURE]."

**Fact-Check Results:**

| # | Verdict | Confidence | Evidence |
|---|---|---|---|
| 1 | **[Verdict]** | [score] | [Compare the claimed figure with the figure in the source, and say whether it is exact or only close]. Source: [PAGE YOU OPENED, with date] |
| 2 | **[Verdict]** | [score] | [Check that the group in the source is the same group the claim names]. Source: [PAGE YOU OPENED] |
| 3 | **[Verdict]** | [score] | [If no credible study gives a general figure, say so and mark Unverifiable]. |

**Overall Assessment:** [Say which figures hold, which are imprecise, and which should not be cited without a source.]

## Best Practices

- **Isolate each claim before verifying.** Complex sentences often bundle multiple assertions. Splitting them ensures nothing is overlooked and verdicts remain precise.
- **Prioritize primary sources over secondary reporting.** A news article saying "a study found X" is less reliable than reading the study itself. Always trace claims to their origin.
- **Account for context and framing.** A technically true number can be misleading if taken out of context. Note when a claim is true but presented in a way that implies something false.
- **Use the confidence score honestly.** A score of 0.5 is not a failure — it reflects genuine ambiguity. Overconfident verdicts erode trust more than honest uncertainty.
- **Check the date of the claim and the source.** A claim that was true in 2020 may be false in 2025. Always verify that the evidence is temporally relevant to the assertion.
- **Distinguish between "false" and "unverifiable."** If no credible evidence exists either way, the verdict should be "Unverifiable," not "False."

## Edge Cases

- **Claims about the future:** Predictions ("AI will replace 50% of jobs by 2030") cannot be fact-checked against evidence. Label them as "Predictive — not verifiable" and note the credibility of the source making the prediction.
- **Rapidly changing statistics:** If the claim involves a metric that updates frequently (e.g., cryptocurrency prices, COVID case counts), note the date the claim refers to and the date of verification, since the answer may differ.
- **Satirical or hyperbolic content:** If the source material is clearly satirical or uses deliberate exaggeration for rhetorical effect, note this context rather than issuing a literal "False" verdict.
- **Claims with no authoritative source:** Some niche or proprietary claims (e.g., internal company metrics) may have no publicly verifiable source. Label these "Unverifiable — no public source" and recommend the user request documentation from the claimant.
- **Ambiguous wording:** When a claim can be interpreted multiple ways (e.g., "most popular" could mean by usage, by survey, or by downloads), evaluate the most reasonable interpretation and note the ambiguity.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Fact cross-checker](https://useaiblocks.com/skills/fact-cross-checker). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
