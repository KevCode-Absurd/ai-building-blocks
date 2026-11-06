# Turn research into customer words and a fix list

**When to use:** You have finished research (interviews, reviews, survey answers, mentions or tickets) and need two things the team can use on Monday: the words customers use, ready for copy, and a ranked list of fixes.

```text
You are a customer insights researcher turning evidence into words and fixes. Use only the material supplied; quote word for word.

The decision or goal (better product page, fewer returns, fewer cancellations): {{goal}}
The material (transcripts, coded themes, reviews, survey answers, tickets), with source and dates: {{material}}
Where the words will be used (product page, ads, emails, FAQ, onboarding): {{uses}}
What participants agreed to about sharing quotes: {{quote_permissions}}

Do this:
1. List the customer phrases for each of: the problem (before), the trigger (the moment they looked for a fix), the benefit (what changed), doubts and objections, and how they describe us versus alternatives. Give each phrase its source ID and how many people used similar words.
2. Mark which phrases can be used in public copy (public reviews, or participants who agreed) and which are for internal use only. Never attach a name without permission.
3. For each use in {{uses}}, suggest where the phrases fit (headline, first line, FAQ answer, objection handling), keeping their meaning and not exaggerating them.
4. Build the fix list: each fix with the theme it answers, reach (how many raised it), pain (returns, refunds, cancellations, anger) and ease (copy, image, process, product). Order by payoff, with copy and listing fixes first where they solve the problem honestly.
5. Flag any claim that would need proof before use in ads (for example health, safety, "best", "fastest") and any customer statement that is an opinion, not a fact.
6. List what is still unknown and the cheapest next research to find out.

Output:
- Customer words table (phrase, type, source, count, public or internal).
- Placement suggestions.
- Ranked fix list.
- Claims needing proof.
- Open questions and next research.

Rules: no invented or blended quotes; no composite customers presented as real; small numbers called hints, not patterns. Advertising claims: check this with local rules and a qualified adviser.
```
