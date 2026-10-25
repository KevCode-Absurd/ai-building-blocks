# Lea Verou: what she knew and believed

## In one paragraph

Lea Verou treats a developer-facing interface as something people must learn, remember and compose, rather than merely something a machine can execute. Her first-person biography connects web engineering, usability research, programming-language design and tools for creators. It was reviewed on 23 October 2026 and supports recording her as living. [S1] The sources selected here show her examining custom-property defaults, component configuration, colour assumptions and the difference between a standards proposal and a shipped feature. [S2][S3][S4][S5] This profile applies those distinctions to ordinary interface work: make the intended use easy, expose the hidden coupling and test the attractive shortcut against cases that could disprove it. All practical exercises below are our original applications.

## Core ideas

### 1. The developer using your component is a user

In the custom-properties essay, Verou discusses styling parameters as a component API. She compares approaches by their effects on inheritance, specificity and the burden placed on the component's consumer. [S2] That makes ease of implementation only one part of the design question.

Our application is a first-use review of a button component. Give a teammate three tasks: use the default, change its colour for a group and override one instance. Observe which internal selectors or conventions they need to learn. If the task requires knowing the component's private arrangement, write that dependency down. A short configuration surface can still be hard to use when it forces the caller to understand internal details. The output is a table of ordinary tasks, the knowledge each currently requires and a revised interface that reduces unnecessary knowledge. Do not optimise the character count while leaving the conceptual burden unchanged.

### 2. A useful default must coexist with intended customisation

Verou's 2021 essay shows how setting a public custom property directly on a component can obstruct inheritance from an ancestor. It explores a separate internal property that reads the public value with a fallback, while acknowledging that its pseudo-private name does not make it truly private. [S2] The central design concern is whether a default preserves the paths people reasonably expect to use.

For a practical review, test missing, inherited and locally supplied values separately. Then inspect a nested component and an invalid input. Write the desired result before looking at the current implementation. This separates an accidental success in one example from a coherent contract. If the team chooses an internal naming convention, document it as a convention and make no security claim about it. The useful deliverable is a small state matrix with executable examples, so a future refactor can preserve intentional behaviour without treating every present detail as sacred.

### 3. Configuration should express intent consistently

Her inline-conditional article explains a component scenario in which one high-level variant controls several related visual values. She describes usability problems when some styling must be supplied as attributes and other styling as custom properties for reasons driven by implementation convenience. [S3] This is a concrete concern about the consistency of the interface exposed to its user.

Our exercise is to list the configuration needed for success, warning and neutral messages. Ask which values represent a user's intention and which are derived implementation details. If a user has to set five separate colours to request one meaningful state, consider whether the component is exposing the wrong level of abstraction. Conversely, do not hide an important distinction behind a single label merely to shorten the API. Return a configuration map showing public intentions, derived values and justified escape hatches. Test it with both a normal example and a request the design did not originally anticipate.

### 4. An assumption deserves its own experiment

The colour article starts with a proposed lightness threshold, then explicitly returns to test whether that threshold can support the desired conclusions. It explores ranges and shows that the choice of colour range and contrast criterion matters. [S4] That sequence is more valuable than borrowing one formula without its conditions.

For a theme editor, begin by stating the assumption: a chosen rule will keep text usable across the backgrounds the editor permits. Identify the actual permitted range, text sizes and states. Sample boundary cases and preserve any counterexample. A calculation about one text/background pair cannot settle every property of a rendered interface. The deliverable is an experiment note containing the inputs, criterion, observed failures and scope. If the experiment exposes a conflict between a visual preference and a required check, make the conflict visible. Do not smooth it away with a confident label such as accessible colour.

### 5. A proposal is a stage, not a compatibility promise

Verou's standards overview distinguishes proposal, acceptance, specification, trial and different shipping stages. [S5] Her 2024 conditional article separately explains why group agreement still leaves syntax, specification and implementation work. [S3] Historical excitement about a feature therefore cannot establish what a user's current environment supports.

Our application is a feature decision card with separate fields for the user problem, conceptual approach, current implementation evidence and fallback. Record the date and environment of any actual check. If a tutorial uses older syntax, retain its design reasoning while consulting the present specification and implementation before writing production code. A team can decide that an experimental feature is useful in a controlled setting, but that is a different decision from relying on it for a broadly distributed interface. The output should make this difference legible to the next reviewer, rather than burying it in a discussion thread.

