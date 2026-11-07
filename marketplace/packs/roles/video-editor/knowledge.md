# Video editor: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Platform specs, tool features and music rules change often, so each one carries its source and the date it was true. This is general editing practice, not legal advice. Licence, copyright and accessibility-law questions go to the rights owner or a qualified adviser.

## 1. What this role is for

A business hires a video editor when it has footage and no time to turn it into something people watch. A podcast host has a 40-minute episode filmed on two cameras. A software company has a 50-minute webinar. A coach has a talk and wants ten short clips. A creator edits their own videos but hates choosing which moments to keep.

This role decides what stays, what goes and in what order, then hands over a cut that the client, their editor or their editing tool can build. It writes edit decision lists, clip plans, captions, B-roll and music cue notes, chapters and descriptions. With access to a connected editing tool it can also build drafts and, within the client's limits, upload approved cuts.

Many editors in this role plan from the timed transcript and shot notes rather than from the picture. That works for talk-led video, because most decisions follow the words. It has limits: a transcript does not show a glance, a gesture, a cut-away or a camera fault. A transcript-only editor says so at the top of every plan and marks any decision that needs a look at the picture.

**Who hires it.** Podcasters and webinar hosts with long recordings; businesses turning talks and interviews into short clips; creators who edit themselves; agencies that need a cut list before an editor starts; teams using Descript, CapCut, Premiere or Resolve who want a plan to follow.

**What good work looks like.**

- Every timecode exists in the source, and every clip length matches its in and out points.
- No cut changes what someone meant.
- Clips that make sense alone, with the point early.
- Captions that match the final audio, readable in the time they are up.
- Chapters and descriptions drawn from what was said.
- Files that match each platform's current spec, with music and footage cleared.

**How it is judged.** By whether viewers stay and understand. By whether the editor or tool can cut straight from the list without calling back. By whether anything goes live with a misquote, a copyright claim, a blocked Short or captions that do not match. By whether the speaker recognises their own meaning in the cut.

## 2. The canon

**Reading list.** Credited by author and title; this kit makes no specific claim from them.

- Walter Murch, *In the Blink of an Eye* (2nd edition, 2001). Read it for how an editor decides where and why to cut.
- Karen Pearlman, *Cutting Rhythms* (2nd edition, 2016). Read it for rhythm and pacing as the editor's main tools.
- Edward Dmytryk, *On Film Editing* (1984). Read it for the classic working rules of the cutting room.
- Ken Dancyger, *The Technique of Film and Video Editing*. Read it for the history and grammar of editing styles.

**Published standards that act as the rulebook.**

- **Netflix's English (USA) Timed Text Style Guide** [22] for line length, reading speed and line breaks, the most detailed public caption rules I could check.
- **The DCMP Captioning Key** [21] for caption rates and the rule that edited captions keep the speaker's meaning.
- **W3C WCAG 2.2** [19] and the **WebVTT** specification [20] for captions on the web.
- **Ofcom's Broadcasting Code, rule 7.6** [28]: when a programme is edited, contributions should be represented fairly. It binds UK broadcasters, not business videos, but it states the editor's first duty well.
- **Each platform's and tool's own help pages** [1]-[18], the final word on specs and features.

The video producer kit covers scripts, storyboards, safe areas for 16:9, loudness, the rights log and AI disclosure in depth; this kit points there rather than repeating them.

## 3. How the work is done now

### Editing from text (checked 6 Nov 2026)

Text-based editing is now built into the main tools. Adobe's Premiere transcribes footage on import and lets editors build a rough cut by copying and pasting text, with Speech to Text captions in 18 languages and speaker identification (Adobe features page, checked 6 Nov 2026) [11]. DaVinci Resolve 21 transcribes clips for subtitles or text-based editing [14], and its IntelliScript compares a script with transcribed audio to build a scene cut [13]. Descript's connector lets an AI assistant run edits such as filler-word and retake removal, captions and reframing inside a client's Descript account [18].

So the editor's first ask is a **timed transcript**: an SRT or VTT file, or a transcript export with timestamps. Without timestamps there is no plan, only a guess. Gaps between timestamps show pauses; overlapping speaker labels show crosstalk.

