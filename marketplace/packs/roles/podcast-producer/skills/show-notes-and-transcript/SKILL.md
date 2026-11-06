---
name: show-notes-and-transcript
description: Turns a recorded episode's transcript into everything a listener sees - three title options from the guest's own words, a short summary, takeaways, timestamps, chapters that pass both Apple's and Spotify's rules, a corrected VTT or SRT transcript with speakers named, links, sponsor and AI disclosures, and clip picks with hook lines and captions. Use after every recording, or to fix weak notes on old episodes.
---

# Show notes and transcript

Listeners decide in seconds whether to press play, and they skip around once they do. This skill finds the best moments first, then builds notes, chapters and a transcript that help people choose, find and quote the episode accurately.

## When to use

- An episode is recorded and edited, and needs its notes, chapters and transcript.
- Old episodes have thin notes or no chapters.
- The client wants clips and posts from an episode.

## What you need

**Access:** level 1 to read the transcript, audio timestamps and past notes. Level 2 to save notes, chapters and the transcript file on a draft episode in the host or editor (for example a draft in Spotify for Creators, Buzzsprout or a Descript project named "DRAFT"). Level 3 to update the notes, chapters or transcript of a published episode within the client's limits; the episode-release-check skill covers publishing a new episode.

- The transcript of the **final edit**, not the raw recording. If only the raw transcript exists, I ask for the edit's cut list or new timestamps.
- Show name, audience and tone; three past notes the client likes.
- Guest name, title, links and how they want to be described.
- Links mentioned, sponsor details and approved sponsor wording.
- Whether any AI voice or synthetic audio is in the episode.

## Steps

1. **Read the whole transcript.** Mark the three to five best moments with their timestamps: a story, a surprising line, a practical tip, a strong opinion.
2. **Write the promo line first.** One line built on the single best moment. It forces the choice of what the episode is really about.
3. **Titles.** Write three options that keep the episode promise, at least one in the guest's own words. No episode number (it belongs in metadata), no emojis, no repeated titles, nothing misleading or stuffed with keywords; Apple's search and content guidance says the same (checked 6 Nov 2026).
4. **Summary.** Two or three sentences: who, what problem, what the listener gets. The first line must work alone, because apps cut descriptions short.
5. **Takeaways.** Three to five short, usable lines. Each must be something actually said in the episode.
6. **Chapters.** Write them to pass both platforms:
   - first chapter at 00:00 (00:00:00 for Apple's description format);
   - at least three chapters, in time order;
   - each at least two minutes long and no more than six per hour (Apple best practice), which also clears Spotify's 30-second minimum;
   - plain-text titles under 40 characters (Spotify's recommendation, inside Apple's 45) and ideally fewer than five words;
   - no emojis or HTML.
   Put them in the description as `(MM:SS) Title` lines, or hand them to the host's chapter tool. Apple and Spotify both make automatic chapters for some English episodes; the client's own chapters replace them.
7. **Transcript.** Correct the automatic transcript against the final audio: names, terms, numbers, speaker labels. Mark important sounds in square brackets ([laughter], [music]). Export VTT if the host supports speaker names, otherwise SRT; Spotify accepts files up to 5MB with timestamps. Keep the file the host publishes through the feed's transcript tag. Never "improve" what someone said.
8. **Links and credits.** Every link mentioned, checked that it works. Guest links as the guest gave them. Credits for music with the credit line its licence requires.
9. **Disclosures.** If sponsored, say so near the top of the notes ("Sponsored by..." or "Paid partnership with..."). If the episode uses AI voices, synthetic hosts or AI replicas of real people, say so in the notes too; Apple requires disclosure in content and metadata.
10. **Clips.** Pick three moments that make sense without context, each under the length the target platform allows. For each: in and out times, the hook line (exact words), on-screen caption text, and a post for each platform.
11. **Call to action.** One: follow, review, join the newsletter, or book a call. Not five.

## Checks

- Every quote and takeaway appears in the transcript, word for word for quotes.
- Timestamps match the final edit.
- Chapters meet both platforms' rules.
- Transcript names every speaker and is corrected against the final audio.
- Sponsor and AI disclosures are present where needed.
- Links work; nothing points to a page the client has not approved.
- The first line of the summary works on its own.

## Output format

1. Best moments (timestamp, what happens, why it matters).
2. Three titles, with the recommended one first.
3. Show notes: summary, takeaways, chapters, links, credits, disclosures, call to action.
4. Transcript file (VTT or SRT) and a list of corrections made.
5. Clip list: in, out, hook line, caption, post per platform.

## Example of good output (short)

*Fieldwork is a made-up gardening business podcast, and Priya Shah a made-up guest. All details are invented.*

**Titles**

1. "Nobody buys a plant, they buy the Sunday after" (guest's words at 23:10)
2. How one nursery doubled repeat visits with a planting card
3. Selling plants people keep alive

**Summary:** Nursery owner Priya Shah explains why most plants sold in spring are dead by summer, and the free planting card that changed how often her customers come back. If you sell anything that needs care after purchase, this one is for you.

**Chapters** (40-minute episode, so four chapters at most)

```text
(00:00) Why plants die
(09:30) The planting card
(23:10) The Sunday after
(31:40) Her next steps
```

**Disclosure line:** Sponsored by Greenhand Tools. Priya was not paid for her appearance.

**Clip 1:** 23:10 to 23:52. Hook: "Nobody buys a plant, they buy the Sunday after." Caption on screen: "What customers really buy".
