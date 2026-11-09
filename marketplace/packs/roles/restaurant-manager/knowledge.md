# Restaurant manager: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Tool features change often; each one says when it was true. This kit covers how small restaurants, cafes, bars and caterers run service, cost their food and look after their reviews, bookings and online menus. It is not food safety, legal, employment or tax advice. Every food safety and allergen point here comes with one instruction: check this with your local food safety authority. Rota and pay points come with another: check local rules.

For general process work (SOPs, bottlenecks, weekly reviews, manuals) this kit builds on `operations-manager`. For review requests, Google Business Profile work and local promotion it builds on `local-marketing-specialist`. It does not repeat them.

## 1. What this role is for

**Who hires a restaurant manager.** Owners of independent restaurants, cafes, bars, food trucks and caterers, often at a new opening, with a new manager, or with high staff turnover. The signs: food cost is higher than the owner expects and nobody can say why; dishes run out on Saturday and go in the bin on Monday; each cook plates a dish differently; shifts do not pass on what happened; prices have not moved while supplier invoices have; reviews go unanswered; the online menu still shows last season's dishes.

In the agents built on this kit, the work splits into two families:
- **Food cost:** costed recipe cards, menu prices at a target food cost, menu engineering from the sales mix, monthly checks of actual against expected food cost, and fast checks when an ingredient price moves.
- **Service:** opening and closing checklists by area, prep lists with par levels, station guides, shift logs and a weekly review, plus the online menu, reviews, bookings and the rota draft.

**What good work looks like.**
- Every dish has a costed recipe card with yield, portion, cost per portion and food cost percent at today's price.
- Prices are set on purpose against a target, and the owner knows which dishes earn the most cash per plate.
- Prep follows par levels that move with the day of the week, so there is less running out and less waste.
- Opening and closing checks happen in the order the work happens, with the food safety checks the business's own system requires.
- The online menu, prices, sold-out items and allergen information match what the kitchen is actually serving.
- Reviews get a calm, specific reply, and complaints about illness or allergic reactions go straight to the owner.

**How the work is judged.** Food cost percent against target and against the expected figure; waste logged and falling; ticket times; repeat complaints; labour hours against covers; inspection results (in England, Wales and Northern Ireland, the food hygiene rating [6]); and whether fixes stick. The US Bureau of Labor Statistics describes food service managers as hiring and scheduling staff, ordering supplies, overseeing food preparation, keeping to health and safety rules, managing budgets and handling complaints [30].

**What this role does not do here.** Sign off food safety procedures or allergen information (that stays with the business's trained manager, against the local authority's rules); make pay, hiring or discipline decisions; give legal or tax advice; sign supplier contracts; or move money. Live changes in the client's tools happen only at the access level and within the limits the client set (see `access.md`).

## 2. The canon

**Auguste Escoffier, *Le Guide culinaire* (1903), and the brigade.** Escoffier organised the professional kitchen into stations, each with one owner and a clear chain of command. Two habits survive in professional kitchens: one person owns each station, and *mise en place* (everything prepared and in its place before service). Station guides and prep lists are the written form of those habits.

**HACCP (hazard analysis and critical control points).** A food safety management system finds the points where food can become unsafe, sets a check at each, says what to do when a check fails and keeps records. GOV.UK says a business's system must meet HACCP principles and that records of checks and corrective actions are the evidence if something goes wrong [5]. For small caterers in England and Wales, the FSA's Safer food, better business (SFBB) packs give ready-made "safe methods" and a daily diary to fill in [3][4].

**Michael Kasavana and Donald Smith, *Menu Engineering* (1982).** Sort each dish by two measures from the till: how much cash it makes per plate (contribution margin) and how often it sells compared with the rest of its menu section. That gives four groups, commonly called stars (high both), plowhorses or workhorses (popular, low margin), puzzles (high margin, slow) and dogs (low both). Each group gets a different move: keep, reprice or re-cost, reposition, or rework and cut.

**Cost of goods sold.** The arithmetic behind every food cost check is the same as a tax return's cost of goods sold: start with opening stock, add purchases, subtract closing stock [29]. Food cost percent is that figure divided by food sales for the same period. Owners often add labour to food and drink cost and watch the total, which the trade calls prime cost.

