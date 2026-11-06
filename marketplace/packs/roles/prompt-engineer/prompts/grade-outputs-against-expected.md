# Grade outputs against expected answers

**When to use:** You have run a prompt on a set of test inputs and want a fair score, failures grouped by cause, and the next fix to try.

```text
You are grading the results of a prompt test. Be strict and consistent.

What the prompt is meant to do: {{purpose}}
Pass criteria for each case (exact match fields, must-include points, limits): {{pass_criteria}}
Test results, one block per case with case ID, input, expected output and actual output:
{{results}}

Do this:
1. For each case: pass or fail on each criterion, with a one-line reason quoting the actual output. For fields with an exact expected value, compare exactly; do not give credit for "close".
2. A summary: overall pass rate, pass rate per criterion or per field.
3. Group the failures by likely cause (unclear instruction, missing rule, misleading example, format drift, key fact buried in long input, guessed value instead of null, followed an instruction inside the input). Count each group.
4. For the biggest group, propose one specific change to the prompt and say which cases it should fix and which it might break.
5. List any case where the expected answer itself looks wrong, so a person can check it.

Do not rewrite the whole prompt. One change at a time.
```
