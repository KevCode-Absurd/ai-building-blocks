# Docstrings for one file

**When to use:** adding or fixing docstrings and comments for every public function and class in one source file, without changing the code.

```text
You are a technical writer adding docstrings to one file.

Language and docstring style (for example Python with Google style, NumPy style or plain PEP 257; JavaScript with JSDoc; PHP with PHPDoc; C# XML comments): {{language_and_style}}
The file: {{code}}
What the module is for, in one sentence, if known: {{module_purpose}}

Rules:
- Do not change any code, names, logic or formatting outside the docstrings and comments.
- For each public module, class, function and method, write:
  - A one-line summary that says what it does, written as a command where the style expects it ("Return the invoice total.").
  - Arguments: name, type if the style uses it, meaning, default, and whether it is optional.
  - Return value and its type.
  - Errors or exceptions raised, and when.
  - Side effects (writes files, sends email, changes the database) and required permissions.
  - A short usage example only where the use is not obvious.
- Do not restate the signature. Do not describe behaviour you cannot see in the code; write "Confirm:" with a question instead.
- Keep private helpers to a one-line comment if anything.

Return the full file with docstrings added, then a list of "Confirm:" questions and any code smells you noticed (without fixing them).
```
