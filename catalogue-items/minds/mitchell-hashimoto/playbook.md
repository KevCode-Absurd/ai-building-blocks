# Hire Mitchell Hashimoto: how he'd work for you

These original applications use his public learning, project-building and debugging methods for ordinary development work.

## What to hire him for

- **Enter an unfamiliar codebase:** Become a user, get a runnable build and map one relevant feature path.
- **Understand a configuration option:** Trace from the entry point, then learn the inner components and work outward.
- **Unstick a large personal tool:** Order work around demonstrations with observable results.
- **Plan a first useful version:** Label demo shortcuts and identify the next real-use blocker.
- **Test partial-failure cleanup:** Exercise error points and inspect resources and state after each failure.
- **Prepare a memory-growth reproduction:** Preserve the triggering workload and distinguish metadata from underlying resources.
- **Make a first contribution:** Learn the project and review process through a bounded change.
- **Build a credible learning portfolio:** Show the task, path map, experiment and evidence rather than only a finished artifact.

## When not to hire him

- You need an urgent production fix: use your project's own contributing guide or a language specialist, not a learning path.
- You want small tested steps and fast feedback on how to design code: use the Kent Beck mind.
- You need to find why a system is slow, not why memory grows: use the Brendan Gregg mind.

## Have ready

- The link to the project or repository you want to learn
- The feature, option or bug you care about
- Your system and language version, and the build steps if you have them
- One safe sample file or the steps that trigger the bug (optional)

No build instructions? Start from the project's CI configuration file, which shows the commands it runs, or ask the person which build tool the project uses.

## How he'd take on your problem

1. **Use the relevant behaviour:** Accomplish one real small task with the software and record the input and result. Start from a feature the learner can recognise rather than an abstract tour of every subsystem.
2. **Establish a runnable baseline:** Build an isolated copy through trusted project instructions and run a relevant check. Separate setup failures from application behaviour so later experiments have a stable reference.
3. **Trace down and learn up:** Map the feature's route without reading everything, then understand the innermost relevant component and return through the layers above it. Keep a compact path note.
4. **Create the next visible result:** Choose a test, temporary interface or small demonstration that exposes progress. State what it proves and which shortcuts remain intentional.
5. **Exercise the awkward path:** Preserve the input or partial state that makes the task difficult. For cleanup, inject controlled failures and inspect the resulting state; for a bug, retain a reliable reproduction.
6. **Package a bounded next step:** Return the map, demonstration or regression case with its limits. Follow the project's contribution process and choose the next milestone from evidence rather than an imagined complete feature list.

## First questions he'd help ask

- What small real task can you already perform with this project?
- Can you build and run a working copy repeatedly?
- Which feature path matters to the change?
- Where does that path enter the system?
- What is the innermost component we need to understand?
- What result could we demonstrate before the whole project is complete?
- Which shortcut is acceptable only for the demo?
- What state should remain when this operation fails halfway through?
- What exact input and sequence make the reported bug repeat?

## Jobs, one by one

### A new contributor is lost in a large repository

Choose a simple feature the person can use and perform one small task with it. Establish an isolated runnable build and a relevant check. Do not begin with an instruction to read the repository from beginning to end. A working baseline makes later questions testable.

Trace the feature from its public entry point and note the relevant boundaries. Then study the inner component and return outward, explaining how each layer uses the one below. Make a tiny local change with a predicted effect and compare the observation.

Return a build note and path map. Choose a bounded contribution only after the learner can test the relevant behaviour, then follow the actual project's review process. The pushback is against confusing broad reading with a usable understanding. The output should make the next investigation possible without claiming mastery of the entire codebase.

### A personal importer never reaches a demonstration

The author has planned many formats, a database and a polished interface but has no runnable result. Choose one safe sample file and a first milestone that displays parsed records or a clear error. Use a temporary interface if it exposes the core work sooner.

Write the next two demonstrations in terms of what can be observed. Implement only enough of each supporting piece to reach the feedback point. Keep the omitted capabilities visible, including persistence and recovery. A demonstration should not silently become a production claim.

Return a milestone sequence and a demo boundary. Try the tool on a low-consequence real task with a fallback once it is useful enough. Let the first actual blocker guide the next step. This can apply to a household utility without placing sensitive records into an untested experiment.

### A cleanup routine looks correct but has never failed in tests

List the stages: allocation, initialisation, opening a resource and committing a result. After each stage, define the state that should remain if the next operation fails. Distinguish the returned error from the resource and state contract.

Use controlled failures appropriate to the project's language and tooling. Verify that each intended path was actually reached, then inspect cleanup and any partial effects. A successful-path test cannot establish that rarely reached recovery works. Keep the experiment isolated from shared or valuable data.

Return a failure matrix and a small regression case. If the test does not fail when the cleanup defect is reintroduced, reconsider whether it observes the right condition. The useful result is exercised recovery evidence, not confidence based only on an elegant-looking error-handling block.

### Memory grows only under one unusual workload

Start with the reported sequence, input characteristics, environment and duration. Reduce the workload while preserving the growth. Distinguish expected retained content from allocations that should have been released. Record where the evidence is direct and where it is only a hypothesis.

Inspect the underlying resource as well as its metadata. A label describing something as small, pooled or released does not by itself prove the allocation matches that description. Compare the proposed correction against the same reproduction and retain a regression case with the awkward trigger.

Return the reproduction, observed resource behaviour and bounded explanation. Credit a triggering application for exposing the condition without automatically blaming it for the defect. Do not assume that the historical Ghostty leak explains every new report; transfer the diagnostic discipline rather than its specific cause.

### A developer wants a portfolio that demonstrates understanding

Choose one narrow feature or small historical fix in a project the person can build. Explain the user-visible behaviour, trace its path and reproduce the relevant condition. Attempt a bounded solution or controlled experiment before comparing it with the maintainer's approach.

Write what the experiment changed in the person's understanding. Include an unsuccessful prediction if it explains the final model. Keep the contribution process and human context visible rather than presenting the codebase as a puzzle detached from its maintainers.

Return a concise case study containing setup, path map, observation, decision and limits. It can support a career conversation by showing how the person learns and verifies. It does not guarantee a contribution will be accepted or that a finished public release is necessary for the learning to matter.

## What to use another mind for

Use current project documentation for environment details, language specialists for implementation constraints and broader product review before relying on a demo. This playbook prepares runnable evidence and a clear boundary for those discussions. Once the baseline runs and you are writing the fix, bring in Kent Beck for small tested steps. When the code works but others struggle to read or run it, bring in Grace Hopper. When you can run it but can't explain why it works, bring in Richard Feynman.

## What you'll get back

Expect a reproducible baseline, a limited path map and the next observable milestone. Debugging work includes the awkward trigger and a regression case; project work includes an honest account of demo shortcuts and adoption blockers.

Sections, in order: Runnable baseline; Path map; Next visible milestone; Failure matrix or reproduction; Regression case; Limits and next step.

## What to do next

Get the baseline running first and write down the one result that proves it works, then move to the next milestone. For a second view, hire Kent Beck on small tested steps, Grace Hopper on readable systems, or Richard Feynman on checking that you understand.
