import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, type, baseImageUrl, guidance_scale = 7.5, steps = 30, width = 1024, height = 1024 } = body;

    console.log(`[Generate] type=${type}, steps=${steps}, cfg=${guidance_scale}, has_base_image=${!!baseImageUrl}`);

    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt || "beautiful aesthetic artwork");
    const pollinationsUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

    // Actually fetch & verify the image from Pollinations so it's ready when we return
    const imageResponse = await fetch(pollinationsUrl, {
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!imageResponse.ok) {
      throw new Error(`Pollinations returned ${imageResponse.status}`);
    }

    // Convert to base64 so the browser can display it immediately without a second fetch
    const buffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const imageUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ success: true, imageUrl, prompt });
  } catch (error: any) {
    console.error("[Generate] Error:", error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || "Generation failed" },
      { status: 500 }
    );
  }
}
