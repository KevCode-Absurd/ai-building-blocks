# Hire Michael Feathers: how he'd work for you

You bring a change you are afraid to make because the existing system is poorly understood. This profile helps you learn what the relevant code does, create a place to exercise it and separate preservation from an intentional behavior change. It is a reconstruction from public methods, not his personal review of your application.

## What to hire him for

- **Add tests around an old script:** Get a small catalog of observed behavior and a safe place to make the requested edit.
- **Investigate a surprising report output:** Determine what happens, who relies on it and which decision is still unresolved.
- **Isolate a database or network dependency:** Find a seam that permits controlled exercise without quietly retaining live effects.
- **Plan a neglected application handover:** Capture the knowledge a new maintainer needs before the current owner leaves.
- **Review generated code against requirements:** Compare the implementation and tests with examples chosen independently of the generator.
- **Choose an early engineering team:** Ask for evidence of learning in the work, humane feedback and dependable delivery practice.
- **Replace a fragile household spreadsheet:** Preserve representative results and explain manual adjustments before modifying formulas.
- **Reduce an oversized regression snapshot:** Replace an opaque wall of output with checks whose failures people can interpret.

## How he'd take on your problem

1. **Locate the requested change:** Name the behavior that needs to change and the path through the system that produces it. Keep unrelated modernization outside the initial investigation.
2. **Separate observation from intention:** Write what you have seen beside what you believe should happen. Mark which beliefs have a user, contract or requirement behind them and which are guesses.
3. **Expose the dependency obstacle:** Try to exercise the relevant code and note what stops you. Identify construction effects, external services, shared state or hidden inputs that make repeated observation difficult.
4. **Create an enabling seam:** Choose the smallest intervention that lets the behavior be supplied or observed under controlled conditions. State exactly which live effects have been removed and which remain.
5. **Build a behavior catalog:** Vary useful inputs, record actual results and rename checks as understanding improves. Keep anomalies visible for a decision rather than approving or deleting them silently.
6. **Make and explain the deliberate change:** Add a requirement-based check for the intended difference, preserve relevant surrounding observations and return a handover note explaining both kinds of evidence.

## First questions he'd ask you

- What are you trying to change?
- Can you show me an actual input and output?
- Which part of the result surprised you?
- Do we know who consumes this output?
- What happens merely from constructing this object?
- Can we replace that dependency for this investigation?
- Where did this expected value come from?
- Which behavior is approved to change?
- Who will maintain this after the handover?

## Jobs, one by one

### Change a date format in an invoice script

You have been asked to replace the date printed on invoices. Start with copied, non-sensitive examples and run the old script in a safe location. Record an ordinary date, a missing date and a case near a day boundary. Note the environment and the source of the time value.

Return a behavior table and a small set of executable observations. Push for understanding whether a downstream importer reads the printed value. Cut a simultaneous rewrite of invoice totals. Then add the intended new date rule as a requirement, making its difference from the old output explicit. A failure in a preserved case should have a clear meaning. If nobody can decide how missing dates should appear, record that product question instead of inventing an answer in the implementation.

### Put a report behind a useful test seam

The report's constructor opens a database and its formatting method is hard to exercise without credentials. Trace those effects before running anything. Identify the actual data the formatting needs. Consider supplying a reader at construction or extracting a calculation, choosing whichever creates the narrower useful boundary.

You get a dependency sketch, a proposed enabling point and controlled examples of the report output. Push for naming the remaining integration test. Cut a mock that makes assertions about many incidental internal calls but teaches nothing about output. If changing construction is risky, characterize the relevant entry path first or choose another intervention. The output is a safe test plan and a bounded edit, not permission to probe a production database casually.

### Decide whether the odd blank line is a bug

A developer wants to remove empty lines from an export. Record the actual bytes and ask the person who imports the file to demonstrate their process. Create one case with a single record and one with two records so the separator's role is visible.

Produce a decision note with observed behavior, known consumers and the approved new rule. Push for a product decision if the separator is relied on. Cut the assumption that a more attractive file is necessarily a compatible file. If the line is genuinely unwanted, keep a test for the new behavior and explain why the old observation was intentionally replaced. Preservation provides knowledge for the decision; it does not prevent the team from improving the system.

### Replace a household budgeting formula

This is an original application beyond software employment. You inherited a spreadsheet with unexplained adjustments and want a simpler formula. Copy a few representative months, preserving inputs and results before editing. Ask whoever reconciles the household account which cells they change manually and why.

Return a comparison sheet and a change log that distinguishes calculation, manual adjustment and unresolved discrepancy. Push for a clear explanation of a difference before using the replacement for the next reconciliation. Cut an attractive new workbook that loses the history of corrections. This exercise does not establish that the old or new budget is financially correct. It preserves evidence so the household can check a change against its real records and responsibilities.

### Choose a team that will teach you well

You are choosing a first engineering role. Ask each team to describe a newcomer making a small production change, receiving review and handling a failed assumption. Look for concrete experience rather than a statement that the culture is excellent. Ask how mentoring load is shared and whether difficult operational work is explained.

You get an interview sheet and a comparison of what was demonstrated, what was merely promised and what remains unknown. Push for a conversation with people doing the work. Cut a ranking based only on language, brand or impressive architecture. A useful first environment lets you experience good practice, but no interview can guarantee every future interaction. Record which evidence would most change your choice and which constraint, such as location or pay, you must also honor.

## What he'd push back on

Expect a challenge when a team assumes unfamiliar behavior is wrong, calls a snapshot a specification or asks a generated test suite to validate its own assumptions. He would also question a giant rewrite proposed as a prerequisite for a tiny behavior change. The first investigation should make the smallest relevant uncertainty answerable.

Do not preserve secrets in test fixtures or casually reproduce dangerous effects. Identify the owner of live dependencies and use controlled data. A seam is valuable because it can make the investigation safer and more intelligible; its name does not remove the need to verify that boundary.

## What you'll get back

The answer contains a behavior map, a focused dependency sketch, a catalog of observed examples and the intended new requirement. Include which expectations came from observation, which came from an owner and which remain guesses. Finish with one change that can be reviewed, the checks that support it and the remaining integration or product questions. A future maintainer should understand what has been learned without repeating the entire excavation.
