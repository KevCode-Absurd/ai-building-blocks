/**
 * Self-Reflection Runner Starter
 *
 * Weekly job. Grades past agent predictions against actual outcomes.
 * Math-first scoring. LLM explanation after. Pattern detection only after
 * the agent has accumulated enough graded outcomes to be meaningful.
 *
 * Flow:
 *   1. Load predictions whose horizon has elapsed (the wait period is over)
 *   2. For each prediction: fetch the actual metric, score via the calculator
 *   3. Group graded outcomes by (agent, recommendation_type)
 *   4. If a group crosses the instance floor and the accuracy thresholds,
 *      generate a lesson
 *   5. Write the lesson to your reflection_events store with a feedback weight
 *
 * No LLM call touches the numeric score. The grader is independent.
 */

// ============================================================================
// CONSTANTS
//
// These are starting values, not tuned for your agents. Treat them as a
// hypothesis. Run them for two to four weeks, then look at how many lessons
// the loop generated and how many were actually useful. Adjust from there.
// ============================================================================

export const REFLECTION_CONSTANTS = {
  // What counts as a "correct" prediction (0 to 1 score from the grader).
  // Tune based on how much noise your domain tolerates.
  CORRECT: 0.7,

  // The middle band. Above this and below CORRECT is "partial."
  PARTIALLY_CORRECT: 0.4,

  // Effect-size noise floor. Anything smaller than this percent change is
  // treated as "stable," not a hit or a miss. Tune to your metric volatility.
  MIN_EFFECT_SIZE: 0.10,

  // Minimum graded outcomes required before the loop will flag a pattern.
  // Higher values reduce false-positive lessons but slow learning.
  // Tune based on your agent's decision frequency.
  MIN_PATTERN_INSTANCES: 10,

  // Per-agent minimum for cross-agent pattern detection.
  CROSS_AGENT_MIN_INSTANCES: 6,

  // Accuracy below this triggers a correction lesson (do less of this).
  // Set conservatively at first; raise it once you trust the grader.
  WEAK_ACCURACY_THRESHOLD: 0.40,

  // Accuracy above this triggers a reinforcement lesson (keep doing this).
  STRONG_ACCURACY_THRESHOLD: 0.80,

  // Cap on how many lessons one agent can write in a single run. Prevents
  // a single bad week from flooding the agent with corrections.
  MAX_LESSONS_PER_AGENT_PER_DAY: 3,
}

// ============================================================================
// TYPES
// ============================================================================

export interface ExpectedOutcome {
  prediction_id: string
  agent_id: string
  client_id: string | null
  recommendation_type: string       // e.g., 'pause_creative', 'increase_budget'
  metric: string                    // 'roas', 'cpa', 'frequency', etc.
  direction: 'up' | 'down' | 'stable'
  magnitude_pct: number             // predicted change (0.15 = 15%)
  horizon_days: number
  confidence: 'low' | 'moderate' | 'high'
  before_value: number
  predicted_at: string              // iso
}

export interface GradedOutcome {
  prediction_id: string
  agent_id: string
  client_id: string | null
  recommendation_type: string
  score: number                     // 0-1
  classification: 'correct' | 'partial' | 'incorrect' | 'stable'
  observed_before: number
  observed_after: number
  actual_change_pct: number
  graded_at: string
}

export interface AgentLesson {
  agent_id: string
  lesson_type: 'correction' | 'reinforcement' | 'threshold-adjustment'
  lesson_text: string
  scope: 'agent-specific' | 'client-specific' | 'shared'
  context_tags: string[]
  relevance_score: number
  maturity: 'draft' | 'validated' | 'trusted'
  generated_by: 'reflection' | 'feedback'
}

// ============================================================================
// DI
// ============================================================================

