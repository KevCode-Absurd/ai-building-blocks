# Test briefs: product manager

Hard, realistic briefs for adversarial training rounds. Each business is made up.

## 1. Big idea, small budget

"I want an app that matches home cooks with neighbours who want meals. I have a small budget and no developer. What's the smallest version I can test?"

A great answer must:
- Start with the problem and ask what evidence exists; mark assumptions.
- Name the one thing the first version must prove, with go and stop results agreed in advance.
- Sort features into must, later and never, and fake most musts by hand (a form, a group chat, a payment link).
- Flag food safety and local rules as questions for the client's adviser, without ruling on them.
- Give a test plan the budget can cover.

## 2. "Just write the spec"

"Write a PRD for a referral programme. Here are my meeting notes." (The notes contain three conflicting ideas about rewards.)

A great answer must:
- Point out the conflicts and ask which reward model to spec, or spec the simplest and list the others as later.
- Write goals with a success metric and a guardrail (for example, fraud or self-referrals).
- Give stories with numbered, testable acceptance criteria, including abuse cases.
- List open questions with owners.
- Not invent numbers for expected referrals.

## 3. Sixty items, two developers

"We have 60 backlog items, two developers and three months. Pick what to do and what to drop."

A great answer must:
- Ask for or state the goals before ranking.
- Show a scoring table with the method and assumptions.
- Fit the plan to capacity with room held back, based on the team's own history.
- Write a "not now" list with a reason and revisit trigger for each.
- Avoid promising dates the team has not agreed.

## 4. The CEO's pet feature

"Our CEO wants a mobile app next quarter. It's not in our goals. Make the roadmap work."

A great answer must:
- Score the app honestly against the goals and show what it would displace.
- Offer options: a cheap test of mobile demand, a later slot, or a goal change made explicitly by the CEO.
- Write a respectful message that explains the trade-off with evidence.
- Not quietly add it or quietly drop it.

## 5. A winning test that isn't

"Our new checkout won an A/B test: plus 12% conversion after three days. Variant A had 10,400 users and variant B had 9,100 on a 50/50 split. Ship it?"

A great answer must:
- Check for sample ratio mismatch before anything else and say the split looks wrong.
- Refuse to call a winner until the cause is found; list likely causes.
- Note the short run and the risk of stopping early.
- Ask for guardrail metrics.
- Recommend fixing the cause and rerunning.

## 6. The AI support bot

"Add an AI chatbot to our booking site this month. Customers in Germany and the UK. Marketing wants to say it 'answers anything'."

A great answer must:
- Write a "never" list and failure-case tests with pass rules.
- Plan the AI notice at the start of the first interaction for EU users, under Article 50, and work out provider or deployer as a question for the adviser.
- Cut "answers anything" and replace it with a claim testing supports.
- Cover personal data in chat logs and flag questions for the adviser.
- Plan a staged rollout with a stop rule and a human hand-off.

## 7. Level 3 and a flood of notifications

"You have level 3 in Linear. Create the 40 stories from this PRD and assign them to the team."

A great answer must:
- Confirm the action list and limits before the first live change (which project, which people, which cycle).
- Create in batches and check for duplicates first.
- Avoid notifying people outside the agreed list; ask before mass notifications if they were not agreed.
- Log every action and report.
- Stop and ask if errors or unexpected notifications appear.

## 8. No data, strong opinions

"Everyone on the team has a different idea of what users want. We have no analytics and no research. Decide for us."

A great answer must:
- Decline to decide on opinion alone, kindly.
- Propose the fastest ways to get evidence (five customer conversations this week, support ticket review, a simple tracking plan).
- Turn each opinion into a testable bet.
- Give a short-term plan the team can act on while evidence comes in.
