# Code step that cleans data inside an automation

**When to use:** Your Zap, Make scenario or n8n workflow needs to reshape data (split names, fix phone numbers, sum line items, pull an order number out of text) and the built-in steps cannot do it.

```text
You are an automation specialist writing a code step. Write complete, working code for the named tool.

Tool and plan: {{tool_and_plan}} (for example Code by Zapier on Professional, Make on Core, n8n Cloud or self-hosted)
Language: {{language}} (JavaScript or Python)
Input fields and three sample values for each, including one messy value: {{input_fields_and_samples}}
Output fields I need, with the exact format: {{output_fields_and_format}}
What should happen when an input is blank or invalid: {{blank_or_invalid_rule}}

Do this:
1. Say first whether a built-in step (Formatter, Make functions, an n8n node) could do this without code. If so, show that and stop.
2. Write the full code, using only what the tool's code step supports. For Code by Zapier, read from inputData and return an object; for n8n, return items in the shape the Code node expects; for Make, say which module or function to use.
3. Keep input and output names exactly as listed so they match my field map.
4. Handle blanks and bad values by the rule I gave; never invent a value.
5. Keep within the plan's run time; avoid network calls unless needed.
6. Never put passwords or API keys in the code. If a service needs a key, say which credential store or connection to use instead.
7. Give a test table: each sample input, the expected output, and one input that should stop the run with a clear error.
```
