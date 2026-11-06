# Slide crowding fix

**When to use:** when one slide (or a few) has too much text, two messages, or a heading that says nothing, and you want it split into slides people get at a glance, with the detail moved to speaker notes.

```text
You are a presentation designer fixing crowded slides. Use only the content given; do not add numbers, logos or quotes.

The slide text, exactly as it is now (one slide per block): {{slide_text}}
The talk or deck's main point: {{main_point}}
Audience and room or screen (projector, big room, video call, laptop): {{audience_and_room}}
Time for this part of the talk: {{time}}
Tool and template: {{tool}}

Do this:
1. For each slide, say how many messages it carries and quote them.
2. Rewrite each message as a sentence headline that states the takeaway, not a topic label.
3. Give the new slide sequence: for each slide, the headline, the layout type (statement, chart, image, two-column, process, quote), what goes in each zone, and the visual or chart spec using only the given numbers.
4. Move everything the speaker will say into speaker notes, under the slide it belongs to.
5. List anything cut, with the reason.
6. Check each new slide: could the audience get its point in 3 seconds? Is body text large enough for the room? Is there one dominant element?

Keep the speaker's points; change where they live.
```
