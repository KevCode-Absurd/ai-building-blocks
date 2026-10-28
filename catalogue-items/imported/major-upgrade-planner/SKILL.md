---
name: dependency-upgrade
description: "Master major dependency version upgrades, compatibility analysis, staged upgrade strategies, and comprehensive testing approaches."
risk: critical
source: community
date_added: "2026-02-27"
---
<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can read your project files and run the tests for you, when you allow it.
- **Any good chat AI:** It can write the plan from pasted files. You run each stage yourself.
<!-- /needs -->

## Supporting material availability

This catalog copy contains the inline guidance below, but does not include the following supporting paths. They are external prerequisites, not bundled files:

- `<support-root>/references/semver.md`
- `<support-root>/references/compatibility-matrix.md`
- `<support-root>/references/staged-upgrades.md`
- `<support-root>/references/testing-strategy.md`
- `<support-root>/assets/upgrade-checklist.md`
- `<support-root>/assets/compatibility-matrix.csv`
- `<support-root>/scripts/audit-dependencies.sh`

Ask for the original supporting material or an existing installation before using a step that depends on these paths; this catalog does not identify a verified download source for them. Resolve each path relative to that installation, inspect its contents, and verify any applicable license and execution prerequisites. Do not run a command or claim a referenced procedure was followed until its required file exists. Do not fabricate the missing scripts or treat an unrelated file with the same name as equivalent. Independent steps fully documented here can proceed within the user’s authorized scope; report any dependent step as unavailable.


# Dependency Upgrade

Master major dependency version upgrades, compatibility analysis, staged upgrade strategies, and comprehensive testing approaches.

## Do not use this skill when

- The task is unrelated to dependency upgrade
- You need a different domain or tool outside this scope
- The update is only a minor or patch version (a normal update is enough)
- The project has no tests at all (build a basic test or smoke check first, or the plan cannot prove each step worked)

## Instructions

- Clarify goals, constraints, and required inputs.
- Apply relevant best practices and validate outcomes.
- Provide actionable steps and verification.

## Output Format

Give the user a plan with these parts, in order:

1. **Version change**: package, current version, target version, and whether it is a major, minor or patch step.
2. **Likely breaking changes**: each one with its source (changelog or migration guide). If you have not read the source, write "to check" and do not guess.
3. **Compatibility table**: columns are Package, Current version, Needed version, Changes first?, Source. Mark unknown cells UNKNOWN.
4. **Stages**: numbered, one major version or one package per stage, in order.
5. **Tests per stage**: what to run before moving on (unit, build, integration, end-to-end).
6. **Rollback point per stage**: a git tag or branch to return to.
7. **Blocked steps**: any step that needs a supporting file this copy does not include.