**Danny Meyer, *Setting the Table* (2006).** Meyer's "enlightened hospitality" puts the team first, then guests, then the community, suppliers and investors, on the view that a well-treated team serves guests better. It is a useful check on any fix that saves money by making shifts worse.

**Will Guidara, *Unreasonable Hospitality* (2022).** Guidara argues that service becomes memorable when the team notices small things about each guest and acts on them. In a small business this lives in the booking notes and the shift log, not in a budget.

**The EPA Wasted Food Scale.** The US Environmental Protection Agency ranks ways to handle food waste, with preventing it first, then donating, then upcycling, and landfill, incineration and the drain last (page updated 16 Sep 2026) [28]. Prep pars, portion control and stock rotation are prevention.

**Process tools.** The five whys, the constraint, checklists and the weekly review are in the `operations-manager` kit and apply here unchanged.

## 3. How the work is done now

### Food safety systems (as of 6 Nov 2026; check this with your local food safety authority)
- **UK.** SFBB packs cover caterers, retailers, Indian and Chinese cuisine and more, for England and Wales; Northern Ireland uses separate Safe Catering guidance. Businesses complete the pack and keep daily diary records until the next inspection (SFBB page published 5 Jun 2025) [4]. The caterers pack lists opening checks (fridges and freezers working, staff fit for work, surfaces clean, no pests, hand-washing supplies, hot water, probe working, allergen information accurate) and closing checks (food covered and labelled, use-by food thrown away, waste removed, "prove it" checks recorded) [3].
- **UK temperatures in SFBB [3].** Chilled food must be kept at 8°C or below (a legal requirement in England, Wales and Northern Ireland, recommended in Scotland), with fridges recommended at 5°C or below; frozen food at -18°C or below; hot holding at 63°C or above. The cooking safe method gives time and temperature pairs at the thickest part: 60°C for 45 minutes, 65°C for 10 minutes, 70°C for 2 minutes, 75°C for 30 seconds or 80°C for 6 seconds. Probes are checked in boiling water and melting ice and should read within 1°C.
- **UK ratings.** Food hygiene ratings run from 0 (urgent improvement necessary) to 5 (very good). Inspectors look at how food is handled, the condition of the premises and how food safety is managed. Display is required by law in Wales and Northern Ireland and voluntary in England. A business can appeal within 21 days, publish a right to reply, and ask for a re-rating visit once the fixes are made (guidance updated 30 Jun 2026) [6].
- **US.** The FDA Food Code is a model that state, local, tribal and federal regulators adopt into their own rules. The 2026 Food Code is the latest full edition (FDA page current as of 22 Oct 2026) [7]. What applies is the version your health department adopted.
- **EU.** National and local authorities enforce hygiene rules; the allergen rules below come from EU law.

### Allergens (check this with your local food safety authority)
- **UK (England, Wales, Northern Ireland).** The FSA's guidance (first published 2 Apr 2020, updated 17 Jul 2026) [2] names 14 allergens: celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, peanuts, sesame, soybeans, sulphur dioxide and sulphites above 10 parts per million, and tree nuts [1]. For loose food such as restaurant meals, the business must give allergen information for every item, in writing or verbally with a clear written notice telling customers how to get it; written information backed by a conversation is best practice. For online and phone orders, the information is given before purchase and again at delivery. Free-from claims need strict controls, and a business that cannot prevent cross-contamination should not claim gluten-free [1].
- **Natasha's Law (prepacked for direct sale).** Food packed on the same premises before it is ordered, such as a sandwich in the chiller, must carry the name of the food and a full ingredients list with allergens emphasised. SFBB says this has applied since October 2021 [3].
- **US.** FDA lists nine major food allergens: milk, eggs, fish, crustacean shellfish, tree nuts, peanuts, wheat, soybeans and sesame. Sesame was added by the FASTER Act, signed on 23 Apr 2021 and effective 1 Jan 2023. The FALCPA labelling rules cover packaged food, not food wrapped after a customer orders it (FDA page current as of 3 Nov 2026) [8]. Allergen duties for restaurants come from the locally adopted Food Code [7].
- **EU.** Regulation (EU) 1169/2011 makes the 14 Annex II allergens mandatory information for non-prepacked food, and lets each member state set how it is given. It has applied since 13 Dec 2014 [11].

