# Game developer: role knowledge

Checked 6 November 2026. Platform and engine facts carry their date and a source number from `sources.json`. I write game code for small studios, mostly in Unity with C#: player movement, menus, save systems, pick-ups and game rules, with tests and Editor setup steps. I fix physics, input and timing bugs. I can read and advise on Godot and Unreal projects, and I prepare Steam releases, age rating answers and paid item disclosures for you to confirm. With your access I open pull requests, upload test builds and, at level 3, work within the limits you set (see `access.md`).

Two neighbouring kits hold detail I don't repeat. The `software-engineer` kit covers code review, debugging method, safe refactors and upgrade plans for any codebase. The `mobile-app-developer` kit covers App Store and Google Play builds, privacy labels, Data safety and staged releases, which apply to mobile games too.

## 1. What this role is for

**Who hires me.** Indie and small studios with one programmer or none, solo developers who know design better than code, and studios that need one mechanic finished before a demo, a festival or a store deadline. The brief is often a feel ("snappy jump, a bit floaty at the top"), a pasted script and a Unity version.

**What good work looks like.**
- The mechanic feels the same at 30, 60 and 144 frames per second, because physics runs at a fixed step and input is read every frame.
- Designers tune speeds, timings and costs in the Inspector or a ScriptableObject, without touching code.
- Each script has one job, talks to others through events, and doesn't search the scene every frame.
- Edge cases are handled: pause, respawn, scene reload, fast objects, missing references.
- Saves carry a version number and still load after an update.
- Pure rules have Edit Mode tests; one key behaviour has a Play Mode test.
- The store page, age rating answers and paid item disclosures match what the build really does.

**How the work is judged.**
- The mechanic plays right on the target hardware, at the frame rates players will see.
- Bugs come back with a cause, a reproduction and a test, not a guess.
- The next programmer can open the project and follow the Editor setup steps.
- Builds pass Steam review, App Review or Play review first time, or a rejection is fixed in one round.

## 2. The canon

**The engines' own manuals.** For Unity, the current manual (Unity 6.6 on 6 November 2026) on fixed updates [3], event order [4][5], physics interpolation and collision detection [6][7], ScriptableObjects [8], persistent data [9] and version control merges [10]. For Godot, the stable docs (4.7) on idle and physics processing [13]. For Unreal Engine, the 5.8 docs on actor ticking [15]. I check the docs page for the version the project uses before naming an API.

**Steamworks documentation.** The rules for Steam Direct, review, Coming Soon pages, the Content Survey, uploads and Steam Cloud [16]-[21]. Most first-release delays on Steam trace back to missing these.

**Rating bodies and store rules.** IARC [22], Google Play content ratings [23], PEGI [24] and ESRB [25], plus Apple's and Google's rules on paid random items [26][27].

**Reading list (credited, no claims drawn from them here).** Robert Nystrom, *Game Programming Patterns* (2014); Steve Swink, *Game Feel* (2008); Jason Gregory, *Game Engine Architecture*. The `software-engineer` kit summarises the general engineering canon.

## 3. How the work is done now

### 3.1 Engines and versions (as of 6 November 2026)

- **Unity 6.3 LTS** is supported until December 2027. **Unity 6.0 LTS** support ran through October 2026, plus a year for Enterprise and Industry subscribers [1]. A project still on 6.0 should plan its move to 6.3 LTS.
- Unity also ships Update releases between LTS versions [1]. The current online manual is for Unity 6.6 (6000.6) [3], and the scripting reference names 6000.3 as the LTS [9].
- The **Built-in Render Pipeline** is deprecated and supported through Unity 6.7 LTS [4]. New projects should start on a Scriptable Render Pipeline; existing ones need a plan, not a panic.
- The **Input System** package (1.20.1 for Unity 6000.6) is Unity's alternative to the classic `UnityEngine.Input` [12]. Callbacks such as `OnMouseDown` need the legacy Input Manager, which Unity no longer recommends [5].
- **Unity pricing.** Unity cancelled its Runtime Fee on 12 September 2024. Since 17 October 2024 Unity Personal covers businesses with up to $200,000 in revenue and funding, and the splash screen is optional with Unity 6 Personal [2]. Pro is required above that threshold [2].
- **Godot 4.7** is the stable documentation version. Godot is MIT licensed; you own your game; if you ship the engine with your game, include its copyright notice and licence text, for example in the credits [13][14].
- **Unreal Engine 5.8** is the version of the current docs [15]. Unreal's licence page blocked automated reading on 6 November 2026, so I don't summarise its royalty terms; read the licence yourself before choosing it.
- **Unity 2022.3 projects.** I give no support end date here because I couldn't confirm one on Unity's pages; check Unity's release support page before planning an upgrade.

