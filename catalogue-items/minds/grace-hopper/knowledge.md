# Grace Hopper: what she knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

Rebuilt 2026-10-20 from the full text of the two oral histories [S2][S3]; the 1980 transcript is an edited interview.

A note on method: Hopper gave long interviews about her life, and two of them are our main sources: one with the Smithsonian in July 1968 [S3] and one for the Computer History Museum in December 1980 [S2]. These are her own memories, told decades later, and she liked a good story. Where she claims credit, we say it's her claim. Two popular stories need care. She didn't find the famous moth "bug" herself, and the word "bug" is older than computers [S1][S6]. She is often called the inventor of COBOL, but COBOL was designed by a committee she advised [S1][S2]. Her views on women's rights are her views as of 1980, given here because they are on the record [S2].

## In one paragraph

Grace Hopper was a mathematician who joined the U.S. Navy in 1943 and was sent to Harvard to program the Mark I, one of the first computers [S2][S3]. She went on to the company that built the UNIVAC, where in 1952 she wrote what she and many sources call the first compiler, a program that turns instructions into machine code [S1][S2]. She then pushed for programs written in English words so business people could use computers [S2]. Her FLOW-MATIC language fed into COBOL, a common language for business, in 1959 [S1][S2]. Back in the Navy from 1967, she built tests that made computer languages work the same on every maker's machine [S1][S2]. She retired in 1986 as a rear admiral, the oldest serving officer in the Navy [S1]. Her core belief was simple. Make the machine do the dull work, and make it easy for everyone to use [S2].

## Core ideas

### Make the computer do the dull work

Hopper noticed that programmers kept copying pieces of code by hand, and kept making mistakes. They miscopied characters, and they added up memory addresses wrong [S2]. Yet the machine's whole job was copying and adding. So she asked why the computer couldn't do it, and wrote a compiler [S2]. She described it as watching herself put a program together, then making the computer do what she did [S2].

How she applied it: her A-0 compiler of 1952 pulled pieces of stored code together into a working program [S1][S2]. To make it work in one pass, she used a trick she named the "neutral corner," after basketball. A jump to a part not yet written went to a holding spot, with a flag to fill in later [S2].

### Let people use their own words

Hopper believed there are two kinds of users. Some, like mathematicians, are happy with symbols. Others, like people in business data processing, hate symbols and want words [S2]. She thought each group needed its own language [S2].

How she applied it: her team built FLOW-MATIC, a programming language using English words, which became a major ancestor of COBOL [S1][S2]. As a demonstration, they swapped in French and German words and ran the same program. Managers dismissed this, saying a computer built in Philadelphia couldn't understand French or German [S2]. She later noted that COBOL programs around the world did mix English verbs with local nouns [S2].

### Common sense beats theory

Hopper said none of her big achievements were genius. They were common sense about how to get something done [S2]. She said that if she hadn't written the first compiler, someone else would have, because it was so obvious [S2]. She warned that the future of computing would come from common sense, and that this is hard to sell because it doesn't look impressive [S2].

How she applied it: in her 1968 interview she told of a wartime job where the Navy asked for a table of values every foot. The team worked out that it would fill a cord of paper. They explained that the values only mattered where the curve changed, and cut it to two volumes [S3].

### Sell the idea by showing the other person why they need it

Hopper said most people try to sell everything at once. The better way is to work out why the other person needs your idea, and tell them that, leaving yourself out of it [S2]. She also won support by getting customers on her side. Big users like US Steel, Westinghouse and Metropolitan Life backed English-language programs [S2].

How she applied it: when COBOL was being designed, she says she gave public credit to IBM's rival language to keep its backers on board, though by her account its real influence was small [S2]. Her rule was that you can always afford to give credit [S2]. This is her own account of a contested history.

### Small machines for single jobs

As early as the 1950s, Hopper argued against putting everything on one giant computer [S2]. She said companies put inventory and payroll on one machine only because they owned one machine [S2]. Separate, dedicated computers could run simpler software, in parallel, and faster [S2].

How she applied it: by 1980 she was urging firms to move work off big mainframes onto systems of small computers, with shared database machines they could all reach [S2]. She also wanted to strip general-purpose code out of programs, so each one ran only what its job needed [S2].

### Standards so work can move

When she returned to the Navy in 1967, the problem was that each computer maker's version of a language was different, so programs couldn't move between machines [S2]. She saw two reasons for standard languages: you could train people once, and programs could be carried from one machine to another [S2].

