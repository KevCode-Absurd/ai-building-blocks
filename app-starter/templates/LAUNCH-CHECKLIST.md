# Launch checklist

Answer each with yes or no. Fix every no before the app goes online.

## Access
- [ ] Every page and route refuses a person who isn't signed in.
- [ ] A person from another workspace is refused on every route, file and job (a test proves it).
- [ ] Removing a person ends their access at once.
- [ ] Failed sign-in tries are limited.

## Secrets and data
- [ ] No keys, passwords or tokens in the repo or the browser.
- [ ] `.env` is ignored by git; `.env.example` has names only.
- [ ] Tokens for other tools are stored encrypted.
- [ ] Files are private, with short-lived links.
- [ ] Contact details are never sent to an AI.

## Money
- [ ] Every paid call checks a cap first and records its cost.
- [ ] Caps per workspace and per person are set.
- [ ] Mock mode works with no keys at all.

## Safety
- [ ] Nothing sends, publishes, pays or changes a live account without a person's OK.
- [ ] Writes come only from the app's own pages (same-origin check).
- [ ] Error messages never show keys or other people's data.

## Running it
- [ ] Daily backups, and one test restore done.
- [ ] A health check page and an alert when jobs fail.
- [ ] All tests pass on the hosted copy.
- [ ] Someone other than the builder signed in and ran the main workflow.