### Calories on menus
- **US.** Chains with 20 or more locations under the same name must show calories on menus and boards, give written nutrition information on request and print two statements; compliance began 7 May 2018 (FDA page current as of 13 Dec 2023) [9].
- **England.** The Calorie Labelling (Out of Home Sector) (England) Regulations 2021 came into force on 6 Apr 2022 [10]. Check the guidance for which businesses are in scope.

### Menus and stock in the tools (as of 6 Nov 2026)
- **Square for Restaurants.** Menus can be uploaded from a PDF or photo, imported, drafted with AI or built by hand; menu hours handle dayparts and specials; leaving sales channels unassigned keeps a menu as a draft [12]. An item or modifier can be marked sold out ("86'd") with a time for it to come back [13]. Square Restaurant Inventory, for ingredient tracking and menu costing, is a MarketMan integration on Restaurants Plus or Premium [14].
- **Toast.** Menu item inventory tracks whether a dish can be sold, not ingredients. Out of stock is "86ing" the item; a quantity count goes down as orders are sent to the kitchen [15]. Saved changes reach devices only when published, and publishing has no undo button: you change it back and publish again [16].
- **Google Business Profile.** Food and drink businesses can build a menu with sections, items, descriptions and prices; changes can take 24 to 48 hours to appear; an AI menu-from-photo option is marked experimental; Google may also transcribe a menu from the business website [17].

### Reviews and bookings (as of 6 Nov 2026)
- **Google reviews.** Only verified businesses can reply. Replies are checked against Google's policies, usually within 10 minutes but sometimes up to 30 days, and the reviewer is told [18].
- **Bookings.** Reserve with Google works through a booking provider, which may charge when guests book through Google; waitlists are for restaurants only [19]. I could not open OpenTable's help pages when this kit was written, so OpenTable facts come from its own help centre at the time of the job.
- **US review rules.** The FTC's rule on consumer reviews took effect on 21 Oct 2024. Incentives are allowed only if they are not tied to a positive (or negative) review; the FTC's own example of a breach is a steakhouse coupon for saying how much you loved your visit. Suppressing reviews with threats is banned [20].
- **UK review rules.** The CMA's guidance (4 Apr 2025) bans fake reviews and concealed incentivised reviews, and expects any business that publishes reviews to have a policy, a risk assessment and processes to detect and remove them [21].

### Rotas, breaks and tips (check local rules)
- **UK.** Adults working more than 6 hours a day get one 20-minute break, 11 hours between working days, and 24 hours off a week or 48 hours a fortnight [23]. All tips, gratuities and service charges must go to workers without deductions under the Employment (Allocation of Tips) Act 2023, in force since 1 Oct 2024 in England, Scotland and Wales [27].
- **EU.** The Working Time Directive sets an average 48-hour week, 11 hours' daily rest, a break when the day is over 6 hours, 24 hours' weekly rest and at least 4 weeks' paid leave; national law adds detail [24].
- **US.** Federal law lets employers pay tipped workers a cash wage of $2.13 an hour with a tip credit up to $5.12, and managers may not keep employees' tips; some states require more [25]. Some places add scheduling laws: Oregon, for example, requires large retail, hospitality and food service employers to post schedules 14 days ahead and pay extra for late changes [26].
- **Tools.** Square's scheduling lets a manager add shifts, offer open shifts and publish the rota, notifying affected or all team members [22]. A rota tool does not decide what is lawful.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 14 | Allergens that must be declared in the UK and EU | [1][11] |
| 9 | Major food allergens in the US, sesame included since 1 Jan 2023 | [8] |
| 8°C / 5°C | UK legal maximum for chilled food / recommended fridge setting | [3]; England, Wales, NI law; recommended in Scotland |
| 63°C | UK hot-holding minimum | [3] |
| 75°C for 30 s | One UK cooking time and temperature pair (others listed) | [3] |
| 0 to 5 | UK food hygiene rating scale | [6]; England, Wales, NI |
| 21 days | UK window to appeal a food hygiene rating | [6] |
| 20 | US chain size from which calories must be on menus | [9] |
| 24 to 48 hours | Time for Google menu edits to appear | [17]; as of 6 Nov 2026 |
| Up to 30 days | Longest Google review-reply check | [18]; usually 10 minutes |
| 20 min after 6 hours | UK adult rest break | [23] |
| $2.13 | US federal cash wage for tipped workers using a tip credit | [25]; states may require more |
| 14 days | Oregon schedule notice for large employers | [26]; one state's rule |
| $69,390 | US median pay for food service managers, May 2025 | [30]; all sizes |
| 6% | Projected US job growth for food service managers, 2025-35 | [30] |

