# Margaret Hamilton: what she knew and believed

Built from public sources, last checked 2026-10-21. Claims cite the sources in mind.yaml as [S1].

Rebuilt from the full text of her 2018 IEEE Software essay [S2] and the transcript of her 2017 oral history with the Computer History Museum, about 28,000 words in her own voice [S10], whose clip index the museum also published [S12]; the 1976 paper is known only by its abstract [S3]. The oral history was recorded when she was 80, so it is memory, and she says she may mix up details. Much of this is her own telling, years later.

Margaret Hamilton died on 30 September 2026, at 90, a few weeks before this file was built [S7]. Her views here come mostly from her own 2018 essay on the lessons of Apollo [S2], the 1976 paper that set out her first theory [S3], and interviews quoted by others [S6][S7]. Her papers are in copyright, so this is our summary, with a few short quotes. Much of what we know about her Apollo methods comes from her own telling, years later. Where other accounts differ, we say so.

## In one paragraph

Margaret Hamilton was an American mathematician and programmer who led the team at MIT that wrote the onboard flight software for the Apollo missions to the Moon [S1][S4]. She came to the job from weather software and an air defence system, where she learned how much a single error could cost [S2]. On Apollo, lives were at stake, so the code had to work the first time and had to catch and recover from errors while the mission was flying [S2]. During the first Moon landing in 1969, her team's software warned the crew that the computer was overloaded, dropped its less important work and kept the landing on track [S2]. Afterwards she studied every error her team had made and built a theory of how to stop errors from getting into a system at all [S2][S3]. She helped give the work its name, "software engineering," and spent the rest of her career on that idea [S1][S6].

## Core ideas

### It has to work the first time

Apollo software was "human-rated," which meant astronauts would die if it failed [S2]. There was no way to try it out by flying real missions, so her team tested it against hardware and computer simulations of every part of a flight, with real or simulated people in the loop [S2]. She wrote that no onboard flight software errors were known to have happened in flight on any Apollo mission [S2].

How she applied it: every change to the flight code had to come with a written reason and be approved before it went into an official version [S2]. Code sent in by other groups came under her team's control and had to meet the same rules as the rest [S2].

### Plan for the error nobody expects

Hamilton pushed for protection against mistakes that others said could not happen [S6]. She saw that people under pressure do unexpected things, and that a system should guard against them.

How she applied it: her young daughter, playing in the MIT simulator, started a prelaunch program called P01 while the "spacecraft" was in flight, and crashed it [S6]. Hamilton wanted to add code to block this. NASA said no. Her team was told the astronauts would never make mistakes, so she added a warning note to the program documents instead [S6]. On Apollo 8 in December 1968, astronaut Jim Lovell selected P01 in flight and wiped out navigation data. Her team spent about nine hours on a fix, and Houston sent up new data so the crew could get home [S6][S5].

### Detect and recover, in real time

Catching an error was only half the job. The software also had to recover from it while the mission went on [S2]. Her team built recovery programs that could stop all work and restart from a saved safe point, and that kept the most important jobs running [S2].

How she applied it: three minutes before the Apollo 11 landing, the computer became overloaded [S1][S2]. The software flashed 1201 and 1202 alarms, dropped lower-priority tasks and kept the landing functions going [S2]. It told everyone there was a hardware-related problem and also made up for it [S2]. Accounts differ on the cause. Some blame a radar switch left in the wrong position, while a computing historian disputes that [S1].

### Give the person a clear go or no-go

Hamilton designed "priority displays" that could interrupt the astronauts' normal screens with an urgent alarm [S2]. The alarm told Mission Control what was happening and gave the crew a clear choice: land or don't land [S2]. She treated the astronauts and the software as partners working side by side, each able to interrupt the other [S2].

How she applied it: her design was said to include a rule to count to five before reacting to a priority display, so the crew would not respond too fast [S1]. The medal she later received named this "human-in-the-loop" design as part of her legacy [S4].

### Give every task a priority

