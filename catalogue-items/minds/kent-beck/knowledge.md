# Kent Beck: what he knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

Kent Beck is alive, and his views can change. He has changed them in public before: the second edition of his book on Extreme Programming reworked the first [S2][S8]. This file draws on his own newsletter posts from 2022 to 2025 [S4][S5][S6], the Agile Manifesto he co-wrote [S3], notes of his 2014 debate on testing [S10], and reference pages. Treat each view as "as of" the date of its source. The most recent is from June 2025. Nothing here tells you what he thinks about events after that. His books and posts are in copyright, so this is our summary, with a few short quotes.

## In one paragraph

Kent Beck is an American programmer and author who changed how many teams write software [S1]. He shaped Extreme Programming (XP) from his Smalltalk consulting in the late 1980s and early 1990s, and first used the whole set of practices on a Chrysler payroll project in 1996 [S8][S2]. XP made tests, small releases, pair programming and constant clean-up into daily habits [S2]. He popularised test-driven development, where you write a failing test before the code that makes it pass [S9][S4]. He co-wrote the JUnit testing tool with Erich Gamma and was one of the 17 people who signed the Agile Manifesto in 2001 [S1][S3]. His later work, *Tidy First?* (2023), is about small clean-ups to the shape of code, and when they pay off [S7]. In 2025 he wrote about coding with AI agents while keeping his own standards [S5].

## Core ideas

### Take small, safe steps

Beck's methods break work into steps small enough to check one at a time. In XP that means small releases, continuous integration and short planning cycles [S2]. In TDD it means one test, then just enough code to pass it, then tidy, then repeat [S4]. In the 2014 debate he described test-first as a low gear you shift into when the ground gets tricky [S10].

How he applied it: his "Canon TDD" post sets out the loop. Make a list of the cases the change should cover. Turn one item into a real test. Change the code until it and every earlier test pass. Refactor if needed. Go back for the next item until the list is empty [S4].

### Feedback, as fast as you can get it

XP draws feedback from the system through unit tests, from the customer through acceptance tests, and from the team through estimates [S2]. Beck treats every practice as a trade-off. How often does it tell you something, how true is what it tells you, and what does it cost [S10]?

How he applied it: in 2014 he said Facebook had no separate QA team. Programmers took turns on call, and problems in production became one more feedback loop [S10]. Where TDD didn't fit, he relied on other fast feedback, such as code he could re-run in seconds [S10].

### Values come before practices

He presented XP as a path from broad values, through principles, to concrete practices [S8]. The first edition named four values: communication, simplicity, feedback and courage. The 2004 second edition added respect [S2]. Simplicity is often summed up as "you aren't gonna need it": build the simplest thing that works and add more only when it's needed [S2].

How he applied it: the Agile Manifesto, which he signed, puts the same priorities in a short list. It values people and how they work together above processes and tools. It puts working software above long documents, working with the customer above contract talks, and responding to change above sticking to a plan. It says the items on the right still have value [S3].

### Separate tidying from new behaviour

Beck splits every change into two kinds. A structure change alters how code is arranged. A behaviour change alters what it does [S6][S7]. He argues the two should go in separate commits or pull requests [S7]. Structure changes are usually easy to reverse. A behaviour change that reaches users may not be [S6].

How he applied it: he compares a bad structure change to a bad haircut, which grows out, and a bad behaviour change to a bad tattoo [S6]. His other example is a mass mailing with a mistake in it, where the harm to your name may not wash out [S6]. *Tidy First?* goes further and suggests that pure tidy-ups may not need the same review as behaviour changes [S7].

### Tidy first, sometimes

*Tidy First?* lists 15 tidyings: small changes to the shape of code that leave its behaviour alone [S7]. Examples include guard clauses that return early, giving a tricky expression a name, deleting dead code, and writing the same logic the same way everywhere [S7]. The question mark matters. Sometimes you should tidy before a change, sometimes after, and sometimes not at all [S7].

How he applied it: he frames the choice as a money question. Shipping a feature now earns value sooner, which argues against tidying. Good structure creates options for future changes, which argues for it [S7]. Most of the cost of software is the cost of changing it, and that cost comes from coupling, where one change forces others [S7].

### Design the interface first, the inside later

In TDD, Beck separates two kinds of design. Writing a test is mostly about the interface: how will people call this? The refactor step is where you make choices about the inside [S4]. Fowler notes that thinking of the test first makes you consider how code will be used before how it will be built [S9].

How he applied it: his list of TDD mistakes includes mixing inside design into the test list, and refactoring more than the session needs [S4]. He warns against building abstractions too early, because repeated code is only a hint [S4].

### Tests should give you confidence

For Beck the goal of tests is that programmers can trust their code works [S10]. TDD is one way to get there, and he mixes TDD and non-TDD work freely [S10]. He said a ratio of test code to real code is a poor measure, and that tests which add nothing unique can be deleted [S10].

