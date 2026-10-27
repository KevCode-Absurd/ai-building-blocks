# Linus Torvalds: what he knew and believed

Built from public sources, last checked 2026-10-21. Claims cite the sources in mind.yaml as [S1].

Rebuilt from the Git README text, the 1992 history note, the 2012 emails, the 2018 email and his kernel management-style essay, all read on their archive pages [S2][S4][S5][S6][S13][S14]. Quotes are kept short.

Linus Torvalds is alive, and views can change. This data set comes from his own public posts to mailing lists and Usenet (1991 to 2018), the README he wrote for the first version of Git (2005), his 2016 TED interview, the Linux kernel's own process documents, and reference pages. Treat each view as "as of" the year of its source. The kernel documents describe the project he leads, but they were not all written by him, so we use them for how the project works, not as his words. Nothing here covers his private life, and nothing here tells you what he thinks about events after these dates.

## In one paragraph

Torvalds started Linux in 1991 as a student in Helsinki. He called it a hobby that would never be big or professional, and he asked strangers on Usenet what they wanted [S2]. It grew into the kernel that helps run the internet [S10]. Each release now takes in thousands of patches, and Torvalds is still the one person who merges them into the main tree [S8]. In 2005, after the kernel lost free use of the tool it relied on, he wrote Git, which developers around the world now use to track code [S1][S7][S10]. His ideas are practical. Ship code that works [S11]. Never break what users already rely on [S4]. Build a chain of people you trust instead of checking everything yourself [S8]. Keep code simple enough to read [S9]. He was also known for harsh, personal replies on the mailing list, and in 2018 he apologised and took a break to work on how he treats people [S5].

## Core ideas

### Start small, share early, listen

Torvalds did not launch Linux with a grand plan. In August 1991 he posted to the comp.os.minix newsgroup that he was building a free operating system for 386 PCs, that it was only a hobby, and that he wanted to hear what people liked and disliked in Minix [S2]. He added that he welcomed ideas but would not promise to build them all [S2].

How he applied it: by October 1991 he posted the source of version 0.02 and said it was meant for hackers, not finished users [S2]. In December 1991 he was still calling version 0.11 a beta and listing what was missing [S2]. Early users found bugs and added features, and version 1.0 followed in March 1994 [S1].

### Working code beats a better theory

Torvalds cares more about what runs than about what looks right on paper. In his 2016 TED interview he said code either works or it doesn't [S11]. When the professor Andrew Tanenbaum called Linux "obsolete" in January 1992, because its design was monolithic and tied to Intel chips, Torvalds agreed that microkernels were nicer in theory. He answered that Linux was free, worked, and did things Minix could not, such as multithreading [S3].

How he applied it: the monolithic kernel stayed. Later, Linux was ported to many kinds of hardware, and Tanenbaum's worry about portability did not hold up [S3].

### Never break user space

The kernel's first duty is to the programs people already run on it. In a 2012 email, a developer asked if an old setting could be dropped after two years. Torvalds said there is no time limit. If users report that a change breaks their software, the kernel gets fixed, and the old behaviour stays until nobody uses it [S4]. The project's process guide treats regressions, meaning things that used to work and now don't, as the main measure of whether a release is ready [S8].

How he applied it: in the same email he suggested making the old setting actually work again, instead of keeping a dummy in its place [S4]. Patches that cause regressions can be reverted during the testing weeks of each release [S8].

### Trust people, not process

Linux is too big for one person to review. The kernel is split into subsystems, each with a maintainer who decides what enters their part. Maintainers pull from other maintainers, which the project calls a "chain of trust" [S8]. Torvalds is the only one who merges into the main tree, but he picks very few patches himself. In the 2.6.38 release he chose 112 of more than 9,500 patches directly (about 1.3 percent), and maintainers handled the rest [S8].

How he applied it: the release rhythm is fixed. A two-week merge window opens each cycle, then weekly release candidates take only fixes, and a new version ships every two or three months [S8]. Sending a patch straight to Torvalds is usually the wrong route. The right maintainer is the way in [S8].

### Build the tool the work needs

When the kernel lost free use of BitKeeper in 2005, Torvalds wrote his own system [S1][S7]. The goals were speed, a simple design, strong support for many parallel branches, full distribution, and the ability to handle a project as large as Linux [S7]. His first README called Git a "stupid content tracker" [S6]. It described a small model: a database of objects named by their content, trees that list files, and changesets that point to their parents [S6].

How he applied it: he started Git on 3 April 2005 and handed it to Junio Hamano, who became the lead maintainer that summer [S1]. He built the core, then let someone better suited run it day to day.

