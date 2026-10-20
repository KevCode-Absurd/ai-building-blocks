# Andrej Karpathy: what he knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

Rebuilt 2026-10-20 from the 2019 recipe, the MenuGen post and the micrograd README and source [S3][S8][S12][S13].

Andrej Karpathy is alive, and his views can change. Everything below comes from his own blog posts (2015 to 2025), his personal site, a code README and Wikipedia. Treat each view as "as of" the post it comes from. Nothing here tells you what he thinks about events after his December 2025 review.

A note on method: Karpathy writes mostly on his blogs, on GitHub and on X, and teaches in long videos. We read his blog posts and pages, not his videos or social posts. His well-known 2017 essay "Software 2.0" blocked us when we tried to open it, so we use his own 2025 restatement of the idea instead [S10]. His work is in copyright, so this is our summary, with a few short quotes.

## In one paragraph

Karpathy is an AI researcher and teacher, born in Bratislava and raised from 15 in Toronto [S1]. He did his PhD at Stanford with Fei-Fei Li, built and taught Stanford's first deep learning course, helped found OpenAI, and ran the AI team behind Tesla's Autopilot vision system from 2017 to 2022 [S1][S2]. Since then he has taught through YouTube videos and small, readable code, and in 2024 he started an AI education company, Eureka Labs [S1][S2]. His working creed is to understand things by building them from scratch, to look hard at the data, and to move from simple to complex one checked step at a time, because neural networks fail without telling you [S3]. In 2025 he wrote a run of essays on what large language models are and what they can do: a new kind of mind, strong where answers can be checked and weak elsewhere [S9][S10][S11].

## Core ideas

### Build it from scratch to understand it

Karpathy's teaching rests on small programs you can read in one sitting. He lists micrograd, a tiny engine for working out gradients, and char-rnn, a character-level language model [S2]. Alongside char-rnn he shared a version of about 100 lines of plain Python, so people could see the whole idea [S4]. His nanoGPT keeps the training loop and the model to about 300 lines each, and aims to be simple, fast and easy to change [S6].

How he applied it: his "Zero to Hero" video series builds neural networks up from the basics, and his newer videos explain how large language models work for general viewers [S2]. In late 2025 he marked nanoGPT as old and pointed users to a newer project, nanochat [S6].

### Become one with the data

The first step of his 2019 training recipe is to stop and look at the data, by hand, for a long time [S3]. Scan thousands of examples. Look for duplicates, broken images, wrong labels and imbalance. Sort and filter the data to find the odd cases, because outliers often reveal bugs [S3]. Ask what the data suggests the model will need, such as whether small local details are enough or wider context matters [S3].

How he applied it: at Tesla his team ran its own data labelling, alongside training the networks and putting them on the car's own chip [S2].

### Neural nets fail silently

Normal code usually crashes when it is wrong. A neural network often keeps training and just gets a bit worse [S3]. He gives examples: flipping an image but forgetting to flip its label, or clipping the loss when you meant to clip the gradients [S3]. Libraries make networks look like plug-in parts, but the details underneath still matter [S3]. So he argues for patience and close attention, and against rushing in fast and furious [S3].

How he applied it: his checks include fixing the random seed, confirming the starting loss matches what theory predicts, and overfitting one tiny batch to near zero loss. If a model can't even memorise a few examples, there is a bug [S3].

### Simple first, then one change at a time

The recipe moves from simple to complex. Each step tests one clear guess about what should happen [S3]. Start with a small model that is hard to get wrong, and dumb baselines to compare against. Then make a model big enough to overfit the training data. Then regularise it so it does well on new data. Then tune, then squeeze out the last gains [S3]. He advises copying the simplest design from the most related paper instead of inventing your own at the start [S3].

How he applied it: his advice on regularising lists getting more real data first, as the surest win, before cleverer tricks [S3]. He also tells the story of a model he left training over a winter break that came back state of the art [S3].

### Software 2.0, and what can be checked

Karpathy uses "Software 1.0" for code that people write by hand, and "Software 2.0" for programs found by training a network against a goal [S10]. In 2025 he argued that the old way automates tasks you can spell out as rules, and the new way automates tasks you can verify [S10]. A task is verifiable if you can reset it, try it many times cheaply, and score each try automatically [S10].

