# Optional craft reference

This is example vocabulary and house guidance, not a promise of tool behavior. The main skill and user brief take priority. Verify current model-specific syntax or limits before use.

# Nano Banana Pro — Reference Examples

## Generation Example: Track Sprinter

### Input
Image analysis of female sprinter in victory pose on track

### Plain Language Output

```
Cinematic film still,
EFFECT TYPE: ultra-wide angle distortion portrait,

CAMERA POSITION: extreme low angle from track level | DIRECTION: shooting upward into subject's face,

SUBJECT: female sprinter, athletic build, cornrow braids pulled back tight
ACTION: frozen mid-victory scream | BODY POSITION: torso lunging toward camera, arms tensed,
CLOTHING: orange athletic tank top, black compression shorts | ACCESSORIES: massive iced-out Cuban link chain with diamond pendant, magenta mirrored sport sunglasses, silver septum nose ring, full diamond grillz top and bottom, visible arm tattoos | MOVEMENT: frozen mid-celebration lunge,

EXPRESSION: raw triumphant roar, mouth wide open, jaw thrust forward,

PRIMARY LIGHT: harsh midday sun overhead creating glossy sweat sheen across face and chest,
SECONDARY LIGHT: reflected sky light in mirrored lenses | AMBIENT: open blue sky fill,

ATMOSPHERE: sweat droplets on forehead and nose bridge suspended/frozen,

FOREGROUND: distorted chin and Cuban link chain filling lower third,
BACKGROUND: red-brown track surface curving away, stadium light poles, palm tree silhouettes, white cumulus clouds against deep blue sky,

COLOR GRADE: saturated warm with punchy contrast | HIGHLIGHTS: electric blue sky, magenta lens reflections,
SKIN TONE: rich dark with golden sweat sheen | BLACKS: crushed,

ASPECT RATIO: 9:16,

VIBES: Sha'Carri Richardson energy meets trap music video aesthetic meets GoPro extreme sports,
NOT CGI, hyper-realistic.
```

### JSON Output

```json
{
  "prompt_type": "generate",
  "scene": {
    "effect_type": "ultra-wide angle distortion portrait",
    "camera": {
      "position": "extreme low angle from track level",
      "direction": "shooting upward into subject's face",
      "lens_mm": "14-16mm",
      "aperture": "f/8",
      "angle": "dramatic low with barrel distortion"
    }
  },
  "subject": {
    "description": "female sprinter, athletic build, cornrow braids pulled back tight",
    "action": "victory scream",
    "body_position": "torso lunging toward camera, arms tensed",
    "clothing": "orange athletic tank top, black compression shorts with visible waistband",
    "accessories": "massive iced-out Cuban link chain with diamond pendant, magenta mirrored sport sunglasses, silver septum nose ring, full diamond grillz top and bottom, visible arm tattoos",
    "movement": "frozen mid-celebration lunge",
    "expression": "raw triumphant roar, mouth wide open, jaw thrust forward"
  },
  "lighting": {
    "primary_source": "harsh midday sun overhead",
    "primary_effect": "glossy sweat sheen across face and chest",
    "secondary_source": "reflected sky light in mirrored lenses",
    "ambient": "open blue sky fill",
    "direction": "high sun with slight backlight rim",
    "quality": "hard direct light, minimal diffusion"
  },
  "atmosphere": {
    "elements": "sweat droplets on forehead and nose bridge",
    "behavior": "suspended/frozen, catching sunlight"
  },
  "composition": {
    "foreground": "distorted chin and Cuban link chain filling lower third",
    "background": "red-brown track surface curving away, stadium light poles, palm tree silhouettes, white cumulus clouds against deep blue sky",
    "depth_layers": "chain/chin → face → shoulders → track → sky"
  },
  "color": {
    "grade": "saturated warm with punchy contrast",
    "highlights": "electric blue sky, magenta lens reflections",
    "skin_tone": "rich dark with golden sweat sheen",
    "blacks": "crushed",
    "palette": ["electric blue", "orange", "magenta", "gold", "diamond white", "rich brown"]
  },
  "technical": {
    "aspect_ratio": "9:16",
    "realism_note": "NOT CGI, hyper-realistic"
  },
  "vibes": ["Sha'Carri Richardson energy", "trap music video aesthetic", "GoPro extreme sports"],
  "semantic_negatives": "Outdoor track stadium with single athlete, clean composition with no bystanders or text overlays"
}
```

---

## Edit Example: Diamond Grillz to Gold Grillz

