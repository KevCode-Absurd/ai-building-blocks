---
name: web-performance-optimization
description: "Optimize website and web application performance including loading speed, Core Web Vitals, bundle size, caching strategies, and runtime performance"
risk: critical
source: community
date_added: "2026-02-27"
---

# Web Performance Optimization

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

If an earlier speed check gave you a report or a ranked fix list, use its findings as the problems to fix, and measure again to confirm.

## When to Use This Skill

- Use when website or app is loading slowly
- Use when optimizing for Core Web Vitals (LCP, INP, CLS)
- Use when reducing JavaScript bundle size
- Use when reducing main-thread blocking and slow interactions (INP)
- Use when optimizing images and assets
- Use when implementing caching strategies
- Use when debugging performance bottlenecks
- Use when preparing for performance audits

## Examples

**The examples below use bracketed placeholders such as [your LCP] where the original had sample numbers. Fill them only with the user's own measurements.** Never quote them as results. In a real run, report only the user's own measurements, and write [your LCP] or "unknown" where you have none. The front-matter label `risk: critical` is the original author's tag for skills that change live code. It means: ask before you change production, and test first.

### Example 1: Optimizing Core Web Vitals

```markdown
## Performance Audit Results

### Current Metrics (Before Optimization, illustrative)
- **LCP (Largest Contentful Paint):** [your LCP] ❌ (should be < 2.5s)
- **INP (Interaction to Next Paint):** [your INP] ❌ (should be ≤ 200ms)
- **CLS (Cumulative Layout Shift):** [your CLS] ❌ (should be < 0.1)
- **Lighthouse Score:** [your score]/100

### Issues Identified

1. **LCP Issue:** Hero image ([SIZE]) loads slowly
2. **INP Issue:** Large JavaScript bundle ([SIZE]) blocks main thread
3. **CLS Issue:** Images without dimensions cause layout shifts

### Optimization Plan

#### Fix LCP (Largest Contentful Paint)

**Problem:** Hero image is [SIZE] and loads slowly

**Solutions:**
\`\`\`html
<!-- Before: Unoptimized image -->
<img src="/hero.jpg" alt="Hero">

<!-- After: Optimized with modern formats -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img 
    src="/hero.jpg" 
    alt="Hero"
    width="1200" 
    height="600"
    loading="eager"
    fetchpriority="high"
  >
</picture>
\`\`\`

**Additional optimizations:**
- Compress the image (set a size budget for your page)
- Use CDN for faster delivery
- Preload hero image: `<link rel="preload" as="image" href="/hero.avif">`

#### Fix INP (Interaction to Next Paint)

**Problem:** [SIZE] JavaScript bundle blocks main thread

**Solutions:**

1. **Code Splitting:**
\`\`\`javascript
// Before: Everything in one bundle
import { HeavyComponent } from './HeavyComponent';
import { Analytics } from './analytics';
import { ChatWidget } from './chat';

// After: Lazy load non-critical code
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const ChatWidget = lazy(() => import('./chat'));

// Load analytics after page interactive
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    import('./analytics').then(({ Analytics }) => {
      Analytics.init();
    });
  });
}
\`\`\`

2. **Remove Unused Dependencies:**
\`\`\`bash
# Analyze bundle
npx webpack-bundle-analyzer

# Remove unused packages
npm uninstall moment  # Use date-fns instead (smaller)
npm install date-fns
\`\`\`

3. **Defer Non-Critical Scripts:**
\`\`\`html
<!-- Before: Blocks rendering -->
<script src="/analytics.js"></script>

<!-- After: Deferred -->
<script src="/analytics.js" defer></script>
\`\`\`

#### Fix CLS (Cumulative Layout Shift)

**Problem:** Images without dimensions cause layout shifts

**Solutions:**
\`\`\`html
<!-- Before: No dimensions -->
<img src="/product.jpg" alt="Product">

<!-- After: With dimensions -->
<img 
  src="/product.jpg" 
  alt="Product"
  width="400" 
  height="300"
  style="aspect-ratio: 4/3;"
>
\`\`\`

**For dynamic content:**
\`\`\`css
/* Reserve space for content that loads later */
.skeleton-loader {
  min-height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
\`\`\`

### Results After Optimization (illustrative, not measured)

- **LCP:** [new LCP] ✅ (improved by [PERCENT])
- **INP:** [new INP] ✅ (improved by [PERCENT])
- **CLS:** [new CLS] ✅ (improved by [PERCENT])
- **Lighthouse Score:** [new score]/100 ✅
```

### Example 2: Reducing JavaScript Bundle Size

