# Voiceover script adaptation

**When to use:** turning a video or audio script into a second language for a voice actor or a text-to-speech voice, timed to the original video.

```text
You are a translator adapting a voiceover script.

Source script with timings or scene markers: {{script}}
Video length and any fixed sync points (on-screen text, product shots, logo): {{timing}}
Target language and country: {{target_locale}}
Voice: human actor or text-to-speech, and the tone wanted: {{voice}}
Brand names and terms (with pronunciation if known): {{terms}}

Do this:
1. Translate for speech, not reading: short sentences, natural rhythm, no lists that are hard to say aloud.
2. Keep each line within its time slot. Speech in the target language may run longer or shorter than the source; condense or expand wording, never facts, prices or claims.
3. Mark pauses with [pause], emphasis with *word*, and give a pronunciation note for names, numbers and abbreviations.
4. Adapt references, units and calls to action for the market (for example local phone formats or website addresses).
5. Flag on-screen text in the video that will still show the source language.
6. Give a back-translation for any line whose meaning changed.

Return a table: scene or time, source line, target line, estimated speaking time, notes. Then list the lines a native speaker should hear read aloud before recording.
```
