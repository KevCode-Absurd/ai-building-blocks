---
name: expert-knowledge-interview
description: Interview an expert (media buyer, copywriter, negotiator, CFO or any professional) to capture the judgment, taste and strategy they cannot write down, and turn it into agent files. Runs six scripts on real work (a task map, 5 to 10 real cases, a think-aloud on one real task, a repertory grid, 20 or more pairwise picks, and teach-back), guards against a leading or flattering interviewer, and fills a scope card, typed decision rules, a case library, taste files and a never-do list.
---

# Expert knowledge interview

You interview one expert to capture how they really decide, so an AI agent can work the way they do. Experts leave out most of the decisions they make when they describe their work in general terms, so "tell me your process" gives you a textbook. Every script here anchors the expert in a real case, a real task or real examples. Each script fills one named file.

You run the interview in the expert's own AI. You do not run a hosted service, connect to their accounts, or save anything outside the files you hand back or write in their project.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Claude Code or OpenAI Codex:** They can write the files straight into your project folder as the interview goes.
- **Any good chat AI:** Claude, ChatGPT or Gemini can run the interview and give you each file to save.
<!-- /needs -->

## What you need

- **Who is training** and the job the agent will do, such as "Kevin, media buyer for Meta and Google accounts".
- **Real cases** from their work: 5 to 10 jobs where their judgment mattered. Names can be taken out.
- **One real task** they can do in 20 to 45 minutes while you watch, such as reviewing an account export.
- **8 to 15 pieces of real work** to compare: their past work with known results, or named public work such as a brand's live ads or pages.
- **Optional:** an existing agent pack or playbook to start from, and the AI Blocks "Train your own" pack for their role.

## Rules for the interviewer

These rules stop you from leading the witness. Language models tend to agree with the person and to suggest answers they will accept, which turns the expert's words into yours.

1. **One question at a time.** Ask, then wait.
2. **Real cases only.** When an answer is general ("I usually...", "it depends"), ask for the last real time: "Walk me through the last time that happened. What did you see first?" For "it depends", ask "On what? Give me two cases that went different ways."
3. **Never suggest the answer.** Ask "What did you notice?", never "Did you notice the frequency was high?" Never offer an explanation for them to agree with. If they ask what you think, say you want their view first.
4. **Hunt for the exception.** After every rule-like answer, ask "Tell me about a time that rule was wrong, or didn't apply." Then ask "When would you break it?" A rule with no counter-example yet is marked "none found yet", not "always".
5. **Separate then from now.** Ask "Did you know that at the time, or did you learn it later?" A good outcome does not prove a good decision.
6. **Ask how sure they are**, and how often they have been wrong.
7. **Point out conflicts neutrally.** "Earlier you said X. Here you did Y. When does each one hold?"
8. **No praise.** Acknowledge plainly and move on.
9. **Keep their words.** Don't polish their views into textbook advice or swap their terms for common jargon.
10. **Never fill gaps with your own know-how.** Leave a gap marked `MISSING:`. Never invent clients, results or credentials. Their claims about results are marked "(self-reported)".
11. **Close every script with teach-back** (script 6).

## Privacy

- Use only material the expert may share. Take out private names, emails, account numbers and anything that identifies a private client. Use labels such as "Client A, a two-shop bakery".
- Public work by a real, named business (its live site, its ads in the Meta Ad Library, published results) may keep the name, with the link and the date seen. Claim nothing beyond what the public source shows.
- Never ask for passwords, keys or tokens. A data export they choose to share is fine; you don't need access to their tools.
- Keep raw transcripts out of the agent files. Write cases, rules and short quotes the expert approves.

## Steps

### Script 1: Task map (about 1 hour) fills `expert/scope-card.md`

A short Applied Cognitive Task Analysis.

1. "Which three to five jobs would a client hire this agent for?" For each: "What does a great result look like, and how would the client know?"
2. For the job they do most: "Break it into three to six big steps, from the moment the job lands to the handover." Then: "Which of these take the most judgment?"
3. For each high-judgment step, ask these one at a time, each followed by "Tell me about the last time":
   - "How can you tell where things are heading at this point?"
   - "What are you keeping track of that a junior wouldn't?"
   - "What do you notice that others miss?"
   - "What shortcut or habit saves you the most trouble?"
   - "When did the normal approach fail, and what did you do instead?"
   - "How do you know, partway through, that you're getting it wrong?"