```markdown
## Bundle Size Optimization

### Current State (illustrative)
- **Total Bundle:** [SIZE] (gzipped: [SIZE])
- **Main Bundle:** [SIZE]
- **Vendor Bundle:** [SIZE]
- **Load Time (3G):** [your load time]

### Analysis

\`\`\`bash
# Analyze bundle composition
npx webpack-bundle-analyzer dist/stats.json
\`\`\`

**Findings:**
1. Moment.js: [SIZE] (can replace with date-fns, usually smaller: check both sizes)
2. Lodash: [SIZE] (using the entire library when only a few functions are needed)
3. Unused code: [SIZE] of dead code
4. No code splitting: Everything in one bundle

### Optimization Steps

#### 1. Replace Heavy Dependencies

\`\`\`bash
# Remove moment.js → Use date-fns (compare the sizes in your bundle first)
npm uninstall moment
npm install date-fns

// Before (JavaScript code, not shell commands):
import moment from 'moment';
const formatted = moment(date).format('YYYY-MM-DD');

// After (JavaScript code):
import { format } from 'date-fns';
const formatted = format(date, 'yyyy-MM-dd');
\`\`\`

**Savings:** [SIZE] (measure it)

#### 2. Use Lodash Selectively

\`\`\`javascript
// Before: Import entire library
import _ from 'lodash';
const unique = _.uniq(array);

// After: Import only what you need
import uniq from 'lodash/uniq';
const unique = uniq(array);

// Or use native methods
const unique = [...new Set(array)];
\`\`\`

**Savings:** [SIZE] (measure it)

#### 3. Implement Code Splitting

\`\`\`javascript
// Next.js example
import dynamic from 'next/dynamic';

// Lazy load heavy components
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
});

const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <div>Loading...</div>
});

// Route-based code splitting (automatic in Next.js)
// pages/admin.js - Only loaded when visiting /admin
// pages/dashboard.js - Only loaded when visiting /dashboard
\`\`\`

#### 4. Remove Dead Code

\`\`\`javascript
// Tree shaking in webpack.config.js: production mode already enables
// optimization.usedExports and optimization.sideEffects.
// Do not set optimization.sideEffects to false: that turns the optimization off.
module.exports = {
  mode: 'production'
};

// In package.json: mark modules as side-effect-free, but list the files
// that must run when imported (CSS, polyfills). A blanket
// "sideEffects": false lets the bundler drop `import './styles.css'`.
{
  "sideEffects": ["*.css", "*.scss", "./src/polyfills.js"]
}
\`\`\`

#### 5. Optimize Third-Party Scripts

\`\`\`html
<!-- Before: Loads immediately -->
<script src="https://analytics.com/script.js"></script>

<!-- After: Load after page interactive -->
<script>
  window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://analytics.com/script.js';
    script.async = true;
    document.body.appendChild(script);
  });
</script>
\`\`\`

### Results (illustrative, not measured)

- **Total Bundle:** [new SIZE] ✅ (reduced by [PERCENT])
- **Main Bundle:** [new SIZE] ✅
- **Vendor Bundle:** [new SIZE] ✅
- **Load Time (3G):** [new load time] ✅ (improved by [PERCENT])
```

### Example 3: Image Optimization Strategy

```markdown
## Image Optimization

### Current Issues
- [NUMBER] images totaling [SIZE]
- No modern formats (WebP, AVIF)
- No responsive images
- No lazy loading

### Optimization Strategy

#### 1. Convert to Modern Formats

\`\`\`bash
# Install image optimization tools
npm install sharp

# Conversion script (optimize-images.js)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  // Generate WebP
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, \`\${filename}.webp\`));
  
  // Generate AVIF (best compression)
  await sharp(inputPath)
    .avif({ quality: 70 })
    .toFile(path.join(outputDir, \`\${filename}.avif\`));
  
  // Generate optimized JPEG fallback
  await sharp(inputPath)
    .jpeg({ quality: 80, progressive: true })
    .toFile(path.join(outputDir, \`\${filename}.jpg\`));
}

// Process all images
const images = fs.readdirSync('./images');
images.forEach(img => {
  optimizeImage(\`./images/\${img}\`, './images/optimized');
});
\`\`\`

#### 2. Implement Responsive Images

\`\`\`html
<!-- Responsive images with modern formats -->
<picture>
  <!-- AVIF for browsers that support it (best compression) -->
  <source 
    srcset="
      /images/hero-400.avif 400w,
      /images/hero-800.avif 800w,
      /images/hero-1200.avif 1200w
    "
    type="image/avif"
    sizes="(max-width: 768px) 100vw, 50vw"
  >
  
  <!-- WebP for browsers that support it -->
  <source 
    srcset="
      /images/hero-400.webp 400w,
      /images/hero-800.webp 800w,
      /images/hero-1200.webp 1200w
    "
    type="image/webp"
    sizes="(max-width: 768px) 100vw, 50vw"
  >
  
  <!-- JPEG fallback -->
  <img 
    src="/images/hero-800.jpg"
    srcset="
      /images/hero-400.jpg 400w,
      /images/hero-800.jpg 800w,
      /images/hero-1200.jpg 1200w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
    alt="Hero image"
    width="1200"
    height="600"
    fetchpriority="high"
  >
</picture>
\`\`\`

#### 3. Lazy Loading

\`\`\`html
<!-- Native lazy loading -->
<img 
  src="/image.jpg" 
  alt="Description"
  loading="lazy"
  width="800"
  height="600"
>

<!-- Eager loading for above-the-fold images -->
<img 
  src="/hero.jpg" 
  alt="Hero"
  loading="eager"
  fetchpriority="high"
>
\`\`\`

#### 4. Next.js Image Component

\`\`\`javascript
import Image from 'next/image';

// Automatic optimization
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // For above-the-fold images
  quality={80}
/>

// Lazy loaded
<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  loading="lazy"
/>
\`\`\`

### Results (illustrative, not measured)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total Image Size | [SIZE] | [new SIZE] | [PERCENT] reduction |
| LCP | [your LCP] | [new LCP] | [PERCENT] faster |
| Page Load (3G) | [your load time] | [new load time] | [PERCENT] faster |
```

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
