// ==============================================================================
// POST /api/diagnostic
// Evaluates student baseline diagnostic assessment & initializes BKT priors
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { QUESTION_POOL, KNOWLEDGE_NODES } from '@/lib/curriculum-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, preferredStyle = 'VISUAL', targetPaceHours = 5 } = body;

    let correctCount = 0;
    const evaluatedResults: {
      questionId: string;
      nodeId: string;
      nodeTitle: string;
      isCorrect: boolean;
      initialMastery: number;
    }[] = [];

    const initializedNodeProgress: Record<string, {
      masteryProbability: number;
      masteryState: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'MASTERED' | 'NEEDS_REVIEW';
    }> = {};

    Object.entries(answers as Record<string, string>).forEach(([qId, selectedOptId]) => {
      const q = QUESTION_POOL.find(item => item.id === qId);
      if (q) {
        const isCorrect = q.correctOptionId === selectedOptId;
        if (isCorrect) correctCount++;

        // Baseline mastery assignment based on diagnostic outcome
        const initialMastery = isCorrect ? 0.88 : 0.25;
        evaluatedResults.push({
          questionId: q.id,
          nodeId: q.nodeId,
          nodeTitle: q.nodeTitle,
          isCorrect,
          initialMastery,
        });

        initializedNodeProgress[q.nodeId] = {
          masteryProbability: initialMastery,
          masteryState: isCorrect ? 'MASTERED' : 'IN_PROGRESS',
        };
      }
    });

    const totalQuestions = Object.keys(answers || {}).length || 1;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // Estimate initial IRT Theta: map score (0-100) to [-2.0, +2.0]
    const initialTheta = Number(((scorePercentage - 50) / 25).toFixed(2));

    return NextResponse.json({
      status: 'success',
      diagnosticScore: scorePercentage,
      correctCount,
      totalQuestions,
      estimatedTheta: initialTheta,
      preferredStyle,
      targetPaceHours,
      evaluatedResults,
      initializedNodeProgress,
      recommendation: scorePercentage >= 75
        ? 'Advanced Baseline: Accelerate to multi-head attention and distributed architectures.'
        : 'Foundational Baseline: Begin with linear algebra projections and gradient descent intuitions.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process diagnostic assessment', details: String(error) },
      { status: 500 }
    );
  }
}
