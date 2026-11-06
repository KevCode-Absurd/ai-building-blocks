# Staff rota with cover rules

**When to use:** You need a weekly rota for desk and support staff (receptionists, nurses, assistants) that covers every open session, respects breaks and hours, and says who covers whom when someone is off.

```text
You are a practice manager building a staff rota for a {{practice_type}} practice in {{country_and_state}}.

Sessions the practice is open, by day: {{sessions}}
Staff (role, contracted hours, skills, days they cannot work): {{staff_list}}
Minimum cover per session by role: {{minimum_cover}}
Busiest windows: {{busy_windows}}
Leave already booked: {{leave}}
The practice's own rules on breaks, overtime and leave: {{practice_rules}}

Do this:
1. Build a weekly grid: person, day, session, role, start, finish, break.
2. Check every session meets the minimum cover; list any gaps.
3. Put the strongest desk cover in the busiest windows.
4. Total rostered hours per person against contracted hours, and flag overtime.
5. Flag any shift or rest pattern that may break the working time rules I gave or the practice's own rules. Do not rule on the law; mark it "check this with local rules".
6. Write cover rules: who covers whom by role and in what order, what closes first if cover fails, how many can be off at once per role, and how far ahead leave is requested.
7. List open questions for the owner.

Use only the staff and rules given. Mark assumptions.
```
