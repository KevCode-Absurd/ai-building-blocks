---
name: hr-total-rewards
description: "Help HR managers, compensation analysts, benefits specialists, and total rewards leaders understand, design, and communicate total rewards programs. Use when asked to design a compensation structure, build a salary band, run a pay equity analysis, design a benefits package, create a total rewards statement, benchmark compensation against market, design an incentive plan, build a job leveling framework for total rewards and pay equity, calculate compa-ratio, or any compensation, benefits, and total rewards task."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR total rewards

Design, test and explain a total pay offer: salary structure and levels, market benchmarks, pay fairness checks, bonus and commission plans, benefits, and a statement that shows employees the full value of their pay.

This is a draft for HR to refine. It is not legal, tax or pay-transparency advice. Pay fairness and pay transparency rules differ by place. Say so in the output, and tell the user to check with an employment lawyer or qualified adviser before acting on a fairness result or publishing pay ranges.

## Before you start

You need the pay goals (for example hire better, keep people, control cost), the team size, the roles and levels, and the budget. Optional: current pay and benefits by person or role, market data, and the location.

If a required item is missing, ask once. If it stays missing, write "MISSING: <item>" and carry on only where you can without a guess. Never invent market pay, survey figures, benefit prices, take-up rates or statistics. Mark any market claim "needs market data" unless the user gave the data.

## Steps

