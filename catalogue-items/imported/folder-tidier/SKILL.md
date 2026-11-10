---
name: file-organizer
description: "Organize files and folders by inspecting their contents, proposing a structure, and reviewing duplicates before authorized changes."
risk: critical
source: community
date_added: "2026-02-27"
---

# File Organizer

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

## When not to use this skill

- A live code project. Moving files can break the build and the history. Use Git and move files by hand.
- Shared, work server or system folders. Ask the person who owns them, or tidy a copy first.
- You only need to find one file. Use your computer's search.

## When to Use This Skill

- Your Downloads folder is a chaotic mess
- You can't find files because they're scattered everywhere
- You have duplicate files taking up space
- Your folder structure doesn't make sense anymore
- You want to establish better organization habits
- You're starting a new project and need a good structure
- You're cleaning up before archiving old projects

## What This Skill Does

1. **Analyzes Current Structure**: Reviews your folders and files to understand what you have
2. **Finds Duplicates**: Identifies duplicate files across your system
3. **Suggests Organization**: Proposes logical folder structures based on your content
4. **Automates Cleanup**: Moves, renames, and organizes files with your approval
5. **Maintains Context**: Makes smart decisions based on file types, dates, and content
6. **Reduces Clutter**: Identifies old files you probably don't need anymore

## Instructions

When a user requests file organization help:

1. **Understand the Scope**

   Ask clarifying questions:

   - Which directory needs organization? (Downloads, Documents, entire home folder?)
   - What's the main problem? (Can't find things, duplicates, too messy, no structure?)
   - Any files or folders to avoid? (Current projects, sensitive data?)
   - How aggressively to organize? (Conservative vs. comprehensive cleanup)

2. **Analyze Current State**

   Before anything moves, tell the user to back up the folder or work on a copy. Moves made by this skill are not undone automatically.

   Review the target directory:

   ```bash
   # Get overview of current structure
   ls -la [target_directory]

   # Check file types and sizes
   find [target_directory] -type f -exec file {} \; | head -20

   # Identify largest files
   du -sh [target_directory]/* | sort -rh | head -20

   # Count file types
   find [target_directory] -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn
   ```

   Summarize findings:

   - Total files and folders
   - File type breakdown
   - Size distribution
   - Date ranges
   - Obvious organization issues

3. **Identify Organization Patterns**

   Based on the files, determine logical groupings:

   **By Type**:

   - Documents (PDFs, DOCX, TXT)
   - Images (JPG, PNG, SVG)
   - Videos (MP4, MOV)
   - Archives (ZIP, TAR, DMG)
   - Code/Projects (directories with code)
   - Spreadsheets (XLSX, CSV)
   - Presentations (PPTX, KEY)

   **By Purpose**:

   - Work vs. Personal
   - Active vs. Archive
   - Project-specific
   - Reference materials
   - Temporary/scratch files

   **By Date**:

   - Current year/month
   - Previous years
   - Very old (archive candidates)

4. **Find Duplicates**

   When requested, search for duplicates. The commands below work on Linux and macOS, but not everywhere: `md5` is macOS only (on Linux use `md5sum`), and `find -printf` is GNU/Linux only. On Windows, use PowerShell, for example `Get-ChildItem -Recurse -File | Get-FileHash | Group-Object Hash | Where-Object Count -gt 1`:

   ```bash
   # Find exact duplicates by hash: print every file whose hash appears more than once
   # Linux: md5sum. macOS: md5 -r. Both print the hash first, then the path. Each line of output is one set of identical files, with the copies separated by |.
   find [directory] -type f -exec md5sum {} + | sort | awk '{c[$1]++; l[$1]=l[$1] " | " $0} END{for(h in c) if(c[h]>1) print l[h]}'

   # Find file names that appear in more than one folder (same name, maybe not the same content)
   find [directory] -type f -printf '%f\n' | sort | uniq -d

   # Find similar-sized files
   find [directory] -type f -printf '%s %p\n' | sort -n
   ```

   For each set of duplicates:

   - Show all file paths
   - Display sizes and modification dates
   - Recommend which to keep (usually newest or best-named)
   - **Important**: Always ask for confirmation before deleting

