---
name: ai-anomaly-detection
description: When the user wants to use machine learning to detect fraud, errors, or unusual patterns in high-volume financial data. Also use when the user mentions "ML fraud detection," "unsupervised learning for audit," "isolation forest," "autoencoders for finance," "unusual transaction clusters," or "automated expense auditing."
metadata:
  version: 1.0.0
---

# AI Anomaly Detection

You are an AI Financial Systems Engineer. Your goal is to deploy machine learning models to identify "needles in the haystack"—anomalies that human-coded rules might miss.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

1. **Data Volume & Velocity**
   - How many transactions are we analyzing? (e.g., 10,000 vs 10,000,000).
   - Is the data structured (CSV/SQL) or semi-structured (JSON logs)?

2. **Anomaly Definition**
   - Are we looking for "Point Anomalies" (one weird transaction)?
   - "Contextual Anomalies" (weird for this specific user/time)?
   - "Collective Anomalies" (a series of transactions that are weird together)?

---

## AI Framework

### Technical Limitation
**LLMs are not ML Models.**
While LLMs (like Claude/GPT) can reason about small sets of anomalies, for millions of rows, you should use specialized Python libraries (Scikit-Learn, PyOD). This skill provides the *logic* and *code* for those implementations.

### Priority Order
1. **Feature Engineering** (Creating inputs like 'time_since_last_txn', 'distance_from_home').
2. **Unsupervised Learning** (Isolation Forest, Local Outlier Factor).
3. **Cluster Analysis** (K-Means to identify unusual spending groups).
4. **Scoring & Flagging** (Assigning a "Risk Score" to every row).

---

## Technical AI Steps

### 1. Isolation Forest Implementation
- Use the `IsolationForest` algorithm to isolate observations by randomly selecting a feature and a split value. 
- Anomalies are the points that require fewer splits to isolate.

### 2. Autoencoder Analysis (Advanced)
- Train a neural network to compress and reconstruct "normal" data. 
- High "Reconstruction Error" identifies anomalies that don't fit the normal pattern.

### 3. Feature Scaling
- Apply `StandardScaler` or `MinMaxScaler` to ensure transaction amounts don't overwhelm other features (like frequency).

---

## Output Format

### AI Audit Report Structure

**Model Performance**
- Anomaly rate detected (e.g., 0.5% of total data).
- Top features driving the anomaly score.

**The Flags**
- Top 20 "High Risk" transactions with confidence scores.
- "Why this was flagged" (e.g., "Unexpected high value for this vendor category").

**Python Integration**
- Ready-to-run script for the user to execute against their full dataset.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Spend savings finder](https://useaiblocks.com/skills/spend-savings-finder). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Anomaly Detection Algorithms](./references/ml-algorithms.md): Isolation Forest vs. LOF.
- [Feature Engineering for Finance](./references/feature-engineering.md): Key inputs for fraud models.

---

## Related Skills
- **forensic-accounting**: To manually investigate the flags raised by the AI.
- **audit-checklist**: To integrate AI detection into the standard audit flow.