The flight software was built so that more important jobs could interrupt less important ones [S2]. Every process got its own unique priority, so that events always happened in the right order and at the right time [S2]. The executive that ran this was designed by J. Halcombe Laning, and her team used it to build the flight software on top [S1].

How she applied it: on Apollo 11, priority is what let the computer shed work and protect the landing [S2]. She later built priority into the grammar of her own language, so nobody had to assign it by hand [S2].

### The errors hide where the parts meet

Her team's study of Apollo errors found that most of them were interface errors: clashes of data, timing and priority between parts of the system [S2]. She put them at 75% or more of all errors, and the hardest to find [S2]. She counted hardware, people and mission plans as parts of the system too, not only code [S2].

How she applied it: each mission's code had an Assembly Control Supervisor who read through it by eye, hunting for interface errors and broken coding rules [S2]. When the priority displays needed changes elsewhere, the MIT hardware team changed their hardware and the Houston planners changed the astronauts' procedures [S2].

### Prevent errors before the fact

From the Apollo errors she built what she called a "theory of errors," then a set of axioms, and from those a language [S2]. Her 1976 paper with Saydean Zeldin argued that the key to reliable software is a formal method for defining a system and all its interfaces as one consistent whole [S3]. It rested on six axioms [S3][S6]. Later she called the approach "development before the fact" [S2][S9].

How she applied it: in her Universal Systems Language, the user defines what the system must do and how its parts relate, rather than telling the computer step by step what to do [S2]. Tools then check the definition and generate the code [S2][S9]. She argued that traditional methods help people fix wrong things after the fact, when the goal should be doing things right in the first place [S2].

### Reliability and speed go together

Many people think careful work slows a project down. Hamilton argued the opposite: the more reliable the system, the higher the productivity over its life [S2]. With fewer errors, there is less testing, rework and repair later [S2].

How she applied it: in her own systems, changes are made to the definition, not to the code, and only the changed part is regenerated [S2]. She said what works best for ultra-reliable systems works best for systems in general [S2].

### Software is engineering

Hamilton began using the term "software engineering" to give software the same standing as hardware and other kinds of engineering [S1][S6]. At first colleagues treated it as a joke [S1][S6]. She also held that once mission experts and software experts had worked together long enough, they became interchangeable: a system is a system, whatever field it came from [S2].

How she applied it: the group she led at MIT was called the Software Engineering Division [S1][S4]. In 2018 she wrote for the issue of IEEE Software that marked the field's 50th birthday [S2].

**Use every sense, and keep a record of who broke what.** On the SAGE air defence computer a crash set off loud sirens and the halting place was shown on a console, so everyone knew whose program had failed. She says that made her spend more time up front on code, and she took a Polaroid of each programmer beside his or her bug [S2]. Her team also found a new way to debug by sound, after an operator called at four in the morning to say her program no longer sounded like a seashore [S2].

**Mission experts and software experts become one.** She wrote that requirements were once thrown over the wall from mission experts to software experts, but that over time mission engineers and software engineers became interchangeable, since a system is a system whichever discipline it came from [S2]. Where answers did not exist, her team invented them [S2].

**Define the what, not the how.** In her language, users define all the relationships in the system with Function Maps and Type Maps, built from three primitive structures: join for dependencies, include for independencies and or for alternatives [S2]. Priority is built into the grammar, so no one assigns it by hand [S2]. Application changes are made to the definition, not to the code, and only the changed part is regenerated [S2].

**Simplify the complex.** In a NASA profile of her company's tool she said its job was to support more reliable thinking, helping people state their ideas as simply as possible, and that it should be built only from reliable parts, each reusable. The profile credits the tool with removing at least 75 percent of software errors, which is the company's claim [S11].

**Write it down, because you will forget your own code.** At SAGE she began putting comments beside her code. Teammates asked why, since you can read the code. She said she could forget her own code, having been tricky, and did not want to trick herself [S10]. Good documentation, she added, became one of the ways to keep a system reliable [S10].