1. **Restate the brief.** Goals, headcount, roles and levels, budget, location, gaps.
2. **Set the levels.** Group roles into levels by scope and responsibility, not by title. One line per level.
3. **Set the pay positioning.** Ask whether the user wants to pay below, at or above market, and for which roles. Record the choice.
4. **Build the bands.** For each level give min, midpoint and max, from market data if supplied. Show spread = (max - min) / min and the cost at midpoint against the budget. Explain compa-ratio (a person's pay divided by the midpoint) and range position in one line each.
5. **Run a pay fairness screen, only if current pay by person was given.** Compare pay within the same level. List gaps larger than a threshold the user sets, and any gap the stated reasons don't explain. Say this is a first screen, not a statistical analysis, and that a specialist should confirm anything found before remedies are decided. If demographic data was given, handle it with care and mention the legal sensitivity.
6. **Design bonus or commission.** Offer two or three options with how each pays out, what it rewards and what could go wrong. Model each against low, target and high performance and show the cost in each case.
7. **Suggest benefits.** Core first, then optional, tied to the goals and budget. No prices unless given.
8. **Outline the total pay statement.** The sections an employee sees: base pay, bonus, equity if any, benefits, time off, development, with a note on how each value is worked out.
9. **Plan the raise cycle.** Dates, who does what, the budget pool the user sets, and how raises depend on compa-ratio and performance. Don't suggest typical raise percentages unless the user gave data.
10. **Flag.** Assumptions, MISSING items, items needing legal or finance review, and the next three actions.

## Output

```
BRIEF AND ASSUMPTIONS
LEVELS               <level> | <what it means> | <roles>
PAY BANDS            <level> | min | mid | max | spread | headcount | cost at mid
FAIRNESS SCREEN      <level> | <gap found> | <reason given or "unexplained"> (or "not run: no pay data")
BONUS OR COMMISSION  <option> | rewards | pays out | cost at low / target / high | risk
BENEFITS             <core> | <optional>
TOTAL PAY STATEMENT  <sections and how each is valued>
RAISE CYCLE PLAN     <dates> | <owner> | <budget pool> | <rule>
FLAGS AND NEXT STEPS <assumptions> | MISSING: <items> | review needed: <items>
```

## Supported tasks

- Explaining total rewards concepts and philosophy for HR teams and business leaders
- Designing salary structures, pay bands, and job leveling frameworks
- Benchmarking compensation against market data by role, level, and location
- Running pay equity analyses across gender, ethnicity, and level
- Designing incentive plans, bonus structures, and sales commission models
- Building equity compensation programs (stock options, RSUs, ESPPs)
- Designing benefits packages and evaluating benefits ROI
- Creating total rewards statements that communicate full compensation value
- Calculating compa-ratio, range penetration, and other compensation metrics
- Building compensation review and merit increase cycles
- Connecting total rewards strategy to retention and talent attraction goals
- Writing compensation philosophy documents, policies, and communication templates

## Key prompts

### Compensation philosophy and structure

1. "Help me write a [compensation philosophy] document for [a 150-person Series B startup] that defines our [market positioning strategy]."
2. "Design a [salary band structure] for [Engineering roles from Junior to Staff level] using [a 10-grade leveling framework]."
3. "What is the difference between [market lead, market match, and market lag] positioning, and which fits [our current funding stage and retention needs]?"
4. "How do I decide on [pay band width and overlap] when designing [salary structures for a fast-growing company]?"
5. "Help me design a [job leveling framework] that maps consistently across [Engineering, Sales, and G&A functions]."

### Market benchmarking

1. "How do I benchmark [a Senior Product Manager role] against market data using [Radford / Mercer / Pave] survey sources?"
2. "What is the right [benchmark percentile] to target for [a critical, hard-to-fill engineering role] versus [a standard administrative role]?"
3. "How often should we refresh our [market benchmarking data] given [current market volatility in tech hiring]?"
4. "How do I adjust compensation benchmarks for [geographic pay differences] across [a distributed remote workforce]?"
5. "What survey sources should a [mid-size SaaS company] subscribe to for [comprehensive market coverage] without [overspending on survey costs]?"

### Pay equity analysis

1. "Walk me through how to run a [pay equity analysis] across [gender and ethnicity] for [a 300-person company] using [regression analysis]."
2. "We found a [pay equity gap] in [our Engineering department]. What are the most common [defensible and non-defensible] explanations for the gap?"
3. "Design a [remediation budget and rollout plan] for closing [identified unexplained pay gaps] over [the next two compensation cycles]."
4. "How do I build [pay equity analysis] into [our standard offer approval process] so gaps do not reappear after remediation?"
5. "What is the difference between [pay equity] and [pay equality], and how do I explain this distinction to [our leadership team]?"

### Incentive and equity compensation

1. "Design a [sales commission structure] for [an Account Executive team] that balances [quota attainment incentives with retention]."
2. "How do I design an [annual bonus plan] that ties [individual, team, and company performance] for [a 200-person company]?"
3. "Help me model an [equity refresh grant program] for [employees approaching their 4-year vesting cliff] to support [retention]."
4. "What are the key considerations when designing [an ESPP (Employee Stock Purchase Plan)] for [a newly public company]?"
5. "How do I communicate the [value of equity compensation] to [employees who do not have a finance background]?"

### Benefits design and total rewards communication

1. "Design a [competitive benefits package] for [a 100-person startup] balancing [cost control and talent attraction] in [our industry]."
2. "How do I evaluate whether our [current benefits vendor] is delivering [strong ROI] compared to [switching providers]?"
3. "Help me build a [total rewards statement template] that shows employees [the full value of salary, bonus, equity, and benefits]."
4. "What are the most effective ways to [communicate a compensation philosophy change] to [employees without creating anxiety or attrition risk]?"
5. "How do I structure [a flexible benefits offering] that lets employees [choose benefits relevant to their life stage] without [excessive administrative complexity]?"

## Common HR misunderstandings

### Total rewards ≠ just salary

Total rewards includes far more than base pay:

- base salary and variable pay
- equity compensation
- health and retirement benefits
- paid time off and flexible work policies
- recognition and career development investment
- the full employee value proposition

### Market match ≠ pay equity

Paying at market rate for a role does not guarantee internal pay equity. Two employees in the same role can both be "at market" while still having an unexplained gap relative to each other based on demographic factors — market benchmarking and equity analysis are separate, necessary processes.

### Higher pay does not automatically mean better retention

Compensation is a hygiene factor more than a sole retention lever. Strong total rewards professionals understand that:

- pay must be competitive and fair, but rarely is the only retention driver
- career growth, manager quality, and recognition compound with fair pay
- overpaying without addressing other retention drivers wastes budget

### More benefits options does not mean a better benefits program

A benefits package with excessive choice can create decision fatigue and lower perceived value. Effective benefits design focuses on:

- a strong, well-communicated core offering
- targeted flexibility where it matters most to the workforce
- clear total rewards communication so employees understand the value provided

## Tips

- Run a pay fairness screen before a raise cycle, not only after. It is cheaper to find and budget for gaps early.
- Show employees their total pay in a statement. Many don't see the value of benefits or equity until it is spelled out.
- When you design an incentive plan, model it at low, target and high performance before launch. A plan that looks fine on paper can pay too much or reward the wrong thing.
- Pay transparency rules are changing in many places. Build pay structures you can explain and document now.
- Don't design a pay philosophy alone. Bring in Finance and Legal early, since pay choices carry budget and legal weight.
