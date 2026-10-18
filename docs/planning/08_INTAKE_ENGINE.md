# 08 · The intake engine: paste any link, get building blocks

**Date:** 2026-10-18
**Status:** proposed design. Nothing is built yet. The final plan (Part 5) carries the short version. Where they differ, the final plan wins.
**Question (Kevin):** paste in anything: a YouTube video or transcript, an Instagram reel, a Medium post, an article or a GitHub skill library. Can one engine turn it into prompts, skills, routines, workflows, agents and tools (calculators), show where each piece fits in what we already have, and then publish it? And how does that engine become a production-grade system?
**Short answer:** yes. One engine takes any source through nine stages:
1. Drop in.
2. Read it, with Gemini watching anything that's a video.
3. Run the safety check.
4. Break it into **idea cards**: one piece of know-how each.
5. Match each card to our map of jobs, ladders and workflows.
6. Decide what each card becomes.
7. Write a one-page **intake report** that you tick.
8. Build what you ticked through the normal 12-step pipeline.
9. Publish it, with credit.

Most cards improve a listing we already have. Some become new listings. Any card with a formula becomes a mini tool. The library gets richer with every source.

This replaces "skills from the internet" as a separate pipeline. Imported GitHub skills become one kind of source going through the same engine. Its safety check and licence rule stay exactly as they were. It also does what `07_SOURCES_TO_SKILLS.md` described for our own learning guides, so **our own sources go through it first**: they carry no rights questions, which makes them a good test.

---

## 1. The nine stages

| # | Stage | What happens | Output | Who does it |
|---|---|---|---|---|
| 1 | **Drop in** | A link, a file or pasted text. One command: `/intake <link or file>`. Later, a form on the site. | an intake job | you |
| 2 | **Read** | A reader for each kind of source gets the content. Video and audio are watched or listened to by Gemini. | **source pack** | `intake-read` tool + Gemini |
| 3 | **Safety** | Everything is treated as data. Hidden instructions are flagged. Code goes through `scan-skill` in a sandbox. | safety notes in the pack | `scan-skill` + rules |
| 4 | **Break into ideas** | The source becomes small **idea cards**, each pointing to where it came from (timestamp, line or file). | `cards.json` | Claude (mid or top class) |
| 5 | **Match** | Each card is compared with our map: areas of work, jobs, ladders (steps 0–8), the ready-made workflows and every existing listing. | a match for each card | cheap model + search over the library index |
| 6 | **Decide** | The rules in section 4 pick what each card becomes, or say "improve listing X", "duplicate" or "park". | a proposed outcome for each card | Claude, using fixed rules |
| 7 | **Report** | One page: what we found, what each card becomes, where it fits, rights and effort. You tick what to build. | `report.md` | tool; **you decide** |
| 8 | **Build** | Ticked cards go through the 12-step pipeline (final plan, Part 12). Mini tools go through `build-mini-tool`. | listings | factory tools + helper agents |
| 9 | **Publish and share** | The listing goes live with credit to the source. A board post, a newsletter line and, where it fits, a short video. | live listing | site + you |

**Nothing goes live without your tick in stage 7 and the tests in stage 8.**

---

## 2. What you can drop in

| Source | How we get it | What reads it | Rights label |
|---|---|---|---|
| **YouTube video** | The link. Gemini can read a public YouTube video straight from its link (picture and sound). We also pull the captions where they exist. | Gemini (Pro for long videos, Flash for short ones) | Ideas only. We never republish the video, frames or transcript. |
| **YouTube transcript** | Pasted text | Claude | Ideas only |
| **Instagram reel, TikTok** | **Not at the start** (decided 18 Oct). We begin with links, GitHub, transcripts and articles. Video files can come later, never through scrapers or logins. | Gemini (Flash), later | Ideas only |
| **Article, blog, Medium post** | The link. We keep only the readable text. If it's behind a paywall, you paste the part you can read. | Claude | Ideas only |
| **GitHub repo or skill library** | Downloaded into its own empty folder at one pinned version, read-only, never run outside a sandbox. One repo can hold dozens of skills. Each one gets its own card set. | `scan-skill` + Claude | Licence rule (Part 5): only open licences are copied |
| **X or LinkedIn post, thread** | Pasted text (no scraping) | Claude | Ideas only |
| **Podcast or audio** | A file or a public link | Gemini | Ideas only |
| **PDF, slides, docs** | A file | Claude (Gemini for scanned pages) | Depends: our own, open licence, or reference only |
| **Course or purchased material** | A file | Claude | **Reference only** (decision 9). Never copied, and private input only. |
| **Our own sources** | Creative Engine learning guides, playbooks, our own docs, from read-only copies | Claude | Ours: no limits beyond client data |
| **Client data (Gehna and others)** | **Never.** The engine refuses it. Patterns are only ever taken by hand, as now. | none | none |

---

## 3. The two files the engine makes

### 3.1 Source pack: everything we know about the source (private)

