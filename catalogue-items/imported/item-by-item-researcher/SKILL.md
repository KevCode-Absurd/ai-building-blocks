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

`fields.yaml`: one entry for each fact to fill in for every item, such as [FIELD NAME] with a short description of what to put there.

Batch size is optional. If you leave it out, the skill asks you.

### Step 1: Auto-locate Outline
Find `*/outline.yaml` file in current working directory, read items list, execution config (including items_per_agent).
The outline needs a topic, a list of items (name, category, description) and an execution block (batch_size, items_per_agent, output_dir). If a setting is missing, ask the user for it. Do not invent one.

### Step 2: Resume Check
- Check completed JSON files in output_dir
- Skip completed items

### Step 3: Batch Execution
- Batch by batch_size (need user approval before next batch)
- Each agent handles items_per_agent items
- Launch web-search-agent (background parallel, disable task output)

**Parameter Retrieval**:
- `{topic}`: topic field from outline.yaml
- `{item_name}`: item's name field
- `{item_related_info}`: item's complete yaml content (name + category + description etc.)
- `{output_dir}`: execution.output_dir from outline.yaml (default: ./results)
- `{fields_path}`: absolute path to {topic}/fields.yaml
- `{output_path}`: absolute path to {output_dir}/{item_name_slug}.json (slugify item_name: replace spaces with _, remove special chars)

**Hard Constraint**: The following prompt must be strictly reproduced, only replacing variables in {xxx}, do not modify structure or wording. The one exception: if `validate_json.py` is not on the machine, use the by-hand check described in the note below the template.

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
After completing JSON output, run validation script to ensure complete field coverage:
python ~/.claude/skills/research/validate_json.py -f {fields_path} -j {output_path}
Task is complete only after validation passes.
"""
```

Note for the catalogue copy: validate_json.py is not in this folder, and its path above names a different skill folder. If the script is not on your machine, drop the two validation lines and check by hand that every field in fields.yaml has a value, then say you did it by hand.

Before agents fetch pages, tell the user which sites will be read, and check each site's terms and robots.txt.

**One-shot Example** (the item name, category and description below are placeholders; use your own):
```
## Task
Research name: [ITEM NAME]
category: [CATEGORY]
description: [ONE LINE ABOUT THE ITEM FROM YOUR OUTLINE], output structured JSON to {project_dir}/results/[ITEM_NAME].json

## Field Definitions
Read {project_dir}/fields.yaml to get all field definitions

## Output Requirements
1. Output JSON according to fields defined in fields.yaml
2. Mark uncertain field values with [uncertain]
3. Add uncertain array at the end of JSON, listing all uncertain field names
4. All field values must be in English

## Output Path
{project_dir}/results/[ITEM_NAME].json

## Validation
After completing JSON output, run validation script to ensure complete field coverage:
python ~/.claude/skills/research/validate_json.py -f {project_dir}/fields.yaml -j {project_dir}/results/[ITEM_NAME].json
Task is complete only after validation passes.
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
