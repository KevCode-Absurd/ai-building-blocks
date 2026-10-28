---
name: premium-3d-website
description: Guidelines for building premium 3D websites, focusing on custom WebGL shaders, post-processing, physics-based interactions, smooth animations, preloaders, and device optimization.
category: frontend
risk: safe
source: self
source_type: self
date_added: "2026-06-25"
author: Rsmiyani
tags: [threejs, webgl, shaders, post-processing, creative-coding, premium-design]
tools: [claude, cursor, gemini]
---

# Premium 3D Website

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

This skill provides architectural guidelines and code patterns for developing premium, high-end 3D websites. It targets developers looking to implement advanced WebGL visual effects, custom shader pipelines, interactive physics elements, and immersive page transitions while maintaining high performance.

## When to Use This Skill

- Use when designing premium or award-winning creative websites with 3D elements.
- Use when integrating Three.js, React Three Fiber (R3F), or Spline with custom shaders (GLSL).
- Use when implementing post-processing effects like bloom, depth-of-field, or custom film grain.
- Use when designing interactive preloaders and high-performance asset loading strategies.
- Use when optimizing complex 3D scenes for mobile responsiveness and performance.

If you already have a site or shader code, give it as the codebase and build on it.

## How It Works

### Ordered checklist

Work through these in order. Do each one, check it in the browser, then go on.

1. Create `src/Scene.jsx` (React) or `main.js` (plain Three.js). Run `npm install --save-exact three` (add `@react-three/fiber @react-three/drei` for React), so each package version is pinned in package.json. Check each version on npmjs.com first. Start the dev server with `npm run dev` and check a blank canvas shows.
2. In that file, set up the render loop and resize handler, with the pixel ratio capped at 2 (Step 1).
3. Add `@react-three/postprocessing` (or `EffectComposer`), then add bloom, depth of field or film grain, a few passes at most (Step 2).
4. Create `src/shaders/wavy.js` for any custom GLSL effect and load it as a `ShaderMaterial` (Example 2).
5. Add hover, drag and click motion with springs or a physics library (Step 3).
6. Compress each model with `npx @gltf-transform/cli@[PINNED VERSION] optimize input.glb output.glb --compress draco` (look up the current version on npmjs.com and pin it, never run it unpinned), then add a loading manager and preloader (Step 4).
7. Test on a real phone. Cut any effect that drops frames.

### Step 1: Establish the Render Loop and Scene Architecture
Setting up a robust WebGL context with proper resize handling and performance-friendly pixel ratios is crucial. Keep pixel ratios capped at a maximum of 2 to avoid rendering too many pixels on high-DPI screens.

### Step 2: Implement Shader Effects and Post-Processing
Incorporate post-processing pipelines (using `EffectComposer` or `@react-three/postprocessing`) to add bloom, chromatic aberration, depth of field, or film grain. Keep pass counts low and combine custom fragment shaders to minimize draw calls.

### Step 3: Integrate Interactive Physics and Motion
Utilize physics frameworks (such as Cannon.js or Rapier) or procedural spring animations to make 3D objects react to mouse hover, drag, and click inputs with organic feedback.

### Step 4: Asset Pipeline and Preloader
Optimize 3D models (using Draco compression) and load them using custom loading managers. Render interactive preloaders to entertain users while heavy assets are fetched in the background.

## Examples

### Example 1: Custom Post-processing in React Three Fiber (R3F)

```jsx
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';

export default function PremiumComposer() {
  return (
    <Canvas dpr={[1, 2]} gl={{ powerPreference: "high-performance", antialias: false }}>
      <ambientLight intensity={0.5} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial emissive="orange" emissiveIntensity={2.0} />
      </mesh>
      
      <EffectComposer disableNormalPass>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
```

### Example 2: Custom GLSL Shader Material for Liquid/Wavy Effects

```javascript
import * as THREE from 'three';

const CustomWavyMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 5.0 + uTime) * 0.1;
      pos.z += cos(pos.y * 5.0 + uTime) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    void main() {
      float pulse = 0.5 + 0.5 * sin(uTime + vUv.x * 10.0);
      gl_FragColor = vec4(uColor * pulse, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0.0 },
    uColor: { value: new THREE.Color('#3b82f6') }
  }
});
```

## Best Practices

- ✅ Set `dpr={[1, 2]}` to restrict the device pixel ratio to a maximum of 2.
- ✅ Disable antialiasing on the WebGLRenderer when post-processing is active to prevent double-aliasing performance penalties.
- ✅ Bake ambient occlusion, lighting, and shadows into textures using Blender or other 3D software instead of using dynamic lights and real-time shadows.
- ✅ Use instance rendering (`THREE.InstancedMesh` or R3F `<Instances>`) for scenes containing multiple identical meshes.
- ❌ Avoid using uncompressed GLTF/OBJ models. Always compress models using Draco or Meshopt.
- ❌ Avoid real-time shadow maps (such as `THREE.DirectionalLightShadow`) on mobile or low-end devices due to the heavy performance overhead.

## Limitations

- This skill does not replace environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, or safety boundaries are missing.
- Complex shader mathematics and advanced physics simulation bounds require manual testing across different device chipsets.

## Security & Safety Notes

- Verify that external 3D model URLs (loaded via `GLTFLoader`) are hosted on trusted, secure CDNs (HTTPS).
- Do not execute arbitrary, unvalidated shell scripts or use unpinned NPM packages to optimize assets.

## Common Pitfalls

- **Problem**: Severe lag/framerate drop on mobile or high-DPI (Retina) screens.
  **Solution**: Ensure the pixel ratio is limited to 2 (`renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`) and disable unused post-processing passes.
- **Problem**: Long loading times and white screens during initialization.
  **Solution**: Use a loading manager (`THREE.LoadingManager`) and display a responsive, interactive preloader to keep the user engaged.

## Related Skills

- `@3d-web-experience` - Core WebGL, Three.js, and Spline concepts.
- `@scroll-experience` - Integrating 3D animation with scroll controllers.
- `@performance-optimizer` - General code execution performance tuning.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Image and video pipeline planner](https://useaiblocks.com/skills/image-and-video-pipeline-planner). It takes the web app.
- The [Multi-language site planner](https://useaiblocks.com/skills/multi-language-site-planner). It takes the web app.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
