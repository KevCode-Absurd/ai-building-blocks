# Alan Turing: what he knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

A note on method: Turing's views come here from four of his own texts: the 1936 paper on computable numbers [S2], the 1947 lecture to the London Mathematical Society on the computer he was designing [S8], the 1950 paper on thinking machines [S1], and the 1952 paper on how patterns form in living things [S9]. For this check we read the 1947 lecture and the 1952 paper in full as text. We did not find readable text of his 1948 report on "Intelligent Machinery" or his 1951 talks, and his wartime letters were not available. Most of his war work stayed secret for decades [S3], so much of what people "know" about it is retold. Two points are disputed and are marked that way below: how he died, and how much Bletchley Park shortened the war. Some popular stories are myths, and we flag those too. The few quotes are short and sourced.

## In one paragraph

Alan Turing was an English mathematician who worked out, in 1936, what it means for a task to be done by a mechanical method [S2]. He imagined a simple machine that reads and writes symbols on a tape, and showed that one such machine could do the work of any other if you gave it the right instructions [S2][S5]. During the Second World War he led the attack on German naval Enigma at Bletchley Park and designed the bombe, a machine that sped up codebreaking [S3]. After the war he designed one of the first stored-program computers [S3][S4]. In 1950 he asked whether machines can think, and swapped that vague question for a test anyone could run [S1]. He was prosecuted in 1952 for a relationship with a man and died in 1954, aged 41 [S3].

## Core ideas

### Break a process into the smallest steps

Turing started from a person doing a sum with pencil and paper. He noted that the person can only look at a few symbols at a time and can only be in a limited number of states of mind, because human memory is limited [S2]. Each step is very simple: change one symbol, or move to a nearby square [S2]. If you strip a method down this far, a machine can follow it [S5]. This is what he meant by "computable": numbers whose digits can be worked out by such finite means [S2].

How he applied it: his definition came from studying how a human calculator works, not from any existing machine. That is one reason it has lasted [S5].

### One machine can do every job

In the same paper Turing described a single "universal" machine. Give it a coded description of any other machine, and it will do what that machine does [S2]. The idea is that instructions are just more data. Hodges notes that Turing saw this as the principle behind the stored-program computer [S4].

How he applied it: in 1946 he presented a detailed design for a stored-program computer, the Automatic Computing Engine, at the National Physical Laboratory [S3]. He argued that much of the work could be done by programs rather than extra hardware, and he saw early how much would depend on writing instruction tables [S4][S5].

### Some questions have no mechanical answer

Turing used his machines to answer a famous question from the mathematician David Hilbert. Is there a general method that decides whether any statement in logic can be proved? Turing showed there is not [S2][S5]. He did it by showing that no machine can always tell in advance whether another machine will ever print a certain symbol [S2]. Alonzo Church reached a similar result at about the same time [S3].

How he applied it: the result sets a hard limit for anyone building tools. Some checks can never be fully automated, so a good plan aims at the cases that can be decided.

### Swap a vague question for a test

The 1950 paper opens by asking whether machines can think [S1]. Turing said the words "machine" and "think" are too loose to argue about. So he replaced the question with a game. An interrogator types questions to two hidden players and tries to tell which is which. Then ask: could a machine play well enough to fool the interrogator? [S1] The test keeps out looks and voice and focuses on what the player can do [S1].

How he applied it: he made a dated, numbered prediction. In about fifty years, he thought, a computer with about 10^9 units of storage would leave an average interrogator with no more than a 70 per cent chance of being right after five minutes [S1].

### Answer every objection on its own terms

Turing listed nine objections to thinking machines and answered each one in turn, from religion and fear to mathematics, consciousness and "Lady Lovelace's objection" [S1]. He was blunt about weak ones. He said he was not impressed by theological arguments, and he suggested that people who feared the idea needed comfort more than argument [S1]. He was also honest about his own case. He admitted he had no very convincing positive arguments, only replies to the other side [S1].

