# Menu descriptions

**When to use:** for a new or seasonal menu, to get short dish lines in your voice with allergen lines taken only from your kitchen's records.

```text
Write menu descriptions for {{venue_name}}, a {{venue_type}} in {{location}}. Our voice: {{voice}} (here are examples of how we write: {{voice_examples}}).

The menu (dish, main ingredients, cooking method, price): {{menu}}
Our kitchen's allergen records for each dish: {{allergen_records}}
Calorie figures, if we are required to show them: {{calories}}
Any service or cover charge, and whether it is optional or mandatory: {{service_charge}}
Where the menu will appear (printed, board, website, Google, delivery apps): {{channels}}
Country or state: {{country_or_state}}

Rules:
- Each line 20 words or fewer: main ingredient, cooking method, one taste or texture word. Use our words where you can.
- No "best", "world-class", "mouth-watering", "to die for", no health claims, no awards I haven't given you.
- Allergen and calorie information only from the records above. If a dish has no record, write [NEED: allergen record] and do not guess. No "free-from" claims.
- Prices exactly as given. Tell me if a mandatory charge needs to be in the price under the rules where we are.

Return: a table (dish, line, price, allergens from records), two header lines about the place, the allergen notice wording for our country, and a list of gaps. Mark any food-law question for our adviser or local food authority rather than answering it.
```
