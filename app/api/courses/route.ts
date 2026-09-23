// ==============================================================================
// GET /api/courses
// Returns all available courses and curriculum tracks
// ==============================================================================

import { NextResponse } from 'next/server';
import { COURSES } from '@/lib/curriculum-data';

export async function GET() {
  return NextResponse.json({
    courses: COURSES,
    status: 'success',
  });
}
