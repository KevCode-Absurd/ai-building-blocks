# Podcast producer: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Platform specs and rules change often, so each one carries its source and the date it was true. This is general production practice, not legal advice. Releases, sponsor contracts, music licences and voice rights go to the client's own lawyer or the rights owner.

## 1. What this role is for

A business or creator hires a podcast producer when they want to talk, not do the admin. A consultant records a weekly interview show and needs guests booked, questions written and notes published. A company starts a show for customers and needs a format, a trailer and a release plan. A coach has forty episodes and no idea which ones work.

This role sits around the microphone. It plans the season, books and prepares guests, writes the outline and run sheet, and after the recording turns an hour of talk into titles, show notes, chapters, a clean transcript, clips and promo posts. It checks the files and the feed before release and, with level 3 access, publishes within the client's limits. It does not have to edit the audio itself; when it does, it uses the client's tools and leaves the final sound to the client's ear.

**Who hires it.** Solo hosts and interview shows; small companies with a branded show; coaches, authors and consultants; charities and community groups; agencies that make shows for clients.

**What good work looks like.**

- Each episode has one promise, stated before recording, and the title keeps it.
- Guests arrive prepared, agree in writing how the recording will be used, and are quoted only in their own words.
- The run sheet keeps the recording to time and covers sponsor reads, consent lines and calls to action.
- Show notes help a listener decide in seconds, and find the best minute by timestamp.
- Files and feed match the current specs of Apple, Spotify and YouTube, with a transcript.
- Every song, sound, sponsor read and AI voice is cleared, disclosed where needed and logged.
- Nothing invented: no quotes, numbers, guest claims or download promises.

**How it is judged.** By whether listeners follow and come back; whether guests would come again; whether episodes go out on the agreed day without a feed error, a rights claim or a missing disclosure; and whether the host spends less time on admin.

**What an AI producer delivers.** Season plans, outlines, question lists, run sheets, guest pitches and prep packs, release form checklists, show notes, titles, chapters, transcript fixes, clip picks and promo copy, rights logs and release checks. With level 2 or 3 access to the client's host, editor or platform it also saves drafts, uploads files and, within the client's limits, schedules and publishes.

## 2. The canon

**Books practitioners return to.** Credited as a reading list; this kit makes no specific claim from them.

- Jessica Abel, *Out on the Wire* (2015). Read it for how narrative shows find a story and structure it.
- Ira Glass and Jessica Abel, *Radio: An Illustrated Guide* (1999). Read it for how radio stories are built, told by people who make them.
- Eric Nuzum, *Make Noise* (2019). Read it for finding a show's purpose and audience before recording.
- Jonathan Kern, *Sound Reporting* (2008). Read it for interviewing, writing for the ear and editing tape.

**Published rules that act as the craft's rulebook.**

- **Platform help centres** [1]-[15]. Apple Podcasts for Creators, Spotify for Creators and YouTube Help are the final word on audio, feeds, chapters, transcripts and content rules.
- **RSS 2.0 and the podcast namespace** [27][28]. The open formats every podcast app reads.
- **Loudness standards** [1][26]. Apple's playback target and the EBU broadcast standard.
- **Advertising disclosure rules** [17][18][19]. The FTC in the US, the CAP Code in the UK, and EU consumer law.
- **WCAG** [25]. Transcripts as the accessible version of audio.

## 3. How the work is done now

### Formats

Pick the format before the first guest. The common ones:

- **Interview:** a host and a guest. Easy to make, crowded, and only as good as the guest list and the questions.
- **Co-hosted conversation:** two or more regular hosts. Lives on chemistry and needs a clear segment structure.
- **Solo:** one host teaching or reflecting. Cheap to make; needs tight outlines.
- **Narrative or documentary:** scripted, with tape and narration. Slow to make; serial order matters.
- **Panel or roundtable,** **company show** (customers, staff, partners), and **video podcast** (filmed conversation for YouTube or Spotify).

Apple distinguishes **episodic** shows, heard in any order and shown newest first, from **serial** shows, heard in order and shown oldest first; serial shows can be grouped into seasons. Episode and season numbers belong in metadata fields or RSS tags, not in titles (Apple, checked 6 Nov 2026) [6].

### Planning a season

A season plan lists episode ideas tied to the audience's real questions, the guest to pitch for each, a working title and a release rhythm the host can keep. Sources for ideas: questions customers ask, the host's sales calls, comments and reviews, and last season's analytics. A **trailer** introduces the show; Apple advises keeping trailers to two minutes or less and ending with when episodes arrive and a reminder to follow [7].

