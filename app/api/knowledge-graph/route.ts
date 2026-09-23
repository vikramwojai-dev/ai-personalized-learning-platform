// ==============================================================================
// GET/POST /api/knowledge-graph
// Retrieves or updates dynamic knowledge graph DAG and student mastery frontier
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { buildKnowledgeGraph, INITIAL_PROGRESS } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId') || 'course-ai-ml';

  const graph = buildKnowledgeGraph(courseId, INITIAL_PROGRESS);

  return NextResponse.json({
    courseId,
    graph,
    status: 'success',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId = 'course-ai-ml', progressOverrides = {} } = body;

    const mergedProgress = {
      ...INITIAL_PROGRESS,
      ...progressOverrides,
    };

    const graph = buildKnowledgeGraph(courseId, mergedProgress);

    return NextResponse.json({
      courseId,
      graph,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process knowledge graph request', details: String(error) },
      { status: 500 }
    );
  }
}
