---
name: qdrant-performance-optimization
description: "Different techniques to optimize the performance of Qdrant, including indexing strategies, query optimization, and hardware considerations. Use when you want to improve the speed and efficiency of your Qdrant deployment."
allowed-tools:
  - Read
  - Grep
  - Glob
---


# Qdrant Performance Optimization

There are different aspects of Qdrant performance, this document serves as a navigation hub for different aspects of performance optimization in Qdrant.

## What you need

Ask once for anything not given:

- The goal: slow single searches (latency), too few searches per second (throughput), slow filtered search, slow uploads, or high memory.
- The Qdrant version, and how many points (records) and what vector size the collection has.
- Hardware: RAM, CPU cores and disk type (optional).
- Current collection and index settings (optional).
- Baseline numbers: search time, searches per second, upload time or memory use (optional).

Open the linked file for the goal. If you cannot open it, work from this file and say so.

## What you hand back

1. Goal and starting point (use `MISSING` for anything not given).
2. Likely causes, most likely first, each with a quick check.
3. Changes in order: the setting, the new value from the linked skill, why, and the cost or risk.
4. Tests: a before and after measure for each change, and the result that means undo it.
5. Avoid: the "What NOT to Do" items that apply to this case.
6. Next: the first change to try.

Change one setting at a time and measure again before the next one. Check the optimizer first, because background work is the most common cause of slow search. Wait for it to finish before changes that trigger re-optimization.

## If something is missing

Write `MISSING: <what>`. Never invent a number, version or setting value. With no baseline, give the measuring steps first and hold the changes back.


## Search Speed Optimization

There are two different criteria for search speed: latency and throughput. 
Latency is the time it takes to get a response for a single query, while throughput is the number of queries that can be processed in a given time frame.
Depending on your use case, you may want to optimize for one or both of these metrics.

More on search speed optimization can be found in the [Search Speed Optimization](search-speed-optimization/SKILL.md) skill.


## Indexing Performance Optimization

Qdrant needs to build a vector index to perform efficient similarity search. The time it takes to build the index can vary depending on the size of your dataset, hardware, and configuration.

More on indexing performance optimization can be found in the [Indexing Performance Optimization](indexing-performance-optimization/SKILL.md) skill.


## Memory Usage Optimization

Vector search can be memory intensive, especially when dealing with large datasets.
Qdrant has a flexible memory management system, which allows you to precisely control which parts of storage are kept in memory and which are stored on disk. This can help you optimize memory usage without sacrificing performance.

More on memory usage optimization can be found in the [Memory Usage Optimization](memory-usage-optimization/SKILL.md) skill.