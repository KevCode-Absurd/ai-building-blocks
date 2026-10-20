# Models and reasoning for every task

**Status:** locked for now, 20 Oct 2026. Kevin: "lock in the models … what level of reasoning and what model should we use for each task … in Claude for now, and then you can give me alternatives for GPT."

These are the models **we** use to build and test the library. The site never names models to visitors; it shows the thinking level instead (`docs/MINDS-PRD.md` §1). Model IDs live in one place in code (`tools/test-blocks.mjs`, `tools/test-minds.mjs`), and the classes are in `catalogue-items/_models.yaml`.

## The ladder

| Tier | Claude (now) | GPT (later) | Use it for |
|---|---|---|---|
| **Top** | Fable 5.1 (`claude-fable-5-1`) | GPT Sol | Judging other models' work, and the hardest calls. The judge never comes from the lab that did the work. |
| **High** | Opus 5.5 (`claude-opus-5-5`) | GPT Astra | Writing and fixing skills, building a mind's data set and personality, long multi-stage work |
| **Mid** | Sonnet 5.5 (`claude-sonnet-5-5`) | GPT Terra | Pulling facts out of sources, page copy, light judging, most single skills |
| **Low** | Haiku 5.5 (`claude-haiku-5-5`) | GPT Luna | Cleaning transcripts, reformatting and sorting, high volume |

**Reasoning (effort):** `low`, `medium`, `high`, `xhigh` or `max` on Claude, and the same three to five steps on GPT. Use the lowest effort that passes the test. Raise it one step only when a test fails on reasoning, not on facts.

**Batch everything that can wait.** Batches cost half, and every build job below can wait.

> The GPT names follow Kevin's list. Check the exact names and model IDs on OpenAI's model page on the day we switch, and rerun the tests before trusting the swap.

## Minds: from sources to a tested mind

| # | Task | Claude model · effort | GPT later | Why this level |
|---|---|---|---|---|
| 1 | **Find and pick sources** (public pages, books in the public domain, talk transcripts) | Sonnet 5.5 · medium, with web search | GPT Terra · medium | Judging which source is primary is moderate work. Volume is low. |
| 2 | **Clean transcripts** you give us (YouTube and podcasts): strip timestamps, "um"s, ads and sponsor reads; mark the speaker; split by topic | Code first (timestamps, speaker tags), then Haiku 5.5 · low | GPT Luna · low | Mechanical and high volume. Nothing to judge. |
| 3 | **Extract** from each source or transcript chunk: ideas, how they decide, where they stand, examples, short phrases under 15 words, each tagged with its source | Sonnet 5.5 · medium, batch | GPT Terra · medium | Careful reading at volume. Each chunk is small. |
| 4 | **Write knowledge.md**: merge the extracts, drop repeats, mark what's disputed, date living views, keep every `[Sn]` tag | Opus 5.5 · high | GPT Astra · high | One long synthesis over many extracts. Mistakes here spread to every answer. |
| 5 | **Write personality.md**: voice, how they argue, the questions they ask, what they'd never say, one sample marked as ours | Opus 5.5 · high | GPT Astra · high | Hearing a voice across many sources is the subtlest step. |
| 6 | **Check the facts**: every tagged claim is in its source, every quote matches word for word, and the living flag and years are right | Code for exact quotes, then Sonnet 5.5 · medium | GPT Terra · medium | Checking against a given text is narrow work. Code catches made-up quotes for free. |
| 7 | **Write mind.yaml**: use cases, seats, who they pair with, the five tests | Sonnet 5.5 · medium | GPT Terra · medium | Short and structured |
| 8 | **Build SKILL.md** | Code (`tools/build-minds.mjs`) | Same | Plain code, so the same files always give the same skill |
| 9 | **Test it**: run the five prompts | Opus 5.5 · medium | GPT Astra · medium | Plays a person's strong chat model |
| 10 | **Grade the tests** | Fable 5.1 · high | GPT Sol · high | A different model from the writer, and the strongest one |
| 11 | **Fix a failing mind** | Opus 5.5 · high | GPT Astra · high | Same as steps 4 and 5 |

**For the pilot and the first 151, steps 1 to 7 run as Claude Code subagents on Opus 5.5.** That's simpler while we're shaping the format. Once you send transcripts at volume, we split them out as above: Haiku cleans, Sonnet extracts, Opus writes. That cuts the cost of a mind by about two thirds.

**Rough cost per mind** with the split pipeline and batches: about $0.50 to $1.50, depending on how many transcripts. Testing adds about $0.10 to $0.20. All 151 come to roughly $100 to $250.

## Skills, prompts and workflows

| Task | Claude model · effort | GPT later |
|---|---|---|
| Write or rebuild a skill from primary sources | Opus 5.5 · high | GPT Astra · high |
| Write the page copy (`page.yaml`) to the plain-writing rules | Sonnet 5.5 · medium | GPT Terra · medium |
| Name a skill and give naming options | Sonnet 5.5 · medium | GPT Terra · medium |
| Set the thinking level | Rules in code, reviewed by Sonnet 5.5 · low | GPT Luna · low |
| Run the test (the writer) | Opus 5.5 · medium | GPT Astra · medium |
| Judge a short, easy run | Sonnet 5.5 · medium (light judge) | GPT Terra · medium |
| Judge everything else, and every light-judge fail | Fable 5.1 · high (strong judge) | GPT Sol · high |
| Fix a skill that failed its test | Opus 5.5 · high | GPT Astra · high |
| Generated sections, handoff packs, the site index | Code | Same |

## When people run them (what the thinking gauge means)

| Gauge | Claude | GPT | Gemini |
|---|---|---|---|
| Low | Haiku, or Sonnet at low effort | GPT Luna | Flash |
| Medium | Sonnet | GPT Terra | Pro |
| High | Opus, or Fable for the hardest work | GPT Astra or GPT Sol | Pro with deep thinking |

**An advisory council in Claude Code:** each member is a subagent on Sonnet 5.5 at medium effort, reading only its own mind file. The chair, which writes the cross-examination and the brief, runs on Opus 5.5 at high effort. In a single chat, use your strongest model for the whole thing.

## Rules
- The judge's lab and model never wrote any part of the work.
- Change models only after rerunning that task's tests and comparing the pass rate and cost.
- Record the model and effort with every run; the testers already do.
- Never put a model name on the site. Use the thinking level.
