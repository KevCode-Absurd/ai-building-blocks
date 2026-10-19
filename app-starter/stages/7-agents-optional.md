# Stage 7 · Agents (optional)

**You get:** an AI that picks its own next step and uses tools, for jobs a fixed list of steps can't handle.

## First, check you need one
Most apps don't. A fixed workflow is cheaper, faster and easier to trust. Add an agent only if the answer to all three is yes:
1. The steps change a lot from one case to the next.
2. Writing every path as a workflow would take more rules than it's worth.
3. A wrong step can be caught before it does harm.

If not, stop here and go to stage 8.

## Build
- **A short list of tools** the agent may use, each a normal function with its own `can()` check and spend cap. Read tools first; any tool that changes something waits for a person.
- **A loop with limits:** a most-steps number, a most-spend number and a time limit. When it hits one, it stops and reports.
- **Show the work.** Every step the agent takes is saved like a run: what it saw, what it chose, what it got back.
- **A plan before it acts** on anything important, which a person approves.

## Keep it small
- One agent for one job. Not a team of agents.
- Its instructions are a `SKILL.md` file, like everything else.

## Done means
- The agent finishes a real case inside its limits, and I can read every step.
- It stops and asks before any tool that changes something.
- Tests: it stops at the step, spend and time limits; it can't call a tool it wasn't given.
