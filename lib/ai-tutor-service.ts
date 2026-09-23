// ==============================================================================
// SYNAPSE AI - SOCRATIC AI TUTOR & INTERACTIVE MENTOR ENGINE
// RAG Context Retrieval + Socratic Hint Escalation + Learning Style Adaptation
// ==============================================================================

import { LearningStyle, TutorMessageData } from './types';
import { KNOWLEDGE_NODES } from './curriculum-data';

export interface TutorRequest {
  message: string;
  nodeId?: string;
  hintLevel?: number; // 0 (normal), 1 (question), 2 (clue), 3 (analogy), 4 (solution)
  learningStyle?: LearningStyle;
  history?: { role: 'user' | 'assistant'; content: string }[];
  apiKey?: string;
}

export interface TutorResponse {
  message: string;
  hintLevel: number;
  citations: { title: string; snippet: string; nodeId: string }[];
  suggestedFollowUps: string[];
}

/**
 * Generates an intelligent pedagogical response adhering to Socratic methodology.
 */
export async function generateTutorResponse(req: TutorRequest): Promise<TutorResponse> {
  const { message, nodeId, hintLevel = 1, learningStyle = 'VISUAL', history = [] } = req;
  const activeNode = nodeId ? KNOWLEDGE_NODES[nodeId] : undefined;

  const citations: { title: string; snippet: string; nodeId: string }[] = [];
  if (activeNode) {
    citations.push({
      title: activeNode.title,
      snippet: activeNode.content.conceptual.deepTheory.slice(0, 160) + '...',
      nodeId: activeNode.id,
    });
  }

  // Socratic Response Templates tailored to learning style and hint level
  const userQueryLower = message.toLowerCase();

  let responseText = '';
  let nextHintLevel = hintLevel;
  let suggestedFollowUps: string[] = [];

  // Check if student is directly asking for an answer or hint
  const isAskingForAnswer = userQueryLower.includes('give me the answer') ||
    userQueryLower.includes('just tell me') ||
    userQueryLower.includes('what is the answer') ||
    userQueryLower.includes('solution');

  const isAskingForHint = userQueryLower.includes('hint') ||
    userQueryLower.includes('stuck') ||
    userQueryLower.includes('help me') ||
    userQueryLower.includes('dont know') ||
    userQueryLower.includes("don't know");

  if (isAskingForAnswer && hintLevel < 3) {
    responseText = `I understand you want the final answer right away! However, cognitive science shows that when you discover the connection yourself, retention improves by over 300%.\n\nLet's take a small step together first: **What is the fundamental goal or invariant we are trying to preserve here?**`;
    suggestedFollowUps = [
      'Give me a Level 2 Conceptual Clue',
      'Explain using a simple analogy',
      'Show starter code',
    ];
  } else if (activeNode) {
    // Contextual response based on active node and learning style
    if (activeNode.id === 'ai-01') {
      if (hintLevel === 1) {
        if (learningStyle === 'VISUAL') {
          responseText = `### 🧭 Socratic Hint (Level 1: Guiding Question)\n\nThink about two arrows on a 2D sheet of graph paper starting from the origin $(0,0)$:\n\n\`\`\`\n  y ▲  Vector B [0, 1]\n    │   │\n    │   ▼  (90° Angle)\n    └────────► Vector A [1, 0]\n             x\n\`\`\`\n\nIf Vector A points entirely along the X-axis and Vector B points purely along the Y-axis, how much "shadow" (projection) does Vector A cast onto Vector B? What does this tell you about their dot product?`;
        } else if (learningStyle === 'CONCEPTUAL') {
          responseText = `### 📐 Socratic Hint (Level 1: First Principles)\n\nRecall the geometric definition of the inner product:\n$$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos(\\theta)$$\n\nIf the vectors are normalized unit vectors (so $\\|\\mathbf{u}\\| = \\|\\mathbf{v}\\| = 1$) and their dot product is $0$, what must the value of $\\cos(\\theta)$ be? What angle $\\theta$ produces that cosine?`;
        } else {
          responseText = `### 💻 Socratic Hint (Level 1: Code Trace)\n\nLet's trace what happens in our dot product loop:\n\`\`\`typescript\nconst vecA = [1, 0];\nconst vecB = [0, 1];\n// Index 0: 1 * 0 = 0\n// Index 1: 0 * 1 = 0\n// Total Sum = 0\n\`\`\`\nWhat does a sum of $0$ imply about directional alignment between these two coordinates?`;
        }
        suggestedFollowUps = [
          'They are at 90 degrees (orthogonal)!',
          'Explain why cosine of 90 is 0',
          'How does this apply to pgvector HNSW search?',
        ];
      } else if (hintLevel === 2) {
        responseText = `### 💡 Socratic Hint (Level 2: Conceptual Clue)\n\nIn high-dimensional embeddings (like OpenAI text-embedding-3 or pgvector embeddings):\n- **Dot Product = 1.0**: Identical direction (synonymous meaning).\n- **Dot Product = 0.0**: Completely orthogonal / independent (zero mutual semantic information).\n- **Dot Product = -1.0**: Opposite polarity.\n\nSince both vectors have length 1 and dot product 0, the angle between them is exactly **90 degrees (orthogonal)**.`;
        suggestedFollowUps = [
          'Show me a 3D visualization example',
          'Why do we normalize vectors in pgvector?',
          'Generate an adaptive quiz question on this',
        ];
      } else {
        responseText = `### 🎯 Socratic Explanation (Full Synthesis)\n\n**Exact Solution & Proof:**\nFor unit vectors $\\|\\mathbf{u}\\| = 1$ and $\\|\\mathbf{v}\\| = 1$:\n$$\\text{Cosine Similarity} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|} = \\frac{0}{1 \\cdot 1} = 0.0$$\n\nBecause $\\cos(\\theta) = 0 \\implies \\theta = 90^\\circ$ (or $\\frac{\\pi}{2}$ radians).\n\nIn vector search, orthogonal embeddings indicate that the two text snippets share **no overlapping semantic projection** in that embedding subspace.`;
        suggestedFollowUps = [
          'Test my knowledge with an adaptive quiz',
          'Move to Next Topic: Gradient Descent',
          'Open code challenge sandbox',
        ];
      }
    } else if (activeNode.id === 'ai-03') {
      if (hintLevel === 1) {
        responseText = `### ⚡ Socratic Hint (Level 1: Scaled Attention)\n\nConsider what happens when you sum $d_k$ independent random numbers each with variance $1$:\n- The variance of the sum is $d_k$.\n- The standard deviation is $\\sqrt{d_k}$.\n\nIf $d_k = 1024$, the dot products will frequently reach magnitudes like $+50$ or $-50$.\n\nWhat happens to the derivative $\\frac{\\partial \\text{softmax}(z)}{\\partial z}$ when $z = 50$? Does gradient backpropagation still work effectively?`;
        suggestedFollowUps = [
          'Softmax saturates to 1 or 0 and gradients vanish!',
          'Why does dividing by sqrt(d_k) fix this?',
          'Show the attention matrix formula',
        ];
      } else {
        responseText = `### 🧠 Scaled Dot-Product Attention Breakdown\n\n**The Problem (Softmax Gradient Saturation):**\nWhen key dimension $d_k$ is large, $Q K^T$ produces extreme values. The softmax curve flattens out, causing gradients $\\frac{\\partial L}{\\partial Q}$ to vanish to zero.\n\n**The Solution:**\nDividing by $\\sqrt{d_k}$ normalizes the variance of the dot product back to $1.0$, keeping the softmax inputs in the steep, responsive linear region where gradients flow smoothly during backpropagation!`;
        suggestedFollowUps = [
          'Explain Multi-Head Attention',
          'What is Causal Masking?',
          'Practice coding attention in TypeScript',
        ];
      }
    } else {
      // General Node explanation
      responseText = `### 🧑‍🏫 Socratic Guidance for **${activeNode.title}**\n\nLet's analyze your question through **${learningStyle.toLowerCase()}** modality:\n\n**Core Insight:**\n${activeNode.content.conceptual.deepTheory}\n\n**Guiding Question for You:**\nHow does this mechanism prevent system failure or improve computational efficiency under heavy production workloads?`;
      suggestedFollowUps = [
        'Explain step-by-step',
        'Show an architectural diagram',
        'Give me a practice quiz question',
      ];
    }
  } else {
    // General Tutor Query
    responseText = `Hello Alex! I am your AI Socratic Tutor. I'm calibrated to your **${learningStyle}** learning profile.\n\nI won't just dump raw code or rote answers on you — I will guide you with structured mental models, interactive code walkthroughs, and step-by-step hints so you truly master the underlying systems.\n\nWhich topic or concept would you like to explore or debug today?`;
    suggestedFollowUps = [
      'Explain Vector Embeddings & Cosine Distance',
      'How does PostgreSQL MVCC prevent read locks?',
      'Why does Raft require a majority quorum?',
      'Start an Adaptive Practice Quiz',
    ];
  }

  return {
    message: responseText,
    hintLevel: nextHintLevel,
    citations,
    suggestedFollowUps,
  };
}
