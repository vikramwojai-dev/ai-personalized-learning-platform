// ==============================================================================
// POST /api/adaptive-quiz/generate
// Selects next optimal question using IRT Fisher Information & Node Targeting
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { QUESTION_POOL } from '@/lib/curriculum-data';
import { selectOptimalAdaptiveQuestion } from '@/lib/algorithms/irt';
import { QuestionData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      currentTheta = 0.0,
      targetNodeId,
      answeredQuestionIds = [],
    } = body;

    let candidatePool: QuestionData[] = QUESTION_POOL;

    if (targetNodeId) {
      const filtered = QUESTION_POOL.filter(q => q.nodeId === targetNodeId);
      if (filtered.length > 0) {
        candidatePool = filtered;
      }
    }

    const answeredSet = new Set<string>(answeredQuestionIds);
    const optimalQuestion = selectOptimalAdaptiveQuestion<QuestionData>(
      candidatePool,
      currentTheta,
      answeredSet,
      q => q.id
    ) || candidatePool[0];

    return NextResponse.json({
      status: 'success',
      question: optimalQuestion,
      targetTheta: currentTheta,
      fisherInfoApplied: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate adaptive question', details: String(error) },
      { status: 500 }
    );
  }
}
