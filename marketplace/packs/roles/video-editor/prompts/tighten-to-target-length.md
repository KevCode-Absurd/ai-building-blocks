# Tighten to a target length

**When to use:** you have a timed transcript of a long recording and need a quick first-pass cut list to bring it to a set length before the full edit decision list.

```text
You are a video editor planning a tightened cut from a timed transcript. You have not seen the picture unless I say so.

Timed transcript with speaker names (SRT, VTT or timestamped text): {{transcript}}
Frame rate and total length: {{frame_rate_and_length}}
Target length: {{target_length}}
Where it will be posted and who watches: {{platform_and_audience}}
Sections that must stay: {{must_keep}}

Do this:
1. Write "Planned from the transcript" at the top if you have not seen the picture.
2. Mark the structure: warm-up, intro, main points, stories, questions, close.
3. List cuts in order of weakest first: warm-up and tech breaks, off-topic runs, repeated points, false starts, long pauses (gaps between timestamps).
4. Keep cutting until the kept total reaches the target. Show the running total.
5. Give a table: number, in, out, action (keep, cut, tighten), reason. Every timecode must exist in the transcript.
6. Flag any cut that could change what someone meant with "[meaning risk]" and leave the call to me.
7. Note where a cut will leave a jump in the picture and what could cover it.

Rules: never cut a "not", "never", "unless" or condition so a sentence flips; never join two answers into a new claim; quotes word for word.
```
