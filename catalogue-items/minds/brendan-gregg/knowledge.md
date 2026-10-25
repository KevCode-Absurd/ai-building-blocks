# Brendan Gregg: what he knew and believed

Built from public sources, last checked 2026-10-23. Tagged statements concern the public record. All example workloads, investigation sheets and numerical scenarios are written by us.

## In one paragraph

Brendan Gregg's official biography identifies his work in computer performance, his books Systems Performance and BPF Performance Tools, and his development of tools, methods and flame graphs. The current page was reviewed for living status; no birth year is asserted. [S1] His practical contribution is to replace random tuning with an investigation that starts from a performance problem and asks what evidence would explain it. His USE method checks utilization, saturation and errors for resources; his wider methodology page offers other approaches for different problems. [S2][S3] His material on off-CPU analysis and flame graphs supplies important interpretation boundaries: running time differs from waiting time, and a graph of aggregated stacks is not a timeline. [S4][S5] This profile helps make a slow task measurable before choosing a fix.

## Core ideas

### 1. Start with the problem and workload

Gregg's methodology page asks what makes someone believe there is a performance problem, whether the system once performed well, what changed and whether degradation can be expressed as latency or run time. It also separates characterizing who causes load, what the load is and how it changes. The page labels random tuning and dashboard-only reasoning as inadequate approaches. [S3]

Our original example is “the weekly export is slow.” Replace that with a specific statement: the same type of export takes eight minutes for an ordinary week's records, compared with three minutes last month. Record record count, options, concurrency and the user's relevant deadline. The investigation sheet should distinguish a larger workload from slower processing of the same work. Without that distinction, a faster result might merely mean fewer records were exported. A clear problem statement also prevents a team from optimizing a component nobody is waiting for.

### 2. Inventory resources before choosing favorite metrics

The USE method starts with resources, then asks about utilization, saturation and errors. Gregg defines saturation as extra work a resource cannot currently service, often visible as a queue. His examples include physical resources and possible software-imposed limits. He cautions that the method is one part of a wider toolbox. [S2]

An application inventory might include CPU, memory capacity, storage I/O, network and the application's connection pool. For each, identify a measurement, its interval and whether it exists. Do not insert zero when a queue metric is unavailable. Mark it unknown and decide whether it matters to the next investigation. The original output is a checklist whose empty cells have meaning. It is more useful than collecting every available chart because it shows which questions have actually been answered and which merely look reassuring.

### 3. Long averages can conceal short trouble

In his USE explanation, Gregg describes a case where five-minute CPU averages hid periods of full utilization lasting seconds. Low average utilization did not exclude a relevant burst of saturation. He also notes that errors can impose performance costs through retries or degraded resources. These are reasons to match observation to the symptom rather than treating a single average as complete evidence. [S2]

Our example is a page that pauses at the top of each minute. A whole-hour chart may show modest load while the pause coincides with a short batch. Collect measurements at a resolution appropriate to the event, preserving timestamps so the application symptom and resource observation can be compared. Record whether the pause actually coincides with the burst on repeated occasions. A correlation is a useful lead, not proof. The next experiment should test the proposed connection, perhaps by moving a safe test batch in a non-production setting.

### 4. Quiet CPU does not mean nothing is delaying the task

Gregg's off-CPU material distinguishes threads executing on CPU from threads waiting while blocked, such as for I/O or locks. CPU sampling observes running work; complementary observation is needed for waiting time. The article also explains prerequisites, stack quality and measurement overhead, rather than treating tracing as free. [S4]

In our slow export exercise, the CPU profile contains little work during a long pause. Ask whether the relevant request waits for storage, a lock or another service. Also separate an idle worker with no task from a request blocked on its critical path. The resulting time budget should say which intervals belong to the user's operation. A trace full of sleeping workers can be visually dramatic while explaining little about the export. Identify the request context before recommending a faster processor or a particular tracing tool.

### 5. Read a flame graph according to its encoding

Gregg describes flame graphs as visualizations of hierarchical data, originally created for stack traces. In a CPU flame graph, width represents how often a frame appears in the profile population; vertical position represents stack depth. The horizontal arrangement is not elapsed time, and the original random colors help distinguish adjacent frames rather than encode heat. [S5]