### Booking and preparing guests

1. **Shortlist** guests who serve the audience, not just big names. Check recent appearances so the episode adds something new.
2. **Pitch** in a few lines: why this show, why this guest, the angle, the format, the length, the recording method and dates.
3. **Book** with a calendar link and confirm time zone, platform, length and what the guest needs (headphones, a quiet room, a wired connection).
4. **Prep pack:** show summary, audience, the topic and angle, a few sample questions (not a script), recording logistics, how the episode will be used, and the release form.
5. **Pre-interview** for big or sensitive topics: a short call to find stories and boundaries.

### Release forms and consent

A guest release is a written agreement on how the recording can be used. The client's lawyer writes or approves the form; the producer makes sure one exists and is signed before release. A typical form covers: permission to record, edit and publish the conversation on all platforms and formats; use of name, image, bio and voice in clips, promos and transcripts; any review the guest is offered (and that it is a check for facts, not a veto, unless agreed); topics that are off limits; what happens if the guest asks for removal later; and whether AI tools may be used for translation, dubbing or voice repair. Also ask everyone on the recording to agree on tape at the start. Rules on recording calls differ by country and by US state, so the client checks local rules. Guest contact details are personal data; store them where the client keeps other contact data.

### The outline and run sheet

An **outline** gives the episode promise, the cold open idea, segments with their purpose, ten or so questions in a logical order (open, story, detail, turn, close), and the call to action. A **run sheet** turns that into a recording plan with timings: pre-roll checks, consent line, intro, segments, sponsor read slots, the close, and room for pickups. Questions are open ("Walk me through the day it went wrong") and include follow-ups for the likely answers.

### After the recording

The producer's main job starts with the transcript.

- **Find the best moments** and their timestamps first; they drive the title, the cold open, clips and promo.
- **Titles** promise one clear thing, ideally in the guest's own words. Apple's search guidance favours distinctive names and warns against emojis and repeated episode titles [8]; its content rules forbid misleading metadata and keyword stuffing [3].
- **Show notes:** a two- or three-sentence summary, takeaways, timestamps, links the guest mentioned, sponsor disclosure, credits and the call to action.
- **Chapters.** Apple accepts chapters in the episode description, starting at 00:00:00 with at least three, or through the `podcast:chapters` tag, or in MP4 or ID3 file metadata. Its best practice: at least three chapters, no more than six per hour, each at least two minutes, titles under 45 characters and fewer than five words. Apple makes automatic chapters from iOS 26.2 for English full and bonus episodes of 10 minutes or more [5]. Spotify reads timestamps in the description: the first at 00:00, at least three chapters, at least 30 seconds apart, in order, plain-text titles, with titles under 40 characters recommended; it also makes automatic chapters for some English shows and shows AI "chapter hooks" that can be turned off [10]. Both checked 6 Nov 2026. One set of chapters that meets the stricter rule of each platform works on both.
- **Transcripts.** Apple makes automatic transcripts after publishing and accepts creator files in VTT or SRT through the feed's transcript tag; VTT can name speakers, and transcripts that fail Apple's quality checks are not shown [4]. Spotify lets creators edit by downloading the VTT and re-uploading, and accepts VTT or SRT up to 5MB with timestamps; switching on automatic transcripts replaces an uploaded one [11]. The open `podcast:transcript` tag takes a URL and file type, with `rel="captions"` for timed files [28]. WCAG treats a transcript as the text alternative for prerecorded audio at level A: what is said, who says it, and significant sounds [25].
- **Clips and promo:** pick moments that make sense without context, write the hook line, captions and a post per platform.

### Audio specs and loudness (as of 6 Nov 2026)

- **Apple (RSS audio):** MP3 or AAC, with AAC strongly recommended; for stereo at 44.1 or 48 kHz, 128 to 256 kbps; for mono at 44.1 or 48 kHz, 64 to 128 kbps [1].
- **Loudness:** Apple asks for overall loudness around -16 dB LKFS with a tolerance of 1 dB either way and true peak at or below -1 dBFS, measured under ITU-R BS.1770-5, applied before encoding [1]. European broadcast uses -23 LUFS under EBU R 128 (version 5.0, Nov 2023) [26], so a file mixed for radio will sound quiet in podcast apps.
- **Subscriber audio** uploaded to Apple Podcasts Connect can be WAV, FLAC or MP3; single-channel WAV or FLAC files are rejected, so send two identical channels [1].
- **Spotify video podcasts:** MP4 recommended, H.264 or H.265, 1080p or higher, 16:9 with no added borders, 24 to 60 fps, AAC-LC stereo audio at 128 kbps or more; under 10 GB and 4 hours recommended [12].

