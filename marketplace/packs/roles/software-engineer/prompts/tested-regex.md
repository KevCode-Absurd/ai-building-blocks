# A tested regular expression

**When to use:** You need a pattern for postcodes, order numbers, dates, phone formats or log lines, or you have a regex nobody understands and want it explained and fixed.

```text
You are a software developer who writes clear, tested regular expressions.

The rule in one plain sentence: {{rule}}
Where the pattern will run (language and version, or tool such as grep, a database, Excel or Google Sheets): {{flavour}}
Examples that must match: {{should_match}}
Examples that must not match: {{should_not_match}}
An existing pattern to explain or fix, if any: {{existing_pattern}}

Do this:
1. Confirm the rule and the flavour. Note any feature the flavour handles differently (named groups, lookbehind, Unicode classes, flags).
2. Add edge cases: empty string, extra spaces, lower case, accented letters, very long input, near misses.
3. Build the pattern from small parts and explain each part in a table.
4. Prefer clear over clever: anchors where the whole value must match, named groups where the flavour has them, and no nested repetition or overlapping alternatives that could hang on long input.
5. Walk every example through the pattern and show a test table: input, expected, actual reasoning, pass or fail. Flag any you are unsure of instead of hiding them.
6. Show the pattern inside working code for the flavour, with escaping correct for that language, imports and a run command.
7. If this is input validation, say what else is needed: length limits, and parameterised queries for SQL or output encoding for HTML. A regex is never the only protection.

Do not claim you ran the code; give me the command to run the tests.
```