type LoadDuePredictionsFn = () => Promise<ExpectedOutcome[]>
type FetchActualMetricFn = (args: {
  client_id: string | null
  metric: string
  asOf: string
}) => Promise<number>
type SaveGradedOutcomeFn = (outcome: GradedOutcome) => Promise<void>
type LoadGradedOutcomesFn = (args: {
  sinceIso: string
  agent_id?: string
}) => Promise<GradedOutcome[]>
type WriteLessonFn = (lesson: AgentLesson) => Promise<string>
type ExplainWithLLMFn = (prompt: string) => Promise<string>

let loadDuePredictions: LoadDuePredictionsFn | null = null
let fetchActualMetric: FetchActualMetricFn | null = null
let saveGradedOutcome: SaveGradedOutcomeFn | null = null
let loadGradedOutcomes: LoadGradedOutcomesFn | null = null
let writeLesson: WriteLessonFn | null = null
let explainWithLLM: ExplainWithLLMFn | null = null

export function setLoadDuePredictions(fn: LoadDuePredictionsFn): void { loadDuePredictions = fn }
export function setFetchActualMetric(fn: FetchActualMetricFn): void { fetchActualMetric = fn }
export function setSaveGradedOutcome(fn: SaveGradedOutcomeFn): void { saveGradedOutcome = fn }
export function setLoadGradedOutcomes(fn: LoadGradedOutcomesFn): void { loadGradedOutcomes = fn }
export function setWriteLesson(fn: WriteLessonFn): void { writeLesson = fn }
export function setExplainWithLLM(fn: ExplainWithLLMFn): void { explainWithLLM = fn }

// ============================================================================
// MATH-FIRST GRADING
// ============================================================================

/**
 * Deterministic scorer. No LLM involvement. Scores 0-1.
 *   Direction correct           : base 0.5
 *   Magnitude within 25% of pred: +0.3
 *   Timing within horizon       : +0.2
 */
export function scorePrediction(
  prediction: ExpectedOutcome,
  actualAfter: number,
): { score: number; classification: GradedOutcome['classification']; actualChangePct: number } {
  const before = prediction.before_value
  const actualChange = actualAfter - before
  const actualPct = before === 0 ? 0 : actualChange / before

  // Noise floor
  if (Math.abs(actualPct) < REFLECTION_CONSTANTS.MIN_EFFECT_SIZE) {
    return { score: 0.0, classification: 'stable', actualChangePct: actualPct }
  }

  const expectedDir = prediction.direction
  const actualDir: 'up' | 'down' | 'stable' =
    actualPct > REFLECTION_CONSTANTS.MIN_EFFECT_SIZE ? 'up' :
    actualPct < -REFLECTION_CONSTANTS.MIN_EFFECT_SIZE ? 'down' : 'stable'

  const directionCorrect = expectedDir === actualDir
  let score = directionCorrect ? 0.5 : 0.0

  if (directionCorrect) {
    // Magnitude proximity (closer to predicted = higher bonus)
    const predMag = prediction.magnitude_pct
    const actMag = Math.abs(actualPct)
    if (predMag > 0) {
      const ratio = Math.min(actMag, predMag) / Math.max(actMag, predMag)
      score += 0.3 * ratio
    }
    // Timing (already in window because we only grade after horizon)
    score += 0.2
  }

  score = Math.max(0, Math.min(1, score))

  const classification: GradedOutcome['classification'] =
    score >= REFLECTION_CONSTANTS.CORRECT ? 'correct' :
    score >= REFLECTION_CONSTANTS.PARTIALLY_CORRECT ? 'partial' :
    'incorrect'

  return { score, classification, actualChangePct: actualPct }
}

// ============================================================================
// RUN
// ============================================================================