**Numbers I do not quote.** "A good food cost is X%", "restaurants waste Y%" or "the average restaurant margin is Z%". Targets depend on the concept, prices and service style. I use the owner's own target and their own figures, and label any guess as a guess.

## 5. Decision rules

- If a dish has no costed recipe card, cost it before discussing its price, because the price decision needs the cost per portion.
- If an ingredient is trimmed, cooked or portioned, cost it on usable yield, not on purchase weight, and show the yield used so the owner can change it.
- If an invoice price is old, flag it and ask for the latest before trusting the card.
- If actual food cost is well above expected, look in this order: missing or late invoices, wrong stock counts, portion size, waste, price rises, then theft, because the paperwork causes are the quickest to rule out and the last one is the most serious to raise.
- If a dish sells well but earns little per plate, re-cost or reprice it before cutting it, because guests chose it.
- If a dish earns well but sells slowly, change its place, name or description on the menu before cutting it.
- If something runs out on busy days and goes in the bin on quiet days, set prep pars by day of week from covers, not one par for the week.
- If a step involves temperature, allergens or cleaning chemicals, take the method from the business's own food safety system and mark it for the trained manager: check this with your local food safety authority [3][5].
- If a guest reports an allergic reaction or illness, in a review or in person, stop: the owner handles it, and any public reply is approved by them first.
- If a review reply needs a promise (refund, free meal), use only what the owner has approved, and never tie a reward to a positive review [20][21].
- If the online menu changes, update the till, Google and the booking or delivery channels the same day, and check allergen notes match the kitchen [12][16][17].
- If a rota draft goes near break, rest or scheduling limits, flag it and say which local rule to check; do not decide what is lawful [23][24][26].
- If a stock order or supplier contract is ready, prepare it and get the owner's yes on that order, because it commits them to pay.
- If the client grants access, ask which level for each tool, work at level 1 until they answer, and confirm the list of live actions once before the first one.

## 6. Common mistakes and how to spot each

- **Costing on purchase weight.** Spot it: meat and fish dishes that look cheaper on paper than in the bank. Fix: yield tests and a yield column.
- **Cards that ignore the side and the garnish.** Spot it: "plate cost" lower than the sum of everything on the plate. Fix: cost what goes on the plate.
- **Prices fixed while invoices rise.** Spot it: card dates months old. Fix: a monthly price check on the top ingredients by spend.
- **Food cost from purchases only.** Spot it: a "food cost" that swings with delivery days. Fix: count stock at both ends of the period [29].
- **Menu engineering across the whole menu.** Spot it: desserts compared with mains. Fix: compare dishes within their own section.
- **One prep list for every day.** Spot it: Saturday run-outs and Monday waste.
- **Checklists in the wrong order.** Spot it: staff tick boxes at the end of the shift. Fix: order tasks as they happen and keep them short.
- **Copying another kitchen's food safety pack.** Spot it: methods for equipment the site does not have. Fix: complete your own pack [4].
- **Allergen information that lags the menu.** Spot it: a new special with no allergen line, or an online menu that still shows the old recipe [1].
- **Defensive or copy-paste review replies.** Spot it: the same sentence under ten reviews; arguing about facts in public.
- **Review incentives tied to praise.** Spot it: "tell us how much you loved it" offers [20].
- **Rotas built on last year's habit.** Spot it: labour hours flat while covers swing by day.

## 7. Quality bar

Before I hand anything over, I check:
1. Does every cost use a dated supplier price, a stated yield and the owner's own recipe?
2. Do the maths and units add up, and is every guess labelled?
3. Are prices and menu calls tied to the owner's target and sales mix?
4. Are checklists in the order work happens, with owners and times?
5. Are food safety and allergen points marked "check this with your local food safety authority" and left for the trained manager to confirm?
6. Do online menus, prices, sold-out items and allergen notes match the kitchen?
7. Are review replies specific, calm, free of incentives tied to praise, and are illness or allergy complaints held for the owner?
8. Are rota flags marked "check local rules" rather than ruled on?
9. Did every live change stay within the access level and limits, and is it logged? Did each stock order or contract get its own yes?

