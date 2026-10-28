---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

# Grill with docs

Interview the user about their plan until it holds up. As answers settle, write them down: a glossary of the project's words, and a short record of each hard decision.

The upstream skill is only a pointer to two other skills, "grilling" and "domain-modeling", which are not in this folder. This copy writes out the method of both so it runs on its own. If you have the originals, they win where they differ.

**Do not use when:** the plan is already decided and the user wants it built (build it), the user wants ideas rather than questions (brainstorm instead), or the plan is one small, easy-to-undo choice (just decide).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a plan, a document, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can read your project and save the glossary and decision records as files.
- **Any good chat AI:** Works well as a conversation. Copy the glossary and records into your project at the end.
<!-- /needs -->

## What you need

Ask once, in one message, for anything missing:

1. The plan, design or proposal. Pasted text, a file or a link the user can open. A strategy document from an earlier step can stand in for the plan.
2. Context: who it is for, why now, and what "done" looks like.
3. Existing terms, such as a glossary or `CONTEXT.md` (optional).
4. Existing decision records, such as `docs/adr/` (optional).
5. Access to the code or documents behind the plan, if there are any (optional).

If there is no plan yet, say so and ask for even a rough one-paragraph version. Do not invent a plan.

## Part 1: The grilling

1. **Read first.** Read the plan and everything the user gave you. List the decisions it makes, and the decisions it avoids.
2. **Build the decision tree.** Order the decisions so that the ones others depend on come first. Do not ask about a detail before its parent choice is settled.
3. **Ask one question at a time.** Never a list of questions. Wait for the answer.
4. **Give your own recommended answer** with each question, in one or two lines, so the user can say "yes" and move fast.
5. **Look before you ask.** If the code or documents can answer a question, read them instead of asking.
6. **Push on each choice.** Ask why this and not the other. Ask what happens when it fails. Ask what is being assumed, and how the user would know if the assumption were wrong.
7. **Go branch by branch.** Finish one branch before the next. When an answer opens a new question, follow it.
8. **Do not accept vague answers.** If the answer is fuzzy ("it should be fast", "the usual way"), ask for a number, an example or a name.
9. **Stop when every branch is closed** or marked open. Do not keep asking for its own sake.

## Part 2: The glossary

While you grill, watch for words that carry weight in the plan.

- If the same word means two things, stop and ask which meaning is meant. Pick one meaning per word and give the other a new word.
- If two words mean one thing, pick one.
- When a term is settled, add it to the glossary right away. Each entry: the word, a one-sentence meaning in plain language, and what it is not.
- Use the glossary words in every later question.
- If a `CONTEXT.md` or glossary exists, add to it. Do not overwrite entries without telling the user.

## Part 3: Decision records

When the user settles a decision that is hard to reverse, would surprise a newcomer, or was a real trade-off between options, write a short decision record (ADR). Do not write one for small, easy choices.

Use this layout:

```
# <number>. <short title>

Status: accepted
Date: <date>

## Context
<the problem, in two or three lines>

## Decision
<what was chosen, in one or two sentences>

## Options considered
- <option>: <why not>

## Consequences
<what gets easier, what gets harder, and what to watch>
```

Number records in order (`0001`, `0002`, ...). Save them in `docs/adr/` if you can write files, and say the path. If you cannot write files, give the text in your reply.

## Output

At the end of the interview, return:

1. **Questions and answers:** a short log, one line each, in the order asked.
2. **Glossary:** a table of word, meaning, and what it is not.
3. **Decision records:** each ADR in the layout above.
4. **Open problems:** each unresolved question, why it matters, and who or what could settle it.
5. **Changes to the plan:** the edits to the plan that the answers call for.
6. **Next steps:** the first thing to do, and whether another review is needed.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Plan stress tester](https://useaiblocks.com/skills/plan-stress-tester). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing

- No plan: ask for a rough one. Do not make one up.
- The user does not know an answer: record it under Open problems with your recommended answer, and move on.
- The user says "you decide": give your recommendation with the reason, mark it "recommended, not confirmed", and ask for a yes.
- Never state a fact about the user's system that you have not read in what they gave you.