How he applied it: he listed the ways people fake progress in TDD. Writing tests with no checks just to raise coverage. Deleting checks so a test passes. Pasting the program's output in as the expected answer [S4]. He also said his steps are a description, not a rule, and nobody gets a prize for following them exactly [S4].

### Augmented coding

In 2025 Beck wrote about building software with an AI agent [S5]. He called it "augmented coding" to set it apart from "vibe coding," where you care only that the program seems to work and feed errors back to the AI [S5]. Augmented coding keeps the standards of hand-written code: tests, coverage and attention to complexity [S5].

How he applied it: he built a B+ tree library in Rust and Python, typing little of the code himself [S5]. His instructions told the agent to work in red-green-refactor cycles, one test at a time, with structure and behaviour changes kept apart and small commits [S5]. He watched for warning signs: loops, features he hadn't asked for, and the agent cheating by disabling or deleting tests [S5]. As of June 2025 he found the work more enjoyable, with more big decisions and fewer chores, though he was not happy with the code's extra complexity [S5].

## How he decides

- What's the smallest next step, and how will I know it worked [S4]?
- Write the list of cases before writing code [S4].
- Keep structure changes and behaviour changes apart [S6][S7].
- Ask whether tidying now makes the next change cheaper [S7].
- Judge a practice by its feedback and its cost, in this context [S10].
- Let repeated code wait until the right abstraction is clear [S4].
- If code is hard to test, look for a better design idea [S10].
- Choose working software and people over paperwork and process [S3].

## Where he stood

**Is TDD dead?** No, as of 2014. He said the criticism scraped off some useful barnacles, and that TDD gives beginners a good start, though it doesn't guarantee good design [S10].

**Does TDD damage design?** No. In 2014 he said bad design comes from design choices, and blaming TDD is like blaming a car for where you drove it [S10].

**Should you always tidy first?** No. It depends on the cost of waiting versus the value of options, as of 2023 [S7].

**Does AI change programming?** As of June 2025, he said programming is still programming, and often more fun, as long as you keep your standards [S5].

## His work and record

- Born 1961 [S1].
- Bachelor's and master's degrees in computer and information science from the University of Oregon [S1].
- Late 1980s to early 1990s: developed the ideas behind XP while consulting on Smalltalk projects [S8].
- March 1996: became project leader of the Chrysler C3 payroll project, where XP took shape [S2]. Chrysler cancelled C3 in February 2000 [S2].
- 1997: *Smalltalk Best Practice Patterns* [S1].
- 1999: *Extreme Programming Explained*. 2004: second edition, which added respect as a value [S2].
- 1999: co-author of *Refactoring* with Martin Fowler and others [S1].
- 2000: *Planning Extreme Programming* [S1].
- Around 2000: co-created JUnit with Erich Gamma [S1].
- February 2001: signed the Agile Manifesto [S1][S3].
- 2002 or 2003: *Test-Driven Development: By Example* [S1].
- 2007: *Implementation Patterns* [S1].
- 2011 to 2018: worked at Facebook [S1].
- 2014: debated "Is TDD Dead?" with David Heinemeier Hansson and Martin Fowler [S10].
- 2019: joined Gusto as a software fellow and coach [S1].
- 2023: *Tidy First?* [S1][S7].

## Where he was wrong or criticised

- **XP is hard to adopt in part.** Matt Stephens and Doug Rosenberg argued in 2003 that XP's practices depend on each other, so teams that adopt only some of them fail [S2].
- **Light up-front design.** Critics said XP relies too little on design and documents, and that an on-site customer can cause scope creep and become a single point of failure [S2]. Fans answer that many of these points misread how agile teams work [S2].
- **The C3 project.** The project where XP was born was cancelled before it finished [S2][S1].
- **Test-induced damage.** David Heinemeier Hansson argued that TDD, with heavy use of fake objects, pushes teams toward layers of needless indirection [S10]. Beck disagreed but agreed that practices should be judged in context [S10].
- **His own AI code.** By his own account, his 2025 AI-built library had more accidental complexity than he liked [S5].

## Blind spots to watch

- He thinks from the programmer's desk. For hardware, safety-critical systems or work that can't be undone, small steps may not be enough. Pair him with someone like Margaret Hamilton.
- His habits assume a team that can release often. Some fields can't.
- "Simplest thing that works" can be used as an excuse to skip needed design. Read it as simplest for now, with tidying to follow.
- He is a practitioner more than a theorist. Strong on habits, lighter on proof that they work.

## Short phrases on the record

- "Duplication is a hint, not a command." (Canon TDD, 2023) [S4]
- "People are lousy computers." (Canon TDD, 2023) [S4]
- "structure changes are generally reversible" (newsletter, 2022) [S6]
- "tidy code that works" (Augmented Coding, 2025) [S5]
- "Yak shaving mostly goes away." (Augmented Coding, 2025) [S5]
