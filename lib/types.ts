// ==============================================================================
// SYNAPSE AI - CORE TYPE DEFINITIONS
// ==============================================================================

export type LearningStyle = 'VISUAL' | 'CONCEPTUAL' | 'PRACTICE_HEAVY' | 'SOCRATIC';

export type NodeMasteryState = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'MASTERED' | 'NEEDS_REVIEW';

export type BloomLevel = 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';

export type QuestionDifficulty = 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface BKTParameters {
  pL0: number;       // Prior probability of initial mastery P(L_0)
  pT: number;        // Transition probability P(T)
  pS: number;        // Slip probability P(S) (Knows, but fails)
  pG: number;        // Guess probability P(G) (Doesn't know, but gets right)
}

export interface IRTParameters {
  difficultyB: number;     // Item difficulty b (-3.0 to +3.0)
  discriminationA: number; // Slope / discrimination parameter a
  guessingC: number;       // Guessing floor c (e.g. 0.25)
}

export interface KnowledgeNodeData {
  id: string;
  topicId: string;
  courseId: string;
  courseTitle: string;
  title: string;
  slug: string;
  description: string;
  bloomLevel: BloomLevel;
  estimatedMinutes: number;
  graphX: number;
  graphY: number;
  prerequisites: string[]; // array of prerequisite node IDs
  bktParams: BKTParameters;
  content: {
    visual: {
      diagramType: string;
      diagramSvg?: string;
      mermaidText?: string;
      summaryBullets: string[];
      mentalModel: string;
    };
    conceptual: {
      deepTheory: string;
      mathematicalFormula?: string;
      formulaExplanation?: string;
      keyPrinciples: string[];
      commonMisconceptions: string[];
    };
    practice: {
      codingChallenge?: {
        title: string;
        language: string;
        starterCode: string;
        solutionCode: string;
        instructions: string;
        testCases: { input: string; expected: string; explanation: string }[];
      };
      interactiveWalkthrough: string[];
    };
  };
}

export interface StudentProgressData {
  nodeId: string;
  masteryState: NodeMasteryState;
  masteryProbability: number; // 0.0 - 1.0 (BKT P(L))
  memoryStabilityS: number;   // In days
  retrievabilityR: number;    // Calculated recall probability (exp(-t/S))
  lastReviewedAt: string;
  nextReviewDueDate: string;
  attemptsCount: number;
  correctCount: number;
  consecutiveCorrect: number;
  timeSpentSeconds: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  visualHint?: string;
}

export interface QuestionData {
  id: string;
  nodeId: string;
  nodeTitle: string;
  prompt: string;
  codeSnippet?: string;
  difficulty: QuestionDifficulty;
  irt: IRTParameters;
  options: QuestionOption[];
  correctOptionId: string;
  detailedExplanation: string;
  hints: {
    level1: string; // Socratic Guiding Question
    level2: string; // Conceptual Clue
    level3: string; // Worked Example / Analogy
  };
}

export interface TutorMessageData {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  hintEscalationLevel: number; // 0: None, 1: Guiding Question, 2: Clue, 3: Analogy, 4: Full Answer
  retrievedContextIds?: string[];
  timestamp: string;
  citations?: { title: string; snippet: string; nodeId: string }[];
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  preferredStyle: LearningStyle;
  targetPaceHoursPerWk: number;
  currentStreakDays: number;
  globalAbilityTheta: number; // IRT theta
  totalXp: number;
  level: number;
  diagnosticCompleted: boolean;
  diagnosticScore?: number;
  courseEnrolled: string;
}

export interface SpacedRepetitionItem {
  id: string;
  nodeId: string;
  nodeTitle: string;
  frontPrompt: string;
  backExplanation: string;
  codeSnippet?: string;
  stability: number;
  retrievability: number;
  dueInHours: number;
  isDue: boolean;
}

export interface KnowledgeGraphData {
  nodes: (KnowledgeNodeData & {
    progress: StudentProgressData;
    isFrontier: boolean; // Next recommended node to unlock
  })[];
  edges: {
    id: string;
    source: string;
    target: string;
    strength: number;
  }[];
  overallMasteryPercentage: number;
  masteredCount: number;
  inProgressCount: number;
  lockedCount: number;
  reviewCount: number;
}
