// Reference starter only. Current SKILL.md governs applicability, missing data and evidence.
/**
 * Diversification Engine Starter (3-Dimension Public Version)
 *
 * Scaffold for a 3-dimension diversification scorer plus an optional
 * cluster detector. This file gives you the types, scoring math, and
 * one worked example per dimension. Add categories per your vertical.
 *
 * The 3 dimensions:
 *   1. Format   - what the ad physically is (video, static, carousel, etc.)
 *   2. Message  - what the ad says (problem-solution, social proof, offer, etc.)
 *   3. Audience - who the ad targets (broad, lookalike, retarget, custom, etc.)
 *
 * Three is the floor for useful diversity scoring. Add more dimensions
 * (visual style, hook type, aspect ratio) once the base is wired and you
 * have a month of clean data to tune against.
 *
 * The cluster detector below is intentionally simple. Production cluster
 * detectors weight features carefully; this version uses equal weights so
 * the math is easy to read and easy to swap out later.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DimensionId = 'format' | 'message' | 'audience'

export interface Category {
  id: string
  label: string
  tags: string[]         // substrings used to match against ad metadata/names
}

export interface Dimension {
  id: DimensionId
  label: string
  categories: Category[]
  strongThreshold: number  // default 75, tune to your category count
  moderateThreshold: number // default 50
}

export interface Creative {
  id: string
  name: string                // e.g. "video_problem-solution_lookalike-1pct"
  format: 'video' | 'static' | 'carousel' | 'collection'
  audienceType?: 'broad' | 'lookalike' | 'retarget' | 'custom'
  messageAngle?: string       // free-form; matched against message tags
  spend: number
}

export interface DimensionScore {
  dimensionId: DimensionId
  activeCategories: string[]
  missingCategories: string[]
  coveragePct: number
  grade: 'strong' | 'moderate' | 'low'
}

export interface DiversityScore {
  overall: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  dimensions: DimensionScore[]
}

export interface Cluster {
  creativeIds: string[]
  similarity: number
  sharedDimensions: string[]
  risk: 'low' | 'medium' | 'high'
}

// ---------------------------------------------------------------------------
// Dimension definitions
//
// Each dimension is a list of categories. Coverage is the percent of
// categories that have at least one active ad. Add categories as you
// learn what your account actually runs.
// ---------------------------------------------------------------------------

export const DIMENSIONS: Dimension[] = [
  {
    id: 'format',
    label: 'Format',
    strongThreshold: 75,
    moderateThreshold: 50,
    categories: [
      { id: 'short_video',  label: 'Short Video (<30s)', tags: ['video', 'short'] },
      { id: 'long_video',   label: 'Long Video (30s+)',  tags: ['long-video', '60s'] },
      { id: 'static',       label: 'Static Image',       tags: ['static', 'image'] },
      { id: 'carousel',     label: 'Carousel',           tags: ['carousel', 'multi'] },
    ],
  },
  {
    id: 'message',
    label: 'Message Angle',
    strongThreshold: 75,
    moderateThreshold: 50,
    categories: [
      { id: 'problem_solution', label: 'Problem / Solution', tags: ['problem', 'solution'] },
      { id: 'social_proof',     label: 'Social Proof',       tags: ['review', 'testimonial', 'proof'] },
      { id: 'offer',            label: 'Offer / Discount',   tags: ['offer', 'sale', 'discount'] },
      { id: 'aspirational',     label: 'Aspirational',       tags: ['lifestyle', 'aspirational'] },
      // Add more (urgency, educational, founder-story) as you produce them.
    ],
  },
  {
    id: 'audience',
    label: 'Audience',
    strongThreshold: 75,
    moderateThreshold: 50,
    categories: [
      { id: 'broad',     label: 'Broad / Advantage+', tags: ['broad', 'advantage'] },
      { id: 'lookalike', label: 'Lookalike',          tags: ['lookalike', 'lal'] },
      { id: 'retarget',  label: 'Retargeting',        tags: ['retarget', 'rt'] },
      { id: 'custom',    label: 'Custom List',        tags: ['custom', 'crm'] },
    ],
  },
]

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function scoreDimension(dim: Dimension, creatives: Creative[]): DimensionScore {
  const active = new Set<string>()
  for (const cat of dim.categories) {
    if (creatives.some((c) => creativeMatchesCategory(c, cat))) {
      active.add(cat.id)
    }
  }
  const coveragePct = dim.categories.length === 0
    ? 0
    : Math.round((active.size / dim.categories.length) * 100)

  const grade: DimensionScore['grade'] =
    coveragePct >= dim.strongThreshold ? 'strong' :
    coveragePct >= dim.moderateThreshold ? 'moderate' : 'low'

  return {
    dimensionId: dim.id,
    activeCategories: Array.from(active),
    missingCategories: dim.categories.filter((c) => !active.has(c.id)).map((c) => c.id),
    coveragePct,
    grade,
  }
}

function creativeMatchesCategory(c: Creative, cat: Category): boolean {
  const hay = [c.name, c.format, c.audienceType ?? '', c.messageAngle ?? '']
    .join(' ')
    .toLowerCase()
  return cat.tags.some((tag) => hay.includes(tag.toLowerCase()))
}

export function computeDiversityScore(creatives: Creative[]): DiversityScore {
  const dimensions = DIMENSIONS.map((d) => scoreDimension(d, creatives))
  // Equal weights across the 3 dimensions. Swap to weighted-sum once you
  // know which dimension matters most for your account.
  const overall = Math.round(
    dimensions.reduce((sum, d) => sum + d.coveragePct, 0) / dimensions.length,
  )
  return { overall, grade: toGrade(overall), dimensions }
}

function toGrade(score: number): DiversityScore['grade'] {
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'
  if (score >= 20) return 'D'
  return 'F'
}

// ---------------------------------------------------------------------------
// Simple cluster detection
//
// Two creatives are "clustered" if they share format AND message AND
// audience. Equal-weighted similarity. This is intentionally simple. When
// you have production data, replace with a feature-weighted similarity that
// reflects which dimensions actually drive cannibalization in your account.
// ---------------------------------------------------------------------------

export function similarity(a: Creative, b: Creative): number {
  let matches = 0
  let total = 0

  total++
  if (a.format === b.format) matches++

  if (a.messageAngle && b.messageAngle) {
    total++
    if (a.messageAngle === b.messageAngle) matches++
  }

  if (a.audienceType && b.audienceType) {
    total++
    if (a.audienceType === b.audienceType) matches++
  }

  return total === 0 ? 0 : matches / total
}

export function detectClusters(creatives: Creative[], threshold = 0.66): Cluster[] {
  const clusters: Cluster[] = []
  const seen = new Set<string>()

  for (let i = 0; i < creatives.length; i++) {
    if (seen.has(creatives[i].id)) continue
    const group: string[] = [creatives[i].id]
    let maxSim = 0

    for (let j = i + 1; j < creatives.length; j++) {
      if (seen.has(creatives[j].id)) continue
      const sim = similarity(creatives[i], creatives[j])
      if (sim >= threshold) {
        group.push(creatives[j].id)
        seen.add(creatives[j].id)
        maxSim = Math.max(maxSim, sim)
      }
    }

    if (group.length >= 2) {
      seen.add(creatives[i].id)
      clusters.push({
        creativeIds: group,
        similarity: maxSim,
        sharedDimensions: sharedDimensionLabels(creatives, group),
        risk: riskLevel(maxSim),
      })
    }
  }

  return clusters
}

function riskLevel(sim: number): Cluster['risk'] {
  if (sim >= 0.9) return 'high'
  if (sim >= 0.66) return 'medium'
  return 'low'
}

function sharedDimensionLabels(all: Creative[], ids: string[]): string[] {
  const members = all.filter((c) => ids.includes(c.id))
  const shared: string[] = []
  if (members.every((c) => c.format === members[0].format)) {
    shared.push(`format:${members[0].format}`)
  }
  if (members.every((c) => c.messageAngle && c.messageAngle === members[0].messageAngle)) {
    shared.push(`message:${members[0].messageAngle}`)
  }
  if (members.every((c) => c.audienceType && c.audienceType === members[0].audienceType)) {
    shared.push(`audience:${members[0].audienceType}`)
  }
  return shared
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export interface DiversificationReport {
  diversity: DiversityScore
  clusters: Cluster[]
  recommendation: string
}

export function runDiversificationCheck(creatives: Creative[]): DiversificationReport {
  const diversity = computeDiversityScore(creatives)
  const clusters = detectClusters(creatives)

  const weakest = [...diversity.dimensions].sort((a, b) => a.coveragePct - b.coveragePct)[0]
  const recommendation = weakest
    ? `Weakest dimension is ${weakest.dimensionId} at ${weakest.coveragePct}%. Produce for: ${weakest.missingCategories.join(', ')}.`
    : 'No diversity data.'

  return { diversity, clusters, recommendation }
}

// ---------------------------------------------------------------------------
// What to add next
// ---------------------------------------------------------------------------
//
//   - Visual style as a 4th dimension (creator-led, polished, animated, mixed)
//   - Hook type as a 5th dimension (question, stat, demo, testimonial)
//   - Spend-weighted coverage (a category with 1% of spend should not count
//     the same as a category with 25% of spend)
//   - Feature weights on similarity (Andromeda research suggests format and
//     hook dominate, but your account may differ)
//
// The point of starting at 3 dimensions is to ship a working scorer in a
// day, then learn what to weight. Do not start with 7 dimensions and zero
// data.