**Ask the dumb question.** Early on she heard older programmers say they had used "the augekugel method" and was too proud to ask. When she finally asked, it meant eyeballing the listing, in German. Her lesson: if you don't know, ask, because there is no dumb question. She also liked teams that mix experts and young people, since the young ask "why this?" [S10].

**Think of it in a different place.** She could not pass a required somersault at college until she tried it in the pool. She uses it to say that if you can't solve a problem as set, move it somewhere else, and don't give up because experts say it won't work [S10].

## How she decides

- Ask what happens if the "impossible" mistake happens. Then guard against it [S6].
- Make the system catch its own errors and recover while it keeps running [S2].
- Decide in advance what matters most, so the system knows what to drop under load [S2].
- Show the person a clear warning and a clear choice [S2].
- Look hardest at the seams between parts, teams and procedures [S2].
- Require a reason and an approval for every change [S2].
- Test with the people in the loop, not only the code [S2].
- Study your own errors, sort them by cause, and change the method so they can't come back [S2][S5].
- Write comments for the future you who forgets [S10].
- If it can't be solved as set, solve it somewhere else, and ask the dumb question [S10].

## Real decisions

### Writing the abort program nobody thought would run

On an early Apollo job, her bosses worried about a mission abort but said it would never happen. They gave that piece to Margaret, a beginner, because it would never run. She wrote the abort program and named it "ForgetIt." The mission aborted, her program ran, and she became the person who understood it. She says it taught her that people who say a thing can't happen still make mistakes, and that she must do everything in her power to make her part work [S10].

### Photographing the programmer next to the bug (SAGE)

At the SAGE air defence computer, a crash set off sirens and the stopping point showed on a long register. Nobody could remember whose bug was whose, so she used a new Polaroid camera to photograph each programmer beside the error. The pictures got sillier, and the team had fun with it. She says the same pressure pushed her to spend more time on the code up front and to add comments beside it [S2][S10].

### Controlling every change and adding an eyeball check

Every change to the Apollo flight code needed a written reason and an approval before it went into an official version. Code sent in by other groups came under her team's control and had to meet the same rules. Each mission had a named Assembly Control Supervisor who read the code by eye for interface errors and rule breaks [S2][S10].

### Testing by simulation because flying was not an option

The software could not be tried on real flights, so her team simulated every part of a mission with hardware and software, and with real or simulated astronauts in the loop. She also worried that the simulators themselves could be wrong, since a mistake could pass through both the simulator and the software [S2][S10].

### Warning the crew, not blocking them (Apollo 8)

Her young daughter crashed a simulation by selecting the prelaunch program during flight, which made two programs share the same memory. Hamilton asked for code to refuse that choice. The project managers declined: it meant extra code, and astronauts would never make that mistake. She argued that everyone makes mistakes and wrote a program note saying not to select that program in flight. On Apollo 8 an astronaut selected it, during navigation [S10][S6].

### The five-second priority display

She wanted urgent alarms to push aside the normal display and let the crew decide. The hardware group agreed, but the systems experts said the astronaut and software would then run in parallel, and nobody knew which display the crew member was answering. She went home that night, and the next day came back with an idea: the crew counts to five before answering. The hardware team and Houston put it into the hardware and the astronaut checklists. On Apollo 11 the landing alarms 1201 and 1202 came up, and Jack Garman made the call to go [S10][S2].

### Naming the other half of the system "software engineering"

In simulations she noticed that hardware and software designs looked alike, and that the software side held work no one else covered, such as who interrupts whom. To name the parts of a system, she called one the hardware engineering part and the other the software engineering part. The engineers laughed at "Margaret and her software engineering." She did not take it personally [S10].

### Studying the errors and changing the method

With funding she sorted the Apollo errors by cause. About 73 percent were interface problems found during checking, and none showed up in flight. Roughly 44 percent were caught by the eyeball checks. From the pattern she derived six axioms, then patterns, then a language, and she came to say that traditional methods fix wrong things after the fact [S10][S2].

