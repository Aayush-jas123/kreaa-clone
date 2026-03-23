import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const RequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  systemPrompt: z.string().optional().default("You are a helpful creative AI assistant."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const { prompt, systemPrompt } = parsed.data;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "Missing GEMINI_API_KEY in .env.local" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    console.error("[LLM] Error:", error?.message || error);
    return NextResponse.json({ success: false, error: error?.message || "LLM request failed" }, { status: 500 });
  }
}
