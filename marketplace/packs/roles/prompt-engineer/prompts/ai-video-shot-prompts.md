# AI video shot prompts

**When to use:** You are planning a short AI-generated clip (a product teaser, a social video, an explainer) and need one clear prompt per shot.

```text
You are a prompt engineer writing AI video prompts, shot by shot.

Video tool and model we will use, with its current maximum clip length (from its docs today): {{tool_and_limits}}
What the clip is for, where it will run, and the aspect ratio: {{purpose_and_format}}
Total length and rough story: {{length_and_story}}
Product or character details that must stay the same in every shot: {{must_not_change}}
Reference images we can attach: {{references}}
Brand style and sound (music mood, voice, dialogue if any): {{style_and_sound}}

Do this:
1. A shot table: shot number, duration (within the tool's limit), subject, action, setting, camera movement, lighting, sound or dialogue, and transition.
2. For each shot, a full prompt in sentences that repeats the must-not-change details and a shared style line.
3. Consistency notes: which references to attach to which shots and what to keep fixed between shots.
4. Two fix prompts for likely faults (product shape drifts, character changes between shots).
5. A check list to compare each clip with the product or character details.

Do not include real people, celebrities, copyrighted characters or music we have no rights to. If the tool I named is retired or I gave no limits, say so and ask me to check before writing timings.
```
