# Optional craft reference

This is example vocabulary and house guidance, not a promise of tool behavior. The main skill and user brief take priority. Verify current model-specific syntax or limits before use.

# 🎼 SUNO AI MASTER KNOWLEDGE

## Music Theory, Vocabulary & Reference Banks for the Suno Prompt Engine

> This is the **knowledge layer** that feeds `SUNO_INSTRUCTIONS.md`. Part 1 translates musician-speak into plain, prompt-ready language. Part 2 is a set of copy-paste **reference banks** — pre-built tagged blocks for GENRE, VOCALS, STRUCTURE, and MIX that drop straight into the Suno Style Formula. The instruction file governs format and rules; this file governs vocabulary, musical correctness, and ready-made building blocks.

**Core idea:** Music models respond to language. "Make a sad song" is a slot machine. "Downtempo ballad, 68 BPM, minor key, sparse piano, heavy reverb" is direction. Name the concept, use the term, paste the block.

---

# PART 1 — MUSIC THEORY VOCABULARY

## 01 — BPM & TEMPO

BPM = Beats Per Minute — how many steady pulses happen in 60 seconds. Higher number = faster song. It's the single most powerful word you can hand a model; it sets the energy lane before anything else. A model understands the **number** best (better than Largo/Andante/Allegro).

| Vibe | BPM Range | Typical Use |
|---|---|---|
| Ballad / Ambient | 60–80 | Slow songs, meditation, film underscore |
| Hip-Hop / Lo-Fi | 70–100 | Head-nod beats, chill study music |
| Pop / Rock | 100–130 | Radio songs, driving energy |
| House / Dance & D&B | 120–180 | Club four-on-the-floor to high-energy electronic |

**Pro move:** "half-time" and "double-time" keep the same BPM but make the drums *feel* twice as slow or fast — perfect for building drops and breakdowns.

---

## 02 — HARMONY & CHORDS

Harmony = notes stacked and sounding together. A chord = three or more notes at once — the emotional colour wash under a melody. You never build one; you name the feeling.

- **Major vs Minor (mood):** Major = bright, happy, resolved. Minor = darker, sadder, tense. One swap changes the whole mood.
- **Chord progression (journey):** A sequence of chords over time. The famous I–V–vi–IV powers thousands of pop songs.
- **Chord colours (flavour):** 7th / extended = jazzy. Suspended (sus) = floaty. Diminished = anxious. Power chords = raw rock.
- **Tension & release** is the engine: chords build unease, then resolve "home." Ask for a "satisfying resolution" or an "unresolved, hanging ending" to control it.

**Snippet:** `soulful R&B, lush jazzy 7th chords, smooth progression in a minor key, unresolved ending`

---

## 03 — MELODY & COUNTERPOINT

The melody is the single line a listener hums back. It moves horizontally; harmony is vertical.

- **Motif & hook (stickiness):** A motif is a short idea repeated and developed. A hook is the irresistible, sticky part.
- **Phrasing & range (breath):** Phrasing is how a melody breathes — pauses, leaps, steps. "Stepwise" = smooth; "wide leaps" = dramatic. High = urgent; low = intimate.
- **Counterpoint (weaving):** Two or more independent melodies that each stand alone yet fit — a round, interlocking guitar lines.
- **Call-and-response:** counterpoint's simplest cousin — one line "asks," another "answers." Instantly musical.

**Snippet:** `catchy vocal melody, simple memorable hook soaring in the chorus, call-and-response with a guitar`

---

## 04 — RHYTHM & GROOVE

A beat is one pulse; beats group into bars. Time signature = beats per bar — 4/4 is the pop default, 3/4 is a waltz, 6/8 lilts.

- **Groove & pocket (feel):** The feel that makes you move. Slightly behind the beat = "in the pocket" (laid-back); ahead = urgent.
- **Syncopation (bounce):** Stress on the "off" beats. The source of funk/reggae/Latin bounce.
- **Swing & quantize (grid):** Swing nudges notes off-grid for a loping, human feel. Quantize snaps them tight for a machine feel. Polyrhythm layers two at once.
- **Subdivision = energy:** quarters (steady), eighths (driving), sixteenths (busy). "Rolling 16th-note hats" instantly raises energy.

**Snippet:** `boom-bap drums, 90 BPM, heavy swing, syncopated hi-hats, fat snare sitting in the pocket`

