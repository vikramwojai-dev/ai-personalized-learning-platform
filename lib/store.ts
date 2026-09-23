// ==============================================================================
// SYNAPSE AI - IN-MEMORY & CLIENT PERSISTENCE STORE
// Provides synchronous/asynchronous state fallback & Prisma DB bridge
// ==============================================================================

import {
  UserProfileData,
  StudentProgressData,
  KnowledgeGraphData,
  TutorMessageData,
  SpacedRepetitionItem,
  QuestionData,
  LearningStyle
} from './types';
import { COURSES, KNOWLEDGE_NODES, QUESTION_POOL } from './curriculum-data';
import { updateBKT } from './algorithms/bkt';
import { calculateRetention, updateMemoryStability } from './algorithms/forgetting-curve';
import { updateStudentTheta } from './algorithms/irt';

// Default Demo User Profile
export const DEFAULT_USER: UserProfileData = {
  id: 'usr_synapse_001',
  name: 'Alex Rivera',
  email: 'alex.rivera@engineer.ai',
  role: 'STUDENT',
  preferredStyle: 'VISUAL',
  targetPaceHoursPerWk: 6.5,
  currentStreakDays: 5,
  globalAbilityTheta: 0.35, // Intermediate ability level
  totalXp: 1420,
  level: 4,
  diagnosticCompleted: true,
  diagnosticScore: 82,
  courseEnrolled: 'course-ai-ml',
};

// Initial Progress State seeded with realistic knowledge states
export const INITIAL_PROGRESS: Record<string, StudentProgressData> = {
  'ai-01': {
    nodeId: 'ai-01',
    masteryState: 'MASTERED',
    masteryProbability: 0.92,
    memoryStabilityS: 4.2,
    retrievabilityR: 0.88,
    lastReviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    attemptsCount: 6,
    correctCount: 5,
    consecutiveCorrect: 3,
    timeSpentSeconds: 1450,
  },
  'ai-02': {
    nodeId: 'ai-02',
    masteryState: 'MASTERED',
    masteryProbability: 0.87,
    memoryStabilityS: 3.5,
    retrievabilityR: 0.82,
    lastReviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    attemptsCount: 8,
    correctCount: 7,
    consecutiveCorrect: 2,
    timeSpentSeconds: 1820,
  },
  'ai-03': {
    nodeId: 'ai-03',
    masteryState: 'IN_PROGRESS',
    masteryProbability: 0.64,
    memoryStabilityS: 1.8,
    retrievabilityR: 0.74,
    lastReviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    attemptsCount: 4,
    correctCount: 2,
    consecutiveCorrect: 1,
    timeSpentSeconds: 980,
  },
  'ai-04': {
    nodeId: 'ai-04',
    masteryState: 'AVAILABLE',
    masteryProbability: 0.15,
    memoryStabilityS: 1.0,
    retrievabilityR: 1.0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    timeSpentSeconds: 0,
  },
  'ai-05': {
    nodeId: 'ai-05',
    masteryState: 'AVAILABLE',
    masteryProbability: 0.10,
    memoryStabilityS: 1.0,
    retrievabilityR: 1.0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    timeSpentSeconds: 0,
  },
  'ai-06': {
    nodeId: 'ai-06',
    masteryState: 'LOCKED',
    masteryProbability: 0.05,
    memoryStabilityS: 1.0,
    retrievabilityR: 1.0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    timeSpentSeconds: 0,
  },
  'cloud-01': {
    nodeId: 'cloud-01',
    masteryState: 'MASTERED',
    masteryProbability: 0.89,
    memoryStabilityS: 5.0,
    retrievabilityR: 0.85,
    lastReviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    attemptsCount: 5,
    correctCount: 4,
    consecutiveCorrect: 2,
    timeSpentSeconds: 1100,
  },
  'cloud-02': {
    nodeId: 'cloud-02',
    masteryState: 'IN_PROGRESS',
    masteryProbability: 0.58,
    memoryStabilityS: 1.5,
    retrievabilityR: 0.68,
    lastReviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 3,
    correctCount: 1,
    consecutiveCorrect: 0,
    timeSpentSeconds: 750,
  },
  'cloud-03': {
    nodeId: 'cloud-03',
    masteryState: 'AVAILABLE',
    masteryProbability: 0.12,
    memoryStabilityS: 1.0,
    retrievabilityR: 1.0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    timeSpentSeconds: 0,
  },
  'cloud-04': {
    nodeId: 'cloud-04',
    masteryState: 'LOCKED',
    masteryProbability: 0.05,
    memoryStabilityS: 1.0,
    retrievabilityR: 1.0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    timeSpentSeconds: 0,
  },
  'cloud-05': {
    nodeId: 'cloud-05',
    masteryState: 'LOCKED',
    masteryProbability: 0.05,
    memoryStabilityS: 1.0,
    retrievabilityR: 1.0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    timeSpentSeconds: 0,
  },
  'dsa-01': {
    nodeId: 'dsa-01',
    masteryState: 'MASTERED',
    masteryProbability: 0.95,
    memoryStabilityS: 6.0,
    retrievabilityR: 0.91,
    lastReviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    attemptsCount: 10,
    correctCount: 9,
    consecutiveCorrect: 4,
    timeSpentSeconds: 2100,
  },
  'dsa-02': {
    nodeId: 'dsa-02',
    masteryState: 'IN_PROGRESS',
    masteryProbability: 0.72,
    memoryStabilityS: 2.2,
    retrievabilityR: 0.78,
    lastReviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    attemptsCount: 4,
    correctCount: 3,
    consecutiveCorrect: 2,
    timeSpentSeconds: 890,
  },
  'dsa-03': {
    nodeId: 'dsa-03',
    masteryState: 'AVAILABLE',
    masteryProbability: 0.15,
    memoryStabilityS: 1.0,
    retrievabilityR: 1.0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDueDate: new Date().toISOString(),
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    timeSpentSeconds: 0,
  },
};

