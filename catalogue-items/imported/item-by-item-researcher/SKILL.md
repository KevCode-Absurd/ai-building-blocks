---
name: research-deep
user-invocable: true
description: Read research outline, launch independent agent for each item for deep research. Disable task output.
allowed-tools: Bash, Read, Write, Glob, WebSearch, Task
---

# Research Deep - Deep Research

## Trigger
`/research-deep`

## Workflow

There are five steps, run in this order: (1) find the outline, (2) check which items are done, (2b) check site terms, a required step before any agent runs, (3) run a batch of agents, (4) wait and show progress, (5) write the summary. The files you need are described first.

## Inputs

Two files, in a folder in your working directory. The names and values below are placeholders.

`outline.yaml`:
```yaml
topic: [YOUR TOPIC]
items:
  - name: [ITEM NAME]
    category: [CATEGORY]
    description: [ONE LINE]
execution:
  batch_size: [HOW MANY ITEMS PER BATCH]
  items_per_agent: [HOW MANY ITEMS EACH AGENT TAKES]
  output_dir: ./results
```

`fields.yaml`: one entry for each fact to fill in for every item. Example shape, with placeholders:
```yaml
fields:
  - name: [FIELD NAME]
    description: [WHAT TO PUT IN THIS FIELD]
  - name: [FIELD NAME]
    description: [WHAT TO PUT IN THIS FIELD]
```

In the steps below, `{project_dir}` means the folder that holds `outline.yaml` and `fields.yaml`, and `{output_dir}` means the results folder named in the outline (default `{project_dir}/results`).

Batch size is optional. If you leave it out, the skill asks you.

### Step 1: Auto-locate Outline
Find `*/outline.yaml` file in current working directory, read items list, execution config (including items_per_agent).
The outline needs a topic, a list of items (name, category, description) and an execution block (batch_size, items_per_agent, output_dir). If a setting is missing, ask the user for it. Do not invent one.

### Step 2: Resume Check
- Check completed JSON files in output_dir
- Skip completed items

### Step 2b: Check site terms (required before Step 3)
This skill sends agents to scrape websites. Before any agent runs, tell the user which sites are likely to be read, and ask them to check each site's terms and robots.txt. The skill cannot enforce this. It relies on the user's answer. Do not start Step 3 until the user says yes.

Also tell the user before Step 3: a run launches many agents in parallel, and each one searches the web. This uses a lot of a paid Claude plan's allowance or API credit. Suggest a small first batch.

### Step 3: Batch Execution
- Batch by batch_size (need user approval before next batch)
- Each agent handles items_per_agent items
- Launch web-search-agent (background parallel, disable task output)

**Parameter Retrieval**:
- `{topic}`: topic field from outline.yaml
- `{item_name}`: item's name field
- `{item_related_info}`: item's complete yaml content (name + category + description etc.)
- `{output_dir}`: execution.output_dir from outline.yaml (default: ./results)
- `{fields_path}`: absolute path to {project_dir}/fields.yaml
- `{output_path}`: absolute path to {output_dir}/{item_name_slug}.json (slugify item_name: replace spaces with _, remove special chars)

**Hard Constraint**: Reproduce the following prompt, replacing only the variables in {xxx}. Do not change its structure or wording. The Validation section is written for this copy, which has no validation script, so it asks for a by-hand check.

**Prompt Template**:
```python
prompt = f"""## Task
Research {item_related_info}, output structured JSON to {output_path}

## Field Definitions
Read {fields_path} to get all field definitions

## Output Requirements
1. Output JSON according to fields defined in fields.yaml
2. Mark uncertain field values with [uncertain]
3. Add uncertain array at the end of JSON, listing all uncertain field names
4. All field values must be in English

## Output Path
{output_path}

## Validation
After completing JSON output, check by hand that every field in {fields_path} has a value or is marked [uncertain].
Task is complete only after this check passes.
"""
```

No validation script comes with this copy. Say in your summary that the field check was done by hand.

**One-shot Example** (the item name, category and description below are placeholders; use your own):
```
## Task
Research name: [ITEM NAME]
category: [CATEGORY]
description: [ONE LINE ABOUT THE ITEM FROM YOUR OUTLINE], output structured JSON to {output_dir}/[ITEM_NAME].json

## Field Definitions
Read {project_dir}/fields.yaml to get all field definitions

## Output Requirements
1. Output JSON according to fields defined in fields.yaml
2. Mark uncertain field values with [uncertain]
3. Add uncertain array at the end of JSON, listing all uncertain field names
4. All field values must be in English

## Output Path
{output_dir}/[ITEM_NAME].json

## Validation
After completing JSON output, check by hand that every field in {project_dir}/fields.yaml has a value or is marked [uncertain].
Task is complete only after this check passes.
```

### Step 4: Wait and Monitor
- Wait for current batch to complete
- Launch next batch
- Display progress

### Step 5: Summary Report
After all complete, output:
- Completion count
- Failed/uncertain marked items
- Output directory

## Next steps

- Merge the JSON files into one spreadsheet or CSV to compare items side by side.
- Re-run for any item with fields marked `[uncertain]`, or check those fields by hand.

## Agent Config
- Background execution: Yes
- Task Output: Disabled (agent has explicit output file when complete)
- Resume support: Yes
