# Michael Feathers: what he knew and believed

Built from public sources, last checked 2026-10-23. Tagged passages describe the public record. Worked cases and suggested documents are original applications, not reports of his private client work.

## In one paragraph

Michael Feathers is the author of Working Effectively with Legacy Code, published in 2004, and the founder of R7K Research & Conveyance, according to his official biography. That current public author site was reviewed for his living status; no birth year is asserted here. [S1] His practical strength is changing code whose behavior is not yet well understood. In his essay on characterization testing, he separates discovering actual behavior from checking whether behavior is correct. That distinction lets a developer investigate a messy system without pretending to possess a reliable specification. [S2] His broader writing also examines how people learn from their first working environment, and how executable constraints can help evaluate generated output. The common working concern is what the surrounding system makes possible, rather than simply telling people to exercise more discipline. [S4][S5]

## Core ideas

### 1. Actual behavior and intended behavior answer different questions

Feathers's characterization essay begins with the difficulty of changing software whose intended behavior is unclear. A characterization test records what the code produces. It can reveal a surprising result without deciding whether the result is desirable. He recounts removing behavior he considered a bug, only to learn that users depended on it. [S2]

Our application is an old invoice report that puts a blank line before every customer name. Capture that output before deleting the line. Ask whether accounting imports depend on the separator, and inspect a sample export. The first artifact is an observation table: input, actual output and the consumer known to use it. A second column records the proposed desired behavior. Keeping both prevents a cleanup from quietly becoming a format change. It also lets the team discuss a genuine bug without treating preservation as a permanent moral duty.

### 2. Turn an unknown into an executable observation

In the essay's small text-formatting example, Feathers starts with a deliberately provisional expectation, runs it, sees the actual result, and updates the test and its name. The process builds understanding rather than deriving correctness from the test's initial guess. He describes curiosity about particular conditions as central to this work. [S2]

Consider a script that turns dates into filenames. Begin with one ordinary date and record the result. Then vary one relevant dimension: an empty value, a time near midnight or a value from an older file. Give each discovered case a name that describes the observed behavior. Do not merely label everything “works.” The original exercise produces a small behavior catalog whose entries another developer can run. It should also retain the environment and locale, because an observation without its conditions can become a misleading specification.

### 3. Find the place that makes isolated exercise possible

Fowler's account credits Feathers with the term seam and explains it as a place where behavior can vary without editing the place being varied. That account identifies testing, observation and replacement routing as uses. This is a reference to Feathers's concept, not a claim that Fowler's entire example came from his book. [S3]

An original case has a report class that opens a live database while being created. Before running it repeatedly, map what construction does. Identify whether supplying an already created reader, replacing a provider or extracting a calculation would make the desired behavior observable without the database. Write down the enabling point and the substituted dependency. The seam should solve a stated testing obstacle. If it exists only because abstraction sounds sophisticated, it may add more reading burden than it removes. Retain a separate integration check for the live path.

### 4. A behavior record is a starting point for negotiation

Characterization tests do not turn every old behavior into a requirement. Feathers explains that a surprising observation can lead to further tests, investigation or conversations with users. Context determines whether a result is a defect. [S2]

In our migration exercise, a report sorts equal totals in a seemingly random order. Record the current output, then discover whether anyone relies on that order for reconciliation. If the output comes from an unordered data source, the test should not assert an accidental order without discussion. The useful deliverable is a decision log that distinguishes stable required behavior, known defects approved for change and behavior still under investigation. This gives a reviewer a place to put uncertainty instead of forcing every surprising case into either “preserve forever” or “delete immediately.”

### 5. Early work environments teach what good practice looks like

Feathers's 2021 Gateway Teams essay argues that first experiences in an organization can shape expectations. He proposes introducing new hires through teams with strong technical practice and humane collaboration, then supporting them as they carry that experience elsewhere. This is his organizational proposal, not a universal causal law established by the essay. [S4]

