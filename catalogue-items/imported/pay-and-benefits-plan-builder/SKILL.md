---
name: hr-compensation-benefits
description: "Help HR managers with compensation and benefits programs. Use when asked to analyze compensation data, design a bonus plan, create benefits programs, conduct a job evaluation, write a compensation philosophy, calculate pay rates, develop retention strategies, or any compensation and benefits task."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR compensation and benefits

Compensation and benefits support: pay analysis, salary surveys and bonus plans, through to health programs, retirement benefits, total rewards statements and retention strategies. Use it to turn a team's roles and budget into one draft plan.

This is a draft for HR to refine. It is not legal, tax or job-evaluation advice. Say so in the output.

## Before you start

You need the roles (title and level), how many people in each, the pay budget, and the location and industry. Optional: current pay for each role, market data or a salary survey extract, and goals such as hiring, keeping people or cutting cost.

If a required item is missing, ask for it once. If it stays missing, write "MISSING: <item>" in the plan and carry on with a clearly labelled assumption. Never invent market pay figures, survey data, benefit prices or statistics. If the user gives no market data, build the band structure from the midpoints they state and mark every market claim "needs market data".

## Steps

1. **Restate the brief.** Roles, headcount, budget, location, industry, goals, and any gaps.
2. **Write the pay philosophy.** One short paragraph: where you aim to pay against the market (below, at or above), what pay rewards (skills, results, level), and how often pay is reviewed. Ask the user to choose if they haven't.
3. **Group roles into grades.** Put similar roles in the same grade by scope and level, not by title. Say what each grade means in one line.
4. **Build the pay bands.** For each grade give min, mid and max. Show the maths: spread = (max - min) / min, midpoint = (min + max) / 2, and the step from one grade's midpoint to the next. Use market data the user supplied for midpoints. Add a cost line: headcount x midpoint, compared with the budget.
5. **Design the bonus plan.** Name the target bonus as a percent of base for each grade, the measures it depends on, and the payout formula. Show the cost if everyone hits target, and the cost against budget.
6. **List the benefits.** Core benefits the user's location usually expects, then optional ones the budget allows. Do not quote prices or take-up rates unless the user gave them.
7. **Draft the total rewards statement outline.** The headings an employee would see: base pay, bonus, benefits, time off, and development.
8. **Check and flag.** List what you assumed, what needs market data, what needs HR or legal review (pay equity, leave, tax, equity grants), and the next three actions.

Use the key prompts below to go deeper on any step.

## Output

```
BRIEF AND ASSUMPTIONS
PAY PHILOSOPHY        <one paragraph>
GRADES                <grade> | <what it means> | <roles>
PAY BANDS             <grade> | min | mid | max | spread | headcount | cost at mid
BONUS PLAN            <grade> | target % | measures | formula | cost at target
BENEFITS LIST         <core> | <optional> | why
TOTAL REWARDS OUTLINE <headings>
TOTAL COST VS BUDGET  <base + bonus + benefits> vs <budget> | gap
FLAGS AND NEXT STEPS  <assumptions> | MISSING: <items> | review needed: <items>
```

## Supported tasks

- Analyzing compensation data and market pay trends
- Calculating pay rates and conducting job evaluations
- Designing bonus plans, variable pay, and incentive programs
- Creating equity compensation programs
- Developing health, wellness, and mental health programs
- Managing employee benefits and flexible spending accounts
- Designing paid time off and leave of absence policies
- Creating total rewards statements and reports
- Writing compensation philosophy statements
- Developing retention strategies

## Key prompts

### Compensation analysis

1. "Analyze our compensation data for [job family/department] and identify any pay equity gaps compared to market benchmarks."
2. "What are the current market pay trends for [job title] in [location/industry]? How should we adjust our pay ranges?"
3. "How should I calculate competitive pay rates for [role] using survey data from [sources]?"
4. "Help me create a salary survey report that benchmarks our compensation against [industry/competitors]."
5. "What methodology should I use to conduct a job evaluation for [position] to determine its appropriate pay grade?"
6. "How can I identify and address pay equity issues across different demographic groups in our organization?"

### Compensation strategy

1. "Write a compensation philosophy statement for [company name] that reflects our pay-for-performance culture."
2. "How should we structure our total compensation mix (base, bonus, equity, benefits) for [role level/department]?"
3. "What are the key components of a competitive total rewards strategy for [industry/talent segment]?"
4. "How can we create a compensation framework that supports our talent attraction and retention goals?"
5. "Write a total rewards statement template that clearly communicates the full value of compensation to employees."

### Bonus and incentive plans

1. "Design a bonus plan for [sales/operations/engineering] that ties payouts to [specific metrics/goals]."
2. "What are effective approaches to designing short-term incentive plans for [executive/manager/individual contributor] level?"
3. "How should we structure variable pay programs to motivate [specific team/role]?"
4. "Design a spot bonus program that recognizes exceptional contributions in a timely way."
5. "What are best practices for developing equity compensation programs (stock options, RSUs) for [company stage]?"

### Benefits design

1. "What are the essential components of a competitive employee benefits package for [company size/industry]?"
2. "How can we create a health and wellness program that improves employee well-being and reduces healthcare costs?"
3. "Design a mental health resources program that supports employee mental well-being and reduces stigma."
4. "What are best practices for designing a paid time off policy that balances employee flexibility with business needs?"
5. "How should we structure a retirement benefits program (401k, pension) to be competitive and cost-effective?"
6. "What are the key considerations for designing commuter benefits programs for [urban/remote workforce]?"
7. "How can we design a flexible benefits program that accommodates diverse employee needs?"

### Benefits administration

1. "How should we manage leaves of absence (FMLA, parental leave, medical leave) to ensure compliance and support employees?"
2. "What are best practices for managing flexible spending accounts (FSA/HSA) for employees?"
3. "How can we create a global mobility policy that supports employee relocations and international assignments?"
4. "How should we communicate benefits changes to employees in a clear and timely manner?"

### Retention and employee surveys

1. "What retention strategies are most effective for [high-demand talent segment, for example, software engineers, nurses]?"
2. "How can we use compensation data to identify flight-risk employees and proactively address retention?"
3. "What non-monetary retention strategies work alongside competitive pay to keep top talent engaged?"
4. "Write an employee engagement survey focused on compensation satisfaction and benefits effectiveness."
5. "What questions in an employee satisfaction survey best reveal concerns about pay equity and fairness?"
6. "How should I analyze survey results to identify the most effective changes to our total rewards program?"
7. "Draft a communication summarizing survey findings and planned actions back to employees who participated."

## Tips

- Conduct regular market pay reviews (at least annually) to stay competitive and prevent talent flight.
- Show employees their total compensation clearly. Many don't see the value of benefits until it is spelled out.
- Ensure all compensation decisions are documented and defensible against pay equity claims.
- Design incentive plans with clear, measurable metrics that employees can directly influence.
- Tailor benefits offerings to the demographics and preferences of your workforce through annual surveys.
