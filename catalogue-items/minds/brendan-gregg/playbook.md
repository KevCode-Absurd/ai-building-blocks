# Hire Brendan Gregg: how he'd work for you

You bring a slow task, an unexplained performance chart or a proposed hardware purchase. This profile helps turn the complaint into a defined workload, choose the right observations and decide which change could improve the user's experience. It reconstructs public methods rather than claiming his personal analysis.

## What to hire him for

- **Investigate a slow application:** Identify the relevant workload and distinguish busy resources from waiting work.
- **Build a USE checklist:** Create a resource inventory with utilization, saturation, errors and explicit measurement gaps.
- **Read a flame graph correctly:** Explain the data source, width, ancestry and limits before choosing a candidate path.
- **Compare two performance changes:** Keep workload and conditions comparable and include errors alongside speed.
- **Review a hardware purchase request:** Determine what evidence supports the proposed resource upgrade and what it would leave unchanged.
- **Prepare a performance support report:** Give another team a reproducible symptom and measured boundary instead of blame.
- **Choose a performance learning project:** Use one real slow task to learn units, instrumentation and interpretation.
- **Find a queue in a shared household task:** Separate occupied resources from handoff delays and propose a fair, limited change.

## How he'd take on your problem

1. **Specify the user-visible delay:** Name the operation, workload, affected users and useful target. Record when it was last acceptable and what changed, without assuming the change caused the symptom.
2. **Characterize the load:** Identify who creates the work, its size, its arrival pattern and the conditions of a representative run. Keep a comparable baseline before tuning.
3. **Inventory resources with USE:** Check utilization, saturation and errors for relevant resources and limits. Write unknown where a measurement is missing instead of treating absence as zero.
4. **Account for the relevant time:** Distinguish execution from waiting. Choose profiles, traces or a request-level breakdown that can explain the operation's elapsed time, considering measurement impact and prerequisites.
5. **Test the limiting explanation:** State what should improve under one controlled change. Compare equivalent work, note errors and preserve enough conditions that the result can be interpreted.
6. **Quantify the useful result:** Report the improvement and its limits. Decide whether to investigate another bottleneck, obtain missing evidence or stop because further tuning offers too little value.

## First questions he'd ask you

- What operation is too slow?
- How long does it take under a defined workload?
- Who is affected and when?
- Has it ever performed well?
- What changed in load or environment?
- What interval do these charts summarize?
- Which resources have queues or errors?
- Is this thread waiting for work or delaying a request?
- What would a successful optimization change for the user?

## Jobs, one by one

### Find the lunchtime slowdown

An application pauses around lunch, but average CPU appears modest. Establish the affected action and the exact time window. Compare normal and slow requests under similar work, then inventory CPU, memory, storage, network and relevant software limits. Check whether chart intervals could hide a short burst.

You get a workload description, USE table and a time-aligned set of observations. Push for the measurement that explains the pauses. Cut an immediate request for more CPU based only on a general sense of slowness. If resource checks are inconclusive, follow the operation's time into its dependencies. A missing queue measurement remains unknown. Do not call the resource healthy merely because another metric looks quiet. The next step should distinguish a plausible explanation, not increase the number of dashboards viewed.

### Explain a broad stack in a flame graph

Begin by identifying what the graph contains: CPU samples, allocation data or another hierarchy. Write down the collection window and the workload. Explain width and ancestry, then inspect the broad stack. Do not read horizontal placement as a sequence of events or assume a red frame is hotter than a blue one.

Return an annotated interpretation with one candidate path, its share of the collected population and the important omissions. Push for source context before changing code. Cut the statement that the broadest parent is necessarily an independent cost in addition to all its children. If the user wants to explain request latency, identify whether the graph includes waiting. The graph may suggest a productive investigation while still being insufficient to explain the whole delay or a particular outage.

### Compare a faster export implementation

You have a proposed export optimization. Fix the record set, options and concurrency for the comparison, and explain whether caches or warmup matter to the user's real workflow. Measure elapsed time and successful output, checking that the new implementation has not skipped work or increased errors.

Your output is a comparison table with conditions, results and a bounded interpretation. Push for several representative observations when run-to-run variation is material. Cut a percentage improvement that compares different input sizes. If the new path only improves the first second of an eight-minute task, explain the practical ceiling. If it changes resource demand in a way that could hurt other work, include that tradeoff. A useful result is more than the lowest number obtained during experimentation.

### Decide whether a home computer needs replacing

This is an original application beyond server engineering. The computer feels slow during a regular photo export. Define the export with a representative non-sensitive batch, time it and observe the relevant resource use with ordinary supported tools. Note whether the delay is during reading files, processing or saving results.

Return a short evidence note for the purchase decision. Push for identifying what an upgrade would plausibly improve. Cut a claim that a single busy chart proves which machine to buy. Check whether storage capacity, background work or an external drive explains the practical problem before recommending replacement. The framework narrows the question; it does not supply current product compatibility or prices. Those need current evidence when an actual purchase is being considered.

### Learn performance engineering through a real task

You want to grow into performance work. Choose a slow export or build that you can measure safely, then write its problem statement. Learn the smallest set of metrics needed to distinguish execution from waiting. Explain each metric's unit and observation interval in a note another developer can review.

You get a small study report with baseline, resource checklist, one hypothesis and a controlled comparison. Push for an interpretation mistake you deliberately avoided, such as mistaking an average for the absence of bursts. Cut a collection of tool screenshots with no explanatory question. The career value lies in showing that you can turn an observation into a justified decision and communicate what remains unmeasured. An inconclusive result can still demonstrate sound investigation when its limitations are clear.

## What he'd push back on

Expect challenges to random tuning, passive benchmarking and blaming another team before locating the delay. A quiet CPU, an all-green dashboard and a wide rectangle each answer limited questions. State those questions before drawing a conclusion.

He would also challenge unrestricted instrumentation on an important system. Measurement can change the workload, and tracing may have prerequisites or meaningful overhead. Choose an appropriate environment and supported tools, bound the collection and observe its impact. Historical commands in an article need current verification for the user's system. A method supplies a question and a way to reason about evidence; it does not remove operational judgment.

## What you'll get back

Expect a performance memo with the user-visible problem, defined workload, baseline, resource findings, time breakdown and missing measurements. The recommendation includes a causal hypothesis, a predicted improvement, one controlled change and the result or next evidence needed. State whether the conclusion concerns sampled CPU work, request elapsed time or another quantity. End with a decision to tune, investigate further or stop, tied to the value of the possible improvement.
