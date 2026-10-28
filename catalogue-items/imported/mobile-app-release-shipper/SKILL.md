---
name: expo-deployment
description: "Deploy Expo apps with EAS: build and submit iOS and Android releases, configure build and submit profiles, manage versions and store metadata, and deploy web bundles or API routes."
risk: critical
source: https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-deployment
source_repo: expo/skills
source_type: official
date_added: 2026-07-01
license: MIT
license_source: https://github.com/expo/skills/blob/main/LICENSE
---

# Deployment

AI Blocks note on the licence: the MIT line in the front matter above is the original author's (Expo) header. The licence that applies to this copy in the AI Blocks catalogue is CC BY 4.0, as the LICENSE-CONTENT file in this folder says. Keep the credit to Expo.

Costs: EAS builds use your Expo plan, and its free build allowance is limited. Apple and Google charge for developer accounts. This skill does not check current prices, so tell the user to look them up before building.

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

## First run, in order (added by AI Blocks)

Gather first: the Apple ID email, the App Store Connect app ID, the path to the Google Play service account key file (never paste the key itself), and the app's bundle identifier. If `eas.json` sets `appVersionSource` to `remote`, EAS keeps the version and build numbers on its servers, not in your app config.

1. Install the EAS command-line tool.
2. Sign in with `eas login`.
3. Run `eas init` to create `eas.json`.
4. Make the first production build for one platform, and check its status.
5. Show the user the exact submit command and ask for a clear yes before running it. Then send the first iOS build to TestFlight, or the first Android build to the Google Play internal track. Needs a paid Apple developer account for iOS.
6. Check the submission status with `eas submit:list`.

## When to Use

Use this skill when you need deploy Expo apps to production with EAS — build and submit to the iOS App Store, Google Play Store, and TestFlight, configure eas.json build and submit profiles, manage app versions and build numbers, publish App Store metadata and ASO, and deploy web bundles and API routes via EAS...


This skill covers deploying Expo applications across all platforms using EAS (Expo Application Services).

## References

Consult these resources as needed:

- ./references/workflows.md -- CI/CD workflows for automated deployments and PR previews
- ./references/testflight.md -- Submitting iOS builds to TestFlight for beta testing
- ./references/app-store-metadata.md -- Managing App Store metadata and ASO optimization
- ./references/play-store.md -- Submitting Android builds to Google Play Store
- ./references/ios-app-store.md -- iOS App Store submission and review process

## Quick Start

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Initialize EAS

```bash
npx eas-cli@latest init
```

This creates `eas.json` with build profiles.

## Build Commands

### Production Builds

```bash
# iOS App Store build
npx eas-cli@latest build -p ios --profile production

# Android Play Store build
npx eas-cli@latest build -p android --profile production

# Both platforms
npx eas-cli@latest build --profile production
```

### Submit to Stores

**Before you submit (AI Blocks):** a `--submit` command sends a real build to App Store Connect or Google Play, and it can start a review that is hard to undo. Show the user the exact command and which store it sends to, and wait for a clear yes before you run it. Start with TestFlight or the Google Play internal track. Never put a service account key or an Apple password into the chat or into a file you commit. This skill is for Expo projects only. For a bare React Native project or a website, use that project's own build and hosting steps instead.

```bash
# iOS: Build and submit to App Store Connect
npx eas-cli@latest build -p ios --profile production --submit

# Android: Build and submit to Play Store
npx eas-cli@latest build -p android --profile production --submit

# Send the latest iOS build to TestFlight (needs a paid Apple developer account; show the user the command and wait for a yes first)
npx eas-cli@latest submit -p ios --latest
```

## Web Deployment

Deploy web apps using EAS Hosting:

```bash
# Deploy to production
npx expo export -p web
npx eas-cli@latest deploy --prod

# Deploy PR preview
npx eas-cli@latest deploy
```

Expo Router API routes deploy together with the web bundle on EAS Hosting — `eas deploy` ships both. To author or configure the API routes themselves, use the `expo-api-routes` skill.

## EAS Configuration

Standard `eas.json` for production deployments:

```json
{
  "cli": {
    "version": ">= 16.0.1",
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true,
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "[YOUR APPLE ID EMAIL]",
        "ascAppId": "[YOUR APP STORE CONNECT APP ID]"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

## Platform-Specific Guides

### iOS

- Use `npx eas-cli@latest submit -p ios --latest` for TestFlight submissions (ask the user for a yes first). The `npx testflight` shortcut is not used here, because we have not checked that package.
- Configure Apple credentials via `eas credentials`
- See ./references/testflight.md for credential setup
- See ./references/ios-app-store.md for App Store submission

### Android

- Set up Google Play Console service account
- Configure tracks: internal → closed → open → production
- See ./references/play-store.md for detailed setup

### Web

- EAS Hosting provides preview URLs for PRs
- Production deploys to your custom domain
- See ./references/workflows.md for CI/CD automation

## Automated Deployments

EAS Workflows automate the build → submit → update → deploy pipeline for CI/CD. See ./references/workflows.md for deployment-oriented examples. To author or validate workflow YAML, use the `expo-cicd-workflows` skill — it works from the live workflow schema.

## Version Management

EAS manages version numbers automatically with `appVersionSource: "remote"`:

```bash
# Check current versions
eas build:version:get

# Manually set version
eas build:version:set -p ios --build-number 42
```

## Monitoring

```bash
# List recent builds
eas build:list

# Check build status
eas build:view

# View submission status
eas submit:list
```

**Output:** finish by listing the build ID for each platform and the submission status for each store (for example, iOS: sent to TestFlight; Android: not submitted yet).

## Limitations

- Use this skill only when the task clearly matches its upstream product or API scope.
- Verify commands, API behavior, pricing, quotas, credentials, and deployment effects against current official documentation before making changes.
- Do not treat generated examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Release readiness and live version checker](https://useaiblocks.com/skills/deploy-verifier). It takes the deploy url.
- The [Live software release reviewer](https://useaiblocks.com/skills/release-proof-checker). It takes the deploy url.
- The [Software release verification coordinator](https://useaiblocks.com/skills/release-manager). It takes the deploy url.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
