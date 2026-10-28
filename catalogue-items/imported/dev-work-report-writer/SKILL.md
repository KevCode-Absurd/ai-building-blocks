---
name: workthrough
description: Document development work and code modifications in a structured workthrough format. Use this skill when the user asks for a report after a development task, bug fix, feature implementation, or code refactoring.
license: MIT
---

This skill generates detailed workthrough documentation for development work the user asks to have written up, capturing the context, changes made, and verification results in a clear, structured format.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use This Skill

Use this skill when the user asks for a report, after:
- Implementing new features or functionality
- Fixing bugs or errors
- Refactoring code
- Making configuration changes
- Updating dependencies
- Resolving build/compilation issues
- Any significant code modifications

## Documentation Structure

The workthrough documentation follows this structure:

1. **Title**: Clear, descriptive title of the work completed
2. **Overview**: Brief summary of what was accomplished and why
3. **Changes Made**: Detailed breakdown of all modifications
4. **Code Examples**: Key code snippets showing important changes
5. **Verification Results**: Build/test results confirming success

## Implementation Guidelines

When generating workthrough documentation:

### 1. Capture Complete Context
- What problem was being solved?
- What errors or issues existed before?
- What approach was taken?
- Why were specific decisions made?

### 2. Document All Changes Systematically
- List each file modified with full paths
- Describe what changed in each file
- Include before/after code snippets for significant changes
- Note any dependencies added or removed
- Document configuration updates

### 3. Show Code Examples
Use clear, well-formatted code blocks:
```language
// file: src/path/to/file.tsx
<div className="example">
  {/* Show relevant code changes */}
</div>
```

### 4. Include Verification
- Build output showing success
- Test results
- Error messages (if any remain)
- Exit codes
- Screenshots (if relevant)

### 5. Use Clear Formatting
- Use markdown headers (##, ###)
- Use bullet points and numbered lists
- Use code blocks with syntax highlighting
- Use blockquotes for output/logs
- Keep paragraphs concise

## Document Organization

Save workthrough documents with this naming convention:
```
workthrough/YYYY-MM-DD-brief-description.md
```

Or organize by feature/project:
```
workthrough/feature-name/implementation.md
workthrough/bugfix/issue-123.md
```

## Example Workthrough Structure

```markdown
# [Clear Descriptive Title]

## Overview
Brief 2-3 sentence summary of what was accomplished.

## Context
- Why was this work needed?
- What was the initial problem/requirement?
- Any relevant background information

## Changes Made

### 1. [First Major Change]
- Specific modification 1
- Specific modification 2
- File: `path/to/file.tsx`

### 2. [Second Major Change]
- Specific modification 1
- File: `path/to/another-file.ts`

### 3. [Additional Changes]
- Dependencies added: `package-name@version`
- Configuration updates: `config-file.json`

## Code Examples

### [Feature/Fix Name]
```typescript
// src/path/to/file.tsx
const example = () => {
  // Show the key code changes
}
```

## Verification Results

### Build Verification
```bash
> [paste the real build command and its output here]
[exit code from your run]
```

### Test Results
```bash
> [paste the real test command and its output here]
```

Never write build output, test results or exit codes that the user did not show you. If a check was not run, write "not run".

## Next Steps
- Any follow-up tasks needed
- Known limitations or future improvements
```

## Automation Instructions

When the user asks for a report on finished development work:

1. **Gather Information**
   - Review all files modified during the session
   - Collect build/test output
   - Identify the main objective that was accomplished

2. **Create Document**
   - Generate workthrough document in `workthrough/` directory
   - Use timestamp or descriptive filename
   - Follow the structure guidelines above

3. **Be Comprehensive**
   - Include all relevant details
   - Don't assume future readers have context
   - Document decisions and reasoning
   - Show concrete examples

4. **Verify Completeness**
   - Confirm all changes are documented
   - Include verification results
   - Add any relevant warnings or notes

## Quality Standards

Good workthrough documentation should:
- Be readable by other developers
- Provide enough detail to understand changes
- Include verification that changes work
- Serve as a reference for similar future work
- Capture important decisions and context

Avoid:
- Overly verbose descriptions
- Unnecessary technical jargon
- Missing verification steps
- Vague or unclear explanations
- Incomplete code examples

## Output Location

Unless specified otherwise, save workthrough documents to:
```
workthrough/YYYY-MM-DD-brief-description.md
```

Create the `workthrough/` directory if it doesn't exist.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI coding task brief writer](https://useaiblocks.com/skills/coding-agent-handoff-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Integration with Workflow

Run this skill only when the user asks for it, usually at the end of a development session. The documentation serves as:
- A development log/journal
- Knowledge base for the project
- Onboarding material for new developers
- Reference for debugging similar issues
- Record of architectural decisions

Remember: Good documentation is a gift to your future self and your team.
