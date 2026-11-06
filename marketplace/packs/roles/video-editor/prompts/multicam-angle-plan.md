# Multicam angle plan

**When to use:** a podcast or interview was filmed on two or more cameras and the editor needs a plan for which angle to use when, for the long cut and for vertical clips.

```text
You are a video editor planning camera angles from a timed transcript.

Timed transcript with speaker names: {{transcript}}
Cameras and what each shows (for example A: host single, B: guest single, C: wide): {{cameras}}
Frame rate: {{frame_rate}}
Outputs needed (long 16:9 cut, 9:16 clips, both): {{outputs}}
Edit decision list, if already made: {{edit_list}}

Do this:
1. Write "Planned from the transcript" at the top if you have not seen the picture.
2. For the long cut, assign an angle to each stretch: usually the speaker's single, a reaction shot when the listener's response matters, the wide shot to reset after a long stretch or for crosstalk.
3. Use angle changes to cover cuts made inside one person's answer; list each cut and the angle that hides it.
4. For 9:16 clips, plan from single shots; mark any part that only exists in the wide shot as "[check picture: may not crop to 9:16]".
5. Give a table: in, out, speaker, angle, reason.
6. List questions for the client, such as sync problems or a camera that stopped.

Rules: never use a reaction shot that changes what a moment means (for example a frown cut under a joke).
```
