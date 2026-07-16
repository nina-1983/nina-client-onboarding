import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Just return success for now — ignore Notion
    return NextResponse.json({
      ok: true,
      message: "Form received",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
