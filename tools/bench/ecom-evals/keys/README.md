# Answer keys: keep out

These files are the answer keys. They are read only by the checker step (see `../README.md`), one answer at a time, blind to the arm.

- Never copy a key into a run folder, an agent prompt or a judge sheet. `make-sheets.mjs` refuses to build a sheet that contains a key line.
- Never paste key text into a pack, skill, card or method file. Changing an agent so it "knows" a key is cheating the bench.
- Held-out keys (see `split` in `../TASKS.json`) are frozen. Do not edit them to fit a result.
- `../TASKS.json` holds the job checks and traps, so it is key material too. Only the owner question, deliverable, outcome and principle sets leave this suite.

Each key lists: the real signals and what a great answer does with each; the decoys; the right calls; what would be wrong; and the facts a careful answer gets right. Anything an answer claims as a finding that is not in the key's signals and is not supported by the inputs counts as a false signal.

The numbers come from `../fixtures/build/build-fixtures.mjs --facts`, which asserts each planted signal when it builds the fixtures. If you change a fixture, rebuild and update the key.
