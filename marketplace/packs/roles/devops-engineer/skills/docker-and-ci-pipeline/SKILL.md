---
name: docker-and-ci-pipeline
description: Turns a team's manual build and deploy steps into a pinned multi-stage Dockerfile, a Compose file for local work and a CI pipeline (GitHub Actions, GitLab CI or Bitbucket Pipelines) that tests every pull request and deploys only from the main branch, with actions pinned to commit SHAs, least-privilege tokens, OIDC instead of stored cloud keys, secrets referenced by name, caching, a production approval gate and a redeploy-last-good rollback. Opens a pull request at access level 2; production deploys run only through the client's own pipeline at level 3 after the action list is confirmed. Use it when deploys are manual, builds differ between machines, or a pipeline is slow, failing or insecure.
---

# Docker and CI pipeline

## When to use

- Deploys are a page of manual steps, or "SSH in and git pull".
- "It works on my machine" is a weekly phrase.
- A Docker build or CI run fails and nobody knows why.
- An existing pipeline uses `latest`, unpinned actions, write-all tokens or stored cloud keys.

## What you need

1. How the app runs today: language and version, start command, port, build steps, services it needs (database, cache, queue) and files it writes.
2. The manual deploy steps, in order, exactly as someone does them now.
3. The CI tool, where it deploys (a VPS, Render, a cloud service), and who approves production.
4. The names of secrets the app needs (never the values).
5. Dependency files (`package.json` and lock, `requirements.txt`, `pyproject.toml`, `go.mod`).
6. Access: level 1 to read. Level 2 to open a pull request and run the pipeline on a branch. Level 3, within the client's limits, to merge and deploy to production through their pipeline.

## Steps

### 1. Write the manual steps down

Number every step a person does today, including the ones they "just know". The pipeline automates exactly these steps and no more. Mark risky steps: data changes, config edits, restarts, anything with downtime.

### 2. Write the Dockerfile

- **Multi-stage:** a build stage with compilers and dev dependencies, a run stage with only what runs.
- **Pinned base image:** an exact version tag at least, and a digest for production images. Tags can move; a digest cannot. Add a Dependabot or Renovate rule so updates arrive as pull requests.
- **Cache order:** copy dependency files, install, then copy the source.
- **Small and clean:** `.dockerignore` for `.git`, `node_modules`, local env files and test output; one `RUN` for `apt-get update` and install, with lists cleaned up.
- **Non-root:** create a user and switch with `USER`.
- **Health check:** a `HEALTHCHECK` or the platform's health check on a cheap endpoint.
- **No secrets:** never `COPY .env` or pass keys as build arguments; they end up in image layers.

### 3. Write the Compose file for local work

The app plus its services with pinned versions, named volumes for data, an `.env.example` listing variable names with dummy values, and a one-line start command.

### 4. Write the pipeline

- **On pull requests:** install with cache, lint, test, build the image. No secrets needed.
- **On main:** build, tag the image with the commit SHA, push to the registry, deploy to staging, run smoke tests, then wait for the production approval and deploy.
- **Pin actions** to full commit SHAs from the action's own repository, with the version in a comment.
- **Permissions:** default `contents: read`; grant more only to the job that needs it.
- **Cloud access:** OIDC to a role scoped to this deploy, not stored access keys.
- **Untrusted input:** pass pull request titles and branch names through environment variables, never straight into `run` scripts.
- **Registry pulls:** sign in to Docker Hub or use a mirror, because anonymous pulls on shared runners hit rate limits.
- **Production gate:** a GitHub environment with a required reviewer and branch rule (needs a public repo on Free, or Team or Pro), or a GitLab protected environment (Premium or Ultimate). Otherwise a manual approval step.
- **Comments:** one comment per block saying what it does and why.

### 5. Name every secret

A table: secret name, used by which job, where to set it (repository, environment, cloud secret store), who sets it. No values, ever.

### 6. Add smoke tests and rollback

- Smoke tests after deploy: home page or health endpoint, sign-in, one key action, and error logs for a few minutes.
- Rollback: redeploy the previous image tag (the last good commit SHA), as a pipeline job anyone on the team can run.
- If the release includes a migration: take a backup first, ship schema changes both versions can use, and keep destructive steps separate for a fresh yes.

### 7. Give local checks

`docker build`, `docker compose config`, `docker compose up`, the CI tool's linter (for example `actionlint`), and what success looks like for each.

### 8. Try it on staging, then production (level 3)

Run the pipeline on a branch and on staging. Before the first production deploy, show the client the action list: what deploys, where, migrations, smoke tests, rollback, who watches. After their yes, deploy through their pipeline. Anything destructive, any deletion and anything that raises spend past their cap needs its own fresh yes.

## Checks

- Every base image, action and tool has a pinned version; no `latest`.
- The image runs as non-root and holds no secrets.
- The pull request pipeline needs no secrets; production needs an approval.
- Tokens have least permissions; cloud access uses OIDC where the provider supports it.
- Every command and path comes from the brief or is marked "confirm".
- The rollback job has been run once on staging.

## Output format

1. Numbered manual steps with risky ones marked.
2. Dockerfile, `.dockerignore`, Compose file and `.env.example`, in full and commented.
3. Pipeline file in full and commented.
4. Secrets table.
5. Local check commands with expected results.
6. Smoke tests and rollback steps.
7. Production action list for the client's yes.

## Example of good output (short)

*Illustrative structure, not a real organisation: an allotment society running a Flask booking app on a VPS. Copy the shape, never the content: every fact comes from the client's own context.*

> | Secret | Used by | Set in | Set by |
> |---|---|---|---|
> | `DATABASE_URL` | deploy job | GitHub environment `production` | Owner |
> | `SECRET_KEY` | app at runtime | Server env file, root-only | Owner |
> | `DEPLOY_SSH_KEY` | deploy job | GitHub environment `production` | Owner |
>
> ```yaml
> # Tests on every pull request; no secrets available here.
> on:
>   pull_request:
>   push:
>     branches: [main]
> permissions:
>   contents: read   # raise per job only if needed
> jobs:
>   test:
>     runs-on: ubuntu-24.04
>     steps:
>       - uses: actions/checkout@<full-commit-sha>  # v4, pinned by SHA: confirm
> ```
>
> **Rollback:** run the `redeploy` job with the previous image tag (`ghcr.io/[business]/booking:<last-good-sha>`); it takes the same path as a normal deploy.
