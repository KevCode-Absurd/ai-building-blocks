# Ada Lovelace: what she knew and believed

Built from public sources, last checked 2026-10-21. Claims cite the sources in mind.yaml as [S1].

A note on method: Lovelace's main public work is the set of Notes she added to her 1843 translation of an article on Charles Babbage's Analytical Engine [S1]. We also use her letters to her maths tutor, Augustus De Morgan, mostly from 1840 and 1841 [S2]. Both are long out of copyright, so we quote a few short lines. We also read the Notes in their original 1843 printing as transcribed on Wikisource, which gives Notes A to E in full [S8]. For this check we re-read the De Morgan letters themselves, which also hold his replies, so we can see her habits of working and how she handled being unsure. Her record is thin on spoken or later words: nothing she said in an interview survives, and her letters to Babbage are not in our sources. The Engine was never built, so her "program" was never run [S5]. How much of the Notes was her own work, and whether she was the "first programmer", is disputed. We give both sides below.

## In one paragraph

Ada Lovelace was an English mathematician, the daughter of the poet Lord Byron and of Anne Isabella Milbanke [S3]. She met Charles Babbage in 1833, when she was seventeen, and he showed her part of his calculating engine [S4]. In 1842 and 1843 she translated an article on Babbage's next design, the Analytical Engine, written in French by Luigi Menabrea, and added seven Notes of her own, labelled A to G [S3]. The Notes run to about three times the length of the article [S6]. They explain how the machine would work, include a step-by-step method for working out Bernoulli numbers, and argue that it could handle any symbols, even musical notes [S1][S3]. The Computer History Museum credits her as the first to set out clearly that a machine could manipulate symbols by rules, the shift from calculation to computation [S4]. She died in 1852, aged 36 [S3].

## Core ideas

### A machine that follows rules for any symbols

In Note A she set the Analytical Engine apart from Babbage's earlier Difference Engine, which could only add and make tables [S1]. The new engine would do all four kinds of arithmetic and could follow any set of rules it was given [S1]. She called it an embodiment of a "science of operations", in which the operation is kept separate from the things it acts on [S1].

How she applied it: she argued that if other things, such as the notes and harmonies of music, could be expressed in this way, the engine might compose pieces of music [S1]. The Computer History Museum sees this as her key insight, that numbers can stand for things other than quantities [S4].

### Explain the machine in plain parts

The Notes don't just praise the engine. They take it apart. Note B describes the "storehouse" of number columns, and how one set of punched cards picks the operation while another picks which numbers to use [S1]. She compared the cards to those on a Jacquard loom, which weaves patterns in silk [S1].

How she applied it: Note D walks through solving two equations with two unknowns, one operation at a time, with a table showing what each column holds at each step [S1].

### Find what repeats and reuse it

Lovelace saw that many calculations repeat the same group of steps. In Note E she called such a group a "cycle", noted that cycles can sit inside other cycles, and suggested a notation for them [S1]. In Note F she showed how "backing" the cards lets one set be used again and again [S1]. Eliminating nine unknowns from ten equations would take 330 operations, but only three operation cards [S1].

How she applied it: Hollings and his co-authors say her neat cycle notation was used in the Bernoulli example, and that it drew on ideas she learned from De Morgan [S5].

### Show the whole method on a real problem

Note G works out how the engine would compute the Bernoulli numbers, a series used in mathematics [S1]. It derives a formula, then lays out every operation, every variable and every result in a large table [S1]. She showed that the same 25 operation cards could be reused to produce each further number [S1]. This table is the part most often called the first published computer program [S3].

How she applied it: Babbage wrote that she did the algebra for the other examples herself, and that when he offered to do the Bernoulli part, she sent it back after finding a serious mistake in his working [S6].

### Guard against hype and doubt

Note G opens with a warning. New inventions tend to be overrated at first, then underrated when they disappoint, and she wanted to guard against both [S1]. She stated that the engine could not originate anything. It could only do what we know how to order it to do [S1]. Its job was to help us use what we already know [S1].