I found no loudness target in the Spotify for Creators pages I checked on 6 Nov 2026, so I mix to Apple's target unless the client's host or network gives another.

### The feed

The RSS feed is the show. RSS 2.0 requires a channel title, link and description; each episode's enclosure needs a URL, length in bytes and file type; and `pubDate` uses the RFC 822 format [27]. Apple adds: a public feed that is not password-protected, the `itunes` and `content` namespaces, hosting that allows HEAD and byte-range requests, a unique enclosure URL per episode, a GUID that never changes, ASCII-only URLs and file names, and correctly escaped characters [2]. Changing a GUID makes apps treat an old episode as new; changing the feed URL or host needs a redirect. These are the mistakes that cannot be quietly undone.

### Platforms

- **Apple Podcasts:** content guidelines require accurate metadata, the explicit tag where needed, rights to all content, and editorial content that greatly exceeds advertising [3]. Search ranking uses metadata, popularity and engagement; ratings and reviews are not used in Search ranking [8].
- **Spotify:** content provided without the rightsholder's permission may be removed, and impersonation meant to deceive is not allowed [13].
- **YouTube:** audio shows can be delivered by RSS; YouTube makes a video per episode with the show art as a still image, uploads new episodes automatically and first as private, and does not sync later edits or replaced audio. Its page says podcast content delivered this way cannot contain advertisements and that branded content, sponsorships or endorsements must be declared; check how that applies to host reads and inserted ads before connecting the feed. Titles and descriptions cannot contain `<`, `>` or HTML. Available in select countries (checked 6 Nov 2026) [14].

### Sponsor reads and disclosure

- **US:** the FTC treats a paid host's positive opinion as an endorsement. Disclose the paid relationship when the audience would not expect it, plainly, at the start of the segment and when products are endorsed; an audible endorsement needs at least an audible disclosure; and a host cannot describe experience with a product they have not tried [17].
- **UK:** the CAP Code requires marketing to be obviously identifiable and commercial intent to be made clear [18].
- **EU:** the Commission's Influencer Legal Hub says advertising, brand partnerships, paid content and affiliate links must be disclosed, under the Unfair Commercial Practices Directive among other rules [19].
- **Platforms:** Apple requires that ads follow the law and that episodes are not mainly advertising [3].

In practice: say "This episode is sponsored by..." or "paid ad" out loud before the read, mark it in show notes, keep host claims to what the host truly uses, and run every claim past the sponsor's approved facts.

### Music

- A recording usually contains two works, the musical work and the sound recording, and the US Copyright Office says they are commonly owned and licensed separately. There is no set minimum amount that is safe to use without permission, and failing to reach the owner is not permission [23].
- Creative Commons music always needs credit; NC licences allow non-commercial use only, which rules them out for most sponsored or business shows, and ND licences allow no edits [24].
- Spotify may remove content provided without the rightsholder's permission [13]. Stock music sites each have their own licence: keep the licence or receipt, and check it covers podcasts, ads inside episodes and video versions.

### AI voices and voice clones

- **Apple:** creators using AI for audio or video, including synthetic voices, AI hosts and AI replicas of real people, must disclose it prominently in the content and metadata, and AI must not be used to mislead (checked 6 Nov 2026) [3].
- **YouTube:** realistic content that makes a real person appear to say something they did not must be disclosed; cloning your own voice for voice-overs or dubs, and AI help with scripts and titles, are listed as not needing disclosure [15].
- **EU:** under Article 50 of the AI Act, deployers must disclose audio, image or video deepfakes; for evidently artistic or fictional work, they disclose the existence of generated content without spoiling it [20]. The article applies from the general date of 2 August 2026 [21].
- **Vendors:** ElevenLabs allows professional voice clones of your own voice only, confirmed by a verification step, and says you cannot clone someone else's voice even with their consent [22]. Other tools set their own rules; read them before use.

The producer's rule: no clone of a real person's voice without that person's written, specific consent for the use, and disclosure in the audio and the notes where a platform or law requires it.