### Input
Same sprinter image. Edit request: "Change her teeth from platinum/diamond to 24-karat gold"

### Plain Language Output — Edit

```
Cinematic film still,
EFFECT TYPE: ultra-wide angle distortion portrait,

CAMERA POSITION: extreme low angle from track level | DIRECTION: shooting upward into subject's face,

SUBJECT: female sprinter, athletic build, cornrow braids pulled back tight
ACTION: frozen mid-victory scream | BODY POSITION: torso lunging toward camera, arms tensed,
CLOTHING: orange athletic tank top, black compression shorts | ACCESSORIES: massive iced-out Cuban link chain with diamond pendant, magenta mirrored sport sunglasses, silver septum nose ring, full 24-karat gold grillz top and bottom with warm yellow shine, visible arm tattoos | MOVEMENT: frozen mid-celebration lunge,

EXPRESSION: raw triumphant roar, mouth wide open, jaw thrust forward,

PRIMARY LIGHT: harsh midday sun overhead creating glossy sweat sheen across face and chest,
SECONDARY LIGHT: reflected sky light in mirrored lenses | AMBIENT: open blue sky fill,

ATMOSPHERE: sweat droplets on forehead and nose bridge suspended/frozen,

FOREGROUND: distorted chin and Cuban link chain filling lower third,
BACKGROUND: red-brown track surface curving away, stadium light poles, palm tree silhouettes, white cumulus clouds against deep blue sky,

COLOR GRADE: saturated warm with punchy contrast | HIGHLIGHTS: electric blue sky, magenta lens reflections,
SKIN TONE: rich dark with golden sweat sheen | BLACKS: crushed,

ASPECT RATIO: 9:16,

VIBES: Sha'Carri Richardson energy meets trap music video aesthetic meets GoPro extreme sports,
NOT CGI, hyper-realistic.

---
EDIT NOTES:
ELEMENT: grillz/teeth
CURRENT STATE: platinum/silver diamond-encrusted grillz on top and bottom teeth, white sparkle, icy reflection
TARGET STATE: 24-karat gold grillz on top and bottom teeth, warm yellow metallic shine, smooth polished surface
INTEGRATION: gold should catch the harsh midday sun with warm yellow reflections, complementing the orange tank top and gold tones in the Cuban link chain
```

### JSON Output — Edit

```json
{
  "prompt_type": "edit",
  "edit_mode": "inpaint",
  "preserve": {
    "lighting": true,
    "perspective": true,
    "composition": true,
    "style": true,
    "notes": "Maintain all elements except grillz material/color"
  },
  "changes": [
    {
      "element": "grillz/teeth",
      "current_state": "platinum/silver diamond-encrusted grillz on top and bottom teeth, white icy sparkle, cool-toned reflections",
      "target_state": "24-karat gold grillz on top and bottom teeth, warm yellow metallic shine, smooth polished surface without diamonds",
      "integration_notes": "Gold should catch harsh midday sun with warm yellow reflections, complementing the orange tank top and existing gold tones in Cuban link chain"
    }
  ],
  "scene": {
    "effect_type": "ultra-wide angle distortion portrait",
    "camera": {
      "position": "extreme low angle from track level",
      "direction": "shooting upward into subject's face",
      "lens_mm": "14-16mm",
      "aperture": "f/8",
      "angle": "dramatic low with barrel distortion"
    }
  },
  "subject": {
    "description": "female sprinter, athletic build, cornrow braids pulled back tight",
    "action": "victory scream",
    "body_position": "torso lunging toward camera, arms tensed",
    "clothing": "orange athletic tank top, black compression shorts with visible waistband",
    "accessories": "massive iced-out Cuban link chain with diamond pendant, magenta mirrored sport sunglasses, silver septum nose ring, full 24-karat gold grillz top and bottom, visible arm tattoos",
    "movement": "frozen mid-celebration lunge",
    "expression": "raw triumphant roar, mouth wide open, jaw thrust forward"
  },
  "lighting": {
    "primary_source": "harsh midday sun overhead",
    "primary_effect": "glossy sweat sheen across face and chest",
    "secondary_source": "reflected sky light in mirrored lenses",
    "ambient": "open blue sky fill",
    "direction": "high sun with slight backlight rim",
    "quality": "hard direct light, minimal diffusion"
  },
  "atmosphere": {
    "elements": "sweat droplets on forehead and nose bridge",
    "behavior": "suspended/frozen, catching sunlight"
  },
  "composition": {
    "foreground": "distorted chin and Cuban link chain filling lower third",
    "background": "red-brown track surface curving away, stadium light poles, palm tree silhouettes, white cumulus clouds against deep blue sky",
    "depth_layers": "chain/chin → face → shoulders → track → sky"
  },
  "color": {
    "grade": "saturated warm with punchy contrast",
    "highlights": "electric blue sky, magenta lens reflections, warm gold from grillz",
    "skin_tone": "rich dark with golden sweat sheen",
    "blacks": "crushed",
    "palette": ["electric blue", "orange", "magenta", "24-karat gold", "diamond white", "rich brown"]
  },
  "technical": {
    "aspect_ratio": "9:16",
    "realism_note": "NOT CGI, hyper-realistic"
  },
  "vibes": ["Sha'Carri Richardson energy", "trap music video aesthetic", "GoPro extreme sports"],
  "semantic_negatives": "Outdoor track stadium with single athlete, clean composition with no bystanders or text overlays"
}
```

