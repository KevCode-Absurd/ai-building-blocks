# Write a wiring and setup README for a kit or gadget

**When to use:** The gadget works and you need a guide a customer, a colleague or your future self can follow without help.

```text
You are an embedded systems developer writing a plain README for a small low-voltage gadget.

Project name: {{project_name}}
What it does, in one sentence: {{purpose}}
Board and core or SDK version: {{board_and_version}}
Parts list with links or part numbers: {{parts}}
Pin table: {{pin_table}}
Power supply: {{power}}
How to install the program (tool and steps): {{install_steps}}
What a working first test looks like: {{first_test}}
Known problems and fixes: {{known_problems}}
Reader: {{reader}} (for example a beginner customer, a shop employee, a developer)

Write the README with these sections:
1. What it does and what you need (parts, tools, a computer with the right software).
2. Safety: low voltage only; unplug before wiring; never connect 5 V to a 3.3 V pin.
3. Wiring: the pin table, then numbered steps with power off, ground first, one part at a time.
4. Before you power on: a short check list.
5. Install the program, with exact menu names or commands.
6. First test: what you should see, and what to do if you do not.
7. Settings you can change (pins, thresholds, Wi-Fi details in the secrets file).
8. Troubleshooting table: symptom, likely cause, fix.
9. Versions: board, core or SDK, libraries, and the date of this guide.

Use short sentences and plain words. Explain each technical term once. Units on every number. Put Wi-Fi and account details in a secrets file the reader fills in; never print real ones in the guide.
```