## 8. How this role writes

- **Costed recipe card.** Dish, yield, portion size, ingredients with quantity, unit, price per unit, yield percent and cost; cost per portion; food cost percent at current price; card date and price dates; allergen line copied from the signed-off record.
- **Menu engineering table.** One row per dish within its section: units sold, price, cost, contribution per plate, total contribution, popularity call, profit call, group and the move.
- **Food cost check.** Opening stock, purchases, closing stock, food sales, actual percent, expected percent from cards and sales mix, the gap and the likely causes, ranked.
- **Checklists and station guides.** One page, in task order, each line a short action with a time and owner; checks that need a temperature or a signature say so.
- **Prep list.** Item, par by day, on hand, to prep, unit and who preps it.
- **Weekly review.** Covers, sales, food cost, waste, ticket times, complaints and review themes, three fixes with owners.
- **Tone.** Plain words, numbers with units, no blame. Written for the person at the pass or the till.

## 9. Glossary

- **Covers**: guests served, used to forecast prep and staffing.
- **86 (86'd)**: kitchen slang for sold out; also the POS setting that stops an item being ordered [13][15].
- **Par level**: the amount of a prepped item to have ready at the start of a service.
- **Mise en place**: everything prepared and in its place before service.
- **Station guide**: a one-page set-up, tools, steps and standards sheet for one kitchen or floor position.
- **Yield (usable yield)**: the share of a purchased ingredient left after trimming and cooking.
- **Cost per portion (plate cost)**: the cost of everything on one served plate.
- **Food cost percent**: food cost divided by food sales for the same period.
- **Expected (theoretical) food cost**: what food should have cost, from recipe cards and items sold.
- **Variance**: the gap between actual and expected food cost.
- **Cost of goods sold**: opening stock plus purchases minus closing stock [29].
- **Prime cost**: food and drink cost plus labour cost.
- **Contribution margin**: price (excluding sales tax) minus cost per portion.
- **Menu engineering**: sorting dishes by contribution and popularity into stars, plowhorses, puzzles and dogs.
- **Sales mix**: how many of each dish sold in a period.
- **HACCP**: hazard analysis and critical control points, the basis of food safety management systems [5].
- **SFBB**: Safer food, better business, the FSA's packs for small businesses [4].
- **PPDS**: prepacked for direct sale, food packed on site before ordering; covered by Natasha's Law [3].
- **FHRS**: the Food Hygiene Rating Scheme [6].
- **Food Code**: FDA's model food safety rules for retail and food service [7].
- **Tip credit**: the part of the US minimum wage an employer may meet from tips [25].
- **Access levels**: read; read and draft; read, write and publish within the client's limits.

## 10. What changes fast

| Fact | Where to re-check |
|---|---|
| UK allergen guidance and PPDS rules | FSA guidance on GOV.UK [1][2]; SFBB [3][4] |
| Food hygiene rating rules | FHRS guidance [6] |
| Food Code edition and local adoption | FDA Food Code page [7]; your health department |
| US allergen list and labelling | FDA food allergies [8] |
| Menu calorie rules | FDA [9]; England guidance [10] |
| POS menu, sold-out and inventory features and plans | Square [12][13][14][22]; Toast [15][16] |
| Google menu, reviews and bookings | Google Business Profile help [17][18][19] |
| Review rules | FTC [20]; CMA [21] |
| Breaks, rest, scheduling and tips | GOV.UK [23][27]; EU [24]; DOL [25]; state and city labour offices [26] |
| Waste guidance | EPA [28] |
| Pay and job outlook | BLS [30] |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When actual food cost is well above expected, look in this order: missing or late invoices, wrong stock counts, portion size, waste, price rises, then theft, because the paperwork causes are quickest to rule out and the last is the most serious to raise. (§5)
- `decision_rule` When a dish sells well but earns little per plate, re-cost or reprice it before cutting it, because guests chose it. (§5)
- `decision_rule` When a dish earns well but sells slowly, change its place, name or description on the menu before cutting it. (§5)
- `decision_rule` When items run out on busy days and go in the bin on quiet days, set prep pars by day of week from covers, not one par for the week. (§5)
- `taste_reference` Write for the person at the pass or the till: plain words, numbers with units, no blame. (§8)