Never invent versions, changelog entries or commands. Read the user's dependency file first. If the package, target version or dependency file is missing, ask once, then mark it MISSING. Do not run an upgrade command without the user's say-so, and do not change files. After the plan, suggest the first stage to run.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Software developer from specifications](https://useaiblocks.com/skills/spec-builder). It takes the plan.
- The [Developer tools engineer](https://useaiblocks.com/skills/agency-engineering-developer-tooling-engineer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Use this skill when

- Upgrading major framework versions
- Updating security-vulnerable dependencies
- Modernizing legacy dependencies
- Resolving dependency conflicts
- Planning incremental upgrade paths
- Testing compatibility matrices
- Automating dependency updates

## Semantic Versioning Review

```
MAJOR.MINOR.PATCH (e.g., 2.3.1)

MAJOR: Breaking changes
MINOR: New features, backward compatible
PATCH: Bug fixes, backward compatible

^2.3.1 = >=2.3.1 <3.0.0 (minor updates)
~2.3.1 = >=2.3.1 <2.4.0 (patch updates)
2.3.1 = exact version
```

## Dependency Analysis

### Audit Dependencies
```bash
# npm
npm outdated
npm audit
npm audit fix   # changes your lock file: read the diff, and run it as its own stage

# yarn
yarn outdated
yarn audit

# Check for major updates
npx npm-check-updates
npx npm-check-updates -u  # Update package.json
```

### Analyze Dependency Tree
```bash
# See why a package is installed
npm ls package-name
yarn why package-name

# Find duplicate packages
npm dedupe
yarn dedupe

# Visualize dependencies
npx madge --image graph.png src/
```

## Compatibility Matrix

> Note from AI Blocks: the version pairs below are an illustration of the format, not checked facts. Before you use any pair in a plan, confirm it against the package's own peer dependency list (`npm view <package> peerDependencies`) or its changelog, and cite that source in the table.

```javascript
// compatibility-matrix.js
const compatibilityMatrix = {
  'react': {
    '16.x': {
      'react-dom': '^16.0.0',
      'react-router-dom': '^5.0.0',
      '@testing-library/react': '^11.0.0'
    },
    '17.x': {
      'react-dom': '^17.0.0',
      'react-router-dom': '^5.0.0 || ^6.0.0',
      '@testing-library/react': '^12.0.0'
    },
    '18.x': {
      'react-dom': '^18.0.0',
      'react-router-dom': '^6.0.0',
      '@testing-library/react': '^13.0.0'
    }
  }
};

function checkCompatibility(packages) {
  // Validate package versions against matrix
}
```

## Staged Upgrade Strategy

### Phase 1: Planning
```bash
# 1. Identify current versions
npm list --depth=0

# 2. Check for breaking changes
# Read CHANGELOG.md and MIGRATION.md

# 3. Create upgrade plan
echo "Upgrade order:
1. TypeScript
2. React
3. React Router
4. Testing libraries
5. Build tools" > UPGRADE_PLAN.md
```

### Phase 2: Incremental Updates
```bash
# Don't upgrade everything at once!

# Step 1: Update TypeScript
npm install typescript@latest

# Test
npm run test
npm run build

# Step 2: Update React (one major version at a time)
npm install react@17 react-dom@17

# Test again
npm run test

# Step 3: Continue with other packages
npm install react-router-dom@6

# And so on...
```

### Phase 3: Validation
```javascript
// tests/compatibility.test.js
describe('Dependency Compatibility', () => {
  it('should have compatible React versions', () => {
    const reactVersion = require('react/package.json').version;
    const reactDomVersion = require('react-dom/package.json').version;

    expect(reactVersion).toBe(reactDomVersion);
  });

  it('should not have peer dependency warnings', () => {
    // Run npm ls and check for warnings
  });
});
```

## Breaking Change Handling

### Identifying Breaking Changes
```bash
# Read the package's own changelog, release notes or migration guide.
# Check the address first; each project keeps it in a different place.
curl https://raw.githubusercontent.com/facebook/react/main/CHANGELOG.md
```

### Codemod for Automated Fixes
Codemods rewrite your files. Ask the user for a clear yes, commit first and review the diff. Use the package's official codemod and check its README for the current command before running it.

```bash
# React's official codemods are in the reactjs/react-codemod repo (check its README first)
npx react-codemod <transform> <path>

# Example: rename old lifecycle methods
npx react-codemod rename-unsafe-lifecycles src/
```

### Custom Migration Script
Warning: this rewrites every matching file. Ask the user for a clear yes before running it. Commit first, run on a copy or branch, and review the diff before keeping it. Only use it when a codemod does not exist.

```javascript
// migration-script.js
const fs = require('fs');
const glob = require('glob');

glob('src/**/*.tsx', (err, files) => {
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace old API with new API
    content = content.replace(
      /componentWillMount/g,
      'UNSAFE_componentWillMount'
    );

    // Update imports
    content = content.replace(
      /import { Component } from 'react'/g,
      "import React, { Component } from 'react'"
    );

    fs.writeFileSync(file, content);
  });
});
```

## Testing Strategy

### Unit Tests
```javascript
// Ensure tests pass before and after upgrade
npm run test

// Update test utilities if needed
npm install @testing-library/react@latest
```

### Integration Tests
```javascript
// tests/integration/app.test.js
describe('App Integration', () => {
  it('should render without crashing', () => {
    render(<App />);
  });

  it('should handle navigation', () => {
    const { getByText } = render(<App />);
    fireEvent.click(getByText('Navigate'));
    expect(screen.getByText('New Page')).toBeInTheDocument();
  });
});
```

### Visual Regression Tests
```javascript
// visual-regression.test.js
describe('Visual Regression', () => {
  it('should match snapshot', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

### E2E Tests
```javascript
// cypress/e2e/app.cy.js
describe('E2E Tests', () => {
  it('should complete user flow', () => {
    cy.visit('/');
    cy.get('[data-testid="login"]').click();
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Automated Dependency Updates

### Renovate Configuration
Auto-merge is safe only if your tests must pass before a merge. Check that branch protection requires them.

```json
// renovate.json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["major-update"]
    }
  ],
  "schedule": ["before 3am on Monday"],
  "timezone": "America/New_York"
}
```

### Dependabot Configuration
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "team-leads"
    commit-message:
      prefix: "chore"
      include: "scope"
```

## Rollback Plan

Before each stage, mark a point you can return to. Ask the user before running any command that discards work.

```bash
# Before the stage: commit or save your work, then mark it
git status                      # should be clean
git tag before-upgrade-<package>
git checkout -b upgrade-<package>

# Do the stage, then test
npm install <package>@<target>
npm run test && npm run build

# If tests fail: stop and show the user the errors.
# Only with the user's OK, return to the marked point:
#   git checkout <your-main-branch>      (your upgrade branch stays for review)
#   npm ci                               (restore from the lock file)
```

## Common Upgrade Patterns


### Lock File Management
```bash
# npm
npm install --package-lock-only  # Update lock file only
npm ci  # Clean install from lock file

# yarn
yarn install --frozen-lockfile  # CI mode
yarn upgrade-interactive  # Interactive upgrades
```

### Peer Dependency Resolution
```bash
# Blocked step: last resort only. Ask the user for a clear yes before running either one.
# These skip real conflict checks: write the reason (which conflict, why no other fix works) in the plan, then run the full tests a second time.
# npm 7+: strict peer dependencies
npm install --legacy-peer-deps  # Ignore peer deps

# npm 8+: override peer dependencies
npm install --force
```

### Workspace Upgrades
```bash
# Update all workspace packages
npm install --workspaces

# Update specific workspace
npm install package@latest --workspace=packages/app
```

## Resources

- **references/semver.md**: Semantic versioning guide
- **references/compatibility-matrix.md**: Common compatibility issues
- **references/staged-upgrades.md**: Incremental upgrade strategies
- **references/testing-strategy.md**: Comprehensive testing approaches
- **assets/upgrade-checklist.md**: Step-by-step checklist
- **assets/compatibility-matrix.csv**: Version compatibility table
- **scripts/audit-dependencies.sh**: Dependency audit script

## Best Practices

1. **Read Changelogs**: Understand what changed
2. **Upgrade Incrementally**: One major version at a time
3. **Test Thoroughly**: Unit, integration, E2E tests
4. **Check Peer Dependencies**: Resolve conflicts early
5. **Use Lock Files**: Ensure reproducible installs
6. **Automate Updates**: Use Renovate or Dependabot
7. **Monitor**: Watch for runtime errors post-upgrade
8. **Document**: Keep upgrade notes

## Upgrade Checklist

```markdown
Pre-Upgrade:
- [ ] Review current dependency versions
- [ ] Read changelogs for breaking changes
- [ ] Create feature branch
- [ ] Backup current state (git tag)
- [ ] Run full test suite (baseline)

During Upgrade:
- [ ] Upgrade one dependency at a time
- [ ] Update peer dependencies
- [ ] Fix TypeScript errors
- [ ] Update tests if needed
- [ ] Run test suite after each upgrade
- [ ] Check bundle size impact

Post-Upgrade:
- [ ] Full regression testing
- [ ] Performance testing
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Monitor for errors
- [ ] Deploy to production
```

## Common Pitfalls

- Upgrading all dependencies at once
- Not testing after each upgrade
- Ignoring peer dependency warnings
- Forgetting to update lock file
- Not reading breaking change notes
- Skipping major versions
- Not having rollback plan

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
