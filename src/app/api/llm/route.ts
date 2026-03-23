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
    
    // Try gemini-2.0-flash first, fallback to older models
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
    });

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 2048 },
    });

    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${prompt}` 
      : prompt;

    const result = await chat.sendMessage(fullPrompt);
    const text = result.response.text();

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    console.error("[LLM] Error:", error?.message || error);
    
    // Provide helpful error message if model not found
    if (error?.message?.includes('404') || error?.message?.includes('not found')) {
      return NextResponse.json({ 
        success: false, 
        error: "Model not available. Check your Gemini API key has access to Gemini 2.0 Flash." 
      }, { status: 500 });
    }
    
    return NextResponse.json({ success: false, error: error?.message || "LLM request failed" }, { status: 500 });
  }
}