### Timecode

- In edit lists, write timecode as HH:MM:SS:FF and state the frame rate at the top. YouTube asks for video encoded at the frame rate it was recorded, and lists 24, 25, 30, 48, 50 and 60 fps as common [1].
- SRT files use a comma before milliseconds (00:00:04,160) [5]. WebVTT uses a full stop (00:00:04.160) and starts with the line WEBVTT [20]. Mixing them up breaks imports.
- YouTube chapters use plain timestamps in the description, starting at 00:00 [4].
- At 29.97 fps, check whether the project uses drop-frame timecode, which skips some frame numbers so the clock stays in step with real time. Match the client's project setting.

### The edit decision list (checked 6 Nov 2026)

An edit decision list (EDL) is two things: the editor's working table, and a file format tools exchange. The working table has one row per decision: number, in, out, action (keep, cut, tighten), and reason. It is what the client approves.

The file form moves a cut between tools. Descript's connector exports timelines as EDL, AAF, FCPXML, Premiere XML and DaVinci Resolve XML, and transcripts as SRT among others [18]. CapCut does not import or export project files from other editors such as Premiere; the options are to render a video file and import it, or rebuild the timeline by hand [15]. For CapCut users, the plan is written as in and out points they can mark with the I and O keys and export section by section [16].

### Cutting without changing meaning

The rule: an edit may shorten what someone said, never change it. Ofcom's rule 7.6 says edited contributions should be represented fairly [28], and the DCMP says edited captions must keep the original meaning and essential words [21]. In practice:

- Never cut a "not", "never", "unless", "but" or condition so that the sentence flips.
- Never join the start of one answer to the end of another to make a claim nobody made.
- Keep the setup a line needs to make sense; often the clip starts a few seconds earlier than the best line.
- Flag any cut that could change meaning and leave the call to the client.

### Tightening

Remove false starts, repeated phrases, filler, long pauses and off-topic runs. Premiere and Descript both offer tools that find filler words and retakes [11][18]. Each removal can leave a jump in the picture; plan the cover: a second camera angle, a punch-in, B-roll, or a deliberate jump cut if the style allows. A transcript-only plan marks each such cut "[cover: angle 2 or B-roll]".

### Short clips

A good clip makes sense without the rest of the video, puts the point in the first seconds, and ends on a complete thought. Hook text and on-screen text come from words actually said; reordering whole sentences is allowed only if flagged.

**Platform limits (checked 6 Nov 2026).**

- **YouTube Shorts:** up to 3 minutes, square or vertical [2]. Square or vertical uploads of up to 3 minutes since 15 Oct 2024 count as Shorts; 16:9 stays long-form [3]. A Short over 1 minute with an active copyright claim is blocked worldwide, though the channel is not penalised [3][6]. Most songs from the Shorts audio library can run up to 90 seconds in a Short; some only 60 or 30 [3].
- **Instagram Reels ads:** 9:16 at 1440 x 2560, up to 15 minutes and 4 GB, MP4 or MOV, H.264, fixed frame rate, stereo AAC at 128 kbps or more; keep 14% at the top, 35% at the bottom and 6% at each side free of text and logos [8].
- **Reels published through Instagram's API:** 3 seconds to 15 minutes, up to 300 MB, 23 to 60 fps, up to 1920 pixels wide, H.264 or HEVC, 9:16 recommended [9]. A tool that posts for the client may enforce these limits.
- **TikTok uploads:** MP4 or WebM, at least 720 x 1280, under 10 GB and up to 30 minutes, per TikTok's English help page; some other language versions show 10 minutes, so check the client's account [12]. Confirmed through search results on 7 Nov 2026, because TikTok blocks automated reads. For TikTok ad specs, see the video producer kit.

**Reframing to vertical.** Premiere's Auto Reframe changes the aspect ratio and keeps the focal point [11]; Descript can reframe as one of its edits [18]. Two people far apart in a wide shot rarely survive a 9:16 crop; plan a cut between single shots or a split layout, and note it.

### Captions (checked 6 Nov 2026)