4. "When should an agent doing this stop and ask you, or refuse?"
5. For each tool: "What do you do in it yourself: look, draft for someone else to publish, or make live changes? What limits do you keep to? What do you check before a live change?" This fills an access profile with three levels: read, read and draft, and read, write and publish within the client's limits.

Write the scope card:

```markdown
# Scope card: [agent name]
Trained by: [name, credentials as they state them]
## Jobs I do
1. [Job]: [what is delivered], for [who], done well when [success measure]
## Where the judgment is
| Step | What happens | Judgment (low, medium, high) | Why it's hard | What novices get wrong | Cues I use |
## I stop and ask when
- [Situation]: [the question, or who to hand it to]
## Not my job
## Access profile
| Tool | I look at | I draft | I change live, within | Checks before a live change |
```

### Script 2: Real cases (30 to 45 minutes each, 5 to 10 cases) fills `expert/cases/` and `expert/decision-rules.md`

The Critical Decision Method. Spread cases across the jobs. Include one that went badly and one where the obvious move was wrong. Ask: "Pick a real job you led where your judgment mattered, ideally one where a capable junior would have got it wrong." Check the rights first. Then four sweeps:

1. **The story.** "Tell me what happened, start to finish." Don't interrupt.
2. **The timeline.** Read back a numbered timeline with the points where their understanding changed or they acted. They correct it.
3. **Deepen each decision point:**
   - "What did you see, read or hear here? What did you deliberately not look at?"
   - "What did you think was going on? What did you expect next?"
   - "What options did you have, including waiting? Why did the tempting one lose?"
   - "What did you check before you acted? How sure were you?"
   - "Did you know that then, or learn it later?"
4. **What-ifs.** "What would a capable junior have done?" "Which single fact, if different, would have changed your call?" "Where could this have gone wrong?" Each what-if is a seed for an eval case.

Write one file per case:

```markdown
# C03: [short title]
Rights: [own work, names out | client agreed | public facts only, with sources]
When: [month year]   Job: [from the scope card]   Tags: [industry, size, channel, stage]
## What I knew at the start
## Timeline
## Decision points
### D1: [what I decided]
- Cues noticed, and cues ignored
- What I expected
- Options, including waiting, and why the tempting one lost
- What I checked
- What would have changed my call
## What a capable junior would have done
## Outcome (or "not measured"), and what was luck
## What-ifs (seeds for eval cases)
## Rules this case supports
```

Write each rule in `expert/decision-rules.md`, after the exception probes:

```markdown
## DR4: [short name]
If: [the cue, specific enough that someone else could spot it]
Then: [what I do]
Because: [their reason]
Unless: [when I break it]
Counter-example: [a real time it was wrong, or "none found yet"]
How sure: [their words]
From: [case ids]
```

### Script 3: Think-aloud on one real task (45 to 60 minutes) fills the method checklist

1. Warm up for two minutes on a tiny practice task.
2. "Do this task the way you normally would, and say out loud what you look at, think and decide. I won't ask why until you finish. If you go quiet I'll only say 'keep talking'." Say nothing else. In a chat, they can record their voice and paste the transcript, or type short notes as they go.
3. Code the transcript as a numbered list: cue noticed, what they made of it, what they checked, what they decided.
4. Ask only about the gaps, one at a time: "At step 4 you skipped [X]. Why?" "You looked at [Y] before [Z]. Is that order the same every time?"

Write the method as an ordered checklist that starts with what they look at first (in a pack, the "How I work" section of `playbook.md`), plus new rules and one eval-case seed.

### Script 4: Repertory grid (45 to 60 minutes) fills `expert/taste/grid.md`

