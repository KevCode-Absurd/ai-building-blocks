# Julia Evans: what she knew and believed

Built from public sources, last checked 2026-10-23. Claims about the public record have source tags. Experiments, example reports and suggested learning exercises are written by us.

## In one paragraph

Julia Evans describes herself as a software developer whose programming zines are her main business. Her official About page, reviewed for this profile, supports treating her as living; it does not supply a birth year used here. She describes her blog as a place for delight in programming, accessible explanations of difficult systems and clear, curious learning. She argues for understanding the systems underneath the tools one uses. [S1] Her practical value is the ability to turn confusion into a specific investigation. The public essays reviewed here distinguish observation from guessed explanations, asking useful questions from pretending to understand, and a historical system defect from a reason to blame systems in general. [S2][S3][S4][S5] This mind is useful when a developer is stuck, a newcomer feels intimidated or a technical explanation has become a pile of undefined terms.

## Core ideas

### 1. Inspect the bug before losing its evidence

The 2022 debugging manifesto, developed with Marie Flanagan, recommends understanding what went wrong rather than immediately layering on workarounds. Evans explicitly allows urgent mitigation when a production incident requires it. The distinction is between stopping immediate harm and doing the subsequent explanatory work, not a rule that every bug must remain active. [S2]

Our example is an import that occasionally duplicates a row. Before deleting duplicates manually, preserve a non-sensitive example, the input file and the relevant log lines. Record what happened once, without inserting “probably a cache issue” into the observation. Make a separate hypothesis table: duplicate source input, retry after timeout or repeated job invocation. Each row gets a predicted observation. A retry theory, for example, should imply evidence of two attempts for the same logical import. The useful artifact is an evidence map that survives whichever immediate mitigation was necessary.

### 2. Turn broad confusion into a question with an answer

In her 2018 learning essay, Evans describes identifying what one does not understand as a learnable skill. Her Rust example turns confusion about references into questions about symbols, allocation and lifetimes. She also distinguishes uncertainty from things one understands well enough to use as foundations. [S3]

For an unfamiliar deployment setup, replace “I do not understand infrastructure” with three questions: where the process runs, how configuration reaches it and where its output is recorded. Draw one request through the system and put a question mark only at the first unexplained transition. This is an original learning exercise. Its output is a short list of gaps small enough to research or ask about. The aim is to make progress without requiring a complete education in every system the application touches.

### 3. State your current model when asking for help

Evans's question-asking essay recommends explaining one's present understanding and asking whether it is right. Her examples show how an explicit mistaken model makes correction easier. She also rejects making perfect research a moral requirement before someone may ask a question. Choosing the right person and respecting their time matter without turning inquiry into an ordeal. [S4]

An original help request might say: “I think the client retries after a timeout, and the server may already have saved the row. I see two log entries with the same job identifier. Is that consistent with our retry behavior?” Include the smallest safe input and the exact point of uncertainty. Do not append every log from the whole day. The output is a request a teammate can answer or redirect quickly. It leaves space for “I do not know” and for a different explanation without making either person defend their competence.

### 4. Check your code first while leaving room for surprising causes

The manifesto pairs two ideas: ordinarily investigate your own code before blaming a dependency, while recognizing that libraries, documentation and operating systems can contain mistakes. Evans presents the balance as her practical experience, rather than a probability guarantee for every programmer. [S2]

Our troubleshooting exercise compares a failing laptop with a working one. Record input, command, relevant versions, working directory and configuration. Change one difference that the hypothesis says should matter. If the problem persists, record that result before trying another. A dependency bug becomes more plausible when a small example excludes local application logic, not because the operating system feels mysterious. This approach avoids both extremes: endless self-blame despite contrary evidence, and an unsupported upstream accusation that sends the investigation away from its strongest clues.

### 5. Reduce a surprising failure to something explainable

In January 2018, while adding Mac support to rbspy, Evans described reports of freezing and a reduction to a small C program around a system call. She credited help from other people and qualified her understanding of the underlying issue. The post identified the environment and described a workaround; it is a historical account, not a claim about current macOS or a recommendation to reproduce the old freeze. [S5]

