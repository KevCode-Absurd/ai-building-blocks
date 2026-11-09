---
name: training-video-script-and-captions
description: Writes training and how-to video scripts that teach one task per video in under 6 minutes - a two-column script with narration beside what is on screen (screen, click, zoom, callout or camera view), start times, warnings from the client's SOP placed before the step they cover, visual information written into the narration so no separate audio description is needed, a recording list, three check questions, a transcript, and a caption file (WebVTT or SRT) built from the final narration with short, readable lines. Use it for software screen recordings, procedure demos filmed on a phone, customer academy tutorials and video segments inside e-learning. Uploads captions or publishes videos only with level 3 access.
---

# Training video script and captions

## When to use

- A task needs showing, not telling: clicks in a system, a hands-on procedure, a product feature.
- A long SOP or help article should become a short series of videos.
- A video exists but has no captions or transcript.
- An e-learning module needs a short demo clip.

Do not use it for marketing videos or ads, to write new safety warnings (they come from the client's SOP and expert), or to describe software or machines the client has not described.

## Access needed

- **Level 1 (read):** the SOP, help article or click path, screenshots described in words, existing videos and their transcripts.
- **Level 2 (read and draft):** create the script and caption file in the client's documents or video tool as a draft; set up a draft project in the client's video editor if it has an official connector.
- **Level 3 (read, write and publish):** upload the approved caption file to the agreed video, and publish or replace the approved video in the agreed channel or course, within the client's limits. Publishing to a public channel or a new audience needs a new yes. Log every action.

## What you need

1. The steps, with exact button, menu or tool names.
2. Who watches, on what device, and what they must do afterwards.
3. Length wanted, and whether it is a screen recording, filmed on a phone, or both.
4. Any warnings from the SOP, word for word.
5. The platform where the video will live, and which caption format it accepts.
6. Whether an AI voice or avatar will be used.

## Steps

### 1. Set one goal per video

"After this video, a receptionist can reschedule an appointment and send the confirmation." If the steps need more than about 6 minutes, split into a series.

### 2. Write each step as one action

Use the exact names the client gave. Anything you cannot confirm: [check on screen].

### 3. Plan the scenes

One step per scene. Open by saying what viewers will learn, in under 15 seconds. Close with a recap of the steps and where to find help.

### 4. Write the two-column script

| Time | Narration | On screen |
|---|---|---|

Narration in short spoken lines, second person. On screen: which screen, the click, a zoom or callout, or the camera view for filmed tasks. Say what is shown ("click Save, the green button at the bottom right") so viewers who cannot see the screen still follow, and the video needs no separate audio description.

### 5. Place warnings

Each SOP warning goes before the step it covers, both said and shown on screen, word for word.

### 6. Time it

Read the narration aloud with a timer and add start times. Cut or split if it runs long. Leave a beat after each click for the screen to change.

### 7. Write the recording list

Screens to capture or shots to film, in order, with any test data to set up first (made-up data only).

### 8. Write three check questions

Task-based, with answers, for the end of the video or the course page.

### 9. Build the transcript and captions

From the final narration (re-check against the recorded audio):
- **WebVTT:** a `WEBVTT` header line, a blank line, then cues with `start --> end` times in `hh:mm:ss.ttt`.
- **SRT:** numbered cues with start and end times; use it if the platform asks for SRT.
- Keep each caption to one or two short lines; as a reference, Netflix's English style allows up to 42 characters per line and two lines. Break lines at natural phrase breaks. Add important sounds in square brackets, such as [alarm beeps].
- Provide the transcript as text beside the video.

### 10. AI voice or avatar

If the video uses a synthetic voice or an AI avatar, say so on screen and in the description, and get the client's written OK for any likeness of a real person. For EU audiences, transparency rules apply from August 2026; check details with the client's lawyer.

## Checks

- One goal per video; under about 6 minutes, or split.
- Every step and name matches the client's material, with [check on screen] where unconfirmed.
- Warnings word for word, before their step.
- Narration describes what is shown.
- Timings add up.
- Caption cues match the final audio, lines are short, sounds are labelled, and the format suits the platform.
- Transcript provided.
- AI use disclosed where used.
- At level 3, only the agreed videos were changed, and the log is updated.

## Output format

1. Goal, audience, length.
2. Two-column script with start times.
3. Recording list.
4. Check questions with answers.
5. Transcript.
6. Caption file (WebVTT or SRT).
7. Confirm with your team.

## Example of good output (short)

*Illustrative structure, not a real business: a physio clinic's front desk, with the video "Reschedule an appointment", a screen recording with voiceover only. Copy the shape, never the content: every fact comes from the client's own context.*

> | Time | Narration | On screen |
> |---|---|---|
> | 0:00 | "In two minutes, you'll move a booking to a new time and send the patient a confirmation." | Calendar view, today's date |
> | 0:08 | "Click the appointment you're moving. It opens on the right." | Click 10:30 slot; side panel opens |
> | 0:15 | "Click Reschedule, the grey button under the patient's name." | Zoom on Reschedule button |
>
> ```
> WEBVTT
>
> 00:00:00.000 --> 00:00:04.000
> In two minutes, you'll move a booking
> to a new time
>
> 00:00:04.000 --> 00:00:07.500
> and send the patient a confirmation.
> ```