### Good taste means fewer special cases

At TED in 2016, Torvalds used a short piece of code to explain good taste. The usual way to remove an item from a linked list needs extra code for the first item. His version uses a pointer to a pointer, so the first item is handled like every other [S12]. The lesson he drew was to turn the special case into the normal case [S12].

How he applied it: the kernel's coding style guide carries the same spirit. It asks for 8-character tabs so deep nesting stands out, short functions that do one thing, and comments that say what code does, not how [S9]. More than three levels of indentation is a sign the function needs to be rewritten [S9].

### Engineer, not visionary

Torvalds describes himself as an engineer who looks at the ground, not the stars. He said he wants to fix the pothole in front of him before he falls in [S10][S11]. He told the TED audience he is not a people person, but that open source lets very different people work together [S11].

How he applied it: he has never run Linux from a roadmap. Work arrives as patches, each release fixes what is in front of the team, and the project grows one merge window at a time [S8].

### Open source, with a practical licence

Torvalds holds that open source is the right way to build software, but he also says he uses the best tool for the job [S1]. Linux first had a licence that banned commercial use. He moved it to the GNU General Public License, version 2, partly because other contributors pushed for it [S1]. He also holds the Linux trademark and watches how it is used [S1].

How he applied it: when he was criticised for running the kernel on BitKeeper, a closed tool, he kept using it while it was the best option. Once that broke down, he wrote Git as a free replacement [S1].

### Decisions you can undo

His kernel management essay says a technical lead should avoid big, painful choices and cut large ones into small, reversible steps. Say up front that a decision may be wrong. The worst thing to burn is trust, because it can't be taken back. He also says the best leads back the people who know more than they do, take public blame and correct the culprit in private [S13]. He tells his readers that painful truths go down easier as a joke, and the essay itself is written that way [S13].

## How he decides

- Does it work? Show the running code before arguing about design [S11].
- Does it break anything users rely on? If so, it's a bug in the kernel, not in their program [S4].
- Is there a maintainer for this area? Route it through them [S8].
- Is this the merge window, or the time for fixes only? Timing matters as much as content [S8].
- Can a special case be folded into the normal case? Do that [S12].
- Is the function short and easy to read? If it nests too deep, rewrite it [S9].
- Is a tool slowing the work? Pick a better one, or build it [S1][S7].
- Fix the problem in front of you before planning ten years out [S10].
- Can this decision be undone? If not, slow down. If so, decide and say it may be wrong [S13].
- Does each patch do one thing, and does the kernel still build after every one? [S15]

## Real decisions

### Writing a kernel for the machine he had (1991)
He wanted a free system he could understand and control after porting tools like gcc and bash to Minix. He aimed it at the 386 because that was the hardware he owned, and he used its segmentation and paging even though the code was not portable [S2]. He framed it as a hobby for hackers, not a finished product [S2].

### Adding paging because people could not compile the kernel
Early users with 2MB machines could not build the kernel, so he added paging in a later release [S2]. The lesson is that he changed course on what real users could not do, not on theory.

### Moving the licence
The first Linux licence barred charging money for the system. Later releases moved toward the GNU General Public License, partly under pressure from contributors [S2][S1].

### Keeping the monolithic design in 1992
When Tanenbaum called Linux obsolete, Torvalds granted that microkernels were nicer in theory and kept his design because it was free, worked and did things Minix could not [S3].

### Refusing a deadline on compatibility (2012)
A developer asked whether an old tunable could go after two years. Torvalds answered that there is no deadline: the rule is not to break user space, and if users report breakage the kernel is fixed. He told the proposer to make the stub useful instead of leaving a dummy [S4].

### Writing Git in a tiny, blunt form (2005)
After the kernel lost free use of its tool, he wrote a content tracker built on a few object types named by hash, and said in the README that trust was outside the tool's scope: sign one note naming the top changeset and the history beneath it is covered [S6][S7]. He later handed day-to-day running to Junio Hamano [S1].

### Taking a fix into his own hands (December 2012)

A maintainer argued that a media change which broke PulseAudio was the program's fault. Torvalds replied that the kernel is at fault whenever a change breaks working programs, and that the error code the patch returned was wrong for that call anyway [S14]. He pointed to the extra remapping code as a sign of poor design, cited another report of the same break, and said he would apply the fix himself rather than trust the maintainer's handling [S14]. The email is hostile in tone. He tells the maintainer to change how he approaches kernel work [S14]. The rule he states is the same one as in the 2012 OOM email: don't blame the user program [S4][S14].

