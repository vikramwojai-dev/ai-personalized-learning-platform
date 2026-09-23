// ==============================================================================
// SYNAPSE AI - CURRICULUM & KNOWLEDGE GRAPH DATASET
// Complete multi-modal content, DAG dependencies, IRT items, BKT parameters
// ==============================================================================

import { KnowledgeNodeData, QuestionData } from './types';

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  accentColor: string;
  nodeIds: string[];
}

export const COURSES: CourseData[] = [
  {
    id: 'course-ai-ml',
    slug: 'ai-machine-learning',
    title: 'AI Systems & LLM Architectures',
    category: 'Artificial Intelligence',
    description: 'Master modern AI from foundational gradients and self-attention to pgvector RAG, Agentic orchestration, and RLHF.',
    iconName: 'BrainCircuit',
    accentColor: '#6366F1', // Indigo
    nodeIds: ['ai-01', 'ai-02', 'ai-03', 'ai-04', 'ai-05', 'ai-06'],
  },
  {
    id: 'course-cloud-dist',
    slug: 'distributed-systems',
    title: 'Distributed Systems & Cloud Architecture',
    category: 'Cloud Engineering',
    description: 'Design high-throughput, fault-tolerant platforms using Next.js App Router, PostgreSQL pgvector, Redis caches, and Raft consensus.',
    iconName: 'ServerCrash',
    accentColor: '#06B6D4', // Cyan
    nodeIds: ['cloud-01', 'cloud-02', 'cloud-03', 'cloud-04', 'cloud-05'],
  },
  {
    id: 'course-dsa',
    slug: 'advanced-algorithms',
    title: 'Algorithms, Graphs & Dynamic Programming',
    category: 'Computer Science',
    description: 'Deconstruct complex computational problems using topological DAGs, DP state transitions, sliding windows, and Trie indexes.',
    iconName: 'Network',
    accentColor: '#10B981', // Emerald
    nodeIds: ['dsa-01', 'dsa-02', 'dsa-03', 'dsa-04', 'dsa-05'],
  },
];