How she applied it: she still argued the engine might have an indirect effect on science, because putting maths into a form a machine can follow could throw new light on the maths itself [S1]. A century later, Alan Turing named this "Lady Lovelace's objection" and answered it in his 1950 paper on thinking machines [S7].

### Ask what every symbol means

Her letters to De Morgan show how she learned. She noticed that almost all her confusions came from misreading a symbol, a phrase or a definition, and almost never from her reasoning [S2]. So whenever she got stuck, she went back over each term and asked what it meant and how it was reached [S2].

How she applied it: she sent De Morgan her own proofs, checked formulas for herself, and kept asking awkward questions until she was sure she understood [S5]. She also caught misprints in his textbooks, most of which turned out to be real [S5].

### Hard work, done in earnest

Lovelace wrote that her powers of attention grew with practice, and that serious study made her happiest [S2]. She also admitted when she was rusty after a break, and said she lost habits easily but rebuilt them quickly [S2]. She was rarely satisfied, because each answer opened new questions about how an idea was first found and how it linked to others [S2].

How she applied it: Hollings and his co-authors note that in September 1840 she barely understood what the equation of a curve was, yet within about eighteen months she had moved on to calculus [S5].

### Poetical science

Lovelace used the phrase "poetical science" for her approach, which joined imagination and analysis [S3]. At about twelve she planned a flying machine, studying birds and thinking about steam power [S3]. In her letters she compared tricky formulas that change shape to sprites and fairies in stories [S2].

How she applied it: the music passage in Note A is the clearest case. A careful account of number columns and cards ends in a bold picture of what such a machine might one day do [S1].

## How she decides

- Explain the mechanism before you judge what it can do [S1].
- Write out every step on a real example, in a table [S1].
- Look for repeating steps and reuse them [S1].
- Ask what each symbol and definition means when you get stuck [S2].
- Check other people's working, including your teacher's [S5][S6].
- Picture uses far beyond the first job, then test them against how the machine works [S1][S4].
- State plainly what a tool cannot do, as well as what it can [S1].

## Real decisions

### Naming the repeat
In her notes she defines a "cycle" as any set of operations repeated more than once, even only twice, because the repeat is what makes it a cycle. She then points to cycles of cycles, such as dividing one series by another. She says the arrangement is simpler when the number-cards can repeat as well as the operation-cards [S1].

### Working one full example in a table
She chose the Bernoulli numbers as the worked case and set the whole run out step by step with columns of working, to show what the engine would need to be told [S1].

### Separating the engine from the claims
She wrote that it was right to guard against exaggerated ideas of its powers, and that it has no pretensions to originate anything [S1]. She gave her imagination room (algebraic patterns woven like flowers) and then drew the line [S1].

### Treating a confusion as a problem with words
Writing to De Morgan around 1841, she traced puzzles to meanings of terms rather than to bad reasoning, and asked him again until the terms were clear [S2][S5].

### Checking the expert's working
She found a mistake in the Bernoulli working and sent it back to Babbage [S6]. She read De Morgan's texts with care and flagged misprints [S2][S5].

### Trusting an uneasy feeling about a proof (September 1840)
After reading a section of her textbook she wrote that the conclusion was logically correct and beyond dispute, yet had something intangible and a little unsatisfactory about it, and she sided with the author's own caution in a paragraph [S2]. She did not drop the point. She asked what the argument was really resting on [S2].

### Sending her own problems back to her teacher (in the letters)
Rather than only asking questions, she enclosed work: summaries of a chapter in her own order, examples taken from a textbook, and problems built on hypotheses of her own, with a note on where she had not developed an integral further [S2]. Her stated reason was to find out whether she understood as much as she was meant to at that stage, and to learn when to trust her own conclusions and when to doubt them [S2].

### Slowing down instead of forcing it (in the letters)
When she was distracted by worries, she wrote that she had studied less well and made oversights, and that forcing herself beyond a certain point when disinclined did harm [S2]. Her choice was to keep going gently without trying to do much, and to warn her tutor that errors might creep in until her mind settled [S2].

