---
name: file-organization
description: "Automatically organizes files in a directory into a clean structure based on configurable rules — by file type, date, project, or priority — with support for duplicate detection, naming conventions, and archival strategies. Use when the user requests file organization or provides relevant inputs for this workflow."
license: "MIT"
metadata:
  author: "awesome-ai-agent-skills contributors"
  version: "1.1.0"
---

# File Organization

This skill enables an AI agent to bring order to cluttered directories. Given a target path, the agent scans all files, classifies them using a configurable rule set, and moves them into a well-structured directory tree. It supports organization by file type, modification date, project association, or priority level. Advanced features include duplicate detection via content hashing, consistent naming conventions, dry-run previews, and automated archival of stale files.

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

## Workflow

1. **Scan the Target Directory**
   Recursively enumerate all files in the specified directory. Collect metadata for each file: name, extension, size, creation date, modification date, and content hash (SHA-256, computed lazily for duplicate detection). Skip hidden files and system files (e.g., `.DS_Store`, `Thumbs.db`) by default, but allow the user to include them via configuration.

2. **Classify Files by Rule Set**
   Apply the active organization strategy to assign each file to a destination folder. The default strategy groups by file type using a built-in extension map (e.g., `.pdf` → `documents/`, `.png` → `images/`, `.mp3` → `audio/`). Alternative strategies include: group by modification date (`2025/01/`, `2025/02/`), group by project name inferred from path prefixes or filename tags, or group by a priority label embedded in the filename (e.g., `URGENT-report.pdf` → `priority-high/`). Users can supply a custom rule file in YAML or JSON to override or extend any strategy.

3. **Detect and Handle Duplicates**
   Compare content hashes across all scanned files. When duplicates are found, keep the most recently modified copy in the target location and move older copies to a `_duplicates/` staging folder. Present a summary of duplicates to the user for review before permanent deletion. Optionally, replace duplicates with symbolic links to the canonical copy to save disk space while preserving path references.

4. **Apply Naming Conventions**
   Normalize filenames according to the configured convention. Options include: kebab-case (`quarterly-report-2025.pdf`), snake_case (`quarterly_report_2025.pdf`), or date-prefixed (`2025-01-15_quarterly-report.pdf`). Strip special characters, collapse whitespace, and transliterate Unicode to ASCII when requested. Preserve original extensions. Log every rename so the operation is reversible.

5. **Execute the Move Plan (or Dry Run)**
   Before moving any files, generate a complete move plan showing source and destination for every file. In dry-run mode (the default for first invocation), display the plan and ask for confirmation. Once confirmed, create destination directories as needed and move files atomically. Write a manifest file (`_organization-log.json`) to the root of the target directory recording every action taken, enabling a full undo.

6. **Archive Stale Files**
   Optionally identify files that have not been accessed or modified within a configurable threshold (default: 12 months). Move these files to an `_archive/` directory, preserving the organized subfolder structure. Compress the archive folder into a `.tar.gz` or `.zip` if requested. Notify the user of the total space reclaimed.

## Usage

Point the agent at a directory and specify the organization strategy. If no strategy is given, the agent defaults to organizing by file type.

```
"Organize my ~/Downloads folder by file type."
```

```
"Sort the files in /data/raw-exports by modification date, using YYYY/MM subfolders."
```

```
"Organize ~/Documents/Scans using this config file: .file-org-rules.yaml"
```

A custom rule file looks like this:

```yaml
# .file-org-rules.yaml
strategy: type
naming: kebab-case
date_prefix: true
archive_after_days: 365
type_map:
  documents: [pdf, docx, txt, md, csv]
  images: [jpg, jpeg, png, gif, svg, webp]
  audio: [mp3, wav, flac, aac]
  video: [mp4, mov, avi, mkv]
  archives: [zip, tar, gz, rar, 7z]
  code: [py, js, ts, go, rs, java, c, cpp, h]
  data: [json, xml, yaml, yml, toml, sql]
ignore:
  - node_modules
  - .git
  - __pycache__
```

## Examples

### Example 1 — Organizing a Messy Downloads Folder

**Before:**
```
~/Downloads/
├── IMG_4012.jpg
├── IMG_4012 (1).jpg       ← duplicate
├── Q3 Financial Report.pdf
├── meeting-notes.txt
├── setup_installer.exe
├── song.mp3
├── profile photo.PNG
├── data_export.csv
├── slides_final_v2.pptx
├── backup.zip
└── vacation vid.mp4
```