export const KNOWLEDGE_NODES: Record<string, KnowledgeNodeData> = {
  // -------------------------------------------------------------
  // AI & Machine Learning Course
  // -------------------------------------------------------------
  'ai-01': {
    id: 'ai-01',
    topicId: 'topic-ml-foundations',
    courseId: 'course-ai-ml',
    courseTitle: 'AI Systems & LLM Architectures',
    title: 'Linear Algebra & Vector Embeddings',
    slug: 'linear-algebra-vector-embeddings',
    description: 'Geometric intuition of dot products, cosine similarity, high-dimensional vector spaces, and semantic distance in pgvector.',
    bloomLevel: 'UNDERSTAND',
    estimatedMinutes: 20,
    graphX: 100,
    graphY: 120,
    prerequisites: [],
    bktParams: { pL0: 0.20, pT: 0.18, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Vector Space Projection',
        summaryBullets: [
          'High-dimensional embeddings project text tokens into dense continuous vector spaces (e.g., 1536 dims).',
          'Cosine similarity measures angle: cos(θ) = (A · B) / (||A|| ||B||), ranging from -1 to 1.',
          'pgvector HNSW (Hierarchical Navigable Small World) graph enables sub-millisecond approximate nearest neighbor (ANN) search.',
        ],
        mentalModel: 'Think of embedding vectors as celestial coordinates in semantic hyperspace: words with similar meanings cluster together like neighboring star systems.',
      },
      conceptual: {
        deepTheory: 'Embeddings map discrete categorical tokens into a continuous manifold ℝ^D where semantic relationships correspond to linear geometric translations. In RAG pipelines, pgvector indexes vector distances using Cosine Distance (1 - cos θ) or L2 Euclidean Distance.',
        mathematicalFormula: '\\text{Cosine Similarity}(u, v) = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum u_i^2} \\cdot \\sqrt{\\sum v_i^2}}',
        formulaExplanation: 'The numerator calculates inner dot product (directional alignment), while the denominator normalizes for magnitude, isolating semantic angle.',
        keyPrinciples: [
          'Inner product captures projection magnitude.',
          'L2 normalization makes dot product equivalent to cosine similarity.',
          'HNSW graphs trade minor recall accuracy for O(log N) lookup speed.',
        ],
        commonMisconceptions: [
          'Misconception: Higher vector dimension always yields higher accuracy. Reality: Past ~1536 dims, the curse of dimensionality increases noise and compute without proportional gain.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Implement Cosine Distance in TypeScript',
          language: 'typescript',
          starterCode: `function cosineSimilarity(vecA: number[], vecB: number[]): number {\n  // Calculate dot product and magnitudes\n  let dot = 0;\n  let magA = 0;\n  let magB = 0;\n  // Your implementation here\n  \n  return 0;\n}`,
          solutionCode: `function cosineSimilarity(vecA: number[], vecB: number[]): number {\n  let dot = 0, magA = 0, magB = 0;\n  for (let i = 0; i < vecA.length; i++) {\n    dot += vecA[i] * vecB[i];\n    magA += vecA[i] * vecA[i];\n    magB += vecB[i] * vecB[i];\n  }\n  const denom = Math.sqrt(magA) * Math.sqrt(magB);\n  return denom === 0 ? 0 : dot / denom;\n}`,
          instructions: 'Compute the cosine similarity between two equal-length numerical arrays vecA and vecB.',
          testCases: [
            { input: '[1, 0], [1, 0]', expected: '1', explanation: 'Identical vectors have maximum similarity 1.0' },
            { input: '[1, 0], [0, 1]', expected: '0', explanation: 'Orthogonal vectors have cosine similarity 0.0' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Iterate through dimensions 0 to d-1.',
          'Step 2: Accumulate dot product u_i * v_i.',
          'Step 3: Accumulate squared norms u_i^2 and v_i^2.',
          'Step 4: Divide dot product by product of square roots.',
        ],
      },
    },
  },

  'ai-02': {
    id: 'ai-02',
    topicId: 'topic-ml-foundations',
    courseId: 'course-ai-ml',
    courseTitle: 'AI Systems & LLM Architectures',
    title: 'Gradient Descent & Backpropagation',
    slug: 'gradient-descent-backpropagation',
    description: 'Chain rule optimization, loss landscapes, learning rate schedules, and Adam optimizer dynamics.',
    bloomLevel: 'APPLY',
    estimatedMinutes: 25,
    graphX: 280,
    graphY: 120,
    prerequisites: ['ai-01'],
    bktParams: { pL0: 0.15, pT: 0.16, pS: 0.09, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Loss Surface & Gradient Vectors',
        summaryBullets: [
          'Backpropagation recursively applies the multi-variable chain rule to compute ∂Loss/∂W for every weight.',
          'Gradient points in direction of steepest ascent; we step in negative direction: W ← W - η ∇L.',
          'Adam combines Exponential Moving Average (EMA) of gradients (momentum) and squared gradients (RMSProp).',
        ],
        mentalModel: 'Imagine a hiker caught in heavy fog on a mountain trying to find the valley floor by feeling the steepest downward slope beneath their feet with each step.',
      },
      conceptual: {
        deepTheory: 'Computational graphs treat neural network operations as Directed Acyclic Graphs (DAGs). During the forward pass, activations are cached; during the backward pass, adjoint values (loss derivatives) flow in reverse topology.',
        mathematicalFormula: '\\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t',
        formulaExplanation: 'Adam update rule where m_hat is bias-corrected first moment (momentum) and v_hat is second moment (adaptive scaling).',
        keyPrinciples: [
          'Vanishing/exploding gradients occur when derivative products across deep layers approach 0 or infinity.',
          'Residual connections (ResNet skips) create gradient highways ∂(x + f(x))/∂x = 1 + ∂f(x)/∂x.',
        ],
        commonMisconceptions: [
          'Misconception: Backprop is a machine learning model. Reality: Backprop is an exact analytical algorithm for computing partial derivatives in computational graphs.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Single-Variable Gradient Descent Step',
          language: 'typescript',
          starterCode: `function gradientStep(weight: number, grad: number, lr: number): number {\n  // Implement weight update\n  return weight;\n}`,
          solutionCode: `function gradientStep(weight: number, grad: number, lr: number): number {\n  return weight - lr * grad;\n}`,
          instructions: 'Compute new weight value given current weight, calculated gradient ∂L/∂w, and learning rate lr.',
          testCases: [
            { input: 'w=5.0, grad=2.0, lr=0.1', expected: '4.8', explanation: '5.0 - (0.1 * 2.0) = 4.8' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Compute loss L(y_hat, y).',
          'Step 2: Calculate local gradient dL/dw.',
          'Step 3: Update w := w - alpha * grad.',
        ],
      },
    },
  },

  'ai-03': {
    id: 'ai-03',
    topicId: 'topic-transformer-models',
    courseId: 'course-ai-ml',
    courseTitle: 'AI Systems & LLM Architectures',
    title: 'Transformer Architecture & Scaled Dot-Product Attention',
    slug: 'transformer-attention-mechanism',
    description: 'Queries, Keys, Values (Q, K, V), Multi-Head Attention, causal masking, and rotary position embeddings (RoPE).',
    bloomLevel: 'ANALYZE',
    estimatedMinutes: 30,
    graphX: 470,
    graphY: 120,
    prerequisites: ['ai-01', 'ai-02'],
    bktParams: { pL0: 0.10, pT: 0.15, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Multi-Head Attention Flow',
        summaryBullets: [
          'Attention matches Queries against Keys to generate weights, then sums Values: Attention(Q, K, V) = softmax(QK^T / √d_k) V.',
          'Scaling by √d_k prevents dot products from growing excessively large, which would push softmax into flat derivative saturation.',
          'Causal masking sets future token positions to -∞ before softmax, preventing lookahead leakage.',
        ],
        mentalModel: 'Think of Q as a search query on YouTube, K as the video title tags, and V as the actual video content. Attention calculates relevance scores between search and tags to blend the best content.',
      },
      conceptual: {
        deepTheory: 'Self-attention resolves RNN sequential bottlenecks by allowing O(1) path length between any two tokens in a sequence of length N, with O(N^2) compute complexity. Modern architectures use FlashAttention to minimize GPU SRAM memory bandwidth overhead.',
        mathematicalFormula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}} + M\\right) V',
        formulaExplanation: 'M is the attention mask matrix (-∞ for masked positions, 0 elsewhere). Softmax creates a normalized probability distribution over tokens.',
        keyPrinciples: [
          'Multi-head attention lets the model attend to information from different representation subspaces simultaneously.',
          'Key-Value (KV) caching reuses previously computed K and V matrices across autoregressive generation steps.',
        ],
        commonMisconceptions: [
          'Misconception: LLMs read tokens sequentially left to right during training. Reality: Self-attention processes all training tokens simultaneously in parallel.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Compute Scaled Attention Scores',
          language: 'typescript',
          starterCode: `function computeAttentionWeights(dotProduct: number, d_k: number): number {\n  // Scale dot product by sqrt(d_k)\n  return 0;\n}`,
          solutionCode: `function computeAttentionWeights(dotProduct: number, d_k: number): number {\n  return dotProduct / Math.sqrt(d_k);\n}`,
          instructions: 'Return the scaled score (Q · K^T) / √d_k for a given dot product and key dimension d_k.',
          testCases: [
            { input: 'dotProduct=16, d_k=64', expected: '2', explanation: '16 / sqrt(64) = 16 / 8 = 2.0' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Project inputs X with weight matrices W_q, W_k, W_v.',
          'Step 2: Multiply Q and K transpose.',
          'Step 3: Divide by sqrt(d_k).',
          'Step 4: Apply optional mask and softmax.',
          'Step 5: Multiply softmax probabilities by V.',
        ],
      },
    },
  },

  'ai-04': {
    id: 'ai-04',
    topicId: 'topic-rag-systems',
    courseId: 'course-ai-ml',
    courseTitle: 'AI Systems & LLM Architectures',
    title: 'Retrieval-Augmented Generation (RAG) & Chunking Strategies',
    slug: 'rag-chunking-vector-search',
    description: 'Document parsing, recursive character chunking, pgvector HNSW indexing, reciprocal rank fusion (RRF), and re-ranking.',
    bloomLevel: 'APPLY',
    estimatedMinutes: 25,
    graphX: 660,
    graphY: 70,
    prerequisites: ['ai-01', 'ai-03'],
    bktParams: { pL0: 0.12, pT: 0.18, pS: 0.07, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Hybrid RAG Pipeline Architecture',
        summaryBullets: [
          'Ingestion: Parse → Chunk (e.g. 512 tokens with 50-token overlap) → Embed → Store in PostgreSQL pgvector.',
          'Retrieval: Query Embedding + Full-Text Search (tsvector) → Reciprocal Rank Fusion (RRF) → Cohere Re-ranker.',
          'Generation: Inject top-k relevant context chunks with source citations into LLM system prompt.',
        ],
        mentalModel: 'RAG gives an LLM an open-book library lookup desk: instead of memorizing everything in static weights, it fetches fresh relevant textbooks right before answering.',
      },
      conceptual: {
        deepTheory: 'Standard vector search suffers from semantic drift and keyword mismatch. Advanced RAG combines dense semantic embeddings with sparse BM25 keyword matching (Hybrid Search) combined with Cross-Encoder re-ranking to maximize contextual precision.',
        mathematicalFormula: '\\text{RRF Score}(d) = \\sum_{m \\in \\text{rankers}} \\frac{1}{k + \\text{rank}_m(d)}',
        formulaExplanation: 'Reciprocal Rank Fusion merges dense vector rank and sparse keyword rank without needing normalized score calibration (standard k = 60).',
        keyPrinciples: [
          'Chunk overlap preserves context across sentence boundaries.',
          'Lost-in-the-middle phenomenon: place most relevant chunks at the very beginning and end of context window.',
        ],
        commonMisconceptions: [
          'Misconception: Larger context windows render RAG obsolete. Reality: RAG is 100x cheaper, faster, deterministic, and supports access control / continuous real-time updates.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Calculate Reciprocal Rank Fusion (RRF)',
          language: 'typescript',
          starterCode: `function calculateRRF(rankDense: number, rankSparse: number, k: number = 60): number {\n  // Formula: 1/(k + rankDense) + 1/(k + rankSparse)\n  return 0;\n}`,
          solutionCode: `function calculateRRF(rankDense: number, rankSparse: number, k: number = 60): number {\n  return (1 / (k + rankDense)) + (1 / (k + rankSparse));\n}`,
          instructions: 'Compute the hybrid RRF score combining dense and sparse rank rankings.',
          testCases: [
            { input: 'rankDense=1, rankSparse=1, k=60', expected: '0.0328', explanation: '1/61 + 1/61 = ~0.0328' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Chunk incoming document with semantic boundaries.',
          'Step 2: Generate vector embeddings for each chunk.',
          'Step 3: Query pgvector using COSINE similarity operator <=>.',
          'Step 4: Format context string and supply to LLM.',
        ],
      },
    },
  },

  'ai-05': {
    id: 'ai-05',
    topicId: 'topic-agentic-llms',
    courseId: 'course-ai-ml',
    courseTitle: 'AI Systems & LLM Architectures',
    title: 'Agentic Workflows & Socratic Hint Escalation',
    slug: 'agentic-workflows-socratic-hinting',
    description: 'ReAct loops (Reason + Act), tool calling, function schemas with Zod, and pedagogical hint escalation ladders.',
    bloomLevel: 'CREATE',
    estimatedMinutes: 30,
    graphX: 660,
    graphY: 180,
    prerequisites: ['ai-03'],
    bktParams: { pL0: 0.10, pT: 0.14, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'ReAct Agentic Loop & Hint Ladder',
        summaryBullets: [
          'ReAct Loop: Thought → Action (Tool Call) → Observation → Final Response.',
          'Socratic Hint Ladder: Level 1 (Guiding Question) → Level 2 (Conceptual Clue) → Level 3 (Worked Example) → Level 4 (Full Breakdown).',
          'Guardrails evaluate if student is passively copying or actively synthesizing.',
        ],
        mentalModel: 'A great teacher never does the push-up for you; they show you where your hands should be and ask questions that help you find your balance.',
      },
      conceptual: {
        deepTheory: 'Instead of single-shot completions, agents use state machines with structured function calling. In pedagogical systems, the agent monitors student cognitive load and calibrates response depth to stay within Vygotsky\'s Zone of Proximal Development (ZPD).',
        mathematicalFormula: '\\text{ZPD Target} = \\arg\\max_k P(\\text{Success} \\mid \\text{Hint}_k) - P(\\text{Cognitive Overload})',
        formulaExplanation: 'Maximizes student self-discovery probability while minimizing frustration and premature abandonment.',
        keyPrinciples: [
          'Structured output schemas guarantee type-safe integration with frontend state.',
          'Step-wise hint escalation builds long-term neural retention versus answer parroting.',
        ],
        commonMisconceptions: [
          'Misconception: Giving the answer immediately speeds up learning. Reality: Effortful retrieval practice is the single strongest predictor of 6-month knowledge retention.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Determine Next Socratic Escalation Level',
          language: 'typescript',
          starterCode: `function getNextHintLevel(currentLevel: number, maxLevel: number = 4): number {\n  // Increment hint level up to maxLevel\n  return currentLevel;\n}`,
          solutionCode: `function getNextHintLevel(currentLevel: number, maxLevel: number = 4): number {\n  return Math.min(maxLevel, currentLevel + 1);\n}`,
          instructions: 'Advance student from current hint level (1-4) without exceeding the max allowed escalation.',
          testCases: [
            { input: 'current=1, max=4', expected: '2', explanation: 'Level 1 escalates to Level 2' },
            { input: 'current=4, max=4', expected: '4', explanation: 'Capped at Level 4' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Detect student confusion trigger or explicit hint request.',
          'Step 2: Read current hint level from conversation state.',
          'Step 3: Select corresponding pedagogical prompt template.',
          'Step 4: Stream response with interactive follow-up question.',
        ],
      },
    },
  },

  'ai-06': {
    id: 'ai-06',
    topicId: 'topic-rlhf-alignment',
    courseId: 'course-ai-ml',
    courseTitle: 'AI Systems & LLM Architectures',
    title: 'Model Alignment: RLHF, DPO & Constitutional AI',
    slug: 'rlhf-dpo-model-alignment',
    description: 'Reward models, PPO policy optimization, Direct Preference Optimization (DPO), and automated red-teaming.',
    bloomLevel: 'EVALUATE',
    estimatedMinutes: 25,
    graphX: 860,
    graphY: 120,
    prerequisites: ['ai-04', 'ai-05'],
    bktParams: { pL0: 0.08, pT: 0.12, pS: 0.09, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'DPO vs RLHF Comparison Flow',
        summaryBullets: [
          'RLHF trains a separate Reward Model, then uses PPO to maximize score with a KL divergence penalty to avoid mode collapse.',
          'DPO directly optimizes policy weights on pair preferences (chosen vs rejected) with closed-form mathematical substitution.',
          'Constitutional AI uses self-critique rules to autonomously align models.',
        ],
        mentalModel: 'DPO is like showing an apprentice two completed wood carvings and asking "which curve looks smoother?" instead of building an elaborate robotic measuring device.',
      },
      conceptual: {
        deepTheory: 'DPO optimizes the loss: L_DPO = -E[log σ(β log(π_θ(y_w|x)/π_ref(y_w|x)) - β log(π_θ(y_l|x)/π_ref(y_l|x)))], completely bypassing the instability and memory overhead of training a separate reward model and value network.',
        mathematicalFormula: '\\mathcal{L}_{\\text{DPO}}(\\theta) = -\\mathbb{E}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right]',
        formulaExplanation: 'y_w is the winning human preference response, y_l is the losing response, and beta regulates the KL constraint with reference model.',
        keyPrinciples: [
          'KL penalty prevents reward hacking / sycophancy.',
          'DPO provides stable, single-stage gradient updates without actor-critic divergence.',
        ],
        commonMisconceptions: [
          'Misconception: Alignment makes models smarter. Reality: Alignment primarily restricts the probability distribution of outputs toward helpful, harmless, and honest trajectories.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Calculate DPO Implicit Reward',
          language: 'typescript',
          starterCode: `function calculateImplicitReward(logProbTheta: number, logProbRef: number, beta: number = 0.1): number {\n  // Formula: beta * (logProbTheta - logProbRef)\n  return 0;\n}`,
          solutionCode: `function calculateImplicitReward(logProbTheta: number, logProbRef: number, beta: number = 0.1): number {\n  return beta * (logProbTheta - logProbRef);\n}`,
          instructions: 'Compute implicit reward value under DPO formulation.',
          testCases: [
            { input: 'logProbTheta=-1.5, logProbRef=-2.5, beta=0.1', expected: '0.1', explanation: '0.1 * (-1.5 - (-2.5)) = 0.1 * 1.0 = 0.1' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Collect prompt x with preference pair (y_win, y_lose).',
          'Step 2: Forward pass through policy model and frozen reference model.',
          'Step 3: Calculate log-likelihood ratio.',
          'Step 4: Backpropagate DPO loss.',
        ],
      },
    },
  },

  // -------------------------------------------------------------
  // Distributed Systems Course
  // -------------------------------------------------------------
  'cloud-01': {
    id: 'cloud-01',
    topicId: 'topic-distributed-storage',
    courseId: 'course-cloud-dist',
    courseTitle: 'Distributed Systems & Cloud Architecture',
    title: 'PostgreSQL Internals, B-Trees & pgvector',
    slug: 'postgres-btree-pgvector',
    description: 'WAL (Write-Ahead Logging), MVCC concurrency, B-Tree index traversal, and HNSW vector index construction.',
    bloomLevel: 'UNDERSTAND',
    estimatedMinutes: 20,
    graphX: 120,
    graphY: 100,
    prerequisites: [],
    bktParams: { pL0: 0.25, pT: 0.20, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'PostgreSQL Storage Engine & MVCC',
        summaryBullets: [
          'Postgres uses MVCC: updates write a new tuple version (xmin, xmax) rather than in-place overwriting.',
          'B-Trees provide O(log N) point and range lookups by keeping leaf pages linked and balanced.',
          'HNSW (pgvector) constructs multi-layered graphs for sub-millisecond high-dimensional vector search.',
        ],
        mentalModel: 'MVCC is like taking snapshots of a document each time someone edits it, so readers never get blocked by writers.',
      },
      conceptual: {
        deepTheory: 'Write-Ahead Logging (WAL) guarantees ACID durability. Transactions append intent to sequential disk log before dirty pages are flushed from shared buffers to table heap.',
        mathematicalFormula: '\\text{B-Tree Height} \\approx \\lceil \\log_{\\text{fanout}}(N) \\rceil',
        formulaExplanation: 'With typical page size of 8KB and fanout > 300, a B-Tree indexes billions of rows in only 3 to 4 disk page hops.',
        keyPrinciples: [
          'Index scans avoid sequential heap scans when selectivity is high.',
          'Vacuuming reclaims dead tuple space generated by MVCC.',
        ],
        commonMisconceptions: [
          'Misconception: Adding an index always speeds up queries. Reality: Indexes add write amplification to INSERT/UPDATE and consume RAM buffer cache.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Calculate Approximate B-Tree Lookups',
          language: 'typescript',
          starterCode: `function getBTreeHops(numRows: number, fanout: number = 300): number {\n  return Math.ceil(Math.log(numRows) / Math.log(fanout));\n}`,
          solutionCode: `function getBTreeHops(numRows: number, fanout: number = 300): number {\n  if (numRows <= 1) return 1;\n  return Math.ceil(Math.log(numRows) / Math.log(fanout));\n}`,
          instructions: 'Compute the number of page hops needed to find a row in a balanced B-Tree.',
          testCases: [
            { input: 'numRows=1000000, fanout=100', expected: '3', explanation: 'log_100(1,000,000) = 3' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Check root node page.',
          'Step 2: Binary search node pointers.',
          'Step 3: Traverse to leaf node.',
          'Step 4: Fetch tuple TID from heap table.',
        ],
      },
    },
  },

  'cloud-02': {
    id: 'cloud-02',
    topicId: 'topic-caching-resilience',
    courseId: 'course-cloud-dist',
    courseTitle: 'Distributed Systems & Cloud Architecture',
    title: 'Redis Caching & Invalidation Patterns',
    slug: 'redis-caching-invalidation',
    description: 'Cache-aside, write-through, cache stampede prevention via probabilistic early expiration (XFetch), and Redis clusters.',
    bloomLevel: 'APPLY',
    estimatedMinutes: 25,
    graphX: 320,
    graphY: 100,
    prerequisites: ['cloud-01'],
    bktParams: { pL0: 0.18, pT: 0.17, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Cache-Aside with Stampede Guard',
        summaryBullets: [
          'Cache-Aside: App queries cache → On miss, queries DB → Writes to cache with TTL.',
          'Cache stampede occurs when high-traffic key expires and hundreds of concurrent requests crush the database simultaneously.',
          'XFetch Algorithm refreshes cache probabilistically before hard TTL expiration.',
        ],
        mentalModel: 'A cache is like a sticky note on your computer screen: fastest way to read recent info, but you need a protocol to toss it when old.',
      },
      conceptual: {
        deepTheory: 'Cache coherence in distributed setups requires event-driven invalidation (e.g. CDC via Debezium or Redis Pub/Sub). For high read/write ratio, Cache-Aside with Jittered TTL balances consistency with DB protection.',
        mathematicalFormula: '\\Delta - \\beta \\cdot \\delta \\cdot \\ln(\\text{rand}()) > \\text{TTL}',
        formulaExplanation: 'XFetch early refresh formula: Delta is compute time, beta > 0 is sensitivity, delta is elapsed time.',
        keyPrinciples: [
          'Always add TTL jitter to prevent synchronized batch expiration.',
          'Use distributed locks (Redlock) for expensive cold-start calculations.',
        ],
        commonMisconceptions: [
          'Misconception: Caching solves all database bottlenecks. Reality: Bad queries still fail on cache misses and stale reads introduce subtle data corruption.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Calculate Jittered TTL',
          language: 'typescript',
          starterCode: `function getJitteredTTL(baseSeconds: number, jitterPercent: number = 0.1): number {\n  // Add random variation between -jitterPercent and +jitterPercent\n  return baseSeconds;\n}`,
          solutionCode: `function getJitteredTTL(baseSeconds: number, jitterPercent: number = 0.1): number {\n  const delta = baseSeconds * jitterPercent * (Math.random() * 2 - 1);\n  return Math.round(baseSeconds + delta);\n}`,
          instructions: 'Generate TTL with jitter to prevent cache stampedes.',
          testCases: [
            { input: 'baseSeconds=300, jitterPercent=0.1', expected: 'between 270 and 330', explanation: '10% variation' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Check Redis GET key.',
          'Step 2: If found, return cached object immediately.',
          'Step 3: If null, query primary database.',
          'Step 4: Asynchronously write to Redis with jittered TTL.',
        ],
      },
    },
  },

  'cloud-03': {
    id: 'cloud-03',
    topicId: 'topic-distributed-consensus',
    courseId: 'course-cloud-dist',
    courseTitle: 'Distributed Systems & Cloud Architecture',
    title: 'Distributed Consensus: Raft & Paxos',
    slug: 'raft-consensus-algorithm',
    description: 'Leader election, log replication, split-brain prevention, quorum slices, and heartbeat leases.',
    bloomLevel: 'ANALYZE',
    estimatedMinutes: 30,
    graphX: 520,
    graphY: 100,
    prerequisites: ['cloud-01', 'cloud-02'],
    bktParams: { pL0: 0.12, pT: 0.14, pS: 0.09, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Raft Cluster State Machine',
        summaryBullets: [
          'Nodes exist in 3 states: Follower, Candidate, or Leader.',
          'Leader election triggers when randomized election timeout expires without leader heartbeat.',
          'Quorum rule: N/2 + 1 node confirmations required before committing a log entry.',
        ],
        mentalModel: 'A democratic board where decisions only become law when a strict majority votes yes, and an emergency chairman election is called if the current president stops calling roll.',
      },
      conceptual: {
        deepTheory: 'Raft decomposes consensus into Leader Election, Log Replication, and Safety Invariants. By enforcing Log Matching and Leader Completeness, Raft guarantees sequential consistency across cluster failures.',
        mathematicalFormula: '\\text{Quorum Size} = \\left\\lfloor \\frac{N}{2} \\right\\rfloor + 1',
        formulaExplanation: 'Any two quorums in a cluster of size N are guaranteed to overlap by at least one node, preventing split-brain states.',
        keyPrinciples: [
          'Randomized election timers prevent split votes.',
          'Logs are committed once stored on a majority of cluster nodes.',
        ],
        commonMisconceptions: [
          'Misconception: 2 nodes provide redundancy. Reality: A 2-node cluster cannot tolerate ANY node failure because quorum is 2/2 + 1 = 2.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Calculate Quorum Requirement',
          language: 'typescript',
          starterCode: `function calculateQuorum(totalNodes: number): number {\n  // Return floor(N / 2) + 1\n  return 0;\n}`,
          solutionCode: `function calculateQuorum(totalNodes: number): number {\n  return Math.floor(totalNodes / 2) + 1;\n}`,
          instructions: 'Compute majority quorum size for a distributed cluster of N nodes.',
          testCases: [
            { input: 'totalNodes=5', expected: '3', explanation: '5 nodes require 3 for quorum' },
            { input: 'totalNodes=3', expected: '2', explanation: '3 nodes require 2 for quorum' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Heartbeat timeout triggers election.',
          'Step 2: Candidate increments term and requests votes.',
          'Step 3: If majority granted, become Leader.',
          'Step 4: Replicate AppendEntries RPCs to followers.',
        ],
      },
    },
  },

  'cloud-04': {
    id: 'cloud-04',
    topicId: 'topic-event-driven',
    courseId: 'course-cloud-dist',
    courseTitle: 'Distributed Systems & Cloud Architecture',
    title: 'Event-Driven Streaming with Apache Kafka',
    slug: 'event-driven-kafka-streaming',
    description: 'Partitions, consumer groups, offset management, exactly-once semantics (EOS), and out-of-order event handling.',
    bloomLevel: 'APPLY',
    estimatedMinutes: 25,
    graphX: 720,
    graphY: 60,
    prerequisites: ['cloud-02', 'cloud-03'],
    bktParams: { pL0: 0.14, pT: 0.16, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Kafka Topic Partition & Consumer Group',
        summaryBullets: [
          'Topics are split into ordered immutable commit logs called Partitions.',
          'Partition key hashing (murmur2) ensures events for the same entity (e.g. userId) stay strictly in order.',
          'Consumer groups scale throughput by assigning one consumer per partition.',
        ],
        mentalModel: 'Think of Kafka as a multi-lane highway where each lane (partition) has cars moving in strict single file, and toll booths (consumers) each process their designated lane.',
      },
      conceptual: {
        deepTheory: 'Kafka achieves gigabytes/second throughput via OS PageCache zero-copy transfer (`sendfile` system call) and sequential disk writes. Consumer offsets are committed to an internal `__consumer_offsets` topic.',
        mathematicalFormula: '\\text{Partition Index} = \\text{Murmur2}(\\text{Key}) \\pmod{\\text{NumPartitions}}',
        formulaExplanation: 'Deterministic hashing guarantees all messages with identical keys land on the same physical partition in strict FIFO order.',
        keyPrinciples: [
          'Ordering is guaranteed ONLY within a single partition, never across partitions.',
          'Idempotent producers use sequence numbers to prevent duplicate writes on network retries.',
        ],
        commonMisconceptions: [
          'Misconception: Adding more consumers than partitions increases throughput. Reality: Excess consumers remain idle with zero assigned partitions.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Calculate Active Consumers in Group',
          language: 'typescript',
          starterCode: `function getActiveConsumers(numPartitions: number, numConsumers: number): number {\n  // At most 1 consumer per partition\n  return 0;\n}`,
          solutionCode: `function getActiveConsumers(numPartitions: number, numConsumers: number): number {\n  return Math.min(numPartitions, numConsumers);\n}`,
          instructions: 'Calculate the maximum number of consumers that can actively read in parallel.',
          testCases: [
            { input: 'numPartitions=6, numConsumers=10', expected: '6', explanation: 'Capped at 6 active; 4 will remain idle' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Producer hashes record key.',
          'Step 2: Append record to target partition log.',
          'Step 3: Consumer pulls records and updates local cursor.',
          'Step 4: Commit consumer offset.',
        ],
      },
    },
  },

  'cloud-05': {
    id: 'cloud-05',
    topicId: 'topic-distributed-transactions',
    courseId: 'course-cloud-dist',
    courseTitle: 'Distributed Systems & Cloud Architecture',
    title: 'Saga Pattern & Distributed Transactions',
    slug: 'saga-pattern-orchestration-choreography',
    description: 'Two-Phase Commit (2PC) limitations, Saga choreography vs orchestration, compensating transactions, and idempotency keys.',
    bloomLevel: 'CREATE',
    estimatedMinutes: 30,
    graphX: 720,
    graphY: 160,
    prerequisites: ['cloud-03', 'cloud-04'],
    bktParams: { pL0: 0.10, pT: 0.15, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Saga Orchestration & Compensation Flow',
        summaryBullets: [
          'Two-Phase Commit (2PC) blocks resources and causes severe latency in microservices.',
          'Sagas execute a sequence of local transactions: if step N fails, compensating transactions N-1...1 are executed in reverse to undo changes.',
          'Orchestrator centralizes workflow state machine; Choreography uses decentralized domain events.',
        ],
        mentalModel: 'Like booking a vacation: you reserve the flight, hotel, and rental car. If the car booking fails, the system automatically cancels the hotel and refunds the flight.',
      },
      conceptual: {
        deepTheory: 'Sagas achieve eventual consistency without distributed locks. Because intermediate states are visible (violating ACID isolation), compensating transactions must be semantically commutative and strictly idempotent.',
        mathematicalFormula: 'T_1 \\rightarrow T_2 \\rightarrow T_3 \\xrightarrow{\\text{Fail}} C_2 \\rightarrow C_1',
        formulaExplanation: 'Forward transactions T_i are paired with backward compensating transactions C_i to restore state invariant.',
        keyPrinciples: [
          'All compensating actions must be guaranteed to succeed (retry forever if necessary).',
          'Idempotency keys prevent double refunds during network timeouts.',
        ],
        commonMisconceptions: [
          'Misconception: Compensating transactions rollback the database like BEGIN/ROLLBACK. Reality: Compensation is a new forward transaction that logically reverses previous side effects.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Simulate Saga Rollback Chain',
          language: 'typescript',
          starterCode: `function getRollbackSteps(completedSteps: string[]): string[] {\n  // Return reverse compensating steps\n  return [];\n}`,
          solutionCode: `function getRollbackSteps(completedSteps: string[]): string[] {\n  return [...completedSteps].reverse().map(step => 'UNDO_' + step);\n}`,
          instructions: 'Generate array of compensating actions in exact reverse order of completed steps.',
          testCases: [
            { input: '["RESERVE_SEAT", "CHARGE_CARD"]', expected: '["UNDO_CHARGE_CARD", "UNDO_RESERVE_SEAT"]', explanation: 'Reverses order and applies compensation' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Execute Step 1 (Reserve Inventory).',
          'Step 2: Execute Step 2 (Process Payment).',
          'Step 3: If Step 3 (Create Shipping Label) fails, trigger compensation event.',
          'Step 4: Refund Payment and Release Inventory.',
        ],
      },
    },
  },

  // -------------------------------------------------------------
  // Data Structures & Algorithms Course
  // -------------------------------------------------------------
  'dsa-01': {
    id: 'dsa-01',
    topicId: 'topic-arrays-pointers',
    courseId: 'course-dsa',
    courseTitle: 'Algorithms, Graphs & Dynamic Programming',
    title: 'Sliding Window & Two-Pointer Techniques',
    slug: 'sliding-window-two-pointers',
    description: 'Dynamic vs fixed size sliding windows, monotonic deque optimization, and fast/slow pointer cycle detection.',
    bloomLevel: 'APPLY',
    estimatedMinutes: 20,
    graphX: 120,
    graphY: 100,
    prerequisites: [],
    bktParams: { pL0: 0.30, pT: 0.20, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Sliding Window Expansion & Contraction',
        summaryBullets: [
          'Two pointers maintain a contiguous subarray [left, right] over an input array.',
          'Expand right pointer to satisfy condition; shrink left pointer to minimize or restore invariant.',
          'Converts naive O(N^2) brute force subarrays into optimal O(N) linear scans.',
        ],
        mentalModel: 'Like a caterpillar inching along a leaf: stretching its head forward to find food, then pulling its tail forward to stay compact.',
      },
      conceptual: {
        deepTheory: 'The sliding window invariant ensures both pointers move strictly forward from 0 to N-1. Since each element is visited at most twice (once by right, once by left), the amortized time complexity is strictly O(N).',
        mathematicalFormula: 'T(N) = \\sum_{i=1}^N (\\text{cost of right}) + \\sum_{j=1}^N (\\text{cost of left}) = \\mathcal{O}(N)',
        formulaExplanation: 'Amortized linear time complexity guaranteed by monotonic pointer advancement.',
        keyPrinciples: [
          'Fixed window: keep right - left + 1 == K constant.',
          'Dynamic window: expand until invalid, contract until valid again.',
        ],
        commonMisconceptions: [
          'Misconception: A while loop inside a for loop means O(N^2) complexity. Reality: If the inner loop only increments a pointer that never resets, it is O(N) amortized.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Maximum Sum Subarray of Size K',
          language: 'typescript',
          starterCode: `function maxSumSubarray(arr: number[], k: number): number {\n  let maxSum = 0;\n  let windowSum = 0;\n  // Compute initial window and slide\n  return maxSum;\n}`,
          solutionCode: `function maxSumSubarray(arr: number[], k: number): number {\n  if (arr.length < k) return 0;\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  let maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}`,
          instructions: 'Find the maximum sum of any contiguous subarray of size k.',
          testCases: [
            { input: 'arr=[2, 1, 5, 1, 3, 2], k=3', expected: '9', explanation: 'Subarray [5, 1, 3] gives sum 9' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Calculate sum of first K elements.',
          'Step 2: Loop from index K to N-1.',
          'Step 3: Add incoming element, subtract outgoing element.',
          'Step 4: Update max sum seen so far.',
        ],
      },
    },
  },

  'dsa-02': {
    id: 'dsa-02',
    topicId: 'topic-graphs',
    courseId: 'course-dsa',
    courseTitle: 'Algorithms, Graphs & Dynamic Programming',
    title: 'Topological Sort & DAG Cycle Detection',
    slug: 'topological-sort-kahn-algorithm',
    description: 'In-degree calculation, Kahn\'s algorithm with BFS queue, Tarjan\'s DFS with 3-color cycle detection.',
    bloomLevel: 'ANALYZE',
    estimatedMinutes: 25,
    graphX: 340,
    graphY: 100,
    prerequisites: ['dsa-01'],
    bktParams: { pL0: 0.18, pT: 0.17, pS: 0.08, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'Dependency Graph Topological Ordering',
        summaryBullets: [
          'Topological sort linearly orders vertices such that for every directed edge u → v, vertex u comes before v.',
          'Kahn\'s Algorithm: Track in-degrees → Push 0 in-degree nodes into queue → Process and decrement neighbor in-degrees.',
          'If processed node count < Total nodes, the graph contains a cyclic dependency!',
        ],
        mentalModel: 'Like scheduling college course prerequisites: you cannot take Machine Learning (v) until you complete Calculus and Linear Algebra (u).',
      },
      conceptual: {
        deepTheory: 'Topological sorting is only possible on Directed Acyclic Graphs (DAGs). It forms the foundational engine for build systems (Makefile, Turborepo), package managers (npm, pip), and curriculum dependency graphs.',
        mathematicalFormula: '\\forall (u, v) \\in E, \\quad \\text{pos}(u) < \\text{pos}(v)',
        formulaExplanation: 'Definition of topological order: every prerequisite u appears strictly before dependent v.',
        keyPrinciples: [
          'Nodes with in-degree 0 have all prerequisites satisfied.',
          'Time Complexity is strictly O(V + E) using adjacency lists.',
        ],
        commonMisconceptions: [
          'Misconception: Topological order is always unique. Reality: A DAG can have dozens of valid topological orderings if multiple nodes have in-degree 0 concurrently.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Calculate In-Degrees for Directed Graph',
          language: 'typescript',
          starterCode: `function getInDegrees(numNodes: number, edges: [number, number][]): number[] {\n  const inDegrees = new Array(numNodes).fill(0);\n  // Edge is [u, v] meaning u -> v\n  return inDegrees;\n}`,
          solutionCode: `function getInDegrees(numNodes: number, edges: [number, number][]): number[] {\n  const inDegrees = new Array(numNodes).fill(0);\n  for (const [, v] of edges) {\n    inDegrees[v]++;\n  }\n  return inDegrees;\n}`,
          instructions: 'Compute in-degree array for vertices 0 to numNodes-1.',
          testCases: [
            { input: 'numNodes=3, edges=[[0, 1], [0, 2], [1, 2]]', expected: '[0, 1, 2]', explanation: 'Node 0 has 0 in-edges, Node 1 has 1, Node 2 has 2' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Build in-degree map for all vertices.',
          'Step 2: Enqueue all nodes with in-degree = 0.',
          'Step 3: Pop node, append to output list, decrement neighbor in-degrees.',
          'Step 4: If neighbor in-degree becomes 0, enqueue it.',
        ],
      },
    },
  },

  'dsa-03': {
    id: 'dsa-03',
    topicId: 'topic-dynamic-programming',
    courseId: 'course-dsa',
    courseTitle: 'Algorithms, Graphs & Dynamic Programming',
    title: 'Dynamic Programming: State Space & Memoization',
    slug: 'dynamic-programming-state-transitions',
    description: 'Optimal substructure, overlapping subproblems, top-down memoization vs bottom-up tabulation, and space optimization.',
    bloomLevel: 'CREATE',
    estimatedMinutes: 30,
    graphX: 560,
    graphY: 100,
    prerequisites: ['dsa-02'],
    bktParams: { pL0: 0.12, pT: 0.15, pS: 0.09, pG: 0.20 },
    content: {
      visual: {
        diagramType: 'DP Recursion Tree vs Memoized DAG',
        summaryBullets: [
          'DP applies when problems exhibit Optimal Substructure and Overlapping Subproblems.',
          'Top-down with Memoization caches subproblem outputs in a hash map to prune exponential branches to polynomial time.',
          'Bottom-up Tabulation computes states sequentially from base cases to final target.',
        ],
        mentalModel: 'Writing down 1 + 1 + 1 + 1 = 4 on a piece of paper. If someone adds another "+ 1", you don\'t recount from scratch; you just add 1 to your remembered 4.',
      },
      conceptual: {
        deepTheory: 'Dynamic Programming reduces problem complexity by transforming a tree-like recursion space with O(2^N) state evaluations into a DAG of unique state parameters with O(N · K) states.',
        mathematicalFormula: 'DP(state) = \\min_{action} \\left\\{ \\text{Cost}(state, action) + DP(\\text{NextState}(state, action)) \\right\\}',
        formulaExplanation: 'Bellman Equation expressing optimal value as immediate cost plus expected future subproblem value.',
        keyPrinciples: [
          'Identify the minimal state variables that fully capture history.',
          'Check if previous state rows can be rolled over to optimize O(N^2) space to O(N).',
        ],
        commonMisconceptions: [
          'Misconception: Memorizing DP solutions is required. Reality: DP is a systematic 4-step framework: Define State → Find Recurrence → Define Base Cases → Order Computation.',
        ],
      },
      practice: {
        codingChallenge: {
          title: 'Climbing Stairs with 1 or 2 Steps',
          language: 'typescript',
          starterCode: `function climbStairs(n: number): number {\n  // Ways to reach step n taking 1 or 2 steps\n  return 0;\n}`,
          solutionCode: `function climbStairs(n: number): number {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}`,
          instructions: 'Compute number of distinct ways to climb n stairs.',
          testCases: [
            { input: 'n=3', expected: '3', explanation: '1+1+1, 1+2, 2+1' },
            { input: 'n=4', expected: '5', explanation: '5 distinct step combinations' },
          ],
        },
        interactiveWalkthrough: [
          'Step 1: Base cases dp[1]=1, dp[2]=2.',
          'Step 2: Recurrence dp[i] = dp[i-1] + dp[i-2].',
          'Step 3: Track only 2 previous variables for O(1) space.',
        ],
      },
    },
  },
};

// ------------------------------------------------------------------------------
// ADAPTIVE QUESTIONS DATASET (Calibrated for IRT & BKT)
// ------------------------------------------------------------------------------

export const QUESTION_POOL: QuestionData[] = [
  // Question for ai-01
  {
    id: 'q-ai-01-1',
    nodeId: 'ai-01',
    nodeTitle: 'Linear Algebra & Vector Embeddings',
    prompt: 'Two normalized unit embedding vectors u and v have a dot product of 0.0. What is their cosine similarity and geometric orientation?',
    difficulty: 'NOVICE',
    irt: { difficultyB: -1.2, discriminationA: 1.4, guessingC: 0.25 },
    options: [
      { id: 'opt-a', text: 'Cosine similarity is 0.0; they are orthogonal (perpendicular at 90°)', isCorrect: true, explanation: 'For unit vectors, dot product equals cosine similarity. Dot product of 0 means cos(90°) = 0, indicating zero linear correlation / orthogonality.' },
      { id: 'opt-b', text: 'Cosine similarity is 1.0; they are parallel pointing in same direction', isCorrect: false, explanation: 'Parallel vectors have a dot product of 1.0, not 0.0.' },
      { id: 'opt-c', text: 'Cosine similarity is -1.0; they are diametrically opposite', isCorrect: false, explanation: 'Opposite vectors have a dot product of -1.0.' },
      { id: 'opt-d', text: 'Cosine similarity cannot be determined without vector dimensions', isCorrect: false, explanation: 'Since vectors are normalized unit vectors, dot product is directly equal to cosine similarity regardless of dimension.' },
    ],
    correctOptionId: 'opt-a',
    detailedExplanation: 'When vectors are normalized to unit length (||u|| = 1, ||v|| = 1), cosine similarity cos(θ) = (u · v) / (1 * 1) = u · v. A dot product of 0 corresponds to θ = 90°, meaning the vectors are completely orthogonal and share no directional semantic component.',
    hints: {
      level1: 'What is the definition of cosine similarity in terms of dot product and vector magnitudes?',
      level2: 'For unit vectors, magnitude is 1. What angle corresponds to cos(θ) = 0?',
      level3: 'cos(90°) = 0. Perpendicular vectors have zero semantic projection on each other.',
    },
  },

  // Question for ai-02
  {
    id: 'q-ai-02-1',
    nodeId: 'ai-02',
    nodeTitle: 'Gradient Descent & Backpropagation',
    prompt: 'During training of a deep feedforward network, gradients in the earliest layers become exponentially smaller with each backprop step. What is this phenomenon and what architectural innovation directly resolves it?',
    difficulty: 'INTERMEDIATE',
    irt: { difficultyB: 0.2, discriminationA: 1.6, guessingC: 0.25 },
    options: [
      { id: 'opt-a', text: 'Gradient saturation; resolved by increasing batch size to 4096', isCorrect: false, explanation: 'Batch size does not prevent exponential decay of chained derivative products.' },
      { id: 'opt-b', text: 'Vanishing gradient problem; resolved by Residual Skip Connections (x + F(x)) and Layer Normalization', isCorrect: true, explanation: 'Skip connections add an identity gradient path ∂(x + F(x))/∂x = 1 + ∂F(x)/∂x, preventing gradients from vanishing to zero.' },
      { id: 'opt-c', text: 'Exploding gradient problem; resolved by removing activation functions', isCorrect: false, explanation: 'Removing activations collapses deep networks into linear models.' },
      { id: 'opt-d', text: 'Catastrophic forgetting; resolved by Dropout regularization', isCorrect: false, explanation: 'Catastrophic forgetting relates to sequential task training, not gradient decay.' },
    ],
    correctOptionId: 'opt-b',
    detailedExplanation: 'The vanishing gradient problem occurs when multiplying multiple partial derivatives < 1 via the chain rule across dozens of layers. Residual skip connections create a direct gradient highway with an additive derivative term (+1), allowing gradients to propagate back to the earliest layers unimpeded.',
    hints: {
      level1: 'What happens when you multiply numbers less than 1 (like sigmoid derivatives) 50 times in a row?',
      level2: 'How does ResNet\'s identity shortcut F(x) + x affect the derivative with respect to x?',
      level3: 'd/dx (x + F(x)) = 1 + F\'(x). The "+1" guarantees gradient can never vanish below 1.',
    },
  },

  // Question for ai-03
  {
    id: 'q-ai-03-1',
    nodeId: 'ai-03',
    nodeTitle: 'Transformer Architecture & Scaled Dot-Product Attention',
    prompt: 'In Scaled Dot-Product Attention, why is the inner dot product QK^T divided by the scaling factor √d_k before applying the softmax function?',
    difficulty: 'INTERMEDIATE',
    irt: { difficultyB: 0.5, discriminationA: 1.8, guessingC: 0.25 },
    options: [
      { id: 'opt-a', text: 'To reduce the matrix dimension so it fits into GPU memory', isCorrect: false, explanation: 'Dividing by a scalar does not alter matrix dimensions.' },
      { id: 'opt-b', text: 'To prevent large dot products from pushing softmax into regions with extremely small gradients', isCorrect: true, explanation: 'For large d_k, dot products grow large in magnitude, causing softmax to yield near 1.0 or 0.0 with near-zero gradients (saturation).' },
      { id: 'opt-c', text: 'To convert negative values into positive values', isCorrect: false, explanation: 'Scalar division preserves signs; softmax exponentiation handles positivity.' },
      { id: 'opt-d', text: 'To ensure queries and keys have identical vocabulary embeddings', isCorrect: false, explanation: 'Q and K already share embedding dimensions.' },
    ],
    correctOptionId: 'opt-b',
    detailedExplanation: 'Under the assumption that components of q and k are independent random variables with mean 0 and variance 1, their dot product has mean 0 and variance d_k. For large values of d_k, dot products grow large, pushing the softmax function into regions where its derivative is nearly 0 (gradient saturation). Scaling by 1/√d_k normalizes the variance back to 1.',
    hints: {
      level1: 'Consider what the derivative of the softmax function looks like when its input values are extremely large (e.g. 500 vs 0.1).',
      level2: 'When softmax outputs near 1.0 and 0.0, what happens to backpropagation gradients?',
      level3: 'The variance of sum(q_i * k_i) is d_k. Dividing by √d_k pulls variance back to 1.0 to prevent softmax saturation.',
    },
  },

  // Question for ai-04
  {
    id: 'q-ai-04-1',
    nodeId: 'ai-04',
    nodeTitle: 'Retrieval-Augmented Generation (RAG) & Chunking Strategies',
    prompt: 'When building a production RAG system with PostgreSQL pgvector, why is Hybrid Search (combining vector HNSW with full-text BM25 via Reciprocal Rank Fusion) superior to pure vector search alone?',
    difficulty: 'ADVANCED',
    irt: { difficultyB: 1.4, discriminationA: 1.9, guessingC: 0.25 },
    options: [
      { id: 'opt-a', text: 'Hybrid search completely eliminates the need to generate vector embeddings', isCorrect: false, explanation: 'Hybrid search still computes and utilizes vector embeddings for the semantic branch.' },
      { id: 'opt-b', text: 'Vector search handles conceptual semantics but struggles with exact alphanumeric keywords (e.g., product IDs, acronyms, error codes), which BM25 excels at', isCorrect: true, explanation: 'Dense embeddings often blur specific token strings like "CVE-2024-3094" into general security embeddings; BM25 ensures exact string hits.' },
      { id: 'opt-c', text: 'BM25 allows pgvector to bypass the PostgreSQL WAL log entirely', isCorrect: false, explanation: 'PostgreSQL storage engines and WAL apply uniformly across index types.' },
      { id: 'opt-d', text: 'Reciprocal Rank Fusion reduces the token count of the prompt sent to the LLM', isCorrect: false, explanation: 'RRF merges rank lists; prompt token count depends on the top-k chunk sizes selected.' },
    ],
    correctOptionId: 'opt-b',
    detailedExplanation: 'Dense vector embeddings represent fuzzy semantic concepts well ("how to fix memory leak") but perform poorly on exact literal keyword queries, error codes, part numbers, or rare acronyms. Hybrid search combines the semantic generalization of vector ANN search with the precise lexical matching of BM25/tsvector, using RRF to merge results into a balanced rank list.',
    hints: {
      level1: 'If a user searches for an exact part serial number "SKU-99482-X", will cosine similarity of embeddings reliably rank it first?',
      level2: 'What are the distinct strengths of dense semantic search versus sparse keyword search?',
      level3: 'Dense = Conceptual match ("car" ~ "automobile"). Sparse = Exact token match ("RFC 7519"). Hybrid = Best of both.',
    },
  },

  // Question for cloud-01
  {
    id: 'q-cloud-01-1',
    nodeId: 'cloud-01',
    nodeTitle: 'PostgreSQL Internals, B-Trees & pgvector',
    prompt: 'How does PostgreSQL\'s Multi-Version Concurrency Control (MVCC) ensure that read transactions do not block write transactions?',
    difficulty: 'INTERMEDIATE',
    irt: { difficultyB: 0.4, discriminationA: 1.5, guessingC: 0.25 },
    options: [
      { id: 'opt-a', text: 'By locking the entire table in memory while reads execute', isCorrect: false, explanation: 'Table-level locking would block writes, the exact opposite of MVCC.' },
      { id: 'opt-b', text: 'By appending new tuple versions with transaction IDs (xmin, xmax) instead of overwriting data in-place, allowing readers to view a consistent snapshot', isCorrect: true, explanation: 'Readers evaluate tuple visibility against their transaction snapshot without acquiring exclusive row locks.' },
      { id: 'opt-c', text: 'By routing all read queries to a Redis cache automatically', isCorrect: false, explanation: 'PostgreSQL does not include an automatic built-in Redis cache proxy.' },
      { id: 'opt-d', text: 'By using single-threaded synchronous disk flushes', isCorrect: false, explanation: 'PostgreSQL uses multi-process architecture with asynchronous shared buffer management.' },
    ],
    correctOptionId: 'opt-b',
    detailedExplanation: 'Under MVCC, every row (tuple) contains header metadata including `xmin` (the creating transaction ID) and `xmax` (the deleting/updating transaction ID). When a row is updated, PostgreSQL writes a new row version rather than modifying the existing tuple in place. Readers view a point-in-time snapshot of committed tuples where xmin <= snapshot and (xmax > snapshot or xmax is null), eliminating the need for shared read locks.',
    hints: {
      level1: 'What happens to the old row on disk when you run an UPDATE query in PostgreSQL?',
      level2: 'What do the system columns xmin and xmax represent in Postgres tuple headers?',
      level3: 'Updates insert a new version of the row. Readers see the old version until the new transaction commits.',
    },
  },

  // Question for cloud-03
  {
    id: 'q-cloud-03-1',
    nodeId: 'cloud-03',
    nodeTitle: 'Distributed Consensus: Raft & Paxos',
    prompt: 'In a Raft distributed cluster of 5 nodes, how many node failures can the cluster tolerate while still maintaining consensus and committing new log entries?',
    difficulty: 'INTERMEDIATE',
    irt: { difficultyB: 0.3, discriminationA: 1.6, guessingC: 0.25 },
    options: [
      { id: 'opt-a', text: '1 node failure', isCorrect: false, explanation: 'With 1 failure, 4 nodes remain, which easily satisfies quorum.' },
      { id: 'opt-b', text: '2 node failures', isCorrect: true, explanation: 'Quorum for 5 nodes is floor(5/2) + 1 = 3 nodes. If 2 fail, 3 remain online, maintaining quorum.' },
      { id: 'opt-c', text: '3 node failures', isCorrect: false, explanation: 'If 3 nodes fail, only 2 remain online, which is less than the required quorum of 3.' },
      { id: 'opt-d', text: '4 node failures', isCorrect: false, explanation: 'With 4 failures, only 1 node remains.' },
    ],
    correctOptionId: 'opt-b',
    detailedExplanation: 'For a cluster of N nodes, Raft requires a strict majority quorum of floor(N / 2) + 1 nodes to elect a leader and commit log entries. For N = 5, the required quorum is floor(5/2) + 1 = 3 nodes. Therefore, the cluster can tolerate up to 5 - 3 = 2 node failures while remaining operational.',
    hints: {
      level1: 'What is the formula for calculating majority quorum in a cluster of size N?',
      level2: 'Quorum = floor(N / 2) + 1. For N = 5, what is this value?',
      level3: '5 / 2 = 2.5 → floor is 2 → +1 = 3. Since 3 nodes must be alive, 5 - 3 = 2 can fail.',
    },
  },

  // Question for dsa-02
  {
    id: 'q-dsa-02-1',
    nodeId: 'dsa-02',
    nodeTitle: 'Topological Sort & DAG Cycle Detection',
    prompt: 'When executing Kahn\'s algorithm (BFS with in-degree queue) on a directed graph with V vertices, the algorithm terminates with only V - 2 nodes added to the output order. What does this indicate?',
    difficulty: 'INTERMEDIATE',
    irt: { difficultyB: 0.1, discriminationA: 1.5, guessingC: 0.25 },
    options: [
      { id: 'opt-a', text: 'The graph is a valid tree with multiple root nodes', isCorrect: false, explanation: 'Valid trees are DAGs and will process all V vertices.' },
      { id: 'opt-b', text: 'The graph contains at least one cycle involving the 2 unprocessed nodes', isCorrect: true, explanation: 'Nodes in a cycle have cyclic prerequisite dependencies where in-degrees never reach 0, preventing them from entering the queue.' },
      { id: 'opt-c', text: 'The graph has disconnected isolated vertices', isCorrect: false, explanation: 'Isolated vertices have in-degree 0 and are processed immediately at the start.' },
      { id: 'opt-d', text: 'The graph is bipartite', isCorrect: false, explanation: 'Bipartite property is unrelated to directed cycles.' },
    ],
    correctOptionId: 'opt-b',
    detailedExplanation: 'In Kahn\'s algorithm, only nodes with an in-degree of 0 are enqueued and processed. In a directed cycle (e.g., A → B → A), every node in the cycle has at least one prerequisite dependency that cannot be satisfied first. Consequently, their in-degrees never reach 0, leaving them unprocessed. If the final output count is less than V, a cycle exists.',
    hints: {
      level1: 'What condition is required for a node to be pushed into the BFS queue in Kahn\'s algorithm?',
      level2: 'If node A depends on B, and B depends on A, can either ever reach an in-degree of 0?',
      level3: 'Nodes in a dependency cycle never reach in-degree 0. Thus, unprocessed count < V proves the existence of a cycle.',
    },
  },
];
