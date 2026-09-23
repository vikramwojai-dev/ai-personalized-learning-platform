// ==============================================================================
// POST /api/ai-tutor
// Socratic AI Tutor with RAG Context Injection & Hint Escalation
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { generateTutorResponse } from '@/lib/ai-tutor-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      nodeId,
      hintLevel = 1,
      learningStyle = 'VISUAL',
      history = [],
      apiKey,
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const tutorResult = await generateTutorResponse({
      message,
      nodeId,
      hintLevel,
      learningStyle,
      history,
      apiKey,
    });

    return NextResponse.json({
      status: 'success',
      ...tutorResult,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI tutor request', details: String(error) },
      { status: 500 }
    );
  }
}
