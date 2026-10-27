---
name: semantic-versioning
description: Automate versioning and changelog generation using semantic versioning
  principles.
category: devops
risk: critical
source: https://github.com/BagelHole/DevOps-Security-Agent-Skills
source_repo: BagelHole/DevOps-Security-Agent-Skills
source_type: community
date_added: '2026-09-20'
license: MIT
license_source: https://github.com/BagelHole/DevOps-Security-Agent-Skills/blob/main/LICENSE
compatibility: Requires git and Node.js, and a CI runner such as GitHub Actions for
  the automatic release. Docs-only; helper scripts and templates not bundled.
metadata:
  author: devops-skills
  version: '1.0'
---

<!-- Licence note: the code and config snippets here are MIT (the author's header above). The written text is CC BY 4.0 (see LICENSE-CONTENT). -->

# Semantic Versioning

Automate version management and changelog generation following SemVer principles.

> The `risk: critical` label in the header is the author's. It means a release changes your repo, tags and maybe your npm package. So the defaults here are safe: npm publishing is off and releases start by hand.

## Prerequisites

- Git repository with commit history
- Node.js (for most tools)
- Conventional commits (recommended)

## What to ask for first

If one of these is missing, ask once. If it is still missing, write MISSING and say what you assumed. Never invent commits, versions or tokens.

1. The release branch name (required).
2. Recent commit messages, or the repo (required, to work out the next version).
3. The current version, from package.json or the last tag (required; if there is no tag, treat it as a first release).
4. Whether the project publishes to npm (required before you set npmPublish).
5. Whether commits use the conventional style. If not, say the tools will not bump versions until they do.

## Steps

1. Read the commit messages. Map each to a bump with the table below. Name the commits that cause the highest bump.
2. State the next version, for example "1.4.2 to 1.5.0 because of feat: add search". If no commit triggers a release, say so.
3. Ask which tool: semantic-release for fully automatic releases from CI, standard-version for a command the user runs.
4. Write the config and, for semantic-release, the workflow file. Keep npmPublish false unless the user said they publish to npm.
5. Write the commit message guide.
6. Tell the user to run a dry run first. Never run a real release for them.

## Output

Return these sections in this order:

- **Assumptions and MISSING items**
- **Next version**: current version, next version, and the commits that decided it.
- **Release config**: the file name and contents.
- **Release workflow**: the file name and contents (semantic-release only).
- **CHANGELOG.md format**: the section names and one example entry built from the user's real commits.
- **Commit guide**: commit types and what each one does to the version.
- **Next step**: run the dry run, read the output, then push to the release branch.

Use the user's real commits in every example. Never invent commits.

## Semantic Versioning Basics

### Version Format

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]

Examples:
1.0.0
2.1.3
1.0.0-alpha.1
1.0.0-beta.2+build.123
```

### Version Components

| Component | When to Increment |
|-----------|-------------------|
| MAJOR | Breaking changes (incompatible API changes) |
| MINOR | New features (backward compatible) |
| PATCH | Bug fixes (backward compatible) |
| PRERELEASE | Pre-release versions (alpha, beta, rc) |
| BUILD | Build metadata (ignored in precedence) |

### Version Precedence

```
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta
< 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11
< 1.0.0-rc.1 < 1.0.0 < 2.0.0
```

## Conventional Commits to Version

```yaml
Commit Type → Version Bump:
  feat:     → MINOR
  fix:      → PATCH
  docs:     → PATCH (or no release)
  style:    → PATCH (or no release)
  refactor: → PATCH
  perf:     → PATCH
  test:     → No release
  chore:    → No release
  
  BREAKING CHANGE: → MAJOR
  feat!:   → MAJOR
  fix!:    → MAJOR
```

## semantic-release

### Installation

```bash
npm install --save-dev semantic-release \
  @semantic-release/changelog \
  @semantic-release/git
