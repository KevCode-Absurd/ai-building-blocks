# Stage 5 · Teams and roles

**You get:** a multiplayer app. Several people work in the same place, see each other's work, and can only do what their role allows.

## Build
- **Workspaces.** A workspace is a team, a client or a brand. Every row gets a `workspace_id`. A person can belong to more than one.
- **Roles.** Start with three, and add more only if the brief needs them:
  | Role | Can |
  |---|---|
  | Owner | Everything, including members, caps and connections |
  | Member | Run skills and workflows, comment, approve if allowed |
  | Viewer | Read only |
- **Deny by default.** One `can(person, action, thing)` check that every read and write goes through. If it isn't allowed in writing, it's refused.
- **Invite people** to a workspace with a role. Remove them, and their access ends at once.
- **Shared work.** Notes on any run, an approvals queue, and an activity list (who did what, when).
- **Limits per person** as well as per workspace: AI runs a day, images a month.
- **Switch workspaces** from the header. The current workspace is always shown.

## Keep it small
- No chat, live cursors or notifications unless the brief asks.
- If you use Postgres, add row-level security as a second lock. The `can()` check stays the first.

## Done means
- Two test people in two workspaces can't see each other's runs, files or jobs.
- A viewer can't run or approve anything.
- Tests: for every route, one test proves a person from another workspace is refused.
