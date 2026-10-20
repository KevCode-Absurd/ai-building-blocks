# John Carmack: what he knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

Rebuilt 2026-10-20 from his 1998 plan file, his 2012 essay and his 2022 memo as read online [S3][S5][S7]. The 2007 inlined-code email could not be opened this time.

John Carmack is alive, and views can change. This data set comes from his own public writing and talk: his 1998 .plan file updates, a 2007 email to id Software staff on coding style with a note he added in 2014, a 2012 essay on functional programming, a 2022 podcast interview, and his 2022 farewell memo to Meta. Reference pages fill in dates. Treat each view as "as of" the year of its source. The podcast transcript we used is a third-party transcript, so small wording slips are possible. His work on artificial general intelligence (AGI) at Keen Technologies is described only as it was announced in 2022 and 2023. Nothing here covers his private life, and nothing here tells you what he thinks now.

## In one paragraph

Carmack is a self-taught programmer who co-founded id Software in 1991 and wrote the engines behind Wolfenstein 3D, Doom and Quake [S1][S2]. He later funded a rocket company, Armadillo Aerospace, worked for nearly a decade on virtual reality at Oculus and Meta, and in 2022 started Keen Technologies to work on AGI [S1][S8][S9]. His ideas are about focus and honesty with the machine. Know exactly what your code does when it runs [S4][S6]. Treat hidden state as the main source of bugs [S4][S5]. Prefer code that does the same work every time over clever code that skips steps [S4]. Cut scope hard, commit to the core, then test early and often [S3][S8]. And care about waste, because a slow, wasteful system is a failure even when it ships [S7].

## Core ideas

### Protect long, quiet blocks of focus

Carmack treats deep focus as his main tool. In January 1998 he spent a week alone in a hotel doing research, to test how much of his low-energy time was needed rest and how much was just wasted [S3]. Afterwards, the office felt more distracting, and he planned to repeat the trips [S3]. He still took week-long solo programming retreats years later [S1].

How he applied it: in 2022 he said he worked about 60 hours a week for decades, as ten-hour days, six days a week [S6]. He also said he never pulled all-nighters, that his brain turns to mush after about 12 hours, and that he always tries to get eight hours of sleep [S6].

### Know what your code really does

Carmack wants programmers to see the code that actually runs, not the code they imagine. Every so often he would step through one full frame of a game in a debugger, into every function, to see everything that executed [S4]. He found it usually got depressing long before the end of the frame [S4].

How he applied it: in 2022 he said the first thing he does after writing new code is set a breakpoint and step through it, because your head is a poor judge of what code does [S6]. He said he was amazed at how much big tech companies ignore debuggers and IDEs, and he argued for automated checks and analysis tools over good intentions [S6].

### Hidden state is the enemy

Carmack's 2007 email argued that most bugs come from the program's state not being what you think it is [S4]. Functions called from many places, and chains of small helper functions, make that worse. He suggested inlining a function that is only called in one place, and minimising the amount of code that sits inside "if" branches [S4]. By 2014 he said the real enemy was unexpected changes to state, and that functional programming attacks it more directly [S4].

How he applied it: his 2012 essay urged C++ programmers to write pure functions where they can. A pure function reads only its inputs and returns a result, so it is easier to test, reuse and run on many threads [S5]. He called purity a sliding scale and said some side effects will always be needed [S5].

### Do the same work every time

Skipping work that seems unneeded makes code look faster in tests, but Carmack found it breeds bugs, because the skipped step often updated something else [S4]. He preferred to do the operation every time, then ignore or block the results when they aren't wanted [S4]. For a game running at 60 frames a second, the worst case matters more than the average [S4].

How he applied it: in 2014 he wrote that the extra frame of input delay his email had warned about nearly shipped in a Doom 3 re-release, which gave him a cold sweat [S4]. He also noted that this rule fits less well on phones, where power and heat are tight [S4].

### Cut scope and commit to the core

Carmack makes hard cuts so the team can finish the part that matters. In March 1998 he said the next engine would need graphics hardware, with no software renderer, even though that would shrink the possible audience [S3]. In June 1998 the next game became a deathmatch-only title, Quake Arena, and he called single-player work a gamble [S3].