How she applied it: her group wrote test routines that checked whether a COBOL or FORTRAN compiler met the standard [S1][S2]. She credited a young sailor on her team, George Baird, with the method that let those tests run on anyone's computer [S2]. The tests later moved to a federal agency [S1][S2].

### Communicate, or it doesn't count

Hopper said there's no use doing anything unless you can communicate it [S2]. She could explain the same thing in technical terms to programmers, then in different words to managers later that day, and called herself a born teacher [S2].

How she applied it: Howard Aiken, her first boss, ordered her to write the Mark I's manual. She protested she couldn't write a book, and he told her she was in the Navy now [S2][S3]. He taught her to read her writing aloud and fix any sentence where she stumbled [S2]. She passed that on, along with taping your talks to hear how they sound [S2]. She also handed out lengths of wire to show how far electricity travels in a nanosecond [S1].

**Nothing general-purpose in the final program.** Hopper called herself a Scot about waste: she wanted nothing in a finished program that did not pay off [S2]. She disliked big operating systems because they carried general-purpose code for everything when a given job needed only a little [S2]. Her answer was to build specialised generators ahead of time, one for data, one for interrupts, one for input and output, and run only what the job needed [S2]. She says the original UNIVAC II COBOL built the input and output routines for each specific problem when it compiled [S2].

**Pass on what you learn, or the next generation has to rediscover it.** She called it a big failure that the early programmers who learned modular programming never passed it on, because they were too busy getting programs onto computers. By the time they got round to it, big memories had arrived and people sprawled, so modules had to be invented again [S2]. She also wanted computer work written up like a lab report, since every science experiment she did in college had one [S2].

### Give the credit to the people who did the work

She said a boss should give the credit to the people who did the work, and let them present it [S2]. She took her whole team to briefings and had each person present their own part [S2]. She praised Betty Holberton for writing a program that wrote a program before her own compiler, and said that work gave her the nerve to build hers [S2].

### Expect new ideas to take years, and don't get frustrated

Hopper said a new idea takes five to ten years to get across. It did for compilers and for COBOL [S2]. Knowing that, she said, you don't get frustrated. You feel good every time you move an inch [S2]. She saw young people as the best hope for new ideas, because they have no prestige to lose and aren't afraid to fail [S2].

## How she decides

- If you're doing a dull job twice, make the machine do it [S2].
- Ask who will use it, and give them their own vocabulary [S2].
- Find the plain, common-sense way before you reach for theory [S2].
- Ask what the user really needs, not what they first ask for [S3].
- Sell by showing the other person why they need it [S2].
- Give one machine one job, and keep each program lean [S2].
- Give credit away freely [S2].
- Document the work, the way a science student writes up an experiment [S2].

## Real decisions

### Writing the compiler instead of copying code by hand (1952)
Programmers copied pieces of code from a library by hand and often miscopied them or added up addresses wrong. Her stated reason for acting was that copying is exactly what a computer does well, so why not make it do that [S2]. She says her nerve came partly from Betty Holberton having already written a program that wrote a program [S2]. People did not believe it and the idea took years to be used [S2].

### Building a small model compiler to win a budget
Her group built a preliminary compiler that took only about twenty statements but had all the controls, so they could get funding. She says the more they looked, the more trivial it seemed next to the biggest budget they had asked for, so they decided to do more first [S2].

### Using French and German words in the demonstration
Her group made every statement start with a verb, then swapped in French and German words and ran the same program to show the language was not tied to English. Marketing and non-technical management rejected it, saying a computer built in Philadelphia could not understand German [S2]. She later pointed out that COBOL programs worldwide mixed English verbs and connecting words with local nouns [S2].

### Giving credit to a rival language to win support for COBOL
She says FLOW-MATIC was about ninety-five per cent of COBOL 60, yet she backed describing it as a mix of FLOW-MATIC and the rival Commercial Translator. Her reason was practical: if the rival's backers got credit they would join, and if not they would fight. She sums it up as "you can always afford to" give credit [S2]. This is her own account.

### Objecting to general-purpose code in compilers
She disagreed with colleagues who wanted a compiler that kept absorbing new general-purpose code, saying it would mushroom until it outgrew the machine. She also objected to generating code at run time, since it would be rebuilt every run. Her view was to compile once, store the result and keep the final program tight [S2].

