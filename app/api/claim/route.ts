/**
 * STUB — Local development stub for POST /api/claim.
 * Returns { success: true, message: "stub" } after a 1.5s delay.
 * Replace with the real implementation when Anirudha's backend is ready.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate that imageBase64 is present
    if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid imageBase64 field' },
        { status: 400 }
      );
    }

    // Simulate backend processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(
      { success: true, message: 'stub' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
