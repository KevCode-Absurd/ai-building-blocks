---
name: data-analysis
description: Analyze datasets to answer defined questions through statistical methods, trend identification, hypothesis testing, and correlation analysis. Use when the user needs evidence-backed findings or decisions from data; use exploratory-data-analysis instead for open-ended first-pass profiling before questions are defined.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Data Analysis

This skill enables an AI agent to perform rigorous statistical analysis on structured datasets. The agent loads data, computes descriptive and inferential statistics, identifies trends and correlations, tests hypotheses, and produces actionable insights. It supports CSV, Excel, Parquet, and JSON inputs and leverages pandas, scipy, and statsmodels for analysis.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **An audit report** with the [Dataset profiler](https://useaiblocks.com/skills/dataset-profiler). Bring a spreadsheet.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, your question, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude with code running, or ChatGPT with data analysis:** They can open your file and run the Python tests, so every number is computed, not guessed.
<!-- /needs -->

## What you need first

- A dataset file (CSV, Excel, Parquet or JSON) the AI can open.
- One clear question. If the person has no question yet, stop and suggest the New dataset explorer (exploratory-data-analysis) first.
- An AI that can run Python with pandas, scipy, statsmodels and numpy. If it cannot run code, say so, explain which tests you would run, and do not report any number you did not compute.

## If something is missing

Ask once. If the question, the file or the key columns are still missing, write `MISSING: <what>` and stop. Never invent rows, columns or results. Report every number from the person's own file only.

## Workflow

1. **Load and profile the data.** Read the dataset into a pandas DataFrame and inspect its shape, column types, and memory usage. Display the first and last rows to confirm the data loaded correctly. Check for obvious structural issues such as shifted columns or encoding problems.

2. **Compute descriptive statistics.** Generate summary statistics for all numeric columns including mean, median, standard deviation, skewness, and kurtosis. For categorical columns, compute value counts and mode. This step establishes a baseline understanding of each variable's distribution.

3. **Identify trends and patterns.** Apply rolling averages, percentage changes, and seasonal decomposition to time-indexed data. For non-temporal data, use group-by aggregations and pivot tables to surface patterns across categories. Flag any monotonic trends or cyclical behavior.

4. **Perform correlation and hypothesis testing.** Calculate Pearson and Spearman correlation matrices to quantify relationships between variables. Conduct hypothesis tests (t-tests, chi-square, ANOVA) where appropriate to determine statistical significance. Report p-values and confidence intervals alongside effect sizes.

5. **Detect anomalies and outliers.** Use the IQR method and z-scores to identify data points that deviate significantly from the norm. Cross-reference outliers with domain context to determine whether they represent errors, rare events, or meaningful signals.

6. **Synthesize findings into a report.** Summarize the key insights in plain language, supported by specific numbers. Rank findings by business impact or statistical significance. Include limitations and caveats such as sample size constraints or confounding variables.

## What you hand back

A findings note with these parts, in this order:

1. **Question and data**: the question in one line, the file used, row and column counts, and anything dropped or fixed.
2. **Answer**: one or two plain sentences that answer the question, and how sure you are.
3. **Key numbers**: a small table of the figures behind the answer (summary statistics, trend, correlation, test result with p-value, effect size and confidence interval).
4. **Findings, ranked**: each one with its number, what it means for a decision, and its caveat.
5. **Outliers and data problems**: what you found, what you did about it.
6. **Limits and next step**: sample size, confounders, the test you would run next, and what the person should do with the note.

Correlation is not cause. Say so whenever you report one.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Analysis checker](https://useaiblocks.com/skills/analysis-checker). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Supported Technologies

- **pandas** — data loading, manipulation, and aggregation
- **scipy.stats** — hypothesis testing, statistical distributions
- **statsmodels** — time-series decomposition, regression analysis
- **numpy** — numerical computations

## Usage

Provide the agent with a file path to the dataset and a description of the analysis goals. Optionally specify which columns to focus on, the significance level for hypothesis tests (default alpha=0.05), and whether time-series methods should be applied.

## Examples

These two code sketches are illustrations. The file names and column names are placeholders. The numbers they print come from the person's own file, never from this skill.

### Example 1: Sales CSV analysis with pandas

```python
import pandas as pd
from scipy import stats

# Load the dataset (placeholder file and column names)
df = pd.read_csv("sales.csv", parse_dates=["order_date"])

# Descriptive statistics
print(df[["revenue", "units_sold", "discount"]].describe())

# Correlation analysis
corr = df[["revenue", "units_sold", "discount"]].corr(method="pearson")
print(corr)

# Hypothesis test: do discounted orders differ in revenue per order?
discounted = df[df["discount"] > 0]["revenue"]
full_price = df[df["discount"] == 0]["revenue"]
t_stat, p_value = stats.ttest_ind(discounted, full_price)
print(f"t={t_stat:.3f}, p={p_value:.4f}")
# Read the sign of t and the size of the gap before you write a conclusion.
```

### Example 2: Time-series analysis with seasonal decomposition

```python
import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose

# Load monthly data (placeholder file and column names)
df = pd.read_csv("monthly_revenue.csv", parse_dates=["month"], index_col="month")

# Needs at least two full seasonal cycles (24 months for period=12)
result = seasonal_decompose(df["revenue"], model="additive", period=12)

print(result.trend.dropna().tail(6))
seasonal = result.seasonal.groupby(result.seasonal.index.month).mean()
print(seasonal.nlargest(3))
# Describe the trend and the seasonal peaks from these printed values only.
```

## Best Practices

- Always inspect raw data before computing statistics — silent parsing errors (wrong delimiters, encoding issues) can invalidate every downstream result.
- Report effect sizes alongside p-values; statistical significance alone does not imply practical importance.
- Use non-parametric tests (Mann-Whitney, Kruskal-Wallis) when data distributions are heavily skewed or sample sizes are small.
- Segment analysis by meaningful categories (region, product line, customer tier) to avoid Simpson's paradox.
- Document assumptions explicitly — stationarity for time-series, normality for parametric tests, independence of observations.
- Validate surprising findings with a holdout sample or alternative methodology before presenting them as conclusions.

## Edge Cases

- **Missing values in key columns.** If more than 30% of a target column is null, warn the user that imputation may introduce significant bias. Offer to analyze the complete-case subset instead.
- **Extremely skewed distributions.** Log-transform or use median-based statistics when skewness exceeds |2.0| to avoid misleading mean values.
- **Multicollinearity.** When two predictors correlate above 0.9, flag this and recommend dropping one or using regularized models to avoid inflated coefficients.
- **Small sample sizes (n < 30).** Switch to exact tests or bootstrap methods and widen confidence intervals accordingly.
- **Mixed data types in a single column.** Coerce carefully and report how many values could not be converted, rather than silently dropping them.
