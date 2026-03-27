import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { tasks } from '@trigger.dev/sdk/v3';
import { hasCredits, deductCredits, getCurrentUserId } from '@/lib/user';
import prisma from '@/lib/prisma';

const RequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  systemPrompt: z.string().optional().default("You are a helpful creative AI assistant."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Credit Check
    if (!await hasCredits(1)) {
      return NextResponse.json({ success: false, error: 'Insufficient credits' }, { status: 403 });
    }
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const { prompt, systemPrompt } = parsed.data;

    let runId;
    let fallbackText = "";

    try {
      const handle = await tasks.trigger("generate-text", { prompt, systemPrompt });
      runId = handle.id;
    } catch (triggerError) {
      console.warn("Trigger.dev missing or failed, falling back to sync:", triggerError);
      
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ success: false, error: "Missing GEMINI_API_KEY in .env.local" }, { status: 400 });
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const modelsToTry = [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash",
        "gemini-pro"
      ];

      let result = null;
      let lastError = null;
      
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt;

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const chat = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 2048 },
          });
          result = await chat.sendMessage(fullPrompt);
          break;
        } catch (err: any) {
          lastError = err;
        }
      }

      if (!result) {
        throw lastError || new Error("All fallback models failed");
      }
      fallbackText = result.response.text();
    }

    if (runId) {
      await deductCredits(1);
      return NextResponse.json({ success: true, runId, isAsync: true });
    } else {
      await deductCredits(1);
      
      // Save to history (non-blocking)
      const userId = await getCurrentUserId();
      if (userId && fallbackText) {
        prisma.generation.create({
          data: {
            userId,
            prompt,
            imageUrl: fallbackText, // Store text in imageUrl for now
            type: 'text',
          },
        }).catch((dbErr: any) => console.warn('[LLM] History save failed:', dbErr));
      }

      return NextResponse.json({ success: true, text: fallbackText, isAsync: false });
    }
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