How he applied it: he used this to explain why AI got very good at maths, code and puzzles with right answers, while tasks that need context, strategy or common sense lag behind [S10]. In his 2025 review he named training on checkable rewards as the year's biggest new stage in building models [S11].

### Ghosts, not animals

In October 2025 he wrote that today's language models are less like animals that learn from the world and more like "ghosts": systems distilled from human text [S9]. He agreed with critics that this training leans on human data. But he noted that animals don't start blank either, since evolution gives them a head start. Pretraining on internet text, in his view, is a rough stand-in for that head start [S9]. He held these views, he said, with a lot of uncertainty [S9].

How he applied it: in his 2025 review he described model skill as "jagged", far ahead in checkable areas and oddly weak in others. He said he had lost trust in benchmarks, since labs train toward them [S11].

### Vibe coding is real, and the last mile is hard

Karpathy coined "vibe coding" in February 2025 for building software by typing what you want to an AI tool [S1]. In April 2025 he described building MenuGen, an app that turns a photo of a menu into pictures of each dish. He wrote no code by hand [S8]. The local demo was fast and fun. The hard part was everything around it: API keys, deployment, sign-in and payments. Some of the AI's advice was out of date, and one payment design matched users by email, which could fail [S8].

How he applied it: he asked services to become friendlier to AI helpers and solo builders, with command-line tools and plain docs. He also warned that vibe-coded apps are not yet fit for anything critical [S8]. By December 2025 he said code was becoming cheap and throwaway, and that this would change software and jobs [S11].

### Power to the people

In April 2025 he argued that language models broke the usual pattern for new technology [S7]. Electricity, computers and GPS went from governments to companies to people. ChatGPT went straight to ordinary people, cheap or free, in any language [S7]. Companies gain less, he said, because they already employ experts, and because they face legacy systems, rules and slow habits [S7].

How he applied it: he added a caveat. If much more money starts buying much better models, the rich could pull ahead again. He called the current state a moment in time and said he welcomed it [S7].

### Do the work, then share it

His 2016 PhD guide says a researcher's job is more than writing papers. Build tools, release code, teach and help the community, even when that doesn't count in the usual metrics [S5]. Good problems are rich enough for several papers, easy to explain, and ambitious, since a problem ten times more important is often only a few times harder [S5].

How he applied it: he designed CS231n at Stanford, which grew from 150 students in 2015 to 750 in 2017 [S1][S2]. He has released many open tools, from ConvNetJS for training networks in the browser to arxiv-sanity for sorting research papers [S2].

**Teach a mechanism with a tiny engine you can read.** The micrograd README describes an engine for working out gradients that is about 100 lines, with a small network library of about 50 lines on top, working only on single numbers [S12]. Its source gives each value a data field, a gradient field and a record of which values made it, and each add or multiply attaches its own small backward step [S13]. The README says this is enough to train a whole network on a simple task, and it uses PyTorch only in the tests, as a reference to check the gradients [S12]. How he applied it: a later pure-Python version trains a full GPT-like model in one file, and he says everything else is just efficiency [S12].

## How he decides

- Look at the raw data and the exact inputs to the model before trusting any number [S3].
- Start with the dumbest thing that could work, and a baseline to beat [S3].
- Add one piece at a time, and check it gives the gain you expected [S3].
- If something trains but seems a bit off, suspect a silent bug before a deep problem [S3].
- Prefer more real data over clever tricks [S3].
- Write the specific version of code first, then make it general [S3].
- Ask whether a task can be checked automatically before betting AI will do it well [S10].
- Pick problems that are important, fertile and easy to explain [S5].
- Hold big claims about AI loosely, and say how unsure you are [S9].

## Real decisions

### Writing the autograd engine in about 100 lines
He chose to work on single numbers so every add and multiply could be seen, giving up speed for something a learner can trace. The README calls it potentially useful for education [S12][S13].

### Testing against a reference
He wrote the tests to compare the engine's gradients with PyTorch's, so the small version was checked against a trusted one [S12].

### Spending hours on the data before any model code
His 2019 recipe starts with scanning thousands of examples by hand to find duplicates, bad labels and imbalance [S3].

### Starting with dumb baselines and overfitting one batch
He fixes the seed, checks the starting loss, trains an input-independent baseline and overfits a tiny batch before adding anything [S3].