- **Why:** WCAG 2.2 level A asks for captions on prerecorded audio in synchronised media; captions name speakers and include sounds needed to understand the content [19]. Many people watch short video with the sound off.
- **Timing:** Netflix's English guide allows 42 characters per line, two lines, and up to 20 characters per second for adult programmes (17 for children's) [22]. The DCMP sets lower maximum rates for educational media, from 130 to 160 words per minute by level [21]. Use the client's audience to choose.
- **Line breaks:** break after punctuation and before conjunctions and prepositions; keep a first and last name together; prefer a bottom-heavy shape [22].
- **Formats:** YouTube accepts SRT as plain UTF-8 with no styling, and WebVTT with positioning [5]. Resolve imports SRT, TTML and others and exports SRT, VTT or TTML, or burns subtitles in [14]. CapCut's web captions cover 20+ languages and accept an uploaded SRT [17]. Descript exports SRT [18].
- **Clip-relative times:** a caption file for a clip starts at 00:00:00,000 at the clip's in point. Subtract the in point from every source time and check the last caption ends before the clip does.
- **Open or closed:** burned-in (open) captions cannot be turned off; closed captions can [19]. Burned-in captions sit inside the safe zone [8].

### B-roll, pacing and music cues (checked 6 Nov 2026)

Cue notes tie every suggestion to a timecode: what to show, for how long, and why. B-roll comes only from footage the client listed; anything else is marked "[needs: ...]". Pacing notes say where to hold, where to tighten and where a beat of silence helps.

Music needs a licence that covers this use. The U.S. Copyright Office explains that a recording usually holds two works, the composition and the sound recording, commonly owned and licensed separately [23]. There is no set number of seconds that is automatically fair use [24]. YouTube's Audio Library music is copyright-safe on YouTube and not claimed through Content ID, but Creative Commons tracks there need credit, and YouTube does not vouch for "royalty-free" music from elsewhere [7]. Meta's Music Guidelines say commercial or non-personal use of music needs the right licences [10]. Creative Commons NC material is non-commercial only and ND material cannot be edited [25]. UK and EU copyright is automatic and licences can be limited by time, territory and use [26][27]. CapCut's terms page returned "unavailable for legal reasons" to my check on 6 Nov 2026, so confirm in-app music licence terms before using its library in business videos. If a claim arrives, YouTube's options are to leave it, mute or trim the claimed part, replace the song, share revenue if eligible, or dispute only with the rights in hand [6].

### Chapters and descriptions (checked 6 Nov 2026)

YouTube manual chapters need the first timestamp at 00:00, at least three timestamps in order, and each chapter at least 10 seconds long; manual chapters override automatic ones; channels with active strikes cannot use chapters [4]. Write chapter titles from what was said, not from what the client wishes was said.

### Exporting (checked 6 Nov 2026)

YouTube's recommended upload: MP4 with the moov atom at the front, H.264 High Profile, AAC-LC or Opus at 48 kHz, recorded frame rate, and for SDR 1080p about 8 Mbps at 24 to 30 fps or 12 Mbps at 48 to 60 fps [1]. Resolve's Quick Export can upload straight to YouTube [14]; Premiere can publish to social platforms with captions [11].

### Accessibility law by region (checked 6 Nov 2026)

- **US:** for state and local government clients and their contractors, the Justice Department's ADA Title II rule adopts WCAG 2.1 AA, which includes captions, with compliance dates of 26 Apr 2027 or 26 Apr 2028 depending on size (dates extended by a 20 Apr 2026 interim rule) [29].
- **EU:** the European Accessibility Act applies from 28 June 2025 and covers services giving access to audiovisual media and e-commerce services; microenterprises providing services are exempt [30].
- **UK:** I did not find an official page in my checks that sets caption duties for business marketing video. Follow WCAG [19].

Whether a legal duty applies to a client is a question for a qualified adviser.

### Access and connected tools (as of 6 Nov 2026)

Descript publishes an MCP connector that works inside the client's Descript account: import media, edit, caption, publish a share link and export transcripts and timelines; it cannot hand over an MP4 on request [18]. I found no official Premiere MCP server. Resolve Studio lists a remote scripting API among its paid features [14]. I found no CapCut connector. Access is granted per tool: read (level 1), read and draft (level 2), and read, write and publish within the client's limits (level 3). Level 3 covers uploading and scheduling an approved cut on the agreed channel and dates. A fresh yes is needed every time to delete or replace a live video, post to a new account, buy or accept a music or footage licence, dispute a copyright claim, or overwrite original media.

