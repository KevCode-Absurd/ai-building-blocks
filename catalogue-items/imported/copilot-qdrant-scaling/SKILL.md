---
name: qdrant-scaling
description: "Guides Qdrant scaling decisions. Use when someone asks 'how many nodes do I need', 'data doesn't fit on one node', 'need more throughput', 'cluster is slow', 'too many tenants', 'vertical or horizontal', 'how to shard', or 'need to add capacity'."
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Qdrant Scaling

First determine what you're scaling for:

- data volume
- query throughput (QPS)
- query latency
- query volume

After determining the scaling goal, we can choose scaling strategy based on tradeoffs and assumptions.
Each pulls toward different strategies. Scaling for throughput and latency are opposite tuning directions.


<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude or ChatGPT with web access:** They can open the linked Qdrant docs for sizing rules.
- **Grafana or Prometheus:** They show the memory, CPU and disk numbers that name the bottleneck.
<!-- /needs -->

## What you need

Ask once for anything not given:

- The scaling goal: more data, more queries per second (QPS), faster single queries, or fewer results per query. Pick one first, because throughput and latency pull in opposite directions.
- How many points (records) and what vector size.
- Traffic: queries per second now and the target, plus a latency target.
- Current machines: RAM, CPU, disk type, and whether it runs on Qdrant Cloud or your own servers.
- The number of tenants (customers sharing the data), if any (optional).

Open the linked file for the goal. If you cannot open it, work from this file and say so.

## What you hand back

1. Scaling goal and your numbers (use `MISSING` for anything not given).
2. Bottleneck: what limits you now, and the number that shows it.
3. Plan in order, with why each step comes now (vertical before horizontal for data volume).
4. Estimate: a rough memory figure from the sizing formula in the vertical scaling file, labelled as an estimate. Skip it if the point count or vector size is missing.
5. If more machines are needed: starting node, shard and replica counts from the horizontal scaling file.
6. First test: what to measure or load test before buying or scaling down, and the result to look for.
7. Avoid: the "What NOT to Do" items that apply.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Qdrant health monitoring planner](https://useaiblocks.com/skills/copilot-qdrant-monitoring). It takes the plan.
- The [Qdrant search relevance investigator](https://useaiblocks.com/skills/copilot-qdrant-search-quality). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing

Write `MISSING: <what>`. Never invent traffic, sizes or limits. Do not give a node count without data size and a goal. Remind the person to load test before scaling down.

## Scaling Data Volume

This becomes relevant when volume of the dataset exceeds the capacity of a single node.
Read more about scaling for data volume in [Scaling Data Volume](scaling-data-volume/SKILL.md)


## Scaling for Query Throughput

If your system needs to handle more parallel queries than a single node can handle,
 then you need to scale for query throughput.

Read more about scaling for query throughput in [Scaling for Query Throughput](scaling-qps/SKILL.md)

## Scaling for Query Latency

Latency of a single query is determined by the slowest component in the query execution path.
It is in sometimes correlated with throughput, but not always. It might require different strategies for scaling.

Read more about scaling for query latency in [Scaling for Query Latency](minimize-latency/SKILL.md)


## Scaling for Query Volume

By query volume we understand the amount of results that a single query returns. 
If the query volume is too high, it can cause performance issues and increase latency.

Tuning for query volume is opposite might require special strategies. 

Read more about scaling for query volume in [Scaling for Query Volume](scaling-query-volume/SKILL.md)