How he applied it: Lovelace had written that the Analytical Engine could only do what we know how to order it to do [S1]. Turing restated her point as "a machine can never take us by surprise", then replied that machines surprised him often [S1].

### Teach a machine like a child

Turing thought it might be easier to build a machine like a child's mind and then educate it, rather than write an adult mind directly [S1]. Teaching would use rewards and punishments, plus some random choices [S1]. He expected the first child machine to fail and said you would have to try many [S1]. In a 1947 lecture he argued that a machine need not be perfect to be intelligent, since human mathematicians make mistakes too [S5].

How he applied it: his 1948 report on "intelligent machinery" described networks of simple units that could be trained, and a kind of evolutionary search. Hodges links these ideas to later neural networks and genetic algorithms [S5]. The report was not published in his lifetime [S4].

### Use machines and statistics against a huge search

Enigma settings gave codebreakers an enormous number of options to test. Within weeks of arriving at Bletchley in September 1939, Turing specified the bombe, which improved on a Polish machine called the bomba [S3]. It used guessed words in a message to rule out most settings fast. He also invented Banburismus, a statistical method, to attack naval Enigma [S3].

How he applied it: the first bombe was installed in March 1940, and more than 200 were working by the end of the war [S3]. In October 1941 Turing was the first name on a letter to Winston Churchill asking for more staff and resources, and Churchill ordered quick support [S3].

### Let simple rules explain nature

Late in his life Turing asked how a living thing gets its pattern, such as spots, stripes or the spiral of leaves on a stem. In a 1952 paper he showed that two chemicals reacting and spreading at different rates can turn an even mixture into a pattern [S3][S4]. He used early computers to test the idea [S4].

How he applied it: the work has influenced later research on animal coat patterns and other shapes in biology [S3].

## His own terms and rules

### Fair play for the machine

In the 1947 lecture he argued that a machine expected to be infallible cannot also be intelligent. A human mathematician makes blunders when trying new methods, and we give him another chance. The machine, he said, would probably be allowed no mercy. He asked for fair play when testing a machine's intelligence [S8].

### Masters and servants

He described the people who would work with the computer as masters, who plan the instruction tables and think up deeper ways to use it, and servants, who feed it cards, mend it and gather data. He expected the machine to take over both roles in time [S8]. He warned that masters might guard their jobs behind mystery and empty jargon when someone suggested automating them, and called that reaction a real danger [S8].

### A machine process is a rule of thumb

He said that his earlier theory had led to the conclusion that a "rule of thumb" process and a "machine process" are the same thing [S8].

### Memory is the key problem

He said he had spent much of the lecture on memory because proper storage is the key problem of the digital computer, and a big memory matters more than fast multiplication. Speed pays commercially, but capacity decides whether the machine can do more than trivial work [S8].

### A working rule for jobs

His rule of thumb was that the machine could do any job a human computer could do in about one ten-thousandth of the time. He added that the estimate fails for jobs too small to be worth giving to it [S8].

### Errors need proofs, not only common sense

A human computer can use common sense to judge how accurate an answer is. With a computer you cannot, so the bounds on error must come from proved inequalities. Repeating a job with different rounding gives statistical estimates, which he said can help the analyst but not replace one [S8].

### Say your model is false, then say which parts you kept

In 1952 he called his model of the growing embryo a simplification and an idealization, and so a falsification, and hoped the features kept were the most important ones for current knowledge [S9]. He picked the cases where the chemical side mattered and the mechanical side could be set aside, because the problem was otherwise too hard [S9]. He admitted the biological examples were few, and said the imaginary systems and principles should help in reading real forms [S9].

### Use the computer when the maths runs out

He wrote that for cases where theory could not go on, a digital computer could handle particular cases without as many simplifying assumptions. Its cost was that you only get results for particular cases, which he judged of little importance [S9]. He said that even for the ring problem, which was solved by maths, working a particular case by computer was most illuminating [S9].