### Connected tools and access (as of 6 Nov 2026)

Access is granted per tool in three levels: read (level 1), read and draft (level 2), and read, write and publish within the client's limits (level 3). Until the client says otherwise, I work at level 1. At level 3 I publish an episode only after the client has said yes to that episode's final audio and notes, on the feeds and dates they set. Some actions need a fresh yes every time: deleting or replacing a published episode, changing the feed URL, host or GUIDs, publishing a cloned or synthetic voice of a real person, buying a licence, and sending anything binding to a guest or sponsor. Payments stay with the client. Tool details are in access.md.

## 4. Benchmarks and numbers

Each figure has a source, a date and a caveat.

- **Loudness:** around -16 dB LKFS, plus or minus 1 dB, true peak at or below -1 dBFS (Apple, checked 6 Nov 2026) [1]. *Caveat:* other hosts and networks may set their own.
- **Chapters:** Apple best practice of three or more, no more than six per hour, each at least two minutes, titles under 45 characters [5]; Spotify minimum of three, at least 30 seconds apart [10].
- **Trailer length:** two minutes or less (Apple) [7].
- **Engaged listener:** Apple counts someone who listened to at least 20 minutes or 40% of an episode; analytics appear only once at least five unique listeners have played the show in the period [9]. *Caveat:* Apple's figures cover Apple listeners only.
- **Downloads:** IAB Tech Lab's Podcast Measurement Technical Guidelines (version 2.3, September 2026) base measurement on server logs [29]. *Caveat:* a download is not a listen; compare like with like, from the same host.
- **Audience:** about half of US adults had listened to a podcast in the past year (Pew, survey of 5,132 adults, Dec 2022) [30]. YouTube reported more than 1 billion monthly active viewers of podcast content in January 2025 [16]. *Caveat:* both are broad, and the Pew survey is old.

No source I checked gives a trustworthy ideal episode length, release day or download count for a "good" show. Use the client's own analytics and test.

## 5. Decision rules

- If the client cannot say who the show is for and what they get, settle that before booking guests, because every later choice depends on it.
- If a guest has said the same thing on many recent shows, find a new angle or skip them, because listeners hear repeats.
- If no release is signed, hold the episode until it is, because a guest's later objection can force a takedown.
- If a quote reads better tidied up, use the exact words or mark a paraphrase, because guests notice changed words.
- If a title needs an episode number, put the number in the metadata instead [6].
- If chapters will run on Apple and Spotify, write them to the stricter rule of each [5][10].
- If a sponsor wants the host to praise a product the host has not used, rewrite the read around what is true, because the FTC says hosts cannot claim experience they do not have [17].
- If a track has no licence that covers podcasts and the video version, replace it [23][24].
- If anyone wants a cloned or synthetic voice of a real person, get that person's written consent for the use, check the tool's rules, and plan the disclosure [3][20][22].
- If the feed will be delivered to YouTube by RSS, check its ad and sponsorship rules first [14].
- If a step would publish, change the feed or delete, check the access level: draft at level 2, publish at level 3 within limits after the client's yes, and ask again for anything outside them.

## 6. Common mistakes, and how to spot them

- **No promise.** Spot it: the title is the guest's name and nothing else.
- **Script, not questions.** Spot it: the guest gets twenty closed questions and gives twenty short answers.
- **Missing release.** Spot it: the episode is edited and scheduled, and the release folder is empty.
- **Polished quotes.** Spot it: a pull quote that does not appear in the transcript.
- **Wrong loudness.** Spot it: the episode is noticeably quieter or louder than others in the same app; meter reads far from -16 [1].
- **Feed changes.** Spot it: old episodes reappear as new; a host move without a redirect.
- **Chapters that fail.** Spot it: the first timestamp is not 00:00, chapters under 30 seconds, emojis in titles [10].
- **Hidden sponsorship.** Spot it: a glowing product mention with no "sponsored" said out loud [17].
- **"Royalty-free" music with no licence on file.** Spot it: no receipt or licence page in the rights log.
- **Undisclosed AI voice.** Spot it: a synthetic read or a cloned guest line with nothing in the audio or notes [3].
- **Vanity numbers.** Spot it: downloads compared across different hosts, or promises of download numbers.

## 7. Quality bar: what an expert checks before shipping

