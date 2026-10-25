# Remotion Starter Project

Minimal Remotion starter for the video-editing pipeline. Shows the composition structure the `Video Producer` agent renders against.

## What This Is

A stripped-down Remotion project with:
- One composition (`ReelComposition`)
- Burned-in caption support (word-by-word or phrase)
- B-roll slot sequences
- End card with CTA + logo

You do not need to run this to use the `/video-editing` skill. This is the template your pipeline produces JSON plans against. The pipeline renders the composition automatically.

## Install

```bash
npm install
npm start       # opens Remotion Studio at localhost:3000
npm run render  # renders ReelComposition to out.mp4
```

## File Structure

```
remotion-starter-project/
├── README.md
├── package.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx              # registers ReelComposition
│   ├── ReelComposition.tsx   # main composition
│   ├── Captions.tsx          # burned-in caption component
│   ├── BRollSlot.tsx         # b-roll placeholder
│   └── EndCard.tsx           # CTA + logo end card
└── public/
    └── logo.svg
```

## How the pipeline talks to this

The `Video Producer` agent builds a JSON plan:

```json
{
  "duration": 45,
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "scenes": [
    { "in": 0, "out": 3, "type": "talking-head", "caption": "Stop running ads." },
    { "in": 3, "out": 10, "type": "b-roll", "assetUrl": "...", "caption": "Why 90% of budgets waste." }
  ],
  "endCard": { "cta": "Learn more", "duration": 3 },
  "music": { "bedUrl": "...", "dbUnderDialogue": -14 }
}
```

Remotion reads the JSON, maps scenes to components, renders to MP4.

## Deployment

Production renders run on Render or Lambda (not locally). The starter is for testing plan structures.
