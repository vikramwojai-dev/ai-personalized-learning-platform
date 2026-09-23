// ==============================================================================
// EBBINGHAUS FORGETTING CURVE & SPACED REPETITION ENGINE
// Retrievability: R(t) = exp(-t / S)
// ==============================================================================

export interface RetentionMetrics {
  retrievabilityR: number;       // Recall probability (0.0 - 1.0)
  daysElapsed: number;
  memoryStabilityS: number;      // Half-life / stability in days
  needsReview: boolean;          // Flagged if R < 0.70
  predictedDecayCurve: { day: number; retentionPct: number }[];
  optimalNextReviewDays: number; // Days until R hits 0.85 optimal target
}

/**
 * Calculates current retention probability and 14-day projection using Ebbinghaus decay:
 * R(t) = exp( -t / S )
 *
 * S = Memory stability in days
 * t = Elapsed days since last active recall
 */
export function calculateRetention(
  lastReviewedAt: string | Date,
  stabilityDays: number = 2.5
): RetentionMetrics {
  const lastDate = new Date(lastReviewedAt).getTime();
  const now = Date.now();
  const elapsedMs = Math.max(0, now - lastDate);
  const daysElapsed = elapsedMs / (1000 * 60 * 60 * 24);

  const safeStability = Math.max(0.2, stabilityDays);
  // R = exp(-t / S)
  const retrievabilityR = Math.exp(-daysElapsed / safeStability);

  // Generate 14-day decay curve for visualizations
  const predictedDecayCurve: { day: number; retentionPct: number }[] = [];
  for (let d = 0; d <= 14; d++) {
    const r = Math.exp(-d / safeStability);
    predictedDecayCurve.push({
      day: d,
      retentionPct: Math.round(r * 100),
    });
  }

  // Optimal next review is when R decays to 0.85
  // 0.85 = exp(-t / S) => -t / S = ln(0.85) => t = -S * ln(0.85)
  const optimalNextReviewDays = Math.max(0.5, Number((-safeStability * Math.log(0.85)).toFixed(1)));

  return {
    retrievabilityR: Number(Math.max(0.01, Math.min(1.0, retrievabilityR)).toFixed(3)),
    daysElapsed: Number(daysElapsed.toFixed(2)),
    memoryStabilityS: Number(safeStability.toFixed(2)),
    needsReview: retrievabilityR < 0.70,
    predictedDecayCurve,
    optimalNextReviewDays,
  };
}

/**
 * Updates memory stability S after a review session based on performance rating:
 * Rating:
 * 1 (Again / Fail)   -> S = S * 0.5 (reset / drop)
 * 2 (Hard)           -> S = S * 1.2
 * 3 (Good)           -> S = S * 2.2
 * 4 (Easy)           -> S = S * 3.5
 */
export function updateMemoryStability(
  currentStability: number,
  rating: 1 | 2 | 3 | 4
): number {
  const multipliers: Record<number, number> = {
    1: 0.5,
    2: 1.25,
    3: 2.2,
    4: 3.4,
  };
  const multiplier = multipliers[rating] || 1.8;
  const newStability = Math.max(0.5, currentStability * multiplier);
  return Number(newStability.toFixed(2));
}
