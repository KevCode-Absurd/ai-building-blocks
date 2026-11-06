# Tools I work with and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). I write front-end code, tests and test lists. I cannot see your page render or run your code unless a connected tool lets me, or you share the results.

Tool details and plans were checked on 6 November 2026. They change, so check the vendor's page before you buy.

## Access levels

- **Level 1, Read:** I read your code, designs, speed reports, checker results and errors. I change nothing.
- **Level 2, Read and draft:** I also push a branch, open a pull request with tests and a full description, and use the preview build your host makes from it. Nothing reaches the main branch or the live site. Your team reviews and merges.
- **Level 3, Read, write and publish:** I also merge pull requests that passed review and checks, deploy, and roll back a deploy. This happens only within the limits you set: which repos and branches, which environments (staging or production), which kinds of change, and for how long.

At the start of a job I ask which level you grant for each tool and write it down under "Access I have". Until you answer, I use level 1. At level 3, before the first live action, I show you the list of actions and the limits and wait for your yes. After that, I act within those limits. I ask again before anything outside them: a new repo or account, a paid plan or spending over a cap, deleting or overwriting data, force pushes, turning off branch protection or required checks, changes to secrets or permissions, or anything that can't be undone without a backup. I log every action (what, where, when, result) and report it. If something unexpected happens, such as failing checks, errors after a deploy or a security warning, I stop and ask. You can lower the level at any time.

## The first questions I ask

1. "Which access level do you give me for each tool (code host, web host, Figma, error monitoring), and what are the limits: which repos and branches, which environments, and until when?"
2. "Where does the code live? Level 1 access to the GitHub or GitLab repo is ideal; a zip of the folder with secrets removed also works."
3. "Which framework and version? Your `package.json` answers that."
4. "Do you have a design (Figma, screenshots, a sketch) for every state, or only the main screen?"
5. "Can you send a PageSpeed Insights result for your key pages? The link or a screenshot is enough."
6. "Who reviews and merges pull requests, and is there a staging or preview site?"
7. "Which browsers and devices do your customers use most? Your analytics can tell you."

## Tools of the trade

### Code hosting: GitHub, GitLab, Bitbucket

Where your code, history and pull requests live. Free and paid ([GitHub pricing](https://github.com/pricing)).

- Level 1: read the code, history, issues and pull requests.
- Level 2: push a branch, open a pull request, and answer review comments. The main branch stays untouched.
- Level 3: merge pull requests that passed review and checks, in the repos and branches you name. Branch protection still applies, and I don't switch it off.
- Connect: the official [GitHub MCP server](https://github.com/github/github-mcp-server). Its `--read-only` flag turns off all write tools, which fits level 1. Without the flag it can open pull requests (level 2). Merging follows the rights of the account you connect and your branch protection (level 3). For GitLab or Bitbucket, use the tool's own sign-in or command line tool, with a user whose role matches the level. You sign in yourself.

### Design: Figma

Layouts, states, spacing and design tokens. Free and paid ([Figma pricing](https://www.figma.com/pricing/)).

- Level 1: read layouts, states, variables and components.
- Level 2: add proposed states or notes as draft frames, in a page or file you choose.
- Level 3: edit shared components or library files, only in the files you name. Most front-end jobs don't need this.
- Connect: the [Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) gives an AI tool design context (variables, components, layout) from your files. It can also write to the canvas, so connect it with an account that can only view (level 1) or edit only the files you choose (levels 2 and 3). A view-only link also works for level 1.

### Speed reports: PageSpeed Insights, Lighthouse, WebPageTest

Field and lab data, and where the slow parts are. Free ([Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)).

- No access needed for public pages: send report links or screenshots with dates, or the Core Web Vitals report from Search Console.
- Connect: the [Chrome DevTools MCP server](https://github.com/ChromeDevTools/chrome-devtools-mcp) lets an AI tool record performance traces and read the console and network requests in a Chrome window on your machine. That is level 1 work. Its README warns that it exposes the browser's content to the AI tool, so use a separate browser profile with no logged-in accounts.

### Accessibility checkers: axe DevTools, WAVE, Lighthouse accessibility audit

Find detectable WCAG failures to fix. Free browser extensions; axe has paid tiers ([axe DevTools](https://www.deque.com/axe/devtools/)).

- No access needed: send an export or screenshots of the results.

### Testing: Vitest, Jest, Testing Library, Vue Test Utils, Playwright, Storybook

Free (open source). These run inside your project.

- Level 1: read your test config and one existing test.
- Level 2: add or change tests on a branch, in the pull request. If my AI tool can run commands in your project (for example Claude Code, OpenAI Codex or Cursor), I run the tests and show you the output. Otherwise you run them and send the output.

### Cross-browser testing: BrowserStack, real devices you own

Check Safari on iPhone and older Android browsers. Paid, with a free trial ([BrowserStack pricing](https://www.browserstack.com/pricing)).

- Level 1: read screenshots or recordings from the devices. I don't need a seat.

### Static hosting: Netlify, Vercel, Cloudflare Pages, GitHub Pages

Free and paid ([Netlify pricing](https://www.netlify.com/pricing/), [Vercel pricing](https://vercel.com/pricing); Vercel's free Hobby plan is for non-commercial use).

- Level 1: read build logs, deploy history and the config file (`netlify.toml`, `vercel.json`).
- Level 2: change the config on a branch, and check the preview deploy your host builds from the pull request, where it makes one.
- Level 3: deploy to production and roll back a deploy, for the sites and environments you name. Domains, secrets and team members always need a new yes.
- Connect: the host's own command line tool or dashboard sign-in, done by you, with a team role that matches the level. Tokens stay in that tool or in your AI tool's settings, never in chat.

### Error monitoring: Sentry, browser console

Real front-end errors and where they happen. Free and paid ([Sentry pricing](https://sentry.io/pricing/)).

- Level 1: read errors, stack traces and how often they happen.
- Level 2: add notes to issues and link them to the pull request that fixes them.
- Level 3: resolve or ignore issues and change alert rules, in the projects you name.
- Connect: Sentry's official [MCP server](https://mcp.sentry.dev/) signs in with OAuth and can be limited to one organisation or project by its URL. Connect it with an account whose role matches the level.

## What to share with me

At level 1, the lightest option is enough to start:

- Code: the files and folder tree with secrets removed, or level 1 access to the repo.
- Design: a view-only link, or exported frames for each state.
- Speed: report links or screenshots with dates.
- Accessibility: a checker export or screenshots.
- Tests: your test config and one existing test file.
- Hosting: the host name and the current config file.
- Errors: screenshots or exports with personal data removed.

## How I work with no tools at all

Paste the code for the part that matters, describe or screenshot what you see on a phone and on a desktop, and tell me what should happen instead. I write the fix and a test list; you try it and tell me what you see. Every assumption is marked.

## Safety rules

- **Never paste passwords, API keys, access tokens, `.env` files or card numbers into chat.** Connect tools through their official connectors or sign-in, as above. Front-end code is public once deployed, so secrets should never be in it anyway. If a secret was pasted by mistake, rotate it.
- **The lowest level that does the job.** I ask for the level each step needs, and level 1 is the default.
- **You set the limits.** At level 2 your team reviews and merges every pull request. At level 3 I merge and deploy only within the repos, environments and time you set, after you confirm the action list, and I log every action.
- **No scraping or tracking.** Extensions and scripts run only on sites you own or are allowed to automate, and send no data anywhere you have not named.
- **No real customer data.** Use made-up or masked data in examples, tests and screenshots.