Our graph-reading exercise starts by writing the data source, sampling context and unit on the page. Identify a broad stack and explain its ancestry before proposing an optimization. A wide parent may include work in several children; counting each rectangle as an independent share double-counts the same stacks. Return an annotated interpretation with one candidate path and one measurement limitation. A CPU graph alone cannot show all time a request spent waiting. Its visual clarity should sharpen a question rather than create unjustified causal certainty.

### 6. Change the investigation when the question changes

Gregg's methodology collection recommends using several approaches and discusses the opportunity cost of spending too long on one performance problem. It includes time division, workload characterization, resource checks, profiles and active benchmarking. The collection is a toolbox, not a demand to run every method for every issue. [S3]

For our comparison exercise, define the time budget for investigation and what improvement would justify more work. If an expensive optimization can only remove a tiny part of the user's elapsed time, return that bound. If resource checks are inconclusive, move to a request-level time breakdown rather than repeatedly refreshing the same charts. The output is a decision about the next useful measurement or about stopping. “No justified tuning recommendation yet” is a valid result when the evidence identifies uncertainty rather than a fix.

## How he decides

The reconstructed approach asks what the user experiences, what work creates that experience, what resource or interval explains it and whether the proposed change can matter enough. This combines the opened methods; it is not presented as one official Gregg checklist. [S2][S3][S4]

An original decision memo can contain a baseline, workload definition, observation window, resource findings and the candidate explanation. Add a prediction for a controlled comparison. If storage waiting is the proposed limit, say what should change when that waiting is reduced and what should remain unchanged. Record throughput, latency and errors together where relevant, because completing more work by dropping requests would fail the user's goal. After a change, compare equivalent work and retain the test conditions. If the conditions differ, label the result exploratory rather than manufacturing a clean percentage improvement.

## Where he stood

His public materials favor methodical investigation and careful interpretation of measurements. The methods page begins by explaining why ad hoc metric inspection can become a fishing expedition. The USE page begins from questions and then seeks measurements, rather than starting with whatever dashboard is familiar. [S2][S3] The off-CPU discussion adds that instrumentation itself can impose load, so observation conditions belong in the interpretation. [S4]

Our transfer outside computing is a shared laundry task. Separate how long the machine is occupied from how long clothes wait for someone to move them. A larger machine cannot remove a handoff delay by itself. Record a few cycles, identify the queue and propose one scheduling change. This is a limited analogy about resources and waiting, not evidence that human behavior should be optimized like a processor. The output should respect household preferences and explain whose work increases under the proposal.

## Their work and record

The official biography identifies his books and his contributions to performance tools, methods and visualization. It also describes current work at OpenAI at the time checked; that appointment is not necessary to the techniques in this profile. [S1] The five opened sources are official explanations, including definitions and graph-encoding details, rather than summaries based solely on tool names. [S2][S3][S4][S5] Historical platform commands and version references in those pages are not treated here as current compatibility guarantees. When an actual tool is proposed, its prerequisites must be checked for the user's environment.

## Where he was wrong or criticised

No substantiated external criticism is established by the checked sources. There are important limits in his own presentation. USE does not solve every class of performance problem, and his personal estimates of its effectiveness are not universal experimental guarantees. [S2] Off-CPU tracing can introduce significant overhead in high-event-rate settings; useful analysis requires attention to impact and relevant request context. [S4]

Our application must therefore resist an impressive but irrelevant profile. A graph can be accurate for the collected samples and still omit the interval that annoyed users. A benchmark can reproduce and still represent the wrong workload. State those limits in the report. When the remaining bottleneck is outside your measurement boundary, request the missing evidence rather than turning an absence of data into an accusation against another team.

## Blind spots to watch

The profile is strongest at explaining computer resource use and elapsed time. Product priorities, accessibility, support obligations and organizational fairness require additional questions. A technically faster operation may not be the most valuable improvement. Keep the user's experience in the problem statement so the investigation does not drift toward whatever is easiest to graph.

In career learning, use a real slow task as a small study project. Learn the measurement needed to answer that question, explain its units and demonstrate one interpretation mistake you avoided. Do not collect a long list of tracing tools as a substitute for understanding. The final work should make clear what was measured, what was inferred and what another investigator would need to reproduce it safely.

## Short phrases on the record

No direct quotations are needed. The numerical examples and proposed investigation documents are original.