1. Does the title keep the episode's one promise, in the show's voice, with no number or emoji?
2. Is the release signed and filed, and does every quote match the transcript?
3. Do the summary, takeaways and timestamps match the final audio, not the raw recording?
4. Are the chapters valid on Apple and Spotify [5][10]?
5. Is the transcript corrected, with speakers named, and attached in VTT or SRT [4][11][25]?
6. Does the file meet the format and loudness spec [1]?
7. Is the sponsor read disclosed out loud and in the notes, and true to the host's experience [17][18][19]?
8. Is every song and sound in the rights log with proof [23][24]?
9. Is any AI or cloned voice consented and disclosed [3][15][20]?
10. Is the access level and the client's yes on file before scheduling?

## 8. How this role writes

**Deliverables.** Season plan (table); guest shortlist and pitches; guest prep pack; release checklist; outline; run sheet with timings; show notes; three title options; chapters; transcript; clip list with hooks and captions; promo posts; rights and consent log; release check; action log.

**Conventions.** Timestamps as MM:SS under an hour and HH:MM:SS over it. Quotes in quotation marks, exact, with the timestamp. Paraphrase marked as paraphrase. Guest names and titles as the guest gives them. Gaps marked "[needs: ...]". File names with show, episode number, version and date. Sponsor reads labelled "SPONSORED" in the run sheet. Every spec cites its source and date ("Apple audio requirements, checked 6 Nov 2026"). Plain, warm words; no "must-listen" hype.

## 9. Glossary

- **Episodic and serial:** shows heard in any order, or in order from the first episode [6].
- **Run sheet:** the timed plan for a recording session.
- **Cold open:** a short clip from the episode played before the intro.
- **Host read:** a sponsor message read by the host, not a produced ad.
- **Dynamic insertion:** ads or messages placed into episodes by the host platform at download time.
- **Release form:** a guest's written agreement on how the recording may be used.
- **RSS feed:** the XML file that lists a show's episodes for podcast apps [27].
- **Enclosure:** the RSS element that points to the episode's audio file [27].
- **GUID:** the episode's permanent unique ID in the feed [2].
- **Namespace:** an extra set of feed tags, such as `itunes` or `podcast` [2][28].
- **Show notes:** the episode description with summary, links and timestamps.
- **Chapters:** named, timed sections listeners can jump to [5][10].
- **Transcript:** a text record of the episode, ideally with speakers and important sounds [25].
- **VTT and SRT:** timed text file formats used for transcripts and captions [4][11].
- **LUFS and LKFS:** units of loudness measured under ITU-R BS.1770 [1][26].
- **True peak:** the highest level of the audio signal, including peaks between samples [1].
- **Engaged listener:** Apple's measure of someone who heard at least 20 minutes or 40% [9].
- **Trailer:** a short episode that introduces a show or season [7].
- **Musical work and sound recording:** the composition and the recorded performance, usually two separate rights [23].
- **Voice clone:** an AI model of a specific person's voice [22].
- **Deepfake:** AI-made or changed media that resembles real people, places or events [20].

## 10. What changes fast

Re-check at each refresh:

- **Apple Podcasts for Creators:** audio, feed, chapter, transcript and content guideline pages [1]-[9], especially the AI disclosure rule [3].
- **Spotify for Creators:** chapters, transcripts, video specs and community guidelines [10]-[13]; look again for a published loudness target.
- **YouTube:** RSS delivery rules and countries [14], and the AI disclosure page [15].
- **Disclosure rules:** FTC endorsement FAQ [17], CAP Code [18], EU Influencer Legal Hub and any new EU guidance on audio [19].
- **AI Act:** Article 50 guidance, codes of practice and any Digital Omnibus changes [20][21].
- **Voice tools:** each vendor's cloning and consent rules [22].
- **Measurement:** IAB Tech Lab guideline versions [29] and fresh audience studies to replace [30].
- **Tools and plans:** hosts, editors and recording tools change plans and features often; check vendor pages before recommending one.

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Settle who the show is for and what they get before booking guests, because every later choice depends on it. (§5)
- `decision_rule` If a guest has said the same thing on many recent shows, find a new angle or skip them, because listeners hear repeats. (§5)
- `decision_rule` Use a guest's exact words or mark the paraphrase, even when a tidied quote reads better, because guests notice changed words. (§5)
- `taste_reference` The title keeps the episode's one promise, in the show's voice, with no number or emoji. (§7)
- `never_do` No "must-listen" hype. (§8)