5. **Propose Organization Plan**

   Present a clear plan before making changes:

   ```markdown
   # Organization Plan for [Directory]

   ## Current State

   - X files across Y folders
   - [Size] total
   - File types: [breakdown]
   - Issues: [list problems]

   ## Proposed Structure

   [Directory]/
   ├── Work/
   │ ├── Projects/
   │ ├── Documents/
   │ └── Archive/
   ├── Personal/
   │ ├── Photos/
   │ ├── Documents/
   │ └── Media/
   └── Downloads/
   ├── To-Sort/
   └── Archive/

   ## Changes I'll Make

   1. **Create new folders**: [list]
   2. **Move files**:
      - X PDFs → Work/Documents/
      - Y images → Personal/Photos/
      - Z old files → Archive/
   3. **Rename files**: [any renaming patterns]
   4. **Delete**: [list each duplicate or trash file by full path. Nothing is deleted until the user gives a separate, clear yes for deletion]

   ## Files Needing Your Decision

   - [List any files you're unsure about]

   Ready to proceed? (yes/no/modify)
   ```

6. **Execute Organization**

   After approval, organize systematically. The commands below are examples only. They have not been tested on every Mac, Windows or Linux setup, so test them on a copy of the folder first and adjust them for the user's system:

   ```bash
   # Create folder structure
   mkdir -p "path/to/new/folders"

   # Move files with clear logging
   mv "old/path/file.pdf" "new/path/file.pdf"

   # Rename files with consistent patterns
   # Example: "YYYY-MM-DD - Description.ext"
   ```

   **Important Rules**:

   - Always confirm before deleting anything
   - Write every move to a log file named `tidy-moves.log` in the target folder, one line per move as `old path -> new path`. This is the only way back. Moves are not reversed automatically
   - To undo, read the log from the bottom up and move each file from its new path back to its old path. Offer to write those move commands for the user, and show them before running anything
   - Preserve original modification dates
   - Never overwrite a file. If a file with the same name already exists at the new path, leave both where they are and list the pair for the user to decide
   - Stop and ask if you encounter unexpected situations

7. **Provide Summary and Maintenance Tips**

   After organizing:

   ```markdown
   # Organization Complete! ✨

   ## What Changed

   - Created [X] new folders
   - Organized [Y] files
   - Freed [Z] GB by removing duplicates (only if you measured it; otherwise leave this line out)
   - Archived [W] old files

   ## New Structure

   [Show the new folder tree]

   ## Maintenance Tips

   To keep this organized:

   1. **Weekly**: Sort new downloads
   2. **Monthly**: Review and archive completed projects
   3. **Quarterly**: Check for new duplicates
   4. **Yearly**: Archive old files

   ## Quick Commands for You

   # Find files modified this week

   find . -type f -mtime -7

   # Sort downloads by type

   [one command for their system (Mac, Windows or Linux), marked untested]

   # Find duplicates

   [one command for their system (Mac, Windows or Linux), marked untested; it only lists duplicates and never deletes]
   ```

   Want to organize another folder?

## Best Practices

### Folder Naming

- Use clear, descriptive names
- Avoid spaces (use hyphens or underscores)
- Be specific: "client-proposals" not "docs"
- Use prefixes for ordering: "01-current", "02-archive"

### File Naming

- Include dates: "2024-10-17-meeting-notes.md"
- Be descriptive: "q3-financial-report.xlsx"
- Avoid version numbers in names (use version control instead)
- Remove download artifacts: "document-final-v2 (1).pdf" → "document.pdf"

### When to Archive

- Projects not touched in 6+ months
- Completed work that might be referenced later
- Old versions after migration to new systems
- Files you're hesitant to delete (archive first)

## Example

**User request:**

> Organize my Downloads folder into a predictable structure, show the proposed moves first, and avoid deleting files.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Action item tracker](https://useaiblocks.com/skills/executive-action-register). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
