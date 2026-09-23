// ==============================================================================
// GET /api/analytics
// Analytics & Learning Science: Forgetting curve, learning velocity, spaced repetition
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROGRESS, getSpacedRepetitionQueue } from '@/lib/store';
import { calculateRetention } from '@/lib/algorithms/forgetting-curve';
import { KNOWLEDGE_NODES } from '@/lib/curriculum-data';

export async function GET(request: NextRequest) {
  try {
    const spacedQueue = getSpacedRepetitionQueue(INITIAL_PROGRESS);

    // Calculate forgetting curves for key nodes
    const nodeDecayProfiles = Object.entries(INITIAL_PROGRESS).map(([nodeId, progress]) => {
      const node = KNOWLEDGE_NODES[nodeId];
      const retention = calculateRetention(progress.lastReviewedAt, progress.memoryStabilityS);
      return {
        nodeId,
        nodeTitle: node ? node.title : nodeId,
        masteryProbability: progress.masteryProbability,
        retrievabilityR: retention.retrievabilityR,
        memoryStabilityS: progress.memoryStabilityS,
        daysElapsed: retention.daysElapsed,
        needsReview: retention.needsReview,
        predictedDecayCurve: retention.predictedDecayCurve,
      };
    });

    // Domain Mastery Breakdown
    const domainStats = [
      { domain: 'Vector Spaces & Math', masteryPct: 92, status: 'Mastered' },
      { domain: 'Optimization & Gradients', masteryPct: 87, status: 'Mastered' },
      { domain: 'Transformer Attention', masteryPct: 64, status: 'In Progress' },
      { domain: 'RAG & pgvector', masteryPct: 15, status: 'Available' },
      { domain: 'Agentic Workflows', masteryPct: 10, status: 'Available' },
      { domain: 'Model Alignment (RLHF)', masteryPct: 5, status: 'Locked' },
    ];

    // Weekly learning velocity (Minutes spent per day)
    const learningVelocityWeekly = [
      { day: 'Mon', minutes: 45, xp: 180, questionsAnswered: 8 },
      { day: 'Tue', minutes: 60, xp: 240, questionsAnswered: 12 },
      { day: 'Wed', minutes: 30, xp: 120, questionsAnswered: 5 },
      { day: 'Thu', minutes: 75, xp: 310, questionsAnswered: 15 },
      { day: 'Fri', minutes: 50, xp: 200, questionsAnswered: 9 },
      { day: 'Sat', minutes: 90, xp: 370, questionsAnswered: 18 },
      { day: 'Sun', minutes: 40, xp: 150, questionsAnswered: 6 },
    ];

    return NextResponse.json({
      status: 'success',
      spacedRepetitionQueue: spacedQueue,
      nodeDecayProfiles,
      domainStats,
      learningVelocityWeekly,
      streakDays: 5,
      cognitiveLoadIndex: 'Optimal (ZPD Band)',
      retentionRate7Day: 84.6,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: String(error) },
      { status: 500 }
    );
  }
}
