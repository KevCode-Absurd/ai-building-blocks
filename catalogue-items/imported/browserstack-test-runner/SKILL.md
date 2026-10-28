---
name: "browserstack"
description: >-
  Run tests on BrowserStack. Use when user mentions "browserstack",
  "cross-browser", "cloud testing", "browser matrix", "test on safari",
  "test on firefox", or "browser compatibility".
---

# BrowserStack Integration

Run Playwright tests on BrowserStack's cloud grid for cross-browser and cross-device testing.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Prerequisites

Environment variables must be set:
- `BROWSERSTACK_USERNAME` — your BrowserStack username
- `BROWSERSTACK_ACCESS_KEY` — your access key

If not set, inform the user how to get them from [browserstack.com/accounts/settings](https://www.browserstack.com/accounts/settings) and stop.

> **The BrowserStack MCP server is not auto-registered (issue #978).**
> `pw-browserstack` was removed from the plugin's `.mcp.json` because it failed to
> connect for every user (the plugin ships no `node_modules`). The `browserstack_*`
> MCP tools used below, and the `/pw:browserstack` command, will fail with "tool
> not found" until it is enabled manually — see the **Integrations** section of the
> plugin's `CLAUDE.md` (`cd integrations/browserstack-mcp && npm install`, then
> register the server in your own user/project MCP config). Setting the env vars
> alone is not sufficient.

The `integrations/browserstack-mcp` folder is not in this catalogue copy. Get it from the original plugin repo.

**Default route (no MCP tools):** do sections 1, 2 and 5. Skip sections 3 and 4, because they use the `browserstack_*` tools. Read the pass and fail result for each browser from the terminal output and your BrowserStack dashboard, and build the results table from that. Never say you called a `browserstack_*` tool if it was not available.

The `/pw:browserstack ...` lines are names for each step. If your AI has no such command, ask for the step in plain words.

## Capabilities

### 1. Configure for BrowserStack

```
/pw:browserstack setup
```

Steps:
1. Check current `playwright.config.ts`
2. Add BrowserStack connect options:

> **AI Blocks note (keep the key secret):** the config below reads the key from an environment variable, but the finished `wsEndpoint` web address holds it. Never print or log that address or the resolved config, never paste the key into the file or the chat, and never commit a `.env` file that holds it.

```typescript
// Add to playwright.config.ts
import { defineConfig } from '@playwright/test';

const isBS = !!process.env.BROWSERSTACK_USERNAME;

export default defineConfig({
  // ... existing config
  projects: isBS ? [
    {
      name: "chromelatestwindows-11",
      use: {
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            'browser': 'chrome',
            'browser_version': 'latest',
            'os': 'Windows',
            'os_version': '11',
            'browserstack.username': process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
          }))}`,
        },
      },
    },
    {
      name: "firefoxlatestwindows-11",
      use: {
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            'browser': 'playwright-firefox',
            'browser_version': 'latest',
            'os': 'Windows',
            'os_version': '11',
            'browserstack.username': process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
          }))}`,
        },
      },
    },
    {
      // WebKit is the engine Safari uses; BrowserStack runs it on macOS here
      name: "webkitlatestos-x-ventura",
      use: {
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            'browser': 'playwright-webkit',
            'browser_version': 'latest',
            'os': 'OS X',
            'os_version': 'Ventura',
            'browserstack.username': process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
          }))}`,
        },
      },
    },
  ] : [
    // ... local projects fallback
  ],
});
```

3. Add npm script: `"test:e2e:cloud": "npx playwright test --project=\"chrome*\" --project=\"firefox*\" --project=\"webkit*\""`. Use escaped double quotes as shown: npm runs scripts in cmd.exe on Windows, which does not strip single quotes. The filters must match the project names above (`chromelatestwindows-11` and so on). If you rename the projects, change the filters to match.

### 2. Run Tests on BrowserStack

```
/pw:browserstack run
```

Steps:
1. Verify credentials are set
2. Run tests with BrowserStack projects:
   ```bash
   BROWSERSTACK_USERNAME=$BROWSERSTACK_USERNAME \
   BROWSERSTACK_ACCESS_KEY=$BROWSERSTACK_ACCESS_KEY \
   npm run test:e2e:cloud
   ```
3. Monitor execution
4. Report results per browser

### 3. Get Build Results

```
/pw:browserstack results
```

Steps:
1. Call `browserstack_get_builds` MCP tool
2. Get latest build's sessions
3. For each session:
   - Status (pass/fail)
   - Browser and OS
   - Duration
   - Video URL
   - Log URLs
4. Format as summary table

### 4. Check Available Browsers

```
/pw:browserstack browsers
```

Steps:
1. Call `browserstack_get_browsers` MCP tool
2. Filter for Playwright-compatible browsers
3. Display available browser/OS combinations

### 5. Local Testing

```
/pw:browserstack local
```

For testing localhost or staging behind firewall:
1. Install BrowserStack Local: `npm install -D browserstack-local`
2. Start the tunnel before the tests and stop it after. In a Playwright global setup file:
   ```typescript
   import browserstack from 'browserstack-local';
   const bsLocal = new browserstack.Local();
   // start: bsLocal.start({ key: process.env.BROWSERSTACK_ACCESS_KEY }, callback)
   // stop:  bsLocal.stop(callback)
   ```
3. Add `'browserstack.local': 'true'` to each project's caps object in the config.
4. Point `baseURL` at the local address (for example `http://localhost:3000`).
5. Run `npm run test:e2e:cloud`. Check BrowserStack's current docs if the tunnel will not start, since options change.

## MCP Tools Used

| Tool | When |
|---|---|
| `browserstack_get_plan` | Check account limits |
| `browserstack_get_browsers` | List available browsers |
| `browserstack_get_builds` | List recent builds |
| `browserstack_get_sessions` | Get sessions in a build |
| `browserstack_get_session` | Get session details (video, logs) |
| `browserstack_update_session` | Mark pass/fail |
| `browserstack_get_logs` | Get text/network logs |

## Output

- Cross-browser test results table
- Per-browser pass/fail status
- Links to BrowserStack dashboard for video/screenshots
- Any browser-specific failures highlighted

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- The [Flaky test fixer](https://useaiblocks.com/skills/flaky-test-fixer). It takes the test report.
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## What to do next

Fix the failures that happen in one browser only first. Then run the same npm script again to confirm they pass.