- **Who and where:** title, creator, link, date published, date fetched, and the pinned version for code.
- **Rights:** the label from the table above, plus the licence if there is one.
- **Content:**
  - for text, the clean text with line numbers
  - for video, a timestamped transcript, on-screen text and short descriptions of what's shown at each step
  - for repos, the file list and the skill files
- **Safety notes:** hidden instructions found, scripts found, links found.
- **Cost:** tokens and dollars spent reading it.

The raw download and the full transcript stay **private and out of git** (`intake/*/raw/`). They're kept only so cards can point back to them and a person can check.

### 3.2 Idea cards: one piece of know-how each

| Field | Meaning |
|---|---|
| `kind` | method (steps), prompt, formula, checklist, rule or threshold, example, pitfall, tool tip, schedule, chain (several jobs in order) |
| `summary` | in our own words, one or two lines |
| `detail` | the steps, the formula or the checklist, in our own words |
| `from` | the timestamp, line or file it came from, so credit and checking are exact |
| `needs` | inputs, tools and access it needs |
| `confidence` | how sure we are we read it right. Low confidence goes to a person. |
| `claims` | any number or result the source claims ("doubled our sales"). Kept as "they say", never repeated as fact. |

**Rules:**
- A card must be something someone can **do**.
- A card that points to nothing in the source is deleted. That's how we stop the engine inventing things.

---

## 4. What each idea becomes

The engine asks these questions in order. The first "yes" wins.

| If the idea… | It becomes | Example |
|---|---|---|
| …adds a tip, a pitfall, a step or a check to something we already have | **an improvement to that listing**, credited in its notes. This is the most common outcome. | a new hook rule added to the hook-writing skill |
| …is the same as something we have | **a duplicate**: skipped, or linked as "also see" | |
| …takes numbers in and gives a number out | **a mini tool** (Part 6), built five ways from one formula file. Anyone can download it and change the maths. | "price × margin × repeat rate → what a customer is worth" |
| …is a prompt you'd paste once | **a prompt** | "write 10 hooks from these reviews" |
| …is a method with steps, inputs and a checklist that you'd repeat | **a skill** | a review-mining method |
| …should happen on a timer or a trigger | **a routine** | "every Monday, pull last week's ads into a sheet" |
| …chains several jobs | **a workflow**, or a new stage in one of the six ready-made workflows | research → angles → scripts → ads |
| …needs judgement across many steps, with tools and approvals | **an agent** (Expert level; built from May 2027 with red-team tests) | an ad account watcher that proposes changes |
| …explains how to do a task in a tool | **a how-to guide** or a note in a **tool guide** | "set up a Gemini Gem" |
| …doesn't fit anything yet | **parked** with a gap label, so repeats show where demand is | |

**Ladder check:** the same idea often appears at several ladder steps. The engine says which step this source covers and which steps are still missing for that job. For example, "the source shows step 1 (ask); we already have steps 2–4".

---

## 5. The intake report: what you see

The following is an illustration of the layout only, not a real video:

> **Source:** "How we price our bundles" · YouTube · 18 min · creator and link
> **Rights:** ideas only · **Safety:** clean · **Cost to read:** shown in dollars
> **Found:** 14 idea cards
>
> | # | Idea (our words) | Becomes | Where it fits | New? | Effort |
> |---|---|---|---|---|---|
> | 1 | Bundle price = sum of items minus a discount set from margin | Mini tool: bundle price check | Offers · ladder step 1 | New | S |
> | 2 | Test the bundle on returning buyers first | Improve "offer test plan" skill | Offers workflow, stage 3 | Improve | S |
> | 3 | A prompt to write bundle names | Prompt | Offers | New | S |
> | 4 | Same as our deal comparer | Duplicate | | Skip | |
> | … | | | | | |
>
> ☐ build 1 · ☐ build 2 · ☐ build 3 · ☐ park the rest

**Rules for the report:**
- You only ever tick. The engine never publishes on its own.
- Each source's report is saved, so we can see which sources were worth reading. That tells us which creators to follow.

---

## 6. Rights rules (plain version)

- **We take ideas, not words.**
  - Videos, transcripts, articles and posts belong to their creators.
  - We write every card in our own words. We never publish their video, frames, transcript or long quotes.
  - Ideas themselves are free to use, but we **credit and link anyway**: "Idea from *creator*, *link*".
  - Credit is fair, and it's how creators come to like us.
- **Code and skill text:** copied only under the licence rule (Part 5). Everything else gets a review page that links out.
- **Course and purchased material:** reference only (decision 9). **Client data:** never.
- **Claims stay theirs.** A number from a video ("3× return") is never repeated as a fact. If a mini tool uses it, it's a labelled example the user can change.
- **Take-down:** if a creator asks, their credit or the listing is changed or removed within 48 hours. *(Proposed)*
- This isn't legal advice. Before creator uploads or anything paid, a lawyer reads the rules once.

---

## 7. Safety rules

