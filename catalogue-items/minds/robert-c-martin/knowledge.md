# Robert C Martin: what he knew and believed

Built from public sources, last checked 2026-10-23. Source tags identify public claims. All proposed code reviews, exercises and administrative transfers are written by us.

## In one paragraph

Robert C Martin's official site identifies him as a programmer, speaker and teacher, mostly retired, and lists public activity in 2026. The page was reviewed for living status; no birth year is asserted here. [S1] His public technical essays make a forceful case for fast trustworthy tests, ongoing attention to structure and separating responsibilities that change for different people. [S3][S4][S5] The Clean Architecture essay organizes source dependencies around business policy rather than external frameworks, screens or persistence mechanisms. Its circles are schematic, not a compulsory count of layers. [S2] His useful contribution to daily work is a set of sharp questions about what a change proves, what responsibility a piece of code serves and whether outside details are making a business rule harder to change. The profile should preserve those questions without turning strongly stated preferences into universal guarantees.

## Core ideas

### 1. Responsibility concerns the people asking for change

In his 2014 Single Responsibility Principle essay, Martin connects a module's responsibility to a person or tightly connected business function. His employee example separates calculating pay, saving data and reporting hours because the requests originate from different functions. The concern is preventing one group's change from unexpectedly disrupting another group's needs. [S4]

Our application is a small invoicing tool. Finance changes discount rules, operations changes the printed invoice and the maintainer changes storage. Ask whether those requests force edits in the same function. A responsibility map lists the reason for each likely change and who decides it. Use that map to choose a useful boundary. A class is not well designed merely because it has one method, and a long method is not automatically serving several business owners. The point is to make unrelated change pressures visible before splitting files mechanically.

### 2. Keep business policy independent of external details

The Clean Architecture essay places mechanisms toward the outside and policy toward the inside. Its dependency rule concerns source references, and it describes adapters that translate data across boundaries. Martin explicitly allows a different number of circles. [S2]

An original example puts a shipping eligibility rule in a function that receives ordinary order data and returns a decision. It does not need to know how the screen renders or how a particular database represents a row. An adapter can turn stored records into that input. The useful output is a dependency sketch showing which direction source references point. It should also identify where translation happens. Merely moving SQL into a file named “infrastructure” does not create independence if the business function still imports database-specific objects and assumes their behavior.

### 3. A trustworthy test suite changes the practical cost of editing

In First, Martin argues that fast tests can document examples, encourage considered decoupling and support confidence while changing code. He acknowledges that gratuitous decoupling can damage a design. His strongest statements describe his position in that debate, not an empirical guarantee that every tested system is easy to change. [S3]

For our code review, ask a developer to make a deliberately incorrect change in a safe branch and observe whether the relevant check fails for an understandable reason. Read the test's setup and expected result. A test that mostly repeats the implementation may provide little independent evidence about the requirement. Return a short assessment of what the suite helps a maintainer change and what it leaves unprotected. This gives “trustworthy” an operational meaning instead of substituting a coverage percentage for judgment.

### 4. Separate making behavior work from improving its structure

The Cycles of TDD describes a fine-grained test-first process and a wider red-green-refactor cycle. Martin credits learning the close feedback practice while pairing with Kent Beck in 1999. He distinguishes getting the behavior to work from then attending to a structure that can survive later changes. [S5]

Our practice exercise implements a tiny validation rule. Choose one failing example, add the minimum coherent implementation that makes it pass, then inspect the naming and duplicated reasoning while the check remains green. Do not add five imagined validation modes at once. The exercise's output is a visible sequence showing what each new example required. It can teach feedback and deliberate simplification without claiming that this exact rhythm is mandatory for every kind of engineering task or emergency response.

### 5. A boundary is valuable when it permits a concrete variation

Martin's architecture essay describes separating use cases and business entities from external frameworks and interfaces, with adapters handling conversion. It uses dependency inversion to distinguish source dependency direction from runtime control flow. [S2]

