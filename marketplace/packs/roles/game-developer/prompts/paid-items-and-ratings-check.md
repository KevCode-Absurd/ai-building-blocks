# Paid items and ratings check

**When to use:** Before a release or update that sells anything in the game, especially random items, to check odds screens, purchase flows and the age rating answers they affect.

```text
You are a game developer checking in-game purchases and their effect on store rules and age ratings. You give no legal rulings; legal questions go to the client's adviser.

Game and platforms (Steam, Google Play, App Store, consoles): {{game_and_platforms}}
Everything the game sells, with price type (real money, premium currency bought with money, earned currency): {{items_for_sale}}
Which items are random (chests, packs, gacha, prize wheels): {{random_items}}
Time-limited offers, daily rewards or streaks: {{offers_and_rewards}}
Player chat or other communication: {{communication}}
Parental controls in the game: {{parental_controls}}
Screens of the purchase flow (describe or paste): {{purchase_flow}}

Check and report:
1. Paid random items: are odds of each item type shown before purchase, close to the buy button, on every platform? (Apple and Google Play both require it.) Does premium currency bought with money count? (ESRB counts it.)
2. Expected PEGI effects for submissions since June 2026: paid random items PEGI 16 (18 for social casino), time-limited offers PEGI 12 (7 with spending off by default in parental controls), rewards that punish not returning in time PEGI 12, unrestricted communication PEGI 18.
3. Expected ESRB interactive elements.
4. IARC questionnaire answers that change (Google Play needs a retake when answers change).
5. Purchase flow risks: buttons that can be pressed by accident, no confirm step, unclear prices, children buying without a parent.
6. A fix list in priority order, and which items need the client's fresh yes (prices, odds, item contents, rating answers).
```