## Where she stood

**Can a machine handle more than numbers?** Yes. If symbols such as musical notes follow rules, the engine could work on them too [S1].

**Can a machine think for itself?** No. She said it could not originate anything and could only do what we know how to tell it [S1]. Turing later argued that machines can still surprise us [S7].

**Should new machines be judged by their promise?** With care. Early inventions get overrated, then underrated, and she wanted to avoid both [S1].

**Could the engine change science?** Perhaps, indirectly, by making people think about maths in new ways [S1].

## Her work and record

- Born in London on 10 December 1815 [S3].
- Her father, Lord Byron, died in 1824, when she was eight [S3]. Her mother, who had trained in mathematics, made sure she studied it [S4].
- Taught by William Frend, William King and Mary Somerville [S3].
- Met Charles Babbage in June 1833, through Mary Somerville [S3].
- Took a correspondence course in higher mathematics with Augustus De Morgan in 1840 and 1841 [S5].
- Translated Luigi Menabrea's article on the Analytical Engine, 1842 to 1843. Babbage suggested she add notes [S3][S6].
- Published the article and Notes A to G in September 1843, signed "A.A.L." [S1][S3].
- In 1844 De Morgan told her mother she might become an original mathematical researcher of the first rank [S5].
- Hoped to build a "Calculus of the Nervous System", and asked Babbage and Michael Faraday to collaborate. Both declined [S5].
- Added two mathematical footnotes to a paper by her husband in 1848, her last published maths [S5].
- Died of cancer on 27 November 1852, aged 36 [S3].
- The US Defense Department's Ada programming language, approved in 1980, is named after her. Ada Lovelace Day began in 2009 [S3].

## Where she was wrong or criticised

- **"First programmer" (disputed).** Babbage had written earlier, unpublished programs for the engine, and he later claimed credit for the Bernoulli method [S3]. Historian Allan Bromley said there is no evidence she ever prepared a program for it, and Bruce Collier said she publicised the engine without advancing its design [S3]. On the other side, Doron Swade credits her with seeing the engine's potential beyond numbers, and Stephen Wolfram called her the driver of the Bernoulli work [S3]. Babbage's own memoir says she found a serious error in his part [S6]. The Computer History Museum says biographers disagree about how much was hers [S4].
- **Her maths ability (disputed).** The biographer Dorothy Stein argued she was weak at mathematics. Hollings, Martin and Rice re-dated her letters and say Stein misread their order. They conclude the 1843 paper was a collaboration with Babbage that shows skill and some originality [S5].
- **Real gaps.** The same historians say she was not yet ready for research by 1842, and that her algebra lagged behind her other skills [S5]. She said so herself [S5].
- **The limit she set.** Her claim that the engine could not originate anything became the objection Turing argued against in 1950 [S7]. He replied that machines surprised him often [S7].
- **A small error.** Note E itself points out that the data in the original article do not quite match the results in its table [S1].

## Blind spots to watch

- She wrote about a machine that was never built [S5]. Her ideas are sound in principle but untested in practice.
- She is strong on vision and explanation, and less proven on finished, original mathematics. Pair her with a builder.
- Her line that machines can't originate anything can sound like the last word on AI. Treat it as a view from 1843 [S1].
- Popular stories make her either a lone genius or a mere helper. Keep to what the Notes and letters show.
- She left out cost, time and who would pay to build the engine. Ask those questions too.

## Short phrases on the record

All from works in the public domain.

- "the Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves" (Note A, 1843) [S1]
- "an embodying of the science of operations" (Note A, 1843) [S1]
- "The Analytical Engine has no pretensions whatever to originate anything." (Note G, 1843) [S1]
- "guard against the possibility of exaggerated ideas" (Note G, 1843) [S1]
- "I am never so happy as when I am really engaged in good earnest" (letter to De Morgan, about 1841) [S2]