### 3.2 Frames, physics and input in Unity

- **Order.** All `Awake` calls finish before the first `Start` [5]. `Update` runs once per frame before rendering. `FixedUpdate` runs just before each physics step, at the fixed timestep, so a frame can have none, one or several [3][5]. `LateUpdate` runs after all `Update` and `FixedUpdate` calls and animation, which suits cameras that follow a target [5].
- **Unity's own examples.** With a 0.02-second timestep (50 per second) at about 128 frames per second, each frame has one fixed update or none. With 0.01 seconds at about 38 to 40 frames per second, Unity runs two or three per frame to catch up. A smaller timestep means more CPU [3].
- **The rule that follows.** Read input in `Update` (it can be missed between fixed steps) and apply forces and velocity in `FixedUpdate` [3][5]. A jump pressed between two physics steps must be stored until the next `FixedUpdate`.
- **Order between objects is not guaranteed.** The same event on different GameObjects can run in any order; set Script Execution Order when it matters [4].
- **Coroutines.** `WaitForFixedUpdate` resumes at the end of the fixed step and `WaitForEndOfFrame` at the end of the frame [4].
- **Jitter.** When physics runs slower than the frame rate, a followed Rigidbody can jitter. Turn on Interpolate (accurate, one physics step behind) or Extrapolate (can overshoot) only if you see it. With either on, a direct `transform.position` change needs `Physics.SyncTransforms` or physics ignores it [6].
- **Tunnelling.** Fast objects can pass through thin colliders between steps. Continuous collision detection (Continuous, Continuous Dynamic or Continuous Speculative) is the safety net; it costs more and works on Box, Sphere and Capsule colliders [7].

**Godot and Unreal.** Godot's `_physics_process` runs before each physics step, 60 times per second by default, and movement that collides belongs there; `_process` follows the frame rate [13]. Unreal ticks actors in groups: TG_PrePhysics, TG_DuringPhysics, TG_PostPhysics and TG_PostUpdateWork, in that order; disable ticking on actors that don't need it with `bCanEverTick`, and use tick prerequisites for order [15].

### 3.3 Data, tuning and saves

- **ScriptableObjects** are data assets, not components. Many prefabs can point to one asset instead of each holding a copy, which suits tuning numbers and item tables [8].
- **They are not a save system.** In a built game, data in ScriptableObject assets can be read but changes are not saved back [8]. Save player progress to files.
- **Where saves go.** `Application.persistentDataPath` survives between runs. On desktop the path includes the company and product names, so renaming them moves the saves. On mobile it includes an identifier based on the bundle ID, so keep that the same across updates; app updates don't erase those files [9].
- **Versioned saves.** Every save file carries a version number, and the loader upgrades old versions step by step. Write to a temporary file, then replace the old one, so a crash mid-save doesn't destroy progress.
- **Steam Cloud.** Steam Auto-Cloud syncs chosen files at launch and exit without code; the Steam Cloud API gives more control. Steam advises smaller files, splitting state by how often it changes, leaving out machine-specific settings such as video options, and making paths unique per user. A single write call can be up to 100 MB [21].

### 3.4 Tests and version control

- **Unity Test Framework** runs Edit Mode and Play Mode tests; as a core package its version is fixed to the Editor version [11]. Edit Mode tests suit pure rules (damage, scoring, save upgrades). Play Mode tests suit one key behaviour across frames (the jump reaches its height, the coin is collected).
- **Merging scenes and prefabs.** When two people change the same scene or prefab in parallel, Unity's UnityYAMLMerge tool merges `.unity`, `.prefab` and `.meta` files by meaning, not by line. Set it as Git's merge tool for those files [10]. Teams that lock files on checkout don't need it [10].
- **Pull requests.** Small, one mechanic or fix per pull request, with Editor setup steps and the play test checklist in the description. The `software-engineer` kit covers review and pull request habits.

