---
name: plain-writing
description: How to write every word a visitor reads on AI Blocks (useaiblocks.com), in the brand's voice, at a grade 8 to 10 reading level or lower. Use when importing or adding a skill, prompt or workflow (its page.yaml name, headline, subhead, summary and page text), when writing or editing site copy, the How it works page, buttons, toasts or errors, and when asked to make anything here clearer, simpler or less jargon-heavy.
---

# Plain writing for AI Blocks

Write so a busy owner who has never used AI for work understands it on one read. Clear and short beats clever. Every line must be true.

This skill sits on top of `brand/COPYWRITING.md` (headlines, outcomes, AI tells) and `docs/WRITING.md` (plain language, banned words). Read both once. Where they say more, they win.

## Who you're writing for

A small business owner, marketer or freelancer. They are smart and busy. They don't know our words (block, port, orchestrator, handoff) or AI words (context window, tokens, agentic). They came to get one job done. Tell them what they get, how to get it, and show them.

## The voice

- **Plain and direct.** Say the thing. "Paste your ad. You get the lines Meta would reject, and how to fix them."
- **Warm, not cute.** One dry joke on a page is plenty, and never on a page about a problem.
- **Sure, not loud.** No hype words, no exclamation marks.
- **"You" and "your".** Talk to the reader. Say "your AI", not "the model" or "the LLM".

## Reading level: grade 10 at most

Most of our pages read at grade 5 to 8, and that is good. Never go above 10. To get there:

1. **Short sentences.** Aim for 15 words. Split anything over 25 into two.
2. **Short words.** Use the simple word unless the long one says more. Long words are fine when they're the exact name for the thing ("landing page", "subscription").
3. **One idea per sentence.** If a sentence has "and" twice, it's probably two sentences.
4. **Concrete nouns.** "Your reviews, your prices, your product photos", not "your data".
5. **Explain a term the first time**, in a few words, then use the same word every time after. Add it to the page's `terms`.

Swap these:

| Instead of | Write |
|---|---|
| utilize, leverage | use |
| assist, facilitate | help |
| commence, initiate | start |
| terminate | stop, end |
| obtain, acquire | get |
| sufficient | enough |
| numerous | many |
| prior to | before |
| in order to | to |
| regarding, with regard to | about |
| additional | more |
| demonstrate | show |
| optimize | improve, make better (or say how) |
| functionality | what it does |
| leverage AI capabilities | let your AI do it |
| input (as a verb) | paste, type, add |
| context | what your AI knows about you |
| generate | write, make |
| output | result (on the site; "Output" is fine inside a skill file) |

## Keep it true

Wrong copy loses trust faster than plain copy loses attention.

- **Every claim must be something the skill really does.** Read the SKILL.md before you write its page. If the skill has 12 checks, don't write "30 checks".
- **Never invent a number, result, time saved or customer quote.** If you don't have it, leave it out.
- **Steps must work as written.** If a page says "open Settings, then Capabilities", that must be where it is today. When you aren't sure an app's menu is called that, say less ("in your AI's settings") rather than guess.
- **Name what's not here yet.** If the library doesn't have something, say "not yet". Don't promise a date.
- **Examples use Sprout**, our real brand with its name changed. Never a made-up business, never a real client.

## Cut every word that isn't working

- Delete openers: "In order to", "It's worth noting that", "Basically".
- Delete fillers: very, really, just, actually, simply, quite.
- Say it once. If two sentences say the same thing, keep the better one.
- End the sentence when the point is made. Don't add a comma and a pile of extra phrases.

## When you import a skill, prompt or workflow

Fill its `page.yaml` in this order. The format is in `docs/PAGE-FORMAT.md`.

1. **Read the SKILL.md end to end.** Write down what goes in, what comes out, and the steps it follows.
2. **`name` and `headline`:** 4 to 10 words. The result or the problem solved, verb first. "Keep Facebook from blocking your ads."
3. **`summary`:** "Give it X. You get Y." Under 22 words. This is the card text.
4. **`subhead`:** one to three sentences: what you give it, what it does, what you get.
5. **`explain`, `how_to_use`, `when`, `you_give`, `you_get`:** short sentences, one idea each. List items are plain text: no "Label: text" (YAML reads that as a map).
6. **Check it** (below), then fix and check again.

## Check before it ships

Run these from the repo root:

```
node tools/lint-pages.mjs
node tools/reading-level.mjs <slug>
```

The first checks the page format, word limits, banned words and em dashes. The second gives the grade and lists the long words and long sentences to fix. For any other text (site copy, a help page):

```
node tools/reading-level.mjs --text "your text"
node tools/reading-level.mjs --file path/to/file.md
```

Then read it once more as the visitor would:

- Could a stranger say what they get, and what to do, after one read?
- Is there a word they'd have to look up?
- Is every number and step true?
- Any AI tells from `brand/COPYWRITING.md`? (contrast reveals, "Not X. Y.", colon reveals, stock openers, em dashes in short copy)

## Before and after

> **Before:** Leverage our comprehensive audit framework to optimize landing page conversion performance.
> **After:** Find what stops visitors buying, in 30 checks.

> **Before:** This skill facilitates the generation of ad copy that is grounded in verified product claims.
> **After:** Give it your product facts and buyer. You get an ad built on the fact that answers their biggest doubt.

> **Before:** Upload the handoff pack to an agentic environment with file-system access.
> **After:** Upload the folder to your AI and say "Follow HANDOFF.md".