1. **Content is data, never orders.** Text in a video, article or repo that tells the AI to do something is flagged and ignored. We test this with trap sources: 10 poisoned articles and videos, added to the 20 trap skills.
2. **Downloads go into a new, empty folder.** Nothing downloaded is ever run outside a sandbox. Scripts run only with no secrets and no network unless the test needs it.
3. **No logins and no scraping.** The engine never signs in to Instagram, TikTok or X, and never gets round a paywall.
4. **Secrets never enter the engine.** Model keys come from this repo's `.env`, which you fill in. Sources never see them.

---

## 8. Models and cost (four labs, no router)

| Job | Model class | Lab |
|---|---|---|
| Watch video, listen to audio, read scanned pages | C1 for reels, C2 for long videos | **Gemini** (Flash or Pro) |
| Break into idea cards; decide what each becomes | C2/C3 | **Claude** |
| Match cards to the library; spot duplicates | C1 | **DeepSeek** or Gemini Flash |
| Check the cards against the source (blind) | C2 | **GPT**, because the judge never wrote the work |

**Cost** *(Assumption, measured in the first 10 runs)*:
- a few cents for a reel or an article
- well under $1 for a 20-minute video read at low resolution
- the $2-per-run cap (decision 2) stops anything bigger

Every source's cost goes in the cost ledger and on its report.

---

## 9. From first version to production

### v0 · On your machine (December)
- **What it is:** a `/intake` command in this repo plus four small TypeScript tools.
  - `intake-read`: one reader for each kind of source
  - `intake-split`: idea cards
  - `intake-match`: matching and deciding
  - `intake-report`
- **Where things go:** each source gets `intake/<date>-<slug>/` with `source.json`, `cards.json` and `report.md`. Raw files are git-ignored.
- **Who runs it:** you, or Claude.
- **First runs:** our own learning guides first, then 10 public sources.
- **Test set for the engine itself:** 10 sources with the cards we expect, marked by hand.

### v1 · Always on, just for us (February–March 2027)
- **An inbox:** paste a link into a private page, or forward it by email. It goes into a queue, a worker runs the stages, and the report lands in a review list.
- **Each stage saves its output.** If something fails, it restarts from the last finished stage, not from the beginning. Retries and timeouts are built in.
- **The same link or the same content is only read once.** The engine checks a fingerprint of each source.
- **Spend caps for each source and each day,** and an alert when a job fails or stalls.
- **A library index** (search over every listing) so matching stays fast as the library grows.
- **Re-runs:** when a big model ships, the engine's test set is re-run before we switch.

### v2 · Public "suggest a source" (from April 2027, with site v1)
- Anyone can suggest a link. It goes through the same engine and the same review queue. The person who suggested it gets credit on the listing.
- Later, creator uploads use the same safety stages (site v3).

### What "production grade" means here

| Area | The rule |
|---|---|
| **Accuracy** | Every card points to its place in the source. Zero invented cards on the test set. At least 8 in 10 of the expected cards found. You agree with what a card becomes at least 8 times in 10. *(targets: Assumption)* |
| **Safety** | All trap sources caught before v1. Content is data. Sandbox only. |
| **Cost** | Logged for every source and capped for each run and each day |
| **Reliability** | Restarts from the last stage. Nothing lost on failure. Alerts on stalls. |
| **Versions** | Every card and listing records the source version and engine version it came from |
| **People** | A person ticks every build and reads every safety flag. Agents propose; people approve. |
| **Rights** | Our own words, with credit and a link. Raw files private. 48-hour take-down. |

---

## 10. Where it fits in the schedule

| When | What |
|---|---|
| Week 2 (26 Oct – 1 Nov) | Intake engine specified, alongside `scan-skill` and `build-mini-tool` |
| Weeks 5–7 (16 Nov – 6 Dec) | v0 for text, articles and repos. First run on our own learning guides. |
| Weeks 8–9 (7–20 Dec) | Video and audio through Gemini. The first 10 public sources, including the first 5–10 GitHub skills, already in the plan. |
| Gate A (11 Dec) | 5 sources through the engine with reports. Trap sources caught. |
| Gate B (19 Jan) | 20 sources through the engine. Every listing built from them credited. |
| Feb–Mar 2027 | v1, always on. About 15 sources a week, the same pace as "imports at scale". |
| Apr 2027 | v2: public "suggest a source" |

---

## 11. Decisions needed

- ~~Decision 13 · video from Instagram and TikTok~~ Dropped 18 Oct: no reels or TikToks to start. Decision 13 is now votes, stars and kits.
- The licence rule (decision 4) and course terms (decision 9) apply unchanged.

---

## 12. Files

| Path | What |
|---|---|
| `tools/intake/` | The four intake tools (from Week 5) |
| `intake/<date>-<slug>/source.json` | The source pack, without raw content |
| `intake/<date>-<slug>/cards.json` | The idea cards |
| `intake/<date>-<slug>/report.md` | The intake report you tick |
| `intake/*/raw/` | Downloads and full transcripts: **git-ignored, private** |
