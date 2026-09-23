// ==============================================================================
// BAYESIAN KNOWLEDGE TRACING (BKT) ENGINE
// Production Implementation of Corbett & Anderson's Cognitive Mastery Model
// ==============================================================================

import { BKTParameters } from '../types';

export interface BKTUpdateResult {
  previousMastery: number;
  posteriorGivenObs: number;
  updatedMastery: number;
  deltaMastery: number;
  isMastered: boolean; // P(L) >= 0.85 standard threshold
}

/**
 * Computes the updated mastery probability given a student's answer observation.
 *
 * Formulas:
 * If observation is Correct (obs = 1):
 *   P(L_t | Correct) = [ P(L_t) * (1 - P(S)) ] / [ P(L_t) * (1 - P(S)) + (1 - P(L_t)) * P(G) ]
 *
 * If observation is Incorrect (obs = 0):
 *   P(L_t | Incorrect) = [ P(L_t) * P(S) ] / [ P(L_t) * P(S) + (1 - P(L_t)) * (1 - P(G)) ]
 *
 * Transition step to t+1:
 *   P(L_{t+1}) = P(L_t | obs) + (1 - P(L_t | obs)) * P(T)
 */
export function updateBKT(
  currentMastery: number,
  isCorrect: boolean,
  params: BKTParameters = { pL0: 0.15, pT: 0.18, pS: 0.08, pG: 0.20 }
): BKTUpdateResult {
  const pL = Math.max(0.01, Math.min(0.99, currentMastery));
  const { pT, pS, pG } = params;

  let posteriorGivenObs: number;

  if (isCorrect) {
    const numerator = pL * (1 - pS);
    const denominator = pL * (1 - pS) + (1 - pL) * pG;
    posteriorGivenObs = numerator / (denominator || 0.0001);
  } else {
    const numerator = pL * pS;
    const denominator = pL * pS + (1 - pL) * (1 - pG);
    posteriorGivenObs = numerator / (denominator || 0.0001);
  }

  // Bound posterior
  posteriorGivenObs = Math.max(0.01, Math.min(0.99, posteriorGivenObs));

  // Compute transition to next time step: P(L_t+1) = posterior + (1 - posterior) * P(T)
  const updatedMastery = posteriorGivenObs + (1 - posteriorGivenObs) * pT;
  const clampedMastery = Math.max(0.01, Math.min(0.99, updatedMastery));

  return {
    previousMastery: currentMastery,
    posteriorGivenObs: Number(posteriorGivenObs.toFixed(4)),
    updatedMastery: Number(clampedMastery.toFixed(4)),
    deltaMastery: Number((clampedMastery - currentMastery).toFixed(4)),
    isMastered: clampedMastery >= 0.85,
  };
}

/**
 * Predicts the probability of a correct response on the next question.
 * P(Correct) = P(L_t) * (1 - P(S)) + (1 - P(L_t)) * P(G)
 */
export function predictCorrectProbability(
  currentMastery: number,
  params: BKTParameters = { pL0: 0.15, pT: 0.18, pS: 0.08, pG: 0.20 }
): number {
  const { pS, pG } = params;
  const pCorrect = currentMastery * (1 - pS) + (1 - currentMastery) * pG;
  return Number(Math.max(0.01, Math.min(0.99, pCorrect)).toFixed(4));
}