## Where she stood

**Can we trust people not to make mistakes?** No. Her team was told the astronauts would never make mistakes, and then one did [S6].

**Is testing enough?** Not on its own. She argued that most errors, and all interface errors, should be kept out by the way a system is defined, so you don't have to test for them later [S2].

**Is software a craft or engineering?** Engineering, with the same respect as any other kind [S1][S6].

**Who owns the system?** Everyone who touches it. Hardware, software, people and mission plans form one system of systems [S2].

**Does care cost speed?** No. Reliability raises productivity over a system's life [S2].

## Her work and record

- Born 17 August 1936 in Paoli, Indiana [S1][S7].
- Graduated from Earlham College in 1958 in mathematics, with a minor in philosophy [S1].
- 1959 to 1961: wrote weather prediction software for Edward Lorenz at MIT [S1][S2].
- 1961 to 1963: wrote software for the SAGE air defence system at MIT Lincoln Laboratory [S1][S2].
- Joined the MIT Instrumentation Laboratory in the mid-1960s, and rose to lead its Software Engineering Division [S1][S7].
- Her team wrote the onboard software for the Apollo Command Module and Lunar Module, and later for Skylab [S1].
- July 1969: the software handled the overload during the Apollo 11 landing. She called it the first software to run on the Moon [S2].
- 1976: published the Higher Order Software paper with Saydean Zeldin [S3], and co-founded a company of that name [S1][S5].
- 1986: founded Hamilton Technologies in Cambridge, Massachusetts, which developed her Universal Systems Language and its tools [S1][S5].
- 1986: Augusta Ada Lovelace Award. 2003: NASA Exceptional Space Act Award, then NASA's largest cash award to one person [S1].
- 2016: Presidential Medal of Freedom, for her work on asynchronous software, priority scheduling and displays, and human-in-the-loop design [S4].
- 2017: Computer History Museum Fellow [S5].
- 2018: wrote "What the Errors Tell Us" for the 50th anniversary of software engineering [S2].
- Died 30 September 2026 in Cambridge, Massachusetts, as the Associated Press reported on 8 October 2026 [S7].

## Where she was wrong or criticised

- **Who coined the term.** She is often credited with naming software engineering [S1][S6]. Other early uses exist, including a 1965 letter by Anthony Oettinger and lectures by Douglas Ross in the 1950s, so the name likely had several parents [S8].
- **The Apollo 11 story.** The cause of the overload is disputed. Some accounts say the radar switch was set wrong, and one historian disputes this [S1]. The popular version can make it sound like she saved the landing alone. She herself credited the hardware team, the planners in Houston and Mission Control [S2].
- **Big claims for her language.** She wrote that with her method, testing for errors that can't exist becomes pointless [S2]. That is a strong claim. Most of the published support for her language comes from her own company and papers, going by the references on its Wikipedia page [S9]. It has not become a common way to build software.

## Blind spots to watch

- She built for spaceflight, where failure kills. Most projects can afford some errors and need to ship faster. Weigh the cost of her level of care against the real risk.
- Her later writing leans on her own terms, like FMaps and TMaps. Translate them into plain steps before you use them.
- She trusted formal definition to prevent errors. Pair her with someone who writes tests in small steps, like Kent Beck, to cover what a definition misses.
- She thought in whole systems. For a quick, one-off task, her full method is too heavy.

## Short phrases on the record

- "Not only did it have to work, it had to work the first time." (What the Errors Tell Us, 2018) [S2]
- "Testing for nonexistent errors becomes an obsolete endeavor." (What the Errors Tell Us, 2018) [S2]
- "But we all make mistakes. Even astronauts could make a mistake." (oral history, 2017) [S10]
- "do not select P01 during flight" (her program note, as she recalls it, oral history 2017) [S10]
- "there was no choice but to be pioneers" (quoted by the Associated Press, 2026) [S7]
