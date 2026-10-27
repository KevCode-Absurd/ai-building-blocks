---
name: native-data-fetching
description: Use when implementing or debugging ANY network request, API call, or data fetching. Covers fetch API, React Query, SWR, error handling, caching, offline support, and Expo Router data loaders (`useLoaderData`).
risk: critical
source: https://github.com/expo/skills/tree/main/plugins/expo/skills/native-data-fetching
source_repo: expo/skills
source_type: official
date_added: 2026-07-01
license: MIT
license_source: https://github.com/expo/skills/blob/main/LICENSE
---

# Expo Networking

AI Blocks note on the licence: the MIT line in the front matter above is the original author's (Expo) header. The licence that applies to this copy in the AI Blocks catalogue is CC BY 4.0, as the LICENSE-CONTENT file in this folder says.

**Core steps (the short version; the detailed guide has the full procedure).**
1. Ask for the API base URL, the login method, the list of screens and the data each screen needs, and how fresh each piece of data must be.
2. Write the fetch code first: plain `fetch` with error handling. Move to React Query for bigger apps or SWR for simpler ones.
3. Set how long data stays fresh (`staleTime`), how often a failed request retries, and keep saved answers on the phone.
4. Watch the connection with NetInfo, pause or resume requests, and show saved data when offline.
5. Keep login tokens in `expo-secure-store`, with a refresh step. Never keep a secret key in app code.
6. Put server addresses in `.env.development` and `.env.production` using `EXPO_PUBLIC_` names. Secret keys stay on the server side.
7. Give the user one code file for each part (fetch, cache, offline, token storage, environment), each with a short note on what to test: the network off, an expired token refresh, and a search of app code for secret keys.

**You MUST use this skill for ANY networking work including API requests, data fetching, caching, or network debugging.**

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use

Use this skill when:

- Implementing API requests
- Setting up data fetching (React Query, SWR)
- Using Expo Router data loaders (`useLoaderData`, web SDK 55+)
- Debugging network failures
- Implementing caching strategies
- Handling offline scenarios
- Authentication/token management
- Configuring API URLs and environment variables

If you have a plan for the app from an earlier step, use its list of screens and data to decide what to fetch. A short description of the data your screens need is enough to start.

## Example Invocations

User: "How do I make API calls in React Native?"
-> Use fetch, wrap with error handling

User: "Should I use React Query or SWR?"
-> React Query for complex apps, SWR for simpler needs

User: "My app needs to work offline"
-> Use NetInfo for status, React Query persistence for caching

User: "How do I handle authentication tokens?"
-> Store in expo-secure-store, implement refresh flow

User: "API calls are slow"
-> Check caching strategy, use React Query staleTime
User: "How do I configure different API URLs for dev and prod?"
-> Use EXPO*PUBLIC* env vars with .env.development and .env.production files
User: "Where should I put my API key?"
-> Client-safe keys: EXPO*PUBLIC* in .env. Secret keys: non-prefixed env vars in API routes only

User: "How do I load data for a page in Expo Router?"
-> See references/expo-router-loaders.md for route-level loaders (web, SDK 55+). For native, use React Query or fetch.

## Limitations

- Use this skill only when the task clearly matches its upstream product or API scope.
- Verify commands, API behavior, pricing, quotas, credentials, and deployment effects against current official documentation before making changes.
- Do not treat generated examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