---

## 05 — KEYS & MODES

A key is the home base a song pulls toward (C major, A minor). A scale is the set of notes allowed — the palette you paint from.

**The modes (moods inside a scale — name them directly):**
- Ionian · bright / major
- Dorian · cool, jazzy minor
- Phrygian · dark, Spanish
- Lydian · dreamy, floating
- Mixolydian · bluesy, rock
- Aeolian · natural minor, sad
- Locrian · unstable, eerie

- **Pentatonic & blues (can't-go-wrong):** The 5-note pentatonic is the safe, universal sound of folk/rock/pop. Add one "blue note" → the blues scale (grit and soul).
- **Modulation (the lift):** Change key mid-song for an emotional lift — the classic final-chorus "key change up." Big, reliable payoff.

**Snippet:** `cinematic track in D Dorian, modulating up a step for the final section`

---

## 06 — TEXTURE & ARRANGEMENT

Texture = how many things sound at once. "Sparse" or "wall-of-sound" steers it instantly. Arrangement = which instruments play what, and when.

- **Texture types (density):** Monophonic = one line alone. Homophonic = melody + chords (most pop). Polyphonic = many independent lines (choirs, orchestras).
- **Instrumentation (the cast):** Naming specific instruments — "Rhodes piano, upright bass, brushed drums" — is one of the highest-leverage prompt moves.
- **Frequency layers (space):** Think in bands — low end (bass, kick), mids (vocals, keys), highs (cymbals, air). Good arrangements give each its own room.
- **Dynamics:** volume/intensity over time (soft/loud, crescendo, drop). "A big build into the drop" shapes energy precisely.

**Snippet:** `build from sparse intro → full arrangement; layered strings, punchy low end, airy high synths`

> Maps directly to the engine's **minimalism-over-density** default — name a lead element and give it room rather than stacking layers, especially under VO.

---

## 07 — FORM & STRUCTURE

Songs are assembled from labelled chunks. Name them and the model knows the plan.

**Section building blocks:** Intro (set up) · Verse (story) · Pre-Chorus (lift) · Chorus (payoff) · Bridge (twist) · Outro (land)

**Common forms:**
- Verse–Chorus — the pop default
- AABA — classic 32-bar standard
- 12-bar blues — the blues / rock skeleton
- Through-composed — never repeats (film, ambient)
- Build–Drop — the EDM tension & release arc

**Arc thinking:** describe the emotional journey — "starts intimate, grows to a triumphant climax, fades gently" — and the model maps structure onto the story. (This is the backbone of multi-track scene arcs: atmosphere → escalation → peak → resolution.) See Part 2 for ready-made STRUCTURE blocks.

---

## 08 — ADVANCED / EXPERIMENTAL

Every "rule" is a default, not a law. Tell a model to "ignore conventional structure" when that's the point.

- **Atonality (no key):** Abandons a home key — no gravity, unsettling. Horror, tension, avant-garde.
- **Microtonality (in between):** Notes between the standard piano keys. Exotic, "out-of-tune-on-purpose," non-Western colours.
- **Polytonality (two at once):** Two keys stacked — bittersweet, complex, dreamlike clashes (Stravinsky, modern scores).
- **Odd meters (lurching):** 5/4 or 7/8 create lurching, hypnotic grooves (prog, math rock).
- **Drone & granular (texture-as-music):** Drone = one sustained pitch. Granular = sound chopped into tiny grains. Timbre becomes the composition.
- **Found sound (real world):** Musique concrète / generative — real-world recordings and evolving rules as the instrument.

**Snippet:** `experimental ambient, evolving drone in 7/8, granular textures, microtonal swells, no clear key`

---

## 09 — PRODUCTION & SOUND WORDS

Two songs with identical notes can feel totally different. These adjectives control vibe directly.

- **Depth & space:** Reverb (room size — "cathedral" vs "dry"), delay (echoes), stereo width (narrow & focused vs wide & immersive).
- **Tone & colour:** Warm, bright, dark, gritty, crisp, muddy, lo-fi, hi-fi — adjectives a model genuinely acts on.
- **Dynamics & movement:** Compression (punch), distortion (grit), sidechain pump (breathing dance feel), filter sweeps.
- **Reference stacking** is the fastest route to a result you'll like: "in the style of [genre / era / mood]" plus two or three production adjectives.

**Snippet:** `dreamy synthwave, warm analog saturation, wide stereo, lush reverb, gentle sidechain pump`

> Engine tie-in: the **mid-scoop for VO** (hollow 1k–4kHz) is a frequency-balance move here for preserving speech clarity under narration. See the MIX banks in Part 2 for "scooped mids" language.

---

## 10 — QUICK-REFERENCE GLOSSARY

BPM (song's speed) · Tempo (pace of the pulse) · Key (home note) · Scale (notes in a key) · Chord (3+ notes together) · Harmony (vertical stack / colour) · Progression (chords over time) · Melody (the line you hum) · Hook (the sticky part) · Motif (short repeated idea) · Counterpoint (woven independent melodies) · Time signature (beats per bar) · Groove (the feel that moves you) · Syncopation (off-beat stress) · Swing (loping off-grid feel) · Quantize (snapped tight to grid) · Mode (flavour of a scale) · Modulation (key change for a lift) · Texture (dense vs sparse) · Arrangement (who plays, when) · Dynamics (volume/intensity changes) · Form (section blueprint) · Reverb (room/space/echo) · Timbre (tone-colour of a sound)

**How to assemble:** Combine a tempo, a key/mood, a groove, an instrument list, a structure, and a few production adjectives — and you're prompting like someone who knows the language. Map each onto the engine's tagged blocks, keep it lean, and verify the whole thing lands **under 1,000 characters**.

---

# PART 2 — REFERENCE BANKS (COPY-PASTE BLOCKS)

> These are pre-built tagged blocks that slot directly into the Suno Style Formula. Pull a block, adapt it, and confirm the assembled prompt stays under 1,000 characters. Genre→BPM pairings here are conventions, not laws — override BPM when the brief calls for it.

## GENRE × BPM REFERENCE

**Electronic / EDM:** House (122) · Deep House (120) · Tech House (126) · Progressive House (128) · Techno (130) · Dubstep (140) · Drum & Bass (174) · Trance (138) · Hardstyle (150) · Future Bass (150) · Glitch Hop (110) · Synthwave (126) · Vaporwave (115) · Chillwave (100) · IDM (130)

**Hip-Hop / Rap:** Boom Bap (90) · Trap (140) · Drill (140) · Lo-Fi Hip-Hop (85) · Cloud Rap (70) · Phonk (130) · Memphis Rap (135) · Conscious Rap (95) · G-Funk (95) · Grime (140)

**Rock / Metal:** Rock (120) · Hard Rock (140) · Indie Rock (115) · Punk Rock (180) · Grunge (100) · Death Metal (180) · Black Metal (200) · Heavy Metal (160) · Metalcore (170) · Doom Metal (60) · Post-Rock (95) · Math Rock (150) · Emo (155) · Screamo (180)

**Pop:** Pop (120) · Bedroom Pop (95) · K-Pop (130) · Dream Pop (90) · Synth Pop (118) · Hyperpop (160) · Indie Pop (110) · Dance Pop (128)

**R&B / Soul / Funk:** R&B (90) · Soul (75) · Neo-Soul (85) · Funk (115) · Disco (120) · Nu-Disco (118) · Gospel (70)

**Jazz / Folk / Country:** Jazz (120) · Acid Jazz (105) · Jazz Fusion (110) · Smooth Jazz (95) · Swing (140) · Bebop (180) · Folk (95) · Indie Folk (90) · Country (100) · Bluegrass (140) · Americana (85) · Blues (75)

**Latin / World:** Reggaeton (95) · Samba (170) · Dancehall (90) · Salsa (180) · Afrobeat (110) · Reggae (80) · Bossa Nova (120) · Flamenco (120) · Jungle (165)

**Ambient / Experimental / Classical:** Ambient (60) · Dark Ambient (70) · Drone (50) · Experimental (90) · Noise (100) · Classical (90) · Orchestral (80) · Cinematic (95) · Baroque (110)

---

## VOCAL REFERENCE BANK

A complete VOCALS block needs: tone/timbre + range/gender + delivery + attitude + (optional technique) + **2–4 ad-libs in quotes**. Mix and match the modules below, or use a complete description as-is.

### Tone / Timbre
`warm intimate female voice` · `raspy male tenor with bluesy grit` · `breathy ethereal soprano` · `deep commanding baritone` · `smooth silky alto` · `gritty aggressive male voice` · `angelic airy female voice` · `husky smoky vocals` · `bright clear tenor` · `dark brooding bass voice` · `nasal piercing tone` · `rich resonant voice` · `sultry jazz singer` · `powerful belting vocals`

### Delivery Style
`fast rhythmic rap delivery` · `slow deliberate flow` · `melodic singing with emotional depth` · `conversational intimate delivery` · `aggressive shouted vocals` · `whispered haunting voice` · `theatrical dramatic delivery` · `laid-back relaxed singing` · `staccato punchy delivery` · `legato flowing vocals` · `spoken word poetry style` · `talk-singing casual style`

### Energy / Attitude
`confident swagger and attitude` · `vulnerable emotional delivery` · `playful energetic tone` · `dark menacing presence` · `joyful uplifting energy` · `melancholic sad tone` · `angry aggressive intensity` · `seductive sensual delivery` · `anxious tense delivery`

### Technique
`long sustained notes with vibrato` · `rapid-fire flow with tight rhythm` · `melismatic runs and riffs` · `falsetto highs in chorus` · `growling metal vocals` · `screaming aggressive delivery` · `yodeling country style` · `scat jazz improvisation` · `vocal fry low tones`

### Ad-Lib Banks (by style)
- **Energetic pop:** `AD-LIBS ("whoa-oh!", "hey!", "come on!", "tonight!")`
- **Gospel:** `AD-LIBS ("oh Lord!", "hallelujah!", "yes!", "amen!")`
- **Aggressive rap:** `AD-LIBS ("uh!", "let's go!", "skrrt!", "yeah yeah!")`
- **Smooth male R&B:** `AD-LIBS ("yeah", "ooh", "baby", "come on")`
- **Rock:** `AD-LIBS ("yeah!", "come on!", "alright!", "whoo!")`
- **Dark trap:** `AD-LIBS ("yeah", "uh", "what", "let's ride")`

### Complete VOCALS Descriptions (paste-ready)
- `[VOCALS: clean melodic female with confident swagger; smooth verses building to powerful hooks; playful attitude; AD-LIBS ("yeah!", "let's go!", "break!", "drop it!")]`
- `[VOCALS: deep menacing male voice with slow deliberate flow; whispered verses to aggressive hooks; dark threatening tone; AD-LIBS ("yeah", "uh", "what", "let's ride")]`
- `[VOCALS: raspy male tenor with bluesy grit and emotional depth; long sustained notes; pained delivery; AD-LIBS ("yeah!", "oh Lord!", "take me home!")]`
- `[VOCALS: ethereal female soprano with airy breathiness; dreamy floating quality; whispered verses building to powerful chorus; gentle vibrato; AD-LIBS ("ooh", "mmm", "fly away")]`
- `[VOCALS: powerful dynamic male voice with live energy; raw emotional delivery; interacts with crowd; AD-LIBS ("come on!", "let me hear you!", "everybody!", "one more time!")]`
- `[VOCALS: sultry female alto with jazz phrasing; breathy intimate delivery; conversational tone; sophisticated restraint; AD-LIBS ("yeah", "mmm-hmm", "oh baby", "listen")]`
- `[VOCALS: fast rhythmic rapper with tight flow; staccato punches; confident attitude; aggressive delivery; AD-LIBS ("uh!", "yeah!", "let's get it!", "skrrt!")]`
- `[VOCALS: warm intimate singer-songwriter voice; vulnerable cracks; heartfelt authenticity; breathy verses; AD-LIBS ("oh", "mmm", "hey", "come on")]`
- `[VOCALS: guttural death metal screams; deep growling vocals; aggressive brutal delivery; maximum intensity; AD-LIBS ("break!", "destroy!", "die!")]`
- `[VOCALS: processed robotic voice with vocoder effects; heavily manipulated; fragmented delivery; digital glitches; AD-LIBS ("error", "system", "corrupt")]`

### Genre-Specific Complete VOCALS
- **Pop:** `[VOCALS: bright clear female pop voice with catchy melodic hooks; confident delivery; upbeat energy; AD-LIBS ("yeah!", "whoa!", "tonight!")]`
- **Hip-Hop:** `[VOCALS: deep commanding rapper with boom bap flow; laid-back delivery; smooth rhythm; AD-LIBS ("uh", "yeah", "check it")]`
- **Rock:** `[VOCALS: raw powerful male rock voice; gritty edge; emotion in every line; soaring chorus notes; AD-LIBS ("yeah!", "come on!", "alright!")]`
- **Jazz:** `[VOCALS: sultry jazz singer with smoky tone; improvised phrasing; intimate delivery; effortless style; AD-LIBS ("mmm", "oh yeah", "baby")]`
- **Metal:** `[VOCALS: aggressive metalcore screams mixed with clean singing; intense delivery; powerful transitions; AD-LIBS ("break!", "go!", "destroy!")]`
- **R&B:** `[VOCALS: smooth silky R&B voice with melismatic runs; emotional depth; sensual delivery; AD-LIBS ("ooh", "yeah baby", "mmm-hmm")]`
- **EDM:** `[VOCALS: processed electronic vocals with auto-tune; rhythmic delivery; chopped and layered; energetic hooks; AD-LIBS ("go!", "drop it!", "let's go!")]`

> For instrumentals, do not use these — replace the VOCALS block with aggressive suppression language (see instruction file Section 4).

---

## STRUCTURE REFERENCE BANK

Arrows only (`→`). Label drops/breakdowns/transformations explicitly. Pick a block by category, trim to fit the visual edit.

### Basic Pop / Rock
- `[STRUCTURE: INTRO → VERSE → CHORUS → VERSE → CHORUS → BRIDGE → CHORUS → OUTRO]`
- `[STRUCTURE: VERSE → PRE-CHORUS → CHORUS → VERSE → PRE-CHORUS → CHORUS → OUTRO]`
- `[STRUCTURE: INTRO → VERSE 1 → VERSE 2 → CHORUS → VERSE 3 → CHORUS → FADE OUT]`
- `[STRUCTURE: SHORT INTRO → VERSE → CHORUS → VERSE → CHORUS → BRIDGE → FINAL CHORUS]`
- `[STRUCTURE: ATMOSPHERIC INTRO → VERSE → BUILDING PRE-CHORUS → ANTHEMIC CHORUS → BREAKDOWN → FINAL CHORUS WITH ALL ELEMENTS]`

### EDM / Electronic
- `[STRUCTURE: ATMOSPHERIC INTRO → BUILDUP → DROP → BREAKDOWN → BUILDUP → MASSIVE DROP → OUTRO]`
- `[STRUCTURE: MINIMAL INTRO → VERSE WITH TENSION → RISER → BASS DROP → STRIPPED BREAKDOWN → SECOND DROP → FADE]`
- `[STRUCTURE: CLEAN INTRO → VERSE → PRE-DROP BUILDUP → DROP WITH FULL BASS → BRIDGE BREAKDOWN → FINAL DROP DOUBLED → EXTENDED OUTRO]`
- `[STRUCTURE: AMBIENT INTRO → BUILDING VERSE → WHITE NOISE RISER → EXPLOSIVE DROP → MINIMAL SECTION → FINAL DROP WITH MAXIMUM ENERGY]`
- `[STRUCTURE: SYNTH INTRO → VERSE → TENSION BUILD → HARD DROP → BREAKDOWN WITH SILENCE → MASSIVE FINAL DROP → STUTTERED OUTRO]`

### Hip-Hop / Rap
- `[STRUCTURE: BEAT INTRO → VERSE 1 → HOOK → VERSE 2 → HOOK → VERSE 3 → HOOK → OUTRO]`
- `[STRUCTURE: MINIMAL INTRO → VERSE WITH AD-LIBS → CHORUS → VERSE 2 → CHORUS → BREAKDOWN → FINAL CHORUS → FADE]`
- `[STRUCTURE: ATMOSPHERIC INTRO → RAP VERSE → MELODIC HOOK → RAP VERSE 2 → HOOK → BRIDGE → HOOK DOUBLED → BEAT OUTRO]`
- `[STRUCTURE: HARD INTRO → AGGRESSIVE VERSE → CATCHY HOOK → VERSE 2 → HOOK → MINIMAL BREAKDOWN → FINAL HOOK]`

### Progressive / Building
- `[STRUCTURE: MINIMAL INTRO → SPARSE VERSE → BUILDING PRE-CHORUS → EXPLOSIVE CHORUS → BREAKDOWN → BRIDGE WITH NEW ELEMENTS → MASSIVE FINAL CHORUS → EXTENDED OUTRO]`
- `[STRUCTURE: SOLO INSTRUMENT INTRO → VERSE WITH MINIMAL DRUMS → BUILDING TENSION → FULL BAND CHORUS → STRIPPED VERSE 2 → BRIDGE → CLIMACTIC FINAL CHORUS → FADE]`
- `[STRUCTURE: ATMOSPHERIC START → GRADUAL LAYERING → PEAK INTENSITY → BREAKDOWN TO BASICS → REBUILD → ULTIMATE CLIMAX → GENTLE RESOLUTION]`
- `[STRUCTURE: QUIET INTIMATE INTRO → SLOWLY ADDING ELEMENTS → VERSE → BUILDING ENERGY → CHORUS → MORE LAYERS → BRIDGE → FINAL CHORUS WITH EVERYTHING → SLOW FADE]`

### Genre Transformation (mid-song genre change — pair with BPM/transition labels)
- `[STRUCTURE: ACOUSTIC INTRO → FOLK VERSE → ELECTRONIC ELEMENTS CREEPING IN → SUDDEN EDM DROP → BREAKDOWN → FINAL SECTION BLENDING BOTH GENRES]`
- `[STRUCTURE: JAZZ INTRO → SMOOTH VERSE → TENSION BUILDING → METAL EXPLOSION → CHAOTIC SECTION → ELECTRONIC TRANSFORMATION → EUPHORIC FINALE]`
- `[STRUCTURE: AMBIENT BEGINNING → INDIE ROCK VERSE → BUILDING INTENSITY → DUBSTEP DROP → GLITCHY BREAKDOWN → PROGRESSIVE HOUSE OUTRO]`
- `[STRUCTURE: CLASSICAL PIANO INTRO → BUILDING ORCHESTRAL VERSE → TRAP BEAT ENTERS → HYBRID SECTION → FULL TRAP CHORUS → ORCHESTRAL ENDING]`

### Live Performance
- `[STRUCTURE: CROWD INTRO → VERSE WITH BUILDING ENERGY → CALL-RESPONSE PRE-CHORUS → ANTHEMIC CHORUS WITH CROWD SINGING → BREAKDOWN WITH AUDIENCE PARTICIPATION → BRIDGE WITH COUNTDOWN → EXPLOSIVE FINAL CHORUS → EXTENDED OUTRO WITH CROWD]`
- `[STRUCTURE: ARTIST SPEAKING TO CROWD → VERSE → PRE-CHORUS CROWD CLAPPING → CHORUS WITH EVERYONE SINGING → STRIPPED BREAKDOWN → CROWD CHANTING → MASSIVE FINAL CHORUS → THANK YOU OUTRO]`

### Section-Specific (descriptive)
- `[STRUCTURE: FUNKY VOCAL INTRO → RAPID-FIRE VERSE → BOUNCY PRE-CHORUS → ACID-FUNK DROP → RHYTHMIC BREAKDOWN → HIGH-ENERGY OUTRO]`
- `[STRUCTURE: ATMOSPHERIC BUILD → MINIMAL DRUMS ENTER → BUILDING TENSION → BASS DROP WITH FULL DRUMS → BREAKDOWN WITH VOCALS AND PADS → FINAL DROP WITH ALL ELEMENTS → AMBIENT OUTRO]`
- `[STRUCTURE: SOLO GUITAR INTRO → INTIMATE VERSE MINIMAL DRUMS → BUILDING PRE-CHORUS → FULL BAND EMOTIONAL CHORUS → STRIPPED VERSE 2 → BRIDGE WITH STRINGS → POWERFUL FINAL CHORUS → GUITAR OUTRO FADE]`

---

## MIX REFERENCE BANK

Never leave MIX vague. A strong MIX block names character + frequency balance + spatial behavior + dynamics + instrument glue. Build from the modules, or paste a complete description.

### Overall Character
`analog warmth throughout; vintage tape saturation` · `digital precision; clean modern production` · `lo-fi gritty texture; dusty vintage feel` · `pristine polished sound; radio-ready clarity` · `raw unpolished; garage band aesthetic` · `heavily compressed loud; wall of sound` · `natural dynamic range; breathing room` · `dark atmospheric; moody low-end heavy` · `bright crisp; sparkling high frequencies`

### Frequency Balance
`bass-forward; deep sub presence` · `mid-range focused; warm and full-bodied` · `bright crisp highs; airy top end` · `scooped mids; bass and treble emphasized` · `full-spectrum; balanced across all frequencies` · `low-end heavy; rumbling sub bass` · `thin bright mix; reduced low frequencies` · `thick warm mids; vintage character`
> For voice-over/dialogue beds, request **scooped mids (1k–4kHz hollowed)** to keep speech clear.

### Spatial / Stereo
`wide stereo field; spacious production` · `mono-centered; narrow intimate feel` · `wide panned elements; immersive stereo` · `natural room ambience; live feel` · `tight centered mix; punchy and focused` · `stereo width on synths; mono bass and vocals` · `Haas effect widening; enhanced space`

### Instrument Relationships (glue)
`bass and kick locked together; tight low-end` · `drums punchy and upfront; driving force` · `guitars wide and layered; wall of sound` · `piano intimate and close; detailed` · `strings lush and distant; cinematic space` · `synths sidechained to kick; pumping` · `bass glued to vocals; moving together`

### Reverb & Space
`big hall reverb; cathedral space` · `tight room reverb; intimate club feel` · `plate reverb on vocals; vintage character` · `spring reverb; retro surf sound` · `no reverb; dry and direct` · `ambient reverb tails; atmospheric` · `gated reverb on drums; 80s style` · `natural room ambience; live recording feel`

### Delay & Echo
`slap-back delay; vintage rockabilly` · `ping-pong delay; stereo movement` · `long ambient delays; spacious tails` · `dotted eighth delay; rhythmic texture` · `no delay; clean and direct` · `tape delay warmth; analog character`

### Technique-Specific
`parallel compression on drums; tape saturation on vocals; wide stereo guitars; mono bass; natural room reverb` · `multiband compression; sidechain everything to kick; high-pass filter on pads; low-pass on vocals during verses; pumping aggressively` · `vintage console emulation; tube saturation; analog summing warmth; natural tape compression; room mics on drums` · `brick-wall limiting; digital precision; stereo widening; no headroom; maximum loudness; competitive streaming levels`

### Genre-Specific Complete MIX
- **EDM:** `[MIX: heavy sidechain to kick; loud aggressive; bass-forward; bright crisp highs; wide stereo synths; pumping compression]`
- **Hip-Hop:** `[MIX: bass and kick dominant; vocals clear and upfront; minimal reverb; tight punchy drums; warm analog saturation]`
- **Rock:** `[MIX: guitars wide and powerful; drums aggressive and roomy; vocals cutting through; natural dynamics; analog warmth]`
- **Jazz:** `[MIX: natural room ambience; warm vintage tone; dynamic range preserved; intimate close sound; analog tape character]`
- **Metal:** `[MIX: heavily compressed; guitars brutal and thick; kick and bass locked; vocals aggressive upfront; no subtlety]`
- **Pop:** `[MIX: bright polished; vocals prominent; balanced frequencies; radio-ready; tight compression; clean modern]`
- **Lo-Fi:** `[MIX: vinyl crackle texture; dusty warm mids; rolled-off highs; tape saturation; intimate close feel; nostalgic character]`

### Complete MIX Descriptions (paste-ready, multi-element)
- `[MIX: digital precision; tight compression; bass-forward; vocals upfront with automation; punchy transients; wide stereo glitches]`
- `[MIX: analog tape warmth; natural room ambience; vocal close and intimate; gentle compression; spacious reverb on strings; organic live feel]`
- `[MIX: dark low-end heavy; compressed tight; vocals intimate and upfront; spacious reverb on ad-libs; analog warmth throughout; bass and kick locked]`
- `[MIX: wide stereo synths; pumping sidechain to kick; bright crisp highs; full powerful mids; vocals sitting on top; 80s gated reverb character; modern punch]`
- `[MIX: loud aggressive compression; heavy sidechain; bass-forward; harsh frequencies emphasized; distortion as character; digital clipping intentional]`
- `[MIX: warm analog character; full-bodied mids; crisp hats; bass groove glued to vocals; natural dynamics; vintage tape saturation]`
- `[MIX: live venue reverb; natural room acoustics; vocals raw and dynamic; stadium echo on shouts; authentic concert atmosphere; instruments breathing with space]`
- `[MIX: lo-fi vintage texture; dusty mids; rolled-off highs; warm saturation; intimate close feel; vinyl crackle throughout]`

---

## END OF MASTER KNOWLEDGE
