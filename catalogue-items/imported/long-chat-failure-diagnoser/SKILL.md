---
name: context-degradation
description: "Language models exhibit predictable degradation patterns as context length increases. Understanding these patterns is essential for diagnosing failures and designing resilient systems."
risk: none
source: community
date_added: "2026-09-04"
---

# Context Degradation Patterns

Language models exhibit predictable degradation patterns as context length increases. Understanding these patterns is essential for diagnosing failures and designing resilient systems. Context degradation is not a binary state but a continuum of performance degradation that manifests in several distinct ways.

## When to Use

Activate this skill when:
- An AI loses track of earlier instructions or facts during a long conversation
- An agent produces wrong or off-topic output after a lot of text has built up
- You are designing a system that must handle large amounts of text reliably
- A person pasted a lot of material and the AI now misses obvious facts

## When Not to Use

- The chat is short and the answer is still wrong. That is more likely a vague request, a missing fact or a model limit. Use the Prompt fixer.
- You want the chat shrunk or handed to a new chat: use the Long chat summariser or the Context shrinker.
- The AI never had the data (a file did not load, a tool failed). Fix that first.
- You want to design what an agent remembers across sessions: use the Agent memory designer.

## What You Give It

Ask once for any that are missing. If one is still missing, write MISSING and say how it limits the diagnosis. Never guess the symptom.

1. What goes wrong, in the person's words (the symptom).
2. How long the chat or pasted input is (messages, pages or an estimate).
3. A short sample of a bad answer, and what a good answer would have said (optional but very helpful).
4. What the person already tried (optional).
5. Which AI tool they use, and whether it keeps a long running chat or starts fresh each time (optional).

## Diagnosis Procedure

1. **Get the symptom.** If it is vague ("it got worse"), ask for one concrete example of something it missed or got wrong.
2. **Check the length.** If the chat is short, say so and point to a different cause before going further.
3. **Match one of the five patterns below.** Use the signs listed for each. If two fit, name the main one and the second one, and say how to tell them apart.
4. **Give evidence from the person's own chat.** Quote or point to the exact message or answer that shows the pattern. If there is no sample, say the match is a guess.
5. **Give one fix to try first.** Pick one fix from the matching pattern. Say what to do, step by step, in the person's AI tool. Add one backup fix.
6. **Give a test.** One way to check the fix worked, for example ask the same question again and compare.
7. **Give one prevention note** for next time.

## Output

Return these five items in order. Keep it under about 350 words.

1. **Likely cause**: the pattern name and one plain sentence on what it means.
2. **Evidence from your chat**: what in the person's example fits, or "No sample given, so this is a guess".
3. **Fix to try first**: numbered steps, plus one backup fix.
4. **Test to confirm**: what to run and what a pass looks like.
5. **Prevention**: one habit for next time.

If the symptom does not fit any pattern, say "None of the five fits" and name the likeliest other cause (vague request, missing fact, model limit, tool failure).

## Core Concepts

Context degradation shows up in five patterns. Each has its own signs and its own cure.

### 1. Lost in the middle

Facts in the middle of a long input are used less reliably than facts at the start or end. This is a well-known finding in research on long inputs (for example "Lost in the Middle", Liu and others, 2023). How strong the effect is depends on the model and the task.

- **Signs:** The AI misses a fact you know it was given, especially one pasted in the middle of a long document or chat.
- **Fixes:** Put the task and the key facts at the start and again at the end. Add clear headings. Ask for a short summary of the key facts before the answer.

### 2. Poisoning

A wrong fact, from a tool, a document or the AI's own earlier answer, gets repeated and builds on itself.

- **Signs:** The same mistake keeps coming back after you correct it. Answers that were good earlier are now off. The AI picks the wrong tool or inputs.
- **Fixes:** Find the first message with the wrong fact. Start a new chat with only the verified facts. Or state the correction plainly and ask the AI to redo its work from that point.

### 3. Distraction

Too much unrelated text competes with the facts that matter.

- **Signs:** The AI uses a detail from the pasted material that is not relevant, or leans on pasted text over what it knows.
- **Fixes:** Paste only what the task needs. Remove old tool output and long logs. Link or fetch material on demand instead of pasting all of it.

### 4. Confusion

The AI cannot tell which instructions or material apply to the current task, often after the chat switched topics.

- **Signs:** Answers mix requirements from two earlier tasks. Tools or rules from one task get used in another.
- **Fixes:** Give each task its own chat. Mark clear breaks ("New task, ignore earlier rules about X"). Restate the current rules in one block.

### 5. Clash

Two pieces of information in the chat contradict each other, such as an old version and a new version.

- **Signs:** The AI hedges, flips between two answers, or quotes the outdated figure.
- **Fixes:** Remove the outdated version. Label sources and versions. Say which source wins when they disagree.

## Four Ways to Fix Any of Them

- **Write:** Save facts outside the chat, in a notes file or a project document, and bring back only what you need.
- **Select:** Bring only the relevant facts into the chat.
- **Compress:** Summarise the chat so far, check the summary against the original, and continue in a new chat with it.
- **Isolate:** Split the work across separate chats or helper agents so no single chat grows too long.

## What Not to Claim

- Do not give a number for when a particular model "starts to fail". Limits change with each model release and depend on the task.
- Do not quote benchmark scores from memory. If the person wants numbers, tell them to look up the model's current published results and to test with their own material.
- Longer chats usually cost more to run, and some tools charge by length. Tell the person to check their own tool's pricing.

## Examples

**Example: put the key facts at the edges** (placeholders, not real figures)
```markdown
[CURRENT TASK]                      # At the start
- Goal: <what you want>
- Deadline: <date>

[BACKGROUND MATERIAL]               # Middle, where attention is weakest
- <long documents, data, notes>

[KEY FACTS TO USE]                  # Again at the end
- <fact 1>
- <fact 2>
```

## Guidelines

1. Note how long the chat was when the problem first showed. That tells you more than any rule of thumb.
2. Put critical information at the start and end of long inputs.
3. Summarise or restart before quality drops, not after.
4. Check any material you pull in for errors before you add it.
5. Keep versions clear so old facts do not clash with new ones.
6. Keep one task per chat.
7. Test with your own material, growing it step by step, to find where your tool starts to slip.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

---

Original skill by Agent Skills for Context Engineering Contributors, shared in the sickn33 collection. See LICENSE-CONTENT.