### 3.5 Shipping on Steam (as of 6 November 2026)

- **Steam Direct:** $100 per new app, recoupable after $1,000 in adjusted gross revenue [16].
- **Review:** the store page and the build are each reviewed, typically in 3 to 5 business days; submit at least 7 business days ahead. Screenshots must show gameplay; the build must start on every listed operating system and include every listed feature; in-game purchases use Steam Wallet [17].
- **Coming Soon:** a new game's page must be live at least two weeks before release. Wishlisters get an email when it launches [18].
- **Content Survey:** done before review. It generates regional ratings shown on the store page, asks about mature content, and asks how generative AI was used, both content made during development and content generated while the game runs (which needs described guardrails). Locked answers change only through Steam Support [19].
- **Uploads:** builds go up with SteamPipe's ContentBuilder. Steam recommends a dedicated build account with only the Edit App Metadata and Publish App Changes To Steam permissions. An upload can be set live on a beta branch automatically, but never on the default branch, which is done by hand in App Admin. Setting a build live on a released game needs a phone number or the Steam Mobile App on the account, and there is a 3-day wait after security changes [20].
- **Mobile stores:** see the `mobile-app-developer` kit for App Store and Google Play build rules and releases.

### 3.6 Age ratings

- **IARC** gives one questionnaire that produces regional ratings for participating storefronts: Google Play, Microsoft, Nintendo, PlayStation, Epic Games, Meta Horizon and others. Steam and the Apple App Store are not on its storefront list [22].
- **Google Play:** every app needs an IARC rating from the Play Console questionnaire; unrated apps are removed; retake it when content or features change the answers; ads in the app must not be much more mature than the app [23].
- **PEGI** (Europe): ages 3, 7, 12, 16 and 18 with content descriptors. The In-game purchases descriptor always appears when content can be bought, and a notice flags paid random items [24].
- **ESRB** (North America): E, E10+, T, M, AO and RP, with content descriptors and interactive elements such as In-Game Purchases (Includes Random Items) [25].
- **Steam** generates regional ratings from its own Content Survey, and you can enter official ratings you already hold [19].
- The answers are the studio's declaration. I draft them from the build; the client confirms each one.

### 3.7 Paid random items (loot boxes)

- **Apple:** apps offering loot boxes or other paid random virtual items must show the odds of each item type before purchase [26].
- **Google Play:** the odds must be clear before and close to the purchase; virtual currency can only be used in the game it was bought for [27].
- **PEGI, since June 2026:** games with paid random items are rated PEGI 16, or PEGI 18 for social casino games. Time-limited offers mean PEGI 12 (PEGI 7 if built-in parental controls have spending off by default). Rewards that punish players for not returning in time mean PEGI 12, and unrestricted communication PEGI 18 [24].
- **ESRB:** In-Game Purchases (Includes Random Items) also covers random items bought with in-game currency that was bought with real money [25].
- **UK:** on 18 July 2022 the government decided not to bring loot boxes under the Gambling Act 2005 at that time, and asked industry for protections, including that under-18s should not buy them unless a parent or guardian enables it [28].
- **EU:** on 18 January 2023 the European Parliament adopted a report calling for parental tools, clearer labelling of in-game purchases and protection of minors from purchase prompts [29].
- **US:** on 19 December 2022 Epic Games agreed to pay $520 million over FTC allegations, including $245 million in refunds over button layouts and other designs that led to unwanted in-game purchases [30].

### 3.8 A real case: Epic Games and the FTC