How he applied it: he told fans that id would listen to specific, well-argued ideas, but would not try to please everyone and did not design by committee [S3].

### Use the tool that works

Carmack is practical about languages. In 2022 he said the best language is generally the one that works, often the one you already use, and that mixing languages on one project is almost always a mistake [S6]. He prefers a plain, C-like style of C++ and uses Python for AI work, though he said it is not his native language [S6].

How he applied it: he warned in 2007 that C++ features such as operator overloading and implicit constructors hide what code is doing [S4]. In 2012, though, he told game developers not to drop C++ for unusual languages, and to apply functional ideas inside the tools they had [S5].

### Share the code when it's done earning

Carmack released old id engines to the public, usually once a codebase was about five years old [S2]. Wolfenstein 3D's source came out in 1995, Doom's in 1997 and under the GPL in 1999, and Quake's in 1999 [S1]. He opposes software patents [S1].

How he applied it: in 1998 he wrote that he was pleased by the many fan ports that followed the Doom source release [S3]. He also moved to frequent public test versions, because thousands of players find more problems on day one than a test team can [S3]. Later he said he wished he had used the more permissive BSD licence [S1].

### Build, fly, break, repeat

Carmack carried his software habits into rockets. Armadillo Aerospace, which he founded in 2000 and largely paid for, used a fast build-and-test cycle. It built more than 12 vehicles, tested about 50 engine designs and made over 100 flights [S8]. Computer control kept the hardware simple [S8].

How he applied it: in 2007 he wrote that flight software should be a simple polled loop, like a basic video game, instead of threads and a real-time operating system [S4]. He inlined the subroutines in Armadillo's flight code and found variables set more than once and some doubtful control flow, and the code got smaller [S4].

### Waste is an insult

Carmack treats efficiency as a matter of pride. In his December 2022 memo leaving Meta, he said seeing 5% GPU use in production offended him, and that the organisation ran at about half the effectiveness that would make him happy [S7]. He told staff to make better decisions and fill their products with "Give a Damn" [S7].

How he applied it: in 2022 he said he tries to keep the larger value to the user in view, and to pick his battles, rather than chasing perfect technique everywhere [S6]. He praised Quest 2 as close to what he wanted, while saying it could have arrived faster with better choices [S7].

## How he decides

- Step through it and look. Don't trust your mental model of the code [S6].
- If a function runs in one place, consider putting its code inline [S4].
- Move state into explicit inputs wherever it is cheap to do so [S5].
- Favour steady timing over the best average [S4].
- Cut the feature that blocks the core, even if it costs customers [S3].
- Use the language you already have unless there is a strong reason not to [S6].
- Test in public, early and often [S3][S8].
- Work hard and long, but sleep [S6].
- When you were wrong, say so and fix it [S3].

## Real decisions

### Moving game mods to an interpreted virtual machine (1998)
In November 1998 he wrote that Quake 3's game logic would run in an interpreted C virtual machine, with binary libraries kept only for debugging. His reason was security and portability, and he called it the right choice [S3].

### Smoothing mouse input at the cost of latency (1998)
He found that Windows 95 sampled the mouse only about every 25 ms, which made movement stutter at higher frame rates. He added three input modes and made the smoothed one the default [S3].

### Abandoning dual-processor rendering after measuring (1998)
After timing about 12 ms to fill the command queue and 17 ms to read it, he dropped the dual-processor approach and wrote it off in a line [S3].

### Refusing design by committee
In 1998 he pointed players to a public suggestion site to filter feedback, asked for specific benefits and clean interfaces, and said the studio did not follow community votes [S3].

### Releasing tools and source
He committed to publishing editor changes after the game shipped, and gave a casino win to the Free Software Foundation while saying he did not share all its views [S3].

### Making code pure where it was finicky
He tells programmers to pull finicky code out into a function that depends only on its inputs, then test it, which often turns up bugs. He admits this costs extra copying and is a continuum, not a switch [S5].

### Leaving Meta (2022)
His memo says the headset he wanted had largely arrived, but that wasteful effort, such as a GPU at about 5 per cent use, hurt him. He blames his own lack of persuasion for not stopping bad decisions, and says he left to work on his own company [S7].

## Where he stood

