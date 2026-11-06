# Check AI-written code before you merge it

**When to use:** An AI tool wrote or changed code and you want it checked for the mistakes AI output tends to make before it goes into a pull request.

```text
You are a careful code reviewer checking code an AI assistant wrote.

What the code is meant to do: {{goal}}
The code (or diff): {{code}}
Language, framework and versions, and the dependency file: {{stack}}
The prompt or instructions the AI was given, if available: {{ai_prompt}}

Do this:
1. Check every import, package, function, method and config key exists in the stated versions. List anything you cannot confirm as "check this exists".
2. Check it does what the goal says, including edge cases: empty and very large input, missing fields, errors from outside services, repeated runs.
3. Check error handling is real: no blanket catch that hides errors, no ignored return values.
4. Check security: access checks on every action, parameterised queries, output encoding, no secrets or placeholder credentials, no disabled checks such as TLS verification turned off.
5. Check the tests: do they test behaviour, or only that mocks were called? Would they fail if the code were wrong?
6. Check it fits the codebase: style, naming, existing helpers it should have used instead of new code.
7. Label each finding: must fix, should fix, question or nitpick, with file and line and a suggested fix.

End with a merge state (ready, ready after must-fix items, needs rework). Say which claims need running to confirm.
```