```

### Configuration

This config does not publish to npm (npmPublish is false). Set it to true only if you publish packages, and then add an NPM_TOKEN secret to your CI. The release workflow below passes that token, so it does publish once npmPublish is true.

**Before you copy any config below:** replace every `[OWNER]/[REPO]` with the user's own GitHub owner and repo name. Do not save a config with those placeholders still in it.

```json
// .releaserc.json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", {
      "changelogFile": "CHANGELOG.md"
    }],
    ["@semantic-release/npm", {
      "npmPublish": false
    }],
    ["@semantic-release/git", {
      "assets": ["CHANGELOG.md", "package.json", "package-lock.json"],
      "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }],
    "@semantic-release/github"
  ]
}
```

### Advanced Configuration

Use one config file only. This `release.config.js` is an alternative to `.releaserc.json` above, not an addition. semantic-release does not accept both, so delete the one you do not use.

```javascript
// release.config.js
module.exports = {
  branches: [
    'main',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true }
  ],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        { type: 'docs', release: 'patch' },
        { type: 'refactor', release: 'patch' },
        { type: 'style', release: 'patch' },
        { type: 'perf', release: 'patch' },
        { breaking: true, release: 'major' }
      ]
    }],
    ['@semantic-release/release-notes-generator', {
      preset: 'angular',
      writerOpts: {
        commitsSort: ['subject', 'scope']
      }
    }],
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github'
  ]
};
```

### GitHub Actions Integration

**Default: a person starts each release.** This workflow uses the `workflow_dispatch` trigger, so nothing is released until someone presses the button in GitHub Actions. If the user wants a release on every push to `main`, change the trigger to `push` only after a dry run, and only on a protected branch (so pushes need a reviewed pull request). A push trigger tags the commit, writes the changelog and may publish. You must not run a real release for the user.

```yaml
# .github/workflows/release.yml
name: Release

on:
  workflow_dispatch:   # a person starts each release. To release on every push, use: push: { branches: [main] }

permissions:
  contents: write        # push tags and the changelog commit
  issues: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

## standard-version

### Installation

```bash
npm install --save-dev standard-version
```

### Configuration

```json
// .versionrc.json
{
  "types": [
    { "type": "feat", "section": "Features" },
    { "type": "fix", "section": "Bug Fixes" },
    { "type": "docs", "section": "Documentation" },
    { "type": "style", "section": "Styling" },
    { "type": "refactor", "section": "Code Refactoring" },
    { "type": "perf", "section": "Performance" },
    { "type": "test", "section": "Tests" },
    { "type": "chore", "section": "Maintenance" }
  ],
  "skip": {
    "bump": false,
    "changelog": false,
    "commit": false,
    "tag": false
  },
  "commitUrlFormat": "https://github.com/[OWNER]/[REPO]/commit/{{hash}}",
  "compareUrlFormat": "https://github.com/[OWNER]/[REPO]/compare/{{previousTag}}...{{currentTag}}"
}
```

Replace `[OWNER]/[REPO]` in the two links above, and in the git-cliff config below, with your own GitHub owner and repo name.

### Usage

```bash
# First release
npx standard-version --first-release

# Regular release (auto-detect version bump)
npx standard-version

# Specific version bump
npx standard-version --release-as minor
npx standard-version --release-as 1.1.0

# Pre-release
npx standard-version --prerelease alpha
npx standard-version --prerelease beta

# Dry run
npx standard-version --dry-run

# Skip specific steps
npx standard-version --skip.changelog
```

### NPM Scripts

```json
// package.json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:alpha": "standard-version --prerelease alpha",
    "release:beta": "standard-version --prerelease beta",
    "release:dry": "standard-version --dry-run"
  }
}
```

## Changelog Generation

### conventional-changelog

```bash
# Install
npm install -g conventional-changelog-cli

# Generate changelog
conventional-changelog -p angular -i CHANGELOG.md -s

# Generate all history
conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

### git-cliff

```bash
# Install
cargo install git-cliff

# Generate changelog
git cliff -o CHANGELOG.md
```

```toml
# cliff.toml
[changelog]
header = "# Changelog\n\n"
body = """
{% for group, commits in commits | group_by(attribute="group") %}
## {{ group | upper_first }}
{% for commit in commits %}
- {{ commit.message | upper_first }}\
{% endfor %}
{% endfor %}
"""
trim = true

