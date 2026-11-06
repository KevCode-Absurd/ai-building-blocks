# First AI rollout for a small team

**Trigger:** a team wants to start using AI properly, has bought licences that nobody uses, or has found staff using free tools with client data. Usually six to ten weeks of elapsed time, including a pilot of two to four weeks.

## Steps

1. **Intake and access (access.md questions).** Confirm the team, roles, tools and plans in use, data types, locations and outside rules (client contracts, funders, regulators). Ask which access level the client grants in each tool (AI admin consoles, documents, automation tools, staff messaging) and record it as "Access I have". Until they answer, work at level 1.
2. **Find out what staff already do.** A short anonymous survey or conversations: which AI tools, which accounts, for which tasks. Level 1.
3. **Interim rules (skill: ai-use-policy-and-register, steps 2 to 4).** If client or personal data is going into personal accounts, agree two or three interim rules at once (approved tools, data red lines, ask before trying a new tool).
   **Approval point 1:** the owner signs off the interim rules.
4. **Task map (skill: ai-task-map-and-pilot, steps 1 to 6).** Tasks by role, scored for fit, time, risk and data; two or three pilot candidates with tool types and human checks. For any task that might decide about people, run the ai-risk-check-one-use prompt and send it for legal advice before going further.
5. **Choose tools.** If the client is choosing between tools or plans, run the ai-vendor-questions prompt for each, then the ai-tool-comparison prompt.
   **Approval point 2:** the owner approves the pilot tasks, people, tools, measures and the go, change or stop rule, and any spend on licences.
6. **Prepare the pilot.** Build tested prompts with the prompt-library-entry prompt. If a candidate is a process, use the ai-workflow-redesign skill.
   - Level 2: set up the prompt library page, pilot workspace or automation as unshared drafts or switched off.
   - Level 3: after the client confirms the action list and limits, share the workspace with the pilot group, turn on agreed features or the workflow within its run and spend limits, and log each action.
7. **Train the pilot group (skill: ai-skills-workshop).** Skills check, a short session on the pilot tasks, the safe-use sheet. At level 3, send the check and materials to the named people only.
8. **Run the pilot.** Collect before and after measures exactly as planned; log errors caught by the human checks. Stop and tell the owner at once if there is an incident, a spike in errors or costs, or a data problem.
9. **Review (prompt: pilot-results-review).** Apply the agreed rule and write the decision note.
   **Approval point 3:** the owner decides go, change or stop.
10. **Full rules and register (skill: ai-use-policy-and-register).** Final policy, register entries for every tool, staff message and FAQ (prompt: staff-rollout-message-and-faq).
    **Approval point 4:** the owner signs off the policy and the message.
    - Level 2: draft the policy page, register and message in the client's workspace.
    - Level 3: publish the policy, share the register with owners, send the message to the named staff list, and change only the tool settings the client listed. Log each action.
11. **Hand over.** Review dates for the register and policy, the training follow-up, and the next candidates from the task map.

## Outputs

- Survey summary and interim rules.
- Task map with pilot candidates and tasks deliberately left out.
- Vendor questions and tool comparison (if needed).
- Pilot plan, tested prompts, training materials and the pilot decision note.
- Final AI policy, register, staff message and FAQ.
- Action log of every change made in the client's tools (level 2 or 3).

## Needs the client's approval

- The access level for each tool, and the limits for level 3 (workspaces, users, settings, run and spend caps, staff lists, dates).
- Interim rules (point 1); pilot design and spend (point 2); the pilot decision (point 3); the policy and staff message (point 4).
- Any use that might decide about people, money or health: legal advice first.
- Anything outside the level 3 limits, asked again each time.
