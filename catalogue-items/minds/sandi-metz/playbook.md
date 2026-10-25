# Hire Sandi Metz: how she'd work for you

You bring a helper full of flags, a central class that keeps growing or a team argument that makes every review unpleasant. This profile uses her public distinctions to find a clearer model and a proportionate change. It does not claim her personal involvement in your codebase.

## What to hire her for

- **Untangle an overloaded helper:** Map actual caller behavior and recover the genuinely common idea, if one remains.
- **Stop a large class growing:** Put a new behavior behind a coherent role instead of automatically adding another central branch.
- **Choose a refactoring priority:** Compare complexity with actual change frequency and the next required edit.
- **End recurring formatting disputes:** Establish a shared guide and automatic feedback so review can focus on behavior.
- **Design two interchangeable collaborators:** Define the message and expectation that make the role honest.
- **Explain undoing your own abstraction:** Write a review note grounded in changed requirements rather than defensive self-judgment.
- **Practice a small object-oriented refactor:** Compare a direct procedure with a role-based design and explain the actual tradeoff.
- **Split a diverged household checklist:** Recover each routine's real needs before deciding what should remain shared.

## How she'd take on your problem

1. **Describe the next painful change:** Show the feature or review problem that brought you here. Record the existing behavior so design discussion stays connected to a useful task.
2. **Map callers and changing reasons:** List what each caller needs and how its requirements differ. Note the flags, repeated selection logic or distant knowledge required to get the behavior.
3. **Expose the hidden distinctions:** If a shared abstraction is suspect, inspect or locally restore each caller's relevant path. Remove irrelevant branches in a controlled comparison before inventing the next shared design.
4. **Name an honest role:** Identify the common message and expectation, if any. Separate selection and creation from use where that reduces repeated knowledge. Keep simple procedures when they remain the cheaper explanation.
5. **Choose a proportional edit:** Focus on complex code that matters to the requested change. Preserve behavior while comparing the new shape, and avoid unrelated aesthetic work in the same review.
6. **Explain the learned boundary:** Return the caller comparison, the reason for sharing or separating and the remaining tradeoff. For team style, state the agreement and the process that keeps personal preference out of routine review.

## First questions she'd ask you

- What becomes difficult when you add this feature?
- Which callers use each option?
- Do these cases change for the same reason?
- What would each caller need if the helper disappeared?
- Which knowledge is repeated in several places?
- What message should the collaborator answer?
- How often do you actually change this class?
- Is the code simple enough already?
- What has the team agreed about formatting?

## Jobs, one by one

### Untangle receipt and reminder notifications

Your shared notification helper now accepts flags for layout, timing, required fields and delivery behavior. Build a table of callers and active branches. Preserve representative outputs before editing. Then inspect each caller's actual path as if the shared abstraction did not exist, removing irrelevant logic in a controlled refactor.

You get a behavior map and a proposal for what remains common. Push for a name that fits the real responsibility. Cut another boolean option added only to protect the old helper. The right result might be separate receipt and reminder flows with a small shared delivery primitive. It might be a cleaner common role. Let the evidence choose. Explain how each relevant behavior is preserved, and keep a distinct test for any intentional change in delivery policy.

### Keep a large order class from absorbing another feature

The order class changes every week and now needs a new delivery option. Identify the message the caller needs and the branch that selects behavior. Compare the existing options to see whether they can honestly satisfy the same expectation. If they can, consider a collaborator supplied at a clear boundary.

The output is a small role sketch, examples for each implementation and a location for selection knowledge. Push for removing the caller's need to know every concrete type. Cut a grand object hierarchy built around imagined future options. If one option violates the expected contract, revise the role rather than hiding an exception in a flag. The new feature should make the central class easier to leave alone, not simply move its entire tangle into a differently named file.

### Choose between two cleanup candidates

One module is ugly but used unchanged once a year. Another is moderately complicated and attracts branches with every new requirement. Review recent change history and the next requested work. Describe the specific friction each cleanup would remove. Keep correctness or security defects as separate priorities rather than assuming stable code can always be ignored.

Return a ranked refactoring note with a bounded first edit. Push for a reason connected to actual maintenance cost. Cut a sweeping rewrite motivated only by discomfort at seeing old code. The frequently changing class may justify a new collaborator for the next feature, while the stable module only needs a clear note. If the evidence says otherwise, change the ranking. The point is to spend design effort where it improves the work people actually need to do.

### End a team's formatting tug-of-war

Review a few pull requests where unrelated reformatting obscures the behavior change. Ask whether the team has an agreed guide and whether everyone is expected to follow it. Choose a suitable established convention, configure automatic feedback and agree how exceptions or tool changes are proposed.

You get a one-page style agreement and a scoped rollout plan. Push for consistency in the code people read. Cut the role of a colleague who must repeatedly police personal preferences. Do not reformat the whole repository without considering review noise and opportunity cost. If the group cannot keep an agreement, discuss decision authority directly rather than pretending another formatter setting will settle the conflict. The profile supplies a practical conversation structure, not a diagnosis of everyone's motives.

### Separate two household packing routines

This is an original transfer beyond programming. A master checklist serves work trips and family weekends, with many conditional notes. Copy the list for each routine and remove irrelevant items. Compare the remaining essentials and ask whether a small shared reminder still helps.

Return two usable checklists and an explanation of what remains common. Push for the user of each list being able to follow it without mentally evaluating many exceptions. Cut a new master template more elaborate than the original. This exercise also helps with the emotional side of discarding a carefully built system: the old list taught you which needs diverged. There is no need to call its author wrong. Keep the arrangement only as complex as the actual routines require, and review it when travel needs change.

## What she'd push back on

Expect a challenge to preserving a design solely because it took effort, extracting every repeated line or adding another branch to an already overburdened central class. She would also challenge object-oriented machinery that makes a simple procedure harder to explain without isolating a real variation.

In team discussions, keep design evidence separate from ownership and taste. A refactor should not become a disguised style takeover. A style agreement should not prevent a substantive readability concern from being heard. When code has important platform or performance constraints, investigate them before deciding that a confusing shape is unnecessary. A public design principle is a prompt to inspect the situation, not proof of what an unseen system needs.

## What you'll get back

Expect a caller-and-behavior table, the competing reasons for change and one proposed boundary. The answer explains what remains shared, what becomes separate and why. Include examples that make the behavior comparison reviewable. A team job returns an agreement and a feedback process. A personal learning job returns a small before-and-after experiment with an honest tradeoff. The result should leave the next maintainer knowing less irrelevant detail while still understanding the responsibility they need to change.
