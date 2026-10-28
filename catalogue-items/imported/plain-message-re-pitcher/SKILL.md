---
name: wait-what
description: "Stop. That last message did not land: re-pitch it."
disable-model-invocation: true
---

Wait, I don't understand where you've got to here. Re-pitch that: give me a little bit of context, talk in ASD-STE100 Simplified Technical English, and use the ubiquitous language from `GLOSSARY.md` (follow `GLOSSARY-MAP.md` to the right one if the repo has more than one).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **The post or message** (yours): the post, comment, message or email you're replying to, with who wrote it and where.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for the post or message, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** It is one short prompt, so Claude, ChatGPT and Gemini all work.
<!-- /needs -->

## How to follow this

ASD-STE100 Simplified Technical English is a writing style made for clear reading: short sentences, plain common words, active voice, and one word for one thing. "Ubiquitous language" means the agreed words a project uses for its own ideas, kept in a glossary file.

### 1. Find the message

Re-pitch the last message you wrote in this chat. If the user pasted a different message, use that one. If there is no earlier message and nothing pasted, ask once: "Which message should I say again?" Do not guess.

### 2. Find the glossary (optional)

- If the project has `GLOSSARY.md`, use its terms. If it also has `GLOSSARY-MAP.md` and more than one glossary, follow the map to the right one.
- If the user pasted a glossary, use that.
- If there is no glossary, say "No glossary found, so I used everyday words" in one line and carry on. Do not invent a glossary or make up project terms.

### 3. Re-pitch

Write the same content again. Do not add new facts, new advice or new claims. Do not drop a caveat or a warning. If the original message was wrong, say it once, plainly, at the end.

Write in this order:

1. **Where we are.** Two or three short sentences of context: what we are doing and why this message matters.
2. **The message again.** The same points, in short sentences. One idea per sentence. Put the main point first. Use the glossary word every time it applies.
3. **Words used.** A short list of any technical or glossary terms you kept, each with a few words of meaning. Leave this out if you used no such term.
4. **Still unclear?** Ask one question if the original message was unclear itself, for example "The earlier message did not say which file. Which one do you mean?" Leave this out if nothing is unclear.

If the user said how much context they want ("just one line" or "start from the beginning"), follow that.

### Check before you send

- Every fact in your version was in the original message.
- No sentence is longer than about 20 words.
- No unexplained jargon is left.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI context editor](https://useaiblocks.com/skills/context-shrinker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
