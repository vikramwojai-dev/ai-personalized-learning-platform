'use client';

import React, { useState } from 'react';
import {
  Layers,
  Database,
  Cpu,
  Network,
  GitBranch,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  Server,
  Zap,
  BookOpen,
  ArrowRight,
  Terminal,
  Activity,
  Boxes,
  Lock,
  Workflow
} from 'lucide-react';

export function ArchitectureDocs() {
  const [activeSection, setActiveSection] = useState<'system-diagram' | 'prisma-schema' | 'api-routes' | 'algorithms' | 'roadmap'>('system-diagram');
  const [copiedPrisma, setCopiedPrisma] = useState(false);

  const prismaSchemaCode = `// ==============================================================================
// SYNAPSE AI - PRODUCTION PRISMA SCHEMA
// Architecture: Next.js App Router + PostgreSQL + pgvector + Clerk/NextAuth
// ==============================================================================

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

enum Role { STUDENT, INSTRUCTOR, ADMIN }
enum LearningStyle { VISUAL, CONCEPTUAL, PRACTICE_HEAVY, SOCRATIC }
enum NodeMasteryState { LOCKED, AVAILABLE, IN_PROGRESS, MASTERED, NEEDS_REVIEW }
enum BloomTaxonomyLevel { REMEMBER, UNDERSTAND, APPLY, ANALYZE, EVALUATE, CREATE }
enum QuestionDifficulty { NOVICE, INTERMEDIATE, ADVANCED, EXPERT }

model User {
  id              String                @id @default(cuid())
  email           String                @unique
  name            String?
  role            Role                  @default(STUDENT)
  learningProfile LearningProfile?
  enrollments     CourseEnrollment[]
  nodeProgress    StudentNodeProgress[]
  quizAttempts    QuizAttempt[]
  assessmentLogs  AssessmentLog[]
  tutorSessions   TutorSession[]
  createdAt       DateTime              @default(now())
  updatedAt       DateTime              @updatedAt
}

model LearningProfile {
  id                   String        @id @default(cuid())
  userId               String        @unique
  user                 User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  preferredStyle       LearningStyle @default(VISUAL)
  globalAbilityTheta   Float         @default(0.0) // IRT theta [-3.0, +3.0]
  totalXp              Int           @default(0)
  level                Int           @default(1)
  currentStreakDays    Int           @default(0)
  diagnosticCompleted  Boolean       @default(false)
  diagnosticScore      Float?
}

model KnowledgeNode {
  id                  String             @id @default(cuid())
  topicId             String
  title               String
  slug                String
  description         String             @db.Text
  bloomLevel          BloomTaxonomyLevel @default(UNDERSTAND)
  graphX              Float              @default(0)
  graphY              Float              @default(0)
  bktPriorL0          Float              @default(0.10)
  bktTransitionT      Float              @default(0.15)
  bktSlipS            Float              @default(0.10)
  bktGuessG           Float              @default(0.20)
  prerequisites       KnowledgePrerequisite[] @relation("Prerequisites")
  dependents          KnowledgePrerequisite[] @relation("Dependents")
  contentEmbeddings   ContentEmbedding[]
  studentProgress     StudentNodeProgress[]
  questions           Question[]
}

model StudentNodeProgress {
  id                  String           @id @default(cuid())
  userId              String
  user                User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  nodeId              String
  node                KnowledgeNode    @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  masteryState        NodeMasteryState @default(AVAILABLE)
  masteryProbability  Float            @default(0.10) // BKT P(L)
  memoryStabilityS    Float            @default(1.0)  // Ebbinghaus stability (days)
  retrievabilityR     Float            @default(1.0)  // R = exp(-t/S)
  lastReviewedAt      DateTime         @default(now())
  nextReviewDueDate   DateTime         @default(now())
  consecutiveCorrect  Int              @default(0)
  @@unique([userId, nodeId])
}

model Question {
  id                  String             @id @default(cuid())
  nodeId              String
  node                KnowledgeNode      @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  difficulty          QuestionDifficulty @default(INTERMEDIATE)
  irtDifficultyB      Float              @default(0.0)
  irtDiscriminationA  Float              @default(1.0)
  irtGuessingC        Float              @default(0.25)
  prompt              String             @db.Text
  options             Json
  correctOptionId     String
  detailedExplanation String             @db.Text
  hintLevel1          String             @db.Text
  hintLevel2          String             @db.Text
  hintLevel3          String             @db.Text
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prismaSchemaCode);
    setCopiedPrisma(true);
    setTimeout(() => setCopiedPrisma(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              System Architecture & Engineering Specification
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Production-Grade AI Learning Architecture with BKT, IRT & pgvector RAG
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/80">
          {[
            { id: 'system-diagram', label: '1. Architecture & Data Flow', icon: Workflow },
            { id: 'prisma-schema', label: '2. Prisma Database Schema', icon: Database },
            { id: 'api-routes', label: '3. API Route Specifications', icon: Server },
            { id: 'algorithms', label: '4. Mathematical Formulations', icon: Cpu },
            { id: 'roadmap', label: '5. Implementation Roadmap', icon: GitBranch },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  activeSection === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: ARCHITECTURE & DATA FLOW */}
      {activeSection === 'system-diagram' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-indigo-400" />
              <span>High-Level System Design & Component Architecture</span>
            </h2>

            {/* Architecture Flow ASCII / Grid Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Layer 1: Client & Presentation */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 text-sm">Frontend Layer</span>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">Next.js 14+</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-xs">
                  <li><strong>App Router & React Server Components (RSC)</strong></li>
                  <li><strong>Dynamic SVG Knowledge DAG Canvas</strong> (Mastery state & prerequisites)</li>
                  <li><strong>Adaptive Quiz Engine</strong> (Real-time IRT item selection)</li>
                  <li><strong>Socratic Chat Interface</strong> (Hint escalation ladder)</li>
                  <li><strong>Analytics Radar & Area Charts</strong> (Ebbinghaus retention)</li>
                </ul>
              </div>

              {/* Layer 2: API & Orchestration */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 text-sm">Edge & Engine Layer</span>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">TypeScript API</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-xs">
                  <li><strong>Bayesian Knowledge Tracing (BKT) Engine</strong></li>
                  <li><strong>Item Response Theory (IRT 3PL) CAT Engine</strong></li>
                  <li><strong>Ebbinghaus / FSRS Spaced Repetition</strong></li>
                  <li><strong>Socratic Prompt Orchestration & Guardrails</strong></li>
                  <li><strong>Zod Structured JSON Output Validation</strong></li>
                </ul>
              </div>

              {/* Layer 3: Persistence & AI */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-sm">Database & AI Layer</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">PostgreSQL + pgvector</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-xs">
                  <li><strong>PostgreSQL</strong> (ACID users, progress, logs)</li>
                  <li><strong>pgvector HNSW Indexes</strong> (RAG semantic chunks)</li>
                  <li><strong>Prisma ORM</strong> (Type-safe migrations & queries)</li>
                  <li><strong>OpenAI / Anthropic LLM API</strong> (Socratic completions)</li>
                  <li><strong>Stripe & Clerk Auth</strong> (Payments & identity)</li>
                </ul>
              </div>

            </div>

            {/* End-to-End Data Flow Sequence */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200">
                End-to-End Dynamic Learning Loop:
              </h3>
              
              <div className="space-y-3 text-xs text-slate-300 font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                  <span className="text-indigo-400 font-bold">1.</span>
                  <div>
                    <strong>Onboarding & Baseline Diagnostic:</strong> Student takes placement quiz. Backend calculates initial latent ability $\theta$ and initializes node priors $P(L_0)$.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                  <span className="text-indigo-400 font-bold">2.</span>
                  <div>
                    <strong>Curriculum Frontier Selection:</strong> DAG evaluator computes topological prerequisites. Available frontier nodes illuminate on the interactive map.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                  <span className="text-indigo-400 font-bold">3.</span>
                  <div>
                    <strong>Adaptive IRT Calibration:</strong> Adaptive quiz engine queries question pool using Maximum Fisher Information $I(\theta)$ matching student capability.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                  <span className="text-indigo-400 font-bold">4.</span>
                  <div>
                    <strong>Bayesian Posterior Update:</strong> Upon submission, BKT formula updates $P(L_{t+1}|obs)$. If $P(L) \ge 0.85$, the node transitions to MASTERED, unlocking dependent nodes.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                  <span className="text-indigo-400 font-bold">5.</span>
                  <div>
                    <strong>Forgetting Curve Retention Scheduling:</strong> Background scheduler monitors $R = \exp(-t/S)$. When retrievability dips below 70%, the node is flagged for Spaced Repetition review.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 2: PRISMA DATABASE SCHEMA */}
      {activeSection === 'prisma-schema' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>Production Prisma Schema (PostgreSQL + pgvector)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Located at <code className="text-indigo-400 font-mono">prisma/schema.prisma</code>
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors"
              >
                {copiedPrisma ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrisma ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 overflow-x-auto max-h-[500px]">
              {prismaSchemaCode}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 3: CORE API ROUTES */}
      {activeSection === 'api-routes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Production API Endpoints & Request/Response Contracts</span>
            </h2>

            <div className="space-y-4 text-xs">
              
              {/* Endpoint 1 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                  <span className="text-slate-200 font-semibold">/api/knowledge-graph?courseId=:id</span>
                </div>
                <p className="text-slate-400">
                  Returns all DAG nodes, prerequisite dependency edges, active learner progress, and topological frontier status.
                </p>
              </div>

              {/* Endpoint 2 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">POST</span>
                  <span className="text-slate-200 font-semibold">/api/diagnostic</span>
                </div>
                <p className="text-slate-400">
                  Processes onboarding placement exam. Computes initial student ability $\theta$, initializes Bayesian Knowledge Tracing priors, and recommends initial entry nodes.
                </p>
              </div>

              {/* Endpoint 3 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">POST</span>
                  <span className="text-slate-200 font-semibold">/api/adaptive-quiz/generate</span>
                </div>
                <p className="text-slate-400">
                  Generates the next question by calculating Fisher Information $I(\theta)$ across candidate items to maximize information gain.
                </p>
              </div>

              {/* Endpoint 4 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">POST</span>
                  <span className="text-slate-200 font-semibold">/api/adaptive-quiz/submit</span>
                </div>
                <p className="text-slate-400">
                  Evaluates response, updates BKT posterior $P(L_{t+1}|obs)$, updates IRT ability $\theta$, and writes telemetry to `AssessmentLog`.
                </p>
              </div>

              {/* Endpoint 5 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">POST</span>
                  <span className="text-slate-200 font-semibold">/api/ai-tutor</span>
                </div>
                <p className="text-slate-400">
                  Socratic chat endpoint with pgvector RAG context injection, hint escalation ladders (Levels 1-4), and learning style adaptation.
                </p>
              </div>

              {/* Endpoint 6 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                  <span className="text-slate-200 font-semibold">/api/analytics</span>
                </div>
                <p className="text-slate-400">
                  Computes 14-day Ebbinghaus forgetting curve decay projections, spaced repetition queue, and weekly learning velocity.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MATHEMATICAL FORMULATIONS */}
      {activeSection === 'algorithms' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>Learning Science Algorithms & Mathematical Foundations</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Formula 1: BKT */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-bold text-indigo-400 text-sm">1. Bayesian Knowledge Tracing (BKT)</h3>
                <p className="text-slate-300">
                  Standard Corbett & Anderson model updating belief of latent mastery given binary observations:
                </p>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-indigo-300 text-[11px] overflow-x-auto">
                  P(L_t | Correct) = [ P(L_t)(1 - S) ] / [ P(L_t)(1 - S) + (1 - P(L_t))G ]
                  <br/><br/>
                  P(L_t | Incorrect) = [ P(L_t)S ] / [ P(L_t)S + (1 - P(L_t))(1 - G) ]
                  <br/><br/>
                  P(L_{'{t+1}'}) = P(L_t|obs) + (1 - P(L_t|obs)) * T
                </div>
                <p className="text-[11px] text-slate-400">
                  Parameters: P(L_0) = Prior, T = Transition, S = Slip, G = Guess.
                </p>
              </div>

              {/* Formula 2: IRT 3PL */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-bold text-cyan-400 text-sm">2. Item Response Theory (3PL IRT)</h3>
                <p className="text-slate-300">
                  Computerized Adaptive Testing (CAT) probability function:
                </p>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-cyan-300 text-[11px] overflow-x-auto">
                  P(\theta) = c + (1 - c) / [ 1 + exp(-a * (\theta - b)) ]
                  <br/><br/>
                  Fisher Information:
                  <br/>
                  I(\theta) = [ a^2 * (P - c)^2 * (1 - P) ] / [ (1 - c)^2 * P ]
                </div>
                <p className="text-[11px] text-slate-400">
                  Parameters: \theta = Student ability, b = Difficulty, a = Discrimination, c = Pseudo-guessing.
                </p>
              </div>

              {/* Formula 3: Ebbinghaus Forgetting */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-bold text-emerald-400 text-sm">3. Ebbinghaus Forgetting Curve & FSRS</h3>
                <p className="text-slate-300">
                  Calculates continuous retrievability decay over elapsed days t:
                </p>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-emerald-300 text-[11px] overflow-x-auto">
                  R(t) = exp( -t / S )
                  <br/><br/>
                  Optimal Review Interval:
                  <br/>
                  t_{'{opt}'} = -S * ln(0.85)
                </div>
                <p className="text-[11px] text-slate-400">
                  Triggers spaced repetition alert when retrievability R falls below 0.70.
                </p>
              </div>

              {/* Formula 4: Hybrid RAG Search */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-bold text-amber-400 text-sm">4. Reciprocal Rank Fusion (RRF)</h3>
                <p className="text-slate-300">
                  Merges pgvector HNSW dense rankings with BM25 sparse keyword hits:
                </p>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-amber-300 text-[11px] overflow-x-auto">
                  RRF(d) = \sum_{'{m \\in rankers}'} 1 / (60 + rank_m(d))
                </div>
                <p className="text-[11px] text-slate-400">
                  Provides robust search resilience against obscure tokens and vocabulary mismatch.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: IMPLEMENTATION ROADMAP */}
      {activeSection === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <span>Phased Engineering Implementation Strategy</span>
            </h2>

            <div className="space-y-4 text-xs">
              
              {/* Phase 1 */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 text-sm">Phase 1: Minimum Viable Product (MVP)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">Completed</span>
                </div>
                <ul className="space-y-1 text-slate-300 pl-4 list-disc">
                  <li>Prisma schema definition with User, Node, Progress, and Question models.</li>
                  <li>Interactive Directed Acyclic Graph (DAG) visualizer with prerequisite propagation.</li>
                  <li>Initial diagnostic placement assessment establishing baseline ability.</li>
                  <li>Core Bayesian Knowledge Tracing (BKT) update algorithms.</li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 text-sm">Phase 2: Alpha Adaptive Intelligence</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">Production Ready</span>
                </div>
                <ul className="space-y-1 text-slate-300 pl-4 list-disc">
                  <li>Computerized Adaptive Testing (CAT) with 3-Parameter Logistic IRT model.</li>
                  <li>Socratic AI Tutor with 4-stage hint escalation ladders.</li>
                  <li>Ebbinghaus forgetting curve retention forecasting and spaced repetition review cards.</li>
                  <li>Multi-modal content delivery (Visual, Conceptual, Hands-on Practice).</li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400 text-sm">Phase 3: Production Scale & Enterprise Integrations</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">In Progress</span>
                </div>
                <ul className="space-y-1 text-slate-300 pl-4 list-disc">
                  <li>PostgreSQL pgvector HNSW vector indexing for real-time document embedding RAG.</li>
                  <li>Stripe billing webhook pipelines for monthly/annual student tiers.</li>
                  <li>Clerk / NextAuth multi-tenant SSO authentication.</li>
                  <li>Automated telemetry streaming to ClickHouse / OpenTelemetry for learning analytics.</li>
                </ul>
              </div>

              {/* Phase 4 */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-sm">Phase 4: Global Scale & LTI 1.3 LMS Protocols</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-semibold">Roadmap</span>
                </div>
                <ul className="space-y-1 text-slate-300 pl-4 list-disc">
                  <li>Canvas, Blackboard, and Moodle LTI 1.3 Advantage integration.</li>
                  <li>Edge-cached personalized curriculum compilation on Cloudflare Workers / Vercel Edge.</li>
                  <li>Real-time collaborative peer study rooms with synchronized Socratic AI mediator.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
