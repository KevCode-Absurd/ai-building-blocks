---
name: episode-release-check
description: Checks a podcast episode before it goes live and then publishes it within the client's limits - file format and loudness against Apple's dated spec, feed basics (enclosure, GUID, dates, escaping), metadata and explicit flag, signed release, music and sound licences, sponsor read disclosure for the US, UK and EU, AI voice consent and disclosure, transcript and chapters - then drafts, schedules or publishes at the access level granted. Use before every release, when moving host, or when a platform rejects an episode.
---

# Episode release check

Most podcast problems are found after release, when they are hardest to fix: a quiet file, a missing disclosure, a song with no licence, an old episode that reappears as new. This skill runs one check before anything goes out and then publishes only within the limits the client set.

## When to use

- An episode is edited and its notes are ready.
- The client is moving to a new host or setting up YouTube RSS delivery.
- A platform has rejected an episode or flagged a problem.
- A new show is about to launch its trailer and first episodes.

## What you need

**Access:**
- Level 1: read the final file, the feed, the host settings and the rights folder; I report and fix nothing live.
- Level 2: upload the file and save the episode with notes, chapters and transcript as a draft or private.
- Level 3: publish or schedule the episode on the shows, feeds and dates the client set, after the client's yes on this episode's final audio, title and notes.
- Fresh yes every time: deleting, unpublishing or replacing a published episode's audio; changing the feed URL, host, redirect or any GUID; publishing a cloned or synthetic voice of a real person; buying a licence.

You also need:
- The final audio (and video, if any), the show notes package, the transcript.
- Signed release forms, music licences or receipts, sponsor agreement and approved read.
- Written consent for any AI voice, and the AI tool used.
- The client's release date, time and time zone.

## Steps

1. **File format.** For RSS audio Apple accepts MP3 or AAC and strongly recommends AAC; stereo at 44.1 or 48 kHz sits at 128 to 256 kbps, mono at 64 to 128 kbps (Apple audio requirements, checked 6 Nov 2026). Note the file's format, sample rate, bit rate and channels. Video versions for Spotify: MP4, H.264 or H.265, 16:9 with no added borders, AAC-LC stereo audio (Spotify video specs, checked 6 Nov 2026).
2. **Loudness.** Measure integrated loudness and true peak with a BS.1770 meter (most editors and Auphonic have one). Apple's target is around -16 dB LKFS, plus or minus 1 dB, with true peak at or below -1 dBFS, applied before encoding. If the file is far off, send it back to the editor or, at level 2, process it to target as a draft. A broadcast mix at -23 LUFS will sound quiet in podcast apps.
3. **Listen.** Spot-check the start, every edit point, the sponsor read and the end. Note clicks, level jumps, repeated lines and dead air with timestamps.
4. **Feed basics.** Confirm the episode has a unique enclosure URL with correct length and type, a GUID that will never change, a date in RFC 2822 format, ASCII-only file names, and correctly escaped special characters. Confirm season and episode numbers sit in their fields, not the title. Mark explicit content with the explicit tag.
5. **Release form.** Confirm every guest's signed release is on file and covers the platforms and formats used. If not, hold the episode and tell the client.
6. **Music and sound.** For every track, sound effect and sample, record the source, the licence, what it allows (podcast, ads, video versions, term, territory, credit) and the proof. Remember that a commercial recording usually needs two permissions: the composition and the recording. Creative Commons NC music is not for sponsored or business shows; ND music cannot be edited. No proof, no use: replace the track.
7. **Sponsor read.** Check the read opens with a plain spoken disclosure ("This episode is sponsored by..."), says nothing the host has not experienced, uses only the sponsor's approved facts, and is labelled in the notes. US: FTC endorsement rules; UK: the CAP Code's rule that marketing is obviously identifiable; EU: disclosure under consumer law. If the episode will be delivered to YouTube by RSS, check YouTube's rule on ads and sponsorship declarations first.
8. **AI voices.** If any synthetic voice, AI host or AI replica of a real person is used: confirm the person's written consent for this use, confirm the tool's terms allow it (some tools only allow cloning your own voice), and add disclosure in the audio and the notes. Apple requires disclosure in content and metadata; YouTube requires it for realistic content that makes a real person appear to say something they did not; in the EU, Article 50 of the AI Act requires deployers to disclose audio deepfakes from 2 August 2026.
9. **Notes, chapters, transcript.** Confirm the show-notes-and-transcript output is attached and matches the final edit.
10. **Publish at the level granted.**
    - Level 1: hand over a release checklist and the files for the client to upload.
    - Level 2: upload and save as draft or private with everything attached.
    - Level 3: show the action list (show, episode, date, time, time zone, platforms) and get the client's yes on this episode, then publish or schedule. Check the episode appears correctly on each platform after the next feed refresh.
11. **Log and report.** What was checked, what was fixed, what was published where and when, and anything still open.

## Checks

- Format and loudness meet the dated spec, or the gap is reported.
- Release on file for every voice on the episode.
- Every track has a licence and proof; credits added.
- Sponsor disclosure spoken and written.
- AI voice consent on file and disclosure in audio and notes.
- No GUID or feed URL changed without a fresh yes.
- Published only within the client's limits and after their yes on this episode.

## Output format

1. Release checklist table: item, status (pass, fixed, blocker), note, source and date checked.
2. Rights and consent log.
3. Listen notes with timestamps.
4. Action plan or action log, by access level.
5. Open items for the client.

## Example of good output (short)

*Corner Shop Stories is a made-up show used only to show the format.*

| Item | Status | Note |
|---|---|---|
| Format | Pass | AAC, 48 kHz, stereo, 160 kbps (Apple, checked 6 Nov 2026) |
| Loudness | Fixed | Was -21.4 LKFS; processed to -16.1, true peak -1.3 dBFS, saved as draft |
| Release | Blocker | Co-host signed; guest form missing. Episode held |
| Music | Pass | Intro bed licence on file, covers podcast and video; credit added |
| Sponsor read | Fixed | Added "This episode is sponsored by..." before the read at 14:02 |
| AI voice | Not used | |
| Chapters | Pass | Four chapters, first at 00:00 |

**Next step:** once the guest's release arrives, I will schedule for Tuesday 7:00 UK time on the main feed, as agreed. I will confirm here before I do.
