// ==============================================================================
// ITEM RESPONSE THEORY (IRT) 3PL ADAPTIVE ENGINE
// Computerized Adaptive Testing (CAT) with Maximum Fisher Information
// ==============================================================================

import { IRTParameters, QuestionDifficulty } from '../types';

/**
 * 3-Parameter Logistic (3PL) IRT probability function:
 * P(\theta) = c + (1 - c) / (1 + exp(-a * (\theta - b)))
 *
 * \theta : Student latent ability level (typically [-3.0, +3.0])
 * b      : Question difficulty parameter
 * a      : Question discrimination / slope parameter
 * c      : Pseudo-guessing lower asymptote
 */
export function calculateProbability3PL(
  theta: number,
  irt: IRTParameters
): number {
  const { difficultyB: b, discriminationA: a, guessingC: c } = irt;
  const expTerm = Math.exp(-a * (theta - b));
  const prob = c + (1 - c) / (1 + expTerm);
  return Math.max(0.001, Math.min(0.999, prob));
}

/**
 * Computes Fisher Information I(\theta) for a question at student ability \theta:
 * I(\theta) = [ a^2 * (P(\theta) - c)^2 * (1 - P(\theta)) ] / [ (1 - c)^2 * P(\theta) ]
 *
 * Higher Fisher Information means the item gives maximum precision about student ability.
 */
export function calculateFisherInformation(
  theta: number,
  irt: IRTParameters
): number {
  const { discriminationA: a, guessingC: c } = irt;
  const P = calculateProbability3PL(theta, irt);
  const numerator = Math.pow(a, 2) * Math.pow(P - c, 2) * (1 - P);
  const denominator = Math.pow(1 - c, 2) * P;
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Updates student latent ability \theta using an EAP / Robbins-Monro style step:
 * \theta_{new} = \theta_{old} + learningRate * (obs - P(\theta))
 */
export function updateStudentTheta(
  currentTheta: number,
  isCorrect: boolean,
  irt: IRTParameters,
  learningRate: number = 0.4
): { newTheta: number; deltaTheta: number; estimatedDifficulty: QuestionDifficulty } {
  const P = calculateProbability3PL(currentTheta, irt);
  const obs = isCorrect ? 1.0 : 0.0;
  const rawDelta = learningRate * (obs - P) * irt.discriminationA;

  // Bound ability between -3.0 (Novice) and +3.0 (Expert)
  const newTheta = Math.max(-3.0, Math.min(3.0, currentTheta + rawDelta));
  const deltaTheta = newTheta - currentTheta;

  let estimatedDifficulty: QuestionDifficulty = 'INTERMEDIATE';
  if (newTheta < -1.0) estimatedDifficulty = 'NOVICE';
  else if (newTheta <= 0.8) estimatedDifficulty = 'INTERMEDIATE';
  else if (newTheta <= 1.8) estimatedDifficulty = 'ADVANCED';
  else estimatedDifficulty = 'EXPERT';

  return {
    newTheta: Number(newTheta.toFixed(3)),
    deltaTheta: Number(deltaTheta.toFixed(3)),
    estimatedDifficulty,
  };
}

/**
 * Selects the question with the highest Fisher Information for the student's current theta.
 */
export function selectOptimalAdaptiveQuestion<T extends { irt: IRTParameters }>(
  items: T[],
  currentTheta: number,
  alreadyAnsweredIds: Set<string>,
  getId: (item: T) => string
): T | null {
  const availableItems = items.filter(item => !alreadyAnsweredIds.has(getId(item)));
  if (availableItems.length === 0) return null;

  let bestItem: T = availableItems[0];
  let maxInfo = -Infinity;

  for (const item of availableItems) {
    const info = calculateFisherInformation(currentTheta, item.irt);
    if (info > maxInfo) {
      maxInfo = info;
      bestItem = item;
    }
  }

  return bestItem;
}