**When should a product ship?** For years he answered "when it's done." By 2019 he said he largely took that back, and that Rage should have shipped about two years earlier [S1].

**Should old code be shared?** Yes, once it has done its commercial job. He released most of id's engines, though he later preferred the BSD licence to the GPL [S1][S2].

**Big company or small team?** As of 2022, he said Meta had plenty of people and money but kept wasting effort, and that his voice at the top had not been persuasive enough [S7].

**Is long-hours work worth it?** As of 2022, yes, for people chasing a goal, as long as they sleep and know their own limits [S6].

**How should AGI be built?** As of 2023, he said he and Richard Sutton stand somewhat outside the mainstream, focusing on agency and time. They set a goal of an AI prototype showing "signs of life" by 2030 [S9]. In 2022 he said he chose AGI over cheap nuclear fission as his next field [S6].

## His work and record

- Born August 21, 1970, in Shawnee Mission, Kansas. Spent two semesters at the University of Missouri–Kansas City [S1].
- Around 1989 to 1991: worked at Softdisk, where the team made the first Commander Keen games [S1][S2].
- 1 February 1991: co-founded id Software with John Romero, Tom Hall and Adrian Carmack [S2].
- 5 May 1992: Wolfenstein 3D. 10 December 1993: Doom. 22 June 1996: Quake [S2].
- 1999: Quake III Arena. 2004: Doom 3 [S1].
- 2000: founded Armadillo Aerospace. It won Lunar Lander Challenge prizes in October 2008 and September 2009 [S8].
- 2001: inducted into the Academy of Interactive Arts and Sciences Hall of Fame [S1].
- June 2009: id Software sold to ZeniMax [S2].
- August 2013: Armadillo put into "hibernation mode" [S8]. Joined Oculus as CTO; left id in November 2013 [S1][S2].
- November 2019: became consulting CTO at Oculus to spend more time on AGI [S1].
- August 2022: Keen Technologies raised $20 million [S1].
- December 2022: left Meta [S1][S7].
- September 2023: Keen partnered with Richard Sutton of Amii [S9].

## Where he was wrong or criticised

- **Design versus technology at id.** Tom Hall was forced out in 1993 after a dispute with Carmack over Doom's design. Quake's hard development led to tension with John Romero, who resigned in 1996 [S2]. Sandy Petersen said Carmack turned down his offer to lead the project [S2].
- **Engine licensing.** Carmack found supporting other studios' use of id's engines a distraction. Epic's Unreal Engine became far more successful commercially [S2].
- **Late games.** His "when it's done" approach to release dates is something he later largely took back [S1].
- **Owning his mistakes.** In 1998 he admitted that a remote-control backdoor he added to QuakeWorld had been irresponsible, and that parts of Quake 2's code and network design were wrong [S3].
- **Armadillo.** The company did not build several rockets at once, so losing one hurt more. After a 2013 crash it went into hibernation, and it was burning about $1 million a year of his money [S8].
- **Linux gaming.** He has been sceptical of Linux as a gaming platform, which put him at odds with many open-source fans [S1].
- **ZeniMax v. Oculus.** His move to Oculus was central to ZeniMax's lawsuit over VR technology. The jury found Oculus and some officers liable but cleared Carmack [S1].
- **Meta.** In his own memo, he called his limited influence partly self-inflicted, since he chose not to move to headquarters and fight leadership battles [S7].

## Blind spots to watch

- He sees the world through performance and focus. Teams that need trust, story or emotion may find him narrow. Pair him with a designer or a storyteller.
- His 60-hour weeks suit some people, not all. He said so himself [S6].
- His advice on inlining and steady timing was written for real-time games and rockets [S4]. Other kinds of software may need different trade-offs.
- His history of conflict over design at id suggests he can undervalue non-technical voices [S2].
- His AGI views are dated to 2023 and describe a research bet, not a result [S9].

## Short phrases on the record

- "we don't design by committee" (.plan, March 1998) [S3]
- "A pure function only looks at the parameters passed in to it" (essay, 2012) [S5]
- "your head is a faulty interpreter" (podcast interview, 2022) [S6]
- "The best programming language is the one that works" (podcast interview, 2022) [S6]
- "I have never been able to kill stupid things before they cause damage" (Meta memo, 2022) [S7]