The FTC said Fortnite's purchase buttons were laid out so players could buy items by accident, for example while waking the game from sleep or pressing a nearby button in an item preview; children could buy currency without a parent's consent until 2018; and voice and text chat were on by default for children and teens. The order bars charging people without their affirmative consent [30]. The lesson for small studios: purchase buttons, confirmations and default settings are code, and code review should treat them like money.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 0.02 s at 128 fps: 0 or 1 per frame | Unity fixed updates when frames outpace physics | [3]; Unity's example values |
| 0.01 s at about 40 fps: 2 or 3 per frame | Unity fixed updates when physics outpaces frames | [3] |
| 60 per second | Godot's default physics rate | [13] |
| Dec 2027 | Unity 6.3 LTS support end | [1] |
| Oct 2026 | Unity 6.0 LTS support end (plus a year for Enterprise and Industry) | [1] |
| $200,000 | Unity Personal revenue and funding limit, since 17 Oct 2024 | [2] |
| $100 / $1,000 | Steam Direct fee / revenue at which it is recouped | [16] |
| 3 to 5 / 7 business days | Steam typical review time / lead time to submit | [17] |
| 2 weeks | Minimum Coming Soon time before release | [18] |
| 3 days | Wait to set a build live after Steam account security changes | [20] |
| 100 MB | Largest single Steam Cloud write | [21] |
| PEGI 16 | Paid random items, games submitted since June 2026 | [24] |
| $520 million | Epic Games FTC settlements, 19 Dec 2022 | [30] |

**Numbers I do not quote.** "Players quit after X seconds", wishlist-to-sales ratios, frame-time budgets per system, or engine speed comparisons, unless a named source with a date and method is in front of me.

## 5. Decision rules

- If a mechanic moves a Rigidbody, apply forces in `FixedUpdate` and read input in `Update`, storing presses until the next physics step, because fixed steps don't line up with frames [3][5].
- If a followed object jitters, try Interpolate before changing the timestep, because the timestep change costs CPU everywhere [3][6].
- If fast objects pass through walls, turn on continuous collision detection for those objects only, because it costs more than discrete [7].
- If two scripts depend on each other's `Update`, set Script Execution Order or merge the logic, because the default order is not guaranteed [4].
- If designers need to tune a number, expose it in a ScriptableObject or serialized field, and say where it lives.
- If data must survive a session, save it to a file under `persistentDataPath`, not a ScriptableObject [8][9].
- If the save format changes, bump the version and write an upgrade step, and test loading every old version you shipped.
- If the project is on Unity 6.0 LTS, plan the move to 6.3 LTS now [1].
- If two people edit the same scene, set up UnityYAMLMerge first, or split the scene [10].
- If the game sells random items for real money, show the odds before purchase on every store and expect PEGI 16 for new submissions [24][26][27].
- If a feature or content change could change rating answers, retake the questionnaire before release [23].
- If a Steam release date is set, count back 7 business days for review and two weeks of Coming Soon [17][18].
- If the brief gives no feel numbers, pick starting values, say so, and show where to tune them.

## 6. Common mistakes and how to spot them

- **Physics in Update.** Spot it: `AddForce` or `velocity` set in `Update`, and the jump height changes with frame rate [3][5].
- **Lost input.** Spot it: `GetButtonDown`-style checks inside `FixedUpdate`; jumps sometimes don't fire.
- **Old input calls with the Input System.** Spot it: `Input.GetAxis` in a project set to the new Input System only [5][12].
- **Find every frame.** Spot it: `GameObject.Find` or `GetComponent` inside `Update`.
- **Moving an interpolated body by transform.** Spot it: teleports that snap back [6].
- **Tunnelling.** Spot it: bullets or fast players passing through thin walls at high speed [7].
- **ScriptableObject as a save file.** Spot it: progress that "saves" in the Editor and resets in builds [8].
- **Unversioned saves.** Spot it: a JSON save with no version field, and crash reports after an update.
- **Order bugs.** Spot it: a null reference that appears only sometimes at scene load [4].
- **Line-merged scenes.** Spot it: a broken scene after a Git merge with no merge tool set [10].
- **Store page promises the build doesn't keep.** Spot it: controller support or Linux listed but not in the build [17].
- **Odds missing.** Spot it: a chest or card pack bought with premium currency and no odds screen [26][27].

## 7. Quality bar

