// ==============================================================================
// POST /api/adaptive-quiz/submit
// Evaluates answer, calculates BKT Mastery Delta, updates IRT Theta & logs audit
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { QUESTION_POOL, KNOWLEDGE_NODES } from '@/lib/curriculum-data';
import { updateBKT } from '@/lib/algorithms/bkt';
import { updateStudentTheta } from '@/lib/algorithms/irt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      questionId,
      selectedOptionId,
      currentMastery = 0.5,
      currentTheta = 0.0,
      timeSpentSec = 15,
      hintsUsed = 0,
    } = body;

    const question = QUESTION_POOL.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = question.correctOptionId === selectedOptionId;
    const node = KNOWLEDGE_NODES[question.nodeId];
    const bktParams = node ? node.bktParams : { pL0: 0.15, pT: 0.18, pS: 0.08, pG: 0.20 };

    // 1. Calculate Bayesian Knowledge Tracing posterior & transition
    const bktResult = updateBKT(currentMastery, isCorrect, bktParams);

    // 2. Calculate Item Response Theory ability update
    const irtResult = updateStudentTheta(currentTheta, isCorrect, question.irt);

    // 3. XP reward calculation
    const xpGained = isCorrect ? Math.max(10, 50 - hintsUsed * 10) : 10;

    return NextResponse.json({
      status: 'success',
      isCorrect,
      correctOptionId: question.correctOptionId,
      detailedExplanation: question.detailedExplanation,
      selectedOption: question.options.find(o => o.id === selectedOptionId),
      bktUpdate: {
        previousMastery: bktResult.previousMastery,
        posteriorGivenObs: bktResult.posteriorGivenObs,
        updatedMastery: bktResult.updatedMastery,
        deltaMastery: bktResult.deltaMastery,
        isMastered: bktResult.isMastered,
      },
      irtUpdate: {
        previousTheta: currentTheta,
        newTheta: irtResult.newTheta,
        deltaTheta: irtResult.deltaTheta,
        difficultyTier: irtResult.estimatedDifficulty,
      },
      xpGained,
      timeSpentSec,
      hintsUsed,
      telemetryLogged: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process quiz submission', details: String(error) },
      { status: 500 }
    );
  }
}