## 4. Benchmarks and numbers

Checked 6 Nov 2026 on each publisher's own page. Caveat for all: platforms change specs without notice.

- **Caption reading speed:** up to 20 characters per second for adults, 17 for children; 42 characters per line; two lines (Netflix, change log to 19 Dec 2025) [22].
- **Caption rates for educational media:** 130, 140 and 160 words per minute by level (DCMP) [21]. *Caveat:* written for educational media.
- **YouTube Shorts:** up to 3 minutes; Shorts over 1 minute with an active claim are blocked; Shorts audio library songs up to 90 seconds in most cases [2][3].
- **YouTube chapters:** first at 00:00, at least three, each at least 10 seconds [4].
- **YouTube 1080p SDR bitrate:** 8 Mbps (24-30 fps), 12 Mbps (48-60 fps) [1]. *Caveat:* YouTube's recommendation, not a hard limit.
- **Instagram Reels ads:** 9:16, 1440 x 2560, up to 15 minutes, 4 GB; safe zones 14% top, 35% bottom, 6% sides [8].
- **Reels through the API:** 3 seconds to 15 minutes, up to 300 MB, 23-60 fps [9].
- **Premiere Speech to Text:** 18 languages [11]. **CapCut web captions:** 20+ languages [17].

No source I checked gives a trustworthy ideal clip length or retention rate. Use the client's own analytics (audience retention, average view duration) and test.

## 5. Decision rules

- If the transcript has no timestamps, ask for a timed export before planning, because every decision needs a real in and out point.
- If a cut removes a negative, a condition or the setup of a point, keep it or flag it, because a cut that flips meaning misrepresents the speaker [28].
- If a clip needs the line before it to make sense, start the clip earlier rather than trimming the context away.
- If a filler or retake cut leaves a jump in the picture, plan cover (second angle, punch-in, B-roll) or mark it.
- If a clip will be a YouTube Short over 1 minute, clear every song and clip first, because a claim blocks it worldwide [3].
- If captions run faster than the reading speed for the audience, split them or hold them longer, and edit words only without changing meaning [21][22].
- If the platform publishes a spec, follow it over any general rule, because its upload system decides what is accepted [1][8][9].
- If music has no licence covering this use, platform and term, replace it, because there is no safe number of seconds [23][24].
- If the client edits in CapCut, write the plan as in and out points to mark by hand, because CapCut cannot import another editor's project [15][16].
- If the client uses Descript, Premiere or Resolve, offer an exchange file (EDL or XML) where the tool supports it [18].
- If a step would publish, delete, license or dispute something, check the access level first, and get a fresh yes for anything that cannot be undone.

## 6. Common mistakes, and how to spot them

- **Timecodes that do not exist.** Spot it: an out point after the end of the source, or lengths that do not match in and out.
- **Misquotes by cutting.** Spot it: a clip that sounds stronger than anything the speaker said in full [28].
- **Clips without context.** Spot it: the clip starts with "and that's why" or "so".
- **Jump cuts left uncovered.** Spot it: three filler cuts in ten seconds on a single locked-off shot.
- **Captions from the draft script.** Spot it: captions that say what was planned, not what was said.
- **Caption floods.** Spot it: three lines on screen, or 60 characters up for one second [22].
- **Wrong caption format.** Spot it: a full stop in SRT times, a comma in WebVTT, or styling tags in an SRT for YouTube [5][20].
- **Source times in a clip SRT.** Spot it: the clip's first caption starts at 00:31:38,000.
- **Text under the buttons.** Spot it: burned-in captions in the bottom 35% of a Reel [8].
- **Music because it sounded good.** Spot it: no licence on file; a claim arrives after upload [6][7].
- **Invalid chapters.** Spot it: the first chapter at 00:15, or a 6-second chapter [4].
- **Wide two-shots cropped to vertical.** Spot it: one speaker cut in half in the 9:16 frame.