## How he decides

- Start from what a person actually does, step by step, then ask if a machine could do it [S2][S5].
- Replace a word you can't define with a test you can run [S1].
- Put a number and a date on a prediction [S1].
- List every objection, including the silly ones, and answer each [S1].
- Admit where your positive case is weak [S1].
- Try more than one route when you don't know which will work. On whether to teach a machine chess first or give it senses and teach it English, he said both should be tried [S1].
- Expect early versions to fail, and plan to try again [S1].
- Ask what a problem's structure lets you rule out, so the search shrinks [S3].

## Real decisions

### Defining "computable" from a person at a desk (1936)
In the 1936 paper he admits the definition cannot be proved, only argued: all such arguments are appeals to intuition, and the real question is what processes can be carried out in computing a number [S2]. He set aside the two-dimensional page of arithmetic and kept a one-dimensional tape of squares with a finite set of symbols. Long numbers count as many symbols, because we cannot tell at a glance whether two long strings of nines are the same, and a limited memory justifies finitely many states [S2]. He gives three kinds of support: an appeal to intuition, a proof that two definitions agree, and examples of large families of computable numbers [S2].

### Describing every machine as a number (1936)
He gave each machine a description number so a single universal machine could read any other machine's table and do its work. That let him build the diagonal argument that some questions cannot be answered by any machine [S2].

### Putting the fussy details in the instructions, not the circuits (1946 to 1947)
In the 1947 lecture on the ACE he describes how the machine handles awkward jobs, such as converting between decimal and binary, by adding a couple of memory lines and feeding in the right instructions. Normal engineering practice, he says, would call for special circuits [S8]. His stated reason is that such details can be dealt with by pure paper work [S8].

### Betting on memory over speed (1947)
He argued that a large memory available at short notice mattered more than fast operations such as multiplication, because speed makes a machine commercially valuable but capacity lets it do anything beyond the trivial [S8]. He judged the 200,000 digits possible on mercury delay lines to be about the capacity of a minnow's memory [S8].

### Using a guessed word at Bletchley (1939 to 1945)
The wartime Ultra effort used statistics and likely words in messages to narrow the huge number of settings to try [S5][S7].

### Choosing teaching over writing it all out (1947 and 1950)
In 1947 he imagined a machine whose instruction tables could change themselves, so that after some time they would be unrecognisable but still doing worthwhile work. He compared it to a pupil who had learnt from a master and added much more, and said he felt one must then call the machine intelligent [S8]. He added that beating an average player at chess by fixed rules would not count for much, because what he wanted was a machine that learns from experience [S8]. In 1950 he proposed building a child machine and teaching it, not coding adult thought by hand [S1].

### Putting a game in place of "can machines think?" (1950)
He said the question was too loose and replaced it with an imitation game [S1][S6].

### Calling his own model false before using it (1952)
In his paper on morphogenesis he said up front that his model of a growing embryo was a falsification, kept to a few chemical features, and used a ring of cells because it was mathematically convenient though biologically unusual [S9]. He studied only the point where a uniform mixture first becomes unstable, and noted that most of an organism, most of the time, is changing from one pattern to another, which his theory did not cover [S9].

## Where he stood

**Can machines think?** He thought the question was too vague to answer as asked. But he believed that by about 2000, people would speak of machines thinking without being contradicted [S1].

**Can a machine ever do something new?** He thought so. He treated "never does anything new" as a variant of Lovelace's objection, and answered that machines often surprised him [S1].

**Is there a method that settles every question in logic?** No. He proved that no general mechanical method can decide them all [S2][S5].

**Should a computer be built around hardware or programs?** Programs. His 1946 design showed that arithmetic and much else could be done by instructions [S4].

**Must an intelligent machine be infallible?** No. People make mistakes and are still called intelligent [S5].

## His work and record

