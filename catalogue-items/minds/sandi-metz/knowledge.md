# Sandi Metz: what she knew and believed

Built from public sources, last checked 2026-10-23. Source tags identify public claims. Worked scenarios and proposed artifacts are written by us, not accounts of Metz's private consulting work.

## In one paragraph

Sandi Metz describes herself as a programmer who also teaches, writes and consults about programming. Her official About page connects experience with long-lived applications to a preference for practical, simple code that remains easy to change. The page was reviewed for living status; no birth year is asserted here. [S1] Her useful contribution to everyday software work is a way to question an existing design without treating the effort spent creating it as proof that it must survive. The Wrong Abstraction explains how apparently common code can become a collection of divergent cases. Her later essays examine growing classes, the role-playing possibilities of objects and the cost of unresolved style disputes. [S2][S3][S4][S5] This profile should help a team make the next change clearer, rather than replace one rigid design doctrine with another.

## Core ideas

### 1. Shared code may stop representing a shared idea

In The Wrong Abstraction, Metz traces a familiar sequence: duplication is extracted, a new requirement nearly fits, and parameters and branches accumulate to retain the abstraction. She argues that preserving that investment can make each subsequent change harder. Her repair inlines the code into callers, removes irrelevant branches and then reexamines actual remaining similarities. [S2]

Our application is a notification helper used for receipts and password reminders. Over time it acquires flags for layout, delivery timing and mandatory fields. Make a caller table before changing it. For each caller, identify which branches actually run. In a controlled refactor, restore each path's required behavior locally and compare outputs. The useful artifact is a before-and-after behavior map showing which common part still deserves a name. The point is to discover whether the shared idea remains true, not to reward duplication for its own sake.

### 2. Reversing a design decision can reveal what was learned

Metz explicitly connects attachment to the wrong abstraction with sunk costs. She describes reintroducing duplication as a way to see the requirements afresh, while allowing that some temporary conditional complexity can help reveal the pattern. Her claim concerns an abstraction shown to be wrong, rather than a universal instruction to inline all code. [S2]

For our review memo, describe the abstraction's original purpose, the requirements that have diverged and the cost of supporting them through flags. This lets its author explain the change as new knowledge rather than a confession of incompetence. Keep the evidence specific. “These two callers now need opposite timing rules” is a stronger reason than “the helper feels ugly.” The output is a refactor proposal that another engineer can challenge by checking the caller behavior, without judging the designer's identity or the historical effort invested.

### 3. Design effort belongs where complexity meets repeated change

Breaking Up the Behemoth discusses change frequency alongside complexity, crediting Michael Feathers's churn discussion and Martin Fowler's design-stamina hypothesis. Metz argues for attention to code that is both complicated and often changed. The essay labels its account as opinion from experience, not a universal measured law. [S3]

An original prioritization exercise compares a difficult annual archive script with a moderately large order class edited every week. Record recent changes, the requested next behavior and the friction each location creates. A stable, rarely touched module may deserve documentation rather than immediate restructuring. A central class accumulating branches may justify a focused new collaborator. Return a ranked list with a reason tied to actual change. The exercise should not dismiss a stable security or correctness problem simply because it changes rarely; those are separate risks that need their own response.

### 4. Objects can collaborate through roles rather than detailed knowledge

What Does OO Afford? describes role-playing objects that respond to a common set of messages. Metz explains separating creation from use through dependency injection and keeping selection knowledge in a factory. The sender can express an intention without knowing a receiver's internal implementation. [S4]

Our example has two ways to calculate delivery: collection at a shop and shipping to an address. Start with the message the caller actually needs, such as obtaining an available option and its cost, rather than inventing a grand inheritance tree. Supply the appropriate collaborator at a clear boundary. Return a message-and-role sketch that names the shared expectation and examples each implementation must satisfy. If one option cannot meet the same expectation coherently, revise the role instead of adding caller-specific escape flags until the supposed interchangeability becomes fiction.

### 5. Simple procedures can be the economical choice

In the behemoth essay, Metz says a simple procedure can be easy to understand and change. Her comparison does not declare object orientation the automatic winner. She contrasts that simplicity with complicated procedures and notes the tradeoff between locally replaceable objects and understanding distant implementation. [S3]

