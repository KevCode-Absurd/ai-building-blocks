/**
 * Prompt Compiler, Starter
 *
 * Single-stage compiler: take structured inputs, return a prompt string.
 *
 * The teaching point is simple: a prompt compiler is just a function from
 * structured inputs to a string. You don't need a multi-stage pipeline to
 * start. You need one function that is deterministic, inspectable, and
 * easy to extend.
 *
 * When you outgrow this (different branches per format, different voice
 * logic per persona, brand DNA lookups, policy checks), split this one
 * function into smaller ones. Don't start split. Start with this.
 */

// -------- Inputs --------

export type AwarenessStage =
  | 'Unaware'
  | 'Problem Aware'
  | 'Solution Aware'
  | 'Product Aware'
  | 'Most Aware';

// Start with a small theme set. Add more as your brand voice demands.
export type Theme = 'Lifestyle' | 'Social Proof' | 'Educational' | 'Urgency';

export type Format = 'static_image' | 'ugc_video' | 'carousel';

export interface CompilerInput {
  product: {
    name: string;
    category: string;
    positioning: string;
  };
  persona: {
    name: string;
    descriptors: string[];
    never_say: string[];
  };
  awareness_stage: AwarenessStage;
  theme: Theme;
  format: Format;
  brand: {
    primary_color: string;
    secondary_color: string;
    photography_style: string;
    forbidden_patterns: string[];
  };
  brief_notes?: string;
}

// -------- The Compiler --------

/**
 * One function. Structured input in, prompt string out.
 *
 * Keep this function pure: no DB calls, no network, no randomness.
 * If you need external data (brand DNA, persona library, theme specs),
 * load it upstream and pass it in as part of CompilerInput.
 */
export function compilePrompt(input: CompilerInput): string {
  const { product, persona, awareness_stage, theme, format, brand, brief_notes } = input;

  const themeDirective = describeTheme(theme);
  const formatDirective = describeFormat(format);
  const stageDirective = describeStage(awareness_stage);
  const voiceDirective = `Write in the voice of ${persona.name}: ${persona.descriptors.join(', ')}.`;
  const forbidList = [...persona.never_say, ...brand.forbidden_patterns].join(', ');

  return [
    `Create a ${format.replace('_', ' ')} for ${product.name}, a ${product.category}.`,
    `Positioning: ${product.positioning}.`,
    `Audience stage: ${awareness_stage}. ${stageDirective}`,
    `Theme: ${theme}. ${themeDirective}`,
    `Format rules: ${formatDirective}`,
    voiceDirective,
    `Brand colors: ${brand.primary_color} primary, ${brand.secondary_color} accent.`,
    `Photography style: ${brand.photography_style}.`,
    brief_notes ? `Brief notes: ${brief_notes}` : '',
    `Never include: ${forbidList}.`,
    `No em dashes. No stock-photo look. No text distortion.`,
  ]
    .filter(Boolean)
    .join('\n');
}

// -------- Small helpers (pure, easy to read) --------

function describeTheme(theme: Theme): string {
  switch (theme) {
    case 'Lifestyle':
      return 'Show the product in aspirational daily use. Human subjects, natural context.';
    case 'Social Proof':
      return 'Lead with a third-party endorsement, review snippet, or number. Credibility up front.';
    case 'Educational':
      return 'Teach one concept or how-to step. Product appears as the resolution, not the hook.';
    case 'Urgency':
      return 'Communicate a specific, time-bound reason to act. Be honest about the constraint.';
  }
}

function describeFormat(format: Format): string {
  switch (format) {
    case 'static_image':
      return 'Single frame. Headline + subhead + CTA. Subject dominates composition.';
    case 'ugc_video':
      return 'Phone-shot feel. Real environment. First three seconds must earn the next ten.';
    case 'carousel':
      return 'Three to five frames. Frame 1 is the hook. Final frame is the CTA.';
  }
}

function describeStage(stage: AwarenessStage): string {
  switch (stage) {
    case 'Unaware':
      return 'Do not lead with the product. Lead with the life or the feeling.';
    case 'Problem Aware':
      return 'Name the problem plainly before introducing any solution.';
    case 'Solution Aware':
      return 'Compare your approach to the obvious alternative. Say what is different.';
    case 'Product Aware':
      return 'Specifics, proof, and differentiation. This viewer already knows the category.';
    case 'Most Aware':
      return 'Offer-led. Incentive, bundle, or time-bound reason to return.';
  }
}

// -------- Example usage --------

export function example(): string {
  return compilePrompt({
    product: {
      name: 'Example Daily Serum',
      category: 'skincare',
      positioning: 'clean and functional, minimal ingredient list',
    },
    persona: {
      name: 'Jess',
      descriptors: ['honest', 'direct', 'skeptical of marketing'],
      never_say: ['luxurious', 'anti-aging'],
    },
    awareness_stage: 'Problem Aware',
    theme: 'Educational',
    format: 'static_image',
    brand: {
      primary_color: '#0E0E0E',
      secondary_color: '#C9A66B',
      photography_style: 'editorial, warm natural light',
      forbidden_patterns: ['neon colors', 'clipart', 'stock-photo aesthetic'],
    },
    brief_notes: 'Hero shot should show product label clearly.',
  });
}

/**
 * When to split this into a multi-stage pipeline:
 *
 * 1. You need to hit a database to hydrate `product`, `persona`, or `brand`.
 *    -> Extract an upstream "hydrate" step that returns a CompilerInput.
 *
 * 2. Voice calibration grows past a few descriptors (e.g., numeric sliders
 *    for formal/casual, bold/subtle, rational/emotional).
 *    -> Extract a "calibrateVoice" step that produces a voice block.
 *
 * 3. You need policy checks (banned phrases, em dashes, compliance language).
 *    -> Add a "policyCheck" step after compilePrompt.
 *
 * 4. You want to A/B test theme selection or auto-pick a theme by stage.
 *    -> Add a "resolveTheme" step before compilePrompt.
 *
 * Each of those is the same shape: structured input in, structured output out.
 * Keep them pure, keep them inspectable, keep them easy to run in isolation.
 */
