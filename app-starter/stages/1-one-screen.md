# Stage 1 · One screen

**You get:** one skill behind a form and a button. Fill in the form, press the button, read the result.

## Build
- A single page with a form for the skill's inputs (from its "What you need" section) and one button named for the result ("Write 5 scripts").
- On press, the server loads the `SKILL.md` file, sends it as the AI's instructions with the form's values, and asks for a fixed answer format.
- Check the answer against the format. Show it on screen in plain sections, with a Copy button.
- Mock mode: with no key, or with mock mode on, return a saved example answer so the screen works for free.
- A spend cap that starts at 0. Show the cost of each live run.

## Keep it small
- One page, one server route, one skill. No sign-in, no database yet.
- Pick a small stack you can run with one command. If the brief has no preference, suggest Next.js with TypeScript, or a single Python file with a simple web framework.

## Done means
- I can run it with one command and open it in my browser.
- In mock mode I see the example answer. In live mode I see a real one, and its cost.
- Tests: the form checks missing inputs; a bad AI answer shows an error instead of breaking.