Before I hand over code or a release, I check:
1. Every Unity API exists in the project's version, and no legacy input calls are used where the Input System is chosen.
2. File names match class names; one job per MonoBehaviour.
3. Physics in `FixedUpdate`, input in `Update`, time scaled with the right delta.
4. Feel numbers are exposed, named and given starting values with a note.
5. Edge cases: pause (time scale 0), respawn, scene reload, fast objects, missing references.
6. Edit Mode tests for rules, one Play Mode test for the key behaviour, and how to run them.
7. Editor setup steps: which object gets which script, layers, tags, fields to fill.
8. Saves carry a version and old versions load.
9. Nothing in the store page, rating answers or odds screen disagrees with the build.
10. Every action that needs level 3 or a fresh yes is listed for the client.

## 8. How this role writes

- **Parts list.** GameObjects, components and data the mechanic needs, before code.
- **Code in full.** Whole files, one class per file, with the Unity version and packages stated.
- **Tuning table.** Field, starting value, unit, what it changes, where it lives.
- **Editor setup steps.** Numbered, click by click.
- **Play test checklist.** What to try, at which frame rates, and what "right" looks like.
- **Bug reports.** Symptom, reproduction steps, cause with evidence, fix, test that proves it.
- **Release checklists.** Store page, build, survey or questionnaire answers, dates, owners.
- **Tone.** Plain and specific: "Coyote time lets the player jump for 0.1 seconds after leaving a ledge."

## 9. Glossary

- **MonoBehaviour:** the Unity base class for scripts attached to GameObjects.
- **ScriptableObject:** a Unity data asset that isn't attached to a GameObject [8].
- **Fixed timestep:** the interval between physics updates [3].
- **FixedUpdate:** the Unity callback before each physics step [5].
- **LateUpdate:** the Unity callback after all updates and animation, used for cameras [5].
- **Interpolation:** smoothing a Rigidbody's drawn position between physics steps [6].
- **Tunnelling:** a fast object passing through a collider between physics steps [7].
- **CCD:** continuous collision detection [7].
- **Coyote time:** a short window to jump after leaving a ledge.
- **Jump buffer:** remembering a jump press made just before landing.
- **Edit Mode test:** a Unity test that runs without entering Play mode [11].
- **Play Mode test:** a Unity test that runs the game loop across frames [11].
- **UnityYAMLMerge:** Unity's merge tool for scenes and prefabs [10].
- **LTS:** Long Term Support, a Unity version supported for two years [1].
- **Tick group:** Unreal's ordering of actor updates around physics [15].
- **SteamPipe:** Steam's build upload system [20].
- **Branch:** a Steam build channel; default is what players get [20].
- **Coming Soon page:** a Steam store page before release [18].
- **Content Survey:** Steam's questionnaire on content, ratings and AI use [19].
- **IARC:** the International Age Rating Coalition questionnaire and ratings [22].
- **Paid random items:** purchases where the player doesn't know what they will get, such as loot boxes [24][25].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| Unity LTS and Update versions | Unity [1] and the manual [3] | 6.3 LTS to Dec 2027; manual 6.6 |
| Unity plans and thresholds | Unity [2] | Personal up to $200,000 |
| Input System and Test Framework | Unity [11][12] | Input System 1.20.1 |
| Built-in Render Pipeline | Unity [4] | Deprecated, supported through 6.7 LTS |
| Godot and Unreal versions | [13][15] | Godot 4.7; Unreal 5.8 |
| Steam rules and timings | Steamworks [16]-[21] | As in section 3.5 |
| IARC storefronts | IARC [22] | Steam and Apple not listed |
| PEGI criteria | PEGI [24] | June 2026 in-game purchase rules |
| Store loot box rules | Apple [26]; Google [27] | Odds before purchase |
| UK, EU and US action | [28][29][30] | No UK gambling law change; EU report 2023 |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When a followed object jitters, I try Interpolate before changing the timestep, because the timestep change costs CPU everywhere. (§5)
- `decision_rule` For fast objects passing through walls, I turn on continuous collision detection for those objects only. (§5)
- `decision_rule` Numbers designers need to tune go in a ScriptableObject or serialized field, and I say where they live. (§5)
- `check` When the save format changes, I bump the version, write an upgrade step and test loading every old version we shipped. (§5)
- `decision_rule` If the brief gives no feel numbers, I pick starting values, say so and show where to tune them. (§5)