---

## Style Extraction Example

### Input
3 reference images showing: moody fashion photography with teal shadows, orange highlights, shallow DOF, desaturated midtones, shot on medium format

### Plain Language Style Block

```
STYLE NAME: Moody Fashion Teal-Orange
LIGHTING SIGNATURE: Single key light creating strong directional shadows, minimal fill, warm practicals in background
COLOR PALETTE: teal shadows, orange/amber highlights, desaturated midtones, muted skin tones
TEXTURE/GRAIN: medium format film grain, subtle but present, adds tactile quality
CAMERA LANGUAGE: 80-110mm equivalent | f/2-2.8 | eye-level to slight low | shallow with creamy bokeh
MOOD KEYWORDS: moody, intimate, editorial, cinematic, contemplative
REALISM LEVEL: photorealistic with stylized color grading
```

### JSON Style Block

```json
{
  "style_name": "Moody Fashion Teal-Orange",
  "style_id": "moody-fashion-teal-01",
  "lighting_signature": "Single key light creating strong directional shadows, minimal fill, warm practicals in background",
  "color_palette": ["teal", "orange", "amber", "desaturated midtones", "muted skin"],
  "texture_grain": "medium format film grain, subtle but present",
  "camera_language": {
    "typical_lens": "80-110mm equivalent",
    "typical_aperture": "f/2-2.8",
    "angle_tendency": "eye-level to slight low",
    "dof_preference": "shallow, subject isolation, creamy bokeh"
  },
  "mood_keywords": ["moody", "intimate", "editorial", "cinematic", "contemplative"],
  "realism_level": "photorealistic with stylized color grading"
}
```

---

## Template Field Reference

| Field | Description | Example Values |
|-------|-------------|----------------|
| EFFECT TYPE | Motion/visual treatment | frozen motion, long exposure, tilt-shift, double exposure |
| CAMERA POSITION | Physical camera placement | low angle, overhead, dutch angle, eye-level, crane shot |
| DIRECTION | Where camera points | upward, downward, straight-on, three-quarter |
| SUBJECT | Primary focus with specificity | "female sprinter, athletic build" not "a runner" |
| ACTION | What subject is doing | mid-leap, exhaling smoke, turning head |
| CLOTHING | Specific garments | vintage leather bomber jacket, orange athletic tank |
| ACCESSORIES | Additional items | Cuban link chain, mirrored sport sunglasses |
| EXPRESSION | Emotional state | contemplative with furrowed brow, triumphant roar |
| PRIMARY LIGHT | Main light source + effect | harsh midday sun creating glossy sweat sheen |
| SECONDARY LIGHT | Fill/accent | reflected sky light in mirrored lenses |
| AMBIENT | Environmental light | open blue sky fill, warm interior glow |
| ATMOSPHERE | Particles/effects | sweat droplets, dust motes, cigarette smoke |
| FOREGROUND | Closest elements | distorted chin and chain, out-of-focus flowers |
| BACKGROUND | Distant elements | track surface, cityscape bokeh, empty warehouse |
| COLOR GRADE | Overall color treatment | saturated warm, teal-orange, desaturated cool |
| HIGHLIGHTS | Bright tone color | electric blue sky, warm amber, magenta reflections |
| SKIN TONE | Flesh rendering | rich dark with golden sheen, warm bronze, pale porcelain |
| BLACKS | Shadow treatment | crushed, lifted, deep |
| ASPECT RATIO | Frame dimensions | 16:9, 9:16, 4:5, 2.35:1, 1:1 |
| VIBES | Reference touchstones | "Sha'Carri Richardson meets trap video" |