### 6. Reduce the special cases that people must memorise

Her standards record describes simplifying nesting syntax to reduce boilerplate and error-proneness, while the conditional article argues for expressing a meaningful goal more directly. [S5][S3] Together these sources support examining whether complexity is necessary for the user's task or merely inherited from an earlier technical constraint.

An original application is to review a settings form with several exceptions. Ask a new maintainer to predict the behaviour of each option from the interface alone. Record where prediction fails and why. A good simplification may preserve the same capability while removing a special ordering rule, duplicated value or surprising exception. The result should include before-and-after tasks, not just a cleaner-looking diagram. Some constraints really are necessary; the point is to distinguish those from rules whose only explanation is that the current implementation happens to work that way.

## How she approaches a problem

The selected essays move between a practical use case and the design of the mechanism that could serve it. They compare alternatives, expose assumptions and consider the person authoring or customising an interface. [S2][S3][S4] Our synthesis is to start with a concrete usage story, inspect the knowledge the interface requires and then construct cases that separate the alternatives.

Consider a colour parameter that works when set on a button but fails when supplied to its parent. Rather than adding a more forceful selector immediately, write down the intended inheritance contract. Test the default, ancestor value and local value in a small page. Then compare possible implementations by both observed behaviour and what the caller must remember. The next developer should not have to discover through trial and error which values are inherited and which have been silently replaced.

The same method can improve non-code instructions. A household's shared form may ask different people to supply the same information in different formats. Identify the intention behind each field, choose a consistent convention and test it with an ordinary first-time user. This is an analogy to interface usability, not a claim that a CSS technique solves interpersonal disagreements. The concrete output is a form that explains its choices and requires fewer avoidable translations.

## Where this is useful

Use this profile when designing a component's configuration, diagnosing surprising defaults, simplifying a developer tool or evaluating a clever visual technique. It is particularly useful when a solution works for its author but imposes hidden knowledge on everyone else. It also helps a learner prepare a demonstration that shows both a technique and the conditions under which it stops being appropriate.

It is not a substitute for current standards evidence, comprehensive accessibility testing or a complete colour-science review. The colour essay contains explicit updates and an ongoing argument about criteria. [S4] This profile uses its experimental method without treating every historical threshold or support percentage as a universal present-day instruction. Any actual implementation must be assessed in its own environment.

## Their work and record

Verou's own biography describes research at MIT, work on web standards, open-source tools and teaching. [S1] The standards page is her account of technologies she proposed, designed or influenced, with stages distinguished rather than collapsed into one claim of completion. [S5] The three technical essays read for this profile provide concrete examples of API usability, component configuration and testing an initially plausible shortcut. [S2][S3][S4]

Only these public pages are counted in the reading record. Links within them are not silently treated as additional read papers, specifications or demonstrations. The profile does not claim to reproduce her thesis or all her tools. It extracts a limited set of documented reasoning moves and gives the user a way to apply them to a small piece of current work.

## What can be criticised

A highly expressive interface can still be difficult to learn. Reducing boilerplate does not automatically reduce the number of concepts a newcomer must understand. Our countercheck is to ask someone to predict the behaviour before explaining the clever mechanism. If the explanation takes longer than the task justifies, an explicit ordinary alternative may be better.

An experiment can also create false confidence if its input range is chosen after seeing the result. Write the permitted range and criterion first, retain awkward cases and distinguish sampled evidence from a proof. These are cautions about our application of the methods, not accusations about Verou's research.

## Blind spots to watch

Do not confuse an internal naming convention with enforced privacy. Do not assume that an attractive default remains appropriate for every state or customisation path. Keep user intention separate from implementation convenience, and keep a mechanism's design separate from its present availability.

When discussing contrast, describe the exact test and its limits. A numerical check is evidence about a defined criterion, not a certification of the whole experience. The responsible output makes the remaining review visible while still resolving the local question that can actually be tested.

## Short phrases on the record

- "making things for making things" describes the focus of her biography. [S1]
- "Custom properties with defaults" names the component-design essay. [S2]

The exercises and sample dialogue in this profile are original writing, not additional quotations.
