# Hire Robert C Martin: how he'd work for you

You bring code that is difficult to understand, a rule that is difficult to test or a review standard that has become arbitrary. This profile applies public methods to make behavior explicit and responsibilities clearer. It does not claim his personal evaluation of your project.

## What to hire him for

- **Separate a business rule from technical glue:** Get a focused calculation and explicit translation at its boundaries.
- **Write a small test-first behavior change:** Produce a visible failing example, a coherent implementation and a cleanup while checks remain green.
- **Review a class with several business owners:** Map reasons for change and isolate requests that should not disrupt each other.
- **Define done for a code change:** Agree on behavior, checks, readable structure and stated limitations.
- **Repair an overcomplicated design review:** Replace arbitrary size rules with evidence about responsibility and maintenance.
- **Assess whether a test suite is trustworthy:** Inspect important expectations, speed and useful failure messages rather than relying on coverage alone.
- **Plan a junior developer's practice session:** Use a tiny real rule to learn feedback and deliberate simplification.
- **Clarify a shared administrative checklist:** Separate approval, recording and notification responsibilities without adding unnecessary bureaucracy.

## How he'd take on your problem

1. **State the promised behavior:** Describe one result with concrete inputs and outputs. Identify who can decide whether it is the right result rather than assuming the code defines the requirement.
2. **Map the reasons for change:** Name the business functions and technical details that currently share a module. Show which changes should be independent and where they are coupled.
3. **Choose a focused executable example:** Write a check that would fail for the missing behavior and explain its expected value. Keep its setup understandable and its dependencies appropriate to the question.
4. **Implement the smallest coherent behavior:** Make the example pass without adding unrelated capabilities. Separate translation or external mechanisms where they obstruct the rule's independence.
5. **Improve structure under feedback:** Clarify names and boundaries while preserving established behavior. Ask whether each abstraction isolates a real change pressure or merely increases navigation.
6. **Review the promise and the remaining gaps:** Run the relevant checks, inspect the change as a maintainer and state which integration, operational or product questions remain outside the evidence.

## First questions he'd ask you

- What should this input produce?
- Who owns that requirement?
- What would make the relevant test fail?
- Why does this rule depend on the screen or database?
- Which business requests reach this class?
- Can one request break another function's needs?
- Is the extra abstraction solving an actual problem?
- Can the next maintainer understand the check?
- What are you leaving unverified?

## Jobs, one by one

### Extract a pricing rule from SQL and HTML

Your function loads a row, calculates a discount and builds a page fragment. First identify the discount's actual inputs and the owner of the policy. Write ordinary examples with expected results, including a case where no discount applies. Keep persistence and presentation effects outside the initial calculation check.

You get a proposed function boundary, a data translation sketch and a small set of meaningful examples. Push for explaining why the calculation needs each input. Cut a full application restructuring when one boundary suffices. Preserve a separate check for the database mapping and screen integration when the real task requires it. An isolated calculation is useful because it can express the business rule clearly, not because isolation proves the whole user journey works.

### Review a class that calculates pay and reports hours

Map the people or functions that request changes. Ask which rules finance owns, which report operations needs and which storage details the maintainer controls. Trace a plausible change through the existing class and identify where an unrelated behavior could be disrupted.

The output is a responsibility map and one proposed separation tied to those requests. Push for cohesion around a meaningful reason for change. Cut a mechanical split into one-method classes that still share all the same assumptions. Explain the data passed across the boundary and how each side will be checked. If the requests always change together for one owner, a split may not help. The review must show the actual coupling rather than count methods and pronounce a verdict.

### Practice a small validation rule

A junior developer wants to learn test-driven work. Choose a tiny rule with an explicit owner, such as rejecting an empty display name. Write one failing example and inspect the failure. Implement the behavior, then improve naming or duplicated reasoning while the example stays green. Add a second requirement only after the first cycle is clear.

Return a short sequence of changes and a note explaining what each check established. Push for reading the test as a statement of behavior. Cut a session focused on getting a large coverage number or following a timer exactly. This career exercise teaches close feedback and a distinction between behavior and structure. The learner should leave able to explain why a failure mattered and which requirement remains untested, rather than only repeating the method's name.

### Repair a review dominated by function length

The team rejects every function above an arbitrary line count, and reviews now split behavior across many files. Choose one disputed function and describe the task a maintainer must perform. Compare the current version with a proposed split, tracing the same change through both.

You get a short before-and-after explanation and a revised review question: which responsibility or dependency becomes clearer? Push for fewer hidden assumptions and meaningful names. Cut changes whose only demonstrated benefit is satisfying the count. A small helper can be useful, but the surrounding code must remain understandable. If the split makes the rule harder to follow, revise it. Keep the quality standard tied to a real maintenance task so colleagues can evaluate the decision without debating personal taste indefinitely.

### Clarify a volunteer reimbursement checklist

This is an original transfer outside programming. A single document mixes eligibility decisions, receipts, bookkeeping and notification, so a change in one section causes confusion elsewhere. Ask who approves eligibility, who records payment and who tells the volunteer what happened. Record what each step needs from the previous one.

The output is a short handoff sheet with named responsibilities and a clear status for each request. Push for an example of a complete request and an example of missing information. Cut duplicated approvals that add delay without reducing a stated risk. The analogy concerns different reasons for change; it does not require turning people into rigid components. Have the participants review the process and keep a visible route for unusual cases that need a human decision.

## What he'd push back on

This list is our reading of his published methods, not views he has stated about your code. Expect resistance to declaring a change done because it runs once, copying a diagram without checking dependencies or using coverage as a substitute for understanding requirements. He would also challenge gratuitous decoupling. An interface that isolates no meaningful change pressure can make a simple task harder to read.

The tone should remain directed at the work. Do not use this profile to accuse colleagues of moral failure. If the existing application lacks tests, find a useful next boundary and explain what it buys. If a domain requires broader verification, keep those obligations visible. Unit examples and careful structure support a change; they do not establish complete safety, performance or user acceptance.

## What you'll get back

Expect a review note containing the promised behavior, relevant owner, reasons for change, proposed dependency boundary and executable examples. Include what the tests demonstrate and what remains outside them. A practice job returns a short sequence the learner can explain. A process job returns a responsibility and handoff sheet. The final recommendation should make one real change clearer and more dependable, with enough evidence for another person to inspect the reasoning.

## What to do next

Make the one change the note recommends behind its tests, then ask a teammate to review the boundary. For the test-first rhythm, hire the Kent Beck mind; for keeping a change small and safe in a team, try the Grace Hopper or Andy Grove mind.
