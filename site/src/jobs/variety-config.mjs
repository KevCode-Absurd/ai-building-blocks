// One source for structural thresholds. These estimates are not benchmark results.
export const JOB_TIERS = Object.freeze({
  quick: Object.freeze({ min_seats: 3, max_seats: 4, min_routes: 2, max_routes: 2, council_rounds: 0, max_revision_loops: 0, token_multiple: Object.freeze([1.5, 2]) }),
  standard: Object.freeze({ min_seats: 5, max_seats: 7, min_routes: 3, max_routes: 5, council_rounds: 1, max_revision_loops: 1, token_multiple: Object.freeze([2.5, 4]) }),
  deep: Object.freeze({ min_seats: 8, max_seats: 12, min_routes: 3, max_routes: 5, council_rounds: 2, max_revision_loops: 2, token_multiple: Object.freeze([5, 8]) }),
});
export const TIERS = JOB_TIERS;
export const VARIETY_CONFIG = Object.freeze({
  min_slots: 6,
  outlier_min_slots: 5,
  mix_tolerance_slots: 1,
  min_makers: 2,
  wide_share_threshold: 60,
  route_similarity_threshold: 0.85,
  balanced: Object.freeze({ max_families_required: 4, slots_per_family: 3, max_concentration: 0.5 }),
  wide: Object.freeze({ max_families_required: 5, slots_per_family: 2, max_concentration: 0.3 }),
  presets: Object.freeze({
    focused: Object.freeze({ proven: 100, new: 0, outlier: 0 }),
    balanced: Object.freeze({ proven: 50, new: 30, outlier: 20 }),
    wide: Object.freeze({ proven: 20, new: 50, outlier: 30 }),
  }),
});
export const VARIETY_PRESETS = VARIETY_CONFIG.presets;
export function tierConfig(tier = 'standard') { return JOB_TIERS[tier] ?? JOB_TIERS.standard; }
export function varietyThresholds(mix = {}) {
  if (mix.preset === 'focused') return null;
  return mix.preset === 'wide' || ((mix.new ?? 0) + (mix.outlier ?? 0) >= VARIETY_CONFIG.wide_share_threshold) ? VARIETY_CONFIG.wide : VARIETY_CONFIG.balanced;
}