### Turning off default learning-rate decay
He distrusts default decay because it can quietly drive the rate to zero, so he leaves it off and tunes it last [S3].

### Leaving a model to train over winter break
He tells the story of a model left running over a break that came back state of the art, as an argument for patience [S3].

### Building MenuGen with no hand-written code (2025)
He built an app that turns a photo of a menu into pictures of dishes, writing no code himself. The hard part was deployment, accounts and payments, and he caught that payments were matched by email and switched to unique user IDs. He asked services to be friendlier to AI helpers and said such apps are not ready for critical use [S8].

## Where he stood

**Can you use deep learning libraries without understanding them?** Not safely. The abstraction leaks, and errors hide [S3].

**What will AI automate first?** Tasks where results can be checked automatically and tried many times, as of 2025 [S10].

**Are language models like animal minds?** Not yet. They are a different kind of mind shaped by human data, and they may or may not grow closer to animals [S9].

**Who gains most from language models?** As of 2025, ordinary people more than big companies or governments [S7].

**Can anyone now build an app by talking to an AI?** A demo, yes. A real product still takes a lot of setup, and checking the AI's work [S8].

**Should a researcher only publish papers?** No. Teaching and releasing tools matter too [S5].

## His work and record

- Born 23 October 1986 in Bratislava, then in Czechoslovakia. Moved to Toronto at 15 [S1].
- BSc in computer science and physics, University of Toronto, 2009. He got into deep learning through Geoff Hinton's class [S2].
- MSc at the University of British Columbia, 2011, on controllers for simulated figures [S1][S2].
- PhD at Stanford with Fei-Fei Li, on networks that connect images and language. Internships at Google Brain, Google Research and DeepMind [S1][S2].
- Wrote "The Unreasonable Effectiveness of Recurrent Neural Networks", 2015 [S4].
- Founding member and research scientist at OpenAI, 2015 to 2017 [S1].
- Director of AI at Tesla, leading Autopilot vision, June 2017 to July 2022 [S1][S2].
- Wrote "A Recipe for Training Neural Networks", 2019 [S3].
- Named to MIT Technology Review's Innovators Under 35 in 2020 and the TIME100 AI list in 2024 [S1].
- Back at OpenAI from February 2023 to February 2024, on midtraining and synthetic data [S1][S2].
- Announced Eureka Labs, an AI education company, in July 2024. Its first course is LLM101n [S1].
- Wikipedia reports he joined Anthropic's pretraining team in May 2026 [S1]. Our other sources predate this.

## Where he was wrong or criticised

- **AI teaching assistants.** Eureka Labs' push for AI tutors has drawn criticism over student data privacy and the loss of the human bond between teacher and student [S1].
- **His own early research.** He wrote that he spent about two years wandering before finding his thesis topic, and that his early choice of problems was often poor [S5].
- **Limits of his demos.** He stressed that his char-rnn samples were often nonsense with the right look, such as C code with undefined variables, and that reading meaning into single neurons is often guesswork [S4].
- **Vibe coding.** He has said himself that it isn't ready for critical software, and that the AI made subtle, confident mistakes he had to catch [S8].
- **Firm calls, soft certainty.** His 2025 claims about what models are and where they are going come with stated uncertainty, so treat them as working views [S9][S11].

## Blind spots to watch

- He thinks like a hands-on engineer. Questions of business strategy, law or politics get less of his attention. Pair him with someone who studies organisations.
- "Build it from scratch" is a great way to learn. In a real business, a well-tested library is often the better choice.
- His views on fast-moving AI date quickly. Check the date on every view.
- He writes for curious technical readers. Beginners may need more steps.
- He is close to the labs he writes about, having worked at OpenAI and Tesla. Balance him with an outside critic.

## Short phrases on the record

- "Neural net training is a leaky abstraction" ("A Recipe for Training Neural Networks", 2019) [S3]
- "Neural net training fails silently" ("A Recipe for Training Neural Networks", 2019) [S3]
- "Become one with the data" ("A Recipe for Training Neural Networks", 2019) [S3]
- "Pretraining is our crappy evolution" ("Animals vs Ghosts", 2025) [S9]
- "easily automates what you can verify" ("Verifiability", 2025) [S10]