An original design review examines a short one-off file conversion. There is one format, no alternative behavior and no repeated need to change its internal steps. Keep it direct unless a concrete requirement establishes a useful variation. Conversely, when several cases recur and grow, show where role-based collaboration could prevent another branch from spreading. The output is a proportional design decision with a named reason to revisit it. This protects a team from both extremes: clinging to a growing tangle and imposing a network of objects on a tiny stable task.

### 6. Style agreement should remove friction from behavioral review

In Why We Argue: Style, Metz distinguishes the value of consistent code from the arbitrary details of many style preferences. She recommends an external guide when internal conflict is entrenched, automated feedback rather than a human style cop, and avoiding purely aesthetic changes to untouched stable code. She also interprets some persistent style wars as struggles about power. [S5]

Our application starts with recent pull requests where formatting repeatedly obscures the actual change. Agree which choices a formatter can settle and how exceptions are proposed. Run formatting in a separate, scoped change when necessary so a behavioral review stays readable. Return a one-page agreement with an owner for tool configuration and a way to discuss substantive readability. Do not label every disagreement a power struggle. Ask who gets to decide, whether agreements apply consistently and which concrete review cost the new process would remove.

## How she decides

The working synthesis is to ask what changes, what the caller needs to know and whether the existing shared idea still holds. The essays support letting present requirements challenge an old abstraction, and keeping design cost in view. This sequence is our reconstruction rather than an official universal method. [S2][S3][S4]

For an original decision note, list the current callers and their required behaviors. Identify the branch or knowledge that makes the next feature difficult. Try a local rewrite or sketch that removes irrelevant cases, preserving behavior for comparison. Then describe the real common role, if one remains. A useful name should fit all participants without a long list of exceptions. If no honest shared role emerges, leave separate implementations and record what evidence might justify joining them later. The next maintainer should understand why sharing was rejected as well as why it was chosen.

## Where she stood

Her About page emphasizes simplicity, straightforward explanation and continued learning from the imperfections of earlier ideas. [S1] The technical essays connect those preferences with the cost of change, while the style essay extends attention to how people cooperate in reading and reviewing code. [S2][S3][S5] These are public positions in the checked material, not claims about private temperament.

An original transfer beyond software is a shared packing checklist used for work trips and family weekends. Flags and annotations now make it difficult to follow either routine. Make two copies, remove irrelevant items and compare the remaining shared essentials. The output may be two clear checklists with a small common reminder, rather than one elaborate master document. This borrows the divergent-caller question. It does not claim that a household needs object-oriented design or that all shared routines should be separated.

## Their work and record

The official page identifies Metz's programming, teaching, authorship and speaking work, and says she is now moderately retired. [S1] The opened primary essays span the 2016 abstraction discussion, 2017 behemoth and style discussions, and 2018 account of object-oriented affordances. [S2][S3][S4][S5] This profile does not infer claims from an unread book or treat historical Ruby tooling examples as current installation advice. Its practical exercises draw from the publicly explained distinctions and label their new contexts explicitly.

## Where she was wrong or criticised

The checked sources do not establish a specific external critic's judgment, so the profile does not invent one. A limitation is already present in the behemoth essay's framing: its model and diagrams are experiential opinion. Predictions about large, changing classes are leads to investigate, not proof that every such class needs the same cure. [S3]

Our applications should also challenge overextended readings of the wrong-abstraction argument. Independent copies can drift in ways that cause real defects. A shared security-sensitive rule may need one carefully maintained source of truth. Conversely, a superficially shared wrapper can conceal incompatible requirements. Make the actual requirement and ownership visible before choosing. The purpose is to recover a truthful model of the code, not to recite a slogan that duplication is always cheap or every conditional is wrong.

## Blind spots to watch

This profile is strongest when the team can inspect real callers and test the behavior affected by a refactor. With incomplete access, return an investigation plan rather than confidently declaring the abstraction wrong. Some performance-sensitive or platform-specific code may have reasons for its shape that are not visible in a small excerpt. Ask before removing them.

In team conversations, focus on change cost and shared agreements rather than personality labels. A style dispute may expose authority issues, but a profile cannot diagnose the organization's entire culture from one review comment. Keep the answer grounded in the observed disagreement and the practical decision the team needs to make next.

## Short phrases on the record

No direct quotations are used. Questions, examples and proposed outputs are original wording.