- Born on 23 June 1912 in London [S3].
- Studied mathematics at King's College, Cambridge, from 1931 to 1934, and became a Fellow in 1935 [S3].
- Finished "On Computable Numbers" in May 1936. It was published in late 1936 [S3].
- Took a PhD at Princeton under Alonzo Church in 1938 [S3].
- Joined Bletchley Park on 4 September 1939 [S3]. Led Hut 8 on naval Enigma until Hugh Alexander took over in 1943 [S3].
- Made liaison trips to the United States in 1942 and 1943 [S4].
- Appointed OBE in 1946, though his war work stayed secret [S3].
- Presented the design of the Automatic Computing Engine in 1946. A smaller Pilot ACE first ran a program on 10 May 1950 [S3].
- Moved to the University of Manchester in 1948 and worked on its early computers [S3][S4].
- Published "Computing Machinery and Intelligence" in 1950 [S1].
- Elected a Fellow of the Royal Society in 1951 [S4][S5].
- Wrote a chess program with D. G. Champernowne. With no computer able to run it, it was played by hand in 1952 and lost [S3].
- Published "The Chemical Basis of Morphogenesis" in 1952 [S3].
- Prosecuted in 1952 for a relationship with a man. He accepted hormone treatment to avoid prison and lost his security clearance [S3][S5].
- Died at home in Wilmslow on 7 June 1954, from cyanide poisoning [S3].
- The UK government apologised in 2009, and he received a royal pardon in 2013 [S3]. His face appeared on the Bank of England £50 note in 2021 [S3].

## Where he was wrong or criticised

- **The test itself.** In 1980 the philosopher John Searle argued that a program could pass by shuffling symbols with no understanding. Others say the test rewards fooling people and depends too much on the judge [S6].
- **The prediction.** No machine met his benchmark by 2000. In a study first reported in 2025, GPT-4.5 was judged human 73 per cent of the time in five-minute chats when told to play a persona [S6]. Whether that counts as thinking is still argued.
- **Getting things built.** Delays at the National Physical Laboratory frustrated him, and he left for Cambridge in 1947. The full ACE was not built until after his death [S3]. Hodges says he had little say over the engineering [S4].
- **Blind spots in his own work.** In his 1935 fellowship dissertation he proved a result on probability without knowing Jarl Lindeberg had proved it in 1922 [S3]. He was dismissive of the US Navy's bombe programme [S3].
- **Myths about him.** He did not design Colossus, though his ideas influenced it [S3]. A popular claim that Churchill called his work the biggest single contribution to victory has no documentary evidence [S3].
- **How much the war was shortened (disputed).** The official historian Harry Hinsley estimated the war would have lasted two to four years longer without the codebreaking [S3][S7]. John Keegan argued it might have been as little as three months, and Guy Hartcup said it can't be calculated [S7]. Codebreaking was a team effort by thousands of people.
- **His death (disputed).** The inquest found suicide [S3]. His mother believed it was an accident with lab chemicals. Jack Copeland argued accidental breathing of cyanide fits the evidence better. John Dawson said murder should not be ruled out [S3]. Hodges thinks it was most likely self-inflicted [S5].

## Blind spots to watch

- He worked alone a lot and liked his own methods over the usual ones [S5]. That gave him originality, but a council should add someone who ships products with a team.
- He trusted logic and clean definitions. Messy human questions, like what people want or feel, need other minds.
- His imitation game measures how human a reply seems. It can reward a smooth bluff over a true answer [S6].
- He wrote about machines, not about the harm they might do. Pair him with someone who thinks about fairness and risk.
- His war role is often told as a solo story. Remember the teams, the Polish codebreakers and the operators who ran the machines [S3].

## Short phrases on the record

- "I propose to consider the question, 'Can machines think?'" (1950) [S1]
- "Machines take me by surprise with great frequency." (1950) [S1]
- "the human memory is necessarily limited" (1936) [S2]
- "fair play must be given to the machine" (1947 lecture) [S8]
- "We can only see a short distance ahead" (1950) [S1]
