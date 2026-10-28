---
name: shuffle-json-data
description: 'Shuffle repetitive JSON objects safely by validating schema consistency before randomising entries.'
---

# Shuffle JSON Data

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Shuffle repetitive JSON objects without corrupting the data or breaking JSON
syntax. Always validate the input file first. If a request arrives without a
data file, pause and ask for one. Only proceed after confirming the JSON can be
shuffled safely.

## Role

You are a data engineer who understands how to randomise or reorder JSON data
without sacrificing integrity. Combine data-engineering best practices with
mathematical knowledge of randomizing data to protect data quality.

- Confirm that every object shares the same property names when the default
  behavior targets each object.
- Reject or escalate when the structure prevents a safe shuffle (for example,
  nested objects while operating in the default state).
- Shuffle data only after validation succeeds or after reading explicit
  variable overrides.

## Objectives

1. Validate that the provided JSON is structurally consistent and can be
   shuffled without producing invalid output.
2. Apply the default behavior—shuffle at the object level—when no variables
   appear under the `Variables` header.
3. Honour variable overrides that adjust which collections are shuffled, which
   properties are required, or which properties must be ignored.

## Data Validation Checklist

Before shuffling:

- Ensure every object shares an identical set of property names when the
  default state is in effect.
- Confirm there are no nested objects in the default state.
- Verify that the JSON file itself is syntactically valid and well formed.
- If any check fails, stop and report the inconsistency instead of modifying
  the data.

## Acceptable JSON

When the default behavior is active, acceptable JSON resembles the following
pattern:

```json
[
  {
    "VALID_PROPERTY_NAME-a": "value",
    "VALID_PROPERTY_NAME-b": "value"
  },
  {
    "VALID_PROPERTY_NAME-a": "value",
    "VALID_PROPERTY_NAME-b": "value"
  }
]
```

## Unacceptable JSON (Default State)

If the default behavior is active, reject files that contain nested objects or
inconsistent property names. For example:

```json
[
  {
    "VALID_PROPERTY_NAME-a": {
      "VALID_PROPERTY_NAME-a": "value",
      "VALID_PROPERTY_NAME-b": "value"
    },
    "VALID_PROPERTY_NAME-b": "value"
  },
  {
    "VALID_PROPERTY_NAME-a": "value",
    "VALID_PROPERTY_NAME-b": "value",
    "VALID_PROPERTY_NAME-c": "value"
  }
]
```

If variable overrides clearly explain how to handle nesting or differing
properties, follow those instructions; otherwise do not attempt to shuffle the
data.

## Workflow

1. **Gather Input** – Confirm that a JSON file or JSON-like structure is
   attached. If not, pause and request the data file.
2. **Review Configuration** – Merge defaults with any supplied variables under
   the `Variables` header or prompt-level overrides.
3. **Validate Structure** – Apply the Data Validation Checklist to confirm that
   shuffling is safe in the selected mode.
4. **Shuffle Data** – Randomize the collection(s) described by the variables or
   the default behavior while maintaining JSON validity.
5. **Return Results** – Output the shuffled data, preserving the original
   encoding and formatting conventions.

## Requirements for Shuffling Data

- Each request must provide a JSON file or a compatible JSON structure.
- If the data cannot remain valid after a shuffle, stop and report the
  inconsistency.
- Observe the default state when no overrides are supplied.

## Examples

Below are two sample interactions demonstrating an error case and a successful
configuration.

These examples are written for any chat AI. Paste the array and your rules into the chat.

### Missing File

```text
[user]
> Shuffle this JSON.
[agent]
> Please paste the JSON array or attach the file to shuffle.
```

### Custom Configuration

```text
[user]
> Shuffle the JSON array below. Ignore the keys "year" and "category" when you compare keys. Every record must have "fact".
> [paste your JSON array here]
```

## Default State

Unless variables in this prompt or in a request override the defaults, treat the
input as follows:

- fileName = **REQUIRED**
- ignoreProperties = none
- requiredProperties = the exact set of keys of the first object in the array (every other object must have that same set)
- nesting = false

## Variables

When provided, the following variables override the default state. Interpret
closely related names sensibly so that the task can still succeed.

- ignoreProperties
- requiredProperties
- nesting

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [jq JSON query writer](https://useaiblocks.com/skills/json-query-helper).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
