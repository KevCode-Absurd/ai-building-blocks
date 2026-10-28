---
name: data-cleaning
description: Clean and preprocess datasets by handling missing values, removing duplicates, correcting types, resolving outliers, and enforcing validation schemas. Use when the user requests data cleaning or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Data Cleaning

This skill enables an AI agent to systematically clean and preprocess raw datasets into analysis-ready form. The agent handles missing values, duplicate records, data type mismatches, inconsistent formats, outlier treatment, and normalization. It can also enforce validation schemas to ensure ongoing data quality. The primary toolchain is pandas with support from pyjanitor and great_expectations for advanced validation.

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

## Workflow

1. **Ingest and profile the raw data.** Load the dataset and immediately generate a quality report: count nulls per column, identify duplicate rows, check data types against expected schema, and flag columns with mixed types. This profile drives every subsequent cleaning decision.

2. **Handle missing values.** Apply strategy per column based on data type and missingness pattern. For numeric columns with less than 5% missing, use median imputation. For categorical columns, use mode or a dedicated "Unknown" category. For columns missing more than 40%, flag them for potential removal and consult the user before dropping.

3. **Remove duplicates and resolve conflicts.** Identify exact duplicates and near-duplicates (e.g., rows differing only in whitespace or casing). For exact duplicates, keep the first occurrence. For near-duplicates, apply fuzzy matching with a configurable similarity threshold and merge conflicting values by recency or completeness. Show the user the near-duplicate pairs and the threshold before merging: a loose threshold can merge two different people.

4. **Correct data types and standardize formats.** Coerce columns to their intended types — parse date strings into datetime objects, convert numeric strings to floats, and normalize categorical values to a canonical form. Standardize formats such as phone numbers, postal codes, and currency representations.

5. **Detect and treat outliers.** Use the IQR method (1.5x) for symmetric distributions and z-scores for normally distributed data. Offer three treatment options: cap at boundary values (winsorization), replace with null for later imputation, or flag-only mode that annotates but preserves original values.

6. **Validate the cleaned output.** Run the cleaned dataset through validation rules — non-null constraints, range checks, uniqueness constraints, and referential integrity. Report any remaining violations and save the clean dataset alongside a cleaning log that documents every transformation applied.

## Supported Technologies

- **pandas** — core data manipulation and type coercion
- **pyjanitor** — method-chaining convenience for cleaning operations
- **great_expectations** — schema validation and data quality checks
- **fuzzywuzzy** — fuzzy string matching for near-duplicate detection
- **numpy** — numerical operations for outlier detection

## Usage

Provide the agent with the file path to the raw dataset and optionally a schema definition specifying expected column types, valid ranges, and uniqueness constraints. The agent will produce a cleaned file and a transformation log. Save the cleaned data in the same format as the raw file (CSV by default) and the log as a plain text or Markdown file next to it.

## Examples

These examples are templates. The counts, shapes and results in the comments are placeholders, not real output. Your own data will give different numbers, so report only what your code prints.

### Example 1: Cleaning a messy CSV with pandas

```python
import pandas as pd
import numpy as np

# Load raw data
df = pd.read_csv("messy_orders.csv")
print(f"Raw shape: {df.shape}")  # (<ROWS>, <COLUMNS>)
print(df.isnull().sum())
# order_id         <count of blanks>
# customer_name   <count of blanks>
# email           <count of blanks>
# order_date      <count of blanks>
# amount          <count of blanks>
# status          <count of blanks>
# region          <count of blanks>
# discount        <count of blanks>

# 1. Fix data types — order_date has mixed formats
df["order_date"] = pd.to_datetime(df["order_date"], format="mixed", dayfirst=False)
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")

# 2. Handle missing values
df["customer_name"] = df["customer_name"].fillna("Unknown")
# Leave blank emails blank and flag them for the source. Never invent contact details.
df["email_missing"] = df["email"].isna()
# Median fill only when fewer than 5% of amount values are blank (Workflow step 2). Otherwise leave blanks, flag them and ask the user.
if df["amount"].isna().mean() < 0.05:
    df["amount"] = df["amount"].fillna(df["amount"].median())
else:
    df["amount_missing"] = df["amount"].isna()
df["region"] = df["region"].fillna(df["region"].mode()[0])
# Leave blank dates blank and flag them. Do not copy a date from another row.
df["order_date_missing"] = df["order_date"].isna()

# 3. Remove duplicates
before = len(df)
df = df.drop_duplicates(subset=["order_id"], keep="first")
print(f"Removed {before - len(df)} duplicate orders")  # Removed <N> duplicate orders

# 4. Standardize categorical values
df["status"] = df["status"].str.strip().str.lower().replace({
    "shipped": "shipped", "ship": "shipped",
    "cancelled": "cancelled", "canceled": "cancelled",
    "pending": "pending", "pend": "pending"
})
df["region"] = df["region"].str.strip().str.title()

# 5. Outlier treatment — cap amounts at IQR bounds
Q1 = df["amount"].quantile(0.25)
Q3 = df["amount"].quantile(0.75)
IQR = Q3 - Q1
lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
df["amount"] = df["amount"].clip(lower=lower, upper=upper)

print(f"Clean shape: {df.shape}")  # (<ROWS>, <COLUMNS>)
df.to_csv("clean_orders.csv", index=False)
```

