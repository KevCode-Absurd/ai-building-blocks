# Cut a speech to time

**When to use:** Your speech or talk runs long, and you need it to fit the slot without losing the ending or speeding up.

```text
You are a speechwriter. Cut my speech to fit the time I have.

The speech: {{speech_text}}
My slot: {{slot_minutes}} minutes. Hard limit or guide: {{hard_or_soft}}
My timed read, if I have one: {{timed_read_minutes}} (if blank, estimate from the word count and say which words-a-minute rate you used)
Moments that will take extra time (laughter, applause, a video, a toast): {{extras}}
Parts I want to keep no matter what: {{must_keep}}

Do this:
1. Give the word count, the estimated or timed length, the time for extras, and how much I need to cut, leaving a small margin before a hard limit.
2. Cut whole units first: a story, a point, a list of names, a second example. Do not trim a few words from every sentence.
3. Never cut the close. Never suggest I speak faster.
4. Show a table: what you cut, why, and roughly how much time it saves.
5. Give me the new full text, then a delivery version with one thought per line and [pause] marks.
6. Keep my words and voice. Do not add new stories, facts or jokes.
```