/**
 * Computes the complete Knowledge Graph state for a specific course and student progress.
 */
export function buildKnowledgeGraph(
  courseId: string,
  progressMap: Record<string, StudentProgressData>
): KnowledgeGraphData {
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];
  const nodeIds = course.nodeIds;

  const nodes = nodeIds.map(nodeId => {
    const rawNode = KNOWLEDGE_NODES[nodeId];
    const progress = progressMap[nodeId] || {
      nodeId,
      masteryState: 'AVAILABLE' as const,
      masteryProbability: 0.1,
      memoryStabilityS: 1.0,
      retrievabilityR: 1.0,
      lastReviewedAt: new Date().toISOString(),
      nextReviewDueDate: new Date().toISOString(),
      attemptsCount: 0,
      correctCount: 0,
      consecutiveCorrect: 0,
      timeSpentSeconds: 0,
    };

    // Recalculate forgetting decay
    const retention = calculateRetention(progress.lastReviewedAt, progress.memoryStabilityS);
    let state = progress.masteryState;
    if (state === 'MASTERED' && retention.needsReview) {
      state = 'NEEDS_REVIEW';
    }

    // Check prerequisites
    const prereqsMet = rawNode.prerequisites.every(prereqId => {
      const p = progressMap[prereqId];
      return p && (p.masteryState === 'MASTERED' || p.masteryProbability >= 0.80);
    });

    if (!prereqsMet && rawNode.prerequisites.length > 0) {
      state = 'LOCKED';
    }

    const isFrontier = state === 'AVAILABLE' || state === 'IN_PROGRESS' || state === 'NEEDS_REVIEW';

    return {
      ...rawNode,
      progress: {
        ...progress,
        masteryState: state,
        retrievabilityR: retention.retrievabilityR,
      },
      isFrontier,
    };
  });

  const edges: { id: string; source: string; target: string; strength: number }[] = [];
  nodeIds.forEach(nodeId => {
    const node = KNOWLEDGE_NODES[nodeId];
    if (node) {
      node.prerequisites.forEach(prereqId => {
        if (nodeIds.includes(prereqId)) {
          edges.push({
            id: `edge-${prereqId}-${nodeId}`,
            source: prereqId,
            target: nodeId,
            strength: 1.0,
          });
        }
      });
    }
  });

  const masteredCount = nodes.filter(n => n.progress.masteryState === 'MASTERED').length;
  const inProgressCount = nodes.filter(n => n.progress.masteryState === 'IN_PROGRESS').length;
  const lockedCount = nodes.filter(n => n.progress.masteryState === 'LOCKED').length;
  const reviewCount = nodes.filter(n => n.progress.masteryState === 'NEEDS_REVIEW').length;
  const overallMasteryPercentage = Math.round(
    (nodes.reduce((acc, n) => acc + n.progress.masteryProbability, 0) / (nodes.length || 1)) * 100
  );

  return {
    nodes,
    edges,
    overallMasteryPercentage,
    masteredCount,
    inProgressCount,
    lockedCount,
    reviewCount,
  };
}

/**
 * Generates Spaced Repetition cards queue based on forgetting curve decay.
 */
export function getSpacedRepetitionQueue(
  progressMap: Record<string, StudentProgressData>
): SpacedRepetitionItem[] {
  const items: SpacedRepetitionItem[] = [];

  Object.values(progressMap).forEach(progress => {
    const node = KNOWLEDGE_NODES[progress.nodeId];
    if (!node) return;

    const retention = calculateRetention(progress.lastReviewedAt, progress.memoryStabilityS);
    const isDue = retention.retrievabilityR < 0.85;

    items.push({
      id: `sr-${node.id}`,
      nodeId: node.id,
      nodeTitle: node.title,
      frontPrompt: `Explain the core mechanism of ${node.title} and why it is critical in production architectures.`,
      backExplanation: node.content.conceptual.deepTheory,
      codeSnippet: node.content.practice.codingChallenge?.solutionCode,
      stability: progress.memoryStabilityS,
      retrievability: retention.retrievabilityR,
      dueInHours: Math.max(0, Math.round(retention.optimalNextReviewDays * 24 - retention.daysElapsed * 24)),
      isDue,
    });
  });

  // Sort by lowest retrievability first
  return items.sort((a, b) => a.retrievability - b.retrievability);
}
