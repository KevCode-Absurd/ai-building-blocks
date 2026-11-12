# Brand

Read this folder before writing anything people will see: the site, a block's name or page, a workflow, an email, a post. Check every piece against `CHECKLIST.md` before it ships.

| File | What's in it |
|---|---|
| `README.md` | What we are and what we promise (this file) |
| `COPYWRITING.md` | How we write: principles, headline formula, words we use and avoid, good and bad examples |
| `CHECKLIST.md` | The check every piece of copy passes before it goes live |
| `../docs/WRITING.md` | Plain-language rules and our internal jargon, with what to say instead |
| `../docs/PAGE-FORMAT.md` | The layout of a block page |

## What we are

AI Blocks (useaiblocks.com) is the bridge between a job someone has to do and that job done. A person arrives with a task (write ad copy, fix a landing page, find out why ads stopped working). They leave with the result, made by an AI following one of our skills or workflows.

So we never sell the skill. We sell what's true after it runs: more sales from the same page, ads that don't get your account blocked, a script in your customers' own words.

## Who we're talking to

Owners, marketers and freelancers who are busy and not AI experts. They don't care how the skill works until they've seen what it gives them. They've been burned by vague AI promises, so they trust specifics and real examples.

## The promise

- **Headline on the home page:** Use AI like the top 1%
- **Subhead:** Turn hours of work into minutes. Spend the time you save on the work only you can do. Or at the beach (we won't tell).
- **Every block:** one clear outcome you can picture, a real example of the output, and steps simple enough to follow on your first try.
- **Every skill:** added to your AI once (Claude, Claude Code, ChatGPT, Gemini or a text expander), then started by name. Copy and paste is the fallback.

## Personality

Sharp, warm, a bit dry. A friend who's very good at this and doesn't show off. The look has an old-computer character (a globe of 0s and 1s, mono type, code windows) because we're the people who make the machine do the work.

## The look

The source of truth is `site/src/styles.css`. This is a summary.

- **Logo:** a round pixel-grid mark of 36 squares, some solid and some at 32% opacity. Files are in `exports/`: `ai-blocks-logo.svg` for light backgrounds, `ai-blocks-logo-white.svg` and `.png` for dark ones.
- **Colour:** black and white only. Light mode uses background `#fafafa`, panels `#ffffff`, text `#0a0a0a`, muted text `#575757` and lines `#e4e4e4`. Dark mode flips to background `#0a0a0a`, panels `#141414`, text `#ffffff`, muted text `#a3a3a3` and lines `#262626`. Green (`#1f8a5b`, dark `#5ad19a`) means success and amber (`#a56a00`, dark `#f0b85a`) means a warning. Neither is used for decoration.
- **Type:** Space Grotesk for headings and body. Headings use weight 600 with tight letter spacing. JetBrains Mono is for code, labels and the machine feel.
- **Details:** the main button is solid (black in light mode, white in dark mode). Other details are a hard offset shadow in the text colour, pill shapes with a 2px border, and plenty of space between sections.