A practical career application compares two first engineering roles. Ask to see how a newcomer fixes a small bug, how feedback is delivered and how changes reach users. Look for a real example of help during a difficult incident. A list of prestigious tools is weaker evidence of your likely experience than a concrete account of learning in the work. Your output is an interview question sheet and a comparison of observed practices. It should not assume that a troubled codebase implies unkind colleagues, or that a polished demonstration represents every team.

### 6. Independent constraints matter when generating code

In Generate from Constraints, Feathers questions using generated tests to validate code generated by the same process without checking what the expectations mean. He demonstrates supplying executable tests as part of a generation request, running them, then reviewing the design. His 2023 example also acknowledges that passing output may take a design direction he does not want. [S5]

Our application needs no model call. For a generated CSV parser already supplied by the user, write expected examples independently from the code: quoted commas, missing values and an explicit policy for malformed rows. Inspect whether the tests actually assert those requirements. Add a requirement the current implementation fails before trusting the suite. Return a requirements-to-check map and a list of untested cases. Passing chosen examples provides bounded evidence; it does not prove all input handling, security or production readiness.

## How he decides

Across these sources, a productive distinction is between understanding what exists, deciding what should exist and constructing the conditions that make either question answerable. Characterization addresses the first. User discussion and requirements establish the second. A seam or executable constraint can help with the third. This synthesis is our interpretation of the opened material. [S2][S3][S5]

For an original code-change plan, write the requested outcome at the top. Trace only the path needed for that change, noting side effects such as file writes, messages and external calls. Choose a boundary where the relevant output can be collected repeatedly. Establish a small set of observations before editing the behavior. A developer should be able to name what a failing check would mean. If a large snapshot changes in twenty places, break down the result before approving it. More recorded bytes do not automatically create a better explanation of the system.

## Where he stood

His characterization writing treats running systems as sources of knowledge that developers may lack, including behavior users have made useful. His Gateway Teams essay treats software work as a socio-technical setting where surrounding practices influence what people believe possible. [S2][S4] Together these support attention to the actual environment: the code that runs, the people who use it and the practices newcomers experience.

A narrow transfer to household administration is a fragile budgeting spreadsheet. Before replacing a formula, save representative inputs and outputs in a copy, note manual adjustments and ask the person who reconciles the bank statement what those adjustments mean. The exercise is about preserving knowledge, not declaring a spreadsheet financially correct. Return a change log and a way to compare the next statement. Use real household constraints to decide which awkward steps to preserve or remove.

## Their work and record

The official biography establishes his legacy-code book and work in software and organizational design. [S1] The opened essay on characterization dates from 2016; Gateway Teams dates from 2021; Generate from Constraints dates from 2023. They show distinct applications of his public thinking, without implying that historical examples describe current tools or all present views. [S2][S4][S5] This profile uses those readable essays and a credited account of seams. It does not claim to have read the complete book through a blocked preview.

## Where he was wrong or criticised

The checked material does not supply a substantiated external critique to repeat. There are limits worth making explicit. Characterization alone can faithfully preserve a defect. Generated output can satisfy the supplied tests while taking an unwanted design direction, which Feathers discusses in his own example. [S2][S5] Our application therefore separates regression evidence from a decision that a result is acceptable.

The gateway-team proposal also has practical costs that our use must examine. A strong team may lack mentoring capacity. A short placement may fail to expose the newcomer to difficult operational work. Those are questions for the organization to investigate, rather than facts this profile attributes to Feathers. Do not sell a cultural intervention as a guaranteed result. Ask what experience a new hire will actually receive and what support follows the transfer.

## Blind spots to watch

This mind is especially useful when the next change is blocked by lack of understanding or hard dependencies. It can be overused if every trivial edit becomes an extensive excavation. Set the investigation boundary by the risk of the requested change. Preserve the observation that matters rather than building a museum of every incidental detail.

Tests that require real customer secrets, live payments or destructive operations need a safer test setting. A seam can help construct one, but naming a boundary does not make it safe automatically. Ask an owner to confirm which effects remain live. Keep old behavior, desired behavior and evidence of coverage in separate parts of the answer so the implementer cannot mistake one for another.

## Short phrases on the record

No direct quotations are needed. The concepts above are paraphrased, and all worked scenarios are our own.
