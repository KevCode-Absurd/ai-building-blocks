---
name: "performance-profiler"
description: "Systematic performance profiling for Node.js, Python, and Go applications. Identifies CPU, memory, and I/O bottlenecks, generates flamegraphs, analyzes bundle sizes, optimizes database queries, runs load tests with k6 and Artillery. Always measures before and after. Use when investigating a slow endpoint, planning a performance budget, or hunting a memory leak in production."
---

# Performance Profiler

Find where an app wastes time or memory, rank the causes by measured impact, and propose one fix at a time. Works on Node.js, Python and Go apps. Always measure before and after. Never guess.

## Core Capabilities

- **CPU profiling**: flamegraphs for Node.js, py-spy for Python, pprof for Go
- **Memory profiling**: heap snapshots, leak detection, GC pressure
- **Bundle analysis**: webpack-bundle-analyzer, Next.js bundle analyzer
- **Database optimization**: EXPLAIN ANALYZE, slow query log, N+1 detection
- **Load testing**: k6 scripts, Artillery scenarios, ramp-up patterns
- **Before/after measurement**: establish baseline, profile, optimize, verify

## When to Use

- App is slow and you don't know where the bottleneck is
- P99 latency exceeds the target before a release
- Memory usage grows over time (suspected leak)
- Bundle size increased after adding dependencies
- Preparing for a traffic spike (load test before launch)
- Database queries taking more than 100 ms

## When Not to Use

- The app is slow only on its first start after a deploy (cold start). Look at the host's start-up settings instead.
- The question is how big a server or plan to buy. That is capacity planning, not profiling.
- The code is wrong, not slow. Fix the bug first, then profile.
- The user wants to load test a live production site. Refuse and ask for a staging copy with production-sized data.

## What You Need

Ask once, in one message, for anything missing:

1. The project folder, or the slow endpoint, page or query (paste the code or URL).
2. The language: Node.js, Python or Go.
3. What "slow" means: a number if they have one (for example "the page takes 4 seconds"). Optional.
4. A target, such as "under 300 ms at the 95th percentile". Optional.
5. Permission to run profiling tools and a safe place to run them (a dev or staging copy, never production).

## Steps

1. **Record a baseline.** Before any change, record P50, P95 and P99 latency, requests per second, error rate and memory use. If you cannot run anything, ask the user for numbers from their own monitoring and write `MISSING: baseline` where they are absent.
2. **Scan the project.** If you can run Python 3, run `python3 scripts/performance_profiler.py <project path>` (add `--json` for machine-readable output, `--large-file-threshold-kb 256` to change the size limit). It lists large files and dependency counts. If you cannot run code, read the project by hand for the same signs.
3. **Profile the right thing.** Pick from the recipes in `references/profiling-recipes.md`: CPU flamegraph for slow code, heap snapshots for memory growth, bundle analysis for a heavy page, EXPLAIN on a slow query, a k6 or Artillery script for load. Use realistic data volumes.
4. **Find the cause.** Name the line, function or query that costs the most. Show the evidence (the top of the flamegraph, the query plan, the biggest bundle chunk). Do not name a cause you have not measured.
5. **Rank the fixes.** Order by measured impact, biggest first. Start with the quick wins in `references/optimization-playbook.md` (missing indexes, N+1 queries, serial awaits that could run in parallel, heavy imports).
6. **Change one thing, then re-measure.** Apply or describe one fix, run the same measurement, and record the new numbers beside the baseline. If the change did not help, say so and undo it.
7. **Write the report** in the format below.

## Golden Rule: Measure First

Wrong: "I think the N+1 query is slow, let me fix it."
Right: profile, confirm the bottleneck, fix, measure again, verify the gain.

## Output

Return one report with these parts, in this order:

1. **Summary:** the slow thing, the main cause and the best fix, in three sentences.
2. **Baseline:** a table of P50, P95, P99, requests per second, error rate and memory. Mark unmeasured cells `MISSING`.
3. **Hot spots:** a table, ranked, with these columns: rank, location (file and line, route or query), cost type (CPU, memory, I/O, database, bundle), measured impact, suggested fix. Keep it to the top 10.
4. **Evidence:** the flamegraph summary, heap snapshot finding, query plan or bundle chunk list for each of the top three.
5. **Fix log:** for each change made or proposed: what changed, and a before and after table. Use the template in `references/optimization-playbook.md`.
6. **Load test:** the k6 or Artillery script, if one was asked for, and how to run it.
7. **Next steps:** the next fix to try, a test to add so the slowdown cannot return, and a performance limit to watch (for example `p(95) < 200ms` in k6).

## If Something Is Missing

- No way to run code: do the scan and analysis by reading, give the exact commands for the user to run, and ask them to paste the output back. Mark every number you did not measure as `MISSING`.
- Language not Node.js, Python or Go: say so, and offer general advice only, labelled as unmeasured.
- No target: report the numbers and suggest one, clearly marked as a suggestion.
- Never invent a timing, a percentage gain or a query cost.

## References

- [references/profiling-recipes.md](references/profiling-recipes.md): Node.js, Python and Go profiling commands, flamegraph generation, heap snapshots
- [references/optimization-playbook.md](references/optimization-playbook.md): before and after template, quick-win checklist (database, Node, bundle, API), common pitfalls, best practices
