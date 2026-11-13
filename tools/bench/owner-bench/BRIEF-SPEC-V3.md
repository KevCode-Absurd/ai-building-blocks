# Spec: v3 bench briefs (owner-judged)

We are testing AI agents against plain Opus, judged the way a business owner judges work. A good test brief gives an agent what a real owner would hand over, and holds a few truths in its data that a great answer should notice. Judges will ask: is it on brand, does it speak to our persona in their words, did it catch what our data shows, does it tell me something new, is it ranked by leverage, is it correct, can I use it?

## Each brief `<ID>.md` has these sections, in this order

1. `# Job <ID>: <deliverable in plain words>`
2. **Business:** the real company's name, URL and one line on what it sells. Use real public businesses only, and only facts that are widely known and true.
3. **Role wanted:** the specialist role.
4. A line saying that numbers and notes marked (test) are test inputs for this exercise, not the brand's real figures or guidelines.
5. **Brand notes (test):** 5 to 8 lines. They cover:
   - voice in 3 adjectives, with one "we say / we never say" pair;
   - the reading level;
   - words and claims to avoid;
   - design or copy principles;
   - what the brand stands for.
   Keep it consistent with the brand's known public character, but mark it as test.
6. **Who we sell to (test):** 1 or 2 personas. Give each one's situation, what they want, what stops them, and 2 or 3 phrases in their own words, as if taken from reviews or calls.
7. **Data (test):** the numbers the job needs: tables or short lists. Hide 2 or 3 **signals** a great answer must catch without being told. Examples:
   - a segment that performs far better (an age band, region or device);
   - a past winning concept that was paused;
   - a tracking gap or a mismatch between two sources;
   - a constraint (stock, cash or team) that changes the plan;
   - a cheap fix hiding behind an expensive ask;
   - a customer phrase that should become the hook.
   The signals must follow from the data. Do not point at them or label them.
8. **What the owner wants:** the deliverable, written in the owner's words.
9. **Length:** "at most N words", followed by: "Deliver the finished work in one go; the owner is not available for questions, so state any assumption you make."

Keep each brief between 350 and 700 words. Use plain English and no em or en dashes. Never make claims about the real brand that could be false and are not marked (test).

## For each brief, also write `<ID>.owner.md` (never shown to the agents; judges see it)

- **Signals in the data:** each hidden signal, and what a great answer does with it.
- **What would delight me:** 3 to 5 specifics.
- **What would annoy me:** 3 to 5 specifics, such as generic advice, ignoring our voice, ten versions of one idea, wrong numbers, a plan with no first step, or jargon.
- **Facts a careful answer gets right:** 2 to 4 numbers or rules with the correct value, so judges can check them quickly.
