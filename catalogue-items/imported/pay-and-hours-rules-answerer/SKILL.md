---
name: wage-hour-qa
description: >
  Jurisdiction-aware wage/hour and employment Q&A — classification, overtime,
  meal/rest breaks, leave, final pay — answered for the specific state/country
  with the controlling rule researched and cited rather than stated from
  memory. Use when the user asks any employment law question, or says "what's
  the rule in [state]", "is this exempt", "do we have to pay overtime for",
  or "can we classify this as".
argument-hint: "[question]"
---

# Wage and hour Q&A

Answer one pay, overtime, break, leave or final-pay question for the place the person works, with the rule looked up and cited. This is research help, not legal advice. Say so, and tell the user to confirm anything they will act on with an employment lawyer or the state labour agency.

## Before you start

You need the question and the state or country it is about. Role details (pay, duties, hours) help for exemption and overtime questions.

- If the place is missing, ask once. For a question about one employee, ask where that person works. For a policy question across several places, ask for the list and research the strictest first.
- If role details are missing for an exemption question, answer the rule and list the facts you still need. Don't decide for them.
- Research needs web search or a legal research tool (Westlaw, CourtListener or your firm's). If the AI has neither, say "Not verified: no research tool" at the top and tag every cite `[model knowledge — verify]`.

## Step 1: Place

State which state or country the answer covers. The answer applies only there.

## Step 2: Research the rule, then state it

> **Research before answering.** Find the rule in force now. Cite the controlling source (statute, regulation, wage order or case) with a pinpoint cite. Note the effective date and whether the rule was recently amended, indexed or is in litigation. If you can't verify the current rule, say so. Do not state a rule you haven't confirmed.

State the rule in one paragraph, tied to the cite. Check currency with extra care for:

- Salary thresholds for any exemption (federal and state; several states index annually, and some have tiers by employer size).
- Final-pay timing on firing vs. resigning (many states differ).
- PTO payout (some states require it, some leave it to policy).
- Meal and rest breaks, and any penalty pay for missed breaks.
- Daily or weekly overtime rules (some states have daily overtime and double time that federal law doesn't).
- Classification tests (the right test depends on place and purpose).

Typical questions, and what to research for each. Don't answer them from memory.

- "Is this role exempt?" Federal and state salary thresholds (with any employer-size tiers) and the duties test.
- "Do we have to pay overtime for X?" Federal FLSA overtime plus state rules (daily overtime, double time, alternative workweeks).
- "Do we have to give meal or rest breaks?" The state rule and the penalty for missed breaks.
- "When is final pay due?" The state rule, termination vs. resignation, and late-pay penalties.
- "Do we have to pay out accrued PTO?" The state rule and any carve-out for caps or use-it-or-lose-it policies.
- "Can we classify this person as a contractor?" This is a classification question. Use the Employee or contractor checker.

> **No silent supplement.** If the research tool returns few or no results for the place and question, report what was found and stop. Don't fill the gap from web search or model knowledge without asking. Say: "The search returned [N] results from [tool]. Coverage looks thin for [place / question]. Options: (1) broaden the search, (2) try a different tool, (3) search the web, with results tagged `[web search — verify]`, or (4) mark the question unverified and stop. Which do you want?"
>
> **Source tags.** Tag every cite with where it came from: `[Westlaw]`, `[CourtListener]`, or the connector name; `[web search — verify]`; `[model knowledge — verify]`; `[user provided]`. Never strip the tags.

### Step 2a: Regular-rate and back-pay questions

When the question is a back-pay or unpaid-overtime calculation, or turns on the FLSA "regular rate", use this scaffold. Don't answer from hourly wage x overtime hours alone.

1. **The regular rate is not just the hourly wage.** It is all pay for the work except the eight exclusions in 29 U.S.C. §207(e)(1)-(8) (such as discretionary bonuses, gifts, expense reimbursements). Non-discretionary bonuses, commissions and shift differentials are in. Divide the bonus by the hours worked in the bonus period.
2. **State the pay posture before you compute.** If straight time was paid for all hours including the overtime hours, the amount owed is the half-time premium: `0.5 x regular rate x OT hours`. If the overtime hours were not paid at all, it is `1.5 x regular rate x OT hours`.
3. **Show the formula and the inputs:**
   ```
   Regular rate = (straight-time wages + non-discretionary bonuses + other non-excluded pay) ÷ total hours worked
   ```
4. **Say what else may apply.** Liquidated damages can double back pay (29 U.S.C. §216(b), §260). The lookback is 2 years, or 3 if willful (29 U.S.C. §255(a)). Many states have longer lookbacks and different overtime rules. Flag California, New York, Massachusetts and Washington as frequent overlays.
5. **Tag the number.** Put `[verify — consult wage-and-hour counsel before asserting or paying]` on the line with any amount.

If a needed input is missing (bonus detail, whether straight time was paid for overtime hours, willfulness, state), ask before computing. A confident wrong number is the worst output this skill can produce.

## Step 3: The flag

Is it a close call? Be honest.

- Clear: "Exempt. Meets each element of the duties test and the current salary threshold."
- Close: "The duties test is borderline. Classify as non-exempt to be safe, or get a formal opinion."
- In flux: "This rule was amended recently. The current version takes effect [date]. Confirm before relying on it."
- Not verified: say so. Don't guess.

## Output format

Conversational. A Q&A, not a memo.

```
**[Place]:** <the researched rule, one paragraph, with pinpoint cite, source tag and currency note>

Close call or changing law: <the flag, or "Clear on the researched rule">

Other places: <one line if the answer differs in other places the user named, and whether it matters>

Sources: <each cite with its tag> | Not verified: <anything unchecked>

Next steps: <2 to 4 options, such as get more facts, ask a lawyer, watch for a rule change>
```

> **Verify citations.** Any case, statute, regulation or wage-order cite here was produced with AI help. Check it against Westlaw, CourtListener, the state agency's site or your firm's research tool before relying on it. Made-up or misquoted cites have led to sanctions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [People cost budget builder](https://useaiblocks.com/skills/people-cost-budget-builder). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## What this skill does not do

- State the rule from memory. Every answer is grounded in a cited source, or marked unverified.
- Decide borderline cases. It states the rule and flags the close call. A person decides.
- Give a 50-state survey unless asked.
- Track changes. If a threshold indexes or the law shifts, the answer goes stale. Ask again for the current rule.