1. Collect 8 to 15 real elements for one job.
2. Show three at a time: "How are two of these alike, and different from the third?" Write the answer as two poles in their words.
3. Repeat until two triads in a row give nothing new.
4. They rate every element on every construct from 1 to 5.
5. Ask which elements are good, and find the constructs that line up with good. Ask about any that don't: "This rates high on K3 but you called it weak. What's going on?"

### Script 5: Pairwise picks (20 to 30 minutes, 20 or more pairs) fills `expert/taste/pairs.md`, `references.md` and `never-do.md`

Shuffle the order and never say which item you made. For each pair: "Which would you ship for this client?" Then "One line on why." Then "What would make you flip?" Include at least five close calls.

```markdown
## P07
Job and context: [one line]
A: [work or link]   B: [work or link]
Pick: [A, B or neither]
Why: [their words]
Would flip if: [condition]
Construct: [grid construct it maps to]
```

Then ask for two to five pieces of work they admire and one to three they'd never want to look like (`references.md`: what to learn, what not to copy, when it applies). Then: "What would you never ship, even if the client insisted?" For each: "Has there ever been an exception?" If yes, it is a decision rule with an "Unless". If no, write it to `never-do.md` with its reason and how a reviewer would spot it in the work.

### Script 6: Teach-back and show-me (15 to 30 minutes, after every script) fills `training/capture-log.md`

1. Restate what you captured as a short procedure in your own words: "So when [cue], you first check [X], then [Y], unless [Z]."
2. Ask them to correct it. If they approve a long read-back with no changes, ask "Which three lines are the weakest?"
3. Show-me: take a what-if you haven't used, do it the way you now think they would, and ask them to mark every place you went wrong.
4. Fix the file each correction came from and log it: date, what you had, what they said, which file changed. Each correction is also a regression eval case.
5. Repeat until a round has no corrections of substance.

## What you hand back

The files, each in full (or written into their project if you can write files): `expert/scope-card.md`, `expert/decision-rules.md`, `expert/cases/C01-...md` and on, `expert/taste/grid.md`, `pairs.md` and `references.md`, `expert/never-do.md`, the method checklist, `training/capture-log.md`, and a list of eval-case seeds. Then a short note:

```text
CAPTURED
Cases: <n>   Rules: <n> (<n> with a real counter-example)   Pairs: <n>   Grid constructs: <n>
SEEDS FOR THE EVAL SET
- <what-if or stop-and-ask item> (type: hero, edge, trap or regression)
GAPS
MISSING: <what we still need, such as a case for job 3>
NEXT
<next script, or the expert-agent-eval-builder skill>
CHECKS MISSED
<one line each, or none>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Expert agent eval builder](https://useaiblocks.com/skills/expert-agent-eval-builder). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

Kevin is training a Media Buyer agent for Meta and Google accounts: structure, tracking and attribution. In script 1, his task map for an account audit might split into pulling the export, checking tracking, reading structure and spend, and writing the fixes. When he marks "checking tracking" as high judgment, the interviewer asks "What do you notice in tracking that others miss?", then "Tell me about the last time", and never offers a cause of its own. For his Creative Strategist agent, script 4 could use public ads from the Meta Ad Library for named brands in one category as grid elements. His constructs stay in his words, and nothing about those brands' results is claimed beyond what the Ad Library shows.

## Checks

- Every rule has an "Unless" and a counter-example line, even if it says "none found yet".
- Every case keeps what was known at the time apart from the outcome.
- No answer in the files came from you rather than the expert. Gaps are marked `MISSING:`.
- No private client detail, password or key is in any file. Public businesses are named only with a link and date.
- Teach-back ran after each script and its corrections are logged.

## If something is missing

- No real cases yet: start with script 1 and script 3, and ask them to note real cases over the next week.
- No examples to compare: use named public work in their field, with links and dates.
- They can't spare the time: the minimum is script 1, three cases, 20 pairs and one teach-back round, about 4 hours.

## Avoid

- Asking "what is your process?" and writing down the answer as the method.
- Suggesting causes, options or wording, then recording their agreement as their view.
- Universal rules ("always", "never") with no exception probe.
- Turning their vocabulary into generic marketing terms.
- Treating a good outcome as proof of a good decision.
