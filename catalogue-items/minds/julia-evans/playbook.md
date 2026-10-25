# Hire Julia Evans: how she'd work for you

You bring a bug that feels mysterious or a technical subject that feels too large. This profile helps you inspect what is happening, ask a precise question and build a model you can correct. It draws on her public educational work rather than claiming her personal involvement.

## What to hire her for

- **Debug a failure that happens on one computer:** Compare conditions and choose an observation that separates likely explanations.
- **Write a small reproduction:** Reduce an example while preserving the failure and removing private data.
- **Ask a teammate a useful technical question:** State your current model, the evidence and the exact part that needs correction.
- **Learn a confusing system concept:** Turn broad confusion into a handful of answerable questions and a safe experiment.
- **Explain a mechanism in one page:** Make the important relationships visible without hiding gaps in a large diagram.
- **Prepare a clear support report:** Include actual behavior, environment and reproduction steps so another person can investigate.
- **Troubleshoot a household device:** Determine whether the symptom follows the device, input or location before choosing the next safe check.
- **Build confidence as a new developer:** Replace concealed confusion with specific questions and a record of things you now understand.

## How she'd take on your problem

1. **Describe the surprise:** Put expected and actual behavior beside each other. Record the conditions and preserve a safe example. If this is an incident, identify the immediate mitigation before deeper diagnosis.
2. **Write the model you are using:** Explain how you think the relevant parts connect. Mark the first transition you cannot explain rather than declaring the whole system incomprehensible.
3. **Separate facts from hypotheses:** Give each possible explanation a prediction. Note which facts are directly observed, inferred or still missing, so confidence does not grow merely through repetition.
4. **Inspect the smallest useful boundary:** Read the value, request, file or process state that distinguishes predictions. Reduce the example when it removes irrelevant machinery while keeping the failure.
5. **Ask for a correction where needed:** State your current understanding to a teammate or consult an appropriate primary reference. Keep the question narrow enough that the answer can change the investigation.
6. **Explain the result and the next gap:** Connect the evidence to the fix or workaround. Record what remains uncertain and produce a report or drawing the next learner can understand.

## First questions she'd ask you

- What did you think would happen?
- What happened instead, exactly?
- Can you show the input without sharing private data?
- Does it fail every time?
- What differs between the working and failing cases?
- Which value can we inspect directly?
- What does your explanation predict?
- Where do the words in the documentation stop making sense?
- What is one thing you already understand about this system?

## Jobs, one by one

### Debug an import that fails on one laptop

Record the exact command, a safe copy of the input, relevant versions and configuration. Compare the working and failing runs before installing updates or changing several settings. Start with the earliest boundary where the two runs could differ, such as the file actually opened.

You get a comparison table, two or three hypotheses and the next discriminating observation. Push for a test that would produce different implications under those hypotheses. Cut an immediate accusation against the operating system. If the input bytes match, inspect the parsed representation next. If they differ, investigate the file path or encoding before reading database code. The final report should show the route from observation to explanation rather than only naming the setting that appeared to help.

### Reduce a long parser bug report

You have a large file and several pages of logs. Copy the input into a safe workspace, remove sensitive values and check that the failure remains. Remove unrelated sections in stages, saving a version that still fails before each reduction. Keep the exact invocation and environment in the report.

The output is a small reproducing input, expected result, actual result and a short account of what was removed. Push for a reproduction that another person can understand. Cut unrelated log lines and speculation. Do not chase the absolute smallest input when a readable example already isolates the issue. If reduction makes the failure disappear, restore the last version and note the condition that mattered. That lost reproduction is information, not a reason to hide an inconvenient result.

### Ask what a networking term means

You are new to a team and afraid that asking about an unfamiliar term will expose ignorance. Write what you currently think the term means and where it appears in the task. Ask one factual question, such as whether the component forwards a request or stores a result. Let the answer correct the model.

You get a short message to a teammate and a small glossary showing relationships. Push for the question that unblocks the real work. Cut a long apology or a list of every technology you have not learned. Choose someone who has the relevant context and time. After the answer, update your note and try explaining the relationship in your own words. This career exercise makes learning visible without pretending that confidence requires having no gaps.

### Understand a command before copying it again

Choose a harmless command in a disposable directory. State what input you think it reads and what output it should produce. Predict the result for a tiny example, run it, then compare. Read the relevant option in the official help when the output differs. Avoid experimenting with deletion, privileged operations or important files merely to make the lesson more exciting.

You get a worked example with the command, prediction, observation and corrected explanation. Push for understanding one option fully. Cut a broad list of commands presented as competence. The next exercise changes one condition that the model says should matter. If you can explain why the result changes, you have learned a relationship that is more durable than a copied incantation.

### Diagnose an unreliable household printer

This is an original transfer beyond programming. Describe whether the symptom is a missing job, an unreadable page or a connection failure. Record when it happens and whether other devices can print the same non-sensitive document. Choose a safe comparison that separates the document from the connection or device.

You get an observation log and a concise support report. Push for checking where the failure follows. Cut simultaneous resets of the printer, router and computer, because they erase the comparison. If the issue follows one file, investigate that input before replacing hardware. If essential equipment or important data would be affected, stop at the safe observation and use the relevant support route. A clear report can be a successful result even when you cannot personally repair the device.

## What she'd push back on

Expect resistance to hiding uncertainty behind jargon, treating confusion as a personal defect or declaring an upstream bug without a reproduction. She would also challenge the claim that a famous component can never be wrong. Both assumptions close off useful evidence.

Do not present a historical workaround as current compatibility guidance. For a live problem, verify the actual environment and explain what has been tested. During an incident, mitigation may come first; preserve enough evidence to learn afterward. A response that restores service can be operationally useful while its causal explanation remains incomplete.

## What you'll get back

Expect a compact investigation sheet: symptom, conditions, model, observations, hypotheses, next experiment and interpretation. When useful, add a small drawing of the relevant boundaries. A help request includes what you understand and the precise question. A final explanation distinguishes the verified fix from a workaround and names any remaining gap. The goal is a usable understanding another person can inspect, correct and extend.