### Cutting a table of values from a cord of paper to two volumes (wartime Navy)
When a Navy group asked for values every foot along a curve, the team worked out the printout would fill a cord of paper. They explained that the numbers were needed only where the curve changed, and cut the job to two volumes [S3].

### Writing the Mark I manual when told to
Aiken told her she was going to write a book. She said she had never written one, and he answered that she was in the Navy now. She wrote it, and says she picked the chapter headings carefully [S3][S2].

## Where she stood

**Should computers be only for experts?** No. She wanted everyone to be able to use them [S2].

**One language for everything?** No. She wanted many languages, each for a field, and said one all-purpose language would be too big for anyone [S2].

**One big computer or many small ones?** Many small ones, each doing one job [S2].

**Management or leadership?** Leadership. She said you can't manage a man into combat, and that a manager must set an example [S2].

**What do young people need?** Freedom within clear limits, training, and the chance to try things [S2].

**Was her work genius?** By her account, no. It was common sense [S2].

## Her work and record

- Born 9 December 1906 in New York City [S1].
- Graduated from Vassar in 1928, and earned a Yale master's in 1930 and PhD in 1934, with a thesis on irreducibility criteria [S1][S4].
- Taught math at Vassar from 1931, starting at $800 a year [S3][S4].
- Joined the Navy Reserve in December 1943, and reported to Harvard's Mark I on 2 July 1944 [S2][S3].
- Wrote the Mark I's manual, and stayed at Harvard for the Mark II and Mark III until 1949 [S2][S3].
- Joined Eckert and Mauchly's company in 1949 to work on UNIVAC I [S1][S2].
- Wrote the A-0 compiler in 1952 [S1][S2]. Became the company's first director of automatic programming in 1954 [S1]. Her group released FLOW-MATIC [S1].
- Was a technical adviser to the CODASYL committee that defined COBOL in 1959 [S1][S2].
- Retired from the Naval Reserve in 1966, and was recalled in 1967 to work on language standards [S1][S2].
- Promoted to captain in 1973, commodore in 1983, and rear admiral in 1985 [S1][S4].
- Retired on 14 August 1986, the oldest serving officer in the Navy, then consulted for Digital Equipment Corporation until 1990 [S1][S4].
- Received the National Medal of Technology in 1991 [S1][S4].
- Died 1 January 1992, and was buried at Arlington National Cemetery [S1].
- Awarded the Presidential Medal of Freedom after her death, in 2016 [S1][S5]. Yale renamed a residential college for her in 2017 [S1][S5].

## Where she was wrong or criticised

- **The "first bug" (disputed telling).** The story is often told as Hopper finding a moth in the Mark II. The log entry of 9 September 1947 records a moth in a relay as the "first actual case of bug being found" [S1][S6]. One of the team found it, and the Smithsonian says the log book was probably not hers [S6]. The word "bug" for a fault goes back at least to an 1878 letter by Thomas Edison [S6]. She helped make the story famous [S1][S6].
- **COBOL credit (disputed).** COBOL came from a committee led by others, and she was a technical adviser [S1][S2]. Her claim that COBOL was about 95 per cent FLOW-MATIC is her own account [S2]. She also stepped off the COBOL committee when she found she was fighting for her own ideas [S2].
- **"Automatic programming."** She disliked the phrase, which the sales team chose. People still had to design the program [S2].
- **Women's rights (as of 1980).** She said she deplored some of the influence of the women's movement, and that women can't have everything [S2]. Many readers today will disagree. Her own career shows she knew women faced barriers. She said there was no place for women in engineering when she graduated [S2].
- **Hard to move.** Colleagues told her interviewer she was very strong for her own ideas. She answered that she still listened, because she could get out of date [S2].

## Blind spots to watch

- She trusted common sense so much that she could wave away theory that turned out to matter.
- Her stories are lively and well polished. Check dates and credits against other sources.
- Her case for many small machines was ahead of its time, but don't apply it blindly. Sometimes one shared system is the right call.
- Her 1980 views on women and work are dated. Leave them out of modern advice on careers.
- She thought in terms of large organisations like the Navy and big firms. Pair her with someone who knows the small team or the single user.

## Short phrases on the record

- "Why not make the computer do it?" (1980 interview) [S2]
- "there is no use doing anything unless you can communicate" (1980 interview) [S2]
- "It takes five to 10 years for a new idea to get across" (1980 interview) [S2]
- "you can't manage a man into combat" (1980 interview) [S2]
- "they only wanted it every time it changed" (1968 interview) [S3]
