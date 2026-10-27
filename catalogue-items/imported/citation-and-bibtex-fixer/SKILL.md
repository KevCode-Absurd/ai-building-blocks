---
name: citation-management
description: "Manage citations systematically throughout the research and writing process."
license: MIT License
metadata:
    skill-author: K-Dense Inc.
risk: critical
source: community
date_added: "2026-09-04"
---

## Supporting material availability

This catalog copy does not include these files:

- `scripts/search_google_scholar.py`
- `scripts/search_pubmed.py`
- `scripts/extract_metadata.py`
- `scripts/doi_to_bibtex.py`
- `scripts/format_bibtex.py`
- `scripts/validate_citations.py`

Do not say you read or ran them. Do those steps by hand, or ask the user for the original file.

## Without the scripts

The examples below call those scripts. Without them, do each job by hand:

1. **DOI to BibTeX:** open the DOI at doi.org (or the publisher page) and copy its BibTeX export. Compare authors, title, journal, year and pages with the entry.
2. **PubMed or arXiv ID:** use the PubMed or arXiv page and its "cite" or BibTeX export.
3. **Titles:** search PubMed or the publisher site first. Google Scholar may block automated searches and its terms can forbid scraping, so look things up by hand there and never in bulk.
4. **Duplicates and style:** sort entries by DOI or title, merge repeats, and make the key names follow one pattern.
5. **Validate:** for each entry, check that the fields exist and match the source page. Mark any entry you could not check as unverified. Never fill in a missing field from memory.

# Citation Management

**Risk: critical (the original author's label).** Wrong references can end up in a paper, and bulk searches of Google Scholar can break its terms. So: look up each entry on its real source page, mark anything you could not check as unverified, never fill a missing field from memory, and never run bulk Google Scholar searches.

The example workflows below show the original scripts. They only run if you have the original scripts folder. Without it, use "Without the scripts" above.

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use This Skill

Use this skill when:
- Searching for specific papers on Google Scholar or PubMed
- Converting DOIs, PMIDs, or arXiv IDs to properly formatted BibTeX
- Extracting complete metadata for citations (authors, title, journal, year, etc.)
- Validating existing citations for accuracy
- Cleaning and formatting BibTeX files
- Finding highly cited papers in a specific field
- Verifying that citation information matches the actual publication
- Building a bibliography for a manuscript or thesis
- Checking for duplicate citations
- Ensuring consistent citation formatting

## Example Workflows

### Example 1: Building a Bibliography for a Paper

```bash
# Step 1: Find key papers on your topic
# Google Scholar bulk search removed: its terms may forbid automated searches.
# Search by hand, or use PubMed, arXiv or the publisher site instead.

python scripts/search_pubmed.py "deep learning medical imaging" \
  --date-start 2020 \
  --limit 50 \
  --output medical_dl_pm.json

# Step 2: Extract metadata from search results
python scripts/extract_metadata.py \
  --input medical_dl_pm.json \
  --output medical.bib

# Step 3: Add specific papers you already know
python scripts/doi_to_bibtex.py 10.1038/s41586-021-03819-2 >> specific.bib
python scripts/doi_to_bibtex.py 10.1126/science.aam9317 >> specific.bib

# Step 4: Combine all BibTeX files
cat medical.bib specific.bib > combined.bib

# Step 5: Format and deduplicate
python scripts/format_bibtex.py combined.bib \
  --deduplicate \
  --sort year \
  --descending \
  --output formatted.bib

# Step 6: Validate
python scripts/validate_citations.py formatted.bib \
  --auto-fix \
  --report validation.json \
  --output final_references.bib

# Step 7: Review any issues
cat validation.json | grep -A 3 '"errors"'

# Step 8: Use in LaTeX
# \bibliography{final_references}
```

### Example 2: Converting a List of DOIs

```bash
# You have a text file with DOIs (one per line)
# dois.txt contains:
# 10.1038/s41586-021-03819-2
# 10.1126/science.aam9317
# 10.1016/j.cell.2023.01.001

# Convert all to BibTeX
python scripts/doi_to_bibtex.py --input dois.txt --output references.bib

# Validate the result
python scripts/validate_citations.py references.bib --verbose
```

### Example 3: Cleaning an Existing BibTeX File

```bash
# You have a messy BibTeX file from various sources
# Clean it up systematically

# Step 1: Format and standardize
python scripts/format_bibtex.py messy_references.bib \
  --output step1_formatted.bib

# Step 2: Remove duplicates
python scripts/format_bibtex.py step1_formatted.bib \
  --deduplicate \
  --output step2_deduplicated.bib

# Step 3: Validate and auto-fix
python scripts/validate_citations.py step2_deduplicated.bib \
  --auto-fix \
  --output step3_validated.bib

# Step 4: Sort by year
python scripts/format_bibtex.py step3_validated.bib \
  --sort year \
  --descending \
  --output clean_references.bib

# Step 5: Final validation report
python scripts/validate_citations.py clean_references.bib \
  --report final_validation.json \
  --verbose

# Review report
cat final_validation.json
```

### Example 4: Finding and Citing Seminal Papers

```bash
# Find highly cited papers on a topic. Do this by hand on PubMed, the publisher site
# or a review article. Do not run bulk Google Scholar searches.
# Then convert the DOIs you pick to BibTeX:
python scripts/doi_to_bibtex.py --input chosen_dois.txt --output seminal_refs.bib

# Check each entry against its publisher page before you cite it.
```

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
