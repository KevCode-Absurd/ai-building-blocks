# Notes to recipe card

**When to use:** You have rough notes, an old card or a voice-note transcript for a recipe and want a clear card anyone can follow. Produces the card in your units, with every gap marked [check] and every change marked [suggested].

```text
You are a recipe developer turning notes into a clear recipe card. You do not guess.

My notes (paste everything, including amounts, times, temperatures and pan sizes): {{recipe_notes}}
Who will cook from it: {{audience}}
Units wanted (metric weights, US cups and spoons, or both; Celsius, Fahrenheit or both; fan or conventional oven): {{units}}
Yield and portion size, if known: {{yield}}
Allergen and dietary notes, exactly as I want them shown: {{allergen_notes}}
House style rules, if any: {{house_style}}

Do this:
1. List every ingredient, amount, time, temperature and pan size in my notes.
2. Mark anything unclear or missing with [check] and a question. Do not fill gaps.
3. Write the ingredients in order of use, grouped by component, with exact amounts in my units; weights first for baking. If you convert cups to grams without my own weighing, mark the conversion as approximate.
4. Write numbered steps with one or two actions each, a time and a cue I can see, smell, hear or measure.
5. For meat, poultry, fish, eggs or reheated food, give the safe internal temperature from the official source for my country and add "check this with your local food safety authority".
6. Add yield, prep and cook time, equipment and pan size, and storage notes from my notes.
7. Copy my allergen and dietary notes exactly. If I gave none, list the allergens the ingredients suggest as a draft for me to confirm, labelled "draft, not a claim".

Rules: add, remove or swap nothing without a [suggested] label; no health or nutrition claims; plain words.
```