## 7. Quality bar: what an expert checks before shipping

1. Does every timecode exist in the source, and do lengths equal out minus in?
2. Does every cut keep the speaker's meaning, with risky cuts flagged?
3. Does each clip make sense alone, with the point early and a complete ending?
4. Are captions accurate to the final audio, timed to the reading speed, with speakers and important sounds [19][22]?
5. Are clip SRTs clip-relative, in the right format, plain UTF-8 [5]?
6. Are chapters valid for YouTube's rules [4]?
7. Is every song, clip and font cleared for this platform and use [6]-[10][23]-[25]?
8. Do exports match each platform's dated spec, with on-screen text inside the safe zone [1][8][9]?
9. Is the plan clear about what was seen and what was planned from the transcript alone?
10. Is the access level written down, and is every live action logged?

## 8. How this role writes

**Deliverables.** An edit decision list table (number, in, out, action, reason); a clip table (working name, in, out, length in seconds, hook text, on-screen text, ratio, platform); cue notes by timecode (B-roll, pacing, music, graphics); SRT files per clip; chapters and a description; a delivery table; a rights note; an action log.

**Conventions.** Every note starts with a timecode. Frame rate stated at the top. Lengths in seconds. Quotes word for word, in quotation marks. Missing footage marked "[needs: ...]"; picture checks marked "[check picture]"; meaning risks marked "[meaning risk]". File names carry the project, clip name, ratio, length and version. Platform specs carry their source and date. Short notes; full sentences only for the reason behind a cut.

## 9. Glossary

- **Edit decision list (EDL):** the list of cuts with in and out points; also a file format for moving a cut between tools [18].
- **In point and out point:** where a kept section starts and ends [16].
- **Timecode:** a frame's address in hours, minutes, seconds and frames.
- **Drop-frame timecode:** a 29.97 fps timecode that skips some frame numbers so the clock matches real time.
- **Frame rate (fps):** frames per second; match the recording [1].
- **Text-based editing:** editing a video by editing its transcript [11][14].
- **Rough cut and fine cut:** the first assembly, and the tightened version.
- **Jump cut:** a visible jump in the picture where a section was removed from a single shot.
- **Punch-in:** a tighter crop of the same shot, used to hide a cut.
- **B-roll:** supporting footage cut over the main speaker.
- **J-cut and L-cut:** sound leading the picture into a shot, or carrying over after it.
- **Hook:** the opening seconds of a clip that make a viewer stay.
- **Aspect ratio:** frame shape, such as 16:9, 9:16 or 1:1 [3][8].
- **Safe zone:** the part of a vertical frame not covered by app buttons and labels [8].
- **Reframe:** recropping footage to a new aspect ratio while keeping the subject in frame [11].
- **SRT:** SubRip caption file: numbered blocks, start and end times with comma milliseconds, plain text [5].
- **WebVTT:** the web caption format that starts with WEBVTT and supports positioning [20].
- **Open and closed captions:** burned into the picture, or switchable by the viewer [19].
- **Characters per second (CPS):** caption reading speed [22].
- **Chapters:** timestamped sections in a YouTube description [4].
- **Content ID claim:** YouTube's automatic match to a rights owner's file [6].
- **Musical work and sound recording:** the composition and the recorded performance, usually licensed separately [23].
- **Fair use:** a US legal defence decided case by case on four factors, with no set safe amount [24].

## 10. What changes fast

Re-check at each refresh:

- **Platform specs and lengths:** YouTube encoding, Shorts and chapters [1]-[4]; Instagram Reels ad and API specs [8][9]; TikTok's upload limits [12].
- **Music rules:** YouTube claims and Audio Library [6][7]; Shorts audio library limits [3]; Meta's Music Guidelines [10]; CapCut's licence terms, which were unreachable on 6 Nov 2026.
- **Tool features:** Premiere features [11]; Resolve version and Studio-only list [13][14]; CapCut help and captions [15]-[17]; Descript's MCP abilities and limits [18].
- **Caption standards:** Netflix's style guide [22], the DCMP Captioning Key [21], W3C pages [19][20].
- **Accessibility law:** ADA Title II dates [29]; European Accessibility Act guidance [30].
