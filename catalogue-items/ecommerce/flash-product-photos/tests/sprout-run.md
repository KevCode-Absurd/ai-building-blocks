# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable set of six prompts that stay inside the facts given, keep the pouch and tear direction right, keep children out and mark every unknown (daily pack look, pouch size, gummy count) as MISSING. The only rough edges are layout: no BEFORE WE START section and the fixed product phrase sits after the roll, and it never says outright that it could not see the two named photos, though it describes nothing beyond the input's own words.

## Judge list

- Met: The shadows and glow match the three dials.
  Every prompt: "flash fired straight from beside the lens as fill. Daylight carries the scene... a faint hard-edged shadow falls on the wall just behind" (checked at prompt level, no frames made).
- Met: The label is sharp, faces the lens and sits outside the flash's brightest spot.
  "label sharp and facing the lens... turned a few degrees so the brightest flash reflection sits on its top seal, never across the wordmark or bear"
- Met: Nobody poses, and at most one person has just noticed the camera.
  "Nobody looks at the lens. Optional (approve): a version of 05 where she has just noticed the camera mid-laugh. This is the only such frame allowed."
- Met: Every hand could really hold what it holds, with five fingers.
  "left hand grips the pouch around its middle... right hand's thumb and two fingers reach down inside the opened resealable top and pinch out one daily pack"
- Met: No children, no real person's face, no other brand's logo, no added words or date stamps.
  "No child or part of one appears in any frame, and no kids' items"; props "plain"; "People are described in words only"; "No added words, date stamps or borders."

## What went in

```text
Product: Sprout Original (Adults), Low Sugar. Attached: the pouch
front on, and gummies in an open hand. Glossy deep green stand-up
foil pouch, big yellow wordmark, yellow bear face top right, "28
Daily Packs" at the bottom. One daily pack a day, torn straight
across the top, gummies tipped into a palm. The pouch opens only at
its resealable top.

Buyers: people who quit greens powders and pill stacks; busy
parents who grab one on the way out ("So easy to grab and eat on my
way to the billion things I have to do as a mom").

Brand world: bright, sunny, candy-like. Everyday adults in casual
clothes, at home or outdoors. Never clinical, never muted. There's
also a Kids line.

For: Instagram feed ads, 4:5. 6 photos.
```

## What came out