Our safe transfer is a parser failing on a large text file. Copy the file, remove private values and reduce it while retaining the failure. Track each reduction so a lost failure can be restored. The result might be two lines whose separator causes the issue. Return that small input, the expected output, the actual output and the exact environment. A reproduction need not be the shortest possible program. It needs to isolate the relevant behavior clearly enough for another person to investigate without inheriting the whole application.

### 6. Make the systems model visible enough to correct

Her About page emphasizes underlying systems, and the question essay describes writing a dictionary of unfamiliar work terms and their relationships. These are useful examples of externalizing understanding instead of hiding gaps behind confident language. [S1][S4]

An original output is a one-page drawing with four boxes: input file, import process, storage and report. Label what crosses each boundary, such as bytes, parsed rows or saved identifiers. Beside each arrow, write one observation that would confirm the assumed relationship. Avoid a decorative diagram of every tool the team owns. If the drawing predicts that a saved identifier appears only after storage succeeds, a contrary log becomes a precise question. The diagram has done its job when it makes the next useful observation easier to choose.

## How she decides

The working pattern reconstructed here is to distinguish a direct observation, a model that explains it and an experiment that could change that model. Evans's writing supports curiosity, specific questions and willingness to seek help. It does not offer a universal debugging algorithm that guarantees discovery. [S2][S3][S4]

For our original investigation sheet, put the symptom first, with time and conditions. Then list what is already known, what is unknown and which next observation would discriminate between plausible explanations. Prefer a test whose possible outcomes lead somewhere different. Repeating the same command five times may reveal intermittency, but it cannot distinguish two causes that make the same prediction. Before changing settings, state what each outcome would imply. Keep a rollback note when the experiment modifies the environment. The final explanation should connect evidence to the conclusion rather than merely report which change appeared to help.

## Where she stood

Her public descriptions favor clarity, humility and access to topics that can seem intimidating. The learning essay treats confusion as an ordinary part of acquiring knowledge, and the questioning essay treats admitting uncertainty as compatible with engineering confidence. These are stated educational positions, not speculation about her private temperament. [S1][S3][S4]

An original career application is a newcomer preparing for a conversation with a senior engineer. Write a small glossary of the five terms that block understanding and a short account of the system as currently understood. Ask for correction on one part at a time. The output is an orientation note that can help the next newcomer, with unknowns visibly retained. This is more useful than accumulating definitions disconnected from the actual work. The learner's contribution can be the clear question that exposes a missing explanation.

## Their work and record

The official page identifies Wizard Zines and her interest in teaching systems concepts. [S1] The opened sources include her 2016 questioning essay, a 2018 learning essay, the January 2018 rbspy investigation and the 2022 debugging manifesto developed with Flanagan. [S2][S3][S4][S5] No claim here depends on her complete employment history, an inferred birth date or a private account of her work. The examples are dated because technical implementations and personal views can change.

## Where she was wrong or criticised

The checked material does not establish an external critic's verdict, and this profile does not invent one. A practical limitation is visible in the historical kernel account itself: Evans did not claim to fully understand the underlying defect. [S5] An observed workaround can be useful while the causal account remains incomplete. Our applications must preserve that distinction.

For example, slowing a batch job may stop duplicate rows without proving that rate was the original cause. Record the mitigation as such, keep the evidence and investigate whether the change merely reduced the frequency of a race. Likewise, a tiny reproduction may omit conditions that matter at scale. Compare it back to the original symptom before declaring success. Neither curiosity nor a clear explanation removes the need for evidence about the actual system in use.

## Blind spots to watch

This profile is best for learning and investigation. It is not a substitute for incident command when people must coordinate a large live failure. Start by establishing whether the job is urgent mitigation, subsequent diagnosis or a learning exercise. The plan can change accordingly without losing its intellectual honesty.

For a household device, transfer the questions rather than technical assumptions. Record whether the problem follows the device, location or input. Avoid experiments that could lose important data or disable essential equipment. The useful output can be a concise support report and a decision about the next safe check. It need not prove that every system is understandable by a single person in one sitting.

## Short phrases on the record

No direct quotations are used. The suggested questions and sample reports are our own wording.
