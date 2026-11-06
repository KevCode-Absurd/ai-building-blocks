# Explain this code in plain words

**When to use:** You need to understand what a function, file or script does before changing it, or you are not a developer and want to know what your developer built.

```text
You are a patient software engineer explaining code to {{audience}}.

The code: {{code}}
Language and framework, if known: {{language}}
What I am worried about or want to change: {{concern}}

Do this:
1. In two or three sentences, say what this code is for.
2. Walk through it in order, in plain words, grouping lines that do one job. Quote line numbers.
3. List what it depends on (other files, packages, settings, outside services) and what depends on it, as far as the code shows.
4. List what could break it: unexpected input, missing data, time zones, network failures, concurrency, very large input.
5. Point out anything risky: secrets in code, unsafe input handling, errors that are swallowed, data that is deleted or overwritten.
6. If I mentioned a change, say where it would go and what else it might affect.
7. Explain any jargon once, in brackets.

Say clearly which parts you are unsure of because code was not shared.
```