```text
I can't make pictures in this chat, so you'll get the prompts. How to turn them into photos is at the end.

## Flash dials

- **Ambient: flash as fill.** Sprout is bright and sunny, so a dark party scene would be wrong for it. The roll is a sunlit weekday morning: daylight carries every scene, and the flash only lifts faces and the pack.
- **Falloff: close wall.** The scenes are a kitchen counter and a narrow front hallway, with a wall one to two feet behind. Each frame gets a faint, hard-edged flash shadow just behind the subject, softened by daylight.
- **Colour: brand daylight.** Clear warm-white morning sun with yellow accents. Whites read white, and the pouch stays deep green, never teal or olive.
- **Foil warning.** A glossy pouch facing an on-axis flash reflects a hot spot straight back. Every prompt turns the pouch a few degrees so the brightest spot lands on its top seal, not the wordmark.

## The roll (approve)

**Occasion:** a weekday morning rush out the door. Same house, same two adults, 7:40 to 7:50 am. No child or part of one appears in any frame, and no kids' items appear either, so nothing reads as the Kids line.

| # | Moment | Who | Action | Job | Size |
|---|---|---|---|---|---|
| 01 | The table | Nobody | Pouch shut, upright, among breakfast things on the counter | Feed ad A, version 1 · **test frame** | 4:5, 1080×1350 |
| 02 | The reach | Her | One hand steadies the pouch, the other pulls out one daily pack | Feed ad B, version 1 | 4:5, 1080×1350 |
| 03 | In use | Her | Tears the daily pack straight across the top, bag on shoulder | Feed ad C, version 1 | 4:5, 1080×1350 |
| 04 | In use | Her | Gummies in her open palm, lifting one to her mouth | Feed ad B, version 2 | 4:5, 1080×1350 |
| 05 | Passing it on | Her and partner | She hands him a daily pack at the open front door | Feed ad C, version 2 | 4:5, 1080×1350 |
| 06 | After | Nobody | Pouch put back on the hall table, top pressed shut | Feed ad A, version 2 | 4:5, 1080×1350 |

- Two frames have no people. None have three or more.
- Nobody looks at the lens. **Optional (approve):** a version of 05 where she has just noticed the camera mid-laugh. This is the only such frame allowed.
- **Ready to make now:** 01, 04, 06.
- **Waiting on a daily-pack photo:** 02, 03, 05. Until it arrives, the product shows shut and still, as in 01 and 06.

## Fixed phrases (use word for word)

- **Pouch:** "the glossy deep green stand-up foil pouch with a big yellow Sprout wordmark, a yellow bear face in the top right corner and "28 Daily Packs" along the bottom, which opens only at its resealable top"
  - Not: matte, a jar, a bottle, a box, torn open at the side, or the Kids pouch.
- **Gummies:** "the gummies exactly as in attached image 2, the same colour, shape and number"
- **Daily pack:** `MISSING: daily pack look (colour, material, size, print)`. It is torn straight across the top only.

## Prompts

**Attached images for every prompt:**
- Image 1: pouch, front on. This is the product.
- Image 2: gummies in an open hand. This is the gummies.

Once 01 is approved, also attach:
- Image 3: approved frame 01. Use it for the room, the light and the pouch at real size.

People are described in words only. Never attach photos of real people.

**01_table_feed-ad-a (test frame)**
A sunny weekday morning at 7:40 am on a pale wood kitchen counter against white square tiles one foot behind, morning sun coming through a window on the left and striping the counter. Nobody is in the frame. On the counter are a plain white mug of coffee, a set of house keys on a plain ring, a pair of tortoiseshell sunglasses and a plate with a half-eaten slice of toast. Among them stands the product from attached image 1: the glossy deep green stand-up foil pouch with a big yellow Sprout wordmark, a yellow bear face in the top right corner and "28 Daily Packs" along the bottom, which opens only at its resealable top. It is not matte, not a jar, not a box, and its resealable top is pressed shut. It stands upright at its real size [MISSING: pouch height], its front label sharp and facing the lens. It is turned a few degrees so the brightest flash reflection sits on its top seal, never across the wordmark or bear. Shot on a compact camera held at chest height a step back, its built-in flash fired straight from beside the lens as fill. Daylight carries the scene, the flash lifts the pouch front, and a faint hard-edged shadow falls on the tiles just behind the pouch. Colour is clear sunny daylight: whites read white, the pouch stays deep green and the yellow reads clean yellow. Fine film grain, framed slightly off level. No added words, date stamps or borders.

**02_reach_feed-ad-b (needs daily-pack photo)**
The same sunny kitchen counter and white tiled wall from attached image 3, a minute later. One adult woman, about 35, with dark curly hair in a yellow claw clip, wearing a white T-shirt with a denim jacket on one arm only, half put on. Her left hand grips the pouch around its middle on the counter, thumb on its side edge clear of the label. Her right hand's thumb and two fingers reach down inside the opened resealable top and pinch out one daily pack [MISSING: daily pack look], half lifted clear. Her eyes are on the pouch, not the camera. The product is the one in attached image 1: the glossy deep green stand-up foil pouch with a big yellow Sprout wordmark, a yellow bear face in the top right corner and "28 Daily Packs" along the bottom, which opens only at its resealable top. It is shown at its real size against her hand [MISSING: pouch height], label sharp and turned to the lens, angled so the brightest flash spot sits on the open top edge, never across the wordmark. Shot on a compact camera held at chest height, its built-in flash fired straight from beside the lens as fill. Daylight carries the scene, the flash lifts her face and the pouch, and a faint hard-edged shadow sits on the tiles just behind her shoulder. Clear sunny daylight colour: her white T-shirt reads white and the pouch reads deep green. Fine film grain, slightly off level. No added words, date stamps or borders.

**03_in-use-tear_feed-ad-c (needs daily-pack photo)**
A narrow front hallway on a sunny weekday morning, a white painted wall two feet behind, sunlight from the open doorway on the right. The same woman, about 35, with dark curly hair in a yellow claw clip, white T-shirt and denim jacket now fully on, a plain canvas tote on her left shoulder. She holds one daily pack [MISSING: daily pack look] at chest height. The thumb and forefinger of each hand pinch either side of its top edge, and she tears it straight across the top, the strip just coming away. Her eyes are on the pack. The pack's print is sharp and facing the lens, and the brightest flash spot falls on its torn top edge. Shot on a compact camera held at chest height, its built-in flash fired straight from beside the lens as fill. Daylight carries the scene, the flash lifts her face and hands, and a faint hard-edged shadow falls on the wall just behind her. Clear sunny daylight colour, with whites reading white. Fine film grain, slightly off level. No added words, date stamps or borders.

**04_in-use-palm_feed-ad-b**
The same sunny front hallway with the white wall two feet behind and daylight from the open doorway on the right. The same woman, about 35, with dark curly hair in a yellow claw clip, white T-shirt and denim jacket, a plain canvas tote on her left shoulder. She holds her left hand open and flat at chest height with the gummies resting in the palm: the gummies exactly as in attached image 2, the same colour, shape and number. Her right thumb and forefinger lift one gummy from the palm toward her mouth. Her eyes are on her hand and she is mid-step toward the door. The gummies are sharp, and the brightest flash spot falls on their tops. Her hand has five fingers and is relaxed, not posed. Shot on a compact camera held at chest height, its built-in flash fired straight from beside the lens as fill. Daylight carries the scene, the flash lifts her face and palm, and a faint hard-edged shadow falls on the wall just behind her. Clear sunny daylight colour: her T-shirt reads white and the gummies keep their true colour. Fine film grain, slightly off level. No added words, date stamps or borders.

**05_passing-on_feed-ad-c (needs daily-pack photo)**
The open front door of the same house on a sunny morning, the two adults on the threshold with a white painted door frame and wall one foot behind them and the bright front step beyond.
- **She:** the same woman, about 35, with dark curly hair in a yellow claw clip, white T-shirt, denim jacket and canvas tote. She holds out one daily pack [MISSING: daily pack look] pinched between her thumb and two fingers, laughing at him.
- **He:** an adult man, about 38, with a short brown beard and a navy hoodie, holding a plain steel travel mug in his left hand. He takes the pack with his right thumb and forefinger. Both of them hold it for that half second.
- **Optional (approve):** she glances at the camera mid-laugh, as if she has just noticed it.

The pack's print is sharp and turned to the lens, and the brightest flash spot falls on its top edge. Shot on a compact camera held at chest height, its built-in flash fired straight from beside the lens as fill. Daylight carries the scene, the flash lifts both faces, and a faint hard-edged shadow falls on the door frame just behind them. Clear sunny daylight colour, whites white. Fine film grain, slightly off level. No added words, date stamps or borders.

**06_after_feed-ad-a**
The same front hallway a moment later, the door just closed. Nobody is in frame. On a small pale wood hall table against the white wall one foot behind are an empty ceramic key dish and a stripe of morning sun from the side window. The product from attached image 1 stands upright where it was put back: the glossy deep green stand-up foil pouch with a big yellow Sprout wordmark, a yellow bear face in the top right corner and "28 Daily Packs" along the bottom, which opens only at its resealable top. It is not matte, not a jar, not a box, its resealable top pressed shut, at its real size [MISSING: pouch height]. Its label is sharp and facing the lens, turned a few degrees so the brightest flash reflection sits on its top seal, never across the wordmark or bear. Shot on a compact camera held at chest height, its built-in flash fired straight from beside the lens as fill. Daylight carries the scene, the flash lifts the pouch front, and a faint hard-edged shadow falls on the wall just behind the pouch. Clear sunny daylight colour: the pouch reads deep green and the yellow reads clean yellow. Fine film grain, slightly off level. No added words, date stamps or borders.

## Frames

None made yet. Make 01 first as the test frame and check it full size beside image 1. Then make 04 and 06. Make 02, 03 and 05 once you have the daily-pack photo.

**File names:**
- 01_table_feed-ad-a
- 02_reach_feed-ad-b
- 03_in-use-tear_feed-ad-c
- 04_in-use-palm_feed-ad-b
- 05_passing-on_feed-ad-c
- 06_after_feed-ad-a

Mark them as made with AI and keep them apart from your real photos.

## Check log (prompts)

- **Light:** all six state flash as fill, a faint shadow on a close wall, and daylight colour with whites white. Pass.
- **Label:** every product frame turns the foil so the hot spot lands on the seal or top edge, label facing the lens. Pass.
- **Product truth:**
  - The pouch opens only at its resealable top. Pass.
  - The daily pack tears straight across the top. Pass.
  - Size in hand: MISSING.
- **Hands:** each action is written hand by hand, nobody poses, and the one camera glance is held for approval. Pass.
- **Exclusions:** no child, no kids' items, no real faces attached, plain unbranded props, no added words. Pass.

## CHECKS MISSED

- Size in the hand can't be confirmed: the pouch height and daily-pack size are MISSING.
- One use is one real amount can't be confirmed: the gummy count per daily pack is MISSING. Frame 04 assumes image 2 shows one pack's worth.
- Frames 02, 03 and 05 can't be checked for product truth until the daily pack's look is known.

## Gaps to fill later

- MISSING: photo of the daily pack, open and shut
- MISSING: number of gummies in one daily pack, and whether image 2 shows exactly one pack
- MISSING: pouch height or dimensions, or a photo of the pouch in a hand
- MISSING: the exact words allowed on the picture (brand brain `proof-and-claims.md`)

## How to make the pictures

- **ChatGPT (GPT Image) or Gemini (Nano Banana):** attach images 1 and 2, paste a prompt, and ask for the picture. After 01 is approved, attach it as image 3 for the rest. You can also paste this whole skill there so it writes and makes in one go. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send each prompt to that API and save the files. Keys are at platform.openai.com/api-keys or aistudio.google.com/apikey. Each picture is billed.

What next: image ads with the [Three-way offer image ad planner](https://useaiblocks.com/skills/three-way-offer-image-ad-planner), video ads with the [Video avatar and storyboard planner](https://useaiblocks.com/skills/avatar-storyboard-planner), or something else?
```
