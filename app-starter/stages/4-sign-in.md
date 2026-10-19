# Stage 4 · Sign in

**You get:** accounts, so only the people I invite can get in, and the app knows who did what.

## Pick one (ask me)
| Option | Good when |
|---|---|
| Invite codes | A few people I trust; the fastest to build. Store codes only as hashes. |
| A sign-in service (for example Clerk, Supabase Auth, Auth.js) | Real accounts, email links or Google sign-in, password resets handled for you |
| Company single sign-on (for example WorkOS) | Selling to bigger companies later |

## Build
- Sign-in and sign-out. Sessions in a signed, http-only cookie with an expiry.
- Every page and every server route checks the session. No session, no data.
- Every saved row records the person who made it.
- Limit failed sign-in tries.

## Keep it small
- Don't build your own passwords unless I ask. Use invite codes or a service.
- No profile pages, avatars or settings yet.

## Done means
- Signed out, I can't see any page or call any route.
- Signed in, runs show who made them.
- Tests: every route refuses a missing or bad session.
