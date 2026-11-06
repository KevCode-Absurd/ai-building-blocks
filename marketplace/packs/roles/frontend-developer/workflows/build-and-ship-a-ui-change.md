# Build and ship a UI change through a pull request

**Trigger:** A new page, component or fix is requested: a form, a modal, a pricing table, a layout bug, a landing page. Usually one to five working days of elapsed time.

**Access:** level 1 to read the repo and designs; level 2 to push a branch and open the pull request; level 3 to merge and deploy, within the repos, environments and time the client set.

## Steps

1. **Pin down the brief (level 1).** Use the `component-brief-from-design` prompt to list props, states, sizes, keyboard behaviour and edge cases. Missing states are marked "proposed". *Approval: the client or designer confirms the brief and the proposed states.*
2. **Check the stack (level 1).** Read `package.json` or the theme files for framework version, styling and test tool. Note anything end of life (for example Vue 2) as a risk, not a side task.
3. **Build.** Use the `component-build` skill, or the `one-file-landing-page` prompt for a static page. Native elements first, least state, mobile first.
4. **Test.** Write user-style tests for each state and an edge case. For a fix, the failing test comes first. If my AI tool can run commands in the project, I run the tests and keep the output.
5. **Accessibility pass.** Run the `accessibility-fix-pass` skill on the new code: labels, keyboard, focus, contrast, target size, reflow.
6. **Speed check.** For pages, check the likely LCP image is not lazy-loaded, images have dimensions and no unneeded script was added. Use the `page-speed-diagnosis` skill if the page is already live and slow.
7. **Open a pull request (level 2).** Branch, small commits, and a description with what changed, states covered, how to test, accessibility checks done and what was not verified. Nothing goes straight to the main branch. *Approval: the client or their reviewer reviews the pull request and its preview build.*
8. **Merge and deploy (level 3).** With level 3 access, I merge once review and checks pass, deploy to the agreed environments, and log both. Otherwise the client's team merges and deploys.
9. **After release.** Run or hand over a short post-release check list: the page at three widths, keyboard pass, form submit, console errors, and field data to re-check after 28 days. If a check fails after my deploy, I roll back within the limits and report.

## Outputs

- Confirmed component brief
- Code and tests in a pull request with a full description
- Accessibility change table
- Post-release check list
- Action log: each push, merge and deploy, with time and result

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** merging reviewed pull requests with passing checks in the named repos, deploying to the named environments, and rolling back a deploy that fails its checks.
- **Always needs a new yes:** the brief and any proposed states, any new package, any change to brand colours for contrast, a new repo or environment, turning off branch protection or required checks, and any change to secrets, domains or permissions.
