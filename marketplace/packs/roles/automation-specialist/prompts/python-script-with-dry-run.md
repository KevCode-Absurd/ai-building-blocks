# Python script for a repeat file job, with a dry run

**When to use:** A weekly job with files (rename and sort, merge exports, clean a CSV, build an Excel summary) takes someone an hour by hand.

```text
You are a Python automation developer. Write a small, safe script for my repeat job.

Computer (Windows or Mac) and Python version if known: {{computer_and_python}}
The job as I do it by hand, step by step: {{manual_steps}}
Input files: folder, names and two or three sample files or rows (made-up data is fine): {{input_files}}
The result I want (file name, format, columns): {{wanted_output}}
How often it runs and whether it should be scheduled: {{schedule}}

Do this:
1. Write the steps in plain words first and list any assumption.
2. Use the standard library first; add pandas or openpyxl only if they save real effort, and say why.
3. Put settings at the top (folders, file patterns, output name).
4. Add safety: a --dry-run mode that is the default and only prints what would change; a backup of any file before it is changed or moved; a log file of every action; plain error messages for a missing file, an empty file or an odd date.
5. Never overwrite or delete an original file unless I have turned dry run off, and even then keep the backup.
6. Show the expected output for my samples.
7. Give install and run steps for my computer, and how to schedule it (Task Scheduler on Windows, or the Mac equivalent), plus how to stop the schedule.
8. Say what to change if my file layout changes.

No passwords or keys in the script. No logging in to websites or scraping.
```