[git]
conventional_commits = true
filter_unconventional = true
commit_preprocessors = [
    { pattern = '\((\w+)\s#([0-9]+)\)', replace = "([#${2}](https://github.com/[OWNER]/[REPO]/issues/${2}))" },
]
commit_parsers = [
    { message = "^feat", group = "Features" },
    { message = "^fix", group = "Bug Fixes" },
    { message = "^doc", group = "Documentation" },
    { message = "^perf", group = "Performance" },
    { message = "^refactor", group = "Refactoring" },
    { message = "^style", group = "Styling" },
    { message = "^test", group = "Testing" },
    { message = "^chore", group = "Miscellaneous" },
]
filter_commits = true
tag_pattern = "v[0-9]*"
```

## Version Bumping Scripts

### Bash Script

```bash
#!/bin/bash
# bump-version.sh

CURRENT_VERSION=$(cat package.json | jq -r '.version')
echo "Current version: $CURRENT_VERSION"

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case $1 in
  major)
    NEW_VERSION="$((MAJOR + 1)).0.0"
    ;;
  minor)
    NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
    ;;
  patch)
    NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
    ;;
  *)
    echo "Usage: $0 {major|minor|patch}"
    exit 1
    ;;
esac

echo "New version: $NEW_VERSION"

# Update package.json
npm version $NEW_VERSION --no-git-tag-version

# Create git tag
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Version $NEW_VERSION"
```

### Python Script

```python
#!/usr/bin/env python3
# bump_version.py

import re
import sys
import subprocess

def get_current_version():
    with open('setup.py', 'r') as f:
        content = f.read()
        match = re.search(r"version=['\"]([^'\"]+)['\"]", content)
        return match.group(1) if match else None

def bump_version(current, bump_type):
    major, minor, patch = map(int, current.split('.'))
    
    if bump_type == 'major':
        return f'{major + 1}.0.0'
    elif bump_type == 'minor':
        return f'{major}.{minor + 1}.0'
    elif bump_type == 'patch':
        return f'{major}.{minor}.{patch + 1}'
    else:
        raise ValueError(f'Invalid bump type: {bump_type}')

def update_version(old_version, new_version):
    with open('setup.py', 'r') as f:
        content = f.read()
    
    content = content.replace(f"version='{old_version}'", f"version='{new_version}'")
    
    with open('setup.py', 'w') as f:
        f.write(content)

if __name__ == '__main__':
    bump_type = sys.argv[1] if len(sys.argv) > 1 else 'patch'
    current = get_current_version()
    new = bump_version(current, bump_type)
    
    print(f'Bumping version: {current} → {new}')
    update_version(current, new)
    
    subprocess.run(['git', 'add', 'setup.py'])
    subprocess.run(['git', 'commit', '-m', f'chore: bump version to {new}'])
    subprocess.run(['git', 'tag', '-a', f'v{new}', '-m', f'Version {new}'])
```


## Contents

- [Multi-Package Versioning](references/details.md)
- [Common Issues](references/details.md)
- [Best Practices](references/details.md)
- [Related Skills](references/details.md)

## When to Use This Skill

Use this skill when:
- Implementing version numbering standards
- Automating release versioning
- Generating changelogs automatically
- Setting up release pipelines
- Managing package versions

## Limitations

- A release is real. It creates a tag, a GitHub release and possibly an npm package. Run the dry run first, and never release without the user's say-so.
- Never deploy to production without explicit approval. Docs-only import: upstream scripts and templates not bundled.
- Without conventional commit messages the tools cannot work out a bump. Say so rather than guessing.

> Adapted from [BagelHole/DevOps-Security-Agent-Skills](https://github.com/BagelHole/DevOps-Security-Agent-Skills) (MIT); frontmatter, When to Use/Limitations, and safety boundaries added for upstream compliance. Docs-only import: helper scripts and templates not bundled.

Licence note: the original skill by BagelHole is MIT licensed. sickn33 shares it in a collection whose written content is CC BY 4.0. Credit both when you reuse it.