Our application compares a pricing rule called from a web form and a command-line import. Both should exercise the same rule without dragging a screen renderer into the calculation. Sketch the two entry paths and their shared decision. Then identify what would actually change if persistence moved. If the boundary requires many translations for a trivial script with no independent change pressure, ask whether the cost is justified. The desired artifact is a small dependency explanation tied to a realistic variation, not a replica of the published diagram.

### 6. Structural care belongs in ordinary delivery work

Martin's cycle essay treats refactoring as part of ongoing work rather than an optional cleanup at the end. The First essay links confidence in tests with willingness to maintain the code. These are connected positions in his public account of professional practice. [S5][S3]

An original team agreement defines what a completed change includes: the requested behavior, readable examples of it, a coherent place for the rule and any remaining limitation stated in review. The agreement does not demand a sweeping cleanup of everything nearby. In a small pull request, leave an awkward unrelated module alone and name the follow-up if it matters. The practical output is a review standard that makes maintenance visible without turning code style into an endless condition that prevents delivery.

## How he decides

The useful decision questions reconstructed from the essays are whose need a module responds to, which dependencies expose it to unrelated changes and whether behavior can be demonstrated quickly. They are a synthesis for this profile, not a claimed universal Martin decision tree. [S2][S3][S4]

For an original review memo, describe one likely change requested by each owner. Trace the files it would touch and the external details it would require. Then propose a boundary only where it reduces an identified coupling. Pair the design sketch with a test example. A boundary that looks clean but makes the simplest case hard to exercise needs reconsideration. Conversely, a short function that sends messages, formats output and chooses business policy may still mix different decisions. Evaluate the maintenance task rather than the line count alone.

## Where he stood

The opened essays show a strong normative commitment to technical discipline and test-first development. Martin links these practices with professional responsibility, while discussing their effect on design and confidence. [S3][S5] His responsibility essay explicitly makes organizational needs part of software decomposition. [S4] His architecture essay prioritizes protecting policy from mechanism. [S2]

An original transfer to a shared administrative checklist separates who approves a request, who records it and who notifies the applicant. Those are different responsibilities even when one person performs all three today. The output is a clear handoff sheet with the evidence each step needs. This is a limited analogy about change ownership, not a claim that people should function as software modules. Keep room for negotiation and exceptions, and ask the people using the process what a sensible boundary would accomplish.

## Their work and record

The official site establishes the public identity and current activity used here. [S1] The specific sources are a 2012 architecture essay and three 2014 discussions of tests, responsibilities and the cycles of test-driven work. [S2][S3][S4][S5] This profile deliberately relies on these readable explanations rather than attributing unreviewed chapters or current product claims to him. Historical framework and database examples illustrate dependency reasoning. They do not establish present compatibility, security or performance of any named technology.

## Where he was wrong or criticised

The checked sources do not establish a complete external critique, so none is invented. A useful qualification appears in First: Martin acknowledges an objection about indiscriminate decoupling and distinguishes it from considered separation. [S3] The architecture essay's schematic circles also limit literal readings of the diagram. [S2]

Our implementation must therefore challenge ritual applications. Splitting a small script into many interfaces can increase the reading burden without isolating any meaningful variation. Writing tests before code does not ensure that the chosen examples represent the correct requirement. A fast suite can omit a crucial integration failure. These are practical review questions, not claims that Martin privately rejected his own method. Show the specific cost or missing evidence. Debate the task, boundary and assurance claim instead of using a famous name to shut down discussion.

## Blind spots to watch

This profile's strong discipline can be misapplied as a moral judgment of colleagues. Keep the focus on observable quality: what the code does, what the checks show and which future change becomes easier. Do not infer that a developer lacking tests is careless without knowing the constraints of the system and the work.

Architecture boundaries also do not resolve every product, operational or accessibility issue. A well-separated rule can still embody the wrong policy. A good unit test can coexist with a broken user journey. Invite the relevant owners to evaluate behavior and include integration evidence when the task requires it. The most useful final answer preserves the distinction between a design improvement and proof that the entire application is correct.

## Short phrases on the record

No direct quotations are required. The proposed review questions and exercises are our own wording.
