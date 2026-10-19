# Stage 9 · Combine apps (when you have two or more)

**You get:** several standalone apps behind one sign-in, sharing what they all use, so a fact fixed once is right everywhere.

Build each app on its own first. Combine them only when two apps keep copying the same data.

## Build
- **Find what's shared.** List what each app reads: brand facts, customers, offers, files, people, caps. Anything two apps read moves to one shared place.
- **One shared store** for those things, with the same workspace rules as stage 5. Each app reads it; only owners change it.
- **One sign-in and one set of workspaces** for all the apps.
- **An app switcher** in the header. The current workspace stays the same when you switch.
- **Shared spend caps**, plus a cap per app if one of them is expensive (video, for example).
- **Keep each app's own data in its own tables.** Combining is about sharing, not merging everything into one screen.

## Keep it small
- Don't rebuild the apps. Move the shared parts, then point each app at them.
- If an app works fine alone and shares nothing, leave it alone.

## Done means
- I change a brand fact once, and every app uses the new one on its next run.
- One sign-in reaches every app; a person removed from a workspace loses access to all of them.
- Tests: each app still passes its own tests; the shared store refuses other workspaces.

Example: Mercatura is three standalone apps (Creative Studio, Landing Pages, SEO) sharing one brand brain. See useaiblocks.com/apps/mercatura.
