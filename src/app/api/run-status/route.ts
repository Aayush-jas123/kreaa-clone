import { NextResponse } from 'next/server';
import { runs } from "@trigger.dev/sdk/v3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const runId = searchParams.get("runId");

  if (!runId) return NextResponse.json({ error: "Missing runId" }, { status: 400 });

  try {
    const run = await runs.retrieve(runId);
    return NextResponse.json({ 
      success: true, 
      status: run.status, 
      output: run.output,
      error: run.error
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
