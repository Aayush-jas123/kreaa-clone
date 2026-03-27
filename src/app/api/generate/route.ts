import { NextResponse } from 'next/server';
import { tasks } from '@trigger.dev/sdk/v3';
import { hasCredits, deductCredits, getCurrentUserId } from '@/lib/user';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, type, baseImageUrl, guidance_scale = 7.5, steps = 30, width = 1024, height = 1024 } = body;

    // Credit Check
    if (!await hasCredits(1)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Insufficient credits',
        code: 'INSUFFICIENT_CREDITS'
      }, { status: 403 });
    }

    console.log(`[Generate] type=${type}, steps=${steps}, cfg=${guidance_scale}, has_base_image=${!!baseImageUrl}`);

    const seed = Math.floor(Math.random() * 1000000);
    let fallbackPrompt = prompt || "beautiful aesthetic artwork";
    
    // Enhancer Logic: Augment prompt with high-quality tokens
    if (type === 'enhancer') {
      fallbackPrompt = `HD, masterpiece, highly detailed, 8k resolution, cinematic lighting, sharp focus, ${fallbackPrompt}`;
    }
    
    let runId;
    let fallbackImageUrl = "";

    try {
      const handle = await tasks.trigger("generate-image", { prompt: fallbackPrompt, width, height, seed });
      runId = handle.id;
    } catch (triggerError) {
      console.warn("Trigger.dev missing/failed, falling back to sync:", triggerError);
      const encodedPrompt = encodeURIComponent(fallbackPrompt);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;
      fallbackImageUrl = `/api/proxy-image?url=${encodeURIComponent(pollinationsUrl)}`;
    }

    await deductCredits(1);

    // Save generation to history (best effort, non-blocking)
    if (!runId && fallbackImageUrl) {
      const userId = await getCurrentUserId();
      if (userId) {
        prisma.generation.create({
          data: { userId, prompt: fallbackPrompt, imageUrl: fallbackImageUrl, type: 'image' },
        }).catch((err: any) => console.warn('[Generate] Failed to save generation:', err));
      }
    }

    if (runId) {
      return NextResponse.json({ success: true, runId, isAsync: true, prompt: fallbackPrompt });
    } else {
      return NextResponse.json({ success: true, imageUrl: fallbackImageUrl, isAsync: false, prompt: fallbackPrompt });
    }

  } catch (error: any) {
    console.error("[Generate] Error:", error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || "Generation failed" },
      { status: 500 }
    );
  }
}
