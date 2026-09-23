# SynapseAI — Production AI-Powered Personalized Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL_pgvector-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Live_Production-black?style=flat&logo=vercel)](https://ai-personalized-learning-platform-vikramwojai.vercel.app)

> **Live Production URL:** [https://ai-personalized-learning-platform-vikramwojai.vercel.app](https://ai-personalized-learning-platform-vikramwojai.vercel.app)  
> **GitHub Repository:** [https://github.com/vikramwojai-dev/ai-personalized-learning-platform](https://github.com/vikramwojai-dev/ai-personalized-learning-platform)

---

## 🌟 Platform Vision & Core Capabilities

**SynapseAI** is a cognitive-science-driven adaptive learning platform that customizes educational content, practice quizzes, and curriculum progression to each student's unique learning speed, knowledge gaps, and preferred modality (**Visual**, **Conceptual**, **Practice-Heavy**, or **Socratic**).

### 1. 🗺️ Dynamic Knowledge Graph & Curriculum Map (DAG)
- Interactive Directed Acyclic Graph (DAG) visualizing dependencies, topic prerequisites, and active learning frontiers.
- Real-time mastery state transitions (**Mastered**, **In Progress**, **Needs Review**, **Available**, **Locked**).
- Dynamic zoom, pan, filtering, and multi-modal topic drawers.

### 2. ⚡ Adaptive Quiz & Task Engine (IRT 3PL & BKT)
- **Computerized Adaptive Testing (CAT):** Selects questions using **Maximum Fisher Information** matching student latent ability $\theta$.
- **Corbett & Anderson's Bayesian Knowledge Tracing (BKT):** Updates posterior mastery probabilities $P(L_{t+1}|obs)$ with slip ($P(S)$) and guess ($P(G)$) modeling.
- Real-time Socratic hint ladder during quiz taking to build retention instead of rote memorization.

### 3. 🤖 Socratic AI Tutor & Interactive Mentor
- **RAG-Enabled Mentorship:** Retrieves relevant context chunks from the knowledge graph with source citations.
- **Socratic Hint Escalation Ladder:** Level 1 (Guiding Question) $\rightarrow$ Level 2 (Conceptual Clue) $\rightarrow$ Level 3 (Worked Analogy) $\rightarrow$ Level 4 (Full Step Breakdown).
- Modality-adaptive explanations that shift seamlessly between visual mental models, formal mathematical proofs, and executable TypeScript code.

### 4. 📊 Analytics & Retention Engine (Ebbinghaus Forgetting Curve & SM-2)
- **Continuous Decay Forecasting:** Models memory retrievability $R(t) = e^{-t/S}$ over a 14-day timeline.
- **Active Recall Spaced Repetition:** Flashcard deck with dynamic memory stability $S$ recalculations.
- **Cognitive Load & Velocity Tracking:** Weekly study minutes, domain radar knowledge matrix, and streak counters.

---

## 🏗️ System Architecture & Data Flow

```
+-------------------------------------------------------------------------------+
|                             CLIENT / PRESENTATION                             |
|    Next.js 14+ (App Router) • React 19 • Tailwind CSS • Framer Motion        |
|    • Interactive SVG DAG Visualizer    • Adaptive Quiz Arena & IRT Gauge      |
|    • Socratic AI Chat Interface       • Ebbinghaus Forgetting Curve (Recharts)|
+---------------------------------------+---------------------------------------+
                                        | (HTTPS / REST / JSON)
                                        v
+-------------------------------------------------------------------------------+
|                           EDGE & ENGINE LAYER                                 |
|                       Next.js App Router API Routes                           |
|    • /api/knowledge-graph             • /api/diagnostic                       |
|    • /api/adaptive-quiz/generate      • /api/adaptive-quiz/submit             |
|    • /api/ai-tutor (Socratic RAG)     • /api/analytics                        |
|                                                                               |
|                     [ Learning Science Algorithms ]                           |
|    • Bayesian Knowledge Tracing (BKT) • Item Response Theory (3PL CAT)        |
|    • Ebbinghaus Forgetting Curve      • Reciprocal Rank Fusion (RRF)          |
+-------------------+---------------------------------------+-------------------+
                    |                                       |
                    v                                       v
+---------------------------------------+   +-----------------------------------+
|          PERSISTENCE LAYER            |   |          AI / LLM LAYER           |
|      PostgreSQL + pgvector            |   |   OpenAI / Anthropic / Local      |
|  • Prisma ORM Type-Safe Schema        |   |   • Socratic Prompt Templates     |
|  • HNSW Vector Embeddings Index       |   |   • Hint Escalation State Machine |
|  • Telemetry Audit Logs (BKT/IRT)     |   |   • Zod Structured Outputs        |
+---------------------------------------+   +-----------------------------------+
```

---

## 📐 Database Schema (Prisma)

The production schema is located at `prisma/schema.prisma` and includes:
- **`User` & `LearningProfile`**: Tracks user identity, role, preferred learning style, latent ability $\theta$, XP, and level.
- **`Course`, `Topic`, `KnowledgeNode` & `KnowledgePrerequisite`**: Encodes the Directed Acyclic Graph (DAG) with prerequisites and multi-modal content.
- **`ContentEmbedding`**: Stores pgvector embeddings for RAG vector search.
- **`StudentNodeProgress` & `MasteryHistory`**: Stores BKT posterior probabilities $P(L)$, memory stability $S$, and retrievability $R$.
- **`Question` & `QuizAttempt`**: Stores 3PL IRT parameters ($b, a, c$), hint ladders, and attempt telemetry.
- **`TutorSession` & `TutorMessage`**: Multi-turn chat sessions with hint escalation tracking.
- **`SpacedRepetitionCard`**: SM-2 / FSRS spaced repetition flashcards.

---

## 🔬 Mathematical Formulations

### 1. Bayesian Knowledge Tracing (BKT)
$$P(L_t \mid \text{Correct}) = \frac{P(L_t)(1 - P(S))}{P(L_t)(1 - P(S)) + (1 - P(L_t))P(G)}$$
$$P(L_{t+1}) = P(L_t \mid \text{obs}) + (1 - P(L_t \mid \text{obs})) \cdot P(T)$$

### 2. Item Response Theory (IRT 3PL Model)
$$P(\theta) = c + \frac{1 - c}{1 + e^{-a(\theta - b)}}$$
$$I(\theta) = \frac{a^2 (P(\theta) - c)^2 (1 - P(\theta))}{(1 - c)^2 P(\theta)}$$

### 3. Ebbinghaus Forgetting Curve
$$R(t) = \exp\left(-\frac{t}{S}\right)$$
$$\text{Optimal Review Interval: } t_{\text{opt}} = -S \cdot \ln(0.85)$$

---

## 🚀 Quickstart & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/vikramwojai-dev/ai-personalized-learning-platform.git
cd ai-personalized-learning-platform

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for local mock mode)
cp .env.example .env

# 4. Run database migrations (optional if using PostgreSQL)
npx prisma generate

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Phased Implementation Roadmap

- [x] **Phase 1: MVP Architecture** — Prisma schema, interactive DAG canvas, baseline diagnostic placement, and BKT calculation.
- [x] **Phase 2: Adaptive Intelligence** — IRT 3PL question engine, Socratic hint escalation, and Ebbinghaus retention forecasts.
- [x] **Phase 3: Production Scale** — pgvector hybrid RAG, Vercel deployment automation, and Stripe subscription billing.
- [ ] **Phase 4: Global Enterprise** — Canvas/Blackboard LTI 1.3 Advantage and edge-cached personalized curriculum compilation.

---

## 📄 License

MIT © 2026 SynapseAI