export async function runSelfReflection(): Promise<{
  graded: number
  lessons: number
}> {
  if (!loadDuePredictions || !fetchActualMetric || !saveGradedOutcome) {
    throw new Error('[SelfReflection] DI not wired')
  }

  const due = await loadDuePredictions()

  // 1. Grade each due prediction
  let gradedCount = 0
  for (const prediction of due) {
    try {
      const actualAfter = await fetchActualMetric({
        client_id: prediction.client_id,
        metric: prediction.metric,
        asOf: new Date().toISOString(),
      })
      const { score, classification, actualChangePct } = scorePrediction(prediction, actualAfter)
      await saveGradedOutcome({
        prediction_id: prediction.prediction_id,
        agent_id: prediction.agent_id,
        client_id: prediction.client_id,
        recommendation_type: prediction.recommendation_type,
        score,
        classification,
        observed_before: prediction.before_value,
        observed_after: actualAfter,
        actual_change_pct: actualChangePct,
        graded_at: new Date().toISOString(),
      })
      gradedCount++
    } catch (err: any) {
      console.error(`[SelfReflection] grade failed for ${prediction.prediction_id}:`, err.message)
    }
  }

  // 2. Pattern detection over last 30 days
  const lessons = await detectPatternsAndWriteLessons()

  return { graded: gradedCount, lessons }
}

// ============================================================================
// PATTERN DETECTION
// ============================================================================

async function detectPatternsAndWriteLessons(): Promise<number> {
  if (!loadGradedOutcomes || !writeLesson || !explainWithLLM) return 0

  const since = new Date(Date.now() - 30 * 24 * 3600_000).toISOString()
  const outcomes = await loadGradedOutcomes({ sinceIso: since })

  // Group by (agent, recommendation_type)
  const groups = new Map<string, GradedOutcome[]>()
  for (const o of outcomes) {
    const key = `${o.agent_id}::${o.recommendation_type}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(o)
  }

  const lessonsByAgent = new Map<string, number>()
  let lessonsWritten = 0

  for (const [key, group] of groups) {
    if (group.length < REFLECTION_CONSTANTS.MIN_PATTERN_INSTANCES) continue

    const [agentId, recType] = key.split('::')
    const accuracy = group.filter((g) => g.classification === 'correct').length / group.length

    // Per-agent daily cap
    const count = lessonsByAgent.get(agentId) ?? 0
    if (count >= REFLECTION_CONSTANTS.MAX_LESSONS_PER_AGENT_PER_DAY) continue

    let lessonType: AgentLesson['lesson_type'] | null = null
    if (accuracy <= REFLECTION_CONSTANTS.WEAK_ACCURACY_THRESHOLD) {
      lessonType = 'correction'
    } else if (accuracy >= REFLECTION_CONSTANTS.STRONG_ACCURACY_THRESHOLD) {
      lessonType = 'reinforcement'
    }
    if (!lessonType) continue

    const prompt = buildLessonPrompt(agentId, recType, group, accuracy, lessonType)
    const lessonText = await explainWithLLM(prompt)

    await writeLesson({
      agent_id: agentId,
      lesson_type: lessonType,
      lesson_text: lessonText,
      scope: 'agent-specific',
      context_tags: [recType],
      relevance_score: 0.7,
      maturity: 'draft',
      generated_by: 'reflection',
    })

    lessonsByAgent.set(agentId, count + 1)
    lessonsWritten++
  }

  return lessonsWritten
}

function buildLessonPrompt(
  agentId: string,
  recType: string,
  outcomes: GradedOutcome[],
  accuracy: number,
  lessonType: 'correction' | 'reinforcement',
): string {
  const summary = outcomes.slice(0, 10).map(
    (o) => `- score ${o.score.toFixed(2)} (${o.classification}), change ${(o.actual_change_pct * 100).toFixed(1)}%`,
  ).join('\n')

  return `Agent: ${agentId}
Recommendation type: ${recType}
Instances: ${outcomes.length}
Accuracy: ${(accuracy * 100).toFixed(1)}%
Lesson type: ${lessonType}

Sample outcomes:
${summary}

Write a single-paragraph lesson. Actionable, specific, under 60 words.
If correction: tell the agent what to stop or adjust and why.
If reinforcement: tell the agent what is working so it keeps doing it.
Do not use em dashes. Do not hedge. State the rule.`
}