**User input:**
```
"Organize ~/Downloads by file type. Use kebab-case naming. Detect duplicates."
```

**Agent output (dry-run preview):**
```
Scan complete: 11 files found, 1 duplicate detected.

Duplicate: IMG_4012 (1).jpg is identical to IMG_4012.jpg (SHA-256 match)
  → Moving IMG_4012 (1).jpg to _duplicates/img-4012-1.jpg

Move plan:
  IMG_4012.jpg                → images/img-4012.jpg
  profile photo.PNG           → images/profile-photo.png
  Q3 Financial Report.pdf     → documents/q3-financial-report.pdf
  meeting-notes.txt           → documents/meeting-notes.txt
  data_export.csv             → documents/data-export.csv
  slides_final_v2.pptx       → presentations/slides-final-v2.pptx
  song.mp3                    → audio/song.mp3
  vacation vid.mp4            → video/vacation-vid.mp4
  setup_installer.exe         → applications/setup-installer.exe
  backup.zip                  → archives/backup.zip

Confirm? (yes / no / edit plan)
```

**After (once confirmed):**
```
~/Downloads/
├── _duplicates/
│   └── img-4012-1.jpg
├── _organization-log.json
├── applications/
│   └── setup-installer.exe
├── archives/
│   └── backup.zip
├── audio/
│   └── song.mp3
├── documents/
│   ├── data-export.csv
│   ├── meeting-notes.txt
│   └── q3-financial-report.pdf
├── images/
│   ├── img-4012.jpg
│   └── profile-photo.png
├── presentations/
│   └── slides-final-v2.pptx
└── video/
    └── vacation-vid.mp4
```

### Example 2 — Sorting Exports by Date

**User input:**
```
"Sort the files in /data/raw-exports by modification date, using YYYY/MM subfolders. Do not rename anything."
```

**Agent output (dry-run preview):**
```
Scan complete: [N] files found, [N] duplicates detected.

Move plan:
  [file name]    → [YYYY]/[MM]/[file name]
  [file name]    → [YYYY]/[MM]/[file name]

[N] files moved, [N] folders created, [N] files left in place.

Confirm? (yes / no / edit plan)
```

This skill is for document, photo and export folders. Do not run it on a live code project. Moving source files breaks imports, builds and Git history, so move those by hand with Git.

## Best Practices

- **Always start with a dry run.** Never move files without showing the user a complete plan first. Accidental reorganization of a working project directory can break builds and tooling.
- **Preserve a manifest log.** Write every action (moves, renames, deletions) to a JSON log file at the root of the target directory. This makes the operation fully reversible.
- **Respect version control.** If the target directory is inside a Git repository, use `git mv` instead of a raw filesystem move so that history is preserved. Warn the user if uncommitted changes exist.
- **Handle filename collisions.** When two different files would map to the same destination path, append a numeric suffix (e.g., `report.pdf` and `report-1.pdf`) rather than overwriting silently.
- **Skip known dependency directories.** Exclude `node_modules/`, `.git/`, `__pycache__/`, `vendor/`, and similar tool-managed directories by default. Reorganizing these breaks package managers.
- **Verify integrity after moves.** After execution, compare the SHA-256 hash of each moved file against the original hash recorded during the scan to confirm no data corruption occurred.

## Edge Cases

- **Empty directories left behind.** After moving files out of a folder, check whether the source folder is now empty. Offer to remove empty directories to keep the tree clean.
- **Symbolic links and hard links.** Do not follow symbolic links during the scan — record them as links and ask the user how to handle them (move the link, resolve to the target, or skip).
- **Files with no extension.** Classify extensionless files as `other/` by default. If the file has a shebang line (e.g., `#!/usr/bin/env python3`), infer the type from the interpreter.
- **Very large directories (>10,000 files).** Process files in batches and provide a progress indicator. Avoid loading the entire file list into memory at once.
- **Permission errors.** If a file cannot be read or moved due to filesystem permissions, log it, skip it, and continue with the remaining files. Present a summary of skipped files at the end.
- **Network or external drives.** Warn the user that reorganizing files on a network share or external drive may be significantly slower and that interrupted operations could leave files in an inconsistent state. Recommend working on a local copy first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Task list manager](https://useaiblocks.com/skills/task-list-keeper). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