### Example 2: Data validation pipeline with schema enforcement

This is a sketch. The Great Expectations calls change between versions (the code below follows the 1.x style), so check the docs for the version you have installed. If the calls fail, run the same checks in plain pandas, such as isna, between, isin and duplicated.

```python
import great_expectations as gx

context = gx.get_context()

# Define a validation suite
suite = context.add_expectation_suite("orders_validation")

# Add expectations
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(column="order_id")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeBetween(
        column="amount", min_value=<MIN_ALLOWED>, max_value=<MAX_ALLOWED>
    )
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeInSet(
        column="status", value_set=["pending", "shipped", "delivered", "cancelled"]
    )
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeUnique(column="order_id")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToMatchRegex(
        column="email", regex=r"^[^@]+@[^@]+\.[^@]+$"
    )
)

# Run validation against cleaned data
results = context.run_validation(suite, batch=gx.read_csv("clean_orders.csv"))

print(f"Success: {results.success}")
print(f"Passed: {results.statistics['successful_expectations']}/{results.statistics['evaluated_expectations']}")
# Success: <True or False>
# Passed: <passed>/<checked>
```

## Best Practices

- Always save a copy of the raw data before any transformations — cleaning should be reproducible, not destructive.
- Log every transformation with counts (e.g., "Filled [N] nulls in amount with median [MEDIAN]") to create an auditable cleaning trail.
- Prefer domain-informed imputation over mechanical defaults; consult the user when a column's missingness pattern is non-random (MNAR).
- Validate early and often — run schema checks after each cleaning phase, not just at the end.
- Treat cleaning as iterative: the first pass catches the obvious issues, but downstream analysis frequently surfaces new ones.
- Use `errors="coerce"` with `pd.to_numeric` and `pd.to_datetime` to surface conversion failures as NaNs rather than crashing.

## Edge Cases

- **Entirely empty columns.** If a column is 100% null, drop it automatically and log a warning rather than attempting imputation on zero information.
- **Duplicate column names.** Pandas silently allows duplicate column names. Detect them on load and rename with suffixes (`_1`, `_2`) before any operations.
- **Encoding issues.** If `read_csv` raises a `UnicodeDecodeError`, retry with `encoding="latin-1"` then `encoding="cp1252"` and log which encoding succeeded.
- **Date columns with multiple formats.** When a single column contains "2024-01-15", "01/15/2024", and "Jan 15, 2024", use `pd.to_datetime(col, format="mixed")` and verify the parsed results with spot checks.
- **Numeric columns stored as strings with currency symbols.** Strip `$`, `€`, commas, and whitespace before type coercion: `df["price"].str.replace(r"[$€,\s]", "", regex=True).astype(float)`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Data quality auditor](https://useaiblocks.com/skills/data-quality-auditor). It takes the spreadsheet.
- The [Spreadsheet and CSV cleaner](https://useaiblocks.com/skills/data-file-clean-up-loop). It takes the spreadsheet.
- The [Spreadsheet formula auditor](https://useaiblocks.com/skills/spreadsheet-formula-auditor). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
