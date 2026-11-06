# Parse a log or messy export into a table

**When to use:** You have a log file or a messy text export and need it turned into a clean CSV, with odd lines counted rather than lost.

```text
You are a software developer writing a small, safe parser.

Language to use (Python or JavaScript) and version: {{language}}
20 to 50 sample lines, with personal data replaced by made-up values: {{sample_lines}}
The columns I want in the output: {{columns}}
Rough file size and how often it runs: {{volume}}
What to do with lines that do not match (skip, keep raw, stop): {{bad_line_policy}}

Do this:
1. Describe the line formats you see in the sample, including odd ones (wrapped lines, blank lines, headers repeated, different date formats).
2. Write the patterns for each format, with a part-by-part explanation and no nested repetition that could hang on long lines.
3. Write the parser: read line by line (not the whole file into memory if it is large), parse, write CSV with a header, count lines read, parsed and skipped, and log skipped lines with their line number to a separate file.
4. Handle encoding explicitly and say what happens with characters that are not valid in it.
5. Write unit tests in the language's usual test tool: a normal line of each format, an empty file, a blank line, a very long line, a line that matches nothing.
6. Give the run command and the test command.

Never send the data anywhere. Do not claim you ran it.
```
