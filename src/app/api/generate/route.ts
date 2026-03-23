import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, type, baseImageUrl, guidance_scale = 7.5, steps = 30, width = 1024, height = 1024 } = body;

    console.log(`[Generate] type=${type}, steps=${steps}, cfg=${guidance_scale}, has_base_image=${!!baseImageUrl}`);

    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt || "beautiful aesthetic artwork");
    
    // Build a stable Pollinations URL with the given dimensions
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

    // Return the URL directly — the frontend will use an img proxy route to display it
    return NextResponse.json({ success: true, imageUrl: `/api/proxy-image?url=${encodeURIComponent(pollinationsUrl)}`, prompt });

  } catch (error: any) {
    console.error("[Generate] Error:", error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || "Generation failed" },
      { status: 500 }
    );
  }
}
