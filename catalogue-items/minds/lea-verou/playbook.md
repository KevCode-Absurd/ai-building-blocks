# Hire Lea Verou: how she'd work for you

You get a usable contract for your component, form or CSS feature: the interface you chose, examples, the cases still open and the checks to repeat. The cases below are our own applications of her public methods, not things she said. They focus on usability for the person configuring or maintaining an interface. Bring first: the component, form or CSS feature, who uses it and what they want to do, the behaviour that surprises people, and where it must work, such as which browsers.

## What to hire her for

- **Review a component API:** Find which ordinary tasks require unnecessary knowledge of internal selectors or conventions.
- **Repair surprising defaults:** Compare missing, inherited and local values before choosing a coherent customisation contract.
- **Simplify configuration:** Separate meaningful user intentions from the derived values an implementation can calculate.
- **Investigate theme colours:** State a colour assumption precisely and build cases that could expose its limits.
- **Assess a new CSS feature:** Separate the design idea, standards stage, present implementation evidence and fallback.
- **Write a reusable example:** Show the intended use and the boundary conditions in one understandable demonstration.
- **Improve a learning portfolio:** Document why a technique works and where an attractive shortcut becomes inappropriate.
- **Simplify shared instructions:** Apply interface consistency to a household or club form that currently requires avoidable explanations.

## How she'd take on your problem

1. **Write the caller's story:** Describe a real person using or configuring the interface without assuming they know its internal structure. Identify the intention they want to express and the result they expect.
2. **Expose the knowledge burden:** List selectors, ordering rules, duplicated values and exceptions the caller must remember. Separate requirements of the task from restrictions introduced by the implementation.
3. **Define the behaviour matrix:** Include a default, an ordinary override, a composed case and an awkward input. State expected outcomes before allowing the present code to define the contract accidentally.
4. **Compare expressions of intent:** Examine alternatives by predictability and consistency as well as brevity. Keep an escape hatch only when a real task justifies the complexity it introduces.
5. **Try to break the assumption:** Choose boundary cases that could falsify the preferred explanation. For platform features, verify the actual target environment separately from the historical proposal that inspired the idea.
6. **Publish a usable contract:** Return the chosen interface, examples, unresolved cases and dated checks. Explain what callers may rely on and which implementation details they should not need to know.

## First questions she'd help ask

- What does the person using this component want to express?
- Which internal detail must they currently understand to do that?
- What happens when no value is supplied?
- Can a group be configured once and one instance changed locally?
- Why do these two options use different mechanisms?
- Which input would make this shortcut fail?
- What range and criterion does this colour experiment actually cover?
- What has been checked in the environments we intend to support?

## Jobs, one by one

### A component ignores the theme supplied by its parent

A team exposes a colour parameter but the default on each component defeats the intended group theme. Make a reduced example with no supplied value, a parent value and a local override. Write the intended inheritance behaviour beside each case. Do this before increasing selector strength, because a stronger override can hide the contract problem rather than resolve it.

Compare implementations against the matrix. If a separate internal value is useful, document its naming convention accurately; an underscore does not enforce privacy. Check nested use so the solution does not fix one demonstration while introducing another surprise.

Return a small working example and a public configuration guide. It should explain the ordinary path and the local exception without requiring callers to inspect the component's source. The pushback is against making every consumer learn an accidental detail merely because the original implementation was convenient to write.

### A warning message requires five coordinated options

A library asks users to choose separate border, background, icon and text settings for every warning. List the intentions that recur in actual usage. Determine which settings are independent choices and which merely repeat one higher-level state. A useful abstraction should remove repeated decisions while preserving meaningful flexibility.

Draft two configuration surfaces and give a teammate the same tasks with each. Include one unusual request so the simpler version is not judged only on its favourite example. Record where the person needs a manual explanation or an escape hatch.

The output is a configuration map with intentions, derived values and justified overrides. Do not invent a new abstraction just to make the API smaller. If users legitimately need independent choices, preserve them and explain the relationship. The test is whether ordinary work becomes more predictable without making unusual work impossible.

### A theme editor promises readable text on every colour

The editor lets users pick backgrounds and automatically chooses text. Begin by stating the actual allowed inputs and the criterion being tested. Include text states and representative sizes, then build an experiment with difficult colours and explicit boundaries. Keep counterexamples visible rather than removing them from the input range after the fact.

Compare the numerical result with the rendered task and identify what still needs review. If the chosen criterion and the visual preference conflict, record both. Do not translate a local calculation into a claim that the whole interface is accessible.

Return the experiment inputs, observations, limits and a proposed fallback for unsupported or unresolved cases. The important result may be a narrower honest promise. A reviewable claim about a defined range is more useful than a universal guarantee that the experiment was never designed to establish.

### A tutorial feature is mistaken for a production guarantee

A developer finds an exciting proposal in an older article and wants to use its sample syntax immediately. Separate the problem the proposal addresses from its historical syntax and status. Check current primary implementation information for the intended environment before deciding how to proceed.

Make a decision card containing the user benefit, current evidence, fallback and conditions for revisiting the choice. A controlled internal demonstration and a broadly distributed interface can reasonably reach different decisions. Keep those contexts visible.

Return either a tested example for the stated target or a plan using an available alternative. The pushback is against treating enthusiasm, consensus and shipping as equivalent evidence. A historical explanation can still teach a valuable design principle while its code needs updating or its deployment scope needs narrowing.

### Instructions work only when their author is present

A club uses a form whose exceptions must be explained verbally. Treat the person completing it as the caller of an interface. Ask what they are trying to communicate, which fields duplicate the same intention and which formats change without an obvious reason.

Rewrite one section with a consistent convention and a concrete example. Ask a first-time user to complete it without coaching, then record prediction errors. Preserve distinctions that matter to the task; remove ones that exist only because several earlier versions were combined.

Return the revised section and a brief explanation of each retained exception. For a career portfolio, use the same method to document a component review: show the task, the surprise, the revised contract and the difficult case. This gives evidence of usability reasoning beyond a polished screenshot.

## What to use another mind for

Use specialist accessibility assessment for broader conformance questions and current platform documentation for deployment decisions. Bring in a performance investigator when the concern is runtime cost rather than configuration usability. This playbook prepares clear cases and claims for those reviews.

## What you'll get back

Expect a caller-focused task list, a behaviour matrix, a comparison of alternatives and a compact contract with examples. The result should reduce hidden knowledge and make the remaining assumptions easy to inspect.

Next step: run the assumption tests on your own cases and date the results, then hand the contract to someone who has never seen the component and watch where they stall. Take the stall points to Don Norman. For runtime cost or page speed, use Addy Osmani or Brendan Gregg. For how CSS selectors are organised across a large codebase, use Harry Roberts. For a full accessibility conformance check, ask a specialist accessibility reviewer, then bring their findings back for a usability pass.
