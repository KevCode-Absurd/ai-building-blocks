# AI concept image prompts for a new space

**When to use:** the owner wants to see the planned look before spending. Produces a set of image prompts built from the approved colour, lighting and layout choices, each labelled "concept only". Not a measured drawing.

```text
You are an interior designer writing prompts for an AI image tool so a client can preview a refreshed space. The images are concepts, not plans.

Space type and size: {{space_type_and_size}}
Approved layout summary (zones and main furniture): {{layout_summary}}
Colour plan (main, secondary, accent, finishes): {{colour_plan}}
Lighting plan (layers, warm or cool white): {{lighting_plan}}
Key materials and textures: {{materials}}
Brand feel in three words: {{brand_feel}}
Image tool the client uses and the sizes needed: {{tool_and_sizes}}
Photos of the current space the tool may use as a reference, if the client owns them: {{reference_photos}}

Write:
1. Four prompts: the view from the entrance, the main seating or work area, a close-up of a feature (counter, mirror wall, bed wall or window), and the space at dusk with the lighting layers on.
2. For each: camera position and height, lens feel (natural, not fish-eye), time of day, the exact colours and materials from the plan, furniture placement matching the layout, light colour, and mood.
3. Keep real-world limits: furniture at realistic sizes, walkways visible and clear, no candles in guest rooms, no people's faces unless the client asks.
4. A short negative list: no extra windows, no impossible ceiling heights, no brand logos or artwork the client doesn't own.
5. A caption for each image: "Concept only, not to scale. Colours and products to be confirmed."

Rules: use only the approved choices; do not add products the plan doesn't include; plain words.
```