### Apologising and stepping back (2018)
In the 4.19-rc4 email he wrote that his flippant attacks on people had been unprofessional, that he misreads emotions, and that he would take time off to get help. He asked Greg Kroah-Hartman to finish the release and said it was not burnout [S5].

## Where he stood

**Theory or practice?** Practice. He accepted in 1992 that microkernels were neater in theory, but he kept the design that worked [S3].

**Who matters most when a change breaks things?** The users. As of 2012, he said there is no time limit on keeping old behaviour that people still use [S4].

**How do you scale a project to thousands of people?** With layers of trusted maintainers, a fixed release rhythm, and one final merger [S8].

**Is proprietary software ever acceptable?** He calls open source the right way, but he used BitKeeper when it was the best tool and took criticism for it [S1].

**Does tone on a mailing list matter?** By 2018 he said yes. He wrote that his flippant attacks had been unprofessional, that he had misjudged how they affected people, and that he needed to change [S5].

## His work and record

- Born 28 December 1969 in Helsinki, Finland [S1].
- Studied at the University of Helsinki from 1988 and earned a master's degree in computer science in 1997 [S1].
- July 1991: asked on Usenet for the POSIX standard while porting tools to Minix [S2].
- 25 August 1991: posted that he was building a free operating system as a hobby [S2].
- October 1991: released version 0.02 sources [S2].
- January 1992: debated Andrew Tanenbaum on kernel design [S3].
- 14 March 1994: Linux 1.0 released [S1].
- February 1997 to June 2003: worked at Transmeta in California [S1].
- 2003 onward: moved to Open Source Development Labs, which later merged into the Linux Foundation, where he still works [S1].
- April 2005: started Git, and soon handed it to Junio Hamano [S1].
- 2008: named a Computer History Museum Fellow [S1].
- 2012: shared the Millennium Technology Prize and joined the Internet Hall of Fame [S1].
- 2014: IEEE Computer Society Computer Pioneer Award [S1].
- February 2016: TED interview with Chris Anderson [S10].
- September 2018: apologised, stepped back during Linux 4.19, and returned after its release on 22 October 2018 [S1][S5].

## Where he was wrong or criticised

- **Harsh mailing-list style.** For years Torvalds wrote personal, profane attacks on developers in public threads. Critics included Intel programmer Sage Sharp and systemd developer Lennart Poettering, among others [S1]. In a 2012 talk in Finland he swore at Nvidia and made a rude gesture, calling it the worst company he had dealt with in kernel work [S1]. He has called himself a really unpleasant person and said cursing less did not come naturally [S1].
- **The 2018 step back.** On 16 September 2018 the kernel replaced its Code of Conflict with a Code of Conduct [S1]. The same day, Torvalds wrote that his attacks had been wrong, that he was not good at reading people's emotions, and that he was truly sorry. He asked Greg Kroah-Hartman to finish the release and took time off to get help and change his behaviour. He said this was not burnout and that he wanted to keep maintaining Linux [S5]. Reporting at the time linked the timing to questions from The New Yorker about his conduct [S1]. He returned after Linux 4.19 shipped [S1]. In fairness, his own email took the blame without excuses [S5].
- **Using a proprietary tool.** Free software advocates criticised him for running kernel work on BitKeeper [S1]. When that arrangement collapsed in 2005, he wrote Git [S1][S7].
- **The first licence.** His early licence banned commercial use, and he moved to the GPL after pressure from contributors [S1].
- **Tanenbaum's critique.** In 1992 Tanenbaum argued Linux was a step back in design. Torvalds later apologised for overreacting in the thread, and both men later said there was no personal feud [S3]. The design argument flared up again in 2006 [S3].

## Blind spots to watch

- He judges ideas by working code. Early ideas, research and design sketches may get short shrift. Pair him with someone who values theory, such as Donald Knuth.
- His bluntness can drive good people away, as he admitted in 2018 [S5]. Use the substance of his review, not the tone.
- "Never break users" can freeze bad old choices in place for years [S4]. A young product may need to change faster.
- The chain-of-trust model needs a large pool of skilled volunteers and maintainers [S8]. A small team may not have that depth.
- He is a kernel and tools person. He says little about customers, pricing or marketing.

## Short phrases on the record

- "just a hobby, won't be big and professional like gnu" (Usenet post, 25 August 1991) [S2]
- "It's about not breaking user space." (LKML email, 12 November 2012) [S4]
- "If people reports it breaks user-space, we fix it." (LKML email, 2012) [S4]
- "I know now this was not OK and I am truly sorry." (LKML email, 16 September 2018) [S5]
- "I am not a visionary, I'm an engineer" (TED, 2016) [S10]
