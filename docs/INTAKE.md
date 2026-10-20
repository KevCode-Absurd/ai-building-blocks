# Intake: from a long source to a workflow and its skills

Started 2026-10-20. This builds the core of `docs/planning/08_INTAKE_ENGINE.md` for long sources: a detailed blog post, a video, a talk or a book.

## The idea

A long source usually teaches one job in several parts. Turning it straight into loose skills loses the order. So intake works in three passes:

1. **Skeleton.** Read the source and write down the steps it teaches, in order, as a workflow skeleton (`intake/<id>/skeleton.yaml`). Each step names the job it does, where in the source it comes from, its method in our own words, and what it reads and makes.
2. **Skills along the skeleton.** Each step gets a skill. If the library already has one that does the step, the step reuses it. If not, a new skill is written from that step's method.
3. **Finish the workflow.** Once every step has its skill, `tools/intake.mjs workflow <id>` writes the workflow from the skeleton, wired step to step. Its page lists every connected skill.

The same pipeline turns our own library into workflows. A skeleton whose source is `{title: "AI Blocks library", rights: ours, kind: other}` chains existing skills.

## Commands (repo root)

| Command | What it does |
|---|---|
| `node tools/intake.mjs check <id\|all>` | Checks a skeleton: fields, jobs, port types, minds, that each step reads something an earlier step made, and that a reused skill really takes and makes those types. Lists the skills still to write. |
| `node tools/intake.mjs todo <id>` | Prints the missing skills as tab-separated lines a skill writer can work from (the same columns as the skill writer brief). |
| `node tools/intake.mjs workflow <id\|all>` | Writes `catalogue-items/orchestrators/<slug>/` (item.yaml, SKILL.md) and a draft page in `tools/orchestrator-pages/<slug>.yaml`. It won't touch a workflow written by hand (no `generated_from:` line), or a page whose `draft_from:` line was removed after polishing. |
| `node tools/intake.mjs list` | Every skeleton, with how many of its skills exist. |

## Skeleton format

```yaml
id: the-mom-test                       # same as the folder name
source:
  title: "The Mom Test"
  by: "Rob Fitzpatrick"
  url: "https://www.momtestbook.com/"  # optional
  kind: book                           # book, blog, video, talk, podcast, letter, course, paper, other
  rights: ideas-only                   # public-domain, open-licence, ideas-only, ours
minds: [rob-fitzpatrick]               # roster slugs whose work this is (optional)
workflow:
  slug: find-out-if-your-idea-is-worth-building
  name: "Find out if your idea is worth building"   # the outcome, never a person
  summary: "Give it your idea. Get who to talk to, what to ask, and a keep, change or stop call."  # 22 words or fewer
  when: "you have an idea and want to know if it is worth building before you spend on it."      # completes "Use when ..."
  job: test-an-idea                    # a site job (lint-pages JOBS)
  level: beginner
steps:
  - name: Pick who to talk to first
    skill: first-customer-group-picker # existing slug, or the slug of the skill to write
    job: research                      # item.yaml job word
    task: test-an-idea                 # site job for a new skill (optional, defaults to the workflow's)
    from: "Chapter 7"                  # where in the source: chapter, timestamp, section
    method: ["...", "...", "..."]      # 3 or more steps, our words
    inputs: [brief, persona!]          # type ids from _types.yaml; ! means optional
    outputs: [shortlist]
    note: "What this step does with the step before."
  - pause: "Have five to ten conversations and write notes after each one."   # a human step; the next step starts fresh
```

## Rules

- **Our words.** A skeleton is notes in our own words. The source itself stays in `mind-sources/` or `intake/*/raw/`, both kept out of git.
- **Every step does a job,** and every step after the first (or after a pause) reads something an earlier step made.
- **Names are jobs, not people.** People go in `minds:`, and the site shows them as "Who can help with this".
- **Nothing goes live without the checks:** `intake.mjs check`, `lint-pages.mjs`, the site build and the e2e suite.

## Running it on a new source

1. Put the source in `intake/<id>/raw/` (private), or point at a mind's folder in `mind-sources/`.
2. A helper writes the skeleton, and you run `check`.
3. `todo` lists the skills to write. Skill writers follow `BRIEF-SKILLS` with those lines.
4. Run `workflow`, polish the draft page and remove its `draft_from:` line.
5. Rebuild the site index. The workflow page shows the steps, each linking to its skill, and each skill page lists the workflows it's part of.
