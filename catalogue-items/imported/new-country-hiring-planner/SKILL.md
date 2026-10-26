---
name: hr-global-expansion
description: "Help HR and business leaders plan the people and HR infrastructure needed to expand into a new country or region. Use when asked to plan HR for entering [country], decide between entity setup and EOR for a new market, build an HR readiness plan for expansion, assess labor law requirements for [country], or hire our first employees in a new market."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# Global expansion (HR)

Plan the people and HR infrastructure needed to enter a new country or region: entity vs. EOR decisions, local labor law compliance, hiring strategy, and HR readiness before the first local hire.

This is planning help, not legal advice. Say so in the output, and tell the user to have a local employment lawyer or an EOR provider confirm the rules before anyone is hired.

## Before you start

You need three facts: the country (or the two countries being compared), the number and type of roles, and the target timeline. Optional: company size, current setup (any local entity, payroll or vendor already in place), and budget.

If a required fact is missing, ask for it once, in one message. If the user can't answer, write "MISSING: <fact>" in the plan and carry on with a stated assumption. Never invent a country's rules, a cost or a legal threshold. When you can't check a rule (no web search), say "check locally" next to it.

## Steps

1. **Gather the brief.** Country, roles, timeline, company size, setup. Repeat it back in two lines.
2. **Compare entry routes.** Build a table: own local entity vs. employer of record (EOR; a provider that hires on your behalf), and a third column for a contractor route only if the roles could lawfully be contract roles. Rows: set-up time, cost shape (set-up fee, monthly fee, per-employee cost), control, compliance risk, how easy it is to exit. Give a recommendation for this headcount and say what would change it.
3. **List the local rules to check.** Employment contract form, probation, notice and severance, working time and leave, statutory benefits and employer contributions, payroll and tax registration, data protection, works council or union rules. Mark each "known" or "check locally". Don't state a number you can't source.
4. **Build the hiring and pay plan.** Where to find talent in that market, how to benchmark pay (name the type of source, such as a local salary survey; don't invent pay figures), which parts of your handbook need adapting, and what managers should learn about local working culture.
5. **Set the EOR-to-entity trigger.** Say at what headcount, spend or length of stay moving to your own entity starts to make sense, and what to check before you switch.
6. **Write the dated sequence.** Work back from the target start date: decision, provider or entity set-up, contract template, payroll set-up, recruiting, offer, start. Give each step a week or month and an owner.
7. **Close with next steps.** Three to five actions, including who confirms the legal points.

## Output

Return these sections, in this order. Keep the whole answer under about two pages.

```
BRIEF
  Country <...> | Roles <...> | Timeline <...> | Assumptions <...>

ENTITY OR EOR
  <comparison table> | Recommendation: <route> because <reason> | What would change it: <...>

LOCAL RULES TO CHECK
  <rule area> | <known fact or "check locally"> | Who confirms: <lawyer, EOR, authority>

HIRING AND PAY PLAN
  Sourcing: <...> | Pay benchmark: <source to use> | Policy changes: <...> | Manager prep: <...>

WHEN TO MOVE TO YOUR OWN ENTITY
  <trigger and checks>

DATED SEQUENCE
  <week or month> | <step> | <owner>

NEXT STEPS AND MISSING
  <actions> | MISSING: <every gap>
```

## Supported tasks

- Assessing entity establishment vs. Employer of Record (EOR) options for a new market
- Building an HR readiness plan for entering a new country
- Researching local labor law, statutory benefits, and employment requirements
- Designing hiring strategy and sourcing approach for a new market's talent landscape
- Benchmarking compensation and benefits for the new market
- Planning local HR policy and handbook adaptation for the new country
- Assessing payroll and tax compliance requirements for the new market
- Building a timeline and sequencing plan for first local hires
- Identifying cultural and management practice differences to prepare leaders for
- Evaluating local HR vendor and PEO/EOR provider options
- Planning for local works council, union, or employee representation requirements
- Scaling from EOR to a local entity as headcount in the market grows

## Key prompts

### Entry strategy

1. "Compare entity establishment vs. EOR options for hiring our first [number] employees in [country], including cost, timeline, and risk trade-offs."
2. "Build an HR readiness plan and timeline for entering [country], covering compliance, hiring, and policy needs."
3. "At what headcount or timeline threshold should we consider transitioning from EOR to a local entity in [country]?"
4. "What are the practical trade-offs of hiring in [country A] versus [country B] for the same role and budget?"

### Compliance and local requirements

1. "Research the key labor law, statutory benefits, and employment contract requirements for hiring employees in [country]."
2. "What payroll and tax compliance requirements apply to employing staff in [country]?"
3. "Are there works council, union, or employee representation requirements we need to plan for in [country]?"
4. "What termination and severance requirements apply in [country], and how do they differ from our home-country practices?"

### Hiring and compensation

1. "Design a hiring strategy and sourcing approach appropriate for the talent market in [country]."
2. "Benchmark compensation and statutory/customary benefits for [role] in [country] against local market norms."
3. "Evaluate local HR vendor, PEO, or EOR provider options for [country] based on our expected headcount and needs."
4. "How should offer letters and employment contracts be adapted for [country] to remain legally compliant?"

### Local adaptation

1. "Adapt our HR policy handbook for local compliance and cultural fit in [country]."
2. "What cultural and management practice differences should our leaders be prepared for when managing a team in [country]?"
3. "How do we adapt our performance review and feedback approach for cultural norms in [country]?"
4. "What holidays, working-time norms, and leave entitlements in [country] should we build into our local calendar and policies?"

## Tips

- Start with an EOR for market-testing or small initial headcount; establishing a local entity is a significant commitment better made once demand is proven.
- Research statutory requirements early: probation periods, notice requirements, severance, and mandatory benefits vary widely and materially affect cost and hiring approach.
- Don't copy-paste HQ policy into a new market; adapt for both legal compliance and cultural fit, or local hires will notice the mismatch immediately.
- Budget realistically for the true cost of employment in the new market, including statutory benefits and employer contributions that may be much higher than the home country's.
- Prepare managers for cultural and management-style differences before they start leading local teams.
